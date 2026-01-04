import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Code, Star } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { LABEL_COLORS } from "../../utils/constants";

/**
 * ProjectsSection component - displays recent projects
 */
export const ProjectsSection = ({ projects }) => {
  return (
    <div className="mb-10">
      <SectionHeader 
        title="Proyek Terbaru"
        description="Inovasi dan implementasi teknologi pendidikan terkini"
        icon={<Briefcase className="w-8 h-8" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <Link key={project.id}
                to={`/project-detail/${project.id}`}
               className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 
                          rounded-xl p-4 hover:border-teal-300 transition-all duration-300 
                          hover:shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center 
                            justify-center text-teal-600 flex-shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                LABEL_COLORS[project.label] || LABEL_COLORS.default
              }`}>
                {project.label}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2 group-hover:text-teal-700 
                         transition-colors truncate">
              {project.title}
            </h4>
            <p className="text-slate-600 text-sm mb-3 line-clamp-2">
              {project.subtitle}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" />
                {project.rating}
              </span>
              <span>{project.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
