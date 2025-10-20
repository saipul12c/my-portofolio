import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Maintenance from "./errors/Maintenance";

import GalleryImages from "../components/gallery/GalleryImages";
import GalleryVideos from "../components/gallery/GalleryVideos";
import GalleryShorts from "../components/gallery/GalleryShorts";
import GalleryAlbums from "../components/gallery/GalleryAlbums";

import GalleryShortModal from "../components/gallery/modals/GalleryShortModal";
import GalleryMediaModal from "../components/gallery/modals/GalleryMediaModal";

import { Sparkles } from "lucide-react";

export default function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shortsList, setShortsList] = useState([]); // daftar data short aktif
  const videoRef = useRef(null);
  const isMaintenance = false;

  // 🌀 Navigasi ke short berikutnya
  const handleNext = () => {
    if (!shortsList.length) return;
    const nextIndex = (currentIndex + 1) % shortsList.length;
    setSelectedMedia(shortsList[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  // 🌀 Navigasi ke short sebelumnya
  const handlePrev = () => {
    if (!shortsList.length) return;
    const prevIndex = (currentIndex - 1 + shortsList.length) % shortsList.length;
    setSelectedMedia(shortsList[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (isMaintenance) return <Maintenance />;

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
        onSelect={(media, list, index) => {
          setSelectedMedia(media);
          setShortsList(list); // simpan semua short
          setCurrentIndex(index); // index aktif
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

      {/* 💫 Modals */}
      <GalleryShortModal
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        videoRef={videoRef}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
      <GalleryMediaModal
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </main>
  );
}
