import React from "react";
import { FaChartLine } from "react-icons/fa";
import { CHATBOT_VERSION } from "../../../../../components/helpbutton/chat/config";
import { BarChart, Gauge } from "../Shared/Charts";
import { parseNumber } from "../Shared/utils";

const Stats = ({ aiDocData, versionStats }) => {
  return (
    <section id="stats" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <FaChartLine className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Statistik Versi Saat Ini ({aiDocData?.header_information?.version ?? CHATBOT_VERSION})</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {versionStats.map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts from statistik_versi_saat_ini */}
        {(() => {
          const s = aiDocData?.statistik_versi_saat_ini || {};
          const totalFitur = parseNumber(s.total_fitur) ?? 0;
          const kbFiles = parseNumber(s.knowledge_base_files) ?? 0;
          const totalVersi = parseNumber(s.total_versi_dokumentasi) ?? 0;
          const rataRelease = parseNumber(s.rata_rata_release) ?? 0;
          const bundleMB = parseNumber(s.ukuran_bundle) ?? 0;
          const respMS = parseNumber(s.waktu_respons) ?? 0;
          const barData = [
            { label: 'Fitur', value: totalFitur },
            { label: 'KB', value: kbFiles },
            { label: 'Versi', value: totalVersi },
            { label: 'Rilis/Hari', value: rataRelease },
          ];
          return (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-gray-300 mb-3">Grafik Ringkasan</h4>
                <BarChart data={barData} />
              </div>
              <div className="space-y-4">
                <Gauge label="Ukuran Bundle" value={bundleMB} unit=" MB" max={50} goodIsLow={true} />
                <Gauge label="Waktu Respons" value={respMS} unit=" ms" max={1000} goodIsLow={true} />
              </div>
            </div>
          );
        })()}
        
        {/* Performance metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h4 className="font-semibold text-gray-300 mb-3">Metrik Performa</h4>
            <div className="space-y-3">
              {[
                { label: "Waktu Load Awal", value: "1.2s", progress: 85 },
                { label: "Memory Usage", value: "45MB", progress: 60 },
                { label: "Cache Hit Rate", value: "92%", progress: 92 },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{metric.label}</span>
                    <span className="text-gray-300">{metric.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h4 className="font-semibold text-gray-300 mb-3">Kompatibilitas</h4>
            <div className="space-y-3">
              {[
                { browser: "Chrome", version: "90+", status: "full" },
                { browser: "Firefox", version: "88+", status: "full" },
                { browser: "Safari", version: "14+", status: "full" },
                { browser: "Edge", version: "90+", status: "full" },
              ].map((browser, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <span className="text-gray-300">{browser.browser}</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-400">{browser.version}</code>
                    <div className={`w-2 h-2 rounded-full ${
                      browser.status === 'full' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI NLP quick stats if available */}
        {aiDocData?.ai_nlp_statistik && (
          <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h4 className="font-semibold text-gray-300 mb-3">AI/NLP Statistik</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Core Modules', value: aiDocData.ai_nlp_statistik.core_modules },
                { label: 'Advanced Modules', value: aiDocData.ai_nlp_statistik.advanced_modules },
                { label: 'Knowledge Nodes', value: aiDocData.ai_nlp_statistik.knowledge_nodes },
                { label: 'Corpus Sentences', value: aiDocData.ai_nlp_statistik.corpus_sentences },
                { label: 'Dependencies', value: aiDocData.ai_nlp_statistik.dependencies },
                { label: 'Bahasa Didukung', value: aiDocData.ai_nlp_statistik.bahasa_didukung },
                { label: 'Intents Didukung', value: aiDocData.ai_nlp_statistik.intents_didukung },
                { label: 'Entities Didukung', value: aiDocData.ai_nlp_statistik.entities_didukung },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-800/40 rounded border border-gray-700">
                  <div className="text-sm text-gray-400">{item.label}</div>
                  <div className="text-lg font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI NLP Performa */}
        {aiDocData?.ai_nlp_performa && (
          <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h4 className="font-semibold text-gray-300 mb-3">Performa AI/NLP</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Quick NLU</span>
                  <span className="text-sm text-green-400">{aiDocData.ai_nlp_performa.quick_nlu}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Comprehensive NLU</span>
                  <span className="text-sm text-green-400">{aiDocData.ai_nlp_performa.comprehensive_nlu}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Knowledge Lookup</span>
                  <span className="text-sm text-green-400">{aiDocData.ai_nlp_performa.knowledge_lookup}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Language Detection</span>
                  <span className="text-sm text-green-400">{aiDocData.ai_nlp_performa.language_detection}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Translation Processing</span>
                  <span className="text-sm text-green-400">{aiDocData.ai_nlp_performa.translation_processing}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Response Evaluation</span>
                  <span className="text-sm text-green-400">{aiDocData.ai_nlp_performa.response_evaluation}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-800/40 rounded">
              <div className="text-sm text-gray-400">End-to-End Response: <span className="text-green-400">{aiDocData.ai_nlp_performa.end_to_end_response}</span></div>
            </div>
          </div>
        )}

        {/* AI NLP Supported Features */}
        {aiDocData?.ai_nlp_supported && (
          <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h4 className="font-semibold text-gray-300 mb-3">Fitur AI/NLP yang Didukung</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">NLU Dataset Intents</h5>
                <div className="flex flex-wrap gap-2">
                  {(aiDocData.ai_nlp_supported.nlu_dataset_intents || []).map((intent, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">{intent}</span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Advanced Intents</h5>
                <div className="flex flex-wrap gap-2">
                  {(aiDocData.ai_nlp_supported.advanced_intents || []).map((intent, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs">{intent}</span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Entities</h5>
                <div className="flex flex-wrap gap-2">
                  {(aiDocData.ai_nlp_supported.entities || []).map((entity, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">{entity}</span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Sentence Types</h5>
                <div className="flex flex-wrap gap-2">
                  {(aiDocData.ai_nlp_supported.sentence_types || []).map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-xs">{type}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Bahasa Didukung</h5>
              <div className="flex flex-wrap gap-2">
                {(aiDocData.ai_nlp_supported.bahasa || []).map((lang, idx) => (
                  <span key={idx} className="px-2 py-1 bg-indigo-900/30 text-indigo-300 rounded text-xs">{lang}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Sentiment Types</h5>
              <div className="flex flex-wrap gap-2">
                {(aiDocData.ai_nlp_supported.sentiment_types || []).map((sentiment, idx) => (
                  <span key={idx} className="px-2 py-1 bg-pink-900/30 text-pink-300 rounded text-xs">{sentiment}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Evaluation Metrics</h5>
              <div className="flex flex-wrap gap-2">
                {(aiDocData.ai_nlp_supported.evaluation_metrics || []).map((metric, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded text-xs">{metric}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;
