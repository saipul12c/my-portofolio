// About.jsx
import { useEffect, useState } from "react";
import Maintenance from "../errors/Maintenance";
import LoadingScreen from "./components/LoadingScreen";

import AboutHeader from "./components/AboutHeader";
import AboutCards from "./components/AboutCards";
import AboutCertificates from "./components/AboutCertificates";
import AboutCollaborations from "./components/AboutCollaborations";
import AboutSoftSkills from "./components/AboutSoftSkills";
import AboutInterests from "./components/AboutInterests";

export default function About() {
  const [profile, setProfile] = useState(null);
  const [cards, setCards] = useState([]);
  const [certificates, setCertificates] = useState(null);
  const [collabs, setCollabs] = useState(null);
  const [softSkills, setSoftSkills] = useState(null);
  const [interests, setInterests] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          profileData,
          cardsData,
          certsData,
          collabsData,
          softData,
          interestsData,
        ] = await Promise.all([
          fetch("/data/about/profile.json").then((r) => r.json()),
          fetch("/data/about/cards.json").then((r) => r.json()),
          fetch("/data/about/certificates.json\n").then((r) => r.json()),
          fetch("/data/about/collaborations.json").then((r) => r.json()),
          fetch("/data/about/softskills.json").then((r) => r.json()),
          fetch("/data/about/interests.json").then((r) => r.json()),
        ]);

        setProfile(profileData);
        setCards(cardsData.cards);
        setCertificates(certsData);
        setCollabs(collabsData);
        setSoftSkills(softData);
        setInterests(interestsData);
      } catch (error) {
        console.error("Gagal memuat data About:", error);
      }
    }

    loadData();
  }, []);

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
