import React from "react";
import { FaLightbulb, FaBook } from "react-icons/fa";
import { SmartText } from "../Shared/UIComponents";

const Features = ({ aiDocData }) => {
  return (
    <section id="features" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <FaLightbulb className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Ringkasan & Fitur Utama</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
              <SmartText className="text-sm text-gray-400 leading-relaxed">
                **SaipulAI** adalah asisten lokal ringan yang menggabungkan `knowledge base` berbasis file JSON, modul kalkulator matematika, utilitas konversi, dan mekanisme saran otomatis. sumber utama: `src/components/helpbutton/chat/`
              </SmartText>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400" />
                Fitur Utama
              </h3>
              <ul className="space-y-2">
                {(aiDocData?.fitur_utama ?? [
                  "📚 Knowledge Base dinamis — sumber utama berasal dari file JSON",
                  "🧮 Kalkulator matematika canggih — fungsi trig, log, konstanta",
                  "🔁 Konversi & utilitas — suhu, mata uang, statistik",
                  "📁 Dukungan upload opsional — file diindeks ke knowledge base",
                  "💡 Saran kontekstual & quick actions berdasarkan topik",
                ]).map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-400">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      <SmartText>{feature}</SmartText>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5">
            <h3 className="font-semibold text-gray-300 mb-4">Arsitektur Sistem</h3>
            <div className="space-y-3">
              {[
                { layer: "Presentation Layer", tech: "React + Tailwind CSS", desc: "Antarmuka pengguna responsif" },
                { layer: "Logic Layer", tech: "Custom Hooks + Context API", desc: "Manajemen state dan logika bisnis" },
                { layer: "Data Layer", tech: "Local JSON + LocalStorage", desc: "Penyimpanan knowledge base dan cache" },
                { layer: "Utility Layer", tech: "Math.js + Custom Modules", desc: "Kalkulator, konverter, dan tools" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">{item.layer}</span>
                    <code className="text-xs text-blue-400">{item.tech}</code>
                  </div>
                  <SmartText className="text-[10px] text-gray-500 italic opacity-60">
                    {item.desc} (Logic: {item.tech})
                  </SmartText>
                </div>
              ))}
            </div>

            {/* AI NLP Ringkasan */}
            {aiDocData?.ai_nlp_ringkasan && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-300 mb-3">AI/NLP Pipeline</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Komponen Inti</h5>
                    <ul className="space-y-1">
                      {(aiDocData.ai_nlp_ringkasan.komponen_inti || []).map((comp, idx) => (
                        <li key={idx} className="text-[11px] text-gray-400">
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500">•</span>
                            <SmartText>{comp}</SmartText>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Modul Lanjutan</h5>
                    <ul className="space-y-1">
                      {(aiDocData.ai_nlp_ringkasan.modul_lanjutan || []).map((mod, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-gray-500">•</span>
                          {mod}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {aiDocData.ai_nlp_ringkasan.catatan && (
                    <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded">
                      <SmartText className="text-[11px] text-blue-300 leading-relaxed font-light">
                        {aiDocData.ai_nlp_ringkasan.catatan}
                      </SmartText>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
