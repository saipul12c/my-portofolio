import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Video, Users } from "lucide-react";
import { getSkillMapping } from "../utils/skillRouteMap";

/**
 * Component untuk menampilkan external resources dan links terkait skill
 */
export const SkillResources = React.memo(({ skillName, isProgramming }) => {
  const mapping = getSkillMapping(skillName);

  if (!mapping.resourceLinks || Object.values(mapping.resourceLinks).every(v => !v)) {
    return null;
  }

  const resources = [
    {
      key: "documentation",
      label: "Dokumentasi",
      icon: <BookOpen className="w-4 h-4" />,
      color: "from-blue-400 to-blue-600"
    },
    {
      key: "tutorial",
      label: "Tutorial",
      icon: <Video className="w-4 h-4" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      key: "community",
      label: "Komunitas",
      icon: <Users className="w-4 h-4" />,
      color: "from-orange-400 to-orange-600"
    }
  ];

  const availableResources = resources.filter(
    resource => mapping.resourceLinks[resource.key]
  );

  if (availableResources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-cyan-500/20"
    >
      <h5 className="text-xs sm:text-sm font-semibold text-cyan-300 mb-3 flex items-center">
        <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></span>
        Resource Pembelajaran
      </h5>

      <div className="flex flex-wrap gap-2">
        {availableResources.map((resource) => (
          <motion.a
            key={resource.key}
            href={mapping.resourceLinks[resource.key]}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r ${resource.color} text-white text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {resource.icon}
            <span>{resource.label}</span>
            <ExternalLink className="w-3 h-3" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
});

SkillResources.displayName = "SkillResources";
