import React from 'react';
import { motion } from 'framer-motion';
import getIconComponent from '../../config/iconMapper';
import { containerVariants, itemVariants } from '../../utils/animations';

const LivestreamPage = ({ currentConfig }) => (
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

export default LivestreamPage;