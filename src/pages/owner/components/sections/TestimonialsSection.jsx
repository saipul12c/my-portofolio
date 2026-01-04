import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

/**
 * TestimonialsSection component - displays recent testimonials
 */
export const TestimonialsSection = ({ testimonials }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Testimonial Klien"
        description="Umpan balik dari kolaborasi profesional"
        icon={<MessageSquare className="w-8 h-8 text-amber-500" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map(testimonial => (
          <Link key={testimonial.id} to={`/testimoni/${testimonial.id}`}
               className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                          rounded-xl p-5 hover:border-teal-300 transition-all duration-300 
                          hover:shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center 
                            justify-center text-teal-600 flex-shrink-0 overflow-hidden">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold">{testimonial.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                <p className="text-slate-600 text-sm">{testimonial.role}, {testimonial.company}</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="font-bold text-slate-900">{testimonial.rating}</span>
              </div>
            </div>
            <p className="text-slate-700 text-sm italic mb-4 line-clamp-3">
              "{testimonial.text}"
            </p>
            <div className="text-xs text-slate-500">
              {new Date(testimonial.date).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
