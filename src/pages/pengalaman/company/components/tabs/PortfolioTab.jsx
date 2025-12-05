import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../animations/variants";
import { ExternalLink } from "lucide-react";

const PortfolioTab = ({ portfolio }) => {
  if (!portfolio || portfolio.length === 0) {
    return <div className="text-gray-400">Tidak ada portfolio yang tersedia</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Portfolio Proyek</h2>
      <div className="grid gap-6">
        {portfolio.map((project, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
          >
            <div className="p-6">
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => e.target.style.display = 'none'}
                  loading="lazy"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Anggaran</div>
                  <div className="font-semibold">{project.budget || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Durasi</div>
                  <div className="font-semibold">{project.duration || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Rating</div>
                  <div className="font-semibold">{project.rating || 'N/A'}/5</div>
                </div>
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Teknologi</div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PortfolioTab;
