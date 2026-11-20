import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Calendar, Bell, Check, ArrowUpRight, Flame, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import getIconComponent from '../../config/iconMapper';
import { containerVariants, itemVariants } from '../../utils/animations';
import { playClick, playSuccess } from '../../utils/soundEffects';

const CommunityPage = ({ currentConfig }) => {
  const [rsvpEvents, setRsvpEvents] = useState({});
  const isCyan = currentConfig.themeColor === 'cyan';
  const communityData = currentConfig.pages?.community;

  if (!communityData) return null;

  const PageIcon = getIconComponent(communityData.icon);
  const accentBorder = isCyan ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const accentText = isCyan ? 'text-cyan-400' : 'text-emerald-400';
  const accentBg = isCyan ? 'bg-cyan-500/15' : 'bg-emerald-500/15';

  const handleRSVP = (eventName) => {
    playSuccess();
    setRsvpEvents(prev => ({
      ...prev,
      [eventName]: !prev[eventName]
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {
      // silent
    }
  };

  const memberStats = communityData.sections?.memberStats;

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-[#111c34]/90 via-[#0e172e]/85 to-[#0b1325]/90 border border-blue-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${accentBg} border border-white/10 shadow-lg`}>
              <PageIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                  HUB KOMUNITAS GLOBAL
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {communityData.title}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                {communityData.description}
              </p>
            </div>
          </div>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick()}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r ${isCyan ? 'from-cyan-600 to-blue-600' : 'from-emerald-600 to-teal-600'
              } hover:opacity-95 shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 transition-all cursor-pointer`}
          >
            <span>Gabung Discord</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Live Counters HUD */}
        {memberStats && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10"
          >
            {[
              {
                value: memberStats.totalMembers?.toLocaleString('id-ID') || '12,500+',
                label: 'Total Anggota Terdaftar',
                badge: 'Verified',
                icon: Users
              },
              {
                value: memberStats.onlineNow?.toLocaleString('id-ID') || '342',
                label: 'Sedang Aktif Online',
                badge: 'Real-time',
                icon: Flame,
                highlight: true
              },
              {
                value: `+${memberStats.newToday || '28'}`,
                label: 'Bergabung Hari Ini',
                badge: 'Trending',
                icon: Heart
              }
            ].map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="bg-[#0f172a]/70 rounded-2xl p-5 border border-blue-900/30 hover:border-cyan-500/30 transition-all shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComp className={`w-5 h-5 ${stat.highlight ? 'text-emerald-400' : accentText}`} />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-300">
                      {stat.badge}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Forum Discussions */}
      {communityData.sections?.forum && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className={`w-5 h-5 ${accentText}`} />
                {communityData.sections.forum.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Pilih kategori diskusi yang ingin Anda ikuti</p>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              5 Kategori Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {communityData.sections.forum.categories?.map((cat, idx) => {
              const CatIcon = getIconComponent(cat.icon);
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => playClick()}
                  className="bg-[#0f172a]/75 rounded-2xl p-5 border border-blue-900/30 hover:border-cyan-500/30 transition-all shadow-md cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${accentBg} ${accentText} group-hover:scale-110 transition-transform`}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    {cat.topics && (
                      <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                        {cat.topics} Topik
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-base mb-1 group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {cat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Events with Interactive RSVP */}
      {communityData.sections?.events && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${accentText}`} />
                {communityData.sections.events.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Webinar langsung & workshop interaktif bersama para praktisi</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Pendaftaran Dibuka
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityData.sections.events.upcomingEvents?.map((event, idx) => {
              const EventIcon = getIconComponent(event.icon);
              const isRegistered = rsvpEvents[event.name];
              const eventDateStr = new Date(event.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className={`bg-[#0a0f1d]/80 rounded-2xl p-6 border ${isRegistered ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-white/10 hover:border-white/20'
                    } transition-all shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${accentBg} ${accentText}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono text-gray-400">
                            {eventDateStr}
                          </span>
                          <h4 className="font-bold text-white text-base sm:text-lg">
                            {event.name}
                          </h4>
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap">
                        {event.participants + (isRegistered ? 1 : 0)} peserta
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    {event.speaker && (
                      <div className="text-xs text-gray-300 bg-white/5 px-3 py-2 rounded-xl mb-4 border border-white/5">
                        <span className="text-gray-400">Pembicara:</span> {event.speaker}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRSVP(event.name)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${isRegistered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : `bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-${accentColor}-400/40`
                      }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>✓ Anda Sudah Terdaftar (RSVP Tersimpan)</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>Ingatkan Saya (Simpan Jadwal)</span>
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
