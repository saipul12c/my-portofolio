import React from "react";
import { FaBook } from "react-icons/fa";
import { FormattedText, FileChips } from "../Shared/UIComponents";

const Overview = ({ versionStats }) => {
  return (
    <section className="scroll-mt-8">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <FaBook className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Ringkasan Dokumen</h2>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-300 mb-4">Selamat Datang di Dokumentasi SaipulAI</h3>
          <div className="text-gray-400 mb-4">
            <FormattedText>Dokumentasi ini berisi semua informasi yang diperlukan untuk memahami, menggunakan, dan mengembangkan sistem **SaipulAI**.</FormattedText>
          </div>
          <div className="text-sm text-gray-400 mb-4 leading-relaxed">
            <FormattedText>Termasuk panduan singkat instalasi, arsitektur komponen, cara menambah data pada `knowledge base`, dan tips debugging. Gunakan sidebar untuk melompat cepat ke bagian yang relevan.</FormattedText>
            <FileChips text="src/components/helpbutton/chat/config.js data/ knowledge base" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h4 className="font-semibold text-gray-300 mb-2">Panduan Cepat</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Gunakan sidebar untuk navigasi cepat</li>
                <li>• Setiap versi memiliki halaman detail</li>
                <li>• Data bisa diedit melalui file JSON</li>
                <li>• Sistem bekerja secara lokal</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h4 className="font-semibold text-gray-300 mb-2">Statistik Cepat</h4>
              <div className="grid grid-cols-2 gap-3">
                {versionStats.map((stat, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-800/30 rounded">
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[11px] text-gray-500 leading-relaxed border-t border-white/5 pt-3 italic">
                <FormattedText>Interpretasi singkat: nilai waktu load dan ukuran bundle membantu prioritas optimasi. Jika waktu respons `&gt; 1s`, periksa indexing `knowledge-base` dan ukuran data yang dimuat pada inisialisasi.</FormattedText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
