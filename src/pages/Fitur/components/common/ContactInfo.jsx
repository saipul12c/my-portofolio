import React from 'react';
import { motion } from 'framer-motion';
import getIconComponent from '../../config/iconMapper';

const ContactInfo = ({ currentConfig }) => (
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
);

export default ContactInfo;