import { motion } from "framer-motion";

export default function PhotoCard({ photo, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative overflow-hidden rounded-2xl group shadow-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400 transition-all cursor-pointer"
      onClick={onClick}
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
  );
}
