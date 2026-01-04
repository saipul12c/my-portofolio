import React from "react";

/**
 * FooterCTA component - displays footer call-to-action buttons
 */
export const FooterCTA = () => {
  return (
    <div className="mt-10 pt-6 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-slate-600 text-sm">
          Siap berkolaborasi dalam proyek pendidikan yang bermakna
        </div>
        <div className="flex gap-3">
          <a href="/portfolio" 
             className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 
                        text-white font-semibold rounded-xl hover:shadow-lg 
                        transition-all duration-300 hover:scale-[1.02] 
                        active:scale-[0.98]">
            Lihat Portofolio
          </a>
          <a href="/contact" 
             className="px-6 py-3 border-2 border-teal-600 text-teal-600 
                        font-semibold rounded-xl hover:bg-teal-50 
                        transition-all duration-300">
            Diskusi Proyek
          </a>
        </div>
      </div>
    </div>
  );
};
