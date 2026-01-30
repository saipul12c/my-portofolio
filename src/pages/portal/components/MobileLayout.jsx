import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdShare, MdQrCode, MdHome, MdInfo, MdFolderOpen, MdMailOutline, MdContentCopy, MdDownload } from 'react-icons/md';
import { HiOutlineClipboardCopy, HiClipboardCheck } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Avatar from '../ui/Avatar';
import MobilePlatformCard from '../ui/MobilePlatformCard';

// Import QR Code generator
import QRCode from 'qrcode';

const MobileLayout = memo(({
  platformData,
  handleCopyEmail,
  handleShare,
  copied,
  activeTab,
  setActiveTab,
  stats
}) => {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [hoveredWebNav, setHoveredWebNav] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate QR Code URL
  useEffect(() => {
    const portalUrl = 'https://syaiful-mukmin.netlify.app/portal';
    
    if (showQRModal && !qrCodeUrl) {
      generateQRCode(portalUrl);
    }
  }, [showQRModal, qrCodeUrl]);

  const generateQRCode = async (text) => {
    try {
      setIsGenerating(true);
      const url = await QRCode.toDataURL(text, {
        width: 256,
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
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `syaiful-mukmin-portal-qrcode-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const copyQRCodeLink = () => {
    const portalUrl = 'https://syaiful-mukmin.netlify.app/portal';
    navigator.clipboard.writeText(portalUrl).then(() => {
      alert('Link portal berhasil disalin!');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-4 pb-20">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-center mb-6">
          <Avatar />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Muhammad Syaiful Mukmin
          </h1>
          <p className="text-gray-400 mb-6">Digital Creator & Developer</p>
          
          {/* Email card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 max-w-md mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <MdEmail className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Contact Email</p>
                  <p className="text-sm text-white font-medium truncate">hello@yourworld.com</p>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`p-2 rounded-lg flex-shrink-0 transition-colors ${copied ? 'bg-green-500/20' : 'bg-gray-800 hover:bg-gray-700'}`}
                aria-label={copied ? 'Copied' : 'Copy email'}
              >
                {copied ? (
                  <HiClipboardCheck className="w-5 h-5 text-green-400" />
                ) : (
                  <HiOutlineClipboardCopy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-1 max-w-md mx-auto">
          {['social', 'links', 'stats', 'website'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="max-w-md mx-auto">
          {activeTab === 'social' && (
            <div className="space-y-3">
              {Object.entries(platformData).slice(0, 5).map(([key, data]) => (
                <MobilePlatformCard
                  key={key}
                  platform={key.charAt(0).toUpperCase() + key.slice(1)}
                  icon={data.icon}
                  username={data.username}
                  url={data.url}
                />
              ))}
              
              {/* About Syaiful Mukmin Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
                  <h3 className="text-white font-semibold text-sm mb-2">👋 Tentang Syaiful Mukmin</h3>
                  <p className="text-gray-300 text-xs leading-relaxed mb-3">
                    Muhammad Syaiful Mukmin adalah seorang digital creator dan developer passionate yang berkomitmen untuk menciptakan solusi inovatif dan konten berkualitas tinggi. Dengan pengalaman di berbagai platform digital, Syaiful terus belajar dan berkembang dalam industri teknologi.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/about")}
                      className="flex-1 px-3 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-white text-xs font-medium hover:border-purple-500 transition-colors"
                    >
                      Selengkapnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-3">
              {Object.entries(platformData).slice(5).map(([key, data]) => (
                <MobilePlatformCard
                  key={key}
                  platform={key.charAt(0).toUpperCase() + key.slice(1)}
                  icon={data.icon}
                  username={data.username}
                  url={data.url}
                />
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 bg-gradient-to-br from-purple-600/20 to-transparent rounded-xl border border-purple-500/30">
                  <p className="text-2xl font-bold text-white">{stats.connections}</p>
                  <p className="text-xs text-gray-400 mt-1">Connections</p>
                  <p className="text-xs text-green-400 mt-2">↑ 12.5%</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-600/20 to-transparent rounded-xl border border-blue-500/30">
                  <p className="text-2xl font-bold text-white">{stats.reach}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Reach</p>
                  <p className="text-xs text-green-400 mt-2">↑ 9.1%</p>
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="text-center p-4 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl border border-pink-500/30">
                <p className="text-2xl font-bold text-white">{stats.engagement}</p>
                <p className="text-xs text-gray-400 mt-1">Engagement Rate</p>
                <p className="text-xs text-green-400 mt-2">↑ 2.3%</p>
              </div>

              {/* Bar Chart */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800">
                <h4 className="text-white font-semibold text-xs mb-3">Monthly Growth (Trend year to year)</h4>

                {/* Mobile-specific chart with simplified data */}
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart 
                    data={[
                      { month: 'Jan', connections: 150, reach: 800 },
                      { month: 'Mar', connections: 200, reach: 1100 },
                      { month: 'May', connections: 245, reach: 1300 },
                      { month: 'Jul', connections: 310, reach: 1550 },
                      { month: 'Sep', connections: 380, reach: 1850 },
                      { month: 'Nov', connections: 460, reach: 2150 },
                      { month: 'Dec', connections: 500, reach: 2300 }
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#374151" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF" 
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => value > 1000 ? `${(value/1000)}k` : value}
                      width={35}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #4B5563', 
                        borderRadius: '6px',
                        fontSize: '12px',
                        padding: '8px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'reach') return [`${value}K`, 'Reach'];
                        return [value, 'Connections'];
                      }}
                      labelStyle={{ 
                        color: '#FFF', 
                        fontWeight: 'bold',
                        fontSize: '11px',
                        marginBottom: '4px'
                      }}
                    />
                    <Bar 
                      dataKey="connections" 
                      fill="#A78BFA" 
                      radius={[3, 3, 0, 0]} 
                      barSize={18}
                      name="Connections"
                    />
                    <Bar 
                      dataKey="reach" 
                      fill="#60A5FA" 
                      radius={[3, 3, 0, 0]} 
                      barSize={18}
                      name="Reach (K)"
                    />
                  </BarChart>
                </ResponsiveContainer>
                    
                {/* Mobile Stats Summary */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/40 p-3 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Total Growth</div>
                      <div className="text-lg font-bold text-white">233%</div>
                      <div className="text-green-500 text-[10px] flex items-center mt-0.5">
                        <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +12.5%
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/40 p-3 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Engagement</div>
                      <div className="text-lg font-bold text-white">4.8%</div>
                      <div className="text-blue-400 text-[10px] mt-0.5">920K in Dec</div>
                    </div>
                  </div>
                    
                  {/* Month selector for mobile */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-gray-400 text-xs">Showing: Every 2 months</div>
                    <div className="flex space-x-1">
                      <button className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md hover:bg-gray-700">
                        3M
                      </button>
                      <button className="px-2 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700">
                        6M
                      </button>
                      <button className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md hover:bg-gray-700">
                        12M
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Pie Chart - Mobile Optimized */}
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Engagement
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">Distribution by platform</p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg">
                    Last 30d
                  </div>
                </div>

                {/* Chart Section */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Instagram', value: 35, color: '#A78BFA', engagement: '2.5M' },
                          { name: 'TikTok', value: 28, color: '#60A5FA', engagement: '1.8M' },
                          { name: 'YouTube', value: 22, color: '#34D399', engagement: '1.2M' },
                          { name: 'Twitter', value: 10, color: '#FBBF24', engagement: '850K' },
                          { name: 'Facebook', value: 5, color: '#F87171', engagement: '350K' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        
                          if (value > 10) {
                            return (
                              <text 
                                x={x} 
                                y={y} 
                                fill="white" 
                                textAnchor={x > cx ? 'start' : 'end'} 
                                dominantBaseline="central"
                                className="font-bold text-[10px]"
                              >
                                {value}%
                              </text>
                            );
                          }
                          return null;
                        }}
                        outerRadius={80}
                        innerRadius={45}
                        paddingAngle={1}
                        cornerRadius={6}
                        dataKey="value"
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {[
                          { name: 'Instagram', value: 35, color: '#A78BFA' },
                          { name: 'TikTok', value: 28, color: '#60A5FA' },
                          { name: 'YouTube', value: 22, color: '#34D399' },
                          { name: 'Twitter', value: 10, color: '#FBBF24' },
                          { name: 'Facebook', value: 5, color: '#F87171' }
                        ].map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="#1F2937"
                            strokeWidth={1.5}
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                          />
                        ))}
                      </Pie>
                      
                      {/* Center text for mobile */}
                      <text 
                        x="50%" 
                        y="45%" 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        className="text-base font-bold fill-white"
                      >
                        100%
                      </text>
                      <text 
                        x="50%" 
                        y="55%" 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        className="text-xs fill-gray-400"
                      >
                        Total
                      </text>
                      
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl max-w-[180px]">
                                <div className="flex items-center gap-2 mb-2">
                                  <div 
                                    className="w-3 h-3 rounded-full flex-shrink-0" 
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <span className="font-bold text-white text-sm truncate">{data.name}</span>
                                  <span className="ml-auto font-bold text-sm" style={{ color: data.color }}>
                                    {data.value}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-300">
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                      
                {/* Platform Stats - Vertical List for Mobile */}
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Instagram', value: 35, color: '#A78BFA', engagement: '2.5M', change: '+12.5%', icon: '📸' },
                    { name: 'TikTok', value: 28, color: '#60A5FA', engagement: '1.8M', change: '+8.3%', icon: '🎵' },
                    { name: 'YouTube', value: 22, color: '#34D399', engagement: '1.2M', change: '+5.7%', icon: '▶️' },
                    { name: 'Twitter', value: 10, color: '#FBBF24', engagement: '850K', change: '+2.1%', icon: '🐦' },
                    { name: 'Facebook', value: 5, color: '#F87171', engagement: '350K', change: '-1.2%', icon: '👥' }
                  ].map((platform) => (
                    <div 
                      key={platform.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-sm">{platform.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white text-sm truncate">{platform.name}</span>
                            <span 
                              className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${platform.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                            >
                              {platform.change}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 truncate">{platform.engagement} engagements</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="text-right">
                          <div className="text-base font-bold text-white">{platform.value}%</div>
                          <div className="text-[10px] text-gray-400">share</div>
                        </div>
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: platform.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Mobile Summary Footer */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-400">Highest:</span>
                      </div>
                      <div className="text-white font-medium ml-4">Instagram (2.5M)</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-400">Growing:</span>
                      </div>
                      <div className="text-white font-medium ml-4">TikTok (+8.3%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-medium mb-4">Jelajahi Website</p>
              
              {/* Home Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('home')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg text-white font-medium hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
                >
                  <MdHome className="w-5 h-5" />
                  Home
                </button>
                {hoveredWebNav === 'home' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Kembali ke halaman utama website
                  </div>
                )}
              </div>

              {/* About Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('about')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/about")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdInfo className="w-5 h-5" />
                  Tentang
                </button>
                {hoveredWebNav === 'about' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Pelajari lebih lanjut tentang saya
                  </div>
                )}
              </div>

              {/* Portfolio Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('portfolio')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/projects")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdFolderOpen className="w-5 h-5" />
                  Portfolio
                </button>
                {hoveredWebNav === 'portfolio' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Lihat portfolio & proyek saya
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('contact')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/contact")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdMailOutline className="w-5 h-5" />
                  Kontak
                </button>
                {hoveredWebNav === 'contact' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Hubungi saya untuk kolaborasi
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <div className="flex gap-3 bg-gray-900/90 backdrop-blur-lg rounded-2xl p-3 border border-gray-800">
            <button
              onClick={handleShare}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <MdShare className="w-5 h-5" />
              Share Profile
            </button>
            <button 
              onClick={() => setShowQRModal(!showQRModal)}
              className="p-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl border border-emerald-500/50 active:scale-95 transition-transform hover:opacity-90"
            >
              <MdQrCode className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 max-w-sm w-full qr-animation">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Portal Profile QR Code</h3>
                  <p className="text-gray-400 text-sm mt-1">Scan untuk mengunjungi portal saya</p>
                </div>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* QR Code Container */}
              <div className="relative bg-white p-4 rounded-xl mb-6 flex items-center justify-center qr-pulse">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-sm">Membuat QR Code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="relative">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code Portal Muhammad Syaiful Mukmin"
                      className="w-64 h-64 mx-auto"
                    />
                    {/* Scan line effect */}
                    <div className="scan-line"></div>
                    
                    {/* Logo overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        SM
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MdQrCode className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600">Menginisialisasi QR Code...</p>
                  </div>
                )}
              </div>
              
              {/* URL Display */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-xs mb-2">Link Portal:</p>
                <p className="text-white text-sm font-mono break-all">https://syaiful-mukmin.netlify.app/portal</p>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadQRCode}
                  disabled={!qrCodeUrl}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    qrCodeUrl 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:opacity-90 active:scale-95' 
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <MdDownload className="w-5 h-5" />
                  {downloadSuccess ? 'Berhasil!' : 'Download'}
                </button>
                
                <button
                  onClick={copyQRCodeLink}
                  className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all"
                >
                  <MdContentCopy className="w-5 h-5" />
                  Salin Link
                </button>
              </div>
              
              {/* Usage Instructions */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-xs text-center">
                  Gunakan QR Code ini untuk membagikan portal saya ke orang lain. 
                  QR Code akan mengarahkan ke: <span className="text-emerald-400">syaiful-mukmin.netlify.app/portal</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MobileLayout.displayName = 'MobileLayout';

export default MobileLayout;