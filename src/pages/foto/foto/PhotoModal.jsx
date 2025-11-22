import { motion } from "framer-motion";
import { X, MapPin, Calendar, FileText, Image, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PhotoModal({ photo, onClose }) {
  const navigate = useNavigate();
  return (
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition"
        >
          <X size={28} />
        </button>

        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={photo.img}
            alt={photo.title}
            className="h-full w-full object-contain md:object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        <div className="w-full md:w-[40%] flex flex-col bg-[#111827]/80 backdrop-blur-md p-6 text-gray-200 overflow-y-auto">
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">{photo.title}</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{photo.description}</p>

          <div className="space-y-1 text-xs text-gray-400 mb-4">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-cyan-400" /> {photo.location}
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400" />
              {new Date(photo.date_taken).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-white/10 pt-3 mb-4">
            <p><span className="text-gray-400">Kamera:</span> {photo.camera}</p>
            <p><span className="text-gray-400">Lensa:</span> {photo.lens}</p>
            <p><span className="text-gray-400">Focal:</span> {photo.focal_length}</p>
            <p><span className="text-gray-400">Aperture:</span> {photo.aperture}</p>
            <p><span className="text-gray-400">Shutter:</span> {photo.shutter_speed}</p>
            <p><span className="text-gray-400">ISO:</span> {photo.iso}</p>
          </div>

          <div className="border-t border-white/10 pt-3">
            <p className="text-xs mb-2 text-gray-400">
              Mood: <span className="text-cyan-300">{photo.mood}</span>
            </p>
            <div className="flex gap-2">
              {photo.color_palette?.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-gray-500 text-center italic mt-6">
            © Syaiful Mukmin Photography
          </div>

          {/* 🔗 Navigation Links Section */}
          <div className="pt-4 border-t border-white/10 mt-6">
            <p className="text-xs text-gray-400 mb-3 font-medium tracking-wide">Jelajahi Konten Terkait:</p>
            <div className="grid grid-cols-1 gap-2">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate("/gallery")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 hover:border-blue-400/60 rounded-lg transition-all text-xs text-blue-300"
              >
                <Image size={14} />
                <span>Galeri Kenangan</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate("/blog")}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 hover:border-purple-400/60 rounded-lg transition-all text-xs text-purple-300"
              >
                <FileText size={14} />
                <span>Blog & Cerita</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => navigate("/projects")}
                className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-400/30 hover:border-green-400/60 rounded-lg transition-all text-xs text-green-300"
              >
                <Zap size={14} />
                <span>Proyek & Portfolio</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
