import { motion } from "framer-motion";
import OverviewTab from "./tabs/OverviewTab";
import PortfolioTab from "./tabs/PortfolioTab";
import TimelineTab from "./tabs/TimelineTab";
import TeamTab from "./tabs/TeamTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import TestimonialsSection from "./testimonials/TestimonialsSection";

const DynamicContent = ({ 
  activeTab, 
  companyData, 
  state, 
  dispatch, 
  activeGalleryImage, 
  setActiveGalleryImage, 
  autoPlay, 
  setAutoPlay,
  mobileMenuOpen,
  setMobileMenuOpen,
  debouncedSearchQuery,
  filteredAndSortedTestimonials
}) => {
  return (
    <div className="lg:col-span-2">
      {activeTab === 'overview' && (
        <OverviewTab 
          companyData={companyData}
          activeGalleryImage={activeGalleryImage}
          setActiveGalleryImage={setActiveGalleryImage}
          autoPlay={autoPlay}
          setAutoPlay={setAutoPlay}
        />
      )}

      {activeTab === 'portfolio' && (
        <PortfolioTab portfolio={companyData.portfolio} />
      )}

      {activeTab === 'timeline' && (
        <TimelineTab timeline={companyData.timeline} />
      )}

      {activeTab === 'team' && (
        <TeamTab team={companyData.team} />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab 
          analytics={companyData.analytics}
          timeline={companyData.timeline}
          filteredAndSortedTestimonials={filteredAndSortedTestimonials}
        />
      )}

      {activeTab === 'testimoni' && (
        <TestimonialsSection 
          state={state}
          dispatch={dispatch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          debouncedSearchQuery={debouncedSearchQuery}
          filteredAndSortedTestimonials={filteredAndSortedTestimonials}
          info={companyData.info}
        />
      )}
    </div>
  );
};

export default DynamicContent;