import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const Issues = () => {
  return (
    <section id="issues" className="scroll-mt-8">
      <div className="bg-gradient-to-br from-gray-800/30 to-red-900/10 rounded-xl border border-red-900/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Informasi Sebelumnya / Masalah yang Diperbaiki</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
            <h4 className="font-semibold text-red-300 mb-2">Masalah Kritis (Sudah Diperbaiki)</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                Respons chatbot hanya menampilkan <code className="bg-red-900/30 px-1 py-0.5 rounded">Smart reply for: &lt;input&gt;</code>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                Impor file mengarah ke lokasi salah (path hooks, path config)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                Error runtime karena pemanggilan fungsi sebelum deklarasi di <code className="bg-red-900/30 px-1 py-0.5 rounded">useChatbot.js</code>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">Status Perbaikan</h4>
            <p className="text-sm text-gray-300">
              Semua masalah kritis telah diperbaiki pada versi 7.0.10. Sistem sekarang menggunakan generator respons lengkap, 
              path impor yang benar, dan urutan deklarasi yang tepat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Issues;
