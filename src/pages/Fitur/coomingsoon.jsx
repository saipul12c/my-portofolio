import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  FaRocket, FaUsers, FaVideo, FaUpload, FaComments, FaEnvelope, 
  FaCalendarAlt, FaAward, FaBolt, FaCheckCircle, FaClock, 
  FaStopwatch, FaPaperPlane, FaThumbsUp, FaExclamationCircle,
  FaEnvelopeOpen, FaPhoneAlt, FaLifeRing, FaCode, FaShoppingCart,
  FaChartBar, FaCloud, FaMobile, FaBuilding, FaGraduationCap,
  FaMobileAlt, FaTwitter, FaGithub, FaLinkedin, FaInstagram,
  FaYoutube, FaFacebook, FaDiscord, FaServer, FaDatabase,
  FaReact, FaPalette, FaPython, FaVuejs, FaCss3Alt, FaFileCode,
  FaImage, FaEye, FaHeart, FaHeadset, FaAd, FaCreditCard,
  FaDonate, FaMusic, FaGlobe, FaUserPlus, FaLightbulb,
  FaHandshake, FaMicrophone, FaUserFriends, FaCircle,
  FaBroadcastTower, FaComment, FaDollarSign, FaChartBar as FaChartBar2,
  FaBook, FaCodeBranch, FaTools, FaBox, FaLock, FaUserTie,
  FaPaintBrush, FaApple, FaAndroid
} from "react-icons/fa";
import config from '../../data/comingsoon/data.json';

const ComingSoon = () => {
  const [currentConfig, setCurrentConfig] = useState(config[0]); // Default to first config
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('main');
  const [email, setEmail] = useState('');

  const launchDate = new Date(currentConfig.launchDate).getTime();

  // Icon mapping function
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaRocket, FaUsers, FaVideo, FaUpload, FaComments, FaEnvelope,
      FaCalendarAlt, FaAward, FaBolt, FaCheckCircle, FaClock,
      FaStopwatch, FaPaperPlane, FaThumbsUp, FaExclamationCircle,
      FaEnvelopeOpen, FaPhoneAlt, FaLifeRing, FaCode, FaShoppingCart,
      FaChartBar, FaCloud, FaMobile, FaBuilding, FaGraduationCap,
      FaMobileAlt, FaTwitter, FaGithub, FaLinkedin, FaInstagram,
      FaYoutube, FaFacebook, FaDiscord, FaServer, FaDatabase,
      FaReact, FaPalette, FaPython, FaVuejs, FaCss3Alt, FaFileCode,
      FaImage, FaEye, FaHeart, FaHeadset, FaAd, FaCreditCard,
      FaDonate, FaMusic, FaGlobe, FaUserPlus, FaLightbulb,
      FaHandshake, FaMicrophone, FaUserFriends, FaCircle,
      FaBroadcastTower, FaComment, FaDollarSign, FaChartBar2,
      FaBook, FaCodeBranch, FaTools, FaBox, FaLock, FaUserTie,
      FaPaintBrush, FaApple, FaAndroid
    };
    return iconMap[iconName] || FaRocket;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleConfigChange = (configId) => {
    const selectedConfig = config.find(item => item.id === configId);
    setCurrentConfig(selectedConfig);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log('Email submitted:', email);
    setEmail('');
  };

  const renderMainContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500/20 via-purple-500/10 to-red-500/20 border border-orange-500/30 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform scale-150 opacity-10"></div>

      <div className="relative space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform">
              {React.createElement(getIconComponent(currentConfig.brand.logo), { className: "w-8 h-8 text-orange-400" })}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{currentConfig.content.title}</h2>
              <p className="text-orange-300 text-sm mt-1">{currentConfig.brand.slogan}</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">
            Coming Soon
          </span>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
          {currentConfig.content.description}
        </p>

        {/* Features Grid */}
        {currentConfig.content.features && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {currentConfig.content.features.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/30 rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Countdown Timer */}
        <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center gap-2 justify-center mb-4">
            {React.createElement(getIconComponent(currentConfig.countdownLabels.icon), { className: "w-4 h-4 text-orange-300" })}
            <p className="text-sm text-orange-300 font-semibold text-center">
              ⏰ Launch Countdown
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: days, label: currentConfig.countdownLabels.days },
              { value: hours, label: currentConfig.countdownLabels.hours },
              { value: minutes, label: currentConfig.countdownLabels.minutes },
              { value: seconds, label: currentConfig.countdownLabels.seconds }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
              >
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="text-xs text-orange-300 mt-2">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            {React.createElement(getIconComponent(currentConfig.newsletter.icon), { className: "w-5 h-5" })}
            {currentConfig.newsletter.title}
          </h3>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={currentConfig.newsletter.placeholder}
              className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-cyan-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm"
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2"
            >
              {React.createElement(getIconComponent(currentConfig.newsletter.icon), { className: "w-4 h-4" })}
              {currentConfig.newsletter.buttonText}
            </button>
          </form>
        </div>

        {/* Technology Stack */}
        {currentConfig.technology && (
          <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  {React.createElement(getIconComponent(currentConfig.technology.backend.icons.backend), { className: "w-4 h-4" })}
                  Backend
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                    {currentConfig.technology.backend.framework}
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30 flex items-center gap-1">
                    {React.createElement(getIconComponent(currentConfig.technology.backend.icons.database), { className: "w-3 h-3" })}
                    {currentConfig.technology.backend.database}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  {React.createElement(getIconComponent(currentConfig.technology.frontend.icons.frontend), { className: "w-4 h-4" })}
                  Frontend
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                    {currentConfig.technology.frontend.framework}
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                    {currentConfig.technology.frontend.styling}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderCommunityPage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              {React.createElement(getIconComponent(currentConfig.pages.community.icon), { className: "w-8 h-8 text-green-400" })}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{currentConfig.pages.community.title}</h2>
              <p className="text-green-300 text-sm mt-1">Community Hub</p>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed">
          {currentConfig.pages.community.description}
        </p>

        {/* Community Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { 
              value: currentConfig.pages.community.sections.memberStats.totalMembers.toLocaleString(), 
              label: "Total Members", 
              icon: currentConfig.pages.community.sections.memberStats.icons.total 
            },
            { 
              value: currentConfig.pages.community.sections.memberStats.onlineNow, 
              label: "Online Now", 
              icon: currentConfig.pages.community.sections.memberStats.icons.online 
            },
            { 
              value: currentConfig.pages.community.sections.memberStats.newToday, 
              label: "New Today", 
              icon: currentConfig.pages.community.sections.memberStats.icons.new 
            }
          ].map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-black/30 rounded-xl p-6 border border-green-500/20 text-center hover:bg-green-500/10 transition-all"
              >
                <IconComponent className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-green-300">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Forum Categories */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            {React.createElement(getIconComponent(currentConfig.pages.community.sections.forum.icon), { className: "w-6 h-6 text-green-400" })}
            {currentConfig.pages.community.sections.forum.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentConfig.pages.community.sections.forum.categories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/30 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-all flex items-center gap-3"
                >
                  <IconComponent className="w-5 h-5 text-green-400" />
                  <div className="font-semibold text-green-300">{category.name}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            {React.createElement(getIconComponent(currentConfig.pages.community.sections.events.icon), { className: "w-6 h-6 text-green-400" })}
            {currentConfig.pages.community.sections.events.title}
          </h3>
          <div className="space-y-4">
            {currentConfig.pages.community.sections.events.upcomingEvents.map((event, index) => {
              const IconComponent = getIconComponent(event.icon);
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/30 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-green-400" />
                      <div className="font-semibold text-white text-lg">{event.name}</div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30">
                      {event.participants} peserta
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {new Date(event.date).toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderLivestreamPage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-red-500/20 to-pink-500/10 border border-red-500/30 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 rounded-xl">
              {React.createElement(getIconComponent(currentConfig.pages.livestream.icon), { className: "w-8 h-8 text-red-400" })}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">{currentConfig.pages.livestream.title}</h2>
              <p className="text-red-300 text-sm mt-1">Video & Streaming Platform</p>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-lg leading-relaxed">
          {currentConfig.pages.livestream.description}
        </p>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Video Upload Features */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-black/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {React.createElement(getIconComponent(currentConfig.pages.livestream.features.videoUpload.icon), { className: "w-5 h-5 text-red-400" })}
              Video Upload
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Ukuran Maksimal:</span>
                <span className="font-semibold text-red-300">{currentConfig.pages.livestream.features.videoUpload.maxSize}</span>
              </div>
              <div>
                <span className="text-gray-300">Format yang Didukung:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentConfig.pages.livestream.features.videoUpload.allowedFormats.map((format, index) => (
                    <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Livestream Features */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-black/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {React.createElement(getIconComponent(currentConfig.pages.livestream.features.livestream.icon), { className: "w-5 h-5 text-red-400" })}
              Livestreaming
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Durasi Maksimal:</span>
                <span className="font-semibold text-red-300">{currentConfig.pages.livestream.features.livestream.maxDuration}</span>
              </div>
              <div>
                <span className="text-gray-300">Kualitas Video:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentConfig.pages.livestream.features.livestream.qualityOptions.map((quality, index) => (
                    <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">
                      {quality}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interaction Features */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-black/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-4">Interaksi</h3>
            <div className="space-y-3">
              {Object.entries(currentConfig.pages.livestream.features.interaction).map(([feature, available]) => {
                if (feature === 'icons') return null;
                const IconComponent = getIconComponent(currentConfig.pages.livestream.features.interaction.icons[feature]);
                return (
                  <div key={feature} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${available ? 'text-green-400' : 'text-gray-400'}`} />
                      <span className="text-gray-300 capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                    {available && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Monetization */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-black/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-4">Monetisasi</h3>
            <div className="space-y-3">
              {Object.entries(currentConfig.pages.livestream.monetization).map(([method, available]) => {
                if (method === 'icons') return null;
                const IconComponent = getIconComponent(currentConfig.pages.livestream.monetization.icons[method]);
                return (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${available ? 'text-green-400' : 'text-gray-400'}`} />
                      <span className="text-gray-300 capitalize">{method}</span>
                    </div>
                    {available && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Content Categories */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Kategori Konten</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentConfig.pages.livestream.contentCategories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-black/30 rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <IconComponent className="w-5 h-5 text-red-400" />
                    <div className="font-semibold text-red-300 text-lg">{category.name}</div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <div key={subIndex} className="px-2 py-1 bg-red-500/10 rounded border border-red-500/20">
                        {sub}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'community':
        return renderCommunityPage();
      case 'livestream':
        return renderLivestreamPage();
      default:
        return renderMainContent();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col px-6 sm:px-10 md:px-20 relative overflow-hidden py-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto w-full">
        {/* Config Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-center"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
            <div className="flex gap-2">
              {config.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleConfigChange(item.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    currentConfig.id === item.id 
                      ? 'bg-orange-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.brand.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-red-400 to-purple-500 bg-clip-text text-transparent">
            {currentConfig.brand.name}
          </h1>
          <p className="text-gray-400 mt-2 text-lg">{currentConfig.brand.slogan}</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { key: 'main', label: 'Beranda', color: 'orange' },
                { key: 'community', label: currentConfig.pages.community.title, color: 'green' },
                { key: 'livestream', label: currentConfig.pages.livestream.title, color: 'red' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.key 
                      ? `bg-${tab.color}-500 text-white shadow-lg` 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>

        {/* Contact Information */}
        {currentConfig.contact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-black/30 rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 text-cyan-400">
                {React.createElement(getIconComponent(currentConfig.contact.email.icon), { className: "w-5 h-5" })}
                <span>{currentConfig.contact.email.address}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                {React.createElement(getIconComponent(currentConfig.contact.phone.icon), { className: "w-5 h-5" })}
                <span>{currentConfig.contact.phone.number}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-orange-400">
                {React.createElement(getIconComponent(currentConfig.contact.support.icon), { className: "w-5 h-5" })}
                <span>Support {currentConfig.contact.support.available ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-6 mt-12"
        >
          {currentConfig.socialLinks.map((social, index) => {
            const IconComponent = getIconComponent(social.icon);
            return (
              <motion.a
                key={index}
                href={social.url}
                whileHover={{ scale: 1.2 }}
                className="p-3 bg-white/5 hover:bg-orange-500/20 rounded-xl transition-all transform group border border-white/20"
                title={`Follow us on ${social.name}`}
              >
                <IconComponent className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;