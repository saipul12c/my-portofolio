import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Maintenance from "../errors/Maintenance";

import GalleryShorts from "./gallery/GalleryShorts";
import GalleryPhotos from "./gallery/GalleryPhotos";
import GalleryVideos from "./gallery/GalleryVideos";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const videoRef = useRef(null);
  const isMaintenance = false;

  const { shorts, images, videos, albums, allTags, allMedia, filterMedia } = useGalleryData();

  // 🔗 Sinkronisasi URL query parameter (?media=ID&type=TYPE) untuk deep-linking
  useEffect(() => {
    const mediaId = searchParams.get("media");
    const mediaType = searchParams.get("type");
    if (mediaId && allMedia.length > 0) {
      const found = allMedia.find(
        (m) => String(m.id) === String(mediaId) && (!mediaType || m.type === mediaType)
      );
      if (found) {
        setSelectedMedia(found);
        if (found.type === "short") {
          const idx = shorts.findIndex((s) => String(s.id) === String(found.id));
          setShortsList(shorts);
          setCurrentIndex(idx >= 0 ? idx : 0);
        } else {
          setCurrentIndex(0);
        }
      }
    }
  }, [searchParams, allMedia, shorts]);

  // Handler penutupan modal sekaligus membersihkan query parameter URL
  const handleCloseModal = useCallback(() => {
    setSelectedMedia(null);
    if (searchParams.get("media")) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // 🌀 Navigasi ke short berikutnya
  const handleNext = useCallback(() => {
    if (!shortsList.length) return;
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % shortsList.length;
      setSelectedMedia(shortsList[nextIndex]);
      return nextIndex;
    });
  }, [shortsList]);

  // 🌀 Navigasi ke short sebelumnya
  const handlePrev = useCallback(() => {
    if (!shortsList.length) return;
    setCurrentIndex((prev) => {
      const prevIndex = (prev - 1 + shortsList.length) % shortsList.length;
      setSelectedMedia(shortsList[prevIndex]);
      return prevIndex;
    });
  }, [shortsList]);

  // 🔍 Handle filter changes
  const handleFilter = useCallback((settings) => {
    setFilterSettings(settings);
  }, []);

  // ⚡ One-way filtered data per section
  const filteredShorts = useMemo(() => 
    filterMedia(shorts, filterSettings.searchTerm, filterSettings.tags),
    [filterMedia, shorts, filterSettings.searchTerm, filterSettings.tags]
  );

  const filteredImages = useMemo(() => 
    filterMedia(images, filterSettings.searchTerm, filterSettings.tags),
    [filterMedia, images, filterSettings.searchTerm, filterSettings.tags]
  );

  const filteredVideos = useMemo(() => 
    filterMedia(videos, filterSettings.searchTerm, filterSettings.tags),
    [filterMedia, videos, filterSettings.searchTerm, filterSettings.tags]
  );

  const filteredAlbums = useMemo(() => 
    filterMedia(albums, filterSettings.searchTerm, filterSettings.tags),
    [filterMedia, albums, filterSettings.searchTerm, filterSettings.tags]
  );

  // 📊 Total data terfilter untuk statistik yang akurat
  const combinedFilteredMedia = useMemo(() => [
    ...filteredShorts,
    ...filteredImages,
    ...filteredVideos,
    ...filteredAlbums
  ], [filteredShorts, filteredImages, filteredVideos, filteredAlbums]);

  // Stable select callbacks to prevent child re-renders
  const handleSelectShort = useCallback((media, list, index) => {
    setSelectedMedia(media);
    setShortsList(list || []);
    setCurrentIndex(index || 0);
  }, []);

  const handleSelectMedia = useCallback((media) => {
    setSelectedMedia(media);
    setCurrentIndex(0);
  }, []);

  if (isMaintenance) return <Maintenance />;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-24 relative overflow-hidden">
      {/* 🌈 Background Glow (GPU Optimized) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
      </div>

      {/* ✨ Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6 mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-cyan-300" />
          Galeri Gen Z
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Eksplor vibe dunia visual — short, video, dan foto kekinian ✨📸🎬
        </p>
      </motion.div>

      {/* 🔍 Filter & Search */}
      <GalleryFilter onFilter={handleFilter} allTags={allTags} allMedia={allMedia} />

      {/* 📊 Statistics */}
      <GalleryStats mediaList={combinedFilteredMedia} />

      {/* ⚡ Modular Components (Memoized & Prop-driven) */}
      <GalleryShorts
        items={filteredShorts}
        filterSettings={filterSettings}
        onSelect={handleSelectShort}
      />
      <GalleryPhotos
        photos={filteredImages}
        albums={filteredAlbums}
        filterSettings={filterSettings}
        onSelect={handleSelectMedia}
      />
      <GalleryVideos
        items={filteredVideos}
        filterSettings={filterSettings}
        onSelect={handleSelectMedia}
      />

      {/* 🔗 Related Content */}
      <GalleryRelatedContent />

      {/* 🔗 Navigation ke halaman lain */}
      <GalleryNavigator />

      {/* 💫 Modals */}
      <GalleryShortModal
        selectedMedia={selectedMedia}
        setSelectedMedia={handleCloseModal}
        videoRef={videoRef}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
      <GalleryMediaModal
        selectedMedia={selectedMedia}
        setSelectedMedia={handleCloseModal}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </main>
  );
}
