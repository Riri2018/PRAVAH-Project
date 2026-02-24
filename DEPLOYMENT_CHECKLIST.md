# Deployment Checklist

## ✅ Fixed Issues

### 1. Pydantic Rust Compilation Error
- **Problem**: `pydantic==2.10.3` required Rust compilation which failed on Render
- **Solution**: Downgraded to `pydantic==2.8.2` and `pydantic-settings==2.3.4` (pre-built wheels)

### 2. Host Binding Issue
- **Problem**: App was binding to `127.0.0.1` which Render's load balancer can't access
- **Solution**: Changed to `0.0.0.0` in both `render.yaml` and `Procfile`

### 3. Build Command Optimization
- **Problem**: Old pip version might cause issues
- **Solution**: Added `pip install --upgrade pip` before installing requirements

---

## 🚀 Deployment Steps

### Backend (Render)

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Fix Render deployment issues"
   git push
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - If using Blueprint: Click "Manual Deploy" → "Deploy latest commit"
   - If manual setup: Render will auto-deploy on push

3. **Set Environment Variables** (if not using render.yaml)
   - `PYTHON_VERSION`: `3.11.0`
   - `ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app,http://localhost:3000`

4. **Verify Deployment**
   - Health check: `https://pravah-house-api.onrender.com/health`
   - API docs: `https://pravah-house-api.onrender.com/docs`

### Frontend (Vercel)

1. **Update Backend URL** (if different from default)
   - Edit `frontend/vercel.json` if your Render URL is different
   - Or set environment variable in Vercel dashboard

2. **Deploy to Vercel**
   ```bash
   cd frontend
   vercel --prod
   ```
   Or push to GitHub and let Vercel auto-deploy

3. **Set Environment Variables in Vercel Dashboard**
   - `NEXT_PUBLIC_API_URL`: `https://pravah-house-api.onrender.com`

4. **Update CORS in Render**
   - Add your Vercel URL to `ALLOWED_ORIGINS` in Render dashboard
   - Example: `https://pravah-project.vercel.app`

---

## 📋 Environment Variables Summary

### Backend (Render)
```env
PYTHON_VERSION=3.11.0
ALLOWED_ORIGINS=https://pravah-project.vercel.app,http://localhost:3000
PORT=8000
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://pravah-house-api.onrender.com
```

---

## 🔍 Verification Checklist

- [ ] Backend health endpoint returns `{"status": "ok", "model_loaded": true}`
- [ ] Backend API docs accessible at `/docs`
- [ ] Frontend can fetch metadata (locations, BHK options)
- [ ] Prediction form works end-to-end
- [ ] No CORS errors in browser console
- [ ] Dashboard analytics load correctly

---

## 🐛 Common Issues

### Backend won't start
- Check logs in Render dashboard
- Verify `model.pkl` exists in backend directory
- Ensure Python version is 3.11.0

### CORS errors
- Update `ALLOWED_ORIGINS` in Render to include your Vercel URL
- Format: comma-separated, no spaces
- Example: `https://app1.vercel.app,https://app2.vercel.app`

### 502 Bad Gateway
- Wait 2-3 minutes for cold start (free tier)
- Check if model loading is taking too long
- Verify health check endpoint is accessible

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check if backend URL is accessible from browser
- Ensure backend is deployed and running
