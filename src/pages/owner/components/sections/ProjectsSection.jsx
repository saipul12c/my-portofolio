import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Code2, Star, ExternalLink, ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { LABEL_COLORS } from "../../utils/constants";

/**
 * ProjectsSection component - displays recent featured projects with dark theme styling
 */
export const ProjectsSection = ({ projects = [] }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Karya & Proyek Pilihan"
        description="Pengembangan media pembelajaran interaktif & sistem aplikasi berbasis web"
        icon={<Briefcase className="w-5 h-5" />}
        to="/projects"
        linkText="Lihat Semua Proyek"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project-detail/${project.id}`}
            className="group bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <Code2 className="w-5 h-5" />
                </div>
                {project.label && (
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                      LABEL_COLORS[project.label] || LABEL_COLORS.default
                    }`}
                  >
                    {project.label}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5">
                {project.title}
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                {project.subtitle || project.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-semibold">{project.rating || "5.0"}</span>
                <span className="text-slate-500">({project.category || "Web App"})</span>
              </div>
              <span className="text-cyan-400 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Detail <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-2 text-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 text-xs sm:text-sm font-semibold border border-slate-700/60 hover:border-cyan-500/50 transition-all group shadow-sm"
        >
          <span>Jelajahi Seluruh Proyek di Halaman /projects</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
