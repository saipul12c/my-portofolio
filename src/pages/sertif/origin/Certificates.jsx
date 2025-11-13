"use client";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { 
  X, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Star, 
  Rocket,
  Code,
  Zap,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import data
import certificatesData from "../../data/sertif/certificates.json";
import softskillsData from "../../data/skills/softskills.json";
import projectsData from "../../data/projects.json";
import testimonialsData from "../../data/testimoni/testimonials.json";

const { certificates, tagColors } = certificatesData;

// === Fuzzy Smart Search ===
const smartFilter = (certs, query, category) => {
  if (!query && category === "All") return certs;
  const q = query.toLowerCase().trim();

  const scoreItem = (cert) => {
    let score = 0;
    const boost = (field, weight = 1) => {
      const text = field?.toLowerCase() || "";
      if (text.startsWith(q)) score += 5 * weight;
      else if (text.includes(q)) score += 3 * weight;
      else if (q.split(" ").every((w) => text.includes(w))) score += 2 * weight;
    };

    boost(cert.title, 2);
    boost(cert.issuer);
    cert.tags?.forEach((t) => boost(t));
    if (category !== "All" && cert.category !== category) score -= 5;

    return score;
  };

  return certs
    .map((c) => ({ ...c, score: scoreItem(c) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
};

// === Helper function untuk shuffle array ===
const shuffleArray = (array) => {
  if (!array || array.length === 0) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// === Find related skills dengan pengacakan ===
const findRelatedSkills = (certificateTags, skills) => {
  if (!certificateTags || !skills || skills.length === 0) return [];
  
  // Filter skills yang valid (punya id dan name)
  const validSkills = skills.filter(skill => skill?.id && skill?.name);
  
  // Cari skills yang relevan berdasarkan tag
  const relevantSkills = validSkills.filter(skill => 
    certificateTags.some(tag => 
      skill.name?.toLowerCase().includes(tag.toLowerCase()) ||
      skill.description?.toLowerCase().includes(tag.toLowerCase()) ||
      skill.tags?.some(skillTag => 
        skillTag.toLowerCase().includes(tag.toLowerCase())
      ) ||
      skill.category?.toLowerCase().includes(tag.toLowerCase())
    )
  );

  // Jika ada skills relevan, acak dan batasi jumlahnya
  if (relevantSkills.length > 0) {
    return shuffleArray(relevantSkills).slice(0, 4);
  }
  
  // Jika tidak ada yang relevan, ambil random skills
  return shuffleArray(validSkills).slice(0, 3);
};

// === Find related projects dengan pengacakan ===
const findRelatedProjects = (certificateTags, projects) => {
  if (!certificateTags || !projects || projects.length === 0) return [];
  
  // Filter projects yang valid (punya id dan title)
  const validProjects = projects.filter(project => project?.id && project?.title);
  
  // Cari projects yang relevan berdasarkan tag
  const relevantProjects = validProjects.filter(project => 
    certificateTags.some(tag => 
      project.title?.toLowerCase().includes(tag.toLowerCase()) ||
      project.description?.toLowerCase().includes(tag.toLowerCase()) ||
      project.category?.toLowerCase().includes(tag.toLowerCase()) ||
      project.tech?.some(tech => 
        tech.toLowerCase().includes(tag.toLowerCase())
      ) ||
      project.tags?.some(projectTag => 
        projectTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );

  // Jika ada projects relevan, acak dan batasi jumlahnya
  if (relevantProjects.length > 0) {
    return shuffleArray(relevantProjects).slice(0, 3);
  }
  
  // Jika tidak ada yang relevan, ambil random projects
  return shuffleArray(validProjects).slice(0, 2);
};

// === Find related testimonials dengan pengacakan ===
const findRelatedTestimonials = (certificateTags, testimonials) => {
  if (!certificateTags || !testimonials || testimonials.length === 0) return [];
  
  // Filter testimonials yang valid (punya id dan text)
  const validTestimonials = testimonials.filter(testimonial => testimonial?.id && testimonial?.text);
  
  // Cari testimonials yang relevan berdasarkan tag
  const relevantTestimonials = validTestimonials.filter(testimonial => 
    certificateTags.some(tag => 
      testimonial.text?.toLowerCase().includes(tag.toLowerCase()) ||
      testimonial.title?.toLowerCase().includes(tag.toLowerCase()) ||
      testimonial.project?.toLowerCase().includes(tag.toLowerCase()) ||
      testimonial.tags?.some(testimonialTag => 
        testimonialTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );

  // Jika ada testimonials relevan, acak dan batasi jumlahnya
  if (relevantTestimonials.length > 0) {
    return shuffleArray(relevantTestimonials).slice(0, 2);
  }
  
  // Jika tidak ada yang relevan, ambil random testimonials
  return shuffleArray(validTestimonials).slice(0, 2);
};

export default function Certificates() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const suggestionRef = useRef(null);
  const navigate = useNavigate();

  const categories = useMemo(
    () => ["All", ...new Set(certificates.map((c) => c.category))],
    []
  );

  // Load skills, projects, dan testimonials data
  useEffect(() => {
    try {
      if (softskillsData?.skills) {
        setSkills(softskillsData.skills);
      }
      if (projectsData?.projects) {
        setProjects(projectsData.projects);
      }
      if (testimonialsData) {
        setTestimonials(testimonialsData);
      }
    } catch (error) {
      console.error("Error loading additional data:", error);
    }
  }, []);

  const closePopup = useCallback(() => setSelected(null), []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
  }, [selected]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closePopup();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closePopup]);

  // === Smart Filtering ===
  const filteredCertificates = useMemo(
    () => smartFilter(certificates, search, filterCategory),
    [search, filterCategory]
  );

  // === Related data for selected certificate ===
  const relatedSkills = useMemo(() => {
    if (!selected?.tags || skills.length === 0) return [];
    return findRelatedSkills(selected.tags, skills);
  }, [selected, skills]);

  const relatedProjects = useMemo(() => {
    if (!selected?.tags || projects.length === 0) return [];
    return findRelatedProjects(selected.tags, projects);
  }, [selected, projects]);

  const relatedTestimonials = useMemo(() => {
    if (!selected?.tags || testimonials.length === 0) return [];
    return findRelatedTestimonials(selected.tags, testimonials);
  }, [selected, testimonials]);

  // === Pagination ===
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // === Suggestion Dropdown ===
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const all = certificates.flatMap((c) => [
      { type: "title", value: c.title },
      { type: "issuer", value: c.issuer },
      ...(c.tags || []).map((t) => ({ type: "tag", value: t })),
    ]);
    const unique = Array.from(new Set(all.map((a) => a.value)));
    return unique
      .filter((v) => v.toLowerCase().includes(q))
      .slice(0, 6)
      .map((v) => ({ value: v }));
  }, [search]);

  // === Ghost Autocomplete ===
  const ghostText = useMemo(() => {
    if (!search.trim()) return "";
    const q = search.toLowerCase();
    const match = certificates
      .flatMap((c) => [c.title, c.issuer, ...(c.tags || [])])
      .find((v) => v.toLowerCase().startsWith(q));
    if (!match) return "";
    return match.slice(search.length);
  }, [search]);

  // === Keyboard navigation ===
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      setSearch(suggestions[activeIndex].value);
      setActiveIndex(-1);
    }
  };

  // === Highlight pencarian ===
  const highlightMatch = (text, query) => {
    if (!text) return "";
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      "<mark class='bg-cyan-400/30 text-cyan-200'>$1</mark>"
    );
  };

  // === Render stars untuk rating ===
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

  // === Pagination numbers ===
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

  // === Handle skill navigation ===
  const handleSkillClick = (skillId) => {
    if (!skillId) return;
    closePopup();
    navigate(`/SoftSkills/${skillId}`);
  };

  // === Handle project navigation ===
  const handleProjectClick = (projectId) => {
    if (!projectId) return;
    closePopup();
    navigate(`/projects/${projectId}`);
  };

  // === Handle testimonial navigation ===
  const handleTestimonialClick = (testimonialId) => {
    if (!testimonialId) return;
    closePopup();
    navigate(`/testimoni/${testimonialId}`);
  };

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen bg-[#0a0f1a] text-white py-24 px-6 flex flex-col items-center select-none">
        {/* 🌈 Background efek seperti Projects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header dengan animasi seperti Projects */}
        <m.div
          className="text-center max-w-3xl mx-auto space-y-6 mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center items-center gap-3">
            <Rocket className="w-10 h-10 text-cyan-400" />
            Sertifikat & Penghargaan
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
            Koleksi profesional kredibel dan dapat{" "}
            <span className="text-cyan-400 font-semibold">diverifikasi langsung</span>.
            Eksplorasi pencapaian di bidang{" "}
            <span className="text-blue-400 font-semibold">teknologi</span>,{" "}
            <span className="text-purple-400 font-semibold">sertifikasi</span>, dan{" "}
            <span className="text-emerald-400 font-semibold">pengembangan skill</span>.
          </p>
        </m.div>

        {/* Search + Filter */}
        <div className="relative w-full max-w-3xl mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-300" size={18} />

              {/* Ghost Text */}
              <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
                <span className="text-gray-500/40 select-none">
                  {search}
                  <span className="text-gray-500/20">{ghostText}</span>
                </span>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Cari sertifikat, penerbit, atau tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/10 border border-white/20 px-10 py-3 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition relative z-10 text-transparent caret-cyan-400"
                style={{ textShadow: "0 0 0 #fff" }}
              />

              {/* Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <m.ul
                    ref={suggestionRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-0 right-0 bg-[#101726]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden z-30"
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={`${s.value}-${i}`}
                        onClick={() => setSearch(s.value)}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                          i === activeIndex
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "hover:bg-white/10"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(s.value, search),
                        }}
                      />
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>
            </div>

            <select
              className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl cursor-pointer focus:ring-2 focus:ring-cyan-400 outline-none transition"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Sertifikat dengan hover effect seperti Projects */}
        <AnimatePresence mode="wait">
          {currentCertificates.length > 0 ? (
            <m.div
              key={currentPage}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              {currentCertificates.map((cert) => (
                <m.div
                  key={cert.id}
                  layout
                  className="relative group bg-white/10 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={cert.image || "/placeholder.jpg"}
                    alt={cert.title}
                    loading="lazy"
                    onClick={() => setSelected(cert)}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[25%]"
                  />

                  {/* Label seperti Projects */}
                  {cert.tags?.[0] && (
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium border rounded-full ${
                        tagColors[cert.tags[0]] ||
                        "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                      }`}
                    >
                      {cert.tags[0]}
                    </span>
                  )}

                  {/* Rating stars seperti Projects */}
                  {cert.rating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md">
                      {renderStars(cert.rating)}
                    </div>
                  )}

                  {/* Verified badge */}
                  {cert.verified && (
                    <div className="absolute top-12 right-4 flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md text-xs">
                      <ShieldCheck size={12} />
                      Verified
                    </div>
                  )}

                  {/* Hover Overlay seperti Projects */}
                  <div
                    onClick={() => setSelected(cert)}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6"
                  >
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-1">
                      {cert.issuer} · {cert.year}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={14} className="text-cyan-400" />
                      <span className="text-xs text-gray-300">{cert.duration}</span>
                    </div>
                  </div>
                </m.div>
              ))}
            </m.div>
          ) : (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-20 flex flex-col items-center"
            >
              <Sparkles className="w-10 h-10 text-cyan-400 mb-2" />
              <p>Tidak ada hasil yang cocok 😢</p>
              <p className="text-sm text-gray-500">
                Coba ketik kata lain atau pilih kategori "All".
              </p>
            </m.div>
          )}
        </AnimatePresence>

        {/* 🔢 Pagination seperti Projects */}
        {totalPages > 1 && (
          <m.div
            className="flex flex-wrap justify-center items-center gap-2 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getVisiblePages().map((page) => (
              <m.button
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
              </m.button>
            ))}
          </m.div>
        )}

        {/* Enhanced Modal Detail dengan Skills, Projects, dan Testimonials Terkait */}
        <AnimatePresence>
          {selected && (
            <>
              <m.div
                className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePopup}
              />
              <m.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div 
                  className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-[95vw] max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col relative"
                  style={{
                    borderColor: selected.themeColor,
                    boxShadow: `0 0 40px -5px ${selected.themeColor || '#22d3ee'}60`,
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-10 bg-black/40 rounded-full p-2 hover:bg-black/60 transition text-gray-300 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  {/* Content Container - Lebar ke samping */}
                  <div className="flex flex-col xl:flex-row max-h-[90vh]">
                    {/* Left Column - Certificate Image (Lebar 40%) */}
                    <div className="xl:w-2/5 p-6 flex flex-col">
                      <img
                        src={selected.image || "/placeholder.jpg"}
                        alt={selected.title}
                        className="w-full h-64 xl:h-80 object-cover rounded-xl mb-4 flex-shrink-0"
                      />
                      
                      <div className="flex-1 overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {selected.title}
                        </h2>
                        <p className="text-cyan-300 text-sm mb-4">
                          {selected.issuer} · {selected.year}
                        </p>

                        <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
                          <Clock size={16} className="text-cyan-400" />
                          <span>{selected.duration}</span>
                          <span>•</span>
                          <span className="capitalize">{selected.difficulty}</span>
                          {selected.verified && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 flex items-center gap-1">
                                <ShieldCheck size={16} /> Verified
                              </span>
                            </>
                          )}
                        </div>

                        {selected.rating && (
                          <div className="flex items-center gap-2 mb-4">
                            {renderStars(selected.rating)}
                            <span className="text-sm text-gray-400">
                              ({selected.rating})
                            </span>
                          </div>
                        )}

                        <p className="text-gray-200 leading-relaxed mb-4">
                          {selected.description || "Tidak ada deskripsi."}
                        </p>

                        <div className="flex gap-2 flex-wrap mb-6">
                          {selected.tags?.map((tag, i) => (
                            <span
                              key={`${tag}-${selected.id}-${i}`}
                              className={`px-3 py-1 text-xs rounded-full border border-white/10 ${
                                tagColors[(i + selected.id) % tagColors.length] || 
                                "bg-cyan-500/20 text-cyan-300"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={selected.urlCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all rounded-xl py-3 font-semibold text-white text-center flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={18} />
                          Lihat Sertifikat Lengkap
                        </a>
                      </div>
                    </div>

                    {/* Right Column - Related Skills, Projects & Testimonials (Lebar 60%) */}
                    <div className="xl:w-3/5 bg-[#0f172a] p-6 flex flex-col">
                      <div className="flex-1 overflow-y-auto">
                        {/* Related Skills Section */}
                        {relatedSkills.length > 0 ? (
                          <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                              <Zap className="w-5 h-5 text-amber-400" />
                              <h3 className="text-lg font-bold text-white">Skills Terkait</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {relatedSkills.map((skill) => (
                                skill?.id && skill?.name && (
                                  <m.div
                                    key={skill.id}
                                    className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-cyan-400/30"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleSkillClick(skill.id)}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <Code className="w-4 h-4 text-cyan-400" />
                                      <span className="text-sm font-medium text-white line-clamp-1">
                                        {skill.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-400">
                                        {skill.level || "Mahir"}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                                    </div>
                                  </m.div>
                                )
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-8 text-center text-gray-400 py-4">
                            <Code className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm">Tidak ada skills terkait yang ditemukan</p>
                          </div>
                        )}

                        {/* Related Projects Section */}
                        {relatedProjects.length > 0 ? (
                          <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                              <Rocket className="w-5 h-5 text-purple-400" />
                              <h3 className="text-lg font-bold text-white">Proyek Terkait</h3>
                            </div>
                            <div className="space-y-3">
                              {relatedProjects.map((project) => (
                                project?.id && project?.title && (
                                  <m.div
                                    key={project.id}
                                    className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-purple-400/30"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleProjectClick(project.id)}
                                  >
                                    <div className="flex items-start gap-3">
                                      <img
                                        src={project.image || "/placeholder.jpg"}
                                        alt={project.title}
                                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-white line-clamp-1">
                                          {project.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                          {project.overview || project.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="text-xs text-cyan-400">
                                            {project.category || "Web App"}
                                          </span>
                                          <ArrowRight className="w-3 h-3 text-purple-400" />
                                        </div>
                                      </div>
                                    </div>
                                  </m.div>
                                )
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-8 text-center text-gray-400 py-4">
                            <Rocket className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm">Tidak ada proyek terkait yang ditemukan</p>
                          </div>
                        )}

                        {/* Related Testimonials Section */}
                        {relatedTestimonials.length > 0 ? (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <MessageCircle className="w-5 h-5 text-green-400" />
                              <h3 className="text-lg font-bold text-white">Testimoni Terkait</h3>
                            </div>
                            <div className="space-y-3">
                              {relatedTestimonials.map((testimonial) => (
                                testimonial?.id && testimonial?.text && (
                                  <m.div
                                    key={testimonial.id}
                                    className="bg-white/5 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all border border-white/5 hover:border-green-400/30"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleTestimonialClick(testimonial.id)}
                                  >
                                    <p className="text-sm text-gray-200 line-clamp-3">"{testimonial.text}"</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <img
                                        src={testimonial.image || "/placeholder.jpg"}
                                        alt={testimonial.name}
                                        className="w-6 h-6 rounded-full"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <span className="text-xs text-cyan-400 block">{testimonial.name}</span>
                                        <span className="text-xs text-gray-500 block">{testimonial.role}</span>
                                      </div>
                                      {testimonial.rating && (
                                        <div className="flex items-center gap-1">
                                          {renderStars(testimonial.rating)}
                                        </div>
                                      )}
                                      <ArrowRight className="w-3 h-3 text-green-400" />
                                    </div>
                                  </m.div>
                                )
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-4">
                            <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm">Tidak ada testimoni terkait yang ditemukan</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}