# Deployment URLs & Configuration

## Live URLs

### Frontend (Vercel)
- **URL**: https://pravah-project.vercel.app/
- **Framework**: Next.js 15
- **Hosting**: Vercel

### Backend (Render)
- **URL**: https://pravah-project-3.onrender.com
- **Framework**: FastAPI
- **Hosting**: Render (Free Tier)

---

## Environment Variables

### Render Backend Configuration

Set these in your Render dashboard under "Environment":

```env
PYTHON_VERSION=3.11.0
ALLOWED_ORIGINS=https://pravah-project.vercel.app,http://localhost:3000
PORT=8000
```

### Vercel Frontend Configuration

Set these in your Vercel project settings under "Environment Variables":

```env
NEXT_PUBLIC_API_URL=https://pravah-project-3.onrender.com
```

---

## Quick Deployment Steps

### 1. Deploy Backend to Render

```bash
# Commit your changes
git add .
git commit -m "Fix deployment configuration and add mobile responsive design"
git push origin main
```

Then in Render:
1. Go to your service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Or wait for auto-deploy if enabled
4. Verify environment variables are set correctly

### 2. Update Frontend on Vercel

The frontend should auto-deploy when you push to GitHub. If not:

```bash
cd frontend
vercel --prod
```

Or manually trigger deployment in Vercel dashboard.

---

## Verification Checklist

### Backend Health Check
```bash
curl https://pravah-project-3.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "model_loaded": true,
  "timestamp": "2026-02-24T..."
}
```

### Frontend Check
1. Visit: https://pravah-project.vercel.app/
2. Check browser console for errors
3. Test prediction form
4. Verify dashboard loads

### CORS Check
1. Open browser DevTools (F12)
2. Go to Network tab
3. Make a prediction
4. Check for CORS errors in console
5. If errors appear, verify `ALLOWED_ORIGINS` in Render

---

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Update `ALLOWED_ORIGINS` in Render dashboard to include:
```
https://pravah-project.vercel.app
```

### Issue: Backend Not Responding
**Solution**: 
1. Check Render logs for errors
2. Verify service is running (not sleeping)
3. Free tier sleeps after 15 min inactivity - first request takes ~30s

### Issue: Frontend Can't Connect
**Solution**: 
1. Verify `NEXT_PUBLIC_API_URL` in Vercel settings
2. Check if backend URL is correct
3. Test backend health endpoint directly

### Issue: Mobile Not Responsive
**Solution**: 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check if latest code is deployed

---

## Testing URLs

### API Endpoints
- Health: `https://pravah-project-3.onrender.com/health`
- Docs: `https://pravah-project-3.onrender.com/docs`
- Metadata: `https://pravah-project-3.onrender.com/api/v1/metadata`
- Predict: `https://pravah-project-3.onrender.com/api/v1/predict` (POST)
- Analytics: `https://pravah-project-3.onrender.com/api/v1/analytics/market-stats`

### Frontend Pages
- Home: `https://pravah-project.vercel.app/`
- Predictor: `https://pravah-project.vercel.app/predict`
- Dashboard: `https://pravah-project.vercel.app/dashboard`

---

## Performance Notes

### Render Free Tier
- Spins down after 15 minutes of inactivity
- First request after sleep: ~30 seconds
- Subsequent requests: <1 second
- 750 hours/month free

### Vercel Free Tier
- Always active (no cold starts)
- 100GB bandwidth/month
- Unlimited requests
- Global CDN

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Verify Render deployment succeeds
3. ✅ Check Vercel auto-deployment
4. ✅ Test all endpoints
5. ✅ Verify mobile responsiveness
6. ✅ Share the live URL!

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Logs tab
2. Check Vercel logs: Project → Deployments → View logs
3. Test backend directly with curl/Postman
4. Verify environment variables are set correctly
