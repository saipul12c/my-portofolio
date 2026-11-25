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
  Copy,
  Check,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import UniversalMediaPlayer from "../../components/UniversalMediaPlayer";
import { sanitizeUrl } from "../../utils/sanitizers";

export default function GalleryShortModal({
  selectedMedia,
  setSelectedMedia,
  videoRef,
  handleNext,
  handlePrev,
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const newRef = useRef(null);
  const localVideoRef = videoRef || newRef;
  const mediaId = selectedMedia?.id;
  const initialLikes = selectedMedia?.engagement?.likes || 0;

  // Kunci scroll body saat modal aktif
  useEffect(() => {
    if (selectedMedia && selectedMedia.type === "short") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedMedia]);

  // Reset state saat media berganti
  useEffect(() => {
    if (mediaId) {
      setLiked(false);
      setLikeCount(initialLikes);
      setCopied(false);
    }
  }, [mediaId, initialLikes]);

  const handleToggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }, []);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/gallery?media=${selectedMedia?.id || ""}&type=${selectedMedia?.type || ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  const handleNativeShare = async () => {
    const url = `${window.location.origin}/gallery?media=${selectedMedia?.id || ""}&type=${selectedMedia?.type || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedMedia?.title || "Gallery Short",
          text: selectedMedia?.desc || "Tonton short seru ini di Galeri Kenangan!",
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Navigasi keyboard (ESC, Panah Kiri, Panah Kanan, M untuk mute)
  useEffect(() => {
    if (!selectedMedia || selectedMedia.type !== "short") return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext?.();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, handlePrev, handleNext, setSelectedMedia]);

  const handleVideoError = (e) => {
    console.error('Video playback error:', e);
  };

  if (!selectedMedia || selectedMedia.type !== "short") return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="short-modal-title"
        className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedMedia(null)}
      >
        {/* Tombol Navigasi Desktop Kiri (Short Sebelumnya) */}
        {handlePrev && (
          <motion.button
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Short sebelumnya"
            className="hidden lg:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/60 hover:bg-black/85 p-3 rounded-full backdrop-blur-md border border-white/15 transition shadow-2xl z-50 cursor-pointer"
            title="Short Sebelumnya (←)"
          >
            <ChevronLeft size={28} />
          </motion.button>
        )}

        {/* Tombol Navigasi Desktop Kanan (Short Selanjutnya) */}
        {handleNext && (
          <motion.button
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Short berikutnya"
            className="hidden lg:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/60 hover:bg-black/85 p-3 rounded-full backdrop-blur-md border border-white/15 transition shadow-2xl z-50 cursor-pointer"
            title="Short Selanjutnya (→)"
          >
            <ChevronRight size={28} />
          </motion.button>
        )}

        {/* Kontainer Utama Modal */}
        <motion.div
          className="relative bg-[#0b1329] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[94vh] md:max-h-[88vh] flex flex-col md:flex-row will-change-transform"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Actions Bar (Kanan Atas) */}
          <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
            {copied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-emerald-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1 border border-emerald-400"
              >
                <Check size={12} /> Tersalin!
              </motion.div>
            )}

            {/* Quick Share */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNativeShare}
              className="text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-md border border-white/15 transition shadow-lg cursor-pointer"
              title="Bagikan Short"
            >
              <Share2 size={16} />
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedMedia(null)}
              aria-label="Tutup modal"
              className="text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-md border border-white/15 transition shadow-lg cursor-pointer"
              title="Tutup (ESC)"
            >
              <X size={18} />
            </motion.button>
          </div>

          {/* 📱 SISI KIRI: Video Player Vertikal (Aspect 9:16) */}
          <div className="w-full md:w-[50%] lg:w-[52%] bg-black/95 flex items-center justify-center p-2.5 sm:p-4 relative select-none min-h-[300px] md:min-h-0">
            <div className="relative w-full max-w-[270px] sm:max-w-[320px] aspect-[9/16] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <UniversalMediaPlayer
                ref={localVideoRef}
                src={selectedMedia.src}
                poster={selectedMedia.thumbnail || selectedMedia.poster}
                title={selectedMedia.title}
                isShort={true}
                muted={isMuted}
                loop
                autoPlay={true}
                controls={true}
                className="w-full h-full object-cover"
                onError={handleVideoError}
              />

              {/* Tombol Navigasi Mobile Terintegrasi (Overlay pada video) */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none lg:hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev?.();
                  }}
                  className="pointer-events-auto bg-black/60 hover:bg-black/80 text-white/90 p-2 rounded-full backdrop-blur-md border border-white/15 shadow-lg transition"
                  title="Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext?.();
                  }}
                  className="pointer-events-auto bg-black/60 hover:bg-black/80 text-white/90 p-2 rounded-full backdrop-blur-md border border-white/15 shadow-lg transition"
                  title="Selanjutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 📋 SISI KANAN: Panel Informasi & Komentar */}
          <div className="w-full md:w-[50%] lg:w-[48%] flex-shrink-0 flex flex-col bg-[#0f172a]/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-white/10 text-gray-200 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            
            {/* 👤 Info Kreator */}
            {selectedMedia.creator && (
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                {selectedMedia.creator.avatar && (
                  <img
                    src={sanitizeUrl(selectedMedia.creator.avatar, '/default-avatar.jpg')}
                    alt={selectedMedia.creator.display_name}
                    className="w-9 h-9 rounded-full object-cover border border-cyan-400/40 shadow-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-cyan-300 text-sm flex items-center gap-1 truncate">
                    {selectedMedia.creator.display_name}
                    {selectedMedia.creator.verified && <span className="text-cyan-400 text-xs">✔</span>}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    @{selectedMedia.creator.username}
                  </p>
                </div>
              </div>
            )}

            {/* Judul & Deskripsi */}
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[11px] font-semibold mb-1.5">
                <Sparkles size={11} /> Short Video
              </div>
              <h2 id="short-modal-title" className="text-base sm:text-lg font-bold text-white leading-snug mb-1">
                {selectedMedia.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {selectedMedia.desc}
              </p>
            </div>

            {/* 🎵 Audio / Musik Track */}
            {selectedMedia.music && (
              <div className="flex items-center gap-2 text-xs text-cyan-300 p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                <Music size={13} className="text-cyan-400 flex-shrink-0 animate-pulse" />
                <span className="truncate">
                  {selectedMedia.music.title || "Sound Asli"} —{" "}
                  <span className="text-gray-400">{selectedMedia.music.artist || "Original"}</span>
                </span>
              </div>
            )}

            {/* 🏷️ Tags */}
            {selectedMedia.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedMedia.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1"
                  >
                    <Tag size={10} className="text-cyan-400" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ❤️ Bar Interaksi & Sosial */}
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    liked
                      ? "bg-pink-500/30 text-pink-300 border-pink-400/60 shadow-md shadow-pink-500/20"
                      : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:text-pink-300"
                  }`}
                  title="Sukai short ini"
                >
                  <Heart size={14} className={liked ? "fill-pink-400 text-pink-400" : "text-pink-400"} />
                  <span>{likeCount.toLocaleString()}</span>
                </motion.button>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {(selectedMedia.engagement?.comments || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {(selectedMedia.engagement?.views || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi Salin Tautan & Bagikan */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-medium transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Tersalin!" : "Salin Link"}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 text-xs font-medium transition cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* 💬 Komentar Terkini */}
            {selectedMedia.comments_preview && selectedMedia.comments_preview.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                  <MessageCircle size={13} className="text-cyan-400" /> Komentar
                </h4>
                <div className="space-y-2">
                  {selectedMedia.comments_preview.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <img
                        src={c.avatar}
                        alt={c.user}
                        className="w-6 h-6 rounded-full object-cover border border-white/10 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-cyan-300 text-[11px] truncate">{c.user}</span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(c.posted_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <p className="text-gray-300 text-[11px] leading-snug line-clamp-2">{c.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigasi Mobile di Bagian Bawah */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs lg:hidden">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>
              <span className="text-[10px] text-gray-500">Geser atau gunakan tombol</span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-gray-400 hover:text-white transition py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
