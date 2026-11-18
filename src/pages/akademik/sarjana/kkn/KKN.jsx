import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet";

// Subkomponen Modular KKN
import KKNHero from "./components/KKNHero";
import KKNStats from "./components/KKNStats";
import KKNPillars from "./components/KKNPillars";
import KKNTimeline from "./components/KKNTimeline";
import KKNGallery from "./components/KKNGallery";
import KKNTeam from "./components/KKNTeam";
import KKNTestimonials from "./components/KKNTestimonials";
import KKNOutputs from "./components/KKNOutputs";
import KKNNavigation from "./components/KKNNavigation";
import KKNDetailModal from "./modals/KKNDetailModal";

// Data Terstruktur KKN
import {
  kknOverview,
  kknStats,
  kknPillars,
  kknDailyLogs,
  kknPhases,
  kknGallery,
  kknTeam,
  kknTestimonials,
  kknOutputs,
} from "./data/kknData";

export default function KKN() {
  const [modalData, setModalData] = useState({
    isOpen: false,
    item: null,
    type: "pillar", // 'pillar' | 'gallery'
  });

  const handleOpenPillarModal = useCallback((pillar) => {
    setModalData({
      isOpen: true,
      item: pillar,
      type: "pillar",
    });
  }, []);

  const handleOpenGalleryModal = useCallback((photo) => {
    setModalData({
      isOpen: true,
      item: photo,
      type: "gallery",
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({
      ...prev,
      isOpen: false,
      item: null,
    }));
  }, []);

  const handleScrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Kuliah Kerja Nyata (KKN) Tematik | S1 PGMI - Muhammad Syaiful Mukmin</title>
        <meta
          name="description"
          content="Dokumentasi lengkap Kuliah Kerja Nyata (KKN) Tematik mahasiswa S1 PGMI: 4 pilar program kerja, linimasa mingguan, digitalisasi UMKM, posyandu, dan galeri pengabdian masyarakat."
        />
        <meta property="og:title" content="Kuliah Kerja Nyata (KKN) Tematik - Muhammad Syaiful Mukmin" />
        <meta
          property="og:description"
          content="Bakti nyata mahasiswa untuk kemandirian desa melalui sinergi pendidikan, UMKM, kesehatan lingkungan, dan sosial budaya."
        />
      </Helmet>

      <main className="min-h-screen bg-[#0b1120] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
        {/* 1. Hero Section */}
        <KKNHero overview={kknOverview} onScrollTo={handleScrollTo} />

        {/* 2. Statistik Capaian Kuantitatif */}
        <KKNStats stats={kknStats} />

        {/* 3. 4 Pilar Program Kerja Terpadu */}
        <KKNPillars
          pillars={kknPillars}
          onSelectPillar={handleOpenPillarModal}
        />

        {/* 4. Linimasa Mingguan & Log Harian 32 Hari */}
        <KKNTimeline />

        {/* 5. Galeri Dokumentasi Foto */}
        <KKNGallery
          gallery={kknGallery}
          onSelectPhoto={handleOpenGalleryModal}
        />

        {/* 6. Struktur Anggota Tim Pengabdian */}
        <KKNTeam team={kknTeam} />

        {/* 7. Luaran & Produk Nyata KKN */}
        <KKNOutputs outputs={kknOutputs} />

        {/* 8. Kesan & Testimoni Masyarakat */}
        <KKNTestimonials testimonials={kknTestimonials} />

        {/* 9. Navigasi Tahapan Sarjana Lainnya */}
        <KKNNavigation />

        {/* Modal Interaktif (Pilar / Foto) */}
        {modalData.isOpen && (
          <KKNDetailModal
            item={modalData.item}
            type={modalData.type}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </>
  );
}
