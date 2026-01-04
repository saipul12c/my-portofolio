import { motion } from "framer-motion";
import React from "react";

// Thinking Animation - Rotating circles
export function Thinking() {
  return (
    <motion.div className="flex items-center gap-2 h-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--saipul-accent)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.8,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}

// Wave Animation - For streaming/video-like effect
export function WaveAnimation() {
  return (
    <motion.div className="flex items-center gap-1 h-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full flex-1"
          style={{ background: 'var(--saipul-accent)' }}
          animate={{ height: ['8px', '24px', '8px'] }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}

// Photo/Image Processing Animation
export function PhotoProcessingAnimation() {
  return (
    <motion.div className="flex items-center gap-2 h-6">
      <motion.div
        className="flex gap-1"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--saipul-accent)' }}
        />
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--saipul-accent)', opacity: 0.6 }}
        />
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--saipul-accent)', opacity: 0.3 }}
        />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-1 h-1 rounded-full"
        style={{ background: 'var(--saipul-accent)' }}
      />
    </motion.div>
  );
}

// Video Processing Animation - Filmstrip style
export function VideoProcessingAnimation() {
  return (
    <motion.div className="flex items-center gap-1 h-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-4 border border-current rounded-sm flex items-center justify-center"
          style={{ borderColor: 'var(--saipul-accent)' }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            delay: i * 0.15,
            repeat: Infinity,
          }}
        >
          <motion.div
            className="w-1 h-1"
            style={{ background: 'var(--saipul-accent)' }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              repeat: Infinity,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Pulse Animation - Smooth breathing effect
export function PulseAnimation() {
  return (
    <motion.div className="flex items-center gap-2 h-6">
      <motion.div
        className="w-3 h-3 rounded-full"
        style={{ background: 'var(--saipul-accent)' }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xs"
        style={{ color: 'var(--saipul-accent)' }}
      >
        ●●●
      </motion.div>
    </motion.div>
  );
}

// Shimmer Animation - Loading skeleton style
export function ShimmerAnimation() {
  return (
    <motion.div className="flex items-center gap-2 h-6">
      <motion.div
        className="h-3 rounded-full flex-1 max-w-[40px]"
        style={{
          background: 'linear-gradient(90deg, var(--saipul-accent) 0%, rgba(255,255,255,0.1) 50%, var(--saipul-accent) 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.div
        className="h-3 rounded-full flex-1 max-w-[40px]"
        style={{
          background: 'linear-gradient(90deg, var(--saipul-accent) 0%, rgba(255,255,255,0.1) 50%, var(--saipul-accent) 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
    </motion.div>
  );
}

// Orbit Animation - Circular motion
export function OrbitAnimation() {
  return (
    <motion.div className="relative w-6 h-6 flex items-center justify-center">
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: 'var(--saipul-accent)',
          boxShadow: '0 0 8px var(--saipul-accent)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        initial={{ x: 6 }}
      />
      <div
        className="w-1 h-1 rounded-full"
        style={{ background: 'var(--saipul-accent)' }}
      />
    </motion.div>
  );
}

// Bouncing Animation - Dynamic energy
export function BouncingAnimation() {
  return (
    <motion.div className="flex items-center gap-1 h-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full"
          style={{
            background: 'var(--saipul-accent)',
            height: '24px',
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}

// Spotlight Animation - Scanning effect
export function SpotlightAnimation() {
  return (
    <motion.div className="flex items-center gap-1 h-6">
      <motion.div
        className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, var(--saipul-accent) 0%, transparent 70%)',
        }}
        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div
        animate={{ x: [0, 4, 8, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xs"
        style={{ color: 'var(--saipul-accent)' }}
      >
        ➤
      </motion.div>
    </motion.div>
  );
}

// DNA Helix Animation
export function DNAAnimation() {
  return (
    <motion.div className="flex items-center gap-3 h-6">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background: 'var(--saipul-accent)',
            height: '24px',
          }}
          animate={{
            scaleY: [0.5, 1, 0.5],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}

// Component yang memilih loading animation secara random atau berdasarkan tipe
export function MultiLoadingAnimation({ type = 'random', variant = 'thinking' }) {
  const animations = [
    'thinking',
    'wave',
    'photo',
    'video',
    'pulse',
    'shimmer',
    'orbit',
    'bouncing',
    'spotlight',
    'dna',
  ];

  const selectedType = type === 'random' ? animations[Math.floor(Math.random() * animations.length)] : type;

  const renderAnimation = () => {
    switch (selectedType) {
      case 'thinking':
        return <Thinking />;
      case 'wave':
        return <WaveAnimation />;
      case 'photo':
        return <PhotoProcessingAnimation />;
      case 'video':
        return <VideoProcessingAnimation />;
      case 'pulse':
        return <PulseAnimation />;
      case 'shimmer':
        return <ShimmerAnimation />;
      case 'orbit':
        return <OrbitAnimation />;
      case 'bouncing':
        return <BouncingAnimation />;
      case 'spotlight':
        return <SpotlightAnimation />;
      case 'dna':
        return <DNAAnimation />;
      default:
        return <ThinkingAnimation />;
    }
  };

  return (
    <motion.div
      className="inline-flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderAnimation()}
    </motion.div>
  );
}

export default MultiLoadingAnimation;
