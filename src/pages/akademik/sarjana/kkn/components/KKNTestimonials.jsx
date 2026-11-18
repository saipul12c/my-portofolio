import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, Quote, Heart } from "lucide-react";

export default function KKNTestimonials({ testimonials = [] }) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
          Apresiasi & Suara Warga
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <MessageSquare className="w-8 h-8 text-pink-400" />
          Kesan & Testimoni Masyarakat
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Ungkapan tulus dari perangkat desa, kader posyandu, tokoh pemuda, dan dosen pembimbing atas dedikasi mahasiswa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 hover:border-pink-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 relative"
          >
            <div>
              {/* Star Rating & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  {item.highlight}
                </span>
              </div>

              {/* Quote Content */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 italic">
                "{item.content}"
              </p>
            </div>

            {/* Author Profile */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-pink-400/40"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {item.name}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {item.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
