import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 💫 Improved SoftSkills Component – Fixed YouTube Shorts Embed
export default function SoftSkills() {
  const [skillsData, setSkillsData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    fetch("/data/about/softskills.json")
      .then((res) => res.json())
      .then((data) => setSkillsData(data))
      .catch((err) => console.error("❌ Gagal ambil data skill:", err));
  }, []);

  useEffect(() => {
    if (!skillsData) return;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const colors = {
      label: [
        "bg-green-500 text-white",
        "bg-blue-500 text-white",
        "bg-red-500 text-white",
        "bg-yellow-400 text-black",
        "bg-purple-500 text-white",
        "bg-pink-500 text-white",
      ],
      level: [
        "bg-cyan-400 text-white",
        "bg-orange-400 text-white",
        "bg-indigo-400 text-white",
        "bg-emerald-400 text-white",
      ],
      card: [
        "from-cyan-600 to-cyan-800",
        "from-purple-600 to-purple-800",
        "from-pink-600 to-pink-800",
        "from-green-600 to-green-800",
        "from-blue-600 to-blue-800",
        "from-orange-600 to-orange-800",
        "from-rose-600 to-rose-800",
        "from-violet-600 to-violet-800",
      ],
    };

    const processed = skillsData.skills.map((skill) => {
      const labels = [...(skill.labels || [])];
      if (skill.dateAdded) {
        const addedDate = new Date(skill.dateAdded);
        if (addedDate > oneYearAgo && !labels.includes("Baru")) labels.push("Baru");
      }

      ["Populer", "Hot"].forEach((label) => {
        if (!labels.includes(label) && Math.random() < 0.3) labels.push(label);
      });

      const labelColorMap = {};
      labels.forEach((label) => {
        labelColorMap[label] =
          colors.label[Math.floor(Math.random() * colors.label.length)];
      });

      return {
        ...skill,
        labels,
        labelColorMap,
        levelColor:
          colors.level[Math.floor(Math.random() * colors.level.length)],
        cardGradient:
          colors.card[Math.floor(Math.random() * colors.card.length)],
      };
    });

    processed.sort((a, b) => (b.labels?.length || 0) - (a.labels?.length || 0));
    setSkills(processed);
  }, [skillsData]);

  const levelToProgress = (level) => {
    const map = { ahli: 100, mahir: 80, menengah: 60 };
    return map[level?.toLowerCase()] || 40;
  };

  // ✅ Format URL YouTube agar aman untuk Shorts & normal video
  const formatYouTubeURL = (url) => {
    if (!url) return "";
    let videoId = "";

    if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("shorts/")) {
      videoId = url.split("shorts/")[1].split("?")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  };

  const filteredSkills = skills.filter((skill) => {
    const matchSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || skill.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  if (!skillsData)
    return (
      <div className="text-white text-center mt-20 animate-pulse">
        Loading data skill...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#111827] text-white flex flex-col items-center px-6 py-20">
      {/* 🌟 Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-4xl font-extrabold text-cyan-400 mb-3 drop-shadow-lg">
          {skillsData.sectionTitle}
        </h1>
        <p className="text-gray-300 leading-relaxed">
          Temukan berbagai kemampuan non-teknis dan profesional yang
          memperkuat kerja sama, kreativitas, dan kepemimpinan.
        </p>
      </motion.div>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl mb-12 gap-6">
        <input
          type="text"
          placeholder="Cari skill..."
          className="flex-1 p-4 rounded-2xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-4 rounded-2xl bg-gray-800 text-white focus:ring-2 focus:ring-cyan-400 transition-all"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">Semua Kategori</option>
          <option value="Soft Skill">Soft Skill</option>
          <option value="Professional Skill">Professional Skill</option>
        </select>
      </div>

      {/* 💎 Skill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        <AnimatePresence>
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              viewport={{ once: true }}
              className={`relative p-6 rounded-3xl shadow-xl border border-gray-700 bg-gradient-to-br ${skill.cardGradient} hover:scale-105 hover:shadow-2xl transition-all cursor-pointer backdrop-blur-lg`}
              onClick={() => setSelectedSkill(skill)}
            >
              {skill.labels?.length > 0 && (
                <div className="absolute -top-4 left-4 flex flex-wrap gap-2 z-10">
                  {skill.labels.map((label, i) => (
                    <span
                      key={i}
                      className={`text-xs font-semibold px-3 py-1 rounded-full shadow ${skill.labelColorMap[label]}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-2xl">
                  {skill.category}
                </span>
                <span
                  className={`text-xs font-medium px-4 py-1 rounded-2xl ${skill.levelColor}`}
                >
                  {skill.level}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-2">{skill.name}</h2>
              <p className="text-gray-100 text-sm leading-relaxed line-clamp-3">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🪄 Popup Detail */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/90 border border-gray-700 rounded-2xl shadow-2xl max-w-5xl w-full overflow-y-auto p-6 relative flex flex-col md:flex-row gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition"
              >
                ✕
              </button>

              {/* Left Info */}
              <div className="flex-1 space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  {selectedSkill.name}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-2xl bg-white/20">
                    {selectedSkill.category}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-2xl ${selectedSkill.levelColor}`}
                  >
                    {selectedSkill.level}
                  </span>
                </div>

                <p className="text-gray-300">{selectedSkill.description}</p>

                {selectedSkill.examples?.length > 0 && (
                  <div>
                    <h3 className="text-emerald-400 font-semibold mb-2">
                      Contoh Penerapan:
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedSkill.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3 mt-4 overflow-hidden">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${levelToProgress(selectedSkill.level)}%`,
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* 🎥 Right Video */}
              {selectedSkill.video && (
                <div className="flex-1 flex flex-col items-center">
                  <h3 className="text-pink-400 font-semibold mb-2">
                    Video Pendukung
                  </h3>

                  {(() => {
                    const videoURL = selectedSkill.video;
                    const embedURL = formatYouTubeURL(videoURL);
                    const isShorts = videoURL.includes("shorts/");

                    return (
                      <div
                        className={`overflow-hidden shadow-lg border border-gray-700 rounded-xl bg-black flex justify-center items-center ${
                          isShorts
                            ? "w-[220px] sm:w-[250px] md:w-[280px] aspect-[9/16] max-h-[420px]"
                            : "w-full aspect-video max-h-[360px]"
                        }`}
                      >
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={embedURL}
                          title={selectedSkill.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
