import React, { memo, useState, useEffect, useCallback } from 'react';
import { 
  MdEmail, MdShare, MdHome, MdInfo, MdFolderOpen, MdMailOutline, 
  MdStar, MdQrCode, MdContentCopy, MdDownload, MdClose 
} from 'react-icons/md';
import { HiClipboardCheck, HiOutlineClipboardCopy } from 'react-icons/hi';
import { FaLanguage } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import QRCode from 'qrcode';
import Avatar from '../ui/Avatar';
import DesktopPlatformCard from '../ui/DesktopPlatformCard';

const DesktopLayout = memo(({
  platformData,
  checkedItems,
  handleCopyEmail,
  handleShare,
  copied,
  navigate,
  stats,
}) => {
  const [hoveredWebNav, setHoveredWebNav] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);

  // Generate QR Code ketika modal dibuka
  useEffect(() => {
    const portalUrl = 'https://syaiful-mukmin.netlify.app/portal';
    
    if (showQRModal && !qrCodeUrl) {
      generateQRCode(portalUrl);
    }
    
    if (!showQRModal) {
      setQrCopied(false);
      setDownloadSuccess(false);
    }
  }, [showQRModal, qrCodeUrl]);

  const generateQRCode = async (text) => {
    try {
      setIsGeneratingQR(true);
      const url = await QRCode.toDataURL(text, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = useCallback(() => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `syaiful-mukmin-portal-qrcode-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  }, [qrCodeUrl]);

  const copyQRCodeLink = useCallback(() => {
    const portalUrl = 'https://syaiful-mukmin.netlify.app/portal';
    navigator.clipboard.writeText(portalUrl).then(() => {
      setQrCopied(true);
      setTimeout(() => setQrCopied(false), 2000);
    });
  }, []);

  const webNavigationItems = [
    { id: 'home', label: 'Home', icon: MdHome, color: 'from-cyan-600/20 to-blue-600/20', hoverColor: 'border-cyan-500/50', tooltip: 'Kembali ke halaman utama' },
    { id: 'about', label: 'Tentang', icon: MdInfo, color: 'bg-gray-800/50', hoverColor: 'border-gray-600', tooltip: 'Pelajari tentang saya' },
    { id: 'portfolio', label: 'Portfolio', icon: MdFolderOpen, color: 'bg-gray-800/50', hoverColor: 'border-gray-600', tooltip: 'Lihat proyek saya' },
    { id: 'contact', label: 'Kontak', icon: MdMailOutline, color: 'bg-gray-800/50', hoverColor: 'border-gray-600', tooltip: 'Hubungi saya' },
  ];

  const platformStats = [
    { name: 'Instagram', value: 35, color: '#A78BFA', engagement: '2.5M', change: '+12.5%', icon: '📸' },
    { name: 'TikTok', value: 28, color: '#60A5FA', engagement: '1.8M', change: '+8.3%', icon: '🎵' },
    { name: 'YouTube', value: 22, color: '#34D399', engagement: '1.2M', change: '+5.7%', icon: '▶️' },
    { name: 'Twitter', value: 10, color: '#FBBF24', engagement: '850K', change: '+2.1%', icon: '🐦' },
    { name: 'Facebook', value: 5, color: '#F87171', engagement: '350K', change: '-1.2%', icon: '👥' }
  ];

  const monthlyData = [
    { month: 'Jan', connections: 150, reach: 800, engagements: 320, posts: 12 },
    { month: 'Feb', connections: 180, reach: 950, engagements: 380, posts: 15 },
    { month: 'Mar', connections: 200, reach: 1100, engagements: 440, posts: 18 },
    { month: 'Apr', connections: 220, reach: 1200, engagements: 480, posts: 20 },
    { month: 'May', connections: 245, reach: 1300, engagements: 520, posts: 22 },
    { month: 'Jun', connections: 280, reach: 1400, engagements: 560, posts: 19 },
    { month: 'Jul', connections: 310, reach: 1550, engagements: 620, posts: 24 },
    { month: 'Aug', connections: 340, reach: 1700, engagements: 680, posts: 26 },
    { month: 'Sep', connections: 380, reach: 1850, engagements: 740, posts: 28 },
    { month: 'Oct', connections: 420, reach: 2000, engagements: 800, posts: 25 },
    { month: 'Nov', connections: 460, reach: 2150, engagements: 860, posts: 30 },
    { month: 'Dec', connections: 500, reach: 2300, engagements: 920, posts: 32 }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
        {/* Background grid */}
        <div className="fixed inset-0 bg-grid-white/5 bg-grid-16" />
        
        {/* Glow effects */}
        <div className="fixed top-1/4 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="fixed bottom-1/4 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-6">
              <Avatar />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  Muhammad Syaiful Mukmin
                </h1>
                <p className="text-gray-400 mb-1">Digital Creator & Developer</p>
                <p className="text-gray-500 text-sm">Manage all your social connections in one place</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group"
              >
                <MdEmail className="w-4 h-4 text-purple-400 group-hover:animate-pulse" />
                <span className="text-white">hello@yourworld.com</span>
                {copied ? (
                  <HiClipboardCheck className="w-4 h-4 text-green-400 animate-bounce" />
                ) : (
                  <HiOutlineClipboardCopy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg border border-emerald-500/50 font-medium text-white hover:opacity-90 transition-opacity hover:scale-105 active:scale-95"
                title="Generate QR Code"
              >
                <MdQrCode className="w-4 h-4" />
                QR Code
              </button>
              
              <button
                onClick={handleShare}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:opacity-90 transition-opacity hover:scale-105 active:scale-95"
              >
                Share
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left sidebar - Profile & Stats */}
            <div className="w-80 space-y-6">
              {/* Profile card */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <span className="text-gray-400">Total Platforms</span>
                    <span className="text-white font-semibold">{Object.keys(platformData).length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <span className="text-gray-400">Connected</span>
                    <span className="text-green-400 font-semibold">
                      {Object.values(checkedItems).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <span className="text-gray-400">Profile Views</span>
                    <span className="text-white font-semibold">1.2K</span>
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate("/cv-saya")}
                    className="w-full py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-white font-medium hover:border-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Liat CV saya
                  </button>
                            
                  <button
                    onClick={() => navigate("/testimoni")}
                    className="w-full py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Liat Testimoni
                  </button>

                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-lg text-white font-medium hover:border-emerald-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <MdQrCode className="w-4 h-4" />
                    Generate QR Code
                  </button>
                </div>
              </div>
              
              {/* Connection Status */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Connection Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Connections</span>
                    <span className="text-green-400 font-medium">Excellent</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full w-3/4 transition-all duration-1000 ease-out"
                      style={{ width: `${(Object.values(checkedItems).filter(Boolean).length / Object.keys(checkedItems).length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Top Skills */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MdStar className="w-5 h-5 text-yellow-400 animate-pulse" />
                  Top Skills
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">Komunikasi Efektif</span>
                      <span className="text-xs text-gray-400">95%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-500 to-pink-400 h-1.5 rounded-full w-[95%] transition-all duration-1000 ease-out" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">Kreativitas</span>
                      <span className="text-xs text-gray-400">90%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-1.5 rounded-full w-[90%] transition-all duration-1000 ease-out" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">Kolaborasi Tim</span>
                      <span className="text-xs text-gray-400">85%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full w-[85%] transition-all duration-1000 ease-out" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/softskills")}
                  className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Languages */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaLanguage className="w-5 h-5 text-blue-400" />
                  Languages
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">🇮🇩 Indonesia</span>
                      <span className="text-xs text-green-400 font-medium">Native</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full w-full transition-all duration-1000 ease-out" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">🇺🇸 English</span>
                      <span className="text-xs text-blue-400 font-medium">Advanced</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full w-[80%] transition-all duration-1000 ease-out" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">🎭 Jawa</span>
                      <span className="text-xs text-yellow-400 font-medium">Intermediate</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-1.5 rounded-full w-[60%] transition-all duration-1000 ease-out" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/bahasa")}
                  className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Education */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  Education
                </h3>
                <div className="space-y-3">
                  <div className="text-sm hover:bg-gray-800/30 p-2 rounded-lg transition-colors cursor-pointer">
                    <p className="text-white font-medium text-sm">S1 Pendidikan Guru</p>
                    <p className="text-gray-400 text-xs">Universitas Pendidikan Indonesia</p>
                    <p className="text-gray-500 text-xs mt-1">2017 - 2021 | GPA: 3.85</p>
                  </div>
                  <div className="text-sm hover:bg-gray-800/30 p-2 rounded-lg transition-colors cursor-pointer">
                    <p className="text-white font-medium text-sm">Magister Pendidikan Dasar</p>
                    <p className="text-gray-400 text-xs">Universitas Negeri Jakarta</p>
                    <p className="text-gray-500 text-xs mt-1">2023 - Sekarang</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/pendidikan")}
                  className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Certificates */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  Certificates
                </h3>
                <div className="space-y-2">
                  <div className="text-xs flex items-center justify-between hover:bg-gray-800/30 p-2 rounded transition-colors cursor-pointer">
                    <span className="text-gray-300">Front-End Web Development</span>
                    <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">2024</span>
                  </div>
                  <div className="text-xs flex items-center justify-between hover:bg-gray-800/30 p-2 rounded transition-colors cursor-pointer">
                    <span className="text-gray-300">UI/UX Design Fundamentals</span>
                    <span className="text-pink-400 text-xs bg-pink-500/20 px-2 py-1 rounded">2023</span>
                  </div>
                  <div className="text-xs flex items-center justify-between hover:bg-gray-800/30 p-2 rounded transition-colors cursor-pointer">
                    <span className="text-gray-300">AI for Everyone</span>
                    <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-1 rounded">2024</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/sertifikat")}
                  className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Hobbies */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  Hobbies
                </h3>
                <div className="space-y-2">
                  <div className="text-xs hover:bg-gray-800/30 p-2 rounded transition-colors cursor-pointer">
                    <span className="text-gray-300">📷 Fotografi</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full w-3/4" />
                      </div>
                      <span className="text-gray-400 text-xs">75%</span>
                    </div>
                  </div>
                  <div className="text-xs hover:bg-gray-800/30 p-2 rounded transition-colors cursor-pointer">
                    <span className="text-gray-300">🎬 Editing Video Dokumenter</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-1.5 rounded-full w-2/5" />
                      </div>
                      <span className="text-gray-400 text-xs">40%</span>
                    </div>
                  </div>
                  <div className="text-xs hover:bg-gray-800/30 p-2 rounded transition-colors cursor-pointer">
                    <span className="text-gray-300">✏️ Menulis Blog Edukasi</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full w-3/5" />
                      </div>
                      <span className="text-gray-400 text-xs">60%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/hobbies")}
                  className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Lihat semua →
                </button>
              </div>
            </div>

            {/* Main content - Platforms grid */}
            <div className="flex-1">
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Social Platforms</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/projects")}
                      className="px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-gray-700 transition-colors hover:scale-105 active:scale-95"
                    >
                      Projek
                    </button>

                    <button
                      onClick={() => navigate("/contact")}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity hover:scale-105 active:scale-95"
                    >
                      Hubungi Admin Sekarang
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(platformData).map(([key, data]) => (
                    <DesktopPlatformCard
                      key={key}
                      platform={key.charAt(0).toUpperCase() + key.slice(1)}
                      icon={data.icon}
                      color={data.color}
                      description={`Follow on ${key}`}
                      url={data.url}
                    />
                  ))}
                </div>
                
                {/* Website Navigation Section */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm font-medium mb-4">Navigasi Website</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {webNavigationItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <button
                          onMouseEnter={() => setHoveredWebNav(item.id)}
                          onMouseLeave={() => setHoveredWebNav(null)}
                          onClick={() => navigate(`/${item.id === 'home' ? '' : item.id}`)}
                          className={`w-full px-4 py-3 ${item.color} border ${
                            item.id === 'home' ? 'border-cyan-500/30 hover:border-cyan-500/50' : 'border-gray-700 hover:border-gray-600'
                          } rounded-lg text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center gap-2`}
                        >
                          <item.icon className="w-4 h-4 group-hover:animate-bounce" />
                          {item.label}
                        </button>
                        {hoveredWebNav === item.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                            {item.tooltip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* About Syaiful Mukmin Section */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                    <h3 className="text-white font-semibold text-base mb-3">👋 Tentang Syaiful Mukmin</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Muhammad Syaiful Mukmin adalah seorang digital creator dan developer passionate yang berkomitmen untuk menciptakan solusi inovatif dan konten berkualitas tinggi. Dengan pengalaman di berbagai platform digital, Syaiful terus belajar dan berkembang dalam industri teknologi.
                    </p>
                    <button
                      onClick={() => navigate("/about")}
                      className="px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-white text-sm font-medium hover:border-purple-500 transition-all hover:scale-105 active:scale-95"
                    >
                      Selengkapnya →
                    </button>
                  </div>
                </div>
                
                {/* Stats overview */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-bold text-white mb-6">📊 Statistics Overview</h3>
                                    
                  {/* Bar Chart - Monthly Growth */}
                  <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-6 hover:border-gray-700 transition-colors">
                    <h4 className="text-white font-semibold mb-4 text-sm">Monthly Growth (Trend year to year)</h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #4B5563', 
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                          labelStyle={{ color: '#FFF', fontWeight: 'bold' }}
                          formatter={(value, name) => {
                            if (name === 'reach' || name === 'engagements') return [`${value}K`, name];
                            if (name === 'connections') return [value, 'Connections'];
                            if (name === 'posts') return [value, 'Posts'];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <Bar dataKey="connections" fill="#A78BFA" radius={[8, 8, 0, 0]} name="Connections" />
                        <Bar dataKey="reach" fill="#60A5FA" radius={[8, 8, 0, 0]} name="Reach (K)" />
                        <Bar dataKey="engagements" fill="#10B981" radius={[8, 8, 0, 0]} name="Engagements (K)" />
                        <Bar dataKey="posts" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Posts" />
                      </BarChart>
                    </ResponsiveContainer>
                        
                    {/* Additional Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Growth</div>
                        <div className="text-2xl font-bold text-white">233%</div>
                        <div className="text-green-500 text-xs flex items-center mt-1">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          +12.5% from last year
                        </div>
                      </div>
                        
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Avg. Engagement</div>
                        <div className="text-2xl font-bold text-white">4.8%</div>
                        <div className="text-green-500 text-xs flex items-center mt-1">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          +1.2% from last month
                        </div>
                      </div>
                        
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Best Month</div>
                        <div className="text-2xl font-bold text-white">December</div>
                        <div className="text-gray-400 text-xs mt-1">920K engagements</div>
                      </div>
                        
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Posts</div>
                        <div className="text-2xl font-bold text-white">271</div>
                        <div className="text-blue-400 text-xs mt-1">+32 from last year</div>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all hover:scale-[1.02] cursor-pointer">
                      <p className="text-3xl font-bold text-white mb-2">{stats.connections}</p>
                      <p className="text-gray-400 text-sm">Total Connections</p>
                      <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
                        <span className="animate-pulse">↑</span> 12.5% dari bulan lalu
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/60 transition-all hover:scale-[1.02] cursor-pointer">
                      <p className="text-3xl font-bold text-white mb-2">{stats.reach}</p>
                      <p className="text-gray-400 text-sm">Total Reach</p>
                      <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
                        <span className="animate-pulse">↑</span> 9.1% dari bulan lalu
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500/60 transition-all hover:scale-[1.02] cursor-pointer">
                      <p className="text-3xl font-bold text-white mb-2">{stats.engagement}</p>
                      <p className="text-gray-400 text-sm">Engagement Rate</p>
                      <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
                        <span className="animate-pulse">↑</span> 2.3% dari bulan lalu
                      </div>
                    </div>
                  </div>
                  
                  {/* Engagement Pie Chart - Enhanced */}
                  <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-white font-semibold text-lg group-hover:text-white flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          Engagement Distribution
                          <span className="text-xs font-normal text-gray-400 ml-2">Last 30 days</span>
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">Total engagement across all platforms</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span>Social Media</span>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                      {/* Chart Container */}
                      <div className="relative">
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <defs>
                              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(167, 139, 250, 0.3)"/>
                              </filter>
                            </defs>

                            <Pie
                              data={platformStats}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              
                                if (value > 15) {
                                  return (
                                    <text 
                                      x={x} 
                                      y={y} 
                                      fill="white" 
                                      textAnchor={x > cx ? 'start' : 'end'} 
                                      dominantBaseline="central"
                                      className="font-bold text-sm"
                                    >
                                      {value}%
                                    </text>
                                  );
                                }
                                return null;
                              }}
                              outerRadius={95}
                              innerRadius={60}
                              paddingAngle={2}
                              cornerRadius={8}
                              dataKey="value"
                              animationDuration={1500}
                              animationBegin={500}
                              animationEasing="ease-out"
                              filter="url(#shadow)"
                            >
                              {platformStats.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color}
                                  stroke="#1F2937"
                                  strokeWidth={2}
                                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                />
                              ))}
                            </Pie>
                            
                            {/* Center text */}
                            <text 
                              x="50%" 
                              y="45%" 
                              textAnchor="middle" 
                              dominantBaseline="middle" 
                              className="text-2xl font-bold fill-white"
                            >
                              100%
                            </text>
                            <text 
                              x="50%" 
                              y="55%" 
                              textAnchor="middle" 
                              dominantBaseline="middle" 
                              className="text-sm fill-gray-400"
                            >
                              Total Engagement
                            </text>
                            
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div 
                                          className="w-4 h-4 rounded-full" 
                                          style={{ backgroundColor: data.color }}
                                        />
                                        <span className="font-bold text-white">{data.name}</span>
                                        <span className="ml-auto font-bold text-lg" style={{ color: data.color }}>
                                          {data.value}%
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-300">
                                        <div className="flex justify-between mb-1">
                                          <span>Engagement:</span>
                                          <span className="font-semibold">{data.engagement}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Share:</span>
                                          <span className="font-semibold">{data.value}% of total</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />

                            <Legend 
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value) => (
                                <span className="text-sm text-gray-300 pl-1">{value}</span>
                              )}
                              iconType="circle"
                              iconSize={10}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                            
                      {/* Platform Stats List */}
                      <div className="space-y-4">
                        {platformStats.map((platform) => (
                          <div 
                            key={platform.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-lg">{platform.icon}</div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">{platform.name}</span>
                                  <span 
                                    className={`text-xs px-2 py-1 rounded-full ${platform.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                  >
                                    {platform.change}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400">{platform.engagement} engagements</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">{platform.value}%</div>
                                <div className="text-xs text-gray-400">share</div>
                              </div>
                              <div 
                                className="w-3 h-3 rounded-full transition-transform group-hover/item:scale-125"
                                style={{ backgroundColor: platform.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                      
                    {/* Footer Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-gray-400">Highest:</span>
                        <span className="text-white font-medium">Instagram (2.5M)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-400">Fastest Growing:</span>
                        <span className="text-white font-medium">TikTok (+8.3%)</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-gray-400">Updated:</span>
                        <span className="text-white">Just now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Desktop - LANDSCAPE LAYOUT */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 max-w-3xl w-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-white">Portal Profile QR Code</h3>
                <p className="text-gray-400 text-sm">Scan untuk mengunjungi portal di perangkat mobile</p>
              </div>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content - Landscape Layout */}
            <div className="flex flex-col md:flex-row">
              {/* Left Side - QR Code */}
              <div className="md:w-1/2 p-8 border-r border-gray-800 flex flex-col items-center justify-center">
                <div className="relative bg-white p-4 rounded-xl mb-6 w-64 h-64 flex items-center justify-center">
                  {isGeneratingQR ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600 text-sm">Generating QR Code...</p>
                    </div>
                  ) : qrCodeUrl ? (
                    <>
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code Portal Muhammad Syaiful Mukmin"
                        className="w-full h-full"
                      />
                      {/* Logo overlay */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            SM
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <MdQrCode className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 text-sm">Preparing QR Code...</p>
                    </div>
                  )}
                </div>
                
                {/* Title under QR Code */}
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-white mb-1">SM</div>
                  <div className="text-gray-400 text-sm">Portal Muhammad Syaiful Mukmin</div>
                </div>
              </div>
              
              {/* Right Side - Info and Actions */}
              <div className="md:w-1/2 p-8">
                {/* Link Display */}
                <div className="mb-8">
                  <div className="text-gray-400 text-sm font-medium mb-3">LINK PORTAL:</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <p className="text-white text-sm font-mono break-all">https://syaiful-mukmin.netlify.app/portal</p>
                    </div>
                    <button
                      onClick={copyQRCodeLink}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity min-w-[100px] justify-center"
                    >
                      {qrCopied ? (
                        <>
                          <HiClipboardCheck className="w-5 h-5 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <MdContentCopy className="w-5 h-5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={downloadQRCode}
                    disabled={!qrCodeUrl}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      qrCodeUrl 
                        ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-600/30 cursor-pointer' 
                        : 'bg-gray-800/50 border-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${qrCodeUrl ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
                        <MdDownload className={`w-5 h-5 ${qrCodeUrl ? 'text-emerald-400' : 'text-gray-500'}`} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${qrCodeUrl ? 'text-white' : 'text-gray-400'}`}>
                          {downloadSuccess ? 'Downloaded!' : 'Download PNG'}
                        </div>
                        <div className="text-xs text-gray-400">High Quality 320x320px</div>
                      </div>
                    </div>
                    {qrCodeUrl && (
                      <div className="text-emerald-400 text-sm font-medium">→</div>
                    )}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:border-purple-500/60 hover:bg-purple-600/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <MdShare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white">Share Portal</div>
                        <div className="text-xs text-gray-400">Via Social Media</div>
                      </div>
                    </div>
                    <div className="text-purple-400 text-sm font-medium">→</div>
                  </button>
                </div>
                
                {/* Instructions */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="text-gray-400 text-sm font-medium mb-3">📱 Cara Menggunakan:</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-lg font-bold text-white mb-1">1</div>
                      <p className="text-gray-400 text-xs">Buka kamera atau scanner QR</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-lg font-bold text-white mb-1">2</div>
                      <p className="text-gray-400 text-xs">Arahkan ke QR Code</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-lg font-bold text-white mb-1">3</div>
                      <p className="text-gray-400 text-xs">Klik link yang muncul</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-gray-900/50 border-t border-gray-800">
              <p className="text-gray-500 text-xs text-center">
                QR Code ini mengarah ke portal utama: <span className="text-emerald-400">syaiful-mukmin.netlify.app/portal</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

DesktopLayout.displayName = 'DesktopLayout';

export default DesktopLayout;