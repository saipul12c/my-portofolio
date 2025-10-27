// AboutHeader.jsx
import { motion } from "framer-motion";

export default function AboutHeader({ profile }) {
  return (
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
  );
}
