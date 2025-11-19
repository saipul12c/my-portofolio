import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Menu, X, Building2, MapPin, Phone, Download } from "lucide-react";
import StatCard from "./StatCard";
import { Users, Star, TrendingUp, DollarSign } from "lucide-react";
import RatingStars from "./RatingStars";
import { containerVariants, itemVariants } from "../animations/variants";

// Navigation Component
const Navigation = ({ companyData, mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/testimoni")}
          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
          aria-label="Kembali ke halaman testimoni"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Kembali ke Testimoni</span>
        </motion.button>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          {companyData?.info?.name || "Perusahaan"}
        </motion.h1>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );
};

// Main Header Component
const MainHeader = ({ info, analytics }) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    console.log('Contact CTA clicked');
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-8 relative"
      aria-labelledby="company-header"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full translate-y-24 -translate-x-24" />
      
      <div className="relative px-6 sm:px-8 pb-8 pt-12">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-slate-900 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-2xl"
          >
            <Building2 size={64} className="text-white/80" />
          </motion.div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 id="company-header" className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {info.name}
            </h1>
            {info.location && (
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <MapPin size={20} />
                <span className="text-lg">{info.location}</span>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <RatingStars rating={parseFloat(info.avgRating)} size={20} />
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{info.totalTestimonials} Testimoni</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContactClick}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300 font-semibold"
              >
                <Phone size={20} />
                Hubungi Perusahaan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300"
              >
                <Download size={20} />
                Download Portfolio
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
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