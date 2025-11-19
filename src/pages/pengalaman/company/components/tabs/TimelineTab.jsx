import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../animations/variants";
import { Calendar, Briefcase } from "lucide-react";

const TimelineTab = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <div className="text-gray-400">Tidak ada timeline yang tersedia</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Timeline Proyek</h2>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500"></div>

        {/* Timeline Items */}
        <div className="space-y-6 pl-20">
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-16 top-1 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Briefcase size={20} className="text-white" />
              </div>

              {/* Timeline Content */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-emerald-400" />
                  <span className="text-sm text-gray-400">
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.event}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineTab;
