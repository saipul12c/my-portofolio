import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import {
  ProfessionalSummary,
  WorkExperience,
  FeaturedProjects,
  TechnicalSkills,
  Education,
  Languages,
  Certifications,
  AdditionalInfo
} from './components/Sections';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import projectsData from '../../data/projects.json';
import softSkillsData from '../../data/skills/softskills.json';
import testimonialsData from '../../data/testimoni/testimonials.json';
import certificatesData from '../../data/sertif/certificates.json';

const CVsaya = () => {
  const { isCopied, copyEmail } = useCopyToClipboard();

  // Ambil data dari JSON files
  const { projects } = projectsData;
  const { skills } = softSkillsData;
  const testimonials = testimonialsData;
  const { certificates } = certificatesData;

  // Filter dan sort projects untuk featured projects
  const featuredProjects = projects
    .filter(project => project.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Professional skills dari softskills.json
  const professionalSkills = skills
    .filter(skill => skill.category === "Professional Skill")
    .slice(0, 6)
    .map(skill => ({
      name: skill.name,
      level: skill.experience,
      icon: '⚡'
    }));

  const metrics = [
    { label: 'Projects Completed', value: `${projects.length}+`, icon: '🚀', link: '/projects' },
    { label: 'Years Experience', value: '3+', icon: '💼' },
    { label: 'Happy Clients', value: `${testimonials.length}+`, icon: '😊', link: '/testimoni' },
    { label: 'Certificates', value: `${certificates.length}+`, icon: '📜', link: '/certificates' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header isCopied={isCopied} copyEmail={copyEmail} metrics={metrics} />

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ProfessionalSummary />
            <WorkExperience />
            <FeaturedProjects projects={featuredProjects} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <TechnicalSkills skills={professionalSkills} />
            <Education />
            <Languages />
            <Certifications certificates={certificates} />
            <AdditionalInfo />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CVsaya;