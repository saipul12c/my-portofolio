import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Award, Shield, Briefcase, MapPin, Calendar, Globe, Sparkles } from "lucide-react";
import { containerVariants, itemVariants } from "../utils/animationVariants";
import { createCompanySlug } from "../../company/utils/companyUtils";

const ProfileHeader = ({ userInfo, navigate, imageError, handleImageError }) => {
  return (
    <>
      {/* Top Navigation Bar - Sticky */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/testimoni")}
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-white border border-white/10 hover:border-cyan-500/30 text-sm font-medium"
            aria-label="Kembali ke halaman testimoni"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Kembali ke Testimoni</span>
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center px-2 truncate max-w-xs sm:max-w-md"
          >
            {userInfo.name}
          </motion.h1>
          
          <div className="flex items-center gap-2">
            {userInfo.website && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={userInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-xs sm:text-sm font-medium flex items-center gap-1.5"
                title="Kunjungi website"
              >
                <Globe size={16} />
                <span className="hidden md:inline">Website</span>
                <ExternalLink size={14} className="hidden sm:inline" />
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* Main Hero Profile Section (Normal scroll flow) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-8 shadow-2xl relative"
        >
          {/* Gradient Header with Ambient Effects */}
          <div className="relative h-36 sm:h-48 lg:h-56 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.25),rgba(255,255,255,0))]"></div>
            <motion.div 
              className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            {/* Achievement & Verification Badges */}
            <motion.div 
              className="absolute bottom-4 left-6 sm:left-8 flex items-center gap-2 sm:gap-3 flex-wrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-yellow-500/40 shadow-lg cursor-default">
                <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-yellow-300">{userInfo.achievementLevel}</span>
              </div>
              
              {userInfo.verified && (
                <div className="flex items-center gap-1.5 bg-cyan-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/50 shadow-lg cursor-default">
                  <Shield size={14} className="text-cyan-400" />
                  <span className="text-xs sm:text-sm font-bold text-cyan-300">Verified Client</span>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Profile Content Section */}
          <div className="px-6 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 -mt-16 sm:-mt-20 mb-6">
              {/* Profile Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group flex-shrink-0"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 shadow-2xl relative overflow-hidden">
                  {!imageError && userInfo.image ? (
                    <motion.img
                      src={userInfo.image}
                      alt={userInfo.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {userInfo.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Profile Info */}
              <motion.div 
                variants={itemVariants}
                className="flex-1 flex flex-col justify-end space-y-3"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                    {userInfo.name}
                  </h2>
                  
                  <p className="text-base sm:text-lg text-cyan-300 font-medium mb-3">
                    {userInfo.role}
                  </p>
                  
                  {/* Info Tags */}
                  <div className="flex flex-wrap gap-2.5 text-xs sm:text-sm">
                    {userInfo.company && (
                      <Link 
                        to={`/testimoni/perusahaan/${createCompanySlug(userInfo.company)}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/15 rounded-xl border border-white/10 hover:border-cyan-500/40 backdrop-blur-sm transition-all duration-300 text-cyan-300 font-medium group"
                        title={`Lihat profil ${userInfo.company}`}
                      >
                        <Briefcase size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span>{userInfo.company}</span>
                        <span className="text-xs text-gray-400">&rarr;</span>
                      </Link>
                    )}
                    
                    {userInfo.location && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm text-gray-300">
                        <MapPin size={14} className="text-purple-400" />
                        <span>{userInfo.location}</span>
                      </span>
                    )}
                    
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm text-gray-300">
                      <Calendar size={14} className="text-blue-400" />
                      <span>Bergabung {userInfo.joinDate}</span>
                    </span>
                    
                    {userInfo.email && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm text-gray-300">
                        <Globe size={14} className="text-cyan-400" />
                        <span className="truncate">{userInfo.email}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfileHeader;
