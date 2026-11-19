// happynewyears.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  PartyPopper,
  Calendar,
  Clock,
  Share2,
  X,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  Gift,
  Flame,
  Send,
  Check,
  Stars,
  Award,
  Quote,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

/* =========================================================================
   1. DATE & SEASON DETERMINATION LOGIC
   Aturan:
   - Muncul setiap akhir tahun (mulai 25 Desember s.d. 31 Desember 23:59:59)
   - Muncul selama 3 hari setelah awal tahun dimulai (1, 2, dan 3 Januari 23:59:59)
   - Perhitungan targetYear otomatis dinamis selamanya:
     * Desember: targetYear = currentYear + 1 (Menyambut / Countdown)
     * Januari (1-3): targetYear = currentYear (Perayaan Tahun Baru)
     * Diluar musim (akses langsung /year-end): tetap tampil dan adaptif
   ========================================================================= */

const calculateSeasonStatus = (customDate = null) => {
  const now = customDate ? new Date(customDate) : new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth(); // 0 = Jan, 11 = Des
  const date = now.getDate();

  // Akhir Tahun: 25 Des - 31 Des (bulan 11)
  const isEndOfYear = month === 11 && date >= 25;

  // Awal Tahun: 1 Jan - 3 Jan (bulan 0)
  const isStartOfYear = month === 0 && date <= 3;

  const isSeason = isEndOfYear || isStartOfYear;

  let targetYear = currentYear;
  let phase = 'CELEBRATION';

  if (isEndOfYear) {
    targetYear = currentYear + 1;
    phase = 'COUNTDOWN';
  } else if (isStartOfYear) {
    targetYear = currentYear;
    phase = 'CELEBRATION';
  } else {
    // Di luar periode resmi (misal halaman diakses di pertengahan tahun)
    targetYear = month >= 6 ? currentYear + 1 : currentYear;
    phase = month >= 6 ? 'COUNTDOWN' : 'CELEBRATION';
  }

  return {
    now,
    currentYear,
    targetYear,
    isEndOfYear,
    isStartOfYear,
    isSeason,
    phase,
    dayOfNewYear: isStartOfYear ? date : (month === 0 ? date : null)
  };
};

/* =========================================================================
   2. SYNTHETIC AUDIO CHIMES (WEB AUDIO API - 100% RELIABLE & CLIENT SAFE)
   ========================================================================= */

let sharedAudioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

const playChimeNote = (freq, duration = 0.6, type = 'sine', volume = 0.12) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors gracefully
  }
};

const playHarmonicChord = () => {
  // Nada pentatonik merdu (C5, E5, G5, B5, C6)
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playChimeNote(freq, 0.7, 'triangle', 0.1);
    }, idx * 90);
  });
};

/* =========================================================================
   3. KARTU HARAPAN & UCAPAN
   ========================================================================= */

const WISH_CARDS = [
  {
    id: 'career',
    title: 'Karier & Karya Cemerlang',
    icon: '🌟',
    badge: 'Prestasi & Karya',
    color: 'from-amber-400 to-yellow-600',
    border: 'border-amber-400/50',
    bg: 'bg-amber-950/30',
    quote:
      'Semoga setiap ide kreatif, usaha, dan kerja kerasmu berbuah karya nyata yang diakui luas, membawa lonjakan karier serta reputasi yang gemilang.'
  },
  {
    id: 'wealth',
    title: 'Rezeki & Keberlimpahan',
    icon: '💎',
    badge: 'Berkah Finansial',
    color: 'from-emerald-400 to-teal-600',
    border: 'border-emerald-400/50',
    bg: 'bg-emerald-950/30',
    quote:
      'Pintu-pintu rezeki yang halal, berkah, dan tak terduga semoga terbuka lebar untukmu dan keluargamu, memberikan ketenangan dan kemakmuran hakiki.'
  },
  {
    id: 'health',
    title: 'Kesehatan & Ketenangan Jiwa',
    icon: '🌿',
    badge: 'Wellness & Kedamaian',
    color: 'from-cyan-400 to-blue-600',
    border: 'border-cyan-400/50',
    bg: 'bg-cyan-950/30',
    quote:
      'Diberikan raga yang senantiasa bugar, pikiran yang jernih, serta hati yang lapang dan damai untuk menikmati setiap detik perjalanan hidup ini.'
  },
  {
    id: 'growth',
    title: 'Pertumbuhan & Keberanian',
    icon: '🚀',
    badge: 'Mental Juara',
    color: 'from-purple-400 to-indigo-600',
    border: 'border-purple-400/50',
    bg: 'bg-purple-950/30',
    quote:
      'Semoga setiap tantangan yang hadir menjadi batu pijakan emas yang melipatgandakan ketangguhan dan membimbingmu menuju versi terbaik dirimu.'
  },
  {
    id: 'harmony',
    title: 'Harmoni & Relasi Hangat',
    icon: '🤝',
    badge: 'Cinta & Persahabatan',
    color: 'from-pink-400 to-rose-600',
    border: 'border-pink-400/50',
    bg: 'bg-pink-950/30',
    quote:
      'Senantiasa dikelilingi oleh sahabat dan orang-orang terkasih yang tulus mendukung, saling menguatkan di kala sulit, dan bersorak bersama saat sukses.'
  },
  {
    id: 'blessing',
    title: 'Keberkahan & Harapan Terwujud',
    icon: '✨',
    badge: 'Doa Mustajab',
    color: 'from-amber-300 to-orange-500',
    border: 'border-amber-300/50',
    bg: 'bg-amber-950/30',
    quote:
      'Semoga semua resolusi, niat baik, dan doa-doa tulus yang kamu panjatkan di sepertiga malam didengar dan dikabulkan pada waktu yang paling indah.'
  }
];

const QUICK_REACTIONS = [
  { emoji: '🎉', label: 'Selamat!', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  { emoji: '✨', label: 'Aamiin Ya Allah', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { emoji: '🚀', label: 'Gas 365 Hari!', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { emoji: '💖', label: 'Terima Kasih!', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { emoji: '🔥', label: 'Makin Sukses!', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { emoji: '👏', label: 'Keren Banget', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
];

/* =========================================================================
   4. CANVASES & FIREWORKS SIMULATOR ENGINE (HIGH FPS & INTERACTIVE)
   ========================================================================= */

const FireworksCanvas = ({ soundEnabled }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const rockets = [];

    const PALETTES = [
      ['#FFD700', '#FFA500', '#FF4500', '#FFF8DC'], // Gold
      ['#00FFFF', '#00BFFF', '#1E90FF', '#E0FFFF'], // Cyan/Blue
      ['#FF1493', '#FF69B4', '#DA70D6', '#FFF0F5'], // Pink/Rose
      ['#7CFC00', '#00FF7F', '#32CD32', '#F0FFF0'], // Emerald/Green
      ['#BA55D3', '#9370DB', '#8A2BE2', '#E6E6FA']  // Purple
    ];

    class Particle {
      constructor(x, y, color, speed, angle, friction = 0.95, gravity = 0.08) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = friction;
        this.gravity = gravity;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.012;
        this.size = Math.random() * 2.8 + 1.2;
        this.flicker = Math.random() > 0.4;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.985;
      }

      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.beginPath();
        c.arc(this.x, this.y, Math.max(0.6, this.size), 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = this.flicker ? 12 : 6;
        c.shadowColor = this.color;
        c.fill();
        c.restore();
      }
    }

    class Rocket {
      constructor(targetX, targetY) {
        this.x = targetX ? targetX + (Math.random() * 80 - 40) : Math.random() * width;
        this.y = height + 10;
        this.targetX = targetX || Math.random() * (width * 0.8) + width * 0.1;
        this.targetY = targetY || Math.random() * (height * 0.45) + height * 0.1;
        const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        this.speed = Math.max(9, Math.min(16, distance / 40));
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        this.color = this.palette[0];
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 0.8 });
        if (this.trail.length > 5) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;

        // Cek jika sudah dekat sasaran
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        return dist < 18 || this.vy >= 0 || this.y <= this.targetY;
      }

      explode() {
        const count = Math.floor(Math.random() * 35) + 40;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2 - 0.1);
          const speed = Math.random() * 5.5 + 1.5;
          const color = this.palette[Math.floor(Math.random() * this.palette.length)];
          particles.push(new Particle(this.x, this.y, color, speed, angle));
        }

        if (soundEnabled) {
          playChimeNote(Math.random() * 400 + 400, 0.35, 'sine', 0.08);
        }
      }

      draw(c) {
        c.save();
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          c.globalAlpha = (i + 1) / this.trail.length * 0.6;
          c.beginPath();
          c.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          c.fillStyle = '#FFA500';
          c.fill();
        }
        c.globalAlpha = 1;
        c.beginPath();
        c.arc(this.x, this.y, 2.8, 0, Math.PI * 2);
        c.fillStyle = '#FFFFFF';
        c.shadowBlur = 8;
        c.shadowColor = '#FFD700';
        c.fill();
        c.restore();
      }
    }

    // Auto launcher berkala
    let lastLaunch = 0;
    const loop = (timestamp) => {
      // Background fade agar ada jejak cahaya lembut
      ctx.fillStyle = 'rgba(5, 7, 18, 0.22)';
      ctx.fillRect(0, 0, width, height);

      if (timestamp - lastLaunch > 1200 && rockets.length < 5) {
        rockets.push(new Rocket());
        lastLaunch = timestamp;
      }

      // Update & render rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        const reached = r.update();
        r.draw(ctx);
        if (reached) {
          r.explode();
          rockets.splice(i, 1);
        }
      }

      // Update & render particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.size <= 0.3) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Click anywhere to launch to cursor
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rockets.push(new Rocket(x, y));
    };

    canvas.addEventListener('pointerdown', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('pointerdown', handleClick);
      }
    };
  }, [soundEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-0"
      title="Klik di mana saja untuk meluncurkan kembang api!"
    />
  );
};

/* =========================================================================
   5. KOMPONEN UTAMA KONTEN UCAPAN TAHUN BARU
   ========================================================================= */

export const HappyNewYearsContent = ({
  onClose,
  isStandalonePage = false
}) => {
  const [activeTab, setActiveTab] = useState('letter'); // 'letter', 'wishes', 'resolution', 'countdown'
  const [selectedWish, setSelectedWish] = useState(WISH_CARDS[0]);
  const [isFlippingWish, setIsFlippingWish] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [visitorReaction, setVisitorReaction] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [resolutionInput, setResolutionInput] = useState('');
  const [savedResolution, setSavedResolution] = useState('');
  const [resolutionCopied, setResolutionCopied] = useState(false);

  // Status musim & tahun (otomatis 100%)
  const season = useMemo(() => {
    return calculateSeasonStatus();
  }, []);

  const targetYear = season.targetYear;
  const isCountdown = season.phase === 'COUNTDOWN';

  // Live countdown timer untuk menyambut tahun baru
  const [timeLeft, setTimeLeft] = useState(() => {
    const epoch = new Date(targetYear, 0, 1, 0, 0, 0).getTime();
    const diff = Math.max(0, epoch - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isPassed: diff <= 0
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const epoch = new Date(targetYear, 0, 1, 0, 0, 0).getTime();
      const diff = Math.max(0, epoch - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isPassed: diff <= 0
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetYear]);

  // Muat resolusi tersimpan dari localStorage jika ada
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`ny_res_${targetYear}`);
      if (saved) setSavedResolution(saved);
    } catch {
      // Ignore localStorage error
    }
  }, [targetYear]);

  // Efek konfeti awal saat dibuka
  const fireSalvo = useCallback(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { x: 0.15, y: 0.75 },
        colors: ['#FFD700', '#00FFFF', '#FF1493', '#FFFFFF']
      });
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { x: 0.85, y: 0.75 },
        colors: ['#FFD700', '#00FFFF', '#32CD32', '#FFA500']
      });
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fireSalvo();
    }, 500);
    return () => clearTimeout(timer);
  }, [fireSalvo]);

  // Handler suara
  const toggleSound = () => {
    if (!soundEnabled) {
      getAudioContext();
      playHarmonicChord();
      setSoundEnabled(true);
    } else {
      setSoundEnabled(false);
    }
  };

  // Pilih kartu doa acak
  const handleShuffleWish = () => {
    setIsFlippingWish(true);
    if (soundEnabled) playChimeNote(659.25, 0.3, 'sine', 0.1);

    setTimeout(() => {
      const available = WISH_CARDS.filter(c => c.id !== selectedWish.id);
      const nextCard = available[Math.floor(Math.random() * available.length)];
      setSelectedWish(nextCard);
      setIsFlippingWish(false);
      fireSalvo();
    }, 300);
  };

  // Kirim reaksi pengunjung
  const handleSendReaction = (rx) => {
    setVisitorReaction(rx.label);
    if (soundEnabled) playHarmonicChord();
    fireSalvo();

    try {
      localStorage.setItem(`ny_reaction_${targetYear}`, rx.label);
    } catch {
      // Ignore
    }
  };

  // Simpan resolusi
  const handleSaveResolution = (e) => {
    e.preventDefault();
    if (!resolutionInput.trim()) return;
    const text = resolutionInput.trim();
    setSavedResolution(text);
    setResolutionInput('');
    fireSalvo();
    if (soundEnabled) playHarmonicChord();

    try {
      localStorage.setItem(`ny_res_${targetYear}`, text);
    } catch {
      // Ignore
    }
  };

  const handleCopyResolution = () => {
    if (!savedResolution) return;
    navigator.clipboard.writeText(`✨ Resolusi Tahun ${targetYear} Saya: "${savedResolution}"`).then(() => {
      setResolutionCopied(true);
      setTimeout(() => setResolutionCopied(false), 2500);
    }).catch(() => {});
  };

  // Bagikan ucapan
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/year-end`;
    const shareText = `🎉 Selamat Menyambut Tahun Baru ${targetYear}! Simak ucapan dan doa hangat dari Muhammad Syaiful Mukmin di sini:`;

    if (navigator.share) {
      navigator.share({
        title: `Selamat Tahun Baru ${targetYear}!`,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center py-6 px-3 sm:px-6 select-none overflow-x-hidden">
      {/* Background Fireworks Simulator */}
      <FireworksCanvas soundEnabled={soundEnabled} />

      {/* Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/6 left-1/5 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/5 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto">
        <div className="relative rounded-3xl bg-slate-950/85 backdrop-blur-2xl border border-amber-400/25 shadow-[0_0_80px_rgba(251,191,36,0.18)] overflow-hidden transition-all duration-300">
          
          {/* Top Decorative Border Gradient */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400" />

          {/* Golden Corner Accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 rounded-br-xl pointer-events-none" />

          {/* Top Quick Actions Bar */}
          <div className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-5 pb-3 border-b border-white/10">
            {/* Tag Musim */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <span className="text-xs sm:text-sm font-medium tracking-wide uppercase text-amber-300/90 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {isCountdown ? 'Menghitung Mundur Akhir Tahun' : `Pekan Istimewa Tahun Baru ${targetYear}`}
              </span>
            </div>

            {/* Right Buttons: Sound & Close */}
            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white transition flex items-center gap-1.5"
                title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="hidden sm:inline text-amber-300">Suara Aktif</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-gray-400" />
                    <span className="hidden sm:inline text-gray-400">Efek Suara</span>
                  </>
                )}
              </button>

              {/* Close Button (if overlay or has onClose) */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 text-gray-400 hover:text-red-300 transition"
                  title="Tutup & Kembali ke Website"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Celebration Banner */}
          <div className="relative px-5 sm:px-10 pt-6 pb-4 text-center">
            {/* Small Glowing Pre-header */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/10 to-cyan-500/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
              <Stars className="w-4 h-4 text-amber-300" />
              <span>{isCountdown ? 'Refleksi Akhir Tahun & Sambutan Hangat' : 'Selamat Membuka Lembaran Baru'}</span>
              <Stars className="w-4 h-4 text-amber-300" />
            </div>

            {/* Giant Dynamic Year Display */}
            <div className="relative my-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]">
                  {targetYear}
                </span>
              </h1>
              <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300 tracking-wide mt-1">
                {isCountdown ? 'MENYAMBUT TAHUN BARU' : 'SELAMAT TAHUN BARU!'}
              </div>
            </div>

            {/* Dynamic Subtitle / Day Status */}
            <p className="text-xs sm:text-sm text-gray-300/90 max-w-xl mx-auto mt-2 leading-relaxed">
              {isCountdown ? (
                <span>
                  Mari kita lepas tahun ini dengan penuh rasa syukur, dan songsong tahun{' '}
                  <strong className="text-amber-300 font-bold">{targetYear}</strong> dengan keberanian, harapan, dan tekad baru.
                </span>
              ) : (
                <span>
                  Hari {season.dayOfNewYear ? `ke-${season.dayOfNewYear}` : 'awal'} dari 365 peluang emas yang siap kita taklukkan.
                  Terima kasih telah singgah di portfolio digital saya!
                </span>
              )}
            </p>

            {/* Author Credential Tag (Ucapan Dari Pemilik Untuk Pengunjung) */}
            <div className="inline-flex items-center gap-2.5 mt-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-400/40 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs sm:text-sm text-gray-300">
                Pesan Hangat dari{' '}
                <strong className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400 font-semibold">
                  Muhammad Syaiful Mukmin
                </strong>{' '}
                untuk Anda
              </span>
            </div>

            {/* Countdown Clock Widget (Khusus Mode Akhir Tahun / Hitung Mundur) */}
            {isCountdown && !timeLeft.isPassed && (
              <div className="mt-5 max-w-lg mx-auto p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-amber-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                <div className="text-xs text-amber-300/80 uppercase tracking-widest font-semibold mb-2.5 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Waktu Menuju Pergantian Tahun {targetYear}
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {[
                    { label: 'Hari', val: timeLeft.days },
                    { label: 'Jam', val: String(timeLeft.hours).padStart(2, '0') },
                    { label: 'Menit', val: String(timeLeft.minutes).padStart(2, '0') },
                    { label: 'Detik', val: String(timeLeft.seconds).padStart(2, '0') }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl py-2 px-1">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300 font-mono">
                        {item.val}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="px-5 sm:px-10 mt-3">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto max-w-2xl mx-auto">
              {[
                { id: 'letter', label: 'Surat Hangat', icon: MessageSquare },
                { id: 'wishes', label: 'Kartu Harapan', icon: Gift },
                { id: 'resolution', label: 'Ikrar & Resolusi', icon: Award },
                { id: 'countdown', label: 'Refleksi 365 Hari', icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (soundEnabled) playChimeNote(523.25, 0.2, 'sine', 0.08);
                    }}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="px-5 sm:px-10 py-5">
            {/* TAB 1: SURAT HANGAT DARI PEMILIK UNTUK PENGUNJUNG */}
            {activeTab === 'letter' && (
              <div className="relative p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-white/10 shadow-inner">
                <Quote className="w-8 h-8 text-amber-400/40 mb-3" />
                <div className="space-y-3.5 text-gray-200 text-sm sm:text-base leading-relaxed">
                  <p>
                    <span className="text-amber-300 font-bold">Halo Sahabat & Pengunjung yang Luar Biasa!</span>
                  </p>
                  <p>
                    Terima kasih yang terdalam telah meluangkan waktu berharga untuk singgah di website portfolio saya. Kehadiran Anda di sini, entah sekadar menengok karya, mencari inspirasi, mengecek proyek kolaborasi, ataupun bersilaturahmi, merupakan sebuah kehormatan besar bagi saya.
                  </p>
                  <p>
                    Tahun yang kita lalui mungkin menyimpan suka duka, tantangan terjal, dan momen pembelajaran yang tidak mudah. Namun Anda berhasil melewatinya dengan penuh keteguhan. Di gerbang tahun{' '}
                    <strong className="text-amber-300 font-semibold">{targetYear}</strong> ini, saya secara tulus mendoakan agar setiap helaan napas Anda dipenuhi energi baru, ketenangan batin, kesehatan yang paripurna, dan kelancaran rezeki yang berkah.
                  </p>
                  <p className="italic text-cyan-200/90">
                    "Mari melangkah ke lembaran baru tanpa membawa beban keraguan masa lalu. Bersiaplah menyambut cerita-cerita kemenangan baru yang sedang menanti Anda!"
                  </p>
                </div>

                {/* Signature Block */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Salam hangat & takzim,</div>
                    <div className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                      Muhammad Syaiful Mukmin
                    </div>
                    <div className="text-xs text-cyan-400/80 font-mono">Web Developer & Creator</div>
                  </div>

                  {/* Reaction Buttons */}
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-gray-400 mb-1.5">Tinggalkan Reaksi Cepat:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_REACTIONS.map((rx, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendReaction(rx)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition transform hover:scale-110 active:scale-95 flex items-center gap-1 ${
                            visitorReaction === rx.label
                              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                              : rx.color
                          }`}
                        >
                          <span>{rx.emoji}</span>
                          <span className="hidden sm:inline">{rx.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {visitorReaction && (
                  <div className="mt-3 py-2 px-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center justify-between animate-fade-in">
                    <span>Reaksi Anda: <strong>{visitorReaction}</strong> telah tersampaikan! Terima kasih banyak! ✨</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: KARTU DOA & HARAPAN INTERAKTIF */}
            {activeTab === 'wishes' && (
              <div className="space-y-4">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center justify-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400" />
                    Ambil Kartu Berkah Tahun {targetYear}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Klik tombol di bawah untuk mengundi afirmasi & doa istimewa yang didedikasikan untuk Anda!
                  </p>
                </div>

                {/* Selected Wish Card */}
                <div
                  className={`p-6 sm:p-8 rounded-2xl border ${selectedWish.border} ${selectedWish.bg} backdrop-blur-md shadow-xl transition-all duration-300 ${
                    isFlippingWish ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl sm:text-4xl">{selectedWish.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold tracking-wide uppercase border border-white/10">
                      {selectedWish.badge}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {selectedWish.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-200 italic leading-relaxed">
                    "{selectedWish.quote}"
                  </p>
                </div>

                {/* Shuffle Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleShuffleWish}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.4)] transition transform hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className={`w-4 h-4 ${isFlippingWish ? 'animate-spin' : ''}`} />
                    <span>Buka Kartu Harapan Lainnya</span>
                  </button>
                  <button
                    type="button"
                    onClick={fireSalvo}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                  >
                    <PartyPopper className="w-4 h-4 text-pink-400" />
                    <span>Tembakkan Konfeti 🎊</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: IKRAR & RESOLUSI PENGUNJUNG */}
            {activeTab === 'resolution' && (
              <div className="space-y-4">
                <div className="text-center max-w-lg mx-auto mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-amber-300 flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Ikrar & Resolusi Tahun {targetYear}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Tuliskan satu tekad atau impian terbesarmu di tahun {targetYear} sebagai janji pada dirimu sendiri!
                  </p>
                </div>

                {/* Form Input Resolusi */}
                <form onSubmit={handleSaveResolution} className="max-w-xl mx-auto space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={resolutionInput}
                      onChange={(e) => setResolutionInput(e.target.value)}
                      placeholder={`Contoh: Lebih konsisten berkarya & hidup sehat di tahun ${targetYear}...`}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                      maxLength={140}
                    />
                    <button
                      type="submit"
                      disabled={!resolutionInput.trim()}
                      className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400 text-right">
                    {resolutionInput.length}/140 karakter
                  </div>
                </form>

                {/* Saved Resolution Badge */}
                {savedResolution && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-400/40 text-center max-w-lg mx-auto relative overflow-hidden shadow-lg animate-fade-in">
                    <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1 flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      Resolusi Emas {targetYear} Terpahat
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white italic my-2">
                      "{savedResolution}"
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyResolution}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-gray-200 flex items-center gap-1.5 transition"
                      >
                        {resolutionCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Salin Resolusi</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Rekomendasi Resolusi Cepat */}
                <div className="pt-2">
                  <div className="text-xs text-gray-400 text-center mb-2">Atau pilih inspirasi cepat:</div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                    {[
                      'Rutin berolahraga & istirahat teratur',
                      'Mempelajari teknologi & skill baru',
                      'Lebih banyak bersyukur & memaafkan',
                      'Mencapai kemandirian finansial',
                      'Menuntaskan proyek impian'
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setResolutionInput(sample);
                        }}
                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-amber-300 transition"
                      >
                        + {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REFLEKSI 365 HARI */}
            {activeTab === 'countdown' && (
              <div className="space-y-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 text-center">
                  <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white">
                    365 Hari, 365 Kesempatan Emas
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mt-1 leading-relaxed">
                    Setiap fajar baru adalah kanvas kosong. Tidak peduli seberapa rumit hari kemarin, hari esok selalu menawarkan kesempatan untuk menuliskan bab terbaik dalam hidup kita.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-left max-w-lg mx-auto">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-amber-400 font-bold text-sm">Syukuri Proses</div>
                      <div className="text-xs text-gray-400 mt-1">Setiap jerih payah mendewasakan dan membentuk jati diri.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-cyan-400 font-bold text-sm">Fokus Solusi</div>
                      <div className="text-xs text-gray-400 mt-1">Fokus pada apa yang bisa diperbaiki dan diikhtiarkan.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-pink-400 font-bold text-sm">Berbagi Kebaikan</div>
                      <div className="text-xs text-gray-400 mt-1">Menjadi lentera dan penebar manfaat untuk sesama.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="px-5 sm:px-10 py-5 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Share / Copy Button */}
            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white transition flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Bagikan Ucapan Ini</span>
                </>
              )}
            </button>

            {/* Launch Fireworks Button & Proceed Button */}
            <div className="w-full sm:w-auto flex items-center gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => {
                  fireSalvo();
                  if (soundEnabled) playHarmonicChord();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 border border-amber-400/40 text-amber-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Rayakan 🎆</span>
              </button>

              {!isStandalonePage && onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-1.5 transition transform hover:scale-105 active:scale-95"
                >
                  <span>Jelajahi Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href="/"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-1.5 transition transform hover:scale-105 active:scale-95"
                >
                  <span>Buka Halaman Utama</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Sub Footer Info */}
          <div className="px-5 sm:px-10 py-3 bg-black/60 border-t border-white/5 flex items-center justify-center text-center text-[11px] text-gray-500">
            <span>
              Otomatis aktif setiap 25–31 Desember &amp; 1–3 Januari • Dibuat dengan ❤️ oleh Muhammad Syaiful Mukmin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. FLOATING FESTIVE BADGE (Ketika Popup Ditutup Selama Musim Tahun Baru)
   ========================================================================= */

const FloatingNewYearBadge = ({ onClick, targetYear }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-6 z-[9990] group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/90 border border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.35)] backdrop-blur-xl text-amber-300 hover:text-white transition-all transform hover:scale-105 active:scale-95 animate-bounce-subtle"
      title="Buka Ucapan & Pesan Tahun Baru"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
      </span>
      <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
      <span className="text-xs sm:text-sm font-bold tracking-wide">
        Tahun Baru {targetYear}
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
};

/* =========================================================================
   7. MAIN EXPORT COMPONENT: HappyNewYears
   Mendukung 2 Mode:
   - Mode Halaman Mandiri (Route: /year-end)
   - Mode Global Overlay (Muncul otomatis saat akhir tahun s.d. 3 hari awal tahun)
   ========================================================================= */

export const HappyNewYears = ({ isGlobal = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Periksa apakah sedang di browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Periksa query parameter untuk testing/preview: ?newyear=1 atau ?ny=preview
  const queryParams = useMemo(() => {
    if (!isClient) return new URLSearchParams();
    return new URLSearchParams(location.search);
  }, [location.search, isClient]);

  const forcePreviewFromUrl = queryParams.has('newyear') || queryParams.has('ny');
  const isDirectYearEndRoute = location.pathname.toLowerCase() === '/year-end';

  // Hitung status musim (otomatis 100%)
  const season = useMemo(() => {
    return calculateSeasonStatus();
  }, []);

  const targetYear = season.targetYear;

  const handleDismiss = useCallback(() => {
    setIsOpen(false);

    try {
      localStorage.setItem(`ny_greeting_dismissed_${targetYear}`, 'true');
    } catch {
      // Ignore
    }

    // Jika sedang di halaman /year-end dan pengunjung klik jelajahi portfolio, bawa ke home
    if (isDirectYearEndRoute) {
      navigate('/');
    }
  }, [targetYear, isDirectYearEndRoute, navigate]);

  // Logika pembukaan otomatis untuk pengunjung
  useEffect(() => {
    if (!isClient) return;

    const storageKey = `ny_greeting_dismissed_${targetYear}`;
    const dismissed = localStorage.getItem(storageKey);

    // Jika diakses langsung via route /year-end: selalu buka
    if (isDirectYearEndRoute) {
      setIsOpen(true);
      return;
    }

    // Jika dibuka dengan parameter preview: buka
    if (forcePreviewFromUrl) {
      setIsOpen(true);
      return;
    }

    // Jika komponen dipasang secara global dan saat ini adalah musim tahun baru:
    // (Akhir tahun 25-31 Des atau 3 hari awal tahun 1-3 Jan)
    if (season.isSeason && dismissed !== 'true') {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isClient, isDirectYearEndRoute, forcePreviewFromUrl, season.isSeason, targetYear]);

  // Kunci scroll saat popup terbuka dalam mode overlay
  useEffect(() => {
    if (!isClient) return;
    if (isOpen && !isDirectYearEndRoute) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, isDirectYearEndRoute, isClient]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!isClient) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClient, handleDismiss]);

  const handleReopen = useCallback(() => {
    setIsOpen(true);
  }, []);

  if (!isClient) return null;

  // Jika dipasang sebagai global overlay dan sedang berada di halaman /year-end,
  // biarkan rute /year-end yang merender secara mandiri
  if (isGlobal && isDirectYearEndRoute) {
    return null;
  }

  // JIKA MODE HALAMAN STANDALONE (/year-end): Render langsung di layout halaman
  if (isDirectYearEndRoute) {
    return (
      <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center">
        <HappyNewYearsContent
          isStandalonePage={true}
        />
      </main>
    );
  }

  // JIKA BUKAN MUSIM DAN BUKAN PREVIEW: Jangan render apapun
  if (!season.isSeason && !forcePreviewFromUrl) {
    return null;
  }

  // PORTAL OVERLAY UNTUK PENGUNJUNG KETIKA MEMBUKA WEBSITE
  return ReactDOM.createPortal(
    <>
      {/* Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center animate-fade-in">
          <HappyNewYearsContent
            onClose={handleDismiss}
            isStandalonePage={false}
          />
        </div>
      )}

      {/* Floating Badge jika ditutup selama musim berlangsung */}
      {!isOpen && (season.isSeason || forcePreviewFromUrl) && (
        <FloatingNewYearBadge
          onClick={handleReopen}
          targetYear={targetYear}
        />
      )}
    </>,
    document.body
  );
};

export default HappyNewYears;
