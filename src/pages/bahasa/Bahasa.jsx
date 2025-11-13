import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dataBahasa from "../../data/bahasa/data.json";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, Target, Sparkles, Zap, Code, Globe, ArrowUp, X } from "lucide-react";

// Fungsi untuk generate warna acak yang konsisten berdasarkan string
const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
    { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
    { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
    { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
    { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
    { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
    { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
    { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

const Bahasa = () => {
  const { bahasaSehariHari, bahasaPemrograman } = dataBahasa;
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [expandedTags, setExpandedTags] = useState({});
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  // Optimized filtering dengan useMemo
  const filteredData = useMemo(() => {
    const filterCondition = (bahasa) => {
      const matchesSearch = bahasa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bahasa.tingkat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (bahasa.kemampuan && bahasa.kemampuan.some(skill => 
                             skill.toLowerCase().includes(searchTerm.toLowerCase())
                           ));
      const matchesLevel = 
        filterLevel === "all" ||
        (filterLevel === "beginner" && bahasa.level < 70) ||
        (filterLevel === "intermediate" && bahasa.level >= 70 && bahasa.level < 85) ||
        (filterLevel === "advanced" && bahasa.level >= 85);
      
      return matchesSearch && matchesLevel;
    };

    return {
      sehariHari: bahasaSehariHari.filter(filterCondition),
      pemrograman: bahasaPemrograman.filter(filterCondition)
    };
  }, [bahasaSehariHari, bahasaPemrograman, searchTerm, filterLevel]);

  // Scroll handling yang dioptimalkan
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Toggle expanded tags
  const toggleExpandedTags = useCallback((skillId) => {
    setExpandedTags(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  }, []);

  // Animation variants yang lebih ringan
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 15,
        duration: 0.5
      }
    }
  };

  // Optimized Progress Bar Component
  const ProgressBar = React.memo(({ level, showLabel = true }) => {
    const [animatedLevel, setAnimatedLevel] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => setAnimatedLevel(level), 200);
      return () => clearTimeout(timer);
    }, [level]);

    const getColorClass = (level) => {
      if (level >= 90) return "from-emerald-500 to-green-500";
      if (level >= 80) return "from-cyan-500 to-blue-500";
      if (level >= 70) return "from-amber-500 to-orange-500";
      if (level >= 60) return "from-orange-500 to-red-500";
      return "from-gray-500 to-gray-700";
    };

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between text-sm text-cyan-300 mb-2">
            <span>Kemahiran</span>
            <span className="font-bold">{level}%</span>
          </div>
        )}
        <div className="w-full bg-gray-700/30 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
          <motion.div 
            className={`h-2.5 rounded-full bg-gradient-to-r ${getColorClass(level)} shadow-lg`}
            initial={{ width: 0 }}
            animate={{ width: `${animatedLevel}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      </div>
    );
  });

  // Search and Filter Component
  const SearchFilterBar = React.memo(() => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-cyan-500/20 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Cari bahasa, teknologi, atau kemampuan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#0f172a]/70 border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0f172a]/70 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 text-sm sm:text-base min-w-[140px]"
          >
            <option value="all">Semua Level</option>
            <option value="beginner">Pemula (0-69%)</option>
            <option value="intermediate">Menengah (70-84%)</option>
            <option value="advanced">Lanjutan (85-100%)</option>
          </select>

          <div className="flex bg-[#0f172a]/70 rounded-xl border border-cyan-500/30 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base ${
                viewMode === "grid" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base ${
                viewMode === "list" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              List
            </button>
          </div>

          {(searchTerm || filterLevel !== "all") && (
            <button
              onClick={() => { setSearchTerm(""); setFilterLevel("all"); }}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm sm:text-base"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-3 sm:mt-4 text-center overflow-hidden"
      >
        <p className="text-cyan-300 text-xs sm:text-sm">
          Menampilkan {filteredData.sehariHari.length + filteredData.pemrograman.length} dari {bahasaSehariHari.length + bahasaPemrograman.length} item
          {searchTerm && ` untuk "${searchTerm}"`}
        </p>
      </motion.div>
    </motion.div>
  ));

  // Skill Tags Component yang dapat di-expand
  const SkillTags = React.memo(({ skills, skillId }) => {
    const isExpanded = expandedTags[skillId] || false;
    const displaySkills = isExpanded ? skills : (skills || []).slice(0, 4);
    const hiddenCount = (skills || []).length - 4;

    if (!skills || skills.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
        {displaySkills.map((skill, index) => {
          const color = generateColor(skill);
          return (
            <motion.span 
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${color.bg} ${color.text} ${color.border} text-xs px-2 py-1 rounded-lg border backdrop-blur-sm whitespace-nowrap`}
            >
              {skill}
            </motion.span>
          );
        })}
        {!isExpanded && hiddenCount > 0 && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandedTags(skillId);
            }}
            className="bg-gray-500/20 text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-500/30 hover:bg-gray-500/30 transition-all duration-200 backdrop-blur-sm"
          >
            +{hiddenCount}
          </motion.button>
        )}
      </div>
    );
  });

  // Skill Card Components
  const SkillCard = React.memo(({ bahasa, isProgramming = false, delay = 0, isList = false }) => {
    const skillId = `${bahasa.nama}-${isProgramming ? 'prog' : 'lang'}`;

    const CardContent = () => (
      <>
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <motion.div 
              className="text-2xl sm:text-3xl p-2 sm:p-3 bg-cyan-500/10 rounded-xl sm:rounded-2xl group-hover:bg-cyan-500/20 transition-colors duration-300 flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              {bahasa.icon}
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-lg sm:text-xl leading-tight truncate">{bahasa.nama}</h3>
              <p className="text-cyan-300 font-medium mt-0.5 sm:mt-1 text-sm truncate">{bahasa.tingkat}</p>
            </div>
          </div>
          
          <motion.span 
            className={`
              px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex-shrink-0 ml-2
              ${bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 
                bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 
                bahasa.level >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 
                'bg-gradient-to-r from-orange-500 to-red-500 text-white'}
            `}
            whileHover={{ scale: 1.05 }}
          >
            {bahasa.level}%
          </motion.span>
        </div>

        <ProgressBar level={bahasa.level} showLabel={false} />

        <SkillTags skills={bahasa.kemampuan} skillId={skillId} />

        <motion.div 
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
            <span className="hidden sm:inline">Detail</span>
            <span>→</span>
          </div>
        </motion.div>
      </>
    );

    const ListContent = () => (
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
          <motion.div 
            className="text-2xl p-2 bg-cyan-500/10 rounded-xl flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            {bahasa.icon}
          </motion.div>
          
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-1">
              <h3 className="font-bold text-white text-lg truncate">{bahasa.nama}</h3>
              <span className="text-cyan-300 text-sm font-medium whitespace-nowrap">{bahasa.tingkat}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 max-w-full sm:max-w-xs">
                <ProgressBar level={bahasa.level} showLabel={false} />
              </div>
              <span className={`
                px-2 py-1 rounded-full text-xs font-bold self-start sm:self-auto
                ${bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 
                  bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}
              `}>
                {bahasa.level}%
              </span>
            </div>

            <SkillTags skills={bahasa.kemampuan} skillId={skillId} />
          </div>
        </div>

        <motion.div 
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2 sm:ml-4 flex-shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full">
            <span className="hidden sm:inline">Detail</span>
            <span className="sm:hidden">→</span>
          </div>
        </motion.div>
      </div>
    );

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ 
          y: isList ? 0 : -4,
          scale: isList ? 1 : 1.01,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ scale: 0.99 }}
        className={`
          group relative bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 backdrop-blur-lg 
          rounded-2xl sm:rounded-3xl border border-cyan-500/20 cursor-pointer overflow-hidden
          hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300
          ${isList ? "p-4 sm:p-6" : "p-4 sm:p-6 shadow-lg"}
        `}
        onClick={() => setSelectedSkill({...bahasa, isProgramming})}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          {isList ? <ListContent /> : <CardContent />}
        </div>
      </motion.div>
    );
  });

  // Optimized Detail Modal yang lebih lebar
  const DetailTooltip = React.memo(({ bahasa, isProgramming, onClose }) => {
    const renderSection = (title, icon, content, color = "cyan", isArray = true) => {
      if (!content || (Array.isArray(content) && content.length === 0)) return null;
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <h4 className={`font-semibold text-${color}-300 flex items-center text-sm sm:text-base`}>
            {icon}
            <span className="ml-2">{title}</span>
          </h4>
          {isArray && Array.isArray(content) ? (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {content.map((item, idx) => {
                const colorClass = generateColor(item);
                return (
                  <span 
                    key={idx}
                    className={`${colorClass.bg} ${colorClass.text} ${colorClass.border} text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm`}
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{content}</p>
          )}
        </motion.div>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-500/40 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 sm:p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
            <button 
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-cyan-300 hover:text-white text-lg sm:text-xl transition-all duration-200 hover:scale-110 bg-cyan-500/10 p-1.5 sm:p-2 rounded-lg"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="flex items-center space-x-3 sm:space-x-4 pr-10 sm:pr-12">
              <motion.div 
                className="text-3xl sm:text-4xl p-2 sm:p-3 bg-cyan-500/10 rounded-xl sm:rounded-2xl"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                {bahasa.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-xl sm:text-2xl truncate">{bahasa.nama}</h3>
                <p className="text-cyan-300 font-medium text-sm sm:text-base truncate">{bahasa.tingkat}</p>
              </div>
              <motion.span 
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-bold shadow-lg flex-shrink-0
                  ${bahasa.level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 
                    bahasa.level >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 
                    'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}
                `}
              >
                {bahasa.level}%
              </motion.span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-4 sm:space-y-6">
              {/* Progress */}
              <div className="space-y-3">
                <h4 className="font-semibold text-cyan-300 flex items-center text-sm sm:text-base">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="ml-2">Tingkat Kemahiran</span>
                </h4>
                <ProgressBar level={bahasa.level} />
              </div>

              {/* Description */}
              {bahasa.deskripsi && renderSection("Deskripsi", <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.deskripsi, "cyan", false)}

              {/* Skills */}
              {bahasa.kemampuan && renderSection("Kemampuan", <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.kemampuan, "cyan")}

              {/* Programming-specific sections */}
              {isProgramming && (
                <>
                  {bahasa.framework && renderSection("Framework & Tools", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.framework, "blue")}
                  {bahasa.libraries && renderSection("Libraries", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.libraries, "purple")}
                  {bahasa.ecosystem && renderSection("Ecosystem", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.ecosystem, "green")}
                  {bahasa.tools && renderSection("Tools", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.tools, "orange")}
                  {bahasa.variasi && renderSection("Database Variants", <Code className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.variasi, "teal")}
                </>
              )}

              {/* Experience */}
              {bahasa.pengalaman && renderSection("Pengalaman", <Globe className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.pengalaman, "cyan", false)}

              {/* Additional Details */}
              {bahasa.detailTambahan && Object.entries(bahasa.detailTambahan).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <h4 className="font-semibold text-cyan-300 text-sm sm:text-base capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{value}</p>
                </motion.div>
              ))}

              {/* Certification */}
              {bahasa.sertifikasi && (
                typeof bahasa.sertifikasi === 'object' ? 
                renderSection("Sertifikasi", <Target className="w-4 h-4 sm:w-5 sm:h-5" />, `${bahasa.sertifikasi.nama}: ${bahasa.sertifikasi.score} (${bahasa.sertifikasi.equivalent})`, "cyan", false) :
                renderSection("Sertifikasi", <Target className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.sertifikasi, "cyan", false)
              )}

              {/* Learning Goals */}
              {bahasa.target && renderSection("Target Belajar", <Target className="w-4 h-4 sm:w-5 sm:h-5" />, bahasa.target, "cyan", false)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  });

  // Quick Stats Component
  const QuickStats = React.memo(() => {
    const stats = [
      { 
        label: "Total Bahasa", 
        value: bahasaSehariHari.length + bahasaPemrograman.length,
        icon: "🌐",
        color: "from-cyan-400 to-blue-500"
      },
      { 
        label: "Kemahiran Rata-rata", 
        value: `${Math.round([...bahasaSehariHari, ...bahasaPemrograman].reduce((acc, b) => acc + b.level, 0) / (bahasaSehariHari.length + bahasaPemrograman.length))}%`,
        icon: "📊",
        color: "from-green-400 to-cyan-500"
      },
      { 
        label: "Teknologi", 
        value: bahasaPemrograman.length,
        icon: "💻",
        color: "from-purple-400 to-pink-500"
      },
      { 
        label: "Bahasa Komunikasi", 
        value: bahasaSehariHari.length,
        icon: "🗣️",
        color: "from-orange-400 to-red-500"
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cyan-500/20 text-center"
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
            <div className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-cyan-300 text-xs sm:text-sm mt-0.5 sm:mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    );
  });

  // Section Component
  const LanguageSection = React.memo(({ title, data, icon, isProgramming = false }) => {
    if (data.length === 0 && !searchTerm && filterLevel === "all") return null;

    return (
      <section className="space-y-4 sm:space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 sm:space-x-3"
        >
          <div className="text-2xl sm:text-3xl">{icon}</div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h2>
            <p className="text-cyan-300 text-sm sm:text-base">
              {data.length} dari {isProgramming ? bahasaPemrograman.length : bahasaSehariHari.length} item ditampilkan
            </p>
          </div>
        </motion.div>
        
        <div className={viewMode === "grid" ? 
          "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" : 
          "space-y-2 sm:space-y-3"
        }>
          {data.map((item, index) => (
            <SkillCard 
              key={`${item.nama}-${index}`}
              bahasa={item}
              isProgramming={isProgramming}
              delay={index * 50}
              isList={viewMode === "list"}
            />
          ))}
        </div>

        {data.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="text-cyan-300 text-lg">Tidak ada item yang sesuai dengan filter</div>
          </motion.div>
        )}
      </section>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] py-4 sm:py-8 px-3 sm:px-4 relative overflow-hidden">
      {/* Optimized Background Elements */}
      <div className="absolute top-10 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto relative z-10" ref={sectionRef}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-block mb-4 sm:mb-6"
          >

          </motion.div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-6">
            Kemampuan Bahasa & Teknologi
          </h1>
          <p className="text-cyan-300 text-sm sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-light px-2">
            Jelajahi berbagai bahasa dan teknologi yang saya kuasai, dari komunikasi sehari-hari 
            hingga stack pengembangan software modern dengan pengalaman nyata
          </p>
        </motion.div>

        <QuickStats />
        <SearchFilterBar />

        {/* Main Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-8 sm:space-y-12"
        >
          <LanguageSection 
            title="Bahasa Sehari-hari"
            data={filteredData.sehariHari}
            icon="🌍"
            isProgramming={false}
          />

          <LanguageSection 
            title="Teknologi & Pemrograman"
            data={filteredData.pemrograman}
            icon="💻"
            isProgramming={true}
          />
        </motion.div>

        {/* Empty State */}
        {filteredData.sehariHari.length === 0 && filteredData.pemrograman.length === 0 && 
         (searchTerm || filterLevel !== "all") && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Tidak ada hasil</h3>
            <p className="text-cyan-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Tidak ada item yang sesuai dengan pencarian dan filter Anda
            </p>
            <button
              onClick={() => { setSearchTerm(""); setFilterLevel("all"); }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            >
              Tampilkan Semua
            </button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Siap Berkolaborasi?</h3>
            <p className="text-cyan-300 text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
              Dengan beragam kemampuan bahasa dan teknologi, saya siap membantu mewujudkan 
              ide kreatif Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button 
                onClick={() => (window.location.href = "/contact")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                ✨ Hubungi Saya
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2.5 sm:p-3 rounded-xl shadow-lg z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <DetailTooltip 
            bahasa={selectedSkill}
            isProgramming={selectedSkill.isProgramming}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
        
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Bahasa;