import { motion } from "framer-motion";
import PhotoCard from "./PhotoCard";

export default function PhotoGrid({ photos, setSelectedPhoto }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
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