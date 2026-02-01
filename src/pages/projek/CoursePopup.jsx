import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Clock, BookOpen, TrendingUp, CheckCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const CoursePopup = ({
  selectedCourse,
  onClose
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isClosing, setIsClosing] = useState(false);

  // Handle escape key untuk close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedCourse && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedCourse, isClosing]);

  // Track window width untuk responsivitas
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset closing state ketika course berubah
  useEffect(() => {
    setIsClosing(false);
  }, [selectedCourse]);

  // Prevent body scroll ketika modal terbuka
  useEffect(() => {
    if (selectedCourse) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedCourse]);

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

  if (!selectedCourse) return null;

  const isMobile = windowWidth < 768;

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
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <AnimatePresence mode="wait">
      {selectedCourse && (
        <motion.div
          key="course-popup-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate={isClosing ? "hidden" : "visible"}
          exit="exit"
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate={isClosing ? "hidden" : "visible"}
            exit="exit"
            className={`bg-gradient-to-br from-gray-900/95 to-gray-900/80 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto backdrop-blur-xl ${
              isMobile ? 'p-4' : 'p-8'
            }`}
          >
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Header dengan Logo dan Judul */}
            <motion.div
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate={isClosing ? "hidden" : "visible"}
              className="mb-6 sm:mb-8 pr-12"
            >
              <div className="flex items-start gap-4 mb-3 sm:mb-4">
                <div className="text-5xl sm:text-6xl flex-shrink-0">
                  {selectedCourse.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-cyan-400 font-semibold mt-1 text-sm sm:text-base">
                    {selectedCourse.provider}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Meta Information */}
            <motion.div
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate={isClosing ? "hidden" : "visible"}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8"
            >
              <div className="bg-cyan-500/15 border border-cyan-400/30 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-300 uppercase">Durasi</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {selectedCourse.duration}
                </p>
              </div>

              <div className="bg-blue-500/15 border border-blue-400/30 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-300 uppercase">Level</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {selectedCourse.level}
                </p>
              </div>

              <div className="bg-purple-500/15 border border-purple-400/30 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-purple-300 uppercase">Tahun</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {selectedCourse.year}
                </p>
              </div>

              {selectedCourse.certificate && (
                <div className="bg-yellow-500/15 border border-yellow-400/30 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-300 uppercase">Sertifikat</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white">
                    Ya ✓
                  </p>
                </div>
              )}
            </motion.div>

            {/* Divider */}
            <motion.div
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate={isClosing ? "hidden" : "visible"}
              className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 sm:mb-8"
            />

            {/* Deskripsi */}
            <motion.div
              custom={3}
              variants={contentVariants}
              initial="hidden"
              animate={isClosing ? "hidden" : "visible"}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Deskripsi
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {selectedCourse.description}
              </p>
            </motion.div>

            {/* Keahlian yang Dipelajari */}
            <motion.div
              custom={4}
              variants={contentVariants}
              initial="hidden"
              animate={isClosing ? "hidden" : "visible"}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Keahlian yang Dipelajari
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {selectedCourse.skills_learned && selectedCourse.skills_learned.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={contentVariants}
                    initial="hidden"
                    animate={isClosing ? "hidden" : "visible"}
                    className="flex items-center gap-2 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-200">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Summary */}
            {selectedCourse.skills_learned && selectedCourse.skills_learned.length > 0 && (
              <motion.div
                custom={5}
                variants={contentVariants}
                initial="hidden"
                animate={isClosing ? "hidden" : "visible"}
                className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-lg p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-semibold">
                      Total Keahlian
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-cyan-300 mt-1">
                      {selectedCourse.skills_learned.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-semibold">
                      Program Pelatihan
                    </p>
                    <p className="text-white font-semibold text-sm sm:text-base mt-1">
                      Professional Development
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer Action */}
            <motion.div
              custom={6}
              variants={contentVariants}
              initial="hidden"
              animate={isClosing ? "hidden" : "visible"}
              className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10"
            >
              <button
                onClick={handleClose}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Tutup Detail
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoursePopup;
