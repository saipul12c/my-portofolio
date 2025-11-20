// AboutCollaborations.jsx
import { motion } from "framer-motion";
import { Users, Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCollaborations({ collabs }) {
  // Variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 20px 40px rgba(0, 255, 255, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section
      className="mt-24 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Enhanced Header Section */}
      <motion.div
        className="flex flex-col items-center mb-12"
        variants={itemVariants}
      >
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
          <Users className="w-12 h-12 text-cyan-300 relative z-10 p-2 bg-gray-900/80 rounded-2xl border border-cyan-400/30" />
        </div>
        
        <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          {collabs.sectionTitle}
        </h3>
        
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mb-2"></div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Partner terpercaya yang telah membangun kesuksesan bersama kami
        </p>
      </motion.div>

      {/* Enhanced Grid Layout */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
      >
        {collabs.partners.map((partner, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover="hover"
          >
            <Link
              to={collabs.link}
              className="group block h-full"
            >
              <motion.div
                className="h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 relative overflow-hidden"
                variants={hoverVariants}
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Decorative Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-bl-2xl transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-300"></div>
                
                {/* Partner Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 mb-2">
                      {partner.name}
                    </h4>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star 
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex < (partner.rating || 5) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* External Link Icon */}
                  <ExternalLink className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6 relative z-10 line-clamp-3">
                  {partner.desc}
                </p>

                {/* Enhanced CTA */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-cyan-300 text-sm font-semibold group-hover:underline underline-offset-4 flex items-center gap-2">
                    Lihat Testimoni
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </span>
                  
                  {/* Partnership Badge */}
                  <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-400/30">
                    Partner
                  </span>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400/0 to-blue-400/0 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-500 opacity-0 group-hover:opacity-100 -m-0.5"></div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        className="mt-12"
        variants={itemVariants}
      >
        <Link
          to={collabs.link}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
        >
          <Users className="w-5 h-5" />
          Lihat Semua Kolaborasi
          <ExternalLink className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.section>
  );
}