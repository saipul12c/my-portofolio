import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import ContactInfo from '../UI/ContactInfo';
import MetricCard from '../UI/MetricCard';

const Header = ({ isCopied, copyEmail, metrics }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-900/40 p-8 mb-8 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Syaiful Mukmin
          </h1>
          <p className="text-xl text-gray-300 mb-4">Full Stack Developer & EduTech Specialist</p>
          <p className="text-gray-400 max-w-2xl mb-6">
            Specialized in building scalable web applications and educational technology solutions. 
            Passionate about creating impactful digital learning experiences with modern technologies.
          </p>

          <ContactInfo isCopied={isCopied} copyEmail={copyEmail} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105">
            <Download className="w-4 h-4" />
            Download CV
          </button>
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

export default Header;