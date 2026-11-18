import React, { useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

/**
 * Avatar component - displays owner photo with stylish border, verified badge, and fallback to initials
 */
export const Avatar = ({ initials = "SM", src = "/images/5R x12.jpg", alt = "Muhammad Syaiful Mukmin" }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group">
      {/* Halo Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500" />

      {/* Avatar Container */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1 bg-slate-900/90 ring-2 ring-cyan-400/40 overflow-hidden shadow-2xl flex items-center justify-center">
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
            {initials}
          </div>
        )}
      </div>

      {/* Verified / Active Badge */}
      <div className="absolute bottom-1 right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-slate-900 flex items-center justify-center">
        <ShieldCheck className="w-4 h-4 text-white" />
      </div>

      {/* Floating Sparkle */}
      <div className="absolute top-0 right-1 bg-purple-500/80 backdrop-blur-sm text-yellow-300 p-1.5 rounded-full border border-purple-300/30 shadow-md animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
