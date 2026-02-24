"""Navi Mumbai House Price Prediction API.

FastAPI application entry point. Registers all routers, configures
CORS, and initialises global middleware.

Deployment: Render (gunicorn/uvicorn)
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from routers import analytics, health, predict
from services.ml_service import ModelService

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan: load model once at startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model on startup and clean up on shutdown."""
    logger.info("Starting Navi Mumbai House Price Prediction API...")
    ModelService.load()
    logger.info("ML model loaded successfully.")
    yield
    logger.info("Shutting down API.")


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------
def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    application = FastAPI(
        title="Navi Mumbai House Price Prediction API",
        description=(
            "Machine learning API for predicting residential property prices "
            "in Navi Mumbai, Maharashtra, India."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # --- CORS ---
    # In production, specify your actual origins.
    import os
    allowed_origins_str = os.getenv(
        "ALLOWED_ORIGINS",
        "*"  # Allow all origins by default for easier deployment
    )
    
    logger.info(f"ALLOWED_ORIGINS environment variable: {allowed_origins_str}")
    
    # Allow all origins if set to "*"
    if allowed_origins_str.strip() == "*":
        logger.info("CORS: Allowing all origins (*)")
        application.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=False,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]
        logger.info(f"CORS: Allowing specific origins: {allowed_origins}")
        application.add_middleware(
            CORSMiddleware,
            allow_origins=allowed_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # --- GZip compression ---
    application.add_middleware(GZipMiddleware, minimum_size=1000)

    # --- Request timing middleware ---
    @application.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = (time.perf_counter() - start_time) * 1000
        response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
        return response

    # --- Global exception handler ---
    @application.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error("Unhandled exception: %s", exc, exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred."},
        )

    # --- Routers ---
    application.include_router(health.router, tags=["Health"])
    application.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])
    application.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])

    return application


app = create_app()
