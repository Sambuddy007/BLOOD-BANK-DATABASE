# 🚀 Quick Deployment Guide

## GitHub Setup (5 minutes)

1. **Initialize Git and push to your repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Blood Bank Management System"
   git branch -M main
   git remote add origin https://github.com/Sambuddy007/BLOOD-BANK-DATABASE.git
   git push -u origin main
   ```

## Backend Deployment (3 minutes)

### Option 1: Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set environment variables if needed
6. Deploy!

### Option 2: Render (Free tier)
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Set build command: `npm install`
6. Set start command: `node server.js`
7. Deploy!

## Frontend Deployment (3 minutes)

### Option 1: Vercel (Recommended - Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Set build command: `cd frontend && npm run build`
6. Set output directory: `frontend/build`
7. Deploy!

### Option 2: Netlify (Free tier)
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Select your repository
5. Set build command: `cd frontend && npm run build`
6. Set publish directory: `frontend/build`
7. Deploy!

## Environment Variables (if needed)

For production, you might need to set:
- `NODE_ENV=production`
- `PORT=5000` (or let the platform set it)

## That's it! 🎉

Your Blood Bank Management System will be live on the internet!
