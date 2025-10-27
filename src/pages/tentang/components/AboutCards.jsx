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

export default function AboutCards({ cards }) {
  return (
    <motion.div
      className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
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
            className={`group bg-white/10 backdrop-blur-xl ${borderColor} rounded-2xl p-8 shadow-lg transition-all hover:scale-[1.04] ${
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
  );
}
