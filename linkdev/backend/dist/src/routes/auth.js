import { Router } from 'express';
import { register, login, getCurrentUser, updateProfile, changePassword, uploadProfilePicture, uploadCoverPhoto, } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadProfilePicture as uploadProfile, uploadCoverPhoto as uploadCover } from '../utils/multer.js';
const router = Router();
// Public routes
router.post('/register', register);
router.post('/login', login);
// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/upload-profile-picture', authenticate, uploadProfile, uploadProfilePicture);
router.post('/upload-cover-photo', authenticate, uploadCover, uploadCoverPhoto);
export default router;
//# sourceMappingURL=auth.js.map