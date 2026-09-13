import { memo } from "react";

function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transform-gpu contain-strict">
      <style>{`
        @keyframes float-cyan {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(30px, 25px, 0) scale(1.15); }
        }
        @keyframes float-purple {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-35px, -30px, 0) scale(1.2); }
        }
        @keyframes float-blue {
          0%, 100% { transform: translate3d(-50%, -50%, 0) scale(1) rotate(0deg); }
          50% { transform: translate3d(-50%, -50%, 0) scale(1.25) rotate(180deg); }
        }
        @keyframes float-green {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(20px, -25px, 0) scale(1.15); }
        }
        @keyframes float-pink {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-20px, 30px, 0) scale(1.2); }
        }
      `}</style>

      {/* Cyan Glowing Orb */}
      <div 
        className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-60 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)",
          animation: "float-cyan 9s ease-in-out infinite",
        }}
      />
      
      {/* Purple Glowing Orb */}
      <div 
        className="absolute bottom-10 right-4 sm:right-10 w-60 h-60 sm:w-96 sm:h-96 rounded-full opacity-60 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(168, 85, 247, 0.08) 45%, transparent 70%)",
          animation: "float-purple 11s ease-in-out infinite",
        }}
      />
      
      {/* Center Ambient Blue Orb */}
      <div 
        className="absolute top-1/2 left-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full opacity-40 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)",
          animation: "float-blue 16s ease-in-out infinite",
        }}
      />

      {/* Green Floating Accent */}
      <div 
        className="absolute top-1/4 right-1/4 w-44 h-44 sm:w-60 sm:h-60 rounded-full opacity-40 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
          animation: "float-green 7s ease-in-out infinite",
        }}
      />

      {/* Pink Floating Accent */}
      <div 
        className="absolute bottom-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-40 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
          animation: "float-pink 10s ease-in-out infinite",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
    </div>
  );
}

export default memo(BackgroundGlow);