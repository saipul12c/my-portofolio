import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Tag, 
  AlertCircle, 
  CheckCircle,
  Download,
  Clock,
  Package,
  ExternalLink,
  ChevronRight,
  Layers,
  Cpu,
  Smartphone,
  Globe,
  FileText,
  Code,
  Shield,
  Zap,
  GitBranch,
  Activity
} from "lucide-react";
import docsData from "../../docs/data/docsSections.json";
import { getDocBySlug, getLatestVersionInfo } from "../../docs/lib/versionUtils";
import PLANNED_VERSIONS from "../data/plannedVersions";

export default function HelpVersionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [version, setVersion] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const findVersion = () => {
      // 1) Cari di data dokumen menggunakan util awal
      let docVersion = getDocBySlug(docsData, slug);
      let candidates = [];

      // 2) Jika tidak ketemu, coba beberapa variasi slug: slug + '-' + version,
      //    atau versi dengan titik diganti strip (compatibility dengan perubahan slug)
      if (!docVersion) {
        for (const d of docsData) {
          const base = d.slug || (d.title ? d.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : null);
          if (!base) continue;

          const vRaw = d.version || '';
          const vWithV = vRaw.startsWith('v') ? vRaw : `v${vRaw}`;
          const vDash = vWithV.toLowerCase().replace(/\./g, '-');
          const candidateNames = [
            base,
            `${base}-${d.version}`,
            `${base}-${vWithV}`,
            `${base}-${d.version?.toLowerCase().replace(/\./g, '-')}`,
            `${base}-${vDash}`
          ];

          if (candidateNames.includes(slug) || base === slug) {
            candidates.push(d);
          }
        }
      }

      // Sertakan hasil dari util jika ada
      if (docVersion && !candidates.includes(docVersion)) candidates.push(docVersion);

      // Jika ada kandidat, pilih yang terbaik: prefer CURRENT -> terbaru lastUpdated -> versi terbesar
      if (candidates.length > 0) {
        if (candidates.length === 1) {
          docVersion = candidates[0];
        } else {
          const pickCurrent = candidates.find((c) => c.versionHistory?.some(h => String(h.status).toUpperCase() === 'CURRENT'));
          if (pickCurrent) {
            docVersion = pickCurrent;
          } else {
            const parseDate = (s) => {
              if (!s) return new Date(0);
              const d = new Date(s);
              return isNaN(d.getTime()) ? new Date(0) : d;
            };

            candidates.sort((a, b) => {
              const aDate = parseDate(a.lastUpdated || a.versionHistory?.[0]?.date);
              const bDate = parseDate(b.lastUpdated || b.versionHistory?.[0]?.date);
              if (aDate.getTime() !== bDate.getTime()) return bDate - aDate;

              const parseVer = (v) => (v || '').toString().replace(/^v/i, '').split(/[^0-9]+/).map(n => parseInt(n||0, 10));
              const av = parseVer(a.version);
              const bv = parseVer(b.version);
              for (let i = 0; i < Math.max(av.length, bv.length); i++) {
                const na = av[i] || 0;
                const nb = bv[i] || 0;
                if (na !== nb) return nb - na;
              }
              return 0;
            });

            docVersion = candidates[0];
          }
        }
      }

      if (docVersion) {
        const dv = docVersion;
        const normVer = dv.version && dv.version.startsWith('v') ? dv.version : `v${dv.version}`;
        const detailsArr = dv.details || (dv.subsections ? dv.subsections.map(s => {
          if (s.subtitle) return `${s.subtitle}${s.details ? ` — ${s.details}` : ''}`;
          if (s.tips) return s.tips;
          if (s.details) return s.details;
          return JSON.stringify(s);
        }) : []);

        setVersion({
          version: normVer,
          versionCode: dv.versionCode || dv.build || '',
          versionType: (dv.versionType || 'stable').toLowerCase(),
          releaseChannel: dv.releaseChannel || 'production',
          lastUpdated: dv.lastUpdated || dv.versionHistory?.[0]?.date || 'Belum ada data',
          title: dv.title || dv.description || '',
          slug: dv.slug || (dv.title ? dv.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : normVer.toLowerCase().replace(/\./g, '-')),
          author: dv.author || 'Tim Dokumentasi',
          status: dv.versionHistory?.[0]?.status || 'CURRENT',
          breakingChanges: dv.versionHistory?.[0]?.breakingChanges || false,
          migrationRequired: dv.versionHistory?.[0]?.migrationRequired || false,
          estimatedReadTime: dv.estimatedReadTime || dv.readTime || '',
          tags: dv.tags || [],
          details: detailsArr,
          content: dv.content || dv.description || '',
          changelog: dv.changelog || [],
          changelogSummary: dv.changelog?.[0]?.changes || '',
          changelogCount: dv.changelog?.length || 0,
          versionHistory: dv.versionHistory || [],
          visual: dv.visual || { summary: dv.visual?.summary || dv.description || '', color: dv.visual?.color || '#6b7280' },
          visualSummary: dv.visual?.summary || dv.description || '',
          compatibility: dv.compatibility || {},
          relatedDocs: dv.relatedDocs || [],
          resources: dv.resources || [],
          saipulaiUpgrade: dv.saipulaiUpgrade || dv.aiUpgrade || null,
          newFeatures: dv.newFeatures || {},
          performanceMetrics: dv.performanceMetrics || {},
          performanceTargets: dv.performanceMetrics?.website || dv.performanceTargets || {},
          securityEnhancements: dv.securityEnhancements || {},
          technicalDetails: dv.technicalDetails || {},
          rollbackPlan: dv.rollbackPlan || {},
          testingStatus: dv.testingStatus || {},
          notes: dv.notes || dv.description || '',
          source: 'docs'
        });
        return;
      }

      // 3) Cari di planned versions — dukung format baru 'comingsoon-<v>' dan beberapa varian
      const plannedVersion = PLANNED_VERSIONS.find(v => {
        const vRaw = v.version || '';
        const vWithV = vRaw.startsWith('v') ? vRaw : `v${vRaw}`;
        const vDash = vWithV.toLowerCase().replace(/\./g, '-');
        const coming = `comingsoon-${vDash}`;
        return slug === coming || slug === vDash || slug === vWithV || slug === vRaw || slug === vRaw.replace(/\./g, '-');
      });

      if (plannedVersion) {
        // Normalisasi dan peta ke bentuk yang sama seperti dokumen
        const pv = plannedVersion;
        const normVer = pv.version && pv.version.startsWith('v') ? pv.version : `v${pv.version}`;
        const vDash = normVer.toLowerCase().replace(/\./g, '-');
        const comingSlug = `comingsoon-${vDash}`;

        setVersion({
          version: normVer,
          versionCode: pv.versionCode || 'build-planned',
          versionType: pv.type?.toLowerCase() || 'minor',
          releaseChannel: pv.releaseChannel || 'Roadmap',
          lastUpdated: pv.date || 'Coming Soon — Akan segera dirilis dan digunakan oleh semua orang',
          title: pv.description || '',
          slug: comingSlug,
          author: pv.author || 'Tim Produk',
          status: pv.status || 'PLANNED',
          breakingChanges: pv.breakingChanges || false,
          migrationRequired: pv.migrationRequired || false,
          estimatedReadTime: pv.estimatedReadTime || '',
          tags: pv.tags || [],
          details: pv.details || [],
          content: pv.description || '',
          changelog: pv.changelog || (pv.details ? pv.details.map(d => ({ date: 'Coming Soon', changes: d })) : []),
          changelogSummary: pv.changelog?.[0]?.changes || (pv.details ? pv.details.slice(0,2).join('; ') : ''),
          changelogCount: pv.changelog?.length || pv.details?.length || 0,
          versionHistory: pv.versionHistory || [],
          visual: pv.visual || { summary: pv.description, color: pv.iconColor || pv.color || '#7c3aed' },
          visualSummary: pv.description || '',
          compatibility: pv.compatibility || {},
          saipulaiUpgrade: pv.saipulaiUpgrade || null,
          newFeatures: pv.newFeatures || {},
          performanceMetrics: pv.performanceMetrics || {},
          performanceTargets: pv.performanceMetrics?.website || pv.performanceTargets || {},
          securityEnhancements: pv.securityEnhancements || {},
          technicalDetails: pv.technicalDetails || {},
          rollbackPlan: pv.rollbackPlan || {},
          testingStatus: pv.testingStatus || {},
          notes: pv.notes || pv.description || '',
          relatedDocs: pv.relatedDocs || [],
          resources: pv.resources || [],
          source: 'planned'
        });
        return;
      }

      // Jika tidak ditemukan, redirect ke versi list
      navigate("/help/version");
    };

    findVersion();
  }, [slug, navigate]);

  if (!version) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
            <Package className="text-gray-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Loading version details...
          </h3>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "CURRENT":
      case "current":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "SUPPORTED":
      case "supported":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PLANNED":
      case "planned":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "DEPRECATED":
      case "deprecated":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "ARCHIVED":
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "major":
        return "bg-red-500/20 text-red-400";
      case "stable":
        return "bg-green-500/20 text-green-400";
      case "minor":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Extra labels similar to HelpVersionInfo.jsx
  const getExtraLabels = (ver) => {
    const labels = [];
    const latest = getLatestVersionInfo(docsData);
    const latestNorm = latest?.versiWebsite ? (latest.versiWebsite.startsWith('v') ? latest.versiWebsite : `v${latest.versiWebsite}`) : null;

    if (ver.status === "PLANNED" || ver.status === "planned") {
      labels.push({ text: "Coming Soon", color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white" });
    }

    if (latestNorm && ver.version === latestNorm) {
      labels.push({ text: "Baru", color: "bg-gradient-to-r from-green-500 to-green-600 text-white" });
    }

    if (latest.lastUpdated && ver.lastUpdated === latest.lastUpdated && ver.version !== latestNorm) {
      labels.push({ text: "Last Update", color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white" });
    }

    if (ver.version === "v1.0.0") {
      labels.push({ text: "Peluncuran Pertama", color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white" });
    }

    return labels;
  };

  // Colorful tag palette (same as HelpVersionInfo.jsx)
  const tagColors = [
    "bg-pink-500/30 text-pink-400",
    "bg-blue-500/30 text-blue-400",
    "bg-green-500/30 text-green-400",
    "bg-yellow-500/30 text-yellow-400",
    "bg-purple-500/30 text-purple-400",
    "bg-cyan-500/30 text-cyan-400",
    "bg-orange-500/30 text-orange-400",
    "bg-red-500/30 text-red-400",
    "bg-teal-500/30 text-teal-400",
    "bg-indigo-500/30 text-indigo-400"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900/60 via-pink-900/40 to-black/40 backdrop-blur-xl border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/help/version"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Versions</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(version.status)} ring-1 ring-white/5 shadow-sm`}>
                {version.status}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(version.versionType)} ring-1 ring-white/5 shadow-sm`}>
                {version.versionType || "UNKNOWN"}
              </span>
              {/* Extra labels (Coming Soon, Baru, Last Update, Peluncuran Pertama) */}
              {getExtraLabels(version).map((label, i) => (
                <span key={i} className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${label.color}`}>{label.text}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Version Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {version.version}
              </h1>
              <p className="text-xl text-gray-300">{version.title || version.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Version Code</p>
              <p className="text-2xl font-mono font-bold text-white">{version.versionCode}</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-pink-900/30 via-indigo-900/20 to-slate-900/30 rounded-xl p-4 border border-gray-700 shadow-lg backdrop-blur-sm transform-gpu transition hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Release Date</p>
                  <p className="text-lg font-semibold text-white">{version.lastUpdated}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 via-indigo-900/20 to-slate-900/30 rounded-xl p-4 border border-gray-700 shadow-lg backdrop-blur-sm transform-gpu transition hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-green-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Author</p>
                  <p className="text-lg font-semibold text-white">{version.author}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 via-indigo-900/20 to-slate-900/30 rounded-xl p-4 border border-gray-700 shadow-lg backdrop-blur-sm transform-gpu transition hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-purple-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Read Time</p>
                  <p className="text-lg font-semibold text-white">{version.estimatedReadTime || "5 min"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 via-indigo-900/20 to-slate-900/30 rounded-xl p-4 border border-gray-700 shadow-lg backdrop-blur-sm transform-gpu transition hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="text-cyan-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Channel</p>
                  <p className="text-lg font-semibold text-white">{version.releaseChannel || "Production"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile: compact nav for sections (shows on small screens) */}
          <div className="lg:hidden col-span-1">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button onClick={() => setActiveSection('overview')} className={`px-3 py-2 rounded-lg text-sm ${activeSection==='overview' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Overview</button>
              {version.changelog?.length > 0 && <button onClick={() => setActiveSection('changelog')} className={`px-3 py-2 rounded-lg text-sm ${activeSection==='changelog' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Changelog</button>}
              {version.versionHistory?.length > 0 && <button onClick={() => setActiveSection('history')} className={`px-3 py-2 rounded-lg text-sm ${activeSection==='history' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>History</button>}
              <button onClick={() => setActiveSection('compatibility')} className={`px-3 py-2 rounded-lg text-sm ${activeSection==='compatibility' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Compatibility</button>
            </div>
          </div>
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "overview" 
                  ? "bg-gradient-to-r from-pink-500/20 to-indigo-600/20 text-white border border-pink-500/30 ring-1 ring-white/5 shadow" 
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Overview</span>
                </div>
              </button>

              {version.changelog && version.changelog.length > 0 && (
                <button
                  onClick={() => setActiveSection("changelog")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "changelog" 
                    ? "bg-gradient-to-r from-indigo-500/20 to-blue-600/20 text-white border border-indigo-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Activity size={18} />
                    <span>Changelog</span>
                    <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                      {version.changelog.length}
                    </span>
                  </div>
                </button>
              )}

              {version.versionHistory && version.versionHistory.length > 0 && (
                <button
                  onClick={() => setActiveSection("history")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "history" 
                    ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-white border border-green-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={18} />
                    <span>Version History</span>
                  </div>
                </button>
              )}

              {version.compatibility && (
                <button
                  onClick={() => setActiveSection("compatibility")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "compatibility" 
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border border-yellow-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    <span>Compatibility</span>
                  </div>
                </button>
              )}

              {version.breakingChanges && (
                <button
                  onClick={() => setActiveSection("breaking")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "breaking" 
                    ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-white border border-red-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span>Breaking Changes</span>
                  </div>
                </button>
              )}

              {version.details && (
                <button
                  onClick={() => setActiveSection("details")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "details" 
                    ? "bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-white border border-cyan-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Zap size={18} />
                    <span>Feature Details</span>
                  </div>
                </button>
              )}

              {version.acceptanceCriteria && version.acceptanceCriteria.length > 0 && (
                <button
                  onClick={() => setActiveSection("acceptance")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "acceptance" 
                    ? "bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-white border border-indigo-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} />
                    <span>Acceptance Criteria</span>
                  </div>
                </button>
              )}

              {version.releaseChecklist && version.releaseChecklist.length > 0 && (
                <button
                  onClick={() => setActiveSection("checklist")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "checklist" 
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} />
                    <span>Release Checklist</span>
                  </div>
                </button>
              )}

              {version.migrationNotes && (Object.keys(version.migrationNotes).length > 0) && (
                <button
                  onClick={() => setActiveSection("migration")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "migration" 
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border border-yellow-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span>Migration Notes</span>
                  </div>
                </button>
              )}

              {version.testPlan && Object.keys(version.testPlan).length > 0 && (
                <button
                  onClick={() => setActiveSection("tests")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "tests" 
                    ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-white border border-green-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Activity size={18} />
                    <span>Test Plan</span>
                  </div>
                </button>
              )}

              {version.performanceTargets && Object.keys(version.performanceTargets).length > 0 && (
                <button
                  onClick={() => setActiveSection("performance")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "performance" 
                    ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-white border border-red-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Cpu size={18} />
                    <span>Performance Targets</span>
                  </div>
                </button>
              )}

              {version.rolloutStrategy && Object.keys(version.rolloutStrategy).length > 0 && (
                <button
                  onClick={() => setActiveSection("rollout")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "rollout" 
                    ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-white border border-purple-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={18} />
                    <span>Rollout Strategy</span>
                  </div>
                </button>
              )}

              {version.businessImpact && Object.keys(version.businessImpact).length > 0 && (
                <button
                  onClick={() => setActiveSection("business")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "business" 
                    ? "bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-white border border-indigo-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} />
                    <span>Business Impact</span>
                  </div>
                </button>
              )}

              {version.saipulaiUpgrade && (
                <button
                  onClick={() => setActiveSection("ai")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "ai" 
                    ? "bg-gradient-to-r from-indigo-500/20 to-blue-600/20 text-white border border-indigo-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Cpu size={18} />
                    <span>AI Upgrade</span>
                  </div>
                </button>
              )}

              {version.newFeatures && Object.keys(version.newFeatures).length > 0 && (
                <button
                  onClick={() => setActiveSection("newfeatures")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "newfeatures" 
                    ? "bg-gradient-to-r from-cyan-500/20 to-teal-600/20 text-white border border-cyan-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Zap size={18} />
                    <span>New Features</span>
                  </div>
                </button>
              )}

              {version.securityEnhancements && Object.keys(version.securityEnhancements).length > 0 && (
                <button
                  onClick={() => setActiveSection("security")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "security" 
                    ? "bg-gradient-to-r from-red-500/20 to-rose-600/20 text-white border border-red-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    <span>Security</span>
                  </div>
                </button>
              )}

              {version.rollbackPlan && version.rollbackPlan.available && (
                <button
                  onClick={() => setActiveSection("rollback")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "rollback" 
                    ? "bg-gradient-to-r from-yellow-500/20 to-amber-600/20 text-white border border-yellow-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <Activity size={18} />
                    <span>Rollback Plan</span>
                  </div>
                </button>
              )}

              {version.notes && (
                <button
                  onClick={() => setActiveSection("notes")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "notes" 
                    ? "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-white border border-gray-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span>Notes</span>
                  </div>
                </button>
              )}

              {(version.resources && version.resources.length > 0) && (
                <button
                  onClick={() => setActiveSection("resources")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform-gpu ${activeSection === "resources" 
                    ? "bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-white border border-cyan-500/30 ring-1 ring-white/5 shadow" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:translate-x-1 hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink size={18} />
                    <span>Resources</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Version Overview</h2>
                  <p className="text-gray-300 mb-6">{version.content || version.description}</p>
                  
                  {version.visual && (
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: version.visual.color || "#6b7280" }}
                        />
                        <span className="text-sm font-medium text-gray-400">Visual Summary</span>
                      </div>
                      <p className="text-gray-300">{version.visual.summary}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {version.tags && version.tags.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Tag size={20} />
                      Tags & Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {version.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColors[tagIndex % tagColors.length]} select-none`}
                        >
                          {tag}
                        </span>
                      ))}
                      {version.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs">+{version.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Changelog Section */}
            {activeSection === "changelog" && version.changelog && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Changelog</h2>
                  <div className="space-y-4">
                    {version.changelog.map((change, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-gray-800/30 rounded-xl border border-gray-700"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-gray-500" size={16} />
                            <span className="text-sm text-gray-400">{change.date}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            change.type === 'feature' ? 'bg-green-500/20 text-green-400' :
                            change.type === 'security' ? 'bg-red-500/20 text-red-400' :
                            change.type === 'performance' ? 'bg-blue-500/20 text-blue-400' :
                            change.type === 'improvement' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {change.type?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300">{change.changes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Version History Section */}
            {activeSection === "history" && version.versionHistory && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Version History</h2>
                  <div className="space-y-4">
                    {version.versionHistory.map((history, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border ${
                          history.breakingChanges 
                            ? 'bg-red-500/10 border-red-500/30' 
                            : 'bg-gray-800/30 border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-white">{history.version}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              history.status === 'current' ? 'bg-green-500/20 text-green-400' :
                              history.status === 'supported' ? 'bg-blue-500/20 text-blue-400' :
                              history.status === 'deprecated' ? 'bg-yellow-500/20 text-yellow-400' :
                              history.status === 'archived' ? 'bg-gray-500/20 text-gray-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {history.status?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">{history.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {history.breakingChanges && (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="text-red-400" size={16} />
                              <span className="text-sm text-red-400">Breaking Changes</span>
                            </div>
                          )}
                          
                          {history.migrationRequired && (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="text-yellow-400" size={16} />
                              <span className="text-sm text-yellow-400">Migration Required</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Compatibility Section */}
            {activeSection === "compatibility" && version.compatibility && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Compatibility</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center gap-3 mb-4">
                        <Download className="text-blue-400" size={24} />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Minimum Required</h3>
                          <p className="text-2xl font-bold text-white">{version.compatibility.minRequired}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center gap-3 mb-4">
                        <Layers className="text-green-400" size={24} />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Tested Up To</h3>
                          <p className="text-2xl font-bold text-white">{version.compatibility.testedUpTo}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Browser Support */}
                  {version.compatibility.browserSupport && version.compatibility.browserSupport.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="text-cyan-400" size={20} />
                        Browser Support
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {version.compatibility.browserSupport.map((browser, index) => (
                          <div 
                            key={index}
                            className="p-4 bg-gray-800/30 rounded-xl border border-gray-700"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {browser.includes('chrome') && <Cpu className="text-red-400" size={20} />}
                              {browser.includes('firefox') && <Globe className="text-orange-400" size={20} />}
                              {browser.includes('safari') && <Smartphone className="text-blue-400" size={20} />}
                              {browser.includes('edge') && <Cpu className="text-blue-300" size={20} />}
                            </div>
                            <p className="text-sm font-medium text-gray-300">{browser}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* API Compatibility */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Code className="text-purple-400" size={20} />
                      API Compatibility
                    </h3>
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                      <p className="text-2xl font-bold text-white">{version.compatibility.apiCompatibility}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Breaking Changes Section */}
            {activeSection === "breaking" && version.breakingChanges && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-red-500/30">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="text-red-400" size={24} />
                    <h2 className="text-2xl font-bold text-white">Breaking Changes</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <h3 className="text-lg font-semibold text-white mb-2">⚠️ Attention Required</h3>
                      <p className="text-gray-300">
                        This version contains breaking changes that may require updates to your codebase.
                        Please review the migration guide before upgrading.
                      </p>
                    </div>

                    {version.migrationRequired && (
                      <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                        <h3 className="text-lg font-semibold text-white mb-2">Migration Required</h3>
                        <p className="text-gray-300">
                          A migration guide is available. Please follow the steps to ensure compatibility.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Feature Details Section */}
            {activeSection === "details" && version.details && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Feature Details</h2>
                  <div className="space-y-4">
                    {version.details.map((detail, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-gray-800/30 rounded-xl border border-gray-700"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="text-green-400" size={20} />
                          <p className="text-gray-300">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Acceptance Criteria Section */}
            {activeSection === "acceptance" && version.acceptanceCriteria && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Acceptance Criteria</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {version.acceptanceCriteria.map((crit, i) => (
                      <li key={i}>{crit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Release Checklist Section */}
            {activeSection === "checklist" && version.releaseChecklist && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Release Checklist</h2>
                  <div className="space-y-2 text-gray-300">
                    {version.releaseChecklist.map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg ${item.startsWith('✅') ? 'bg-green-900/20' : 'bg-gray-800/30'}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Migration Notes Section */}
            {activeSection === "migration" && version.migrationNotes && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Migration Notes</h2>
                  {Object.entries(version.migrationNotes).map(([key, list]) => (
                    <div key={key} className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{key.toUpperCase()}</h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {Array.isArray(list) ? list.map((l, idx) => <li key={idx}>{l}</li>) : <li>{String(list)}</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Plan Section */}
            {activeSection === "tests" && version.testPlan && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Test Plan</h2>
                  {Object.entries(version.testPlan).map(([phase, steps]) => (
                    <div key={phase} className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{phase.charAt(0).toUpperCase() + phase.slice(1)}</h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Targets Section */}
            {activeSection === "performance" && version.performanceTargets && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Performance Targets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    {Object.entries(version.performanceTargets).map(([k, v]) => (
                      <div key={k} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                        <h4 className="text-sm text-gray-400 mb-1">{k}</h4>
                        <p className="text-lg font-semibold text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rollout Strategy Section */}
            {activeSection === "rollout" && version.rolloutStrategy && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Rollout Strategy</h2>
                  {version.rolloutStrategy.phases && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Phases</h3>
                      <ul className="list-disc list-inside text-gray-300">
                        {version.rolloutStrategy.phases.map((p, i) => (
                          <li key={i}>{p.phase} — {p.duration || p.users || p.increase || p.target || p.date}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {version.rolloutStrategy.monitoring && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Monitoring</h3>
                      <ul className="list-disc list-inside text-gray-300">
                        {version.rolloutStrategy.monitoring.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}

                  {version.rolloutStrategy.rollbackTriggers && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Rollback Triggers</h3>
                      <ul className="list-disc list-inside text-gray-300">
                        {version.rolloutStrategy.rollbackTriggers.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Impact Section */}
            {activeSection === "business" && version.businessImpact && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Business Impact</h2>
                  <div className="text-gray-300 space-y-2">
                    {version.businessImpact.expectedIncrease && <p><strong>Expected Increase:</strong> {version.businessImpact.expectedIncrease}</p>}
                    {version.businessImpact.monetization && <p><strong>Monetization:</strong> {version.businessImpact.monetization}</p>}
                    {version.businessImpact.costStructure && <p><strong>Cost Structure:</strong> {version.businessImpact.costStructure}</p>}
                    {version.businessImpact.kpis && (
                      <p><strong>KPIs:</strong> {Array.isArray(version.businessImpact.kpis) ? version.businessImpact.kpis.join(', ') : version.businessImpact.kpis}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Upgrade Section */}
            {activeSection === "ai" && version.saipulaiUpgrade && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">AI Upgrade</h2>
                  <p className="text-gray-300 mb-4">{version.saipulaiUpgrade.summary || version.saipulaiUpgrade.details || ''}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                      <h4 className="text-lg font-semibold text-white">Version</h4>
                      <p className="text-gray-300">{version.saipulaiUpgrade.version} — {version.saipulaiUpgrade.releaseDate}</p>
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                      <h4 className="text-lg font-semibold text-white">Type</h4>
                      <p className="text-gray-300">{version.saipulaiUpgrade.type}</p>
                    </div>
                  </div>

                  {version.saipulaiUpgrade.keyFeatures && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {Object.entries(version.saipulaiUpgrade.keyFeatures).map(([k, v]) => (
                          <li key={k}><strong>{k}:</strong> {v && typeof v === 'object' ? JSON.stringify(v) : String(v)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* New Features Section */}
            {activeSection === "newfeatures" && version.newFeatures && Object.keys(version.newFeatures).length > 0 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">New Features</h2>
                  <div className="space-y-4">
                    {Object.entries(version.newFeatures).map(([key, feat]) => (
                      <div key={key} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-1">{feat.title || key}</h3>
                        <p className="text-gray-300 mb-2">{feat.description || feat.details}</p>
                        {feat.impact && <p className="text-sm text-gray-400 mb-1">Impact: {feat.impact}</p>}
                        {feat.files && <p className="text-xs text-gray-500">Files: {Array.isArray(feat.files) ? feat.files.join(', ') : String(feat.files)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Enhancements Section */}
            {activeSection === "security" && version.securityEnhancements && Object.keys(version.securityEnhancements).length > 0 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Security Enhancements</h2>
                  <div className="text-gray-300 space-y-3">
                    {version.securityEnhancements.website && (
                      <div>
                        <h4 className="font-semibold text-white">Website</h4>
                        <p className="text-gray-300">{typeof version.securityEnhancements.website === 'string' ? version.securityEnhancements.website : JSON.stringify(version.securityEnhancements.website)}</p>
                      </div>
                    )}
                    {version.securityEnhancements.aiSystem && (
                      <div>
                        <h4 className="font-semibold text-white">AI System</h4>
                        <p className="text-gray-300">{typeof version.securityEnhancements.aiSystem === 'string' ? version.securityEnhancements.aiSystem : JSON.stringify(version.securityEnhancements.aiSystem)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rollback Plan Section */}
            {activeSection === "rollback" && version.rollbackPlan && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Rollback Plan</h2>
                  <p className="text-gray-300 mb-2">Available: {version.rollbackPlan.available ? 'Yes' : 'No'}</p>
                  {version.rollbackPlan.rollbackTo && <p className="text-gray-300">Rollback To: {version.rollbackPlan.rollbackTo}</p>}
                  {version.rollbackPlan.instructions && <div className="mt-4 p-4 bg-gray-800/30 rounded-md border border-gray-700 text-gray-300">{version.rollbackPlan.instructions}</div>}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {activeSection === "notes" && version.notes && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Notes</h2>
                  <p className="text-gray-300">{version.notes}</p>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {activeSection === "resources" && version.resources && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {version.resources.map((r, i) => (
                      <a key={i} href={r.url || '#'} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:bg-gray-800/40">
                        <div className="text-gray-300">
                          <div className="text-sm text-gray-400">{r.type}</div>
                          <div className="font-semibold text-white">{r.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{r.url}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}