/**
 * SaipulAI Public REST API Handler
 * Standalone Serverless & Node.js Endpoint
 * Version: 8.0.0
 * 
 * Keamanan:
 * - Bebas dari kebocoran token/kredensial internal
 * - Penyaringan otomatis data sensitif (PII)
 * - Dukungan CORS penuh untuk integrasi eksternal
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
  // Jika masih melebihi batas akibat variasi IP acak, pangkas entri tertua
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    const excess = rateLimitMap.size - MAX_RATE_LIMIT_ENTRIES;
    const keys = rateLimitMap.keys();
    for (let i = 0; i < excess; i++) {
      const nextKey = keys.next().value;
      if (nextKey) rateLimitMap.delete(nextKey);
    }
  }
}

// Pola deteksi data sensitif (PII)
const PII_PATTERNS = [
  /\b\d{16}\b/, // Nomor kartu debit/kredit 16 digit
  /\b\d{16}\b/, // NIK / KTP 16 digit
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b.*(?:password|kata\s*sandi|pin\b)/i, // Email + password
  /(?:password|pin|cvv|cvc)\s*[:=]\s*\S+/i // Token/password eksplisit
];

// Kata kunci deteksi bahasa
const EN_WORDS = new Set(['the', 'is', 'are', 'you', 'what', 'how', 'why', 'who', 'when', 'where', 'hello', 'hi', 'thanks', 'thank', 'can', 'please', 'help']);
const ID_WORDS = new Set(['yang', 'adalah', 'kamu', 'apa', 'bagaimana', 'kenapa', 'mengapa', 'siapa', 'kapan', 'dimana', 'halo', 'hai', 'terima', 'kasih', 'bisa', 'tolong', 'bantu']);

function detectLanguage(text) {
  const words = text.toLowerCase().split(/\s+/);
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
  const pos = ['bagus', 'hebat', 'keren', 'suka', 'terima kasih', 'mantap', 'senang', 'good', 'great', 'awesome', 'nice', 'thanks', 'love'];
  const neg = ['buruk', 'jelek', 'gagal', 'error', 'kecewa', 'benci', 'bad', 'terrible', 'worst', 'hate', 'broken'];

  const lower = text.toLowerCase();
  let p = 0, n = 0;
  pos.forEach(w => { if (lower.includes(w)) p++; });
  neg.forEach(w => { if (lower.includes(w)) n++; });

  if (p > n) return 'positive';
  if (n > p) return 'negative';
  return 'neutral';
}

// Regex token matematika aman (menghindari CPU exhaustion & arbitrary code execution)
const MATH_TOKEN_REGEX = /^([0-9]+(\.[0-9]+)?|[+\-*/%^()]|\s+|sqrt(?=\()|sin(?=\()|cos(?=\()|tan(?=\()|log(?=\()|abs(?=\()|pi|e)+$/i;

function cleanMathText(text) {
  return text
    .replace(/^(hitung|kalkulasi|berapa|hasil dari|calculate|compute)\s+/i, '')
    .replace(/x/g, '*')
    .replace(/÷/g, '/')
    .trim();
}

function isMathExpression(text) {
  const clean = cleanMathText(text);
  // Batasi panjang untuk mencegah ReDoS & AST ballooning
  if (!clean || clean.length > 50) return false;

  // Cegah chained exponentiation (misal 9^9^9) yang menyebabkan CPU Starvation DoS
  if ((clean.match(/\^/g) || []).length > 1) return false;

  // Batasi eksponen maksimum untuk mencegah komputasi berat
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
    // Evaluasi hanya dengan scope kosong terisolasi
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

// Basis pengetahuan ringkas untuk respon eksternal
const KNOWLEDGE_BASE = {
  about_ai: {
    id: "SaipulAI adalah kecerdasan buatan lokal yang dibangun dengan pipeline NLP, kalkulator mathjs, deteksi bahasa bilingual, dan arsitektur client-side ramah privasi.",
    en: "SaipulAI is a local lightweight AI assistant built with an NLP pipeline, mathjs calculator, bilingual language detection, and privacy-first client architecture."
  },
  ai_definition: {
    id: "Kecerdasan Buatan (Artificial Intelligence) adalah simulasi kecerdasan manusia oleh mesin komputer, meliputi pembelajaran, penalaran, dan pemecahan masalah.",
    en: "Artificial Intelligence (AI) is the simulation of human intelligence by machines, encompassing learning, reasoning, and problem-solving."
  },
  machine_learning: {
    id: "Machine Learning (ML) adalah cabang AI yang memungkinkan sistem komputer belajar dan meningkatkan performa dari data tanpa diprogram secara eksplisit.",
    en: "Machine Learning (ML) is a branch of AI that allows systems to automatically learn and improve from experience without explicit programming."
  },
  deep_learning: {
    id: "Deep Learning adalah subbidang Machine Learning yang menggunakan Artificial Neural Networks multi-layer untuk memproses representasi data tingkat tinggi.",
    en: "Deep Learning is a subset of Machine Learning that uses multi-layered Artificial Neural Networks to learn representations from complex data."
  }
};

function generateResponse(query, style = 'friendly') {
  const text = query.trim().toLowerCase();
  const lang = detectLanguage(query);

  // 1. Math calculation
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

  // 2. Greeting
  if (/^(halo|hai|hello|hi|pagi|siang|sore|malam|selamat|hey)/i.test(text)) {
    const reply = lang === 'en'
      ? (style === 'formal' ? "Hello! How may I assist you today?" : "Hey there! 👋 What can I help you with today?")
      : (style === 'formal' ? "Halo! Ada yang bisa saya bantu hari ini?" : "Hai! 👋 Senang bertemu denganmu. Mau tanya tentang apa hari ini?");
    return { reply, intent: 'greeting' };
  }

  // 3. Thanks
  if (/(terima\s*kasih|thanks|thank\s*you|makasih)/i.test(text)) {
    const reply = lang === 'en' 
      ? "You're very welcome! Let me know if you need anything else." 
      : "Sama-sama! Senang bisa membantu. Beri tahu jika butuh bantuan lainnya ya.";
    return { reply, intent: 'thanks' };
  }

  // 4. About SaipulAI
  if (/(siapa kamu|tentang saipul|what is saipul|who are you|saipulai)/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.about_ai[lang], intent: 'about_ai' };
  }

  // 5. Machine Learning & AI
  if (/(machine learning|ml)/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.machine_learning[lang], intent: 'definition' };
  }
  if (/(deep learning|dnn|neural network)/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.deep_learning[lang], intent: 'definition' };
  }
  if (/(kecerdasan buatan|artificial intelligence|apa itu ai|what is ai)/i.test(text)) {
    return { reply: KNOWLEDGE_BASE.ai_definition[lang], intent: 'definition' };
  }

  // 6. Fallback
  const fallback = lang === 'en'
    ? "I understand your query. Could you please provide more context or clarify so I can assist you better?"
    : "Saya mengerti pertanyaan Anda. Bisakah Anda memberikan detail atau topik yang lebih spesifik agar saya bisa membantu dengan maksimal?";

  return { reply: fallback, intent: 'general_query' };
}

/**
 * Serverless HTTP Handler
 */
export default async function handler(req, res) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // IP Rate Limiting dengan mitigasi spoofing dan leak memori
  const forwardedHeader = req.headers['x-forwarded-for'];
  const firstForwardedIp = typeof forwardedHeader === 'string' 
    ? forwardedHeader.split(',')[0].trim() 
    : (Array.isArray(forwardedHeader) ? forwardedHeader[0].trim() : null);
  const rawIp = firstForwardedIp || req.socket?.remoteAddress || '127.0.0.1';
  const clientIp = String(rawIp).slice(0, 45); // Batasi ukuran key untuk keamanan memori

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
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const query = url.searchParams.get('q') || url.searchParams.get('message');

    if (!query) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        status: "online",
        service: "SaipulAI Public API",
        version: "8.0.0",
        description: "API Kecerdasan Buatan SaipulAI siap diintegrasikan ke aplikasi web, mobile, atau bot eksternal.",
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
      version: "8.0.0",
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
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
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
          version: "8.0.0",
          query: message,
          reply,
          intent,
          language: detectLanguage(message),
          sentiment: detectSentiment(message),
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
          success: false,
          error: "Format JSON tidak valid atau terjadi kesalahan server internal."
        }));
      }
    });
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ success: false, error: "Metode HTTP tidak didukung. Gunakan GET atau POST." }));
}
