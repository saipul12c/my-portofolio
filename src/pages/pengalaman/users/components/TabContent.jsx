import { motion } from "framer-motion";
import { Filter, Code } from "lucide-react";
import BusinessImpact from "./BusinessImpact";
import TestimonialCard from "./TestimonialCard";
import { cardVariants } from "../utils/animationVariants";

const TabContent = ({ activeTab, userInfo, filteredTestimonials, sortBy, setSortBy }) => {
  const renderOverview = () => (
    <div className="space-y-6 sm:space-y-8">
      {userInfo.business_impact && (
        <BusinessImpact 
          businessImpact={userInfo.business_impact} 
          innovationContributions={userInfo.innovation_contributions} 
        />
      )}
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent break-words">
            Testimoni Klien
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Ulasan dari berbagai proyek kolaborasi</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-white/8 to-white/5 border border-white/15 rounded-lg sm:rounded-2xl text-gray-300 font-semibold text-sm sm:text-base text-center xs:text-left whitespace-nowrap hover:border-white/30 transition-all duration-300"
          >
            {filteredTestimonials.length} testimoni
          </motion.div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-white/8 to-white/5 border border-white/15 rounded-lg sm:rounded-2xl p-1 sm:p-1 flex-1 xs:flex-none hover:border-white/30 transition-all duration-300">
            <Filter size={14} className="sm:w-4 sm:h-4 text-gray-400 ml-1 sm:ml-2 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm flex-1"
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Testimonials Grid */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6">
        {filteredTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );

  const renderTechnologies = () => (
    userInfo.technologies_used && (
      <div>
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2 sm:mb-4">
            Technology Stack
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-400">Teknologi yang dikuasai dan diterapkan dalam proyek</p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
          {userInfo.technologies_used.map((tech, index) => (
            <motion.div
              key={tech}
              variants={cardVariants}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="group text-center"
            >
              <div className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/15 hover:border-blue-500/40 hover:from-blue-500/25 hover:to-purple-500/25 transition-all duration-300 shadow-md hover:shadow-lg h-full flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Glow */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 mx-auto mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                  <Code size={18} className="sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="font-semibold text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors line-clamp-2">
                  {tech}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  );

  const renderPerformance = () => (
    userInfo.performance_metrics && (
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent mb-2 sm:mb-4">
            Performance Metrics
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-400">Indikator kinerja dan pencapaian proyek</p>
        </div>

        {/* Metrics Card */}
        <motion.div 
          variants={cardVariants} 
          className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/25 group relative overflow-hidden"
        >
          {/* Background Accent */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ pointerEvents: 'none' }}
          />
          
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 relative z-10">
            {Object.entries(userInfo.performance_metrics).map(([key, value], index) => (
              <motion.div 
                key={key} 
                className="group/metric"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Label and Value */}
                <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3 lg:mb-4 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-gray-200 group-hover/metric:text-white transition-colors capitalize break-words">
                    {key.replace(/_/g, " ")}
                  </span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="font-bold text-green-400 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl whitespace-nowrap transition-all duration-300 hover:border-green-500/50"
                  >
                    {value}%
                  </motion.span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 lg:h-4 overflow-hidden shadow-inner border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="bg-gradient-to-r from-green-500 to-cyan-500 h-full rounded-full shadow-lg shadow-green-500/25 group-hover/metric:shadow-green-500/40 transition-shadow relative"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  );

  const tabContent = {
    overview: renderOverview(),
    testimonials: renderTestimonials(),
    technologies: renderTechnologies(),
    performance: renderPerformance(),
    projects: (
      <div className="text-center py-8 sm:py-12 text-gray-400">
        <p className="text-sm sm:text-base">Projects content coming soon...</p>
      </div>
    )
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 sm:space-y-8"
    >
      {tabContent[activeTab] || renderOverview()}
    </motion.div>
  );
};

export default TabContent;