import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, 
  Eye, Tag, UserCheck, Music, Download, Copy, Check, MapPin, 
  Calendar, Camera, Layers, Sparkles, ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import UniversalMediaPlayer from "../../components/UniversalMediaPlayer";
import { sanitizeUrl, generateAltText } from "../../utils/sanitizers";

export default function GalleryMediaModal({ selectedMedia, setSelectedMedia, currentIndex = 0, setCurrentIndex }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isArraySrc = Array.isArray(selectedMedia?.src);
  const srcLength = isArraySrc ? selectedMedia.src.length : 1;
  const isAlbum = selectedMedia?.type === "album" || isArraySrc;
  const mediaId = selectedMedia?.id;
  const initialLikes = selectedMedia?.engagement?.likes || 0;

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

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/gallery?media=${selectedMedia?.id || ""}&type=${selectedMedia?.type || ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  }, [selectedMedia]);

  const handleNativeShare = useCallback(async () => {
    const url = `${window.location.origin}/gallery?media=${selectedMedia?.id || ""}&type=${selectedMedia?.type || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedMedia?.title || "Galeri Kenangan",
          text: selectedMedia?.desc || "Lihat momen istimewa ini di Galeri Kenangan!",
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  }, [selectedMedia, handleCopyLink]);

  const handleDownload = async () => {
    if (isDownloading) return;
    const targetSrc = isArraySrc
      ? (selectedMedia.src[currentIndex] || selectedMedia.src[0])
      : selectedMedia?.src;

    if (!targetSrc) return;
    setIsDownloading(true);

    try {
      const response = await fetch(targetSrc, { mode: "cors" });
      if (!response.ok) throw new Error("Gagal mengambil file media");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const safeTitle = (selectedMedia.title || "galeri_media")
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "_");
      const isVideo = selectedMedia.type === "video";
      link.download = `${safeTitle}${isArraySrc ? `_${currentIndex + 1}` : ""}.${isVideo ? "mp4" : "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.warn("Fallback membuka di tab baru:", err);
      window.open(targetSrc, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  // Kunci scroll saat modal aktif
  useEffect(() => {
    if (selectedMedia && selectedMedia.type !== "short") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedMedia]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (!srcLength || !setCurrentIndex) return;
    setCurrentIndex(prev => (prev === 0 ? srcLength - 1 : prev - 1));
  }, [srcLength, setCurrentIndex]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (!srcLength || !setCurrentIndex) return;
    setCurrentIndex(prev => (prev === srcLength - 1 ? 0 : prev + 1));
  }, [srcLength, setCurrentIndex]);

  // Navigasi keyboard (ESC, Left, Right)
  useEffect(() => {
    if (!selectedMedia || selectedMedia.type === "short") return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      } else if (e.key === 'ArrowLeft' && isAlbum) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' && isAlbum) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, isAlbum, handlePrev, handleNext, setSelectedMedia]);

  // Lokasi string format
  const locationText = useMemo(() => {
    if (!selectedMedia?.details?.location) return null;
    const loc = selectedMedia.details.location;
    if (typeof loc === "object") {
      return loc.name || loc.city ? `${loc.city || loc.name}, ${loc.country || "Indonesia"}` : null;
    }
    return String(loc);
  }, [selectedMedia]);

  // Tanggal terformat
  const formattedDate = useMemo(() => {
    if (!selectedMedia?.uploaded_at) return null;
    try {
      return new Date(selectedMedia.uploaded_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [selectedMedia]);

  if (!selectedMedia || selectedMedia.type === "short") return null;

  const currentMediaSrc = isArraySrc ? selectedMedia.src[currentIndex] : selectedMedia.src;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-modal-title"
        className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedMedia(null)}
      >
        {/* Main Modal Container */}
        <motion.div
          className="relative bg-[#0b1329] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full max-w-6xl max-h-[92vh] md:max-h-[85vh] flex flex-col md:flex-row will-change-transform"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Quick Action Bar (Close & Feedback) */}
          <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
            {/* Feedback Copied */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1 border border-emerald-400"
                >
                  <Check size={13} /> Link Disalin!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Share */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNativeShare}
              className="text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-md border border-white/15 transition shadow-lg cursor-pointer"
              title="Bagikan Tautan Media"
            >
              <Share2 size={17} />
            </motion.button>

            {/* Quick Download */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className="text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-md border border-white/15 transition shadow-lg cursor-pointer disabled:opacity-50"
              title="Unduh Media"
            >
              <Download size={17} />
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedMedia(null)}
              className="text-white/80 hover:text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-md border border-white/15 transition shadow-lg cursor-pointer"
              title="Tutup (ESC)"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </motion.button>
          </div>

          {/* 🖼️ SISI KIRI: Media Viewer (Foto / Album / Video) */}
          <div className="flex-1 bg-black/90 flex items-center justify-center relative p-3 sm:p-5 overflow-hidden min-h-[42vh] md:min-h-0 select-none">
            {isAlbum ? (
              /* Tampilan Koleksi Album */
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={sanitizeUrl(currentMediaSrc)}
                    alt={`${selectedMedia.title} - Foto ${currentIndex + 1} dari ${srcLength}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full max-h-[58vh] md:max-h-[75vh] object-contain rounded-xl"
                  />
                </AnimatePresence>

                {/* Tombol Navigasi Album Prev / Next */}
                {srcLength > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePrev}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/65 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition shadow-xl z-20 cursor-pointer"
                      title="Foto sebelumnya (Panah Kiri)"
                      aria-label="Foto sebelumnya"
                    >
                      <ChevronLeft size={22} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNext}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/65 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition shadow-xl z-20 cursor-pointer"
                      title="Foto selanjutnya (Panah Kanan)"
                      aria-label="Foto selanjutnya"
                    >
                      <ChevronRight size={22} />
                    </motion.button>

                    {/* Indikator Slide & Titik-titik Navigasi */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-black/75 backdrop-blur-lg rounded-full border border-white/15 z-20 shadow-lg">
                      <span className="text-[11px] text-pink-300 font-semibold mr-1 flex items-center gap-1">
                        <Layers size={12} /> {currentIndex + 1} / {srcLength}
                      </span>
                      {selectedMedia.src.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === currentIndex ? "w-4 bg-pink-400" : "w-1.5 bg-white/40 hover:bg-white/80"
                          }`}
                          title={`Foto ke-${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : selectedMedia.type === "image" ? (
              /* Tampilan Foto Tunggal */
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={sanitizeUrl(selectedMedia.src)}
                  alt={generateAltText(selectedMedia)}
                  className="w-full h-full max-h-[58vh] md:max-h-[75vh] object-contain rounded-xl"
                />
              </div>
            ) : (
              /* Tampilan Video */
              <div className="w-full h-full flex items-center justify-center">
                <UniversalMediaPlayer
                  src={selectedMedia.src}
                  poster={selectedMedia.thumbnail || selectedMedia.poster}
                  title={selectedMedia.title}
                  isShort={false}
                  controls
                  muted
                  loop
                  playsInline
                  className="max-h-[58vh] md:max-h-[75vh] rounded-xl"
                />
              </div>
            )}
          </div>

          {/* 📋 SISI KANAN: Panel Informasi & Interaksi */}
          <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col bg-[#0f172a]/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-white/10 text-gray-200 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* 👤 Info Kreator */}
            {selectedMedia.creator && (
              <div className="flex items-center gap-3 pb-3.5 border-b border-white/10">
                {selectedMedia.creator.avatar && (
                  <img
                    src={sanitizeUrl(selectedMedia.creator.avatar, '/default-avatar.jpg')}
                    alt={`${selectedMedia.creator.display_name} avatar`}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-400/40 shadow-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-cyan-300 text-sm flex items-center gap-1.5 truncate">
                    {selectedMedia.creator.display_name}
                    {selectedMedia.creator.verified && <span className="text-cyan-400 text-xs">✔</span>}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                    @{selectedMedia.creator.username}
                    <span className="text-gray-500">•</span>
                    <span className="text-[11px] text-gray-400">
                      {(selectedMedia.creator.followers || 0).toLocaleString()} followers
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* 🏷️ Badge Kategori & Tautan Halaman Fotografi */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-semibold">
                  {selectedMedia.category || "Kenangan"}
                </span>
                {isAlbum && (
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[11px] font-semibold flex items-center gap-1">
                    <Layers size={11} /> Seri Album ({srcLength} Foto)
                  </span>
                )}
              </div>

              {/* Tautan Balik ke Fotografi jika sinkron */}
              {selectedMedia.isFromPhotography && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-transparent border border-cyan-400/30 flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs text-cyan-200">
                    <span className="font-semibold flex items-center gap-1 text-cyan-300">
                      <Camera size={13} /> Dari Portofolio Fotografi
                    </span>
                    <p className="text-[10px] text-gray-400">Tersinkronisasi dua arah otomatis</p>
                  </div>
                  <Link
                    to="/photography"
                    onClick={() => setSelectedMedia(null)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-medium transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  >
                    Buka Fotografi ➔
                  </Link>
                </div>
              )}

              {/* Judul & Deskripsi */}
              <h2 id="media-modal-title" className="text-base sm:text-lg font-bold text-white leading-snug mb-1.5">
                {selectedMedia.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {selectedMedia.desc}
              </p>
            </div>

            {/* 📍 Lokasi & Tanggal Metadata */}
            {(locationText || formattedDate) && (
              <div className="space-y-1.5 text-xs text-gray-400 pt-3 border-t border-white/10">
                {locationText && (
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{locationText}</span>
                  </p>
                )}
                {formattedDate && (
                  <p className="flex items-center gap-2">
                    <Calendar size={13} className="text-cyan-400 flex-shrink-0" />
                    <span>{formattedDate}</span>
                  </p>
                )}
              </div>
            )}

            {/* 📷 Detail Teknis Kamera (EXIF) jika ada */}
            {selectedMedia.details?.camera && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-gray-400 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="truncate"><span className="text-gray-300 font-medium">Kamera:</span> {selectedMedia.details.camera}</p>
                {selectedMedia.details.lens && (
                  <p className="truncate"><span className="text-gray-300 font-medium">Lensa:</span> {selectedMedia.details.lens}</p>
                )}
                {selectedMedia.details.aperture && (
                  <p><span className="text-gray-300 font-medium">Aperture:</span> {selectedMedia.details.aperture}</p>
                )}
                {selectedMedia.details.shutter_speed && (
                  <p><span className="text-gray-300 font-medium">Shutter:</span> {selectedMedia.details.shutter_speed}</p>
                )}
                {selectedMedia.details.iso && (
                  <p><span className="text-gray-300 font-medium">ISO:</span> {selectedMedia.details.iso}</p>
                )}
                {selectedMedia.details.focal_length && (
                  <p><span className="text-gray-300 font-medium">Focal:</span> {selectedMedia.details.focal_length}</p>
                )}
              </div>
            )}

            {/* 🎵 Audio / Musik jika ada */}
            {selectedMedia.music && (
              <div className="flex items-center gap-2 text-xs text-cyan-300 p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                <Music size={14} className="text-cyan-400 flex-shrink-0 animate-pulse" />
                <span className="truncate">
                  {selectedMedia.music.title} — <span className="text-gray-400">{selectedMedia.music.artist}</span>
                </span>
              </div>
            )}

            {/* 🏷️ Tags */}
            {selectedMedia.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedMedia.tags.slice(0, 8).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1 transition"
                  >
                    <Tag size={10} className="text-cyan-400" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ❤️ Bar Interaksi & Sosial */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              {/* Counter Stats & Tombol Like */}
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
                  title="Sukai media ini"
                >
                  <Heart size={14} className={liked ? "fill-pink-400 text-pink-400" : "text-pink-400"} />
                  <span>{likeCount.toLocaleString()}</span>
                </motion.button>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1" title="Komentar">
                    <MessageCircle size={14} />
                    {(selectedMedia.engagement?.comments || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1" title="Dilihat">
                    <Eye size={14} />
                    {(selectedMedia.engagement?.views || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi Cepat: Salin Link, Bagikan & Unduh */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-medium transition cursor-pointer"
                  title="Salin tautan langsung"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Tersalin!" : "Salin Link"}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 text-xs font-medium transition cursor-pointer"
                  title="Bagikan ke platform lain"
                >
                  <Share2 size={14} />
                  <span>Bagikan</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                  title="Unduh file ke perangkat"
                >
                  <Download size={14} />
                  <span>{isDownloading ? "Mengunduh..." : "Unduh"}</span>
                </button>
              </div>
            </div>

            {/* 💬 Komentar Terkini */}
            {selectedMedia.comments_preview && selectedMedia.comments_preview.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <h4 className="text-xs font-semibold text-gray-300 mb-2.5 flex items-center gap-1.5">
                  <MessageCircle size={13} className="text-cyan-400" /> Komentar Terkini
                </h4>
                <div className="space-y-2.5">
                  {selectedMedia.comments_preview.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <img
                        src={c.avatar}
                        alt={c.user}
                        className="w-7 h-7 rounded-full object-cover border border-white/10 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-cyan-300 truncate">{c.user}</span>
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

            {/* Watermark Footer */}
            <div className="pt-3 border-t border-white/10 text-center text-[10px] text-gray-500">
              © Syaiful Mukmin • Galeri Kenangan
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
