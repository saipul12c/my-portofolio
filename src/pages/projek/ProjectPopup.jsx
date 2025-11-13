import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Code, Users, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const ProjectPopup = ({
  selectedProject,
  isFromUrl,
  onClose,
  onViewFullDetail,
  renderStars
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isClosing, setIsClosing] = useState(false);

  // Handle escape key untuk close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedProject && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProject, isClosing]);

  // Track window width untuk responsivitas
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset expanded state ketika project berubah
  useEffect(() => {
    setIsExpanded(false);
    setIsClosing(false);
  }, [selectedProject]);

  // Prevent body scroll ketika modal terbuka
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedProject]);

  // Smooth close function
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle view full detail dengan smooth transition
  const handleViewFullDetailSmooth = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onViewFullDetail();
      setIsClosing(false);
    }, 300);
  }, [onViewFullDetail]);

  if (!selectedProject) return null;

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {selectedProject && (
        <>
          {/* Backdrop dengan click handler yang lebih baik */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleOverlayClick}
          />
          
          {/* Main Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col relative mx-auto"
              style={{
                boxShadow: `0 0 40px -5px #22d3ee60`,
              }}
            >
              {/* Enhanced Close Button - Fixed Positioning */}
              <motion.div 
                className="absolute top-3 right-3 z-20 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isFromUrl && !isMobile && (
                  <motion.span 
                    className="text-xs text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded-full"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    From URL
                  </motion.span>
                )}
                <motion.button
                  onClick={handleClose}
                  className="bg-black/60 hover:bg-black/80 transition-all rounded-full p-2 sm:p-2 text-gray-300 hover:text-white shadow-lg backdrop-blur-sm border border-white/10"
                  aria-label="Close modal"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={isMobile ? 18 : 20} />
                </motion.button>
              </motion.div>

              {/* Mobile Header - Sticky */}
              {isMobile && (
                <motion.div 
                  className="sticky top-0 z-15 bg-[#1e293b]/95 backdrop-blur-sm border-b border-white/10 p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white line-clamp-1 pr-12">
                      {selectedProject.title}
                    </h2>
                    {selectedProject.rating && (
                      <div className="flex items-center gap-1 shrink-0">
                        {renderStars(selectedProject.rating)}
                        <span className="text-yellow-400 text-xs">({selectedProject.rating})</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Content Container */}
              <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Left Column - Project Image & Basic Info */}
                <motion.div 
                  className="lg:w-1/2 flex flex-col overflow-hidden"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Image Container dengan Aspect Ratio */}
                  <div className="relative flex-shrink-0">
                    <motion.img
                      src={selectedProject.image || "/placeholder.jpg"}
                      alt={selectedProject.title}
                      className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Label di atas gambar */}
                    <motion.span 
                      className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium border rounded-full backdrop-blur-sm ${
                        selectedProject.label === "Web Development" ? "bg-blue-500/20 text-blue-300 border-blue-400/30" :
                        selectedProject.label === "Mobile App" ? "bg-green-500/20 text-green-300 border-green-400/30" :
                        selectedProject.label === "UI/UX Design" ? "bg-purple-500/20 text-purple-300 border-purple-400/30" :
                        "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {selectedProject.label}
                    </motion.span>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {!isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {selectedProject.title}
                        </h2>
                        <p className="text-cyan-300 text-sm mb-4 line-clamp-2">
                          {selectedProject.subtitle}
                        </p>
                      </motion.div>
                    )}

                    {/* Project Metadata - Responsive */}
                    <motion.div 
                      className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={isMobile ? 14 : 16} className="text-cyan-400 shrink-0" />
                        <span>{selectedProject.date}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Users size={isMobile ? 14 : 16} className="text-purple-400 shrink-0" />
                        <span>{selectedProject.duration}</span>
                      </div>
                      {selectedProject.rating && !isMobile && (
                        <>
                          <span className="text-gray-500">•</span>
                          <div className="flex items-center gap-1">
                            {renderStars(selectedProject.rating)}
                            <span className="text-yellow-400">({selectedProject.rating})</span>
                          </div>
                        </>
                      )}
                    </motion.div>

                    {/* Overview dengan expandable untuk mobile */}
                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className={`text-gray-200 leading-relaxed text-sm sm:text-base ${
                        isMobile && !isExpanded ? 'line-clamp-3' : ''
                      }`}>
                        {selectedProject.overview || selectedProject.description || "Tidak ada deskripsi."}
                      </p>
                      {isMobile && (
                        <motion.button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-cyan-400 text-sm font-medium mt-1 flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isExpanded ? (
                            <>Tutup <ChevronUp size={16} /></>
                          ) : (
                            <>Baca selengkapnya <ChevronDown size={16} /></>
                          )}
                        </motion.button>
                      )}
                    </motion.div>

                    {/* Tech Stack */}
                    {selectedProject.tech && selectedProject.tech.length > 0 && (
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Code className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-sm font-semibold text-white">Teknologi</h4>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProject.tech.map((tech, i) => (
                            <motion.span
                              key={i}
                              className="px-2 py-1 text-xs rounded-full border border-cyan-400/30 bg-cyan-500/20 text-cyan-300 backdrop-blur-sm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons - Sticky di mobile */}
                    <motion.div 
                      className={`flex gap-3 ${isMobile ? 'sticky bottom-0 bg-[#1e293b]/95 backdrop-blur-sm pt-4 pb-2 -mx-4 px-4 border-t border-white/10' : 'mt-6'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        onClick={handleViewFullDetailSmooth}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition-all rounded-xl py-3 font-semibold text-white text-center flex items-center justify-center gap-2 text-sm sm:text-base backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink size={isMobile ? 16 : 18} />
                        {isMobile ? 'Detail Lengkap' : 'Lihat Detail Lengkap'}
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Column - Additional Info */}
                <motion.div 
                  className="lg:w-1/2 bg-[#0f172a] flex flex-col border-t lg:border-t-0 lg:border-l border-white/10"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Mobile Toggle untuk Additional Info */}
                    {isMobile && (
                      <motion.div 
                        className="flex items-center justify-between mb-4 pb-3 border-b border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-lg font-semibold text-white">Informasi Detail</h3>
                        <motion.button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-cyan-400 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Additional Info Content */}
                    <motion.div 
                      className={`space-y-6 ${isMobile && !isExpanded ? 'hidden' : 'block'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {/* Role & Collaborators */}
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="text-lg font-semibold text-white mb-3">Detail Proyek</h4>
                        <div className="space-y-3">
                          {selectedProject.role && (
                            <div className="flex items-start gap-3">
                              <Users className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-400 block">Peran:</span>
                                <p className="text-white text-sm break-words">{selectedProject.role}</p>
                              </div>
                            </div>
                          )}
                          {selectedProject.collaborators && selectedProject.collaborators.length > 0 && (
                            <div className="flex items-start gap-3">
                              <Users className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-400 block">Kolaborator:</span>
                                <p className="text-white text-sm break-words">
                                  {selectedProject.collaborators.join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedProject.status && (
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  selectedProject.status === 'Selesai' ? 'bg-green-500' :
                                  selectedProject.status === 'Berjalan' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-400">Status:</span>
                                <p className="text-white text-sm">{selectedProject.status}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Key Features */}
                      {selectedProject.features && selectedProject.features.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <h4 className="text-lg font-semibold text-white mb-3">Fitur Utama</h4>
                          <ul className="space-y-2">
                            {selectedProject.features.slice(0, isMobile ? 3 : 5).map((feature, index) => (
                              <motion.li 
                                key={index} 
                                className="flex items-start gap-2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                              >
                                <motion.div 
                                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"
                                  animate={{
                                    scale: [1, 1.3, 1],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: index * 0.2
                                  }}
                                />
                                <span className="text-sm text-gray-300 flex-1">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                          {isMobile && selectedProject.features.length > 3 && (
                            <p className="text-cyan-400 text-sm mt-2">
                              +{selectedProject.features.length - 3} fitur lainnya
                            </p>
                          )}
                        </motion.div>
                      )}

                      {/* Results & Impact */}
                      {selectedProject.results && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <h4 className="text-lg font-semibold text-white mb-3">Hasil & Dampak</h4>
                          <p className="text-sm text-gray-300 mb-2">{selectedProject.results}</p>
                          {selectedProject.impact && (
                            <p className="text-sm text-cyan-300">{selectedProject.impact}</p>
                          )}
                        </motion.div>
                      )}

                      {/* Additional Links atau Info */}
                      {(selectedProject.links || selectedProject.repository) && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <h4 className="text-lg font-semibold text-white mb-3">Tautan</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.repository && (
                              <motion.a
                                href={selectedProject.repository}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-1 transition-colors backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Code size={14} />
                                Repository
                              </motion.a>
                            )}
                            {selectedProject.links && selectedProject.links.map((link, index) => (
                              <motion.a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-xs bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white flex items-center gap-1 transition-colors backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                              >
                                <ExternalLink size={14} />
                                {link.name || 'Live Demo'}
                              </motion.a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectPopup;