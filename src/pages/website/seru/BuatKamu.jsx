import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart, X, Circle, Volume2, VolumeX, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

/* ============================================================
   CONFIG — ubah bagian ini saja untuk personalisasi
   ============================================================ */
const CONFIG = {
  recipientName: 'Kamu',
  startDate: '2023-02-14T00:00:00', // tanggal jadian (ISO)
  musicSrc: '/music/romantic.mp3',  // taruh di public/music/
  clickSoundSrc: '/sounds/click.mp3',
  photos: [
    {
      src: 'https://images.unsplash.com/photo-1522673607200-164d1b3ce5c1?w=800',
      caption: 'Momen pertama kita 📸',
    },
    {
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
      caption: 'Kamu cantik banget di sini 🌸',
    },
    {
      src: 'https://images.unsplash.com/photo-1502526272922-0acc7fa6dc41?w=800',
      caption: 'Ketawa bareng kamu 😂',
    },
    {
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
      caption: 'Selalu ada kamu di setiap momen',
    },
    {
      src: 'https://images.unsplash.com/photo-1516589091389-5a0b81d2c2da?w=800',
      caption: 'Aku sayang kamu 💖',
    },
  ],
  loveLetter: `Hai sayang,

aku ngga tau harus mulai dari mana, tapi yang pasti: terima kasih sudah ada di hidupku.

Setiap hari bersamamu itu hadiah — bahkan di hari yang berat, kamu selalu bikin semuanya terasa ringan.

Aku sayang kamu, hari ini, besok, dan selamanya. ❤️`,
};

/* ============================================================
   Step constants
   ============================================================ */
const STEPS = {
  LOVE_MODE: 1,
  TIC_TAC_TOE: 2,
  WIN_MESSAGE: 3,
  LOADING: 4,
  FINAL: 5,
};

/* ============================================================
   Helpers
   ============================================================ */
const checkWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

/* ============================================================
   Sub-components
   ============================================================ */
const Typewriter = ({ text, speed = 35, skipAnimation = false, className = '' }) => {
  const [shown, setShown] = useState(skipAnimation ? text : '');
  const [done, setDone] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, skipAnimation]);

  return (
    <p className={className}>
      {shown}
      {!done && <span className="animate-pulse">|</span>}
    </p>
  );
};

const FloatingHearts = ({ count = 14 }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-500/20"
          style={{ left: `${(i * 7 + 3) % 100}vw` }}
          initial={{ y: '110vh' }}
          animate={{ y: '-10vh', rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 10 + (i % 5) * 2,
            repeat: Infinity,
            delay: (i % 7) * 0.9,
            ease: 'linear',
          }}
        >
          <Heart size={12 + (i % 5) * 6} />
        </motion.div>
      ))}
    </div>
  );
};

const PhotoCarousel = ({ photos, current, onNext, onPrev, onSelect, shouldReduceMotion }) => {
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) onNext();
    else if (diff < -50) onPrev();
  };

  return (
    <div
      className="relative w-full max-w-md mb-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden rounded-xl shadow-2xl bg-black/30">
        <motion.img
          key={current}
          src={photos[current].src}
          alt={photos[current].caption || `Foto ${current + 1}`}
          initial={shouldReduceMotion ? false : { opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-64 object-cover select-none"
          draggable={false}
        />
      </div>

      <button
        onClick={onPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        aria-label="Foto sebelumnya"
      >
        ❮
      </button>
      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        aria-label="Foto berikutnya"
      >
        ❯
      </button>

      <p className="text-center text-pink-200 text-sm italic mt-3 min-h-[1.25rem]">
        {photos[current].caption}
      </p>

      <div className="flex gap-2 mt-2 justify-center" role="tablist" aria-label="Pilih foto">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Ke foto ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition ${i === current ? 'bg-pink-400 scale-125' : 'bg-white/30 hover:bg-white/60'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   Main Component
   ============================================================ */
const BuatKamu = () => {
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(STEPS.LOVE_MODE);
  const [loveMode, setLoveMode] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameMessage, setGameMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [elapsed, setElapsed] = useState(
    () => Date.now() - new Date(CONFIG.startDate).getTime()
  );

  const botTimeoutRef = useRef(null);
  const progressFinalTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  /* ---------- Sound helpers ---------- */
  const playSound = useCallback((src) => {
    if (!src) return;
    try {
      const a = new Audio(src);
      a.volume = 0.35;
      a.play().catch(() => { });
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) {
      a.pause();
      setMusicOn(false);
    } else {
      a.play().then(() => setMusicOn(true)).catch(() => { });
    }
  };

  /* ---------- Bot move ---------- */
  const makeBotMove = useCallback((currentBoard) => {
    const empty = currentBoard
      .map((cell, i) => (cell === null ? i : null))
      .filter((i) => i !== null);
    if (empty.length === 0) return;

    // Bot "pura-pura bodoh": pilih acak, tapi hindari langkah yang membuatnya menang.
    const shuffled = [...empty].sort(() => Math.random() - 0.5);
    let chosen = shuffled[0];
    for (const idx of shuffled) {
      const test = [...currentBoard];
      test[idx] = 'O';
      if (checkWinner(test) !== 'O') {
        chosen = idx;
        break;
      }
    }

    const newBoard = [...currentBoard];
    newBoard[chosen] = 'O';
    setBoard(newBoard);
  }, []);

  /* ---------- User tile click ---------- */
  const handleTileClick = (index) => {
    if (step !== STEPS.TIC_TAC_TOE) return;
    if (board[index] || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    playSound(CONFIG.clickSoundSrc);

    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

    if (checkWinner(newBoard) === 'X') return;
    if (!newBoard.includes(null)) return;

    botTimeoutRef.current = setTimeout(() => makeBotMove(newBoard), 500);
  };

  /* ---------- Detect game result (fix: handle draw & O-win) ---------- */
  useEffect(() => {
    if (step !== STEPS.TIC_TAC_TOE) return;

    const winner = checkWinner(board);
    const isFull = !board.includes(null);

    if (winner === 'X') {
      setGameMessage('Yeay! Kamu menang 🎉');
      const t = setTimeout(() => setStep(STEPS.WIN_MESSAGE), 1200);
      return () => clearTimeout(t);
    }

    if (winner === 'O' || (isFull && !winner)) {
      setGameMessage(
        winner === 'O'
          ? 'Aku menang! Tapi kamu tetap menang di hatiku ❤️'
          : 'Seri! Coba lagi ya ❤️'
      );
      const t = setTimeout(() => {
        setBoard(Array(9).fill(null));
        setGameMessage('');
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [board, step]);

  /* ---------- Cleanup bot timeout saat step berubah ---------- */
  useEffect(
    () => () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    },
    [step]
  );

  /* ---------- Loading progress ---------- */
  useEffect(() => {
    if (step !== STEPS.LOADING) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== STEPS.LOADING || progress < 100) return;
    progressFinalTimeoutRef.current = setTimeout(() => setStep(STEPS.FINAL), 800);
    return () => {
      if (progressFinalTimeoutRef.current) clearTimeout(progressFinalTimeoutRef.current);
    };
  }, [step, progress]);

  /* ---------- Confetti di step FINAL ---------- */
  useEffect(() => {
    if (step !== STEPS.FINAL || shouldReduceMotion) return;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff69b4', '#ffffff'],
    });
    const t = setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#ff0000', '#ff69b4'],
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#ff0000', '#ff69b4'],
      });
    }, 200);

    return () => clearTimeout(t);
  }, [step, shouldReduceMotion]);

  /* ---------- Live counter (hari/jam/menit/detik) ---------- */
  useEffect(() => {
    if (step !== STEPS.FINAL) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - new Date(CONFIG.startDate).getTime());
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  /* ---------- Photo navigation ---------- */
  const nextPhoto = () =>
    setCurrentPhotoIndex((p) => (p + 1) % CONFIG.photos.length);
  const prevPhoto = () =>
    setCurrentPhotoIndex((p) => (p - 1 + CONFIG.photos.length) % CONFIG.photos.length);

  /* ---------- Reset ---------- */
  const resetToStart = () => {
    setStep(STEPS.LOVE_MODE);
    setLoveMode(false);
    setBoard(Array(9).fill(null));
    setGameMessage('');
    setProgress(0);
    setCurrentPhotoIndex(0);
    setLetterOpen(false);
    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    if (progressFinalTimeoutRef.current) clearTimeout(progressFinalTimeoutRef.current);
  };

  /* ---------- Derived ---------- */
  const days = Math.floor(elapsed / 86_400_000);
  const hours = Math.floor((elapsed % 86_400_000) / 3_600_000);
  const minutes = Math.floor((elapsed % 3_600_000) / 60_000);
  const seconds = Math.floor((elapsed % 60_000) / 1000);

  /* ---------- Render ---------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#0f0510] text-white flex items-center justify-center font-sans overflow-hidden px-4 py-8">
      {/* Audio background */}
      <audio ref={audioRef} src={CONFIG.musicSrc} loop preload="auto" />

      {/* Background floating hearts */}
      <FloatingHearts />

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition"
        aria-label={musicOn ? 'Matikan musik' : 'Nyalakan musik'}
      >
        {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Love Mode Switch */}
        {step === STEPS.LOVE_MODE && (
          <motion.div
            key="step1"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 bg-white/5 p-8 sm:p-12 rounded-3xl border border-white/10 text-center backdrop-blur-sm"
          >
            <Heart
              className={`mx-auto mb-4 w-16 h-16 transition-colors ${loveMode ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
            />
            <h1 className="text-2xl font-bold mb-6">Love mode</h1>

            <div
              onClick={() => {
                if (loveMode) return;
                setLoveMode(true);
                playSound(CONFIG.clickSoundSrc);
                if (audioRef.current && !musicOn) {
                  audioRef.current
                    .play()
                    .then(() => setMusicOn(true))
                    .catch(() => { });
                }
                setTimeout(() => setStep(STEPS.TIC_TAC_TOE), 1000);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (loveMode) return;
                  setLoveMode(true);
                  setTimeout(() => setStep(STEPS.TIC_TAC_TOE), 1000);
                }
              }}
              role="switch"
              aria-checked={loveMode}
              tabIndex={0}
              className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors ${loveMode ? 'bg-red-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                layout
                className="bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center"
              >
                <Heart size={14} className={loveMode ? 'text-red-500' : 'text-gray-300'} />
              </motion.div>
              <span className="ml-2 text-xs font-bold uppercase">
                {loveMode ? 'ON' : 'OFF'}
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Tic Tac Toe */}
        {step === STEPS.TIC_TAC_TOE && (
          <motion.div
            key="step2"
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 text-center"
          >
            <h2 className="text-xl mb-1">Let's play a little game...</h2>
            <p className="text-gray-400 text-sm mb-6 italic">Klik kotak untuk menaruh X</p>

            <div className="grid grid-cols-3 gap-2 bg-white/5 p-3 sm:p-4 rounded-xl mx-auto w-fit">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  aria-label={`Kotak ${i + 1} ${cell ? `berisi ${cell}` : 'kosong'}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  {cell === 'X' && <X size={36} className="text-blue-400" />}
                  {cell === 'O' && <Circle size={32} className="text-red-400" />}
                </button>
              ))}
            </div>

            <p
              aria-live="polite"
              className="text-pink-300 text-sm mt-4 min-h-[1.25rem] italic"
            >
              {gameMessage}
            </p>
          </motion.div>
        )}

        {/* STEP 3 — Win message */}
        {step === STEPS.WIN_MESSAGE && (
          <motion.div
            key="step3"
            initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 text-center"
          >
            <h2 className="text-2xl mb-2 italic">Kamu Memenangkan</h2>
            <div className="flex justify-center gap-4 my-8">
              <Heart className="fill-red-500 text-red-500 w-12 h-12 animate-bounce" />
            </div>
            <h2 className="text-2xl italic font-serif">Hatiku</h2>
            <button
              onClick={() => setStep(STEPS.LOADING)}
              className="mt-8 px-6 py-2 bg-red-500 rounded-full text-sm font-bold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Lanjut? ❤️
            </button>
          </motion.div>
        )}

        {/* STEP 4 — Loading */}
        {step === STEPS.LOADING && (
          <motion.div
            key="step4"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center w-64"
          >
            <Heart className="mx-auto mb-4 text-red-500 fill-red-500 animate-pulse" size={48} />
            <div className="text-5xl font-bold mb-2" aria-live="polite">
              {progress}%
            </div>
            <p className="text-gray-400 text-sm mb-4 italic">Love Intensity</p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-pink-500 h-full"
                initial={shouldReduceMotion ? { width: `${progress}%` } : { width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 5 — Final */}
        {step === STEPS.FINAL && (
          <motion.div
            key="step5"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl"
          >
            <motion.h1
              initial={shouldReduceMotion ? false : { scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-lg text-center"
            >
              Happy Valentine's Day! 🌹
            </motion.h1>

            <p className="text-pink-200 mb-6 text-center text-sm sm:text-base">
              Kita sudah bersama selama <b>{days.toLocaleString('id-ID')}</b> hari,{' '}
              <b>{hours}</b> jam, <b>{minutes}</b> menit, <b>{seconds}</b> detik 💞
            </p>

            <PhotoCarousel
              photos={CONFIG.photos}
              current={currentPhotoIndex}
              onNext={nextPhoto}
              onPrev={prevPhoto}
              onSelect={setCurrentPhotoIndex}
              shouldReduceMotion={shouldReduceMotion}
            />

            {/* Envelope / surat cinta */}
            <div className="w-full max-w-md mt-2 mb-6">
              {!letterOpen ? (
                <button
                  onClick={() => setLetterOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-xl hover:bg-red-500/30 transition"
                >
                  <Mail size={18} />
                  <span className="text-sm font-semibold">Buka surat cinta 💌</span>
                </button>
              ) : (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 text-sm sm:text-base"
                >
                  <Typewriter
                    text={CONFIG.loveLetter}
                    skipAnimation={shouldReduceMotion}
                    className="whitespace-pre-line leading-relaxed text-pink-100"
                  />
                </motion.div>
              )}
            </div>

            <button
              onClick={resetToStart}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors border border-white/20"
            >
              Ulang dari awal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuatKamu;