import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star, ArrowRight, Quote } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * TestimonialsSection component - displays recent testimonials with dark theme
 */
export const TestimonialsSection = ({ testimonials = [] }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Testimonial Klien & Mitra Kolaborasi"
        description="Apresiasi nyata atas dedikasi dan kualitas hasil karya yang telah dikerjakan"
        icon={<MessageSquare className="w-5 h-5 text-emerald-400" />}
        to="/testimoni"
        linkText="Semua Testimoni"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <Link
            key={testimonial.id}
            to={`/testimoni/${testimonial.id}`}
            className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (testimonial.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-slate-700 group-hover:text-emerald-500/40 transition-colors" />
              </div>

              <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed mb-4 line-clamp-3">
                "{testimonial.text || testimonial.message || testimonial.feedback}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  testimonial.name?.charAt(0) || "U"
                )}
              </div>
              <div className="overflow-hidden">
                <h5 className="font-semibold text-white text-xs sm:text-sm group-hover:text-emerald-300 transition-colors truncate">
                  {testimonial.name}
                </h5>
                <p className="text-[11px] text-slate-400 truncate">
                  {testimonial.role || "Mitra"} • {testimonial.company || "Kolaborator"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
