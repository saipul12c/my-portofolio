import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Calendar, FileText, Image, Zap, Share2, 
  Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PhotoModal({ photo, onClose, onNavigate }) {
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [albumIndex, setAlbumIndex] = useState(0);

  const isAlbum = Boolean(photo.isAlbum && photo.albumPhotos && photo.albumPhotos.length > 0);
  const currentImg = isAlbum ? photo.albumPhotos[albumIndex] : photo.img;

  useEffect(() => {
    setAlbumIndex(0);
    setIsZoomed(false);
  }, [photo?.id]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) onNavigate("prev");
      if (e.key === "ArrowRight" && onNavigate) onNavigate("next");
      if (e.key === "z" || e.key === "Z") setIsZoomed(prev => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    }
  };

  // Unduh gambar asli via blob untuk mengatasi pembatasan cross-origin
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(currentImg, { mode: "cors" });
      if (!response.ok) throw new Error("Gagal mengambil data gambar");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const safeTitle = (photo.title || "foto")
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "_");
      link.download = `${safeTitle}${isAlbum ? `_${albumIndex + 1}` : ""}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.warn("Blob download dibatasi oleh browser, membuka di tab baru:", err);
      window.open(currentImg, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex flex-col md:flex-row bg-[#0b1120] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 max-w-6xl w-full max-h-[90vh] md:max-h-[80vh]"
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 z-50 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="text-white/70 hover:text-white transition bg-black/50 rounded-full p-2 backdrop-blur-sm"
            title="Bagikan Foto"
          >
            <Share2 size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-white/70 hover:text-white transition bg-black/50 rounded-full p-2 backdrop-blur-sm disabled:opacity-50"
            title={isDownloading ? "Sedang Mengunduh..." : "Unduh Foto"}
          >
            {isDownloading ? (
              <Loader2 size={18} className="animate-spin text-cyan-400" />
            ) : (
              <Download size={18} />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsZoomed(!isZoomed)}
            className="text-white/70 hover:text-white transition bg-black/50 rounded-full p-2 backdrop-blur-sm"
            title={isZoomed ? "Perkecil (Z)" : "Perbesar (Z)"}
          >
            {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white/70 hover:text-white transition bg-black/50 rounded-full p-2 backdrop-blur-sm"
            title="Tutup (ESC)"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Navigation Arrows */}
        {onNavigate && (
          <>
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate("prev")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition bg-black/50 rounded-full p-2 backdrop-blur-sm"
              title="Foto Sebelumnya (←)"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate("next")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition bg-black/50 rounded-full p-2 backdrop-blur-sm md:right-[420px]"
              title="Foto Selanjutnya (→)"
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}

        {/* Copied Notification */}
        <AnimatePresence>
          {showCopied && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 right-2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
            >
              Link disalin! ✓
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-auto relative select-none">
          <motion.img
            key={currentImg}
            src={currentImg}
            alt={photo.title}
            className="h-full w-full object-contain transition-transform duration-300 pointer-events-auto"
            loading="eager"
            decoding="async"
            animate={{ scale: isZoomed ? 1.5 : 1 }}
            transition={{ type: "spring", damping: 20 }}
            drag={isZoomed}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.1}
          />
          {isZoomed && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-sm pointer-events-none">
              Drag untuk menggeser gambar
            </div>
          )}

          {/* Album Slide Controls (jika foto ini merupakan album/koleksi) */}
          {isAlbum && photo.albumPhotos?.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlbumIndex((prev) => (prev > 0 ? prev - 1 : photo.albumPhotos.length - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-sm transition z-20 cursor-pointer"
                title="Foto sebelumnya dalam album"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlbumIndex((prev) => (prev < photo.albumPhotos.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full backdrop-blur-sm transition z-20 cursor-pointer"
                title="Foto berikutnya dalam album"
              >
                <ChevronRight size={20} />
              </button>

              {/* Indicator dots album */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/10 z-20">
                <span className="text-[11px] text-pink-300 font-semibold mr-1">
                  {albumIndex + 1} / {photo.albumPhotos.length}
                </span>
                {photo.albumPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAlbumIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === albumIndex ? "w-4 bg-pink-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#111827]/90 backdrop-blur-md p-4 sm:p-6 text-gray-200 overflow-y-auto">
          {/* Badges Sumber Data */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {photo.isAlbum && (
              <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-400/30 rounded-full text-[11px] font-semibold flex items-center gap-1">
                🗂️ Koleksi Album ({photo.albumCount || photo.albumPhotos?.length} Foto)
              </span>
            )}
            {photo.isFromGallery && !photo.isAlbum && (
              <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-[11px] font-semibold flex items-center gap-1">
                ✨ Dari Galeri Kenangan
              </span>
            )}
            {photo.featured && (
              <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 rounded-full text-[11px] font-semibold">
                ⭐ Featured
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-2">{photo.title}</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">{photo.description}</p>

          <div className="space-y-2 text-xs text-gray-400 mb-4">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-cyan-400 flex-shrink-0" /> 
              <span className="truncate">{photo.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400 flex-shrink-0" />
              {new Date(photo.date_taken).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs border-t border-white/10 pt-3 mb-4">
            <p><span className="text-gray-400">Kamera:</span> {photo.camera}</p>
            <p><span className="text-gray-400">Lensa:</span> {photo.lens}</p>
            <p><span className="text-gray-400">Focal:</span> {photo.focal_length}</p>
            <p><span className="text-gray-400">Aperture:</span> {photo.aperture}</p>
            <p><span className="text-gray-400">Shutter:</span> {photo.shutter_speed}</p>
            <p><span className="text-gray-400">ISO:</span> {photo.iso}</p>
          </div>

          <div className="border-t border-white/10 pt-3">
            <p className="text-xs mb-2 text-gray-400">
              Mood: <span className="text-cyan-300">{photo.mood}</span>
            </p>
            <div className="flex gap-1">
              {photo.color_palette?.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-white/20 shadow-md flex-shrink-0"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="pt-4 border-t border-white/10 mt-4">
            <p className="text-xs text-gray-400 mb-3 font-medium">Jelajahi Konten Terkait:</p>
            <div className="grid grid-cols-1 gap-2">
              {photo.isFromGallery && (
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(`/gallery?media=${photo.originalGalleryId}&type=${photo.isAlbum ? 'album' : 'image'}`)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-400/40 rounded-lg transition-all text-xs text-pink-200 font-medium cursor-pointer"
                >
                  <Image size={14} className="text-pink-400" />
                  <span>Buka di Galeri Kenangan ➔</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate("/gallery")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 hover:border-blue-400/60 rounded-lg transition-all text-xs text-blue-300 cursor-pointer"
              >
                <Image size={14} />
                <span>Galeri Kenangan Utama</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate("/blog")}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 hover:border-purple-400/60 rounded-lg transition-all text-xs text-purple-300 cursor-pointer"
              >
                <FileText size={14} />
                <span>Blog & Cerita</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate("/projects")}
                className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-400/30 hover:border-green-400/60 rounded-lg transition-all text-xs text-green-300 cursor-pointer"
              >
                <Zap size={14} />
                <span>Proyek & Portfolio</span>
              </motion.button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-gray-500 text-center italic mt-4">
            © Syaiful Mukmin Photography
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}