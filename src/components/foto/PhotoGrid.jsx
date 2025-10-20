import { motion } from "framer-motion";
import PhotoCard from "./PhotoCard";

export default function PhotoGrid({ photos, setSelectedPhoto }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onClick={() => setSelectedPhoto(photo)} />
      ))}
    </motion.div>
  );
}
