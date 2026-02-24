"use client";

import { useState, useEffect } from "react";
import { getMarketStats } from "@/lib/api";

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getMarketStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load market stats", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) return (
        <div className="space-y-12 animate-reveal">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 glass rounded-3xl animate-pulse"></div>)}
            </div>
            <div className="h-96 glass rounded-3xl animate-pulse"></div>
        </div>
    );
    if (!stats) return null;

    return (
        <div className="space-y-12 sm:space-y-16 mt-8 sm:mt-12 mb-16 sm:mb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                    { label: "Intelligence Nodes", value: stats.overall.total_locations, sub: "Navi Mumbai Clusters" },
                    { label: "Predictive Precision", value: `${(stats.overall.model_r2 * 100).toFixed(1)}%`, sub: "R² Achievement" },
                    { label: "Aggregated Metrics", value: stats.overall.training_samples.toLocaleString(), sub: "Listing Telemetry" },
                    { label: "Market Ceiling", value: "₹2.2 Cr", sub: "Premium Upper Bound" },
                ].map((item, idx) => (
                    <div key={idx} className="animate-reveal glass p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] gold-border hover:bg-white/[0.03] transition-all group" style={{ animationDelay: `${idx * 0.15}s` }}>
                        <p className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2 sm:mb-3 group-hover:gold-text transition-colors">{item.label}</p>
                        <p className="text-2xl sm:text-3xl font-black text-white mb-1">{item.value}</p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                <div className="col-span-1 lg:col-span-2 animate-reveal reveal-delay-2 glass p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] gold-border">
                    <h3 className="text-lg sm:text-xl font-black text-white italic mb-8 sm:mb-10">Market <span className="gold-text">Clustering</span></h3>
                    <div className="space-y-6 sm:space-y-8">
                        {Object.entries(stats.location_stats).map(([loc, data]: [string, any], idx) => (
                            <div key={loc} className="space-y-2 sm:space-y-3 group">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1 sm:gap-0 px-1">
                                    <span className="text-xs sm:text-sm font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-widest">{loc}</span>
                                    <span className="text-[10px] font-black gold-text tracking-widest uppercase">Avg ₹{data.avg_price_sqft} <span className="text-gray-600">/ ft²</span></span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#b8860b] to-[#d4af37] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-500"
                                        style={{ width: `${(data.avg_price_sqft / 20000) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-reveal reveal-delay-3 flex flex-col gap-6 sm:gap-8">
                    <div className="glass p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] gold-border bg-gradient-to-br from-gold-500/5 to-transparent h-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6 sm:mb-8">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 gold-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white italic mb-4 sm:mb-6">Market <span className="gold-text">Intelligence</span></h3>
                        <div className="space-y-6 sm:space-y-8">
                            <div>
                                <p className="text-[9px] font-black text-gold-500 uppercase tracking-[0.3em] mb-2">Alpha Clusters</p>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    <span className="text-white">Vashi</span> and <span className="text-white">Nerul</span> continue to demonstrate high asset liquidity with price points exceeding ₹16k/sqft.
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gold-500 uppercase tracking-[0.3em] mb-2">Growth Nodes</p>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    <span className="text-white">Ulwe</span> and <span className="text-white">Panvel</span> are showing institutional buy-in signals due to upcoming airport completion.
                                </p>
                            </div>
                            <div className="p-4 sm:p-6 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/5 gold-glow">
                                <p className="text-[9px] font-black text-gold-500 uppercase tracking-[0.3em] mb-2 italic">Strategy Brief</p>
                                <p className="text-[11px] text-gray-400 font-medium italic">
                                    Optimal ROI is currently identified in luxury re-developments within Vashi Sectors 9-17.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
