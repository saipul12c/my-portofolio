import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdEmail, MdShare, MdQrCode, MdFolderOpen, MdOpenInNew, MdVerified
} from 'react-icons/md';
import { HiOutlineClipboardCopy, HiClipboardCheck } from 'react-icons/hi';

import Avatar from '../ui/Avatar';
import MobilePlatformCard from '../ui/MobilePlatformCard';
import SpecialtyTicker from './SpecialtyTicker';
import RotatingHobbies from './RotatingHobbies';
import RotatingCerts from './RotatingCerts';
import LiveChatPreview from './LiveChatPreview';
import QRCodeModal from './QRCodeModal';

import { usesData, webNavigationItems, portfolioSummaryStats } from '../modules/portalData';

const MobileLayout = memo(({
  platformData,
  handleCopyEmail,
  handleShare,
  copied,
  activeTab,
  setActiveTab,
  certificates = [],
  projects = [],
  openCertModal
}) => {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-gray-900)] via-[#0f1d32] to-[var(--color-gray-900)] p-4 pb-24">
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-1.5">
            Muhammad Syaiful Mukmin
            <MdVerified className="w-5 h-5 text-blue-500 fill-blue-500" />
          </h1>
          <p className="text-gray-400 mb-6 flex items-center justify-center gap-1.5 h-6 text-sm">
            <span>Digital Creator &</span>
            <SpecialtyTicker />
          </p>

          {/* Short Bio */}
          <div className="max-w-xs mx-auto mb-6 px-4">
            <p className="text-gray-500 text-xs leading-relaxed italic">
              "Seorang EduTech Enthusiast yang berdedikasi menciptakan solusi inovatif melalui konten digital & pengembangan perangkat lunak."
            </p>
          </div>

          {/* Email card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 max-w-md mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <MdEmail className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Contact Email</p>
                  <p className="text-sm text-white font-medium truncate">uju355@gmail.com</p>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`p-2 rounded-lg flex-shrink-0 transition-colors cursor-pointer ${
                  copied ? 'bg-green-500/20' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                aria-label={copied ? 'Email tersalin' : 'Salin email'}
                title="Salin Email"
              >
                {copied ? (
                  <HiClipboardCheck className="w-5 h-5 text-green-400 animate-bounce" />
                ) : (
                  <HiOutlineClipboardCopy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 mb-8 bg-gray-900/40 backdrop-blur-md rounded-2xl p-1.5 max-w-md mx-auto border border-gray-800/50 shadow-lg">
          {['social', 'chat', 'setup', 'projects', 'website'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 rounded-xl text-[11px] xs:text-xs font-semibold transition-all duration-300 text-center flex items-center justify-center cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              {tab === 'social' ? 'Links' : tab === 'setup' ? 'Stats' : tab === 'projects' ? 'Projek' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-md mx-auto">
          {activeTab === 'social' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(platformData).map(([key, data]) => (
                  <MobilePlatformCard
                    key={key}
                    platform={key.charAt(0).toUpperCase() + key.slice(1)}
                    icon={data.icon}
                    username={data.username}
                    url={data.url}
                  />
                ))}
              </div>

              {/* About Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
                  <h3 className="text-white font-semibold text-sm mb-2">👋 Tentang Syaiful Mukmin</h3>
                  <p className="text-gray-300 text-[11px] leading-relaxed mb-3">
                    Muhammad Syaiful Mukmin adalah seorang digital creator dan developer passionate yang berkomitmen untuk menciptakan solusi inovatif dan konten berkualitas tinggi.
                  </p>
                  <button
                    onClick={() => navigate("/about")}
                    className="w-full px-3 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-white text-[11px] font-medium transition-colors hover:bg-purple-600/40 cursor-pointer"
                  >
                    Selengkapnya
                  </button>
                </div>
              </div>

              {/* Hobbies Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <span className="text-base">🎨</span>
                    My Hobbies
                  </h3>
                  <button
                    onClick={() => navigate("/hobbies")}
                    className="text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <RotatingHobbies navigate={navigate} isMobile={true} />
              </div>
            </>
          )}

          {activeTab === 'chat' && (
            <LiveChatPreview navigate={navigate} isMobile={true} />
          )}

          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Featured Certificates */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    Featured Certificates
                  </h3>
                  <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">New</span>
                </div>

                <RotatingCerts
                  certificates={certificates}
                  openCertModal={openCertModal}
                  maxDisplay={3}
                  isMobile={true}
                />

                <button
                  onClick={() => navigate('/sertifikat')}
                  className="w-full mt-4 py-2 text-[10px] text-gray-500 hover:text-gray-300 text-center border-t border-gray-800/50 pt-3 cursor-pointer"
                >
                  Lihat Semua Sertifikat →
                </button>
              </div>

              {/* Uses & Setup */}
              <div className="space-y-4">
                <div className="px-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-base">⚙️</span>
                    Uses & Setup
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Hardware and professional tools.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {usesData.map((category, idx) => (
                    <div key={idx} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl">{category.icon}</span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                          {category.category}
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {category.items.map((item, iIdx) => (
                          <a key={iIdx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white text-xs font-bold group-hover:text-blue-400 transition-colors">
                                {item.name}
                              </span>
                              <MdOpenInNew className="w-3 h-3 text-cyan-400/30 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interaction & Portfolio Metrics */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-base">📊</span>
                    Ringkasan Portofolio
                  </h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Data Riil
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-lg font-bold text-white">{portfolioSummaryStats.totalProjects}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Proyek</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-lg font-bold text-white">{portfolioSummaryStats.totalCertificates}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Sertifikat</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-lg font-bold text-white">{portfolioSummaryStats.averageRating}★</p>
                    <p className="text-[9px] text-gray-500 uppercase">Rating</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-400 font-medium">Total Karya Terintegrasi</span>
                    <span className="text-[10px] text-cyan-400 font-bold">{portfolioSummaryStats.totalWorks}+ Karya</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 h-full w-[100%]" />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-2">
                    Mencakup {portfolioSummaryStats.totalProjects} Proyek, {portfolioSummaryStats.totalCertificates} Sertifikasi, dan {portfolioSummaryStats.totalPhotos}+ Foto Dokumentasi
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <MdFolderOpen className="w-4 h-4 text-purple-400" />
                  Featured Projects
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {projects && projects.slice(0, 3).map((project, i) => (
                    <div
                      key={project.id || i}
                      onClick={() => navigate(`/project-detail/${project.id || project.slug}`)}
                      className="group bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 transition-all active:scale-95 flex gap-3 cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700">
                            <MdFolderOpen className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate mb-1 group-hover:text-purple-400 transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <MdOpenInNew className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/projects")}
                  className="w-full mt-4 py-2.5 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl text-xs text-gray-400 hover:text-white transition-all border border-gray-700/50 hover:border-gray-600 font-medium cursor-pointer"
                >
                  Lihat Semua Projek →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-medium mb-4">Jelajahi Website</p>
              <div className="space-y-3">
                {webNavigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full px-4 py-3 ${item.color} border border-gray-700 rounded-xl text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-98`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40">
        <div className="flex gap-3 bg-gray-900/90 backdrop-blur-lg rounded-2xl p-3 border border-gray-800 shadow-2xl">
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-white flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer text-sm"
          >
            <MdShare className="w-5 h-5" />
            Share Profile
          </button>
          <button
            onClick={() => setShowQRModal(true)}
            className="p-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl border border-emerald-500/50 active:scale-95 transition-transform hover:opacity-90 cursor-pointer"
            title="Tampilkan QR Code"
          >
            <MdQrCode className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onShare={handleShare}
      />
    </div>
  );
});

MobileLayout.displayName = 'MobileLayout';
export default MobileLayout;
