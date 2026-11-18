import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Menu, X, Building2, MapPin, Phone, Download, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import StatCard from "./StatCard";
import { Users, Star, TrendingUp, DollarSign } from "lucide-react";
import RatingStars from "./RatingStars";
import { containerVariants, itemVariants } from "../animations/variants";

// Navigation Component
const Navigation = ({ companyData, mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/testimoni")}
          className="flex items-center gap-2 px-3.5 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-white border border-white/10 hover:border-cyan-500/30 text-sm font-medium"
          aria-label="Kembali ke halaman testimoni"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Kembali ke Testimoni</span>
        </motion.button>
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center px-2 truncate max-w-xs sm:max-w-md"
        >
          {companyData?.info?.name || "Perusahaan"}
        </motion.h1>

        {/* Mobile Menu Button & Website */}
        <div className="flex items-center gap-2">
          {companyData?.info?.website && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={companyData.info.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-xs sm:text-sm font-medium flex items-center gap-1.5"
              title="Kunjungi website perusahaan"
            >
              <Globe size={16} />
              <span className="hidden md:inline">Website</span>
              <ExternalLink size={14} className="hidden sm:inline" />
            </motion.a>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Header Component
const MainHeader = ({ info, analytics }) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-8 shadow-2xl relative"
      aria-labelledby="company-header"
    >
      {/* Cover Header Banner */}
      <div className="relative h-36 sm:h-48 lg:h-56 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.25),rgba(255,255,255,0))]"></div>
        <motion.div 
          className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Partner Badge */}
        <motion.div 
          className="absolute bottom-4 left-6 sm:left-8 flex items-center gap-2 sm:gap-3 flex-wrap"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/40 shadow-lg cursor-default">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-cyan-300">Partner Terverifikasi</span>
          </div>
        </motion.div>
      </div>

      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 -mt-16 sm:-mt-20 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-2xl relative"
          >
            <Building2 size={56} className="text-white/90" />
          </motion.div>

          <div className="flex-1 flex flex-col justify-end space-y-3">
            <div>
              <h1 id="company-header" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                {info.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-3">
                {info.location && (
                  <div className="flex items-center gap-1.5 text-purple-400 font-medium">
                    <MapPin size={16} />
                    <span>{info.location}</span>
                  </div>
                )}
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={parseFloat(info.avgRating)} size={16} />
                  <span className="text-yellow-400 font-semibold">{info.avgRating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-cyan-300 font-medium">{info.totalTestimonials} Testimoni</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContactClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/25 text-sm"
                >
                  <Phone size={16} />
                  Hubungi Perusahaan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl transition-all duration-300 text-sm font-medium"
                >
                  <Download size={16} />
                  Simpan Ringkasan
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10"
        >
          <StatCard
            icon={Users}
            value={info.totalTestimonials}
            label="Total Testimoni"
            color="blue"
            trend={12}
          />
          <StatCard
            icon={Star}
            value={info.avgRating}
            label="Rating Rata-rata"
            color="yellow"
            trend={5}
          />
          <StatCard
            icon={TrendingUp}
            value={info.totalTeamMembers}
            label="Rata-rata Tim"
            color="green"
            trend={8}
          />
          <StatCard
            icon={DollarSign}
            value={info.avgBudget}
            label="Budget Rata-rata"
            color="purple"
            trend={15}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

// Export as named exports
const CompanyHeaderExport = Navigation;
CompanyHeaderExport.Navigation = Navigation;
CompanyHeaderExport.Main = MainHeader;

export default CompanyHeaderExport;
