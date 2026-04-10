import React from "react";
import { FaRocket } from "react-icons/fa";
import { Gauge } from "../Shared/Charts";

const NLPAdvancements = ({ aiDocData }) => {
  return (
    <section id="nlp-advancements" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <FaRocket className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Peningkatan Bahasa & Evaluasi NLP</h2>
        </div>
        
        <div className="space-y-6">
          {/* Advanced Language Detection */}
          {aiDocData?.peningkatan_bahasa_dan_evaluasi?.advanced_language_detection && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Advanced Language Detection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.advanced_language_detection.linguistic_analysis}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.advanced_language_detection.character_frequency}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.advanced_language_detection.context_aware}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.advanced_language_detection.confidence_scoring}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.advanced_language_detection.detailed_metadata}</p>
                  <p className="text-sm text-green-400 font-medium">Akurasi: {aiDocData.peningkatan_bahasa_dan_evaluasi.advanced_language_detection.akurasi}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bilingual Response System */}
          {aiDocData?.peningkatan_bahasa_dan_evaluasi?.bilingual_response_system && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Bilingual Response System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.bilingual_response_system.automatic_language_switching}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.bilingual_response_system.translation_engine}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.bilingual_response_system.grammar_post_processing}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.bilingual_response_system.context_aware_translation}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.bilingual_response_system.intent_based_responses}</p>
                  <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.bilingual_response_system.multiple_variations}</p>
                </div>
              </div>
            </div>
          )}

          {/* Response Quality Evaluation */}
          {aiDocData?.peningkatan_bahasa_dan_evaluasi?.response_quality_evaluation && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Response Quality Evaluation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Relevance ({aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.relevance}%)</span>
                    <Gauge label="" value={25} unit="" max={100} goodIsLow={false} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Informativeness ({aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.informativeness}%)</span>
                    <Gauge label="" value={20} unit="" max={100} goodIsLow={false} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Coherence ({aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.coherence}%)</span>
                    <Gauge label="" value={15} unit="" max={100} goodIsLow={false} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Appropriateness ({aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.appropriateness}%)</span>
                    <Gauge label="" value={20} unit="" max={100} goodIsLow={false} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Engagement ({aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.engagement}%)</span>
                    <Gauge label="" value={10} unit="" max={100} goodIsLow={false} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Safety ({aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.safety}%)</span>
                    <Gauge label="" value={10} unit="" max={100} goodIsLow={false} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-3">{aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.weighted_scoring}</p>
              <p className="text-sm text-gray-400">{aiDocData.peningkatan_bahasa_dan_evaluasi.response_quality_evaluation.automated_recommendations}</p>
            </div>
          )}

          {/* Benefits */}
          {aiDocData?.peningkatan_bahasa_dan_evaluasi?.benefits && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                Manfaat Peningkatan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  {(aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.multilingual_support ? [<li key="multi" className="text-sm text-gray-400 flex items-start gap-2"><span className="text-gray-500">•</span>{aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.multilingual_support}</li>] : []).concat(
                    aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.better_user_experience ? [<li key="ux" className="text-sm text-gray-400 flex items-start gap-2"><span className="text-gray-500">•</span>{aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.better_user_experience}</li>] : [],
                    aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.cultural_adaptation ? [<li key="culture" className="text-sm text-gray-400 flex items-start gap-2"><span className="text-gray-500">•</span>{aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.cultural_adaptation}</li>] : [],
                    aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.global_accessibility ? [<li key="global" className="text-sm text-gray-400 flex items-start gap-2"><span className="text-gray-500">•</span>{aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.global_accessibility}</li>] : []
                  )}
                </ul>
                <ul className="space-y-2">
                  {(aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.intelligent_language_switching ? [<li key="switch" className="text-sm text-gray-400 flex items-start gap-2"><span className="text-gray-500">•</span>{aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.intelligent_language_switching}</li>] : []).concat(
                    aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.continuous_improvement ? [<li key="improve" className="text-sm text-gray-400 flex items-start gap-2"><span className="text-gray-500">•</span>{aiDocData.peningkatan_bahasa_dan_evaluasi.benefits.continuous_improvement}</li>] : []
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NLPAdvancements;
