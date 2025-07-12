# Render.com Deployment Troubleshooting Guide for LINKDEV Backend

## Common Deployment Issues and Solutions

### 1. Build/Install Issues

**Issue**: `npm install` or dependency installation fails
**Solution**:
- Ensure `package.json` has correct `start` and `build` scripts
- Remove `peerDependencies` if causing conflicts
- Use `npm` instead of `bun` for Render.com compatibility

### 2. Environment Variables Issues

**Issue**: Environment variables not found or incorrect format
**Solutions**:
- Verify all environment variables are set in Render dashboard
- Check DATABASE_URL is properly URL-encoded
- Ensure PORT is provided by Render (don't hardcode it)

### 3. Database Connection Issues

**Issue**: Cannot connect to Supabase database
**Solutions**:
- URL-encode special characters in DATABASE_URL:
  - `%` becomes `%25`
  - `?` becomes `%3F`  
  - `@` becomes `%40`
- Add connection timeout settings
- Check if Supabase allows connections from Render IP ranges

### 4. Build Script Issues

**Issue**: TypeScript compilation fails
**Solutions**:
- Ensure `typescript` is in `dependencies` (not devDependencies)
- Add proper `build` script: `"build": "tsc"`
- Include `tsconfig.json` in the repository

### 5. Start Script Issues

**Issue**: Application fails to start
**Solutions**:
- Use `"start": "node dist/index.js"` (not `bun` command)
- Ensure the built files are in the correct location
- Add `"postinstall": "npm run build"` script

## Fixed Configuration Files

Here are the corrected configuration files for your LINKDEV project: