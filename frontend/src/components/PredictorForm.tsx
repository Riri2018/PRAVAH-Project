"use client";

import { useState, useEffect } from "react";
import { getMetadata, predictPrice, type PredictionResponse } from "@/lib/api";

export default function PredictorForm() {
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        location: "",
        area_sqft: 1000,
        bhk: 2,
        bathrooms: 2,
        floor: 5,
        total_floors: 15,
        age_of_property: 5,
        parking: true,
        lift: true,
    });

    useEffect(() => {
        async function loadMeta() {
            try {
                const meta = await getMetadata();
                setLocations(meta.locations);
                setFormData(prev => ({ ...prev, location: meta.locations[0] }));
            } catch (err) {
                setError("Market Intelligence Link Fault. Ensure ML backend is active.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadMeta();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPredicting(true);
        setResult(null);
        setError(null);

        try {
            const data = await predictPrice(formData);
            setTimeout(() => {
                setResult(data);
                setPredicting(false);
            }, 800); // Cinematic delay
        } catch (err: any) {
            setError(err.message || "An error occurred during market analysis.");
            setPredicting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <div className="w-12 h-12 rounded-full border-t-2 border-gold-500 animate-spin"></div>
                <p className="text-[10px] uppercase tracking-[0.3em] gold-text animate-pulse">Initializing Neural Engine</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-12 mb-24">
            <div className="animate-reveal reveal-delay-1 glass p-10 rounded-[2.5rem] gold-border">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-white italic">
                        Property <span className="gold-text">Attributes</span>
                    </h2>
                    <div className="px-3 py-1 rounded-md bg-gold-500/10 border border-gold-500/20 text-[9px] font-bold text-gold-500 uppercase tracking-widest">
                        G-Boost v1
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { label: "Location Cluster", name: "location", type: "select", options: locations },
                            { label: "Dimensional Area (sq.ft)", name: "area_sqft", type: "number" },
                            { label: "BHK Configuration", name: "bhk", type: "select", options: [1, 2, 3, 4] },
                            { label: "Bathrooms", name: "bathrooms", type: "number", step: "0.5" },
                            { label: "Unit Floor", name: "floor", type: "number" },
                            { label: "Structure Height", name: "total_floors", type: "number" },
                            { label: "Vintage (Years)", name: "age_of_property", type: "number" },
                        ].map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{field.label}</label>
                                {field.type === "select" ? (
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all cursor-pointer hover:bg-white/[0.08]"
                                        value={(formData as any)[field.name]}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: field.name === 'location' ? e.target.value : Number(e.target.value) })}
                                    >
                                        {field.options?.map(opt => (
                                            <option key={opt} value={opt} className="bg-black">{opt} {field.name === 'bhk' ? 'BHK' : ''}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        step={field.step || "1"}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all hover:bg-white/[0.08]"
                                        value={(formData as any)[field.name]}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: Number(e.target.value) })}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-10 py-4 border-y border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-white/10 bg-white/5 text-gold-600 focus:ring-gold-500 transition-all"
                                checked={formData.parking}
                                onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                            />
                            <span className="text-[11px] font-bold text-gray-400 group-hover:text-gold-500/80 transition-colors uppercase tracking-widest">Reserved Parking</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-white/10 bg-white/5 text-gold-600 focus:ring-gold-500 transition-all"
                                checked={formData.lift}
                                onChange={(e) => setFormData({ ...formData, lift: e.target.checked })}
                            />
                            <span className="text-[11px] font-bold text-gray-400 group-hover:text-gold-500/80 transition-colors uppercase tracking-widest">Private Lift</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={predicting}
                        className="gold-button w-full uppercase tracking-[0.2em] text-xs py-5"
                    >
                        {predicting ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
                                Running ML Regressor...
                            </div>
                        ) : "Generate Valuation Report"}
                    </button>
                </form>
            </div>

            <div className="lg:sticky lg:top-32 space-y-8">
                {error && (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-xs font-medium animate-reveal">
                        {error}
                    </div>
                )}

                {result ? (
                    <div className="animate-reveal glass p-10 rounded-[2.5rem] gold-border bg-gradient-to-br from-gold-500/10 to-transparent">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="gold-text text-[10px] uppercase tracking-[0.3em] font-black mb-1">Valuation Summary</h3>
                                <p className="text-white text-xs font-bold uppercase tracking-widest opacity-60">{result.location}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-gold-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 gold-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="text-6xl font-black text-white tracking-tighter mb-2">
                                <span className="gold-text mr-3">₹</span>
                                {result.predicted_price_lakhs} <span className="text-2xl opacity-40">L</span>
                            </div>
                            <p className="text-gray-500 text-sm font-bold tracking-[0.2em]">INR {result.predicted_price_inr.toLocaleString()}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/10 mb-8">
                            <div>
                                <p className="text-[9px] uppercase text-gray-500 font-black tracking-widest mb-1">Unit Valuation</p>
                                <p className="text-lg font-bold text-white italic">₹{result.price_per_sqft_inr.toLocaleString()} <span className="text-[10px] opacity-40">/ft²</span></p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase text-gray-500 font-black tracking-widest mb-1">Model Precision</p>
                                <p className="text-lg font-bold text-gold-500 italic">High Confidence</p>
                            </div>
                        </div>

                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 mb-8">
                            <p className="text-xs text-gray-400 leading-relaxed italic font-medium">
                                "Analysis complete for <span className="text-white">{result.area_sqft} sqft</span> unit in <span className="text-white">{result.location}</span>. Asset performance is consistent with premium node trends."
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                <span>Supportive Market</span>
                                <span>Risk Band</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-gold-500/20 w-1/4"></div>
                                <div className="h-full bg-gold-500 w-1/2 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                                <div className="h-full bg-gold-500/20 w-1/4"></div>
                            </div>
                            <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>₹{result.confidence_range.lower_lakhs}L</span>
                                <span className="gold-text">Market Consensus</span>
                                <span>₹{result.confidence_range.upper_lakhs}L</span>
                            </div>
                        </div>
                    </div>
                ) : !predicting && (
                    <div className="animate-reveal glass p-12 rounded-[2.5rem] h-[550px] flex flex-col items-center justify-center text-center group border-dashed border-white/10 hover:border-gold-500/20 transition-all duration-700">
                        <div className="relative mb-10">
                            <div className="w-24 h-24 bg-gold-500/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                <svg className="w-10 h-10 gold-text opacity-30 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-gold-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <h3 className="text-xl font-black text-white italic mb-3">Model Idle</h3>
                        <p className="text-[10px] text-gray-500 max-w-[200px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                            Awaiting property telemetry to generate market valuation report.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
