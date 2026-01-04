/**
 * Language Corpus (Korpus Bahasa)
 * Dataset besar dari kalimat nyata untuk:
 * - Melatih model NLP
 * - Menganalisis pola bahasa
 * - Meningkatkan pemahaman konteks
 * 
 * Komponen ini menyediakan:
 * - Pola percakapan yang umum
 * - Domain-specific language
 * - Variasi ekspresi yang sama artinya
 */

export const LanguageCorpus = {
  /**
   * GREETING CORPUS
   * Berbagai cara untuk menyapa dan merespons salam
   */
  greetings: [
    { id: 'gr_001', text: 'Halo, apa kabar?', language: 'id', type: 'greeting', context: 'casual', sentiment: 'positive' },
    { id: 'gr_002', text: 'Hi, how are you?', language: 'en', type: 'greeting', context: 'casual', sentiment: 'positive' },
    { id: 'gr_003', text: 'Selamat pagi', language: 'id', type: 'greeting', context: 'formal', sentiment: 'positive', timeOfDay: 'morning' },
    { id: 'gr_004', text: 'Selamat siang', language: 'id', type: 'greeting', context: 'formal', sentiment: 'positive', timeOfDay: 'afternoon' },
    { id: 'gr_005', text: 'Assalamu alaikum', language: 'id', type: 'greeting', context: 'formal_religious', sentiment: 'positive' },
    { id: 'gr_006', text: 'Wa alaikum assalam', language: 'id', type: 'greeting_response', context: 'formal_religious', sentiment: 'positive' },
    { id: 'gr_007', text: 'Apa kabar hari ini?', language: 'id', type: 'greeting_question', context: 'friendly', sentiment: 'positive' },
    { id: 'gr_008', text: 'Kabar baik-baik saja terima kasih', language: 'id', type: 'greeting_response', context: 'formal', sentiment: 'positive' }
  ],

  /**
   * QUESTION CORPUS
   * Berbagai tipe pertanyaan dan pola pertanyaan
   */
  questions: [
    { id: 'q_001', text: 'Apa itu kecerdasan buatan?', language: 'id', type: 'definition_question', intent: 'learn', domain: 'ai' },
    { id: 'q_002', text: 'Bagaimana cara kerja machine learning?', language: 'id', type: 'process_question', intent: 'understand', domain: 'ai' },
    { id: 'q_003', text: 'Siapa Anda?', language: 'id', type: 'identity_question', intent: 'identify', domain: 'general' },
    { id: 'q_004', text: 'Di mana Anda berada?', language: 'id', type: 'location_question', intent: 'locate', domain: 'general' },
    { id: 'q_005', text: 'Kapan saya bisa bertemu Anda?', language: 'id', type: 'time_question', intent: 'schedule', domain: 'general' },
    { id: 'q_006', text: 'Berapa biaya layanan Anda?', language: 'id', type: 'price_question', intent: 'inquire', domain: 'business' },
    { id: 'q_007', text: 'What is a neural network?', language: 'en', type: 'definition_question', intent: 'learn', domain: 'ai' },
    { id: 'q_008', text: 'Can you help me with coding?', language: 'en', type: 'capability_question', intent: 'request', domain: 'technical' }
  ],

  /**
   * STATEMENT CORPUS
   * Berbagai bentuk pernyataan
   */
  statements: [
    { id: 's_001', text: 'Saya sedang belajar tentang AI.', language: 'id', type: 'informative_statement', sentiment: 'neutral', domain: 'education' },
    { id: 's_002', text: 'Anda adalah chatbot yang hebat.', language: 'id', type: 'compliment', sentiment: 'positive', domain: 'evaluation' },
    { id: 's_003', text: 'Saya tidak mengerti dengan jawaban itu.', language: 'id', type: 'confusion_statement', sentiment: 'negative', domain: 'feedback' },
    { id: 's_004', text: 'Machine learning adalah bagian penting dari AI.', language: 'id', type: 'informative_statement', sentiment: 'neutral', domain: 'ai' },
    { id: 's_005', text: 'Saya suka belajar dengan Anda.', language: 'id', type: 'preference_statement', sentiment: 'positive', domain: 'feedback' },
    { id: 's_006', text: 'I think this is very helpful.', language: 'en', type: 'opinion_statement', sentiment: 'positive', domain: 'feedback' }
  ],

  /**
   * CONVERSATION PATTERNS
   * Pola percakapan yang umum terjadi
   */
  conversationPatterns: [
    {
      id: 'cp_001',
      name: 'Greeting-Response-Discussion',
      pattern: [
        'Halo!',
        'Hai, ada yang bisa aku bantu?',
        'Aku ingin tahu tentang AI',
        'Tentu! AI adalah...'
      ]
    },
    {
      id: 'cp_002',
      name: 'Question-Answer-Clarification',
      pattern: [
        'Apa itu neural network?',
        'Neural network adalah...',
        'Bisa dijelaskan lebih detail?',
        'Tentu, neural network terdiri dari...'
      ]
    },
    {
      id: 'cp_003',
      name: 'Problem-Solution',
      pattern: [
        'Saya punya masalah dengan code',
        'Masalah apa yang kamu hadapi?',
        'Error pada line 42',
        'Mungkin masalahnya adalah...'
      ]
    },
    {
      id: 'cp_004',
      name: 'Appreciation-Acknowledgment',
      pattern: [
        'Terima kasih atas bantuannya',
        'Sama-sama, senang bisa membantu',
        'Ini sangat bermanfaat',
        'Senang dengar itu!'
      ]
    }
  ],

  /**
   * DOMAIN-SPECIFIC CORPUS
   * Kumpulan kalimat spesifik per domain
   */
  domainSpecific: {
    ai: [
      'Kecerdasan buatan adalah simulasi dari proses intelijen manusia oleh mesin.',
      'Machine learning adalah cabang dari kecerdasan buatan yang fokus pada pembelajaran dari data.',
      'Neural network terinspirasi dari struktur biologis otak manusia.',
      'Deep learning menggunakan multiple layers dalam neural network.',
      'Natural language processing memungkinkan komputer memahami bahasa manusia.',
      'Computer vision adalah tentang mengajarkan mesin untuk "melihat" dan memahami gambar.',
      'Supervised learning memerlukan labeled data untuk pelatihan.',
      'Unsupervised learning menemukan pattern dalam data tanpa label.',
      'Reinforcement learning belajar melalui reward dan punishment.'
    ],

    education: [
      'Pembelajaran adalah proses akuisisi pengetahuan dan keterampilan baru.',
      'Setiap orang memiliki gaya belajar yang berbeda.',
      'Praktik berkelanjutan adalah kunci untuk menguasai keterampilan.',
      'Feedback positif meningkatkan motivasi belajar.',
      'Pemahaman konsep lebih penting daripada menghafal.',
      'Kolaborasi membantu dalam proses pembelajaran.',
      'Sumber daya online membuat pendidikan lebih accessible.'
    ],

    technical: [
      'Programming adalah keahlian yang dapat dipelajari dan dikembangkan.',
      'Version control adalah essential dalam software development.',
      'Testing memastikan bahwa code bekerja dengan baik.',
      'Code review membantu meningkatkan kualitas kode.',
      'Documentation memudahkan developer lain memahami kode Anda.',
      'Performance optimization penting untuk aplikasi yang besar.',
      'Security harus dipikirkan dari awal dalam development.'
    ]
  },

  /**
   * EXPRESSION VARIATIONS
   * Cara berbeda untuk mengekspresikan ide yang sama
   */
  expressionVariations: [
    {
      meaning: 'Minta bantuan',
      variations: [
        'Bisa bantu saya?',
        'Tolong bantu',
        'Apa kamu bisa membantu?',
        'Saya butuh bantuan',
        'Bisa kamu jelaskan?',
        'Help me please',
        'Can you help?',
        'I need help with this'
      ]
    },
    {
      meaning: 'Ungkap rasa senang',
      variations: [
        'Saya senang',
        'Aku sangat senang',
        'Ini bagus sekali',
        'Luar biasa!',
        'Mantap!',
        'I love this',
        'Great!',
        'This is awesome'
      ]
    },
    {
      meaning: 'Ungkap ketidakpahaman',
      variations: [
        'Saya tidak mengerti',
        'Bisa dijelaskan lagi?',
        'Maaf, tidak faham',
        'Bisa lebih simple?',
        'Maksudnya apa?',
        'I don\'t understand',
        'Can you clarify?',
        'This is confusing'
      ]
    },
    {
      meaning: 'Menunjukkan apresiasi',
      variations: [
        'Terima kasih',
        'Terima kasih banyak',
        'Makasih ya',
        'Aku appreciate it',
        'Thanks a lot',
        'Thank you so much',
        'I appreciate your help',
        'That\'s very kind'
      ]
    }
  ],

  /**
   * CONTEXT-DEPENDENT RESPONSES
   * Respon yang bergantung pada konteks percakapan
   */
  contextResponses: [
    {
      context: 'first_time_greeting',
      trigger: 'Halo',
      response: 'Halo! Senang berkenalan dengan Anda. Ada yang bisa saya bantu?'
    },
    {
      context: 'technical_question',
      trigger: /^(bagaimana|apa itu|apa yang|gimana)\s+(cara|code|function)/i,
      response_template: 'Tentang [topic] Anda bertanya. Berikut penjelasannya:'
    },
    {
      context: 'emotional_support',
      trigger: /sedih|kecewa|frustasi|marah/i,
      response_template: 'Saya mengerti perasaan Anda. Apa yang bisa saya lakukan untuk membantu?'
    },
    {
      context: 'appreciation',
      trigger: /terima kasih|makasih|thanks|thank you/i,
      response_template: 'Senang bisa membantu! Ada lagi yang bisa aku bantu?'
    }
  ]
};

/**
 * Ambil contoh kalimat dari corpus berdasarkan tipe
 * @param {string} type - tipe kalimat (greeting, question, statement, dll)
 * @param {string} language - 'id' atau 'en'
 * @returns {array} contoh kalimat
 */
export function getCorpusExamples(type, language = 'id') {
  const corpus = LanguageCorpus[type] || [];
  
  if (language && language !== 'all') {
    return corpus.filter(item => item.language === language);
  }
  
  return corpus;
}

/**
 * Analisis distribusi bahasa dalam corpus
 * @returns {object} statistik corpus
 */
export function getCorpusStatistics() {
  const stats = {
    totalSentences: 0,
    byLanguage: { id: 0, en: 0 },
    byType: {},
    byDomain: {},
    byLength: { short: 0, medium: 0, long: 0 }
  };
  
  // Count greetings
  LanguageCorpus.greetings.forEach(item => {
    stats.totalSentences++;
    stats.byLanguage[item.language]++;
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    
    const len = item.text.length;
    if (len < 20) stats.byLength.short++;
    else if (len < 50) stats.byLength.medium++;
    else stats.byLength.long++;
  });
  
  // Count questions
  LanguageCorpus.questions.forEach(item => {
    stats.totalSentences++;
    stats.byLanguage[item.language]++;
    stats.byDomain[item.domain] = (stats.byDomain[item.domain] || 0) + 1;
  });
  
  // Count statements
  LanguageCorpus.statements.forEach(item => {
    stats.totalSentences++;
    stats.byLanguage[item.language]++;
    stats.byDomain[item.domain] = (stats.byDomain[item.domain] || 0) + 1;
  });
  
  return stats;
}

/**
 * Cari kalimat serupa dalam corpus
 * @param {string} sentence - kalimat yang akan dicari
 * @param {number} threshold - similarity threshold (0-1)
 * @returns {array} kalimat serupa
 */
export function findSimilarSentences(sentence, threshold = 0.6) {
  const normalized = sentence.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  const results = [];
  
  const allCorpus = [
    ...LanguageCorpus.greetings,
    ...LanguageCorpus.questions,
    ...LanguageCorpus.statements
  ];
  
  allCorpus.forEach(item => {
    const corpusWords = item.text.toLowerCase().split(/\s+/);
    const commonWords = words.filter(w => 
      corpusWords.some(cw => cw.includes(w) || w.includes(cw))
    );
    
    const similarity = commonWords.length / Math.max(words.length, corpusWords.length);
    
    if (similarity >= threshold) {
      results.push({
        ...item,
        similarity: similarity
      });
    }
  });
  
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Ambil conversation pattern berdasarkan ID
 * @param {string} patternId - ID dari pattern
 * @returns {object} conversation pattern
 */
export function getConversationPattern(patternId) {
  return LanguageCorpus.conversationPatterns.find(p => p.id === patternId) || null;
}

/**
 * Get semua expression variations untuk sebuah makna
 * @param {string} meaning - makna/arti yang dicari
 * @returns {array} berbagai cara untuk mengekspresikan makna tersebut
 */
export function getExpressionVariations(meaning) {
  const found = LanguageCorpus.expressionVariations.find(
    ev => ev.meaning.toLowerCase() === meaning.toLowerCase()
  );
  
  return found ? found.variations : [];
}

/**
 * Get context-dependent response
 * @param {string} context - konteks percakapan
 * @param {string} userMessage - pesan user
 * @returns {object} response configuration
 */
export function getContextResponse(context, userMessage) {
  const contextConfig = LanguageCorpus.contextResponses.find(cr => cr.context === context);
  
  if (!contextConfig) return null;
  
  if (contextConfig.trigger instanceof RegExp) {
    if (contextConfig.trigger.test(userMessage)) {
      return contextConfig.response_template;
    }
  } else if (userMessage.toLowerCase().includes(contextConfig.trigger.toLowerCase())) {
    return contextConfig.response;
  }
  
  return null;
}

/**
 * Analisis sentence dalam corpus
 * @param {string} sentence - kalimat yang akan dianalisis
 * @returns {object} analisis lengkap
 */
export function analyzeSentenceInCorpus(sentence) {
  const normalized = sentence.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  const similar = findSimilarSentences(sentence, 0.5);
  
  return {
    original: sentence,
    normalized: normalized,
    wordCount: words.length,
    charCount: normalized.length,
    similarSentences: similar.slice(0, 3),
    possibleContext: similar.length > 0 ? similar[0].context : 'unknown',
    possibleType: similar.length > 0 ? similar[0].type : 'unknown',
    language: sentence.match(/[a-z]/i) ? 'mixed' : 'unknown',
    timestamp: new Date().toISOString()
  };
}

export default LanguageCorpus;
