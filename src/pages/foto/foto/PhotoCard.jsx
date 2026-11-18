import { useState, useMemo, memo } from "react";
import { Camera, MapPin } from "lucide-react";

function PhotoCard({ photo, onClick, priority = false }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Optimasi resolusi thumbnail untuk grid (menghemat bandwidth dan GPU memory)
  const thumbnailSrc = useMemo(() => {
    if (!photo.img) return "";
    if (photo.img.includes("images.unsplash.com")) {
      return photo.img.replace(/w=\d+/, "w=600").replace(/q=\d+/, "q=75") + "&auto=format";
    }
    return photo.img;
  }, [photo.img]);

  // Progressive background color dari color_palette bawaan foto (Zero Layout Shift & instant visual)
  const placeholderStyle = useMemo(() => {
    if (Array.isArray(photo.color_palette) && photo.color_palette.length > 0) {
      const c1 = photo.color_palette[0];
      const c2 = photo.color_palette[1] || photo.color_palette[0];
      return {
        background: `linear-gradient(135deg, ${c1}33, ${c2}22, #0f172a)`
      };
    }
    return {
      background: "linear-gradient(135deg, #1e293b, #0f172a)"
    };
  }, [photo.color_palette]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl group shadow-xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer hover:shadow-cyan-500/20 transform hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.98]"
      style={{ contentVisibility: "auto", containIntrinsicSize: "300px 225px" }}
    >
      <div 
        className="aspect-[4/3] overflow-hidden relative"
        style={placeholderStyle}
      >
        {/* Progressive Palette & Shimmer Wave Loader */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
            <Camera className="w-10 h-10 text-cyan-400/30 animate-pulse relative z-10" />
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 bg-red-950/30 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-10 h-10 text-red-400/60 mx-auto mb-2" />
              <p className="text-xs text-red-300/80">Gagal memuat gambar</p>
            </div>
          </div>
        )}

        {/* Actual Image with Optimized Priority Loading */}
        <img
          src={thumbnailSrc}
          alt={photo.title}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "low"}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out group-hover:scale-105 group-hover:rotate-0.5 ${
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
        <div className="transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
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

      {/* Corner Badge for New/Featured/Album */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
        {photo.isAlbum && (
          <div className="px-2 py-0.5 bg-pink-600/90 text-white text-[10px] font-bold rounded-full shadow-lg border border-pink-400/60">
            🗂️ Album ({photo.albumCount})
          </div>
        )}
        {photo.isFromGallery && !photo.isAlbum && (
          <div className="px-2 py-0.5 bg-blue-600/90 text-white text-[10px] font-semibold rounded-full shadow-md border border-blue-400/60">
            ✨ Galeri
          </div>
        )}
        {photo.featured && !photo.isAlbum && (
          <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] font-bold rounded-full shadow-lg animate-pulse">
            ✨ Featured
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(PhotoCard);