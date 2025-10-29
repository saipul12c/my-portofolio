import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Unlock, LogIn, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Unauthorized() {
  const [message, setMessage] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // Daftar pesan (dipindah ke dalam useEffect biar gak trigger warning)
    const messages = [
      "Ups, kamu belum punya izin ke halaman ini 😅",
      "Kunci masih dipegang admin... sabar ya 🔒",
      "Akses ditolak, tapi jangan khawatir — pintu ini belum waktunya dibuka.",
      "Sepertinya kamu butuh login dulu biar bisa lanjut 🚪",
      "Kamu belum terverifikasi, tapi semua bisa diurus kok 😉",
      "Hmm... sepertinya pintu ini terkunci untuk sementara.",
      "Kamu perlu izin tambahan untuk masuk ke sini 💛",
      "Pintunya lagi dijaga, mungkin minta izin dulu ya 🧍‍♂️",
      "Belum punya akses? Coba login atau hubungi admin deh.",
      "Keamanan dulu, akses nanti. Demi kebaikan bersama 🔐",
      "Kamu belum masuk sistem, coba login ulang ya ✨",
      "Halaman ini cuma buat user tertentu, jangan sedih ya 😅",
      "Izin kamu belum aktif, tapi tenang, semua bisa diurus 🛠️",
      "Server bilang ‘no entry’, tapi aku yakin kamu bisa dapetin izin nanti 💪",
      "Pintu ini sementara dikunci, admin sedang jaga 😎",
      "Login dulu biar sistem kenal kamu 🧠",
      "Akses ini eksklusif... tapi bukan berarti kamu nggak bisa dapetin 😉",
      "Yah, sistem kita agak protektif. Coba login ya!",
      "Sabar, keamanan dulu, kenyamanan kemudian 🛡️",
      "Halaman ini sensitif, butuh izin khusus 🪪",
      "Jangan khawatir, ini cuma masalah izin, bukan kamu 😅",
      "Pintu ini tertutup rapat, tapi admin bisa bantu kok 👨‍💻",
      "Sistem mendeteksi kamu belum punya akses, tapi mudah kok perbaikannya!",
      "Biar aman, kamu perlu login dulu. Yuk, klik tombolnya!",
      "Ssst... hanya yang login yang boleh masuk ke sini 👀",
      "Kamu belum login, tapi masih bisa balik ke beranda 🏡",
      "Oops! Akses ini sementara dikunci demi keamanan 🔐",
      "Kamu belum punya kunci pintu ini, tapi bisa minta ke admin 🗝️",
      "Nggak bisa masuk? Mungkin token login kamu kedaluwarsa ⏳",
      "Tenang, ini cuma masalah otorisasi, bukan akhir dunia 🌍",
      "Sistem bilang: 'Access Denied', tapi aku bilang: 'Keep trying!' 💪",
      "Login kamu mungkin sudah habis masa aktifnya, ayo masuk lagi!",
      "Kamu belum login. Tapi tenang, tombolnya udah siap di bawah 😄",
      "Ini bukan error, ini cuma sistem melindungi data 💾",
      "Kamu belum terautentikasi, tapi dunia masih indah kok 🌈",
      "Sistem sedang menjaga gerbang dengan ketat 🔐",
      "Aksesmu belum aktif, tapi admin pasti bisa bantu 🧰",
      "Pintu digital ini belum mengenalmu, login dulu ya 😊",
      "Bukan kamu yang salah, cuma izinmu belum lengkap ✋",
      "Kamu butuh login dulu sebelum bisa lanjut ke sini 🧭",
      "Yah, sistem ini agak pemalu, jadi belum kasih akses 😅",
      "Masuk dulu biar sistem bisa percaya kamu 👩‍💻",
      "Akses ini terbatas, tapi semua user punya harapan 😎",
      "Kalau kamu yakin seharusnya bisa masuk, hubungi admin 💌",
      "Login itu kayak ketuk pintu sebelum masuk rumah 🏠",
      "Kamu di luar pintu, tapi tombol login siap di depanmu 🚪",
      "Butuh izin dulu, biar semuanya tetap aman 🔑",
      "Admin bilang: 'Tunggu sebentar ya, aksesnya belum dibuka' ⏳",
      "Tenang, keamanan ini demi melindungi kamu juga ❤️",
      "Kamu belum punya izin, tapi masih bisa balik dengan aman 🔁",
    ];

    // Pilih pesan acak setiap kali halaman dimuat
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []); // ✅ Warning hilang, logika tetap sama

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] text-center px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white overflow-hidden">
      
      {/* Efek latar belakang */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-yellow-400/10 blur-[120px] rounded-full top-[20%] left-[10%] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full bottom-[10%] right-[20%]" />
      </div>

      {/* Animasi kunci */}
      <motion.div
        onClick={() => setUnlocked(!unlocked)}
        whileHover={{ scale: 1.1 }}
        className="relative cursor-pointer z-10"
      >
        {unlocked ? (
          <Unlock className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_#facc15] transition-all" />
        ) : (
          <Lock className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_#facc15] transition-all" />
        )}
      </motion.div>

      {/* Kode dan pesan */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent mt-8"
      >
        401 - Akses Ditolak
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-gray-300 text-lg max-w-lg leading-relaxed mt-4"
      >
        {message}
      </motion.p>

      {/* Tombol */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="flex flex-wrap gap-4 justify-center mt-8 z-10"
      >
        <Link
          to="/login"
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-yellow-400/30"
        >
          <LogIn size={18} /> Login Ulang
        </Link>

        <Link
          to="/contact"
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 transition-all rounded-xl font-semibold text-gray-200 shadow-lg"
        >
          <Mail size={18} /> Hubungi Admin
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 transition-all rounded-xl font-semibold text-white shadow-lg"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>

      {/* Catatan bawah */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-sm text-gray-500 mt-10 italic"
      >
        “Kadang akses tertutup bukan karena dilarang, tapi karena waktunya belum tiba.” 💫
      </motion.p>
    </div>
  );
}
