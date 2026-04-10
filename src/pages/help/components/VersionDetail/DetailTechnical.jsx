import React from 'react';
import { FaCode, FaTools, FaQuoteLeft, FaTerminal, FaCogs } from 'react-icons/fa';
import { SmartText, TerminalWrap } from '../ai-docs/Shared/UIComponents';

const DetailTechnical = ({ entry }) => {
  if (!entry.response_templates && !entry.troubleshooting_error && !entry.pengaturan_konfigurasi && !entry.contoh_pertanyaan_cara_kerja) return null;

  return (
    <div className="space-y-6 mt-6">
      {/* Response Templates */}
      {entry.response_templates && (
        <div id="response-templates" className="bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg"><FaQuoteLeft className="text-purple-400" /></div>
            Response Templates
          </h3>
          <div className="space-y-6">
            {entry.response_templates.indonesian && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bahasa Indonesia</span>
                <div className="grid grid-cols-1 gap-2">
                  {entry.response_templates.indonesian.map((t, i) => (
                    <div key={i} className="p-4 bg-black/30 rounded-xl border border-white/5 text-gray-300 text-sm italic font-serif">
                      "{t}"
                    </div>
                  ))}
                </div>
              </div>
            )}
            {entry.response_templates.english && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">English</span>
                <div className="grid grid-cols-1 gap-2">
                  {entry.response_templates.english.map((t, i) => (
                    <div key={i} className="p-4 bg-black/30 rounded-xl border border-white/5 text-gray-300 text-sm italic font-serif">
                      "{t}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Troubleshooting */}
      {entry.troubleshooting_error && entry.troubleshooting_error.length > 0 && (
        <div id="troubleshooting" className="bg-gray-800/20 rounded-2xl border border-white/5 p-6 transition-all hover:bg-gray-800/30">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg"><FaTools className="text-amber-500" /></div>
            Troubleshooting Framework
          </h3>
          <div className="space-y-3">
            {entry.troubleshooting_error.map((err, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-amber-500/5 group hover:bg-amber-500/10 border border-amber-500/10 rounded-xl transition-all">
                <FaTerminal size={14} className="mt-1 text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="text-gray-300 text-sm font-mono"><SmartText>{err}</SmartText></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Settings */}
      {entry.pengaturan_konfigurasi && (
        <div id="configuration" className="bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><FaCogs className="text-blue-400" /></div>
            Engine Configuration
          </h3>
          <div className="space-y-6">
            {entry.pengaturan_konfigurasi.default_settings && (
              <TerminalWrap title="Default Engine Settings" type="JSON" status="active">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {Object.entries(entry.pengaturan_konfigurasi.default_settings).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-1 border-b border-white/[0.03]">
                      <span className="text-blue-400 text-xs font-mono">{k}:</span>
                      <span className="text-gray-400 text-xs font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </TerminalWrap>
            )}
            {entry.pengaturan_konfigurasi.catatan && (
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="text-xs text-blue-300/80 italic font-mono"><SmartText>{entry.pengaturan_konfigurasi.catatan}</SmartText></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage Examples */}
      {entry.contoh_pertanyaan_cara_kerja && entry.contoh_pertanyaan_cara_kerja.length > 0 && (
        <div id="usage-examples" className="space-y-6">
          <h3 className="text-xl font-bold text-white px-2 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><FaTerminal /></div>
            Live Usage Benchmarks
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {entry.contoh_pertanyaan_cara_kerja.map((ex, i) => (
              <div key={i} className="bg-gray-800/20 rounded-2xl border border-white/5 p-6 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{ex.tipe || 'Example'}</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-gray-600 uppercase">Input Query</span>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-emerald-400">
                      {ex.input}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-gray-600 uppercase">Engine Output</span>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed">
                      <SmartText>{ex.output}</SmartText>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailTechnical;
