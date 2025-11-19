import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, Zap } from "lucide-react";
import { cardVariants, itemVariants } from "../utils/animationVariants";

const BusinessImpact = ({ businessImpact, innovationContributions }) => {
  return (
    <>
      {/* Business Impact */}
      {businessImpact && (
        <motion.div 
          variants={cardVariants} 
          className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/25 group relative overflow-hidden"
        >
          {/* Background Accent */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ pointerEvents: 'none' }}
          />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="p-2 sm:p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl sm:rounded-2xl border border-green-500/30 flex-shrink-0"
            >
              <TrendingUp size={20} className="sm:w-6 sm:h-6 text-green-400" />
            </motion.div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Business Impact</h3>
              <p className="text-xs sm:text-sm text-gray-400">Dampak bisnis yang dihasilkan</p>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 relative z-10">
            {Object.entries(businessImpact).map(([key, value], index) => (
              <motion.div
                key={key}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className="bg-white/6 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 hover:border-green-500/40 transition-all duration-300 group/item"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-1 group-hover/item:text-green-300 transition-colors duration-300">
                      {typeof value === 'number' ? `${value}%` : value}
                    </div>
                  </div>
                  <Zap size={16} className="sm:w-5 sm:h-5 text-green-400/50 mt-1 flex-shrink-0" />
                </div>
                <div className="text-gray-300 capitalize text-xs sm:text-sm font-semibold">
                  {key.replace(/_/g, ' ')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Innovation Metrics */}
      {innovationContributions && (
        <motion.div 
          variants={cardVariants} 
          className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/25 group relative overflow-hidden"
        >
          {/* Background Accent */}
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ pointerEvents: 'none' }}
          />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl sm:rounded-2xl border border-purple-500/30 flex-shrink-0"
            >
              <Lightbulb size={20} className="sm:w-6 sm:h-6 text-purple-400" />
            </motion.div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Inovasi & Kontribusi</h3>
              <p className="text-xs sm:text-sm text-gray-400">Kontribusi inovatif dalam proyek</p>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 relative z-10">
            {Object.entries(innovationContributions).map(([key, value], index) => (
              <motion.div
                key={key}
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group/item"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rounded-lg sm:rounded-2xl mb-2 sm:mb-3 group-hover/item:shadow-lg group-hover/item:shadow-purple-500/25 transition-all duration-300">
                  <div className="bg-slate-900 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                      {value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 capitalize line-clamp-2 font-semibold">
                      {key.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default BusinessImpact;