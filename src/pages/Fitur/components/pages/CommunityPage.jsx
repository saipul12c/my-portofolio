import React from 'react';
import { motion } from 'framer-motion';
import getIconComponent from '../../config/iconMapper';
import { containerVariants, itemVariants } from '../../utils/animations';

const CommunityPage = ({ currentConfig }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 backdrop-blur-xl rounded-2xl p-3 sm:p-6 md:p-8 hover:shadow-2xl transition-all w-full max-w-3xl mx-auto"
  >
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500/20 rounded-xl">
            {React.createElement(getIconComponent(currentConfig.pages.community.icon), { className: "w-8 h-8 text-green-400" })}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{currentConfig.pages.community.title}</h2>
            <p className="text-green-300 text-xs sm:text-sm mt-1">Community Hub</p>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
        {currentConfig.pages.community.description}
      </p>

      {/* Community Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6"
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
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
          {React.createElement(getIconComponent(currentConfig.pages.community.sections.forum.icon), { className: "w-6 h-6 text-green-400" })}
          {currentConfig.pages.community.sections.forum.title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
          {React.createElement(getIconComponent(currentConfig.pages.community.sections.events.icon), { className: "w-6 h-6 text-green-400" })}
          {currentConfig.pages.community.sections.events.title}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {currentConfig.pages.community.sections.events.upcomingEvents.map((event, index) => {
            const IconComponent = getIconComponent(event.icon);
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-black/30 rounded-xl p-3 sm:p-4 border border-green-500/20 hover:border-green-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-green-400" />
                    <div className="font-semibold text-white text-base sm:text-lg">{event.name}</div>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30">
                    {event.participants} peserta
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
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

export default CommunityPage;