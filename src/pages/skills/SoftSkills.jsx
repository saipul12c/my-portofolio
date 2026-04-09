// SoftSkills.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SoftSkillsHeader from "./components/SoftSkillsHeader";
import SoftSkillsSearch from "./components/SoftSkillsSearch";
import SoftSkillsCardGrid from "./components/SoftSkillsCardGrid";
import SoftSkillsPopup from "./components/SoftSkillsPopup";
import SoftSkillsAI from "./AI/SoftSkillsAI";
import { highlightText } from "./components/SoftSkillsUtils";

/**
 * Parent component:
 * - Memuat softskills.json
 * - Memproses daftar skills (labels, colors, gradients)
 * - Menyimpan filteredSkills yang dikirim dari SoftSkillsSearch via onFilterChange
 * - Menangani popup berdasarkan route param id
 * - Menangani fitur Tanya AI
 */
export default function SoftSkills() {
  const [skillsData, setSkillsData] = useState(null);
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

  // ✅ Fetch JSON - aman untuk Vite & CRA
  useEffect(() => {
    let mounted = true;

    // Vite pakai import.meta.env.BASE_URL
    const publicBase =
      (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "";

    const tryPaths = [
      `${publicBase}data/about/softskills.json`,
      "/data/about/softskills.json",
      "/about/softskills.json",
      "/softskills.json",
      "./data/about/softskills.json",
    ];

    const fetchSequential = async () => {
      // Prioritaskan path yang paling mungkin berhasil di environment Vite
      const optimizedPaths = [
        `${publicBase}data/about/softskills.json`,
        "/data/about/softskills.json",
        "./data/about/softskills.json",
      ];

      for (const p of optimizedPaths) {
        try {
          const res = await fetch(p);
          if (!res.ok) continue;
          const data = await res.json();
          if (mounted) {
            setSkillsData(data);
            return;
          }
        } catch {
          continue;
        }
      }

      if (mounted) console.error("❌ Gagal memuat softskills.json");
    };

    fetchSequential();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Proses data skill (labels, colors, gradients) - dioptimasi dengan useMemo
  useEffect(() => {
    if (!skillsData || !Array.isArray(skillsData.skills)) return;

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
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-gray-900)] to-[var(--color-gray-800)] text-white flex flex-col items-center px-6 py-20">
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