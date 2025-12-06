import React from 'react';
import { useParams, Link } from 'react-router-dom';
import aiDocData from '../../../data/AIDoc/data.json';
import { FaArrowLeft, FaCode, FaDatabase } from 'react-icons/fa';

export default function AI_DocDetail() {
  const { slug } = useParams();

  const versions = aiDocData?.version_history_detail ?? [];

  const findBySlug = (s) => {
    if (!s) return null;
    // try exact match
    let found = versions.find((v) => v.version === s);
    if (found) return found;
    // try without leading v
    found = versions.find((v) => v.version.replace(/^v/i, '') === s.replace(/^v/i, ''));
    if (found) return found;
    // try slug normalized (lowercase, replace spaces/dots)
    const norm = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return versions.find((v) => norm(v.version) === norm(s));
  };

  const entry = findBySlug(slug);

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-gray-200 mb-3">Versi tidak ditemukan</h2>
          <p className="text-sm text-gray-400 mb-4">Tidak ditemukan entri versi untuk <code className="bg-gray-800 px-2 py-1 rounded">{slug}</code>.</p>
          <Link to="/help/ai-docs" className="inline-flex items-center gap-2 text-sm text-blue-300">
            <FaArrowLeft /> Kembali ke Dokumentasi AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{entry.version}</h1>
            <div className="text-sm text-gray-400">{entry.date} • {entry.type}</div>
          </div>
          <div>
            <Link to="/help/ai-docs" className="text-sm text-blue-300 inline-flex items-center gap-2"><FaArrowLeft /> Kembali</Link>
          </div>
        </div>

        {entry.summary && <p className="text-sm text-gray-300 mb-4">{entry.summary}</p>}

        {entry.features && entry.features.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-2"><FaCode /> Fitur</div>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              {entry.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        <div className="space-y-2 text-xs text-gray-400">
          {entry.contributors && <div className="flex items-center gap-2"><FaDatabase /> Contributors: {entry.contributors.join(', ')}</div>}
          {entry.notes && <div>Notes: {entry.notes}</div>}
          {entry.breaking_changes && entry.breaking_changes.length > 0 && (
            <div className="mt-3">
              <strong className="text-sm text-red-300">Breaking Changes:</strong>
              <ul className="list-disc list-inside text-sm text-red-200">
                {entry.breaking_changes.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
