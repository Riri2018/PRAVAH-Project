"""Prediction router: /api/v1/predict and /api/v1/metadata."""

import logging

from fastapi import APIRouter, HTTPException, status

from models.prediction import MetadataResponse, PredictionRequest, PredictionResponse
from services.ml_service import ModelService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict house price",
    description=(
        "Accepts property features and returns a predicted price in INR "
        "using the trained GradientBoosting model."
    ),
)
async def predict_price(request: PredictionRequest) -> PredictionResponse:
    """Predict property price for given feature inputs.

    Args:
        request: Validated prediction request body.

    Returns:
        PredictionResponse with price in multiple formats.

    Raises:
        HTTPException 503: If model not loaded.
        HTTPException 422: If inputs fail validation (auto-raised by FastAPI).
        HTTPException 500: On unexpected inference error.
    """
    if not ModelService.is_loaded():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model is not ready. Please try again in a few seconds.",
        )

    # Validate location against known locations
    metadata = ModelService.get_metadata()
    known_locations = [loc.lower() for loc in metadata.get("locations", [])]
    if known_locations and request.location.lower() not in known_locations:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"Unknown location: '{request.location}'. "
                f"Valid locations: {metadata.get('locations', [])}"
            ),
        )

    try:
        result = ModelService.predict(
            location=request.location,
            area_sqft=request.area_sqft,
            bhk=int(request.bhk),
            bathrooms=request.bathrooms,
            floor=request.floor,
            total_floors=request.total_floors,
            age_of_property=request.age_of_property,
            parking=request.parking,
            lift=request.lift,
        )
    except Exception as exc:
        logger.error("Prediction failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction failed. Please check your inputs and try again.",
        ) from exc

    return PredictionResponse(
        **result,
        location=request.location,
        area_sqft=request.area_sqft,
        bhk=int(request.bhk),
    )


@router.get(
    "/metadata",
    response_model=MetadataResponse,
    summary="Get model metadata",
    description="Returns available locations, BHK options, and model performance metrics.",
)
async def get_metadata() -> MetadataResponse:
    """Return metadata for populating frontend dropdowns and info panels."""
    meta = ModelService.get_metadata()
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Metadata not available.",
        )
    return MetadataResponse(
        locations=meta["locations"],
        bhk_options=meta["bhk_options"],
        algorithm=meta["algorithm"],
        test_r2=meta["test_metrics"]["r2"],
        cv_r2_mean=meta["cv_r2_mean"],
        training_samples=meta["training_samples"],
        price_range_inr=meta["price_range_inr"],
    )
