import { m } from "framer-motion";

export default function HobbyFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex flex-wrap justify-center gap-3 mb-12"
    >
      {categories.map((category) => (
        <FilterButton
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </m.div>
  );
}

function FilterButton({ category, isSelected, onClick }) {
  const baseClasses = "px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300";
  const selectedClasses = "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]";
  const unselectedClasses = "border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/40";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {category}
    </button>
  );
}