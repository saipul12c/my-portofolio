import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import docsData from "./data/docsSections.json";

export default function HelpDocsItem() {
  const [openIndex, setOpenIndex] = useState(null);
  const [docsSections, setDocsSections] = useState([]);

  useEffect(() => {
    setDocsSections(docsData);
  }, []);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 🎨 Warna tag acak tapi konsisten (berdasarkan hash nama tag)
  const getTagColor = (tag) => {
    const colors = [
      "bg-blue-100/60 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      "bg-purple-100/60 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700",
      "bg-pink-100/60 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-300 dark:border-pink-700",
      "bg-green-100/60 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-700",
      "bg-yellow-100/60 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
      "bg-orange-100/60 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-700",
      "bg-teal-100/60 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-700",
      "bg-red-100/60 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700",
    ];
    const index = tag
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-800 dark:text-gray-100 flex flex-col items-center py-20 px-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mb-12"
      >
        <div className="flex justify-center mb-4">
          <Icons.BookOpen className="text-blue-400 animate-pulse" size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Dokumentasi 📚
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Semua panduan dan insight buat kamu memahami platform ini — dari dasar, fitur, sampai integrasi tingkat lanjut.
        </p>
      </motion.div>

      {/* Docs Sections */}
      <div className="w-full max-w-3xl space-y-4">
        {docsSections.map((section, index) => {
          const IconComponent = Icons[section.icon] || Icons.BookOpen;

          return (
            <motion.div
              key={section.id || index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/70 dark:bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-md border border-blue-100/30 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center p-4 text-left group"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="text-blue-400" size={22} />
                  <span className="text-lg font-semibold text-blue-500 group-hover:text-purple-500 transition-colors">
                    {section.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icons.ChevronDown size={20} className="text-blue-400" />
                </motion.div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5 text-gray-600 dark:text-gray-300 space-y-4"
                  >
                    {/* Deskripsi */}
                    <p className="leading-relaxed text-base">{section.content}</p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                      {section.author && (
                        <span className="bg-gradient-to-r from-blue-100/70 to-purple-100/70 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-700/50 shadow-sm hover:scale-105 transition-transform">
                          ✍️ {section.author}
                        </span>
                      )}
                      {section.version && (
                        <span className="bg-gradient-to-r from-pink-100/70 to-orange-100/70 dark:from-pink-900/40 dark:to-orange-900/40 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full border border-pink-200/60 dark:border-pink-700/50 shadow-sm hover:scale-105 transition-transform">
                          🔖 Versi {section.version}
                        </span>
                      )}
                      {section.estimatedReadTime && (
                        <span className="bg-gradient-to-r from-green-100/70 to-teal-100/70 dark:from-green-900/40 dark:to-teal-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200/60 dark:border-green-700/50 shadow-sm hover:scale-105 transition-transform">
                          ⏱️ {section.estimatedReadTime}
                        </span>
                      )}
                    
                      {/* 🎨 Tag warna-warni */}
                      {section.tags &&
                        section.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 border rounded-full transition-transform hover:scale-105 ${getTagColor(
                              tag
                            )}`}
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>


                    {/* Subsections */}
                    {section.subsections?.length > 0 && (
                      <div className="mt-4 border-l-2 border-purple-300 dark:border-purple-500 pl-4 space-y-4">
                        {section.subsections.map((sub, subIndex) => (
                          <div key={subIndex}>
                            <h3 className="font-semibold text-purple-500 mb-1">
                              {sub.subtitle}
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                              {sub.details}
                            </p>

                            {sub.tips && (
                              <p className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-2 rounded-md border border-blue-200 dark:border-blue-700">
                                💡 {sub.tips}
                              </p>
                            )}

                            {sub.warning && (
                              <p className="text-xs bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-2 rounded-md border border-red-200 dark:border-red-700">
                                ⚠️ {sub.warning}
                              </p>
                            )}

                            {sub.examples && (
                              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 mt-2">
                                <strong>🧩 Contoh:</strong> {sub.examples}
                              </div>
                            )}

                            {sub.codeSnippet && (
                              <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded-lg overflow-x-auto border border-gray-700 mt-2">
                                <code>{sub.codeSnippet}</code>
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Changelog */}
                    {section.changelog?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">
                          📝 Riwayat Pembaruan
                        </h4>
                        <ul className="text-xs space-y-1">
                          {section.changelog.map((log, i) => (
                            <li key={i}>
                              <span className="text-gray-400">
                                {log.date} —{" "}
                              </span>
                              {log.changes}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Docs */}
                    {section.relatedDocs?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">
                          🔗 Terkait
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.relatedDocs.map((doc, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-md border border-blue-200 dark:border-blue-800"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {section.resources?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">
                          📎 Sumber & Referensi
                        </h4>
                        <ul className="text-xs space-y-1">
                          {section.resources.map((res, i) => (
                            <li key={i}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                [{res.type}] {res.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Info tambahan */}
                    <div className="pt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 mt-4">
                      <p>🕒 Terakhir diperbarui: {section.lastUpdated}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center"
      >
        <p>
          Dibuat dengan <span className="text-blue-400">💙</span> dan sedikit{" "}
          <span className="text-purple-400">✨ keajaiban ✨</span> oleh tim yang peduli pengalaman pengguna.
        </p>
      </motion.footer>
    </div>
  );
}
