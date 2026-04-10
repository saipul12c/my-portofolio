import React from "react";
import { FaTools, FaExclamationTriangle } from "react-icons/fa";

const Troubleshooting = ({ aiDocData }) => {
  return (
    <section id="troubleshooting" className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
            <FaTools className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Troubleshooting — Error Umum</h2>
        </div>
        
        <div className="space-y-4">
          {(aiDocData?.troubleshooting_error_umum ?? [
            "Import gagal: pastikan semua file ada di path yang benar",
            "Jawaban kosong/tidak relevan: periksa struktur JSON dan kunci",
            "Masalah kalkulator: pastikan ekspresi valid; cek presisi",
            "Memory leak: pastikan cleanup useEffect sudah benar"
          ]).map((issueText, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  idx % 4 === 0 ? 'bg-red-900/30' :
                  idx % 4 === 1 ? 'bg-yellow-900/30' :
                  idx % 4 === 2 ? 'bg-blue-900/30' :
                  'bg-purple-900/30'
                }`}>
                  <FaExclamationTriangle className={
                    idx % 4 === 0 ? 'text-red-400' :
                    idx % 4 === 1 ? 'text-yellow-400' :
                    idx % 4 === 2 ? 'text-blue-400' :
                    'text-purple-400'
                  } />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{issueText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Troubleshooting;
