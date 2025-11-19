import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Award, Shield, Briefcase, MapPin, Calendar, Globe, Sparkles } from "lucide-react";
import { containerVariants, itemVariants } from "../utils/animationVariants";

const ProfileHeader = ({ userInfo, navigate, imageError, handleImageError }) => {
  return (
    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/testimoni")}
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 hover:bg-white/10 rounded-lg sm:rounded-2xl transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-white/20 backdrop-blur-sm text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-medium">Kembali</span>
        </motion.button>
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center px-2 truncate"
        >
          {userInfo.name}
        </motion.h1>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {userInfo.website && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={userInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 hover:bg-white/10 rounded-lg sm:rounded-2xl transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-white/20"
              title="Kunjungi website"
            >
              <ExternalLink size={16} className="sm:w-5 sm:h-5" />
            </motion.a>
          )}
        </div>
      </div>

      {/* Enhanced Profile Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 mx-3 sm:mx-4 lg:mx-6 xl:mx-8 shadow-2xl relative"
      >
        {/* Gradient Header with Enhanced Effects */}
        <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <motion.div 
            className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          
          {/* Achievement & Verification Badges */}
          <motion.div 
            className="absolute bottom-3 sm:bottom-4 left-4 sm:left-8 flex items-center gap-2 sm:gap-3 flex-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl border border-yellow-500/30 shadow-lg hover:bg-black/60 transition-all duration-300 cursor-default"
            >
              <Sparkles size={14} className="sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-yellow-300">{userInfo.achievementLevel}</span>
            </motion.div>
            
            {userInfo.verified && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-green-500/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl border border-green-400/50 shadow-lg hover:bg-green-500/30 transition-all duration-300 cursor-default"
              >
                <Shield size={12} className="sm:w-3.5 sm:h-3.5 text-green-400" />
                <span className="text-xs sm:text-sm font-bold text-green-300">Verified</span>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Profile Content Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 -mt-16 sm:-mt-20 mb-6 sm:mb-8">
            {/* Profile Image */}
            <motion.div
              whileHover={{ scale: 1.08, rotateY: 5 }}
              className="relative group flex-shrink-0"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl relative overflow-hidden">
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      {userInfo.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              {/* Glow Effect */}
              <motion.div 
                className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg group-hover:blur-2xl"
                animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 30px rgba(168,85,247,0.4)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Profile Info */}
            <motion.div 
              variants={itemVariants}
              className="flex-1 flex flex-col justify-end pb-1 sm:pb-2 space-y-3 sm:space-y-4"
            >
              <div>
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent"
                >
                  {userInfo.name}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base sm:text-lg lg:text-xl text-blue-300 font-semibold mb-2 sm:mb-4"
                >
                  {userInfo.role}
                </motion.p>
                
                {/* Info Tags */}
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                  {userInfo.company && (
                    <motion.span 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/8 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 cursor-default hover:border-white/20"
                    >
                      <Briefcase size={14} className="sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-gray-200 font-medium">{userInfo.company}</span>
                    </motion.span>
                  )}
                  
                  {userInfo.location && (
                    <motion.span 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/8 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 cursor-default hover:border-white/20"
                    >
                      <MapPin size={14} className="sm:w-4 sm:h-4 text-purple-400" />
                      <span className="text-gray-200 font-medium">{userInfo.location}</span>
                    </motion.span>
                  )}
                  
                  <motion.span 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/8 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 cursor-default hover:border-white/20"
                  >
                    <Calendar size={14} className="sm:w-4 sm:h-4 text-indigo-400" />
                    <span className="text-gray-200 font-medium">Join {userInfo.joinDate}</span>
                  </motion.span>
                  
                  {userInfo.email && (
                    <motion.span 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/8 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 cursor-default hover:border-white/20"
                    >
                      <Globe size={14} className="sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-gray-200 font-medium truncate">{userInfo.email}</span>
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileHeader;