// SoftSkills.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import SoftSkillsHeader from "./components/SoftSkillsHeader";
import SoftSkillsSearch from "./components/SoftSkillsSearch";
import SoftSkillsCardGrid from "./components/SoftSkillsCardGrid";
import SoftSkillsPopup from "./components/SoftSkillsPopup";
import SoftSkillsAI from "./AI/SoftSkillsAI";
import { highlightText } from "./components/SoftSkillsUtils";
import fallbackSkillsData from "../../data/skills/softskills.json";

/**
 * Parent component:
 * - Memuat softskills.json
 * - Memproses daftar skills (labels, colors, gradients)
 * - Menyimpan filteredSkills yang dikirim dari SoftSkillsSearch via onFilterChange
 * - Menangani popup berdasarkan route param id
 * - Menangani fitur Tanya AI
 */
export default function SoftSkills() {
  const [skillsData, setSkillsData] = useState(fallbackSkillsData);
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  const handleOpenAI = (query = "") => {
    setAiQuery(query);
    setIsAIOpen(true);
  };

  // Memoize onFilterChange to prevent unnecessary re-renders in SoftSkillsSearch
  const handleFilterChange = useCallback((newFilteredSkills, searchValue) => {
    setFilteredSkills(newFilteredSkills);
    setSearchKeyword(searchValue || "");
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  // 🔹 Proses data skill (labels, colors, gradients) - dioptimasi dengan useMemo
  useEffect(() => {
    if (!skillsData || !Array.isArray(skillsData.skills)) return;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const colors = {
      label: [
        "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30",
        "bg-blue-500/20 text-blue-300 border border-blue-400/30",
        "bg-purple-500/20 text-purple-300 border border-purple-400/30",
        "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
        "bg-indigo-500/20 text-indigo-300 border border-indigo-400/30",
      ],
      level: [
        "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
        "bg-purple-500/20 text-purple-300 border border-purple-500/30",
        "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      ],
      card: [
        "from-slate-900/90 via-slate-800/80 to-cyan-950/40 hover:border-cyan-500/50 hover:shadow-cyan-500/10",
        "from-slate-900/90 via-slate-800/80 to-blue-950/40 hover:border-blue-500/50 hover:shadow-blue-500/10",
        "from-slate-900/90 via-slate-800/80 to-purple-950/40 hover:border-purple-500/50 hover:shadow-purple-500/10",
        "from-slate-900/90 via-slate-800/80 to-indigo-950/40 hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      ],
    };

    const processed = skillsData.skills
      .filter(
        (skill) =>
          skill &&
          typeof skill === "object" &&
          skill.name &&
          skill.category &&
          skill.level
      )
      .map((skill) => {
        const labels = [...(skill.labels || [])];

        if (skill.dateAdded) {
          const addedDate = new Date(skill.dateAdded);
          if (addedDate > oneYearAgo && !labels.includes("Baru"))
            labels.push("Baru");
        }

        const labelColorMap = {};
        labels.forEach((label) => {
          // Gunakan seed stabil (index id atau name) agar warna tidak acak setiap re-render
          const seed = (label.length + (skill.id || 0)) % colors.label.length;
          labelColorMap[label] = colors.label[seed];
        });

        const levelSeed = (skill.level.length + (skill.id || 0)) % colors.level.length;
        const cardSeed = ((skill.name?.length || 0) + (skill.id || 0)) % colors.card.length;

        return {
          ...skill,
          labels,
          labelColorMap,
          levelColor: colors.level[levelSeed],
          cardGradient: colors.card[cardSeed],
        };
      });

    processed.sort((a, b) => (b.labels?.length || 0) - (a.labels?.length || 0));

    setSkills(processed);
    setFilteredSkills(processed);
  }, [skillsData]);

  // 🧭 Sinkronisasi popup berdasarkan route id
  useEffect(() => {
    if (!id || skills.length === 0) {
      setSelectedSkill(null);
      return;
    }
    const found = skills.find((s) => String(s.id) === String(id));
    setSelectedSkill(found || null);
  }, [id, skills]);

  if (!skillsData)
    return (
      <div className="text-white text-center mt-20 animate-pulse">
        Loading data skill...
      </div>
    );

  if (skillsData.error)
    return (
      <div className="text-red-400 text-center mt-20">
        {skillsData.message || "Terjadi kesalahan saat memuat data skill."}
      </div>
    );

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col items-center px-6 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      <Helmet>
        <title>{skillsData.sectionTitle || "Soft Skills"} | Portofolio M. Syaiful Rahman</title>
        <meta
          name="description"
          content="Eksplorasi nilai profesional, kompetensi interpersonal, dan soft skills yang dimiliki oleh M. Syaiful Rahman."
        />
        <meta property="og:title" content={`${skillsData.sectionTitle || "Soft Skills"} | Portofolio M. Syaiful Rahman`} />
        <meta
          property="og:description"
          content="Eksplorasi nilai profesional, kompetensi interpersonal, dan soft skills yang dimiliki oleh M. Syaiful Rahman."
        />
      </Helmet>

      {/* Header */}
      <SoftSkillsHeader 
        title={skillsData.sectionTitle} 
      />

      {/* Search & Filter */}
      <SoftSkillsSearch
        skills={skills}
        onFilterChange={handleFilterChange}
        highlightText={highlightText}
        onOpenAI={handleOpenAI}
      />

      {/* Specialized AI Chat (Inline Results) */}
      <SoftSkillsAI 
        isOpen={isAIOpen}
        onClose={() => {
          setIsAIOpen(false);
          setAiQuery("");
        }}
        skills={skills}
        initialQuery={aiQuery}
      />

      {/* Skill Cards */}
      <SoftSkillsCardGrid
        filteredSkills={filteredSkills}
        search={searchKeyword}
        highlightText={highlightText}
        navigate={navigate}
      />

      {/* Popup Detail */}
      <SoftSkillsPopup
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        navigate={navigate}
      />

    </main>
  );
}