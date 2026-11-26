import { memo, forwardRef } from "react";
import { m } from "framer-motion";
import { Link } from "react-router-dom";
import HobbyIcon from "../shared/HobbyIcon";
import { getLabelStyles } from "../../utils/hobbyUtils";

const HobbyCard = forwardRef(function HobbyCard({ hobby, label }, ref) {
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative group bg-[#141a28]/80 p-7 rounded-2xl border border-white/10 hover:border-cyan-400/40 transform-gpu hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(34,211,238,0.12)] flex flex-col justify-between"
    >
      <div>
        {/* Floating Label */}
        {label && (
          <span
            className={`absolute -top-3 left-4 z-10 border text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide shadow-md backdrop-blur-md ${getLabelStyles(label)}`}
          >
            {label}
          </span>
        )}

        {/* Icon and Category */}
        <div className="mb-5 flex items-center justify-between">
          <HobbyIcon name={hobby.icon} size={32} className={hobby.iconColor || "text-cyan-400"} />
          <span className="text-xs uppercase tracking-wide text-white/50 font-medium">
            {hobby.category}
          </span>
        </div>

        {/* Title and Description */}
        <h2 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-cyan-300 transition-colors">
          {hobby.title}
        </h2>

        <p className="text-gray-400 text-[14px] leading-relaxed line-clamp-3">
          {hobby.desc}
        </p>
      </div>

      {/* Action Links */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        {hobby.link ? (
          <ExternalLink href={hobby.link} label={hobby.linkLabel || "Kunjungi"} />
        ) : (
          <span />
        )}
        <DetailLink slug={hobby.slug} />
      </div>
    </m.div>
  );
});

// Sub-components for better organization
function ExternalLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-sm text-cyan-300 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
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
      className="inline-flex items-center text-sm text-gray-400 font-medium hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
    >
      Lihat detail →
    </Link>
  );
}

export default memo(HobbyCard);