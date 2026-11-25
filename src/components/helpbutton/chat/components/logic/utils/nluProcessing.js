/**
 * NLU Processing Pipeline
 * Mengintegrasikan Lexical Database, Language Corpus, dan NLU Dataset
 * untuk pemrosesan bahasa natural yang lebih canggih
 */

import { analyzeLexical, getSynonyms, getLemma, normalizeWord } from './lexicalDatabase.js';
import { findSimilarSentences, analyzeSentenceInCorpus } from './languageCorpus.js';
import { analyzeNLU, classifyIntent as _classifyIntent, extractEntities as _extractEntities, classifySentenceType as _classifySentenceType } from './nluDataset.js';
import { redactPII } from './piiDetector.js';
import { resolvePronouns } from './coreference.js';
import { correctText } from './spellChecker.js';

// ===== SENTIMEN & VALENSI KONTEKSTUAL BERBASIS STRUKTUR BAHASA =====

const POSITIVE_LEXICON = {
  // Positif Kuat (+1.8 s/d +2.0)
  'luar biasa': 2.0, 'hebat': 1.8, 'sempurna': 2.0, 'istimewa': 1.8, 'menakjubkan': 2.0,
  'terbaik': 2.0, 'juara': 1.8, 'brilian': 1.8, 'memukau': 1.8, 'mantap': 1.6,
  'mantul': 1.6, 'apik': 1.4, 'jos': 1.5, 'top': 1.6,
  'awesome': 2.0, 'excellent': 2.0, 'perfect': 2.0, 'amazing': 2.0, 'outstanding': 2.0,

  // Positif Standar (+1.1 s/d +1.5)
  'bagus': 1.3, 'baik': 1.2, 'keren': 1.4, 'suka': 1.3, 'puas': 1.4, 'senang': 1.3,
  'terima kasih': 1.3, 'makasih': 1.2, 'thanks': 1.2, 'thank you': 1.3,
  'bermanfaat': 1.4, 'membantu': 1.4, 'informatif': 1.3, 'jelas': 1.2,
  'rekomendasi': 1.4, 'rekomended': 1.4, 'recommended': 1.4, 'indah': 1.3,
  'estetik': 1.3, 'elegan': 1.3, 'rapi': 1.2, 'cepat': 1.2, 'lancar': 1.3,
  'akurat': 1.3, 'presisi': 1.3, 'stabil': 1.2, 'aman': 1.2, 'terpercaya': 1.4,
  'profesional': 1.4, 'ramah': 1.3, 'solutif': 1.4, 'responsif': 1.3,
  'mudah': 1.2, 'gampang': 1.1, 'berhasil': 1.4, 'sukses': 1.5, 'nyaman': 1.3,
  'good': 1.2, 'nice': 1.2, 'great': 1.5, 'love': 1.6, 'helpful': 1.4, 'cool': 1.3
};

const NEGATIVE_LEXICON = {
  // Negatif Kuat (-1.8 s/d -2.0)
  'parah': 2.0, 'hancur': 2.0, 'buruk': 1.8, 'terburuk': 2.0, 'benci': 1.8,
  'menjengkelkan': 1.8, 'mengecewakan': 1.8, 'penipuan': 2.0, 'rusak': 1.8,
  'mati': 1.8, 'zonk': 1.8, 'muak': 1.8, 'cepat habis': 1.8, 'gampang drop': 1.8,
  'gampang rusak': 1.8, 'mudah rusak': 1.8,
  'worst': 2.0, 'terrible': 2.0, 'horrible': 2.0, 'awful': 2.0, 'hate': 1.8,

  // Negatif Standar (-1.0 s/d -1.5)
  'jelek': 1.4, 'gagal': 1.5, 'error': 1.4, 'bug': 1.3, 'masalah': 1.3,
  'kendala': 1.1, 'kecewa': 1.5, 'marah': 1.5, 'kesal': 1.4, 'pusing': 1.2,
  'ribet': 1.3, 'sulit': 1.2, 'susah': 1.2, 'lambat': 1.3, 'lemot': 1.4,
  'lelet': 1.4, 'cacat': 1.5, 'rugi': 1.4, 'bingung': 1.1, 'bosan': 1.2,
  'kurang': 0.9, 'lemah': 1.2, 'kacau': 1.6, 'payah': 1.5, 'bodoh': 1.6,
  'salah': 1.2, 'batal': 1.1, 'crash': 1.5, 'hang': 1.3, 'ancur': 1.7,
  'hilang': 1.4, 'bocor': 1.4, 'lenyap': 1.5, 'drop': 1.3, 'habis': 1.4, 'sia-sia': 1.6, 'emosi': 1.3,
  'bad': 1.3, 'poor': 1.3, 'slow': 1.2, 'broken': 1.5, 'fail': 1.5, 'failed': 1.5
};

const NEGATORS = new Set([
  'tidak', 'tak', 'bukan', 'nggak', 'gak', 'tiada', 'belum', 'tanpa',
  'jangan', 'kurang', 'not', 'no', 'never', 'hardly', 'barely', 'without'
]);

const INTENSIFIERS = {
  'sangat': 1.8, 'banget': 1.8, 'amat': 1.7, 'benar-benar': 1.9, 'sungguh': 1.8,
  'luar biasa': 2.0, 'sekali': 1.6, 'terlalu': 1.7, 'teramat': 1.9, 'super': 1.8,
  'paling': 1.7, 'makin': 1.3, 'really': 1.8, 'very': 1.7, 'extremely': 2.0, 'totally': 1.8
};

const DIMINISHERS = {
  'agak': 0.6, 'sedikit': 0.6, 'lumayan': 0.8, 'cukup': 0.8, 'hampir': 0.7,
  'rada': 0.6, 'sekadar': 0.6, 'slightly': 0.6, 'somewhat': 0.7, 'barely': 0.5
};

// Slang intensifiers Indonesia: kata-kata yang secara harfiah negatif namun bila menempel pada kata positif berubah menjadi penguat positif
const SLANG_POSITIVE_MODIFIERS = new Set(['parah', 'gila', 'sadis', 'kacau', 'kebangetan', 'mati', 'ampun']);

// Pola sarkasme dan pembalikan makna tersirat (Pragmatic & Discourse Inversion)
export const SARCASM_PATTERNS = [
  // 1. Pujian diikuti kerusakan/kegagalan temporal/langsung (e.g. "Mantap sekali, baru dipakai sehari sudah rusak")
  {
    type: 'praise_then_defect',
    pattern: /\b(mantap|bagus|hebat|keren|luar biasa|juara|brilian|sempurna|top|apik|jos|asik|indah|awesome|great|excellent|perfect)\b.*?\b(baru|pas|begitu|saat)\b.*?\b(rusak|error|crash|mati|hang|hancur|bocor|hilang|cacat|gagal|lenyap|zonk|down|drop|rusak total|bubar)\b/i,
    score: -2.2
  },
  // 2. Pujian diikuti hasil buruk/mengecewakan via konjungsi kontras/akibat (e.g. "Bagus banget tapi malah hilang datanya")
  {
    type: 'praise_adversative_defect',
    pattern: /\b(mantap|bagus|hebat|keren|luar biasa|juara|brilian|sempurna|top|mantul)\b.*?\b(tapi|tetapi|namun|padahal|sayangnya|malah|ujung-ujungnya|hasilnya|nyatanya|kenyataannya)\b.*?\b(rusak|error|jelek|buruk|kecewa|rugi|hancur|zonk|lelet|lambat|bikin pusing|tidak bisa|gak bisa|tidak jalan|gak jalan|nihil|parah|bikin emosi|sia-sia)\b/i,
    score: -2.0
  },
  // 3. Sindiran retoris kemampuan/kecerdasan (e.g. "Hebat ya, begini doang gak bisa")
  {
    type: 'rhetorical_mock',
    pattern: /\b(hebat|pintar|jenius|mantap|bagus|canggih)\s*(ya|deh|betul|bener)?\s*[,.]?\s*(gini|begini|begitu|gitu|cuma|doang|masa|kok)\s+(aja|doang)?\s*(gak bisa|tidak bisa|error|gagal|salah|crash|rusak|hang|lambat)\b/i,
    score: -2.0
  },
  // 4. Terima kasih ironis / menyindir kerugian (e.g. "Terima kasih banyak ya, gara-gara kamu dataku hilang")
  {
    type: 'ironic_thanks',
    pattern: /\b(terima kasih|makasih|thanks|thank you)\s*(banyak)?\s*[,.]?\s*(gara-gara|malah|sudah bikin|udah bikin)\s+.*?\b(rusak|hilang|error|hancur|rugi|pusing|bermasalah|drop|hancur)\b/i,
    score: -2.2
  },
  // 5. Ekspektasi vs Realita (e.g. "Katanya canggih tapi lelet begini")
  {
    type: 'expectation_vs_reality',
    pattern: /\bkatanya\s+(bagus|cepat|lancar|mantap|canggih|aman|stabil|profesional|keren)\s*[,.]?\s*(tapi|kok|malah|nyatanya)\s+.*?\b(lelet|lambat|rusak|error|jelek|parah|zonk|cacat|hancur|kecewa|bohong)\b/i,
    score: -2.0
  },
  // 6. Tanda petik bernada ironis (e.g. 'fitur "hebat" ini bikin crash')
  {
    type: 'quoted_irony',
    pattern: /["'](mantap|hebat|bagus|keren|sempurna|canggih|profesional)["']\s*.*?\b(rusak|jelek|parah|error|kecewa|zonk|crash|lelet)\b/i,
    score: -1.9
  }
];

/**
 * Deteksi sarkasme, sindiran, dan pembalikan makna tersirat
 * @param {string} text - teks masukan
 * @returns {object} hasil analisis sarkasme
 */
export function detectSarcasmAndIrony(text) {
  if (!text || typeof text !== 'string') return { isSarcastic: false, confidence: 0, type: null, penaltyScore: 0 };
  const clean = text.toLowerCase().trim();

  for (const item of SARCASM_PATTERNS) {
    if (item.pattern.test(clean)) {
      return {
        isSarcastic: true,
        type: item.type,
        confidence: 0.95,
        penaltyScore: item.score
      };
    }
  }

  // Deteksi sarkasme lintas-kalimat dalam satu paragraf (misal: "Mantap sekali. Baru dipakai sehari sudah rusak total.")
  const sentences = clean.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);
  if (sentences.length >= 2) {
    const praiseRegex = /\b(mantap|bagus|hebat|keren|luar biasa|juara|brilian|sempurna|top|mantul)\b/i;
    const failureRegex = /\b(baru.*?rusak|baru.*?error|baru.*?mati|rusak total|langsung crash|bikin emosi|data hilang|zonk|hancur|tidak jalan|parah banget)\b/i;

    for (let i = 0; i < sentences.length - 1; i++) {
      if (praiseRegex.test(sentences[i]) && failureRegex.test(sentences[i + 1])) {
        return {
          isSarcastic: true,
          type: 'cross_sentence_inversion',
          confidence: 0.92,
          penaltyScore: -2.2
        };
      }
    }
  }

  return { isSarcastic: false, confidence: 0, type: null, penaltyScore: 0 };
}

// Frase idiomatis utuh yang mengubah valensi secara spesifik
const IDIOMATIC_PHRASES = [
  { pattern: /\b(tidak ada masalah|tanpa kendala|bebas error|berjalan lancar|tanpa cela|tidak ada kendala)\b/gi, score: 1.8 },
  { pattern: /\b(tidak pernah gagal|tidak mengecewakan|tidak membuat kecewa|tidak diragukan lagi)\b/gi, score: 1.7 },
  { pattern: /\b(tidak (terlalu|begitu) (buruk|jelek|parah))\b/gi, score: 0.8 },
  { pattern: /\b(bukan masalah besar|bukan kendala)\b/gi, score: 0.6 },
  { pattern: /\b(bikin pusing|bikin kesal|buang-buang waktu|buang waktu|tidak ada gunanya)\b/gi, score: -1.8 },
  { pattern: /\b(tidak bisa diandalkan|sama sekali tidak berguna|tidak berfungsi)\b/gi, score: -2.0 }
];

// Kata penghubung kontras yang memindahkan bobot pragmatis ke klausa kedua
const CONTRASTIVE_REGEX = /\b(tetapi|tapi|namun|melainkan|hanya saja|akan tetapi|padahal|sebaliknya|but|however|yet)\b/i;

// Kata penghubung konsesif
const CONCESSIVE_REGEX = /\b(meskipun|walaupun|kendati|meski|biarpun|sungguhpun|although|even though|though|despite)\b/i;

/**
 * Analisis sentimen kontekstual berbobot struktur bahasa
 * Mampu memahami pembalikan valensi (negasi), intensifier, dan pergeseran makna antar-klausa & paragraf
 * @param {string} text - teks yang akan dianalisis
 * @returns {object} hasil analisis sentimen komprehensif
 */
export function analyzeSentiment(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      sentiment: 'neutral',
      confidence: 0,
      scores: { positive: 0, negative: 0, total: 0 },
      polarity: 0,
      structuralFeatures: { hasNegation: false, hasContrast: false, hasIntensifier: false, clauseCount: 0 }
    };
  }

  const rawText = text.trim();
  const paragraphs = rawText.split(/\n+/).filter(p => p.trim().length > 0);

  let netWeightedScore = 0;
  let totalPositivePoints = 0;
  let totalNegativePoints = 0;
  let hasNegationDetected = false;
  let hasContrastDetected = false;
  let hasIntensifierDetected = false;
  let totalClauses = 0;

  const sarcasmResult = detectSarcasmAndIrony(rawText);

  paragraphs.forEach((paragraph, pIdx) => {
    // Paragraf akhir (kesimpulan pembicara) mendapatkan bobot diskursus sedikit lebih tinggi
    const paragraphWeight = pIdx === paragraphs.length - 1 && paragraphs.length > 1 ? 1.25 : 1.0;
    const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

    sentences.forEach((sentence) => {
      const lowerSentence = sentence.toLowerCase().trim();

      // Cek apakah kalimat mengandung penghubung kontras (misal: "Awalnya jelek, tapi sekarang sangat bagus!")
      let clauses = [];
      if (CONTRASTIVE_REGEX.test(lowerSentence)) {
        hasContrastDetected = true;
        const parts = lowerSentence.split(CONTRASTIVE_REGEX);
        // Klausa pertama (sebelum kontras) berbobot 0.45, klausa kedua (setelah kontras) berbobot 1.75
        clauses.push({ text: parts[0] || '', weight: 0.45 * paragraphWeight });
        clauses.push({ text: parts.slice(2).join(' ') || parts[1] || '', weight: 1.75 * paragraphWeight });
      } else if (CONCESSIVE_REGEX.test(lowerSentence)) {
        hasContrastDetected = true;
        const parts = lowerSentence.split(CONCESSIVE_REGEX);
        clauses.push({ text: parts[0] || '', weight: 0.5 * paragraphWeight });
        clauses.push({ text: parts.slice(1).join(' ') || '', weight: 1.6 * paragraphWeight });
      } else {
        clauses.push({ text: lowerSentence, weight: 1.0 * paragraphWeight });
      }

      totalClauses += clauses.length;

      clauses.forEach(({ text: clauseText, weight: clauseWeight }) => {
        if (!clauseText.trim()) return;

        let clauseScore = 0;

        // 1. Cek frase idiomatis utuh terlebih dahulu
        for (const item of IDIOMATIC_PHRASES) {
          if (item.pattern.test(clauseText)) {
            clauseScore += item.score;
            if (item.score > 0) totalPositivePoints += item.score;
            else totalNegativePoints += Math.abs(item.score);
            item.pattern.lastIndex = 0;
          }
        }

        // 2. Evaluasi berbasis token & pergeseran valensi
        const tokens = clauseText.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);

        for (let i = 0; i < tokens.length; i++) {
          const word = tokens[i];
          const bigram = i < tokens.length - 1 ? `${word} ${tokens[i + 1]}` : null;
          const prevWord = i > 0 ? tokens[i - 1] : null;
          const nextWord = i < tokens.length - 1 ? tokens[i + 1] : null;

          // 2a. Evaluasi Slang Modifiers (misal: "keren parah", "gila mantap", "asik parah")
          // Jika kata seperti 'parah', 'gila', 'sadis' berdampingan dengan kata positif, ia berfungsi sebagai penguat positif
          if (SLANG_POSITIVE_MODIFIERS.has(word)) {
            const isPrevPositive = prevWord && (POSITIVE_LEXICON[prevWord] || POSITIVE_LEXICON[`${i > 1 ? tokens[i - 2] + ' ' : ''}${prevWord}`]);
            const isNextPositive = nextWord && POSITIVE_LEXICON[nextWord];
            if (isPrevPositive || isNextPositive) {
              hasIntensifierDetected = true;
              continue; // Abaikan sebagai kata negatif, sudah menguatkan kata positif
            }
          }

          // 2b. Evaluasi Kolokasi Kontekstual yang Membalikkan Makna
          // Misal: "cepat habis", "cepat rusak", "cepat drop" -> 'cepat' bukan positif melainkan penguat kerusakan
          if (word === 'cepat' && nextWord && ['habis', 'rusak', 'panas', 'drop', 'mati', 'bocor', 'bubar', 'hang', 'cacat'].includes(nextWord)) {
            continue; // Jangan beri nilai positif pada kata 'cepat' di sini
          }

          let wordScore = 0;
          let isPositive = false;
          let isNegative = false;

          // Cek bigram dahulu lalu unigram
          if (bigram && POSITIVE_LEXICON[bigram]) {
            wordScore = POSITIVE_LEXICON[bigram];
            isPositive = true;
          } else if (bigram && NEGATIVE_LEXICON[bigram]) {
            wordScore = NEGATIVE_LEXICON[bigram];
            isNegative = true;
          } else if (POSITIVE_LEXICON[word]) {
            wordScore = POSITIVE_LEXICON[word];
            isPositive = true;
          } else if (NEGATIVE_LEXICON[word]) {
            wordScore = NEGATIVE_LEXICON[word];
            isNegative = true;
          }

          if (isPositive || isNegative) {
            // Periksa negator dalam jarak 1-3 kata sebelumnya (valence shifting)
            const lookback = tokens.slice(Math.max(0, i - 3), i);
            const negatorFound = lookback.some(w => NEGATORS.has(w));

            // Periksa intensifier, diminisher, atau slang intensifier di sekitar kata
            const nearby = [...lookback, ...(tokens.slice(i + 1, i + 3))];
            let multiplier = 1.0;

            for (const nw of nearby) {
              if (INTENSIFIERS[nw]) {
                multiplier *= INTENSIFIERS[nw];
                hasIntensifierDetected = true;
              } else if (DIMINISHERS[nw]) {
                multiplier *= DIMINISHERS[nw];
              } else if (SLANG_POSITIVE_MODIFIERS.has(nw) && isPositive) {
                // "keren parah" -> intensifier 1.8x
                multiplier *= 1.8;
                hasIntensifierDetected = true;
              }
            }

            if (negatorFound) {
              hasNegationDetected = true;
              if (isPositive) {
                // "tidak bagus" -> berubah menjadi negatif
                const shiftedScore = -1.0 * wordScore * multiplier * 0.95;
                clauseScore += shiftedScore;
                totalNegativePoints += Math.abs(shiftedScore);
              } else {
                // "tidak jelek" / "tidak buruk" -> berubah menjadi positif/netral
                const shiftedScore = 0.75 * wordScore * multiplier;
                clauseScore += shiftedScore;
                totalPositivePoints += shiftedScore;
              }
            } else {
              if (isPositive) {
                const finalScore = wordScore * multiplier;
                clauseScore += finalScore;
                totalPositivePoints += finalScore;
              } else {
                const finalScore = -1.0 * wordScore * multiplier;
                clauseScore += finalScore;
                totalNegativePoints += Math.abs(finalScore);
              }
            }
          }
        }

        netWeightedScore += clauseScore * clauseWeight;
      });
    });
  });

  // 3. PEMBALIKAN VALENSI DISKURSUS / SARKASME
  // Jika terdeteksi sarkasme / sindiran (misal "Mantap sekali, baru dipakai sehari sudah rusak")
  // maka seluruh pujian sebelumnya dibatalkan dan dialihkan menjadi komplain negatif kuat
  let isSarcasmActive = false;
  let sarcasmType = null;

  if (sarcasmResult.isSarcastic) {
    isSarcasmActive = true;
    sarcasmType = sarcasmResult.type;
    totalNegativePoints += Math.max(3.0, totalPositivePoints * 1.6 + 2.0);
    totalPositivePoints = Math.min(0.2, totalPositivePoints * 0.1);
    netWeightedScore = -Math.abs(sarcasmResult.penaltyScore || 2.2) * 1.5;
  }

  const totalPoints = totalPositivePoints + totalNegativePoints;
  let polarity = totalPoints === 0 ? 0 : Math.max(-1, Math.min(1, netWeightedScore / (Math.max(1, totalPoints * 0.8))));

  if (isSarcasmActive) {
    polarity = Math.min(-0.85, polarity);
  }

  let sentiment = 'neutral';
  if (polarity > 0.15) sentiment = 'positive';
  else if (polarity < -0.15) sentiment = 'negative';

  const wordCount = rawText.split(/\s+/).length;
  const confidence = isSarcasmActive
    ? 0.95
    : (totalPoints === 0 ? 0 : Math.min(1, Math.max(0.35, (totalPoints / Math.max(2, wordCount * 0.5)))));

  return {
    sentiment,
    confidence: Math.round(confidence * 100) / 100,
    scores: {
      positive: Math.round(totalPositivePoints * 10) / 10,
      negative: Math.round(totalNegativePoints * 10) / 10,
      total: Math.round(totalPoints * 10) / 10
    },
    polarity: Math.round(polarity * 100) / 100,
    structuralFeatures: {
      hasNegation: hasNegationDetected,
      hasContrast: hasContrastDetected,
      hasIntensifier: hasIntensifierDetected,
      clauseCount: totalClauses,
      isSarcastic: isSarcasmActive,
      sarcasmType: sarcasmType
    }
  };
}

/**
 * Deteksi bahasa yang lebih canggih dengan analisis linguistik
 * @param {string} text - teks yang akan dideteksi bahasanya
 * @returns {object} hasil deteksi bahasa yang detail
 */
/**
 * Deteksi bahasa yang akurat dengan analisis leksikal dan n-gram
 * @param {string} text - teks yang akan dideteksi bahasanya
 * @returns {object} hasil deteksi bahasa yang detail
 */
export function detectLanguage(text) {
  const cleanText = (text || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  if (!cleanText) {
    return {
      language: 'id',
      confidence: 0.5,
      scores: { indonesian: 0, english: 0 },
      details: { method: 'empty_text' }
    };
  }

  // Extended word lists dengan frekuensi dan bobot
  const indonesianWords = {
    // Common words (high weight)
    'yang': 3, 'dan': 3, 'atau': 3, 'dengan': 3, 'untuk': 3, 'pada': 3,
    'ke': 2, 'dari': 2, 'oleh': 2, 'adalah': 3, 'saya': 3, 'aku': 3, 'kami': 2,
    'anda': 2, 'kamu': 2, 'mereka': 2, 'dia': 2, 'itu': 2, 'ini': 2, 'di': 2, 'mana': 2,

    // Function words & particles
    'tidak': 3, 'nggak': 3, 'gak': 3, 'ada': 2, 'akan': 2, 'sudah': 2, 'udah': 2, 'belum': 2, 'bisa': 2,
    'harus': 2, 'ingin': 2, 'mau': 2, 'perlu': 2, 'boleh': 2, 'jangan': 2, 'saja': 1, 'aja': 1,

    // Question words
    'apa': 3, 'siapa': 3, 'berapa': 3, 'mengapa': 3, 'kenapa': 3, 'bagaimana': 3, 'gimana': 3, 'dimana': 3, 'kapan': 3,

    // Greetings & common interactions
    'halo': 2, 'hai': 2, 'selamat': 2, 'pagi': 2, 'siang': 2, 'sore': 2, 'malam': 2,
    'terima': 2, 'kasih': 2, 'makasih': 2, 'tolong': 2, 'bantu': 2, 'bantuan': 2,

    // Domain & conversational keywords
    'proyek': 2, 'projek': 2, 'pekerjaan': 2, 'pengalaman': 2, 'keahlian': 2, 'tentang': 2
  };

  const englishWords = {
    // Common words (high weight)
    'the': 3, 'and': 3, 'or': 2, 'with': 2, 'for': 2, 'on': 2, 'to': 2,
    'from': 2, 'by': 2, 'is': 3, 'are': 3, 'am': 3, 'was': 3, 'were': 3, 'be': 2,
    'i': 3, 'me': 2, 'my': 2, 'we': 2, 'our': 2, 'you': 3, 'your': 2, 'they': 2,
    'he': 2, 'she': 2, 'it': 2, 'this': 2, 'that': 2, 'these': 2, 'those': 2,

    // Function words
    'not': 3, 'no': 2, 'have': 2, 'has': 2, 'had': 2, 'will': 2, 'would': 2,
    'can': 2, 'could': 2, 'should': 2, 'must': 2, 'do': 2, 'does': 2, 'did': 2,

    // Question words
    'what': 3, 'why': 3, 'how': 3, 'where': 3, 'when': 3, 'who': 3, 'which': 3,

    // Greetings & common interactions
    'hello': 2, 'hi': 2, 'hey': 2, 'good': 2, 'morning': 2, 'afternoon': 2, 'evening': 2, 'night': 2,
    'thank': 2, 'thanks': 2, 'please': 2, 'help': 2,

    // Domain & conversational keywords
    'project': 2, 'projects': 2, 'experience': 2, 'skills': 2, 'about': 2, 'tell': 2, 'show': 2
  };

  // N-gram / Substring pattern analysis (karakteristik unik bahasa)
  const idPatterns = [/\b(meng|peng|ter|ber|per|ke|se)[a-z]{3,}/, /[a-z]+(kan|nya|an|lah|kah|pun)\b/, /\b(ng|ny|sy|kh)[a-z]/];
  const enPatterns = [/\b(th|wh|sh|ch|ph)[a-z]/, /[a-z]+(tion|ing|ed|ly|ness|able|ment)\b/, /\b(ould|ight|ease|ound)\b/];

  let idPatternScore = 0;
  let enPatternScore = 0;

  idPatterns.forEach(pattern => {
    const matches = cleanText.match(new RegExp(pattern, 'g'));
    if (matches) idPatternScore += matches.length * 1.5;
  });

  enPatterns.forEach(pattern => {
    const matches = cleanText.match(new RegExp(pattern, 'g'));
    if (matches) enPatternScore += matches.length * 1.5;
  });

  // Word analysis
  const words = cleanText.split(/\s+/).filter(Boolean);
  let indonesianScore = idPatternScore;
  let englishScore = enPatternScore;
  let recognizedIndonesianWords = 0;
  let recognizedEnglishWords = 0;

  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');

    if (indonesianWords[cleanWord]) {
      indonesianScore += indonesianWords[cleanWord];
      recognizedIndonesianWords++;
    }

    if (englishWords[cleanWord]) {
      englishScore += englishWords[cleanWord];
      recognizedEnglishWords++;
    }
  });

  const totalScore = indonesianScore + englishScore;
  let language = 'id'; // default fallback
  let confidence = 0.5;

  if (totalScore > 0) {
    const indonesianRatio = indonesianScore / totalScore;
    const englishRatio = englishScore / totalScore;

    if (englishRatio > 0.55) {
      language = 'en';
      confidence = Math.min(0.99, englishRatio + 0.1);
    } else if (indonesianRatio > 0.55) {
      language = 'id';
      confidence = Math.min(0.99, indonesianRatio + 0.1);
    } else {
      language = indonesianScore >= englishScore ? 'id' : 'en';
      confidence = Math.max(0.4, Math.abs(indonesianRatio - englishRatio) + 0.3);
    }
  }

  return {
    language,
    confidence: Number(confidence.toFixed(2)),
    scores: {
      indonesian: Number(indonesianScore.toFixed(2)),
      english: Number(englishScore.toFixed(2)),
      total: Number(totalScore.toFixed(2))
    },
    details: {
      method: 'linguistic_n_gram_analysis',
      recognizedWords: {
        indonesian: recognizedIndonesianWords,
        english: recognizedEnglishWords
      }
    }
  };
}

/**
 * Pipeline utama untuk NLU processing
 * @param {string} userMessage - pesan dari user
 * @param {object} options - opsi processing
 * @returns {object} hasil NLU processing lengkap
 */
export function processNLU(userMessage, options = {}) {
  const {
    language = 'id',
    includeLexical = true,
    includeCorpus = true,
    includeNLU = true,
    threshold = 0.5,
    _detailedAnalysis = false
  } = options;
  // 1) PII redaction (always run to avoid accidental leakage)
  const piiResult = redactPII(userMessage, options.piiOptions || {});

  let afterPII = piiResult.text;
  let corefMapping = {};

  // 2) Coreference resolution (if contextManager provided)
  if (options.contextManager) {
    try {
      const coref = resolvePronouns(afterPII, options.contextManager);
      afterPII = coref.resolvedMessage || afterPII;
      corefMapping = coref.mapping || {};
    } catch { /* ignore */ }
  }

  // 3) Optional spell-correction (requires options.vocab = Set)
  let spellCorrections = [];
  if (options.vocab && typeof options.vocab.has === 'function') {
    const corrected = correctText(afterPII, options.vocab, { maxDist: options.spellMaxDist || 2 });
    afterPII = corrected.text;
    spellCorrections = corrected.corrections;
  }

  const normalized = afterPII.toLowerCase().trim();
  const result = {
    original: userMessage,
    normalized: normalized,
    language: language,
    processing: {
      timestamp: new Date().toISOString(),
      processingTime: 0,
      coreference: corefMapping
    },
    components: {}
  };

  // expose PII and spell correction metadata
  result.processing.pii = piiResult.detections || [];
  result.processing.spellCorrections = spellCorrections;

  const startTime = performance.now();

  // ===== 0. SENTIMENT & LANGUAGE ANALYSIS =====
  result.components.sentiment = analyzeSentiment(userMessage);
  const detectedLangResult = detectLanguage(userMessage);
  result.components.language = detectedLangResult;
  const activeLang = (options.language && options.language !== 'auto') ? options.language : detectedLangResult.language;
  result.language = activeLang;

  // ===== 1. LEXICAL ANALYSIS =====
  if (includeLexical) {
    result.components.lexical = analyzeLexicalPipeline(userMessage, activeLang);
  }

  // ===== 2. CORPUS ANALYSIS =====
  if (includeCorpus) {
    result.components.corpus = analyzeCorpusPipeline(userMessage, threshold, activeLang);
  }

  // ===== 3. NLU ANALYSIS =====
  if (includeNLU) {
    result.components.nlu = analyzeNLUPipeline(userMessage);
  }

  // ===== 4. INTEGRATED ANALYSIS =====
  result.integrated = integrateAnalysis(result.components);

  result.processing.processingTime = performance.now() - startTime;

  return result;
}

/**
 * Pipeline untuk analisis lexical
 * @param {string} message - pesan yang akan dianalisis
 * @param {string} language - bahasa (id atau en)
 * @returns {object} hasil analisis lexical
 */
function analyzeLexicalPipeline(message, language) {
  const words = message.split(/\s+/).filter(w => w.length > 0);
  const analysis = {
    words: [],
    totalWords: words.length,
    uniqueWords: new Set(words).size,
    language: language,
    lexicalRichness: 0
  };

  words.forEach((word, index) => {
    const wordAnalysis = analyzeLexical(word, language);
    analysis.words.push({
      position: index + 1,
      ...wordAnalysis
    });
  });

  // Calculate lexical richness (unique words / total words)
  analysis.lexicalRichness = analysis.uniqueWords / analysis.totalWords;

  // Extract key entities/concepts
  analysis.keyConcepts = analysis.words
    .filter(w => w.category && w.category !== 'unknown')
    .slice(0, 5)
    .map(w => ({
      word: w.word,
      category: w.category,
      lemma: w.lemma
    }));

  return analysis;
}

/**
 * Pipeline untuk analisis corpus
 * @param {string} message - pesan yang akan dianalisis
 * @param {number} threshold - similarity threshold
 * @returns {object} hasil analisis corpus
 */
function analyzeCorpusPipeline(message, threshold = 0.5, lang = 'id') {
  const similar = findSimilarSentences(message, threshold);
  const corpusAnalysis = analyzeSentenceInCorpus(message, similar, lang);

  return {
    ...corpusAnalysis,
    similarSentences: similar.slice(0, 5),
    totalSimilarFound: similar.length,
    topMatch: similar.length > 0 ? {
      text: similar[0].text,
      similarity: similar[0].similarity,
      type: similar[0].type,
      context: similar[0].context
    } : null,
    corpusInsights: extractCorpusInsights(message, similar)
  };
}

/**
 * Pipeline untuk analisis NLU
 * @param {string} message - pesan yang akan dianalisis
 * @returns {object} hasil analisis NLU
 */
function analyzeNLUPipeline(message) {
  const fullAnalysis = analyzeNLU(message);

  return {
    intent: fullAnalysis.intent,
    entities: fullAnalysis.entities,
    sentenceType: fullAnalysis.sentenceType,
    analysis: fullAnalysis.analysis,
    enrichedEntities: enrichEntityData(fullAnalysis.entities),
    semanticRelations: extractSemanticRelations(fullAnalysis),
    timestamp: fullAnalysis.timestamp
  };
}

/**
 * Extract insights dari corpus analysis
 * @param {string} message - pesan asli
 * @param {array} similarSentences - kalimat-kalimat serupa
 * @returns {object} insights
 */
export function extractCorpusInsights(message, similarSentences) {
  const insights = {
    dominantType: null,
    dominantContext: null,
    dominantDomain: null,
    conversationPattern: null,
    suggestions: []
  };

  if (similarSentences.length === 0) {
    return insights;
  }

  // Find most common type, context, domain
  const types = {};
  const contexts = {};
  const domains = {};

  similarSentences.forEach(sent => {
    types[sent.type] = (types[sent.type] || 0) + 1;
    contexts[sent.context] = (contexts[sent.context] || 0) + 1;
    if (sent.domain) domains[sent.domain] = (domains[sent.domain] || 0) + 1;
  });

  insights.dominantType = Object.entries(types).sort(([, a], [, b]) => b - a)[0][0];
  insights.dominantContext = Object.entries(contexts).sort(([, a], [, b]) => b - a)[0][0];
  if (Object.keys(domains).length > 0) {
    insights.dominantDomain = Object.entries(domains).sort(([, a], [, b]) => b - a)[0][0];
  }

  // Generate suggestions based on similar sentences
  if (similarSentences.length > 0) {
    insights.suggestions = similarSentences.slice(0, 3).map(sent => ({
      suggestion: sent.text,
      reason: `Mirip dengan "${sent.type}"`
    }));
  }

  return insights;
}

/**
 * Enrich entity data dengan informasi tambahan
 * @param {array} entities - daftar entities
 * @returns {array} enriched entities
 */
export function enrichEntityData(entities) {
  return entities.map(entity => ({
    ...entity,
    lemma: getLemma(entity.value, 'id'),
    synonyms: getSynonyms(entity.value, 'id'),
    normalized: normalizeWord(entity.value, 'id').normalized
  }));
}

/**
 * Extract semantic relations antara entities
 * @param {object} nluAnalysis - hasil NLU analysis
 * @returns {array} semantic relations
 */
export function extractSemanticRelations(nluAnalysis) {
  const relations = [];
  const entities = nluAnalysis.entities;

  // Find relationships between entities
  for (let i = 0; i < entities.length - 1; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const relation = {
        entity1: entities[i],
        entity2: entities[j],
        relation_type: inferRelationType(entities[i], entities[j]),
        confidence: 0.7
      };
      relations.push(relation);
    }
  }

  return relations;
}

/**
 * Infer relation type antara dua entities
 * @param {object} entity1 - entitas pertama
 * @param {object} entity2 - entitas kedua
 * @returns {string} tipe relasi
 */
function inferRelationType(entity1, entity2) {
  // Simple relation inference based on entity types
  const typeMap = {
    'PERSON-LOCATION': 'located_at',
    'PERSON-ORGANIZATION': 'works_at',
    'PERSON-SKILL': 'has_skill',
    'PERSON-DATE': 'associated_with_date',
    'SKILL-PRODUCT': 'used_with',
    'ORGANIZATION-LOCATION': 'located_at'
  };

  const key = `${entity1.type}-${entity2.type}`;
  return typeMap[key] || 'related_to';
}

/**
 * Integrate semua komponen analysis menjadi satu insight
 * @param {object} components - hasil analysis dari berbagai komponen
 * @returns {object} integrated analysis
 */
function integrateAnalysis(components) {
  const integrated = {
    confidence: 0,
    readyToRespond: false,
    suggestedApproach: null,
    qualityScore: 0,
    recommendations: []
  };

  if (!components.nlu) {
    return integrated;
  }

  // Calculate overall confidence
  let confidenceSum = 0;
  let componentCount = 0;

  if (components.nlu) {
    confidenceSum += components.nlu.intent.confidence;
    componentCount++;
  }

  if (components.corpus && components.corpus.topMatch) {
    confidenceSum += components.corpus.topMatch.similarity;
    componentCount++;
  }

  if (components.lexical) {
    confidenceSum += Math.min(components.lexical.lexicalRichness, 1);
    componentCount++;
  }

  if (components.sentiment) {
    confidenceSum += components.sentiment.confidence;
    componentCount++;
  }

  if (components.language) {
    confidenceSum += components.language.confidence;
    componentCount++;
  }

  integrated.confidence = componentCount > 0 ? confidenceSum / componentCount : 0;
  integrated.readyToRespond = integrated.confidence > 0.5;

  // Suggest approach based on intent and corpus
  integrated.suggestedApproach = suggestResponseApproach(components);

  // Quality score (0-100)
  integrated.qualityScore = Math.round(integrated.confidence * 100);

  // Generate recommendations
  integrated.recommendations = generateRecommendations(components);

  return integrated;
}

/**
 * Suggest response approach based on analysis
 * @param {object} components - hasil analysis
 * @returns {string} suggested approach
 */
function suggestResponseApproach(components) {
  if (!components.nlu) return 'general_response';

  const intent = components.nlu.intent.intent;
  const hasCorpusMatch = components.corpus && components.corpus.topMatch;

  if (intent === 'ask_question') {
    return 'answer_question';
  } else if (intent === 'request_information') {
    return 'provide_information';
  } else if (intent === 'greeting') {
    return 'reciprocate_greeting';
  } else if (intent === 'request_help') {
    return 'offer_help';
  } else if (hasCorpusMatch) {
    return 'reference_corpus';
  }

  return 'general_response';
}

/**
 * Generate recommendations untuk meningkatkan respons
 * @param {object} components - hasil analysis
 * @returns {array} daftar rekomendasi
 */
function generateRecommendations(components) {
  const recommendations = [];

  if (components.nlu && components.nlu.intent.confidence < 0.7) {
    recommendations.push({
      type: 'intent_clarity',
      message: 'Intent kurang jelas, pertimbangkan untuk meminta klarifikasi'
    });
  }

  if (components.corpus && !components.corpus.topMatch) {
    recommendations.push({
      type: 'corpus_coverage',
      message: 'Topik tidak ditemukan di corpus, gunakan general knowledge'
    });
  }

  if (components.lexical && components.lexical.lexicalRichness < 0.3) {
    recommendations.push({
      type: 'lexical_analysis',
      message: 'Input menggunakan kata-kata yang terbatas, fokus pada arti utama'
    });
  }

  if (components.nlu && components.nlu.entities.length === 0) {
    recommendations.push({
      type: 'entity_extraction',
      message: 'Tidak ada entitas spesifik, berikan respons umum'
    });
  }

  return recommendations;
}

/**
 * Comprehensive natural language understanding function
 * Menggabungkan semua NLP components untuk understanding yang lebih baik
 * @param {string} userMessage - pesan dari user
 * @returns {object} comprehensive NLU result
 */
export function comprehensiveNLU(userMessage) {
  return processNLU(userMessage, {
    language: 'id',
    includeLexical: true,
    includeCorpus: true,
    includeNLU: true,
    threshold: 0.5,
    detailedAnalysis: true
  });
}

/**
 * Quick NLU untuk performa yang lebih cepat
 * @param {string} userMessage - pesan dari user
 * @returns {object} quick NLU result
 */
export function quickNLU(userMessage) {
  return processNLU(userMessage, {
    language: 'id',
    includeLexical: false,
    includeCorpus: false,
    includeNLU: true,
    detailedAnalysis: false
  });
}

export default {
  processNLU,
  comprehensiveNLU,
  quickNLU,
  analyzeSentiment,
  detectSarcasmAndIrony,
  extractCorpusInsights,
  enrichEntityData,
  extractSemanticRelations
};
