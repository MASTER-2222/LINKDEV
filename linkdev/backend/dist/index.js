import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import authRoutes from './src/routes/auth';
import userRoutes from './src/routes/users';
import jobRoutes from './src/routes/jobs';
import postRoutes from './src/routes/posts';
import connectionRoutes from './src/routes/connections';
import adminRoutes from './src/routes/admin';
import { errorHandler } from './src/middleware/errorHandler';
import { initDatabase } from './src/config/database';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Static files for uploads - serve all upload subdirectories
app.use('/uploads', express.static('uploads', {
    maxAge: '1y', // Cache images for 1 year
    etag: true,
    lastModified: true
}));
// Initialize database
await initDatabase();
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'LINKDEV API is running' });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/admin', adminRoutes);
// Error handling middleware
app.use(errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
const server = createServer(app);
server.listen(PORT, () => {
    console.log(`🚀 LINKDEV API Server is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
export default app;
//# sourceMappingURL=index.js.map