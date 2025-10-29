import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Music,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Tag,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef } from "react";

export default function GalleryShortModal({
  selectedMedia,
  setSelectedMedia,
  videoRef,
  handleNext,
  handlePrev,
}) {
  const [isMuted, setIsMuted] = useState(true);
  const newRef = useRef(null);
  const localVideoRef = videoRef || newRef;

  if (!selectedMedia || selectedMedia.type !== "short") return null;

  const handleVideoHover = () => {
    if (localVideoRef.current) localVideoRef.current.play().catch(() => {});
  };

  const handleVideoLeave = () => {
    if (localVideoRef.current) {
      localVideoRef.current.pause();
      localVideoRef.current.currentTime = 0;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Tombol Tutup */}
        <button
          onClick={() => setSelectedMedia(null)}
          className="absolute top-5 right-5 text-gray-300 hover:text-white transition z-50"
        >
          <X size={28} />
        </button>

        {/* Tombol Navigasi Kiri */}
        <button
          onClick={handlePrev}
          className="absolute left-5 text-gray-400 hover:text-white transition z-50 hidden md:block"
        >
          <ChevronLeft size={38} />
        </button>

        {/* Tombol Navigasi Kanan */}
        <button
          onClick={handleNext}
          className="absolute right-5 text-gray-400 hover:text-white transition z-50 hidden md:block"
        >
          <ChevronRight size={38} />
        </button>

        {/* Kontainer Utama */}
        <motion.div
          className="relative bg-[#1a1a1a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col md:flex-row"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Area Video */}
          <div className="w-full md:w-[55%] bg-black flex items-center justify-center p-3">
            <div className="relative w-full max-w-[320px] aspect-[9/16] flex items-center justify-center">
              <video
                ref={localVideoRef}
                src={selectedMedia.src}
                muted={isMuted}
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover rounded-xl shadow-lg"
                onMouseEnter={handleVideoHover}
                onMouseLeave={handleVideoLeave}
              />

              {/* Tombol Mute / Unmute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          {/* Informasi Video */}
          <div className="w-full md:w-[45%] bg-[#111] text-gray-200 p-5 flex flex-col justify-start gap-3 overflow-y-auto max-h-[75vh]">
            <h2 className="text-base font-bold text-white leading-tight">
              {selectedMedia.title}
            </h2>
            <p className="text-sm text-gray-300 leading-snug">
              {selectedMedia.desc}
            </p>

            {/* Tags */}
            {selectedMedia.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedMedia.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag size={11} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Musik */}
            {selectedMedia.music && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                <Music size={14} className="text-cyan-400" />
                <span>
                  {selectedMedia.music.title || "Unknown"} —{" "}
                  <span className="text-gray-400">
                    {selectedMedia.music.artist || "Unknown"}
                  </span>
                </span>
              </div>
            )}

            {/* Engagement */}
            {selectedMedia.engagement && (
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Heart size={14} className="text-pink-400" />{" "}
                  {selectedMedia.engagement.likes?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />{" "}
                  {selectedMedia.engagement.comments?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 size={14} />{" "}
                  {selectedMedia.engagement.shares?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />{" "}
                  {selectedMedia.engagement.views?.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
