import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Eye, Tag, UserCheck, Music } from "lucide-react";
import GalleryShareBar from "../GalleryShareBar";

export default function GalleryMediaModal({ selectedMedia, setSelectedMedia, currentIndex, setCurrentIndex }) {
  if (!selectedMedia || selectedMedia.type === "short") return null;

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
        {/* Main Container */}
        <motion.div
          className="relative bg-[#1a1a1a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-3 right-3 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <X size={24} />
          </button>

          {/* Media Section */}
          <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative p-4">
            {/* Album/Image Gallery */}
            {(selectedMedia.type === "album" || (selectedMedia.type === "image" && Array.isArray(selectedMedia.src))) ? (
              <>
                <img 
                  src={selectedMedia.src[currentIndex]} 
                  alt={`${selectedMedia.title} ${currentIndex + 1}`} 
                  className="w-full h-full max-h-[70vh] object-contain rounded-lg"
                />
                {selectedMedia.src.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentIndex + 1} / {selectedMedia.src.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Single Image or Video */
              <>
                {selectedMedia.type === "image" ? (
                  <img 
                    src={selectedMedia.src} 
                    alt={selectedMedia.title}
                    className="w-full h-full max-h-[70vh] object-contain rounded-lg"
                  />
                ) : (
                  <video 
                    src={selectedMedia.src} 
                    controls 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full max-h-[70vh] object-contain rounded-lg"
                  />
                )}
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/3 bg-[#111] text-gray-200 p-4 md:p-6 flex flex-col overflow-y-auto">
            <div className="flex-1">
              {/* Creator Info */}
              {selectedMedia.creator && (
                <div className="flex items-center gap-3 mb-4">
                  {selectedMedia.creator.avatar && (
                    <img 
                      src={selectedMedia.creator.avatar} 
                      alt={selectedMedia.creator.display_name} 
                      className="w-10 h-10 rounded-full border border-white/20" 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-cyan-300 flex items-center gap-1 truncate">
                      {selectedMedia.creator.display_name}
                      {selectedMedia.creator.verified && <span className="text-cyan-400 text-xs">✔</span>}
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                      @{selectedMedia.creator.username} 
                      <UserCheck size={12} /> 
                      {(selectedMedia.creator.followers || 0).toLocaleString()} followers
                    </p>
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <h2 className="text-lg font-bold mb-2 text-white line-clamp-2">{selectedMedia.title}</h2>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{selectedMedia.desc}</p>

              {/* Tags */}
              {selectedMedia.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
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
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
                  <Music size={16} className="text-cyan-400 flex-shrink-0" />
                  <span className="truncate">
                    {selectedMedia.music.title} — <span className="text-gray-400">{selectedMedia.music.artist}</span>
                  </span>
                </div>
              )}

              {/* Engagement Stats */}
              {selectedMedia.engagement && (
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Heart size={16} className="text-pink-400" /> 
                    {(selectedMedia.engagement.likes || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> 
                    {(selectedMedia.engagement.comments || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 size={16} /> 
                    {(selectedMedia.engagement.shares || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={16} /> 
                    {(selectedMedia.engagement.views || 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons for Mobile */}
            <div className="flex gap-2 pt-4 border-t border-white/10 flex-col gap-3">
              <GalleryShareBar media={selectedMedia} />
              <div className="flex gap-4 md:hidden">
                <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2">
                  <Heart size={18} />
                  Like
                </button>
                <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}