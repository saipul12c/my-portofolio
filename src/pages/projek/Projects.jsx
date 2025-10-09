import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import data from "../../data/projects.json";
import { useErrorAuth } from "../../context/ErrorContext"; // 🧩 Context error/izin

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const { setAuthorizedError } = useErrorAuth(); // 🔒 Context proteksi error

  const { projects = [], categories = [], labelColors = {} } = data;

  // 🛠️ Mode maintenance
  const isMaintenance = false;

  // 🚧 Jika sedang maintenance → redirect ke /503
  useEffect(() => {
    if (isMaintenance) {
      setAuthorizedError(true);
      navigate("/503");
    }
  }, [isMaintenance, setAuthorizedError, navigate]);

  // 🔍 Filter & pencarian
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

  // ⭐ Render rating bintang
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

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* 🌈 Background efek glow */}
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
          </span>.
        </p>
      </motion.div>

      {/* 🔍 Search + Filter kategori */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full max-w-4xl justify-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400 placeholder-gray-400 text-white"
          />
        </div>

        {/* Dropdown kategori */}
        <div className="relative w-full sm:w-1/3">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 text-white appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0f172a] text-white">
                {cat}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-3 text-gray-400 pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      {/* 📦 Grid Proyek */}
      {filteredProjects.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="relative group bg-white/10 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300"
            >
              {/* Klik gambar → buka detail */}
              <img
                src={project.image || "/placeholder.jpg"}
                alt={project.title}
                loading="lazy"
                onClick={() =>
                  navigate(`/projects/${project.id}`, {
                    state: { fromProjects: true }, // 💥 hanya dari halaman projects
                  })
                }
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[25%]"
              />

              {/* Label */}
              <span
                className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium border rounded-full ${
                  labelColors[project.label] ||
                  "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                }`}
              >
                {project.label}
              </span>

              {/* Rating */}
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md">
                {renderStars(project.rating)}
              </div>

              {/* Overlay hover */}
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
            </div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-400 text-center mt-20">
          Tidak ada proyek ditemukan 😢
        </p>
      )}

      {/* 💬 Popup Preview Detail */}
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
                      state: { fromProjects: true }, // 🔒 Proteksi
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
