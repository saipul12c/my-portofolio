import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function CertificatesSection({ certificates, onSelect }) {
  return (
    <motion.section
      className="mt-24 w-full max-w-6xl text-center px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="block group mb-12 cursor-pointer">
        <Award className="w-12 h-12 text-pink-400 mx-auto mb-3 animate-pulse" />
        <h3 className="text-3xl sm:text-4xl font-extrabold text-pink-400 group-hover:text-pink-300 transition duration-300">
          {certificates.sectionTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {certificates.certificates.map((cert, i) => {
          const tagColors = [
            { bg: "bg-white/90", text: "text-black" },
            { bg: "bg-blue-400", text: "text-black" },
            { bg: "bg-yellow-400", text: "text-black" },
          ];
          const getRandomTagColor = () => tagColors[Math.floor(Math.random() * tagColors.length)];

          const levelColors = {
            Pemula: "bg-green-400 text-black",
            Menengah: "bg-yellow-400 text-black",
            Lanjutan: "bg-red-400 text-white",
          };

          return (
            <div
              key={i}
              onClick={() => onSelect(cert)}
              className="relative bg-gradient-to-tr from-pink-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 hover:scale-105 hover:shadow-xl transition-transform cursor-pointer group"
            >
              <div className="flex items-center justify-center mb-3">
                <img src={cert.organization.logo} alt={cert.organization.name} className="w-10 h-10 rounded-full" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{cert.name}</h4>
              <p className="text-gray-300 text-sm mb-2">{cert.organization.name}</p>

              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${levelColors[cert.level] || "bg-gray-400 text-black"}`}>
                {cert.level}
              </span>

              <p className="text-gray-200 text-sm mt-2 line-clamp-3">{cert.description}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {cert.tags.concat(cert.skills || []).map((tag, idx) => {
                  const color = getRandomTagColor();
                  return (
                    <span
                      key={idx}
                      className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                    >
                      #{tag}
                    </span>
                  );
                })}
              </div>

              <span className="text-pink-300 text-xs mt-3 inline-block group-hover:underline">Lihat Detail →</span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
