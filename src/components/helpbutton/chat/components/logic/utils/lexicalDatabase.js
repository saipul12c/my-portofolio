/**
 * Lexical Database / Lexicon
 * Kumpulan kata-kata dalam bahasa Indonesia & Inggris
 * dengan makna, bentuk, dan variasi lengkap
 * 
 * Komponen ini digunakan untuk:
 * - Normalisasi dan standardisasi kata
 * - Mencari sinonim dan antonim
 * - Menemukan bentuk dasar kata (lemmatization)
 * - Mengidentifikasi variasi kata
 */

export const LexicalDatabase = {
  // ===== INDONESIAN LEXICON =====
  indonesian: {
    // Greetings & Formalities
    greetings: {
      'halo': { meaning: 'salam pembuka', variations: ['hello', 'hai', 'hey'], synonyms: ['assalamu alaikum', 'selamat pagi'], level: 'informal' },
      'selamat pagi': { meaning: 'ucapan saat pagi', variations: ['pagi', 'selamat'], synonyms: ['good morning'], level: 'formal' },
      'selamat siang': { meaning: 'ucapan saat siang', variations: ['siang'], synonyms: ['good afternoon'], level: 'formal' },
      'selamat sore': { meaning: 'ucapan saat sore', variations: ['sore'], synonyms: ['good evening'], level: 'formal' },
      'terima kasih': { meaning: 'ungkapan rasa syukur', variations: ['thanks', 'thx', 'makasih', 'thanks ya'], synonyms: ['gratitude', 'berterima kasih'], level: 'formal' },
      'maaf': { meaning: 'meminta maaf', variations: ['sorry', 'maafkan saya', 'sorry ya'], synonyms: ['mohon maaf', 'ampun'], level: 'formal' }
    },

    // Technical/AI Terms
    technical: {
      'kecerdasan buatan': { meaning: 'sistem yang meniru intelegensi manusia', variations: ['ai', 'artificial intelligence'], synonyms: ['ai', 'machine intelligence', 'kecerdasan mesin'], level: 'academic' },
      'pembelajaran mesin': { meaning: 'teknik untuk mengajarkan komputer dari data', variations: ['machine learning', 'ml'], synonyms: ['supervised learning', 'unsupervised learning', 'pembelajaran terbimbing'], level: 'academic' },
      'jaringan saraf': { meaning: 'struktur komputasi yang meniru otak', variations: ['neural network', 'nn', 'deep learning'], synonyms: ['artificial neural network', 'ann'], level: 'academic' },
      'data': { meaning: 'informasi atau fakta', variations: ['data', 'information', 'info'], synonyms: ['informasi', 'fakta', 'nilai'], level: 'technical' },
      'algoritma': { meaning: 'prosedur langkah demi langkah', variations: ['algorithm', 'prosedur'], synonyms: ['metode', 'rumus'], level: 'technical' },
      'model': { meaning: 'representasi sistem atau proses', variations: ['model', 'sistem', 'pattern'], synonyms: ['representasi', 'pola', 'prototype'], level: 'technical' }
    },

    // Question Words
    questionWords: {
      'apa': { meaning: 'pertanyaan tentang sesuatu', pos: 'interrogative', variations: ['apa itu', 'apa yang'] },
      'siapa': { meaning: 'pertanyaan tentang orang', pos: 'interrogative', variations: ['siapa itu', 'siapa sih'] },
      'mana': { meaning: 'pertanyaan tentang lokasi/pilihan', pos: 'interrogative', variations: ['mana yang', 'yang mana'] },
      'berapa': { meaning: 'pertanyaan tentang jumlah', pos: 'interrogative', variations: ['berapa banyak', 'brp'] },
      'kapan': { meaning: 'pertanyaan tentang waktu', pos: 'interrogative', variations: ['kapan sih', 'jam berapa'] },
      'di mana': { meaning: 'pertanyaan tentang tempat', pos: 'interrogative', variations: ['dimana', 'lokasi mana'] },
      'bagaimana': { meaning: 'pertanyaan tentang cara/kondisi', pos: 'interrogative', variations: ['bagaimana cara', 'bgm', 'gmn'] }
    },

    // Common Verbs
    verbs: {
      'adalah': { meaning: 'menyatakan keadaan', tense: 'present', base: 'adalah', variations: ['ialah', 'merupakan'] },
      'membuat': { meaning: 'menciptakan sesuatu', tense: 'present', base: 'buat', variations: ['bikin', 'ciptakan', 'membuat'] },
      'mengetahui': { meaning: 'memiliki pengetahuan', tense: 'present', base: 'tahu', variations: ['tahu', 'tau', 'mengerti'] },
      'membantu': { meaning: 'memberikan bantuan', tense: 'present', base: 'bantu', variations: ['bantu', 'bantuan', 'membantu'] },
      'menggunakan': { meaning: 'memakai sesuatu', tense: 'present', base: 'guna', variations: ['pakai', 'menggunakan', 'pakai'] },
      'belajar': { meaning: 'memperoleh pengetahuan', tense: 'present', base: 'ajar', variations: ['belajar', 'studying', 'pelajari'] }
    },

    // Emotions/Sentiments
    emotions: {
      'baik': { polarity: 'positive', intensity: 0.7, variations: ['bagus', 'oke', 'ok', 'good'], synonyms: ['bagus', 'sempurna', 'hebat'] },
      'bagus': { polarity: 'positive', intensity: 0.8, variations: ['baik', 'mantap', 'keren'], synonyms: ['excellent', 'hebat'] },
      'hebat': { polarity: 'positive', intensity: 0.9, variations: ['luar biasa', 'amazing'], synonyms: ['fantastis', 'mengagumkan'] },
      'buruk': { polarity: 'negative', intensity: 0.7, variations: ['jelek', 'tidak baik'], synonyms: ['bad', 'tidak bagus'] },
      'sedih': { polarity: 'negative', intensity: 0.8, variations: ['sedih', 'muram'], synonyms: ['sad', 'melankolis', 'murung'] },
      'senang': { polarity: 'positive', intensity: 0.7, variations: ['senang', 'gembira'], synonyms: ['happy', 'bahagia', 'ceria'] }
    }
  },

  // ===== ENGLISH LEXICON =====
  english: {
    greetings: {
      'hello': { meaning: 'a greeting', variations: ['hi', 'hey', 'hallo'], synonyms: ['greetings', 'welcome'], level: 'informal' },
      'good morning': { meaning: 'greeting in the morning', variations: ['morning', 'gm'], synonyms: ['hello'], level: 'formal' },
      'thank you': { meaning: 'expression of gratitude', variations: ['thanks', 'thx', 'thank u'], synonyms: ['appreciation', 'gratitude'], level: 'formal' },
      'sorry': { meaning: 'apology', variations: ['sorry mate', 'my bad'], synonyms: ['apology', 'excuse me'], level: 'formal' }
    },

    technical: {
      'artificial intelligence': { meaning: 'simulation of human intelligence by machines', variations: ['ai', 'ai system'], synonyms: ['machine intelligence', 'intelligent system'], level: 'academic' },
      'machine learning': { meaning: 'technique to teach computers from data', variations: ['ml', 'learning'], synonyms: ['statistical learning', 'data-driven learning'], level: 'academic' },
      'neural network': { meaning: 'computational structure mimicking brain', variations: ['nn', 'network', 'deep learning'], synonyms: ['artificial neural network', 'ann'], level: 'academic' },
      'algorithm': { meaning: 'step-by-step procedure', variations: ['algo', 'procedure'], synonyms: ['method', 'process', 'formula'], level: 'technical' },
      'data': { meaning: 'facts or information', variations: ['information', 'info', 'dataset'], synonyms: ['facts', 'information', 'metrics'], level: 'technical' }
    },

    emotions: {
      'good': { polarity: 'positive', intensity: 0.7, variations: ['ok', 'fine', 'nice'], synonyms: ['great', 'well', 'nice'] },
      'great': { polarity: 'positive', intensity: 0.9, variations: ['excellent', 'awesome', 'fantastic'], synonyms: ['excellent', 'wonderful', 'superb'] },
      'bad': { polarity: 'negative', intensity: 0.7, variations: ['poor', 'awful'], synonyms: ['terrible', 'horrible'] },
      'sad': { polarity: 'negative', intensity: 0.8, variations: ['unhappy', 'gloomy'], synonyms: ['melancholy', 'sorrowful', 'downhearted'] }
    }
  },

  // ===== CROSS-LANGUAGE MAPPINGS =====
  bilingualMappings: {
    // Kamus pasangan kata Indonesia-Inggris dengan makna yang sama
    'halo-hello': { indonesian: 'halo', english: 'hello', category: 'greetings' },
    'terima kasih-thank you': { indonesian: 'terima kasih', english: 'thank you', category: 'greetings' },
    'maaf-sorry': { indonesian: 'maaf', english: 'sorry', category: 'greetings' },
    'kecerdasan buatan-artificial intelligence': { indonesian: 'kecerdasan buatan', english: 'artificial intelligence', category: 'technical' },
    'pembelajaran mesin-machine learning': { indonesian: 'pembelajaran mesin', english: 'machine learning', category: 'technical' },
    'jaringan saraf-neural network': { indonesian: 'jaringan saraf', english: 'neural network', category: 'technical' },
    'data-data': { indonesian: 'data', english: 'data', category: 'technical' },
    'algoritma-algorithm': { indonesian: 'algoritma', english: 'algorithm', category: 'technical' },
    'senang-happy': { indonesian: 'senang', english: 'happy', category: 'emotions' },
    'sedih-sad': { indonesian: 'sedih', english: 'sad', category: 'emotions' }
  }
};

/**
 * Find lemma (base form) dari sebuah kata
 * @param {string} word - kata yang akan dicari bentuk dasarnya
 * @param {string} language - 'id' atau 'en'
 * @returns {string} bentuk dasar kata
 */
export function getLemma(word, language = 'id') {
  const normalized = word.toLowerCase().trim();
  const db = language === 'id' ? LexicalDatabase.indonesian : LexicalDatabase.english;
  
  // Cari di semua kategori
  for (const category of Object.values(db)) {
    if (category[normalized]) {
      return category[normalized].base || normalized;
    }
    
    // Cari di variations
    for (const [lemma, data] of Object.entries(category)) {
      if (data.variations && data.variations.includes(normalized)) {
        return data.base || lemma;
      }
    }
  }
  
  return normalized;
}

/**
 * Cari sinonim dari sebuah kata
 * @param {string} word - kata yang akan dicari sinonimnya
 * @param {string} language - 'id' atau 'en'
 * @returns {array} daftar sinonim
 */
export function getSynonyms(word, language = 'id') {
  const normalized = word.toLowerCase().trim();
  const db = language === 'id' ? LexicalDatabase.indonesian : LexicalDatabase.english;
  
  for (const category of Object.values(db)) {
    for (const [key, data] of Object.entries(category)) {
      if (key === normalized || (data.variations && data.variations.includes(normalized))) {
        return data.synonyms || [];
      }
    }
  }
  
  return [];
}

/**
 * Cari makna dari sebuah kata
 * @param {string} word - kata yang akan dicari maknanya
 * @param {string} language - 'id' atau 'en'
 * @returns {object} informasi makna kata
 */
export function getWordMeaning(word, language = 'id') {
  const normalized = word.toLowerCase().trim();
  const db = language === 'id' ? LexicalDatabase.indonesian : LexicalDatabase.english;
  
  for (const [category, words] of Object.entries(db)) {
    for (const [key, data] of Object.entries(words)) {
      if (key === normalized) {
        return {
          word: normalized,
          ...data,
          category: category,
          lemma: data.base || normalized
        };
      }
      
      // Cari di variations
      if (data.variations && data.variations.includes(normalized)) {
        return {
          word: normalized,
          ...data,
          category: category,
          lemma: data.base || key,
          foundIn: 'variations'
        };
      }
    }
  }
  
  return {
    word: normalized,
    meaning: 'Tidak ditemukan dalam lexicon',
    category: 'unknown',
    confidence: 0
  };
}

/**
 * Cari word variants/variasi
 * @param {string} word - kata yang akan dicari variasinya
 * @param {string} language - 'id' atau 'en'
 * @returns {array} daftar variasi kata
 */
export function getWordVariants(word, language = 'id') {
  const normalized = word.toLowerCase().trim();
  const db = language === 'id' ? LexicalDatabase.indonesian : LexicalDatabase.english;
  
  for (const category of Object.values(db)) {
    for (const [key, data] of Object.entries(category)) {
      if (key === normalized || (data.variations && data.variations.includes(normalized))) {
        return data.variations || [];
      }
    }
  }
  
  return [];
}

/**
 * Normalize kata (menghubungkan ke bentuk standar)
 * @param {string} word - kata yang akan dinormalisasi
 * @param {string} language - 'id' atau 'en'
 * @returns {object} informasi normalisasi
 */
export function normalizeWord(word, language = 'id') {
  const normalized = word.toLowerCase().trim();
  const db = language === 'id' ? LexicalDatabase.indonesian : LexicalDatabase.english;
  
  // Cari exact match
  for (const category of Object.values(db)) {
    if (category[normalized]) {
      return {
        original: word,
        normalized: normalized,
        standard: normalized,
        matchType: 'exact',
        language: language
      };
    }
  }
  
  // Cari di variations
  for (const category of Object.values(db)) {
    for (const [key, data] of Object.entries(category)) {
      if (data.variations && data.variations.includes(normalized)) {
        return {
          original: word,
          normalized: normalized,
          standard: data.base || key,
          matchType: 'variation',
          language: language
        };
      }
    }
  }
  
  return {
    original: word,
    normalized: normalized,
    standard: normalized,
    matchType: 'not_found',
    language: language
  };
}

/**
 * Get detailed lexical analysis
 * @param {string} word - kata yang akan dianalisis
 * @param {string} language - 'id' atau 'en'
 * @returns {object} analisis lengkap kata
 */
export function analyzeLexical(word, language = 'id') {
  const meaning = getWordMeaning(word, language);
  const variants = getWordVariants(word, language);
  const synonyms = getSynonyms(word, language);
  const normalized = normalizeWord(word, language);
  const lemma = getLemma(word, language);
  
  return {
    word: word,
    language: language,
    normalized: normalized,
    lemma: lemma,
    meaning: meaning.meaning,
    category: meaning.category,
    pos: meaning.pos, // part of speech
    polarity: meaning.polarity, // untuk sentimen
    intensity: meaning.intensity, // untuk sentimen
    level: meaning.level,
    variants: variants,
    synonyms: synonyms,
    confidence: meaning.confidence || 0.8,
    timestamp: new Date().toISOString()
  };
}

export default LexicalDatabase;
