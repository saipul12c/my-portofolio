// About.jsx
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import Maintenance from "../errors/Maintenance";
import LoadingScreen from "./components/LoadingScreen";

import AboutHeader from "./components/AboutHeader";
import AboutCards from "./components/AboutCards";
import AboutCertificates from "./components/AboutCertificates";
import AboutCollaborations from "./components/AboutCollaborations";
import AboutSoftSkills from "./components/AboutSoftSkills";
import AboutInterests from "./components/AboutInterests";

import profileData from "../../data/about/profile.json";
import cardsData from "../../data/about/cards.json";
import certificatesData from "../../data/sertif/certificates.json";
import collabsData from "../../data/about/collaborations.json";
import softSkillsData from "../../data/skills/softskills.json";
import interestsData from "../../data/about/interests.json";
import hobbiesData from "../../data/hub/hobbiesData.json";

export default function About() {
  // Memoize static data safely to prevent unnecessary re-instantiations
  const profile = useMemo(() => profileData || {}, []);
  const cards = useMemo(() => cardsData?.cards || [], []);
  const certificates = useMemo(
    () => certificatesData || { sectionTitle: "Sertifikat", certificates: [] },
    []
  );
  const collabs = useMemo(() => collabsData || { partners: [] }, []);
  const softSkills = useMemo(() => softSkillsData || { skills: [] }, []);
  const interests = useMemo(() => {
    return {
      ...(interestsData || {}),
      // Pass featured hobbies items so AboutInterests can render rich interactive cards
      featuredHobbies: (hobbiesData || []).slice(0, 6),
    };
  }, []);

  // 🔧 Toggle mode maintenance
  const isMaintenance = false;

  if (isMaintenance) {
    return <Maintenance />;
  }

  if (!profile || cards.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>{`${profile.name || "Tentang"} | Portfolio & Profile`}</title>
        <meta
          name="description"
          content={
            profile.description ||
            "Profil profesional, sertifikat, keterampilan, dan kolaborasi Muhammad Syaiful Mukmin."
          }
        />
        <meta
          name="keywords"
          content="Muhammad Syaiful Mukmin, About, Portfolio, Web Developer, Pendidikan, PGMI, Fotografi, Soft Skills"
        />
        <meta property="og:title" content={`${profile.name || "Tentang"} - Portfolio`} />
        <meta
          property="og:description"
          content={profile.description || "Profil profesional dan portofolio."}
        />
        <meta property="og:type" content="profile" />
      </Helmet>

      <main className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-20 pt-0 pb-16 sm:pb-20 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] will-change-transform" />
          <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] will-change-transform" />
          <div className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px] will-change-transform" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[35rem] h-52 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Header Hero & 3D Interactive Badge */}
        <AboutHeader profile={profile} />

        {/* Quick Nav Anchors for Smooth Browsing */}
        <nav
          aria-label="Navigasi bagian tentang"
          className="mt-6 mb-12 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#111c34]/80 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-950/30"
        >
          <a
            href="#ringkasan"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            Ringkasan
          </a>
          <a
            href="#sertifikat"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            Sertifikat
          </a>
          <a
            href="#kolaborasi"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            Kolaborasi
          </a>
          <a
            href="#keahlian"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            Keahlian
          </a>
          <a
            href="#minat"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            Minat & Hobi
          </a>
        </nav>

        {/* Section 1: Overview Cards */}
        <div id="ringkasan" className="w-full scroll-mt-24">
          <AboutCards cards={cards} />
        </div>

        {/* Section 2: Certificates & Awards */}
        <div id="sertifikat" className="w-full scroll-mt-24">
          <AboutCertificates certificates={certificates} />
        </div>

        {/* Section 3: Partners & Collaborations */}
        <div id="kolaborasi" className="w-full scroll-mt-24">
          <AboutCollaborations collabs={collabs} />
        </div>

        {/* Section 4: Soft Skills & Values */}
        <div id="keahlian" className="w-full scroll-mt-24">
          <AboutSoftSkills softSkills={softSkills} />
        </div>

        {/* Section 5: Interests & Hobbies */}
        <div id="minat" className="w-full scroll-mt-24">
          <AboutInterests interests={interests} />
        </div>
      </main>
    </>
  );
}
