import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ExternalLink, 
  Code, 
  Globe, 
  Users, 
  Award,
  Book,
  Briefcase,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart
} from "lucide-react";
import dataBahasa from "../../../data/bahasa/data.json";
import { motion } from "framer-motion";

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const DetailBahasa = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const all = [
    ...(dataBahasa.bahasaSehariHari || []).map(item => ({ ...item, type: "bahasa" })),
    ...(dataBahasa.bahasaPemrograman || []).map(item => ({ ...item, type: "teknologi" }))
  ];

  const item = all.find((b) => slugify(b.nama) === slug);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center bg-[#1e293b]/80 backdrop-blur-md p-8 rounded-2xl border border-red-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Bahasa/Teknologi tidak ditemukan</h2>
          <p className="text-gray-400 mb-4">Maaf, kami tidak menemukan item yang sesuai dengan permintaan Anda.</p>
          <button
            onClick={() => navigate("/bahasa")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Kembali ke Daftar
          </button>
        </motion.div>
      </div>
    );
  }

  const isProgramming = item.type === "teknologi";

  const renderInfoCard = (icon, title, content, color = "cyan") => {
    const colorClasses = {
      cyan: "border-cyan-600/40 bg-gradient-to-r from-cyan-900/10 via-cyan-800/5 to-cyan-900/8",
      blue: "border-blue-600/40 bg-gradient-to-r from-blue-900/8 via-blue-800/6 to-blue-900/10",
      green: "border-emerald-600/40 bg-gradient-to-r from-emerald-900/8 via-emerald-800/6 to-emerald-900/10",
      purple: "border-purple-600/40 bg-gradient-to-r from-purple-900/8 via-purple-800/6 to-purple-900/10",
      orange: "border-orange-600/40 bg-gradient-to-r from-orange-900/8 via-orange-800/6 to-orange-900/10"
    };

    const iconColors = {
      cyan: "text-cyan-400",
      blue: "text-blue-400",
      green: "text-emerald-300",
      purple: "text-purple-300",
      orange: "text-orange-300"
    };

    return (
      <div className={`rounded-xl p-4 border ${colorClasses[color]} hover:scale-[1.01] transition-transform`}> 
        <div className="flex items-center gap-2 mb-2">
          <div className={`text-lg ${iconColors[color]}`}>{icon}</div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
      </div>
    );
  };

  const renderSection = (title, icon, children, color = "cyan") => {
    const colorClasses = {
      cyan: "border-cyan-500/20",
      blue: "border-blue-500/20",
      green: "border-emerald-500/20",
      purple: "border-purple-500/20"
    };

    return (
      <div className={`rounded-xl p-5 border ${colorClasses[color]} bg-gradient-to-br from-[#0b1220]/40 to-[#12202b]/30 shadow-sm`}>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
          <div className="text-xl text-cyan-300">{icon}</div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {children}
      </div>
    );
  };

  const renderSkillLevel = (level) => {
    const getLevelColor = (lvl) => {
      if (lvl >= 85) return "text-green-400";
      if (lvl >= 70) return "text-yellow-400";
      return "text-orange-400";
    };

    const getLevelText = (lvl) => {
      if (lvl >= 85) return "Mahir/Lanjutan";
      if (lvl >= 70) return "Menengah-Atas";
      if (lvl >= 50) return "Menengah";
      return "Pemula";
    };

    return (
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-300">Kemampuan</span>
            <span className={`text-sm font-bold ${getLevelColor(level)}`}>{level}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${level}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1 text-right">{getLevelText(level)}</div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header & Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/bahasa")}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft size={18} /> Kembali ke Daftar
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-6xl p-3 rounded-full shadow-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                {item.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{item.nama}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30">
                    {item.tingkat}
                  </span>
                  <span className="text-sm text-gray-400">
                    {isProgramming ? "Teknologi" : "Bahasa Sehari-hari"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full shadow-inner" style={{ background: `linear-gradient(135deg, ${item.warna || '#06b6d4'}, rgba(59,130,246,0.6))` }} />
              <div className="flex flex-col">
                <span className="text-sm text-gray-200 font-semibold">Level {item.level}%</span>
                <div className="h-2 w-40 bg-gray-700 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="md:col-span-2 space-y-6">
            {/* Level & Description */}
            {renderSection("📊 Tingkat Kemampuan", <BarChart size={20} />,
              <div className="space-y-4">
                {renderSkillLevel(item.level)}
                <p className="text-gray-300 leading-relaxed">{item.deskripsi}</p>
                <p className="text-gray-300 leading-relaxed">{item.penjelasan}</p>
              </div>
            )}

            {/* Capabilities & Skills */}
            {item.kemampuan && item.kemampuan.length > 0 && renderSection(
              "🎯 Kemampuan Utama",
              <Award size={20} />,
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.kemampuan.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-[#2d3748]/40 rounded-lg">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-gray-300 text-sm">{skill}</span>
                  </div>
                ))}
              </div>,
              "green"
            )}

            {/* Experience */}
            {item.pengalaman && renderSection(
              "💼 Pengalaman",
              <Briefcase size={20} />,
              <p className="text-gray-300 leading-relaxed">{item.pengalaman}</p>
            )}

            {/* For Programming Languages - Specific Details */}
            {isProgramming && (
              <>
                {item.framework && item.framework.length > 0 && renderSection(
                  "🛠️ Framework & Libraries",
                  <Code size={20} />,
                  <div className="flex flex-wrap gap-2">
                    {item.framework.map((fw, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-lg text-sm border border-blue-500/30">
                        {fw}
                      </span>
                    ))}
                  </div>,
                  "blue"
                )}

                {item.tools && item.tools.length > 0 && renderSection(
                  "🔧 Tools & Ecosystem",
                  <Code size={20} />,
                  <div className="flex flex-wrap gap-2">
                    {item.tools.map((tool, index) => (
                      <span key={index} className="px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                        {tool}
                      </span>
                    ))}
                  </div>,
                  "purple"
                )}

                {item.projectContoh && renderSection(
                  "🚀 Contoh Projek",
                  <TrendingUp size={20} />,
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-gray-300 leading-relaxed">{item.projectContoh}</p>
                  </div>
                )}
              </>
            )}

            {/* For Languages - Specific Details */}
            {!isProgramming && (
              <>
                {item.sertifikasi && renderSection(
                  "🏆 Sertifikasi",
                  <Award size={20} />,
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white">{item.sertifikasi.nama}</h4>
                          <p className="text-gray-300 text-sm">Skor: {item.sertifikasi.score}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                          {item.sertifikasi.equivalent}
                        </span>
                      </div>
                    </div>
                  </div>,
                  "green"
                )}
              </>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6 md:sticky md:top-24 md:self-start">
            {/* Quick Info Cards */}
            <div className="space-y-4">
              {renderInfoCard(<Globe size={18} />, "Asal", item.asal || "N/A")}
              {renderInfoCard(<Book size={18} />, "Fungsi", item.fungsi || "N/A", "blue")}
              {renderInfoCard(<Users size={18} />, "Pengguna", item.seberapaBanyakPengguna || "N/A", "purple")}
            </div>

            {/* Benefits & Limitations */}
            <div className="space-y-4">
              {item.kelebihan && renderSection(
                "✅ Kelebihan",
                <CheckCircle size={18} />,
                <p className="text-gray-300 leading-relaxed">{item.kelebihan}</p>,
                "green"
              )}

              {item.kekurangan && renderSection(
                "⚠️ Kekurangan",
                <XCircle size={18} />,
                <p className="text-gray-300 leading-relaxed">{item.kekurangan}</p>,
                "orange"
              )}
            </div>

            {/* Additional Details */}
            {item.detailTambahan && Object.keys(item.detailTambahan).length > 0 && renderSection(
              "📋 Detail Tambahan",
              <Book size={18} />,
              <div className="space-y-3">
                {Object.entries(item.detailTambahan).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-700 pb-3 last:border-0">
                    <div className="text-sm font-medium text-gray-300 capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </div>
                    <div className="text-sm text-gray-400">
                      {Array.isArray(value) ? value.join(", ") : value.toString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Purpose & Benefits */}
            <div className="space-y-3">
              {item.tujuan && renderInfoCard(<Target size={18} />, "Tujuan", item.tujuan, "green")}
              {item.manfaat && renderInfoCard(<TrendingUp size={18} />, "Manfaat", item.manfaat, "blue")}
            </div>

            {/* Limitations (for languages) */}
            {!isProgramming && item.keterbatasan && renderSection(
              "🎯 Area Pengembangan",
              <Clock size={18} />,
              <p className="text-gray-300 leading-relaxed">{item.keterbatasan}</p>,
              "orange"
            )}

            {/* Target (for languages) */}
            {!isProgramming && item.target && renderSection(
              "🎯 Target",
              <TrendingUp size={18} />,
              <p className="text-gray-300 leading-relaxed">{item.target}</p>,
              "green"
            )}

            {/* Call to Action */}
              <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-lg rounded-xl p-5 border border-cyan-500/30">
              <h3 className="font-bold text-white mb-3">Ingin Kolaborasi?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Tertarik menggunakan {item.nama} dalam proyek Anda?
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
              >
                Diskusikan Proyek
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            Terakhir diperbarui: {dataBahasa.metadata?.lastUpdated || "2024-01-15"}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/bahasa")}
              className="w-full sm:w-auto px-5 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Kembali ke Daftar
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
            >
              Hubungi Saya
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper component for icons
const Target = ({ size = 18 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default DetailBahasa;