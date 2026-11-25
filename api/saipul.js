/**
 * SaipulAI Public REST API Handler
 * Standalone Serverless, Netlify Functions, & Node.js Endpoint
 * Version: 8.0.0 (Unified Dual-Engine Harmonization)
 * 
 * Fitur & Keamanan:
 * - Terpadu dengan Mesin On-Device SaipulAI (NLU, Math Engine, Analytics, Emotion & Context)
 * - Pemahaman Semantik Leksikal & Kontekstual Kata, Termasuk Deteksi Sarkasme & Inversi Makna
 * - Logika Matematika Lanjutan ("The Golden Synthesis"): Persamaan Linear, Kuadrat Rumus ABC, Integral, Turunan, Titik Ribuan Indonesia
 * - Mesin Analitik Deterministik: Kalkulator Statistik Eksak (Mean, Median, Modus, Varians, Deviasi Standar) & Proyeksi Tren
 * - Pemahaman Obrolan Ringan, Sapaan Alami, dan Dinamika Multi-Turn Conversation History
 * - Bebas dari kebocoran token/kredensial internal
 * - Penyaringan data sensitif (PII) tanpa duplikasi
 * - Rate limiting aman dengan proteksi kebocoran memori (OOM)
 * - Kompatibilitas Multi-Runtime: Vite dev/preview, Node.js HTTP, Express, dan Netlify Serverless
 */

import { solveMathQuery } from '../src/components/helpbutton/chat/components/logic/utils/mathEngine.js';
import { analyzeSentiment, detectSarcasmAndIrony } from '../src/components/helpbutton/chat/components/logic/utils/nluProcessing.js';
import { generatePrediction, analyzeData, calculateStatistics } from '../src/components/helpbutton/chat/components/logic/utils/analytics.js';
import { ConversationContextManager, analyzeQueryDynamics } from '../src/components/helpbutton/chat/components/logic/utils/conversationContext.js';
import { detectEmotion } from '../src/components/helpbutton/chat/components/logic/utils/emotionEngine.js';
import { classifyIntent } from '../src/components/helpbutton/chat/components/logic/utils/advancedIntentClassifier.js';
import { recognizeGreeting } from '../src/components/helpbutton/chat/components/logic/utils/greetingRecognizer.js';
import { getUnifiedKnowledgeBase } from '../src/utils/ai/knowledgeBase.js';
import { smartKBQuery } from '../src/components/helpbutton/chat/components/logic/utils/smartKBQuery.js';
import { getKnowledgeResponse } from '../src/components/helpbutton/chat/components/logic/utils/knowledgeBase.js';
import { processDeepNeuralQuery, formatNeuralAnswer } from '../src/utils/ai/neural/deepNeuralPipeline.js';

// Konfigurasi Batas Keamanan & Rate Limiting
const RATE_LIMIT_WINDOW_MS = 60000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 30; // Maksimal 30 request/menit per IP
const MAX_RATE_LIMIT_ENTRIES = 5000; // Batas memori maksimum entri IP
const MAX_PAYLOAD_BYTES = 64 * 1024; // Maksimal 64 KB per payload body
const MAX_QUERY_LENGTH = 2500; // Maksimal 2500 karakter per query/message
const MAX_HISTORY_ITEMS = 10; // Maksimal 10 putaran dialog pada multi-turn history

// In-memory rate limiting map (IP -> timestamps) dengan proteksi OOM
const rateLimitMap = new Map();
let lastCleanupTime = Date.now();

// Pembersihan berkala untuk mencegah kebocoran memori (OOM)
function pruneRateLimits(now) {
  if (now - lastCleanupTime < RATE_LIMIT_WINDOW_MS && rateLimitMap.size < MAX_RATE_LIMIT_ENTRIES) {
    return;
  }
  lastCleanupTime = now;
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validTimestamps);
    }
  }
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    const excess = rateLimitMap.size - MAX_RATE_LIMIT_ENTRIES;
    const keys = rateLimitMap.keys();
    for (let i = 0; i < excess; i++) {
      const nextKey = keys.next().value;
      if (nextKey) rateLimitMap.delete(nextKey);
    }
  }
}

/**
 * Sanitasi dan pembatasan riwayat dialog (history) untuk mencegah object pollution & memory bomb
 */
export function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-MAX_HISTORY_ITEMS).map(item => {
    if (!item || typeof item !== 'object') return null;
    const content = String(item.content || item.text || item.message || '').slice(0, MAX_QUERY_LENGTH).trim();
    if (!content) return null;
    return {
      role: String(item.role || 'user').slice(0, 20),
      content
    };
  }).filter(Boolean);
}

// Pola deteksi data sensitif (PII) tanpa duplikasi
const PII_PATTERNS = [
  /\b\d{16}\b/, // Nomor kartu kredit/debit atau NIK 16 digit
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b.*(?:password|kata\s*sandi|pin\b)/i, // Email + password
  /(?:password|kata\s*sandi|pin|cvv|cvc)\s*[:=]\s*\S+/i // Token/password eksplisit
];

// Deteksi Bahasa Cerdas berbasis Frekuensi & Makna Kata
const EN_WORDS = new Set(['the', 'is', 'are', 'you', 'what', 'how', 'why', 'who', 'when', 'where', 'hello', 'hi', 'thanks', 'thank', 'can', 'please', 'help', 'project', 'about', 'calculate', 'good']);
const ID_WORDS = new Set(['yang', 'adalah', 'kamu', 'apa', 'bagaimana', 'kenapa', 'mengapa', 'siapa', 'kapan', 'dimana', 'halo', 'hai', 'terima', 'kasih', 'bisa', 'tolong', 'bantu', 'proyek', 'tentang', 'hitung', 'selamat']);

export function detectLanguage(text) {
  const words = String(text || '').toLowerCase().split(/[\s,?.!]+/);
  let idCount = 0;
  let enCount = 0;

  words.forEach(w => {
    if (ID_WORDS.has(w)) idCount++;
    if (EN_WORDS.has(w)) enCount++;
  });

  if (enCount > idCount) return 'en';
  return 'id';
}

/**
 * Deteksi Sentimen Berbasis Struktur Bahasa & Konteks Kata
 */
export function detectSentiment(text) {
  const result = analyzeSentiment(text);
  return result.sentiment; // 'positive' | 'negative' | 'neutral'
}

// Cache Universal Knowledge Base untuk performa tinggi & konsistensi data
let unifiedKBCache = null;
export function getKnowledgeBase() {
  if (!unifiedKBCache) {
    try {
      unifiedKBCache = getUnifiedKnowledgeBase();
    } catch (e) {
      console.warn('Gagal memuat getUnifiedKnowledgeBase di api/saipul.js:', e);
      unifiedKBCache = {};
    }
  }
  return unifiedKBCache;
}

// Basis Pengetahuan Statis SaipulAI (Fallback & Definisi Cepat)
const KNOWLEDGE_BASE = {
  about_ai: {
    id: "SaipulAI  v8.0.0 mengusung arsitektur Dual-Engine terpadu yang telah diselaraskan 100%: 1) Mesin On-Device Browser untuk inferensi lokal, privasi penuh, dan integrasi berkas di HelpButton & Live Room, serta 2) Public REST API mandiri di /api/saipul yang kini ditenagai modul NLU, Matematika Lanjutan, Analitik Data, dan Konteks Percakapan yang sama persis.",
    en: "SaipulAI  v8.0.0 features a fully aligned Dual-Engine architecture: 1) On-Device In-Browser inference for 100% privacy and local file ingestion, and 2) Standalone Public REST API at /api/saipul powered by the identical advanced NLU, Math Engine, Analytics, and Conversational Context."
  },
  author_profile: {
    id: "Muhammad Syaiful Mukmin adalah seorang calon pendidik dan pengembang web inovatif lulusan S1 PGMI UIN Antasari Banjarmasin. Berkomitmen menggabungkan teknologi, kreativitas, dan edukasi dalam menciptakan aplikasi modern yang berdampak nyata.",
    en: "Muhammad Syaiful Mukmin is an educator and innovative web developer graduated with a Bachelor's in Primary Education (PGMI) from UIN Antasari Banjarmasin, combining technology, creativity, and education."
  },
  projects: {
    id: "Syaiful telah mengembangkan lebih dari 22+ proyek aplikasi interaktif, meliputi Website Portofolio Cosmic Glass, Sistem Asisten SaipulAI, Platform Komunitas Live Discussion, Manajemen Blog, dan Media Edukasi Digital.",
    en: "Syaiful has developed over 22+ interactive projects, including the Cosmic Glass Portfolio, SaipulAI Assistant System, Live Discussion Community Platform, Blog Management, and Digital Educational Tools."
  },
  skills_tech: {
    id: "Tech stack utama yang dikuasai mencakup React 19, JavaScript modern (ESM), Vite, Tailwind CSS v4, Three.js (@react-three/fiber), Supabase, Node.js, NLP lokal, dan arsitektur glassmorphism responsif.",
    en: "Core tech stack includes React 19, modern JavaScript (ESM), Vite, Tailwind CSS v4, Three.js (@react-three/fiber), Supabase, Node.js, on-device NLP, and responsive glassmorphism UI."
  },
  contact: {
    id: "Anda dapat menghubungi Muhammad Syaiful Mukmin melalui email resmi di form kontak (/contact), Instagram (@saipul16_), LinkedIn (linkedin.com/in/saipul16_), atau Twitter/YouTube (@saipul16_).",
    en: "You can reach Muhammad Syaiful Mukmin via the portfolio contact form (/contact), Instagram (@saipul16_), LinkedIn (linkedin.com/in/saipul16_), or Twitter/YouTube (@saipul16_)."
  },
  education: {
    id: "Pendidikan: Muhammad Syaiful Mukmin menempuh studi sarjana S1 Pendidikan Guru Madrasah Ibtidaiyah (PGMI) di Universitas Islam Negeri (UIN) Antasari Banjarmasin.",
    en: "Education: Muhammad Syaiful Mukmin earned his Bachelor's degree in Primary Teacher Education (PGMI) from State Islamic University (UIN) Antasari Banjarmasin."
  },
  ai_definition: {
    id: "Kecerdasan Buatan (Artificial Intelligence) adalah simulasi kecerdasan manusia oleh sistem komputasi, mencakup penalaran, pembelajaran dari data, representasi pengetahuan, dan pemecahan masalah.",
    en: "Artificial Intelligence (AI) is the simulation of human intelligence by computer systems, encompassing reasoning, learning, knowledge representation, and problem-solving."
  },
  machine_learning: {
    id: "Machine Learning (ML) adalah cabang AI yang memungkinkan sistem komputer belajar dan meningkatkan performa secara otomatis dari pengalaman tanpa diprogram secara eksplisit.",
    en: "Machine Learning (ML) is a branch of AI that enables computer systems to learn and improve performance automatically from experience without explicit programming."
  },
  deep_learning: {
    id: "Deep Learning adalah subbidang Machine Learning yang memanfaatkan Artificial Neural Networks berlapis-lapis (Deep Neural Networks) untuk mempelajari representasi data tingkat tinggi.",
    en: "Deep Learning is a subset of Machine Learning that uses multi-layered Artificial Neural Networks to learn hierarchical data representations."
  },
  web_tech: {
    id: "HTML (HyperText Markup Language) adalah bahasa standar struktur halaman web, CSS mengatur tata visual dan estetika, sedangkan JavaScript menghadirkan logika interaktif dinamis.",
    en: "HTML is the standard language for structuring web pages, CSS styles the layout and visual presentation, while JavaScript provides interactive logic."
  }
};

/**
 * Mesin Respon NLP Semantik Terpadu SaipulAI
 * Menghubungkan SaipulAI API dengan seluruh kemampuan inti On-Device Engine
 * @param {string} query - Teks pertanyaan pengguna
 * @param {string|object} opts - Gaya respons string ('friendly' | 'formal') atau opsi objek { style, history }
 */
export function generateResponse(query, opts = 'friendly') {
  const options = typeof opts === 'string' ? { style: opts } : (opts || {});
  const { style = 'friendly', history = [] } = options;

  const rawText = String(query || '').trim();
  const text = rawText.toLowerCase();
  const lang = detectLanguage(rawText);

  // 1. Analisis Sentimen Leksikal & Deteksi Sarkasme/Ironi Struktur Kalimat
  const sarcasmAnalysis = detectSarcasmAndIrony(rawText);
  const sentimentAnalysis = analyzeSentiment(rawText);
  const detectedEmotion = detectEmotion(rawText);

  // 2. Analisis Konteks Percakapan Multi-turn (Riwayat Dialog)
  let contextManager = null;
  let queryDynamics = { isRepeat: false, isFollowUp: false, suggestedBridge: null };
  if (Array.isArray(history) && history.length > 0) {
    try {
      contextManager = new ConversationContextManager();
      history.forEach(item => {
        const msg = item.content || item.text || '';
        const sender = item.role === 'user' || item.from === 'user' ? 'user' : 'bot';
        if (msg) contextManager.addMessage(msg, { sender });
      });
      queryDynamics = analyzeQueryDynamics(rawText, contextManager.getContext());
    } catch {
      /* Abaikan error parsing konteks untuk keandalan API */
    }
  }

  // 3. Klasifikasi Intensi AI
  let intentClassification = null;
  try {
    intentClassification = classifyIntent(rawText);
  } catch {
    intentClassification = { type: 'general_query', confidence: 0.7 };
  }

  // 4. Logika Matematika Lanjutan ("The Golden Synthesis")
  // Mendukung linear (ax+b=c), kuadrat (rumus ABC), integral, turunan, titik ribuan Indonesia
  try {
    const mathSol = solveMathQuery(rawText);
    if (mathSol && mathSol.isMath && mathSol.answer) {
      return {
        reply: mathSol.answer,
        intent: 'calculation',
        operation: mathSol.operation || 'mathematics',
        math: mathSol,
        sentiment: sentimentAnalysis,
        emotion: detectedEmotion,
        language: lang
      };
    }
  } catch {
    /* Lanjut ke pemroses berikutnya */
  }

  // 5. Analisis Statistik Deterministik & Teori Probabilitas
  if (text.includes('rata-rata') || text.includes('mean') || text.includes('median') || text.includes('modus') || text.includes('statistik') || text.includes('probabilitas') || text.includes('peluang')) {
    try {
      const statResult = calculateStatistics(rawText);
      if (statResult) {
        return {
          reply: statResult,
          intent: 'statistics',
          sentiment: sentimentAnalysis,
          emotion: detectedEmotion,
          language: lang
        };
      }
    } catch {
      /* Lanjut jika terjadi kegagalan parser */
    }
  }

  // 6. Prediksi & Forecasting (Harga, Cuaca, Penjualan, Topik Umum)
  if (text.includes('prediksi') || text.includes('forecast') || text.includes('proyeksi') || text.includes('ramalan')) {
    try {
      let predType = 'umum';
      if (text.includes('harga') || text.includes('saham') || text.includes('crypto') || text.includes('kripto') || text.includes('emas')) predType = 'harga';
      else if (text.includes('cuaca') || text.includes('weather') || text.includes('hujan') || text.includes('suhu')) predType = 'cuaca';
      else if (text.includes('penjualan') || text.includes('sales') || text.includes('omset') || text.includes('omzet')) predType = 'penjualan';

      const predResult = generatePrediction(predType, rawText);
      if (predResult) {
        return {
          reply: predResult,
          intent: 'prediction',
          sentiment: sentimentAnalysis,
          emotion: detectedEmotion,
          language: lang
        };
      }
    } catch {
      /* Lanjut */
    }
  }

  // 7. Analisis Data & Kerangka Strategis Bisnis
  if (text.includes('analisis') && (text.includes('penjualan') || text.includes('keuangan') || text.includes('performa') || text.includes('efisiensi') || text.includes('data'))) {
    try {
      const analysisRes = analyzeData(rawText);
      if (analysisRes) {
        return {
          reply: analysisRes,
          intent: 'data_analysis',
          sentiment: sentimentAnalysis,
          emotion: detectedEmotion,
          language: lang
        };
      }
    } catch {
      /* Lanjut */
    }
  }

  // 8. Penanganan Keluhan Sarkasme & Makna Tersirat Khusus
  if (sarcasmAnalysis && sarcasmAnalysis.isSarcastic) {
    const sarcasticReply = lang === 'en'
      ? "I sincerely apologize for the inconvenience you experienced. Your feedback is crucial, and I want to help resolve it right away. Could you please specify which part needs improvement?"
      : "Mohon maaf sekali atas kendala yang kamu alami. Masukan ini sangat berharga, dan aku ingin membantu menyelesaikannya secepat mungkin. Bisakah ceritakan bagian mana yang perlu diperbaiki?";
    return {
      reply: sarcasticReply,
      intent: 'complaint_sarcasm',
      sarcasm: sarcasmAnalysis,
      sentiment: sentimentAnalysis,
      emotion: 'empathetic',
      language: lang
    };
  }

  // 9. Obrolan Santai, Sapaan & Basa-basi Alami (greetingRecognizer)
  try {
    const greetingMatch = recognizeGreeting(rawText);
    // Jika match adalah sapaan murni atau basa-basi (bukan pola pertanyaan generic seperti howTo/why yang butuh pengetahuan), langsung kembalikan
    const isGenericQuestion = greetingMatch?.patternType === 'howToQuestion' || greetingMatch?.patternType === 'whyQuestion';
    if (greetingMatch && greetingMatch.text && !isGenericQuestion) {
      let finalGreeting = greetingMatch.text;
      if (queryDynamics.suggestedBridge) {
        finalGreeting = `${queryDynamics.suggestedBridge}\n\n${finalGreeting}`;
      }
      const isSmallTalk = greetingMatch.patternType?.startsWith('smallTalk') ||
        greetingMatch.patternType?.includes('Chat') ||
        greetingMatch.patternType?.includes('Joke') ||
        greetingMatch.patternType?.includes('Tired');
      return {
        reply: finalGreeting,
        intent: isSmallTalk ? 'small_talk' : 'greeting',
        patternType: greetingMatch.patternType,
        sentiment: sentimentAnalysis,
        emotion: detectedEmotion,
        language: lang
      };
    }
  } catch {
    /* Lanjut */
  }

  // 10. Ucapan Terima Kasih (Gratitude)
  if (/\b(terima\s*kasih|thanks|thank\s*you|makasih|syukron|matur\s*nuwun)\b/i.test(text)) {
    const reply = lang === 'en'
      ? "You're very welcome! Let me know if you need anything else."
      : "Sama-sama! Senang bisa membantu. Beri tahu jika butuh bantuan lainnya ya.";
    return { reply, intent: 'thanks', sentiment: sentimentAnalysis, emotion: 'grateful', language: lang };
  }

  // 11. Penelusuran Pengetahuan Terpadu (Unified Knowledge Base & Mesin Pencari Cerdas)
  // Mengharmonisasi REST API & CLI dengan wawasan yang 100% identik dengan Chatbot HelpButton
  try {
    const kb = getKnowledgeBase();

    // 11a. Eksekusi getKnowledgeResponse (Metode Utama Chatbot HelpButton: Smart Fuzzy + Category + Direct Deep Neural Fallback)
    const kbRes = getKnowledgeResponse(rawText, kb, {
      creativeMode: style === 'creative' || style === 'detailed',
      responseStyle: style
    });

    if (kbRes && kbRes.text) {
      let rep = kbRes.text;
      if (queryDynamics.suggestedBridge && !rep.startsWith('Menyambung') && !rep.startsWith('Beralih')) {
        rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
      }
      return {
        reply: rep,
        intent: kbRes.source?.type || intentClassification?.intent || intentClassification?.type || 'knowledge_base',
        source: kbRes.source || { type: 'unified_knowledge_base' },
        confidence: kbRes.confidence || 0.92,
        sentiment: sentimentAnalysis,
        emotion: detectedEmotion,
        language: lang
      };
    }

    // 11b. Smart KB Query Multi-Strategy (Exact, Synonym, Fuzzy, Related Concepts & Local Deep Neural Reasoning)
    const smartResults = smartKBQuery(rawText, kb, {
      searchDepth: 'comprehensive',
      threshold: 0.35,
      maxResults: 1
    });

    if (smartResults && smartResults.length > 0 && smartResults[0].answer) {
      const best = smartResults[0];
      let rep = best.answer;
      if (queryDynamics.suggestedBridge) {
        rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
      }
      return {
        reply: rep,
        intent: best.source || 'smart_kb',
        source: {
          type: best.source,
          question: best.question,
          matchType: best.matchType,
          score: best.relevanceScore
        },
        confidence: best.relevanceScore || 0.88,
        sentiment: sentimentAnalysis,
        emotion: detectedEmotion,
        language: lang
      };
    }

    // 11c. Deep Neural Pipeline (Hybrid Progressive AI Level 1 + Level 2 Micro-Neural Reasoning)
    const neuralResult = processDeepNeuralQuery(rawText, kb);
    if (neuralResult && neuralResult.bestMatch && neuralResult.bestMatch.score >= 0.35) {
      const neuralAnswer = formatNeuralAnswer(neuralResult);
      if (neuralAnswer) {
        let rep = neuralAnswer;
        if (queryDynamics.suggestedBridge) {
          rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
        }
        return {
          reply: rep,
          intent: 'deep_neural',
          source: {
            type: 'deep_neural_pipeline',
            topClass: neuralResult.topClass,
            score: neuralResult.bestMatch.score,
            engine: neuralResult.engine
          },
          confidence: Math.min(0.95, 0.70 + (neuralResult.bestMatch.score * 0.25)),
          sentiment: sentimentAnalysis,
          emotion: detectedEmotion,
          language: lang
        };
      }
    }
  } catch (_kbErr) {
    console.warn('Pencarian Unified Knowledge Base gagal, beralih ke fallback sekunder:', _kbErr);
  }

  // 11. Spesifik: Riwayat Pendidikan & Kampus
  if (/\b(pendidikan|kuliah|kampus|universitas|uin|uin\s+antasari|pgmi|jurusan|gelar)\b/i.test(text)) {
    let rep = KNOWLEDGE_BASE.education[lang];
    if (queryDynamics.suggestedBridge) rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
    return { reply: rep, intent: 'education', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 12. Spesifik: Proyek & Karya Portofolio
  if (/\b(proyek|project|projects|karya|portofolio|portfolio|aplikasi\s+yang\s+dibuat)\b/i.test(text)) {
    let rep = KNOWLEDGE_BASE.projects[lang];
    if (queryDynamics.suggestedBridge) rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
    return { reply: rep, intent: 'projects', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 13. Spesifik: Kontak & Media Sosial
  if (/\b(kontak|contact|hubungi|email|instagram|github|linkedin|sosial\s*media|sosmed)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.contact[lang], intent: 'contact', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 14. Keahlian & Teknologi Web (HTML, CSS, JavaScript, React)
  if (/\b(html|css|javascript|js|react|frontend|web\s+development)\b/i.test(text)) {
    let rep = KNOWLEDGE_BASE.web_tech[lang];
    if (queryDynamics.suggestedBridge) rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
    return { reply: rep, intent: 'web_tech', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }
  if (/\b(keahlian|skill|skills|tech\s*stack|teknologi\s+apa)\b/i.test(text)) {
    let rep = KNOWLEDGE_BASE.skills_tech[lang];
    if (queryDynamics.suggestedBridge) rep = `${queryDynamics.suggestedBridge}\n\n${rep}`;
    return { reply: rep, intent: 'skills', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 15. Pengembang / Pembuat Portofolio (Muhammad Syaiful Mukmin)
  if (/\b(syaiful|mukmin|pembuat|author|creator|developer|biodata|profil\s+syaiful|siapa\s+syaiful)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.author_profile[lang], intent: 'author_profile', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 16. Identitas & Kapabilitas SaipulAI
  if (/\b(saipulai|saipul\s*ai|siapa\s+kamu|who\s+are\s+you|tentang\s+kamu|what\s+is\s+saipul)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.about_ai[lang], intent: 'about_ai', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 17. Konsep Machine Learning & AI
  if (/\b(machine\s+learning|\bml\b)\b/i.test(text) && !/\b\d+\s*ml\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.machine_learning[lang], intent: 'definition', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }
  if (/\b(deep\s+learning|dnn|neural\s+network)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.deep_learning[lang], intent: 'definition', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }
  if (/\b(kecerdasan\s+buatan|artificial\s+intelligence|apa\s+itu\s+ai|what\s+is\s+ai)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.ai_definition[lang], intent: 'definition', sentiment: sentimentAnalysis, emotion: detectedEmotion, language: lang };
  }

  // 18. Fallback Dinamis & Informatif
  let fallback = lang === 'en'
    ? "I understand your query. Could you please provide more context or specify a topic such as projects, skills, education, calculations, or analytics?"
    : "Saya mengerti pertanyaan Anda. Bisakah Anda memberikan detail yang lebih spesifik, seperti seputar proyek, keahlian, profil Syaiful Mukmin, perhitungan matematika, atau analisis data?";

  if (queryDynamics.suggestedBridge) {
    fallback = `${queryDynamics.suggestedBridge}\n\n${fallback}`;
  }

  return {
    reply: fallback,
    intent: intentClassification?.intent || intentClassification?.type || 'general_query',
    sentiment: sentimentAnalysis,
    emotion: detectedEmotion,
    language: lang
  };
}

/**
 * Helper membaca body request secara aman dengan batas ukuran payload (proteksi DoS/OOM)
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body) {
      if (typeof req.body === 'object') return resolve(req.body);
      if (typeof req.body === 'string') {
        if (Buffer.byteLength(req.body) > MAX_PAYLOAD_BYTES) {
          return reject(new Error('PAYLOAD_TOO_LARGE'));
        }
        try { return resolve(JSON.parse(req.body)); } catch (err) { return reject(err); }
      }
    }

    if (typeof req.on === 'function') {
      let data = '';
      let bytesRead = 0;
      let tooLarge = false;

      req.on('data', chunk => {
        if (tooLarge) return;
        bytesRead += chunk.length;
        if (bytesRead > MAX_PAYLOAD_BYTES) {
          tooLarge = true;
          if (typeof req.destroy === 'function') req.destroy();
          return reject(new Error('PAYLOAD_TOO_LARGE'));
        }
        data += chunk;
      });

      req.on('end', () => {
        if (tooLarge) return;
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch (err) {
          reject(err);
        }
      });
      req.on('error', (err) => reject(err));
      if (req.readableEnded && !tooLarge) resolve({});
    } else {
      resolve({});
    }
  });
}

/**
 * Mengalirkan respons menggunakan Server-Sent Events (SSE) token demi token
 */
const SECURITY_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const ALLOWED_PUBLIC_API_PATHS = new Set([
  '/api/saipul',
  '/api/saipul/',
  '/.netlify/functions/saipul',
  '/.netlify/functions/saipul/'
]);

const NOT_FOUND_ERROR_PAYLOAD = JSON.stringify({
  success: false,
  error: "Endpoint tidak tersedia. Hanya /api/saipul yang terbuka untuk akses publik."
});

export function extractRequestPathname(rawUrlOrPath) {
  if (typeof rawUrlOrPath !== 'string' || !rawUrlOrPath.trim()) return null;
  try {
    return new URL(rawUrlOrPath, 'http://localhost').pathname;
  } catch {
    return rawUrlOrPath.split('?')[0].split('#')[0];
  }
}

export function isAllowedPublicApiPath(rawUrlOrPath) {
  const pathname = extractRequestPathname(rawUrlOrPath);
  if (!pathname) return true; // Izinkan unit-test mock tanpa req.url/event.path
  return ALLOWED_PUBLIC_API_PATHS.has(pathname);
}

function applyRateLimit(rawIp) {
  const clientIp = String(rawIp || '127.0.0.1').slice(0, 45);
  const now = Date.now();
  pruneRateLimits(now);

  const timestamps = (rateLimitMap.get(clientIp) || []).filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);
  return false;
}

function buildSseMetadataPayload(resObj, query) {
  return {
    version: "8.0.0",
    query,
    intent: resObj.intent,
    source: resObj.source || null,
    confidence: resObj.confidence || null,
    sentiment: resObj.sentiment?.sentiment || 'neutral',
    emotion: resObj.emotion || 'neutral',
    language: resObj.language || detectLanguage(query),
    math: resObj.math || null
  };
}

function buildJsonResponsePayload(resObj, query) {
  return {
    success: true,
    version: "8.0.0",
    query,
    reply: resObj.reply,
    intent: resObj.intent,
    source: resObj.source || null,
    confidence: resObj.confidence || null,
    sentiment: resObj.sentiment?.sentiment || 'neutral',
    sentimentDetail: resObj.sentiment || null,
    emotion: resObj.emotion || 'neutral',
    math: resObj.math || null,
    language: resObj.language || detectLanguage(query),
    timestamp: new Date().toISOString()
  };
}

async function sendSseResponse(res, resObj, query, req) {
  res.writeHead(200, {
    ...SECURITY_HEADERS,
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  let clientDisconnected = false;
  if (typeof res.on === 'function') {
    res.on('close', () => { clientDisconnected = true; });
  }
  if (req && typeof req.on === 'function') {
    req.on('close', () => { clientDisconnected = true; });
  }

  // Kirim event pembuka (metadata awal)
  res.write(`event: metadata\ndata: ${JSON.stringify(buildSseMetadataPayload(resObj, query))}\n\n`);

  // Stream token kata demi kata
  const text = resObj.reply || '';
  const tokens = text.split(/(\s+)/);

  for (let i = 0; i < tokens.length; i++) {
    if (clientDisconnected) break;
    const token = tokens[i];
    if (token) {
      res.write(`event: token\ndata: ${JSON.stringify({ token, index: i })}\n\n`);
      // Ritme alami: jeda sejenak pada tanda baca
      let delay = 16;
      if (/[.!?]$/.test(token)) delay = 70;
      else if (/[,;:]$/.test(token)) delay = 35;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  if (!clientDisconnected) {
    // Kirim event selesai
    res.write(`event: done\ndata: ${JSON.stringify({
      done: true,
      fullText: text,
      timestamp: new Date().toISOString()
    })}\n\n`);
    res.end();
  }
}

/**
 * Format respons SSE untuk runtime Serverless (Netlify Functions)
 */
function formatNetlifySse(resObj, query, headers) {
  let sseBody = `event: metadata\ndata: ${JSON.stringify(buildSseMetadataPayload(resObj, query))}\n\n`;

  const tokens = (resObj.reply || '').split(/(\s+)/);
  tokens.forEach((t, i) => {
    if (t) sseBody += `event: token\ndata: ${JSON.stringify({ token: t, index: i })}\n\n`;
  });

  sseBody += `event: done\ndata: ${JSON.stringify({
    done: true,
    fullText: resObj.reply,
    timestamp: new Date().toISOString()
  })}\n\n`;

  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform'
    },
    body: sseBody
  };
}

/**
 * Universal Serverless HTTP Handler (Node.js, Vite Middleware, & Netlify Functions)
 */
export default async function handler(req, res) {
  // Kompatibilitas Netlify Functions / AWS Lambda: handler(event, context)
  if (req && !res && (req.httpMethod || req.rawUrl)) {
    return handleNetlifyEvent(req);
  }

  // Setup CORS & OWASP Security headers
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  // Pastikan hanya endpoint publik /api/saipul yang dapat diakses pihak ketiga
  if (!isAllowedPublicApiPath(req?.url)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end(NOT_FOUND_ERROR_PAYLOAD);
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // IP Rate Limiting
  const forwardedHeader = req.headers?.['x-forwarded-for'];
  const firstForwardedIp = typeof forwardedHeader === 'string'
    ? forwardedHeader.split(',')[0].trim()
    : (Array.isArray(forwardedHeader) ? forwardedHeader[0].trim() : null);
  const rawIp = firstForwardedIp || req.socket?.remoteAddress || '127.0.0.1';

  if (applyRateLimit(rawIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: false,
      error: "Terlalu banyak permintaan (Rate limit exceeded). Mohon coba lagi beberapa saat."
    }));
  }

  // GET Request (Healthcheck atau Quick Query)
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    const query = url.searchParams.get('q') || url.searchParams.get('message');

    if (!query) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        status: "online",
        service: "SaipulAI Unified Dual-Engine API",
        version: "8.0.0",
        architecture: "Harmonized Dual-Engine (Shared On-Device & REST API Intelligence)",
        description: "Ekosistem terpadu SaipulAI v8.0.0: Inferensi On-Device Browser dan REST API Serverless ditenagai Universal Knowledge Base (getUnifiedKnowledgeBase), smartKBQuery, Deep Neural Pipeline, NLU, Math Engine, Analitik Data, dan Konteks Percakapan yang selaras 100%.",
        capabilities: [
          "Streaming Respons Server-Sent Events (SSE): Streaming token kata demi kata real-time",
          "Pemahaman Semantik Kalimat & Deteksi Sarkasme / Inversi Valensi",
          "Universal Knowledge Base: 22+ Proyek, Sertifikat, Keahlian, Hobi, Bahasa, Artikel Blog, Dokumen AIDoc, dan Akademik KKN",
          "Mesin Pencari Cerdas: Pencarian multi-strategi (smartKBQuery) & penalaran semantik mendalam (processDeepNeuralQuery)",
          "Kalkulator Matematika Lanjutan: Persamaan Linear, Kuadrat ABC, Integral & Turunan",
          "Analitik Data Deterministik & Teori Probabilitas",
          "Prediksi & Proyeksi Tren (Harga, Cuaca, Penjualan, Topik Bebas)",
          "Memori Percakapan Multi-turn (History Payload Support)"
        ],
        endpoints: {
          chat: { method: "POST", path: "/api/saipul", body: { message: "string", style: "friendly|formal", stream: true } },
          stream: { method: "GET", path: "/api/saipul?q=YOUR_QUERY&stream=true" },
          quick: { method: "GET", path: "/api/saipul?q=YOUR_QUERY" }
        },
        security: "Zero Sensitive Keys Required • PII Filter Active • In-Memory Rate Limiting • 64KB Payload Limit • OWASP Headers"
      }));
    }

    if (query.length > MAX_QUERY_LENGTH) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        success: false,
        error: `Panjang karakter pertanyaan melebihi batas maksimum (${MAX_QUERY_LENGTH} karakter).`
      }));
    }

    const isStream = url.searchParams.get('stream') === 'true' ||
      url.searchParams.get('stream') === '1' ||
      url.searchParams.get('sse') === 'true' ||
      req.headers?.accept?.includes('text/event-stream');

    const resObj = generateResponse(query);

    if (isStream && typeof res.writeHead === 'function') {
      return sendSseResponse(res, resObj, query, req);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(buildJsonResponsePayload(resObj, query)));
  }

  // POST Request
  if (req.method === 'POST') {
    let parsed;
    try {
      parsed = await parseRequestBody(req);
    } catch (err) {
      if (err && err.message === 'PAYLOAD_TOO_LARGE') {
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: false,
          error: `Ukuran payload melebihi batas maksimum (${MAX_PAYLOAD_BYTES / 1024} KB).`
        }));
      }
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        success: false,
        error: "Format JSON tidak valid atau terjadi kesalahan parsing."
      }));
    }

    try {
      const message = parsed.message || parsed.query || parsed.text;
      const style = parsed.style || 'friendly';
      const history = parsed.history || parsed.conversationHistory || [];

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: false,
          error: "Parameter 'message' diperlukan dan tidak boleh kosong."
        }));
      }

      if (message.length > MAX_QUERY_LENGTH) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: false,
          error: `Panjang karakter pesan melebihi batas maksimum (${MAX_QUERY_LENGTH} karakter).`
        }));
      }

      // PII Security Check
      const hasPII = PII_PATTERNS.some(pat => pat.test(message));
      if (hasPII) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: false,
          error: "Pesan mengandung data sensitif (nomor kartu/NIK/password). Demi keamanan, permintaan ini ditolak."
        }));
      }

      const isStream = parsed.stream === true ||
        parsed.stream === 'true' ||
        parsed.sse === true ||
        req.headers?.accept?.includes('text/event-stream');

      const sanitizedHistory = sanitizeHistory(history);
      const resObj = generateResponse(message, { style, history: sanitizedHistory });

      if (isStream && typeof res.writeHead === 'function') {
        return sendSseResponse(res, resObj, message, req);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(buildJsonResponsePayload(resObj, message)));
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        success: false,
        error: "Terjadi kesalahan saat memproses permintaan JSON."
      }));
    }
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ success: false, error: "Metode HTTP tidak didukung. Gunakan GET atau POST." }));
}

/**
 * Handler Khusus saat berjalan di Netlify Functions / AWS Lambda
 */
async function handleNetlifyEvent(event) {
  const headers = {
    ...SECURITY_HEADERS,
    'Content-Type': 'application/json'
  };

  if (!isAllowedPublicApiPath(event.path || event.rawUrl)) {
    return { statusCode: 404, headers, body: NOT_FOUND_ERROR_PAYLOAD };
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Rate Limiting untuk Netlify Functions
  const rawIp = event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers?.['client-ip'] ||
    event.headers?.['x-real-ip'] ||
    event.requestContext?.identity?.sourceIp ||
    '127.0.0.1';

  if (applyRateLimit(rawIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Terlalu banyak permintaan (Rate limit exceeded). Mohon coba lagi beberapa saat."
      })
    };
  }

  if (event.httpMethod === 'GET') {
    const query = event.queryStringParameters?.q || event.queryStringParameters?.message;
    if (!query) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "online",
          service: "SaipulAI Unified Dual-Engine API",
          version: "8.0.0",
          architecture: "Harmonized Dual-Engine (Shared On-Device & REST API Intelligence)",
          description: "Ekosistem terpadu SaipulAI v8.0.0: Inferensi On-Device Browser dan REST API Serverless ditenagai Universal Knowledge Base (getUnifiedKnowledgeBase), smartKBQuery, Deep Neural Pipeline, NLU, Math Engine, Analitik Data, dan Konteks Percakapan yang selaras 100%."
        })
      };
    }

    if (query.length > MAX_QUERY_LENGTH) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Panjang karakter pertanyaan melebihi batas maksimum (${MAX_QUERY_LENGTH} karakter).`
        })
      };
    }

    const resObj = generateResponse(query);
    const isStream = event.queryStringParameters?.stream === 'true' ||
      event.queryStringParameters?.stream === '1' ||
      event.queryStringParameters?.sse === 'true' ||
      event.headers?.accept?.includes('text/event-stream');

    if (isStream) {
      return formatNetlifySse(resObj, query, headers);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(buildJsonResponsePayload(resObj, query))
    };
  }

  if (event.httpMethod === 'POST') {
    if (typeof event.body === 'string' && Buffer.byteLength(event.body) > MAX_PAYLOAD_BYTES) {
      return {
        statusCode: 413,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Ukuran payload melebihi batas maksimum (${MAX_PAYLOAD_BYTES / 1024} KB).`
        })
      };
    }

    let parsed = {};
    try {
      parsed = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Format JSON tidak valid." })
      };
    }

    const message = parsed.message || parsed.query || parsed.text;
    const style = parsed.style || 'friendly';
    const history = parsed.history || parsed.conversationHistory || [];

    if (!message || typeof message !== 'string' || !message.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Parameter 'message' diperlukan dan tidak boleh kosong." })
      };
    }

    if (message.length > MAX_QUERY_LENGTH) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Panjang karakter pesan melebihi batas maksimum (${MAX_QUERY_LENGTH} karakter).`
        })
      };
    }

    if (PII_PATTERNS.some(pat => pat.test(message))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Pesan mengandung data sensitif (nomor kartu/NIK/password). Permintaan ditolak." })
      };
    }

    const sanitizedHistory = sanitizeHistory(history);
    const resObj = generateResponse(message, { style, history: sanitizedHistory });
    const isStream = parsed.stream === true ||
      parsed.stream === 'true' ||
      parsed.sse === true ||
      event.headers?.accept?.includes('text/event-stream');

    if (isStream) {
      return formatNetlifySse(resObj, message, headers);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(buildJsonResponsePayload(resObj, message))
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ success: false, error: "Metode HTTP tidak didukung." })
  };
}

// Ekspor Mesin Pengetahuan & Pencarian Cerdas Terpadu serta Streaming SSE
export {
  getUnifiedKnowledgeBase,
  smartKBQuery,
  processDeepNeuralQuery,
  formatNeuralAnswer,
  getKnowledgeResponse,
  sendSseResponse
};
