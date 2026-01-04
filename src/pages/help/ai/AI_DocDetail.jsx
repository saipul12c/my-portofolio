import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import historyData from '../../../data/AIDoc/riwayat/riwayat.json';
import { 
  FaArrowLeft, 
  FaCode, 
  FaDatabase, 
  FaCalendarAlt,
  FaTag,
  FaExclamationTriangle,
  FaUsers,
  FaChartBar,
  FaChartPie
} from 'react-icons/fa';

export default function AI_DocDetail() {
  const params = useParams();
  // support both :slug and :version param names (route may use either)
  const slugParam = params.slug || params.version || params.id || '';

  const versions = useMemo(() => historyData?.version_history_detail ?? [], []);

  const findBySlug = (s) => {
    if (!s) return null;
    // try exact match
    let found = versions.find((v) => v.version === s);
    if (found) return found;
    // try without leading v
    found = versions.find((v) => v.version.replace(/^v/i, '') === String(s).replace(/^v/i, ''));
    if (found) return found;
    // try slug normalized (lowercase, replace non-alphanum with '-')
    const norm = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return versions.find((v) => norm(v.version) === norm(s));
  };

  const entry = findBySlug(slugParam);

  const [copied, setCopied] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showBreaking, setShowBreaking] = useState(true);

  const norm = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // find index of current entry in versions for prev/next navigation
  const currentIndex = useMemo(() => {
    if (!entry) return -1;
    return versions.findIndex((v) => norm(v.version) === norm(entry.version));
  }, [entry, versions]);

  const prevVersion = currentIndex >= 0 && currentIndex + 1 < versions.length ? versions[currentIndex + 1] : null;
  const nextVersion = currentIndex > 0 ? versions[currentIndex - 1] : null;

  const getReleaseDate = (e) => {
    if (!e) return null;
    return e.date || e.last_update || null;
  };

  const formatDate = (d) => {
    try {
      if (!d) return 'Tidak tersedia';
      const dt = new Date(d);
      return dt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return d;
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: do nothing silently
    }
  };

  // helpers: parsing and chart utilities
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const parseMs = (s) => {
    if (!s) return null;
    const str = String(s).toLowerCase();
    // handle ranges like ~200–300ms or 200-300ms
    const rangeMatch = str.match(/(~)?\s*(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*ms/);
    if (rangeMatch) {
      const a = parseFloat(rangeMatch[2]);
      const b = parseFloat(rangeMatch[3]);
      return (a + b) / 2;
    }
    const singleMatch = str.match(/(~)?\s*(\d+(?:\.\d+)?)\s*ms/);
    if (singleMatch) return parseFloat(singleMatch[2]);
    return null;
  };
  const parseMb = (s) => {
    if (!s) return null;
    const str = String(s).toLowerCase();
    const mb = str.match(/(\d+(?:\.\d+)?)\s*mb/);
    if (mb) return parseFloat(mb[1]);
    const kb = str.match(/(\d+(?:\.\d+)?)\s*kb/);
    if (kb) return parseFloat(kb[1]) / 1024;
    return null;
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Versi tidak ditemukan</h2>
            <p className="text-gray-400 mb-6">
              Tidak ditemukan entri versi untuk <code className="bg-gray-900 px-3 py-1 rounded text-red-300">{slugParam || '(tidak ada parameter)'}</code>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/help/docs/ai" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:opacity-90 transition-opacity"
              >
                <FaArrowLeft /> Kembali ke Dokumentasi AI
              </Link>
              <Link 
                to="/help" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/70 transition-colors"
              >
                <FaArrowLeft /> Kembali ke Menu Bantuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine version type color
  const getTypeColor = (type) => {
    switch(type) {
      case 'terbaru': return 'from-green-600 to-emerald-600';
      case 'minor': return 'from-blue-600 to-cyan-600';
      case 'security': return 'from-red-600 to-orange-600';
      case 'patch': return 'from-purple-600 to-pink-600';
      case 'major': return 'from-yellow-600 to-amber-600';
      case 'lama': return 'from-gray-600 to-gray-700';
      case 'legacy': return 'from-gray-600 to-gray-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/help/docs/ai" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-6"
          >
            <FaArrowLeft /> Kembali ke Dokumentasi AI
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 bg-gradient-to-r ${getTypeColor(entry.type)} rounded-lg shadow-md`} aria-hidden>
                  <FaCode className="text-xl text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {entry.version}
                </h1>
              </div>
              <p className="text-gray-400">{entry.summary || 'Detail rilis versi'}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getTypeColor(entry.type)}`}>
                  {entry.type?.toUpperCase() || 'RELEASE'}
                </span>
                {entry.deprecated && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300">DEPRECATED</span>
                )}
              </div>
              {entry.supported && (
                <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">SUPPORTED</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Features */}
            <div id="features" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                  <FaCode className="text-blue-400" />
                  Fitur & Perubahan
                </h3>
                <button onClick={() => setShowFeatures(s => !s)} className="text-sm text-gray-400 hover:text-gray-200">
                  {showFeatures ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {showFeatures && (
                <> 
                  {entry.features && entry.features.length > 0 ? (
                    <ul className="space-y-3">
                      {entry.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 rounded bg-gray-900/40 border border-gray-800 text-sm text-gray-400">Tidak ada fitur atau perubahan yang tercantum untuk versi ini.</div>
                  )}
                </>
              )}
            </div>

            {/* Breaking Changes */}
            <div id="breaking-changes" className="bg-gradient-to-br from-gray-800/30 to-red-900/10 rounded-xl border border-red-900/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-300 flex items-center gap-2">
                  <FaExclamationTriangle />
                  Breaking Changes
                </h3>
                <button onClick={() => setShowBreaking(s => !s)} className="text-sm text-red-200/60 hover:text-red-200">
                  {showBreaking ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {showBreaking && (
                <div className="space-y-3">
                  {entry.breaking_changes && entry.breaking_changes.length > 0 ? (
                    entry.breaking_changes.map((change, idx) => (
                      <div key={idx} className="p-3 bg-red-900/10 border border-red-900/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-gray-300">{change}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded bg-red-900/10 border border-red-900/30 text-sm text-red-200">Tidak ada breaking changes yang tercatat untuk versi ini.</div>
                  )}
                </div>
              )}
            </div>

            {/* Changelog */}
            {entry.changelog && (
              <div id="changelog" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaCode className="text-green-400" />
                  Changelog
                </h3>
                <div className="space-y-4">
                  {entry.changelog.new_features && entry.changelog.new_features.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Fitur Baru</h4>
                      <ul className="space-y-2">
                        {entry.changelog.new_features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.changelog.enhancements && entry.changelog.enhancements.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">Peningkatan</h4>
                      <ul className="space-y-2">
                        {entry.changelog.enhancements.map((enh, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-300">{enh}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.changelog.bug_fixes && entry.changelog.bug_fixes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-orange-300 mb-2">Perbaikan Bug</h4>
                      <ul className="space-y-2">
                        {entry.changelog.bug_fixes.map((fix, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-300">{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bilingual Enhancements */}
            {entry.bilingual_enhancements && (
              <div id="bilingual-enhancements" className="bg-gradient-to-br from-gray-800/30 to-blue-900/10 rounded-xl border border-blue-900/30 p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                  <FaCode className="text-blue-400" />
                  Bilingual Enhancements
                </h3>
                <div className="space-y-4">
                  {entry.bilingual_enhancements.language_detection && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">Language Detection</h4>
                      <div className="space-y-2">
                        <p className="text-gray-300">{entry.bilingual_enhancements.language_detection.accuracy_improvement}</p>
                        <p className="text-gray-400 text-sm">Supported Languages: {entry.bilingual_enhancements.language_detection.supported_languages?.join(', ')}</p>
                        <p className="text-gray-400 text-sm">Methods: {entry.bilingual_enhancements.language_detection.detection_methods?.join(', ')}</p>
                        {entry.bilingual_enhancements.language_detection.features && (
                          <ul className="space-y-1 mt-2">
                            {entry.bilingual_enhancements.language_detection.features.map((f, idx) => (
                              <li key={idx} className="text-sm text-gray-300">• {f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                  {entry.bilingual_enhancements.response_generation && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">Response Generation</h4>
                      <div className="space-y-2">
                        <p className="text-gray-300">{entry.bilingual_enhancements.response_generation.translation_quality}</p>
                        <p className="text-gray-400 text-sm">Response Types: {entry.bilingual_enhancements.response_generation.response_types?.join(', ')}</p>
                        {entry.bilingual_enhancements.response_generation.features && (
                          <ul className="space-y-1 mt-2">
                            {entry.bilingual_enhancements.response_generation.features.map((f, idx) => (
                              <li key={idx} className="text-sm text-gray-300">• {f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                  {entry.bilingual_enhancements.integration && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">Integration</h4>
                      <div className="space-y-2">
                        {entry.bilingual_enhancements.integration.modules && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Modules:</p>
                            <ul className="space-y-1">
                              {entry.bilingual_enhancements.integration.modules.map((m, idx) => (
                                <li key={idx} className="text-sm text-gray-300">• {m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.bilingual_enhancements.integration.capabilities && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Capabilities:</p>
                            <ul className="space-y-1">
                              {entry.bilingual_enhancements.integration.capabilities.map((c, idx) => (
                                <li key={idx} className="text-sm text-gray-300">• {c}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response Templates */}
            {entry.response_templates && (
              <div id="response-templates" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaCode className="text-purple-400" />
                  Response Templates
                </h3>
                <div className="space-y-4">
                  {entry.response_templates.indonesian && entry.response_templates.indonesian.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Bahasa Indonesia</h4>
                      <ul className="space-y-2">
                        {entry.response_templates.indonesian.map((template, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">"{template}"</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.response_templates.english && entry.response_templates.english.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">English</h4>
                      <ul className="space-y-2">
                        {entry.response_templates.english.map((template, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">"{template}"</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.response_templates.bilingual_features && entry.response_templates.bilingual_features.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Bilingual Features</h4>
                      <ul className="space-y-2">
                        {entry.response_templates.bilingual_features.map((feature, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Troubleshooting */}
            {entry.troubleshooting_error && entry.troubleshooting_error.length > 0 && (
              <div id="troubleshooting" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-400" />
                  Troubleshooting & Error Handling
                </h3>
                <ul className="space-y-3">
                  {entry.troubleshooting_error.map((item, idx) => (
                    <li key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-300">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Privacy & Security */}
            {entry.privasi_keamanan && (
              <div id="privacy-security" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaDatabase className="text-red-400" />
                  Privasi & Keamanan
                </h3>
                <p className="text-gray-300">{entry.privasi_keamanan}</p>
              </div>
            )}

            {/* Contribution Guide */}
            {entry.cara_kontribusi_menambah_data && entry.cara_kontribusi_menambah_data.length > 0 && (
              <div id="contribution" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaUsers className="text-green-400" />
                  Cara Kontribusi & Menambah Data
                </h3>
                <ul className="space-y-2">
                  {entry.cara_kontribusi_menambah_data.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Research History */}
            {entry.riwayat_penelitian_eksperimental && (
              <div id="research-history" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-indigo-400" />
                  Riwayat Penelitian Eksperimental
                </h3>
                <div className="space-y-3">
                  {entry.riwayat_penelitian_eksperimental.catatan && (
                    <p className="text-gray-300">{entry.riwayat_penelitian_eksperimental.catatan}</p>
                  )}
                  {entry.riwayat_penelitian_eksperimental.kategori_riset && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Kategori Riset:</p>
                      <ul className="space-y-1">
                        {entry.riwayat_penelitian_eksperimental.kategori_riset.map((cat, idx) => (
                          <li key={idx} className="text-sm text-gray-300">• {cat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.riwayat_penelitian_eksperimental.bilingual_research && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Bilingual Research:</p>
                      <ul className="space-y-1">
                        {entry.riwayat_penelitian_eksperimental.bilingual_research.map((res, idx) => (
                          <li key={idx} className="text-sm text-gray-300">• {res}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.riwayat_penelitian_eksperimental.status && (
                    <p className="text-gray-400 text-sm mt-2">{entry.riwayat_penelitian_eksperimental.status}</p>
                  )}
                </div>
              </div>
            )}

            {/* Future Roadmap */}
            {entry.future_roadmap && (
              <div id="future-roadmap" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-cyan-400" />
                  Future Roadmap
                </h3>
                <div className="space-y-4">
                  {entry.future_roadmap.short_term && entry.future_roadmap.short_term.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2">Short Term</h4>
                      <ul className="space-y-2">
                        {entry.future_roadmap.short_term.map((item, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.future_roadmap.medium_term && entry.future_roadmap.medium_term.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2">Medium Term</h4>
                      <ul className="space-y-2">
                        {entry.future_roadmap.medium_term.map((item, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.future_roadmap.long_term && entry.future_roadmap.long_term.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2">Long Term</h4>
                      <ul className="space-y-2">
                        {entry.future_roadmap.long_term.map((item, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Information */}
            {entry.informasi_saat_ini && (
              <div id="current-info" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaDatabase className="text-orange-400" />
                  Informasi Saat Ini
                </h3>
                <div className="space-y-4">
                  {entry.informasi_saat_ini.masalah_diperbaiki && entry.informasi_saat_ini.masalah_diperbaiki.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-red-300 mb-2">Masalah yang Diperbaiki</h4>
                      <ul className="space-y-2">
                        {entry.informasi_saat_ini.masalah_diperbaiki.map((issue, idx) => (
                          <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.informasi_saat_ini.ringkasan_singkat && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">Ringkasan Singkat</h4>
                      <p className="text-gray-300">{entry.informasi_saat_ini.ringkasan_singkat}</p>
                    </div>
                  )}
                  {entry.informasi_saat_ini.catatan && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Catatan</h4>
                      <p className="text-gray-300">{entry.informasi_saat_ini.catatan}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Configuration Settings */}
            {entry.pengaturan_konfigurasi && (
              <div id="configuration" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaCode className="text-yellow-400" />
                  Pengaturan Konfigurasi
                </h3>
                <div className="space-y-4">
                  {entry.pengaturan_konfigurasi.default_settings && (
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-300 mb-2">Default Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {Object.entries(entry.pengaturan_konfigurasi.default_settings).map(([key, value]) => (
                          <div key={key} className="p-2 bg-gray-900/50 rounded-lg">
                            <span className="text-gray-400">{key}:</span> <span className="text-gray-200">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.pengaturan_konfigurasi.bilingual_settings && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">Bilingual Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {Object.entries(entry.pengaturan_konfigurasi.bilingual_settings).map(([key, value]) => (
                          <div key={key} className="p-2 bg-gray-900/50 rounded-lg">
                            <span className="text-gray-400">{key}:</span> <span className="text-gray-200">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.pengaturan_konfigurasi.catatan && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Catatan</h4>
                      <p className="text-gray-300">{entry.pengaturan_konfigurasi.catatan}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Examples */}
            {entry.contoh_pertanyaan_cara_kerja && entry.contoh_pertanyaan_cara_kerja.length > 0 && (
              <div id="usage-examples" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaCode className="text-teal-400" />
                  Contoh Pertanyaan & Cara Kerja
                </h3>
                <div className="space-y-3">
                  {entry.contoh_pertanyaan_cara_kerja.map((example, idx) => (
                    <div key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      {example.tipe && <p className="text-xs text-gray-500 mb-1">Tipe: {example.tipe}</p>}
                      {example.input && <p className="text-gray-300 mb-1"><strong>Input:</strong> {example.input}</p>}
                      {example.output && <p className="text-gray-300"><strong>Output:</strong> {example.output}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge Base Sources */}
            {entry.sumber_data_knowledge_base && entry.sumber_data_knowledge_base.length > 0 && (
              <div id="kb-sources" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaDatabase className="text-indigo-400" />
                  Sumber Data Knowledge Base
                </h3>
                <ul className="space-y-2">
                  {entry.sumber_data_knowledge_base.map((source, idx) => (
                    <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {source}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Features (for older versions) */}
            {entry.fitur_utama && entry.fitur_utama.length > 0 && (
              <div id="main-features" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <FaCode className="text-emerald-400" />
                  Fitur Utama
                </h3>
                <ul className="space-y-2">
                  {entry.fitur_utama.map((feature, idx) => (
                    <li key={idx} className="p-2 bg-gray-900/50 rounded-lg text-gray-300 text-sm">• {feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6 lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
            {/* Version Info Card */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Informasi Versi</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Tanggal Rilis</div>
                    <div className="text-gray-300">{formatDate(getReleaseDate(entry))}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaTag className="text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Tipe Rilis</div>
                    <div className="text-gray-300 capitalize">{entry.type || 'Standard'}</div>
                  </div>
                </div>
                
                {entry.contributors && entry.contributors.length > 0 ? (
                  <div className="flex items-start gap-3">
                    <FaUsers className="text-gray-500 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Kontributor</div>
                      <div className="text-gray-300">
                        {entry.contributors.join(', ')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <FaUsers className="text-gray-500 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Kontributor</div>
                      <div className="text-sm text-gray-400">Tidak ada kontributor yang tercantum untuk versi ini.</div>
                    </div>
                  </div>
                )}
              </div>
                {entry.config_location && (
                  <div className="flex items-center gap-3">
                    <FaTag className="text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Lokasi Konfigurasi</div>
                      <div className="text-gray-300 break-all">{entry.config_location}</div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleCopy(entry.version)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/60 rounded text-sm text-gray-100 hover:bg-gray-700/80">
                    {copied ? 'Tersalin ✓' : 'Salin Versi'}
                  </button>
                  {prevVersion && (
                    <Link to={`/help/docs/ai/${prevVersion.version}`} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700/30 rounded text-sm text-gray-200 hover:bg-gray-700/50">
                      ‹ {prevVersion.version}
                    </Link>
                  )}
                  {nextVersion && (
                    <Link to={`/help/docs/ai/${nextVersion.version}`} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700/30 rounded text-sm text-gray-200 hover:bg-gray-700/50">
                      {nextVersion.version} ›
                    </Link>
                  )}
                </div>
            </div>
          </div>

            {/* Related Data */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Data Terkait</h3>
              
              <div className="space-y-3">
                <div id="notes">
                  <div className="text-xs text-gray-500 mb-1">Catatan</div>
                  <p className="text-sm text-gray-400">{entry.notes || 'Tidak ada catatan untuk versi ini.'}</p>
                </div>
                
                {/* Related Files */}
                <div id="related-files">
                  <div className="text-xs text-gray-500 mb-2">File Terkait</div>
                  <div className="space-y-1">
                    {(() => {
                      // support various shapes: array of strings, object {path, files: []}, or legacy entry.ai_nlp_file_locations
                      let files = [];
                      if (Array.isArray(entry.related_files) && entry.related_files.length > 0) {
                        files = entry.related_files;
                      } else if (Array.isArray(entry.ai_nlp_file_locations)) {
                        files = entry.ai_nlp_file_locations;
                      } else if (entry.ai_nlp_file_locations && typeof entry.ai_nlp_file_locations === 'object') {
                        const p = entry.ai_nlp_file_locations.path || '';
                        const list = Array.isArray(entry.ai_nlp_file_locations.files) ? entry.ai_nlp_file_locations.files : [];
                        files = list.map((f) => (p ? `${p}${p.endsWith('/') ? '' : '/'}${f}` : f));
                      }
                      return files && files.length > 0 ? (
                        files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                            <FaDatabase className="text-green-400 text-xs" />
                            <code className="bg-gray-900/50 px-2 py-1 rounded text-xs truncate">{file}</code>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400">Tidak ada file terkait untuk versi ini.</div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Navigasi</h3>
              <div className="space-y-3">
                <div className="text-xs text-gray-400">Daftar Isi</div>
                <nav className="flex flex-col gap-2 mb-3">
                  <a href="#features" className="text-sm text-gray-300 hover:text-white">• Fitur & Perubahan</a>
                  <a href="#breaking-changes" className="text-sm text-gray-300 hover:text-white">• Breaking Changes</a>
                  {entry.changelog && <a href="#changelog" className="text-sm text-gray-300 hover:text-white">• Changelog</a>}
                  {entry.bilingual_enhancements && <a href="#bilingual-enhancements" className="text-sm text-gray-300 hover:text-white">• Bilingual Enhancements</a>}
                  {entry.response_templates && <a href="#response-templates" className="text-sm text-gray-300 hover:text-white">• Response Templates</a>}
                  {entry.troubleshooting_error && entry.troubleshooting_error.length > 0 && <a href="#troubleshooting" className="text-sm text-gray-300 hover:text-white">• Troubleshooting</a>}
                  {entry.privasi_keamanan && <a href="#privacy-security" className="text-sm text-gray-300 hover:text-white">• Privasi & Keamanan</a>}
                  {entry.cara_kontribusi_menambah_data && entry.cara_kontribusi_menambah_data.length > 0 && <a href="#contribution" className="text-sm text-gray-300 hover:text-white">• Kontribusi</a>}
                  {entry.riwayat_penelitian_eksperimental && <a href="#research-history" className="text-sm text-gray-300 hover:text-white">• Riwayat Riset</a>}
                  {entry.future_roadmap && <a href="#future-roadmap" className="text-sm text-gray-300 hover:text-white">• Future Roadmap</a>}
                  {entry.informasi_saat_ini && <a href="#current-info" className="text-sm text-gray-300 hover:text-white">• Info Saat Ini</a>}
                  {entry.pengaturan_konfigurasi && <a href="#configuration" className="text-sm text-gray-300 hover:text-white">• Konfigurasi</a>}
                  {entry.contoh_pertanyaan_cara_kerja && entry.contoh_pertanyaan_cara_kerja.length > 0 && <a href="#usage-examples" className="text-sm text-gray-300 hover:text-white">• Contoh Penggunaan</a>}
                  {entry.sumber_data_knowledge_base && entry.sumber_data_knowledge_base.length > 0 && <a href="#kb-sources" className="text-sm text-gray-300 hover:text-white">• Sumber KB</a>}
                  {entry.fitur_utama && entry.fitur_utama.length > 0 && <a href="#main-features" className="text-sm text-gray-300 hover:text-white">• Fitur Utama</a>}
                  <a href="#notes" className="text-sm text-gray-300 hover:text-white">• Catatan</a>
                  <a href="#related-files" className="text-sm text-gray-300 hover:text-white">• File Terkait</a>
                  <a href="#statistik-versi" className="text-sm text-gray-300 hover:text-white">• Statistik Versi</a>
                  <a href="#ai-nlp" className="text-sm text-gray-300 hover:text-white">• AI NLP</a>
                </nav>

                <Link 
                  to="/help/docs/ai" 
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:opacity-90 transition-opacity"
                >
                  Kembali ke Dokumentasi
                </Link>
                <Link 
                  to="/help" 
                  className="block w-full text-center px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/70 transition-colors"
                >
                  Menu Bantuan Utama
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Extended Sections */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div id="statistik-versi" className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-200 mb-4">Statistik Versi Ini</h3>
              {entry.statistik_versi_ini ? (
                <div className="space-y-4">
                  {/* Handle new structure with total_fitur, etc. */}
                  {entry.statistik_versi_ini.total_fitur && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800 text-center">
                        <div className="text-2xl font-bold text-blue-400">{entry.statistik_versi_ini.total_fitur}</div>
                        <div className="text-xs text-gray-400">Total Fitur</div>
                      </div>
                      {entry.statistik_versi_ini.knowledge_base_files && (
                        <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800 text-center">
                          <div className="text-2xl font-bold text-green-400">{entry.statistik_versi_ini.knowledge_base_files}</div>
                          <div className="text-xs text-gray-400">KB Files</div>
                        </div>
                      )}
                      {entry.statistik_versi_ini.ukuran_bundle && (
                        <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800 text-center">
                          <div className="text-2xl font-bold text-purple-400">{entry.statistik_versi_ini.ukuran_bundle}</div>
                          <div className="text-xs text-gray-400">Bundle Size</div>
                        </div>
                      )}
                      {entry.statistik_versi_ini.waktu_respons && (
                        <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800 text-center">
                          <div className="text-2xl font-bold text-yellow-400">{entry.statistik_versi_ini.waktu_respons}</div>
                          <div className="text-xs text-gray-400">Response Time</div>
                        </div>
                      )}
                    </div>
                  )}
                  {entry.statistik_versi_ini.total_versi_dokumentasi && (
                    <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 mb-1">Total Versi Dokumentasi</div>
                      <div className="text-gray-200 font-semibold">{entry.statistik_versi_ini.total_versi_dokumentasi}</div>
                    </div>
                  )}
                  {entry.statistik_versi_ini.rentang_waktu && (
                    <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                      <div className="text-sm text-gray-400 mb-1">Rentang Waktu</div>
                      <div className="text-gray-200">{entry.statistik_versi_ini.rentang_waktu}</div>
                    </div>
                  )}
                  {entry.statistik_versi_ini.bilingual_metrics && (
                    <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">Bilingual Metrics</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(entry.statistik_versi_ini.bilingual_metrics).map(([key, value]) => (
                          <div key={key} className="p-2 bg-gray-800/40 rounded">
                            <div className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</div>
                            <div className="text-gray-200 font-semibold">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Handle old structure with komponen_inti, etc. */}
                  {Array.isArray(entry.statistik_versi_ini.komponen_inti) && entry.statistik_versi_ini.komponen_inti.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Komponen Inti</div>
                      <ul className="space-y-2">
                        {entry.statistik_versi_ini.komponen_inti.map((item, idx) => (
                          <li key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(entry.statistik_versi_ini.modul_lanjutan) && entry.statistik_versi_ini.modul_lanjutan.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Modul Lanjutan</div>
                      <ul className="space-y-2">
                        {entry.statistik_versi_ini.modul_lanjutan.map((item, idx) => (
                          <li key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.statistik_versi_ini.catatan && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Catatan</div>
                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-300">{entry.statistik_versi_ini.catatan}</div>
                    </div>
                  )}
                  {!entry.statistik_versi_ini.total_fitur && !entry.statistik_versi_ini.komponen_inti && !entry.statistik_versi_ini.modul_lanjutan && !entry.statistik_versi_ini.catatan && (
                    <div className="text-sm text-gray-400">Tidak ada data statistik versi.</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400">Tidak ada data statistik versi.</div>
              )}
            </div>
            <div id="ai-nlp" className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-200 mb-4">Ringkasan & Grafik AI/NLP</h3>
              <div className="space-y-4">
                {/* Memory footprint */}
                <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><FaChartPie /> Memori</div>
                  <div className="text-sm text-gray-300 mb-2">{entry.ai_nlp_statistik?.memory_footprint || 'Tidak tersedia'}</div>
                  {(() => {
                    const mb = parseMb(entry.ai_nlp_statistik?.memory_footprint);
                    const percent = mb ? clamp((mb / 5) * 100, 2, 100) : 0; // normalize to 5MB cap
                    return (
                      <div className="h-2 w-full bg-gray-800 rounded">
                        <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded" style={{ width: `${percent}%` }} />
                      </div>
                    );
                  })()}
                </div>

                {/* Performance bars */}
                <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><FaChartBar /> Performa</div>
                  {(() => {
                    const quick = parseMs(entry.ai_nlp_performa?.quick_nlu || entry.ai_nlp_performa?.end_to_end_response);
                    const comp = parseMs(entry.ai_nlp_performa?.comprehensive_nlu);
                    const lookup = parseMs(entry.ai_nlp_performa?.knowledge_lookup);
                    const e2e = parseMs(entry.ai_nlp_performa?.end_to_end_response);
                    const max = Math.max(quick || 0, comp || 0, lookup || 0, e2e || 0, 800);
                    const bar = (label, val) => (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{label}</span><span>{val ? `${Math.round(val)}ms` : 'N/A'}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded">
                          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded" style={{ width: `${val && max ? clamp((val / max) * 100, 2, 100) : 0}%` }} />
                        </div>
                      </div>
                    );
                    return (
                      <div>
                        {bar('Quick NLU', quick)}
                        {bar('Comprehensive NLU', comp)}
                        {bar('Knowledge Lookup', lookup)}
                        {bar('End-to-End', e2e)}
                      </div>
                    );
                  })()}
                </div>

                {/* Supported counts */}
                {entry.ai_nlp_supported && Object.keys(entry.ai_nlp_supported).length > 0 && (
                  <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 mb-2">Dukungan Dataset</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-gray-800/40 rounded">
                        <div className="text-gray-400 text-xs">Intents (dasar)</div>
                        <div className="text-gray-200 font-semibold">{Array.isArray(entry.ai_nlp_supported.nlu_dataset_intents) ? entry.ai_nlp_supported.nlu_dataset_intents.length : 0}</div>
                      </div>
                      <div className="p-2 bg-gray-800/40 rounded">
                        <div className="text-gray-400 text-xs">Intents (lanjutan)</div>
                        <div className="text-gray-200 font-semibold">{Array.isArray(entry.ai_nlp_supported.advanced_intents) ? entry.ai_nlp_supported.advanced_intents.length : 0}</div>
                      </div>
                      <div className="p-2 bg-gray-800/40 rounded">
                        <div className="text-gray-400 text-xs">Entities</div>
                        <div className="text-gray-200 font-semibold">{Array.isArray(entry.ai_nlp_supported.entities) ? entry.ai_nlp_supported.entities.length : 0}</div>
                      </div>
                      <div className="p-2 bg-gray-800/40 rounded">
                        <div className="text-gray-400 text-xs">Tipe Kalimat</div>
                        <div className="text-gray-200 font-semibold">{Array.isArray(entry.ai_nlp_supported.sentence_types) ? entry.ai_nlp_supported.sentence_types.length : 0}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Coverage */}
                {entry.ai_nlp_statistik?.language_coverage && (
                  <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 mb-2">Language Coverage</div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {Object.entries(entry.ai_nlp_statistik.language_coverage).map(([key, value]) => (
                        <div key={key} className="p-2 bg-gray-800/40 rounded">
                          <div className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</div>
                          <div className="text-gray-200 font-semibold">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}