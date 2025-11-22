import { motion } from "framer-motion";
import { Users, MapPin } from 'lucide-react';

const CommunityStatistics = ({ statistics }) => {
  const stats = [
    {
      icon: Users,
      label: "Total Komunitas",
      value: statistics?.totalCommunities || 0,
      color: "cyan"
    },
    {
      icon: Users,
      label: "Komunitas Aktif",
      value: statistics?.activeCommunities || 0,
      color: "emerald"
    },
    {
      icon: Users,
      label: "Total Anggota",
      value: statistics?.totalMembers?.toLocaleString() || 0,
      color: "purple"
    },
    {
      icon: MapPin,
      label: "Kategori",
      value: statistics?.categories?.length || 0,
      color: "orange"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const colorClasses = {
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  };

  return (
    <motion.section
      className="max-w-6xl mx-auto w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-4 py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`bg-gradient-to-br ${colorClasses[stat.color]} border backdrop-blur-xl rounded-2xl p-6 text-center hover:scale-105 transition-transform`}
          >
            <Icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        );
      })}
    </motion.section>
  );
};

export default CommunityStatistics;