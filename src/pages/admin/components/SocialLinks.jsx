import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SOCIAL_LINKS } from "../utils/constants";

const SocialLinks = memo(({ contactAnim }) => {
  return (
    <motion.div
      {...contactAnim}
      className="mt-10 sm:mt-14 lg:mt-16 text-gray-300 text-center max-w-6xl relative z-10 px-3 sm:px-4 w-full"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 280px" }}
    >
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 mb-3 px-4 sm:px-5 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-md">
          <Sparkles className="text-cyan-400 flex-shrink-0" size={18} />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Terhubung Dengan Saya
          </h3>
          <Sparkles className="text-cyan-400 flex-shrink-0" size={18} />
        </div>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          Temukan saya di platform lain untuk kolaborasi dan kabar terbaru
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi lewat ${item.label}`}
            className="bg-slate-900/60 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center group border border-white/10 hover:border-cyan-500/40 shadow-md hover:shadow-cyan-500/10 transition-transform duration-200 hover:-translate-y-1 active:scale-95 touch-manipulation"
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 ${item.color} rounded-xl flex items-center justify-center text-white mx-auto mb-2 shadow-md group-hover:scale-105 transition-transform duration-200`}>
              {item.icon}
            </div>
            <div className="font-semibold text-white mb-0.5 text-xs sm:text-sm">{item.label}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">{item.desc}</div>
          </a>
        ))}
      </div>
    </motion.div>
  );
});

SocialLinks.displayName = "SocialLinks";

export default SocialLinks;
