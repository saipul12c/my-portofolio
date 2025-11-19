import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

import { useCompanyData } from "./hooks/useCompanyData";
import { useDebounce } from "./hooks/useDebounce";
import { createCompanySlug } from "./utils/companyUtils";
import { containerVariants } from "./animations/variants";

import ErrorBoundary from "./components/ErrorBoundary";
import CompanyHeader from "./components/CompanyHeader";
import NavigationTabs from "./components/NavigationTabs";
import CompanyDetails from "./components/CompanyDetails";
import DynamicContent from "./components/DynamicContent";
import ContactCTA from "./components/ContactCTA";
import SkeletonLoader from "./components/SkeletonLoader";

export default function DetailPerusahaanPage() {
  const { slug } = useParams();
  const { state, dispatch } = useCompanyData(slug);
  const [expandedSection, setExpandedSection] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const debouncedSearchQuery = useDebounce(state.searchQuery, 300);

  // Auto-play gallery
  useEffect(() => {
    if (!autoPlay || !state.companyData?.portfolio?.length) return;

    const interval = setInterval(() => {
      setActiveGalleryImage(prev => 
        prev < state.companyData.portfolio.length - 1 ? prev + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, state.companyData?.portfolio]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8">
            <SkeletonLoader type="header" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <SkeletonLoader />
                <SkeletonLoader />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error || !state.companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perusahaan Tidak Ditemukan</h2>
          <p className="text-gray-400 mb-8">
            {state.error || 'Maaf, data perusahaan yang Anda cari tidak tersedia.'}
          </p>
        </motion.div>
      </div>
    );
  }

  const { info } = state.companyData;

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{info.name} - Detail Perusahaan & Portfolio | Syaiful Dev</title>
        <meta name="description" content={`Lihat detail lengkap tentang ${info.name}, termasuk portfolio proyek, testimoni klien, dan metrik kinerja perusahaan.`} />
        <meta name="keywords" content={`${info.name}, perusahaan teknologi, portfolio, testimoni, ${info.technologies.join(', ')}`} />
        <meta property="og:title" content={`${info.name} - Portfolio & Testimoni`} />
        <meta property="og:description" content={`Jelajahi proyek-proyek dan testimoni dari ${info.name}. Rating ${info.avgRating}/5 dari ${info.totalTestimonials} testimoni.`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://syaiful.dev/testimoni/companies/${slug}`} />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900/50 to-slate-900/50 pointer-events-none"></div>
        
        <CompanyHeader.Navigation 
          companyData={state.companyData}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CompanyHeader.Main 
            info={info}
            analytics={state.companyData.analytics}
          />

          <NavigationTabs 
            activeTab={state.activeTab}
            dispatch={dispatch}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <CompanyDetails 
              info={info}
              expandedSection={expandedSection}
              toggleSection={toggleSection}
              relatedCompanies={state.companyData.relatedCompanies}
            />

            <DynamicContent 
              activeTab={state.activeTab}
              companyData={state.companyData}
              state={state}
              dispatch={dispatch}
              activeGalleryImage={activeGalleryImage}
              setActiveGalleryImage={setActiveGalleryImage}
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              debouncedSearchQuery={debouncedSearchQuery}
              filteredAndSortedTestimonials={state.filteredAndSortedTestimonials}
            />
          </div>
        </div>

        <ContactCTA info={info} />
      </main>
    </ErrorBoundary>
  );
}