# Deploying FastAPI Backend to Render

This guide provides step-by-step instructions for deploying the **Navi Mumbai House Price Prediction API** to [Render](https://render.com).

## 🚀 Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Render Account**: Create a free account at [render.com](https://render.com).
3.  **Python Version**: This project uses Python `3.11.0`.

---

## 🛠️ Method 1: Using Blueprint (`render.yaml`) - Recommended

Render can automatically configure your service using the existing `render.yaml` file in the root directory.

1.  Log in to the [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect the `render.yaml` file.
5.  Click **Apply**.

### Features included in `render.yaml`:
- **Instance Type**: Free
- **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Region**: Singapore (`singapore`)
- **Health Check**: `/health`
- **Python Version**: `3.11.0`

---

## 🖱️ Method 2: Manual Deployment

If you prefer to configure the service manually:

1.  Click **New +** and select **Web Service**.
2.  Connect your GitHub repository.
3.  **Configuration**:
    - **Name**: `pravah-house-api`
    - **Environment**: `Python 3`
    - **Region**: `Singapore` (or closest to you)
    - **Branch**: `main`
    - **Root Directory**: `backend`
    - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  **Plan**: Select **Free**.

---

## ⚙️ Environment Variables

The following environment variables are configured via `render.yaml` but can be verified in the **Environment** tab of your Render service:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.0` | Ensures the correct Python runtime. |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | List of allowed CORS origins. |

> [!IMPORTANT]
> **Host Binding**: For local development, use `127.0.0.1:8000`. For Render deployment, use `--host 0.0.0.0`. This is necessary for Render's load balancer to find your application.

---

## ✅ Post-Deployment Verification

Once the deployment status is **Live**, verify the API:

1.  **Health Check**: Visit `https://your-app-name.onrender.com/health`
    - Should return: `{"status": "ok", "model_loaded": true, ...}`
2.  **API Docs**: Visit `https://your-app-name.onrender.com/docs` to test endpoints via Swagger UI.

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Pydantic/Rust Compilation Error
**Error**: `error: failed to create directory /usr/local/cargo/registry/cache/`

**Solution**: This happens when pydantic version requires Rust compilation. The `requirements.txt` has been updated to use `pydantic==2.8.2` which has pre-built wheels and doesn't require Rust.

#### 2. No open HTTP ports detected
**Solution**: Ensure the app binds to `0.0.0.0` instead of `127.0.0.1`. The `render.yaml` and `Procfile` have been configured correctly with:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### 3. Build Failures
- Check the "Logs" tab in Render
- Ensure `backend/requirements.txt` has compatible versions
- Verify Python version is set to `3.11.0`

#### 4. 502 Bad Gateway
- App may be taking too long to start
- Check if model file (`model.pkl`) exists in the backend directory
- Review startup logs for errors during model loading

#### 5. CORS Errors
- Update `ALLOWED_ORIGINS` environment variable in Render dashboard
- Add your Vercel frontend URL (e.g., `https://pravah-project.vercel.app`)
- Multiple origins should be comma-separated
