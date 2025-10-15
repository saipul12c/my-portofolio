import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nlp from "compromise";

export default function AiOverview({ searchTerm, filteredBlogs }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // === 🧩 1. Analisis Semantik & Ringkasan Dinamis ===
  const aiSummary = useMemo(() => {
    if (!filteredBlogs || filteredBlogs.length === 0) return null;

    const total = filteredBlogs.length;
    const authors = Array.from(new Set(filteredBlogs.map((p) => p.author))).slice(0, 5);
    const allLabels = filteredBlogs.flatMap((p) => p.labels || []);
    const popularLabels = Array.from(new Set(allLabels)).slice(0, 5);

    // Gabungkan semua isi artikel
    const contents = filteredBlogs.map((p) => p.content || "").join(" ");
    const doc = nlp(contents);

    // === 🧠  Ekstraksi kalimat relevan dengan kata pencarian
    const sentences = doc.sentences().out("array");
    const lowerSearch = searchTerm.toLowerCase();
    const relevantSentences = sentences.filter((s) =>
      s.toLowerCase().includes(lowerSearch)
    );

    // Cari kalimat yang tampak seperti definisi
    const definitionSentence =
      relevantSentences.find((s) =>
        /(adalah|merupakan|ialah)/i.test(s)
      ) || relevantSentences[0];

    // Ambil 2-3 kalimat relevan
    const combinedSummary = [definitionSentence, ...relevantSentences.slice(1, 3)]
      .filter(Boolean)
      .join(" ");

    // === 🔍 Ekstraksi semantik (kata benda, adjektiva, topik)
    const nounFreq = doc.nouns().out("frequency").slice(0, 8);
    const adjFreq = doc.adjectives().out("frequency").slice(0, 5);
    const topNouns = nounFreq.map((n) => n.normal);
    const adjectives = adjFreq.map((a) => a.normal);
    const fallbackKeywords = topNouns.length ? topNouns : ["konsep", "pembahasan", "artikel"];

    // === 💬 Insight tambahan berdasarkan isi konten
    let insight = "";
    const lc = contents.toLowerCase();
    if (lc.includes("tips") || lc.includes("cara")) {
      insight += "Sebagian besar artikel berisi panduan praktis yang bisa langsung diterapkan. ";
    }
    if (lc.includes("tren") || lc.includes("masa depan") || lc.includes("perkembangan")) {
      insight += "Beberapa artikel membahas tren dan arah perkembangan terbaru di bidang ini. ";
    }
    if (lc.includes("tutorial") || lc.includes("panduan")) {
      insight += "Terdapat juga tutorial langkah demi langkah untuk pemahaman yang lebih mudah. ";
    }
    if (lc.includes("analisis") || lc.includes("ulasan")) {
      insight += "Beberapa penulis memberikan analisis dan ulasan mendalam. ";
    }
    if (!insight) {
      insight = "Topik ini memiliki berbagai perspektif menarik dari para penulis. ";
    }

    // === 🤖 Reasoning mirip AI Overview
    const reasoning =
      topNouns.length > 0
        ? `Analisis menunjukkan kata kunci seperti ${topNouns
            .slice(0, 3)
            .map((w) => `"${w}"`)
            .join(", ")} menjadi fokus pembahasan utama.`
        : "";

    // === 🧾 Artikel relevan teratas
    const topRelatedArticles = filteredBlogs.slice(0, 3);

    // === 🧩 Susun final ringkasan
    const mainSummary = definitionSentence
      ? definitionSentence
      : combinedSummary || "Tidak ditemukan ringkasan yang relevan dari hasil pencarian.";

    return {
      total,
      authors,
      popularLabels,
      topKeywords: fallbackKeywords,
      adjectives,
      insight,
      reasoning,
      mainSummary,
      topRelatedArticles,
    };
  }, [searchTerm, filteredBlogs]);

  // === ✨ Animasi Kemunculan ===
  useEffect(() => {
    if (filteredBlogs && filteredBlogs.length > 0) {
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [filteredBlogs]);

  if (!aiSummary || !visible) return null;

  // === 🎨 2. Tampilan seperti Google AI Overview ===
  return (
    <div
      className="relative bg-gradient-to-br from-gray-800/70 to-gray-900/90
      border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-xl
      overflow-hidden transition-all duration-500 hover:border-cyan-400/20 hover:shadow-cyan-400/10 animate-fadeIn"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyan-400 text-xl">✨</span>
        <h2 className="text-lg sm:text-xl font-semibold text-cyan-300 tracking-wide">
          Ringkasan AI
        </h2>
      </div>

      {/* Jawaban Utama */}
      <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-4">
        {aiSummary.mainSummary}
      </p>

      {/* Insight tambahan */}
      <p className="text-gray-300 text-sm mb-3">{aiSummary.insight}</p>

      {/* Reasoning */}
      {aiSummary.reasoning && (
        <p className="text-gray-400 text-sm italic mb-4">{aiSummary.reasoning}</p>
      )}

      {/* Info tambahan */}
      <div className="text-xs sm:text-sm text-gray-400 mb-3">
        ✍️ Berdasarkan tulisan {aiSummary.authors.join(", ")}.
      </div>

      {/* Topik terkait */}
      {aiSummary.popularLabels.length > 0 && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <h3 className="text-sm text-gray-400 mb-2">🔍 Topik terkait:</h3>
          <div className="flex flex-wrap gap-2">
            {aiSummary.popularLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => navigate(`/blog?search=${encodeURIComponent(label)}`)}
                className="text-xs bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 
                px-3 py-[3px] rounded-full hover:bg-cyan-400/20 hover:border-cyan-400/50 transition"
              >
                #{label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kata kunci utama */}
      {aiSummary.topKeywords.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <h4 className="text-sm text-gray-400 mb-2">🧩 Fokus bahasan utama:</h4>
          <div className="flex flex-wrap gap-2">
            {aiSummary.topKeywords.map((word, i) => (
              <button
                key={i}
                onClick={() => navigate(`/blog?search=${encodeURIComponent(word)}`)}
                className="text-xs bg-fuchsia-400/10 border border-fuchsia-400/30 text-fuchsia-300 
                px-3 py-[3px] rounded-full hover:bg-fuchsia-400/20 hover:border-fuchsia-400/50 transition"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Artikel referensi */}
      {aiSummary.topRelatedArticles.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-3">
          <h4 className="text-sm text-gray-400 mb-2">📚 Berdasarkan artikel:</h4>
          <ul className="space-y-2">
            {aiSummary.topRelatedArticles.map((post) => (
              <li
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="text-gray-300 text-sm cursor-pointer hover:text-cyan-300 transition"
              >
                • {post.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Garis bawah glowing */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-blue-500 opacity-70"
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
