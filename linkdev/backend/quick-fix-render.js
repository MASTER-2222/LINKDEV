#!/usr/bin/env node

/**
 * Quick Fix Script for Render.com Deployment Issues
 * Run this in your backend directory to fix common deployment problems
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 LINKDEV Backend - Render.com Quick Fix Script');
console.log('================================================\n');

// 1. Fix package.json scripts
console.log('1. Checking package.json scripts...');
const packageJsonPath = path.join(__dirname, 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Ensure TypeScript is in dependencies
  if (!packageJson.dependencies) packageJson.dependencies = {};
  if (!packageJson.dependencies.typescript) {
    packageJson.dependencies.typescript = '^5.0.0';
    console.log('   ✅ Added TypeScript to dependencies');
  }
  
  // Fix scripts
  if (!packageJson.scripts) packageJson.scripts = {};
  
  const requiredScripts = {
    'build': 'tsc',
    'start': 'node dist/index.js',
    'postinstall': 'tsc'
  };
  
  let scriptsUpdated = false;
  for (const [script, command] of Object.entries(requiredScripts)) {
    if (packageJson.scripts[script] !== command) {
      packageJson.scripts[script] = command;
      scriptsUpdated = true;
    }
  }
  
  if (scriptsUpdated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('   ✅ Updated package.json scripts');
  } else {
    console.log('   ✅ Package.json scripts are correct');
  }
} else {
  console.log('   ❌ package.json not found');
}

// 2. Check tsconfig.json
console.log('\n2. Checking tsconfig.json...');
const tsconfigPath = path.join(__dirname, 'tsconfig.json');

const recommendedTsconfig = {
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
};

if (fs.existsSync(tsconfigPath)) {
  console.log('   ✅ tsconfig.json exists');
} else {
  fs.writeFileSync(tsconfigPath, JSON.stringify(recommendedTsconfig, null, 2));
  console.log('   ✅ Created tsconfig.json');
}

// 3. Check main server file
console.log('\n3. Checking server configuration...');
const indexPath = path.join(__dirname, 'index.ts');
const srcIndexPath = path.join(__dirname, 'src', 'index.ts');

let serverFilePath = null;
if (fs.existsSync(indexPath)) {
  serverFilePath = indexPath;
} else if (fs.existsSync(srcIndexPath)) {
  serverFilePath = srcIndexPath;
}

if (serverFilePath) {
  const serverContent = fs.readFileSync(serverFilePath, 'utf8');
  
  // Check for correct port configuration
  if (!serverContent.includes('process.env.PORT') || !serverContent.includes('0.0.0.0')) {
    console.log('   ⚠️  Server port configuration might need updating');
    console.log('   📝 Ensure your server listens on: app.listen(process.env.PORT || 10000, "0.0.0.0")');
  } else {
    console.log('   ✅ Server port configuration looks good');
  }
  
  // Check for health endpoint
  if (!serverContent.includes('/health')) {
    console.log('   ⚠️  Consider adding a health check endpoint: app.get("/health", (req, res) => res.json({status: "OK"}))');
  } else {
    console.log('   ✅ Health endpoint found');
  }
} else {
  console.log('   ❌ Main server file not found (index.ts or src/index.ts)');
}

// 4. Check environment file
console.log('\n4. Checking environment configuration...');
const envProductionPath = path.join(__dirname, '.env.production');

if (fs.existsSync(envProductionPath)) {
  console.log('   ✅ .env.production file exists');
} else {
  const envContent = `# Production Environment Variables for Render.com
DATABASE_URL=postgresql://postgres:e%25UKa?Y@2MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres
JWT_SECRET=L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==
NODE_ENV=production
PORT=10000
`;
  fs.writeFileSync(envProductionPath, envContent);
  console.log('   ✅ Created .env.production file');
}

// 5. Create render.yaml if it doesn't exist
console.log('\n5. Checking render.yaml...');
const renderYamlPath = path.join(__dirname, 'render.yaml');

if (!fs.existsSync(renderYamlPath)) {
  const renderYamlContent = `services:
  - type: web
    name: linkdev-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        value: postgresql://postgres:e%25UKa?Y@2MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres
      - key: JWT_SECRET
        value: L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==
`;
  fs.writeFileSync(renderYamlPath, renderYamlContent);
  console.log('   ✅ Created render.yaml file');
} else {
  console.log('   ✅ render.yaml exists');
}

console.log('\n🎉 Quick fix completed!');
console.log('\nNext steps for Render.com deployment:');
console.log('1. Commit these changes to your repository');
console.log('2. In Render dashboard, set these environment variables:');
console.log('   - DATABASE_URL: postgresql://postgres:e%25UKa?Y@2MdT7DH@db.yckdwoihjqjfijqagayk.supabase.co:5432/postgres');
console.log('   - JWT_SECRET: L/4U9oFuTtQUllARo0LS8adZThD9A4CHuQqXrslTE9HljUTjajlljXUPwC+2XHWXKO10S8kq6a0drhREyuqcxQ==');
console.log('   - NODE_ENV: production');
console.log('3. Build Command: npm install');
console.log('4. Start Command: npm start');
console.log('5. Auto-Deploy: Yes');
console.log('\n📋 If you still encounter issues, please share the exact error logs.');