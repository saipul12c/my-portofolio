import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import historyData from '../../../data/AIDoc/riwayat/riwayat.json';
import { FaArrowLeft } from 'react-icons/fa';

// Import new modular components
import DetailHeader from '../components/VersionDetail/DetailHeader';
import DetailFeatures from '../components/VersionDetail/DetailFeatures';
import DetailChangelog from '../components/VersionDetail/DetailChangelog';
import DetailTechnical from '../components/VersionDetail/DetailTechnical';
import DetailInformation from '../components/VersionDetail/DetailInformation';
import DetailAnalytics from '../components/VersionDetail/DetailAnalytics';
import DetailSidebar from '../components/VersionDetail/DetailSidebar';

export default function AI_DocDetail() {
  const params = useParams();
  const slugParam = params.slug || params.version || params.id || '';

  const versions = useMemo(() => historyData?.version_history_detail ?? [], []);

  const norm = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const findBySlug = (s) => {
    if (!s) return null;
    let found = versions.find((v) => v.version === s);
    if (found) return found;
    found = versions.find((v) => v.version.replace(/^v/i, '') === String(s).replace(/^v/i, ''));
    if (found) return found;
    return versions.find((v) => norm(v.version) === norm(s));
  };

  const entry = findBySlug(slugParam);

  const [copied, setCopied] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showBreaking, setShowBreaking] = useState(true);

  const currentIndex = useMemo(() => {
    if (!entry) return -1;
    return versions.findIndex((v) => norm(v.version) === norm(entry.version));
  }, [entry, versions]);

  const prevVersion = currentIndex >= 0 && currentIndex + 1 < versions.length ? versions[currentIndex + 1] : null;
  const nextVersion = currentIndex > 0 ? versions[currentIndex - 1] : null;

  const getReleaseDate = (e) => (e ? (e.date || e.last_update || null) : null);

  const formatDate = (d) => {
    try {
      if (!d) return 'Tidak tersedia';
      return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return d; }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* silent fail */ }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'terbaru': return 'from-green-600 to-emerald-600';
      case 'minor': return 'from-blue-600 to-cyan-600';
      case 'security': return 'from-red-600 to-orange-600';
      case 'patch': return 'from-purple-600 to-pink-600';
      case 'major': return 'from-yellow-600 to-amber-600';
      case 'lama':
      case 'legacy': return 'from-gray-600 to-gray-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-200 mb-4">Versi tidak ditemukan</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Tidak ditemukan entri versi untuk <code className="bg-red-500/10 px-3 py-1 rounded text-red-300 border border-red-500/20">{slugParam || '(tidak ada parameter)'}</code>.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/help/docs/ai" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all shadow-lg">
                <FaArrowLeft /> Kembali ke Dokumentasi
              </Link>
              <Link to="/help" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 font-bold transition-all border border-white/5">
                Bantuan Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 py-12 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <DetailHeader entry={entry} getTypeColor={getTypeColor} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <DetailFeatures
              entry={entry}
              showFeatures={showFeatures}
              setShowFeatures={setShowFeatures}
              showBreaking={showBreaking}
              setShowBreaking={setShowBreaking}
            />

            <DetailChangelog entry={entry} />

            <DetailTechnical entry={entry} />

            <DetailInformation entry={entry} />

            <DetailAnalytics entry={entry} />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <DetailSidebar
              entry={entry}
              prevVersion={prevVersion}
              nextVersion={nextVersion}
              formatDate={formatDate}
              getReleaseDate={getReleaseDate}
              handleCopy={handleCopy}
              copied={copied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}