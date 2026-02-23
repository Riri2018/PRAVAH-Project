"""Health check router."""

from fastapi import APIRouter

from models.prediction import HealthResponse
from services.ml_service import ModelService

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns API and model health status.",
)
async def health_check() -> HealthResponse:
    """Return API health status."""
    meta = ModelService.get_metadata()
    return HealthResponse(
        status="ok",
        model_loaded=ModelService.is_loaded(),
        model_version=meta.get("model_version", "unknown"),
    )
