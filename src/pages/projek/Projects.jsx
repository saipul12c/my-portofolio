import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import data from "../../data/projects.json";
import { useErrorAuth } from "../../context/useErrorAuth";
import SearchBar from "./pencarian/SearchBar";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
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
                className="relative group bg-white/10 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={project.image || "/placeholder.jpg"}
                  alt={project.title}
                  loading="lazy"
                  onClick={() =>
                    navigate(`/projects/${project.id}`, {
                      state: { fromProjects: true },
                    })
                  }
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
                  onClick={() => setSelectedProject(project)}
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

      {/* 💬 Popup Detail */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative text-white">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={selectedProject.image || "/placeholder.jpg"}
                  alt={selectedProject.title}
                  className="w-full h-60 object-cover rounded-xl mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">
                  {selectedProject.title}
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  {selectedProject.description || "Tidak ada deskripsi."}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(selectedProject.rating)}
                  <span className="text-sm text-gray-400">
                    ({selectedProject.rating})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    navigate(`/projects/${selectedProject.id}`, {
                      state: { fromProjects: true },
                    });
                  }}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all rounded-lg py-2 mt-2 font-semibold text-white"
                >
                  Lihat Detail
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
