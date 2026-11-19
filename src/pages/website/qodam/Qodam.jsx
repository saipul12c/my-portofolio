import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  Flame,
  Droplets,
  Shield,
  Wind,
  Leaf,
  Zap,
  Moon,
  Sun,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Share2,
  Copy,
  Check,
  User,
  X,
  History,
  Info,
} from "lucide-react";
import qodamData from "../../../data/qodam/data.json";

// Konfigurasi tema visual berdasarkan elemen khodam
const ELEMENT_CONFIG = {
  Api: {
    label: "Elemen Api",
    icon: Flame,
    colorName: "Merah Menyala",
    gradient: "from-orange-500 via-red-600 to-rose-700",
    badgeBg: "bg-red-500/20 text-red-300 border-red-500/40",
    glow: "shadow-[0_0_35px_rgba(239,68,68,0.3)]",
    border: "border-red-500/40",
    accent: "text-red-400",
    barColor: "from-amber-400 to-red-500",
    halo: "bg-red-600/15",
  },
  Air: {
    label: "Elemen Air",
    icon: Droplets,
    colorName: "Biru Samudera",
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    glow: "shadow-[0_0_35px_rgba(6,182,212,0.3)]",
    border: "border-cyan-500/40",
    accent: "text-cyan-400",
    barColor: "from-teal-400 to-blue-500",
    halo: "bg-cyan-600/15",
  },
  Tanah: {
    label: "Elemen Tanah",
    icon: Shield,
    colorName: "Cokelat Bumi",
    gradient: "from-amber-600 via-yellow-700 to-stone-800",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glow: "shadow-[0_0_35px_rgba(245,158,11,0.3)]",
    border: "border-amber-500/40",
    accent: "text-amber-400",
    barColor: "from-yellow-400 to-amber-600",
    halo: "bg-amber-600/15",
  },
  Angin: {
    label: "Elemen Angin",
    icon: Wind,
    colorName: "Hijau Keemasan",
    gradient: "from-teal-400 via-emerald-600 to-cyan-700",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    glow: "shadow-[0_0_35px_rgba(16,185,129,0.3)]",
    border: "border-emerald-500/40",
    accent: "text-emerald-400",
    barColor: "from-teal-300 to-emerald-500",
    halo: "bg-emerald-600/15",
  },
  Kayu: {
    label: "Elemen Kayu",
    icon: Leaf,
    colorName: "Zamrud Alami",
    gradient: "from-emerald-500 via-green-600 to-teal-800",
    badgeBg: "bg-green-500/20 text-green-300 border-green-500/40",
    glow: "shadow-[0_0_35px_rgba(34,197,94,0.3)]",
    border: "border-green-500/40",
    accent: "text-green-400",
    barColor: "from-lime-400 to-emerald-600",
    halo: "bg-green-600/15",
  },
  Listrik: {
    label: "Elemen Listrik",
    icon: Zap,
    colorName: "Petir Kuning Emas",
    gradient: "from-yellow-400 via-amber-500 to-purple-800",
    badgeBg: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    glow: "shadow-[0_0_35px_rgba(234,179,8,0.3)]",
    border: "border-yellow-500/40",
    accent: "text-yellow-400",
    barColor: "from-yellow-300 to-amber-500",
    halo: "bg-yellow-600/15",
  },
  Bayangan: {
    label: "Elemen Bayangan",
    icon: Moon,
    colorName: "Ungu Gelap",
    gradient: "from-purple-900 via-indigo-950 to-slate-900",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.3)]",
    border: "border-purple-500/40",
    accent: "text-purple-400",
    barColor: "from-purple-400 to-indigo-600",
    halo: "bg-purple-600/15",
  },
  Cahaya: {
    label: "Elemen Cahaya",
    icon: Sun,
    colorName: "Kilau Suci",
    gradient: "from-amber-200 via-yellow-400 to-orange-500",
    badgeBg: "bg-yellow-400/20 text-yellow-200 border-yellow-400/40",
    glow: "shadow-[0_0_35px_rgba(250,204,21,0.35)]",
    border: "border-yellow-400/40",
    accent: "text-yellow-300",
    barColor: "from-yellow-200 to-amber-400",
    halo: "bg-yellow-500/15",
  },
  Udara: {
    label: "Elemen Udara",
    icon: Wind,
    colorName: "Biru Langit",
    gradient: "from-sky-400 via-cyan-500 to-blue-600",
    badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    glow: "shadow-[0_0_35px_rgba(56,189,248,0.3)]",
    border: "border-sky-500/40",
    accent: "text-sky-400",
    barColor: "from-sky-300 to-cyan-500",
    halo: "bg-sky-600/15",
  },
};

const SUGGESTED_NAMES = [
  "Rizky",
  "Siti",
  "Budi",
  "Dewi",
  "Satria",
  "Aura",
];

export default function Qodam() {
  const [nama, setNama] = useState("");
  const [activeName, setActiveName] = useState("");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [prediksi, setPrediksi] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  // Ambil history dari sessionStorage jika ada
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("qodam_recent_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Abaikan jika storage disabled
    }
  }, []);

  // Animasi teks saat loading
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 3);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const hashNama = (str) => {
    let hash = 0;
    const cleanStr = str.trim().toLowerCase();
    for (let i = 0; i < cleanStr.length; i++) {
      hash = cleanStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hitungEnergi = (str) => {
    let total = 0;
    const cleanStr = str.trim().toLowerCase();
    for (let char of cleanStr) {
      total += char.charCodeAt(0);
    }
    // Rentang energi yang lebih dinamis dan realistis (45% - 99%)
    return 45 + (total % 55);
  };

  const hitungKecocokan = (elemen, energi) => {
    const elemenFactor = {
      Api: 1.15,
      Air: 1.1,
      Tanah: 1.0,
      Angin: 1.08,
      Kayu: 1.12,
      Listrik: 1.2,
      Bayangan: 0.98,
      Cahaya: 1.25,
      Udara: 1.05,
    };
    const factor = elemenFactor[elemen] || 1.05;
    return Math.min(99, Math.max(50, Math.floor(energi * factor)));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#a855f7", "#ec4899", "#3b82f6", "#eab308"],
      });
    } catch {
      // Abaikan jika browser tidak support canvas
    }
  };

  const cekQodam = (customName) => {
    const targetName = (customName || nama).trim();
    if (!targetName) {
      setErrorMessage("Ketikkan namamu terlebih dahulu ya! 😊");
      inputRef.current?.focus();
      return;
    }

    setErrorMessage("");
    setLoading(true);
    setHasil(null);
    setPrediksi(null);
    setActiveName(targetName);

    setTimeout(() => {
      const hash = hashNama(targetName);
      const qodam = qodamData[hash % qodamData.length];
      const energi = hitungEnergi(targetName);
      const kecocokan = hitungKecocokan(qodam.elemen, energi);

      const predictionData = {
        energi,
        kecocokan,
        pesan:
          kecocokan > 85
            ? "🔥 Jiwa dan energimu sangat sefrekuensi dengan Qodam ini. Aura perlindungan dan kekuatannya mengalir sempurna!"
            : kecocokan > 70
            ? "🌕 Sangat selaras! Karaktermu mencerminkan energi Qodam ini, memberi stabilitas dan ketenangan batin dalam setiap langkah."
            : "🌫️ Energi kalian mulai saling mencari ritme. Jaga ketenangan pikiran dan kendalikan emosi agar potensinya semakin bangkit.",
      };

      setHasil(qodam);
      setPrediksi(predictionData);
      setLoading(false);
      triggerConfetti();

      // Simpan ke history
      setHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.nama.toLowerCase() !== targetName.toLowerCase()
        );
        const updated = [
          { nama: targetName, qodam: qodam.nama, elemen: qodam.elemen },
          ...filtered,
        ].slice(0, 5);
        try {
          sessionStorage.setItem(
            "qodam_recent_history",
            JSON.stringify(updated)
          );
        } catch {
          // ignore
        }
        return updated;
      });

      // Scroll halus ke kartu hasil pada perangkat mobile
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 150);
    }, 1800);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    cekQodam();
  };

  const handleReset = () => {
    setNama("");
    setActiveName("");
    setHasil(null);
    setPrediksi(null);
    setErrorMessage("");
    inputRef.current?.focus();
  };

  const handleCopyResult = async () => {
    if (!hasil || !prediksi) return;
    const shareText = `✨ HASIL CEK QODAM ✨\n` +
      `👤 Nama: ${activeName}\n` +
      `🔮 Qodam: ${hasil.nama} (${hasil.elemen})\n` +
      `🛡️ Kekuatan: ${hasil.kekuatan}\n` +
      `⚡ Energi Spiritual: ${prediksi.energi}%\n` +
      `💫 Tingkat Sinkronisasi: ${prediksi.kecocokan}%\n` +
      `📜 Petuah: "${prediksi.pesan}"\n\n` +
      `Cek Qodam kamu sekarang di:\n${window.location.href}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback manual jika clipboard API diblokir
      alert("Teks telah disiapkan, silakan screenshot kartu ini.");
    }
  };

  const handleShare = async () => {
    if (!hasil || !prediksi) return;
    const shareText = `Saya telah mengecek Qodam pendamping untuk "${activeName}". Qodam saya adalah "${hasil.nama}" dengan elemen ${hasil.elemen}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hasil Cek Qodam - ${activeName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User membatalkan share, tidak perlu error
      }
    } else {
      handleCopyResult();
    }
  };

  const loadingMessages = [
    "Menganalisis getaran frekuensi nama...",
    "Mencocokkan gelombang elemen batin...",
    "Membuka portal khodam pendamping...",
  ];

  // Ambil konfigurasi elemen hasil
  const activeElementConfig = hasil
    ? ELEMENT_CONFIG[hasil.elemen] || ELEMENT_CONFIG.Api
    : null;
  const ElementIcon = activeElementConfig?.icon || Sparkles;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-slate-950 to-black text-white font-sans antialiased relative overflow-x-hidden flex flex-col justify-between py-6 px-4 sm:px-6 md:px-8">
      {/* 🌌 Efek Bintang & Latar Kosmik */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:28px_28px] opacity-40 pointer-events-none"></div>

      {/* 🔮 Glow Ambient Bulat */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 🧭 Header & Navigasi Atas */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-300 hover:text-white transition-all text-xs sm:text-sm font-medium backdrop-blur-md group"
          title="Kembali ke Portofolio"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span className="hidden sm:inline">Oracle Energi</span>
          <span>Khodam v2.0</span>
        </div>
      </header>

      {/* 🔮 Konten Utama */}
      <main className="relative z-10 w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-start sm:justify-center">
        {/* Judul & Deskripsi */}
        <div className="text-center mb-6 sm:mb-8 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-300 text-xs sm:text-sm font-medium mb-3 backdrop-blur-sm">
            <span>✨ Portal Gaib Spiritual Nusantara</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-md">
            Portal Energi Qodam
          </h1>

          <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-2.5 max-w-md mx-auto leading-relaxed px-2">
            Ketikkan namamu untuk mendeteksi getaran aura dan mengungkap sosok
            khodam pendamping yang sejiwa denganmu 🔮
          </p>
        </div>

        {/* 📝 Formulir Input */}
        <div className="w-full bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60"></div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 text-left">
                Nama Lengkap / Panggilan
              </label>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 sm:left-4 pointer-events-none text-violet-400">
                  <User className="w-5 h-5" />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  maxLength={50}
                  placeholder="Masukkan namamu (contoh: Satria, Siti, Rizky)..."
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  disabled={loading}
                  className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-black/40 text-white placeholder-gray-500 border border-white/15 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none text-sm sm:text-base transition-all disabled:opacity-50"
                />

                {nama && !loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setNama("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Hapus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {errorMessage && (
                <p className="text-red-400 text-xs sm:text-sm text-left mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </p>
              )}
            </div>

            {/* Chips Contoh Nama Cepat */}
            <div className="pt-1 text-left">
              <span className="text-[11px] sm:text-xs text-gray-400 mr-2 block sm:inline mb-1.5 sm:mb-0">
                Pilihan cepat:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_NAMES.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setNama(suggestion);
                      cekQodam(suggestion);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-gray-300 hover:text-violet-200 transition-all active:scale-95 disabled:opacity-40"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Utama */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sedang Menyelaraskan Energi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span>Lihat Qodam-ku</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 🌠 Animasi Loading Bertahap */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center p-6 text-center animate-fadeIn w-full">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-fuchsia-400 border-b-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center text-violet-300">
                <Sparkles className="w-7 h-7 animate-pulse text-yellow-300" />
              </div>
            </div>
            <p className="text-violet-300 font-medium text-sm sm:text-base animate-pulse">
              {loadingMessages[loadingStep]}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Mohon hening sejenak sambil menatap layar...
            </p>
          </div>
        )}

        {/* 💫 Hasil Kartu Qodam */}
        {!loading && hasil && prediksi && activeElementConfig && (
          <div
            ref={resultRef}
            className={`mt-8 w-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border ${activeElementConfig.border} ${activeElementConfig.glow} bg-gray-950/85 relative overflow-hidden transition-all duration-500 text-center animate-fadeIn`}
          >
            {/* Ambient Element Halo */}
            <div
              className={`absolute -top-24 -right-24 w-64 h-64 ${activeElementConfig.halo} rounded-full blur-3xl pointer-events-none`}
            ></div>
            <div
              className={`absolute -bottom-24 -left-24 w-64 h-64 ${activeElementConfig.halo} rounded-full blur-3xl pointer-events-none`}
            ></div>

            {/* Header Kartu: Nama Pemilik & Elemen */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="text-center sm:text-left">
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  Khodam Pendamping Untuk
                </span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {activeName}
                </span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold ${activeElementConfig.badgeBg}`}
              >
                <ElementIcon className="w-4 h-4" />
                <span>{activeElementConfig.label}</span>
              </div>
            </div>

            {/* Nama Qodam Utama */}
            <div className="relative z-10 my-6">
              <span className="text-xs text-violet-400 font-medium tracking-wide uppercase">
                Sosok Terdeteksi
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-1 drop-shadow-md">
                {hasil.nama}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 mt-3 max-w-lg mx-auto italic bg-black/40 p-3 sm:p-4 rounded-xl border border-white/5 leading-relaxed">
                "{hasil.deskripsi}"
              </p>
            </div>

            {/* Kekuatan Spesial */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-left mb-6 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-violet-400 uppercase tracking-wider block">
                  Kekuatan Spiritual Utama
                </span>
                <p className="text-xs sm:text-sm font-medium text-gray-200 mt-0.5">
                  {hasil.kekuatan}
                </p>
              </div>
            </div>

            {/* Bar Energi & Sinkronisasi */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left">
              {/* Energi Spiritual */}
              <div className="bg-black/40 rounded-xl sm:rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-300 font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Energi Spiritual
                  </span>
                  <span className="font-bold text-amber-300">
                    {prediksi.energi}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-1000"
                    style={{ width: `${prediksi.energi}%` }}
                  ></div>
                </div>
              </div>

              {/* Tingkat Sinkronisasi */}
              <div className="bg-black/40 rounded-xl sm:rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-300 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Kecocokan Jiwa
                  </span>
                  <span className="font-bold text-emerald-300">
                    {prediksi.kecocokan}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${prediksi.kecocokan}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Pesan Bijak Khodam */}
            <div className="relative z-10 bg-violet-950/40 rounded-xl sm:rounded-2xl p-4 border border-violet-500/20 text-left mb-6">
              <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider block mb-1">
                Pesan & Sinkronisasi Batin:
              </span>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {prediksi.pesan}
              </p>
            </div>

            {/* 🔘 Tombol Aksi (Mobile & Desktop Responsive) */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cek Nama Lain</span>
              </button>

              <button
                type="button"
                onClick={handleCopyResult}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 active:scale-95 text-violet-200 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-violet-500/30"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-semibold">
                      Tersalin ke Clipboard!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Hasil</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-violet-600/30"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>
        )}

        {/* 📜 Riwayat Pengecekan Terakhir */}
        {history.length > 0 && !loading && (
          <div className="w-full mt-8 bg-gray-900/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/5 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3">
              <History className="w-4 h-4 text-violet-400" />
              <span>Riwayat Pengecekan Sesi Ini:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <button
                  key={`${item.nama}-${idx}`}
                  type="button"
                  onClick={() => {
                    setNama(item.nama);
                    cekQodam(item.nama);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-violet-600/20 active:scale-95 border border-white/10 hover:border-violet-500/30 text-xs text-gray-300 hover:text-white transition-all"
                >
                  <span className="font-semibold text-white">{item.nama}</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-violet-300 font-medium">
                    {item.qodam}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ⚠️ Footer & Catatan Hiburan */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto mt-10 text-center text-gray-500 text-xs space-y-2 border-t border-white/5 pt-6">
        <p className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] sm:text-xs">
          <span>⚠️ Catatan:</span>
          <span>
            Aplikasi ini dibuat murni untuk hiburan semata (for fun). Tetaplah
            beriman dan percaya kepada Tuhan YME 🤲.
          </span>
        </p>
        <p className="text-[11px] text-gray-600">
          © {new Date().getFullYear()} Portal Qodam • Dibuat dengan cinta &
          kreativitas
        </p>
      </footer>
    </div>
  );
}
