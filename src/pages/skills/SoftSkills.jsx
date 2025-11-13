// SoftSkills.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SoftSkillsHeader from "./components/SoftSkillsHeader";
import SoftSkillsSearch from "./components/SoftSkillsSearch";
import SoftSkillsCardGrid from "./components/SoftSkillsCardGrid";
import SoftSkillsPopup from "./components/SoftSkillsPopup";
import { highlightText } from "./components/SoftSkillsUtils";

/**
 * Parent component:
 * - Memuat softskills.json
 * - Memproses daftar skills (labels, colors, gradients)
 * - Menyimpan filteredSkills yang dikirim dari SoftSkillsSearch via onFilterChange
 * - Menangani popup berdasarkan route param id
 */
export default function SoftSkills() {
  const [skillsData, setSkillsData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

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
      for (const p of tryPaths) {
        try {
          const res = await fetch(p);
          if (!res.ok) continue;
          const data = await res.json();
          if (mounted) setSkillsData(data);
          return;
        } catch {
          continue;
        }
      }

      if (mounted) {
        console.error("❌ Gagal memuat softskills.json dari semua path percobaan");
        setSkillsData({ error: true, message: "Gagal memuat data skill." });
      }
    };

    fetchSequential();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Proses data skill (labels, colors, gradients)
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

        // Hanya tambahkan label "Baru" jika skill ditambahkan dalam 1 tahun terakhir
        if (skill.dateAdded) {
          const addedDate = new Date(skill.dateAdded);
          if (addedDate > oneYearAgo && !labels.includes("Baru"))
            labels.push("Baru");
        }

        // ❌ DIHAPUS: Penambahan label random "Populer" dan "Hot" yang berlebihan
        // ["Populer", "Hot"].forEach((label) => {
        //   if (!labels.includes(label) && Math.random() < 0.25) labels.push(label);
        // });

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

    // Urutkan berdasarkan jumlah label (yang punya label lebih banyak di atas)
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
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#111827] text-white flex flex-col items-center px-6 py-20">
      {/* Header */}
      <SoftSkillsHeader title={skillsData.sectionTitle} />

      {/* Search & Filter */}
      <SoftSkillsSearch
        skills={skills}
        onFilterChange={(newFilteredSkills, searchValue) => {
          setFilteredSkills(newFilteredSkills);
          setSearchKeyword(searchValue || "");
        }}
        highlightText={highlightText}
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