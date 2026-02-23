"""ML model loading and inference service.

Implements a singleton pattern so the model is loaded once per process.
Thread-safe for use with async FastAPI workers.
"""

import json
import logging
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

_MODEL_PATH = Path(__file__).resolve().parent.parent / "model.pkl"
_METADATA_PATH = Path(__file__).resolve().parent.parent / "metadata.json"


class ModelService:
    """Singleton wrapper around the trained sklearn pipeline."""

    _pipeline = None
    _metadata: dict[str, Any] = {}

    @classmethod
    def load(cls) -> None:
        """Load the sklearn pipeline and metadata from disk."""
        if cls._pipeline is not None:
            logger.info("Model already loaded; skipping reload.")
            return

        if not _MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {_MODEL_PATH}. "
                "Run `python ml/train.py` to train and export the model."
            )

        logger.info("Loading model from %s", _MODEL_PATH)
        cls._pipeline = joblib.load(_MODEL_PATH)

        if _METADATA_PATH.exists():
            with open(_METADATA_PATH) as f:
                cls._metadata = json.load(f)
            logger.info(
                "Metadata loaded. Locations: %d, CV R²: %.4f",
                len(cls._metadata.get("locations", [])),
                cls._metadata.get("cv_r2_mean", 0),
            )

    @classmethod
    def is_loaded(cls) -> bool:
        return cls._pipeline is not None

    @classmethod
    def get_metadata(cls) -> dict[str, Any]:
        return cls._metadata

    @classmethod
    def predict(
        cls,
        location: str,
        area_sqft: float,
        bhk: int,
        bathrooms: float,
        floor: int,
        total_floors: int,
        age_of_property: float,
        parking: bool,
        lift: bool,
    ) -> dict[str, Any]:
        """Run inference and return structured prediction results.

        Args:
            location: Area name in Navi Mumbai.
            area_sqft: Built-up area in square feet.
            bhk: Number of bedrooms.
            bathrooms: Number of bathrooms.
            floor: Floor number (0 = ground).
            total_floors: Total floors in the building.
            age_of_property: Age in years.
            parking: Parking availability.
            lift: Lift availability.

        Returns:
            Dict with predicted price and derived metrics.

        Raises:
            RuntimeError: If model has not been loaded.
        """
        if cls._pipeline is None:
            raise RuntimeError("Model not loaded. Call ModelService.load() first.")

        # --- Derived features (must match training script) ---
        floor_ratio = floor / max(total_floors, 1)
        bhk_density = bhk / (area_sqft / 100)

        # --- Build feature DataFrame ---
        features = pd.DataFrame(
            [
                {
                    "Area_sqft": area_sqft,
                    "BHK": bhk,
                    "Bathrooms": bathrooms,
                    "Floor": floor,
                    "Total_Floors": total_floors,
                    "Age_of_Property": age_of_property,
                    "Parking": int(parking),
                    "Lift": int(lift),
                    "Floor_Ratio": floor_ratio,
                    "BHK_Density": bhk_density,
                    "Location": location,
                }
            ]
        )

        predicted_price = float(cls._pipeline.predict(features)[0])
        # Clamp to realistic range
        predicted_price = max(predicted_price, 500_000)

        price_per_sqft = predicted_price / area_sqft
        confidence_margin = 0.15  # ±15%

        return {
            "predicted_price_inr": round(predicted_price, 2),
            "predicted_price_lakhs": round(predicted_price / 1e5, 2),
            "predicted_price_crores": round(predicted_price / 1e7, 4),
            "price_per_sqft_inr": round(price_per_sqft, 2),
            "confidence_range": {
                "lower_inr": round(predicted_price * (1 - confidence_margin), 2),
                "upper_inr": round(predicted_price * (1 + confidence_margin), 2),
                "lower_lakhs": round(
                    predicted_price * (1 - confidence_margin) / 1e5, 2
                ),
                "upper_lakhs": round(
                    predicted_price * (1 + confidence_margin) / 1e5, 2
                ),
            },
        }
