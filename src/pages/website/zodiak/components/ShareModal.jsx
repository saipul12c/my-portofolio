import React, { useState } from "react";
import confetti from "canvas-confetti";

export const ShareModal = ({ isOpen, onClose, zodiak, userData, shioData }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !zodiak) return null;

  const namaUser = userData?.nama || zodiak.namaUser || "Sobat Bintang";
  const namaZodiak = zodiak.nama;
  const skorKosmis = zodiak.skorKosmis?.nilai || 85;
  const elemen = zodiak.elemen;
  const angkaHidup = zodiak.numerology?.angkaHidup || "-";
  const shio = shioData?.kombinasi || "-";

  const shareText = `✨ *Hasil Profil Zodiak & Kosmis Saya* ✨
👤 Nama: ${namaUser}
♈ Zodiak: ${namaZodiak} (${zodiak.simbol})
🔥 Elemen: ${elemen}
⚡ Skor Kosmis: ${skorKosmis}/100
🔢 Angka Hidup (Numerologi): ${angkaHidup}
🐉 Shio & Elemen Timur: ${shio}
💎 Batu Keberuntungan: ${zodiak.batu_keberuntungan?.slice(0, 2).join(", ")}
🎨 Warna Keberuntungan: ${zodiak.warna_keberuntungan?.slice(0, 2).join(", ")}
💬 Quote: "${zodiak.quote}"

Cek zodiak dan numerologimu di Zodiak Intelligence! 🌌`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Gagal menyalin teks secara otomatis.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 border-2 border-purple-400/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden text-white">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
          <h4 className="font-bold text-lg bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            ✨ Kartu Ringkasan Kosmis
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Visual Preview Card */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md relative overflow-hidden shadow-inner text-center">
          <div className="text-5xl mb-2">{zodiak.simbol}</div>
          <h3 className="text-2xl font-extrabold text-white">{namaUser}</h3>
          <p className="text-xs uppercase tracking-widest text-pink-300 font-semibold mb-3">
            {namaZodiak} • Elemen {elemen}
          </p>

          <div className="grid grid-cols-3 gap-2 my-4">
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400">Skor Kosmis</div>
              <div className="text-lg font-bold text-yellow-300">{skorKosmis}</div>
            </div>
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400">Angka Hidup</div>
              <div className="text-lg font-bold text-cyan-300">{angkaHidup}</div>
            </div>
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
              <div className="text-xs text-gray-400">Shio</div>
              <div className="text-sm font-bold text-purple-300 truncate">{shioData?.shio || "-"}</div>
            </div>
          </div>

          <p className="text-xs italic text-gray-300 my-2 px-2">
            "{zodiak.quote}"
          </p>

          <div className="text-[10px] text-gray-400 mt-3 pt-2 border-t border-white/10">
            ★ Zodiak Intelligence • Antigravity Portofolio ★
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleCopyText}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold text-sm rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <span>✅</span> <span>Teks Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <span>📋</span> <span>Salin Teks ke Clipboard</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 font-medium text-xs rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
