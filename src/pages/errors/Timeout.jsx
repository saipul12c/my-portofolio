import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, RefreshCcw, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Timeout() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const messages = [
      "Server-nya lagi rebahan bentar 😴, coba muat ulang ya!",
      "Waktu habis! Sepertinya koneksi agak ngantuk 💤",
      "Timeout! Server butuh kopi dulu ☕",
      "Ups, respon server terlalu lama... mungkin lagi buffering 😅",
      "Halaman ini tersesat di ruang waktu 🕒",
      "Koneksi kamu baik-baik aja? Coba periksa sinyal dulu 📶",
      "Mungkin internet kamu lagi jalan santai 🚶‍♂️",
      "Server-nya sibuk mikir, sabar ya 🧠",
      "Permintaan kamu nyangkut di alam semesta digital 🌌",
      "Waktu permintaan habis... tapi harapan belum 💙",
      "Tenang, bukan kamu yang salah. Server-nya aja yang lambat 😅",
      "Jaringanmu lagi ngopi bareng server ☕",
      "Mungkin waktunya refresh halaman dan tarik napas dalam-dalam 😌",
      "Server-nya sibuk merenung, coba lagi sebentar lagi 🔄",
      "Sabar ya, sistem lagi berusaha bangkit dari timeout 😅",
      "Permintaanmu lelah di jalan... coba kirim ulang 📨",
      "Hmm, sepertinya jaringanmu lagi libur 😅",
      "Timeout itu kayak ngirim chat tapi nggak dibales 🥲",
      "Coba muat ulang — siapa tahu kali ini servernya udah bangun 😴",
      "Jaringanmu lambat, tapi semangatmu cepat ⚡",
      "Server-nya kayak mantan, bilang 'nanti' tapi nggak pasti 😬",
      "Tenang, semua akan di-*reload* pada waktunya 💫",
      "Permintaanmu nyangkut di awan digital ☁️",
      "Coba tekan tombol di bawah, biar kita mulai lagi dari awal 🔁",
      "Koneksi ini lagi slow mode, bukan kamu aja 😆",
      "Server-nya lagi update status... 'BRB' ⏳",
      "Mungkin ini saatnya istirahat sebentar dari layar 👀",
      "Timeout bukan akhir dunia, cuma jeda kecil 😇",
      "Koneksi ini kayak sinetron — penuh penantian 🕰️",
      "Sinyalmu kayak perasaan, kadang kuat kadang hilang 😭",
      "Server-nya lagi ngambek. Coba bujuk dengan klik ulang 😅",
      "Terlalu lama menunggu? Ayo klik ulang dan lanjut berjuang 🔄",
      "Jaringan lagi lambat, tapi halaman ini tetap sabar nungguin kamu 💙",
      "Coba reload, siapa tahu sekarang udah lancar ⚙️",
      "Server-nya kayak Wi-Fi tetangga... sinyalnya gak stabil 🤭",
      "Waktu permintaan habis, tapi semangat belum!",
      "Sabar ya, sistem kadang juga butuh waktu untuk berpikir 🧘",
      "Koneksi terputus sementara — kayak hubungan jarak jauh 💔",
      "Waktu habis, tapi harapan masih menyala 🔥",
      "Coba lagi, dan kali ini kita pasti berhasil 💪",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] text-center px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden">
      
      {/* Efek latar belakang */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-blue-500/10 blur-[120px] rounded-full top-[15%] left-[5%] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-400/10 blur-[150px] rounded-full bottom-[10%] right-[10%]" />
      </div>

      {/* Ikon jam */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="relative z-10"
      >
        <Clock className="w-20 h-20 text-blue-400 drop-shadow-[0_0_20px_#60a5fa]" />
        <div className="absolute inset-0 blur-3xl bg-blue-400/20 rounded-full animate-pulse" />
      </motion.div>

      {/* Kode dan judul */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mt-8 z-10"
      >
        408 - Waktu Habis
      </motion.h1>

      {/* Pesan */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-gray-300 text-lg max-w-xl leading-relaxed mt-4 z-10"
      >
        {message}
      </motion.p>

      {/* Tombol aksi */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex flex-wrap gap-4 justify-center mt-8 z-10"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-blue-400/30"
        >
          <RefreshCcw size={18} /> Muat Ulang
        </Link>

        <Link
          to="/contact"
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl font-semibold text-gray-200 shadow-lg"
        >
          <Mail size={18} /> Hubungi Admin
        </Link>
      </motion.div>

      {/* Catatan bawah */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-sm text-gray-500 mt-10 italic z-10"
      >
        “Kadang yang lambat bukan koneksi... tapi waktu yang minta kamu istirahat sebentar.” 🕊️
      </motion.p>
    </div>
  );
}
