import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Avatar component - displays initials in a circular avatar
 */
export const Avatar = ({ initials }) => (
  <div className="relative mb-6">
    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm 
                  flex items-center justify-center text-5xl font-bold text-teal-900 
                  border-4 border-white/30 shadow-2xl">
      {initials}
    </div>
    <div className="absolute bottom-4 right-4 bg-emerald-400 text-white p-2 rounded-full shadow-lg">
      <Sparkles className="w-5 h-5" />
    </div>
  </div>
);
