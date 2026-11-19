import React, { useState } from "react";
import confetti from "canvas-confetti";
import { TAROT_CARDS } from "../../data/tarotData";

export const TarotTab = ({ zodiak }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [shuffledCards, setShuffledCards] = useState(() => {
    // Ambil 3 kartu acak dari deck
    return [...TAROT_CARDS].sort(() => Math.random() - 0.5).slice(0, 3);
  });
  const [isRevealed, setIsRevealed] = useState(false);

  const handlePickCard = (card) => {
    if (isRevealed) return;
    setSelectedCard(card);
    setIsRevealed(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#8b5cf6", "#3b82f6", "#f59e0b"]
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setIsRevealed(false);
    setSelectedCard(null);
    setShuffledCards([...TAROT_CARDS].sort(() => Math.random() - 0.5).slice(0, 3));
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent mb-2">
          🔮 Tarik Kartu Tarot Kosmis Harian
        </h3>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Fokuskan pikiranmu pada pertanyaan atau energi hari ini untuk {zodiak?.namaUser || zodiak?.nama}, lalu pilih satu kartu di bawah ini:
        </p>
      </div>

      {!isRevealed ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto my-8">
          {shuffledCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handlePickCard(card)}
              className="group cursor-pointer perspective-1000 transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="h-64 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-purple-400/50 p-4 shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden group-hover:border-pink-400 group-hover:shadow-pink-500/20 transition-all">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff15,_transparent_70%)]"></div>
                <div className="text-xs uppercase tracking-widest text-pink-300 font-semibold z-10">
                  Cosmic Arcana
                </div>
                <div className="my-auto z-10">
                  <div className="text-5xl mb-2 animate-pulse">✨</div>
                  <div className="text-sm font-bold text-gray-200">Kartu #{idx + 1}</div>
                  <div className="text-xs text-gray-400 mt-1">Klik untuk Membuka</div>
                </div>
                <div className="text-[10px] text-purple-300/80 z-10">
                  ★ Zodiak Intelligence ★
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto my-6 animate-fadeIn">
          {selectedCard && (
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedCard.warna}/20 border-2 border-white/30 backdrop-blur-md shadow-2xl relative overflow-hidden`}>
              <div className="text-center mb-6">
                <div className="inline-block text-xs uppercase px-3 py-1 rounded-full bg-black/40 text-pink-300 mb-2 border border-white/10">
                  Kartu Terpilih • Nomor {selectedCard.nomor}
                </div>
                <div className="text-6xl my-3">{selectedCard.simbol}</div>
                <h4 className="text-2xl font-bold text-white mb-1">{selectedCard.nama}</h4>
                <p className="text-sm font-semibold text-pink-300">{selectedCard.tema}</p>
              </div>

              <div className="space-y-4 bg-black/30 p-5 rounded-xl border border-white/10">
                <div>
                  <h5 className="text-xs uppercase font-bold text-gray-400 mb-1">Pesan Kosmis</h5>
                  <p className="text-sm md:text-base text-gray-100 leading-relaxed">
                    {selectedCard.pesan}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <h5 className="text-xs uppercase font-bold text-gray-400 mb-1">Afirmasi Positif Hari Ini</h5>
                  <p className="text-sm italic text-yellow-300 font-medium">
                    "{selectedCard.afirmasi}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-300 border-t border-white/10 pt-3">
                  <span>Tingkat Energi: <strong className="text-white">{selectedCard.energi}</strong></span>
                  <span>Harmoni dengan Zodiak: <strong className="text-green-300">Sangat Selaras ✨</strong></span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-medium text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  🔄 Tarik Kartu Lain
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-black/20 rounded-xl text-xs text-gray-300 text-center">
        💡 Kartu tarot harian memberikan pesan simbolik untuk refleksi diri dan menumbuhkan afirmasi positif sepanjang hari.
      </div>
    </div>
  );
};
