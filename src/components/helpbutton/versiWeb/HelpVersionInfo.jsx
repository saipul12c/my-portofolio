import { Info, Calendar, User, Sparkles, Zap, TrendingUp, Smartphone, Monitor, Tablet } from "lucide-react";
import docsData from "../docs/data/docsSections.json";

export default function HelpVersionInfo() {
  // Ambil versi terbaru dari semua dokumen dengan data enhanced
  const latestSection = docsData?.[docsData.length - 1] || {};
  
  // Extract data dari struktur JSON terbaru
  const versiWebsite = latestSection.version || "v1.0.0";
  const versionCode = latestSection.versionCode || "build-unknown";
  const versionType = latestSection.versionType || "stable";
  const releaseChannel = latestSection.releaseChannel || "production";
  const lastUpdated = latestSection.lastUpdated || "Belum ada data";
  const author = latestSection.author || "Tim Dokumentasi";
  
  // Data compatibility dari JSON terbaru
  const compatibility = latestSection.compatibility || {};
  const minRequired = compatibility.minRequired || "1.0.0";
  const browserSupport = compatibility.browserSupport || ["chrome 120+", "firefox 118+"];

  // Dapatkan versi tertinggi dari semua dokumen
  const allVersions = docsData?.map(doc => doc.version) || [];
  const highestVersion = allVersions.sort((a, b) => {
    const numA = parseFloat(a.replace('v', ''));
    const numB = parseFloat(b.replace('v', ''));
    return numB - numA;
  })[0] || versiWebsite;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border-2 border-gray-800 
                 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4 
                 sm:p-6 shadow-2xl transition-all duration-500 hover:scale-[1.01]
                 hover:border-purple-500/50 hover:shadow-purple-500/20
                 max-w-md mx-auto sm:max-w-lg lg:max-w-xl"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)
        `
      }}
    >
      {/* Animated Background Elements - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -left-8 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg sm:blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 -right-8 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg sm:blur-xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-2xl sm:blur-3xl opacity-10" />
      </div>

      {/* Floating Particles - Reduced count for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header dengan gaya fresh - Responsive */}
      <header className="relative mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 animate-pulse" />
            <Sparkles className="relative text-white p-1 sm:p-1.5 bg-gray-900 rounded-lg border border-gray-700" 
                     size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight truncate">
              Versi Terbaru 🚀
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
              {versionType} • {releaseChannel}
            </p>
          </div>
        </div>
      </header>

      {/* Konten utama dengan layout modern - Fully responsive */}
      <div className="relative space-y-3 sm:space-y-4">
        {/* Versi Card - Highlight */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur transition-all group-hover:blur-sm" />
          <div className="relative bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/50 group-hover:border-purple-500/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                  <Zap className="text-purple-400" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">Current Version</p>
                  <p className="text-xs text-gray-400 truncate">{versionCode}</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full border border-purple-400/50 shadow-lg text-center">
                  {versiWebsite}
                </span>
                <span className="text-[10px] text-gray-400 text-center sm:text-right">
                  Min: {minRequired}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {/* Last Updated */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Calendar className="text-green-400" size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">Last Updated</p>
                <p className="text-sm font-semibold text-green-300 truncate">{lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <User className="text-blue-400" size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">Managed By</p>
                <p className="text-sm font-semibold text-blue-300 truncate">{author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Compatibility */}
        <div className="bg-gray-800/20 rounded-xl p-2 sm:p-3 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">Browser Support</span>
            <div className="flex gap-1">
              <Smartphone size={12} className="text-gray-400" />
              <Tablet size={12} className="text-gray-400" />
              <Monitor size={12} className="text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {browserSupport.slice(0, 3).map((browser, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300"
              >
                {browser}
              </span>
            ))}
            {browserSupport.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs text-gray-300">
                +{browserSupport.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-800/20 rounded-xl p-2 sm:p-3 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">System Status</span>
            <TrendingUp className="text-green-400" size={12} />
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-1.5 rounded-full animate-pulse"
              style={{ width: '95%' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">Stable</span>
            <span className="text-[10px] text-gray-400">v{highestVersion}</span>
          </div>
        </div>
      </div>

      {/* Footer dengan gaya modern - Responsive */}
      <footer className="relative mt-4 sm:mt-6 pt-3 border-t border-gray-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
            <span className="text-xs text-gray-400 font-medium">All systems operational</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono text-center sm:text-right">
            ©{new Date().getFullYear()} DOCS • {versionType}
          </span>
        </div>
      </footer>
    </section>
  );
}