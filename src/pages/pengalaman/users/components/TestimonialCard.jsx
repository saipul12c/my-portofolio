import { motion } from "framer-motion";
import { Star, Briefcase, Target, Clock, Calendar, DollarSign, Users, Cpu, Shield } from "lucide-react";
import { cardVariants } from "../utils/animationVariants";

// Helper to get color classes dynamically
const getColorClasses = (color) => {
  const colorMap = {
    blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", label: "text-blue-300" },
    green: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", label: "text-green-300" },
    purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", label: "text-purple-300" },
    orange: { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400", label: "text-orange-300" }
  };
  return colorMap[color] || colorMap.blue;
};

const TestimonialCard = ({ testimonial }) => {
  const infoItems = [
    { icon: Calendar, label: "Durasi", value: testimonial.project_duration, color: "blue" },
    { icon: DollarSign, label: "Budget", value: testimonial.budget_range, color: "green" },
    { icon: Users, label: "Team Size", value: testimonial.team_size ? `${testimonial.team_size} people` : null, color: "purple" },
    { icon: Cpu, label: "Complexity", value: testimonial.project_metadata?.complexity, color: "orange" }
  ];

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-blue-500/40 hover:from-white/12 hover:to-white/5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl relative overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-blue-500/8 group-hover:via-purple-500/4 group-hover:to-indigo-500/8 transition-all duration-500 rounded-2xl sm:rounded-3xl" />
      
      {/* Background Accent Glow */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ pointerEvents: 'none' }}
      />
      
      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h4 className="font-bold text-xl sm:text-2xl text-white group-hover:text-blue-300 transition-colors break-words">
                {testimonial.title || "Project Review"}
              </h4>
              {testimonial.verified && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 mt-1 p-1.5 bg-green-500/20 rounded-lg border border-green-500/30"
                >
                  <Shield size={16} className="text-green-400" />
                </motion.div>
              )}
            </div>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-300">
              {testimonial.company && (
                <motion.span 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/8 rounded-lg border border-white/15 whitespace-nowrap transition-all duration-300 cursor-default hover:border-white/25"
                >
                  <Briefcase size={12} className="sm:w-3.5 sm:h-3.5 text-blue-400" />
                  <span className="font-medium">{testimonial.company}</span>
                </motion.span>
              )}
              {testimonial.project && (
                <motion.span 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(59,130,246,0.15)' }}
                  className="text-blue-300 font-semibold flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-500/10 rounded-lg border border-blue-500/25 whitespace-nowrap transition-all duration-300 cursor-default hover:bg-blue-500/15 hover:border-blue-500/35"
                >
                  <Target size={12} className="sm:w-3.5 sm:h-3.5" />
                  {testimonial.project}
                </motion.span>
              )}
              {testimonial.date && (
                <motion.span 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/8 rounded-lg border border-white/15 whitespace-nowrap transition-all duration-300 cursor-default hover:border-white/25"
                >
                  <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-purple-400" />
                  {new Date(testimonial.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </motion.span>
              )}
            </div>
          </div>
          
          {/* Rating Section */}
          <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`sm:w-5 sm:h-5 transition-all duration-300 ${
                    i < Math.floor(testimonial.rating || 0)
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      : "text-gray-600 group-hover:text-gray-500"
                  }`}
                />
              ))}
            </div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-lg sm:text-xl font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-center min-w-[2.75rem] sm:min-w-[3rem] transition-all duration-300"
            >
              {testimonial.rating || "0"}
            </motion.span>
          </div>
        </div>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-all duration-300 italic"
        >
          "{testimonial.text || "Tidak ada deskripsi tersedia."}"
        </motion.p>

        {/* Info Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 pt-2 sm:pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {infoItems.map((item) => {
            const colorClasses = getColorClasses(item.color);
            return item.value ? (
              <motion.div 
                key={item.label}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className={`bg-white/6 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 group-hover:border-white/15 transition-all duration-300 cursor-default`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <div className={`p-1.5 sm:p-2 ${colorClasses.bg} rounded-lg border ${colorClasses.border} group-hover:${colorClasses.bg} transition-all duration-300`}>
                    <item.icon size={14} className={`sm:w-4 sm:h-4 ${colorClasses.text}`} />
                  </div>
                  <div className={`text-gray-400 text-xs sm:text-sm font-semibold truncate ${colorClasses.label}`}>
                    {item.label}
                  </div>
                </div>
                <div className="text-white font-bold text-sm sm:text-base lg:text-lg break-words">
                  {item.value}
                </div>
              </motion.div>
            ) : null;
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;