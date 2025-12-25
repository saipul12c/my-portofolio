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
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import GalleryShareBar from "../GalleryShareBar";

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
  const navigate = useNavigate();

  const handleVideoHover = () => {
    // Optional: Add hover effects if needed
  };

  const handleVideoLeave = () => {
    // Optional: Add leave effects if needed
  };

  if (!selectedMedia || selectedMedia.type !== "short") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedMedia(null)}
          className="absolute top-3 right-3 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          <X size={24} />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition z-50 hidden sm:block"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition z-50 hidden sm:block"
        >
          <ChevronRight size={28} />
        </button>

        {/* Main Container */}
        <motion.div
          className="relative bg-[#1a1a1a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl h-full max-h-[95vh] flex flex-col md:flex-row"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Video Area */}
          <div className="w-full md:w-[55%] bg-black flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] flex items-center justify-center">
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

              {/* Mute/Unmute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              {/* Mobile Navigation Hints */}
              <div className="absolute bottom-2 left-2 text-white/70 text-xs sm:hidden">
                ← Swipe →
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div className="w-full md:w-[45%] bg-[#111] text-gray-200 p-4 sm:p-6 flex flex-col gap-3 overflow-y-auto">
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
              {selectedMedia.title}
            </h2>
            <p className="text-sm text-gray-300 leading-snug line-clamp-3">
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

            {/* Music */}
            {selectedMedia.music && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                <Music size={14} className="text-cyan-400 flex-shrink-0" />
                <span className="truncate">
                  {selectedMedia.music.title || "Unknown"} —{" "}
                  <span className="text-gray-400">
                    {selectedMedia.music.artist || "Unknown"}
                  </span>
                </span>
              </div>
            )}

            {/* Engagement Stats */}
            {selectedMedia.engagement && (
              <div className="flex items-center gap-3 sm:gap-4 mt-3 text-xs text-gray-400 flex-wrap">
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

            {/* Comments Preview */}
            {selectedMedia.comments_preview && selectedMedia.comments_preview.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-white mb-2">Komentar</h3>
                <div className="flex flex-col gap-3">
                  {selectedMedia.comments_preview.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <img src={c.avatar} alt={c.user} className="w-9 h-9 rounded-full object-cover border border-white/10" loading="lazy" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-cyan-300">{c.user}</span>
                          <span className="text-xs text-gray-400">{new Date(c.posted_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-300">{c.comment}</p>
                      </div>
                    </div>
                  ))}

                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/gallery/shorts/${selectedMedia.id}`}
                        onClick={() => setSelectedMedia(null)}
                        className="text-sm px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-center"
                      >
                        Lihat detail
                      </Link>
                      <Link
                        to={`/gallery/shorts/${selectedMedia.id}`}
                        onClick={() => setSelectedMedia(null)}
                        className="text-sm px-3 py-1 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 text-center"
                      >
                        Lihat semua komentar
                      </Link>
                    </div>
                </div>
              </div>
            )}

            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-white/10">
              <GalleryShareBar media={selectedMedia} />
              <div className="flex gap-3 md:hidden">
                <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2">
                  <Heart size={16} />
                  Like
                </button>
                <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Navigation Buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 sm:hidden">
          <button
            onClick={handlePrev}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
