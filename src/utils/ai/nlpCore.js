/**
 * Unified NLP Core Utilities
 * Sentralisasi tokenisasi, stop-words, sinonim, dan intent detection
 * untuk seluruh AI di proyek my-porto (SaipulAI, Blog AI, Project AI, SoftSkills AI, FAQ AI).
 */

// Daftar stop-words terpadu (Bahasa Indonesia & English)
export const STOP_WORDS = new Set([
  // Kata hubung & depan
  'yang', 'dan', 'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'dengan', 'oleh',
  'tentang', 'seperti', 'sebagai', 'atau', 'serta', 'namun', 'tetapi', 'karena',
  'sehingga', 'jika', 'bila', 'agar', 'supaya', 'meski', 'walau', 'tanpa',
  
  // Kata ganti & penunjuk
  'ini', 'itu', 'tersebut', 'dia', 'ia', 'mereka', 'kita', 'kami', 'saya', 'aku',
  'kamu', 'anda', 'kalian', 'siapa', 'apa', 'mana', 'kapan', 'bagaimana', 'mengapa',
  'kenapa', 'apakah', 'adakah', 'adalah', 'ialah', 'yaitu', 'merupakan',
  
  // Kata bantu & partikel
  'ada', 'bisa', 'dapat', 'akan', 'telah', 'sudah', 'sedang', 'lagi', 'masih',
  'belum', 'jangan', 'bukan', 'tidak', 'tak', 'hanya', 'cuma', 'saja', 'pun',
  'lah', 'kah', 'tah', 'sih', 'dong', 'deh', 'ya', 'kan', 'kok', 'banget', 'sangat',
  'paling', 'lebih', 'kurang', 'terlalu', 'pula', 'juga',
  
  // English common stop words
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'with', 'for', 'to', 'of'
]);

// Kamus sinonim & istilah terpadu
export const SYNONYM_MAP = {
  // Skill & Keahlian
  'kemampuan': 'skill',
  'keahlian': 'skill',
  'kompetensi': 'skill',
  'kecakapan': 'skill',
  'kemahiran': 'experience',
  'penguasaan': 'experience',
  'jam terbang': 'experience',
  'tingkat': 'level',
  'level': 'level',
  'lvl': 'level',

  // Proyek & Portofolio
  'proyek': 'project',
  'project': 'project',
  'portofolio': 'project',
  'portfolio': 'project',
  'karya': 'project',
  'aplikasi': 'project',
  'website': 'project',
  'web': 'project',
  'sistem': 'project',

  // Artikel & Blog
  'artikel': 'blog',
  'tulisan': 'blog',
  'bacaan': 'blog',
  'posting': 'blog',
  'post': 'blog',
  'postingan': 'blog',

  // Sertifikat & Prestasi
  'sertifikat': 'certificate',
  'sertifikasi': 'certificate',
  'lisensi': 'certificate',
  'piagam': 'certificate',
  'ijazah': 'certificate',
  'penghargaan': 'certificate',
  'award': 'certificate',

  // Testimoni & Review
  'testimoni': 'testimonial',
  'testimonial': 'testimonial',
  'ulasan': 'testimonial',
  'review': 'testimonial',
  'rekomendasi': 'testimonial',
  'pendapat': 'testimonial',
  'kata orang': 'testimonial',

  // Pemilik / Author
  'saipul': 'owner',
  'syaiful': 'owner',
  'mukmin': 'owner',
  'pembuat': 'owner',
  'pemilik': 'owner',
  'author': 'owner',
  'penulis': 'owner',
  'profil': 'profile',
  'biodata': 'profile',
  'tentang': 'profile',
  'biografi': 'profile',

  // Fotografi
  'foto': 'photography',
  'fotografi': 'photography',
  'gambar': 'photography',
  'kamera': 'photography',
  'jepretan': 'photography',

  // Kontak
  'kontak': 'contact',
  'hubungi': 'contact',
  'email': 'contact',
  'whatsapp': 'contact',
  'wa': 'contact'
};

/**
 * Membersihkan teks dari karakter non-alfanumerik berlebih
 */
export const cleanText = (text = '') => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\d-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Mengubah kalimat menjadi token kata individual
 */
export const tokenize = (text = '') => {
  const cleaned = cleanText(text);
  if (!cleaned) return [];
  return cleaned.split(/\s+/).filter(word => word.length > 1);
};

/**
 * Mengekstraksi kata kunci bermakna (membuang stop-words & duplikat)
 */
export const extractKeywords = (text = '') => {
  const tokens = tokenize(text);
  const keywords = tokens.filter(word => !STOP_WORDS.has(word));
  return [...new Set(keywords)];
};

/**
 * Memetakan sinonim ke istilah kanonik
 */
export const mapSynonyms = (text = '') => {
  if (typeof text !== 'string') return '';
  let mapped = text.toLowerCase();
  
  Object.keys(SYNONYM_MAP).forEach(syn => {
    const regex = new RegExp(`\\b${syn}\\b`, 'gi');
    mapped = mapped.replace(regex, SYNONYM_MAP[syn]);
  });
  
  return mapped;
};

/**
 * Mendeteksi intent dasar dari pertanyaan pengguna
 */
export const detectIntents = (query = '') => {
  const q = (query || '').toLowerCase().trim();
  
  return {
    isWho: /\b(siapa|who|pemilik|pembuat|author|penulis|biodata|profil)\b/i.test(q),
    isWhat: /\b(apa|apakah|what|maksud|arti|definisi|pengertian)\b/i.test(q),
    isHow: /\b(bagaimana|cara|gimana|how|langkah|tutorial|tips)\b/i.test(q),
    isWhy: /\b(mengapa|kenapa|why|alasan|sebab)\b/i.test(q),
    isWhen: /\b(kapan|when|tahun|tanggal|waktu)\b/i.test(q),
    isRecommendation: /\b(rekomendasi|saran|terbaik|favorit|juara|bagus|paling)\b/i.test(q),
    isContact: /\b(kontak|hubungi|email|nomor|hire|kerja sama|kolaborasi)\b/i.test(q),
    isComparison: /\b(banding|beda|vs|versus|atau|mana yang lebih)\b/i.test(q),
    isGreeting: /\b(halo|hai|hello|hi|pagi|siang|sore|malam|assalamualaikum)\b/i.test(q),
    isThanks: /\b(terima kasih|makasih|thanks|thank you|syukron)\b/i.test(q)
  };
};

export default {
  STOP_WORDS,
  SYNONYM_MAP,
  cleanText,
  tokenize,
  extractKeywords,
  mapSynonyms,
  detectIntents
};

