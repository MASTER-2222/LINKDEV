import { Router } from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostComments,
  createComment,
  deleteComment,
} from '../controllers/postController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { uploadPostImage } from '../utils/multer.js';

const router = Router();

// Public/Optional auth routes
router.get('/', optionalAuth, getPosts);
router.get('/:postId/comments', getPostComments);

// Protected routes
router.post('/', authenticate, uploadPostImage, createPost);
router.put('/:postId', authenticate, updatePost);
router.delete('/:postId', authenticate, deletePost);
router.post('/:postId/like', authenticate, likePost);
router.delete('/:postId/like', authenticate, unlikePost);
router.post('/:postId/comments', authenticate, createComment);
router.delete('/comments/:commentId', authenticate, deleteComment);

export default router;