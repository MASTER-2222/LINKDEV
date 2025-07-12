# LINKDEV Deployment Guide

This guide provides step-by-step instructions for deploying LINKDEV on Render.com and Vercel.com.

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed locally
- A GitHub repository with your LINKDEV code
- A Supabase account and database
- Accounts on Render.com and Vercel.com

## Database Setup (Supabase)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your database URL and anon key

2. **Configure Database URL**
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
   ```
   Make sure to URL-encode special characters in your password:
   - `%` becomes `%25`
   - `?` becomes `%3F`
   - `@` becomes `%40`
   - etc.

## Deployment on Render.com

### Backend Deployment

1. **Create a New Web Service**
   - Go to [render.com](https://render.com) dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && npm start
   ```

3. **Environment Variables**
   Add the following environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=your_supabase_database_url
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note down your backend URL (e.g., `https://linkdev-api.onrender.com`)

### Frontend Deployment on Render (Alternative)

1. **Create a Static Site**
   - Click "New" → "Static Site"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_APP_NAME=LINKDEV
   VITE_NODE_ENV=production
   ```

## Deployment on Vercel.com

### Frontend Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com) dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_APP_NAME=LINKDEV
   VITE_NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be available at `https://your-project.vercel.app`

### Backend Deployment on Vercel

1. **Create Vercel Project for Backend**
   - Create new project
   - Root Directory: `backend`
   - Framework: Other

2. **Configure vercel.json**
   Create `backend/vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.ts"
       }
     ]
   }
   ```

3. **Environment Variables**
   Same as Render backend configuration.

## Local Development Setup

### Backend

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Copy `.env.txt` to `.env` and configure:
   ```bash
   cp .env.txt .env
   # Edit .env with your values
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:3001

### Frontend

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   Copy `.env.txt` to `.env`:
   ```bash
   cp .env.txt .env
   # Update VITE_API_URL to point to your backend
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   App will run on http://localhost:5173

## Production Checklist

### Security
- [ ] JWT secret is cryptographically secure
- [ ] Database credentials are properly secured
- [ ] CORS is configured for your domains only
- [ ] Environment variables are not exposed to client

### Performance
- [ ] Frontend is built and optimized
- [ ] Static assets are properly cached
- [ ] Database indexes are in place
- [ ] File upload limits are configured

### Monitoring
- [ ] Error logging is configured
- [ ] Health check endpoints are working
- [ ] Database connection monitoring
- [ ] Performance monitoring tools

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify URL encoding of special characters
   - Check Supabase connection limits
   - Ensure IP whitelisting if required

2. **CORS Errors**
   - Verify FRONTEND_URL environment variable
   - Check CORS configuration in backend

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed
   - Review build logs for specific errors

4. **Environment Variables Not Loading**
   - Verify variable names match exactly
   - Check for typos in values
   - Ensure proper escaping of special characters

### Support Resources

- **Render.com**: [docs.render.com](https://docs.render.com)
- **Vercel.com**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

## Advanced Configuration

### Custom Domains
- Configure custom domains in Render/Vercel dashboards
- Update CORS and environment variables accordingly

### SSL Certificates
- Both Render and Vercel provide automatic SSL
- Custom domains may require DNS configuration

### Database Migrations
- Run database initialization on first deployment
- Consider migration scripts for schema changes

### File Storage
- Configure Cloudinary or AWS S3 for production file uploads
- Update environment variables accordingly

---

For additional support or questions, refer to the platform-specific documentation or contact the development team.