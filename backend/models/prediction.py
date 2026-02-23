"""Pydantic schemas for the prediction API.

Defines request and response models with validation and documentation.
"""

from enum import IntEnum
from typing import Annotated

from pydantic import BaseModel, Field, field_validator


class BHKType(IntEnum):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4


class PredictionRequest(BaseModel):
    """Input features for house price prediction."""

    location: str = Field(
        ...,
        description="Neighbourhood in Navi Mumbai",
        examples=["Kharghar", "Vashi", "Panvel"],
    )
    area_sqft: Annotated[float, Field(gt=50, lt=20000)] = Field(
        ...,
        description="Carpet/built-up area in square feet",
        examples=[950.0],
    )
    bhk: BHKType = Field(
        ...,
        description="Number of bedrooms (1–4)",
        examples=[2],
    )
    bathrooms: Annotated[float, Field(ge=1, le=6)] = Field(
        ...,
        description="Number of bathrooms",
        examples=[2.0],
    )
    floor: Annotated[int, Field(ge=0, le=60)] = Field(
        ...,
        description="Floor number (0 = Ground)",
        examples=[5],
    )
    total_floors: Annotated[int, Field(ge=1, le=80)] = Field(
        ...,
        description="Total floors in the building",
        examples=[20],
    )
    age_of_property: Annotated[float, Field(ge=0, le=50)] = Field(
        ...,
        description="Age of the property in years",
        examples=[5.0],
    )
    parking: bool = Field(
        default=True,
        description="Whether parking is available",
    )
    lift: bool = Field(
        default=True,
        description="Whether lift is available",
    )

    @field_validator("location")
    @classmethod
    def validate_location(cls, v: str) -> str:
        return v.strip().title()

    class Config:
        json_schema_extra = {
            "example": {
                "location": "Kharghar",
                "area_sqft": 950.0,
                "bhk": 2,
                "bathrooms": 2,
                "floor": 5,
                "total_floors": 20,
                "age_of_property": 5.0,
                "parking": True,
                "lift": True,
            }
        }


class PredictionResponse(BaseModel):
    """Price prediction result."""

    predicted_price_inr: float = Field(
        ..., description="Predicted property price in INR"
    )
    predicted_price_lakhs: float = Field(
        ..., description="Predicted price in Lakhs (1 Lakh = 100,000 INR)"
    )
    predicted_price_crores: float = Field(
        ..., description="Predicted price in Crores (1 Crore = 10,000,000 INR)"
    )
    price_per_sqft_inr: float = Field(
        ..., description="Price per square foot in INR"
    )
    confidence_range: dict[str, float] = Field(
        ...,
        description="Estimated price range (±15% confidence interval)",
    )
    location: str
    area_sqft: float
    bhk: int
    model_version: str = "1.0.0"


class HealthResponse(BaseModel):
    """API health status."""

    status: str
    model_loaded: bool
    model_version: str
    api_version: str = "1.0.0"


class MetadataResponse(BaseModel):
    """Exposes model metadata for frontend dropdowns."""

    locations: list[str]
    bhk_options: list[int]
    algorithm: str
    test_r2: float
    cv_r2_mean: float
    training_samples: int
    price_range_inr: dict[str, int]
