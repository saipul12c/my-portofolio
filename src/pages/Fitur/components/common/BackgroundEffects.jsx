import React from 'react';

const BackgroundEffects = ({ themeColor = 'cyan' }) => {
  const isCyan = themeColor === 'cyan';
  const isPurple = themeColor === 'purple';

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Dynamic Ambient Glow matching the global site theme */}
      <div
        className={`absolute top-10 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[130px] will-change-transform transition-all duration-700 ${isCyan ? 'bg-cyan-500/15' : isPurple ? 'bg-purple-600/15' : 'bg-orange-500/15'
          }`}
      />
      <div
        className={`absolute top-1/3 right-10 w-[450px] h-[450px] rounded-full blur-[130px] will-change-transform transition-all duration-700 ${isCyan ? 'bg-blue-600/15' : isPurple ? 'bg-indigo-600/15' : 'bg-amber-600/15'
          }`}
      />
      <div
        className={`absolute bottom-20 left-10 w-[550px] h-[550px] rounded-full blur-[140px] will-change-transform transition-all duration-700 ${isCyan ? 'bg-teal-500/10' : isPurple ? 'bg-fuchsia-600/10' : 'bg-rose-600/10'
          }`}
      />
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[35rem] h-52 bg-gradient-to-r ${isCyan
            ? 'from-cyan-500/10 via-blue-500/10 to-teal-500/10'
            : isPurple
              ? 'from-purple-500/10 via-indigo-500/10 to-blue-500/10'
              : 'from-orange-500/10 via-amber-500/10 to-rose-500/10'
          } blur-3xl rounded-full`}
      />

      {/* Site-wide Subtle Radial Dot Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
    </div>
  );
};

export default BackgroundEffects;
