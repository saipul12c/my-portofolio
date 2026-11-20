import React, { memo, useState } from 'react';
import {
  MdEmail, MdShare, MdQrCode, MdVerified, MdStar, MdOpenInNew
} from 'react-icons/md';
import { HiClipboardCheck, HiOutlineClipboardCopy } from 'react-icons/hi';
import { FaLanguage } from 'react-icons/fa';

import Avatar from '../ui/Avatar';
import DesktopPlatformCard from '../ui/DesktopPlatformCard';
import SpecialtyTicker from './SpecialtyTicker';
import RotatingHobbies from './RotatingHobbies';
import RotatingCerts from './RotatingCerts';
import LiveChatPreview from './LiveChatPreview';
import StatsCharts from './StatsCharts';
import QRCodeModal from './QRCodeModal';

import {
  skillsData,
  languagesData,
  educationData,
  webNavigationItems,
  usesData,
  portfolioSummaryStats
} from '../modules/portalData';

const DesktopLayout = memo(({
  platformData,
  checkedItems,
  handleCopyEmail,
  handleShare,
  copied,
  navigate,
  stats,
  certificates = [],
  openCertModal
}) => {
  const [hoveredWebNav, setHoveredWebNav] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const totalPlatforms = Object.keys(platformData).length;
  const connectedCount = Object.values(checkedItems).filter(Boolean).length;
  const connectionPercent = totalPlatforms > 0 ? (connectedCount / totalPlatforms) * 100 : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-gray-900)] via-[#0f1d32] to-[var(--color-gray-900)] p-8">
        {/* Background grid */}
        <div className="fixed inset-0 bg-grid-white/5 bg-grid-16 pointer-events-none" />

        {/* Glow effects */}
        <div className="fixed top-1/4 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-6">
              <Avatar />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                  Muhammad Syaiful Mukmin
                  <span className="relative group/verified inline-flex group-hover:scale-110 transition-transform">
                    <MdVerified className="w-6 h-6 text-blue-500 fill-blue-500 cursor-help" />
                    <span className="absolute left-1/2 -top-10 -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-lg text-xs text-white opacity-0 group-hover/verified:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                      Terverifikasi Official
                    </span>
                  </span>
                </h1>
                <p className="text-gray-400 mb-1 flex items-center gap-1.5 h-6">
                  <span>Digital Creator &</span>
                  <SpecialtyTicker />
                </p>
                <p className="text-gray-500 text-sm">Manage all your social connections in one place</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group cursor-pointer"
                title="Salin Email"
              >
                <MdEmail className="w-4 h-4 text-purple-400 group-hover:animate-pulse" />
                <span className="text-white">uju355@gmail.com</span>
                {copied ? (
                  <HiClipboardCheck className="w-4 h-4 text-green-400 animate-bounce" />
                ) : (
                  <HiOutlineClipboardCopy className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg border border-emerald-500/50 font-medium text-white hover:opacity-90 transition-opacity hover:scale-105 active:scale-95 cursor-pointer"
                title="Generate QR Code"
              >
                <MdQrCode className="w-4 h-4" />
                QR Code
              </button>

              <button
                onClick={handleShare}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:opacity-90 transition-opacity hover:scale-105 active:scale-95 cursor-pointer"
              >
                Share
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left sidebar - Profile & Details */}
            <div className="w-80 space-y-6 flex-shrink-0">
              {/* Profile card */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400 text-sm">Total Platforms</span>
                    <span className="text-white font-semibold">{totalPlatforms}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400 text-sm">Connected</span>
                    <span className="text-green-400 font-semibold">{connectedCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-400 text-sm">Total Karya Riil</span>
                    <span className="text-cyan-400 font-semibold">{portfolioSummaryStats.totalWorks}+</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate("/cv-saya")}
                    className="w-full py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-white font-medium hover:border-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Liat CV saya
                  </button>

                  <button
                    onClick={() => navigate("/testimoni")}
                    className="w-full py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Liat Testimoni
                  </button>

                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-lg text-white font-medium hover:border-emerald-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MdQrCode className="w-4 h-4" />
                    Generate QR Code
                  </button>
                </div>
              </div>

              {/* Connection Status */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-3">Connection Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Connections</span>
                    <span className="text-green-400 font-medium">Excellent</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${connectionPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Top Skills */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <MdStar className="w-5 h-5 text-yellow-400 animate-pulse" />
                  Top Skills
                </h3>
                <div className="space-y-3">
                  {skillsData.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-300">{skill.name}</span>
                        <span className="text-xs text-gray-400">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${skill.color} h-1.5 rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/softskills")}
                  className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white transition-colors hover:underline cursor-pointer"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Languages */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <FaLanguage className="w-5 h-5 text-blue-400" />
                  Languages
                </h3>
                <div className="space-y-3">
                  {languagesData.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-300">{lang.name}</span>
                        <span className={`text-xs ${lang.badgeColor} font-medium`}>{lang.level}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${lang.color} h-1.5 rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/bahasa")}
                  className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white transition-colors hover:underline cursor-pointer"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Education */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  Education
                </h3>
                <div className="space-y-3">
                  {educationData.map((edu, idx) => (
                    <div key={idx} className="text-sm hover:bg-gray-800/30 p-2 rounded-lg transition-colors cursor-pointer">
                      <p className="text-white font-medium text-xs">{edu.title}</p>
                      <p className="text-gray-400 text-[11px]">{edu.institution}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{edu.period} | {edu.note}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/pendidikan")}
                  className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white transition-colors hover:underline cursor-pointer"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Certificates */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  Certificates
                </h3>
                <RotatingCerts certificates={certificates} openCertModal={openCertModal} maxDisplay={6} />
                <button
                  onClick={() => navigate("/sertifikat")}
                  className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white transition-colors hover:underline cursor-pointer"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Hobbies */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  Hobbies
                </h3>
                <RotatingHobbies navigate={navigate} />
                <button
                  onClick={() => navigate("/hobbies")}
                  className="w-full mt-4 py-2.5 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl text-xs text-gray-400 hover:text-white transition-all border border-gray-700/50 hover:border-gray-600 font-medium cursor-pointer"
                >
                  Lihat semua →
                </button>
              </div>

              {/* Live Discussion Preview */}
              <LiveChatPreview navigate={navigate} />
            </div>

            {/* Main content - Platforms grid & Details */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">Social Platforms</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/projects")}
                      className="px-4 py-2 bg-gray-800 rounded-lg text-white text-sm font-medium hover:bg-gray-700 transition-colors hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Projek
                    </button>

                    <button
                      onClick={() => navigate("/contact")}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Hubungi Admin Sekarang
                    </button>
                    <button
                      onClick={() => navigate("/Live-Discussion")}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      Diskusi Bersama
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm font-medium">Navigasi Website</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {webNavigationItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <button
                          onMouseEnter={() => setHoveredWebNav(item.id)}
                          onMouseLeave={() => setHoveredWebNav(null)}
                          onClick={() => navigate(item.path)}
                          className={`w-full px-4 py-3 ${item.color} border ${
                            item.id === 'home' ? 'border-cyan-500/30 hover:border-cyan-500/50' : 'border-gray-700 hover:border-gray-600'
                          } rounded-lg text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <item.icon className="w-4 h-4 group-hover:animate-bounce" />
                          {item.label}
                        </button>
                        {hoveredWebNav === item.id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10 pointer-events-none">
                            {item.tooltip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Syaiful Mukmin Section */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                    <h3 className="text-white font-semibold text-base mb-3">👋 Tentang Syaiful Mukmin</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Muhammad Syaiful Mukmin adalah seorang digital creator dan developer passionate yang berkomitmen untuk menciptakan solusi inovatif dan konten berkualitas tinggi. Dengan pengalaman di berbagai platform digital, Syaiful terus belajar dan berkembang dalam industri teknologi.
                    </p>
                    <button
                      onClick={() => navigate("/about")}
                      className="px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-white text-sm font-medium hover:border-purple-500 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Selengkapnya →
                    </button>
                  </div>
                </div>

                {/* Uses & Setup Section */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-lg">⚙️</span> Uses & Setup
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">Sistem, perangkat, dan software yang saya gunakan sehari-hari.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usesData.map((category, idx) => (
                      <div key={idx} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all group">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-3">
                          <div className="p-2 rounded-lg bg-gray-800 text-white group-hover:scale-110 transition-transform">
                            <span className="text-base">{category.icon}</span>
                          </div>
                          <h4 className="font-bold text-white text-sm uppercase tracking-wider">{category.category}</h4>
                        </div>

                        <div className="space-y-4">
                          {category.items.map((item, iIdx) => (
                            <a
                              key={iIdx}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group/item"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-white text-sm font-semibold group-hover/item:text-cyan-400 transition-colors">
                                  {item.name}
                                </span>
                                <MdOpenInNew className="w-3.5 h-3.5 text-gray-600 group-hover/item:text-cyan-400 transition-colors opacity-0 group-hover/item:opacity-100" />
                              </div>
                              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics Overview (Isolated & Memoized Recharts) */}
                <StatsCharts stats={stats} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onShare={handleShare}
      />
    </>
  );
});

DesktopLayout.displayName = 'DesktopLayout';
export default DesktopLayout;
