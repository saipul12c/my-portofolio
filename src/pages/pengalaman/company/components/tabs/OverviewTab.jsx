import { motion } from "framer-motion";
import { containerVariants } from "../../animations/variants";

const OverviewTab = ({ 
  companyData, 
  activeGalleryImage, 
  setActiveGalleryImage, 
  autoPlay, 
  setAutoPlay 
}) => {
  if (!companyData?.info) {
    return <div className="text-gray-400">Tidak ada data perusahaan</div>;
  }

  const { info, analytics } = companyData;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Company Overview */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Ringkasan Perusahaan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{info.totalTestimonials}</div>
            <div className="text-sm text-gray-400">Testimoni</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{info.avgRating}</div>
            <div className="text-sm text-gray-400">Rating Rata-rata</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{info.totalTeamMembers}</div>
            <div className="text-sm text-gray-400">Ukuran Tim</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{info.avgProjectDuration}m</div>
            <div className="text-sm text-gray-400">Durasi Rata-rata</div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Metrik Kinerja</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Tingkat Kesuksesan</div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(analytics.successRate)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Kepuasan Klien</div>
              <div className="text-2xl font-bold text-green-400">
                {analytics.clientSatisfaction?.toFixed(1) || 'N/A'}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Penyelesaian Proyek</div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(analytics.projectCompletion)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Total Pendapatan</div>
              <div className="text-2xl font-bold text-purple-400">
                Rp {(analytics.totalRevenue / 1000000).toFixed(0)}M
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Description */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Tentang Perusahaan</h2>
        <p className="text-gray-300 leading-relaxed">
          {info.name} adalah perusahaan yang telah membangun reputasi solid dengan 
          {info.totalTestimonials} testimoni positif dan rating rata-rata {info.avgRating}/5 bintang. 
          Dengan tim berpengalaman dan teknologi terkini, mereka siap memberikan solusi terbaik untuk proyek Anda.
        </p>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
