import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Step constants for clarity
const STEPS = {
  LOVE_MODE: 1,
  TIC_TAC_TOE: 2,
  WIN_MESSAGE: 3,
  LOADING: 4,
  FINAL: 5,
};

const BuatKamu = () => {
  const [step, setStep] = useState(STEPS.LOVE_MODE);
  const [loveMode, setLoveMode] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [progress, setProgress] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const botTimeoutRef = useRef(null);

  // ---------- Helper: check winner in Tic‑Tac‑Toe ----------
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // 'X' or 'O'
      }
    }
    return null;
  };

  // ---------- Tic‑Tac‑Toe logic ----------
  const handleTileClick = (index) => {
    if (step !== STEPS.TIC_TAC_TOE || board[index] || checkWinner(board)) return;

    // User move (X)
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    // Clear any pending bot move
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
    }

    // Bot moves after a short delay if the game isn't over
    if (!checkWinner(newBoard) && newBoard.includes(null)) {
      botTimeoutRef.current = setTimeout(() => makeBotMove(newBoard), 500);
    }
  };

  // Bot that intentionally plays poorly – picks a random empty cell
  const makeBotMove = (currentBoard) => {
    const emptyIndices = currentBoard
      .map((cell, i) => (cell === null ? i : null))
      .filter(i => i !== null);

    if (emptyIndices.length === 0) return;

    // Choose a random empty cell (no strategy – user can easily win)
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
  };

  // Watch for winner – advance to step 3 when user (X) wins
  useEffect(() => {
    if (step === STEPS.TIC_TAC_TOE && checkWinner(board) === 'X') {
      const timer = setTimeout(() => setStep(STEPS.WIN_MESSAGE), 1000);
      return () => clearTimeout(timer);
    }
  }, [board, step]);

  // Clean up bot timeout when step changes
  useEffect(() => {
    return () => {
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
    };
  }, [step]);

  // ---------- Loading progress (step 4) ----------
  useEffect(() => {
    if (step === STEPS.LOADING) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(STEPS.FINAL), 1000);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Confetti on final step
  useEffect(() => {
    if (step === STEPS.FINAL) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff0000', '#ff69b4', '#ffffff'] });
      setTimeout(() => {
        confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.5 }, colors: ['#ff0000', '#ff69b4'] });
        confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.5 }, colors: ['#ff0000', '#ff69b4'] });
      }, 200);
    }
  }, [step]);

  // ---------- Photo carousel for final screen ----------
  // Replace these with your own image URLs
  const photos = [
    'https://images.unsplash.com/photo-1522673607200-164d1b3ce5c1?w=200',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200',
    'https://images.unsplash.com/photo-1502526272922-0acc7fa6dc41?w=200',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200',
    'https://images.unsplash.com/photo-1516589091389-5a0b81d2c2da?w=200',
  ];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Reset everything
  const resetToStart = () => {
    setStep(STEPS.LOVE_MODE);
    setLoveMode(false);
    setBoard(Array(9).fill(null));
    setProgress(0);
    setCurrentPhotoIndex(0);
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#0f0510] text-white flex items-center justify-center font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {/* STEP 1: Love Mode Switch */}
        {step === STEPS.LOVE_MODE && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center backdrop-blur-sm"
          >
            <Heart
              className={`mx-auto mb-4 w-16 h-16 transition-colors ${
                loveMode ? 'fill-red-500 text-red-500' : 'text-gray-500'
              }`}
            />
            <h1 className="text-2xl font-bold mb-6">Love mode</h1>
            <div
              onClick={() => {
                setLoveMode(true);
                setTimeout(() => setStep(STEPS.TIC_TAC_TOE), 1000);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setLoveMode(true);
                  setTimeout(() => setStep(STEPS.TIC_TAC_TOE), 1000);
                }
              }}
              role="switch"
              aria-checked={loveMode}
              tabIndex={0}
              className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                loveMode ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <motion.div
                layout
                className="bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center"
              >
                <Heart size={14} className={loveMode ? 'text-red-500' : 'text-gray-300'} />
              </motion.div>
              <span className="ml-2 text-xs font-bold uppercase">{loveMode ? 'ON' : 'OFF'}</span>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Tic Tac Toe */}
        {step === STEPS.TIC_TAC_TOE && (
          <motion.div
            key="step2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-xl mb-6">Let's play a little game...</h2>
            <div className="grid grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl">
              {board.map((cell, i) => (
                <div
                  key={i}
                  onClick={() => handleTileClick(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleTileClick(i);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Kotak ${i + 1} ${cell ? `berisi ${cell}` : 'kosong'}`}
                  className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all"
                >
                  {cell === 'X' && <X size={40} className="text-blue-400" />}
                  {cell === 'O' && <Circle size={35} className="text-red-400" />}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4 italic">Klik kotak untuk menaruh X</p>
          </motion.div>
        )}

        {/* STEP 3: Kemenangan */}
        {step === STEPS.WIN_MESSAGE && (
          <motion.div
            key="step3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl mb-2 italic">Kamu Memenangkan</h2>
            <div className="flex justify-center gap-4 my-8">
              <Heart className="fill-red-500 text-red-500 w-12 h-12 animate-bounce" />
            </div>
            <h2 className="text-2xl italic font-serif">Hatiku</h2>
            <button
              onClick={() => setStep(STEPS.LOADING)}
              className="mt-8 px-6 py-2 bg-red-500 rounded-full text-sm font-bold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Lanjut ke step berikutnya"
            >
              Lanjut? ❤️
            </button>
          </motion.div>
        )}

        {/* STEP 4: Love Intensity Loading */}
        {step === STEPS.LOADING && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center w-64"
          >
            <Heart className="mx-auto mb-4 text-red-500 fill-red-500 animate-pulse" size={48} />
            <div className="text-5xl font-bold mb-2">{progress}%</div>
            <p className="text-gray-400 text-sm mb-4 italic">Love Intensity</p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-pink-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 5: Final Message & Photo Wall */}
        {step === STEPS.FINAL && (
          <motion.div
            key="step5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-4"
          >
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-4xl font-bold mb-8 text-white z-10 drop-shadow-lg text-center"
            >
              Happy Valentine's Day! 🌹
            </motion.h1>

            {/* Photo carousel */}
            <div className="relative w-full max-w-md mb-6">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={photos[currentPhotoIndex]}
                  alt={`Kenangan ${currentPhotoIndex + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                aria-label="Foto sebelumnya"
              >
                ❮
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                aria-label="Foto berikutnya"
              >
                ❯
              </button>
            </div>

            <p className="text-center text-lg italic mb-8 text-pink-200">
              Setiap detik bersamamu adalah hadiah terindah. 💖
            </p>

            <button
              onClick={resetToStart}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors border border-white/20"
            >
              Ada pesan untukmu (ulang)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuatKamu;