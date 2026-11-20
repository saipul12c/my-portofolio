import { memo, useState, useEffect } from "react";

const BackgroundEffects = memo(() => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 250);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ isolation: 'isolate', contain: 'strict' }}
      aria-hidden="true"
    >
      {/* Optimized Ambient Glows - Uses low-cost CSS radial gradients instead of heavy GPU blurs */}
      <div 
        className="absolute top-0 left-1/4 w-[280px] sm:w-[420px] lg:w-[520px] h-[280px] sm:h-[420px] lg:h-[520px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0) 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[320px] sm:w-[480px] lg:w-[600px] h-[320px] sm:h-[480px] lg:h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Gentle Particles - Only on Desktop/Tablet to keep mobile 60 FPS and save battery */}
      {!isMobile && (
        <div className="absolute inset-0">
          {[
            { id: 1, left: 15, top: 20, dur: 18 },
            { id: 2, left: 75, top: 25, dur: 22 },
            { id: 3, left: 35, top: 65, dur: 25 },
            { id: 4, left: 85, top: 75, dur: 20 },
            { id: 5, left: 50, top: 40, dur: 19 },
            { id: 6, left: 20, top: 85, dur: 24 },
          ].map((p) => (
            <div
              key={p.id}
              className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-25"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `floatParticle ${p.dur}s ease-in-out infinite alternate`,
                transform: 'translate3d(0,0,0)',
                willChange: 'transform',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes floatParticle {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(12px, -18px, 0); }
        }
      `}</style>
    </div>
  );
});

BackgroundEffects.displayName = "BackgroundEffects";

export default BackgroundEffects;
