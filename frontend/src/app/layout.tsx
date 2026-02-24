import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pravah | Navi Mumbai Luxury Real Estate AI",
  description: "AI-powered property valuation and market insights for Navi Mumbai's most premium nodes.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} selection:bg-gold-500/30`}>
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center font-black text-black text-lg sm:text-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                P
              </div>
              <span className="text-base sm:text-xl font-black tracking-tight group-hover:gold-text transition-all duration-300">
                PRAVAH <span className="text-[9px] sm:text-[10px] font-light text-gray-500 uppercase tracking-[0.4em] block -mt-1 ml-0.5">Analytics</span>
              </span>
            </a>

            <div className="hidden md:flex items-center space-x-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <a href="/predict" className="hover:text-white transition-colors">Predictor</a>
              <a href="/dashboard" className="hover:text-white transition-colors">Market Stats</a>
              <a href="https://github.com/tony-tiwari" className="hover:text-white transition-colors">Developer</a>
            </div>

            <a href="/predict" className="gold-button text-[9px] sm:text-[10px] py-2 px-4 sm:px-6 uppercase tracking-widest">
              Get Valuation
            </a>
          </div>
        </nav>

        <main className="min-h-screen pt-16 sm:pt-20">
          {children}
        </main>

        <footer className="glass border-t border-white/5 py-12 sm:py-16 mt-16 sm:mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <p className="gold-text text-xl sm:text-2xl mb-3 sm:mb-4">PRAVAH.</p>
              <p className="text-gray-500 max-w-md leading-relaxed text-xs sm:text-sm">
                Empowering property decisions in Navi Mumbai with state-of-the-art Gradient Boosting regressors and real-time market data.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-start md:justify-end gap-4 sm:gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              <span>© 2026 Developed for Navi Mumbai</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
