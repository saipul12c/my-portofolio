import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin } from "lucide-react";

function PhotoCard({ photo, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Optimasi resolusi thumbnail untuk grid (menghemat bandwidth dan GPU memory)
  const thumbnailSrc = useMemo(() => {
    if (!photo.img) return "";
    if (photo.img.includes("images.unsplash.com")) {
      return photo.img.replace(/w=\d+/, "w=600").replace(/q=\d+/, "q=75");
    }
    return photo.img;
  }, [photo.img]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setLoadProgress(100);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl group shadow-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/60 transition-all cursor-pointer hover:shadow-cyan-500/20 will-change-transform"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        {/* Skeleton Loader */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-600 animate-pulse" />
            </div>
            {/* Loading Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <p className="text-xs text-red-300">Gagal memuat gambar</p>
            </div>
          </div>
        )}

        {/* Actual Image with Optimized Resolution */}
        <img
          src={thumbnailSrc}
          alt={photo.title}
          decoding="async"
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      {/* Watermark */}
      <p className="absolute bottom-2 right-3 text-[10px] text-white/60 italic tracking-wide select-none z-10 pointer-events-none">
        © Syaiful Mukmin
      </p>
      
      {/* Hover Overlay with Enhanced Info (Responsive CSS Transition) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 pointer-events-none">
        <div className="transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-1">
            {photo.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="px-2 py-0.5 bg-cyan-500/20 rounded-full border border-cyan-400/30">
              {photo.category}
            </span>
            {photo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-cyan-400" />
                <span className="line-clamp-1">{photo.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Corner Badge for New/Featured */}
      {photo.featured && (
        <div className="absolute top-2 left-2 z-10">
          <motion.div
            className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] font-bold rounded-full shadow-lg"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨ Featured
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default memo(PhotoCard);