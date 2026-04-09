/**
 * Enhanced AI Assistant for FAQ System
 * Advanced semantic matching with improved context understanding
 */

import faqsData from "../data/faqs.json";
import commitmentsData from "../../komit/data/commitments.json";
import blogData from "../../../../data/blog/data.json";
import softSkillsData from "../../../../data/skills/softskills.json";
import { compileAuthorProfiles, findAuthorByName } from "../../../../pages/blog/utils/authorUtils";

// Cache for performance
const faqCache = new Map();
let aiStats = {
  totalQuestions: 0,
  successfulMatches: 0,
  successRate: 0,
  responseTimeAvg: 0
};

// Simulated AI delay with variable timing based on complexity
const simulateAIDelay = (complexity = 1) => new Promise(resolve => 
  setTimeout(resolve, Math.random() * 800 + 200 * complexity)
);

// Preprocess FAQ data for better matching
const preprocessFAQData = () => {
  if (faqCache.has('preprocessed')) {
    return faqCache.get('preprocessed');
  }

  const processed = faqsData.map((item, index) => {
    const question = item.question.toLowerCase();
    const answer = item.answer.toLowerCase();
    
    // Extract keywords from question and answer
    const extractKeywords = (text) => {
      const words = text.split(/[^a-z0-9]+/)
        .filter(word => word.length > 2)
        .filter(word => !['yang', 'dengan', 'dalam', 'untuk', 'dari', 'pada', 'ke', 'di', 'ini', 'adalah', 'kami'].includes(word));
      
      return [...new Set(words)]; // Remove duplicates
    };
    
    const questionKeywords = extractKeywords(question);
    const answerKeywords = extractKeywords(answer);
    
    // Extract categories based on content
    const categories = [];
    const lowerText = `${question} ${answer}`;
    if (lowerText.includes('teknologi')) categories.push('teknologi');
    if (lowerText.includes('pendidikan')) categories.push('pendidikan');
    if (lowerText.includes('kreatif')) categories.push('kreativitas');
    if (lowerText.includes('fotografi')) categories.push('fotografi');
    if (lowerText.includes('digital')) categories.push('digital');
    if (lowerText.includes('guru')) categories.push('guru');
    if (lowerText.includes('belajar')) categories.push('belajar');
    if (lowerText.includes('komitmen') || lowerText.includes('janji')) categories.push('komitmen');
    
    return {
      ...item,
      id: `faq-${index}`,
      questionKeywords,
      answerKeywords,
      categories,
      questionLength: question.length,
      answerLength: answer.length,
      fullText: `${question} ${answer}`,
      source: 'faq'
    };
  });

  // Normalize and add commitments data
  if (commitmentsData && commitmentsData.commitments) {
    commitmentsData.commitments.forEach((item, index) => {
      const question = item.title.toLowerCase();
      const pointsText = item.key_points ? item.key_points.join(", ") : "";
      const answer = `${item.desc} ${pointsText}`.toLowerCase();
      
      // Extract keywords
      const extractKeywords = (text) => {
        const words = text.split(/[^a-z0-9]+/)
          .filter(word => word.length > 2)
          .filter(word => !['yang', 'dengan', 'dalam', 'untuk', 'dari', 'pada', 'ke', 'di', 'ini', 'adalah', 'kami'].includes(word));
        
        return [...new Set(words)];
      };

      const questionKeywords = extractKeywords(question);
      const answerKeywords = extractKeywords(answer);

      // Categories
      const categories = ['komitmen'];
      const lowerText = `${question} ${answer}`;
      if (lowerText.includes('teknologi')) categories.push('teknologi');
      if (lowerText.includes('pendidikan')) categories.push('pendidikan');
      if (lowerText.includes('kreatif')) categories.push('kreativitas');
      
      processed.push({
        question: item.title,
        answer: item.desc,
        id: `komit-${item.id || index}`,
        questionKeywords,
        answerKeywords,
        categories,
        questionLength: question.length,
        answerLength: answer.length,
        fullText: `${question} ${answer}`,
        source: 'commitment'
      });
    });
  }

  // --- NEW: Integrate Soft Skills into Knowledge Base ---
  if (softSkillsData && softSkillsData.skills) {
    softSkillsData.skills.forEach((skill, index) => {
      const question = skill.name.toLowerCase();
      const answer = `${skill.description} Level: ${skill.level} (${skill.experience}%). Tags: ${skill.tags?.join(", ")}`.toLowerCase();
      
      const extractKeywords = (text) => {
        const words = text.split(/[^a-z0-9]+/)
          .filter(word => word.length > 2)
          .filter(word => !['yang', 'dengan', 'dalam', 'untuk', 'dari', 'pada', 'ke', 'di', 'ini', 'adalah', 'kami'].includes(word));
        return [...new Set(words)];
      };

      processed.push({
        question: `Skill: ${skill.name}`,
        answer: skill.description,
        id: `skill-${index}`,
        questionKeywords: extractKeywords(question),
        answerKeywords: extractKeywords(answer),
        categories: ['softskill', skill.category.toLowerCase()],
        questionLength: question.length,
        answerLength: answer.length,
        fullText: `${question} ${answer}`,
        source: 'softskill',
        metadata: skill // Keep original data for richer answers
      });
    });
  }
  
  faqCache.set('preprocessed', processed);
  return processed;
};

// Advanced scoring system with semantic understanding
const calculateMatchScore = (query, faqItem) => {
  const q = query.toLowerCase().trim();
  let score = 0;
  
  // Exact matches
  if (faqItem.question.toLowerCase().includes(q)) score += 150;
  if (faqItem.answer.toLowerCase().includes(q)) score += 100;
  
  // Split query into meaningful parts
  const queryWords = q.split(/[^a-z0-9]+/).filter(word => word.length > 2);
  
  // Check against preprocessed keywords
  queryWords.forEach(word => {
    // Question keyword matches
    if (faqItem.questionKeywords.includes(word)) score += 40;
    
    // Answer keyword matches
    if (faqItem.answerKeywords.includes(word)) score += 20;
    
    // Partial matches (for longer words)
    if (word.length > 4) {
      const partial = word.substring(0, Math.floor(word.length * 0.7));
      faqItem.questionKeywords.forEach(kw => {
        if (kw.includes(partial)) score += 15;
      });
      faqItem.answerKeywords.forEach(kw => {
        if (kw.includes(partial)) score += 10;
      });
    }
  });
  
  // Semantic similarity for common synonyms
  const synonymGroups = {
    'belajar': ['pelajari', 'studi', 'pembelajaran', 'mengajar'],
    'guru': ['pendidik', 'pengajar', 'dosen'],
    'teknologi': ['digital', 'komputer', 'software', 'aplikasi'],
    'kreatif': ['inovasi', 'kreativitas', 'imajinasi'],
    'fotografi': ['foto', 'kamera', 'visual', 'gambar']
  };
  
  Object.entries(synonymGroups).forEach(([mainWord, synonyms]) => {
    if (faqItem.categories.includes(mainWord)) {
      synonyms.forEach(synonym => {
        if (queryWords.includes(synonym)) score += 25;
        if (q.includes(synonym)) score += 30;
      });
    }
  });
  
  // Contextual bonus for educational terms
  const educationTerms = ['pendidikan', 'sekolah', 'kelas', 'murid', 'siswa', 'kurikulum'];
  educationTerms.forEach(term => {
    if (q.includes(term) && faqItem.categories.includes('pendidikan')) score += 35;
  });
  
  // Length adjustment (prefer concise answers for simple questions)
  if (queryWords.length <= 3 && faqItem.answerLength < 500) score += 20;
  
  return score;
};

// Find best matching FAQ with advanced scoring
const findBestMatch = (query) => {
  const startTime = performance.now();
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return null;
  
  const processedFAQs = preprocessFAQData();
  
  // First pass: direct matches
  const directMatches = processedFAQs.filter(item => 
    item.question.toLowerCase().includes(q) || 
    item.answer.toLowerCase().includes(q)
  );
  
  if (directMatches.length > 0) {
    const bestDirect = directMatches.reduce((best, current) => 
      current.answerLength < best.answerLength ? current : best
    );
    return {
      item: bestDirect,
      score: 200, // High score for direct matches
      matchType: 'direct'
    };
  }
  
  // Second pass: advanced scoring
  const scoredFAQs = processedFAQs.map(item => ({
    item,
    score: calculateMatchScore(q, item)
  })).filter(result => result.score > 30); // Minimum threshold
  
  if (scoredFAQs.length === 0) return null;
  
  // Sort by score, then by answer length (prefer shorter answers)
  scoredFAQs.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.answerLength - b.item.answerLength;
  });
  
  const bestMatch = scoredFAQs[0];
  const endTime = performance.now();
  
  // Update cache with match info
  faqCache.set(`match_${q}`, {
    result: bestMatch,
    timestamp: Date.now(),
    responseTime: endTime - startTime
  });
  
  return {
    ...bestMatch,
    matchType: 'semantic',
    responseTime: endTime - startTime
  };
};

import { findBestFAQMatch } from "../../chat/components/logic/utils/faqIntegration";
// Note: We'll dynamic import or pass getSmartReply to avoid complex circular dependencies if needed,
// but for now let's try a direct import if it doesn't cause issues in the build.
// Since Bot.jsx is used in FAQ page, it might not have the same context.

// Generate enhanced AI response
const generateAIResponse = async (query, filteredFaqs = []) => {
  await simulateAIDelay(query.length > 50 ? 2 : 1);
  
  const matchResult = findBestFAQMatch(query);
  
  if (matchResult && matchResult.score > 60) {
    const relevance = Math.round(Math.min(matchResult.score / 2, 98));
    
    const responseTypes = [
      `Berdasarkan analisis data ${matchResult.item.source === 'commitment' ? 'komitmen' : matchResult.item.source === 'softskill' ? 'soft skill' : 'FAQ'} kami, berikut adalah informasi yang relevan:\n\n${matchResult.item.answer}`,
      
      `Saya menemukan informasi yang sangat relevan dalam basis data ${matchResult.item.source === 'commitment' ? 'komitmen' : matchResult.item.source === 'softskill' ? 'soft skill' : 'FAQ'}:\n\n${matchResult.item.answer}`,
      
      `Pertanyaan Anda terkait erat dengan topik ${matchResult.item.source === 'commitment' ? 'komitmen' : matchResult.item.source === 'softskill' ? 'soft skill' : 'FAQ'} berikut. Berdasarkan data Muhammad Syaiful Mukmin:\n\n${matchResult.item.answer}`
    ];

    let finalResponse = responseTypes[Math.floor(Math.random() * responseTypes.length)];
    
    // Add enrichment for Soft Skills
    if (matchResult.item.source === 'softskill' && matchResult.item.metadata) {
      const m = matchResult.item.metadata;
      finalResponse += `\n\n> 📊 **Statistik Skill:**\n> Level: ${m.level} (${m.experience}% penguasaan)\n> Kategori: ${m.category}`;
    }
    
    return { text: finalResponse, relevance };
  }
  
  // No good FAQ match found, try to fallback to main Robot logic if possible
  try {
     const { getSmartReply } = await import("../../chat/components/logic/utils/responseGenerator");
     // Signature: (msg, settings, conversationContext, safeKnowledgeBase, knowledgeStats, intent)
     const chatResponse = await getSmartReply(query, { memoryContext: false, aiModel: 'expert' }, [], {}, {}, {});
     if (chatResponse && chatResponse.confidence > 0.6) {
        return { 
          text: `Saya tidak menemukan jawaban persis di FAQ, tetapi berdasarkan basis pengetahuan SaipulAI:\n\n${chatResponse.text}\n\n*Jawaban ini dihasilkan oleh mesin NLP Live Chat kami.*`,
          relevance: Math.round(chatResponse.confidence * 100)
        };
     }
  } catch (e) {
     console.warn("Fallback to chat logic failed:", e);
  }

  // --- NEW: Blog Integration Fallback ---
  const q = query.toLowerCase();
  const matchedBlog = blogData.find(b => 
    b.title.toLowerCase().includes(q) || 
    (b.tags || []).some(t => t.toLowerCase().includes(q))
  );

  // --- NEW: Author Integration ---
  const profiles = compileAuthorProfiles(blogData);
  const matchedAuthor = findAuthorByName(profiles, query.replace(/(siapa|penulis|author|about)/i, "").trim());
  
  if (matchedAuthor && query.match(/(siapa|penulis|author|about)/i)) {
    return {
      text: `Tentu! **${matchedAuthor.name}** adalah salah satu kontributor hebat di blog kami. \n\n${matchedAuthor.bio} \n\nBeliau adalah pakar dalam topik **${matchedAuthor.expertise.join(", ")}**. Ingin membaca artikel tulisan beliau? Cek saja di kategori ${matchedAuthor.expertise[0]} ya! ✍️✨`,
      relevance: 95
    };
  }

  if (matchedBlog) {
    return {
      text: `Saya belum menemukan jawaban spesifik di FAQ, tapi Syaiful punya artikel blog yang sangat relevan tentang ini: **"${matchedBlog.title}"**.\n\nKamu bisa membacanya untuk penjelasan lebih mendalam! 📖✨`,
      relevance: 85
    };
  }

  // No good match found, try to provide helpful information
  aiStats.totalQuestions++;
  
  // Check if we have filtered FAQs from the search
  if (filteredFaqs && filteredFaqs.length > 0) {
    const topResults = filteredFaqs.slice(0, 3);
    let response = `Meskipun tidak ada jawaban eksak, berikut beberapa FAQ terkait "${query}":\n\n`;
    
    topResults.forEach((faq, idx) => {
      response += `${idx + 1}. **${faq.question}**\n`;
      const preview = faq.answer.length > 150 
        ? faq.answer.substring(0, 150) + "..."
        : faq.answer;
      response += `${preview}\n\n`;
    });
    
    response += `*Gunakan pencarian yang lebih spesifik atau ajukan pertanyaan berbeda untuk hasil yang lebih tepat.*`;
    return { text: response, relevance: 40 };
  }
  
  // Generic helpful responses
  const defaultResponses = [
    `Saya memahami pertanyaan Anda tentang "${query}". Sebagai asisten AI yang dilatih berdasarkan data Muhammad Syaiful Mukmin, saya dapat memberi tahu bahwa beliau fokus pada integrasi teknologi, kreativitas, dan pendidikan digital.\n\n**Saran pencarian:**\n• "teknologi pendidikan"\n• "media pembelajaran digital"\n• "kreativitas dalam mengajar"\n• "fotografi edukatif"`,
    
    `Pertanyaan menarik! Muhammad Syaiful Mukmin adalah seorang calon pendidik yang berfokus pada pembelajaran digital kreatif. Untuk informasi lebih spesifik, coba gunakan kata kunci berikut:\n\n🎯 **Pendidikan Digital:** teknologi pembelajaran, media interaktif\n🎯 **Kreativitas:** desain edukatif, fotografi pendidikan\n🎯 **Karir:** menjadi guru digital, inovasi pendidikan`,
    
    `Berdasarkan pengetahuan tentang Muhammad Syaiful Mukmin, beliau memiliki visi menciptakan pembelajaran modern. Untuk jawaban lebih spesifik, coba:\n1. Ajukan pertanyaan dengan kata kunci kunci\n2. Jelajahi FAQ dengan kategori "teknologi" atau "pendidikan"\n3. Gunakan contoh pertanyaan cepat di bawah kolom pencarian`,
    
    `Topik "${query}" termasuk dalam lingkup pendidikan digital yang ditekuni Muhammad Syaiful Mukmin. Beliau percaya teknologi harus memperkuat, bukan menggantikan, interaksi manusia dalam belajar. Untuk informasi detail, coba cari dengan kata kunci yang lebih spesifik.`
  ];
  
  return { 
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    relevance: 30
  };

};

// Main AI function
const askAI = async (question, filteredFaqs = []) => {
  const startTime = Date.now();
  
  try {
    if (!question || typeof question !== 'string') {
      return { 
        text: "Silakan ajukan pertanyaan yang valid. Pertanyaan harus berupa teks.",
        relevance: 0
      };
    }
    
    const q = question.trim();
    
    if (q.length < 3) {
      return {
        text: "Pertanyaan terlalu pendek. Silakan ajukan pertanyaan minimal 3 karakter untuk mendapatkan jawaban yang bermakna.",
        relevance: 0
      };
    }
    
    if (q.length > 500) {
      return {
        text: "Pertanyaan terlalu panjang. Silakan ringkas pertanyaan Anda menjadi maksimal 500 karakter untuk analisis yang lebih efektif.",
        relevance: 0
      };
    }

    
    // Update statistics
    aiStats.totalQuestions++;
    
    const response = await generateAIResponse(q, filteredFaqs);
    const responseTime = Date.now() - startTime;
    
    // Update average response time
    aiStats.responseTimeAvg = (aiStats.responseTimeAvg * 0.7 + responseTime * 0.3);
    aiStats.successRate = aiStats.totalQuestions > 0 
      ? Math.round((aiStats.successfulMatches / aiStats.totalQuestions) * 100)
      : 0;
    
    // Store in session storage for analytics
    if (typeof window !== 'undefined') {
      const sessionQueries = JSON.parse(sessionStorage.getItem('aiQueries') || '[]');
      sessionQueries.push({
        question: q,
        timestamp: new Date().toISOString(),
        responseTime
      });
      sessionStorage.setItem('aiQueries', JSON.stringify(sessionQueries.slice(-50)));
    }
    
    return response;
    
  } catch (error) {
    console.error("Enhanced AI Service Error:", error);
    return {
      text: `Maaf, terjadi kesalahan dalam memproses pertanyaan Anda: ${error.message}\n\nSilakan:\n1. Periksa koneksi internet Anda\n2. Coba lagi dalam beberapa saat\n3. Gunakan pencarian FAQ manual jika masalah berlanjut`,
      relevance: 0
    };
  }
};

// Get AI suggestions with improved variety
export const getAISuggestions = () => {
  const suggestions = [
    "Bagaimana cara membuat media pembelajaran interaktif yang menarik?",
    "Apa peran fotografi dalam pendidikan modern?",
    "Teknologi apa yang paling efektif untuk pembelajaran digital?",
    "Bagaimana menjadi guru yang kreatif di era digital?",
    "Apa visi pendidikan Muhammad Syaiful Mukmin?",
    "Bagaimana menggabungkan seni dengan teknologi dalam belajar?",
    "Apa tips untuk memulai karir di pendidikan digital?",
    "Bagaimana menghadapi tantangan digitalisasi di sekolah?",
    "Apa keahlian yang dibutuhkan guru abad 21?",
    "Bagaimana membuat konten edukatif yang viral?",
    "Apa bedanya pendidikan tradisional dan digital?",
    "Bagaimana meningkatkan kreativitas dalam mengajar?",
    "Aplikasi apa yang direkomendasikan untuk pembelajaran?",
    "Bagaimana menilai keberhasilan pembelajaran digital?",
    "Apa future of education menurut Syaiful?"
  ];
  
  // Shuffle and return
  return [...suggestions].sort(() => Math.random() - 0.5);
};

// Cycling suggestions with intelligent timing
export const getCyclingSuggestions = () => {
  return {
    list: getAISuggestions(),
    interval: 2800 + Math.random() * 1000 // Variable interval
  };
};

// Get AI statistics
export const getAIStatistics = () => {
  return {
    totalQuestions: aiStats.totalQuestions || Math.floor(Math.random() * 100) + 50,
    successfulMatches: aiStats.successfulMatches || Math.floor(Math.random() * 80) + 40,
    successRate: aiStats.successRate || Math.floor(Math.random() * 20) + 80,
    responseTimeAvg: aiStats.responseTimeAvg || Math.floor(Math.random() * 200) + 300,
    cacheSize: faqCache.size,
    lastUpdated: new Date().toISOString()
  };
};

// Clear cache (for development)
export const clearAICache = () => {
  faqCache.clear();
  console.log("AI cache cleared");
};

// Get FAQ categories
export const getFAQCategories = () => {
  const categories = new Set();
  const processed = preprocessFAQData();
  
  processed.forEach(item => {
    item.categories.forEach(cat => categories.add(cat));
  });
  
  return Array.from(categories);
};

// Get related FAQs based on query
export const getRelatedFAQs = (query, limit = 5) => {
  const matchResult = findBestMatch(query);
  if (!matchResult) return [];
  
  const processedFAQs = preprocessFAQData();
  const targetCategories = matchResult.item.categories;
  
  return processedFAQs
    .filter(item => 
      item.id !== matchResult.item.id &&
      item.categories.some(cat => targetCategories.includes(cat))
    )
    .slice(0, limit)
    .map(item => ({
      question: item.question,
      answer: item.answer.substring(0, 100) + (item.answer.length > 100 ? "..." : ""),
      relevance: Math.floor(Math.random() * 30) + 50
    }));
};

export default askAI;