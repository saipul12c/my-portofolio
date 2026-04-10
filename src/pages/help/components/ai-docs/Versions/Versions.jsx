import React from "react";
import { Link } from 'react-router-dom';
import { FaCode, FaEye, FaExternalLinkAlt } from "react-icons/fa";
import VersionDetail from '../../../ai/AI_DocDetail';

const Versions = ({ historyData, aiDocData, showAllVersions, showRawJson }) => {
  return (
    <section id="versions" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <FaCode className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Riwayat Versi</h2>
        </div>

        <div className="space-y-6">
          {(historyData?.version_history_detail ?? []).slice(0,6).map((ver, idx) => (
            <div key={idx} className="bg-gray-900/50 rounded-lg border border-gray-800 p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    ver.type === 'terbaru' || ver.type === 'minor' ? 'bg-green-900/30 text-green-300' :
                    ver.type === 'security' ? 'bg-red-900/30 text-red-300' :
                    ver.type === 'patch' ? 'bg-blue-900/30 text-blue-300' :
                    'bg-purple-900/30 text-purple-300'
                  }`}>
                    {ver.version}
                  </span>
                  <span className="text-gray-400 text-sm">{ver.date}</span>
                  {(ver.supported || ver.type === 'terbaru') && (
                    <span className="px-2 py-1 bg-green-900/20 text-green-300 rounded text-xs">
                      {ver.type === 'terbaru' ? 'STABLE' : ver.type.toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* Tombol ke Halaman Detail Versi */}
                <Link 
                  to={`/help/docs/ai/${encodeURIComponent(ver.version)}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                >
                  <FaEye className="text-sm" />
                  Detail Versi
                </Link>
              </div>
              
              <ul className="space-y-2 mb-4">
                {(ver.features || []).slice(0, 3).map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Total fitur: {ver.features?.length || 0}</span>
                <Link 
                  to={`/help/docs/ai/${encodeURIComponent(ver.version)}`}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Lihat detail lengkap
                  <FaExternalLinkAlt className="text-xs" />
                </Link>
              </div>
            </div>
          ))}

          <div className="mt-4 text-sm text-gray-400">
            Versi mengikuti pola semantic versioning: <code className="bg-gray-800 px-1 rounded">MAJOR.MINOR.PATCH</code>. Perubahan besar, penambahan fitur, dan perbaikan kecil dicatat pada riwayat.
          </div>

          {showAllVersions && (
            <div className="mt-6">
              <VersionDetail data={historyData?.version_history_detail ?? []} />
            </div>
          )}

          {showRawJson && (
            <div className="mt-6 bg-gray-950/50 rounded-lg p-4 overflow-auto max-h-96 border border-gray-800">
              <pre className="text-xs text-gray-300">
                <code>{JSON.stringify(aiDocData, null, 2)}</code>
              </pre>
            </div>
          )}
          
          {/* Collapsible untuk versi lama */}
          <details className="group">
            <summary className="cursor-pointer list-none p-4 bg-gray-900/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Versi sebelumnya (v7.0.5 - v0.0.0)</span>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="mt-3 space-y-4">
              <div className="space-y-4">
                {(historyData?.version_history_detail ?? []).slice(6).map((ver, idx) => (
                  <div key={idx} className="pl-4 border-l border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                      <strong className="text-gray-300">{ver.version}</strong>
                      <span className="text-gray-500 text-sm">— {ver.summary || ver.notes || 'Deskripsi singkat tidak tersedia'}</span>
                      <span className="text-xs text-gray-600 px-2 py-1 bg-gray-800 rounded">
                        {ver.features ? ver.features.length : 0} fitur
                      </span>
                      <Link 
                        to={`/help/docs/ai/${encodeURIComponent(ver.version)}`}
                        className="ml-auto px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default Versions;
