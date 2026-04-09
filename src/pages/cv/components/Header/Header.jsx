import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, LayoutGrid, Info } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ContactInfo from '../UI/ContactInfo';
import MetricCard from '../UI/MetricCard';

const Header = ({ isCopied, copyEmail, metrics }) => {
  const [showVerifiedTooltip, setShowVerifiedTooltip] = React.useState(false);
  const [specialtyIndex, setSpecialtyIndex] = React.useState(0);

  const specialties = [
    "EduTech Specialist",
    "UI/UX Enthusiast",
    "Open Source Contributor",
    "Problem Solver",
    "Tech Innovator"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSpecialtyIndex((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-900/40 p-8 mb-8 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="h-32 w-32 rounded-full border-4 border-cyan-400/30 shadow-2xl object-cover bg-gradient-to-br from-cyan-500 to-blue-600 p-1">
              <img
                className="w-full h-full rounded-full object-cover"
                src="/foto-profil-profesional.jpg"
                alt="Profile Picture"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full p-2 shadow-lg border border-white/20">
              <span className="text-xs font-semibold text-white">Available</span>
            </div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Muhammad Syaiful Mukmin
              </h1>
              <div 
                className="relative cursor-help"
                onMouseEnter={() => setShowVerifiedTooltip(true)}
                onMouseLeave={() => setShowVerifiedTooltip(false)}
              >
                <BadgeCheck className="w-6 h-6 text-white fill-[#0095f6] hover:scale-110 transition-transform shadow-lg rounded-full" />
                
                <AnimatePresence>
                  {showVerifiedTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-1/2 lg:left-0 lg:-translate-x-0 -translate-x-1/2 mt-3 w-64 z-50"
                    >
                      <div className="bg-white text-gray-900 text-xs py-2.5 px-4 rounded-xl shadow-2xl border border-gray-100 flex items-start gap-3">
                        <div className="bg-blue-50 p-1.5 rounded-lg">
                          <Info className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="leading-relaxed">
                          <p className="font-bold text-sm text-gray-800 mb-0.5">Profil Terverifikasi</p>
                          <p className="text-[11px] text-gray-500 font-medium">Akun ini telah melalui verifikasi identitas dan keahlian profesional sebagai pengembang perangkat lunak.</p>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute -top-1 left-1/2 lg:left-4 -translate-x-1/2 lg:translate-x-0 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-4 h-8 flex items-center justify-center lg:justify-start gap-1.5">
              <span>Full Stack Developer &</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={specialtyIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-yellow-400 font-semibold"
                >
                  {specialties[specialtyIndex]}
                </motion.span>
              </AnimatePresence>
            </p>
            <p className="text-gray-400 max-w-2xl mb-6">
              Specialized in building scalable web applications and educational technology solutions.
              Passionate about creating impactful digital learning experiences with modern technologies.
            </p>

            <ContactInfo isCopied={isCopied} copyEmail={copyEmail} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Link 
              to="/portal"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <LayoutGrid className="w-4 h-4" />
              Menuju Portal
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 rounded-full text-center font-medium transition-all"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;