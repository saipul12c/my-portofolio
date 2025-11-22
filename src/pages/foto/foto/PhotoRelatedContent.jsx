import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Image, BookOpen, Lightbulb } from "lucide-react";

export default function PhotoRelatedContent() {
  const navigate = useNavigate();

  const relatedContent = [
    {
      id: 1,
      icon: Image,
      title: "Galeri Kenangan",
      description: "Koleksi album, video, dan shorts eksklusif dari petualangan saya.",
      color: "from-blue-600/20 to-cyan-600/20",
      borderColor: "border-blue-400/30",
      textColor: "text-blue-300",
      hoverBg: "hover:bg-blue-500/10",
      route: "/gallery",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Blog & Cerita",
      description: "Refleksi, insight, dan cerita di balik setiap momen fotografi.",
      color: "from-purple-600/20 to-pink-600/20",
      borderColor: "border-purple-400/30",
      textColor: "text-purple-300",
      hoverBg: "hover:bg-purple-500/10",
      route: "/blog",
    },
    {
      id: 3,
      icon: Lightbulb,
      title: "Proyek & Portfolio",
      description: "Karya-karya berbasis teknologi yang menggabungkan seni dan inovasi.",
      color: "from-green-600/20 to-emerald-600/20",
      borderColor: "border-green-400/30",
      textColor: "text-green-300",
      hoverBg: "hover:bg-green-500/10",
      route: "/projects",
    },
  ];

  return (
    <section className="w-full py-16 px-6 sm:px-10 md:px-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-3">
            Jelajahi Dunia Saya
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Fotografi adalah jendela ke cerita yang lebih besar. Temukan konten terkait yang akan memperkaya pengalaman Anda.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedContent.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.route)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden rounded-2xl p-6 border backdrop-blur-xl transition-all duration-300 ${item.borderColor} ${item.hoverBg} text-left`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

                {/* Content */}
                <div className="flex flex-col h-full gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center border ${item.borderColor} group-hover:bg-white/10 transition-all`}>
                    <Icon size={24} className={item.textColor} />
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold ${item.textColor} mb-2`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors mt-auto">
                    <span>Jelajahi</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <span className="text-gray-400 text-xs">Lebih banyak konten</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
