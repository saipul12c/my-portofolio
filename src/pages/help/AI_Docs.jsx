import React from "react";
import { CHATBOT_VERSION, DEFAULT_SETTINGS } from "../../components/helpbutton/chat/config";
import aiDocData from '../../data/AIDoc/data.json';
import VersionDetail from './ai/AI_DocDetail';
import { Link, useParams } from 'react-router-dom';
import { 
  FaBook, 
  FaHistory, 
  FaChartLine, 
  FaCode, 
  FaCogs, 
  FaQuestionCircle, 
  FaShieldAlt,
  FaLightbulb,
  FaDatabase,
  FaTools,
  FaExclamationTriangle,
  FaRocket,
  FaGraduationCap,
  FaDownload,
  FaArrowLeft,
  FaEye,
  FaExternalLinkAlt
} from "react-icons/fa";
import { 
  SiReact, 
  SiJavascript, 
  SiJson,
  SiTailwindcss
} from "react-icons/si";

// Komponen untuk menampilkan konten berdasarkan section aktif
const SectionContent = ({ activeSection, showAllVersions, showRawJson, aiDocData, versionStats }) => {

  const sections = {
    "overview": (
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
            <p className="text-gray-400 mb-4">
              Dokumentasi ini berisi semua informasi yang diperlukan untuk memahami, menggunakan, dan mengembangkan sistem SaipulAI.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Termasuk panduan singkat instalasi, arsitektur komponen, cara menambah data pada knowledge base, dan tips debugging.
              Gunakan sidebar untuk melompat cepat ke bagian yang relevan.
            </p>
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
                <div className="mt-4 text-sm text-gray-400">
                  Interpretasi singkat: nilai waktu load dan ukuran bundle membantu prioritas optimasi. Jika waktu respons &gt; 1s, periksa indexing knowledge-base dan ukuran data yang dimuat pada inisialisasi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    "changelog": (
      <section id="changelog" className="scroll-mt-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <FaHistory className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Riwayat Perubahan (Sesi Terakhir)</h2>
          </div>
          
          <div className="space-y-4">
            {(aiDocData?.change_log_sesi_terakhir ?? []).map((change, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex-shrink-0">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/30 text-purple-300`}>
                    LOG
                  </div>
                  <div className="text-center text-sm text-gray-400 mt-2">{change.date}</div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300">{change.description}</p>
                </div>
              </div>
            ))}
            {!(aiDocData?.change_log_sesi_terakhir ?? []).length && (
              <div className="text-sm text-gray-400">Tidak ada catatan perubahan terbaru. Untuk melaporkan bug, buka repository dan buat issue atau PR.</div>
            )}
          </div>
        </div>
      </section>
    ),

    "versions": (
      <section id="versions" className="scroll-mt-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <FaCode className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Riwayat Versi</h2>
          </div>

          <div className="space-y-6">
            {(aiDocData?.version_history_detail ?? []).slice(0,6).map((ver, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-lg border border-gray-800 p-5 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ver.type === 'terbaru' || ver.type === 'minor' ? 'bg-green-900/30 text-green-300' :
                      ver.type === 'security' ? 'bg-red-900/30 text-red-300' :
                      ver.type === 'patch' ? 'bg-blue-900/30 text-blue-300' :
                      'bg-purple-900/30 text-purple-300'
                    }`}>
                      {ver.version}
                    </span>
                    <span className="text-gray-400 text-sm">{ver.date}</span>
                    {(ver.supported || ver.type === 'terbaru') && (
                      <span className="px-2 py-1 bg-green-900/20 text-green-300 rounded text-xs">
                        {ver.type === 'terbaru' ? 'STABLE' : ver.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Tombol ke Halaman Detail Versi */}
                  <Link 
                    to={`/help/docs/ai/${encodeURIComponent(ver.version)}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                  >
                    <FaEye className="text-sm" />
                    Detail Versi
                  </Link>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {(ver.features || []).slice(0, 3).map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Total fitur: {ver.features?.length || 0}</span>
                  <Link 
                    to={`/help/docs/ai/${encodeURIComponent(ver.version)}`}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Lihat detail lengkap
                    <FaExternalLinkAlt className="text-xs" />
                  </Link>
                </div>
              </div>
            ))}

            <div className="mt-4 text-sm text-gray-400">
              Versi mengikuti pola semantic versioning: <code className="bg-gray-800 px-1 rounded">MAJOR.MINOR.PATCH</code>. Perubahan besar, penambahan fitur, dan perbaikan kecil dicatat pada riwayat.
            </div>

            {showAllVersions && (
              <div className="mt-6">
                <VersionDetail data={aiDocData?.version_history_detail ?? []} />
              </div>
            )}

            {showRawJson && (
              <div className="mt-6 bg-gray-950/50 rounded-lg p-4 overflow-auto max-h-96 border border-gray-800">
                <pre className="text-xs text-gray-300">
                  <code>{JSON.stringify(aiDocData, null, 2)}</code>
                </pre>
              </div>
            )}
            
            {/* Collapsible untuk versi lama */}
            <details className="group">
              <summary className="cursor-pointer list-none p-4 bg-gray-900/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">Versi sebelumnya (v7.0.5 - v0.0.0)</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-3 space-y-4">
                <div className="space-y-4">
                  {(aiDocData?.version_history_detail ?? []).slice(6).map((ver, idx) => (
                    <div key={idx} className="pl-4 border-l border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <strong className="text-gray-300">{ver.version}</strong>
                        <span className="text-gray-500 text-sm">— {ver.summary || ver.notes || 'Deskripsi singkat tidak tersedia'}</span>
                        <span className="text-xs text-gray-600 px-2 py-1 bg-gray-800 rounded">
                          {ver.features ? ver.features.length : 0} fitur
                        </span>
                        <Link 
                          to={`/help/docs/ai/${encodeURIComponent(ver.version)}`}
                          className="ml-auto px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>
    ),

    "stats": (
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
        </div>
      </section>
    ),

    "issues": (
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
    ),

    "features": (
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
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <FaBook className="text-blue-400" />
                  Ringkasan Singkat
                </h3>
                <p className="text-sm text-gray-400">
                  SaipulAI adalah asisten lokal ringan yang menggabungkan knowledge base berbasis file JSON, 
                  modul kalkulator matematika, utilitas konversi, dan mekanisme saran otomatis. 
                  Semua proses utama berjalan secara lokal — tidak terhubung ke API eksternal kecuali dikonfigurasi secara eksplisit.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" />
                  Fitur Utama
                </h3>
                <ul className="space-y-2">
                  {[
                    "📚 Knowledge Base dinamis — sumber utama berasal dari file JSON",
                    "🧮 Kalkulator matematika canggih — fungsi trig, log, konstanta",
                    "🔁 Konversi & utilitas — suhu, mata uang, statistik",
                    "📁 Dukungan upload opsional — file diindeks ke knowledge base",
                    "💡 Saran kontekstual & quick actions berdasarkan topik",
                  ].map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-gray-500 mt-0.5">•</span>
                      {feature}
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
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    "knowledge-base": (
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
    ),

    "config": (
      <section id="config" className="scroll-mt-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <FaCogs className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Pengaturan & Konfigurasi</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-5">
              <h4 className="font-semibold text-gray-300 mb-3">Konfigurasi Default</h4>
              <p className="text-sm text-gray-400 mb-3">
                Konfigurasi default dapat dilihat di <code className="bg-gray-800 px-2 py-1 rounded">src/components/helpbutton/chat/config.js</code>
              </p>
              
              <div className="bg-gray-950/50 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-xs text-gray-300">
                  <code>{JSON.stringify(DEFAULT_SETTINGS, null, 2)}</code>
                </pre>
              </div>
            </div>
            
            <div className="p-4 bg-purple-900/10 border border-purple-900/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Catatan:</strong> Untuk mengubah perilaku (mis. presisi matematika, penggunaan file terunggah), 
                edit file konfigurasi lalu restart dev server.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),

    "examples": (
      <section id="examples" className="scroll-mt-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <FaGraduationCap className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Contoh Pertanyaan & Cara Kerja</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Lookup Sederhana
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Input:</span>
                    <code className="text-sm bg-gray-800 px-3 py-1 rounded flex-1">"Apa itu kecerdasan buatan?"</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Proses:</span>
                    <span className="text-sm text-gray-400">Dicocokkan dengan kunci di AI-base.json</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Output:</span>
                    <span className="text-sm text-gray-400">Jawaban langsung dari knowledge base</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <code className="block text-sm bg-gray-800 px-3 py-2 rounded">"Tampilkan softskills"</code>
                  <p className="text-sm text-gray-400">
                    Menampilkan semua entri dari <code className="text-xs">softskills.json</code>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Kalkulator Matematika
                </h4>
                <div className="space-y-3">
                  {[
                    { input: "2 + 2", desc: "Operasi dasar" },
                    { input: "sin(45) + cos(45)", desc: "Fungsi trigonometri" },
                    { input: "log(100)", desc: "Logaritma" },
                    { input: "integral x^3 dari 0 sampai 1", desc: "Kalkulus" },
                  ].map((example, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                      <code className="text-sm">{example.input}</code>
                      <span className="text-xs text-gray-500">{example.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Konversi & Utilitas
                </h4>
                <div className="space-y-2">
                  {[
                    "100°C ke Fahrenheit",
                    "100 USD ke IDR", 
                    "Statistik dari [1,2,3,4,5]",
                    "Konversi waktu 3600 detik ke jam"
                  ].map((conv, idx) => (
                    <div key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      {conv}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    "troubleshooting": (
      <section id="troubleshooting" className="scroll-mt-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
              <FaTools className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting — Error Umum</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                problem: "Import gagal",
                cause: "File yang di-import tidak ditemukan di path yang benar",
                solution: "Pastikan semua file ada di path yang benar, restart dev server jika menambahkan file baru"
              },
              {
                problem: "Jawaban kosong/tidak relevan",
                cause: "Struktur JSON tidak sesuai atau kunci tidak ditemukan",
                solution: "Periksa struktur JSON & gunakan kunci yang spesifik untuk lookup cepat"
              },
              {
                problem: "Masalah kalkulator",
                cause: "Ekspresi matematika tidak valid atau konfigurasi presisi",
                solution: "Pastikan ekspresi valid; cek konfigurasi calculationPrecision"
              },
              {
                problem: "Memory leak",
                cause: "Cleanup useEffect tidak tepat",
                solution: "Pastikan semua event listener dan subscription dibersihkan di cleanup function"
              }
            ].map((issue, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    idx === 0 ? 'bg-red-900/30' :
                    idx === 1 ? 'bg-yellow-900/30' :
                    idx === 2 ? 'bg-blue-900/30' :
                    'bg-purple-900/30'
                  }`}>
                    <FaExclamationTriangle className={
                      idx === 0 ? 'text-red-400' :
                      idx === 1 ? 'text-yellow-400' :
                      idx === 2 ? 'text-blue-400' :
                      'text-purple-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-300 mb-2">{issue.problem}</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">Penyebab:</span>
                        <p className="text-sm text-gray-400">{issue.cause}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Solusi:</span>
                        <p className="text-sm text-gray-300">{issue.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    "privacy": (
      <section id="privacy" className="scroll-mt-8">
        <div className="bg-gradient-to-br from-gray-800/30 to-emerald-900/10 rounded-xl border border-emerald-900/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <FaShieldAlt className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Privasi & Keamanan</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                <h4 className="font-semibold text-emerald-300 mb-3">Keamanan Data</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Semua data diproses secara lokal di browser
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    Tidak ada data yang dikirim ke server eksternal
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                    File upload hanya diindeks jika fitur diaktifkan
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
                <h4 className="font-semibold text-amber-300 mb-3">Peringatan</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    Jangan unggah data sensitif tanpa enkripsi
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    Review kebijakan privasi aplikasi Anda
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    Backup data secara berkala
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    "contribution": (
      <section id="contribution" className="scroll-mt-8">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
              <FaQuestionCircle className="text-xl" />
            </div>
            <h2 className="text-2xl font-bold">Cara Kontribusi / Menambah Data</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Edit/Add JSON",
                  desc: "Edit atau buat file JSON di src/components/helpbutton/chat/data/",
                  color: "from-blue-600 to-cyan-600"
                },
                {
                  step: "2",
                  title: "Add Modules",
                  desc: "Tempatkan modul baru di logic/utils/",
                  color: "from-purple-600 to-pink-600"
                },
                {
                  step: "3",
                  title: "Restart",
                  desc: "Restart aplikasi (npm run dev) agar perubahan ter-load",
                  color: "from-green-600 to-emerald-600"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center font-bold mb-3`}>
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-300 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-5">
              <h4 className="font-semibold text-gray-300 mb-3">Struktur Direktori</h4>
              <div className="font-mono text-sm">
                <div className="text-gray-500">src/components/helpbutton/chat/</div>
                <div className="ml-4 mt-1">
                  <div className="text-cyan-400">├── data/ <span className="text-gray-500"># Knowledge base files</span></div>
                  <div className="text-cyan-400">├── logic/ <span className="text-gray-500"># Core chatbot logic</span></div>
                  <div className="ml-4">
                    <div className="text-green-400">├── utils/ <span className="text-gray-500"># Utility modules</span></div>
                    <div className="text-green-400">├── hooks/ <span className="text-gray-500"># Custom React hooks</span></div>
                  </div>
                  <div className="text-cyan-400">├── components/ <span className="text-gray-500"># UI components</span></div>
                  <div className="text-cyan-400">└── config.js <span className="text-gray-500"># Configuration file</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  };

  return sections[activeSection] || sections["overview"];
};

export default function AI_Docs() {
  const [activeSection, setActiveSection] = React.useState("overview");
  const [showAllVersions] = React.useState(false);
  const [showRawJson] = React.useState(false);
  const { version } = useParams();
  
  // Jika ada parameter versi di URL, arahkan ke section versions
  React.useEffect(() => {
    if (version) {
      setActiveSection("versions");
    }
  }, [version]);

  const versionStats = [
    { label: "Total Fitur", value: aiDocData?.statistik_versi_saat_ini?.total_fitur ?? "-", icon: <FaRocket className="text-blue-400" /> },
    { label: "Knowledge Base", value: aiDocData?.statistik_versi_saat_ini?.knowledge_base_files ?? "-", icon: <FaDatabase className="text-green-400" /> },
    { label: "Ukuran Bundle", value: aiDocData?.statistik_versi_saat_ini?.ukuran_bundle ?? "-", icon: <SiReact className="text-purple-400" /> },
    { label: "Waktu Respons", value: aiDocData?.statistik_versi_saat_ini?.waktu_respons ?? "-", icon: <FaChartLine className="text-yellow-400" /> },
  ];

  const techStack = [
    { name: "React", icon: <SiReact />, color: "text-cyan-400" },
    { name: "JavaScript", icon: <SiJavascript />, color: "text-yellow-400" },
    { name: "JSON", icon: <SiJson />, color: "text-green-400" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-teal-400" },
  ];

  // Navigasi sidebar items
  const navItems = [
    { id: "overview", label: "Ringkasan", icon: <FaBook /> },
    { id: "changelog", label: "Riwayat Perubahan", icon: <FaHistory /> },
    { id: "versions", label: "Riwayat Versi", icon: <FaCode /> },
    { id: "stats", label: "Statistik Versi", icon: <FaChartLine /> },
    { id: "issues", label: "Masalah & Perbaikan", icon: <FaExclamationTriangle /> },
    { id: "features", label: "Fitur Utama", icon: <FaLightbulb /> },
    { id: "knowledge-base", label: "Sumber Data", icon: <FaDatabase /> },
    { id: "config", label: "Pengaturan", icon: <FaCogs /> },
    { id: "examples", label: "Contoh Penggunaan", icon: <FaGraduationCap /> },
    { id: "troubleshooting", label: "Troubleshooting", icon: <FaTools /> },
    { id: "privacy", label: "Privasi & Keamanan", icon: <FaShieldAlt /> },
    { id: "contribution", label: "Cara Kontribusi", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      {/* Header dengan gradient */}
      <header className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <FaBook className="text-xl" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {aiDocData?.header_information?.title ?? 'SaipulAI — Dokumentasi & Panduan'}
                </h1>
              </div>
              <p className="text-gray-300 text-sm sm:text-base max-w-3xl">
                {aiDocData?.ringkasan_singkat ?? 'Dokumentasi lengkap untuk sistem chatbot AI dengan knowledge base lokal, kalkulator matematika canggih, dan berbagai fitur utilitas.'}
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Versi Saat Ini</span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-xs font-semibold">
                  STABLE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaDownload className="text-blue-400" />
                <code className="text-xl font-bold">{CHATBOT_VERSION}</code>
              </div>
              <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
                <FaCode className="text-gray-500" />
                <code className="bg-gray-900 px-2 py-1 rounded">src/components/helpbutton/chat/config.js</code>
              </div>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 ${tech.color}`}
              >
                {tech.icon}
                <span className="text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid utama */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigasi */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-8 space-y-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
                <h3 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <FaBook className="text-blue-400" />
                  Navigasi Dokumen
                </h3>
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-l-4 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Back to main help */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-4">
                <Link 
                  to="/help" 
                  className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800/30 px-3 py-2 rounded-lg transition-all"
                >
                  <FaArrowLeft className="text-sm" />
                  Kembali ke Menu Bantuan
                </Link>
              </div>
            </nav>
          </aside>

          {/* Konten utama */}
          <main className="lg:col-span-3">
            <SectionContent 
              activeSection={activeSection}
              showAllVersions={showAllVersions}
              showRawJson={showRawJson}
              aiDocData={aiDocData}
              versionStats={versionStats}
            />
          </main>
        </div>
      </div>
    </div>
  );
}