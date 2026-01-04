import { motion } from "framer-motion";
import PhotoCard from "./PhotoCard";

export default function PhotoGrid({ photos, setSelectedPhoto, viewMode = "grid" }) {
  const gridClass = viewMode === "masonry" 
    ? "columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 w-full"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full";

  return (
    <motion.div
      className={gridClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      layout
    >
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          layout
          className={viewMode === "masonry" ? "mb-4 sm:mb-6 break-inside-avoid" : ""}
        >
          <PhotoCard 
            photo={photo} 
            onClick={() => setSelectedPhoto(photo)} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}