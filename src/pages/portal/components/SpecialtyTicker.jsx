import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { specialties } from '../modules/portalData';

const SpecialtyTicker = memo(() => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.5 }}
        className="text-yellow-400 font-medium"
      >
        {specialties[index]}
      </motion.span>
    </AnimatePresence>
  );
});

SpecialtyTicker.displayName = 'SpecialtyTicker';
export default SpecialtyTicker;
