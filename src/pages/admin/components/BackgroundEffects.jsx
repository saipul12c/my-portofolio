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
    <>
      <div id="particles-container" className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20"
            style={{
              left: `${p.left}vw`,
              top: `${p.top}vh`,
              animation: `float ${p.duration}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl animate-pulse delay-1000" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </>
  );
};

export default BackgroundEffects;