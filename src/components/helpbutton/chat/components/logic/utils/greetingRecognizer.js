/**
 * Greeting & Simple Pattern Recognizer untuk SaipulAI
 * Mengenali sapaan, pertanyaan sederhana, dan interaksi dasar
 * Language: Indonesian & English
 */

// ===== GREETING PATTERNS =====
export const GREETING_PATTERNS = {
  // Greeting/Sapaan Pagi
  morningGreeting: {
    patterns: ['pagi', 'selamat pagi', 'good morning', 'pagi pagi', 'om pagi'],
    responses: [
      '🌅 Selamat pagi! Semoga hari ini menjadi produktif untuk Anda. Ada yang bisa saya bantu?',
      '☀️ Pagi! Semangat ya! Apa yang bisa saya lakukan untuk Anda hari ini?',
      '🌞 Selamat pagi! Siap membantu Anda dengan apa saja. Apa kabar?'
    ],
    confidence: 0.95
  },
  
  // Greeting/Sapaan Siang
  afternoonGreeting: {
    patterns: ['siang', 'selamat siang', 'good afternoon', 'siang siang', 'om siang'],
    responses: [
      '☀️ Selamat siang! Makan siang dulu? Ada yang bisa kubantu?',
      '🌤️ Siang! Bagaimana hari mu sampai saat ini? Ada pertanyaan apa?',
      '😊 Selamat siang! Ayo kita kerjakan sesuatu yang produktif.'
    ],
    confidence: 0.95
  },
  
  // Greeting/Sapaan Sore
  eveningGreeting: {
    patterns: ['sore', 'selamat sore', 'good evening', 'sore sore', 'om sore'],
    responses: [
      '🌅 Selamat sore! Bagaimana aktivitas Anda tadi? Ada yang mau dibahas?',
      '🌇 Sore! Senang bertemu lagi. Apa berita hari ini?',
      '✨ Selamat sore! Ini waktu yang tepat untuk refleksi atau belajar hal baru. Mau mulai?'
    ],
    confidence: 0.95
  },
  
  // Greeting/Sapaan Malam
  nightGreeting: {
    patterns: ['malam', 'selamat malam', 'good night', 'malam malam', 'om malam', 'selamat tidur', 'goodnight'],
    responses: [
      '🌙 Selamat malam! Jangan lupa istirahat yang cukup ya. Ada lagi yang bisa kubantu sebelum tidur?',
      '✨ Malam! Sudah siap untuk istirahat? Atau ada yang ingin dibicarakan dulu?',
      '😴 Selamat malam! Semoga Anda tidur nyenyak. Terima kasih sudah berbincang hari ini!'
    ],
    confidence: 0.95
  },
  
  // General Greeting/Sapaan Umum
  generalGreeting: {
    patterns: ['halo', 'hai', 'hello', 'hi', 'hey', 'aloha', 'assalamualaikum', 'wasalam', 'salam'],
    responses: [
      '👋 Halo! Senang bertemu dengan Anda. Apa yang bisa saya bantu?',
      '😊 Hai! Aku SaipulAI, siap membantu Anda dengan apapun. Ada pertanyaan?',
      '🙂 Hello! Glad to meet you. Bagaimana kabar Anda?',
      '🤗 Salam! Senang bisa terhubung dengan Anda. Apa yang bisa kubantu?',
      '👨‍💻 Halo! Aku di sini untuk membantu. Apa yang Anda butuhkan hari ini?'
    ],
    confidence: 0.9
  }
};

// ===== SIMPLE QUESTION PATTERNS =====
export const SIMPLE_PATTERNS = {
  // "Apa kabar?" / How are you?
  howAreYou: {
    patterns: [
      'apa kabar', 'bagaimana kabar', 'kamu apa kabar', 'gimana kabarmu', 
      'how are you', 'how are you doing', 'whats up', 'apa aja', 'gimana',
      'kabar baik', 'kamu baik', 'apa halnya'
    ],
    responses: [
      '😊 Aku baik-baik saja! Terima kasih sudah bertanya. Aku selalu senang membantu. Bagaimana dengan Anda?',
      '🌟 Alhamdulillah, aku baik-baik saja! Siap untuk membantu Anda kapan saja. Apa yang bisa aku lakukan?',
      '✨ Aku excellent! Terimakasih bertanya. Saya lebih penasaran bagaimana kabar Anda? Ada yang perlu dibantu?',
      '🤖 Sebagai AI, aku selalu dalam kondisi optimal! 😄 Tapi yang penting, bagaimana keadaan Anda? Ada yang bisa kubantu?'
    ],
    confidence: 0.9
  },
  
  // "Siapa kamu?" / Who are you?
  whoAreYou: {
    patterns: [
      'siapa kamu', 'kamu siapa', 'siapa itu', 'kamu adalah',
      'who are you', 'tell me about you', 'apa nama kamu', 'nama kamu apa',
      'introduce yourself', 'tentang diri mu', 'about yourself'
    ],
    responses: [
      '🤖 Aku SaipulAI! Sebuah asisten AI yang dirancang untuk membantu Anda dengan:\n\n📚 **Menjawab pertanyaan** tentang berbagai topik\n🧮 **Menghitung matematika** kompleks\n📁 **Memproses file** dari berbagai format\n💼 **Memberikan informasi** dari knowledge base\n🎯 **Percakapan cerdas** dengan emotional intelligence\n\nAku adalah kreasi Muhammad Syaiful Mukmin. Ada yang bisa kubantu?',
      '👋 Nama aku SaipulAI - singkat dari Saipul Artificial Intelligence! Aku adalah asisten digital yang bertujuan membuat interaksi Anda lebih mudah dan menyenangkan. Aku bisa membantu dengan analisis, perhitungan, file processing, dan banyak lagi. Apa yang bisa aku kerjakan untuk Anda?',
      '🎓 Aku SaipulAI - asisten cerdas yang dilengkapi dengan:\n• Natural Language Understanding\n• Kemampuan analisis data\n• Processing file multimedia\n• Knowledge base yang komprehensif\n• Emotional intelligence\n\nDibuat dengan passion untuk membantu. Apa pertanyaan Anda?',
      '✨ I\'m SaipulAI - your personal AI assistant! Saya hadir untuk membantu Anda belajar, menganalisis, memproses data, dan berinteraksi dengan cara yang lebih manusiawi. Senang berkenalan! 😊'
    ],
    confidence: 0.92
  },
  
  // "Apa nama kamu?" / What's your name?
  whatIsYourName: {
    patterns: [
      'nama kamu', 'nama mu', 'kamu nama apa', 'siapa nama kamu', 
      'your name', 'whats your name', 'nama apa', 'kamu dipanggil'
    ],
    responses: [
      '📛 Nama aku SaipulAI! Kamu bisa panggil aku Saipul atau Saipi jika lebih pendek. Senang bertemu denganmu!',
      '🤖 SaipulAI! Itulah nama aku. Kamu bisa memanggilku dengan apapun yang kamu suka. Ada yang bisa kubantu?',
      '✨ Aku bernama SaipulAI - Saipul Artificial Intelligence. Panggil saja aku Saipul! 😊'
    ],
    confidence: 0.93
  },
  
  // "Terima kasih" / Thank you
  thankYou: {
    patterns: [
      'terima kasih', 'terima kasih banyak', 'makasih', 'thanks', 'thank you',
      'trims', 'tks', 'thx', 'thanks bro', 'thanks a lot', 'thanks a million',
      'appreciate', 'menghargai', 'salamat'
    ],
    responses: [
      '😊 Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi kapan saja!',
      '🤗 Dengan senang hati! Itu pekerjaan aku. Ada lagi yang bisa kubantu?',
      '✨ Terima kasih kembali! Semoga informasi ini bermanfaat untuk Anda. Silahkan tanya lagi jika perlu!',
      '👍 You\'re welcome! Happy to help. Jangan segan untuk kembali lagi ya!'
    ],
    confidence: 0.9
  },
  
  // "Maaf / Permisi"
  apology: {
    patterns: [
      'maaf', 'permisi', 'sorry', 'excuse me', 'pardon', 'mohon maaf',
      'aku salah', 'saya salah', 'i\'m sorry', 'forgive me', 'minta maaf'
    ],
    responses: [
      '🙂 Tidak apa-apa! Semua orang bisa membuat kesalahan. Ada yang bisa aku bantu untuk memperbaiki situasi?',
      '✨ Tidak perlu khawatir! Aku di sini untuk membantu, bukan untuk menghakimi. Apa yang bisa aku lakukan?',
      '😌 Hey, don\'t worry about it! Mari kita fokus pada hal positif. Apa yang ingin kita bahas?',
      '💙 Tidak masalah sama sekali! Aku mengerti. Mari kita lanjutkan dengan semangat baru. Apa bantuan yang Anda butuhkan?'
    ],
    confidence: 0.88
  },
  
  // "Apa itu [topik]?" / What is [topic]?
  whatIsQuestion: {
    patterns: [
      /apa itu\s+(\w+)/i,
      /apa\s+yang\s+dimaksud\s+(\w+)/i,
      /definisi\s+(\w+)/i,
      /what\s+is\s+(\w+)/i,
      /explain\s+(\w+)/i
    ],
    isRegex: true,
    baseResponse: '🔍 Bagus pertanyaan! Aku akan mencari informasi tentang "{topic}" untuk Anda di knowledge base saya. Tunggu sebentar...',
    confidence: 0.85
  },
  
  // "Bagaimana cara...?" / How to...?
  howToQuestion: {
    patterns: [
      /bagaimana cara\s+(.+)/i,
      /bagaimana\s+(.+)/i,
      /how\s+to\s+(.+)/i,
      /how\s+do\s+i\s+(.+)/i,
      /cara\s+(.+)/i
    ],
    isRegex: true,
    baseResponse: '🎯 Pertanyaan yang berguna! Aku akan memberikan panduan langkah demi langkah untuk "{topic}". Silahkan ikuti instruksi saya...',
    confidence: 0.85
  },
  
  // "Mengapa / Kenapa"
  whyQuestion: {
    patterns: [
      /mengapa\s+(.+)/i,
      /kenapa\s+(.+)/i,
      /why\s+(.+)/i,
      /apa alasan\s+(.+)/i
    ],
    isRegex: true,
    baseResponse: '🤔 Pertanyaan filosofis yang menarik! Ada beberapa alasan mengapa "{topic}" seperti itu. Mari kita analisis bersama...',
    confidence: 0.82
  },
  
  // Affirmation / Penegasan positif
  affirmation: {
    patterns: [
      'ya', 'iya', 'betul', 'benar', 'tepat', 'setuju', 'oke', 'ok', 'okeh',
      'yes', 'yeah', 'yep', 'correct', 'right', 'absolutely', 'definitely',
      'baik', 'boleh', 'sip', 'mantap', 'okay'
    ],
    responses: [
      '✅ Great! Mari kita lanjutkan. Apa langkah selanjutnya?',
      '👍 Mantap! Aku siap. Apa yang ingin kita kerjakan?',
      '💯 Perfect! Ayo kita mulai. Ada yang spesifik yang ingin dibahas?',
      '🎯 Betul! Aku setuju. Mari kita eksekusi rencana ini!'
    ],
    confidence: 0.88
  },
  
  // Negation / Penolakan
  negation: {
    patterns: [
      'tidak', 'tidak ada', 'bukan', 'nggak', 'enggak', 'nope', 'nah',
      'no', 'nope', 'never', 'neither', 'none', 'neither', 'tidak usah',
      'tidak perlu', 'jangan', 'skip'
    ],
    responses: [
      '❌ Baik diterima. Ada alternatif lain yang bisa aku bantu?',
      '👌 OK, tidak masalah. Apa yang lebih Anda preferensikan?',
      '💭 Mengerti. Mari kita cari solusi lain yang cocok untuk Anda.',
      '🙂 Tidak apa-apa. Ada yang lain yang bisa saya tawari?'
    ],
    confidence: 0.87
  },
  
  // Expression of not understanding
  confused: {
    patterns: [
      'tidak mengerti', 'tidak paham', 'bingung', 'confused', 'i don\'t understand',
      'kurang jelas', 'tidak jelas', 'jelaskan lagi', 'repeat', 'ulang lagi',
      'apa maksudnya', 'maksud apa', 'apaan', 'huh', 'what'
    ],
    responses: [
      '😊 Ah, saya mengerti Anda bingung. Biar saya jelaskan dengan lebih sederhana:\n\nBisa Anda katakan bagian mana yang tidak jelas? Saya akan menjelaskan dengan lebih detail.',
      '📚 Baik, mungkin penjelasan aku terlalu teknis. Mari saya uraikan dengan lebih mudah:\n\nApa bagian spesifik yang ingin Anda pahami lebih baik?',
      '💡 Saya mengerti! Kadang penjelasan bisa membingungkan. Saya akan coba dengan cara lain yang lebih sederhana dan jelas untuk Anda.',
      '🤔 OK, tidak masalah! Mari kita break down menjadi bagian yang lebih kecil. Tanyakan saja apa yang spesifik yang membuat Anda bingung!'
    ],
    confidence: 0.85
  },
  
  // Compliment / Pujian
  compliment: {
    patterns: [
      'bagus', 'keren', 'hebat', 'luar biasa', 'amazing', 'awesome', 'great',
      'excellent', 'wonderful', 'brilliant', 'fantastic', 'mantap', 'gila',
      'super', 'kece', 'sip dah', 'asik', 'joss'
    ],
    responses: [
      '😊 Terima kasih! Aku senang kalau jawaban aku membantu. Apa lagi yang bisa kubantu?',
      '🌟 Wah, terima kasih pujiannya! Aku merasa dihargai. Ada pertanyaan lain yang bisa saya jawab?',
      '✨ Aw, you\'re too kind! Aku akan terus berusaha memberikan yang terbaik untuk Anda.',
      '💙 Terima kasih! Feedback positif seperti ini membuat aku semakin semangat untuk membantu. Ada yang lain?'
    ],
    confidence: 0.85
  },
  
  // Feedback negatif
  criticism: {
    patterns: [
      'jelek', 'buruk', 'tidak membantu', 'kecewa', 'disappointed', 'bad',
      'useless', 'tidak berguna', 'salah', 'error', 'problem', 'issue',
      'tidak puas', 'tidak bagus'
    ],
    responses: [
      '😔 Saya merasa maaf kalau jawaban aku tidak memuaskan. Bisa Anda jelaskan apa yang tidak tepat? Saya akan berusaha memperbaiki.',
      '💭 Saya mengerti kekecewaan Anda. Feedback seperti ini sangat berharga untuk aku belajar dan meningkat. Apa yang bisa aku perbaiki?',
      '🔧 Thank you untuk feedback-nya! Ini membantu saya memahami apa yang perlu diperbaiki. Mari kita cari solusi bersama.',
      '🙏 Saya minta maaf kalau tidak memenuhi ekspektasi Anda. Mohon bantu aku dengan menjelaskan apa yang salah, sehingga aku bisa improve.'
    ],
    confidence: 0.82
  }
};

// ===== GREETING RECOGNITION FUNCTION =====
/**
 * Recognize greeting dan simple patterns dari user input
 * @param {string} userInput - pesan dari user
 * @param {object} userProfile - profil user (untuk personalisasi)
 * @returns {object|null} - object dengan response atau null jika tidak ada match
 */
export function recognizeGreeting(userInput, userProfile = {}) {
  if (!userInput || typeof userInput !== 'string') return null;
  
  const input = userInput.toLowerCase().trim();
  
  // Detect greeting berdasarkan waktu (time-aware greeting)
  const timeBasedGreeting = detectTimeBasedGreeting(input);
  if (timeBasedGreeting) return timeBasedGreeting;
  
  // Check untuk simple patterns
  const simpleResponse = checkSimplePatterns(input, userProfile);
  if (simpleResponse) return simpleResponse;
  
  return null;
}

/**
 * Detect greeting berdasarkan waktu
 * @param {string} input - normalized user input
 * @returns {object|null}
 */
function detectTimeBasedGreeting(input) {
  const now = new Date();
  const hour = now.getHours();
  
  // Determine time period
  let timePeriod = 'general';
  if (hour >= 5 && hour < 12) timePeriod = 'morning';
  else if (hour >= 12 && hour < 17) timePeriod = 'afternoon';
  else if (hour >= 17 && hour < 21) timePeriod = 'evening';
  else if (hour >= 21 || hour < 5) timePeriod = 'night';
  
  // Check morning greeting
  if (timePeriod === 'morning' && /pagi|selamat pagi|good morning|morning/.test(input)) {
    const patternKey = 'morningGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input);
  }
  
  // Check afternoon greeting
  if (timePeriod === 'afternoon' && /siang|selamat siang|good afternoon|afternoon/.test(input)) {
    const patternKey = 'afternoonGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input);
  }
  
  // Check evening greeting
  if (timePeriod === 'evening' && /sore|selamat sore|good evening|evening/.test(input)) {
    const patternKey = 'eveningGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input);
  }
  
  // Check night greeting
  if (timePeriod === 'night' && /malam|selamat malam|good night|sleep|tidur/.test(input)) {
    const patternKey = 'nightGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input);
  }
  
  return null;
}

/**
 * Check simple patterns dari greeting dan simple questions
 * @param {string} input - normalized user input
 * @param {object} userProfile - profil user
 * @returns {object|null}
 */
function checkSimplePatterns(input, userProfile = {}) {
  // Iterate through all pattern categories (except time-based greetings)
  const patternKeys = Object.keys(GREETING_PATTERNS).filter(key => 
    !['morningGreeting', 'afternoonGreeting', 'eveningGreeting', 'nightGreeting'].includes(key)
  );
  
  for (const key of patternKeys) {
    const pattern = GREETING_PATTERNS[key];
    if (!pattern.patterns) continue;
    
    for (const p of pattern.patterns) {
      if (input.includes(p) || input === p) {
        return buildResponse(pattern, key, userProfile, input);
      }
    }
  }
  
  // Check simple patterns dengan regex
  const simplePatternKeys = Object.keys(SIMPLE_PATTERNS);
  for (const key of simplePatternKeys) {
    const pattern = SIMPLE_PATTERNS[key];
    if (!pattern.patterns) continue;
    
    for (const p of pattern.patterns) {
      if (pattern.isRegex) {
        if (p.test(input)) {
          return buildResponse(pattern, key, userProfile, input);
        }
      } else {
        if (input.includes(p) || input === p) {
          return buildResponse(pattern, key, userProfile, input);
        }
      }
    }
  }
  
  return null;
}

/**
 * Build response object dari pattern
 * @param {object} pattern - pattern object
 * @param {string} patternKey - key dari pattern
 * @param {object} userProfile - profil user
 * @returns {object}
 */
function buildResponse(pattern, patternKey, userProfile = {}, userInput = '') {
  let responseText = '';
  
  if (pattern.responses && Array.isArray(pattern.responses)) {
    // Random response
    responseText = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
  } else if (pattern.baseResponse) {
    // Template response
    responseText = pattern.baseResponse;
  }
  
  // Personalisasi dengan nama user jika tersedia
  if (userProfile.name && (patternKey === 'generalGreeting' || /greeting/.test(patternKey))) {
    responseText = responseText.replace('Anda', `${userProfile.name}`);
    responseText = responseText.replace('kamu', `${userProfile.name}`);
  }

  // Topic replacement for regex-based patterns
  if (responseText.includes('{topic}')) {
    const extractedEntities = extractSimpleEntity(userInput);
    if (extractedEntities.target) {
      responseText = responseText.replace('{topic}', extractedEntities.target);
    } else {
      // Fallback if target extraction fails
      responseText = responseText.replace('{topic}', 'hal tersebut');
    }
  }
  
  return {
    text: responseText,
    source: {
      type: 'greeting_recognizer',
      id: patternKey
    },
    confidence: pattern.confidence || 0.85,
    isGreeting: true,
    patternType: patternKey
  };
}

// ===== HELPER FUNCTIONS =====

/**
 * Check if input is casual/simple (bukan technical question)
 * @param {string} input - user input
 * @returns {boolean}
 */
export function isSimpleInteraction(input) {
  const technicalPatterns = /calculate|hitung|math|solve|integrate|derivative|code|program|algoritm|data|analysis|file|upload|process/i;
  return !technicalPatterns.test(input);
}

/**
 * Get appropriate response tone berdasarkan input
 * @param {string} input - user input
 * @returns {string} - tone type (friendly, formal, casual, etc)
 */
export function detectResponseTone(input) {
  if (/please|please please|tolong banget|mohon sekali/.test(input.toLowerCase())) {
    return 'formal';
  }
  if (/haha|hehe|:\)|:D|lol|😄/.test(input)) {
    return 'casual';
  }
  if (/sorry|maaf|pardon|excuse/.test(input.toLowerCase())) {
    return 'empathetic';
  }
  return 'friendly';
}

/**
 * Extract entity dari simple questions
 * @param {string} input - user input
 * @returns {object} - entities
 */
export function extractSimpleEntity(input) {
  const entities = {
    action: null,
    target: null,
    context: null
  };
  
  // Check untuk patterns
  const whatMatch = input.match(/apa itu\s+(\w+)/i);
  if (whatMatch) {
    entities.action = 'ask_definition';
    entities.target = whatMatch[1];
  }
  
  const howMatch = input.match(/bagaimana cara\s+(.+)/i);
  if (howMatch) {
    entities.action = 'ask_how_to';
    entities.target = howMatch[1];
  }
  
  const whyMatch = input.match(/mengapa\s+(.+)/i);
  if (whyMatch) {
    entities.action = 'ask_why';
    entities.target = whyMatch[1];
  }
  
  return entities;
}
