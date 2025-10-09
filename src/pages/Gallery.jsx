import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, PlayCircle, X } from "lucide-react";
import Maintenance from "./errors/Maintenance"; // 🚧 Tambahkan ini!

export default function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  // 🚧 Mode Maintenance (set false agar halaman tetap tampil)
  const isMaintenance = false;

  if (isMaintenance) {
    return <Maintenance />; // Jika true → tampilkan halaman Maintenance
  }

  const galleryItems = [
    {
      id: 1,
      type: "image",
      title: "Senja di Pelabuhan",
      desc: "Langit jingga memantul di permukaan air, menghadirkan suasana damai dan nostalgia.",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      category: "Landscape",
    },
    {
      id: 2,
      type: "video",
      title: "Kehidupan Kampus",
      desc: "Cuplikan video pendek tentang suasana belajar dan interaksi mahasiswa di kampus.",
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "Education",
    },
    {
      id: 3,
      type: "image",
      title: "Warna Malam",
      desc: "Permainan warna lampu kota di malam hari, memantulkan nuansa urban yang hangat.",
      src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80",
      category: "Street",
    },
    {
      id: 4,
      type: "image",
      title: "Potret Bahagia",
      desc: "Senyum tulus yang terekam tanpa skenario. Momen sederhana, makna mendalam.",
      src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
      category: "Portrait",
    },
    {
      id: 5,
      type: "video",
      title: "Belajar Digital",
      desc: "Cuplikan pendek dari projek media pembelajaran berbasis video animatif.",
      src: "https://www.w3schools.com/html/movie.mp4",
      category: "Project",
    },
    {
      id: 6,
      type: "image",
      title: "Harmoni Alam",
      desc: "Bidikan sederhana dedaunan hijau yang menyimbolkan ketenangan dan kehidupan.",
      src: "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=900&q=80",
      category: "Nature",
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Image className="w-10 h-10 text-cyan-400" />
          Galeri Media
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Kumpulan karya visual — foto dan video — yang menggambarkan perjalanan,
          kreativitas, serta nilai edukatif dalam setiap frame 🎥📸
        </p>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {galleryItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedMedia(item)}
            className="relative overflow-hidden rounded-2xl group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400 transition-all cursor-pointer shadow-lg"
          >
            {/* Media Preview */}
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-64 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[30%]"
              />
            ) : (
              <video
                src={item.src}
                className="w-full h-64 object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition"
                muted
                autoPlay
                loop
              />
            )}

            {/* Watermark */}
            <p className="absolute bottom-3 right-4 text-[10px] sm:text-xs text-white/60 italic tracking-wider select-none">
              © Syaiful Mukmin Media
            </p>

            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-5">
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300">{item.category}</p>
            </div>

            {/* Play Icon for Videos */}
            {item.type === "video" && (
              <PlayCircle className="absolute top-4 left-4 w-8 h-8 text-cyan-300 opacity-80 group-hover:scale-110 transition-transform" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedMedia && (
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
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 text-cyan-300 hover:text-white transition"
              >
                <X size={28} />
              </button>

              {/* Media Content */}
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="w-full h-[60vh] object-cover rounded-xl mb-6 shadow-lg"
                />
              ) : (
                <video
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  className="w-full h-[60vh] object-cover rounded-xl mb-6 shadow-lg"
                />
              )}

              {/* Watermark */}
              <p className="absolute bottom-6 right-8 text-xs text-white/50 italic tracking-wider select-none">
                © Syaiful Mukmin Media
              </p>

              {/* Text Info */}
              <h2 className="text-2xl font-semibold mb-2 text-cyan-300">
                {selectedMedia.title}
              </h2>
              <p className="text-gray-300 text-center max-w-2xl">
                {selectedMedia.desc}
              </p>
              <p className="mt-3 text-sm text-gray-500 italic">
                Kategori: {selectedMedia.category}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
