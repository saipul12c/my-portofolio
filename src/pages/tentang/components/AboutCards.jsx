// AboutCards.jsx
import React, { useRef, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Code2,
  Camera,
  Rocket,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const iconMap = {
  Code2,
  Camera,
  Rocket,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Heart,
};

// Complete palette mappings with full support for cyan, blue, purple, etc.
const colorClasses = {
  cyan: {
    border: "border-cyan-500/20 group-hover:border-cyan-400/60",
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    text: "group-hover:text-cyan-300",
    icon: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    glow: "rgba(6, 182, 212, 0.15)",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
  },
  blue: {
    border: "border-blue-500/20 group-hover:border-blue-400/60",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    text: "group-hover:text-blue-300",
    icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    glow: "rgba(59, 130, 246, 0.15)",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
  },
  purple: {
    border: "border-purple-500/20 group-hover:border-purple-400/60",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    text: "group-hover:text-purple-300",
    icon: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    glow: "rgba(168, 85, 247, 0.15)",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
  },
  pink: {
    border: "border-pink-500/20 group-hover:border-pink-400/60",
    badge: "bg-pink-500/10 text-pink-300 border-pink-500/30",
    text: "group-hover:text-pink-300",
    icon: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    glow: "rgba(236, 72, 153, 0.15)",
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  green: {
    border: "border-emerald-500/20 group-hover:border-emerald-400/60",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    text: "group-hover:text-emerald-300",
    icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.15)",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  yellow: {
    border: "border-amber-500/20 group-hover:border-amber-400/60",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    text: "group-hover:text-amber-300",
    icon: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    glow: "rgba(245, 158, 11, 0.15)",
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Optimized GPU-accelerated interactive Card Container
const InteractiveCard = ({ children, className = "", colors }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative h-full rounded-2xl border bg-[#111c34]/70 hover:bg-[#132242]/85 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl overflow-hidden ${colors.border} ${className}`}
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      }}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), ${colors.glow}, transparent 70%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 h-full p-7 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

function AboutCards({ cards = [], imageSrc }) {
  if (!cards.length) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
          Fokus & Dedikasi
        </h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pilar Profesional & Akademik
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {cards.map((card, idx) => {
          const Icon = iconMap[card.icon] || Sparkles;
          const colors = colorClasses[card.color] || colorClasses.cyan;

          return (
            <motion.div
              key={card.id || idx}
              variants={cardVariants}
              className={`group flex flex-col h-full ${
                card.id === 3 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Link
                to={card.link || "#"}
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
              >
                <InteractiveCard colors={colors}>
                  <div>
                    {/* Card Top: Icon & Action hint */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${colors.icon}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3
                      className={`text-xl font-bold text-white mb-3 transition-colors duration-300 ${colors.text}`}
                    >
                      {card.title}
                    </h3>

                    {/* Card Body */}
                    {card.type === "list" && Array.isArray(card.content) ? (
                      <ul className="space-y-2.5 text-sm text-slate-300">
                        {card.content.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2.5 transition-transform duration-200 group-hover:translate-x-1"
                          >
                            <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${colors.badge}`} />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        {card.content}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom: Action Link */}
                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1.5">
                      Pelajari Selengkapnya
                    </span>
                    <div className="flex items-center gap-1 text-cyan-400 transform group-hover:translate-x-1.5 transition-transform">
                      <span>Buka</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </InteractiveCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export default memo(AboutCards);
