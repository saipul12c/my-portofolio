import React from "react";
import {
  FaQuestionCircle,
  FaEdit,
  FaPlusCircle,
  FaSync,
  FaSitemap,
  FaTerminal,
  FaArrowRight,
  FaCode,
  FaChevronRight
} from "react-icons/fa";
import { FileTree, TerminalWrap } from "../Shared/UIComponents";

const Contribution = ({ aiDocData }) => {
  const steps = [
    {
      id: "01",
      title: "Edit/Add JSON",
      desc: "Modifikasi basis pengetahuan di folder data/.",
      icon: <FaEdit />,
      color: "from-blue-500 to-cyan-500",
      details: ["Buka folder data/", "Pilih file yang relevan", "Update entry JSON"]
    },
    {
      id: "02",
      title: "Add Modules",
      desc: "Tambahkan logika baru di logic/utils/.",
      icon: <FaPlusCircle />,
      color: "from-purple-500 to-pink-500",
      details: ["Buat file .js baru", "Implementasi fungsi", "Ekspor modul"]
    },
    {
      id: "03",
      title: "Hot Reload",
      desc: "Simpan dan lihat perubahan secara instan.",
      icon: <FaSync />,
      color: "from-green-500 to-emerald-500",
      details: ["Simpan file (Ctrl+S)", "Cek terminal dev", "Refresh UI chatbot"]
    }
  ];

  const directoryStructure = [
    { type: "folder", name: "data", desc: "Knowledge base files (*.json)" },
    { type: "file", name: "AI-base.json", desc: "General knowledge entries" },
    { type: "file", name: "softskills.json", desc: "Softskills related data" },
    { type: "folder", name: "logic", desc: "Core chatbot logic" },
    { type: "folder", name: "utils", desc: "Utility modules & helpers" },
    { type: "file", name: "nluProcessing.js", desc: "NLU Core processing" },
    { type: "folder", name: "hooks", desc: "Custom React hooks for UI" },
    { type: "file", name: "useChatbot.js", desc: "Main chatbot controller" },
    { type: "file", name: "config.js", desc: "Global system configuration" }
  ];

  return (
    <section id="contribution" className="scroll-mt-8 space-y-8">
      <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-inner relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-4 mb-10 relative">
          <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-white/10 shadow-lg">
            <FaQuestionCircle className="text-2xl text-violet-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Cara Kontribusi & Pengembangan
            </h2>
            <p className="text-gray-400 text-sm mt-1">Panduan teknis untuk memperluas kecerdasan SaipulAI</p>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10" />
              <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} shadow-lg text-white`}>
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-white/5 group-hover:text-white/10 transition-colors uppercase italic tracking-tighter">
                    {step.id}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-200 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{step.desc}</p>

                <ul className="space-y-2 border-t border-white/5 pt-4">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2 text-[11px] text-gray-400">
                      <FaArrowRight className="text-[8px] text-violet-500/50" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 rounded-full bg-gray-900 border border-white/5 flex items-center justify-center">
                    <FaChevronRight className="text-[8px] text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* File Explorer Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaSitemap className="text-violet-400" />
              Source Explorer
            </h3>
            <div className="bg-black/20 rounded-2xl border border-white/5 p-6 h-full">
              <p className="text-xs text-gray-500 mb-6 leading-relaxed italic border-l-2 border-violet-500/30 pl-4">
                "SaipulAI menggunakan arsitektur modular. Pastikan setiap penambahan data atau logika mengikuti struktur folder yang telah ditentukan untuk integrasi otomatis."
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-3">Struktur Arsitektur</h4>
                  <FileTree items={directoryStructure} />
                </div>

                {aiDocData?.ai_nlp_file_locations && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 mb-3">Map Modul AI/NLP Inti</h4>
                    <FileTree
                      items={aiDocData.ai_nlp_file_locations.files.map(f => ({ type: 'file', name: f, desc: 'Core logic' }))}
                      root={aiDocData.ai_nlp_file_locations.path}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dev Terminal Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <FaTerminal className="text-green-500" />
              Development Output
            </h3>
            <div className="space-y-6">
              <TerminalWrap title="Runtime Environment" type="Node.js / Vite" status="active">
                <div className="text-[12px] space-y-1">
                  <div className="text-green-400 flex gap-2">
                    <span className="text-gray-600">➜</span>
                    <span>Local:</span>
                    <span className="underline">https://syaiful-mukmin.netlify.app/</span>
                  </div>
                  <div className="text-gray-500">➜ Network: use --host to expose</div>
                  <div className="mt-4 text-white">
                    <span className="text-green-500 font-bold">VITE v5.0.0</span>
                    <span className="ml-2 text-gray-400">ready in 452ms</span>
                  </div>
                  <div className="mt-2 text-blue-400/80">
                    [HMR] <span className="text-gray-400">updates detected in lexicalDatabase.js...</span>
                  </div>
                  <div className="text-gray-500 italic mt-1">
                    Hot Module Replacement (HMR) active.
                  </div>
                </div>
              </TerminalWrap>

              <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <FaCode className="text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-tighter mb-2">Editor Integration</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Gunakan VS Code dengan ekstensi **Prettier** dan **ESLint** untuk memastikan konsistensi kode saat menambahkan modul baru.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Quick Contribution Commands</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 group hover:border-white/10 cursor-copy">
                    <code className="text-[11px] text-blue-400">git checkout -b feature/new-logic</code>
                    <span className="text-[9px] text-gray-600 uppercase">Branch</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5 group hover:border-white/10 cursor-copy">
                    <code className="text-[11px] text-blue-400">npm run test:nlp</code>
                    <span className="text-[9px] text-gray-600 uppercase">Test</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contribution;
