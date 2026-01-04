import React, { memo, useState } from 'react';
import { MdEmail, MdShare, MdHome, MdInfo, MdFolderOpen, MdMailOutline, MdStar } from 'react-icons/md';
import { HiClipboardCheck, HiOutlineClipboardCopy } from 'react-icons/hi';
import { FaLanguage } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Avatar from '../ui/Avatar';
import DesktopPlatformCard from '../ui/DesktopPlatformCard';

const DesktopLayout = memo(({
  platformData,
  checkedItems,
  handleCopyEmail,
  handleShare,
  copied,
  navigate,
  stats
}) => {
  const [hoveredWebNav, setHoveredWebNav] = useState(null);
  return (
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <MdEmail className="w-4 h-4 text-purple-400" />
              <span className="text-white">hello@yourworld.com</span>
              {copied && (
                <HiClipboardCheck className="w-4 h-4 text-green-400" />
              )}
            </button>
            
            <button
              onClick={handleShare}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
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
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Total Platforms</span>
                  <span className="text-white font-semibold">{Object.keys(platformData).length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Connected</span>
                  <span className="text-green-400 font-semibold">
                    {Object.values(checkedItems).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-400">Profile Views</span>
                  <span className="text-white font-semibold">1.2K</span>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/cv-saya")}
                  className="w-full py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-white font-medium hover:border-purple-500/50 transition-colors"
                >
                  Liat CV saya
                </button>
                          
                <button
                  onClick={() => navigate("/testimoni")}
                  className="w-full py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors"
                >
                  Liat Testimoni
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
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full w-3/4" />
                </div>
              </div>
            </div>

            {/* Top Skills */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MdStar className="w-5 h-5 text-yellow-400" />
                Top Skills
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Komunikasi Efektif</span>
                    <span className="text-xs text-gray-400">95%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-pink-500 to-pink-400 h-1.5 rounded-full w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Kreativitas</span>
                    <span className="text-xs text-gray-400">90%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-1.5 rounded-full w-[90%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Kolaborasi Tim</span>
                    <span className="text-xs text-gray-400">85%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/softskills")}
                className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors"
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
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">🇺🇸 English</span>
                    <span className="text-xs text-blue-400 font-medium">Advanced</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full w-[80%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">🎭 Jawa</span>
                    <span className="text-xs text-yellow-400 font-medium">Intermediate</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-1.5 rounded-full w-[60%]" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/bahasa")}
                className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors"
              >
                Lihat semua →
              </button>
            </div>

            {/* Education */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎓</span>
                Education
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-white font-medium text-sm">S1 Pendidikan Guru</p>
                  <p className="text-gray-400 text-xs">Universitas Pendidikan Indonesia</p>
                  <p className="text-gray-500 text-xs mt-1">2017 - 2021 | GPA: 3.85</p>
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium text-sm">Magister Pendidikan Dasar</p>
                  <p className="text-gray-400 text-xs">Universitas Negeri Jakarta</p>
                  <p className="text-gray-500 text-xs mt-1">2023 - Sekarang</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/pendidikan")}
                className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors"
              >
                Lihat semua →
              </button>
            </div>

            {/* Certificates */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🏆</span>
                Certificates
              </h3>
              <div className="space-y-2">
                <div className="text-xs flex items-center justify-between">
                  <span className="text-gray-300">Front-End Web Development</span>
                  <span className="text-blue-400 text-xs">2024</span>
                </div>
                <div className="text-xs flex items-center justify-between">
                  <span className="text-gray-300">UI/UX Design Fundamentals</span>
                  <span className="text-pink-400 text-xs">2023</span>
                </div>
                <div className="text-xs flex items-center justify-between">
                  <span className="text-gray-300">AI for Everyone</span>
                  <span className="text-purple-400 text-xs">2024</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/sertifikat")}
                className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors"
              >
                Lihat semua →
              </button>
            </div>

            {/* Hobbies */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎨</span>
                Hobbies
              </h3>
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="text-gray-300">📷 Fotografi</span>
                  <div className="text-gray-500 text-xs mt-1">75% completion</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-300">🎬 Editing Video Dokumenter</span>
                  <div className="text-gray-500 text-xs mt-1">40% completion</div>
                </div>
                <div className="text-xs">
                  <span className="text-gray-300">✏️ Menulis Blog Edukasi</span>
                  <div className="text-gray-500 text-xs mt-1">60% completion</div>
                </div>
              </div>
              <button
                onClick={() => navigate("/hobbies")}
                className="w-full mt-4 py-2 text-xs text-gray-300 hover:text-white transition-colors"
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
                    className="px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Projek
                  </button>

                  <button
                    onClick={() => navigate("/contact")}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
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
                  {/* Home Button */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setHoveredWebNav('home')}
                      onMouseLeave={() => setHoveredWebNav(null)}
                      onClick={() => navigate("/")}
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg text-white font-medium hover:border-cyan-500/50 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <MdHome className="w-4 h-4" />
                      Home
                    </button>
                    {hoveredWebNav === 'home' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                        Kembali ke halaman utama
                      </div>
                    )}
                  </div>

                  {/* About Button */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setHoveredWebNav('about')}
                      onMouseLeave={() => setHoveredWebNav(null)}
                      onClick={() => navigate("/tentang")}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <MdInfo className="w-4 h-4" />
                      Tentang
                    </button>
                    {hoveredWebNav === 'about' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                        Pelajari tentang saya
                      </div>
                    )}
                  </div>

                  {/* Portfolio Button */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setHoveredWebNav('portfolio')}
                      onMouseLeave={() => setHoveredWebNav(null)}
                      onClick={() => navigate("/projects")}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <MdFolderOpen className="w-4 h-4" />
                      Portfolio
                    </button>
                    {hoveredWebNav === 'portfolio' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                        Lihat proyek saya
                      </div>
                    )}
                  </div>

                  {/* Contact Button */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setHoveredWebNav('contact')}
                      onMouseLeave={() => setHoveredWebNav(null)}
                      onClick={() => navigate("/contact")}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <MdMailOutline className="w-4 h-4" />
                      Kontak
                    </button>
                    {hoveredWebNav === 'contact' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                        Hubungi saya
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* About Syaiful Mukmin Section */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                  <h3 className="text-white font-semibold text-base mb-3">👋 Tentang Syaiful Mukmin</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Muhammad Syaiful Mukmin adalah seorang digital creator dan developer passionate yang berkomitmen untuk menciptakan solusi inovatif dan konten berkualitas tinggi. Dengan pengalaman di berbagai platform digital, Syaiful terus belajar dan berkembang dalam industri teknologi.
                  </p>
                  <button
                    onClick={() => navigate("/tentang")}
                    className="px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-white text-sm font-medium hover:border-purple-500 transition-colors"
                  >
                    Selengkapnya →
                  </button>
                </div>
              </div>
              
              {/* Stats overview */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-bold text-white mb-6">📊 Statistics Overview</h3>
                
                {/* Bar Chart - Monthly Growth */}
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-6">
                  <h4 className="text-white font-semibold mb-4 text-sm">Monthly Growth Trend</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { month: 'Jan', connections: 150, reach: 800 },
                      { month: 'Feb', connections: 180, reach: 950 },
                      { month: 'Mar', connections: 200, reach: 1100 },
                      { month: 'Apr', connections: 220, reach: 1200 },
                      { month: 'May', connections: 245, reach: 1200 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                        labelStyle={{ color: '#FFF' }}
                      />
                      <Legend />
                      <Bar dataKey="connections" fill="#A78BFA" radius={[8, 8, 0, 0]} name="Connections" />
                      <Bar dataKey="reach" fill="#60A5FA" radius={[8, 8, 0, 0]} name="Reach (K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Engagement Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                    <p className="text-3xl font-bold text-white mb-2">{stats.connections}</p>
                    <p className="text-gray-400 text-sm">Total Connections</p>
                    <div className="mt-3 text-xs text-green-400">↑ 12.5% dari bulan lalu</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                    <p className="text-3xl font-bold text-white mb-2">{stats.reach}</p>
                    <p className="text-gray-400 text-sm">Total Reach</p>
                    <div className="mt-3 text-xs text-green-400">↑ 9.1% dari bulan lalu</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-600/20 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
                    <p className="text-3xl font-bold text-white mb-2">{stats.engagement}</p>
                    <p className="text-gray-400 text-sm">Engagement Rate</p>
                    <div className="mt-3 text-xs text-green-400">↑ 2.3% dari bulan lalu</div>
                  </div>
                </div>

                {/* Engagement Pie Chart */}
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mt-6">
                  <h4 className="text-white font-semibold mb-4 text-sm">Engagement Distribution</h4>
                  <ResponsiveContainer width="100%" height={250}>
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
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DesktopLayout.displayName = 'DesktopLayout';

export default DesktopLayout;
