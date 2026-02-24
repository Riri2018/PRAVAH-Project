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
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
- **Region**: Singapore (`singapore`)
- **Health Check**: `/health`

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
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
4.  **Plan**: Select **Free**.

---

## ⚙️ Environment Variables

The following environment variables are configured via `render.yaml` but can be verified in the **Environment** tab of your Render service:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.0` | Ensures the correct Python runtime. |
| `PORT` | `8000` | The internal port gunicorn binds to. |

> [!IMPORTANT]
> If you have sensitive keys in `.env`, add them manually in the **Environment** tab on Render. **Do not push `.env` to GitHub.**

---

## ✅ Post-Deployment Verification

Once the deployment status is **Live**, verify the API:

1.  **Health Check**: Visit `https://your-app-name.onrender.com/health`
    - Should return: `{"status": "ok", "model_loaded": true, ...}`
2.  **API Docs**: Visit `https://your-app-name.onrender.com/docs` to test endpoints via Swagger UI.

---

## 🔍 Troubleshooting

- **Build Failures**: Check the "Logs" tab in Render for dependency errors. Ensure `backend/requirements.txt` is up to date.
- **Port Errors**: Render automatically assigns a `$PORT`. Ensure your Start Command uses `--bind 0.0.0.0:$PORT`.
- **Memory Issues**: The Free tier has 512MB RAM. If the ML model is too large, the process might crash (R14 error).
