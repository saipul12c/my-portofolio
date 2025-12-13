import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Component untuk menampilkan related items (projects, blog posts, soft skills)
 * dengan navigasi ke halaman detail
 */
export const RelatedItems = React.memo(({ 
  projects = [], 
  blogPosts = [], 
  skills = [],
  skillName = ""
}) => {
  // Group semua items berdasarkan kategori
  const allItems = useMemo(() => {
    const items = [];

    projects.forEach(project => {
      items.push({
        id: project.id,
        title: project.title,
        subtitle: project.category,
        description: project.overview || project.description,
        link: project.link,
        icon: "🚀",
        type: "project",
        color: "from-blue-500 to-blue-600"
      });
    });

    blogPosts.forEach(post => {
      items.push({
        id: post.id || post.slug,
        title: post.title,
        subtitle: post.category,
        description: post.excerpt,
        link: post.link,
        icon: "📚",
        type: "blog",
        color: "from-amber-500 to-amber-600",
        metadata: `${post.readTime} • ${post.views} views`
      });
    });

    skills.forEach(skill => {
      items.push({
        id: skill.id,
        title: skill.name,
        subtitle: skill.category,
        description: skill.description,
        link: skill.link,
        icon: "⭐",
        type: "skill",
        color: "from-purple-500 to-purple-600",
        metadata: `Level: ${skill.level}`
      });
    });

    return items;
  }, [projects, blogPosts, skills]);

  if (allItems.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "project":
        return <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "blog":
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "skill":
        return <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 sm:mt-8"
    >
      <h4 className="text-sm sm:text-base font-semibold text-gray-300 mb-3 sm:mb-4 flex items-center">
        <span className="w-1 h-1 sm:h-1.5 bg-cyan-400 rounded-full mr-2"></span>
        Konten Terkait dengan "{skillName}"
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {allItems.map((item, idx) => (
          <motion.div
            key={`${item.type}-${item.id}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <Link to={item.link} className="block">
              <div className="group bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 hover:from-[#1e293b]/80 hover:to-[#0f172a]/80 backdrop-blur-lg rounded-lg p-3 sm:p-4 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 h-full">
                
                {/* Header dengan Icon dan Type */}
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="text-lg sm:text-xl">{getIcon(item.type) || item.icon}</span>
                    <div className="flex-1">
                      <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                      <p className="text-xs text-cyan-400/70">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-2 sm:mb-3">
                  {item.description}
                </p>

                {/* Metadata */}
                {item.metadata && (
                  <p className="text-xs text-cyan-400/60">{item.metadata}</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA untuk explore lebih banyak */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3"
      >
        {projects.length > 0 && (
          <Link 
            to="/projects" 
            className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-lg hover:bg-cyan-500/10 transition-all"
          >
            Lihat Semua Projek
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        )}
        {blogPosts.length > 0 && (
          <Link 
            to="/blog" 
            className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-lg hover:bg-cyan-500/10 transition-all"
          >
            Baca Blog Terkait
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        )}
        {skills.length > 0 && (
          <Link 
            to="/SoftSkills" 
            className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 sm:gap-1.5 p-2 sm:p-2.5 rounded-lg hover:bg-cyan-500/10 transition-all"
          >
            Explore Soft Skills
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
});

RelatedItems.displayName = "RelatedItems";
