import React from 'react';
import { FaShieldAlt, FaUsers, FaChartLine, FaInfoCircle, FaDatabase } from 'react-icons/fa';
import { SmartText } from '../ai-docs/Shared/UIComponents';

const InfoSection = ({ title, icon, color, children, id }) => (
  <div id={id} className={`p-6 bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/5 space-y-4 hover:border-${color}-500/30 transition-all`}>
    <h3 className={`text-xl font-bold flex items-center gap-3 text-gray-100`}>
      <div className={`p-2 bg-${color}-500/10 rounded-lg text-${color}-400`}>{icon}</div>
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const DetailInformation = ({ entry }) => {
  return (
    <div className="space-y-6 mt-6">
      {/* Privacy & Security */}
      {entry.privasi_keamanan && (
        <InfoSection id="privacy-security" title="Privasi & Keamanan" icon={<FaShieldAlt />} color="red">
          <div className="text-gray-400 text-sm leading-relaxed font-light italic bg-red-500/5 p-4 rounded-xl border border-red-500/10">
            <SmartText>{entry.privasi_keamanan}</SmartText>
          </div>
        </InfoSection>
      )}

      {/* Contribution */}
      {entry.cara_kontribusi_menambah_data && entry.cara_kontribusi_menambah_data.length > 0 && (
        <InfoSection id="contribution" title="Cara Kontribusi" icon={<FaUsers />} color="emerald">
          <div className="grid grid-cols-1 gap-3">
            {entry.cara_kontribusi_menambah_data.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-gray-300 text-sm"><SmartText>{step}</SmartText></div>
              </div>
            ))}
          </div>
        </InfoSection>
      )}

      {/* Research History */}
      {entry.riwayat_penelitian_eksperimental && (
        <InfoSection id="research-history" title="Riwayat Penelitian" icon={<FaChartLine />} color="indigo">
          <div className="space-y-4">
            {entry.riwayat_penelitian_eksperimental.catatan && (
              <p className="text-gray-400 text-sm leading-relaxed">{entry.riwayat_penelitian_eksperimental.catatan}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.riwayat_penelitian_eksperimental.kategori_riset && (
                <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest block mb-2">Research Domains</span>
                  <ul className="space-y-1">
                    {entry.riwayat_penelitian_eksperimental.kategori_riset.map((cat, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full" /> {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.riwayat_penelitian_eksperimental.status && (
                <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex flex-col justify-center">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block mb-1">Status</span>
                  <p className="text-sm font-bold text-indigo-200">{entry.riwayat_penelitian_eksperimental.status}</p>
                </div>
              )}
            </div>
          </div>
        </InfoSection>
      )}

      {/* Roadmap */}
      {entry.future_roadmap && (
        <InfoSection id="future-roadmap" title="Future Roadmap" icon={<FaChartLine />} color="cyan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['short_term', 'medium_term', 'long_term'].map((term) => entry.future_roadmap[term] && (
              <div key={term} className="p-5 bg-gray-900/40 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">{term.replace('_', ' ')}</h4>
                <ul className="space-y-2">
                  {entry.future_roadmap[term].map((item, i) => (
                    <li key={i} className="text-xs text-gray-500 flex items-start gap-2 leading-relaxed">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0" />
                      <SmartText>{item}</SmartText>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </InfoSection>
      )}

      {/* Current Info */}
      {entry.informasi_saat_ini && (
        <InfoSection id="current-info" title="Informasi Saat Ini" icon={<FaInfoCircle />} color="orange">
          <div className="space-y-6">
            {entry.informasi_saat_ini.masalah_diperbaiki && entry.informasi_saat_ini.masalah_diperbaiki.length > 0 && (
              <div className="p-5 bg-red-500/5 rounded-2xl border border-red-500/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block mb-3">Patched Vulnerabilities</span>
                <ul className="space-y-2">
                  {entry.informasi_saat_ini.masalah_diperbaiki.map((issue, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-center gap-3">
                      <span className="text-red-500">✓</span> {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {entry.informasi_saat_ini.ringkasan_singkat && (
              <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-3">Executive Summary</span>
                <div className="text-sm text-gray-400 leading-relaxed italic">"<SmartText>{entry.informasi_saat_ini.ringkasan_singkat}</SmartText>"</div>
              </div>
            )}
          </div>
        </InfoSection>
      )}

      {/* KB Sources */}
      {entry.sumber_data_knowledge_base && entry.sumber_data_knowledge_base.length > 0 && (
        <InfoSection id="kb-sources" title="Knowledge Base Core" icon={<FaDatabase />} color="purple">
          <div className="flex flex-wrap gap-2">
            {entry.sumber_data_knowledge_base.map((source, idx) => (
              <div key={idx} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 text-[11px] font-mono tracking-tighter">
                {source}
              </div>
            ))}
          </div>
        </InfoSection>
      )}
    </div>
  );
};

export default DetailInformation;
