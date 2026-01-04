import React from "react";
import { TrendingUp, BookOpen, Award, Users } from "lucide-react";
import { humanDate, calculateTotalImpact } from "../../utils/helpers";

/**
 * FooterNote component - displays footer with last update and summary stats
 */
export const FooterNote = ({ projects, blogs, certificates }) => {
  return (
    <div className="mt-8 text-center text-slate-500 text-sm">
      <p>Profil ini diperbarui terakhir pada {humanDate()} • 
        <span className="text-teal-400 font-medium"> Tersedia untuk peluang kolaborasi</span></p>
      <div className="flex justify-center items-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {projects.length} Proyek
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {blogs.length} Artikel
        </span>
        <span className="flex items-center gap-1">
          <Award className="w-3 h-3" />
          {certificates.length} Sertifikat
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {calculateTotalImpact(projects).toLocaleString()}+ Pengguna Terdampak
        </span>
      </div>
    </div>
  );
};
