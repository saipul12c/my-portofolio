import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Star, X, ExternalLink, Code, Users, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import data from "../../data/projects.json";
import { useErrorAuth } from "../../context/useErrorAuth";
import SearchBar from "./pencarian/SearchBar";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFromUrl, setIsFromUrl] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { setAuthorizedError } = useErrorAuth();
  const { projects = [], categories = [], labelColors = {} } = data;

  const isMaintenance = false;

  // 🚧 Maintenance redirect
  useEffect(() => {
    if (isMaintenance) {
      setAuthorizedError(true);
      navigate("/503");
    }
  }, [isMaintenance, setAuthorizedError, navigate]);

  // Handle URL parameter untuk auto-open modal
  useEffect(() => {
    if (id) {
      const projectId = parseInt(id);
      if (!isNaN(projectId)) {
        const foundProject = projects.find(p => p.id === projectId);
        if (foundProject) {
          setIsFromUrl(true);
          setSelectedProject(foundProject);
          // Scroll ke atas saat modal dibuka dari URL
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }, [id, projects]);

  // Handle close modal dengan update URL
  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    if (isFromUrl) {
      navigate('/projects', { replace: true });
      setIsFromUrl(false);
    }
  }, [navigate, isFromUrl]);

  // Handle select project dengan update URL
  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
    navigate(`/projects/${project.id}`, { replace: true });
  }, [navigate]);

  // Handle escape key untuk close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProject, handleCloseModal]);

  // Prevent body scroll ketika modal terbuka
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // 🔍 Filter hasil proyek
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory =
        activeCategory === "All" || project.category === activeCategory;
      const matchSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [projects, searchTerm, activeCategory]);

  // 📄 Pagination setup
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 📜 Scroll ke atas saat pindah halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ⭐ Render bintang rating
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++)
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm"
        />
      );
    if (half)
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400/60" />);
    return stars;
  };

  // 🔢 Logika nomor halaman maksimal 10
  const getVisiblePages = () => {
    const maxPagesToShow = 10;
    if (totalPages <= maxPagesToShow)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    let startPage = Math.max(currentPage - 4, 1);
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxPagesToShow + 1;
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Enhanced project selection dengan URL support
  const handleProjectCardClick = useCallback((project) => {
    handleSelectProject(project);
  }, [handleSelectProject]);

  // Handle navigation ke halaman detail lengkap
  const handleViewFullDetail = useCallback(() => {
    if (selectedProject) {
      handleCloseModal();
      navigate(`/project-detail/${selectedProject.id}`, {
        state: { fromProjects: true }
      });
    }
  }, [selectedProject, handleCloseModal, navigate]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* 🌈 Background efek */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 🧭 Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <Rocket className="w-10 h-10 text-cyan-400" />
          Proyek & Inovasi
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Eksplorasi karya saya di bidang{" "}
          <span className="text-cyan-400 font-semibold">teknologi</span>,{" "}
          <span className="text-blue-400 font-semibold">edukasi</span>, dan{" "}
          <span className="text-purple-400 font-semibold">
            kreativitas digital
          </span>
          .
        </p>
      </motion.div>

      {/* 🔍 Komponen SearchBar */}
      <SearchBar
        projects={projects}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setActiveCategory}
      />

      {/* 📦 Grid Proyek */}
      {filteredProjects.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage} // penting untuk animasi per halaman
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            {currentProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className={`relative group bg-white/10 backdrop-blur-xl border rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ${
                  selectedProject?.id === project.id 
                    ? 'border-cyan-400 ring-2 ring-cyan-400/20' 
                    : 'border-white/10 hover:border-cyan-400'
                }`}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={project.image || "/placeholder.jpg"}
                  alt={project.title}
                  loading="lazy"
                  onClick={() => handleProjectCardClick(project)}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[25%]"
                />

                <span
                  className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium border rounded-full ${
                    labelColors[project.label] ||
                    "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                  }`}
                >
                  {project.label}
                </span>

                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md">
                  {renderStars(project.rating)}
                </div>

                <div
                  onClick={() => handleProjectCardClick(project)}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6"
                >
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-1">
                    {project.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-gray-400 text-center mt-20">
          Tidak ada proyek ditemukan 😢
        </p>
      )}

      {/* 🔢 Pagination Angka */}
      {totalPages > 1 && (
        <motion.div
          className="flex flex-wrap justify-center items-center gap-2 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {getVisiblePages().map((page) => (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                page === currentPage
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-300 hover:bg-cyan-600/30"
              }`}
            >
              {page}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* 💬 Enhanced Popup Detail */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
                style={{
                  boxShadow: `0 0 40px -5px #22d3ee60`,
                }}
              >
                {/* Close Button dengan indicator URL */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  {isFromUrl && (
                    <span className="text-xs text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded-full">
                      From URL
                    </span>
                  )}
                  <button
                    onClick={handleCloseModal}
                    className="bg-black/40 rounded-full p-2 hover:bg-black/60 transition text-gray-300 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content Container */}
                <div className="flex flex-col lg:flex-row max-h-[90vh]">
                  {/* Left Column - Project Image & Basic Info */}
                  <div className="lg:w-1/2 p-6 flex flex-col">
                    <img
                      src={selectedProject.image || "/placeholder.jpg"}
                      alt={selectedProject.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl mb-4 flex-shrink-0"
                    />
                    
                    <div className="flex-1 overflow-y-auto">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedProject.title}
                      </h2>
                      <p className="text-cyan-300 text-sm mb-4">
                        {selectedProject.subtitle}
                      </p>

                      {/* Project Metadata */}
                      <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
                        <Calendar size={16} className="text-cyan-400" />
                        <span>{selectedProject.date}</span>
                        <span>•</span>
                        <Users size={16} className="text-purple-400" />
                        <span>{selectedProject.duration}</span>
                        {selectedProject.rating && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {renderStars(selectedProject.rating)}
                              <span className="text-yellow-400">({selectedProject.rating})</span>
                            </div>
                          </>
                        )}
                      </div>

                      <p className="text-gray-200 leading-relaxed mb-4">
                        {selectedProject.overview || selectedProject.description || "Tidak ada deskripsi."}
                      </p>

                      {/* Tech Stack */}
                      {selectedProject.tech && selectedProject.tech.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4 text-cyan-400" />
                            <h4 className="text-sm font-semibold text-white">Teknologi</h4>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {selectedProject.tech.map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs rounded-full border border-cyan-400/30 bg-cyan-500/20 text-cyan-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleViewFullDetail}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition-all rounded-xl py-3 font-semibold text-white text-center flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={18} />
                          Lihat Detail Lengkap
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Additional Info */}
                  <div className="lg:w-1/2 bg-[#0f172a] p-6 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {/* Project Details */}
                      <div className="space-y-6">
                        {/* Role & Collaborators */}
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Detail Proyek</h4>
                          <div className="space-y-3">
                            {selectedProject.role && (
                              <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-purple-400" />
                                <div>
                                  <span className="text-sm text-gray-400">Peran:</span>
                                  <p className="text-white text-sm">{selectedProject.role}</p>
                                </div>
                              </div>
                            )}
                            {selectedProject.collaborators && selectedProject.collaborators.length > 0 && (
                              <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-green-400" />
                                <div>
                                  <span className="text-sm text-gray-400">Kolaborator:</span>
                                  <p className="text-white text-sm">{selectedProject.collaborators.join(', ')}</p>
                                </div>
                              </div>
                            )}
                            {selectedProject.status && (
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  selectedProject.status === 'Selesai' ? 'bg-green-500' :
                                  selectedProject.status === 'Berjalan' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`} />
                                <div>
                                  <span className="text-sm text-gray-400">Status:</span>
                                  <p className="text-white text-sm">{selectedProject.status}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Key Features */}
                        {selectedProject.features && selectedProject.features.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Fitur Utama</h4>
                            <ul className="space-y-2">
                              {selectedProject.features.slice(0, 5).map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm text-gray-300">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Results & Impact */}
                        {selectedProject.results && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3">Hasil & Dampak</h4>
                            <p className="text-sm text-gray-300">{selectedProject.results}</p>
                            {selectedProject.impact && (
                              <p className="text-sm text-cyan-300 mt-2">{selectedProject.impact}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}