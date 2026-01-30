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
  'error', 'bug', 'error', 'broken', 'tidak berfungsi',
  'jangan lupa', 'jangan terlupakan', 'perhatian',
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

/**
 * Score pesan berdasarkan berbagai faktor
 * @param {string} message - Isi pesan
 * @param {string} email - Email pengirim
 * @returns {Object} { score: number, level: 'high' | 'normal', reasons: string[] }
 */
export const analyzePriority = (message = '', email = '') => {
  let score = 50; // Base score
  const reasons = [];
  
  // Note: _name parameter digunakan untuk potential future enhancement
  if (!message || typeof message !== 'string') {
    return { score: 50, level: 'normal', reasons: ['Pesan kosong'] };
  }

  const messageLower = message.toLowerCase();
  const messageLength = message.length;
  const wordCount = message.trim().split(/\s+/).length;

  // 1. Analisis panjang pesan
  // Pesan panjang biasanya lebih detail dan penting
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
  let urgentCount = 0;
  URGENT_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = messageLower.match(regex);
    if (matches) {
      urgentCount += matches.length;
    }
  });

  if (urgentCount > 0) {
    score += Math.min(urgentCount * 15, 40); // Max +40 untuk urgent keywords
    reasons.push(`Ditemukan ${urgentCount} kata urgent`);
  }

  // 3. Cek low priority keywords
  let lowPriorityCount = 0;
  LOW_PRIORITY_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = messageLower.match(regex);
    if (matches) {
      lowPriorityCount += matches.length;
    }
  });

  if (lowPriorityCount > 0) {
    score -= Math.min(lowPriorityCount * 10, 30); // Max -30 untuk low priority keywords
    reasons.push(`Ditemukan ${lowPriorityCount} kata low-priority`);
  }

  // 4. Cek huruf BESAR (caps lock) - indikasi excitement/urgency
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  const capsPercentage = capsCount / messageLength;
  if (capsPercentage > 0.3) {
    score += 15;
    reasons.push('Banyak huruf besar (indikasi excitement)');
  }

  // 5. Cek tanda seru dan tanda tanya
  const exclamationMarks = (message.match(/!/g) || []).length;
  const questionMarks = (message.match(/\?/g) || []).length;
  
  if (exclamationMarks > 3) {
    score += 10;
    reasons.push('Banyak tanda seru (emosi tinggi)');
  }
  
  if (questionMarks > 5) {
    score += 5;
    reasons.push('Banyak pertanyaan (engagement tinggi)');
  }

  // 6. Cek email domain (corporate emails lebih penting)
  const corporateDomains = [
    'company', 'corp', 'enterprise', 'organization', 'org',
    'gov', 'edu', 'ac', 'co', 'business', 'professional'
  ];
  const isCorporateEmail = corporateDomains.some(domain => email.includes(domain));
  if (isCorporateEmail) {
    score += 5;
    reasons.push('Email dari domain bisnis');
  }

  // 7. Cek format struktur (bullet points, numbering)
  const hasBulletPoints = /[-•*]\s|^\d+\.|^\d+\)/m.test(message);
  if (hasBulletPoints) {
    score += 10;
    reasons.push('Pesan terstruktur dengan bullet points');
  }

  // 8. Analisis sentiment dari struktur kalimat
  const hasGreeting = /halo|hi|hello|assalamualaikum|salam/i.test(message);
  const hasClosing = /terima kasih|thanks|regards|salam hormat|best|br|thanks|cheers/i.test(message);
  
  if (hasGreeting && hasClosing) {
    score += 8;
    reasons.push('Pesan formal dan profesional');
  }

  // 9. Cek konteks bisnis/kolaborasi
  const hasBusinessContext = /project|proyek|contract|kontrak|meeting|pertemuan|proposal|porposal|collaboration|kolaborasi|partnership|kemitraan|budget|timeline/i.test(message);
  if (hasBusinessContext) {
    score += 15;
    reasons.push('Konteks bisnis/kolaborasi terdeteksi');
  }

  // Normalize score (0-100)
  score = Math.max(0, Math.min(100, score));

  // Determine priority level berdasarkan score
  let level = 'normal';
  if (score >= 70) {
    level = 'high';
  } else if (score <= 30) {
    level = 'low'; // Bisa ditambahkan kalau perlu
  }

  return {
    score: Math.round(score),
    level,
    reasons,
    details: {
      messageLength,
      wordCount,
      urgentCount,
      lowPriorityCount,
      hasBulletPoints,
      hasBusinessContext,
      isCorporateEmail
    }
  };
};

/**
 * Get simple priority level (high/normal) berdasarkan pesan
 */
export const getPriorityLevel = (message = '', email = '') => {
  const analysis = analyzePriority(message, email);
  return analysis.level;
};

/**
 * Check apakah pesan should be marked as priority
 */
export const shouldMarkAsPriority = (message = '', email = '') => {
  const analysis = analyzePriority(message, email);
  return analysis.level === 'high';
};
