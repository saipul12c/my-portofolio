import React from 'react';
import { motion } from 'framer-motion';
import getIconComponent from '../../config/iconMapper';
import { containerVariants, itemVariants } from '../../utils/animations';

const MainContent = ({ 
  currentConfig, 
  years,
  days, 
  hours, 
  minutes, 
  seconds, 
  email, 
  setEmail, 
  handleNewsletterSubmit 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-orange-500/20 via-purple-500/10 to-red-500/20 border border-orange-500/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform scale-150 opacity-10"></div>

    <div className="relative space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform">
            {React.createElement(getIconComponent(currentConfig.brand.logo), { className: "w-8 h-8 text-orange-400" })}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{currentConfig.content.title}</h2>
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
      <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-orange-500/20">
        <div className="flex items-center gap-2 justify-center mb-4">
          {React.createElement(getIconComponent(currentConfig.countdownLabels.icon), { className: "w-4 h-4 text-orange-300" })}
          <p className="text-sm text-orange-300 font-semibold text-center">
            ⏰ Launch Countdown
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {[
            { value: years, label: (currentConfig.countdownLabels && currentConfig.countdownLabels.years) || 'Years' },
            { value: days, label: (currentConfig.countdownLabels && currentConfig.countdownLabels.days) || 'Days' },
            { value: hours, label: (currentConfig.countdownLabels && currentConfig.countdownLabels.hours) || 'Hours' },
            { value: minutes, label: (currentConfig.countdownLabels && currentConfig.countdownLabels.minutes) || 'Minutes' },
            { value: seconds, label: (currentConfig.countdownLabels && currentConfig.countdownLabels.seconds) || 'Seconds' }
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

export default MainContent;