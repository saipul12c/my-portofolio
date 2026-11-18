import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, BookOpen, Award, Users, CheckCircle2 } from "lucide-react";
import { humanDate, calculateTotalImpact } from "../../utils/helpers";

/**
 * FooterNote component - displays footer with last update and summary stats
 */
export const FooterNote = ({ projects = [], blogs = [], certificates = [] }) => {
  const totalImpact = calculateTotalImpact(projects);

  return (
    <div className="mt-12 text-center text-slate-400 text-xs space-y-3 pb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Halaman Profil Terverifikasi • Pembaruan: {humanDate()}</span>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-slate-400 text-xs">
        <Link to="/projects" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>{projects.length} Proyek Aktif</span>
        </Link>
        <Link to="/blog" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>{blogs.length} Publikasi Blog</span>
        </Link>
        <Link to="/certificates" className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{certificates.length} Sertifikat Terdaftar</span>
        </Link>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Users className="w-3.5 h-3.5" />
          <span>{totalImpact.toLocaleString()}+ Pengguna Terdampak</span>
        </span>
      </div>
    </div>
  );
};
