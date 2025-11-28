import { motion } from "framer-motion";
import { X, MapPin, Calendar, FileText, Image, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PhotoModal({ photo, onClose }) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex flex-col md:flex-row bg-[#0b1120] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 max-w-6xl w-full max-h-[90vh] md:max-h-[80vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 text-white/70 hover:text-white transition bg-black/50 rounded-full p-1 backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-auto">
          <img
            src={photo.img}
            alt={photo.title}
            className="h-full w-full object-contain transition-transform duration-300"
            loading="eager"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#111827]/90 backdrop-blur-md p-4 sm:p-6 text-gray-200 overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-2">{photo.title}</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">{photo.description}</p>

          <div className="space-y-2 text-xs text-gray-400 mb-4">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-cyan-400 flex-shrink-0" /> 
              <span className="truncate">{photo.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400 flex-shrink-0" />
              {new Date(photo.date_taken).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs border-t border-white/10 pt-3 mb-4">
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
            <div className="flex gap-1">
              {photo.color_palette?.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-white/20 shadow-md flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="pt-4 border-t border-white/10 mt-4">
            <p className="text-xs text-gray-400 mb-3 font-medium">Jelajahi Konten Terkait:</p>
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

          <div className="pt-4 border-t border-white/10 text-xs text-gray-500 text-center italic mt-4">
            © Syaiful Mukmin Photography
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}