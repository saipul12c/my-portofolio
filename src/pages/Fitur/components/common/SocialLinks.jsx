import React from 'react';
import { motion } from 'framer-motion';
import getIconComponent from '../../config/iconMapper';

const SocialLinks = ({ currentConfig }) => (
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
);

export default SocialLinks;