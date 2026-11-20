import { memo } from "react";
import { m } from "framer-motion";
import HobbyIcon from "../shared/HobbyIcon";

function DetailHeader({ hobby }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="flex justify-center mb-6">
        <IconSection hobby={hobby} />
      </div>

      <CategoryBadge category={hobby.category} />

      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-cyan-200 to-purple-300 bg-clip-text text-transparent">
        {hobby.title}
      </h1>

      <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
        {hobby.desc}
      </p>

      <div className="mt-6 flex justify-center">
        <div className="w-32 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60" />
      </div>
    </m.div>
  );
}

function IconSection({ hobby }) {
  return (
    <div className="relative">
      <div className={`p-5 rounded-3xl ${hobby.color || "from-teal-400/30 to-sky-500/10"} shadow-xl ring-1 ring-white/5 transform-gpu`}>
        <div className="bg-black/20 p-3 rounded-2xl backdrop-blur-sm inline-flex items-center justify-center">
          <HobbyIcon name={hobby.icon} size={56} className={`${hobby.iconColor || "text-cyan-400"} drop-shadow-sm`} />
        </div>
      </div>
      <div className="absolute -inset-0.5 rounded-3xl pointer-events-none" />
    </div>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-white/6 to-white/3 text-white/80 text-sm font-semibold mb-4 border border-white/6">
      {category}
    </span>
  );
}

export default memo(DetailHeader);