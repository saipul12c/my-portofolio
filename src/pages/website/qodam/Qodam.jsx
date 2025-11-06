import React, { useState } from "react";
import qodamData from "./data/data.json";

export default function Qodam() {
  const [nama, setNama] = useState("");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediksi, setPrediksi] = useState(null);

  const hashNama = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hitungEnergi = (str) => {
    let total = 0;
    for (let char of str) total += char.charCodeAt(0);
    return (total % 100) + 1;
  };

  const hitungKecocokan = (elemen, energi) => {
    const elemenFactor = {
      Api: 1.2,
      Air: 1.1,
      Tanah: 1.0,
      Angin: 1.05,
      Kayu: 1.15,
      Bayangan: 0.95,
      Cahaya: 1.3,
      Udara: 1.05,
    };
    return Math.min(100, Math.floor(energi * (elemenFactor[elemen] || 1)));
  };

  const cekQodam = () => {
    if (!nama.trim()) {
      alert("Masukkan nama dulu dong 😆");
      return;
    }

    setLoading(true);
    setHasil(null);
    setPrediksi(null);

    setTimeout(() => {
      const hash = hashNama(nama);
      const qodam = qodamData[hash % qodamData.length];
      const energi = hitungEnergi(nama);
      const kecocokan = hitungKecocokan(qodam.elemen, energi);

      setHasil(qodam);
      setPrediksi({
        energi,
        kecocokan,
        pesan:
          kecocokan > 85
            ? "🔥 Kamu dan Qodam ini udah kayak dua sisi mata uang! Super sinkron!"
            : kecocokan > 60
            ? "🌕 Kalian cocok banget, energi kalian selaras dan stabil."
            : "🌫️ Qodam ini kadang sulit terhubung dengan energimu, coba lebih tenangkan batinmu.",
      });
      setLoading(false);
    }, 2000);
  };

  const warnaElemen = (elemen) => {
    const warna = {
      Api: "from-orange-600 to-red-800",
      Air: "from-blue-500 to-cyan-600",
      Tanah: "from-amber-600 to-yellow-700",
      Angin: "from-green-400 to-teal-600",
      Kayu: "from-emerald-500 to-green-700",
      Bayangan: "from-purple-900 to-gray-900",
      Cahaya: "from-yellow-300 to-white",
      Udara: "from-sky-400 to-indigo-500",
    };
    return warna[elemen] || "from-indigo-400 to-purple-600";
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white font-poppins bg-gradient-to-b from-gray-950 via-black to-gray-900 p-6">
      {/* 🌌 Efek bintang latar */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:24px_24px] opacity-20 pointer-events-none"></div>

      {/* 🧿 Judul */}
      <div className="text-center mb-10 animate-fadeIn">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Portal Energi Qodam ✨
        </h1>
        <p className="text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
          Masukkan namamu dan biarkan alam semesta mengungkap siapa Qodam yang
          sejiwa denganmu 🔮
        </p>
      </div>

      {/* 🌀 Input */}
      <div className="relative w-80">
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl blur-md opacity-60 animate-pulse"></div>
        <input
          type="text"
          placeholder="Masukkan namamu..."
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="relative w-full px-5 py-3 rounded-2xl text-center bg-gray-900/70 text-white placeholder-gray-400 border border-violet-500/50 focus:border-violet-400 focus:ring-4 focus:ring-violet-600/40 outline-none transition-all"
        />
      </div>

      {/* 🔘 Tombol */}
      <button
        onClick={cekQodam}
        className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-500 px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] transition-all duration-300"
      >
        Lihat Qodam-ku
      </button>

      {/* 🌠 Loading */}
      {loading && (
        <div className="mt-10 flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="mt-5 text-violet-300 animate-pulse text-center text-sm">
            Menyelaraskan frekuensi spiritual kamu...
          </p>
        </div>
      )}

      {/* 💫 Hasil */}
      {!loading && hasil && (
        <div
          className={`mt-12 p-6 rounded-3xl shadow-2xl bg-gradient-to-br ${warnaElemen(
            hasil.elemen
          )} text-gray-900 w-full max-w-md text-center animate-fadeIn`}
        >
          <h2 className="text-4xl font-extrabold drop-shadow-md mb-2">
            {hasil.nama}
          </h2>
          <p className="text-base font-semibold mb-1">
            🌬️ Elemen: {hasil.elemen}
          </p>
          <p className="text-sm italic mb-4 text-gray-800/90">
            {hasil.deskripsi}
          </p>
          <p className="text-base font-medium mb-3">
            🌟 <b>Kekuatan:</b> {hasil.kekuatan}
          </p>

          {prediksi && (
            <div className="mt-4 bg-black/30 rounded-2xl py-3 px-4 text-white shadow-inner backdrop-blur-sm">
              <p className="text-yellow-300 font-semibold">
                ⚡ Energi Spiritual: {prediksi.energi}%
              </p>
              <p className="text-green-300 font-semibold">
                💫 Kecocokan: {prediksi.kecocokan}%
              </p>
              <p className="mt-2 text-sm italic text-gray-100">
                {prediksi.pesan}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
