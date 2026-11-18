import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Calendar, Eye, Sparkles } from "lucide-react";

export default function KKNGallery({ gallery = [], onSelectPhoto }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(["all"]);
    gallery.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [gallery]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "all") return gallery;
    return gallery.filter((g) => g.category === selectedCategory);
  }, [gallery, selectedCategory]);

  return (
    <section id="galeri" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
            Dokumentasi Visual
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <Camera className="w-8 h-8 text-cyan-400" />
            Galeri Momen Pengabdian
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2">
            Momen-momen berharga saat berinteraksi, bergotong-royong, dan mengabdi di tengah kehangatan warga desa.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer capitalize ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat === "all" ? `Semua Foto (${gallery.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -6 }}
            onClick={() => onSelectPhoto(photo)}
            className="group relative rounded-2xl overflow-hidden bg-[#0f172a] border border-white/10 hover:border-cyan-400/50 shadow-xl cursor-pointer transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Category Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                {photo.category}
              </span>

              {/* Hover Eye Overlay Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-3 rounded-full bg-cyan-500/80 text-white backdrop-blur-md shadow-lg shadow-cyan-500/30">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Description Info */}
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {photo.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2">
                {photo.desc}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  {photo.date}
                </span>
                <span className="flex items-center gap-1 line-clamp-1">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  {photo.location.split(" ")[0]}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
