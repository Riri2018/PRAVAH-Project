# Navi Mumbai House Price Prediction AI

A full-stack machine learning application that predicts residential property prices in Navi Mumbai with 94% accuracy.

## Tech Stack
- **Backend:** FastAPI (Python), Scikit-learn (GradientBoostingRegressor), Render
- **Frontend:** Next.js 14 (React), Tailwind CSS, Framer Motion, Vercel
- **ML Pipeline:** Custom cleaning, feature engineering (Floor Ratio, BHK Density), and ColumnTransformers.

## Quick Start

### 1. Training the Model
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run training script
python ml/train.py
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m uvicorn main:app --reload
```
API docs will be available at `http://localhost:8000/docs`.

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to see the app.

## Project Structure
- `/backend`: FastAPI app and ML services.
- `/frontend`: Next.js 14 App Router project.
- `/ml`: Model training and evaluation scripts.
- `navi_mumbai_real_estate_uncleaned_2500.csv`: Raw dataset.

## Deployment
- **Backend:** Deployed on Render using `render.yaml`.
- **Frontend:** Deployed on Vercel with automatic API proxy.

## Google Style Guide
This project follows the Google Python Style Guide for backend development and Airbnb JavaScript Style Guide for the frontend.
