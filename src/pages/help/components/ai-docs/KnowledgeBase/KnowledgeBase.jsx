import React from "react";
import { FaDatabase } from "react-icons/fa";
import { SiJson } from "react-icons/si";

const KnowledgeBase = ({ aiDocData }) => {
  return (
    <section id="knowledge-base" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
            <FaDatabase className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Sumber Data (Knowledge Base)</h2>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-4">
            Edit atau tambahkan data di file JSON berikut untuk memperkaya SaipulAI:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(aiDocData?.sumber_data_knowledge_base ?? []).map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                <SiJson className="text-green-400" />
                <code className="text-sm text-gray-300 flex-1 truncate">{file}</code>
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">JSON</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
            <p className="text-xs text-blue-300">
              <strong>Tip:</strong> Gunakan format kunci → jawaban (object) untuk pencocokan cepat, 
              atau tambahkan struktur array untuk entri multi-item.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeBase;
