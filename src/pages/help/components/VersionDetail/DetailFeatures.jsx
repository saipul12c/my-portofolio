import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaExclamationTriangle, FaChevronDown, FaChevronUp, FaRocket } from 'react-icons/fa';
import { SmartText } from '../ai-docs/Shared/UIComponents';

const SectionWrapper = ({ title, icon, colorClass, children, id, isOpen, setIsOpen, toggleLabel }) => (
  <div id={id} className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-2xl ring-1 ring-white/10' : ''}`}>
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-xl font-bold flex items-center gap-3 ${colorClass}`}>
          <div className={`p-2 rounded-lg bg-white/5`}>{icon}</div>
          {title}
        </h3>
        {setIsOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            {isOpen ? <><FaChevronUp /> {toggleLabel.hide}</> : <><FaChevronDown /> {toggleLabel.show}</>}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const DetailFeatures = ({ entry, showFeatures, setShowFeatures, showBreaking, setShowBreaking }) => {
  return (
    <div className="space-y-6">
      {/* Fitur & Perubahan */}
      <SectionWrapper
        id="features"
        title="Fitur & Perubahan"
        icon={<FaCode className="text-blue-400" />}
        colorClass="text-gray-100"
        isOpen={showFeatures}
        setIsOpen={setShowFeatures}
        toggleLabel={{ show: 'Show Features', hide: 'Hide Features' }}
      >
        {entry.features && entry.features.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {entry.features.map((feature, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-gray-900/60 transition-all group"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div className="text-gray-300 text-sm leading-relaxed">
                  <SmartText>{feature}</SmartText>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-gray-900/20 border border-dashed border-gray-700 text-gray-500 italic text-sm">
            Tidak ada fitur atau perubahan yang tercantum untuk versi ini.
          </div>
        )}
      </SectionWrapper>

      {/* Breaking Changes */}
      <SectionWrapper
        id="breaking-changes"
        title="Breaking Changes"
        icon={<FaExclamationTriangle className="text-amber-500" />}
        colorClass="text-amber-100"
        isOpen={showBreaking}
        setIsOpen={setShowBreaking}
        toggleLabel={{ show: 'Show Warnings', hide: 'Hide Warnings' }}
      >
        {entry.breaking_changes && entry.breaking_changes.length > 0 ? (
          <div className="space-y-3">
            {entry.breaking_changes.map((change, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={idx}
                className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <div className="text-amber-200/80 text-sm leading-relaxed">
                  <SmartText>{change}</SmartText>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-emerald-500/5 border border-dashed border-emerald-500/20 text-emerald-400/60 text-xs font-medium uppercase tracking-widest">
            Semua perubahan kompatibel dengan versi sebelumnya. No breaking changes detected.
          </div>
        )}
      </SectionWrapper>

      {/* Main Features */}
      {entry.fitur_utama && entry.fitur_utama.length > 0 && (
        <SectionWrapper
          id="main-features"
          title="Fitur Utama Kami"
          icon={<FaRocket className="text-emerald-400" />}
          colorClass="text-gray-100"
          isOpen={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entry.fitur_utama.map((feature, idx) => (
              <div
                key={idx}
                className="group p-4 bg-gray-900/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 group-hover:bg-emerald-400 transition-colors" />
                  <div className="text-gray-300 text-[13px] leading-relaxed">
                    <SmartText>{feature}</SmartText>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      )}
    </div>
  );
};

export default DetailFeatures;
