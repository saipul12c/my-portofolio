import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Music,
  Eye,
  UserCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Maintenance from "./errors/Maintenance";

import GalleryImages from "../components/gallery/GalleryImages";
import GalleryVideos from "../components/gallery/GalleryVideos";
import GalleryShorts from "../components/gallery/GalleryShorts";
import GalleryAlbums from "../components/gallery/GalleryAlbums";

export default function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null); // ref untuk kontrol video modal
  const isMaintenance = false;

  if (isMaintenance) return <Maintenance />;

  const handlePrev = () => {
    if (!selectedMedia?.src?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? selectedMedia.src.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!selectedMedia?.src?.length) return;
    setCurrentIndex((prev) =>
      prev === selectedMedia.src.length - 1 ? 0 : prev + 1
    );
  };

  const handleVideoHover = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#020617] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-24 relative overflow-hidden">
      {/* 🌈 Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* ✨ Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6 mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-cyan-300 animate-spin-slow" />
          Galeri Gen Z
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Eksplor vibe dunia visual — short, video, dan foto kekinian ✨📸🎬
        </p>
      </motion.div>

      {/* ⚡ Modular Components */}
      <GalleryShorts
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />
      <GalleryImages
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />
      <GalleryVideos
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />
      <GalleryAlbums
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />

      {/* 💫 Modal */}
      <AnimatePresence>
        {selectedMedia && (
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
              {/* Tombol Close */}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-3 right-3 text-gray-300 hover:text-white transition z-20"
              >
                <X size={28} />
              </button>

              {/* Bagian kiri: Media */}
              <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative">
                {/* Album / Image array */}
                {selectedMedia.type === "album" ||
                (selectedMedia.type === "image" && Array.isArray(selectedMedia.src)) ? (
                  <>
                    <img
                      src={selectedMedia.src[currentIndex]}
                      alt={`${selectedMedia.title} ${currentIndex + 1}`}
                      className="w-full max-h-[85vh] object-contain rounded-lg"
                    />
                    {selectedMedia.src.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </>
                ) : selectedMedia.type === "video" || selectedMedia.type === "short" ? (
                  <video
                    ref={videoRef}
                    src={selectedMedia.src}
                    controls
                    muted
                    loop
                    playsInline
                    className="w-full max-h-[85vh] object-contain rounded-lg"
                    onMouseEnter={handleVideoHover}
                    onMouseLeave={handleVideoLeave}
                  />
                ) : (
                  <img
                    src={selectedMedia.src}
                    alt={selectedMedia.title}
                    className="w-full max-h-[85vh] object-contain rounded-lg"
                  />
                )}
              </div>

              {/* Bagian kanan: Info */}
              <div className="w-full md:w-1/3 bg-[#111] text-gray-200 p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
                {/* Creator Info */}
                {selectedMedia.creator && (
                  <div className="flex items-center gap-3 mb-5">
                    {selectedMedia.creator.avatar && (
                      <img
                        src={selectedMedia.creator.avatar}
                        alt={selectedMedia.creator.display_name || "User"}
                        className="w-10 h-10 rounded-full border border-white/20"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-cyan-300 flex items-center gap-1">
                        {selectedMedia.creator.display_name || "Anonim"}
                        {selectedMedia.creator.verified && (
                          <span className="text-cyan-400 text-xs">✔</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        @{selectedMedia.creator.username || "unknown"}
                        <UserCheck size={12} />
                        {(selectedMedia.creator.followers || 0).toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                )}

                {/* Judul & Deskripsi */}
                <h2 className="text-lg font-bold mb-2 text-white">
                  {selectedMedia.title}
                </h2>
                <p className="text-sm text-gray-300 mb-3">{selectedMedia.desc}</p>

                {/* Tags */}
                {selectedMedia.tags && selectedMedia.tags.length > 0 && (
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

                {/* Musik Info */}
                {selectedMedia.music && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
                    <Music size={16} className="text-cyan-400" />
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
                  <div className="flex items-center gap-6 mb-5 text-sm text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Heart className="text-pink-400" size={16} />{" "}
                      {(selectedMedia.engagement.likes || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} />{" "}
                      {(selectedMedia.engagement.comments || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 size={16} />{" "}
                      {(selectedMedia.engagement.shares || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={16} />{" "}
                      {(selectedMedia.engagement.views || 0).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Comments Preview */}
                {selectedMedia.comments_preview &&
                  selectedMedia.comments_preview.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-200 mb-2">
                        Komentar Teratas
                      </h4>
                      <div className="space-y-3">
                        {selectedMedia.comments_preview.map((c, i) => (
                          <div key={i} className="flex gap-2">
                            {c.avatar && (
                              <img
                                src={c.avatar}
                                alt={c.user || "User"}
                                className="w-7 h-7 rounded-full"
                              />
                            )}
                            <div>
                              <p className="text-sm">
                                <span className="font-semibold text-cyan-300">
                                  {c.user || "Anonim"}
                                </span>{" "}
                                <span className="text-gray-300">{c.comment || ""}</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {(c.likes || 0).toLocaleString()} suka
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Footer info */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  {selectedMedia.uploaded_at && (
                    <p className="text-xs text-gray-500 italic">
                      Diposting pada:{" "}
                      {new Date(selectedMedia.uploaded_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
