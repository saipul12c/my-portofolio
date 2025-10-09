import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ShieldCheck, AlertTriangle, Mail, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Forbidden() {
  const messages = [
    "Ups! Halaman ini terkunci demi keamanan sistem 🔐",
    "Kamu nggak punya izin ke area ini... kayak zona rahasia gitu 😅",
    "Sistem mendeteksi kamu mencoba masuk ke area terbatas 🚧",
    "Akses ditolak. Tapi jangan khawatir, bukan kamu yang salah 😉",
    "Halaman ini cuma untuk pengguna dengan hak istimewa 🪪",
    "Pintunya lagi dikunci rapat oleh sistem keamanan 🛡️",
    "Kamu belum punya izin yang cukup untuk melihat halaman ini.",
    "Keamanan sistem melarang akses sementara. Demi keamanan bersama 🔒",
    "Sepertinya kamu tersesat ke area admin 👀",
    "Hmm... ini area sensitif. Mungkin minta izin ke admin dulu?",
    "Halaman ini dilindungi oleh firewall super galak 🧱🔥",
    "Akses ini dibatasi. Tapi tenang, kamu masih bisa kembali dengan aman.",
    "Kamu butuh level akses yang lebih tinggi untuk masuk ke sini 🧠",
    "Server berkata: ‘Forbidden’, tapi aku bilang: ‘Coba hubungi admin!’ 💌",
    "Kamu menabrak batas sistem, tapi masih bisa balik kok 😅",
    "Akses ini dilindungi demi keamanan data pengguna lain.",
    "Area ini cuma untuk anggota tertentu. Bukan kamu, untuk sekarang 😎",
    "Akses ini dikunci oleh protokol keamanan. Demi keamanan bersama.",
    "Kamu tersesat di wilayah yang tidak boleh dimasuki 🚫",
    "Tenang, kamu masih bisa kembali ke halaman utama 🏡",
    "Server menolak akses ini, tapi kamu masih bisa kirim pesan ke admin 💬",
    "Sistem keamanan aktif. Akses ini dibatasi sementara.",
    "Kamu mencoba membuka pintu yang dikunci ganda 🔐🔐",
    "Tidak semua pintu terbuka untuk semua orang... termasuk yang ini 😅",
    "Ssst... area ini cuma untuk orang tertentu, bukan publik 😎",
    "Kamu butuh izin tambahan untuk melihat halaman ini 🔑",
    "Bukan kamu yang salah, ini cuma sistem yang ketat banget 🧠",
    "Jangan sedih, semua ada jalannya. Mungkin mulai dari login ulang?",
    "Kamu nyasar ke area rahasia. Admin sedang memantau 😅",
    "Coba balik ke beranda dulu deh, tempat yang lebih aman 🌤️",
    "Kamu menemukan ‘forbidden zone’ – selamat! (Tapi nggak bisa masuk 😆)",
    "Keamanan aktif. Akses dibatasi untuk melindungi data penting 💾",
    "Kamu nggak punya izin untuk membuka area ini, tapi boleh senyum dulu 😁",
    "Halaman ini tertutup rapat seperti brankas digital 🧰",
    "Akses ini dikunci. Tapi kalau kamu admin, hubungi sistem kontrol 🔐",
    "Area ini tidak untuk umum, mohon kembali ke jalur utama 🛣️",
    "Pintu digital berkata: ‘Tidak bisa lewat sini!’ 🚷",
    "Akses kamu terbatas, tapi tenang, masih banyak halaman menarik lain 💫",
    "Batas keamanan aktif — akses dilarang untuk sementara 🚫",
    "Area ini memiliki tingkat akses tinggi, bukan untuk semua pengguna ⚙️",
    "Kamu menabrak dinding keamanan virtual, tapi nggak apa-apa 😅",
    "Server menjaga data di area ini dengan ketat 🧱",
    "Akses gagal, tapi semangatmu tetap lolos 💪",
    "Kamu belum terdaftar untuk akses halaman ini 👩‍💻",
    "Coba hubungi admin, mungkin bisa bantu buka pintunya 🔑",
    "Akses ini bukan milikmu... tapi kamu masih bisa eksplor halaman lain 😄",
    "Kamu menemukan pintu yang terkunci rapat, tapi bukan tanpa harapan 💛",
    "Demi keamanan semua pengguna, halaman ini dilindungi.",
    "Sistem berkata ‘No Access’, tapi aku bilang ‘Keep exploring!’ 🌍",
  ];

  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100vh] text-center px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white overflow-hidden">
      
      {/* Efek latar cahaya */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-orange-500/10 blur-[120px] rounded-full top-[15%] left-[5%] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-amber-400/10 blur-[150px] rounded-full bottom-[10%] right-[10%]" />
      </div>

      {/* Ikon utama */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <ShieldAlert className="w-20 h-20 text-orange-400 drop-shadow-[0_0_20px_#f97316] animate-pulse" />
        <div className="absolute inset-0 blur-3xl bg-orange-400/20 rounded-full animate-ping" />
      </motion.div>

      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent mt-8 z-10"
      >
        403 - Akses Dilarang
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
          to="/contact"
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-orange-400/40"
        >
          <Mail size={18} /> Hubungi Admin
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl font-semibold text-gray-200 shadow-lg"
        >
          <Home size={18} /> Kembali ke Beranda
        </Link>
      </motion.div>

      {/* Catatan bawah */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-sm text-gray-500 mt-10 italic z-10"
      >
        “Kadang batasan dibuat bukan untuk membatasi, tapi untuk melindungi.” 🧡
      </motion.p>
    </div>
  );
}
