import { motion } from "framer-motion";
import { memo } from "react";
import PhotoCard from "./PhotoCard";

function PhotoGrid({ photos, setSelectedPhoto, viewMode = "grid" }) {
  const gridClass = viewMode === "masonry" 
    ? "columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 w-full"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full";

  return (
    <div className={gridClass}>
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
          className={viewMode === "masonry" ? "mb-4 sm:mb-6 break-inside-avoid" : ""}
        >
          <PhotoCard 
            photo={photo} 
            onClick={() => setSelectedPhoto(photo)} 
          />
        </motion.div>
      ))}
    </div>
  );
}

export default memo(PhotoGrid);