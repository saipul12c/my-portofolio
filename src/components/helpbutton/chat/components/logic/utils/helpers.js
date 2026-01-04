export function extractThemes(userMessages) {
  const themes = [];
  const words = userMessages.flatMap(msg => msg.content.toLowerCase().split(/\s+/));
  
  const themeKeywords = {
    'matematika': ['hitung', 'kalkulus', 'integral', 'turunan', 'statistik'],
    'ai': ['ai', 'machine learning', 'neural network', 'deep learning'],
    'data': ['analisis', 'data', 'prediksi', 'forecast'],
    'file': ['upload', 'file', 'dokumen', 'pdf']
  };
  
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
      themes.push(theme);
    }
  }
  
  return themes;
}

export function getRandomItem(arr) {
  return arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : 'tidak tersedia';
}

// Basic sanitization to prevent script injection and overly large inputs
export function sanitizeInput(str, maxLen = 2000) {
  try {
    if (!str) return '';
    let s = String(str);
    // remove script tags and on* attributes
    s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    s = s.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
    s = s.replace(/on\w+\s*=\s*'[^']*'/gi, '');
    s = s.replace(/<\/?\s*(iframe|object|embed)[^>]*>/gi, '');
    // collapse multiple whitespace
    s = s.replace(/\s{2,}/g, ' ').trim();
    if (s.length > maxLen) s = s.slice(0, maxLen);
    return s;
  } catch {
    return '';
  }
}

// Lightweight client-side Naive Bayes classifier for input type (no server)
// Trained on small embedded examples; deterministic and fast.
export function classifyInput(text) {
  try {
    if (!text || typeof text !== 'string') return { type: 'statement', confidence: 0.5 };
    const s = text.trim();

    // quick heuristics override (retain obvious signals)
    if (/\?$/.test(s)) return { type: 'question', confidence: 0.98 };
    const qWords = /(apa|bagaimana|mengapa|kenapa|kapan|di\s?mana|siapa|berapa|why|what|how|when|where|who)\b/i;
    if (qWords.test(s)) return { type: 'question', confidence: 0.9 };

    // training examples (small) for three classes
    const DEFAULT_TRAIN = {
      question: [
        'Apa itu kecerdasan buatan?',
        'Bagaimana cara kerja neural network?',
        'Kapan batas waktu pengumpulan data?',
        'How do I reset my password?'
      ],
      information: [
        'Saya bekerja di PT Contoh, alamat: jl. Sudirman 10.',
        'Website: https://example.com, email: info@example.com',
        'Data penjualan Q1: 1000,2000,1500',
        'Tanggal: 2023-05-01'
      ],
      statement: [
        'Saya suka belajar tentang AI.',
        'Itu adalah hasil dari eksperimen kami.',
        'Saya telah mengupload file laporan tadi.',
        'Terima kasih, sudah membantu.'
      ]
    };

    const TRAIN = mergeTraining(DEFAULT_TRAIN);

    // tokenization
    const tokenize = (str) => (str || '').toLowerCase().replace(/[\W_]+/g, ' ').split(/\s+/).filter(Boolean);

    // build vocab and counts
    const classes = Object.keys(TRAIN);
    const classDocs = {};
    const wordCounts = {};
    let vocab = new Set();
    classes.forEach(cls => {
      classDocs[cls] = TRAIN[cls].map(t => tokenize(t));
      wordCounts[cls] = {};
      classDocs[cls].forEach(tokens => tokens.forEach(t => { vocab.add(t); wordCounts[cls][t] = (wordCounts[cls][t] || 0) + 1; }));
    });
    vocab = Array.from(vocab);

    const classPriors = {};
    const totalDocs = classes.reduce((acc, c) => acc + TRAIN[c].length, 0);
    classes.forEach(c => { classPriors[c] = Math.log(TRAIN[c].length / totalDocs); });

    // precompute denominators for conditional probabilities with Laplace smoothing
    const condDenom = {};
    classes.forEach(c => {
      const totalWords = Object.values(wordCounts[c]).reduce((a,b) => a + b, 0);
      condDenom[c] = totalWords + vocab.length; // laplace
    });

    // classify input
    const tokens = tokenize(s);
    const scores = {};
    classes.forEach(c => {
      let score = classPriors[c];
      tokens.forEach(t => {
        const count = wordCounts[c][t] || 0;
        const prob = Math.log((count + 1) / condDenom[c]);
        score += prob;
      });
      scores[c] = score;
    });

    // softmax to confidence
    const maxScore = Math.max(...Object.values(scores));
    const exps = classes.map(c => Math.exp(scores[c] - maxScore));
    const sumExp = exps.reduce((a,b) => a + b, 0);
    const soft = {};
    classes.forEach((c, i) => { soft[c] = exps[i] / sumExp; });

    // pick best
    let best = classes[0];
    classes.forEach(c => { if (soft[c] > soft[best]) best = c; });

    return { type: best === 'information' ? 'information' : (best === 'question' ? 'question' : 'statement'), confidence: Math.round((soft[best] || 0) * 100) / 100 };
  } catch {
    return { type: 'statement', confidence: 0.5 };
  }
}

// Very small NER extractor for names, locations and simple ISO dates
export function simpleNER(text) {
  const out = { names: [], locations: [], datetimes: [] };
  if (!text || typeof text !== 'string') return out;
  try {
    // names: look for "nama saya <Name>" or "i am <Name>"
    const nameMatch = text.match(/(?:nama saya|saya nama|call me|i am|i'm)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i);
    if (nameMatch) out.names.push(nameMatch[1].trim());

    // locations: "dari <Place>" or "in <Place>" (short)
    const locMatch = text.match(/(?:dari|from|in)\s+([A-Za-z\s-]{2,40})/i);
    if (locMatch) out.locations.push(locMatch[1].trim());

    // simple ISO-like date detection YYYY-MM-DD or DD/MM/YYYY
    const isoDate = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    if (isoDate) out.datetimes.push(isoDate[1]);
    const dmy = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/);
    if (dmy) out.datetimes.push(dmy[1]);
  } catch { /* ignore */ }
  return out;
}

// --- Auto-training helpers (lightweight client-side storage) ---
const TRAINING_KEY = 'saipul_input_training_v1';

function loadUserTraining() {
  try {
    const raw = localStorage.getItem(TRAINING_KEY) || '[]';
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* ignore */ }
  return [];
}

function saveUserTraining(arr) {
  try {
    localStorage.setItem(TRAINING_KEY, JSON.stringify(arr));
  } catch { /* ignore */ }
}

// Exported helpers for UI actions
export function exportUserTraining() {
  try {
    return loadUserTraining();
  } catch { return []; }
}

export function importUserTraining(arr) {
  try {
    if (!Array.isArray(arr)) return false;
    // cap and sanitize
    const cleaned = arr.slice(-500).map(a => ({ text: String(a.text || '').slice(0, 2000), label: String(a.label || 'statement') }));
    saveUserTraining(cleaned);
    return true;
  } catch { return false; }
}

export function clearUserTraining() {
  try {
    saveUserTraining([]);
    return true;
  } catch { return false; }
}

export function containsPII(text) {
  if (!text || typeof text !== 'string') return false;
  const s = text.trim();
  try {
    const lower = s.toLowerCase();

    // Strong numeric indicators: credit card (13-19 digits, allow spaces/dashes), NIK (16 digits)
    const ccDigits = /(?:\b|\D)(?:\d[ -]?){13,19}(?:\b|\D)/;
    if (ccDigits.test(s)) return true;
    const nik = /\b\d{16}\b/; // Indonesian NIK is 16 digits
    if (nik.test(s)) return true;

    // Bank account numbers when mentioned together with keywords like rekening / no rek / norek
    const bankWithDigits = /(?:rekening|no\s?rek|norek)\D{0,30}(?:\d[ -]?){6,20}/i;
    if (bankWithDigits.test(s)) return true;

    // CVV/CVC nearby a short digit group
    const cvvPattern = /(?:cvv|cvc)\D{0,8}\d{3,4}/i;
    if (cvvPattern.test(s)) return true;

    // Password patterns: only flag if likely being shared (e.g. contains separators, quotes, or nearby possession words)
    const pwKeyword = /\b(password|passw(or)?d|pass)\b/i;
    if (pwKeyword.test(lower)) {
      // if there's an obvious assignment like password: 12345 or password = "abc"
      const pwAssign = /\b(password|passw(or)?d)\b\s*[:=]\s*(?:"[^"]+"|'[^']+'|\S+)/i;
      if (pwAssign.test(s)) return true;
      // or if user explicitly says "password saya" / "passwordku"
      const pwPossessive = /\b(password|passw(or)?d)\b\s+(saya|ku|kamu|anda|nya|adalah)\b/i;
      if (pwPossessive.test(lower)) return true;
      // otherwise do not assume any password mention is a share
    }

    // Generic keyword-based checks but require context (digit nearby or explicit 'kartu kredit' etc.)
    const genericKeywords = /\b(kartu kredit|card number|credit card|cvv|pin|ssn|social security|norek|no\s?rek|rekening|nik|ktp)\b/i;
    if (genericKeywords.test(s)) {
      // if it's just a mention in an explanatory sentence (no digit sequences), consider safe
      // check for presence of short/long digit sequences nearby
      if (ccDigits.test(s) || nik.test(s) || bankWithDigits.test(s) || cvvPattern.test(s)) return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

// Add a training example (text,label) into persistent user training store.
// Respects a cap and avoids storing suspected PII.
export function addTrainingExample(text, label) {
  try {
    if (!text || typeof text !== 'string' || !label) return false;
    if (containsPII(text)) return false;
    const trimmed = text.trim().slice(0, 2000);
    const store = loadUserTraining();
    store.push({ text: trimmed, label });
    // cap to last 500 examples
    while (store.length > 500) store.shift();
    saveUserTraining(store);
    return true;
  } catch { return false; }
}

// Merge default TRAIN used in classifyInput with user-provided examples
function mergeTraining(TRAIN) {
  try {
    const user = loadUserTraining();
    if (!user || user.length === 0) return TRAIN;
    const copy = { question: [], information: [], statement: [] };
    // copy defaults
    Object.keys(TRAIN).forEach(k => { copy[k] = (TRAIN[k] || []).slice(); });
    // append user examples
    user.forEach(u => {
      const t = (u.label || 'statement');
      if (copy[t]) copy[t].push(u.text);
    });
    return copy;
  } catch { return TRAIN; }
}
