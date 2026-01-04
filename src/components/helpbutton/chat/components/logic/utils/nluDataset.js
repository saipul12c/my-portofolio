/**
 * NLU Dataset (Natural Language Understanding)
 * Dataset untuk melatih model memahami:
 * - Intent (maksud pengguna)
 * - Entity (entitas yang diekstrak)
 * - Perbedaan pertanyaan vs pernyataan
 * - Konteks percakapan
 * 
 * Komponen ini berfokus pada semantic understanding
 */

export const NLUDataset = {
  /**
   * INTENT CLASSIFICATION
   * Melatih model untuk memahami maksud pengguna
   */
  intents: {
    // Greeting intent
    'greeting': {
      id: 'intent_greeting',
      name: 'Greeting',
      description: 'User memulai percakapan dengan salam',
      examples: [
        'Halo',
        'Hi',
        'Selamat pagi',
        'Assalamu alaikum',
        'Good morning',
        'Hey there'
      ],
      contextRules: [
        { rule: 'firstMessage', weight: 0.8 },
        { rule: 'containsGreetingWord', weight: 0.9 },
        { rule: 'messageLength < 20', weight: 0.6 }
      ],
      responseTemplates: [
        'Halo! Senang bertemu dengan Anda.',
        'Hi! Ada yang bisa saya bantu?',
        'Selamat datang!'
      ]
    },

    // Question intent
    'ask_question': {
      id: 'intent_question',
      name: 'Ask Question',
      description: 'User bertanya sesuatu',
      examples: [
        'Apa itu AI?',
        'Bagaimana cara kerja machine learning?',
        'Siapa Anda?',
        'Kapan Anda tersedia?',
        'What is NLP?',
        'How do neural networks work?'
      ],
      triggerPatterns: [
        /^apa\s/i,
        /^bagaimana\s/i,
        /^siapa\s/i,
        /^di\s?mana\s/i,
        /^kapan\s/i,
        /^berapa\s/i,
        /^\?$/,
        /^what\s/i,
        /^how\s/i,
        /^who\s/i,
        /^where\s/i,
        /^when\s/i
      ],
      contextRules: [
        { rule: 'endsWithQuestionMark', weight: 1.0 },
        { rule: 'startsWithQuestionWord', weight: 0.95 },
        { rule: 'containsInterrogative', weight: 0.85 }
      ]
    },

    // Information request
    'request_information': {
      id: 'intent_request_info',
      name: 'Request Information',
      description: 'User meminta informasi spesifik',
      examples: [
        'Beri tahu saya tentang AI',
        'Jelaskan machine learning',
        'Tell me about neural networks',
        'Explain deep learning',
        'Saya ingin tahu tentang NLP'
      ],
      contextRules: [
        { rule: 'containsVerb_tell_explain', weight: 0.9 },
        { rule: 'containsAboutKeyword', weight: 0.85 }
      ]
    },

    // Help request
    'request_help': {
      id: 'intent_help',
      name: 'Request Help',
      description: 'User meminta bantuan',
      examples: [
        'Bisa bantu saya?',
        'Saya butuh bantuan',
        'Tolong jelaskan',
        'Help me',
        'Can you assist?',
        'Bisakah kamu membantu?'
      ],
      triggerPatterns: [
        /bantu|help|assist|tlg|please|tolong/i
      ],
      contextRules: [
        { rule: 'containsHelpWord', weight: 0.9 }
      ]
    },

    // Appreciation
    'express_appreciation': {
      id: 'intent_thanks',
      name: 'Express Appreciation',
      description: 'User mengucapkan terima kasih',
      examples: [
        'Terima kasih',
        'Makasih ya',
        'Thanks a lot',
        'Appreciate your help',
        'Aku sangat berterima kasih'
      ],
      triggerPatterns: [
        /terima\s?kasih|makasih|thanks|thank\s?you|appreciate/i
      ]
    },

    // Feedback
    'provide_feedback': {
      id: 'intent_feedback',
      name: 'Provide Feedback',
      description: 'User memberikan feedback tentang respons',
      examples: [
        'Respon ini sangat membantu',
        'Saya tidak mengerti jawaban Anda',
        'Ini terlalu rumit',
        'This is great',
        'Bisa lebih simple?'
      ],
      contextRules: [
        { rule: 'containsFeedbackWord', weight: 0.85 },
        { rule: 'isAboutPreviousResponse', weight: 0.9 }
      ]
    },

    // Confusion
    'express_confusion': {
      id: 'intent_confused',
      name: 'Express Confusion',
      description: 'User menyatakan tidak mengerti',
      examples: [
        'Saya tidak mengerti',
        'Bisa dijelaskan lagi?',
        'Apa maksudnya?',
        'I don\'t understand',
        'Can you clarify?',
        'Maaf, tidak faham'
      ],
      triggerPatterns: [
        /tidak\s?mengerti|tidak\s?paham|confused|tidak\s?faham|maksudnya/i
      ]
    }
  },

  /**
   * ENTITY DATASET
   * Untuk ekstraksi entitas dan tagging
   */
  entities: {
    // Person entity
    'PERSON': {
      type: 'person',
      description: 'Nama orang atau persona',
      examples: [
        { text: 'Nama saya Budi', entity: 'Budi' },
        { text: 'Saya Syaiful', entity: 'Syaiful' },
        { text: 'Siapa nama Anda? Muhammad Syaiful Mukmin.', entity: 'Muhammad Syaiful Mukmin' }
      ],
      patterns: [
        /(?:nama saya|saya adalah|nama ku|panggil saja)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
      ],
      context: ['identity', 'introduction', 'profile']
    },

    // Location entity
    'LOCATION': {
      type: 'location',
      description: 'Nama tempat atau lokasi',
      examples: [
        { text: 'Saya dari Jakarta', entity: 'Jakarta' },
        { text: 'Asal saya Bandung', entity: 'Bandung' },
        { text: 'Aku tinggal di Bali', entity: 'Bali' }
      ],
      patterns: [
        /(?:dari|asal|tinggal di|di)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
      ],
      context: ['location', 'residence', 'origin']
    },

    // Date entity
    'DATE': {
      type: 'date',
      description: 'Tanggal atau waktu',
      examples: [
        { text: 'Saya lahir tanggal 15 Agustus 1990', entity: '15 Agustus 1990' },
        { text: 'Bertemu hari Senin depan', entity: 'Senin depan' },
        { text: 'Jadwal 01/01/2024', entity: '01/01/2024' }
      ],
      patterns: [
        /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/,
        /(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i,
        /(senin|selasa|rabu|kamis|jumat|sabtu|minggu)/i
      ],
      context: ['date', 'schedule', 'birthday']
    },

    // Time entity
    'TIME': {
      type: 'time',
      description: 'Jam atau waktu',
      examples: [
        { text: 'Pukul 14:30', entity: '14:30' },
        { text: 'Jam 3 sore', entity: '3 sore' }
      ],
      patterns: [
        /(\d{1,2}):(\d{2})(?::(\d{2}))?/
      ],
      context: ['time', 'schedule', 'meeting']
    },

    // Organization entity
    'ORGANIZATION': {
      type: 'organization',
      description: 'Nama organisasi atau perusahaan',
      examples: [
        { text: 'Saya kerja di Google', entity: 'Google' },
        { text: 'Kuliah di ITB', entity: 'ITB' }
      ],
      patterns: [
        /(?:di|bekerja di|kerja di|kuliah di)\s+([A-Z][a-zA-Z0-9\s]*)/i
      ],
      context: ['organization', 'workplace', 'education']
    },

    // Skill entity
    'SKILL': {
      type: 'skill',
      description: 'Keahlian atau kemampuan',
      examples: [
        { text: 'Aku bisa coding', entity: 'coding' },
        { text: 'Saya mahir machine learning', entity: 'machine learning' },
        { text: 'Keahlian saya: JavaScript', entity: 'JavaScript' }
      ],
      patterns: [
        /(?:bisa|mahir|keahlian|skill)\s+([a-zA-Z\s]+)/i
      ],
      context: ['skill', 'ability', 'expertise']
    },

    // Product/Tool entity
    'PRODUCT': {
      type: 'product',
      description: 'Nama produk atau tool',
      examples: [
        { text: 'Saya menggunakan Python', entity: 'Python' },
        { text: 'Dengan TensorFlow', entity: 'TensorFlow' }
      ],
      patterns: [
        /(?:menggunakan|pakai|dengan)\s+([A-Z][a-zA-Z0-9\s]*)/i
      ],
      context: ['tool', 'technology', 'software']
    },

    // Topic entity
    'TOPIC': {
      type: 'topic',
      description: 'Topik pembicaraan',
      examples: [
        { text: 'Tentang AI', entity: 'AI' },
        { text: 'Masalah coding', entity: 'coding' }
      ],
      patterns: [
        /(?:tentang|topik|masalah|tentang)\s+([a-z\s]+)/i
      ],
      context: ['topic', 'subject', 'theme']
    }
  },

  /**
   * SENTENCE TYPE CLASSIFICATION
   * Membedakan antara pertanyaan, pernyataan, perintah, dll
   */
  sentenceTypes: {
    'interrogative': {
      name: 'Pertanyaan (Question)',
      description: 'Kalimat yang menanyakan sesuatu',
      indicators: [
        'Akhir dengan tanda "?"',
        'Dimulai dengan kata tanya (apa, siapa, mana, kapan, berapa, bagaimana)',
        'Intonasi naik di akhir (dalam speech)'
      ],
      examples: [
        'Apa itu AI?',
        'Siapa kamu?',
        'Bagaimana cara kerja?',
        'What is machine learning?'
      ],
      weight: 0.95
    },

    'declarative': {
      name: 'Pernyataan (Statement)',
      description: 'Kalimat yang menyatakan fakta atau pendapat',
      indicators: [
        'Akhir dengan tanda "."',
        'Memiliki subjek dan predikat',
        'Tidak dimulai dengan kata tanya'
      ],
      examples: [
        'Saya sedang belajar AI.',
        'Machine learning adalah penting.',
        'Aku suka belajar dengan chatbot.',
        'I am a developer.'
      ],
      weight: 0.9
    },

    'imperative': {
      name: 'Perintah (Command)',
      description: 'Kalimat yang memberikan perintah atau permintaan',
      indicators: [
        'Biasanya dimulai dengan kata kerja',
        'Sering berisi kata "tolong", "please"',
        'Mengharapkan aksi dari penerima'
      ],
      examples: [
        'Tolong jelaskan machine learning',
        'Bantu saya dengan code ini',
        'Tell me about AI',
        'Explain this concept'
      ],
      weight: 0.85
    },

    'exclamatory': {
      name: 'Seru (Exclamation)',
      description: 'Kalimat yang mengekspresikan emosi kuat',
      indicators: [
        'Akhir dengan tanda "!"',
        'Berisi kata-kata emosi',
        'Biasanya pendek dan penuh energi'
      ],
      examples: [
        'Ini luar biasa!',
        'Bagus sekali!',
        'Wow, amazing!',
        'Hebat!'
      ],
      weight: 0.85
    }
  },

  /**
   * INTENT-ENTITY RELATIONSHIPS
   * Relasi antara intent dan entity yang sering muncul bersama
   */
  intentEntityRelationships: [
    {
      intent: 'ask_question',
      commonEntities: ['TOPIC', 'DATE', 'TIME'],
      pattern: 'User bertanya tentang topik spesifik'
    },
    {
      intent: 'request_information',
      commonEntities: ['TOPIC', 'PRODUCT'],
      pattern: 'User minta info tentang topic atau product'
    },
    {
      intent: 'provide_feedback',
      commonEntities: ['PRODUCT', 'SKILL'],
      pattern: 'User memberikan feedback tentang tool atau fitur'
    },
    {
      intent: 'greeting',
      commonEntities: ['PERSON'],
      pattern: 'Greeting sering disertai nama atau identitas'
    }
  ]
};

/**
 * Klasifikasi intent dari user message
 * @param {string} message - pesan user
 * @returns {object} intent prediction dengan confidence
 */
export function classifyIntent(message) {
  const normalized = message.toLowerCase().trim();
  const scores = {};
  
  // Iterate semua intent dan hitung score
  for (const [intentKey, intentData] of Object.entries(NLUDataset.intents)) {
    let score = 0;
    
    // Check examples
    intentData.examples.forEach(example => {
      if (normalized.includes(example.toLowerCase())) {
        score += 0.3;
      }
    });
    
    // Check trigger patterns
    if (intentData.triggerPatterns) {
      intentData.triggerPatterns.forEach(pattern => {
        if (pattern.test(normalized)) {
          score += 0.4;
        }
      });
    }
    
    // Check context rules
    if (intentData.contextRules) {
      intentData.contextRules.forEach(rule => {
        // Simple rule checking
        if (rule.rule === 'endsWithQuestionMark' && normalized.endsWith('?')) {
          score += rule.weight * 0.3;
        }
        if (rule.rule === 'startsWithQuestionWord' && /^(apa|siapa|mana|kapan|berapa|bagaimana|what|how|who|where|when)/i.test(normalized)) {
          score += rule.weight * 0.3;
        }
        if (rule.rule === 'containsGreetingWord' && /halo|hi|selamat|assalamu/i.test(normalized)) {
          score += rule.weight * 0.3;
        }
      });
    }
    
    scores[intentKey] = Math.min(score, 1.0);
  }
  
  // Find highest scoring intent
  const topIntent = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  
  return {
    intent: topIntent[0],
    confidence: topIntent[1],
    allScores: scores,
    timestamp: new Date().toISOString()
  };
}

/**
 * Ekstrak entitas dari message
 * @param {string} message - pesan user
 * @returns {array} daftar entitas yang ditemukan
 */
export function extractEntities(message) {
  const entities = [];
  
  for (const [entityType, entityData] of Object.entries(NLUDataset.entities)) {
    if (entityData.patterns) {
      entityData.patterns.forEach(pattern => {
        let match;
        // Handle both string and regex patterns
        if (typeof pattern === 'string') {
          const regex = new RegExp(pattern, 'gi');
          while ((match = regex.exec(message)) !== null) {
            entities.push({
              type: entityType,
              value: match[0],
              confidence: 0.85,
              context: entityData.context[0]
            });
          }
        } else if (pattern instanceof RegExp) {
          const regex = new RegExp(pattern.source, 'gi');
          while ((match = regex.exec(message)) !== null) {
            entities.push({
              type: entityType,
              value: match[0],
              confidence: 0.85,
              context: entityData.context[0]
            });
          }
        }
      });
    }
  }
  
  return entities;
}

/**
 * Tentukan sentence type dari message
 * @param {string} message - pesan user
 * @returns {object} sentence type classification
 */
export function classifySentenceType(message) {
  const normalized = message.trim();
  const scores = {};
  
  for (const [typeKey] of Object.entries(NLUDataset.sentenceTypes)) {
    let score = 0;
    
    if (typeKey === 'interrogative' && normalized.endsWith('?')) {
      score += 0.5;
    }
    if (typeKey === 'interrogative' && /^(apa|siapa|mana|kapan|berapa|bagaimana|what|how|who|where|when)/i.test(normalized)) {
      score += 0.4;
    }
    if (typeKey === 'declarative' && normalized.endsWith('.')) {
      score += 0.3;
    }
    if (typeKey === 'imperative' && /tolong|bantu|please|help|explain|tell/i.test(normalized)) {
      score += 0.4;
    }
    if (typeKey === 'exclamatory' && normalized.endsWith('!')) {
      score += 0.5;
    }
    
    scores[typeKey] = Math.min(score, 1.0);
  }
  
  const topType = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  
  return {
    sentenceType: topType[0],
    confidence: topType[1],
    allScores: scores,
    description: NLUDataset.sentenceTypes[topType[0]].description
  };
}

/**
 * Analisis NLU lengkap dari message
 * @param {string} message - pesan user
 * @returns {object} hasil analisis NLU lengkap
 */
export function analyzeNLU(message) {
  const intent = classifyIntent(message);
  const entities = extractEntities(message);
  const sentenceType = classifySentenceType(message);
  
  return {
    message: message,
    intent: intent,
    entities: entities,
    sentenceType: sentenceType,
    analysis: {
      isQuestion: sentenceType.sentenceType === 'interrogative',
      isStatement: sentenceType.sentenceType === 'declarative',
      isCommand: sentenceType.sentenceType === 'imperative',
      confidence: Math.min(intent.confidence + sentenceType.confidence) / 2,
      complexity: entities.length > 0 ? 'complex' : 'simple'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Get suggested response based on NLU analysis
 * @param {object} nluAnalysis - hasil analisis NLU
 * @returns {string} template response
 */
export function getSuggestedResponse(nluAnalysis) {
  const intentData = NLUDataset.intents[nluAnalysis.intent.intent];
  
  if (intentData && intentData.responseTemplates) {
    return intentData.responseTemplates[Math.floor(Math.random() * intentData.responseTemplates.length)];
  }
  
  // Default response berdasarkan sentence type
  const defaultResponses = {
    interrogative: 'Pertanyaan bagus! Berikut penjelasannya:',
    declarative: 'Saya mengerti. Informasi yang berguna!',
    imperative: 'Tentu, saya siap membantu:',
    exclamatory: 'Saya juga sangat excited dengan topik ini!'
  };
  
  return defaultResponses[nluAnalysis.sentenceType.sentenceType] || 'Saya mengerti. Bagaimana saya bisa membantu?';
}

export default NLUDataset;
