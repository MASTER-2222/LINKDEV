# LINKDEV - Render.com Deployment Guide (FIXED)

## ✅ Fixed Issues

The following common deployment issues have been resolved:

1. **Server Port Configuration**: Updated to bind to `0.0.0.0:PORT` 
2. **Default Port**: Changed from 3001 to 10000 (Render standard)
3. **Package.json Scripts**: Added proper build and start commands
4. **TypeScript**: Moved to dependencies for production builds
5. **CORS Configuration**: Added multiple origins for production
6. **Environment Variables**: Pre-configured production settings

## 🚀 Deployment Steps

### Step 1: Backend Deployment on Render.com

1. **Create New Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the backend folder

2. **Service Configuration**:
   ```
   Name: linkdev-backend
   Environment: Node
   Branch: main (or your branch)
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables** (Add these in Render dashboard):
   ```
   DATABASE_URL=postgresql://postgres:e%25UKa?Y@2MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres
   JWT_SECRET=L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==
   NODE_ENV=production
   FRONTEND_URL=https://linkdev-frontend.onrender.com
   ```

4. **Advanced Settings**:
   - Auto-Deploy: Yes
   - Health Check Path: `/health`

### Step 2: Frontend Deployment on Render.com

1. **Create Static Site**:
   - Click "New" → "Static Site"
   - Connect same repository
   - Select frontend folder

2. **Static Site Configuration**:
   ```
   Name: linkdev-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**:
   ```
   VITE_API_URL=https://linkdev-backend.onrender.com
   NODE_ENV=production
   ```

## 🔧 Pre-Deployment Fixes Applied

### Backend Fixes:

1. **Server Configuration** (`index.ts`):
   ```typescript
   const PORT = process.env.PORT || 10000;
   server.listen(PORT, '0.0.0.0', () => {
     console.log(`🚀 Server running on port ${PORT}`);
   });
   ```

2. **CORS Configuration**:
   ```typescript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'http://localhost:3000',
       process.env.FRONTEND_URL || 'https://linkdev-frontend.onrender.com'
     ],
     credentials: true,
   }));
   ```

3. **Package.json Scripts**:
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "postinstall": "tsc"
     }
   }
   ```

## 🌐 Expected URLs

After successful deployment:

- **Backend API**: `https://linkdev-backend.onrender.com`
- **Frontend**: `https://linkdev-frontend.onrender.com`
- **Health Check**: `https://linkdev-backend.onrender.com/health`
- **Admin Panel**: `https://linkdev-frontend.onrender.com/admin`

## 🐛 Common Issues & Solutions

### 1. Build Fails
**Error**: "Cannot find module 'typescript'"
**Solution**: TypeScript is now in dependencies ✅

### 2. Server Won't Start
**Error**: "EADDRINUSE" or "Cannot bind to port"
**Solution**: Server now binds to 0.0.0.0:PORT ✅

### 3. Database Connection Issues
**Error**: "ECONNREFUSED" database connection
**Solution**: Check DATABASE_URL in environment variables

### 4. CORS Errors
**Error**: "CORS policy: No 'Access-Control-Allow-Origin'"
**Solution**: CORS now allows multiple origins ✅

### 5. Frontend API Calls Fail
**Error**: "Failed to fetch" or network errors
**Solution**: Update frontend VITE_API_URL to your backend URL

## 📋 Deployment Checklist

- [ ] Repository is connected to Render
- [ ] Backend service created with correct settings
- [ ] Environment variables set in Render dashboard
- [ ] Backend deploys successfully (check logs)
- [ ] Health endpoint responds: `/health`
- [ ] Frontend service created
- [ ] Frontend environment variables set
- [ ] Frontend builds and deploys
- [ ] Frontend can connect to backend API
- [ ] Database operations work (login/register)
- [ ] File uploads work (if applicable)
- [ ] Admin panel accessible

## 🔍 Testing Your Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Should return: `{"status":"OK","message":"LINKDEV API is running"}`

2. **Frontend Access**:
   - Open your frontend URL
   - Try logging in or registering
   - Check browser console for errors

3. **API Testing**:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```

## 📞 Getting Help

If you encounter issues:

1. Check Render deployment logs
2. Verify environment variables
3. Test the health endpoint
4. Check browser console for frontend errors
5. Share specific error messages for troubleshooting

Your LINKDEV project is now ready for deployment! 🎉