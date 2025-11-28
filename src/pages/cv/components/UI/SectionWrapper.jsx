import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, className = '', variants }) => {
  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      variants={variants || defaultVariants}
      className={`bg-[#0f172a]/80 backdrop-blur-md rounded-2xl p-6 border border-blue-900/40 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;