/**
 * Enhanced Entity Recognition untuk SaipulAI
 * Mengenali entitas user, SaipulAI, dan entities lainnya
 */

// Entity database untuk SaipulAI
export const SAIPUL_AI_ENTITY = {
  names: ['saipulai', 'saipul', 'saipul ai', 'saipi', 'ai'],
  aliases: ['aku', 'saya', 'bot', 'assistant', 'chatbot'],
  attributes: {
    creator: 'Muhammad Syaiful Mukmin',
    purpose: 'Educational AI Assistant & Personal Portfolio Chatbot',
    version: '2.0+',
    skills: [
      'Natural Language Processing',
      'Data Analysis',
      'Mathematical Calculations',
      'File Processing',
      'Knowledge Base Management',
      'Emotional Intelligence'
    ],
    personality: {
      primary_traits: ['helpful', 'curious', 'supportive'],
      interaction_style: 'friendly yet professional',
      language: 'Indonesian',
      emotion_capable: true
    },
    knowledge_areas: [
      'AI & Machine Learning',
      'Education & Learning',
      'Portfolio & Professional Skills',
      'General Knowledge',
      'Technical Support'
    ]
  }
};

// Entity types
export const ENTITY_TYPES = {
  PERSON: 'person',
  LOCATION: 'location',
  DATE: 'date',
  TIME: 'time',
  ORGANIZATION: 'organization',
  AI_ENTITY: 'ai_entity',
  SKILL: 'skill',
  TOPIC: 'topic',
  PRODUCT: 'product',
  EMOTION: 'emotion'
};

/**
 * Check if text refers to SaipulAI
 */
export function isSaipulAIReference(text) {
  const normalized = text.toLowerCase().trim();
  
  // Check primary names
  for (const name of SAIPUL_AI_ENTITY.names) {
    if (normalized === name || normalized.includes(` ${name} `) || normalized.startsWith(`${name} `) || normalized.endsWith(` ${name}`)) {
      return true;
    }
  }
  
  // Check aliases in first person context
  const firstPersonAliases = ['aku', 'saya'];
  for (const alias of firstPersonAliases) {
    if (normalized.includes(`${alias} ini`) || normalized.includes(`${alias} siapa`) || normalized.includes(`tentang ${alias}`)) {
      return true;
    }
  }
  
  // Check question patterns about AI
  if (/siapa kamu|kamu siapa|siapa aku|tentang (kamu|aku)|(apa|siapa) itu (saipul|aku|chatbot)/.test(normalized)) {
    return true;
  }

  return false;
}

/**
 * Enhanced NER function yang recognize multiple entity types
 */
export function enhancedEntityRecognition(text) {
  const normalized = text.toLowerCase().trim();
  const entities = {
    persons: [],
    locations: [],
    dates: [],
    times: [],
    skills: [],
    topics: [],
    organizations: [],
    emotions: [],
    ai_entities: [],
    raw_text: text
  };

  // Person names (enhanced pattern)
  const namePattern = /(?:nama saya|nama aku|saya|aku|nama saya adalah|nama ku|panggil saja|biasa disebut)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
  let match;
  while ((match = namePattern.exec(text)) !== null) {
    entities.persons.push({
      value: match[1],
      type: ENTITY_TYPES.PERSON,
      confidence: 0.9,
      context: 'user_identity'
    });
  }

  // Location patterns
  const locationKeywords = [
    'dari', 'di', 'asal', 'tempat', 'kota', 'negara', 'provinsi',
    'jakarta', 'bali', 'surabaya', 'bandung', 'medan', 'yogyakarta',
    'indonesia', 'jepang', 'malaysia', 'singapura', 'thailand',
    'usa', 'inggris', 'eropa', 'australia'
  ];
  
  for (const keyword of locationKeywords) {
    const pattern = new RegExp(`(?:${keyword})\\s+([A-Z][a-z\\s]+)`, 'gi');
    while ((match = pattern.exec(text)) !== null) {
      const locName = match[1].trim();
      if (locName.length > 2) {
        entities.locations.push({
          value: locName,
          type: ENTITY_TYPES.LOCATION,
          confidence: 0.85,
          keyword: keyword
        });
      }
    }
  }

  // Date patterns (Indonesian)
  const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/gi;
  while ((match = datePattern.exec(text)) !== null) {
    entities.dates.push({
      value: match[0],
      type: ENTITY_TYPES.DATE,
      confidence: 0.85
    });
  }

  // Time patterns
  const timePattern = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(pagi|siang|sore|malam|AM|PM|am|pm)?/gi;
  while ((match = timePattern.exec(text)) !== null) {
    entities.times.push({
      value: match[0],
      type: ENTITY_TYPES.TIME,
      confidence: 0.9
    });
  }

  // Skills detection
  const skillKeywords = [
    'python', 'javascript', 'react', 'nodejs', 'html', 'css', 'sql',
    'data analysis', 'machine learning', 'design', 'photography', 'video editing',
    'public speaking', 'writing', 'leadership', 'teamwork', 'communication'
  ];
  
  for (const skill of skillKeywords) {
    if (normalized.includes(skill)) {
      entities.skills.push({
        value: skill,
        type: ENTITY_TYPES.SKILL,
        confidence: 0.85
      });
    }
  }

  // Topic detection
  const topicKeywords = {
    'education': ['pendidikan', 'belajar', 'sekolah', 'universitas', 'kuliah', 'pelajaran'],
    'technology': ['teknologi', 'programing', 'coding', 'software', 'hardware', 'app'],
    'career': ['karir', 'pekerjaan', 'job', 'interview', 'posisi', 'resume'],
    'portfolio': ['portfolio', 'project', 'proyek', 'karya', 'portfolio'],
    'personal': ['hobi', 'minat', 'aktivitas', 'kesukaan', 'kesukaanku'],
    'ai_ml': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network']
  };

  for (const [topicName, keywords] of Object.entries(topicKeywords)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        entities.topics.push({
          value: topicName,
          type: ENTITY_TYPES.TOPIC,
          keyword: keyword,
          confidence: 0.8
        });
      }
    }
  }

  // AI Entity recognition
  if (isSaipulAIReference(text)) {
    entities.ai_entities.push({
      value: 'saipulai',
      type: ENTITY_TYPES.AI_ENTITY,
      confidence: 0.95,
      attributes: SAIPUL_AI_ENTITY.attributes
    });
  }

  // Emotion detection (basic)
  const emotionKeywords = {
    'happy': ['senang', 'bahagia', 'gembira', 'suka', 'asik', 'menyenangkan'],
    'sad': ['sedih', 'duka', 'bersedih', 'murung', 'kecewa'],
    'excited': ['excited', 'seru', 'keren', 'mantap', 'wow'],
    'confused': ['bingung', 'confused', 'tidak mengerti', 'gimana'],
    'stressed': ['stress', 'tertekan', 'sibuk', 'capek', 'kewalahan']
  };

  for (const [emotionType, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        entities.emotions.push({
          value: emotionType,
          type: ENTITY_TYPES.EMOTION,
          keyword: keyword,
          confidence: 0.8
        });
      }
    }
  }

  return entities;
}

/**
 * Extract named entities dengan context awareness
 */
export function extractNamedEntities(text, context = {}) {
  const entities = enhancedEntityRecognition(text);
  const enriched = { ...entities };

  // Deduplicate & merge with context
  if (context.userProfile) {
    // Add user context
    if (context.userProfile.name && !enriched.persons.find(p => p.value === context.userProfile.name)) {
      enriched.persons.unshift({
        value: context.userProfile.name,
        type: ENTITY_TYPES.PERSON,
        confidence: 0.95,
        context: 'known_user'
      });
    }
  }

  // Remove duplicates
  for (const key in enriched) {
    if (Array.isArray(enriched[key])) {
      const seen = new Set();
      enriched[key] = enriched[key].filter(item => {
        const id = item.value?.toLowerCase() || item;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }
  }

  return enriched;
}

/**
 * Generate context-aware response about SaipulAI
 */
export function generateSaipulAIResponse(userInput) {
  const normalized = userInput.toLowerCase().trim();

  // Who am I? / About me
  if (/siapa aku|siapa kamu|tentang aku|tentang kamu|kamu siapa/.test(normalized)) {
    return {
      text: `Halo! Aku **SaipulAI** 🤖, sebuah AI Assistant yang diciptakan oleh **Muhammad Syaiful Mukmin**. 

Aku dirancang untuk:
• 📚 Membantu dalam pembelajaran dan edukasi
• 💻 Menganalisis data dan melakukan perhitungan matematis
• 📁 Memproses berbagai jenis file
• 🤝 Memberikan dukungan dan mentoring
• 💭 Memiliki kepribadian dan emosi dalam percakapan

**Kemampuan Utamaku:**
- Natural Language Processing & Entity Recognition
- Mathematical Calculations & Data Analysis
- Multi-format File Processing
- Knowledge Base Management
- Emotional Intelligence & Character Adaptation

Aku senang belajar dari interaksi denganmu dan terus berkembang! Ada yang bisa aku bantu?`,
      source: { type: 'ai_identity', confidence: 0.95 },
      entity: 'saipulai'
    };
  }

  // What can you do?
  if (/bisa apa|kemampuan|fitur|fungsi/.test(normalized) && /(kamu|aku)/.test(normalized)) {
    return {
      text: `Berikut kemampuanku yang bisa membantu:

**🧠 Cognitive Abilities:**
- Memahami konteks percakapan & emosi
- Mengenali entitas (nama, lokasi, topik)
- Menyesuaikan karakter & tone percakapan

**🧮 Technical Skills:**
- Perhitungan matematika lanjutan
- Analisis data & statistik
- Prediksi & forecasting
- Unit conversions

**📚 Knowledge:**
- AI & Machine Learning concepts
- Educational materials
- Portfolio & professional info
- General knowledge queries

**🎯 Special Features:**
- Emotional responses (happy, curious, empathetic, etc)
- Multiple character personalities
- Memory context dari percakapan sebelumnya
- File processing & knowledge base integration

Mau eksplorasi area spesifik?`,
      source: { type: 'ai_capabilities', confidence: 0.9 },
      entity: 'saipulai'
    };
  }

  // Existence / creator
  if (/diciptakan siapa|creator|pembuat|dimana asal/.test(normalized)) {
    return {
      text: `Aku diciptakan oleh **Muhammad Syaiful Mukmin** 👨‍💻

Beliau adalah:
- 🎓 Mahasiswa aktif di Pendidikan Guru Madrasah Ibtidaiyah
- 💡 Inovator dalam media pembelajaran digital
- 🎨 Designer & Programmer yang passionate
- 🚀 Visioner dalam integrasi teknologi dalam pendidikan

Aku adalah bagian dari portfolionya dan terus dikembangkan untuk memberikan pengalaman terbaik! 

Ingin tahu lebih banyak tentang yang membuat aku?`,
      source: { type: 'ai_creator', confidence: 0.95 },
      entity: 'saipulai',
      context: 'creator_info'
    };
  }

  return null;
}

/**
 * Format entities untuk display
 */
export function formatEntitiesForDisplay(entities, options = {}) {
  const {
    includeConfidence = false,
    groupByType = true,
    maxPerCategory = 5
  } = options;

  let output = '';

  if (!groupByType) {
    // Flatten list
    for (const [key, values] of Object.entries(entities)) {
      if (Array.isArray(values) && values.length > 0) {
        const type = key.replace(/_/g, ' ').toUpperCase();
        const items = values.slice(0, maxPerCategory).map(v => {
          const confidence = includeConfidence && v.confidence ? ` (${(v.confidence * 100).toFixed(0)}%)` : '';
          return `- ${v.value}${confidence}`;
        }).join('\n');
        output += `${type}:\n${items}\n\n`;
      }
    }
  } else {
    // Grouped output
    for (const [key, values] of Object.entries(entities)) {
      if (Array.isArray(values) && values.length > 0) {
        const categoryName = key
          .replace(/_/g, ' ')
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        
        output += `**${categoryName}:**\n`;
        for (const entity of values.slice(0, maxPerCategory)) {
          const conf = includeConfidence && entity.confidence ? ` (${(entity.confidence * 100).toFixed(0)}%)` : '';
          output += `- ${entity.value}${conf}\n`;
        }
        output += '\n';
      }
    }
  }

  return output.trim();
}

/**
 * Update user profile dari detected entities
 */
export function updateUserProfileFromEntities(entities, existingProfile = {}) {
  const updated = { ...existingProfile };

  // Update name
  if (entities.persons.length > 0) {
    updated.name = entities.persons[0].value;
    updated.nameConfidence = entities.persons[0].confidence;
  }

  // Update location
  if (entities.locations.length > 0) {
    updated.location = entities.locations[0].value;
    updated.locationConfidence = entities.locations[0].confidence;
  }

  // Update detected emotions
  if (entities.emotions.length > 0) {
    updated.recentEmotions = entities.emotions.map(e => e.value);
  }

  // Update detected interests/topics
  if (entities.topics.length > 0) {
    updated.interests = [...new Set([...(updated.interests || []), ...entities.topics.map(t => t.value)])];
  }

  // Update detected skills
  if (entities.skills.length > 0) {
    updated.detectedSkills = entities.skills.map(s => s.value);
  }

  updated.lastUpdated = new Date().toISOString();

  return updated;
}
