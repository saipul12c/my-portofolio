import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTag, FaUsers, FaDatabase, FaChevronRight } from 'react-icons/fa';
import { FileChips } from '../ai-docs/Shared/UIComponents';

const SidebarCard = ({ title, children, className = "" }) => (
  <div className={`bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl ${className}`}>
    <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const DetailSidebar = ({
  entry,
  prevVersion,
  nextVersion,
  formatDate,
  getReleaseDate,
  handleCopy,
  copied
}) => {
  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Version Metadata */}
      <SidebarCard title="Release Info">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl text-gray-400"><FaCalendarAlt size={14} /></div>
            <div>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Released On</div>
              <div className="text-gray-200 text-sm font-medium">{formatDate(getReleaseDate(entry))}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl text-gray-400"><FaTag size={14} /></div>
            <div>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Release Type</div>
              <div className="text-gray-200 text-sm font-medium capitalize">{entry.type || 'Standard'}</div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl text-gray-400 mt-0.5"><FaUsers size={14} /></div>
            <div>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Contributors</div>
              <div className="text-gray-300 text-xs leading-relaxed mt-1">
                {entry.contributors && entry.contributors.length > 0
                  ? entry.contributors.join(', ')
                  : 'Saipul Core Team'}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-white/5 flex flex-col gap-2">
          <button
            onClick={() => handleCopy(entry.version)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-xl text-xs font-bold transition-all"
          >
            {copied ? 'Copied to Clipboard! ✓' : 'Copy Version String'}
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            {prevVersion && (
              <Link
                to={`/help/docs/ai/${prevVersion.version}`}
                className="flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-[10px] font-bold transition-all border border-white/5"
              >
                ‹ Old
              </Link>
            )}
            {nextVersion && (
              <Link
                to={`/help/docs/ai/${nextVersion.version}`}
                className="flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-[10px] font-bold transition-all border border-white/5"
              >
                Next ›
              </Link>
            )}
          </div>
        </div>
      </SidebarCard>

      {/* Tech Resources */}
      <SidebarCard title="Technical Resources">
        <div id="notes">
          <span className="text-[9px] font-bold text-gray-600 uppercase mb-2 block">Developer Notes</span>
          <p className="text-[11px] text-gray-500 leading-relaxed italic">{entry.notes || 'No critical notes for this release build.'}</p>
        </div>

        <div id="related-files" className="pt-2">
          <span className="text-[9px] font-bold text-gray-600 uppercase mb-2 block">Impacted Modules</span>
          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {(() => {
              let files = [];
              if (Array.isArray(entry.related_files)) files = entry.related_files;
              else if (Array.isArray(entry.ai_nlp_file_locations)) files = entry.ai_nlp_file_locations;
              else if (entry.ai_nlp_file_locations?.files) {
                const p = entry.ai_nlp_file_locations.path || '';
                files = entry.ai_nlp_file_locations.files.map(f => `${p}${p.endsWith('/') ? '' : '/'}${f}`);
              }

              return files.length > 0 ? (
                <FileChips text={files.join(' ')} />
              ) : (
                <span className="text-[10px] text-gray-700 italic">No manual traces listed.</span>
              );
            })()}
          </div>
        </div>
      </SidebarCard>

      {/* Navigation / TOC */}
      <SidebarCard title="Quick Navigation" className="hidden lg:block">
        <nav className="flex flex-col gap-0.5">
          {[
            { id: "features", label: "Fitur & Perubahan" },
            { id: "breaking-changes", label: "Breaking Changes" },
            { id: "changelog", label: "Full Changelog", condition: entry.changelog },
            { id: "bilingual-enhancements", label: "Bilingual System", condition: entry.bilingual_enhancements },
            { id: "response-templates", label: "Templates", condition: entry.response_templates },
            { id: "troubleshooting", label: "Troubleshooting", condition: entry.troubleshooting_error },
            { id: "privacy-security", label: "Privacy Core", condition: entry.privasi_keamanan },
            { id: "contribution", label: "Contribution", condition: entry.cara_kontribusi_menambah_data },
            { id: "research-history", label: "Research", condition: entry.riwayat_penelitian_eksperimental },
            { id: "future-roadmap", label: "Roadmap", condition: entry.future_roadmap },
            { id: "configuration", label: "Config", condition: entry.pengaturan_konfigurasi },
            { id: "usage-examples", label: "Benchmarks", condition: entry.contoh_pertanyaan_cara_kerja },
            { id: "statistik-versi", label: "Statistics", condition: entry.statistik_versi_ini },
            { id: "ai-nlp", label: "AI Backend", condition: entry.ai_nlp_statistik || entry.ai_nlp_performa },
          ].map(item => (item.condition !== false) && (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group flex items-center justify-between py-2 text-[11px] text-gray-400 hover:text-blue-400 transition-all border-b border-white/[0.02] last:border-0"
            >
              <span>{item.label}</span>
              <FaChevronRight size={8} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-1" />
            </a>
          ))}
        </nav>
      </SidebarCard>
    </div>
  );
};

export default DetailSidebar;
