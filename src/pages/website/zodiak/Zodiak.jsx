import React, { useState } from "react";
import zodiakData from "./data/data.json";

export default function Zodiak() {
  const [input, setInput] = useState("");
  const [zodiak, setZodiak] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧩 Ambil tanggal dari teks
  const extractDate = (text) => {
    const months = {
      januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
      juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12
    };
    const dateFormat = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (dateFormat) return new Date(dateFormat[3], dateFormat[2] - 1, dateFormat[1]);
    const match = text.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);
    if (match) {
      const day = parseInt(match[1]);
      const month = months[match[2].toLowerCase()];
      const year = parseInt(match[3]);
      if (month) return new Date(year, month - 1, day);
    }
    return null;
  };

  // 🔮 Tentukan zodiak dari tanggal lahir
  const getZodiakByDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    return null;
  };

  // 💡 Analisis huruf pertama
  const karakterNama = {
    A: "Ambisius dan visioner 💼", B: "Bijaksana dan penyayang 💖", C: "Kreatif dan penuh ide 🎨",
    D: "Disiplin dan tegas ⚔️", E: "Ekspresif dan ramah 😄", F: "Friendly dan lembut 💫",
    G: "Gigih dan pekerja keras 🔥", H: "Humble tapi kuat 💪", I: "Intuitif dan imajinatif 🌙",
    J: "Jujur dan berjiwa pemimpin 🦁", K: "Kharismatik dan misterius 🕶️",
    L: "Loyal dan elegan 👑", M: "Mandiri dan fokus 🎯", N: "Natural dan penyayang 🌿",
    O: "Optimis dan suka petualangan 🏹", P: "Perfeksionis tapi romantis 💞",
    Q: "Quiet tapi tajam 🧠", R: "Ramah dan dapat dipercaya 🤝", S: "Sensitif tapi tangguh 💎",
    T: "Tegas dan berpikiran maju 🚀", U: "Unik dan suka kebebasan 🦋",
    V: "Visioner dan percaya diri 💫", W: "Wise dan berwawasan luas 🌍",
    X: "Xtra kreatif dan energik ⚡", Y: "Young at heart ❤️", Z: "Zesty dan spontan 🔥"
  };

  const moodHarian = [
    "Penuh semangat memulai minggu 💪", "Cocok buat refleksi diri 💭",
    "Energi sosialmu tinggi 🤝", "Waktu tenang buat recharge 🔋",
    "Kreativitasmu lagi deras 🎨", "Healing mode on 😌",
    "Nikmati hasil kerja kerasmu 🌟"
  ];

  const angkaKeberuntungan = (date) => {
    const sum = date.getDate() + (date.getMonth() + 1) + (date.getFullYear() % 100);
    return (sum % 9) + 1;
  };

  const prediksiHarian = [
    "Kabar baik datang dari arah tak terduga 📩",
    "Langkah beranimu akan membuahkan hasil 💥",
    "Seseorang diam-diam mengagumimu 👀",
    "Hari penuh ide dan inspirasi 🌿",
    "Akan ada momen bahagia sederhana 💞",
    "Keberuntunganmu meningkat drastis 🍀",
    "Kreativitasmu membuka peluang baru 🎭"
  ];

  const energiNama = (nama) => {
    const sum = nama.toUpperCase().split('').reduce((acc, c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return acc + (code - 64);
      return acc;
    }, 0);
    return (sum % 12) + 1;
  };

  const energiHari = (elemen) => {
    const hari = new Date().getDay();
    const bonus = {
      Api: hari === 0 ? 20 : 5,
      Tanah: hari === 4 ? 15 : 3,
      Udara: hari === 2 ? 10 : 4,
      Air: hari === 1 ? 12 : 6
    };
    return bonus[elemen] || 0;
  };

  const skorKosmis = (eNama, eHari, lucky) => Math.round((eNama + eHari + lucky) / 3);

  const prediksiElemen = {
    Api: ["Aksi besar menantimu 🔥", "Jangan takut bersinar ✨"],
    Air: ["Ikuti intuisi hatimu 🌊", "Tenangkan pikiranmu 💧"],
    Tanah: ["Bangun pondasi kuat 💪", "Jaga kestabilanmu 🌿"],
    Udara: ["Komunikasi jadi kuncimu 💨", "Ide-ide besar akan muncul 🌈"]
  };

  const harmoniNamaZodiak = (namaAwal, elemen) => {
    const vokal = "AEIOU";
    const isVokal = vokal.includes(namaAwal);
    if (isVokal && elemen === "Air") return "Harmoni tinggi 💖";
    if (!isVokal && elemen === "Api") return "Energi kuat tapi intens 🔥";
    if (isVokal && elemen === "Udara") return "Kreatif dan seimbang 🌈";
    return "Stabil tapi misterius 🌙";
  };

  const handleCek = () => {
    if (!input.trim()) return;
    setLoading(true);
    setZodiak(null);

    setTimeout(() => {
      const words = input.trim().split(" ");
      const nama = words[1] || words[0];
      const tanggalLahir = extractDate(input);

      if (!tanggalLahir) {
        setZodiak({
          error: true,
          message: "⚠️ Aku butuh tahu tanggal lahirmu juga. Contoh: 'Namaku Rina lahir 17 Mei 2001'."
        });
        setLoading(false);
        return;
      }

      const namaZodiak = getZodiakByDate(tanggalLahir);
      const data = zodiakData.find((z) => z.nama === namaZodiak);
      const hurufAwal = nama.trim().charAt(0).toUpperCase();
      const sifatNama = karakterNama[hurufAwal] || "Unik dan penuh misteri 🌌";
      const mood = moodHarian[new Date().getDay()];
      const luckyNum = angkaKeberuntungan(tanggalLahir);

      const eNama = energiNama(nama);
      const eHari = energiHari(data.elemen);
      const skor = skorKosmis(eNama, eHari, luckyNum);
      const harmoni = harmoniNamaZodiak(hurufAwal, data.elemen);
      const prediksiElemental =
        prediksiElemen[data.elemen][Math.floor(Math.random() * prediksiElemen[data.elemen].length)];
      const randomPrediksi = prediksiHarian[Math.floor(Math.random() * prediksiHarian.length)];

      let hasilSkor = "Seimbang dan stabil 🌿";
      if (skor > 80) hasilSkor = "Hari ini kamu unstoppable ⚡";
      else if (skor > 60) hasilSkor = "Energi kamu lagi optimal 🎯";
      else hasilSkor = "Saatnya istirahat dan refleksi 💫";

      setZodiak({
        ...data,
        nama,
        sifatNama,
        mood,
        luckyNum,
        randomPrediksi,
        eNama,
        eHari,
        skor,
        harmoni,
        hasilSkor,
        prediksiElemental
      });

      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a093d] via-[#3c0b59] to-[#6a1b9a] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffffff1a,_transparent_60%)] opacity-20"></div>

      <div className="z-10 text-center">
        <h1 className="text-5xl font-extrabold mb-3 drop-shadow-[0_0_10px_#b388ff]">✨ Zodiak Intelligence 3.0</h1>
        <p className="text-sm text-gray-300 mb-6">
          Ketik seperti ngobrol aja: <br />
          <span className="italic text-pink-300">“Namaku Rina lahir 17 Mei 2001”</span>
        </p>
      </div>

      <div className="z-10 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 w-80 md:w-96">
        <input
          type="text"
          placeholder="Tulis di sini..."
          className="p-3 rounded-lg w-full text-center bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCek()}
        />
        <button
          onClick={handleCek}
          className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 px-5 py-2 rounded-lg font-semibold transition-all w-full shadow-md"
        >
          {loading ? "Menganalisis nasibmu..." : "Kirim 🔮"}
        </button>
      </div>

      {loading && (
        <div className="z-10 mt-8 flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 border-4 border-t-transparent border-pink-400 rounded-full animate-spin"></div>
          <p className="text-sm italic text-gray-200">Membaca energi bintangmu 🌠</p>
        </div>
      )}

      {zodiak && !loading && !zodiak.error && (
        <div className="z-10 mt-8 bg-white/15 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl w-80 md:w-96 text-center animate-fadeIn">
          <h2 className="text-3xl font-bold mb-1 text-pink-300 drop-shadow-md">{zodiak.simbol} {zodiak.nama}</h2>
          <p className="text-xs italic mb-2 text-gray-200">{zodiak.tanggal}</p>

          <div className="text-left space-y-2 mt-3 text-sm text-gray-100">
            <p><span className="font-semibold text-pink-300">🌟 Elemen:</span> {zodiak.elemen}</p>
            <p><span className="font-semibold text-pink-300">💫 Sifat:</span> {zodiak.sifat}</p>
            <p><span className="font-semibold text-pink-300">🧬 Analisis Nama:</span> {zodiak.sifatNama}</p>
            <p><span className="font-semibold text-pink-300">📅 Mood Hari Ini:</span> {zodiak.mood}</p>
            <p><span className="font-semibold text-pink-300">🍀 Angka Keberuntungan:</span> {zodiak.luckyNum}</p>
            <p><span className="font-semibold text-pink-300">⚙️ Energi Nama:</span> {zodiak.eNama}</p>
            <p><span className="font-semibold text-pink-300">🌈 Energi Harian:</span> {zodiak.eHari}</p>
            <p><span className="font-semibold text-pink-300">🪐 Skor Kosmis:</span> {zodiak.skor}</p>
            <p><span className="font-semibold text-pink-300">💞 Harmoni:</span> {zodiak.harmoni}</p>
          </div>

          <div className="mt-4 text-white font-semibold">
            <p>{zodiak.hasilSkor}</p>
            <p className="mt-2">{zodiak.prediksiElemental}</p>
            <p className="mt-2">🔮 {zodiak.randomPrediksi}</p>
          </div>

          <p className="text-xs text-gray-300 mt-4 italic">
            — Ramalan untuk {zodiak.nama.trim()} hari ini 💖
          </p>
        </div>
      )}

      {zodiak?.error && (
        <p className="z-10 mt-6 text-sm bg-red-500/20 border border-red-300/30 p-3 rounded-xl text-center text-red-200 shadow-md">
          {zodiak.message}
        </p>
      )}
    </div>
  );
}
