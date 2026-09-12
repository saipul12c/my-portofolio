import { useState, useEffect } from "react";

const BackgroundEffects = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 20;
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 20 + 10,
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ isolation: 'isolate', contain: 'paint layout' }}
    >
      <div id="particles-container" className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1.5 h-1.5 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20"
            style={{
              left: `${p.left}vw`,
              top: `${p.top}vh`,
              animation: `float ${p.duration}s linear infinite`,
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
            }}
          />
        ))}
      </div>
      
      {/* Animated Gradient Orbs with GPU acceleration */}
      <div 
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" 
        style={{ willChange: 'opacity, transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl animate-pulse delay-1000" 
        style={{ willChange: 'opacity, transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate3d(0px, 0px, 0) rotate(0deg); }
          50% { transform: translate3d(0px, -20px, 0) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default BackgroundEffects;