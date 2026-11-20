import React from 'react';
import { motion } from 'framer-motion';
import getIconComponent from '../../config/iconMapper';
import { playClick } from '../../utils/soundEffects';

const SocialLinks = ({ currentConfig }) => {
  const isCyan = currentConfig.themeColor === 'cyan';
  const socialLinks = currentConfig.socialLinks || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-8 flex flex-col items-center justify-center gap-3"
    >
      <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
        TERHUBUNG DENGAN KAMI DI MEDIA SOSIAL
      </span>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {socialLinks.map((social, index) => {
          const IconComponent = getIconComponent(social.icon);
          return (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 shadow-md group ${
                isCyan ? 'hover:border-cyan-400/50' : 'hover:border-orange-400/50'
              }`}
              title={`Kunjungi ${social.name}`}
            >
              <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-colors ${
                isCyan ? 'group-hover:text-cyan-400' : 'group-hover:text-orange-400'
              }`} />
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SocialLinks;
