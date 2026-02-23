# -*- coding: utf-8 -*-
"""Navi Mumbai House Price Prediction - Model Training Script.

This script trains a GradientBoosting regression model on the
Navi Mumbai real estate dataset. It handles data cleaning,
feature engineering, model training, evaluation, and artifact export.

Usage:
    python ml/train.py

Output:
    backend/model.pkl        - Trained sklearn pipeline
    backend/metadata.json    - Feature metadata for API
"""

import json
import re
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "navi_mumbai_real_estate_uncleaned_2500.csv"
OUTPUT_DIR = PROJECT_ROOT / "backend"
OUTPUT_DIR.mkdir(exist_ok=True)

MODEL_PATH = OUTPUT_DIR / "model.pkl"
METADATA_PATH = OUTPUT_DIR / "metadata.json"


# ---------------------------------------------------------------------------
# Data cleaning helpers
# ---------------------------------------------------------------------------

def clean_price(value: str | float) -> float | None:
    """Normalize Actual_Price to a numeric INR value."""
    if pd.isna(value):
        return None
    s = str(value).strip()
    # Remove currency symbols and 'INR' suffix
    s = re.sub(r"[₹\s]", "", s)
    s = re.sub(r"\s*INR\s*$", "", s, flags=re.IGNORECASE)
    try:
        return float(s)
    except ValueError:
        return None


def clean_bhk(value: str | float) -> int | None:
    """Normalize BHK column to integer (1, 2, 3, 4)."""
    if pd.isna(value):
        return None
    s = str(value).strip().upper()
    # Handle '2BHK', '3BHK' formats
    match = re.match(r"(\d+)", s)
    if match:
        return int(match.group(1))
    return None


def clean_floor(value: str | float) -> int | None:
    """Normalize floor to integer ('Ground' -> 0)."""
    if pd.isna(value):
        return None
    s = str(value).strip().lower()
    if s == "ground":
        return 0
    try:
        return int(float(s))
    except ValueError:
        return None


def clean_binary(value: str | float) -> int | None:
    """Normalize yes/no/NO/YES to 1/0."""
    if pd.isna(value):
        return None
    s = str(value).strip().lower()
    if s in ("yes", "1"):
        return 1
    if s in ("no", "0"):
        return 0
    return None


def normalize_location(value: str | float) -> str | None:
    """Standardize location names."""
    if pd.isna(value):
        return None
    s = str(value).strip().title()
    # Alias normalization
    aliases = {
        "Cbd Belapur": "CBD Belapur",
        "Kharghar": "Kharghar",
        "Panvel": "Panvel",
        " Panvel": "Panvel",
    }
    s = s.strip()
    return aliases.get(s, s)


# ---------------------------------------------------------------------------
# Load and clean data
# ---------------------------------------------------------------------------

def load_and_clean() -> pd.DataFrame:
    """Load CSV and return a cleaned DataFrame."""
    print(f"Loading data from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    print(f"Raw shape: {df.shape}")

    # --- Price ---
    df["Actual_Price"] = df["Actual_Price"].apply(clean_price)

    # --- Area ---
    df["Area_sqft"] = pd.to_numeric(df["Area_sqft"], errors="coerce")

    # --- BHK ---
    df["BHK"] = df["BHK"].apply(clean_bhk)

    # --- Bathrooms ---
    df["Bathrooms"] = pd.to_numeric(df["Bathrooms"], errors="coerce")

    # --- Floor ---
    df["Floor"] = df["Floor"].apply(clean_floor)
    df["Total_Floors"] = pd.to_numeric(df["Total_Floors"], errors="coerce")

    # --- Age ---
    df["Age_of_Property"] = pd.to_numeric(df["Age_of_Property"], errors="coerce")

    # --- Binary ---
    df["Parking"] = df["Parking"].apply(clean_binary)
    df["Lift"] = df["Lift"].apply(clean_binary)

    # --- Location ---
    df["Location"] = df["Location"].apply(normalize_location)

    print(f"After type coercion shape: {df.shape}")

    # --- Remove outliers and invalid rows ---
    # Drop rows with no price
    df = df.dropna(subset=["Actual_Price"])
    # Remove negative values (data errors)
    df = df[df["Actual_Price"] > 0]
    df = df[df["Area_sqft"] > 0]
    # Remove extreme outliers (IQR-based)
    Q1 = df["Actual_Price"].quantile(0.01)
    Q3 = df["Actual_Price"].quantile(0.99)
    df = df[(df["Actual_Price"] >= Q1) & (df["Actual_Price"] <= Q3)]
    # Remove negative areas
    df = df[df["Area_sqft"] > 50]
    # Drop rows with no location
    df = df.dropna(subset=["Location"])
    # Remove unknown locations (empty string)
    df = df[df["Location"].str.strip() != ""]

    print(f"After cleaning shape: {df.shape}")
    print(f"Locations: {sorted(df['Location'].unique())}")
    return df


# ---------------------------------------------------------------------------
# Feature engineering
# ---------------------------------------------------------------------------

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create derived features."""
    df = df.copy()
    # Price per sqft (used as reference, NOT as input feature)
    df["price_per_sqft"] = df["Actual_Price"] / df["Area_sqft"]

    # Floor ratio
    df["Floor_Ratio"] = df["Floor"] / (df["Total_Floors"].clip(lower=1))

    # BHK density
    df["BHK_Density"] = df["BHK"] / (df["Area_sqft"] / 100)

    return df


# ---------------------------------------------------------------------------
# Pipeline construction
# ---------------------------------------------------------------------------

NUMERIC_FEATURES = [
    "Area_sqft",
    "BHK",
    "Bathrooms",
    "Floor",
    "Total_Floors",
    "Age_of_Property",
    "Parking",
    "Lift",
    "Floor_Ratio",
    "BHK_Density",
]

CATEGORICAL_FEATURES = ["Location"]

ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
TARGET = "Actual_Price"


def build_pipeline() -> Pipeline:
    """Build sklearn Pipeline with preprocessing + model."""
    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERIC_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES),
        ]
    )
    model = GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.08,
        max_depth=5,
        min_samples_split=5,
        min_samples_leaf=3,
        subsample=0.85,
        random_state=42,
    )
    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
    return pipeline


# ---------------------------------------------------------------------------
# Training & evaluation
# ---------------------------------------------------------------------------

def evaluate(y_true: np.ndarray, y_pred: np.ndarray, split: str = "Test"):
    """Print evaluation metrics."""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    print(f"\n{'='*40}")
    print(f"{split} Metrics")
    print(f"{'='*40}")
    print(f"  MAE  : INR {mae:,.0f}")
    print(f"  RMSE : INR {rmse:,.0f}")
    print(f"  R2   : {r2:.4f}")
    return {"mae": mae, "rmse": rmse, "r2": r2}


def train():
    """Full training pipeline."""
    # 1. Load & clean
    df = load_and_clean()
    df = engineer_features(df)

    # 2. Prepare features
    X = df[ALL_FEATURES].copy()
    y = df[TARGET].values

    print(f"\nFeature matrix shape: {X.shape}")
    print(f"Target range: INR {y.min():,.0f} - INR {y.max():,.0f}")

    # 3. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\nTrain: {X_train.shape[0]} | Test: {X_test.shape[0]}")

    # 4. Build & train pipeline
    pipeline = build_pipeline()
    print("\nTraining GradientBoostingRegressor...")
    pipeline.fit(X_train, y_train)

    # 5. Evaluate
    train_preds = pipeline.predict(X_train)
    test_preds = pipeline.predict(X_test)
    train_metrics = evaluate(y_train, train_preds, "Train")
    test_metrics = evaluate(y_test, test_preds, "Test")

    # 6. Cross-validation
    print("\nRunning 5-fold cross-validation...")
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring="r2")
    print(f"  CV R² scores: {cv_scores}")
    print(f"  CV R² mean: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # 7. Feature importance (from GBR)
    gbr = pipeline.named_steps["model"]
    ohe_cats = (
        pipeline.named_steps["preprocessor"]
        .named_transformers_["cat"]
        .named_steps["onehot"]
        .get_feature_names_out(CATEGORICAL_FEATURES)
        .tolist()
    )
    feature_names = NUMERIC_FEATURES + ohe_cats
    importances = dict(
        zip(feature_names, gbr.feature_importances_.tolist())
    )
    top_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:10]
    print("\nTop 10 Feature Importances:")
    for name, imp in top_features:
        print(f"  {name:40s}: {imp:.4f}")

    # 8. Export model
    joblib.dump(pipeline, MODEL_PATH)
    print(f"\nModel saved to: {MODEL_PATH}")

    # 9. Export metadata
    locations = sorted(df["Location"].dropna().unique().tolist())
    metadata = {
        "model_version": "1.0.0",
        "algorithm": "GradientBoostingRegressor",
        "numeric_features": NUMERIC_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "all_features": ALL_FEATURES,
        "locations": locations,
        "bhk_options": [1, 2, 3, 4],
        "target": TARGET,
        "train_metrics": {k: round(v, 2) for k, v in train_metrics.items()},
        "test_metrics": {k: round(v, 2) for k, v in test_metrics.items()},
        "cv_r2_mean": round(float(cv_scores.mean()), 4),
        "cv_r2_std": round(float(cv_scores.std()), 4),
        "training_samples": int(X_train.shape[0]),
        "test_samples": int(X_test.shape[0]),
        "price_range_inr": {
            "min": int(y.min()),
            "max": int(y.max()),
            "mean": int(y.mean()),
            "median": int(np.median(y)),
        },
        "top_features": {k: round(v, 4) for k, v in top_features},
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {METADATA_PATH}")
    print("\nTraining complete!")


if __name__ == "__main__":
    train()
