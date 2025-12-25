import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nlp from "compromise";

export default function AiOverview({ searchTerm, filteredBlogs, allBlogs, setSearchTerm, setCurrentPage, onSearch }) {
  const [visible, setVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const navigate = useNavigate();

  // Handle clicks on suggested keywords/labels so they update the search state
  const handleSearchClick = (text) => {
    if (!text) return;
    // Prefer centralized onSearch if provided
    if (typeof onSearch === "function") {
      onSearch(text);
    } else {
      if (setSearchTerm) setSearchTerm(text);
      if (setCurrentPage) setCurrentPage(1);
      navigate(`/blog?search=${encodeURIComponent(text)}`);
    }

    // scroll to top for better UX (guarded)
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // === 🧠 AI Reasoning & Analysis ===
  const aiAnalysis = useMemo(() => {
    const dataSource = (filteredBlogs && filteredBlogs.length > 0)
      ? filteredBlogs
      : (allBlogs && allBlogs.length > 0 ? allBlogs : null);

    if (!dataSource) return null;

    setIsThinking(true);
    const total = dataSource.length;
    const authors = Array.from(new Set(dataSource.map((p) => p.author))).slice(0, 5);
    const categories = Array.from(new Set(dataSource.map((p) => p.category))).slice(0, 3);
    const allLabels = dataSource.flatMap((p) => p.labels || []);
    const popularLabels = Array.from(new Set(allLabels)).slice(0, 6);

    // Gabungkan seluruh konten artikel untuk analisis
    const combinedText = dataSource.map((p) => p.content || "").join(" ");
    const doc = nlp(combinedText);
    const sentences = doc.sentences().out("array");

    // === 🔧 Text sanitizer to remove markdown and tidy sentences ===
    const cleanText = (s) => {
      if (!s || typeof s !== "string") return s;
      let t = s;
      // Remove bold/italic/backticks and markdown links
      t = t.replace(/\*\*(.*?)\*\*/g, "$1");
      t = t.replace(/\*(.*?)\*/g, "$1");
      t = t.replace(/`(.*?)`/g, "$1");
      t = t.replace(/\[(.*?)\]\((.*?)\)/g, "$1");
      // Collapse whitespace and trim
      t = t.replace(/\s+/g, " ").trim();
      // Capitalize first letter if necessary
      if (t.length > 1) t = t.charAt(0).toUpperCase() + t.slice(1);
      return t;
    };

    // === 🎯 AI Question Analysis ===
    const lowerSearch = searchTerm.toLowerCase();
    
    // Deteksi jenis pertanyaan
    const questionType = {
      isWhat: /(apa|what|pengertian|definisi|arti)/i.test(searchTerm),
      isHow: /(bagaimana|how|cara|langkah|tutorial)/i.test(searchTerm),
      isWhy: /(mengapa|why|alasan|sebab)/i.test(searchTerm),
      isWhen: /(kapan|when|waktu|jadwal)/i.test(searchTerm),
      isWho: /(siapa|who|penemu|pembuat)/i.test(searchTerm),
      isComparison: /(perbedaan|beda|vs|banding)/i.test(searchTerm),
      isRecommendation: /(rekomendasi|saran|tips|terbaik)/i.test(searchTerm)
    };

    // === 🤖 Smart Answer Generation ===
    const generateAnswer = () => {
      let answer = "";
      let confidence = "high";

      // Cari kalimat yang paling relevan dengan pertanyaan
      const relevantSentences = sentences.filter((s) =>
        s.toLowerCase().includes(lowerSearch)
      );

      // Analisis konteks dari seluruh konten
      const lc = combinedText.toLowerCase();
      
      // Deteksi topik utama
      const isTech = lc.includes("teknologi") || lc.includes("digital") || lc.includes("software");
      const isDesign = lc.includes("desain") || lc.includes("ui") || lc.includes("ux");
      const isMarketing = lc.includes("marketing") || lc.includes("branding") || lc.includes("media sosial");

      // Generate answer berdasarkan jenis pertanyaan
      if (questionType.isWhat) {
        const definition = relevantSentences.find(s => 
          /(adalah|merupakan|ialah|artinya)/i.test(s)
        ) || relevantSentences[0];
        
        answer = definition ? 
          `Berdasarkan analisis konten, ${cleanText(definition)}` :
          `Terkait "${searchTerm}", artikel-artikel ini membahas konsep dan implementasinya dalam konteks ${isTech ? "teknologi" : isDesign ? "desain" : isMarketing ? "marketing" : "umum"}.`;
          
      } else if (questionType.isHow) {
        const steps = relevantSentences.filter(s => 
          /(langkah|tahap|step|cara|untuk|dengan)/i.test(s)
        ).slice(0, 3);
        
        answer = steps.length > 0 ? 
          `Untuk ${searchTerm}, berikut pendekatan yang disarankan: ${cleanText(steps.join(" "))}` :
          `Artikel menyajikan berbagai metode dan praktik terbaik untuk ${searchTerm} dengan fokus pada implementasi yang efektif.`;
          
      } else if (questionType.isWhy) {
        const reasons = relevantSentences.filter(s => 
          /(karena|sebab|alasan|mengapa|penting)/i.test(s)
        ).slice(0, 2);
        
        answer = reasons.length > 0 ?
          `Alasan utama ${searchTerm} adalah: ${cleanText(reasons.join(" "))}` :
          `Artikel menjelaskan pentingnya ${searchTerm} dalam konteks perkembangan saat ini.`;
          
      } else if (questionType.isRecommendation) {
        const tips = relevantSentences.filter(s => 
          /(tips|saran|rekomendasi|sebaiknya|disarankan)/i.test(s)
        ).slice(0, 3);
        
        answer = tips.length > 0 ?
          `Rekomendasi untuk ${searchTerm}: ${cleanText(tips.join(" "))}` :
          `Berdasarkan analisis, berikut beberapa praktik terbaik untuk ${searchTerm}.`;
      } else {
        // Default answer untuk pertanyaan umum
        const keyInsights = relevantSentences.slice(0, 2);
        answer = keyInsights.length > 0 ?
          `Tentang "${searchTerm}": ${cleanText(keyInsights.join(" "))}` :
          `Artikel-artikel ini memberikan wawasan mendalam tentang ${searchTerm} dari berbagai perspektif.`;
        confidence = "medium";
      }

      return { answer, confidence };
    };

    // === 📊 Advanced Semantic Analysis ===
    const nounFreq = doc.nouns().out("frequency").slice(0, 8);
    const verbFreq = doc.verbs().out("frequency").slice(0, 5);
    const adjFreq = doc.adjectives().out("frequency").slice(0, 4);
    
    const topNouns = nounFreq.map((n) => n.normal);
    const topVerbs = verbFreq.map((v) => v.normal);
    const adjectives = adjFreq.map((a) => a.normal);

    // === 🎭 Context Analysis ===
    const contextAnalysis = () => {
      const lc = combinedText.toLowerCase();
      let context = [];
      let tone = "informatif";

      if (lc.includes("pemula") || lc.includes("dasar")) {
        context.push("level pemula");
        tone = "edukatif";
      }
      if (lc.includes("lanjutan") || lc.includes("advanced")) {
        context.push("level lanjutan");
        tone = "teknis";
      }
      if (lc.includes("strategi") || lc.includes("taktik")) {
        context.push("strategis");
        tone = "analitis";
      }
      if (lc.includes("inspirasi") || lc.includes("kreatif")) {
        context.push("kreatif");
        tone = "inspiratif";
      }

      return { context: context.length > 0 ? context : ["komprehensif"], tone };
    };

    // === 📈 Content Quality Assessment ===
    const qualityMetrics = {
      depth: dataSource.length > 3 ? "mendalam" : dataSource.length > 1 ? "cukup" : "pengenalan",
      recency: dataSource.some(p => {
        const postDate = new Date(p.date);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return postDate > sixMonthsAgo;
      }) ? "terkini" : "klasik",
      expertise: authors.length > 2 ? "beragam ahli" : authors.length > 0 ? "spesialis" : "berbagai sumber"
    };

    const { answer, confidence } = generateAnswer();
    const { context, tone } = contextAnalysis();

    // === 💡 Intelligent Insights ===
    const generateInsights = () => {
      const insights = [];
      
      if (dataSource.length >= 3) {
        insights.push(`Terdapat ${dataSource.length} artikel yang membahas topik ini secara komprehensif.`);
      }
      
      if (topNouns.length >= 3) {
        insights.push(`Fokus utama pembahasan pada ${topNouns.slice(0, 3).join(", ")}.`);
      }
      
      if (qualityMetrics.recency === "terkini") {
        insights.push("Materi diperbarui dengan informasi terkini.");
      }
      
      if (categories.length > 1) {
        insights.push(`Dibahas dari perspektif ${categories.join(" dan ")}.`);
      }

      return insights.length > 0 ? insights : [
        "Artikel memberikan pandangan yang berharga tentang topik ini."
      ];
    };

    const topRelatedArticles = (dataSource || [])
      .sort((a, b) => (b.rating + b.views / 1000) - (a.rating + a.views / 1000))
      .slice(0, 3);

    // Temukan jenis pertanyaan yang aktif - FIXED ESLINT ERROR
    const activeQuestionType = Object.entries(questionType).find(([, value]) => value)?.[0] || "general";

    const analysisResult = {
      total,
      authors,
      categories,
      popularLabels,
      topKeywords: topNouns.slice(0, 5),
      topVerbs,
      adjectives,
      answer,
      confidence,
      context,
      tone,
      qualityMetrics,
      insights: generateInsights(),
      topRelatedArticles,
      questionType: activeQuestionType
    };

    // Simulate AI thinking delay
    setTimeout(() => setIsThinking(false), 800);

    return analysisResult;
  }, [searchTerm, filteredBlogs, allBlogs]);

  // === ✨ Transition Effects ===
  useEffect(() => {
    const hasData = (filteredBlogs && filteredBlogs.length > 0) || (allBlogs && allBlogs.length > 0 && searchTerm);
    if (hasData) {
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [filteredBlogs, allBlogs, searchTerm]);

  if (!aiAnalysis || !visible) return null;

  // === 🎨 Confidence Indicator ===
  const ConfidenceIndicator = ({ level }) => {
    const config = {
      high: { color: "text-green-400", label: "Tinggi", icon: "🎯" },
      medium: { color: "text-yellow-400", label: "Sedang", icon: "💡" },
      low: { color: "text-orange-400", label: "Perlu konfirmasi", icon: "🤔" }
    };
    
    const { color, label, icon } = config[level] || config.medium;
    
    return (
      <div className={`inline-flex items-center gap-1 text-xs ${color} bg-gray-800/50 px-2 py-1 rounded-full`}>
        <span>{icon}</span>
        <span>Keyakinan: {label}</span>
      </div>
    );
  };

  // === 💎 Main AI Overview Component ===
  return (
    <div
      className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/95
      border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-xl
      overflow-hidden transition-all duration-500 hover:border-cyan-400/30 hover:shadow-cyan-500/20 animate-fadeIn
      mb-6 sm:mb-8"
    >
      {/* === AI Header with Thinking Animation === */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <span className="text-xl sm:text-2xl">🤖</span>
            {isThinking && (
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Analisis cerdas berdasarkan {aiAnalysis.total} artikel
            </p>
          </div>
        </div>
        <ConfidenceIndicator level={aiAnalysis.confidence} />
      </div>

      {/* === AI Answer === */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-cyan-400 text-base sm:text-lg">💬</span>
          <h3 className="text-base sm:text-lg font-semibold text-white">Jawaban AI</h3>
        </div>
        <p className="text-gray-100 text-sm sm:text-base leading-relaxed bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-cyan-500/20">
          {isThinking ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              Menganalisis konten dan menyusun jawaban...
            </div>
          ) : (
            aiAnalysis.answer
          )}
        </p>
      </div>

      {/* === Context & Insights === */}
      {!isThinking && (
        <>
          {/* Key Insights */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="text-purple-400 text-base sm:text-lg">💡</span>
              <h3 className="text-base sm:text-lg font-semibold text-white">Analisis Mendalam</h3>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {aiAnalysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 text-gray-200 text-xs sm:text-sm">
                  <span className="text-cyan-400 mt-0.5 sm:mt-1">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Context & Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
              <h4 className="text-cyan-400 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">🎭 Konteks Pembahasan</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {aiAnalysis.context.map((ctx, i) => (
                  <span key={i} className="text-[10px] sm:text-xs bg-cyan-500/20 text-cyan-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {ctx}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 text-[10px] sm:text-xs mt-1.5 sm:mt-2">Nada: {aiAnalysis.tone}</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
              <h4 className="text-green-400 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">📊 Kualitas Konten</h4>
              <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-gray-300">
                <p>• Kedalaman: {aiAnalysis.qualityMetrics.depth}</p>
                <p>• Aktualitas: {aiAnalysis.qualityMetrics.recency}</p>
                <p>• Keahlian: {aiAnalysis.qualityMetrics.expertise}</p>
              </div>
            </div>
          </div>

          {/* Keywords & Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h4 className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">🔑 Kata Kunci Utama</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {aiAnalysis.topKeywords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearchClick(word)}
                    className="text-[10px] sm:text-xs bg-fuchsia-400/10 border border-fuchsia-400/30 text-fuchsia-300 
                    px-2 sm:px-3 py-0.5 sm:py-1 rounded-full hover:bg-fuchsia-400/20 hover:border-fuchsia-400/50 transition"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">🏷️ Topik Terkait</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {aiAnalysis.popularLabels.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearchClick(label)}
                    className="text-[10px] sm:text-xs bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 
                    px-2 sm:px-3 py-0.5 sm:py-1 rounded-full hover:bg-cyan-400/20 hover:border-cyan-400/50 transition"
                  >
                    #{label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Articles */}
          {aiAnalysis.topRelatedArticles.length > 0 && (
            <div className="border-t border-white/10 pt-3 sm:pt-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-yellow-400 text-base sm:text-lg">📚</span>
                <h4 className="text-base sm:text-lg font-semibold text-white">Artikel Rekomendasi</h4>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {aiAnalysis.topRelatedArticles.map((post) => (
                  <div
                    key={post.slug}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-800/30 border border-white/10 
                    hover:border-cyan-400/30 hover:bg-cyan-500/10 cursor-pointer transition-all group"
                  >
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white text-xs sm:text-sm font-medium truncate group-hover:text-cyan-300">
                        {post.title}
                      </h5>
                      <p className="text-gray-400 text-[10px] sm:text-xs">
                        oleh {post.author} • ⭐ {post.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* === AI Footer === */}
      <div className="border-t border-white/10 pt-3 sm:pt-4 mt-3 sm:mt-4">
        <p className="text-gray-500 text-[10px] sm:text-xs text-center">
          🤖 Analisis AI didukung oleh NLP dan machine learning • Terakhir diperbarui secara real-time
        </p>
      </div>

      {/* === Glowing Bottom Border === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1
        bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 opacity-60 blur-sm"
      />
    </div>
  );
}