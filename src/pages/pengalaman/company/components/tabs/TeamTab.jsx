import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../animations/variants";
import { Users, Briefcase } from "lucide-react";

const TeamTab = ({ team }) => {
  if (!team || team.length === 0) {
    return <div className="text-gray-400">Tidak ada data anggota tim yang tersedia</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Anggota Tim</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
          >
            <div className="p-6 text-center">
              {member.image ? (
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Users size={32} className="text-white" />
                </div>
              )}
              
              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-emerald-400 text-sm mb-4">{member.role}</p>
              
              <div className="flex items-center gap-2 justify-center text-gray-400 text-sm">
                <Briefcase size={16} />
                <span>{member.projects} Proyek</span>
              </div>

              {member.technologies && member.technologies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-2">Keahlian</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.technologies.slice(0, 3).map((tech, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {member.technologies.length > 3 && (
                      <span className="text-xs text-gray-400">+{member.technologies.length - 3}</span>
                    )}
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

export default TeamTab;
