import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Heart, Sparkles, HandHeart, Users, Globe, Lightbulb, Star, 
  ArrowLeft, CheckCircle2, Calendar, MapPin, Target, 
  Share2, Bookmark, TrendingUp, Award, Clock, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import commitmentsData from "../data/commitments.json";

const iconMap = {
  HandHeart: HandHeart,
  Users: Users,
  Globe: Globe,
  Lightbulb: Lightbulb,
  Star: Star
};

const colorMap = {
  primary: "from-pink-500 to-rose-500",
  secondary: "from-blue-500 to-cyan-500", 
  success: "from-emerald-500 to-green-500",
  warning: "from-amber-500 to-orange-500",
  info: "from-indigo-500 to-purple-500"
};

const glowMap = {
  primary: "shadow-pink-500/20",
  secondary: "shadow-blue-500/20",
  success: "shadow-emerald-500/20",
  warning: "shadow-amber-500/20",
  info: "shadow-indigo-500/20"
};

export default function DetailCommitment() {
  const { id } = useParams();
  const [commitment, setCommitment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const foundCommitment = commitmentsData.commitments?.find(item => item.id === parseInt(id));
      setCommitment(foundCommitment);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Memuat komitmen...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!commitment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Komitmen tidak ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Komitmen yang Anda cari tidak tersedia atau telah dipindahkan.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  const IconComponent = iconMap[commitment.icon] || Sparkles;
  const gradient = colorMap[commitment.color_scheme] || "from-pink-500 to-purple-500";
  const glow = glowMap[commitment.color_scheme] || "shadow-pink-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-8 px-4">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/help/commitment" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Komitmen
          </Link>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl ${glow} border border-white/50 dark:border-gray-700/50 overflow-hidden`}
        >
          {/* Header dengan Gradient */}
          <div className={`relative bg-gradient-to-r ${gradient} p-8 md:p-12 text-white overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="flex items-start gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30"
                  >
                    <IconComponent size={40} />
                  </motion.div>
                  <div className="flex-1">
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm inline-block mb-3"
                    >
                      #{String(commitment.id).padStart(2, '0')}
                    </motion.span>
                    <motion.h1 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl md:text-5xl font-bold mb-3"
                    >
                      {commitment.title}
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/90 text-xl max-w-3xl"
                    >
                      {commitment.short_desc}
                    </motion.p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 self-start"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBookmark}
                    className={`p-3 rounded-xl backdrop-blur-sm border transition-all ${
                      isBookmarked 
                        ? 'bg-white/30 border-white/50 text-yellow-300' 
                        : 'bg-white/20 border-white/30 hover:bg-white/30'
                    }`}
                  >
                    <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-3 rounded-xl backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 transition-all"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </motion.div>
              </div>

              {/* Stats Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Dimulai</p>
                    <p className="font-semibold">2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Target size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Status</p>
                    <p className="font-semibold">Aktif</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Progress</p>
                    <p className="font-semibold">85%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Partisipan</p>
                    <p className="font-semibold">1,200+</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Content - 3/4 width */}
              <div className="xl:col-span-3 space-y-8">
                {/* About Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/50 dark:border-gray-600/30"
                >
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                    <Lightbulb className="text-amber-500" size={24} />
                    Tentang Komitmen
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {commitment.desc}
                  </p>
                </motion.section>

                {/* Implementation Details */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Detail Implementasi</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <MapPin className="text-blue-500" size={20} />
                        Cakupan Program
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Program ini telah menjangkau lebih dari 10.000 penerima manfaat di berbagai wilayah 
                        dengan fokus pada peningkatan kualitas hidup dan pembangunan berkelanjutan.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <BarChart3 className="text-green-500" size={20} />
                        Metrik Keberhasilan
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Tingkat keberhasilan program diukur melalui survei kepuasan, monitoring berkelanjutan, 
                        dan evaluasi dampak terhadap komunitas target.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Timeline */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/50 dark:border-gray-600/30"
                >
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <Clock className="text-purple-500" size={24} />
                    Timeline Pencapaian
                  </h3>
                  <div className="space-y-4">
                    {[2023, 2024, 2025].map((year, index) => (
                      <div key={year} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">Tahun {year}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {index === 0 ? 'Program diluncurkan dan mencapai target awal' : 
                             index === 1 ? 'Ekspansi program ke wilayah tambahan' : 
                             'Target penyelesaian dan evaluasi menyeluruh'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* Sidebar - 1/4 width */}
              <div className="space-y-6">
                {/* Key Points */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/50 dark:border-gray-600/30"
                >
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="text-amber-500" size={20} />
                    Poin Utama
                  </h3>
                  <div className="space-y-3">
                    {commitment.key_points?.map((point, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className={`flex-shrink-0 mt-1 ${gradient.replace('from-', 'text-').split(' ')[0]}`} size={18} />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Impact Metrics */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Dampak yang Dicapai
                  </h3>
                  <div className="space-y-4">
                    {[
                      { value: "85%", label: "Tingkat Kepuasan", icon: Heart },
                      { value: "1,200+", label: "Penerima Manfaat", icon: Users },
                      { value: "98%", label: "Program Tercapai", icon: Target },
                      { value: "15", label: "Wilayah Terjangkau", icon: Globe }
                    ].map((metric, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-1 rounded">
                            <metric.icon size={14} />
                          </div>
                          <span className="text-white/80 text-sm">{metric.label}</span>
                        </div>
                        <span className="font-bold">{metric.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="text-center"
                >
                  <motion.a
                    href={commitment.cta_link}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full justify-center`}
                  >
                    {commitment.cta_text || "Gabung Sekarang"}
                    <Sparkles size={18} />
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Bagikan Komitmen</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Tautan telah disalin ke clipboard!</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Tutup
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  Bagikan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}