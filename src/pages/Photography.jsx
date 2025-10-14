import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, X, MapPin, Aperture, Calendar } from "lucide-react";
import Maintenance from "./errors/Maintenance";
import photos from "../data/foto/photos.json";

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const isMaintenance = false;
  if (isMaintenance) return <Maintenance />;

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
            <img
              src={photo.img}
              alt={photo.title}
              className="w-full h-64 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[40%]"
            />
            <p className="absolute bottom-3 right-4 text-[10px] sm:text-xs text-white/60 italic tracking-widest select-none">
              © Syaiful Mukmin Photography
            </p>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-5">
              <h3 className="text-lg font-semibold text-white">{photo.title}</h3>
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

      {/* Popup Instagram-like */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex flex-col md:flex-row bg-[#0b1120] rounded-2xl overflow-hidden border border-white/10 max-w-5xl w-full h-[80vh]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              {/* Tombol Close */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition"
              >
                <X size={28} />
              </button>

              {/* Foto */}
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.img}
                  alt={selectedPhoto.title}
                  className="h-full w-full object-contain md:object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-[40%] flex flex-col bg-[#111827]/80 backdrop-blur-md p-6 text-gray-200 overflow-y-auto">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                    {selectedPhoto.title}
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    {selectedPhoto.description}
                  </p>

                  {/* Metadata utama */}
                  <div className="space-y-1 text-xs text-gray-400 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-cyan-400" />
                      {selectedPhoto.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={14} className="text-cyan-400" />
                      {new Date(selectedPhoto.date_taken).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Detail Teknis */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-white/10 pt-3 mb-4">
                    <p><span className="text-gray-400">Kamera:</span> {selectedPhoto.camera}</p>
                    <p><span className="text-gray-400">Lensa:</span> {selectedPhoto.lens}</p>
                    <p><span className="text-gray-400">Focal:</span> {selectedPhoto.focal_length}</p>
                    <p><span className="text-gray-400">Aperture:</span> {selectedPhoto.aperture}</p>
                    <p><span className="text-gray-400">Shutter:</span> {selectedPhoto.shutter_speed}</p>
                    <p><span className="text-gray-400">ISO:</span> {selectedPhoto.iso}</p>
                  </div>

                  {/* Mood & Palet Warna */}
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs mb-2 text-gray-400">
                      Mood: <span className="text-cyan-300">{selectedPhoto.mood}</span>
                    </p>
                    <div className="flex gap-2">
                      {selectedPhoto.color_palette?.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-white/10 text-xs text-gray-500 text-center italic mt-6">
                  © Syaiful Mukmin Photography
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
