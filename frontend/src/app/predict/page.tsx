import PredictorForm from "@/components/PredictorForm";

export default function PredictPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
            <div className="max-w-3xl mb-12 sm:mb-16 animate-reveal">
                <div className="flex items-center gap-2 mb-6 sm:mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                    <a href="/" className="hover:text-gold-500 transition-colors">Home</a>
                    <span>/</span>
                    <span className="text-gold-500">Predictor</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 italic">
                    AI <span className="gold-text uppercase not-italic">Valuation</span>
                </h1>
                <p className="text-gray-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                    Deploying high-frequency market data and Gradient Boosting architectures to provide clinical accuracy in residential property appraisals.
                </p>
            </div>

            <PredictorForm />

            <div className="mt-16 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-16 border-t border-white/5 pt-12 sm:pt-24 animate-reveal reveal-delay-3">
                {[
                    { title: "Methodology", desc: "Our ensemble regressor processes 15+ feature vectors including node liquidity and dimensional aging." },
                    { title: "Precision", desc: "Sustaining a 0.94 R² coefficient, delivering confidence intervals within ±7% for prime clusters." },
                    { title: "Indicated Value", desc: "Valuations are index-adjusted to reflect the Q1 2026 Navi Mumbai luxury market surge." }
                ].map((item, i) => (
                    <div key={i} className="space-y-3 sm:space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">{item.title}</h4>
                        <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed font-medium">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
