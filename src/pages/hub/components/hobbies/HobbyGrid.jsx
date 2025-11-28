import { m, AnimatePresence } from "framer-motion";
import HobbyCard from "./HobbyCard";

export default function HobbyGrid({ filteredHobbies }) {
  if (filteredHobbies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Tidak ada hobi yang ditemukan untuk kategori ini.</p>
      </div>
    );
  }

  return (
    <m.section
      layout
      transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
    >
      <AnimatePresence mode="popLayout">
        {filteredHobbies.map((hobby) => (
          <HobbyCard 
            key={hobby.id} 
            hobby={hobby} 
            label={hobby.label} 
          />
        ))}
      </AnimatePresence>
    </m.section>
  );
}