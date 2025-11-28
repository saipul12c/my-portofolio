import { m } from "framer-motion";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { getLabelStyles } from "../../utils/hobbyUtils";

export default function HobbyCard({ hobby, label }) {
  const Icon = Icons[hobby.icon];
  
  return (
    <m.div
      layoutId={`hobby-${hobby.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative group bg-[#141a28]/60 p-7 rounded-2xl border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition-all duration-400 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
    >
      {/* Floating Label */}
      {label && (
        <m.span
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute -top-3 left-4 text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide shadow-md backdrop-blur-sm ${getLabelStyles(label)}`}
        >
          {label}
        </m.span>
      )}

      {/* Icon and Category */}
      <div className="mb-5 flex items-center justify-between">
        <Icon size={32} className={hobby.iconColor} />
        <span className="text-xs uppercase tracking-wide text-white/50">
          {hobby.category}
        </span>
      </div>

      {/* Title and Description */}
      <h2 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-cyan-300 transition-colors">
        {hobby.title}
      </h2>

      <p className="text-gray-400 text-[14px] leading-relaxed">
        {hobby.desc}
      </p>

      {/* Action Links */}
      <div className="mt-4 flex items-center justify-between">
        {hobby.link && (
          <ExternalLink href={hobby.link} label={hobby.linkLabel} />
        )}
        <DetailLink slug={hobby.slug} />
      </div>
    </m.div>
  );
}

// Sub-components for better organization
function ExternalLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-sm text-cyan-300 font-medium hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {label} →
    </a>
  );
}

function DetailLink({ slug }) {
  return (
    <Link
      to={`/hobbies/${slug}`}
      className="inline-block text-sm text-gray-400 font-medium hover:text-white transition-colors"
    >
      Lihat detail →
    </Link>
  );
}