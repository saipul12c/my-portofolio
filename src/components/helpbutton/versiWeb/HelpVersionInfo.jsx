import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, 
  Calendar, 
  Users, 
  Cpu, 
  TrendingUp,
  Layers,
  ChevronRight,
  ExternalLink,
  Clock,
  Tag,
  Zap,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock4,
  Flame
} from "lucide-react";
import docsData from "../docs/data/docsSections.json";
import { 
  getLatestVersionInfo
} from "../docs/lib/versionUtils";

// Data versi planned/coming soon dari CHANGELOG.md
const PLANNED_VERSIONS = [
  {
    version: "v1.30.0",
    status: "PLANNED",
    date: "Coming Soon",
    type: "Minor",
    description: "New streaming page & community features",
    color: "bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/30",
    textColor: "text-purple-400",
    iconColor: "text-purple-400",
    details: [
      "Streaming page with full UI polish",
      "Community page integration",
      "Responsive improvements"
    ]
  },
  {
    version: "v1.20.0",
    status: "PLANNED",
    date: "Coming Soon",
    type: "Minor",
    description: "Incremental UI/UX improvements",
    color: "bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/30",
    textColor: "text-blue-400",
    iconColor: "text-blue-400",
    details: [
      "Media pages enhancements",
      "Community integrations",
      "UX refinements"
    ]
  },
  {
    version: "v1.19.0",
    status: "PLANNED",
    date: "Coming Soon",
    type: "Minor",
    description: "Streaming & community previews",
    color: "bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border-cyan-500/30",
    textColor: "text-cyan-400",
    iconColor: "text-cyan-400",
    details: [
      "Streaming feature preparation",
      "Community previews",
      "Layout refinements",
      "QA pass improvements"
    ]
  }
];

export default function HelpVersionInfo() {
  const [activeTab, setActiveTab] = useState("all");
  const [versions, setVersions] = useState([]);
  
  // Ambil data dari JSON dan utils
  const latest = getLatestVersionInfo(docsData);
  
  // Ekstrak semua versi unik dari data
  useEffect(() => {
    const extractVersions = () => {
      const versionMap = new Map();
      
      // Tambahkan versi dari dokumen
      docsData.forEach(doc => {
        if (doc.version) {
          if (!versionMap.has(doc.version)) {
            versionMap.set(doc.version, {
              version: doc.version,
              versionCode: doc.versionCode,
              versionType: doc.versionType,
              releaseChannel: doc.releaseChannel,
              lastUpdated: doc.lastUpdated,
              title: doc.title,
              slug: doc.slug,
              author: doc.author,
              status: doc.versionHistory?.[0]?.status || "CURRENT",
              breakingChanges: doc.versionHistory?.[0]?.breakingChanges || false,
              migrationRequired: doc.versionHistory?.[0]?.migrationRequired || false,
              estimatedReadTime: doc.estimatedReadTime,
              tags: doc.tags || [],
              content: doc.content,
              changelog: doc.changelog || [],
              versionHistory: doc.versionHistory || [],
              visual: doc.visual || {},
              compatibility: doc.compatibility || {}
            });
          }
        }
      });
      
      // Tambahkan versi planned
      PLANNED_VERSIONS.forEach(planned => {
        versionMap.set(planned.version, {
          ...planned,
          versionCode: "build-planned",
          releaseChannel: "Roadmap",
          versionType: planned.type.toLowerCase(),
          lastUpdated: planned.date,
          slug: planned.version.toLowerCase().replace(/\./g, '-'),
          changelog: [],
          versionHistory: [],
          visual: {
            summary: planned.description,
            badge: "PLANNED",
            color: planned.iconColor
          }
        });
      });
      
      // Sortir versi (terbaru ke terlama)
      return Array.from(versionMap.values()).sort((a, b) => {
        const parseVersion = (v) => {
          const match = v.version.match(/v?(\d+)\.(\d+)\.(\d+)/);
          return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
        };
        
        const aVer = parseVersion(a);
        const bVer = parseVersion(b);
        
        for (let i = 0; i < 3; i++) {
          if (aVer[i] !== bVer[i]) {
            return bVer[i] - aVer[i]; // Descending
          }
        }
        return 0;
      });
    };
    
    setVersions(extractVersions());
  }, []);

  // Filter versi berdasarkan tab aktif
  const filteredVersions = versions.filter(ver => {
    switch (activeTab) {
      case "current":
        return ver.status === "CURRENT" || ver.releaseChannel === "Production";
      case "planned":
        return ver.status === "PLANNED";
      case "major":
        return ver.versionType === "major";
      case "stable":
        return ver.versionType === "stable";
      case "breaking":
        return ver.breakingChanges === true;
      default:
        return true;
    }
  });

  // Helper untuk mendapatkan warna berdasarkan status
  const getStatusColor = (status) => {
    switch (status) {
      case "CURRENT":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "SUPPORTED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PLANNED":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "DEPRECATED":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "ARCHIVED":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Helper untuk mendapatkan warna berdasarkan tipe versi
  const getTypeColor = (type) => {
    switch (type) {
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

  // Helper untuk label tambahan
  const getExtraLabels = (version) => {
    const labels = [];
    // Coming Soon
    if (version.status === "PLANNED") {
      labels.push({ text: "Coming Soon", color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white" });
    }
    // Baru (new) jika versi adalah yang terbaru
    if (version.version === latest.versiWebsite) {
      labels.push({ text: "Baru", color: "bg-gradient-to-r from-green-500 to-green-600 text-white" });
    }
    // Last Update
    if (version.lastUpdated === latest.lastUpdated && version.version !== latest.versiWebsite) {
      labels.push({ text: "Last Update", color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white" });
    }
    // Peluncuran pertama
    if (version.version === "v1.0.0") {
      labels.push({ text: "Peluncuran Pertama", color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white" });
    }
    return labels;
  };

  // Colorful tag palette
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a1833] to-[#162447] p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#e6e6e6] mb-2">
              Website Versions & Release History
            </h1>
            <p className="text-[#bfc8e2]">
              Track all versions of your portfolio website, from current releases to upcoming features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#162447] to-[#1f2a44] rounded-2xl border border-[#1f2a44]">
              <div className="flex items-center gap-2">
                <Rocket className="text-purple-400" size={20} />
                <div>
                  <p className="text-xs text-[#bfc8e2]">Latest Version</p>
                  <p className="text-lg font-bold text-[#e6e6e6]">{latest.versiWebsite}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#162447] to-[#1f2a44] rounded-2xl p-6 border border-[#1f2a44]">
            <div className="flex items-center justify-between mb-4">
              <Package className="text-blue-400" size={24} />
              <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                {versions.length} Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#e6e6e6] mb-1">{versions.length}</h3>
            <p className="text-[#bfc8e2] text-sm">Total Versions</p>
          </div>

          <div className="bg-gradient-to-br from-[#162447] to-[#1f2a44] rounded-2xl p-6 border border-[#1f2a44]">
            <div className="flex items-center justify-between mb-4">
              <Zap className="text-green-400" size={24} />
              <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                Current
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#e6e6e6] mb-1">
              {versions.filter(v => v.status === "CURRENT").length}
            </h3>
            <p className="text-[#bfc8e2] text-sm">Active Versions</p>
          </div>

          <div className="bg-gradient-to-br from-[#162447] to-[#1f2a44] rounded-2xl p-6 border border-[#1f2a44]">
            <div className="flex items-center justify-between mb-4">
              <Clock4 className="text-purple-400" size={24} />
              <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                Upcoming
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#e6e6e6] mb-1">
              {versions.filter(v => v.status === "PLANNED").length}
            </h3>
            <p className="text-[#bfc8e2] text-sm">Planned Releases</p>
          </div>

          <div className="bg-gradient-to-br from-[#162447] to-[#1f2a44] rounded-2xl p-6 border border-[#1f2a44]">
            <div className="flex items-center justify-between mb-4">
              <Flame className="text-red-400" size={24} />
              <span className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
                Breaking
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#e6e6e6] mb-1">
              {versions.filter(v => v.breakingChanges).length}
            </h3>
            <p className="text-[#bfc8e2] text-sm">Breaking Changes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === "all" 
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            All Versions
          </button>
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === "current" 
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Current
          </button>
          <button
            onClick={() => setActiveTab("planned")}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === "planned" 
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Planned
          </button>
          <button
            onClick={() => setActiveTab("major")}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === "major" 
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            Major
          </button>
          <button
              onClick={() => setActiveTab("breaking")}
              className={`px-4 py-2 rounded-xl transition-all ${activeTab === "breaking" 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
            >
              Breaking Changes
            </button>
        </div>

        {/* Versions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVersions.map((version, index) => (
            <Link
              key={index}
              to={`/help/version/${version.slug}`}
              className="group block"
            >
              <div className="bg-gradient-to-br from-[#162447]/60 to-[#1f2a44]/60 rounded-2xl p-6 border border-[#1f2a44] hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-[#e6e6e6] group-hover:text-purple-300 transition-colors">
                        {version.version}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(version.versionType)}`}>
                        {version.versionType}
                      </span>
                      {/* Extra labels */}
                      {getExtraLabels(version).map((label, i) => (
                        <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ml-1 ${label.color}`}>{label.text}</span>
                      ))}
                    </div>
                    <p className="text-[#bfc8e2] mb-1">{version.title || version.description}</p>
                    <p className="text-sm text-[#bfc8e2]">{version.versionCode}</p>
                  </div>
                  <ChevronRight className="text-[#bfc8e2] group-hover:text-purple-400 transition-colors" size={20} />
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-[#bfc8e2]" size={16} />
                      <span className="text-sm text-[#bfc8e2]">{version.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-[#bfc8e2]" size={16} />
                      <span className="text-sm text-[#bfc8e2]">{version.author}</span>
                    </div>
                  </div>

                  {version.breakingChanges && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="text-red-400" size={16} />
                      <span className="text-sm text-red-400">Breaking Changes</span>
                    </div>
                  )}

                  {version.migrationRequired && (
                    <div className="flex items-center gap-2">
                      <XCircle className="text-yellow-400" size={16} />
                      <span className="text-sm text-yellow-400">Migration Required</span>
                    </div>
                  )}
                </div>

                {/* Tags - colorful */}
                {version.tags && version.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {version.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColors[tagIndex % tagColors.length]}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {version.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs">
                        +{version.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredVersions.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1f2a44] mb-4">
              <Package className="text-[#bfc8e2]" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[#bfc8e2] mb-2">
              No versions found
            </h3>
            <p className="text-[#bfc8e2] max-w-md mx-auto">
              No versions match your current filter. Try selecting a different category.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#162447]/60 to-[#1f2a44]/60 rounded-2xl border border-[#1f2a44]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-[#e6e6e6] mb-2">Version Information</h4>
              <p className="text-[#bfc8e2] text-sm">
                All website versions follow semantic versioning. Click on any version to view detailed release notes, 
                changelog, migration guides, and compatibility information.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#bfc8e2] mb-1">Last Updated</p>
              <p className="text-lg font-bold text-[#e6e6e6]">{latest.lastUpdated}</p>
              <p className="text-xs text-[#bfc8e2] mt-1">by {latest.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}