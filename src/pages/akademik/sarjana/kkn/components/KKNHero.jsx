import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, MapPin, Calendar, Clock, GraduationCap, 
  ArrowDown, HeartHandshake, Compass, Users, CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function KKNHero({ overview, onScrollTo }) {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={overview.videoBg} type="video/mp4" />
      </video>

      {/* Dark & Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120]/80 via-[#0b1120]/90 to-[#0b1120] z-10 backdrop-blur-[2px]" />

      {/* Floating Animated Ambient Orbs */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" style={{ animationDelay: "1s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
        >
          <Link to="/" className="hover:text-cyan-400 transition-colors">Beranda</Link>
          <span>/</span>
          <Link to="/S1-PGMI" className="hover:text-cyan-400 transition-colors">Akademik</Link>
          <span>/</span>
          <span className="text-cyan-400 font-medium">KKN Tematik</span>
        </motion.div>

        {/* Highlight Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-emerald-500/15 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-cyan-500/10"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>{overview.badge}</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6"
        >
          <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
            Kuliah Kerja Nyata
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            {overview.title}
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-10"
        >
          {overview.subtitle}
        </motion.p>

        {/* Metadata Chips Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mb-10"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-md hover:border-cyan-400/40 transition-all">
            <MapPin className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Lokasi</p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 line-clamp-1">{overview.location}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-md hover:border-emerald-400/40 transition-all">
            <Calendar className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Periode</p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">{overview.period}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-md hover:border-purple-400/40 transition-all">
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Durasi</p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">{overview.duration}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-md hover:border-pink-400/40 transition-all">
            <GraduationCap className="w-5 h-5 text-pink-400 mx-auto mb-1.5" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Program Studi</p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">S1 PGMI (FTK)</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => onScrollTo("proker")}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            Jelajahi 4 Pilar Proker
          </button>

          <button
            onClick={() => onScrollTo("linimasa")}
            className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <Clock className="w-4 h-4 text-cyan-300" />
            Linimasa 6 Pekan
          </button>

          <button
            onClick={() => onScrollTo("galeri")}
            className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold text-sm sm:text-base transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            Galeri Dokumentasi
          </button>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 z-20 cursor-pointer text-gray-400 hover:text-white transition-colors"
        onClick={() => onScrollTo("stats")}
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
