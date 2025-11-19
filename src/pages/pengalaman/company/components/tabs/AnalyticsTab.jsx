import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../animations/variants";
import { TrendingUp, Target, Users as UsersIcon, DollarSign } from "lucide-react";

const AnalyticsTab = ({ analytics, timeline }) => {
  if (!analytics) {
    return <div className="text-gray-400">Tidak ada data analytics yang tersedia</div>;
  }

  const metrics = [
    {
      icon: TrendingUp,
      label: "Tingkat Kesuksesan",
      value: `${Math.round(analytics.successRate)}%`,
      color: "emerald"
    },
    {
      icon: Target,
      label: "Kepuasan Klien",
      value: analytics.clientSatisfaction?.toFixed(1) || "N/A",
      color: "blue"
    },
    {
      icon: UsersIcon,
      label: "Penyelesaian Proyek",
      value: `${Math.round(analytics.projectCompletion)}%`,
      color: "purple"
    },
    {
      icon: DollarSign,
      label: "Total Pendapatan",
      value: `Rp ${(analytics.totalRevenue / 1000000).toFixed(1)}M`,
      color: "yellow"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Analytics & Metrik</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const colorClasses = {
            emerald: "from-emerald-500/20 to-emerald-600/20 text-emerald-400",
            blue: "from-blue-500/20 to-blue-600/20 text-blue-400",
            purple: "from-purple-500/20 to-purple-600/20 text-purple-400",
            yellow: "from-yellow-500/20 to-yellow-600/20 text-yellow-400"
          };

          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`bg-gradient-to-br ${colorClasses[metric.color]} backdrop-blur-xl border border-white/10 rounded-xl p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon size={24} />
                <span className="text-sm text-gray-400">{metric.label}</span>
              </div>
              <div className="text-3xl font-bold">{metric.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline Chart */}
      {timeline && timeline.length > 0 && (
        <motion.div
          variants={cardVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">Riwayat Proyek</h3>
          <div className="space-y-4">
            {timeline.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="min-w-fit">
                  <span className="text-sm text-gray-400">
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: `${(idx + 1) * 20}%` }}
                  ></div>
                </div>
                <div className="min-w-fit text-sm font-medium truncate max-w-xs">
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Summary */}
      <motion.div
        variants={cardVariants}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-4">Ringkasan Performa</h3>
        <div className="space-y-3 text-gray-300">
          <p>✓ Tingkat kesuksesan proyek mencapai <span className="font-semibold text-emerald-400">{Math.round(analytics.successRate)}%</span></p>
          <p>✓ Kepuasan klien rata-rata <span className="font-semibold text-blue-400">{analytics.clientSatisfaction?.toFixed(1)}/5</span></p>
          <p>✓ Penyelesaian tepat waktu <span className="font-semibold text-purple-400">{Math.round(analytics.projectCompletion)}%</span></p>
          <p>✓ Total revenue yang dihasilkan <span className="font-semibold text-yellow-400">Rp {(analytics.totalRevenue / 1000000).toFixed(1)} Miliar</span></p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsTab;
