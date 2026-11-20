import React, { memo } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Center Spinner & Greeting */}
      <motion.div
        className="flex flex-col items-center space-y-5 px-4 text-center z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
          <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1.5 -right-1.5 animate-bounce" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Memuat Profil & Halaman...
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-normal">
            Menyiapkan informasi portofolio dan pencapaian ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(LoadingScreen);
