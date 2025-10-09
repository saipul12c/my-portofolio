import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCcw, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ServerError() {
  const messages = [
    "Ups! Ada yang error di sisi server. Kami sedang memperbaikinya.",
    "Server kami lagi sedikit pusing... tapi tenang, tim kami sudah turun tangan!",
    "Terjadi kesalahan di server. Coba lagi sebentar ya.",
    "Wah, server kami sedang tidak baik-baik saja 😅",
    "Maaf, ada masalah di sistem kami. Kami sedang memperbaikinya dengan cepat.",
    "Error 500: Mesin di balik layar lagi ngambek 🤖",
    "Tenang, bukan kamu kok yang salah — server-nya aja yang lagi sibuk.",
    "Kayaknya sistem kami butuh kopi dulu ☕",
    "Server overload! Kami sedang kasih dia waktu buat istirahat 😴",
    "Permintaanmu bagus, tapi server belum siap menerimanya 😅",
    "Server lagi ngerestart biar makin segar ✨",
    "Kami lagi perbaiki sesuatu di balik layar... sabar ya 🙏",
    "Waduh, ada yang nge-bug. Tapi jangan khawatir, udah kami tangani!",
    "Server-nya lagi merenung tentang kehidupan digital 💭",
    "Tenang aja, ini cuma kesalahan sementara.",
    "Kadang, bahkan server juga butuh waktu untuk introspeksi 😌",
    "Jaringan stabil, tapi otak server lagi nge-lag 🧠💥",
    "Ups, ada gangguan teknis — kami segera memperbaikinya!",
    "Kami lagi ngecek kabel yang longgar 🛠️",
    "Server kami barusan tersandung error 😅",
    "Error 500 bukan akhir dunia. Cuma tanda kita perlu istirahat sebentar.",
    "Mungkin server-nya kepanasan, kami lagi nyalain kipasnya 🔥🌀",
    "Kayaknya ada byte yang nyasar di dalam sistem 👾",
    "Server kami lagi reboot. Tunggu sebentar aja ya!",
    "Masalah internal terdeteksi. Tapi semuanya masih terkendali 💪",
    "Kami sedang bekerja keras untuk memperbaiki error ini 🧑‍💻",
    "Sabar ya... sistem kami lagi menata ulang kehidupannya 🧘",
    "Ups, ada error di balik layar! Tapi kamu tetap luar biasa ❤️",
    "Kadang kode bisa baper juga 😅",
    "Server kami sedang belajar dari kesalahan 💡",
    "Error ini udah dikirim ke tim teknis kami, mereka sedang beraksi ⚙️",
    "Hmm... sesuatu gak beres, tapi tenang, kami lagi atur ulang datanya.",
    "Koneksi baik, tapi logika server sedikit tersesat 🤔",
    "Kayaknya kabelnya ketarik dikit. Kami udah benerin kok 😆",
    "Server lagi reboot supaya jadi versi yang lebih tangguh 💥",
    "Server-nya kena drama internal 😭",
    "Kami tahu ini ganggu banget, makasih udah sabar 💙",
    "Server lagi melakukan introspeksi digital 🧘‍♂️",
    "Mungkin ini saat yang tepat buat ngopi dulu ☕",
    "Ada kesalahan sistem — tapi jangan khawatir, semua bisa diperbaiki 🙌",
    "Server-nya lagi mikir keras... mungkin terlalu keras 💭",
    "Tenang aja, tim kami udah bergerak cepat 🚀",
    "Ups! Kami kehilangan koneksi ke logika 🤖",
    "Ada yang crash, tapi bukan harapanmu 💫",
    "Server lagi marah kecil, tapi kami udah minta maaf 😅",
    "Tunggu sebentar, kami lagi reset server biar balik normal 🔁",
    "Mungkin ini tanda kamu perlu peregangan dulu 🧍‍♂️",
    "Server error bukan kesalahanmu. Kamu tetap keren 😎",
    "Kami lagi sulap sistem supaya normal lagi ✨",
    "Server-nya lupa script-nya sendiri 😬",
    "Kabar baik: error sudah kami laporkan ke tim ahli 👨‍🔧",
  ];

  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] text-center px-6 bg-gradient-to-br from-black via-gray-900 to-red-950 text-white overflow-hidden">

      {/* Efek latar belakang */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-red-600/10 blur-[140px] rounded-full top-[10%] left-[10%] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-rose-500/10 blur-[150px] rounded-full bottom-[10%] right-[10%]" />
      </div>

      {/* Ikon alert */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <AlertTriangle className="w-20 h-20 text-red-400 drop-shadow-[0_0_20px_#f87171] animate-bounce" />
      </motion.div>

      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent mt-6 z-10"
      >
        500 - Server Error
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

      {/* Tombol aksi */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="flex flex-wrap gap-4 justify-center mt-8 z-10"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-red-400/30"
        >
          <RefreshCcw size={18} /> Coba Lagi
        </Link>

        <Link
          to="/contact"
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 transition-all rounded-xl font-semibold text-gray-200 shadow-lg"
        >
          <Mail size={18} /> Laporkan Masalah
        </Link>
      </motion.div>

      {/* Pesan penutup */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-sm text-gray-500 mt-10 italic z-10"
      >
        “Kesalahan bisa terjadi, tapi yang penting kita selalu mencoba lagi.” ❤️
      </motion.p>
    </div>
  );
}
