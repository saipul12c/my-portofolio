import React from "react";
import { FaGraduationCap, FaQuestionCircle } from "react-icons/fa";

const ExperimentalResearch = ({ aiDocData }) => {
  return (
    <section id="experimental-research" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <FaGraduationCap className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Riwayat Penelitian Eksperimental</h2>
        </div>
        
        <div className="space-y-6">
          {/* Catatan */}
          {aiDocData?.riwayat_penelitian_eksperimental?.catatan && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3">Catatan Penelitian</h3>
              <p className="text-sm text-gray-400">{aiDocData.riwayat_penelitian_eksperimental.catatan}</p>
            </div>
          )}

          {/* Kategori Riset */}
          {aiDocData?.riwayat_penelitian_eksperimental?.kategori_riset && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3">Kategori Riset yang Dieksplorasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(aiDocData.riwayat_penelitian_eksperimental.kategori_riset || []).map((kategori, idx) => (
                  <div key={idx} className="p-3 bg-gray-800/40 rounded border border-gray-700">
                    <div className="text-sm text-gray-300 font-medium">{kategori}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          {aiDocData?.riwayat_penelitian_eksperimental?.status && (
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h3 className="font-semibold text-gray-300 mb-3">Status Riset</h3>
              <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-300">{aiDocData.riwayat_penelitian_eksperimental.status}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperimentalResearch;
