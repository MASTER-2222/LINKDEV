# Render.com Backend Deployment Troubleshooting Guide

## Common Issues and Solutions for LINKDEV Backend

### 1. **Build Command Issues**

**Problem**: Render fails during build step
**Solutions**:
```json
// package.json - Ensure these scripts exist:
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "postinstall": "tsc"
  }
}
```

**Render Service Settings**:
- Build Command: `npm install`
- Start Command: `npm start`
- Node Version: 18 or 20

### 2. **TypeScript Compilation Issues**

**Problem**: TypeScript not found or compilation fails
**Solutions**:
- Add `typescript` to dependencies (not devDependencies):
```json
{
  "dependencies": {
    "typescript": "^5.0.0"
  }
}
```

- Ensure `tsconfig.json` is properly configured:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. **Environment Variables Issues**

**Problem**: Database connection or JWT failures
**Solutions**:
- Verify environment variables in Render Dashboard:
  - `DATABASE_URL`: `postgresql://postgres:e%25UKa?Y@2MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres`
  - `JWT_SECRET`: `L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==`
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (Render default)

### 4. **Port Configuration Issues**

**Problem**: Service fails to bind to port
**Solution**: Update your main server file (`index.ts`):
```typescript
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5. **Database Connection Issues**

**Problem**: Cannot connect to Supabase
**Solutions**:
- Update database configuration in `src/config/database.ts`:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 20
});

export default pool;
```

### 6. **CORS Configuration Issues**

**Problem**: Frontend can't connect to backend
**Solution**: Update CORS configuration:
```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://linkdev-frontend.onrender.com',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

### 7. **File Upload Path Issues**

**Problem**: File uploads fail in production
**Solution**: Update multer configuration for production:
```typescript
// src/utils/multer.ts
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use /tmp for temporary storage on Render
    cb(null, process.env.NODE_ENV === 'production' ? '/tmp/uploads' : './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
```

### 8. **Memory/Resource Issues**

**Problem**: Service crashes due to resource limits
**Solutions**:
- Use Render's Standard plan or higher
- Optimize database queries
- Add connection pooling
- Set reasonable timeouts

### 9. **Dependency Issues**

**Problem**: Missing or incompatible dependencies
**Solutions**:
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Use specific versions instead of ranges:
```json
{
  "dependencies": {
    "express": "4.18.2",
    "pg": "8.11.3",
    "cors": "2.8.5"
  }
}
```

### 10. **Health Check Issues**

**Problem**: Render health checks fail
**Solution**: Add a health endpoint:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## Deployment Checklist

Before deploying to Render:

- [ ] `package.json` has correct build and start scripts
- [ ] TypeScript is in dependencies
- [ ] Environment variables are set in Render dashboard
- [ ] Port is configured correctly (0.0.0.0:PORT)
- [ ] Database SSL is configured for production
- [ ] CORS allows your frontend domain
- [ ] All dependencies are in the right section
- [ ] Health endpoint exists

## Quick Fix Commands

If you need to update your backend files:

```bash
# Add TypeScript to dependencies
npm install --save typescript

# Update package.json scripts
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.postinstall="tsc"

# Verify tsconfig.json exists and is valid
npx tsc --noEmit
```

## Common Error Messages and Solutions

- **"Cannot find module 'typescript'"** → Move typescript to dependencies
- **"EADDRINUSE: address already in use"** → Use process.env.PORT
- **"connect ECONNREFUSED"** → Check DATABASE_URL and SSL config
- **"CORS error"** → Add your frontend domain to CORS origins
- **"Module not found"** → Check import paths and file extensions