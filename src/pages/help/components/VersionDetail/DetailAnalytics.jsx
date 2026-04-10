import React from 'react';
import { FaChartBar, FaChartPie, FaDatabase, FaBolt, FaMicrochip } from 'react-icons/fa';
import { TerminalWrap } from '../ai-docs/Shared/UIComponents';

const StatCard = ({ label, value, icon, color }) => (
  <div className="p-4 bg-gray-900/40 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
    <div className={`p-2 bg-${color}-500/10 rounded-lg text-${color}-400 mb-2`}>{icon}</div>
    <div className={`text-xl font-bold text-${color}-100`}>{value}</div>
    <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</div>
  </div>
);

const DetailAnalytics = ({ entry }) => {
  if (!entry.statistik_versi_ini && !entry.ai_nlp_statistik && !entry.ai_nlp_performa) return null;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const parseMs = (s) => {
    if (!s) return null;
    const str = String(s).toLowerCase();
    const rangeMatch = str.match(/(~)?\s*(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*ms/);
    if (rangeMatch) return (parseFloat(rangeMatch[2]) + parseFloat(rangeMatch[3])) / 2;
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

  return (
    <div className="space-y-8 mt-8 border-t border-white/5 pt-8">
      {/* Version Stats */}
      {entry.statistik_versi_ini && (
        <div id="statistik-versi" className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-3 text-gray-100">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><FaChartBar /></div>
            Statistik Versi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {entry.statistik_versi_ini.total_fitur && <StatCard label="Total Fitur" value={entry.statistik_versi_ini.total_fitur} icon={<FaBolt />} color="blue" />}
            {entry.statistik_versi_ini.knowledge_base_files && <StatCard label="KB Files" value={entry.statistik_versi_ini.knowledge_base_files} icon={<FaDatabase />} color="emerald" />}
            {entry.statistik_versi_ini.ukuran_bundle && <StatCard label="Bundle Size" value={entry.statistik_versi_ini.ukuran_bundle} icon={<FaMicrochip />} color="purple" />}
            {entry.statistik_versi_ini.waktu_respons && <StatCard label="Latency" value={entry.statistik_versi_ini.waktu_respons} icon={<FaBolt />} color="yellow" />}
          </div>
        </div>
      )}

      {/* AI/NLP Analytics */}
      {(entry.ai_nlp_statistik || entry.ai_nlp_performa) && (
        <div id="ai-nlp" className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><FaMicrochip /></div>
            <h3 className="text-xl font-bold text-gray-100">AI / NLP Core Analytics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Memory & Language Coverage */}
            <div className="space-y-6">
              {entry.ai_nlp_statistik?.memory_footprint && (
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Memory Footprint</span>
                    <span className="text-xs font-mono text-emerald-400">{entry.ai_nlp_statistik.memory_footprint}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${clamp((parseMb(entry.ai_nlp_statistik.memory_footprint) / 5) * 100, 2, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {entry.ai_nlp_statistik?.language_coverage && (
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-3">Language Coverage</span>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(entry.ai_nlp_statistik.language_coverage).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[9px] text-gray-600 uppercase font-bold">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm text-gray-300 font-mono">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            {entry.ai_nlp_performa && (
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block">Response Latency (ms)</span>
                {(() => {
                  const metrics = [
                    { label: 'Quick NLU', val: parseMs(entry.ai_nlp_performa.quick_nlu) },
                    { label: 'Comprehensive', val: parseMs(entry.ai_nlp_performa.comprehensive_nlu) },
                    { label: 'KB Lookup', val: parseMs(entry.ai_nlp_performa.knowledge_lookup) },
                    { label: 'End-to-End', val: parseMs(entry.ai_nlp_performa.end_to_end_response) }
                  ];
                  const maxVal = Math.max(...metrics.map(m => m.val || 0), 800);

                  return metrics.map((m, i) => m.val && (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-gray-400">{m.label}</span>
                        <span className="text-blue-400">{Math.round(m.val)}ms</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500/50 rounded-full"
                          style={{ width: `${(m.val / maxVal) * 100}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>

          {/* Supported Dataset */}
          {entry.ai_nlp_supported && (
            <div className="pt-4 mt-2 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Intents', data: entry.ai_nlp_supported.nlu_dataset_intents },
                { label: 'Advanced', data: entry.ai_nlp_supported.advanced_intents },
                { label: 'Entities', data: entry.ai_nlp_supported.entities },
                { label: 'Sentences', data: entry.ai_nlp_supported.sentence_types }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-sm font-mono text-purple-300">{Array.isArray(item.data) ? item.data.length : 0}</div>
                  <div className="text-[9px] text-gray-600 uppercase font-black">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailAnalytics;
