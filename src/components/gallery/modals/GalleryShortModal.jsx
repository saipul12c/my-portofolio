import { motion, AnimatePresence } from "framer-motion";
import { X, Music, Heart, MessageCircle, Share2, Eye, Tag } from "lucide-react";

export default function GalleryShortModal({ selectedMedia, setSelectedMedia, videoRef }) {
  if (!selectedMedia || selectedMedia.type !== "short") return null;

  const handleVideoHover = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };

  const handleVideoLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
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
        <motion.div
          className="relative bg-[#1a1a1a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl flex flex-col md:flex-row"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-3 right-3 text-gray-300 hover:text-white transition z-20"
          >
            <X size={28} />
          </button>

          {/* Video */}
          <div className="w-full md:w-2/3 bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={selectedMedia.src}
              controls
              muted
              loop
              playsInline
              className="w-full max-h-[80vh] object-contain rounded-lg"
              onMouseEnter={handleVideoHover}
              onMouseLeave={handleVideoLeave}
            />
          </div>

          {/* Info */}
          <div className="w-full md:w-1/3 bg-[#111] text-gray-200 p-6 flex flex-col justify-start gap-3 overflow-y-auto max-h-[80vh]">
            <h2 className="text-lg font-bold text-white">{selectedMedia.title}</h2>
            <p className="text-sm text-gray-300">{selectedMedia.desc}</p>

            {/* Tags */}
            {selectedMedia.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMedia.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag size={12} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Music */}
            {selectedMedia.music && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-300">
                <Music size={16} className="text-cyan-400" />
                <span>
                  {selectedMedia.music.title || "Unknown"} —{" "}
                  <span className="text-gray-400">{selectedMedia.music.artist || "Unknown"}</span>
                </span>
              </div>
            )}

            {/* Engagement */}
            {selectedMedia.engagement && (
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Heart size={16} className="text-pink-400" /> {selectedMedia.engagement.likes?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> {selectedMedia.engagement.comments?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 size={16} /> {selectedMedia.engagement.shares?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={16} /> {selectedMedia.engagement.views?.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
