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
import { getDocBySlug } from "../../docs/lib/versionUtils";
import PLANNED_VERSIONS from "../data/plannedVersions";

export default function HelpVersionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [version, setVersion] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const findVersion = () => {
      // Cari di data dokumen
      const docVersion = getDocBySlug(docsData, slug);
      if (docVersion) {
        setVersion({
          ...docVersion,
          source: "docs"
        });
        return;
      }

      // Cari di planned versions
      const plannedVersion = PLANNED_VERSIONS.find(v => 
        v.version.toLowerCase().replace(/\./g, '-') === slug
      );
      if (plannedVersion) {
        setVersion({
          ...plannedVersion,
          source: "planned"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
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
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(version.status)}`}>
                {version.status}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(version.versionType)}`}>
                {version.versionType?.toUpperCase() || "UNKNOWN"}
              </span>
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
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Release Date</p>
                  <p className="text-lg font-semibold text-white">{version.lastUpdated}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-green-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Author</p>
                  <p className="text-lg font-semibold text-white">{version.author}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-purple-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Read Time</p>
                  <p className="text-lg font-semibold text-white">{version.estimatedReadTime || "5 min"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
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
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === "overview" 
                  ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-white border border-purple-500/30" 
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Overview</span>
                </div>
              </button>

              {version.changelog && version.changelog.length > 0 && (
                <button
                  onClick={() => setActiveSection("changelog")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === "changelog" 
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`}
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
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === "history" 
                    ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-white border border-green-500/30" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`}
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
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === "compatibility" 
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-white border border-yellow-500/30" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`}
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
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === "breaking" 
                    ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-white border border-red-500/30" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`}
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
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeSection === "details" 
                    ? "bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-white border border-cyan-500/30" 
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <Zap size={18} />
                    <span>Feature Details</span>
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
                      {version.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm hover:bg-gray-600/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
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
          </div>
        </div>
      </div>
    </div>
  );
}