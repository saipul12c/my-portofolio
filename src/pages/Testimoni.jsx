import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function Testimoni() {
  const testimonials = [
    {
      name: "Digital Learning Studio",
      role: "Tim Produksi Edukasi Visual",
      text: "Bekerja sama dengan Syaiful adalah pengalaman luar biasa. Ia tidak hanya memahami aspek teknis, tetapi juga punya kepekaan estetika dan empati terhadap kebutuhan pengguna.",
      image: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Madrasah Tech Community",
      role: "Koordinator Pelatihan Digital",
      text: "Syaiful sangat berkomitmen dalam setiap proyek. Ia membawa semangat baru dalam dunia pendidikan berbasis teknologi dan selalu siap berbagi pengetahuan.",
      image: "https://i.pravatar.cc/150?img=54",
    },
    {
      name: "Kampus Merdeka Project",
      role: "Supervisor Pengembangan Media",
      text: "Integritas dan kreativitas Syaiful patut diacungi jempol. Hasil pekerjaannya selalu rapi, fungsional, dan selaras dengan visi pembelajaran modern.",
      image: "https://i.pravatar.cc/150?img=12",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6 mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Testimoni & Kolaborasi
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Berikut beberapa pengalaman dan kesan dari rekan kolaborasi yang pernah bekerja bersama saya.  
          Setiap proyek adalah perjalanan untuk belajar, beradaptasi, dan tumbuh bersama.
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg transition-all"
          >
            <Quote className="absolute top-6 right-6 text-cyan-400 w-6 h-6 opacity-80" />
            <div className="flex flex-col items-center text-center space-y-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
              <h3 className="text-lg font-semibold text-white">{t.name}</h3>
              <p className="text-sm text-cyan-300">{t.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{t.text}</p>
              <div className="flex justify-center gap-1 pt-2">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Closing Statement */}
      <motion.section
        className="mt-24 max-w-3xl text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400">
          Setiap Kolaborasi Adalah Proses Belajar
        </h3>
        <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
          Saya percaya kerja sama yang baik dibangun atas dasar komunikasi, profesionalitas,  
          dan saling menghargai. Terima kasih kepada semua pihak yang telah menjadi bagian  
          dari perjalanan saya dalam membangun karya dan inovasi di dunia pendidikan digital.
        </p>
      </motion.section>
    </main>
  );
}
