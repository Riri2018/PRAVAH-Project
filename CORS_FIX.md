# CORS Fix for Render Backend

## Problem
The backend is blocking requests from the frontend due to CORS policy.

## Solution
Update the `ALLOWED_ORIGINS` environment variable in Render:

### Steps:

1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your backend service: `pravah-project-3`
3. Click on "Environment" in the left sidebar
4. Find or add the `ALLOWED_ORIGINS` variable
5. Set the value to:
   ```
   https://pravah-project.vercel.app,http://localhost:3000,http://127.0.0.1:3000
   ```
6. Click "Save Changes"
7. Render will automatically redeploy your service

### Alternative: Use Wildcard (Less Secure)
If you want to allow all origins during development, you can temporarily use `*`:
```
ALLOWED_ORIGINS=*
```

**Note:** This is not recommended for production as it allows any website to access your API.

## Verification
After updating and redeploying:
1. Open your frontend at http://localhost:3000
2. Open browser DevTools (F12) → Console
3. Try making a prediction
4. The CORS error should be gone

## Current Configuration
The backend code already includes localhost in the default ALLOWED_ORIGINS, but Render environment variables override the defaults.
