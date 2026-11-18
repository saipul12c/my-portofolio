import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Target,
  Heart,
  Globe,
  GraduationCap,
  BookOpen,
  Users,
  FileCheck,
  Award,
  Sparkles,
  Briefcase,
  Zap,
  MessageSquare,
  Image,
  Camera,
  Mail,
  Shield,
  Compass,
  HelpCircle,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { CONNECTED_PAGES } from "../../utils/constants";
import { SectionHeader } from "../ui/SectionHeader";

const ICON_MAP = {
  User,
  FileText,
  Target,
  Heart,
  Globe,
  GraduationCap,
  BookOpen,
  Users,
  FileCheck,
  Award,
  Sparkles,
  Briefcase,
  Zap,
  MessageSquare,
  Image,
  Camera,
  Mail,
  Shield,
  Compass,
  HelpCircle
};

/**
 * ConnectedEcosystemSection - provides direct, structured links to all pages across the website
 */
export const ConnectedEcosystemSection = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Jelajahi Seluruh Ekosistem Halaman"
        description="Pusat navigasi menyeluruh yang menghubungkan profil owner ke setiap modul dan halaman portofolio"
        icon={<Compass className="w-5 h-5 text-cyan-400" />}
      />

      <div className="space-y-6">
        {CONNECTED_PAGES.map((category, catIdx) => (
          <div
            key={catIdx}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6"
          >
            <div className="mb-4 pb-3 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {category.category}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
              </div>
              <span className="text-[11px] font-medium text-slate-500 self-start sm:self-auto">
                {category.links.length} Halaman
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.links.map((item, itemIdx) => {
                const IconComponent = ICON_MAP[item.icon] || Sparkles;
                return (
                  <Link
                    key={itemIdx}
                    to={item.to}
                    className="group p-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 hover:border-cyan-500/50 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="font-semibold text-white text-xs sm:text-sm group-hover:text-cyan-300 transition-colors truncate">
                          {item.label}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
