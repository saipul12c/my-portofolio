// AboutHeader.jsx
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  memo
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  RotateCw,
  Sparkles,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ExternalLink
} from "lucide-react";

// Placeholder gambar QRIS dari internet
const ONLINE_QRIS_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS%20Muhammad%20Syaiful%20Mukmin%20-%20Support%20%26%20Donasi";

// --- Sub-Komponen: Kartu Menggantung (Ultimate Physics Badge) ---
function HangingBadge({ profile }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isDraggingRef = useRef(false);

  // --- PHYSICS ENGINE ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Konfigurasi fisika lentur & membal alami (fluid pendulum bounce)
  const physicsConfig = useMemo(
    () => ({
      damping: 14,
      stiffness: 140,
      mass: 0.85,
    }),
    []
  );

  // Ayunan pendulum (rotateZ) saat ditarik ke kiri/kanan (disesuaikan dengan tali yang panjang)
  const rotateZ = useTransform(x, [-250, 250], [-20, 20]);
  // Kemiringan perspektif 3D (rotateX & rotateY) saat ditarik atau digerakkan
  const rotateX = useTransform(y, [-200, 200], [18, -18]);
  const rotateY = useTransform(x, [-200, 200], [-18, 18]);

  const springRotateX = useSpring(rotateX, physicsConfig);
  const springRotateY = useSpring(rotateY, physicsConfig);
  const springRotateZ = useSpring(rotateZ, physicsConfig);

  // Titik pertemuan ujung tali lanyard pada pengait kartu (jarak vertikal dari bracket navbar)
  const strapLengthY = 140;

  // Tali lanyard kiri: Menggantung langsung dari batas Navbar (startY = 7) ke pengait kartu (endY = 138 + y)
  const strapPathLeft = useTransform([x, y], ([latestX, latestY]) => {
    const startX = -14;
    const startY = 7; // Keluar tepat dari slot kiri bracket navbar
    const endX = Number(latestX) || 0;
    const endY = strapLengthY - 2 + (Number(latestY) || 0);

    const dx = endX - startX;
    const dy = endY - startY;
    const midX = startX + dx * 0.42 - 5;
    const midY = startY + dy * 0.52 + 6;

    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  });

  // Tali lanyard kanan: Menggantung langsung dari batas Navbar (startY = 7) ke pengait kartu (endY = 138 + y)
  const strapPathRight = useTransform([x, y], ([latestX, latestY]) => {
    const startX = 14;
    const startY = 7; // Keluar tepat dari slot kanan bracket navbar
    const endX = Number(latestX) || 0;
    const endY = strapLengthY - 2 + (Number(latestY) || 0);

    const dx = endX - startX;
    const dy = endY - startY;
    const midX = startX + dx * 0.42 + 5;
    const midY = startY + dy * 0.52 + 6;

    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  });

  // Posisi Y cincin logam swivel pengait di atas klip kartu
  const claspY = useTransform(y, (latestY) => strapLengthY - 3 + (Number(latestY) || 0));

  const handleFlip = useCallback(() => {
    // Hanya membalik kartu jika pengguna mengklik, bukan saat selesai menyeret (drag)
    if (!isDraggingRef.current) {
      setIsFlipped((prev) => !prev);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    },
    []
  );

  return (
    <div className="relative z-30 flex flex-col items-center pt-0 w-full max-w-lg min-h-[660px] mx-auto perspective-[2000px] select-none overflow-visible">
      {/* SVG Tali Lanyard Panjang & Fleksibel (Tersambung Langsung ke Garis Bawah Navbar) */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] h-[660px] pointer-events-none overflow-visible z-10"
        viewBox="-180 0 360 660"
      >
        <defs>
          {/* Gradien tali lanyard futuristik vertikal yang kontras dan jelas */}
          <linearGradient id="lanyardStrapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="40%" stopColor="#06b6d4" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Gradien cincin & braket logam perak krom */}
          <linearGradient id="metalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* Braket Logam Penjepit di Garis Bawah Navbar (Menempel Sempurna ke Garis Navbar) */}
        <g>
          {/* Bayangan halus ke bawah */}
          <rect x="-32" y="0" width="64" height="12" rx="3" fill="#000000" opacity="0.4" filter="blur(2px)" />
          {/* Badan Bracket Logam Chrome */}
          <rect x="-30" y="0" width="60" height="9" rx="2.5" fill="url(#metalRingGrad)" stroke="#475569" strokeWidth="1" />
          {/* Detail baut / sekrup kiri & kanan */}
          <circle cx="-18" cy="4.5" r="2" fill="#1e293b" />
          <circle cx="-18" cy="4" r="0.8" fill="#94a3b8" />
          <circle cx="18" cy="4.5" r="2" fill="#1e293b" />
          <circle cx="18" cy="4.5" r="0.8" fill="#94a3b8" />
          {/* Celah slot tali lanyard */}
          <rect x="-19" y="6.5" width="10" height="2" rx="0.5" fill="#0f172a" />
          <rect x="9" y="6.5" width="10" height="2" rx="0.5" fill="#0f172a" />
        </g>

        {/* Bayangan Tali Kiri & Kanan */}
        <motion.path
          d={strapPathLeft}
          stroke="#000000"
          strokeWidth={9}
          strokeOpacity={0.4}
          strokeLinecap="round"
          fill="none"
          style={{ filter: "blur(3px)" }}
        />
        <motion.path
          d={strapPathRight}
          stroke="#000000"
          strokeWidth={9}
          strokeOpacity={0.4}
          strokeLinecap="round"
          fill="none"
          style={{ filter: "blur(3px)" }}
        />

        {/* Tali Lanyard Kiri (Pita Panjang Cyan-Blue Glowing) */}
        <motion.path
          d={strapPathLeft}
          stroke="url(#lanyardStrapGrad)"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d={strapPathLeft}
          stroke="#ffffff"
          strokeWidth={1.3}
          strokeOpacity={0.55}
          strokeDasharray="5 3"
          fill="none"
        />

        {/* Tali Lanyard Kanan (Pita Panjang Cyan-Blue Glowing) */}
        <motion.path
          d={strapPathRight}
          stroke="url(#lanyardStrapGrad)"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d={strapPathRight}
          stroke="#ffffff"
          strokeWidth={1.3}
          strokeOpacity={0.55}
          strokeDasharray="5 3"
          fill="none"
        />

        {/* Cincin Logam Pengait Swivel (Menyatukan Ujung Tali Tepat di Klip Kartu) */}
        <motion.circle
          cx={x}
          cy={claspY}
          r={7.5}
          fill="none"
          stroke="url(#metalRingGrad)"
          strokeWidth={2.8}
        />
      </svg>

      {/* --- WRAPPER FISIKA KARTU (DRAG & SWING PLAYGROUND) --- */}
      <motion.div
        style={{
          x,
          y,
          rotateX: springRotateX,
          rotateY: springRotateY,
          rotateZ: springRotateZ,
          cursor: "grab",
          transformOrigin: "top center",
        }}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.65}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
        whileDrag={{ cursor: "grabbing", scale: 1.04 }}
        whileHover={{ scale: 1.015 }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Kartu Identitas Digital Interaktif. Tekan Enter untuk membalik kartu."
        className="relative flex flex-col items-center mt-[140px] preserve-3d focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-3xl touch-none will-change-transform z-20"
      >
        {/* Jepitan Logam Kartu (Metal Badge Clip) */}
        <div className="relative z-20 -mb-2">
          <div className="w-14 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-sm shadow-md border border-slate-500 flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-600 rounded-full" />
          </div>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-6 border-2 border-slate-400 rounded-t-full pointer-events-none" />
        </div>

        {/* --- WRAPPER FLIP KARTU --- */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 220, damping: 26 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-[310px] sm:w-[330px] h-[460px]"
        >
          {/* ================= DEPAN KARTU ================= */}
          <CardFront profile={profile} onFlip={handleFlip} />

          {/* ================= BELAKANG KARTU ================= */}
          <CardBack profile={profile} onFlip={handleFlip} />
        </motion.div>
      </motion.div>

      {/* Interactive Helper Hint (Di bawah kartu agar rapi dan tidak mengganggu tali) */}
      <div
        className="mt-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111c34]/80 border border-cyan-500/20 text-xs text-slate-300 backdrop-blur-md shadow-md animate-fade-in hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors cursor-pointer z-30"
        onClick={handleFlip}
      >
      </div>
    </div>
  );
}

// Sub-Komponen: Depan Kartu
const CardFront = memo(({ profile, onFlip }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-[26px] overflow-hidden border border-cyan-500/20 bg-gradient-to-b from-[#111c34]/95 via-[#0b1325]/95 to-[#0f172a]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 select-none"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:14px_14px] pointer-events-none" />
      <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-cyan-400/5 to-transparent rotate-45 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 w-full flex justify-between items-start">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono tracking-wider">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          VERIFIED ID
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFlip?.();
          }}
          className="text-xs text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          title="Balik ke QRIS"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Photo with Glow */}
      <div className="relative z-10 flex flex-col items-center my-auto">
        <div className="relative w-32 h-32 group mb-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-inner">
            {!imgError && profile.image ? (
              <img
                src={profile.image}
                alt={profile.name || "Muhammad Syaiful Mukmin"}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover rounded-full border-2 border-slate-900 shadow-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-600 to-purple-700 flex items-center justify-center text-white font-extrabold text-3xl border-2 border-slate-900 shadow-lg">
                SM
              </div>
            )}
          </div>
          <div className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-md" title="Active" />
        </div>

        {/* Name & Role */}
        <h2 className="text-xl font-bold text-white text-center tracking-tight mb-1.5 drop-shadow-sm">
          {profile.name || "Muhammad Syaiful Mukmin"}
        </h2>
        <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <p className="text-[11px] font-semibold tracking-wider uppercase bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-300 bg-clip-text text-transparent">
            {profile.role || "Pendidik & Web Developer"}
          </p>
        </div>
      </div>

      {/* Footer Stats Matrix */}
      <div className="relative z-10 w-full grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-3">
        <div>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Pengalaman</p>
          <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">3+ Tahun</p>
        </div>
        <div className="border-x border-white/10">
          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Proyek</p>
          <p className="text-xs font-mono font-bold text-cyan-300 mt-0.5">25+ Karya</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Status</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-emerald-400">Open</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Sub-Komponen: Belakang Kartu (QRIS & Signature)
const CardBack = memo(({ profile, onFlip }) => {
  const [qrError, setQrError] = useState(false);
  const qrisSrc = profile.qrisImage || ONLINE_QRIS_URL;

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-[26px] overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-[#0b1325] via-purple-950/80 to-[#0f172a] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between p-6 select-none"
      style={{
        transform: "rotateY(180deg)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:16px_16px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
            DUKUNGAN & PEMBAYARAN
          </span>
          <p className="text-[11px] text-slate-300 font-medium">QRIS Donasi / Project</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFlip?.();
          }}
          className="text-xs text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          title="Balik ke Depan"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* QR Code Container */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
        <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 transition-transform hover:scale-105 duration-300">
          {!qrError ? (
            <img
              src={qrisSrc}
              alt="QRIS Donasi / Pembayaran"
              onError={() => setQrError(true)}
              className="w-32 h-32 object-contain rounded-lg"
              loading="lazy"
            />
          ) : (
            <div className="w-32 h-32 flex flex-col items-center justify-center bg-gray-100 rounded-lg text-gray-800 p-2 border border-gray-300">
              <QrCode className="w-16 h-16 text-gray-700" />
              <span className="text-[8px] font-bold tracking-wider text-gray-500 mt-1 uppercase">
                QR CODE
              </span>
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-300 text-center font-medium mt-3">
          Scan QRIS melalui GoPay, OVO, Dana, BCA, atau Mobile Banking
        </p>
        <span className="text-[10px] text-cyan-400/90 mt-1">
          Terima kasih atas apresiasi & kolaborasinya ✨
        </span>
      </div>

      {/* Signature & Serial */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-slate-500">Pemilik Kartu</p>
          <p className="font-semibold text-white/90">{profile.name || "M. Syaiful Mukmin"}</p>
        </div>
        <div className="text-right font-mono">
          <p className="text-cyan-400 font-bold">DIGITAL BADGE</p>
          <p className="text-slate-500">ID: 8942-2026</p>
        </div>
      </div>
    </div>
  );
});

// --- Dynamic Flip Text ---
const FlipText = memo(({ words = [], className = "", duration = 2800 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (!words || words.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  if (!words.length) return null;

  return (
    <span className={`inline-block relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 14, rotateX: 60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -14, rotateX: -60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="inline-block font-semibold"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

// --- Komponen Utama: AboutHeader ---
function AboutHeader({ profile }) {
  const creativityWords = useMemo(
    () => ["kreativitas", "seni visual", "imajinasi", "edukasi bermakna"],
    []
  );
  const technologyWords = useMemo(
    () => ["teknologi", "kode modern", "web interaktif", "AI edukatif"],
    []
  );

  return (
    <header className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12 w-full max-w-7xl mx-auto pt-0 pb-16">
      {/* Bagian Kiri: Teks Narasi & Value Proposition */}
      <motion.div
        className="flex-1 text-center lg:text-left space-y-6 order-2 lg:order-1 relative z-10 pt-4 sm:pt-6 lg:pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
          Terbuka untuk Kolaborasi & Proyek
        </div>

        {/* Heading Greeting */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.15] tracking-tight text-white">
          Halo, Saya <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            {profile.name || "Muhammad Syaiful Mukmin"}
          </span>
        </h1>

        {/* Bio Description with Dynamic Keywords */}
        <motion.div
          className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal border-l-2 sm:border-l-4 border-cyan-500/40 pl-4 sm:pl-6 bg-[#111c34]/50 py-2 rounded-r-xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p>
            {profile.description || (
              <>
                Seorang calon pendidik dan pengembang web yang memadukan{" "}
                <FlipText words={creativityWords} className="text-cyan-300" /> dan{" "}
                <FlipText words={technologyWords} className="text-purple-300" /> untuk
                menciptakan media pembelajaran yang modern, interaktif, dan berdampak nyata.
              </>
            )}
          </p>
        </motion.div>

        {/* Quick Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs text-slate-300">
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Pendidikan Guru Madrasah (PGMI)
          </span>
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            React & Modern Web
          </span>
          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Desain Media Interaktif
          </span>
        </div>

        {/* Action CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
          <Link
            to="/cv-saya"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            Lihat Curriculum Vitae (CV)
          </Link>

          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/15 hover:border-white/30 transition-all backdrop-blur-md active:scale-95"
          >
            Jelajahi Proyek
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Bagian Kanan: Kartu Menggantung Interaktif */}
      <div className="flex-1 flex flex-col justify-start items-center order-1 lg:order-2 w-full pt-0">
        <HangingBadge profile={profile} />
      </div>
    </header>
  );
}

export default memo(AboutHeader);
