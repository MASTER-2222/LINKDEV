import { pool } from '../config/database.js';
import { createError, asyncHandler } from '../middleware/errorHandler.js';
const convertUserFromDb = (dbUser) => ({
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    headline: dbUser.headline,
    about: dbUser.about,
    profilePicture: dbUser.profile_picture,
    coverPhoto: dbUser.cover_photo,
    location: dbUser.location,
    industry: dbUser.industry,
    website: dbUser.website,
    role: dbUser.role,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
});
export const searchUsers = asyncHandler(async (req, res) => {
    const { search, role, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let whereConditions = ['1=1'];
    const queryParams = [];
    if (search) {
        whereConditions.push(`(
      first_name ILIKE $${queryParams.length + 1} OR 
      last_name ILIKE $${queryParams.length + 1} OR 
      headline ILIKE $${queryParams.length + 1} OR
      industry ILIKE $${queryParams.length + 1}
    )`);
        queryParams.push(`%${search}%`);
    }
    if (role) {
        whereConditions.push(`role = $${queryParams.length + 1}`);
        queryParams.push(role);
    }
    // Count total users
    const countResult = await pool.query(`SELECT COUNT(*) FROM users WHERE ${whereConditions.join(' AND ')}`, queryParams);
    const total = parseInt(countResult.rows[0].count);
    // Get users
    const result = await pool.query(`SELECT id, email, first_name, last_name, headline, about, profile_picture, 
            location, industry, website, role, created_at, updated_at
     FROM users 
     WHERE ${whereConditions.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`, [...queryParams, limit, offset]);
    const users = result.rows.map(convertUserFromDb);
    const totalPages = Math.ceil(total / Number(limit));
    res.json({
        success: true,
        data: {
            users,
            total,
            totalPages,
            currentPage: Number(page),
        },
    });
});
export const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await pool.query(`SELECT id, email, first_name, last_name, headline, about, profile_picture, 
            cover_photo, location, industry, website, role, created_at, updated_at
     FROM users WHERE id = $1`, [userId]);
    if (result.rows.length === 0) {
        throw createError(404, 'User not found');
    }
    const user = convertUserFromDb(result.rows[0]);
    res.json({
        success: true,
        data: user,
    });
});
export const getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
        throw createError(404, 'User not found');
    }
    // Count total posts
    const countResult = await pool.query('SELECT COUNT(*) FROM posts WHERE author_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].count);
    // Get posts with author info and like status
    let likesQuery = 'false as is_liked';
    const queryParams = [userId, limit, offset];
    if (req.user) {
        likesQuery = `CASE WHEN pl.user_id IS NOT NULL THEN true ELSE false END as is_liked`;
    }
    const result = await pool.query(`SELECT p.*, 
            u.first_name, u.last_name, u.profile_picture, u.headline,
            ${likesQuery}
     FROM posts p
     JOIN users u ON p.author_id = u.id
     ${req.user ? 'LEFT JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = $4' : ''}
     WHERE p.author_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`, req.user ? [...queryParams, req.user.id] : queryParams);
    const posts = result.rows.map(post => ({
        id: post.id,
        content: post.content,
        authorId: post.author_id,
        author: {
            id: post.author_id,
            firstName: post.first_name,
            lastName: post.last_name,
            profilePicture: post.profile_picture,
            headline: post.headline,
        },
        imageUrl: post.image_url,
        likes: post.likes_count,
        isLiked: post.is_liked,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
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
export const getRecommendedUsers = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    // Get users that are not connected to current user and exclude current user
    const result = await pool.query(`SELECT DISTINCT u.id, u.first_name, u.last_name, u.headline, u.profile_picture, 
            u.location, u.industry, u.role
     FROM users u
     WHERE u.id != $1
     AND u.id NOT IN (
       SELECT CASE 
         WHEN sender_id = $1 THEN receiver_id 
         ELSE sender_id 
       END as connected_user_id
       FROM connections 
       WHERE (sender_id = $1 OR receiver_id = $1) 
       AND status = 'accepted'
     )
     AND u.id NOT IN (
       SELECT CASE 
         WHEN sender_id = $1 THEN receiver_id 
         ELSE sender_id 
       END as pending_user_id
       FROM connections 
       WHERE (sender_id = $1 OR receiver_id = $1) 
       AND status = 'pending'
     )
     ORDER BY RANDOM()
     LIMIT 10`, [req.user.id]);
    const users = result.rows.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        headline: user.headline,
        profilePicture: user.profile_picture,
        location: user.location,
        industry: user.industry,
        role: user.role,
    }));
    res.json({
        success: true,
        data: users,
    });
});
//# sourceMappingURL=userController.js.map