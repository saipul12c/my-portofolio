import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppealModal = ({
  showAppealModal,
  setShowAppealModal,
  appealReason,
  setAppealReason,
  handleSumbitAppeal,
  isSubmittingAppeal
}) => {
  return (
    <AnimatePresence>
      {showAppealModal && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl overflow-hidden"
          >
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Sirkuit Banding</h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Ajukan alasan kenapa restriksi Anda harus dicabut</p>
            
            <textarea 
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              placeholder="Ceritakan alasan Anda..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all mb-6 resize-none"
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setShowAppealModal(false)}
                className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest text-white/40 hover:text-white transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSumbitAppeal}
                disabled={isSubmittingAppeal || !appealReason.trim()}
                className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-600/20 disabled:opacity-20 transition-all"
              >
                {isSubmittingAppeal ? 'Mengirim...' : 'Kirim Banding'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
