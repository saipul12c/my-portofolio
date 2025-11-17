import { useState } from "react";
import { 
  Rocket, 
  Calendar, 
  Users, 
  Cpu, 
  Shield, 
  Globe, 
  Download,
  Zap,
  TrendingUp,
  Code2,
  Layers,
  Smartphone,
  Monitor
} from "lucide-react";
import docsData from "../docs/data/docsSections.json";

export default function HelpVersionInfo() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ambil data terbaru dan hitung statistik
  const latestSection = docsData?.[docsData.length - 1] || {};
  const totalSections = docsData?.length || 0;
  
  // Hitung jumlah versi major
  const majorVersions = docsData?.filter(doc => 
    doc.versionType === 'major' || doc.version?.startsWith('2.')
  ).length || 0;

  // Extract data
  const versiWebsite = latestSection.version || "v1.0.0";
  const versionCode = latestSection.versionCode || "build-unknown";
  const versionType = latestSection.versionType || "stable";
  const lastUpdated = latestSection.lastUpdated || "Belum ada data";
  const author = latestSection.author || "Tim Dokumentasi";
  const estimatedReadTime = latestSection.estimatedReadTime || "5 menit";
  
  // Data compatibility
  const compatibility = latestSection.compatibility || {};
  const minRequired = compatibility.minRequired || "1.0.0";
  const testedUpTo = compatibility.testedUpTo || "1.0.0";
  const browserSupport = compatibility.browserSupport || ["chrome 120+", "firefox 118+"];
  const apiCompatibility = compatibility.apiCompatibility || "v1";

  // Status warna berdasarkan version type
  const getVersionColor = () => {
    switch (versionType) {
      case 'major': return 'from-red-500 to-orange-500';
      case 'stable': return 'from-green-500 to-emerald-500';
      case 'beta': return 'from-blue-500 to-cyan-500';
      case 'alpha': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = () => {
    switch (versionType) {
      case 'major': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'stable': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'beta': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'alpha': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-gray-700/50 
                 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 
                 shadow-2xl transition-all duration-500 hover:shadow-purple-500/10
                 max-w-2xl mx-auto backdrop-blur-sm"
      style={{
        backgroundImage: `
          radial-gradient(circle at 0% 0%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 100% 0%, rgba(255, 119, 198, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, rgba(120, 220, 198, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 0% 100%, rgba(255, 220, 100, 0.02) 0%, transparent 50%)
        `
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-5 transition-all duration-1000 ${
            isHovered ? 'scale-150 opacity-10' : ''
          }`}
        />
        <div 
          className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-5 transition-all duration-1000 delay-300 ${
            isHovered ? 'scale-150 opacity-10' : ''
          }`}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }} 
      />

      {/* Header Section */}
      <header className="relative mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${getVersionColor()} rounded-xl blur-md opacity-60 ${
                isHovered ? 'scale-110' : ''
              } transition-transform duration-300`} />
              <div className="relative p-2 bg-gray-800/80 rounded-xl border border-gray-600/50 backdrop-blur-sm">
                <Rocket className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                System Version
              </h1>
              <p className="text-sm text-gray-400">Platform Documentation</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full border backdrop-blur-sm text-xs font-medium transition-all duration-300 ${
            getStatusColor()
          } ${isHovered ? 'scale-105' : ''}`}>
            {versionType.toUpperCase()}
          </div>
        </div>

        {/* Version Badge */}
        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r ${getVersionColor()} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500`} />
          <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/50 group-hover:border-gray-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-400 font-mono">Build</span>
                </div>
                <p className="text-lg font-bold text-white font-mono">{versionCode}</p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="text-sm text-gray-400">Release</span>
                  <Zap className="text-yellow-400" size={16} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {versiWebsite}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Stats Column */}
        <div className="space-y-4">
          {/* Last Updated */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-green-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Calendar className="text-green-400" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-base font-semibold text-green-300">{lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Author Team */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="text-blue-400" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Development Team</p>
                <p className="text-base font-semibold text-blue-300 truncate">{author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Column */}
        <div className="space-y-4">
          {/* API Version */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Cpu className="text-purple-400" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-400">API Compatibility</p>
                <p className="text-base font-semibold text-purple-300">{apiCompatibility}</p>
              </div>
            </div>
          </div>

          {/* Read Time */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-orange-500/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="text-orange-400" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Estimated Read</p>
                <p className="text-base font-semibold text-orange-300">{estimatedReadTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="text-gray-400" size={18} />
          <h3 className="text-sm font-semibold text-gray-300">System Requirements</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-600/50">
            <div className="flex items-center gap-2 mb-2">
              <Download className="text-gray-400" size={14} />
              <span className="text-xs text-gray-400 font-medium">Min Required</span>
            </div>
            <p className="text-sm font-mono text-white">{minRequired}</p>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-600/50">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="text-gray-400" size={14} />
              <span className="text-xs text-gray-400 font-medium">Tested Up To</span>
            </div>
            <p className="text-sm font-mono text-white">{testedUpTo}</p>
          </div>
        </div>
      </div>

      {/* Browser Support */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="text-gray-400" size={18} />
          <h3 className="text-sm font-semibold text-gray-300">Browser Support</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {browserSupport.map((browser, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800/40 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-1">
                {browser.includes('chrome') && <Monitor className="text-red-400" size={12} />}
                {browser.includes('firefox') && <Globe className="text-orange-400" size={12} />}
                {browser.includes('safari') && <Smartphone className="text-blue-400" size={12} />}
                {browser.includes('edge') && <Monitor className="text-blue-300" size={12} />}
              </div>
              <span className="text-xs font-medium text-gray-300">{browser}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <footer className="relative pt-4 border-t border-gray-700/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{totalSections}</p>
            <p className="text-xs text-gray-400">Sections</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{majorVersions}</p>
            <p className="text-xs text-gray-400">Major Releases</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{docsData?.length || 0}</p>
            <p className="text-xs text-gray-400">Total Docs</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">All systems operational</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {new Date().getFullYear()} • v{versiWebsite}
          </span>
        </div>
      </footer>
    </section>
  );
}