import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Lightbulb,
  Rocket,
  Sparkles,
  Heart,
  Star,
  Compass,
} from "lucide-react";
import { useDeviceCapability } from "../../utils/deviceProfiler";
import visiData from "../../data/visi/data.json";

const CORE_VALUE_ICONS = {
  Heart: <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3 animate-pulse" />,
  Star: <Star className="w-8 h-8 text-yellow-300 mx-auto mb-3 animate-pulse" />,
  Compass: <Compass className="w-8 h-8 text-cyan-300 mx-auto mb-3 animate-pulse" />,
};

export default function VisiMisi() {
  const { isLowTier } = useDeviceCapability();
  const particleCount = isLowTier ? 12 : 30;

  // Koordinat partikel stabil dan ter-memoize (0% CPU thrashing saat re-render)
  const particles = useMemo(() =>
    Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      top: `${(i * 3.7 + 5) % 95}%`,
      left: `${(i * 7.3 + 9) % 95}%`,
    })),
    [particleCount]
  );

  const {
    header,
    visi,
    misi,
    minatBakatSection,
    minatBakat,
    filosofiKreatif,
    timelineTitle,
    timeline,
    langkahSelanjutnya,
    coreValues,
    quote,
  } = visiData;

  return (
    <section className="relative min-h-screen bg-[var(--color-gray-900)] text-gray-100 flex flex-col items-center px-6 py-20 overflow-hidden">
      {/* 🌌 Background Particle & Gradient */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
            }}
          />
        ))}
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-fuchsia-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-yellow-300/10 blur-3xl rounded-full animate-ping" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-[#1e1b4b]/30 to-[var(--color-gray-900)] opacity-70" />
      </div>

      {/* ✨ Header */}
      <motion.div
        className="text-center max-w-3xl mb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
          {header.title}
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          {header.prefix}
          <motion.span
            className="relative px-1 font-semibold text-white"
            whileHover={{ scale: 1.1 }}
          >
            <span className="absolute inset-0 bg-yellow-300/30 rounded-md" />
            {header.highlight1}
          </motion.span>{" "}
          {header.middle}
          <motion.span
            className="relative px-1 font-semibold text-white"
            whileHover={{ scale: 1.1 }}
          >
            <span className="absolute inset-0 bg-pink-400/30 rounded-md" />
            {header.highlight2}
          </motion.span>
          {header.suffix}
        </p>
      </motion.div>

      {/* 🌟 VISI & MISI */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* VISI */}
        <motion.div
          className="relative bg-white/5 backdrop-blur-xl border border-blue-900/40 rounded-3xl p-10 shadow-lg hover:shadow-yellow-400/20 transition-all before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:to-white/10 before:opacity-20 before:rounded-3xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Target className="w-8 h-8 text-yellow-300" />
            <h2 className="text-3xl font-bold text-yellow-300">{visi.title}</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            {visi.segments.map((seg, idx) =>
              seg.highlight ? (
                <span key={idx} className="text-yellow-300 font-semibold">
                  {seg.text}
                </span>
              ) : (
                seg.text
              )
            )}
          </p>
        </motion.div>

        {/* MISI */}
        <motion.div
          className="relative bg-white/5 backdrop-blur-xl border border-blue-900/40 rounded-3xl p-10 shadow-lg hover:shadow-pink-400/20 transition-all before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:to-white/10 before:opacity-20 before:rounded-3xl"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Lightbulb className="w-8 h-8 text-pink-400" />
            <h2 className="text-3xl font-bold text-pink-400">{misi.title}</h2>
          </div>
          <ul className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed list-disc list-inside">
            {misi.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 💫 MINAT & BAKAT */}
      <motion.div
        className="mt-20 max-w-6xl w-full bg-white/5 backdrop-blur-xl border border-blue-900/40 rounded-3xl p-10 shadow-lg transition-all"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-cyan-300" />
          <h2 className="text-3xl font-bold text-cyan-300">{minatBakatSection.title}</h2>
        </div>

        <p className="text-gray-400 text-lg text-center mb-10">
          {minatBakatSection.prefix}
          <span className="relative px-1">
            <span className="absolute inset-0 bg-yellow-300/25 rounded-md" />
            <span className="relative text-white font-semibold">
              {minatBakatSection.highlight}
            </span>
          </span>{" "}
          {minatBakatSection.suffix}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {minatBakat.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.07,
                rotate: [0, 2, -2, 0],
                transition: { duration: 0.4 },
              }}
              className="relative p-6 bg-white/5 rounded-2xl border border-cyan-900/30 hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-400/10 hover:to-pink-400/10 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.2),_transparent_70%)]" />
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🌱 FILOSOFI KREATIF */}
      <motion.div
        className="mt-24 max-w-5xl text-center bg-white/5 backdrop-blur-xl border border-cyan-900/40 rounded-3xl p-12 shadow-xl hover:shadow-cyan-500/10 transition-all"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-yellow-300 to-pink-400 bg-clip-text text-transparent mb-6">
          {filosofiKreatif.title}
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          {filosofiKreatif.segments.map((seg, idx) => {
            if (seg.highlightType === "cyan") {
              return (
                <span key={idx} className="text-cyan-300 font-medium">
                  {seg.text}
                </span>
              );
            }
            if (seg.highlightType === "yellow") {
              return (
                <span key={idx} className="text-yellow-300 font-semibold">
                  {seg.text}
                </span>
              );
            }
            return seg.text;
          })}
        </p>
      </motion.div>

      {/* 🕰️ TIMELINE */}
      <motion.section
        className="mt-32 w-full max-w-5xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        <h3 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
          {timelineTitle}
        </h3>

        <div className="relative border-l-[3px] border-yellow-400/30 pl-10 space-y-14">
          {/* Garis vertical animasi cahaya */}
          <div className="absolute left-[-2px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-yellow-400 via-yellow-300/20 to-transparent animate-pulse" />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 90 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Titik & ikon */}
              <div className="absolute -left-7 top-1 w-10 h-10 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] flex items-center justify-center text-black font-bold group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Kartu konten */}
              <div className="bg-zinc-900/40 backdrop-blur-sm border border-yellow-300/10 rounded-2xl p-5 transition-all duration-300 hover:bg-zinc-800/60 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)]">
                <h4 className="text-2xl font-semibold text-yellow-300 mb-2 tracking-wide">
                  {item.year}
                </h4>
                <p className="text-gray-300 leading-relaxed text-base">
                  {item.text}
                </p>
              </div>

              {/* Efek garis bercahaya ke kartu */}
              <div className="absolute -left-[3px] top-6 w-8 h-[2px] bg-gradient-to-r from-yellow-400/70 via-yellow-300/30 to-transparent" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🔮 LANGKAH SELANJUTNYA */}
      <motion.section
        className="mt-32 relative max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
      >
        {/* Background partikel animasi */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <div className="absolute w-[300px] h-[300px] bg-purple-500/20 rounded-full animate-slow-spin blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-[400px] h-[400px] bg-cyan-400/10 rounded-full animate-spin-slow blur-2xl -bottom-32 -right-32"></div>
          <div className="absolute w-full h-full bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-slate-900/80"></div>
        </div>

        {/* Card utama */}
        <motion.div
          className="relative p-14 rounded-3xl border border-purple-500/20 shadow-[0_0_60px_rgba(139,92,246,0.2)] hover:shadow-[0_0_100px_rgba(139,92,246,0.35)] backdrop-blur-sm transition-all duration-500"
          whileHover={{ y: -5, scale: 1.02 }}
        >
          {/* Judul */}
          <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse-text">
            {langkahSelanjutnya.title}
          </h3>

          {/* Konten */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed tracking-wide">
            {langkahSelanjutnya.prefix}
            <span className="text-yellow-300 font-semibold">
              {langkahSelanjutnya.highlight}
            </span>{" "}
            {langkahSelanjutnya.suffix}
            <br />
            <span className="text-cyan-300 font-medium mt-4 inline-block">
              {langkahSelanjutnya.subDescription}
            </span>
          </p>

          {/* Tombol CTA futuristik */}
          <motion.a
            href={langkahSelanjutnya.ctaLink}
            className="mt-10 inline-block px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-black font-semibold shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -3, 0], transition: { repeat: Infinity, duration: 2 } }}
          >
            {langkahSelanjutnya.ctaText}
          </motion.a>
        </motion.div>
      </motion.section>

      {/* 💎 CORE VALUES */}
      <motion.div
        className="mt-28 text-center max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        viewport={{ once: true }}
      >
        <div className="flex justify-center mb-6">
          <Rocket className="w-10 h-10 text-yellow-300 animate-bounce" />
        </div>
        <h3 className="text-3xl font-bold text-yellow-300 mb-8">{coreValues.title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.items.map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06, rotate: 1 }}
              className="relative p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-blue-900/40 hover:border-yellow-300/40 hover:shadow-lg transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-transparent rounded-2xl opacity-20" />
              {CORE_VALUE_ICONS[value.icon] || (
                <Star className="w-8 h-8 text-yellow-300 mx-auto mb-3 animate-pulse" />
              )}
              <h4 className="text-xl font-semibold mb-2 text-white">{value.title}</h4>
              <p className="text-gray-400 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 💬 QUOTE */}
      <motion.blockquote
        className="mt-20 text-center text-gray-300 italic text-lg border-l-4 border-yellow-300/60 pl-6 max-w-3xl mx-auto bg-gradient-to-r from-yellow-300/5 to-pink-400/5 rounded-xl p-6 shadow-inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        “{quote.text}” —{" "}
        <span className="text-yellow-300 font-semibold">{quote.author}</span>
      </motion.blockquote>
    </section>
  );
}