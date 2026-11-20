// SoftSkills.jsx
import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import SoftSkillsHeader from "./components/SoftSkillsHeader";
import SoftSkillsSearch from "./components/SoftSkillsSearch";
import SoftSkillsCardGrid from "./components/SoftSkillsCardGrid";
import SoftSkillsPopup from "./components/SoftSkillsPopup";
import fallbackSkillsData from "../../data/skills/softskills.json";

// Lazy load heavy AI module (NLP, Compromise, Sentiment, ReactMarkdown)
// This saves hundreds of kilobytes on initial page load!
const SoftSkillsAI = lazy(() => import("./AI/SoftSkillsAI"));

const COLOR_PALETTES = {
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

export default function SoftSkills() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Synchronous skill pre-processing with useMemo (deterministic, zero-delay on mount)
  const skills = useMemo(() => {
    if (!fallbackSkillsData || !Array.isArray(fallbackSkillsData.skills)) return [];

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const processed = fallbackSkillsData.skills
      .filter((skill) => skill && typeof skill === "object" && skill.name && skill.category && skill.level)
      .map((skill) => {
        const labels = [...(skill.labels || [])];

        if (skill.dateAdded) {
          const addedDate = new Date(skill.dateAdded);
          if (addedDate > oneYearAgo && !labels.includes("Baru")) {
            labels.push("Baru");
          }
        }

        const labelColorMap = {};
        labels.forEach((label) => {
          const seed = (label.length + (Number(skill.id) || 0)) % COLOR_PALETTES.label.length;
          labelColorMap[label] = COLOR_PALETTES.label[seed];
        });

        const levelSeed = (skill.level.length + (Number(skill.id) || 0)) % COLOR_PALETTES.level.length;
        const cardSeed = ((skill.name?.length || 0) + (Number(skill.id) || 0)) % COLOR_PALETTES.card.length;

        return {
          ...skill,
          labels,
          labelColorMap,
          levelColor: COLOR_PALETTES.level[levelSeed],
          cardGradient: COLOR_PALETTES.card[cardSeed],
        };
      });

    // Sort by label priority
    processed.sort((a, b) => (b.labels?.length || 0) - (a.labels?.length || 0));
    return processed;
  }, []);

  // Filter skills synchronously with useMemo (unidirectional, predictable data flow)
  const filteredSkills = useMemo(() => {
    const q = searchKeyword.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchSearch =
        !q ||
        (skill.name || "").toLowerCase().includes(q) ||
        (skill.description || "").toLowerCase().includes(q) ||
        (skill.category || "").toLowerCase().includes(q) ||
        (skill.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (skill.labels || []).some((l) => String(l).toLowerCase().includes(q));

      const matchCategory =
        selectedCategory === "All" ||
        (skill.category || "").toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [skills, searchKeyword, selectedCategory]);

  // Sync popup state when route param id changes
  useMemo(() => {
    if (!id || skills.length === 0) {
      if (selectedSkill !== null) setSelectedSkill(null);
      return;
    }
    const found = skills.find((s) => String(s.id) === String(id));
    setSelectedSkill(found || null);
  }, [id, skills]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenAI = useCallback((query = "") => {
    setAiQuery(query);
    setIsAIOpen(true);
  }, []);

  const handleCloseAI = useCallback(() => {
    setIsAIOpen(false);
    setAiQuery("");
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchKeyword(value || "");
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category || "All");
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col items-center px-4 sm:px-6 py-16 sm:py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <Helmet>
        <title>{fallbackSkillsData.sectionTitle || "Soft Skills"} | Portofolio Muhammad Syaiful Mukmin</title>
        <meta
          name="description"
          content="Eksplorasi nilai profesional, kompetensi interpersonal, dan soft skills yang dimiliki oleh Muhammad Syaiful Mukmin."
        />
        <meta
          property="og:title"
          content={`${fallbackSkillsData.sectionTitle || "Soft Skills"} | Portofolio Muhammad Syaiful Mukmin`}
        />
        <meta
          property="og:description"
          content="Eksplorasi nilai profesional, kompetensi interpersonal, dan soft skills yang dimiliki oleh Muhammad Syaiful Mukmin."
        />
      </Helmet>

      {/* Header */}
      <SoftSkillsHeader title={fallbackSkillsData.sectionTitle} />

      {/* Search & Filter */}
      <SoftSkillsSearch
        skills={skills}
        searchValue={searchKeyword}
        categoryValue={selectedCategory}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onOpenAI={handleOpenAI}
      />

      {/* Specialized AI Chat (Lazy-loaded with Suspense for optimal bundle performance) */}
      {isAIOpen && (
        <Suspense
          fallback={
            <div className="w-full max-w-5xl py-8 flex items-center justify-center text-cyan-400 bg-gray-900/40 rounded-3xl border border-cyan-500/20 mb-8">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-sm font-semibold">Menghubungkan Asisten AI...</span>
            </div>
          }
        >
          <SoftSkillsAI
            isOpen={isAIOpen}
            onClose={handleCloseAI}
            skills={skills}
            initialQuery={aiQuery}
          />
        </Suspense>
      )}

      {/* Skill Cards Grid */}
      <SoftSkillsCardGrid
        filteredSkills={filteredSkills}
        search={searchKeyword}
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
