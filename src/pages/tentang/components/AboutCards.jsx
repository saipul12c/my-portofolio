// AboutCards.jsx
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

export default function AboutCards({ cards, imageSrc }) {
  return (
    <section className="mt-16 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-10 px-4">
      {/* Bagian Kiri - Kartu */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {cards.map((card, i) => {
          const Icon = iconMap[card.icon];
          const borderColor = `border-${card.color}-400/20 hover:border-${card.color}-400`;
          const textHover = `group-hover:text-${card.color}-300`;

          return (
            <Link
              key={i}
              to={card.link}
              className={`group bg-white/10 backdrop-blur-xl ${borderColor} border rounded-2xl p-8 shadow-lg transition-all hover:scale-[1.04] ${
                card.id === 3 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {Icon && (
                <Icon className={`w-10 h-10 text-${card.color}-400 mb-4`} />
              )}
              <h2
                className={`text-xl font-semibold mb-3 ${textHover} transition`}
              >
                {card.title}
              </h2>

              {card.type === "list" ? (
                <ul className="text-gray-300 text-sm space-y-2">
                  {card.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {card.content}
                </p>
              )}
            </Link>
          );
        })}
      </motion.div>

      {/* Bagian Kanan - Foto */}
      {imageSrc && (
        <motion.div
          className="relative flex-shrink-0 w-full max-w-sm lg:max-w-md"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <img
            src={imageSrc}
            alt="About Illustration"
            className="rounded-3xl shadow-2xl object-cover w-full h-auto border border-white/20"
          />
          {/* Efek dekoratif */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-indigo-500/20 blur-3xl -z-10" />
        </motion.div>
      )}
    </section>
  );
}
