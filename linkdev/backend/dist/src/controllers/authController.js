import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { createError, asyncHandler } from '../middleware/errorHandler.js';
import { getImageUrl, getFilePathFromUrl, deleteImageFile } from '../utils/multer.js';
const JWT_SECRET = process.env.JWT_SECRET || 'L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (userId, email, role) => {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const convertUserFromDb = (dbUser) => ({
    id: dbUser.id,
    email: dbUser.email,
    password: dbUser.password,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    headline: dbUser.headline,
    about: dbUser.about,
    profilePicture: dbUser.profile_picture,
    coverPhoto: dbUser.cover_photo,
    location: dbUser.location,
    industry: dbUser.industry,
    website: dbUser.website,
    resume: dbUser.resume,
    role: dbUser.role,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
});
export const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;
    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
        throw createError(400, 'All fields are required');
    }
    if (password.length < 6) {
        throw createError(400, 'Password must be at least 6 characters long');
    }
    if (!['job_seeker', 'recruiter'].includes(role)) {
        throw createError(400, 'Invalid role. Must be job_seeker or recruiter');
    }
    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
        throw createError(409, 'User with this email already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create user
    const result = await pool.query(`INSERT INTO users (email, password, first_name, last_name, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`, [email.toLowerCase(), hashedPassword, firstName, lastName, role]);
    const user = convertUserFromDb(result.rows[0]);
    const token = generateToken(user.id, user.email, user.role);
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
        success: true,
        data: {
            user: userWithoutPassword,
            token,
        },
        message: 'User registered successfully',
    });
});
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
        throw createError(400, 'Email and password are required');
    }
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
        throw createError(401, 'Invalid email or password');
    }
    const user = convertUserFromDb(result.rows[0]);
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError(401, 'Invalid email or password');
    }
    const token = generateToken(user.id, user.email, user.role);
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        data: {
            user: userWithoutPassword,
            token,
        },
        message: 'Login successful',
    });
});
export const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({
        success: true,
        data: userWithoutPassword,
    });
});
export const updateProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { firstName, lastName, headline, about, location, industry, website, profilePicture, coverPhoto, } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (firstName !== undefined) {
        updates.push(`first_name = $${paramCount++}`);
        values.push(firstName);
    }
    if (lastName !== undefined) {
        updates.push(`last_name = $${paramCount++}`);
        values.push(lastName);
    }
    if (headline !== undefined) {
        updates.push(`headline = $${paramCount++}`);
        values.push(headline);
    }
    if (about !== undefined) {
        updates.push(`about = $${paramCount++}`);
        values.push(about);
    }
    if (location !== undefined) {
        updates.push(`location = $${paramCount++}`);
        values.push(location);
    }
    if (industry !== undefined) {
        updates.push(`industry = $${paramCount++}`);
        values.push(industry);
    }
    if (website !== undefined) {
        updates.push(`website = $${paramCount++}`);
        values.push(website);
    }
    if (profilePicture !== undefined) {
        updates.push(`profile_picture = $${paramCount++}`);
        values.push(profilePicture);
    }
    if (coverPhoto !== undefined) {
        updates.push(`cover_photo = $${paramCount++}`);
        values.push(coverPhoto);
    }
    if (updates.length === 0) {
        throw createError(400, 'No fields to update');
    }
    values.push(req.user.id);
    const result = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    const user = convertUserFromDb(result.rows[0]);
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        success: true,
        data: userWithoutPassword,
        message: 'Profile updated successfully',
    });
});
export const changePassword = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw createError(400, 'Current password and new password are required');
    }
    if (newPassword.length < 6) {
        throw createError(400, 'New password must be at least 6 characters long');
    }
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, req.user.password);
    if (!isCurrentPasswordValid) {
        throw createError(400, 'Current password is incorrect');
    }
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    // Update password
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, req.user.id]);
    res.json({
        success: true,
        message: 'Password changed successfully',
    });
});
export const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    if (!req.file) {
        throw createError(400, 'No image file provided');
    }
    // Generate the full image URL for hosting platform
    const imageUrl = getImageUrl(req, req.file.filename, 'profile-pictures');
    // Delete old profile picture if exists
    if (req.user.profilePicture && req.user.profilePicture.includes('/uploads/')) {
        try {
            const oldImagePath = getFilePathFromUrl(req.user.profilePicture);
            if (oldImagePath) {
                deleteImageFile(oldImagePath);
            }
        }
        catch (error) {
            console.error('Error deleting old profile picture:', error);
        }
    }
    // Update user's profile picture in database
    const result = await pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING profile_picture', [imageUrl, req.user.id]);
    res.json({
        success: true,
        data: { imageUrl: result.rows[0].profile_picture },
        message: 'Profile picture uploaded successfully',
    });
});
export const uploadCoverPhoto = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError(401, 'Authentication required');
    }
    if (!req.file) {
        throw createError(400, 'No cover photo file provided');
    }
    // Generate the full image URL for hosting platform
    const imageUrl = getImageUrl(req, req.file.filename, 'cover-photos');
    // Delete old cover photo if exists
    if (req.user.coverPhoto && req.user.coverPhoto.includes('/uploads/')) {
        try {
            const oldImagePath = getFilePathFromUrl(req.user.coverPhoto);
            if (oldImagePath) {
                deleteImageFile(oldImagePath);
            }
        }
        catch (error) {
            console.error('Error deleting old cover photo:', error);
        }
    }
    // Update user's cover photo in database
    const result = await pool.query('UPDATE users SET cover_photo = $1 WHERE id = $2 RETURNING cover_photo', [imageUrl, req.user.id]);
    res.json({
        success: true,
        data: { imageUrl: result.rows[0].cover_photo },
        message: 'Cover photo uploaded successfully',
    });
});
//# sourceMappingURL=authController.js.map