// AboutInterests.jsx
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function AboutInterests({ interests }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.section
      className="mt-24 max-w-4xl mx-auto px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header Section dengan efek glow */}
      <motion.div
        className="text-center mb-12 relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full mx-auto w-32 h-32"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
        
        <Link to={interests.link} className="inline-block group relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.2 : 1
              }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </motion.div>
            <Heart className="w-6 h-6 text-pink-400 opacity-80" />
          </div>
          
          <div className="relative">
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-500">
              {interests.sectionTitle}
            </h3>
            
            {/* Animated Underline */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 mt-2"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Hover Arrow Indicator */}
          <motion.div
            className="absolute -right-8 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Description dengan enhanced styling */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="text-gray-300 leading-relaxed text-lg sm:text-xl text-center max-w-3xl mx-auto font-light">
          {interests.description}
        </p>
        
        {/* Background decorative elements */}
        <div className="absolute -left-10 top-1/2 w-20 h-20 bg-cyan-400/5 rounded-full blur-xl"></div>
        <div className="absolute -right-10 bottom-1/2 w-16 h-16 bg-purple-400/5 rounded-full blur-xl"></div>
      </motion.div>

      {/* Interests Grid jika ada data tambahan */}
      {interests.items && (
        <motion.div
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {interests.items.map((item, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                backgroundColor: "rgba(34, 211, 238, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-200 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                  {item.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Call to Action Button */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Link to={interests.link}>
          <motion.button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
}