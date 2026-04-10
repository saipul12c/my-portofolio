import React from "react";
import { 
  FaHistory, 
  FaCode, 
  FaFolderOpen, 
  FaFileAlt, 
  FaTools, 
  FaPlusCircle,
  FaCheckCircle
} from "react-icons/fa";
import { FormattedText, FileTree, detectFiles } from "../Shared/UIComponents";

const Changelog = ({ aiDocData }) => {
  // Utility to determine change category based on description
  const getCategory = (text) => {
    const t = text.toLowerCase();
    if (t.includes('perbaikan') || t.includes('fix') || t.includes('bug')) return { label: 'FIX', icon: <FaTools className="text-rose-400" />, color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' };
    if (t.includes('rilis') || t.includes('release') || t.includes('versi')) return { label: 'RELEASE', icon: <FaCheckCircle className="text-emerald-400" />, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
    if (t.includes('peningkatan') || t.includes('advanced') || t.includes('implementasi')) return { label: 'FEATURE', icon: <FaPlusCircle className="text-blue-400" />, color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' };
    return { label: 'UPDATE', icon: <FaCode className="text-purple-400" />, color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
  };

  return (
    <section id="changelog" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-white/5 p-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-10 relative">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-white/10 shadow-lg">
            <FaHistory className="text-2xl text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase">
              Riwayat Perubahan
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-light italic">Log aktivitas pengembangan dan evolusi sistem SaipulAI</p>
          </div>
        </div>
        
        <div className="space-y-6 relative">
          {(aiDocData?.change_log_sesi_terakhir ?? []).map((change, idx) => {
            const cat = getCategory(change.description);
            const impactedItems = detectFiles(change.description);
            
            return (
              <div key={idx} className="group relative">
                {/* Connection Line */}
                {idx < (aiDocData?.change_log_sesi_terakhir?.length - 1) && (
                   <div className="absolute left-6 top-16 bottom-0 w-[1px] bg-gradient-to-b from-gray-700 to-transparent -mb-8 z-0" />
                )}
                
                <div className="flex gap-6 p-6 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all relative z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-2 rounded-lg border ${cat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 font-bold tracking-tighter uppercase whitespace-nowrap">
                      {change.date}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${cat.color} tracking-[0.1em]`}>
                        {cat.label}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    
                    <div className="text-gray-300 text-[13px] leading-relaxed">
                      <FormattedText>{change.description}</FormattedText>
                    </div>

                    {impactedItems.length > 0 && (
                      <div className="pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                          <FaFolderOpen className="text-orange-400/50" />
                          Artifacts Affected
                        </div>
                        <div className="bg-black/30 rounded-xl border border-white/5 p-4">
                           <FileTree items={impactedItems} root="./" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {!(aiDocData?.change_log_sesi_terakhir ?? []).length && (
            <div className="text-sm text-gray-500 italic p-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <FaFileAlt className="mx-auto mb-3 text-2xl opacity-20" />
              Tidak ada catatan perubahan terbaru. Untuk melaporkan bug, buka repository dan buat issue atau PR.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Changelog;
