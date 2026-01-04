import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdShare, MdQrCode, MdHome, MdInfo, MdFolderOpen, MdMailOutline } from 'react-icons/md';
import { HiOutlineClipboardCopy, HiClipboardCheck } from 'react-icons/hi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Avatar from '../ui/Avatar';
import MobilePlatformCard from '../ui/MobilePlatformCard';

const MobileLayout = memo(({
  platformData,
  checkedItems,
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
                      onClick={() => navigate("/tentang")}
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
                <h4 className="text-white font-semibold text-xs mb-3">Monthly Growth</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { month: 'Jan', connections: 150, reach: 800 },
                    { month: 'Feb', connections: 180, reach: 950 },
                    { month: 'Mar', connections: 200, reach: 1100 },
                    { month: 'Apr', connections: 220, reach: 1200 },
                    { month: 'May', connections: 245, reach: 1200 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                      labelStyle={{ color: '#FFF' }}
                    />
                    <Bar dataKey="connections" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800">
                <h4 className="text-white font-semibold text-xs mb-3">Engagement Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Instagram', value: 35 },
                        { name: 'TikTok', value: 28 },
                        { name: 'YouTube', value: 22 },
                        { name: 'Others', value: 15 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${value}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#A78BFA" />
                      <Cell fill="#60A5FA" />
                      <Cell fill="#34D399" />
                      <Cell fill="#FBBF24" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                      labelStyle={{ color: '#FFF' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
                  onClick={() => navigate("/tentang")}
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
              className="p-3 bg-gray-800 rounded-xl border border-gray-700 active:scale-95 transition-transform hover:bg-gray-700"
            >
              <MdQrCode className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 max-w-sm mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Profile QR Code</h3>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-sm">QR Code (Coming Soon)</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm text-center mb-4">Scan this QR code to visit my profile</p>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MobileLayout.displayName = 'MobileLayout';

export default MobileLayout;
