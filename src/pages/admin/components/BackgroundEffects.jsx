import { useEffect } from "react";

const BackgroundEffects = () => {
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.top = Math.random() * 100 + 'vh';
      particle.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
      document.getElementById('particles-container')?.appendChild(particle);
    };

    for (let i = 0; i < 20; i++) {
      createParticle();
    }

    return () => {
      const container = document.getElementById('particles-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <div id="particles-container" className="absolute inset-0 overflow-hidden pointer-events-none" />
      
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