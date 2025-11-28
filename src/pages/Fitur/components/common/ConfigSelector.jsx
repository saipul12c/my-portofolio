import React from 'react';
import { motion } from 'framer-motion';

const ConfigSelector = ({ configList, currentConfig, handleConfigChange }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 flex justify-center"
  >
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/20">
      <div className="flex gap-2">
        {configList.map((item) => (
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
);

export default ConfigSelector;