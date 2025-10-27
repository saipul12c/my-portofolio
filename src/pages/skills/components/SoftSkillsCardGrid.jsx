import { motion, AnimatePresence } from "framer-motion";

export default function SoftSkillsCardGrid({ filteredSkills, search, highlightText, navigate }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
      <AnimatePresence>
        {filteredSkills.map((skill, i) => (
          <motion.div
            key={skill.id || skill.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            viewport={{ once: true }}
            className={`relative p-6 rounded-3xl shadow-xl border border-gray-700 bg-gradient-to-br ${skill.cardGradient} hover:scale-105 hover:shadow-2xl transition-all cursor-pointer backdrop-blur-lg`}
            onClick={() => navigate(`/SoftSkills/${skill.id}`)}
          >
            {skill.labels?.length > 0 && (
              <div className="absolute -top-4 left-4 flex flex-wrap gap-2 z-10">
                {skill.labels.map((label, i) => (
                  <span
                    key={i}
                    className={`text-xs font-semibold px-3 py-1 rounded-full shadow ${skill.labelColorMap[label]}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-2xl">
                {skill.category}
              </span>
              <span
                className={`text-xs font-medium px-4 py-1 rounded-2xl ${skill.levelColor}`}
              >
                {skill.level}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {highlightText(skill.name, search)}
            </h2>
            <p className="text-gray-100 text-sm leading-relaxed line-clamp-3">
              {highlightText(skill.description || "", search)}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
