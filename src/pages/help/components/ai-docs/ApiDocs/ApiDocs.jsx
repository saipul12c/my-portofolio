import React, { useState } from "react";
import {
  FaCode,
  FaShieldAlt,
  FaServer,
  FaCheckCircle,
  FaCopy,
  FaPlay,
  FaTerminal,
  FaGlobe,
  FaBolt,
  FaBrain,
  FaExchangeAlt
} from "react-icons/fa";
import { SiJavascript, SiPython } from "react-icons/si";

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("curl");
  const [copied, setCopied] = useState(false);

  // State for live test
  const [testInput, setTestInput] = useState("Halo, apa kabar?");
  const [testStyle, setTestStyle] = useState("friendly");
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunLiveTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/saipul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testInput, style: testStyle })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        error: `Gagal memanggil API: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const codeSnippets = {
    curl: `# 1. POST Request (Chat & Kalkulasi)
curl -X POST https://syaiful-mukmin.netlify.app/api/saipul \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Berapa hasil dari 25 * 40?", "style": "friendly"}'

# 2. GET Request (Healthcheck & Quick Query)
curl "https://syaiful-mukmin.netlify.app/api/saipul?q=halo"`,

    javascript: `// Integrasi JavaScript Modern (Browser / Node.js 18+)
async function tanyasaipul(pertanyaan) {
  const response = await fetch("https://syaiful-mukmin.netlify.app/api/saipul", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: pertanyaan,
      style: "friendly" // 'friendly' | 'formal' | 'concise'
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log("Respon SaipulAI:", data.reply);
    console.log("Intent:", data.intent);
    console.log("Bahasa:", data.language);
  } else {
    console.error("Error:", data.error);
  }
}

tanyasaipul("Hitung akar kuadrat dari 144");`,

    python: `import requests

url = "https://syaiful-mukmin.netlify.app/api/saipul"
payload = {
    "message": "Apa itu Machine Learning?",
    "style": "formal"
}

response = requests.post(url, json=payload, timeout=10)
data = response.json()

if data.get("success"):
    print("Jawaban:", data["reply"])
    print("Intent:", data["intent"])
else:
    print("Gagal:", data.get("error"))`,

    sdk: `<!-- Embed SaipulAI Web SDK di file HTML eksternal Anda -->
<script src="https://syaiful-mukmin.netlify.app/saipul-sdk.js"></script>
<script>
  // Inisialisasi SDK klien
  const ai = new SaipulAI({
    endpoint: "https://syaiful-mukmin.netlify.app/api/saipul",
    style: "friendly"
  });

  // Contoh 1: Chat biasa
  ai.chat("Halo SaipulAI!").then(res => {
    console.log(res.reply);
  });

  // Contoh 2: Kalkulasi matematika
  ai.calculate("25000 * 1.11").then(res => {
    console.log(res.reply); // Hasil perhitungan matematika
  });
</script>`,

    server: `# Jalankan SaipulAI sebagai microservice Node.js mandiri:
# Dapat dideploy ke Render, Railway, VPS, atau Docker

# 1. Jalankan server lokal pada port 3001
node server/saipul-server.js

# Output console:
# 🤖 SaipulAI Standalone Server  v8.0.0 aktif!
# 📡 URL API: http://localhost:3001/api/saipul
# 🔒 Zero Sensitive Keys • CORS Enabled • PII Filter Active`
  };

  return (
    <section id="api-docs" className="scroll-mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Banner */}
      <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <FaGlobe className="text-8xl rotate-12 transition-transform duration-1000 group-hover:rotate-45" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <FaCode className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                REST API & Integrasi Eksternal
              </h2>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <FaBolt className="text-yellow-400 text-xs" />
                Gunakan kecerdasan SaipulAI  v8.0.0 di website, bot, atau aplikasi pihak ketiga
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Status API</span>
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ONLINE ( v8.0.0)
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Akses Cross-Origin</span>
              <div className="text-blue-300 text-sm font-semibold">CORS: Enabled (*)</div>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Keamanan Kredensial</span>
              <div className="text-emerald-300 text-sm font-semibold">Zero Sensitive Leakage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual-Engine Architecture Integration Card */}
      <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400">
            <FaBrain className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Integrasi Arsitektur Dual-Engine SaipulAI  v8.0.0
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Sinergi harmonis antara kecerdasan On-Device (in-browser) dan Universal Serverless REST API
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          Ekosistem <strong>SaipulAI  v8.0.0</strong> mengintegrasikan dua pilar arsitektur kecerdasan yang saling melengkapi. Keduanya berbagi pemahaman data portofolio yang selaras, evaluasi matematika simbolik/alami, serta standar keamanan privasi tanpa kebocoran kredensial.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pilar 1 */}
          <div className="bg-black/40 border border-blue-500/20 rounded-xl p-4 space-y-3 relative group hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Pilar 1: On-Device In-Browser Engine
              </span>
              <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded border border-blue-700/40 font-mono">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Menggerakkan <strong>Chatbot HelpButton</strong> dan <strong>Live Discussion Room (@saipul)</strong> langsung di RAM browser pengguna.
            </p>
            <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc list-inside">
              <li>6-Layer Deep NLP Pipeline & 256-D Self-Attention</li>
              <li>Nol latensi jaringan (0ms response time)</li>
              <li>100% privasi terlindungi (tanpa kirim teks obrolan ke server)</li>
              <li>Akses langsung ke basis data portofolio & riwayat sesi lokal</li>
            </ul>
          </div>

          {/* Pilar 2 */}
          <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4 space-y-3 relative group hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Pilar 2: Universal REST API & Web SDK
              </span>
              <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-700/40 font-mono">
                /api/saipul
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Menyediakan pintu integrasi mandiri untuk <strong>aplikasi luar, cURL, Python, mobile app, dan bot eksternal</strong>.
            </p>
            <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc list-inside">
              <li>Kompatibel Netlify Functions, Vite dev, & Node.js standalone</li>
              <li>Evaluasi matematika simbolik dan frasa verbal alami</li>
              <li>Proteksi deteksi data sensitif (PII) & IP rate-limiting</li>
              <li>Universal Web SDK (<code className="text-purple-300">public/saipul-sdk.js</code>) siap pakai</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-indigo-300">
          <FaExchangeAlt className="text-indigo-400 shrink-0" />
          <span>
            <strong>Jembatan Integrasi:</strong> Web SDK klien dapat digunakan di dalam website maupun diimpor oleh pihak ketiga untuk mengakses seluruh kapabilitas SaipulAI secara konsisten.
          </span>
        </div>
      </div>

      {/* Security & Privacy Guarantee Card */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-gray-900 to-blue-950/30 border border-emerald-500/20 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <FaShieldAlt className="text-2xl" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-emerald-300">Jaminan Privasi & Tanpa Kebocoran Kredensial</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Endpoint publik SaipulAI dirancang dengan prinsip <em>zero-trust credential isolation</em>. API ini <strong>tidak membutuhkan dan tidak membocorkan</strong> API key rahasia, token Supabase, atau credential backend apa pun.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-300">
                <strong className="text-emerald-400 block mb-1">🛡️ Deteksi PII Otomatis</strong>
                Permintaan yang memuat nomor rekening, NIK, kartu kredit, atau kata sandi otomatis ditolak.
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-300">
                <strong className="text-blue-400 block mb-1">⏱️ Proteksi Rate Limiting</strong>
                Dibatasi 30 request/menit per alamat IP untuk mencegah flood dan memastikan stabilitas server.
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-xs text-gray-300">
                <strong className="text-purple-400 block mb-1">🌐 Siap Multi-Platform</strong>
                Bisa diakses dari browser, backend Node.js/Python, aplikasi mobile, hingga Web SDK.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Table */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaServer className="text-blue-400" />
          Daftar Endpoint
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900/60 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3">Path Endpoint</th>
                <th className="px-4 py-3">Parameter / Body</th>
                <th className="px-4 py-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="hover:bg-gray-800/20">
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-900/40 text-green-300 border border-green-700/50 rounded font-mono text-xs font-bold">
                    POST
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-blue-300">/api/saipul</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {`{ "message": string, "style"?: "friendly"|"formal"|"concise" }`}
                </td>
                <td className="px-4 py-3 text-xs">
                  Mengirim percakapan, tanya-jawab AI, atau perhitungan matematika tingkat tinggi.
                </td>
              </tr>
              <tr className="hover:bg-gray-800/20">
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded font-mono text-xs font-bold">
                    GET
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-blue-300">/api/saipul?q=QUERY</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">q atau message (URL Param)</td>
                <td className="px-4 py-3 text-xs">
                  Healthcheck endpoint (jika tanpa param) atau quick query string cepat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Integration Tabs */}
      <div className="bg-gray-900/80 rounded-2xl border border-gray-700/70 overflow-hidden shadow-2xl">
        <div className="bg-gray-950 px-4 py-3 flex flex-wrap items-center justify-between border-b border-gray-800 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("curl")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "curl" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
            >
              <FaTerminal /> cURL
            </button>
            <button
              onClick={() => setActiveTab("javascript")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "javascript" ? "bg-yellow-500 text-black font-semibold" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
            >
              <SiJavascript /> JavaScript
            </button>
            <button
              onClick={() => setActiveTab("python")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "python" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
            >
              <SiPython /> Python
            </button>
            <button
              onClick={() => setActiveTab("sdk")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "sdk" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
            >
              <FaGlobe /> Web SDK
            </button>
            <button
              onClick={() => setActiveTab("server")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === "server" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
            >
              <FaServer /> Microservice
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(codeSnippets[activeTab])}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors"
          >
            {copied ? <FaCheckCircle className="text-green-400" /> : <FaCopy />}
            <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
          </button>
        </div>

        <div className="p-4 bg-black/60 overflow-x-auto">
          <pre className="text-xs font-mono text-gray-300 leading-relaxed custom-scrollbar">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>
      </div>

      {/* Live Interactive API Tester */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/60 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
            <FaPlay className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Uji Coba Langsung (Live API Sandbox)</h3>
            <p className="text-xs text-gray-400">Jalankan permintaan langsung ke endpoint <code>/api/saipul</code> tanpa perlu refresh halaman.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Pesan / Ekspresi (message)</label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Contoh: Hitung 15 * (4 + 6) atau Halo Saipul!"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Gaya Respon (style)</label>
              <select
                value={testStyle}
                onChange={(e) => setTestStyle(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="friendly">Friendly (Ramah & Santai)</option>
                <option value="formal">Formal (Resmi & Baku)</option>
                <option value="concise">Concise (Singkat & Padat)</option>
              </select>
            </div>

            <button
              onClick={handleRunLiveTest}
              disabled={isLoading || !testInput.trim()}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Permintaan...</span>
                </>
              ) : (
                <>
                  <FaPlay className="text-xs" />
                  <span>Kirim Permintaan ke /api/saipul</span>
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Respons JSON (Real-Time)</label>
            <div className="h-[180px] bg-black/60 border border-gray-800 rounded-lg p-3 overflow-auto font-mono text-xs custom-scrollbar">
              {testResult ? (
                <pre className="text-green-300">
                  <code>{JSON.stringify(testResult, null, 2)}</code>
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 italic text-center">
                  Klik tombol "Kirim Permintaan" untuk melihat respon langsung dari server.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
