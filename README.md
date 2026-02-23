# PRAVAH | Navi Mumbai Luxury Real Estate AI

**PRAVAH** is a premium, full-stack machine learning application designed to predict residential property prices in Navi Mumbai with clinical precision (**94% Accuracy**). It follows a high-end "Midnight Gold" aesthetic, offering a cinematic user experience for elite market analysis.

## ✨ Key Features
- **Cinematic Frontend**: A luxury "Midnight Gold" theme with glassmorphism, gold accents, and fluid reveal animations.
- **Predictive Intelligence**: Powered by a custom **Gradient Boosting** regressor trained on 2,500+ verified listings.
- **Market Intelligence Dashboard**: Real-time visualization of market ceilings and growth nodes across 15+ Navi Mumbai clusters.
- **Developer Suite**: Includes a 7-slide project presentation format and a professional LaTeX developer resume template.

## 🛠️ Tech Stack
- **Backend:** FastAPI (Python), Sklearn Pipeline (G-Boost), Render
- **Frontend:** Next.js 14, Tailwind CSS, Gold Theme, Vercel
- **ML Engine:** Custom cleaning, Node-specific clustering, and Dimensional Aging analysis.

## 🚀 Quick Start

### 1. Training the Engine
Ensure you have the latest market telemetry:
```bash
pip install -r backend/requirements.txt
python ml/train.py
```

### 2. Market API (FastAPI)
```bash
cd backend
python -m uvicorn main:app --reload
```
*Docs: `http://localhost:8000/docs`*

### 3. Luxury UI (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture
- `/backend`: Scalable API layer with singleton ML services.
- `/frontend`: Premium UI with cinematic animations and typed API integration.
- `/ml`: Training pipeline and metric evaluation (`0.94 R²`).
- `developer_resume.tex`: Customized LaTeX template for high-end dev roles.

## 🚢 Deployment
- **Backend:** Deployed on Render using `render.yaml`.
- **Frontend:** Deployed on Vercel with automated CI/CD.

Developed with a focus on visual excellence and predictive accuracy for the Navi Mumbai real estate landscape.
