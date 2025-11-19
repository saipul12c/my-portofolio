import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award } from "lucide-react";

// Import komponen modular
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorState from "./components/ErrorState";
import ProfileHeader from "./components/ProfileHeader";
import StatsGrid from "./components/StatsGrid";
import NavigationTabs from "./components/NavigationTabs";
import TabContent from "./components/TabContent";

// Import hooks
import { useUserData } from "./hooks/useUserData";
import { useTestimonialFilter } from "./hooks/useTestimonialFilter";

// Import utilities
import { gradientBg } from "./utils/animationVariants";

export default function DetailPenggunaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [imageError, setImageError] = useState(false);

  const {
    loading,
    error,
    filteredTestimonials,
    sortBy,
    setSortBy,
    userInfo,
    handleRetry
  } = useUserData(slug);

  const { sortedTestimonials } = useTestimonialFilter(filteredTestimonials, sortBy);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  // Data not found state
  if (!userInfo || filteredTestimonials.length === 0) {
    return (
      <ErrorBoundary>
        <div className={`min-h-screen ${gradientBg} text-white flex items-center justify-center px-4`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl"
          >
            <div className="w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Award size={32} className="sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pengguna Tidak Ditemukan
            </h2>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
              Maaf, data pengguna yang Anda cari tidak tersedia.
            </p>
            <Link
              to="/testimoni"
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-2xl transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transform text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              Kembali ke Testimoni
            </Link>
          </motion.div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorState 
          message="Terjadi kesalahan yang tidak terduga" 
          onRetry={handleRetry} 
        />
      }
    >
      <main className={`min-h-screen ${gradientBg} text-white overflow-x-hidden`}>
        {/* Enhanced Animated Background - Optimized for Mobile */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/5 rounded-full blur-3xl animate-float animation-delay-2000"></div>
          <div className="absolute top-3/4 left-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-cyan-500/5 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        </div>

        <ProfileHeader 
          userInfo={userInfo}
          navigate={navigate}
          imageError={imageError}
          handleImageError={handleImageError}
        />

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-10 relative z-10">
          <StatsGrid userInfo={userInfo} />

          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <AnimatePresence mode="wait">
            <TabContent 
              activeTab={activeTab}
              userInfo={userInfo}
              filteredTestimonials={sortedTestimonials}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </AnimatePresence>
        </div>
      </main>
    </ErrorBoundary>
  );
}