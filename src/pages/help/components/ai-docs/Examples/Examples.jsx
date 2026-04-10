import React from "react";
import { 
  FaGraduationCap, 
  FaRobot,
  FaUser,
  FaArrowRight,
  FaCode,
  FaChevronRight
} from "react-icons/fa";
import { FileTree, TerminalWrap, FormattedResponse, SmartText } from "../Shared/UIComponents";

const Examples = ({ aiDocData }) => {
  const typeFileMapping = {
    "lookup_sederhana": ["data/AI-base.json"],
    "kalkulator": ["logic/utils/mathCalculator.js"],
    "quick_action": ["data/softskills.json"],
    "upload_lookup": ["logic/utils/fileProcessor.js", "logic/utils/dataLoader.js"],
    "nlp_pipeline": ["logic/utils/nluDataset.js", "logic/utils/enhancedKnowledgeBase.js", "logic/utils/nluProcessing.js"],
    "clarification": ["logic/utils/clarificationSystem.js"],
    "bilingual_interaction": ["logic/utils/translationEngine.js", "logic/utils/languageCorpus.js"],
    "sentiment_analysis": ["logic/utils/nluProcessing.js", "logic/utils/lexicalDatabase.js"]
  };

  return (
    <section id="examples" className="scroll-mt-8 space-y-10">
      <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-inner overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/10 shadow-lg">
              <FaGraduationCap className="text-2xl text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Contoh Pertanyaan & Cara Kerja
              </h2>
              <SmartText className="text-gray-400 text-sm mt-1">Pelajari mekanisme pemrosesan dan struktur data SaipulAI. inti: `logic/utils/`</SmartText>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2 px-1">
              <FaCode className="text-blue-400 text-sm" />
              Sistem Pemrosesan Inti
            </h3>
            <div className="grid gap-6">
              {(aiDocData?.contoh_pertanyaan_cara_kerja ?? []).map((ex, idx) => (
                <TerminalWrap key={idx} title={`Trace: ${ex.tipe}`} type={ex.tipe}>
                  <div className="space-y-6">
                    {/* Input View */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mt-1">
                        <FaUser className="text-xs text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Input User</div>
                        <div className="text-sm text-gray-200 bg-white/5 p-3 rounded-lg border border-white/5 italic">
                          "{ex.input}"
                        </div>
                      </div>
                    </div>

                    {/* Processing View */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 mt-1">
                        <FaRobot className="text-xs text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[11px] text-gray-500 mb-2 uppercase tracking-widest font-bold">Pipeline Execution</div>
                        <FormattedResponse text={ex.output} />
                        
                        {/* File Visualizer */}
                        {typeFileMapping[ex.tipe] && (
                          <div className="mt-5 border-t border-gray-800 pt-4">
                            <div className="text-[10px] text-gray-600 mb-2 uppercase tracking-tighter">Resources Involved:</div>
                            <FileTree items={typeFileMapping[ex.tipe]} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TerminalWrap>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Actions Card */}
            <div className="group bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl border border-white/5 p-6 hover:border-yellow-500/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <FaArrowRight className="text-yellow-400" />
                </div>
                <h4 className="font-bold text-gray-200">Quick Actions & Shortcuts</h4>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800 group-hover:bg-black/60 transition-all">
                  <code className="text-yellow-300 text-sm">"Tampilkan softskills"</code>
                  <SmartText className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Perintah ini memicu filter otomatis pada data layer untuk mengembalikan semua entri dari file `softskills.json` secara instan.
                  </SmartText>
                </div>
              </div>
            </div>

            {/* Math Support Card */}
            <div className="bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <FaCode className="text-indigo-400" />
                </div>
                <h4 className="font-bold text-gray-200">Kalkulator Matematika (mathjs)</h4>
              </div>
              <div className="grid gap-3">
                {[
                  { input: "2 + 2", desc: "Operasi dasar" },
                  { input: "sin(45) + cos(45)", desc: "Fungsi trigonometri" },
                  { input: "log(100)", desc: "Logaritma" },
                  { input: "integral x^3 dari 0 sampai 1", desc: "Kalkulus" },
                ].map((example, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <code className="text-xs text-blue-300">{example.input}</code>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{example.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Utils Card */}
            <div className="bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-2xl border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <FaChevronRight className="text-rose-400" />
                </div>
                <h4 className="font-bold text-gray-200">Konversi & Utilitas</h4>
              </div>
              <div className="space-y-2">
                {[
                  "100°C ke Fahrenheit",
                  "100 USD ke IDR", 
                  "Statistik dari [1,2,3,4,5]",
                  "Konversi waktu 3600 detik ke jam"
                ].map((conv, idx) => (
                  <div key={idx} className="text-sm text-gray-400 flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                    {conv}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Examples;
