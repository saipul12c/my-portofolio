/**
 * SaipulAI Public REST API Handler
 * Standalone Serverless, Netlify Functions, & Node.js Endpoint
 * Version: 8.1.0
 * 
 * Fitur & Keamanan:
 * - Pemahaman Semantik Leksikal & Kontekstual Kata (Bilingual ID/EN)
 * - Evaluasi Matematika Simbolik & Frasa Alami (Termasuk Akar Kuadrat & Aritmatika Kata)
 * - Pengetahuan Terpadu Portofolio Muhammad Syaiful Mukmin & Teknologi Web
 * - Bebas dari kebocoran token/kredensial internal
 * - Penyaringan data sensitif (PII) tanpa duplikasi
 * - Rate limiting aman dengan proteksi kebocoran memori (OOM)
 * - Kompatibilitas Multi-Runtime: Vite dev/preview, Node.js HTTP, Express, dan Netlify Serverless
 */

import { evaluate } from 'mathjs';

// In-memory rate limiting map (IP -> timestamps) dengan proteksi OOM
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 menit
const MAX_REQUESTS_PER_WINDOW = 30; // Maksimal 30 request/menit per IP
const MAX_RATE_LIMIT_ENTRIES = 5000; // Batas memori maksimum entri IP
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

// Pola deteksi data sensitif (PII) tanpa duplikasi
const PII_PATTERNS = [
  /\b\d{16}\b/, // Nomor kartu kredit/debit atau NIK 16 digit
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b.*(?:password|kata\s*sandi|pin\b)/i, // Email + password
  /(?:password|kata\s*sandi|pin|cvv|cvc)\s*[:=]\s*\S+/i // Token/password eksplisit
];

// Deteksi Bahasa Cerdas berbasis Frekuensi & Makna Kata
const EN_WORDS = new Set(['the', 'is', 'are', 'you', 'what', 'how', 'why', 'who', 'when', 'where', 'hello', 'hi', 'thanks', 'thank', 'can', 'please', 'help', 'project', 'about', 'calculate', 'good']);
const ID_WORDS = new Set(['yang', 'adalah', 'kamu', 'apa', 'bagaimana', 'kenapa', 'mengapa', 'siapa', 'kapan', 'dimana', 'halo', 'hai', 'terima', 'kasih', 'bisa', 'tolong', 'bantu', 'proyek', 'tentang', 'hitung', 'selamat']);

function detectLanguage(text) {
  const words = text.toLowerCase().split(/[\s,?.!]+/);
  let idCount = 0;
  let enCount = 0;

  words.forEach(w => {
    if (ID_WORDS.has(w)) idCount++;
    if (EN_WORDS.has(w)) enCount++;
  });

  if (enCount > idCount) return 'en';
  return 'id';
}

function detectSentiment(text) {
  const pos = ['bagus', 'hebat', 'keren', 'suka', 'terima kasih', 'mantap', 'senang', 'good', 'great', 'awesome', 'nice', 'thanks', 'love', 'terbaik', 'bermanfaat'];
  const neg = ['buruk', 'jelek', 'gagal', 'error', 'kecewa', 'benci', 'bad', 'terrible', 'worst', 'hate', 'broken', 'rusak', 'salah'];

  const lower = text.toLowerCase();
  let p = 0, n = 0;
  pos.forEach(w => { if (lower.includes(w)) p++; });
  neg.forEach(w => { if (lower.includes(w)) n++; });

  if (p > n) return 'positive';
  if (n > p) return 'negative';
  return 'neutral';
}

// Regex token matematika aman
const MATH_TOKEN_REGEX = /^([0-9]+(\.[0-9]+)?|[+\-*/%^()]|\s+|sqrt(?=\()|sin(?=\()|cos(?=\()|tan(?=\()|log(?=\()|abs(?=\()|pi|e)+$/i;

/**
 * Membersihkan dan mentransformasikan frasa matematika bahasa alami menjadi ekspresi simbolik
 */
function cleanMathText(rawText) {
  let text = rawText
    .trim()
    .toLowerCase()
    // 1. Buang tanda baca akhir kalimat
    .replace(/[?!,.:;]+$/, '')
    // 2. Buang kata tanya dan perintah awalan
    .replace(/^(hitunglah|kalkulasikan|hitung|kalkulasi|berapa\s+hasil\s+dari|berapa\s+hasilnya|hasil\s+dari|berapa|berapakah|tolong\s+hitung|calculate|compute|what\s+is\s+the\s+result\s+of|what\s+is)\s+/i, '')
    // 3. Konversi kata akar kuadrat alami: "akar kuadrat dari 144", "akar dari 144", "akar 144" -> "sqrt(144)"
    .replace(/(?:akar\s+kuadrat\s+dari|akar\s+dari|akar|square\s+root\s+of)\s+([0-9.]+)/gi, 'sqrt($1)')
    // 4. Konversi operator verbal: "pangkat", "kali", "bagi", "tambah", "kurang"
    .replace(/\s+(?:pangkat|to\s+the\s+power\s+of)\s+/gi, ' ^ ')
    .replace(/\s+(?:dikali|kali|times|multiplied\s+by)\s+/gi, ' * ')
    .replace(/\s+(?:dibagi|bagi|divided\s+by)\s+/gi, ' / ')
    .replace(/\s+(?:ditambah|tambah|plus)\s+/gi, ' + ')
    .replace(/\s+(?:dikurang|dikurangi|kurang|minus)\s+/gi, ' - ')
    // 5. Normalisasi simbol visual
    .replace(/x/g, '*')
    .replace(/÷/g, '/')
    .replace(/%/g, ' / 100')
    .trim();

  return text;
}

function isMathExpression(text) {
  const clean = cleanMathText(text);
  if (!clean || clean.length > 80) return false;

  // Cegah chained exponentiation (misal 9^9^9) untuk menghindari DoS
  if ((clean.match(/\^/g) || []).length > 1) return false;

  // Batasi eksponen maksimum
  const expMatch = clean.match(/([0-9.]+)\s*\^\s*([0-9.]+)/);
  if (expMatch) {
    const base = parseFloat(expMatch[1]);
    const exp = parseFloat(expMatch[2]);
    if (exp > 100 || (base > 1000 && exp > 10)) return false;
  }

  // Validasi pola matematika yang ketat
  return MATH_TOKEN_REGEX.test(clean) && (/\d/.test(clean) || /pi|e/i.test(clean));
}

function evaluateMathSafely(text) {
  const clean = cleanMathText(text);

  if (!isMathExpression(text)) {
    return { success: false };
  }

  try {
    const result = evaluate(clean, {});
    if (typeof result === 'number' || typeof result === 'bigint') {
      if (!isFinite(result)) {
        return { success: true, result: 'Tak terdefinisi (Infinity)' };
      }
      return { success: true, result: Number(result.toFixed(6)) };
    }
    return { success: false };
  } catch (_e) {
    return { success: false };
  }
}

// Basis Pengetahuan Lengkap SaipulAI (Portofolio, Peneliti, AI & Web)
const KNOWLEDGE_BASE = {
  about_ai: {
    id: "SaipulAI v8.1.0 mengusung arsitektur Dual-Engine terpadu: 1) Mesin On-Device Browser untuk inferensi 100% lokal dan privasi penuh di HelpButton & Live Room, serta 2) Public REST API & Web SDK mandiri di /api/saipul untuk integrasi lintas platform, bot eksternal, dan developer sandbox.",
    en: "SaipulAI v8.1.0 features a unified Dual-Engine architecture: 1) On-Device In-Browser inference for 100% privacy and zero server latency in HelpButton & Live Room, and 2) Standalone Public REST API & Web SDK at /api/saipul for cross-platform integration, external bots, and developer sandbox."
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
    id: "Anda dapat menghubungi Muhammad Syaiful Mukmin melalui email resmi di form kontak portofolio, Instagram (@saipul16_), LinkedIn (linkedin.com/in/syaifulmukmin), atau GitHub (github.com/saipul12c).",
    en: "You can reach Muhammad Syaiful Mukmin via the portfolio contact form, Instagram (@saipul16_), LinkedIn (linkedin.com/in/syaifulmukmin), or GitHub (github.com/saipul12c)."
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
 * Mesin Respon NLP Semantik Berbasis Struktur Kalimat
 */
function generateResponse(query, style = 'friendly') {
  const text = query.trim().toLowerCase();
  const lang = detectLanguage(query);

  // 1. Evaluasi Matematika Simbolik & Frasa Alami
  if (isMathExpression(text)) {
    const math = evaluateMathSafely(text);
    if (math.success) {
      return {
        reply: lang === 'en' 
          ? `Calculation result: ${math.result}` 
          : `Hasil perhitungan: ${math.result}`,
        intent: 'calculation'
      };
    }
  }

  // 2. Sapaan Ramah (Word Boundary & Context Aware)
  // Menghindari false positive pada kata berawalan 'hi' seperti 'hitung', 'hidup', 'hilang'
  if (/^(halo|hai|hello|hi|hey|hei|assalamu['’]?alaikum|selamat\s+(pagi|siang|sore|malam)|pagi|siang|sore|malam)\b/i.test(text)) {
    const reply = lang === 'en'
      ? (style === 'formal' ? "Hello! How may I assist you today?" : "Hey there! 👋 What can I help you with today?")
      : (style === 'formal' ? "Halo! Ada yang bisa saya bantu hari ini?" : "Hai! 👋 Senang bertemu denganmu. Mau tanya tentang apa hari ini?");
    return { reply, intent: 'greeting' };
  }

  // 3. Ucapan Terima Kasih (Gratitude)
  if (/\b(terima\s*kasih|thanks|thank\s*you|makasih|syukron|matur\s*nuwun)\b/i.test(text)) {
    const reply = lang === 'en' 
      ? "You're very welcome! Let me know if you need anything else." 
      : "Sama-sama! Senang bisa membantu. Beri tahu jika butuh bantuan lainnya ya.";
    return { reply, intent: 'thanks' };
  }

  // 4. Spesifik: Riwayat Pendidikan & Kampus
  if (/\b(pendidikan|kuliah|kampus|universitas|uin|uin\s+antasari|pgmi|jurusan|gelar)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.education[lang], intent: 'education' };
  }

  // 5. Spesifik: Proyek & Karya Portofolio
  if (/\b(proyek|project|projects|karya|portofolio|portfolio|aplikasi\s+yang\s+dibuat)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.projects[lang], intent: 'projects' };
  }

  // 6. Spesifik: Kontak & Media Sosial
  if (/\b(kontak|contact|hubungi|email|instagram|github|linkedin|sosial\s*media|sosmed)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.contact[lang], intent: 'contact' };
  }

  // 7. Keahlian & Teknologi Web (HTML, CSS, JavaScript, React)
  if (/\b(html|css|javascript|js|react|frontend|web\s+development)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.web_tech[lang], intent: 'web_tech' };
  }
  if (/\b(keahlian|skill|skills|tech\s*stack|teknologi\s+apa)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.skills_tech[lang], intent: 'skills' };
  }

  // 8. Pengembang / Pembuat Portofolio Umum (Muhammad Syaiful Mukmin)
  if (/\b(syaiful|mukmin|pembuat|author|creator|developer|biodata|profil\s+syaiful|siapa\s+syaiful)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.author_profile[lang], intent: 'author_profile' };
  }

  // 9. Identitas & Kapabilitas SaipulAI
  if (/\b(saipulai|saipul\s*ai|siapa\s+kamu|who\s+are\s+you|tentang\s+kamu|what\s+is\s+saipul)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.about_ai[lang], intent: 'about_ai' };
  }

  // 10. Konsep Machine Learning & AI (Menggunakan boundary kata agar tidak salah mendeteksi 'html' atau '100ml')
  if (/\b(machine\s+learning|\bml\b)\b/i.test(text) && !/\b\d+\s*ml\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.machine_learning[lang], intent: 'definition' };
  }
  if (/\b(deep\s+learning|dnn|neural\s+network)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.deep_learning[lang], intent: 'definition' };
  }
  if (/\b(kecerdasan\s+buatan|artificial\s+intelligence|apa\s+itu\s+ai|what\s+is\s+ai)\b/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.ai_definition[lang], intent: 'definition' };
  }

  // 11. Fallback Beradab & Informatif
  const fallback = lang === 'en'
    ? "I understand your query. Could you please provide more context or specify a topic such as projects, skills, education, or calculations?"
    : "Saya mengerti pertanyaan Anda. Bisakah Anda memberikan detail yang lebih spesifik, seperti seputar proyek, keahlian, profil Syaiful Mukmin, atau perhitungan matematika?";

  return { reply: fallback, intent: 'general_query' };
}

/**
 * Helper membaca body request secara aman pada berbagai environment Node.js / Serverless
 */
function parseRequestBody(req) {
  return new Promise((resolve) => {
    // 1. Jika body sudah di-parse oleh runtime (Vercel, Express body-parser, Netlify event)
    if (req.body) {
      if (typeof req.body === 'object') {
        return resolve(req.body);
      }
      if (typeof req.body === 'string') {
        try {
          return resolve(JSON.parse(req.body));
        } catch (_err) {
          return resolve({});
        }
      }
    }

    // 2. Jika req adalah readable stream
    if (typeof req.on === 'function') {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch (_err) {
          resolve({});
        }
      });
      req.on('error', () => resolve({}));
      // Jika stream sudah ditutup atau tidak aktif
      if (req.readableEnded) {
        resolve({});
      }
    } else {
      resolve({});
    }
  });
}

/**
 * Universal Serverless HTTP Handler (Node.js, Vite Middleware, & Netlify Functions)
 */
export default async function handler(req, res) {
  // Kompatibilitas Netlify Functions / AWS Lambda: handler(event, context)
  if (req && !res && (req.httpMethod || req.rawUrl)) {
    return handleNetlifyEvent(req);
  }

  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
  const clientIp = String(rawIp).slice(0, 45);

  const now = Date.now();
  pruneRateLimits(now);

  const timestamps = (rateLimitMap.get(clientIp) || []).filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: false,
      error: "Terlalu banyak permintaan (Rate limit exceeded). Mohon coba lagi beberapa saat."
    }));
  }
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);

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
        version: "8.1.0",
        architecture: "Dual-Engine (On-Device Client Intelligence + Universal Serverless REST API)",
        description: "Ekosistem terpadu SaipulAI v8.1.0: inferensi on-device browser untuk privasi 100% dan REST API serverless untuk integrasi eksternal.",
        endpoints: {
          chat: { method: "POST", path: "/api/saipul", body: { message: "string", style: "friendly|formal|concise" } },
          quick: { method: "GET", path: "/api/saipul?q=YOUR_QUERY" }
        },
        security: "Zero Sensitive Keys Required • Privacy-First Architecture"
      }));
    }

    const { reply, intent } = generateResponse(query);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: true,
      version: "8.1.0",
      query,
      reply,
      intent,
      language: detectLanguage(query),
      sentiment: detectSentiment(query),
      timestamp: new Date().toISOString()
    }));
  }

  // POST Request
  if (req.method === 'POST') {
    try {
      const parsed = await parseRequestBody(req);
      const message = parsed.message || parsed.query || parsed.text;
      const style = parsed.style || 'friendly';

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: false,
          error: "Parameter 'message' diperlukan dan tidak boleh kosong."
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

      const { reply, intent } = generateResponse(message, style);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        success: true,
        version: "8.1.0",
        query: message,
        reply,
        intent,
        language: detectLanguage(message),
        sentiment: detectSentiment(message),
        timestamp: new Date().toISOString()
      }));
    } catch (_err) {
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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
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
          version: "8.1.0",
          architecture: "Dual-Engine (On-Device Client Intelligence + Universal Serverless REST API)",
          description: "Ekosistem terpadu SaipulAI v8.1.0: inferensi on-device browser untuk privasi 100% dan REST API serverless untuk integrasi eksternal."
        })
      };
    }

    const { reply, intent } = generateResponse(query);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        version: "8.1.0",
        query,
        reply,
        intent,
        language: detectLanguage(query),
        sentiment: detectSentiment(query),
        timestamp: new Date().toISOString()
      })
    };
  }

  if (event.httpMethod === 'POST') {
    let parsed = {};
    try {
      parsed = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
    } catch (_e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Format JSON tidak valid." })
      };
    }

    const message = parsed.message || parsed.query || parsed.text;
    const style = parsed.style || 'friendly';

    if (!message || typeof message !== 'string' || !message.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Parameter 'message' diperlukan dan tidak boleh kosong." })
      };
    }

    if (PII_PATTERNS.some(pat => pat.test(message))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Pesan mengandung data sensitif (nomor kartu/NIK/password). Permintaan ditolak." })
      };
    }

    const { reply, intent } = generateResponse(message, style);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        version: "8.1.0",
        query: message,
        reply,
        intent,
        language: detectLanguage(message),
        sentiment: detectSentiment(message),
        timestamp: new Date().toISOString()
      })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ success: false, error: "Metode HTTP tidak didukung." })
  };
}
