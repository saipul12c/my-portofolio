import React from "react";
import { useProfileData } from "./hooks/useProfileData";
import { useDataProcessing } from "./hooks/useDataProcessing";
import { getInitials } from "./utils/helpers";
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
import { FooterCTA } from "./components/sections/FooterCTA";
import { FooterNote } from "./components/sections/FooterNote";

export default function Owne() {
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
    blogStats,
    projectsCount,
    testimonialsCount
  } = useDataProcessing(data);

  // Get initials for avatar
  const initials = getInitials(profile.name);

  // Count data for sidebar
  const counts = {
    projects: projects.length,
    testimonials: testimonials.length,
    blogs: blogs.length,
    certificates: certificates.length
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-900)] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Profil Profesional</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full"></div>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
            Portofolio digital yang menunjukkan perjalanan, kompetensi, dan nilai-nilai sebagai profesional teknologi pendidikan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar Profil */}
            <ProfileSidebar profile={profile} initials={initials} counts={counts} />

            {/* Konten Utama */}
            <div className="lg:col-span-2 p-8 lg:p-10">
              <ProfileIntro profile={profile} projectsCount={projectsCount} testimonialsCount={testimonialsCount} />
              <CommitmentsSection commitments={commitments} />
              <ProjectsSection projects={recentProjects} />
              <SoftSkillsSection skills={topSoftSkills} />
              <BlogStatsSection blogStats={blogStats} />
              <BlogArticlesSection blogs={recentBlogs} />
              <CertificatesSection certificates={recentCertificates} />
              <HobbiesSection hobbies={topHobbies} />
              <TestimonialsSection testimonials={recentTestimonials} />
              <LanguageEducationSection bahasaData={bahasa} pendidikanData={pendidikan} />
              <VisionMissionSection />
              <FooterCTA />
            </div>
          </div>
        </div>

        {/* Footer Catatan */}
        <FooterNote projects={projects} blogs={blogs} certificates={certificates} />
      </div>
    </div>
  );
}