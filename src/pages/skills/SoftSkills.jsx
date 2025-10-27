import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SoftSkillsHeader from "./components/SoftSkillsHeader";
import SoftSkillsSearch from "./components/SoftSkillsSearch";
import SoftSkillsCardGrid from "./components/SoftSkillsCardGrid";
import SoftSkillsPopup from "./components/SoftSkillsPopup";
import { highlightText } from "./components/SoftSkillsUtils";

export default function SoftSkills() {
  const [skillsData, setSkillsData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [placeholderText, setPlaceholderText] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const searchRef = useRef(null);

  // ✨ Animasi placeholder (Typewriter)
  useEffect(() => {
    const phrases = [
      "Cari skill...",
      "Cari kemampuan komunikasi...",
      "Cari kreativitas...",
      "Cari teamwork...",
      "Cari kepemimpinan...",
    ];

    let currentPhrase = 0;
    let currentChar = 0;
    let deleting = false;
    let timeout;

    const type = () => {
      const fullText = phrases[currentPhrase];

      if (!deleting) {
        setPlaceholderText(fullText.slice(0, currentChar + 1));
        currentChar++;
        if (currentChar === fullText.length) {
          deleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
      } else {
        setPlaceholderText(fullText.slice(0, currentChar - 1));
        currentChar--;
        if (currentChar === 0) {
          deleting = false;
          currentPhrase = (currentPhrase + 1) % phrases.length;
        }
      }
      timeout = setTimeout(type, deleting ? 40 : 80);
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  // 🧭 Keyboard Shortcut: Ctrl+F / Cmd+F untuk fokus ke search bar
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // 🔹 Ambil data JSON
  useEffect(() => {
    fetch("/data/about/softskills.json")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat softskills.json");
        return res.json();
      })
      .then((data) => setSkillsData(data))
      .catch((err) => console.error("❌ Gagal ambil data skill:", err));
  }, []);

  // 🔹 Proses data skill
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

  // 🧭 Sinkronisasi popup
  useEffect(() => {
    if (!id || skills.length === 0) return;
    const found = skills.find((s) => s.id === id);
    setSelectedSkill(found || null);
  }, [id, skills]);

  // 🧩 Fuzzy search: cari di name, description, category, dan labels
  const filteredSkills = skills.filter((skill) => {
    const q = search.toLowerCase();
    const matchSearch =
      skill.name.toLowerCase().includes(q) ||
      skill.description?.toLowerCase().includes(q) ||
      skill.category?.toLowerCase().includes(q) ||
      skill.labels?.some((l) => l.toLowerCase().includes(q));
    const matchCategory =
      categoryFilter === "All" || skill.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // 🪄 Auto-suggestions mirip Chrome
  useEffect(() => {
    if (search.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const matched = skills
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
    setSuggestions(matched);
  }, [search, skills]);

  const handleSelectSuggestion = (text) => {
    setSearch(text);
    setSuggestions([]);
    if (!recentSearch.includes(text))
      setRecentSearch((prev) => [text, ...prev.slice(0, 4)]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSelectSuggestion(suggestions[activeSuggestion].name);
      } else {
        handleSelectSuggestion(search);
      }
    }
  };

  if (!skillsData)
    return (
      <div className="text-white text-center mt-20 animate-pulse">
        Loading data skill...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#111827] text-white flex flex-col items-center px-6 py-20">
      {/* 🌟 Header */}
      <SoftSkillsHeader title={skillsData.sectionTitle} />

      {/* 🔍 Search & Filter */}
      <SoftSkillsSearch
        searchRef={searchRef}
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        activeSuggestion={activeSuggestion}
        handleKeyDown={handleKeyDown}
        handleSelectSuggestion={handleSelectSuggestion}
        highlightText={highlightText}
        placeholderText={placeholderText}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {/* 💎 Skill Cards */}
      <SoftSkillsCardGrid
        filteredSkills={filteredSkills}
        search={search}
        highlightText={highlightText}
        navigate={navigate}
      />

      {/* 🪄 Popup Detail */}
      <SoftSkillsPopup
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        navigate={navigate}
      />
    </main>
  );
}
