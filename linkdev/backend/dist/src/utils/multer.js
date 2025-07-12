import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createError } from '../middleware/errorHandler.js';
// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
// Create upload directories based on hosting platform
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const profilePicturesDir = path.join(uploadDir, 'profile-pictures');
const postImagesDir = path.join(uploadDir, 'post-images');
const coverPhotosDir = path.join(uploadDir, 'cover-photos');
const resumesDir = path.join(uploadDir, 'resumes');
// Initialize directories (works great on Render.com)
if (process.env.NODE_ENV !== 'production' || process.env.HOSTING_PLATFORM === 'render') {
    ensureDirectoryExists(uploadDir);
    ensureDirectoryExists(profilePicturesDir);
    ensureDirectoryExists(postImagesDir);
    ensureDirectoryExists(coverPhotosDir);
    ensureDirectoryExists(resumesDir);
}
// Storage configuration optimized for hosting platforms
const createStorage = (subDirectory) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const fullPath = path.join(uploadDir, subDirectory);
            // For production hosting (Render.com), ensure directory exists
            if (process.env.NODE_ENV === 'production' && process.env.HOSTING_PLATFORM === 'render') {
                ensureDirectoryExists(fullPath);
            }
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            // Create unique filename with timestamp and random string
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = path.extname(file.originalname).toLowerCase();
            const sanitizedName = file.fieldname.replace(/[^a-zA-Z0-9]/g, '');
            cb(null, `${sanitizedName}-${uniqueSuffix}${extension}`);
        },
    });
};
// File filter for images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(createError(400, 'Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
    }
};
// File filter for documents (resumes, etc.)
const documentFileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(createError(400, 'Only PDF and Word documents are allowed!'));
    }
};
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
// Profile picture upload
export const uploadProfilePicture = multer({
    storage: createStorage('profile-pictures'),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxFileSize },
}).single('image');
// Cover photo upload
export const uploadCoverPhoto = multer({
    storage: createStorage('cover-photos'),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxFileSize },
}).single('cover');
// Post image upload
export const uploadPostImage = multer({
    storage: createStorage('post-images'),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxFileSize },
}).single('image');
// Resume upload
export const uploadResume = multer({
    storage: createStorage('resumes'),
    fileFilter: documentFileFilter,
    limits: { fileSize: maxFileSize * 2 }, // 10MB for documents
}).single('resume');
// Helper function to get full image URL for hosting platforms
export const getImageUrl = (req, filename, subDirectory = '') => {
    // Get base URL based on hosting platform
    let baseUrl;
    if (process.env.NODE_ENV === 'production') {
        // Use environment variable for production URL
        baseUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get('host')}`;
    }
    else {
        // Development URL
        baseUrl = `${req.protocol}://${req.get('host')}`;
    }
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');
    if (subDirectory) {
        return `${baseUrl}/uploads/${subDirectory}/${filename}`;
    }
    return `${baseUrl}/uploads/${filename}`;
};
// Helper function to get file path from URL
export const getFilePathFromUrl = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) {
        return '';
    }
    // Extract the path after /uploads/
    const uploadIndex = imageUrl.indexOf('/uploads/');
    if (uploadIndex !== -1) {
        return imageUrl.substring(uploadIndex + 1); // Remove leading /
    }
    return '';
};
// Helper function to delete old image files
export const deleteImageFile = (imagePath) => {
    try {
        const fullPath = path.resolve(imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted old image: ${fullPath}`);
        }
    }
    catch (error) {
        console.error('Error deleting image file:', error);
    }
};
// Cleanup function for old files (useful for maintenance)
export const cleanupOldFiles = (directory, maxAgeInDays = 30) => {
    try {
        const dirPath = path.join(uploadDir, directory);
        if (!fs.existsSync(dirPath))
            return;
        const files = fs.readdirSync(dirPath);
        const cutoffTime = Date.now() - (maxAgeInDays * 24 * 60 * 60 * 1000);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.mtime.getTime() < cutoffTime) {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up old file: ${filePath}`);
            }
        });
    }
    catch (error) {
        console.error('Error during cleanup:', error);
    }
};
//# sourceMappingURL=multer.js.map