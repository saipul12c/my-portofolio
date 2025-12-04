import { m } from "framer-motion";
import * as Icons from "lucide-react";

export default function DetailHeader({ hobby }) {
  const Icon = Icons[hobby.icon];

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <div className="flex justify-center mb-6">
        <IconSection hobby={hobby} Icon={Icon} />
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

function IconSection({ hobby, Icon }) {
  return (
    <div className="relative">
      <div className={`p-5 rounded-3xl ${hobby.color} shadow-xl ring-1 ring-white/5 transform-gpu`}>
        <div className="bg-black/20 p-3 rounded-2xl backdrop-blur-sm inline-flex items-center justify-center">
          <Icon size={56} className={`${hobby.iconColor} drop-shadow-sm`} />
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