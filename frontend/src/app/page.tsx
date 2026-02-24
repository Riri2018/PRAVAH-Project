import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden pt-6 sm:pt-12 pb-16 sm:pb-24">
      {/* Cinematic Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2600"
          alt="Navi Mumbai Skyline"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-2xl pt-12 sm:pt-24 pb-8 sm:pb-12">
          <div className="animate-reveal reveal-delay-1 inline-flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-md mb-6 sm:mb-8">
            <span className="flex h-2 w-2 rounded-full bg-gold-500 animate-pulse"></span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gold-500/80">Premium Market Intelligence v1.0</span>
          </div>

          <h1 className="animate-reveal reveal-delay-2 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 sm:mb-8 leading-[1.1]">
            The Standard for <br />
            <span className="gold-text">Navi Mumbai</span> <br />
            Real Estate AI.
          </h1>

          <p className="animate-reveal reveal-delay-3 text-base sm:text-lg leading-relaxed text-gray-400 mb-8 sm:mb-12 max-w-xl">
            Experience unparalleled accuracy in property valuation. Driven by deep-learning regressors trained on 2,500+ ultra-luxury listings across Navi Mumbai's elite nodes.
          </p>

          <div className="animate-reveal reveal-delay-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-x-8">
            <Link href="/predict" className="gold-button text-center">
              Explore Valuations
            </Link>
            <Link href="/dashboard" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors flex items-center justify-center group">
              Market Intelligence <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Cinematic Cards */}
        <div className="mt-16 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Proprietary AI",
              desc: "Custom Gradient Boosting pipeline optimized for Navi Mumbai clusters.",
              stat: "94% Accuracy",
              color: "from-gold-600/20"
            },
            {
              title: "Elite Node Coverage",
              desc: "Deep data on Vashi, Kharghar, Nerul, and Belapur's luxury high-rises.",
              stat: "15+ Locations",
              color: "from-amber-600/20"
            },
            {
              title: "Real-time Delta",
              desc: "Market indexes calibrated hourly to capture the latest inflation trends.",
              stat: "Live Data",
              color: "from-blue-600/20"
            }
          ].map((item, i) => (
            <div
              key={i}
              className={`animate-reveal glass p-6 sm:p-8 rounded-2xl sm:rounded-3xl group relative overflow-hidden bg-gradient-to-br ${item.color} to-transparent border-white/5 transition-all duration-500 hover:border-gold-500/30`}
              style={{ animationDelay: `${0.4 + (i * 0.2)}s` }}
            >
              <div className="relative z-10">
                <p className="gold-text text-xs sm:text-sm mb-2">{item.stat}</p>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3 group-hover:gold-text transition-all">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gold-500/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-gold-500/10 transition-all"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
