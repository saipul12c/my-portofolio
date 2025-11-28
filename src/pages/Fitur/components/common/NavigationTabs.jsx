import React from 'react';
import { motion } from 'framer-motion';

const NavigationTabs = ({ activeTab, setActiveTab, currentConfig }) => (
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
);

export default NavigationTabs;