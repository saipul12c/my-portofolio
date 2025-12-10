import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import aiDocData from '../../../data/AIDoc/data.json';
import { 
  FaArrowLeft, 
  FaCode, 
  FaDatabase, 
  FaCalendarAlt,
  FaTag,
  FaExclamationTriangle,
  FaUsers
} from 'react-icons/fa';

export default function AI_DocDetail() {
  const params = useParams();
  // support both :slug and :version param names (route may use either)
  const slugParam = params.slug || params.version || params.id || '';

  const versions = useMemo(() => aiDocData?.version_history_detail ?? [], []);

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
                    <div className="text-gray-300">{formatDate(entry.date)}</div>
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
                    {entry.related_files && entry.related_files.length > 0 ? (
                      entry.related_files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <FaDatabase className="text-green-400 text-xs" />
                          <code className="bg-gray-900/50 px-2 py-1 rounded text-xs truncate">{file}</code>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">Tidak ada file terkait untuk versi ini.</div>
                    )}
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
                  <a href="#notes" className="text-sm text-gray-300 hover:text-white">• Catatan</a>
                  <a href="#related-files" className="text-sm text-gray-300 hover:text-white">• File Terkait</a>
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
      </div>
    </div>
  );
}