import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = ({ 
  state, 
  dispatch, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  debouncedSearchQuery, 
  filteredAndSortedTestimonials,
  info
}) => {
  const navigate = useNavigate();

  const handleSearchChange = (value) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: value });
  };

  const handleSortChange = (value) => {
    dispatch({ type: 'SET_SORT_BY', payload: value });
  };

  const handleFilterChange = (filterType, value) => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: { [filterType]: value } 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search and Filter */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Testimoni ({filteredAndSortedTestimonials.length})
            </h3>
            <p className="text-gray-400">
              Pengalaman langsung dari klien dan partner
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari testimoni..."
              value={state.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
              aria-label="Cari testimoni"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={state.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
              aria-label="Urutkan testimoni"
            >
              <option value="rating">Rating Tertinggi</option>
              <option value="name">Nama A-Z</option>
              <option value="project">Proyek</option>
              <option value="date">Terbaru</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Filter tambahan"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating Minimum</label>
                <select
                  value={state.filters.rating || ''}
                  onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Semua Rating</option>
                  <option value="4">4 Bintang ke atas</option>
                  <option value="4.5">4.5 Bintang ke atas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Teknologi</label>
                <select
                  value={state.filters.technologies[0] || ''}
                  onChange={(e) => handleFilterChange('technologies', e.target.value ? [e.target.value] : [])}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Semua Teknologi</option>
                  {info.technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedTestimonials.map((testimonial) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              navigate={navigate} 
            />
          ))}
        </AnimatePresence>

        {filteredAndSortedTestimonials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">Tidak ada testimoni yang ditemukan</div>
            <button
              onClick={() => {
                handleSearchChange('');
                dispatch({ type: 'SET_FILTERS', payload: initialState.filters });
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Reset pencarian
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;