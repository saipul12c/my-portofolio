import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, X } from "lucide-react";
import Maintenance from "./errors/Maintenance"; // 🚧 Tambahkan ini

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // 🚧 Mode Maintenance (set false agar halaman tetap aktif)
  const isMaintenance = false;

  if (isMaintenance) {
    return <Maintenance />;
  }

  const photos = [
    {
      id: 1,
      title: "Refleksi Senja",
      description:
        "Langit sore di tepian danau yang memantulkan warna jingga keemasan. Simbol ketenangan dan keseimbangan antara cahaya dan bayangan.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
      category: "Landscape",
    },
    {
      id: 2,
      title: "Cahaya Kota",
      description:
        "Ritme kehidupan urban yang tak pernah tidur, diabadikan dalam permainan cahaya neon dan refleksi kaca.",
      img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80",
      category: "Street",
    },
    {
      id: 3,
      title: "Kesederhanaan Alam",
      description:
        "Sebuah studi visual tentang ketenangan, keindahan alami, dan makna dalam kesunyian.",
      img: "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=900&q=80",
      category: "Nature",
    },
    {
      id: 4,
      title: "Malam di Kota Tua",
      description:
        "Bangunan tua yang bercerita tentang waktu, diwarnai cahaya lembut malam hari.",
      img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
      category: "Architecture",
    },
    {
      id: 5,
      title: "Langit & Laut",
      description:
        "Kontras antara biru langit dan biru laut — sederhana, namun memancarkan ketenangan dan harmoni.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      category: "Seascape",
    },
    {
      id: 6,
      title: "Potret Kehidupan",
      description:
        "Wajah manusia yang jujur — menyimpan kisah, emosi, dan pengalaman di setiap garisnya.",
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
      category: "Portrait",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6 mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Camera className="w-10 h-10 text-cyan-400" />
          Galeri Fotografi
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Visual bukan sekadar gambar — ia adalah bahasa emosi, waktu, dan cahaya.  
          Di sini, saya berbagi perjalanan dan perspektif melalui lensa pribadi 📸
        </p>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl group shadow-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400 transition-all cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Photo */}
            <img
              src={photo.img}
              alt={photo.title}
              className="w-full h-64 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[40%]"
            />

            {/* Watermark */}
            <p className="absolute bottom-3 right-4 text-[10px] sm:text-xs text-white/60 italic tracking-widest select-none">
              © Syaiful Mukmin Photography
            </p>

            {/* Overlay info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-5">
              <h3 className="text-lg font-semibold text-white">
                {photo.title}
              </h3>
              <p className="text-sm text-gray-300">{photo.category}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Artistic Statement */}
      <motion.section
        className="mt-24 max-w-4xl text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Sparkles className="w-10 h-10 text-cyan-300 mx-auto animate-pulse" />
        <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400">
          Filosofi di Balik Lensa
        </h3>
        <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
          Setiap foto adalah bentuk komunikasi — tanpa kata, namun penuh makna.  
          Saya percaya bahwa cahaya bukan sekadar alat teknis, tapi bahasa spiritual  
          yang menuntun pandangan dan emosi penikmatnya.
        </p>
      </motion.section>

      {/* Popup Viewer */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-white/10 border border-cyan-400/20 rounded-2xl p-4 sm:p-6 flex flex-col items-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-cyan-300 hover:text-white transition"
              >
                <X size={28} />
              </button>

              {/* Image */}
              <img
                src={selectedPhoto.img}
                alt={selectedPhoto.title}
                className="w-full h-[60vh] object-cover rounded-xl mb-6 shadow-lg"
              />

              {/* Watermark in popup */}
              <p className="absolute bottom-6 right-8 text-xs text-white/50 italic tracking-wider select-none">
                © Syaiful Mukmin Photography
              </p>

              {/* Description */}
              <h2 className="text-2xl font-semibold mb-2 text-cyan-300">
                {selectedPhoto.title}
              </h2>
              <p className="text-gray-300 text-center max-w-2xl">
                {selectedPhoto.description}
              </p>
              <p className="mt-3 text-sm text-gray-500 italic">
                Kategori: {selectedPhoto.category}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
