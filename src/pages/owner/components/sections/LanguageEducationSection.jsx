import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Globe, BookOpen, ArrowRight, CheckCircle2, Award } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { ColorTag } from "../ui/ColorTag";
import { SLICE_LIMITS } from "../../utils/constants";

/**
 * LanguageEducationSection component - displays Academic Pathway (S1 PGMI), Education & Languages
 */
export const LanguageEducationSection = ({ bahasaData = {}, pendidikanData = {} }) => {
  // Academic journey stages specifically matching the existing routes in this project
  const academicMilestones = [
    { title: "S1 PGMI", desc: "Pendidikan Guru Madrasah Ibtidaiyah", to: "/S1-PGMI", badge: "Program Studi", color: "from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30" },
    { title: "KKN Mahasiswa", desc: "Pengabdian Desa Kundan Haruyan Dayak", to: "/kkn", badge: "Pengabdian", color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30" },
    { title: "Sempro Skripsi", desc: "Seminar Proposal Penelitian Ilmiah", to: "/sempro-skripsi", badge: "Akademik", color: "from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30" },
    { title: "Sidang Skripsi", desc: "Ujian Munaqasyah & Kelulusan Sarjana", to: "/sidang-skripsi", badge: "Kelulusan", color: "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30" },
    { title: "Wisuda Sarjana", desc: "Momen Sakral Wisuda & Gelar S.Pd", to: "/wisuda", badge: "Kelulusan", color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Milestone Akademik S1 PGMI */}
      <div className="space-y-4">
        <SectionHeader
          title="Jalur Akademik S1 PGMI & Tahapan Kelulusan"
          description="Dokumentasi resmi perjalanan studi Pendidikan Guru Madrasah Ibtidaiyah"
          icon={<GraduationCap className="w-5 h-5 text-cyan-400" />}
          to="/S1-PGMI"
          linkText="Buka Laman S1 PGMI"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {academicMilestones.map((milestone, idx) => (
            <Link
              key={idx}
              to={milestone.to}
              className="group p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-gradient-to-r ${milestone.color}`}>
                    {milestone.badge}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400/80 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {milestone.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {milestone.desc}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-cyan-400 font-medium">
                <span>Eksplorasi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Riwayat Pendidikan & Kemampuan Bahasa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pendidikan Terpilih */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h4 className="text-base font-bold text-white">Riwayat Pendidikan Formal</h4>
              </div>
              <Link to="/education" className="text-xs text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1">
                <span>Semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(pendidikanData.education || []).slice(0, SLICE_LIMITS.pendidikan).map((e, i) => (
                <div key={i} className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-teal-500/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-semibold text-white text-xs sm:text-sm">{e.degree}</h5>
                      <p className="text-xs text-teal-300/90">{e.institution}</p>
                    </div>
                    {e.year && (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {e.year}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <Link
              to="/education"
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1.5"
            >
              <span>Lihat Detail Silabus & Sertifikat Pendidik di /education</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Kemampuan Bahasa */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-bold text-white">Kompetensi Bahasa</h4>
              </div>
              <Link to="/bahasa" className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                <span>Detail</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(bahasaData.bahasaSehariHari || []).map((b, i) => (
                <div key={i} className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{b.icon || "🌐"}</span>
                    <div>
                      <div className="font-semibold text-white text-xs sm:text-sm">{b.nama}</div>
                      <div className="text-[11px] text-slate-400">{b.tingkat}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-300 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    {b.status || "Aktif"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <Link
              to="/bahasa"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5"
            >
              <span>Uji Kompetensi & Transkrip Bahasa di /bahasa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
