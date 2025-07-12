export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    // PostgreSQL errors
    if (err.message.includes('duplicate key value')) {
        statusCode = 409;
        message = 'Resource already exists';
    }
    if (err.message.includes('foreign key constraint')) {
        statusCode = 400;
        message = 'Invalid reference';
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
export const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=errorHandler.js.map