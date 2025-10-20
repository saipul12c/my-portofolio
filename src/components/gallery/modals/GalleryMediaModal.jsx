import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Eye, Tag, UserCheck, Music } from "lucide-react";

export default function GalleryMediaModal({ selectedMedia, setSelectedMedia, currentIndex, setCurrentIndex }) {
  if (!selectedMedia || (selectedMedia.type === "short")) return null;

  const handlePrev = () => {
    if (!selectedMedia?.src?.length) return;
    setCurrentIndex(prev => prev === 0 ? selectedMedia.src.length - 1 : prev - 1);
  };

  const handleNext = () => {
    if (!selectedMedia?.src?.length) return;
    setCurrentIndex(prev => prev === selectedMedia.src.length - 1 ? 0 : prev + 1);
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
          className="relative bg-[#1a1a1a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-6xl flex flex-col md:flex-row"
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

          {/* Media */}
          <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative">
            {(selectedMedia.type === "album" || (selectedMedia.type === "image" && Array.isArray(selectedMedia.src))) ? (
              <>
                <img src={selectedMedia.src[currentIndex]} alt={`${selectedMedia.title} ${currentIndex + 1}`} className="w-full max-h-[85vh] object-contain rounded-lg" />
                {selectedMedia.src.length > 1 && (
                  <>
                    <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"><ChevronLeft size={24} /></button>
                    <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"><ChevronRight size={24} /></button>
                  </>
                )}
              </>
            ) : (
              <video src={selectedMedia.src} controls muted loop playsInline className="w-full max-h-[85vh] object-contain rounded-lg" />
            )}
          </div>

          {/* Info */}
          <div className="w-full md:w-1/3 bg-[#111] text-gray-200 p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {selectedMedia.creator && (
                <div className="flex items-center gap-3 mb-5">
                  {selectedMedia.creator.avatar && (
                    <img src={selectedMedia.creator.avatar} alt={selectedMedia.creator.display_name} className="w-10 h-10 rounded-full border border-white/20" />
                  )}
                  <div>
                    <h3 className="font-semibold text-cyan-300 flex items-center gap-1">
                      {selectedMedia.creator.display_name}
                      {selectedMedia.creator.verified && <span className="text-cyan-400 text-xs">✔</span>}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">@{selectedMedia.creator.username} <UserCheck size={12} /> {(selectedMedia.creator.followers || 0).toLocaleString()} followers</p>
                  </div>
                </div>
              )}

              <h2 className="text-lg font-bold mb-2 text-white">{selectedMedia.title}</h2>
              <p className="text-sm text-gray-300 mb-3">{selectedMedia.desc}</p>

              {/* Tags */}
              {selectedMedia.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMedia.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-2 py-1 rounded-full flex items-center gap-1"><Tag size={12} /> {tag}</span>
                  ))}
                </div>
              )}

              {/* Music */}
              {selectedMedia.music && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
                  <Music size={16} className="text-cyan-400" />
                  <span>{selectedMedia.music.title} — <span className="text-gray-400">{selectedMedia.music.artist}</span></span>
                </div>
              )}

              {/* Engagement */}
              {selectedMedia.engagement && (
                <div className="flex items-center gap-6 mb-5 text-sm text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1"><Heart size={16} className="text-pink-400" /> {(selectedMedia.engagement.likes || 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={16} /> {(selectedMedia.engagement.comments || 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Share2 size={16} /> {(selectedMedia.engagement.shares || 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Eye size={16} /> {(selectedMedia.engagement.views || 0).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
