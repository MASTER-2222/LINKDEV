import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { createError } from './errorHandler.js';
const JWT_SECRET = process.env.JWT_SECRET || 'L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError(401, 'Access token required');
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = jwt.verify(token, JWT_SECRET);
        // Get user from database
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
        if (result.rows.length === 0) {
            throw createError(401, 'User not found');
        }
        const user = result.rows[0];
        // Convert database fields to camelCase
        req.user = {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.first_name,
            lastName: user.last_name,
            headline: user.headline,
            about: user.about,
            profilePicture: user.profile_picture,
            coverPhoto: user.cover_photo,
            location: user.location,
            industry: user.industry,
            website: user.website,
            resume: user.resume,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(createError(401, 'Invalid token'));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(createError(401, 'Token expired'));
        }
        next(error);
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(createError(401, 'Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(createError(403, 'Access denied'));
        }
        next();
    };
};
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            req.user = {
                id: user.id,
                email: user.email,
                password: user.password,
                firstName: user.first_name,
                lastName: user.last_name,
                headline: user.headline,
                about: user.about,
                profilePicture: user.profile_picture,
                coverPhoto: user.cover_photo,
                location: user.location,
                industry: user.industry,
                website: user.website,
                resume: user.resume,
                role: user.role,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            };
        }
        next();
    }
    catch (error) {
        // If token is invalid, just continue without user
        next();
    }
};
//# sourceMappingURL=auth.js.map