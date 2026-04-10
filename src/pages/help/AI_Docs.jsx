/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { CHATBOT_VERSION, DEFAULT_SETTINGS } from "../../components/helpbutton/chat/config";
import aiDocData from '../../data/AIDoc/data.json';
import historyData from '../../data/AIDoc/riwayat/riwayat.json';
import VersionDetail from './ai/AI_DocDetail';
import { Link, useParams } from 'react-router-dom';
import { 
  FaBook, 
  FaHistory, 
  FaChartLine, 
  FaCode, 
  FaCogs, 
  FaQuestionCircle, 
  FaShieldAlt,
  FaLightbulb,
  FaDatabase,
  FaTools,
  FaExclamationTriangle,
  FaRocket,
  FaGraduationCap,
  FaDownload,
  FaArrowLeft,
  FaEye,
  FaExternalLinkAlt
} from "react-icons/fa";
import { 
  SiReact, 
  SiJavascript, 
  SiJson,
  SiTailwindcss
} from "react-icons/si";

import Overview from "./components/ai-docs/Overview/Overview";
import Changelog from "./components/ai-docs/Changelog/Changelog";
import Versions from "./components/ai-docs/Versions/Versions";
import Stats from "./components/ai-docs/Stats/Stats";
import Issues from "./components/ai-docs/Issues/Issues";
import Features from "./components/ai-docs/Features/Features";
import NLPAdvancements from "./components/ai-docs/NLPAdvancements/NLPAdvancements";
import KnowledgeBase from "./components/ai-docs/KnowledgeBase/KnowledgeBase";
import Config from "./components/ai-docs/Config/Config";
import Examples from "./components/ai-docs/Examples/Examples";
import Troubleshooting from "./components/ai-docs/Troubleshooting/Troubleshooting";
import ExperimentalResearch from "./components/ai-docs/ExperimentalResearch/ExperimentalResearch";
import Privacy from "./components/ai-docs/Privacy/Privacy";
import Contribution from "./components/ai-docs/Contribution/Contribution";

// Komponen untuk menampilkan konten berdasarkan section aktif
const SectionContent = ({ activeSection, showAllVersions, showRawJson, aiDocData, versionStats, historyData }) => {
  const sections = {
    "overview": <Overview versionStats={versionStats} />,
    "changelog": <Changelog aiDocData={aiDocData} />,
    "versions": <Versions historyData={historyData} aiDocData={aiDocData} showAllVersions={showAllVersions} showRawJson={showRawJson} />,
    "stats": <Stats aiDocData={aiDocData} versionStats={versionStats} />,
    "issues": <Issues />,
    "features": <Features aiDocData={aiDocData} />,
    "nlp-advancements": <NLPAdvancements aiDocData={aiDocData} />,
    "knowledge-base": <KnowledgeBase aiDocData={aiDocData} />,
    "config": <Config />,
    "examples": <Examples aiDocData={aiDocData} />,
    "troubleshooting": <Troubleshooting aiDocData={aiDocData} />,
    "experimental-research": <ExperimentalResearch aiDocData={aiDocData} />,
    "privacy": <Privacy aiDocData={aiDocData} />,
    "contribution": <Contribution aiDocData={aiDocData} />
  };

  return sections[activeSection] || sections["overview"];
};

export default function AI_Docs() {
  const [activeSection, setActiveSection] = React.useState("overview");
  const [showAllVersions] = React.useState(false);
  const [showRawJson] = React.useState(false);
  const { version } = useParams();
  
  // Jika ada parameter versi di URL, arahkan ke section versions
  React.useEffect(() => {
    if (version) {
      setActiveSection("versions");
    }
  }, [version]);

  const versionStats = [
    { label: "Total Fitur", value: aiDocData?.statistik_versi_saat_ini?.total_fitur ?? "-", icon: <FaRocket className="text-blue-400" /> },
    { label: "Knowledge Base", value: aiDocData?.statistik_versi_saat_ini?.knowledge_base_files ?? "-", icon: <FaDatabase className="text-green-400" /> },
    { label: "Ukuran Bundle", value: aiDocData?.statistik_versi_saat_ini?.ukuran_bundle ?? "-", icon: <SiReact className="text-purple-400" /> },
    { label: "Waktu Respons", value: aiDocData?.statistik_versi_saat_ini?.waktu_respons ?? "-", icon: <FaChartLine className="text-yellow-400" /> },
  ];

  const techStack = [
    { name: "React", icon: <SiReact />, color: "text-cyan-400" },
    { name: "JavaScript", icon: <SiJavascript />, color: "text-yellow-400" },
    { name: "JSON", icon: <SiJson />, color: "text-green-400" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-teal-400" },
  ];

  // Navigasi sidebar items
  const navItems = [
    { id: "overview", label: "Ringkasan", icon: <FaBook /> },
    { id: "changelog", label: "Riwayat Perubahan", icon: <FaHistory /> },
    { id: "versions", label: "Riwayat Versi", icon: <FaCode /> },
    { id: "stats", label: "Statistik Versi", icon: <FaChartLine /> },
    { id: "issues", label: "Masalah & Perbaikan", icon: <FaExclamationTriangle /> },
    { id: "features", label: "Fitur Utama", icon: <FaLightbulb /> },
    { id: "nlp-advancements", label: "Peningkatan NLP", icon: <FaRocket /> },
    { id: "knowledge-base", label: "Sumber Data", icon: <FaDatabase /> },
    { id: "config", label: "Pengaturan", icon: <FaCogs /> },
    { id: "examples", label: "Contoh Penggunaan", icon: <FaGraduationCap /> },
    { id: "troubleshooting", label: "Troubleshooting", icon: <FaTools /> },
    { id: "experimental-research", label: "Riset Eksperimental", icon: <FaQuestionCircle /> },
    { id: "privacy", label: "Privasi & Keamanan", icon: <FaShieldAlt /> },
    { id: "contribution", label: "Cara Kontribusi", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      {/* Header dengan gradient */}
      <header className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <FaBook className="text-xl" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {aiDocData?.header_information?.title ?? 'SaipulAI — Dokumentasi & Panduan'}
                </h1>
              </div>
              <p className="text-gray-300 text-sm sm:text-base max-w-3xl">
                {aiDocData?.ringkasan_singkat ?? 'Dokumentasi lengkap untuk sistem chatbot AI dengan knowledge base lokal, kalkulator matematika canggih, dan berbagai fitur utilitas.'}
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Versi Saat Ini</span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-xs font-semibold">
                  STABLE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaDownload className="text-blue-400" />
                <code className="text-xl font-bold">{CHATBOT_VERSION}</code>
              </div>
              <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
                <FaCode className="text-gray-500" />
                <code className="bg-gray-900 px-2 py-1 rounded">src/components/helpbutton/chat/config.js</code>
              </div>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 ${tech.color}`}
              >
                {tech.icon}
                <span className="text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid utama */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigasi */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-8 space-y-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
                <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <FaBook className="text-blue-400" />
                  Navigasi Dokumen
                </h3>
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-l-4 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Back to main help */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-4">
                <Link 
                  to="/help" 
                  className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 px-3 py-2 rounded-lg transition-all"
                >
                  <FaArrowLeft className="text-sm" />
                  Kembali ke Menu Bantuan
                </Link>
              </div>
            </nav>
          </aside>

          {/* Konten utama */}
          <main className="lg:col-span-3">
            <SectionContent 
              activeSection={activeSection}
              showAllVersions={showAllVersions}
              showRawJson={showRawJson}
              aiDocData={aiDocData}
              versionStats={versionStats}
              historyData={historyData}
            />
          </main>
        </div>
      </div>
    </div>
  );
}