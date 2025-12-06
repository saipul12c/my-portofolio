import React from 'react';
import { FaDatabase, FaCode } from 'react-icons/fa';

export default function VersionDetail({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-800 text-sm text-gray-400">
        Tidak ada riwayat versi tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((ver, idx) => (
        <div key={idx} className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-900/30 text-indigo-300">{ver.version}</span>
              <span className="text-gray-400 text-sm">{ver.date}</span>
              {ver.type && <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded">{ver.type}</span>}
              {ver.supported === false && (
                <span className="ml-2 px-2 py-1 bg-red-900/20 text-red-300 rounded text-xs">UNSUPPORTED</span>
              )}
            </div>
          </div>

          {ver.summary && <p className="text-sm text-gray-300 mb-3">{ver.summary}</p>}

          {ver.features && ver.features.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2 flex items-center gap-2"><FaCode /> Fitur</div>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {ver.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            {ver.contributors && <div className="flex items-center gap-2"><FaDatabase />{ver.contributors.join(', ')}</div>}
            {ver.notes && <div className="px-2 py-1 bg-gray-800 rounded">Notes: {ver.notes}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
