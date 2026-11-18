// About.jsx
import { useState } from "react";
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

export default function About() {
  const [profile] = useState(profileData || {});
  const [cards] = useState(cardsData?.cards || []);
  const [certificates] = useState(certificatesData || { sectionTitle: "Sertifikat", certificates: [] });
  const [collabs] = useState(collabsData || { partners: [] });
  const [softSkills] = useState(softSkillsData || { skills: [] });
  const [interests] = useState(interestsData || {});

  // 🔧 Toggle mode maintenance
  // const isMaintenance = true; // ubah ke false kalau sudah normal
  const isMaintenance = false;

  if (isMaintenance) {
    return <Maintenance />; // langsung tampilkan halaman maintenance
  }

  if (
    !profile ||
    cards.length === 0 ||
    !certificates ||
    !collabs ||
    !softSkills ||
    !interests
  ) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      <AboutHeader profile={profile} />
      <AboutCards cards={cards} />
      <AboutCertificates certificates={certificates} />
      <AboutCollaborations collabs={collabs} />
      <AboutSoftSkills softSkills={softSkills} />
      <AboutInterests interests={interests} />
    </main>
  );
}
