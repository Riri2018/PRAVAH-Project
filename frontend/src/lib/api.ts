/**
 * API utility functions for interacting with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface PredictionRequest {
    location: string;
    area_sqft: number;
    bhk: number;
    bathrooms: number;
    floor: number;
    total_floors: number;
    age_of_property: number;
    parking: boolean;
    lift: boolean;
}

export interface PredictionResponse {
    predicted_price_inr: number;
    predicted_price_lakhs: number;
    predicted_price_crores: number;
    price_per_sqft_inr: number;
    confidence_range: {
        lower_inr: number;
        upper_inr: number;
        lower_lakhs: number;
        upper_lakhs: number;
    };
    location: string;
    area_sqft: number;
    bhk: number;
}

export interface MetadataResponse {
    locations: string[];
    bhk_options: number[];
    algorithm: string;
}

/**
 * Fetch model metadata for dropdowns.
 */
export async function getMetadata(): Promise<MetadataResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/metadata`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch metadata");
    return res.json();
}

/**
 * Predict house price.
 */
export async function predictPrice(data: PredictionRequest): Promise<PredictionResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Prediction failed");
    }
    return res.json();
}

/**
 * Fetch market stats for the dashboard.
 */
export async function getMarketStats() {
    const res = await fetch(`${API_BASE_URL}/api/v1/analytics/market-stats`);
    if (!res.ok) throw new Error("Failed to fetch market stats");
    return res.json();
}
