import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Code2,
  Camera,
  Rocket,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import Maintenance from "./errors/Maintenance"; // 🚧 Tambahkan ini!

// 📦 Mapping icon agar bisa digunakan dari JSON
const iconMap = {
  Code2,
  Camera,
  Rocket,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  Heart,
};

export default function About() {
  const [profile, setProfile] = useState(null);
  const [cards, setCards] = useState([]);
  const [certificates, setCertificates] = useState(null);
  const [collabs, setCollabs] = useState(null);
  const [softSkills, setSoftSkills] = useState(null);
  const [interests, setInterests] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null); // 🔹 Modal sertifikat


  // 🔧 Toggle mode maintenance
  // const isMaintenance = true; // ubah ke false kalau sudah normal
  const isMaintenance = false;

  if (isMaintenance) {
    return <Maintenance />; // langsung tampilkan halaman maintenance
  }

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
          fetch("/data/about/certificates.json").then((r) => r.json()),
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

  if (
    !profile ||
    cards.length === 0 ||
    !certificates ||
    !collabs ||
    !softSkills ||
    !interests
  ) {
    return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
      <motion.div
        className="flex space-x-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.18,
              repeat: Infinity,
            },
          },
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]"
            variants={{
              hidden: { y: 0, opacity: 0.2, scale: 0.8, filter: "blur(1px)" },
              visible: { y: -18, opacity: 1, scale: 1.2, filter: "blur(0px)" },
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 12,
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5,
            }}
          />
        ))}
      </motion.div>
      
      <motion.p
        className="mt-6 text-lg sm:text-xl text-cyan-300 font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Memuat konten...
      </motion.p>
    </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-[textGlow_2s_ease-in-out_infinite]">
          {profile.title}
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
          Halo, saya{" "}
          <span className="text-yellow-400 font-semibold">{profile.name}</span>, calon pendidik yang berkomitmen untuk menghadirkan{" "}
          <span className="text-amber-400 font-semibold">{profile.highlight1}</span>{" "}
          dalam menciptakan media pembelajaran <span className="text-yellow-300 font-semibold">modern</span>, <span className="text-yellow-400 font-semibold">efektif</span>, dan <span className="text-amber-400 font-semibold">bermakna</span>.  
          Dengan semangat <span className="italic text-gray-100">belajar seumur hidup</span>, saya berusaha menghadirkan pengalaman belajar yang <span className="underline decoration-yellow-400/50">interaktif</span> serta relevan dengan kebutuhan generasi digital saat ini.
        </p>
      </motion.div>

      {/* Profile Cards */}
      <motion.div
        className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {cards.map((card, i) => {
          const Icon = iconMap[card.icon];
          const borderColor = `border-${card.color}-400/20 hover:border-${card.color}-400`;
          const textHover = `group-hover:text-${card.color}-300`;

          return (
            <Link
              key={i}
              to={card.link}
              className={`group bg-white/10 backdrop-blur-xl ${borderColor} rounded-2xl p-8 shadow-lg transition-all hover:scale-[1.04] ${
                card.id === 3 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {Icon && (
                <Icon className={`w-10 h-10 text-${card.color}-400 mb-4`} />
              )}
              <h2
                className={`text-xl font-semibold mb-3 ${textHover} transition`}
              >
                {card.title}
              </h2>

              {card.type === "list" ? (
                <ul className="text-gray-300 text-sm space-y-2">
                  {card.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {card.content}
                </p>
              )}
            </Link>
          );
        })}
      </motion.div>

      {/* Certificates Section with Pop-Up */}
      <motion.section
        className="mt-24 w-full max-w-6xl text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="block group mb-12 cursor-pointer">
          <Award className="w-12 h-12 text-pink-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-3xl sm:text-4xl font-extrabold text-pink-400 group-hover:text-pink-300 transition duration-300">
            {certificates.sectionTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {certificates.certificates.map((cert, i) => {
            // Palet warna tags/skills dengan text yang sesuai
            const tagColors = [
              { bg: "bg-white/90", text: "text-black" },
              { bg: "bg-blue-400", text: "text-black" }, // ubah text menjadi hitam agar lebih terbaca
              { bg: "bg-yellow-400", text: "text-black" },
            ];
            const getRandomTagColor = () => tagColors[Math.floor(Math.random() * tagColors.length)];
          
            // Palet warna level badge
            const levelColors = {
              Pemula: "bg-green-400 text-black",
              Menengah: "bg-yellow-400 text-black",
              Lanjutan: "bg-red-400 text-white",
            };
          
            return (
              <div
                key={i}
                onClick={() => setSelectedCert(cert)}
                className="relative bg-gradient-to-tr from-pink-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 hover:scale-105 hover:shadow-xl transition-transform cursor-pointer group"
              >
                <div className="flex items-center justify-center mb-3">
                  <img src={cert.organization.logo} alt={cert.organization.name} className="w-10 h-10 rounded-full" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{cert.name}</h4>
                <p className="text-gray-300 text-sm mb-2">{cert.organization.name}</p>

                {/* Level Badge dengan warna khusus */}
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${levelColors[cert.level] || "bg-gray-400 text-black"}`}
                >
                  {cert.level}
                </span>
            
                <p className="text-gray-200 text-sm mt-2 line-clamp-3">{cert.description}</p>
            
                {/* Tags & Skills dengan warna acak dari 3 pilihan */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {cert.tags.map((tag, idx) => {
                    const color = getRandomTagColor();
                    return (
                      <span
                        key={idx}
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                      >
                        #{tag}
                      </span>
                    );
                  })}
                  {cert.skills?.map((skill, idx) => {
                    const color = getRandomTagColor();
                    return (
                      <span
                        key={idx + cert.tags.length}
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
                
                <span className="text-pink-300 text-xs mt-3 inline-block group-hover:underline">Lihat Detail →</span>
              </div>
            );
          })}
        </div>
      </motion.section>
        
      {/* Modal / Pop-Up dengan Navigasi */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={selectedCert.id}
              className="bg-gradient-to-br from-pink-700 via-purple-700 to-indigo-700 rounded-3xl p-6 max-w-lg w-full text-white relative shadow-2xl ring-1 ring-pink-500/30 overflow-y-auto max-h-[90vh]"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 text-white hover:text-pink-300"
              >
                <X className="w-6 h-6" />
              </button>
        
              {/* Navigation Buttons */}
              {certificates.length > 1 && (
                <>
                  <button
                    onClick={() => navigateCert(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-300"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={() => navigateCert(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-300"
                  >
                    &#8594;
                  </button>
                </>
              )}

              {/* Organization Logo */}
              <div className="flex items-center justify-center mb-4">
                <img
                  src={selectedCert.organization.logo}
                  alt={selectedCert.organization.name}
                  className="w-12 h-12 rounded-full shadow-lg"
                />
              </div>
            
              {/* Certificate Info */}
              <h4 className="text-2xl font-extrabold mb-1 text-pink-200">{selectedCert.name}</h4>
              <p className="text-gray-200 font-semibold mb-1">{selectedCert.organization.name}</p>
              <p className="text-gray-300 text-sm mb-2">
                {new Date(selectedCert.dateIssued).toLocaleDateString()}
              </p>
            
              {/* Status & Level */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className="inline-block text-black text-xs font-semibold px-4 py-1 rounded-full"
                  style={{ backgroundColor: selectedCert.ui.badgeColor }}
                >
                  {selectedCert.level}
                </span>
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedCert.status === "active"
                      ? "bg-green-500/60 text-black"
                      : "bg-gray-500/60 text-white"
                  }`}
                >
                  {selectedCert.status === "active" ? "Aktif" : "Expired"}
                </span>
                <span className="inline-block bg-purple-600/40 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedCert.category}
                </span>
              </div>
                
              {/* Description */}
              <p className="text-white/90 mb-4">{selectedCert.description}</p>
                
              {/* Tags & Skills dengan warna acak */}
              <div className="mb-4 flex flex-wrap gap-2">
                {(() => {
                  const tagColors = [
                    "bg-pink-400/80",
                    "bg-purple-400/80",
                    "bg-green-400/80",
                    "bg-blue-400/80",
                    "bg-yellow-400/80",
                    "bg-orange-400/80",
                  ];
                  const getRandomColor = () =>
                    tagColors[Math.floor(Math.random() * tagColors.length)];
                  return (
                    <>
                      {selectedCert.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`inline-block text-black text-xs font-bold px-3 py-1 rounded-full ${getRandomColor()}`}
                        >
                          #{tag}
                        </span>
                      ))}
                      {selectedCert.skills.map((skill, idx) => (
                        <span
                          key={idx + selectedCert.tags.length}
                          className={`inline-block text-black text-xs font-bold px-3 py-1 rounded-full ${getRandomColor()}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </>
                  );
                })()}
              </div>
              
              {/* Links */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCert.certificateLinks.certificate && (
                  <a
                    href={selectedCert.certificateLinks.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-pink-400 text-black font-bold px-5 py-2 rounded-full hover:bg-pink-500 transition duration-300 shadow-md"
                  >
                    Buka Sertifikat
                  </a>
                )}
                {selectedCert.certificateLinks.portfolio && (
                  <a
                    href={selectedCert.certificateLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-indigo-400 text-black font-bold px-5 py-2 rounded-full hover:bg-indigo-500 transition duration-300 shadow-md"
                  >
                    Portfolio
                  </a>
                )}
                {selectedCert.certificateLinks.video && (
                  <a
                    href={selectedCert.certificateLinks.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-green-400 text-black font-bold px-5 py-2 rounded-full hover:bg-green-500 transition duration-300 shadow-md"
                  >
                    Video
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborations */}
      <motion.section
        className="mt-24 w-full max-w-5xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Users className="w-10 h-10 text-cyan-300 mx-auto mb-4" />
        <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6">
          {collabs.sectionTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
          {collabs.partners.map((partner, i) => (
            <Link
              key={i}
              to={collabs.link}
              className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:border-cyan-400 rounded-2xl p-6 transition-all hover:scale-[1.03] shadow-md"
            >
              <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition">
                {partner.name}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {partner.desc}
              </p>
              <p className="mt-3 text-cyan-300 text-xs font-medium group-hover:underline">
                Lihat Testimoni →
              </p>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Soft Skills */}
      {softSkills?.sectionTitle && softSkills?.skills?.length > 0 && (
        <motion.section
          className="mt-24 w-full max-w-5xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link to={softSkills?.link || "#"} className="block group mb-8">
            <Heart className="w-10 h-10 text-cyan-300 mx-auto mb-2" />
            <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition">
              {softSkills?.sectionTitle}
            </h3>
          </Link>
      
          <div className="flex flex-wrap justify-center gap-4">
            {softSkills?.skills
              ?.filter((skill) => skill?.name && skill?.level) // ✅ Filter data tidak valid
              .map((skill, i) => {
                const palette = [
                  { bg: "bg-pink-500/30", text: "text-white" },
                  { bg: "bg-purple-500/30", text: "text-white" },
                  { bg: "bg-blue-500/30", text: "text-white" },
                  { bg: "bg-cyan-500/30", text: "text-white" },
                  { bg: "bg-green-500/30", text: "text-white" },
                  { bg: "bg-emerald-500/30", text: "text-white" },
                  { bg: "bg-yellow-500/30", text: "text-white" },
                  { bg: "bg-orange-500/30", text: "text-white" },
                  { bg: "bg-amber-500/30", text: "text-white" },
                  { bg: "bg-rose-500/30", text: "text-white" },
                  { bg: "bg-indigo-500/30", text: "text-white" },
                  { bg: "bg-teal-500/30", text: "text-white" },
                ];
              
                const randomColor = palette[(i * 7 + 3) % palette.length];
                const skillColor = randomColor;
              
                const levelColors = {
                  Dasar: { bg: "bg-gray-600", text: "text-white" },
                  Menengah: { bg: "bg-indigo-600", text: "text-white" },
                  Mahir: { bg: "bg-green-600", text: "text-white" },
                  Ahli: { bg: "bg-amber-500", text: "text-white" },
                };
              
                const levelColor = levelColors[skill.level] || {
                  bg: "bg-white/20",
                  text: "text-white",
                };
              
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link to={`/SoftSkills/${skill?.id || ""}`} className="relative group">
                      <span
                        className={`px-5 py-2 ${skillColor.bg} ${skillColor.text} border border-white/20 rounded-full text-sm font-semibold hover:scale-105 hover:shadow-lg transition-all inline-flex items-center gap-2`}
                      >
                        {skill?.name}
                        <span
                          className={`${levelColor.bg} ${levelColor.text} px-3 py-1 text-xs font-bold rounded-full shadow-sm border border-white/20`}
                        >
                          {skill?.level}
                        </span>
                      </span>
                
                      {/* Tooltip hanya muncul kalau ada description */}
                      {skill?.description && (
                        <span className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {skill?.description}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </motion.section>
      )}

      {/* Interests */}
      <motion.section
        className="mt-24 max-w-4xl text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to={interests.link} className="block group">
          <Sparkles className="w-10 h-10 text-cyan-300 mx-auto animate-pulse mb-3" />
          <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400 group-hover:text-cyan-300 transition">
            {interests.sectionTitle}
          </h3>
        </Link>

        <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
          {interests.description}
        </p>
      </motion.section>
    </main>
  );
}
