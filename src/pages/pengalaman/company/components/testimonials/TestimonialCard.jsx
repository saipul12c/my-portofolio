import { motion } from "framer-motion";
import { Calendar, DollarSign, ExternalLink } from "lucide-react";
import RatingStars from "../RatingStars";

const TestimonialCard = ({ testimonial, navigate }) => {
  const authorSlug = testimonial.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/testimoni/authors/${authorSlug}`)}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/testimoni/authors/${authorSlug}`);
        }
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h4 className="font-semibold text-lg text-white group-hover:text-emerald-400 transition-colors">
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-400">{testimonial.role}</p>
            </div>
            <RatingStars rating={testimonial.rating} />
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            "{testimonial.text}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {testimonial.project && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-gray-400 mb-1">Proyek</div>
                <div className="text-white font-semibold truncate">{testimonial.project}</div>
              </div>
            )}
            {testimonial.project_duration && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-1 text-gray-400 mb-1">
                  <Calendar size={12} />
                  Durasi
                </div>
                <div className="text-white font-semibold">{testimonial.project_duration}</div>
              </div>
            )}
            {testimonial.budget_range && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-1 text-gray-400 mb-1">
                  <DollarSign size={12} />
                  Budget
                </div>
                <div className="text-white font-semibold">{testimonial.budget_range}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-1 text-emerald-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Lihat profil</span>
          <ExternalLink size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;