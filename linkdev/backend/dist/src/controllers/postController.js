import { pool } from '../config/database.js';
import { createError, asyncHandler } from '../middleware/errorHandler.js';
const convertPostFromDb = (dbPost) => ({
    id: dbPost.id,
    content: dbPost.content,
    authorId: dbPost.author_id,
    imageUrl: dbPost.image_url,
    likesCount: dbPost.likes_count,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
});
const convertCommentFromDb = (dbComment) => ({
    id: dbComment.id,
    content: dbComment.content,
    authorId: dbComment.author_id,
    postId: dbComment.post_id,
    createdAt: dbComment.created_at,
    updatedAt: dbComment.updated_at,
});
export const getPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    // Count total posts
    const countResult = await pool.query('SELECT COUNT(*) FROM posts');
    const total = parseInt(countResult.rows[0].count);
    // Get posts with author info and like status
    let likesQuery = 'false as is_liked';
    const queryParams = [limit, offset];
    if (req.user) {
        likesQuery = `CASE WHEN pl.user_id IS NOT NULL THEN true ELSE false END as is_liked`;
    }
    const result = await pool.query(`SELECT p.*, 
            u.first_name, u.last_name, u.profile_picture, u.headline,
            ${likesQuery}
     FROM posts p
     JOIN users u ON p.author_id = u.id
     ${req.user ? 'LEFT JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = $3' : ''}
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`, req.user ? [...queryParams, req.user.id] : queryParams);
    const posts = result.rows.map(post => ({
        ...convertPostFromDb(post),
        author: {
            id: post.author_id,
            firstName: post.first_name,
            lastName: post.last_name,
            profilePicture: post.profile_picture,
            headline: post.headline,
        },
        likes: post.likes_count,
        isLiked: post.is_liked,
    }));
    const totalPages = Math.ceil(total / Number(limit));
    res.json({
        success: true,
        data: {
            posts,
            total,
            totalPages,
            currentPage: Number(page),
        },
    });
});
export const createPost = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        throw createError(400, 'Post content is required');
    }
    let imageUrl = null;
    if (req.file) {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`
            : `${req.protocol}://${req.get('host')}`;
        imageUrl = `${baseUrl}/uploads/post-images/${req.file.filename}`;
    }
    const result = await pool.query(`INSERT INTO posts (content, author_id, image_url) 
     VALUES ($1, $2, $3) 
     RETURNING *`, [content.trim(), req.user.id, imageUrl]);
    const post = convertPostFromDb(result.rows[0]);
    res.status(201).json({
        success: true,
        data: post,
        message: 'Post created successfully',
    });
});
export const updatePost = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { postId } = req.params;
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        throw createError(400, 'Post content is required');
    }
    // Check if post exists and user owns it
    const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
        throw createError(404, 'Post not found');
    }
    const post = postResult.rows[0];
    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
        throw createError(403, 'You can only update your own posts');
    }
    const result = await pool.query('UPDATE posts SET content = $1 WHERE id = $2 RETURNING *', [content.trim(), postId]);
    const updatedPost = convertPostFromDb(result.rows[0]);
    res.json({
        success: true,
        data: updatedPost,
        message: 'Post updated successfully',
    });
});
export const deletePost = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { postId } = req.params;
    // Check if post exists and user owns it
    const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
        throw createError(404, 'Post not found');
    }
    const post = postResult.rows[0];
    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
        throw createError(403, 'You can only delete your own posts');
    }
    // Delete associated image if exists
    if (post.image_url && post.image_url.includes('/uploads/')) {
        try {
            const imagePath = post.image_url.replace(/^.*\/uploads\//, 'uploads/');
            if (require('fs').existsSync(imagePath)) {
                require('fs').unlinkSync(imagePath);
            }
        }
        catch (error) {
            console.error('Error deleting post image:', error);
        }
    }
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({
        success: true,
        message: 'Post deleted successfully',
    });
});
export const likePost = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { postId } = req.params;
    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
        throw createError(404, 'Post not found');
    }
    // Check if already liked
    const existingLike = await pool.query('SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, req.user.id]);
    if (existingLike.rows.length > 0) {
        throw createError(409, 'Post already liked');
    }
    // Add like and update count
    await pool.query('BEGIN');
    try {
        await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, req.user.id]);
        await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
        await pool.query('COMMIT');
        res.json({
            success: true,
            message: 'Post liked successfully',
        });
    }
    catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
});
export const unlikePost = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { postId } = req.params;
    // Check if like exists
    const existingLike = await pool.query('SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, req.user.id]);
    if (existingLike.rows.length === 0) {
        throw createError(404, 'Like not found');
    }
    // Remove like and update count
    await pool.query('BEGIN');
    try {
        await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, req.user.id]);
        await pool.query('UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1', [postId]);
        await pool.query('COMMIT');
        res.json({
            success: true,
            message: 'Post unliked successfully',
        });
    }
    catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
});
export const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
        throw createError(404, 'Post not found');
    }
    const result = await pool.query(`SELECT c.*, u.first_name, u.last_name, u.profile_picture
     FROM comments c
     JOIN users u ON c.author_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`, [postId]);
    const comments = result.rows.map(comment => ({
        ...convertCommentFromDb(comment),
        author: {
            id: comment.author_id,
            firstName: comment.first_name,
            lastName: comment.last_name,
            profilePicture: comment.profile_picture,
        },
    }));
    res.json({
        success: true,
        data: comments,
    });
});
export const createComment = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { postId } = req.params;
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        throw createError(400, 'Comment content is required');
    }
    // Check if post exists
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
        throw createError(404, 'Post not found');
    }
    const result = await pool.query(`INSERT INTO comments (content, author_id, post_id) 
     VALUES ($1, $2, $3) 
     RETURNING *`, [content.trim(), req.user.id, postId]);
    const comment = convertCommentFromDb(result.rows[0]);
    res.status(201).json({
        success: true,
        data: comment,
        message: 'Comment created successfully',
    });
});
export const deleteComment = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { commentId } = req.params;
    // Check if comment exists and user owns it
    const commentResult = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (commentResult.rows.length === 0) {
        throw createError(404, 'Comment not found');
    }
    const comment = commentResult.rows[0];
    if (comment.author_id !== req.user.id && req.user.role !== 'admin') {
        throw createError(403, 'You can only delete your own comments');
    }
    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({
        success: true,
        message: 'Comment deleted successfully',
    });
});
//# sourceMappingURL=postController.js.map