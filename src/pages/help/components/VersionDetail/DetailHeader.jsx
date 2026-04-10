import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCode } from 'react-icons/fa';

const DetailHeader = ({ entry, getTypeColor }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Link 
        to="/help/docs/ai" 
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors mb-6 group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Dokumentasi AI
      </Link>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl">
        {/* Glow Background */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${getTypeColor(entry.type)} opacity-[0.03] blur-[80px] pointer-events-none`} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 bg-gradient-to-br ${getTypeColor(entry.type)} rounded-xl shadow-lg border border-white/10`} aria-hidden>
              <FaCode className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent tracking-tight">
                {entry.version}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/90 bg-gradient-to-r ${getTypeColor(entry.type)}`}>
                   {entry.type || 'stable'}
                 </span>
                 {entry.deprecated && (
                   <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/30">DEPRECATED</span>
                 )}
                 {entry.supported && (
                   <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">SUPPORTED</span>
                 )}
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base font-light italic max-w-2xl">
            {entry.summary || 'Dokumentasi detail rilis untuk versi ini.'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 relative z-10">
          {/* Version Status Badge Big */}
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Status</div>
            <div className={`text-sm font-bold flex items-center gap-2 ${entry.deprecated ? 'text-red-400' : 'text-emerald-400'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${entry.deprecated ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {entry.deprecated ? 'OUTDATED' : 'STABLE RELEASE'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailHeader;
