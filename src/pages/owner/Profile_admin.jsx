import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  GraduationCap, 
  Zap, 
  MessageSquare, 
  Compass, 
  Layers, 
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { useProfileData } from "./hooks/useProfileData";
import { useDataProcessing } from "./hooks/useDataProcessing";
import { getInitials } from "./utils/helpers";
import { OWNER_FACTS } from "./utils/constants";

// Sections
import { ProfileSidebar } from "./components/sections/ProfileSidebar";
import { ProfileIntro } from "./components/sections/ProfileIntro";
import { CommitmentsSection } from "./components/sections/CommitmentsSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { SoftSkillsSection } from "./components/sections/SoftSkillsSection";
import { BlogStatsSection } from "./components/sections/BlogStatsSection";
import { BlogArticlesSection } from "./components/sections/BlogArticlesSection";
import { CertificatesSection } from "./components/sections/CertificatesSection";
import { HobbiesSection } from "./components/sections/HobbiesSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { LanguageEducationSection } from "./components/sections/LanguageEducationSection";
import { VisionMissionSection } from "./components/sections/VisionMissionSection";
import { ConnectedEcosystemSection } from "./components/sections/ConnectedEcosystemSection";
import { FooterCTA } from "./components/sections/FooterCTA";
import { FooterNote } from "./components/sections/FooterNote";

export default function ProfileAdmin() {
  // Load all profile data
  const data = useProfileData();
  const {
    profile,
    commitments,
    projects,
    testimonials,
    blogs,
    certificates,
    bahasa,
    pendidikan
  } = data;

  // Process data
  const {
    recentProjects,
    recentTestimonials,
    topSoftSkills,
    recentBlogs,
    recentCertificates,
    topHobbies,
    blogStats
  } = useDataProcessing(data);

  // Tab state: 'overview' | 'academic' | 'skills_blog' | 'trust_personal' | 'ecosystem'
  const [activeTab, setActiveTab] = useState("overview");

  // Get initials for avatar
  const initials = getInitials(profile?.name || OWNER_FACTS.name);

  // Dynamic counts for sidebar and KPI
  const counts = {
    projects: projects.length,
    testimonials: testimonials.length,
    blogs: blogs.length,
    certificates: certificates.length,
    softSkills: data.softSkills?.length || 8
  };

  const tabs = [
    {
      id: "overview",
      label: "Ikhtisar & Karya",
      icon: Briefcase,
      badge: `${counts.projects} Proyek`
    },
    {
      id: "academic",
      label: "Akademik & Lisensi",
      icon: GraduationCap,
      badge: "S1 PGMI"
    },
    {
      id: "skills_blog",
      label: "Keahlian & Blog",
      icon: Zap,
      badge: `${counts.blogs} Artikel`
    },
    {
      id: "trust_personal",
      label: "Mitra & Personal",
      icon: MessageSquare,
      badge: `${counts.testimonials} Ulasan`
    },
    {
      id: "ecosystem",
      label: "Semua Halaman",
      icon: Compass,
      badge: "20+ Link"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-gray-900)] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Top Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Kendali Profil Pemilik & EduTech Innovator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Profil & Ekosistem Profesional
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Dokumentasi komprehensif perjalanan akademik <strong className="text-cyan-300">S1 PGMI</strong>, portofolio teknologi pendidikan, karya rekayasa web, dan jejaring seluruh halaman website.
          </p>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Profile Sidebar / Executive Card (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ProfileSidebar profile={profile} initials={initials} counts={counts} />
          </div>

          {/* Right Column: Tabbed Content & Hub (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick KPI Strip (Interconnected Link Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/projects"
                className="p-3.5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium">Karya Selesai</span>
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300">
                  {counts.projects}+
                </div>
                <div className="text-[10px] text-cyan-400/80 flex items-center gap-1 mt-1">
                  <span>Lihat /projects</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                to="/certificates"
                className="p-3.5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium">Sertifikasi</span>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300">
                  {counts.certificates}+
                </div>
                <div className="text-[10px] text-amber-400/80 flex items-center gap-1 mt-1">
                  <span>Lihat /certificates</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                to="/blog"
                className="p-3.5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium">Artikel EduTech</span>
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-300">
                  {counts.blogs}+
                </div>
                <div className="text-[10px] text-blue-400/80 flex items-center gap-1 mt-1">
                  <span>Lihat /blog</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                to="/testimoni"
                className="p-3.5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium">Mitra & Klien</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300">
                  {counts.testimonials}+
                </div>
                <div className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-1">
                  <span>Lihat /testimoni</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Interactive Tab Navigation */}
            <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 flex items-center overflow-x-auto no-scrollbar gap-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-cyan-400"}`} />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Tab Content Area */}
            <div className="transition-all duration-300">
              {/* TAB 1: Ikhtisar & Karya */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <ProfileIntro profile={profile} />
                  <ProjectsSection projects={recentProjects} />
                  <CommitmentsSection commitments={commitments} />
                  <VisionMissionSection />
                </div>
              )}

              {/* TAB 2: Akademik & Lisensi */}
              {activeTab === "academic" && (
                <div className="space-y-6">
                  <LanguageEducationSection bahasaData={bahasa} pendidikanData={pendidikan} />
                  <CertificatesSection certificates={recentCertificates} />
                </div>
              )}

              {/* TAB 3: Keahlian & Blog */}
              {activeTab === "skills_blog" && (
                <div className="space-y-6">
                  <SoftSkillsSection skills={topSoftSkills} />
                  <BlogStatsSection blogStats={blogStats} />
                  <BlogArticlesSection blogs={recentBlogs} />
                </div>
              )}

              {/* TAB 4: Mitra & Personal */}
              {activeTab === "trust_personal" && (
                <div className="space-y-6">
                  <TestimonialsSection testimonials={recentTestimonials} />
                  <HobbiesSection hobbies={topHobbies} />
                  <FooterCTA />
                </div>
              )}

              {/* TAB 5: Semua Halaman Terhubung (Ecosystem Hub) */}
              {activeTab === "ecosystem" && (
                <div className="space-y-6">
                  <ConnectedEcosystemSection />
                </div>
              )}
            </div>

            {/* Bottom Quick Hub Pill if not on ecosystem tab */}
            {activeTab !== "ecosystem" && (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-xs sm:text-sm">
                      Mencari halaman portofolio lainnya?
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Tersedia 20+ halaman mulai dari S1 PGMI, KKN, Skripsi, CV, Proyek hingga Galeri
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("ecosystem")}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700/80 hover:border-cyan-500/40 transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Buka Peta Ekosistem Halaman</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Footer Note */}
        <FooterNote projects={projects} blogs={blogs} certificates={certificates} />
      </div>
    </div>
  );
}
