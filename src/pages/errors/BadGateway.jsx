import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Network, RefreshCcw, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export default function BadGateway() {
  const messages = [
    "Server perantara kami sedang susah sinyal 😅",
    "Ups! Ada masalah di jalur komunikasi antar server.",
    "Jaringan lagi baper, jadi pesannya nggak nyampe 😭",
    "Server A udah jawab, tapi Server B lagi loading... lama banget!",
    "Oops, koneksi antar server sempat nyangkut. Kami segera perbaiki!",
    "Gateway kami lagi sibuk mikirin hidupnya 🧠💭",
    "Ada yang nyangkut di kabel jaringan, tim kami lagi benerin 🔧",
    "Permintaanmu nyasar di tengah jalan, tapi jangan khawatir 😌",
    "Server tengah kayaknya lagi ngopi dulu ☕",
    "Hmm... sepertinya sinyal antar server lagi buffering 📡",
    "Gateway timeout? Enggak, cuma lagi lambat mikirnya 😅",
    "Kami lagi ngecek kenapa pesan kamu belum sampai ke server tujuan 🔍",
    "Error 502 bukan salahmu, tapi kami yang lagi beresin 😔",
    "Sepertinya internet antar server lagi hujan deras 🌧️",
    "Server tengah sempat tersandung kode 👣",
    "Tunggu sebentar ya, kami lagi reset jaringan ⚙️",
    "Ada kemacetan data di jalur penghubung 🚧",
    "Server kami sedang melakukan sinkronisasi ulang 🔄",
    "Mungkin server perantara lagi main petak umpet 😆",
    "Kami udah panggil teknisi virtual buat beresin ini 🧑‍💻",
    "Jaringan sedang rehat sejenak, biar nggak burnout 💤",
    "Ada glitch kecil di gateway, lagi diperbaiki sekarang 💜",
    "Kami udah laporkan masalah ini ke sistem pusat 🚨",
    "Data nyasar di antariksa digital... kami lagi ambil pakai satelit 🛰️",
    "Tenang, semuanya akan segera tersambung kembali ✨",
  ];

  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] text-center px-6 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-900 text-white overflow-hidden">
      {/* Efek latar belakang */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full top-[10%] left-[15%] animate-pulse" />
        <div className="absolute w-[700px] h-[700px] bg-indigo-500/10 blur-[150px] rounded-full bottom-[10%] right-[10%]" />
      </div>

      {/* Ikon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <Network className="w-20 h-20 text-purple-400 drop-shadow-[0_0_20px_#a78bfa] animate-bounce" />
      </motion.div>

      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent mt-6 z-10"
      >
        502 - Bad Gateway
      </motion.h1>

      {/* Pesan */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-gray-300 text-lg max-w-xl leading-relaxed mt-4 z-10"
      >
        {message}
      </motion.p>

      {/* Tombol */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="flex flex-wrap gap-4 justify-center mt-8 z-10"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-400/30"
        >
          <RefreshCcw size={18} /> Coba Lagi
        </Link>

        <Link
          to="/status"
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl font-semibold text-gray-200 shadow-lg"
        >
          <WifiOff size={18} /> Cek Status Server
        </Link>
      </motion.div>

      {/* Catatan penutup */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-sm text-gray-500 mt-10 italic z-10"
      >
        “Kadang koneksi gagal, tapi semangat jangan ikut putus.” 💜
      </motion.p>
    </div>
  );
}
