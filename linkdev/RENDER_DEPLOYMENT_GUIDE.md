# LINKDEV Deployment Guide for Render.com

## 🚀 Complete Deployment Instructions

This guide will help you deploy both the backend and frontend of LINKDEV to Render.com using your provided database credentials.

### Prerequisites
- GitHub account
- Render.com account
- Your project files uploaded to a GitHub repository

## 📂 Project Structure Verification

Your LINKDEV project should have this structure:
```
linkdev/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── .env.production
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── .env.production
│   └── vite.config.ts
└── RENDER_DEPLOYMENT_GUIDE.md
```

## 🔧 Step 1: Upload to GitHub

1. Create a new repository on GitHub
2. Upload all your LINKDEV project files to the repository
3. Ensure both backend and frontend folders are in the root directory

## 🗄️ Step 2: Deploy Backend to Render.com

### 2.1 Create Web Service
1. Go to [Render.com](https://render.com) and sign in
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your LINKDEV repository

### 2.2 Configure Backend Service
**Basic Settings:**
- **Name:** `linkdev-backend`
- **Environment:** `Node`
- **Region:** Choose your preferred region
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`

**Build & Deploy Settings:**
- **Build Command:** `npm install && npm run postinstall`
- **Start Command:** `npm start`

### 2.3 Set Environment Variables
Add these exact environment variables in Render.com dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres:e%25UKa%3FY%402MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres
JWT_SECRET=L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://linkdev-frontend.onrender.com
BACKEND_URL=https://linkdev-backend.onrender.com
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp
```

### 2.4 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Note your backend URL: `https://linkdev-backend.onrender.com`

## 💻 Step 3: Deploy Frontend to Render.com

### 3.1 Create Static Site
1. In Render.com dashboard, click **"New"** → **"Static Site"**
2. Connect the same GitHub repository
3. Select your LINKDEV repository

### 3.2 Configure Frontend Service
**Basic Settings:**
- **Name:** `linkdev-frontend`
- **Branch:** `main` (or your default branch)
- **Root Directory:** `frontend`

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 3.3 Set Frontend Environment Variables
Add these environment variables (update the backend URL with your actual backend URL):

```env
VITE_API_URL=https://linkdev-backend.onrender.com/api
VITE_APP_NAME=LINKDEV
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
VITE_MAX_FILE_SIZE=5242880
```

### 3.4 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete (3-5 minutes)
3. Note your frontend URL: `https://linkdev-frontend.onrender.com`

## 🔄 Step 4: Update CORS Configuration

After both deployments are complete:

1. Go to your backend service in Render.com
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Redeploy the backend service

## ✅ Step 5: Verification

### Test Your Deployment

1. **Backend Health Check:**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","message":"LINKDEV API is running"}`

2. **Frontend Access:**
   - Visit: `https://your-frontend-url.onrender.com`
   - Should load the LINKDEV login page

3. **Database Connection:**
   - Backend should automatically create all necessary tables
   - Check backend logs in Render.com for database initialization messages

### Test User Registration
1. Go to your frontend URL
2. Click "Register"
3. Create a test account
4. Verify you can log in

## 📱 Features to Test

### For Job Seekers:
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Profile picture upload
- [ ] Job browsing and search
- [ ] Job application submission
- [ ] Application status tracking

### For Recruiters:
- [ ] Recruiter account creation
- [ ] Job posting creation
- [ ] Application management
- [ ] Candidate search

### For Admins:
- [ ] Admin dashboard access
- [ ] User management
- [ ] Platform analytics

## 🔧 Troubleshooting

### Common Issues:

1. **Backend Won't Start:**
   - Check environment variables are set correctly
   - Verify database URL encoding
   - Check Render.com build logs

2. **Frontend Can't Connect to Backend:**
   - Verify `VITE_API_URL` environment variable
   - Check CORS settings in backend
   - Ensure backend is running

3. **Database Connection Errors:**
   - Verify DATABASE_URL is correctly encoded
   - Check Supabase connection limits
   - Review backend logs for specific errors

4. **File Upload Issues:**
   - Verify upload directory permissions
   - Check file size limits
   - Ensure image types are supported

## 📊 Performance Optimization

### Render.com Specific:
- Backend starts on first request (may have cold start delay)
- Static site has global CDN distribution
- Database connections are pooled automatically

### Monitoring:
- Check Render.com service metrics
- Monitor database performance in Supabase
- Set up error tracking (optional)

## 🎯 Final Deployment URLs

Once deployed, you'll have:

- **Frontend:** `https://linkdev-frontend.onrender.com`
- **Backend API:** `https://linkdev-backend.onrender.com/api`
- **Admin Panel:** `https://linkdev-frontend.onrender.com/admin`

## 📞 Support

If you encounter any issues:

1. Check Render.com deployment logs
2. Verify all environment variables
3. Test database connectivity
4. Review this guide for missed steps

---

**🎉 Congratulations! Your LINKDEV LinkedIn Clone is now live!**

*Built with modern technologies and deployed for production use.*