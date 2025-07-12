import { Router } from 'express';
import { searchUsers, getUserById, getUserPosts, getRecommendedUsers, } from '../controllers/userController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
const router = Router();
// Public routes
router.get('/search', searchUsers);
router.get('/:userId', getUserById);
router.get('/:userId/posts', optionalAuth, getUserPosts);
// Protected routes
router.get('/recommendations/suggested', authenticate, getRecommendedUsers);
export default router;
//# sourceMappingURL=users.js.map