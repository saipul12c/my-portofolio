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

      <h2 className="text-3xl font-bold text-white tracking-tight text-center drop-shadow-lg">
        {profile.name}
      </h2>
      <div className="mt-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
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
    className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden border border-white/10 bg-[#111]/95 backdrop-blur-xl shadow-2xl"
    style={{ 
      transform: "rotateY(180deg)", 
      backfaceVisibility: "hidden" 
    }}
  >
    <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]" />
    
    <div className="relative z-10 flex flex-col h-full p-8 justify-between">
      <div className="absolute top-8 left-0 w-full h-12 bg-[#222] border-y border-white/5" />

      <div className="mt-16 w-full">
        <p className="text-[10px] text-gray-500 uppercase mb-1">Authorized Signature</p>
        <div className="w-full h-10 bg-white/10 rounded flex items-center px-2 font-script text-gray-400 text-xl italic select-none">
          {profile.name}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-32 h-32 bg-white p-2 rounded-lg">
          <div className="w-full h-full bg-black grid grid-cols-4 gap-1 p-1">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} 
              />
            ))}
            <div className="absolute top-2 left-2 w-8 h-8 border-4 border-black bg-white" />
            <div className="absolute top-2 right-2 w-8 h-8 border-4 border-black bg-white" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-black bg-white" />
          </div>
        </div>
        <p className="text-[10px] text-gray-500 text-center max-w-[150px]">
          Scan to view portfolio or contact directly.
        </p>
      </div>

      <div className="text-center">
        <p className="font-mono text-xs text-gray-600 tracking-[0.3em]">
          ID: 8942-2024-DEV
        </p>
      </div>
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
          <button className="group px-8 py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
            Download CV
          </button>
          <button className="px-8 py-3.5 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
            View Projects
          </button>
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