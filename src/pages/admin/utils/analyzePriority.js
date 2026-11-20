/**
 * Menganalisis dan menentukan priority level dari sebuah pesan
 * berdasarkan berbagai faktor
 */

// Keyword yang menandakan urgent/penting
const URGENT_KEYWORDS = [
  'urgent', 'mendesak', 'asap', 'cepat', 'secepatnya',
  'penting', 'critical', 'emergency', 'darurat',
  'segera', 'butuh', 'harus', 'must', 'perlu',
  'deadline', 'tergesa', 'masalah', 'problem', 'issue',
  'broken', 'tidak berfungsi', 'jangan lupa', 'perhatian',
  'collaboration', 'kolaborasi', 'partnership', 'project',
  'proyek', 'business', 'bisnis', 'opportunity', 'kesempatan'
];

// Keyword yang menandakan low priority
const LOW_PRIORITY_KEYWORDS = [
  'informasi', 'info', 'sekedar', 'hanya', 'just',
  'curious', 'ingin tahu', 'interested', 'tertarik',
  'pertanyaan', 'question', 'feedback', 'saran',
  'suggestion', 'testing', 'test', 'coba'
];

// Pre-compiled regexes for maximum performance
const URGENT_REGEX = new RegExp(`\\b(${URGENT_KEYWORDS.join('|')})\\b`, 'i');
const URGENT_REGEX_GLOBAL = new RegExp(`\\b(${URGENT_KEYWORDS.join('|')})\\b`, 'gi');
const LOW_PRIORITY_REGEX_GLOBAL = new RegExp(`\\b(${LOW_PRIORITY_KEYWORDS.join('|')})\\b`, 'gi');

// Lightweight in-memory cache to prevent re-analyzing identical messages (O(1) lookup)
const analysisCache = new Map();
const MAX_CACHE_SIZE = 150;

/**
 * Score pesan berdasarkan berbagai faktor
 * @param {string} message - Isi pesan
 * @param {string} email - Email pengirim
 * @returns {Object} { score: number, level: 'high' | 'normal', reasons: string[] }
 */
export const analyzePriority = (message = '', email = '') => {
  if (!message || typeof message !== 'string') {
    return { score: 50, level: 'normal', reasons: ['Pesan kosong'] };
  }

  const cacheKey = `${message.length}:${email}:${message.slice(0, 60)}`;
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey);
  }

  let score = 50; // Base score
  const reasons = [];

  const messageLower = message.toLowerCase();
  const messageLength = message.length;
  const wordCount = message.trim().split(/\s+/).length;

  // 1. Analisis panjang pesan
  if (messageLength > 500) {
    score += 20;
    reasons.push('Pesan detail (500+ karakter)');
  } else if (messageLength > 200) {
    score += 10;
    reasons.push('Pesan cukup detail');
  } else if (messageLength < 50) {
    score -= 10;
    reasons.push('Pesan sangat singkat');
  }

  // 2. Cek urgent keywords
  const urgentMatches = messageLower.match(URGENT_REGEX_GLOBAL);
  const urgentCount = urgentMatches ? urgentMatches.length : 0;
  if (urgentCount > 0) {
    score += Math.min(urgentCount * 15, 40);
    reasons.push(`Ditemukan ${urgentCount} kata urgent`);
  }

  // 3. Cek low priority keywords
  const lowPriorityMatches = messageLower.match(LOW_PRIORITY_REGEX_GLOBAL);
  const lowPriorityCount = lowPriorityMatches ? lowPriorityMatches.length : 0;
  if (lowPriorityCount > 0) {
    score -= Math.min(lowPriorityCount * 10, 30);
    reasons.push(`Ditemukan ${lowPriorityCount} kata low-priority`);
  }

  // 4. Cek huruf BESAR (caps lock)
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  if (capsCount / messageLength > 0.3) {
    score += 15;
    reasons.push('Banyak huruf besar');
  }

  // 5. Cek tanda seru dan tanda tanya
  const exclamationMarks = (message.match(/!/g) || []).length;
  const questionMarks = (message.match(/\?/g) || []).length;
  if (exclamationMarks > 3) {
    score += 10;
  }
  if (questionMarks > 5) {
    score += 5;
  }

  // 6. Cek email domain
  const isCorporateEmail = /(?:company|corp|enterprise|org|gov|edu|ac|co|business|professional)/i.test(email);
  if (isCorporateEmail) {
    score += 5;
    reasons.push('Email bisnis/instansi');
  }

  // 7. Cek format struktur
  if (/[-•*]\s|^\d+\.|^\d+\)/m.test(message)) {
    score += 10;
  }

  // 8. Analisis formal greeting & closing
  const hasGreeting = /halo|hi|hello|assalamualaikum|salam/i.test(message);
  const hasClosing = /terima kasih|thanks|regards|salam hormat|best|cheers/i.test(message);
  if (hasGreeting && hasClosing) {
    score += 8;
  }

  // 9. Cek konteks bisnis/kolaborasi
  if (/project|proyek|contract|kontrak|meeting|proposal|collaboration|kolaborasi|partnership|budget|timeline/i.test(message)) {
    score += 15;
    reasons.push('Konteks kolaborasi terdeteksi');
  }

  // Normalize score (0-100)
  score = Math.max(0, Math.min(100, Math.round(score)));

  let level = 'normal';
  if (score >= 70) {
    level = 'high';
  } else if (score <= 30) {
    level = 'low';
  }

  const result = {
    score,
    level,
    reasons,
    details: {
      messageLength,
      wordCount,
      urgentCount,
      lowPriorityCount,
      isCorporateEmail
    }
  };

  if (analysisCache.size >= MAX_CACHE_SIZE) {
    // Clear oldest items
    const firstKey = analysisCache.keys().next().value;
    analysisCache.delete(firstKey);
  }
  analysisCache.set(cacheKey, result);

  return result;
};

/**
 * Get simple priority level (high/normal) berdasarkan pesan
 */
export const getPriorityLevel = (message = '', email = '') => {
  return analyzePriority(message, email).level;
};

/**
 * Check apakah pesan should be marked as priority
 */
export const shouldMarkAsPriority = (message = '', email = '') => {
  return analyzePriority(message, email).level === 'high';
};
