import React from "react";
import { Calendar, BookOpen, Users, Award } from "lucide-react";
import { DEFAULT_DESCRIPTION } from "../../utils/constants";
import { StatCard } from "../ui/StatCard";

/**
 * ProfileIntro component - displays profile introduction and stats
 */
export const ProfileIntro = ({ profile, projectsCount, testimonialsCount }) => {
  const stats = [
    { icon: <Calendar className="w-5 h-5" />, label: "Pengalaman", value: "5+ Tahun" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Proyek Selesai", value: `${projectsCount}+` },
    { icon: <Users className="w-5 h-5" />, label: "Klien & Kolaborator", value: `${testimonialsCount}+` },
    { icon: <Award className="w-5 h-5" />, label: "Rating Rata-rata", value: "4.8/5" }
  ];

  return (
    <>
      {/* Bagian Pengantar */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-900">Profil Profesional</h3>
        </div>
        <p className="text-slate-900 leading-relaxed">
          {profile.description || DEFAULT_DESCRIPTION}
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </>
  );
};
