import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nlp from "compromise";

export default function AiOverview({ searchTerm, filteredBlogs }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // === 🧠 Analisis dan Ringkasan Dinamis ===
  const aiSummary = useMemo(() => {
    if (!filteredBlogs || filteredBlogs.length === 0) return null;

    const total = filteredBlogs.length;
    const authors = Array.from(new Set(filteredBlogs.map((p) => p.author))).slice(0, 5);
    const allLabels = filteredBlogs.flatMap((p) => p.labels || []);
    const popularLabels = Array.from(new Set(allLabels)).slice(0, 6);

    // Gabungkan seluruh isi artikel
    const combinedText = filteredBlogs.map((p) => p.content || "").join(" ");
    const doc = nlp(combinedText);
    const sentences = doc.sentences().out("array");

    // === 🎯 Cari kalimat relevan & informatif ===
    const lowerSearch = searchTerm.toLowerCase();
    const relevantSentences = sentences.filter((s) =>
      s.toLowerCase().includes(lowerSearch)
    );

    // Ambil kalimat definisi atau deskripsi utama
    const definitionSentence =
      relevantSentences.find((s) => /(adalah|merupakan|ialah)/i.test(s)) ||
      relevantSentences[0];

    const combinedSummary = [definitionSentence, ...relevantSentences.slice(1, 2)]
      .filter(Boolean)
      .join(" ");

    // === 📊 Ekstraksi semantik (kata benda & adjektiva) ===
    const nounFreq = doc.nouns().out("frequency").slice(0, 10);
    const adjFreq = doc.adjectives().out("frequency").slice(0, 5);
    const topNouns = nounFreq.map((n) => n.normal);
    const adjectives = adjFreq.map((a) => a.normal);

    const fallbackKeywords = topNouns.length
      ? topNouns
      : ["konsep", "materi", "tema", "pembelajaran"];

    // === 💬 Insight Kontekstual ===
    const lc = combinedText.toLowerCase();
    let insight = "";
    if (lc.includes("tips") || lc.includes("panduan")) {
      insight += "Banyak artikel menampilkan panduan praktis dan langkah-langkah penerapan. ";
    }
    if (lc.includes("tren") || lc.includes("perkembangan")) {
      insight += "Beberapa penulis membahas tren serta arah perkembangan terkini di bidang ini. ";
    }
    if (lc.includes("analisis") || lc.includes("ulasan")) {
      insight += "Ada pula ulasan dan analisis mendalam yang memperkaya perspektif pembaca. ";
    }
    if (!insight) {
      insight = "Topik ini dieksplorasi dari beragam sudut pandang oleh para penulis. ";
    }

    // === 🤖 Reasoning mirip Google AI Overview ===
    const reasoning = topNouns.length
      ? `Analisis semantik menunjukkan kata kunci dominan seperti ${topNouns
          .slice(0, 3)
          .map((w) => `"${w}"`)
          .join(", ")} yang menjadi fokus utama pembahasan.`
      : "";

    // === 📚 Artikel Terkait ===
    const topRelatedArticles = filteredBlogs.slice(0, 3);

    // === 🧩 Ringkasan Utama ===
    const mainSummary =
      definitionSentence ||
      combinedSummary ||
      "Tidak ditemukan ringkasan yang relevan dari hasil pencarian.";

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

  // === ✨ Efek Transisi & Tampilan ===
  useEffect(() => {
    if (filteredBlogs && filteredBlogs.length > 0) {
      const timer = setTimeout(() => setVisible(true), 250);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [filteredBlogs]);

  if (!aiSummary || !visible) return null;

  // === 💎 Tampilan Utama (AI Overview Card) ===
  return (
    <div
      className="relative bg-gradient-to-br from-gray-800/70 to-gray-900/90
      border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-xl
      overflow-hidden transition-all duration-500 hover:border-cyan-400/20 hover:shadow-cyan-400/10 animate-fadeIn"
    >
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyan-400 text-xl">✨</span>
        <h2 className="text-lg sm:text-xl font-semibold text-cyan-300 tracking-wide">
          Ringkasan AI
        </h2>
      </div>

      {/* === Ringkasan Utama === */}
      <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-4">
        {aiSummary.mainSummary}
      </p>

      {/* === Insight Tambahan === */}
      <p className="text-gray-300 text-sm mb-3">{aiSummary.insight}</p>

      {/* === Reasoning Semantik === */}
      {aiSummary.reasoning && (
        <p className="text-gray-400 text-sm italic mb-4">{aiSummary.reasoning}</p>
      )}

      {/* === Info Penulis === */}
      {aiSummary.authors.length > 0 && (
        <div className="text-xs sm:text-sm text-gray-400 mb-3">
          ✍️ Berdasarkan tulisan dari {aiSummary.authors.join(", ")}.
        </div>
      )}

      {/* === Topik Terkait === */}
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

      {/* === Fokus Bahasan === */}
      {aiSummary.topKeywords.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <h4 className="text-sm text-gray-400 mb-2">🧩 Fokus pembahasan utama:</h4>
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

      {/* === Artikel Referensi === */}
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

      {/* === Garis bawah glowing === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]
        bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-blue-500 opacity-70"
      />
    </div>
  );
}
