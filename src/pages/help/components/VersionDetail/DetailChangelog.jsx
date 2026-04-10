import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaCheckCircle, FaStar, FaBug, FaGlobe } from 'react-icons/fa';
import { SmartText } from '../ai-docs/Shared/UIComponents';

const DetailChangelog = ({ entry }) => {
  if (!entry.changelog && !entry.bilingual_enhancements) return null;

  return (
    <div className="space-y-6 mt-6">
      {/* Changelog Section */}
      {entry.changelog && (
        <div id="changelog" className="bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/5 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg"><FaCheckCircle className="text-green-500" /></div>
            Changelog Detail
          </h3>

          <div className="space-y-8">
            {entry.changelog.new_features && entry.changelog.new_features.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-green-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FaStar size={10} /> Fitur Baru
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.changelog.new_features.map((feature, idx) => (
                    <div key={idx} className="group p-4 bg-gray-900/40 rounded-xl border border-white/5 hover:border-green-500/30 transition-all">
                      <div className="text-gray-300 text-sm"><SmartText>{feature}</SmartText></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.changelog.enhancements && entry.changelog.enhancements.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FaCode size={10} /> Peningkatan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.changelog.enhancements.map((enh, idx) => (
                    <div key={idx} className="p-4 bg-gray-900/40 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
                      <div className="text-gray-300 text-sm"><SmartText>{enh}</SmartText></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.changelog.bug_fixes && entry.changelog.bug_fixes.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FaBug size={10} /> Perbaikan Bug
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.changelog.bug_fixes.map((fix, idx) => (
                    <div key={idx} className="p-4 bg-gray-900/40 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all">
                      <div className="text-gray-300 text-sm"><SmartText>{fix}</SmartText></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bilingual Enhancements */}
      {entry.bilingual_enhancements && (
        <div id="bilingual-enhancements" className="bg-gradient-to-br from-gray-800/30 to-blue-900/10 rounded-2xl border border-blue-900/20 p-6">
          <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg"><FaGlobe className="text-blue-400" /></div>
            Bilingual System Advancements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-100">
            {entry.bilingual_enhancements.language_detection && (
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-blue-200 mb-3 uppercase tracking-wider">Language Detection</h4>
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed italic">"{entry.bilingual_enhancements.language_detection.accuracy_improvement}"</p>
                  <div className="pt-2 border-t border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">Supported Extensions</div>
                    <div className="flex flex-wrap gap-2">
                      {entry.bilingual_enhancements.language_detection.supported_languages?.map((lang, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] border border-blue-500/20">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {entry.bilingual_enhancements.response_generation && (
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-blue-200 mb-3 uppercase tracking-wider">Response Generation</h4>
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">{entry.bilingual_enhancements.response_generation.translation_quality}</p>
                  <ul className="space-y-2 mt-2">
                    {entry.bilingual_enhancements.response_generation.features?.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-gray-500">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                        <SmartText>{f}</SmartText>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {entry.bilingual_enhancements.integration && (
            <div className="mt-6 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <h4 className="text-xs font-bold text-blue-400 mb-3 uppercase tracking-widest">Core Integration Modules</h4>
              <div className="flex flex-wrap gap-2">
                {entry.bilingual_enhancements.integration.modules?.map((m, idx) => (
                  <code key={idx} className="text-[10px] bg-black/40 px-2 py-1 rounded border border-white/5 text-gray-300 font-mono">{m}</code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailChangelog;
