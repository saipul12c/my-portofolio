import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import nlp from "compromise";
import faqsData from "../../../../../components/helpbutton/faq/data/faqs.json";
import commitmentsData from "../../../../../components/helpbutton/komit/data/commitments.json";
import softSkillsData from "../../../../../data/skills/softskills.json";
import { compileAuthorProfiles, findAuthorByName } from "../../../utils/authorUtils";

export default function AiOverview({ searchTerm, filteredBlogs, allBlogs, onSearch }) {
  const [visible, setVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const navigate = useNavigate();

  // Handle clicks on suggested keywords/labels so they update the search state
  const handleSearchClick = (text) => {
    if (!text) return;
    // Prefer centralized onSearch if provided
    if (typeof onSearch === "function") {
      onSearch(text);
    } else {
      navigate(`/blog?search=${encodeURIComponent(text)}`);
    }

    // scroll to top for better UX (guarded)
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // === 🧠 AI Reasoning & Analysis (Optimized for Large Data) ===
  useEffect(() => {
    if (!searchTerm) {
      setAiAnalysis(null);
      setVisible(false);
      return;
    }

    setIsThinking(true);
    setVisible(true);

    // Use a small delay to ensure the browser can render the "Thinking" state first
    const timer = setTimeout(() => {
      // --- DATA SOURCE CONFIG ---
      // AI now strictly follows the filtered results. No silent local fallback to all articles.
      const dataSource = (filteredBlogs && filteredBlogs.length > 0) ? filteredBlogs : [];
      const total = dataSource.length;

      if (total === 0) {
        setIsThinking(false);
        setAiAnalysis({
          total: 0,
          answer: `Waduh! 👋 Sepertinya saya belum menemukan artikel yang pas banget untuk pencarian **"${searchTerm}"**. \n\nMungkin bisa coba pakai kata kunci yang lebih umum, atau cek topik terpopuler seperti **Fotografi** atau **Desain Digital** di bawah ya! ✨`,
          confidence: "low",
          insights: ["Tidak ada artikel yang cocok dengan pencarian saat ini."],
          topKeywords: [],
          popularLabels: [],
          topRelatedArticles: [],
          context: ["Kosong"],
          tone: "informatif",
          qualityMetrics: { depth: "N/A", recency: "N/A", expertise: "N/A" }
        });
        return;
      }

      // --- OPTIMIZATION: Limit data for high performance ---
      // We analyze the top 8 results (which are already sorted by relevance in our new hook)
      const analysisLimit = 8;
      const limitedSource = dataSource.slice(0, analysisLimit);

      const authors = Array.from(new Set(limitedSource.map((p) => p.author))).slice(0, 5);
      const categories = Array.from(new Set(limitedSource.map((p) => p.category))).slice(0, 3);
      // --- SEMANTIC TOPIC EXTRACTION ---
      // Instead of generic status labels, we use actual content tags
      const allTags = limitedSource.flatMap((p) => p.tags || []);
      const tagCounts = allTags.reduce((acc, tag) => {
        // Normalize: Capitalize first letter, rest lower
        const normTag = tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1).toLowerCase();
        acc[normTag] = (acc[normTag] || 0) + 1;
        return acc;
      }, {});

      const popularLabels = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1]) // Rank by frequency
        .slice(0, 6)
        .map(([tag]) => tag);

      // Split content into clean text for NLP analysis
      const combinedTextRaw = limitedSource
        .map((p) => (p.content || "").substring(0, 2000))
        .join(" ");

      // Strip markdown symbols for internal NLP analysis
      const combinedTextClean = combinedTextRaw
        .replace(/[#*`~]/g, "")
        .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();

      // Heavy NLP operation - now running in a deferred state
      const doc = nlp(combinedTextClean);
      const sentences = doc.sentences().out("array");

      const cleanText = (s) => {
        if (!s || typeof s !== "string") return s;
        let t = s;
        // Basic cleanup for fragments
        t = t.replace(/\s+/g, " ").trim();
        if (t.length > 1) t = t.charAt(0).toUpperCase() + t.slice(1);
        return t;
      };

      const lowerSearch = searchTerm.toLowerCase();
      // Expanded Intent Detection
      const intents = {
        isWho: /(siapa|who|author|penulis|pencipta)/i.test(searchTerm),
        isTeam: /(tim|team|daftar penulis|siapa saja|anggota|staf|personil)/i.test(searchTerm),
        isExpertise: /(ahli|spesialis|pakar|pakar|expert|jago)/i.test(searchTerm),
        isWhen: /(kapan|when|tanggal|date|update|terbaru|terlama)/i.test(searchTerm),
        isHowMany: /(berapa|how many|jumlah|total)/i.test(searchTerm),
        isWhat: /(apa|what|pengertian|definisi|arti)/i.test(searchTerm),
        isHow: /(bagaimana|how|cara|langkah|tutorial)/i.test(searchTerm),
        isWhy: /(mengapa|why|alasan|sebab)/i.test(searchTerm),
        isRecommendation: /(rekomendasi|saran|tips|terbaik|populer|bagus)/i.test(searchTerm)
      };

      const generateAnswer = () => {
        const greetings = [
          `Halo! 👋 Senang sekali bisa bantu kamu cari tahu soal **"${searchTerm}"**. `,
          `Ouh, halo! 👋 Wah, topik **"${searchTerm}"** ini menarik banget ya buat dibahas. `,
          `Hai! 🚀 Saya sudah menyelami koleksi tulisan kamu dan menemukan hal seru soal **"${searchTerm}"**. `,
          `Halo! ✨ Berdasarkan hasil riset kilat saya di blog kamu, ini lho informasi soal **"${searchTerm}"**: `
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        let answer = randomGreeting;
        let confidence = "high";

        // --- CROSS-CONTEXT ENRICHMENT (FAQ & Commitments) ---
        const matchedFaq = faqsData.find(f =>
          f.question.toLowerCase().includes(lowerSearch) ||
          f.answer.toLowerCase().includes(lowerSearch)
        );
        const matchedCommit = (commitmentsData.commitments || []).find(c =>
          c.title.toLowerCase().includes(lowerSearch) ||
          c.desc.toLowerCase().includes(lowerSearch)
        );
        const matchedSkill = (softSkillsData?.skills || []).find(s =>
          s.name.toLowerCase().includes(lowerSearch) ||
          (s.tags || []).some(t => lowerSearch.includes(t.toLowerCase()))
        );

        // --- INTELLIGENT SEARCH FEEDBACK ---
        const bestMatch = dataSource[0];
        const hasDirectTitleMatch = bestMatch.title.toLowerCase().includes(lowerSearch);
        const profiles = compileAuthorProfiles(allBlogs);
        const specificAuthor = findAuthorByName(profiles, searchTerm.replace(/(siapa|penulis|author|about|ahli|pakar|spesialis)/i, "").trim());

        // Don't apologize if we found a specific person or strong external context
        if (!hasDirectTitleMatch && !intents.isHowMany && !specificAuthor && !matchedFaq && !matchedCommit) {
          answer = `Halo! 👋 Saya tidak menemukan artikel dengan judul persis **"${searchTerm}"**, tapi saya menemukan beberapa tulisan yang **sangat berkaitan erat** dengan topik tersebut. \n\nSalah satu yang menarik adalah artikel **"${bestMatch.title}"**. `;
        }

        const addCrossContext = () => {
          let extra = "";
          if (matchedFaq) {
            extra += `\n\n> [!NOTE]\n> **Informasi Tambahan dari FAQ:**\n> ${matchedFaq.answer}\n`;
          }
          if (matchedCommit) {
            extra += `\n\n> [!IMPORTANT]\n> **Komitmen Terkait:**\n> ${matchedCommit.desc}\n`;
          }
          if (matchedSkill) {
            extra += `\n\n> [!NOTE]\n> **Wawasan Soft Skill:**\n> Saipul memiliki keahlian **${matchedSkill.name}** dengan level **${matchedSkill.level}** (${matchedSkill.experience}%). ${matchedSkill.description}\n`;
          }
          return extra;
        };

        // --- 1. HANDLE METADATA INTENTS ---
        if (intents.isHowMany) {
          answer += `\n\nSangat senang membantu! Saya menemukan total **${total}** artikel yang berkaitan dengan pencarian kamu. `;
          if (categories.length > 0) {
            answer += `Semuanya tersebar di kategori seru seperti **${categories.join(", ")}**. ✨`;
          }
          answer += addCrossContext();
          return { answer, confidence: "high" };
        }

        if (intents.isTeam) {
          const allProfiles = Object.values(profiles);
          answer += `\n\nTentu! 👋 Kami punya tim penulis yang luar biasa hebat. Ini daftar mereka: \n\n`;
          allProfiles.forEach(p => {
            answer += `* **${p.name}** (${p.expertise[0]}) - ${p.totalPosts} artikel\n`;
          });
          answer += `\nMereka semua berkolaborasi untuk menyajikan konten terbaik buat kamu! 🤝✨`;
          return { answer, confidence: "high" };
        }

        if (intents.isWho || intents.isExpertise) {
          if (specificAuthor) {
            answer += `\n\nKenalin, **${specificAuthor.name}** adalah sosok yang kamu cari. \n\n${specificAuthor.bio} \n\nBeliau adalah **${specificAuthor.expertise.join(", ")}** andalan kami dengan total **${specificAuthor.totalPosts}** karya hebat. Ratingnya pun luar biasa: **${specificAuthor.avgRating.toFixed(1)}/5**! ⭐`;
            return { answer, confidence: "high" };
          }

          // Search by expertise if name not found
          const expert = Object.values(profiles).find(p =>
            p.expertise.some(e => lowerSearch.includes(e.toLowerCase()) || e.toLowerCase().includes(lowerSearch))
          );
          if (expert && intents.isExpertise) {
            answer += `\n\nWah, kalau cari pakar soal itu, jawabannya pasti **${expert.name}**! 🎯 \n\n${expert.bio} \n\nBeliau sudah menulis banyak seputar **${expert.expertise.join(" & ")}**. Cek saja artikel-artikel karyanya ya!`;
            return { answer, confidence: "high" };
          }

          const authorList = Array.from(new Set(limitedSource.map(b => b.author))).filter(Boolean);
          if (authorList.length === 1) {
            const prof = findAuthorByName(profiles, authorList[0]);
            answer += `\n\nBicara soal penulis, artikel yang kamu cari ini ternyata buah pemikiran dari **${authorList[0]}**. ${prof ? prof.bio : "Beliau adalah spesialis di bidang ini!"} ✍️`;
          } else if (authorList.length > 1) {
            answer += `\n\nWah, topik ini dibahas oleh tim hebat lho! Ada **${authorList.join(", ")}** yang menuangkan ide mereka di sini. 🤝`;
          }
          return { answer, confidence: "high" };
        }

        if (intents.isWhen) {
          const dates = limitedSource.map(b => new Date(b.date)).sort((a, b) => b - a);
          const newest = dates[0] ? dates[0].toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
          if (newest) {
            answer += `Informasi yang paling *fresh* soal ini terakhir diperbarui pada **${newest}**. Jadi tenang saja, datanya masih hangat! 🔥`;
          }
          return { answer, confidence: "high" };
        }

        // --- 2. HANDLE RECOMMENDATION INTENTS ---
        if (intents.isRecommendation) {
          const best = [...limitedSource].sort((a, b) => b.rating - a.rating)[0];
          if (best) {
            answer += `Ohiya! Kalau kamu tanya yang paling "juara", saya sangat merekomendasikan artikel **"${best.title}"**. Kenapa? Karena ratingnya paling tinggi, yaitu **${best.rating}/5**! ⭐ `;
            if (best.excerpt) answer += `Di sana dijelaskan kalau ${cleanText(best.excerpt)}`;
          } else {
            answer += `Saran saya sih, coba deh intip kategori **${categories[0] || "ini"}**, artikel-artikelnya oke punya lho! 💡`;
          }
          return { answer, confidence: "high" };
        }

        // --- 3. HANDLE CONTENT-BASED INTENTS (NLP Synthesis) ---
        const relevantSentences = sentences.filter((s) => s.toLowerCase().includes(lowerSearch));

        if (intents.isWhat) {
          const definition = relevantSentences.find(s => /(adalah|merupakan|ialah|artinya)/i.test(s)) || relevantSentences[0];
          if (definition) {
            answer += `Jadi begini, secara ringkas **${searchTerm}** itu ${cleanText(definition.substring(definition.toLowerCase().indexOf(searchTerm) + searchTerm.length))}. Menarik, kan? 🧐`;
          } else {
            answer = `Hmm, sepertinya di koleksi blog kita, **"${searchTerm}"** diposisikan sebagai bagian penting dari strategi ${categories[0] || "digital"} yang sedang tren! 📈`;
          }
        } else if (intents.isHow) {
          const steps = relevantSentences.filter(s => /(langkah|tahap|step|cara|untuk|dengan)/i.test(s)).slice(0, 3);
          if (steps.length > 0) {
            answer += `Tenang, caranya nggak ribet kok! Ini langkah-langkahnya: \n\n`;
            steps.forEach((s, i) => {
              answer += `* **Langkah ${i + 1}:** ${cleanText(s)}\n`;
            });
            answer += `\nSemoga langkah ini bisa membantu kamu ya! 🛠️`;
          } else {
            answer += `Untuk urusan ${searchTerm}, artikel-artikel tersebut menyarankan kamu buat lihat langsung studi kasus yang sudah saya siapkan di bawah. Pasti langsung paham! ✨`;
          }
        } else if (intents.isWhy) {
          const reasons = relevantSentences.filter(s => /(karena|sebab|alasan|mengapa|penting)/i.test(s)).slice(0, 2);
          if (reasons.length > 0) {
            answer += `Ternyata alasannya cukup kuat lho! Yaitu karena ${cleanText(reasons.join(". Ohiya, selain itu juga "))}. Penting banget kan buat diketahui? 🎯`;
          } else {
            answer += `Intinya, **${searchTerm}** itu krusial banget buat meningkatkan efisiensi dan hasil kerja kamu ke depannya. 🚀`;
          }
        } else {
          // General Synthesis
          const insights = relevantSentences.slice(0, 2);
          if (insights.length > 0) {
            answer += `Menjawab rasa penasaran kamu: ${cleanText(insights.join(". Maka dari itu, "))}. Semoga ini mencerahkan ya! 💡`;
          } else {
            const topPost = limitedSource[0];
            answer += `Saya menemukan wawasan keren di artikel **"${topPost?.title}"**. Intinya, hal ini sangat berkaitan erat dengan dunia **${topPost?.category}** yang lagi hits! 🌟`;
            confidence = "medium";
          }
        }

        answer += addCrossContext();
        return { answer, confidence };
      };

      const INDO_STOPWORDS = ["namun", "tetapi", "bahwa", "dengan", "adalah", "untuk", "dari", "pada", "dalam", "sebagai", "oleh", "juga", "atau", "yang", "tidak", "terkecuali", "merupakan", "ialah", "bahwa"];
      const nounFreq = doc.nouns().out("frequency").slice(0, 20);
      const topNouns = nounFreq.map((n) => {
        const text = n.normal.replace(/[#*`~]/g, "").trim();
        // Only keep short, meaningful terms (max 3 words)
        return text.split(" ").length <= 3 ? text : "";
      }).filter(n =>
        n.length > 3 &&
        !n.startsWith('http') &&
        !INDO_STOPWORDS.includes(n.toLowerCase())
      );

      const contextAnalysis = () => {
        const lc = combinedTextClean.toLowerCase();
        let contexts = [];
        let tone = "informatif";
        if (lc.includes("pemula") || lc.includes("dasar")) { contexts.push("level pemula"); tone = "edukatif"; }
        if (lc.includes("lanjutan") || lc.includes("advanced")) { contexts.push("level lanjutan"); tone = "teknis"; }
        if (lc.includes("strategi") || lc.includes("taktik")) { contexts.push("strategis"); tone = "analitis"; }
        if (lc.includes("inspirasi") || lc.includes("kreatif")) { contexts.push("kreatif"); tone = "inspiratif"; }
        return { context: contexts.length > 0 ? contexts : ["komprehensif"], tone };
      };

      const qualityMetrics = {
        depth: dataSource.length > 3 ? "mendalam" : dataSource.length > 1 ? "cukup" : "pengenalan",
        recency: limitedSource.some(p => {
          const postDate = new Date(p.date);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return postDate > sixMonthsAgo;
        }) ? "terkini" : "klasik",
        expertise: authors.length > 2 ? "beragam ahli" : authors.length > 0 ? "spesialis" : "berbagai sumber"
      };

      const { answer, confidence } = generateAnswer();
      const { context, tone } = contextAnalysis();
      const generateInsights = () => {
        const insights = [];
        if (total >= 3) insights.push(`Wuih! Ada **${total}** artikel seru yang membahas ini lho. Koleksi kamu lengkap banget!`);
        if (topNouns.length >= 3) insights.push(`Kalau kuperhatikan, fokus pembicaraannya banyak seputar **${topNouns.slice(0, 3).join(", ")}**.`);
        if (qualityMetrics.recency === "terkini") insights.push("Oiya, semua datanya juga *update* banget, jadi informasinya masih sangat relevan.");
        if (categories.length > 1) insights.push(`Ilmunya dibahas dari berbagai sisi, mulai dari **${categories.join(" sampai ")}**. Menarik ya?`);
        return insights.length > 0 ? insights : ["Koleksi artikel ini bakal kasih kamu wawasan yang berharga banget tentang topik ini. ✨"];
      };

      const topRelatedArticles = (limitedSource || [])
        .sort((a, b) => {
          // 1. Prioritize Search Score (Relevance)
          if ((b.searchScore || 0) !== (a.searchScore || 0)) {
            return (b.searchScore || 0) - (a.searchScore || 0);
          }
          // 2. Secondary: Popularity/Rating
          return (b.rating + b.views / 1000) - (a.rating + a.views / 1000);
        })
        .slice(0, 3);

      const activeQuestionType = Object.entries(intents).find(([, value]) => value)?.[0] || "general";

      setAiAnalysis({
        total,
        authors,
        categories,
        popularLabels,
        topKeywords: topNouns.slice(0, 5),
        answer,
        confidence,
        context,
        tone,
        qualityMetrics,
        insights: generateInsights(),
        topRelatedArticles,
        questionType: activeQuestionType
      });
      setIsThinking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchTerm, filteredBlogs, allBlogs]);

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
        <div className="text-gray-100 text-sm sm:text-base leading-relaxed bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-cyan-500/20 prose prose-invert prose-sm sm:prose-base max-w-none">
          {isThinking ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              Menganalisis konten dan menyusun jawaban...
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                strong: ({ node, ...props }) => <strong className="text-cyan-300 font-bold" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-white mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-md font-bold text-white mb-1" {...props} />,
              }}
            >
              {aiAnalysis.answer}
            </ReactMarkdown>
          )}
        </div>
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
                  <div className="prose prose-invert prose-xs">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                  </div>
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
          🤖 Analisis AI didukung oleh SaipulAI • Data diverifikasi real-time • Terakhir diperbarui secara real-time
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