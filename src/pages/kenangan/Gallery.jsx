import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Maintenance from "../errors/Maintenance";

import GalleryImages from "./gallery/GalleryImages";
import GalleryVideos from "./gallery/GalleryVideos";
import GalleryShorts from "./gallery/GalleryShorts";
import GalleryAlbums from "./gallery/GalleryAlbums";

import GalleryShortModal from "./gallery/modals/GalleryShortModal";
import GalleryMediaModal from "./gallery/modals/GalleryMediaModal";

import GalleryFilter from "./gallery/GalleryFilter";
import GalleryNavigator from "./gallery/GalleryNavigator";
import GalleryStats from "./gallery/GalleryStats";
import GalleryRelatedContent from "./gallery/GalleryRelatedContent";
import { useGalleryData } from "./hooks/useGalleryData";

import { Sparkles } from "lucide-react";

export default function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shortsList, setShortsList] = useState([]);
  const [filterSettings, setFilterSettings] = useState({ searchTerm: "", tags: [] });
  const [filteredData, setFilteredData] = useState({
    shorts: [],
    images: [],
    videos: [],
    albums: []
  });
  const videoRef = useRef(null);
  const isMaintenance = false;

  const { allTags, allMedia } = useGalleryData();

  // 🌀 Navigasi ke short berikutnya (memoized to prevent re-creation)
  const handleNext = useCallback(() => {
    if (!shortsList.length) return;
    const nextIndex = (currentIndex + 1) % shortsList.length;
    setSelectedMedia(shortsList[nextIndex]);
    setCurrentIndex(nextIndex);
  }, [shortsList, currentIndex]);

  // 🌀 Navigasi ke short sebelumnya (memoized to prevent re-creation)
  const handlePrev = useCallback(() => {
    if (!shortsList.length) return;
    const prevIndex = (currentIndex - 1 + shortsList.length) % shortsList.length;
    setSelectedMedia(shortsList[prevIndex]);
    setCurrentIndex(prevIndex);
  }, [shortsList, currentIndex]);

  // 🔍 Handle filter changes (memoized)
  const handleFilter = useCallback((settings) => {
    setFilterSettings(settings);
  }, []);

  // 📊 Collect filtered data from each section (memoized to prevent memory leaks)
  const handleShortsFilteredData = useCallback((data) => {
    setFilteredData(prev => ({ ...prev, shorts: data }));
  }, []);

  const handleImagesFilteredData = useCallback((data) => {
    setFilteredData(prev => ({ ...prev, images: data }));
  }, []);

  const handleVideosFilteredData = useCallback((data) => {
    setFilteredData(prev => ({ ...prev, videos: data }));
  }, []);

  const handleAlbumsFilteredData = useCallback((data) => {
    setFilteredData(prev => ({ ...prev, albums: data }));
  }, []);

  // 📊 Combine all filtered data for statistics (memoized for performance)
  const combinedFilteredMedia = useMemo(() => [
    ...filteredData.shorts,
    ...filteredData.images,
    ...filteredData.videos,
    ...filteredData.albums
  ], [filteredData]);

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-gray-900)] via-[#111827] to-[#020617] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-24 relative overflow-hidden">
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

      {/* 🔍 Filter & Search */}
      <GalleryFilter onFilter={handleFilter} allTags={allTags} allMedia={allMedia} />

      {/* 📊 Statistics - Now uses filtered data */}
      <GalleryStats mediaList={combinedFilteredMedia} />

      {/* ⚡ Modular Components */}
      <GalleryShorts
        filterSettings={filterSettings}
        onFilteredDataChange={handleShortsFilteredData}
        onSelect={(media, list, index) => {
          setSelectedMedia(media);
          setShortsList(list);
          setCurrentIndex(index);
        }}
      />
      <GalleryImages
        filterSettings={filterSettings}
        onFilteredDataChange={handleImagesFilteredData}
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />
      <GalleryVideos
        filterSettings={filterSettings}
        onFilteredDataChange={handleVideosFilteredData}
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />
      <GalleryAlbums
        filterSettings={filterSettings}
        onFilteredDataChange={handleAlbumsFilteredData}
        onSelect={(media) => {
          setSelectedMedia(media);
          setCurrentIndex(0);
        }}
      />

      {/* 🔗 Related Content */}
      <GalleryRelatedContent />

      {/* 🔗 Navigation ke halaman lain */}
      <GalleryNavigator />

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
