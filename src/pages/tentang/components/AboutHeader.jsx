import React, { 
  useState, 
  useEffect, 
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

// --- Sub-Komponen: Kartu Menggantung (Ultimate Physics) ---
function HangingBadge({ profile }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // --- PHYSICS ENGINE ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Optimasi: Konfigurasi spring yang lebih ringan
  const physicsConfig = useMemo(() => ({ 
    damping: 25, 
    stiffness: 90, 
    mass: 1.5 
  }), []);

  // Optimasi: Gunakan transform dengan dependency yang lebih sederhana
  const rotateX = useTransform(y, [-100, 100], [25, -25]);
  const rotateY = useTransform(x, [-100, 100], [-25, 25]);

  const springRotateX = useSpring(rotateX, physicsConfig);
  const springRotateY = useSpring(rotateY, physicsConfig);

  // Optimasi: Gunakan useCallback untuk mencegah recreasi function
  const flipAnimation = useMemo(() => ({
    rotateY: isFlipped ? 180 : 0,
    transition: { 
      duration: 0.5, 
      type: "spring", 
      stiffness: 200, 
      damping: 25 
    },
  }), [isFlipped]);

  // Optimasi: Debounce hover events
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // Optimasi: Efek yang lebih efisien dengan cleanup
  useEffect(() => {
    if (isHovered) {
      timerRef.current = setTimeout(() => {
        setIsFlipped(prev => !prev);
      }, 5000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isHovered]);

  // Optimasi: Preload image
  useEffect(() => {
    if (profile.image) {
      const img = new Image();
      img.src = profile.image;
    }
  }, [profile.image]);

  return (
    <div className="relative z-50 flex justify-center items-start pt-12 w-full h-[550px] perspective-[2000px]">
      {/* --- WRAPPER FISIKA (DRAG & SWING) --- */}
      <motion.div
        style={{
          x,
          y,
          rotateX: springRotateX,
          rotateY: springRotateY,
          cursor: "grab",
          transformOrigin: "top center",
        }}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.08}
        whileDrag={{ cursor: "grabbing" }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleFlip}
        className="relative flex flex-col items-center preserve-3d"
      >
        {/* Tali Gantungan */}
        <div className="absolute -top-[600px] bottom-[100%] w-[2px] bg-gradient-to-b from-gray-800 via-gray-500 to-gray-700 shadow-sm" />

        {/* Jepitan Besi */}
        <div className="relative z-20 -mb-3">
          <div className="w-12 h-4 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-sm shadow-md border border-gray-500" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 border-2 border-gray-400 rounded-t-full" />
        </div>

        {/* --- WRAPPER FLIP --- */}
        <motion.div
          animate={flipAnimation}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-[320px] h-[440px]"
        >
          {/* ================= DEPAN KARTU ================= */}
          <CardFront profile={profile} />
          
          {/* ================= BELAKANG KARTU ================= */}
          <CardBack profile={profile} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Optimasi: Pisahkan komponen kartu untuk mengurangi rerender
const CardFront = memo(({ profile }) => (
  <div
    className="absolute inset-0 w-full h-full backface-hidden rounded-[28px] overflow-hidden border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]"
    style={{ backfaceVisibility: "hidden" }}
  >
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
    <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 pointer-events-none animate-[shine_5s_infinite_linear]" />

    <div className="relative z-10 flex flex-col items-center h-full p-6">
      <div className="w-full flex justify-between items-start mb-8">
        <div className="h-6 w-6 bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-xs text-white/50">⚡</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-cyan-400/80 tracking-[0.2em]">SECURE ID</span>
          <span className="text-[8px] text-gray-500">Valid thru 2026</span>
        </div>
      </div>

      <div className="relative mb-6 w-36 h-36 group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-b from-white/10 to-transparent">
          <img
            src={profile.image || "https://github.com/shadcn.png"}
            alt={profile.name}
            className="w-full h-full object-cover rounded-full border-2 border-black/50 shadow-inner"
            loading="lazy"
          />
        </div>
      </div>

      {/* Perbaikan: Ukuran font nama dikurangi menjadi text-xl dan penyesuaian margin */}
      <h2 className="text-xl font-bold text-white tracking-tight text-center drop-shadow-lg mb-3">
        {profile.name}
      </h2>
      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
        <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 tracking-widest uppercase">
          Full Stack Developer
        </p>
      </div>

      <div className="mt-auto w-full grid grid-cols-3 gap-2 text-center border-t border-white/5 pt-4">
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Exp</p>
          <p className="text-sm font-mono text-gray-200">3Y+</p>
        </div>
        <div className="border-x border-white/5">
          <p className="text-[10px] text-gray-500 uppercase">Projects</p>
          <p className="text-sm font-mono text-gray-200">20+</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Status</p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const CardBack = memo(({ profile }) => (
  <div
    className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl shadow-2xl"
    style={{ 
      transform: "rotateY(180deg)", 
      backfaceVisibility: "hidden" 
    }}
  >
    {/* Background pattern yang lebih modern */}
    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px]" />
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent" />
    
    <div className="relative z-10 flex flex-col h-full p-6 justify-between">
      {/* Header dengan garis elegan */}
      <div className="text-center border-b border-white/10 pb-4 mb-4">
        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.3em] mb-1">
          AUTHORIZED SIGNATURE
        </h3>
        <div className="w-full h-8 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded flex items-center justify-center">
          <p className="text-lg font-bold text-white/90 tracking-wider">
            {profile.name}
          </p>
        </div>
      </div>

      {/* QRIS Section dengan desain yang lebih rapi */}
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <div className="bg-white p-3 rounded-xl shadow-2xl border border-white/20">
          <img 
            src={profile.qrisImage || "/images/qris-default.jpg"} 
            alt="QRIS Payment"
            className="w-28 h-28 object-cover rounded-lg"
          />
        </div>
        <div className="text-center space-y-1">
          <p className="text-[10px] text-gray-400 leading-tight max-w-[140px]">
            Scan QRIS untuk donasi atau pembayaran
          </p>
          <p className="text-[9px] text-gray-500 mt-2">
            Support my work and projects
          </p>
        </div>
      </div>

      {/* Footer dengan ID */}
      <div className="text-center pt-4 border-t border-white/5">
        <p className="font-mono text-xs text-gray-500 tracking-[0.3em]">
          8942 • 2024 • DEV
        </p>
        <p className="text-[9px] text-gray-600 mt-1">
          DIGITAL IDENTITY CARD
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-3 left-3 w-6 h-6 border-2 border-white/10 rounded-full"></div>
      <div className="absolute top-3 right-3 w-4 h-4 border border-white/10 rounded-full"></div>
    </div>
  </div>
));

// --- Komponen Text Generate Effect ---
const TextGenerateEffect = memo(({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={className}>
      {isVisible ? children : null}
    </span>
  );
});

// --- Komponen Flip Text ---
const FlipText = memo(({ words, className = "", duration = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className={`inline-block relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: -90 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

// --- Komponen Utama ---
function AboutHeader({ profile }) {
  const creativityWords = useMemo(() => ["kreativitas", "seni", "imajinasi", "inovasi"], []);
  const technologyWords = useMemo(() => ["teknologi", "kode", "digital", "AI"], []);

  // Handler untuk download CV
  const handleDownloadCV = useCallback(() => {
    window.open('/cv-saya', '_blank');
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 w-full max-w-7xl mx-auto px-4 pt-10 pb-32">
      {/* Bagian Kiri: Teks Deskripsi */}
      <motion.div
        className="flex-1 text-center lg:text-left space-y-8 order-2 lg:order-1 relative z-10 pl-0 lg:pl-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Open for Collaboration
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
          Hello, I'm <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            {profile.name}
          </span>
        </h1>

        <motion.p 
          className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light border-l-4 border-cyan-500/30 pl-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <TextGenerateEffect>
            Seorang pendidik & developer yang menggabungkan{" "}
            <FlipText words={creativityWords} className="text-cyan-300 font-medium" />{" "}
            dan{" "}
            <FlipText words={technologyWords} className="text-purple-300 font-medium" />
            . Berfokus menciptakan pengalaman digital yang interaktif dan bermakna.
          </TextGenerateEffect>
        </motion.p>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
          {/* Perubahan: Tombol Download CV membuka halaman baru dengan route /cv-saya */}
          <button 
            onClick={handleDownloadCV}
            className="group px-8 py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
          >
            Download CV
          </button>
          
          {/* Perubahan: Tombol View Projects menggunakan Link ke route /projects */}
          <Link 
            to="/projects"
            className="px-8 py-3.5 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            View Projects
          </Link>
        </div>
      </motion.div>

      {/* Bagian Kanan: Kartu Menggantung */}
      <div className="flex-1 flex justify-center items-start order-1 lg:order-2 min-h-[500px] w-full">
        <HangingBadge profile={profile} />
      </div>
    </div>
  );
}

export default memo(AboutHeader);