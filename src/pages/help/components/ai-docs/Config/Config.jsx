import React from "react";
import { FaCogs, FaInfoCircle, FaTerminal, FaTools } from "react-icons/fa";
import { DEFAULT_SETTINGS } from "../../../../../components/helpbutton/chat/config";
import { SmartText, TerminalWrap, FileChips } from "../Shared/UIComponents";

const Config = () => {
  return (
    <section id="config" className="scroll-mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <FaCogs className="text-8xl rotate-12 transition-transform duration-1000 group-hover:rotate-45" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl shadow-lg shadow-orange-500/20">
              <FaCogs className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Pengaturan & Konfigurasi
              </h2>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <FaTerminal className="text-[10px]" />
                Kustomisasi perilaku asisten melalui `config.js`
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Status</span>
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ACTIVE ENGINE
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors md:col-span-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">File Konfigurasi</span>
              <code className="text-blue-300 text-xs font-mono">src/components/helpbutton/chat/config.js</code>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Column: Explorer/Guide */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-400" />
              Panduan Konfigurasi
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl hover:bg-blue-500/10 transition-all group/card">
                <h4 className="text-sm font-semibold text-blue-300 mb-1 group-hover/card:text-blue-200">Mode Kreatif</h4>
                <SmartText className="text-xs text-gray-400 leading-relaxed">
                  Aktifkan `creativeMode` untuk memberikan respon yang lebih deskriptif dan emosional. Bagus untuk persona *masterpiece*.
                </SmartText>
              </div>

              <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl hover:bg-purple-500/10 transition-all group/card">
                <h4 className="text-sm font-semibold text-purple-300 mb-1 group-hover/card:text-purple-200">Keamanan Data</h4>
                <SmartText className="text-xs text-gray-400 leading-relaxed">
                  Gunakan `privacyMode` untuk membatasi penyimpanan log di *localStorage*. Ini menjaga data percakapan tetap privat.
                </SmartText>
              </div>

              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl hover:bg-green-500/10 transition-all group/card">
                <h4 className="text-sm font-semibold text-green-300 mb-1 group-hover/card:text-green-200">Peningkatan NLP</h4>
                <SmartText className="text-xs text-gray-400 leading-relaxed">
                  Set `aiModel` ke `enhanced` untuk akses fitur *sentiment analysis* dan *context mapping* yang lebih akurat.
                </SmartText>
              </div>
            </div>
          </div>

          <div className="p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-yellow-500/20 rounded-lg">
                <FaTools className="text-yellow-500 text-sm" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-yellow-500 mb-1">Developer Tip</h4>
                <p className="text-xs text-gray-400 leading-relaxed italic">
                  "Untuk perubahan drastis pada logika inti, pastikan file `data/AIDoc/data.json` sinkron dengan konfigurasi Anda agar asisten memberikan info yang konsisten."
                </p>
                <FileChips text="src/data/AIDoc/data.json" className="mt-2 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="xl:col-span-3">
          <TerminalWrap 
            title="default_config.json" 
            type="CONFIG" 
            status="active"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/40 rounded-lg p-1 border border-white/5">
                <pre className="text-[11px] leading-relaxed text-blue-200/90 font-mono scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent overflow-x-auto p-4 custom-scrollbar">
                  <code>{JSON.stringify(DEFAULT_SETTINGS, null, 2)}</code>
                </pre>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold tracking-tighter">TOTAL KEYS</span>
                  <span className="text-sm font-mono text-gray-300">{Object.keys(DEFAULT_SETTINGS).length} Nodes</span>
                </div>
                <div className="w-[1px] h-8 bg-gray-800" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold tracking-tighter">FORMAT</span>
                  <span className="text-sm font-mono text-gray-300">JSON5 Ready</span>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-[11px] font-mono text-gray-400 transition-colors flex items-center gap-2 border border-gray-700">
                <FaCogs className="text-[10px]" />
                Edit Config
              </button>
            </div>
          </TerminalWrap>
          
          <div className="mt-4 p-4 border border-dashed border-gray-800 rounded-xl text-center">
            <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
              Last Synced: {new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Config;
