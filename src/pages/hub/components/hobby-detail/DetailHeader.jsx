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
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-purple-300 bg-clip-text text-transparent">
        {hobby.title}
      </h1>
      
      <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
        {hobby.desc}
      </p>
    </m.div>
  );
}

function IconSection({ hobby, Icon }) {
  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${hobby.color} backdrop-blur-md border border-white/10`}>
      <Icon size={48} className={hobby.iconColor} />
    </div>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/70 text-sm font-medium mb-4">
      {category}
    </span>
  );
}