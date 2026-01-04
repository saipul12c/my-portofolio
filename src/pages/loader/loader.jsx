"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateDimension = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimension();
    window.addEventListener('resize', updateDimension);
    return () => window.removeEventListener('resize', updateDimension);
  }, []);

  // Partikel dikalkulasi setelah dimensi tersedia
  const particles = useMemo(() => {
    if (dimension.width === 0) return [];
    return [...Array(12)].map((_, i) => ({
      id: i,
      x: Math.random() * dimension.width,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2
    }));
  }, [dimension.width]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curveTransition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] };

  // Variants simplified for readability
  const curveVariants = {
    initial: { d: initialPath },
    enter: { d: targetPath, transition: curveTransition },
    exit: { d: initialPath, transition: { ...curveTransition, delay: 0.2 } }
  };

  const text = "こんにちは";

  // Prevent SSR Mismatch
  if (!isClient || dimension.width === 0) return null;

  return (
    <motion.div 
      initial={{ top: "-100vh", opacity: 0 }}
      animate={{ top: "0vh", opacity: 1 }}
      exit={{ 
        top: "-100vh", 
        opacity: 0,
        transition: { 
          duration: 1, 
          ease: [0.76, 0, 0.24, 1],
          opacity: { duration: 0.5 }
        }
      }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-transparent"
      role="progressbar"
      aria-busy="true"
    >
      {/* Background SVG Curve */}
      <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none">
        <defs>
          <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" /> {/* Purple-600 */}
            <stop offset="50%" stopColor="#DB2777" /> {/* Pink-600 */}
            <stop offset="100%" stopColor="#4F46E5" /> {/* Indigo-600 */}
          </linearGradient>
        </defs>
        <motion.path variants={curveVariants} initial="initial" animate="enter" exit="exit" fill="url(#loaderGradient)" />
      </svg>

      {/* Decorative Elements Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Particle Trail */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: dimension.height + 100, x: p.x, opacity: 0 }}
            animate={{ 
              y: -200, 
              opacity: [0, 0.8, 0],
              transition: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }
            }}
            className="absolute w-[2px] h-12 bg-gradient-to-t from-transparent via-white/40 to-transparent"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Japanese Text */}
          <div className="flex space-x-2 mb-2">
            {text.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ 
                  delay: 0.6 + (i * 0.1), 
                  type: "spring", 
                  stiffness: 150 
                }}
                className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 0.9, letterSpacing: "0.6em" }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-sm md:text-base font-medium text-white/80 uppercase tracking-widest"
          >
            Konnichiwa
          </motion.p>

          {/* Loading Bar Container */}
          <div className="mt-8 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </div>
          
          <motion.span 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-4 text-[10px] font-mono text-white/50 tracking-tighter"
          >
            SYSTEM_LOADING_INIT...
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loader;