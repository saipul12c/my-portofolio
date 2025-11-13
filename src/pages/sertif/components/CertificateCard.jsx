import { m } from "framer-motion";
import { Clock, ShieldCheck, Star } from "lucide-react";

const CertificateCard = ({ 
  cert, 
  tagColors, 
  onSelect,
  renderStars 
}) => {
  return (
    <m.div
      layout
      className="relative group bg-white/10 backdrop-blur-xl border border-white/10 hover:border-cyan-400 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.03 }}
    >
      <img
        src={cert.image || "/placeholder.jpg"}
        alt={cert.title}
        loading="lazy"
        onClick={() => onSelect(cert)}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-[25%]"
      />

      {/* Label seperti Projects */}
      {cert.tags?.[0] && (
        <span
          className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium border rounded-full ${
            tagColors[cert.tags[0]] ||
            "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
          }`}
        >
          {cert.tags[0]}
        </span>
      )}

      {/* Rating stars seperti Projects */}
      {cert.rating && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md">
          {renderStars(cert.rating)}
        </div>
      )}

      {/* Verified badge */}
      {cert.verified && (
        <div className="absolute top-12 right-4 flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md text-xs">
          <ShieldCheck size={12} />
          Verified
        </div>
      )}

      {/* Hover Overlay seperti Projects */}
      <div
        onClick={() => onSelect(cert)}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6"
      >
        <h3 className="text-lg font-bold text-white line-clamp-1">
          {cert.title}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-1">
          {cert.issuer} · {cert.year}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Clock size={14} className="text-cyan-400" />
          <span className="text-xs text-gray-300">{cert.duration}</span>
        </div>
      </div>
    </m.div>
  );
};

export default CertificateCard;