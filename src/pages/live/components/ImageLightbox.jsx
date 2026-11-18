import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download, ExternalLink, RotateCcw } from 'lucide-react';

export const ImageLightbox = ({ src, alt = 'Media Preview', isOpen, onClose }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.35, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.35, 0.6));
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setScale(1);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = src;
    link.download = `live-media-${Date.now()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none"
      >
        {/* Floating Toolbar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-5 right-5 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl"
        >
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
            title="Perbesar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
            title="Perkecil (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {scale !== 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
            title="Unduh Gambar"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors text-red-300 hover:text-white ml-1"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Display */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: scale, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-full max-h-[85vh] flex items-center justify-center cursor-default"
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
