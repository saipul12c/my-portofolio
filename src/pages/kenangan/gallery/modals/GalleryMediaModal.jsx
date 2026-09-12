import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Eye, Tag, UserCheck, Music } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import GalleryShareBar from "../GalleryShareBar";
import UniversalMediaPlayer from "../../components/UniversalMediaPlayer";
import { getMediaRoute } from "../../utils/routeHelpers";
import { sanitizeUrl, sanitizeVideoUrl, generateAltText } from "../../utils/sanitizers";

export default function GalleryMediaModal({ selectedMedia, setSelectedMedia, currentIndex, setCurrentIndex }) {
  const navigate = useNavigate();
  const [mediaError, setMediaError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isArraySrc = Array.isArray(selectedMedia?.src);
  const srcLength = isArraySrc ? selectedMedia.src.length : 0;

  useEffect(() => {
    if (selectedMedia) {
      setLiked(false);
      setLikeCount(selectedMedia.engagement?.likes || 0);
      setMediaError(false);
    }
  }, [selectedMedia?.id]);

  const handleToggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }, []);

  const handleNativeShare = useCallback(async () => {
    const url = `${window.location.origin}/gallery?media=${selectedMedia?.id || ""}&type=${selectedMedia?.type || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedMedia?.title || "Gallery Media",
          text: selectedMedia?.desc || "Check out this media from my gallery!",
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Tautan media berhasil disalin ke clipboard!");
      } catch (e) {
        console.error(e);
      }
    }
  }, [selectedMedia]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedMedia && selectedMedia.type !== "short") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedMedia]);

  const handlePrev = useCallback(() => {
    if (!srcLength) return;
    setCurrentIndex(prev => prev === 0 ? srcLength - 1 : prev - 1);
  }, [srcLength, setCurrentIndex]);

  const handleNext = useCallback(() => {
    if (!srcLength) return;
    setCurrentIndex(prev => prev === srcLength - 1 ? 0 : prev + 1);
  }, [srcLength, setCurrentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedMedia || selectedMedia.type === "short") return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, handlePrev, handleNext, setSelectedMedia]);

  // Early return AFTER all hooks
  if (!selectedMedia || selectedMedia.type === "short") return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-modal-title"
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
            aria-label="Tutup modal"
            className="absolute top-3 right-3 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <X size={24} />
          </button>

          {/* Media Section */}
          <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative p-4">
            {/* Album/Multi-Image Gallery: always render if src is array or type is album */}
            {(selectedMedia.type === "album" || isArraySrc) ? (
              <>
                <img 
                  src={sanitizeUrl(isArraySrc ? selectedMedia.src[currentIndex] : selectedMedia.src)} 
                  alt={`${selectedMedia.title} - Image ${currentIndex + 1} of ${srcLength || 1}`} 
                  className="w-full h-full max-h-[70vh] object-contain rounded-lg"
                  onError={() => setMediaError(true)}
                />
                {srcLength > 1 && (
                  <>
                    <button 
                      onClick={handlePrev}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm" aria-live="polite">
                      {currentIndex + 1} / {srcLength}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Single Image or Video */
              <>
                {selectedMedia.type === "image" ? (
                  <img 
                    src={sanitizeUrl(selectedMedia.src)} 
                    alt={generateAltText(selectedMedia)}
                    className="w-full h-full max-h-[70vh] object-contain rounded-lg"
                    onError={() => setMediaError(true)}
                  />
                ) : (
                  <UniversalMediaPlayer 
                    src={selectedMedia.src}
                    poster={selectedMedia.thumbnail || selectedMedia.poster}
                    title={selectedMedia.title}
                    isShort={selectedMedia.type === "short"}
                    controls
                    muted
                    loop
                    playsInline
                    className="max-h-[70vh]"
                    onError={() => setMediaError(true)}
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
                      src={sanitizeUrl(selectedMedia.creator.avatar, '/default-avatar.jpg')} 
                      alt={`${selectedMedia.creator.display_name} avatar`} 
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
                  <button
                    onClick={handleToggleLike}
                    className="flex items-center gap-1 hover:text-pink-400 transition cursor-pointer"
                    title="Sukai media ini"
                  >
                    <Heart size={16} className={liked ? "fill-pink-400 text-pink-400" : "text-pink-400"} /> 
                    {likeCount.toLocaleString()}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> 
                    {(selectedMedia.engagement.comments || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-1 hover:text-cyan-400 transition cursor-pointer"
                    title="Bagikan media ini"
                  >
                    <Share2 size={16} /> 
                    {(selectedMedia.engagement.shares || 0).toLocaleString()}
                  </button>
                  <span className="flex items-center gap-1">
                    <Eye size={16} /> 
                    {(selectedMedia.engagement.views || 0).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Comments Preview */}
              {selectedMedia.comments_preview && selectedMedia.comments_preview.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Komentar</h4>
                  <div className="flex flex-col gap-3">
                    {selectedMedia.comments_preview.slice(0,3).map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <img src={c.avatar} alt={c.user} className="w-8 h-8 rounded-full object-cover border border-white/10" loading="lazy" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-cyan-300">{c.user}</span>
                            <span className="text-xs text-gray-400">{new Date(c.posted_at).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-300">{c.comment}</p>
                        </div>
                      </div>
                    ))}
                      <Link
                        to={getMediaRoute(selectedMedia.type, selectedMedia.id)}
                        onClick={() => setSelectedMedia(null)}
                        className="text-sm px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-center"
                      >
                        Lihat detail
                      </Link>
                      <Link
                        to={getMediaRoute(selectedMedia.type, selectedMedia.id)}
                        onClick={() => setSelectedMedia(null)}
                        className="text-sm px-3 py-1 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 text-center"
                      >
                        Lihat semua komentar
                      </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons for Mobile & Share Bar */}
            <div className="flex gap-2 pt-4 border-t border-white/10 flex-col gap-3">
              <GalleryShareBar media={selectedMedia} currentIndex={currentIndex} />
              <div className="flex gap-4 md:hidden">
                <button 
                  onClick={handleToggleLike}
                  className={`flex-1 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                    liked 
                      ? "bg-pink-500/30 text-pink-300 border border-pink-500/40" 
                      : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300"
                  }`}
                >
                  <Heart size={18} className={liked ? "fill-pink-400 text-pink-400" : ""} />
                  {liked ? "Disukai" : "Like"} ({likeCount.toLocaleString()})
                </button>
                <button 
                  onClick={handleNativeShare}
                  className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
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