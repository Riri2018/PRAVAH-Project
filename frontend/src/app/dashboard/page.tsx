import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function DashboardPage() {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
            <div className="max-w-3xl mb-16 animate-reveal">
                <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                    <a href="/" className="hover:text-gold-500 transition-colors">Home</a>
                    <span>/</span>
                    <span className="text-gold-500">Market Intelligence</span>
                </div>

                <h1 className="text-5xl font-black text-white mb-6 italic">
                    Market <span className="gold-text uppercase not-italic">Intelligence</span>
                </h1>
                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">
                    Aggregated architectural telemetry and cluster-based pricing indexes. Derived from 2,500+ verified listings across Navi Mumbai nodes.
                </p>
            </div>

            <AnalyticsDashboard />
        </div>
    );
}
