import { motion } from "framer-motion";

export default function PhotoCard({ photo, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl group shadow-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={photo.img}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <p className="absolute bottom-2 right-3 text-[10px] text-white/60 italic tracking-wide select-none">
        © Syaiful Mukmin
      </p>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
        <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-1">{photo.title}</h3>
        <p className="text-xs text-gray-300">{photo.category}</p>
      </div>
    </motion.div>
  );
}