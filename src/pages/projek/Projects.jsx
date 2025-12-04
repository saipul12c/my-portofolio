import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import data from "../../data/projects.json";
import { useErrorAuth } from "../../context/useErrorAuth";
import SearchBar from "./pencarian/SearchBar";
import ProjectPopup from "./ProjectPopup";

// Memoized ProjectCard component untuk prevent unnecessary re-renders
const ProjectCard = ({ project, isSelected, labelColors, onSelect, renderStars }) => (
  <motion.div
    key={project.id}
    layout
    className={`relative group bg-white/10 backdrop-blur-xl border rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ${
      isSelected
        ? 'border-cyan-400 ring-2 ring-cyan-400/20'
        : 'border-white/10 hover:border-cyan-400'
    }`}
    whileHover={{ scale: 1.03 }}
  >
    <img
      src={project.image || "/placeholder.jpg"}
      alt={project.title}
      loading="lazy"
      onClick={onSelect}
      className="w-full h-40 sm:h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[25%]"
    />

    <span
      className={`absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 text-xs font-medium border rounded-full ${
        labelColors[project.label] ||
        "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
      }`}
    >
      {project.label}
    </span>

    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 bg-black/50 px-1.5 sm:px-2 py-1 rounded-md">
      {renderStars(project.rating)}
    </div>

    <div
      onClick={onSelect}
      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
        {project.title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-300 line-clamp-1">
        {project.category}
      </p>
    </div>
  </motion.div>
);

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

  // ⭐ Memoized render stars - hanya dibuat sekali
  const renderStars = useCallback((rating) => {
    if (!rating) return null;
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++)
      stars.push(
        <Star
          key={i}
          className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm"
        />
      );
    if (half)
      stars.push(<Star key="half" className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400/60" />);
    return stars;
  }, []);

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



  // 🔢 Logika nomor halaman maksimal 10
  const getVisiblePages = useCallback(() => {
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
  }, [currentPage, totalPages]);

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
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-20 py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* 🌈 Responsive Background efek */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 🧭 Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 mb-8 sm:mb-10 md:mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
          <Rocket className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-cyan-400 flex-shrink-0" />
          <span>Proyek & Inovasi</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-lg lg:text-xl leading-relaxed px-2">
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
            key={currentPage}
            className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            {currentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                labelColors={labelColors}
                onSelect={() => handleProjectCardClick(project)}
                renderStars={renderStars}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-gray-400 text-center mt-16 sm:mt-20 text-sm sm:text-base">
          Tidak ada proyek ditemukan 😢
        </p>
      )}

      {/* 🔢 Pagination Angka */}
      {totalPages > 1 && (
        <motion.div
          className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10 md:mt-12 px-2"
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
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
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
      <ProjectPopup
        selectedProject={selectedProject}
        isFromUrl={isFromUrl}
        onClose={handleCloseModal}
        onViewFullDetail={handleViewFullDetail}
        renderStars={renderStars}
      />
    </main>
  );
}