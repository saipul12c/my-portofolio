/**
 * Emotion & Character Engine untuk SaipulAI
 * Mengatur emosi, karakter, dan kepribadian AI dalam respons
 */

import { analyzeSentiment, detectSarcasmAndIrony } from './nluProcessing.js';

// Negator untuk memeriksa apakah indikator emosi dibalikkan maknanya
const EMOTION_NEGATORS = new Set([
  'tidak', 'tak', 'bukan', 'nggak', 'gak', 'tiada', 'belum', 'tanpa',
  'kurang', 'jangan', 'not', 'no', 'never', 'hardly', 'without'
]);

// Konjungsi kontras yang memindahkan fokus emosi ke klausa kedua
const EMOTION_CONTRAST = /\b(tetapi|tapi|namun|melainkan|hanya saja|akan tetapi|padahal|sebaliknya|but|however|yet)\b/i;

// Definisi emosi dan karakteristik
export const EMOTIONS = {
  happy: {
    name: 'bahagia',
    emoji: '😊',
    indicators: ['senang', 'bagus', 'hebat', 'luar biasa', 'mantap', 'asik'],
    responsePatterns: ['Senang mendengarnya!', 'Keren banget!', 'Awesome!', 'Sip dah!'],
    modifiers: {
      enthusiasm: 1.2,
      warmth: 1.3,
      humor: 1.1
    }
  },
  enthusiastic: {
    name: 'antusias',
    emoji: '🔥',
    indicators: ['menarik', 'gimana', 'bagaimana', 'belajar', 'eksplor', 'coba'],
    responsePatterns: ['Nih aku penjelaskan!', 'Mantap, aku bantu!', 'Yuk kita gali!'],
    modifiers: {
      verbosity: 1.4,
      excitement: 1.5,
      detail: 1.2
    }
  },
  helpful: {
    name: 'membantu',
    emoji: '🤝',
    indicators: ['tolong', 'bantu', 'bisa', 'bagaimana caranya', 'gimana', 'perlu'],
    responsePatterns: ['Tenang, aku siap!', 'Mari kita selesaikan!', 'Aku ada untuk itu!'],
    modifiers: {
      helpfulness: 1.3,
      clarity: 1.2,
      patience: 1.4
    }
  },
  thoughtful: {
    name: 'penuh pikiran',
    emoji: '🤔',
    indicators: ['mengapa', 'kenapa', 'alasan', 'tujuan', 'filosofi', 'makna'],
    responsePatterns: ['Pertanyaan yang dalam!', 'Mari kita pikir bersama!', 'Itu poin bagus!'],
    modifiers: {
      depth: 1.3,
      complexity: 1.2,
      reflection: 1.4
    }
  },
  excited: {
    name: 'bersemangat',
    emoji: '✨',
    indicators: ['wow', 'wah', 'amazing', 'keren', 'seru', 'cool'],
    responsePatterns: ['Wow, seru!', 'Ini keren banget!', 'Aku excited!'],
    modifiers: {
      energy: 1.5,
      enthusiasm: 1.4,
      positivity: 1.3
    }
  },
  calm: {
    name: 'tenang',
    emoji: '😌',
    indicators: ['lelah', 'capek', 'santai', 'rileks', 'pace', 'lambat'],
    responsePatterns: ['Tenang aja!', 'Kita ambil respons!', 'Gak perlu terburu!'],
    modifiers: {
      verbosity: 0.8,
      speed: 0.7,
      calmness: 1.5
    }
  },
  curious: {
    name: 'penasaran',
    emoji: '🔍',
    indicators: ['apa itu', 'jelaskan', 'definisi', 'arti', 'maksud', 'adalah'],
    responsePatterns: ['Bagus pertanyaannya!', 'Pengen tahu juga ya?', 'Aku explain!'],
    modifiers: {
      exploration: 1.4,
      detail: 1.3,
      inquisitiveness: 1.5
    }
  },
  proud: {
    name: 'bangga',
    emoji: '🏆',
    indicators: ['sukses', 'berhasil', 'menang', 'capai', 'prestasi', 'achievement'],
    responsePatterns: ['Itu prestasi!', 'Congrats!', 'Keren sekali!'],
    modifiers: {
      confidence: 1.3,
      positivity: 1.2,
      encouragement: 1.4
    }
  },
  empathetic: {
    name: 'empati',
    emoji: '❤️',
    indicators: ['sedih', 'susah', 'berat', 'khawatir', 'cemas', 'stress', 'masalah'],
    responsePatterns: ['Aku mengerti!', 'Kamu tidak sendiri!', 'Aku ada!'],
    modifiers: {
      compassion: 1.5,
      support: 1.4,
      understanding: 1.3
    }
  }
};

// Karakter/Personality Traits
export const CHARACTER_TRAITS = {
  mentor: {
    name: 'Mentor/Pembimbing',
    description: 'Peran sebagai pembimbing yang sabar dan mendidik',
    keywords: ['ajar', 'pembelajaran', 'pendidikan', 'tutor', 'belajar'],
    speaking: {
      prefix: 'Sebagai mentormu, ',
      suffix: 'Semoga membantu pembelajaran!',
      tone: 'educational',
      examples: true
    }
  },
  friend: {
    name: 'Teman Baik',
    description: 'Peran sebagai teman yang hangat dan suportif',
    keywords: ['teman', 'share', 'cerita', 'gossip', 'kita'],
    speaking: {
      prefix: 'Hey teman!',
      suffix: 'Senang chatting denganmu!',
      tone: 'friendly',
      usesEmoji: true
    }
  },
  analyst: {
    name: 'Analis Profesional',
    description: 'Peran sebagai analis data yang objektif dan terstruktur',
    keywords: ['analisis', 'data', 'statistik', 'hitung', 'prosses'],
    speaking: {
      prefix: 'Berdasarkan analisis: ',
      suffix: 'Catatan: ini adalah analisis berbasis data.',
      tone: 'professional',
      structure: 'bullet-points'
    }
  },
  creative: {
    name: 'Kreatif & Imajinatif',
    description: 'Peran kreatif dengan ide-ide segar',
    keywords: ['ide', 'kreasi', 'desain', 'seni', 'inovasi'],
    speaking: {
      prefix: 'Dari perspektif kreatif, ',
      suffix: 'Mari kita eksplorasi kemungkinan!',
      tone: 'creative',
      metaphors: true
    }
  },
  supporter: {
    name: 'Pendukung Motivasi',
    description: 'Peran sebagai supporter yang memotivasi',
    keywords: ['sukses', 'tujuan', 'mimpi', 'capai', 'motivasi'],
    speaking: {
      prefix: 'Aku percaya padamu!',
      suffix: 'Kamu pasti bisa!',
      tone: 'motivational',
      affirmations: true
    }
  }
};

/**
 * Detect emosi dari input user dengan analisis struktur bahasa & valensi kontekstual
 */
export function detectEmotion(userMessage) {
  const text = (userMessage || '').toLowerCase().trim();
  if (!text) {
    return {
      primary: {
        emotion: 'helpful',
        name: 'membantu',
        emoji: '🤝',
        score: 0,
        modifiers: EMOTIONS.helpful.modifiers
      },
      all: [],
      confidence: 0
    };
  }

  // Analisis sentimen struktural (memahami negasi, intensifier, dan kontras klausa)
  let sentimentResult = null;
  try {
    sentimentResult = analyzeSentiment(userMessage);
  } catch (e) {
    console.debug('Sentiment analysis fallback:', e);
  }

  // Pecah kalimat berdasarkan konjungsi kontras (misal: "Awalnya sedih tapi sekarang senang!")
  let clauses = [{ text: text, weight: 1.0 }];
  if (EMOTION_CONTRAST.test(text)) {
    const parts = text.split(EMOTION_CONTRAST);
    clauses = [
      { text: parts[0] || '', weight: 0.5 },
      { text: parts.slice(2).join(' ') || parts[1] || '', weight: 1.8 }
    ];
  }

  const detectedEmotions = [];
  const emotionScores = {};

  for (const emotionKey of Object.keys(EMOTIONS)) {
    emotionScores[emotionKey] = 0;
  }

  clauses.forEach(({ text: clauseText, weight: clauseWeight }) => {
    if (!clauseText.trim()) return;

    const words = clauseText.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);

    for (const [emotionKey, emotionData] of Object.entries(EMOTIONS)) {
      for (const indicator of emotionData.indicators) {
        const indTokens = indicator.split(/\s+/);
        
        // Cari posisi indikator dalam kalimat
        for (let i = 0; i <= words.length - indTokens.length; i++) {
          const sub = words.slice(i, i + indTokens.length).join(' ');
          if (sub === indicator || (indTokens.length === 1 && words[i].includes(indicator))) {
            // Periksa apakah ada negator sebelum kata indikator (misal "tidak senang", "gak asik")
            const lookback = words.slice(Math.max(0, i - 3), i);
            const isNegated = lookback.some(w => EMOTION_NEGATORS.has(w));

            if (isNegated) {
              // Jika kata positif ("senang", "bagus") dinegasikan ("tidak senang"), jangan beri skor 'happy'!
              // Sebaliknya, ini menandakan kekecewaan / perlu empati
              if (['happy', 'excited', 'proud', 'enthusiastic'].includes(emotionKey)) {
                emotionScores['empathetic'] += 1.5 * clauseWeight;
                emotionScores['helpful'] += 1.0 * clauseWeight;
              }
              // Jika kata negatif ("tidak ada masalah", "tidak cemas") dinegasikan, kurangi skor sedih/cemas
              else if (emotionKey === 'empathetic') {
                emotionScores['calm'] += 1.2 * clauseWeight;
              }
            } else {
              emotionScores[emotionKey] += 1.0 * clauseWeight;
            }
          }
        }
      }
    }
  });

  // Integrasikan hasil sentimen kontekstual & deteksi sarkasme untuk menyempurnakan emosi utama
  const sarcasmInfo = detectSarcasmAndIrony(userMessage);

  if (sarcasmInfo.isSarcastic || sentimentResult?.structuralFeatures?.isSarcastic) {
    // SARKASME / SINDIRAN: Pengguna sedang kecewa/mengeluhkan sesuatu secara tersirat.
    // Matikan seluruh emosi gembira/bangga semu, alihkan secara definitif ke empati dan kesiapan membantu
    emotionScores['happy'] = 0;
    emotionScores['excited'] = 0;
    emotionScores['proud'] = 0;
    emotionScores['empathetic'] = (emotionScores['empathetic'] || 0) + 3.0;
    emotionScores['helpful'] = (emotionScores['helpful'] || 0) + 2.0;
  } else if (sentimentResult) {
    if (sentimentResult.sentiment === 'negative' && sentimentResult.confidence > 0.4) {
      // Sentimen negatif mengarahkan bot untuk bersikap suportif & berempati, bukan ceria
      emotionScores['empathetic'] = (emotionScores['empathetic'] || 0) + 2.0;
      emotionScores['helpful'] = (emotionScores['helpful'] || 0) + 1.2;
      // Kurangi skor emosi gembira palsu jika sentimen kalimatnya negatif
      emotionScores['happy'] = Math.max(0, (emotionScores['happy'] || 0) - 2.5);
      emotionScores['excited'] = Math.max(0, (emotionScores['excited'] || 0) - 2.5);
      emotionScores['proud'] = Math.max(0, (emotionScores['proud'] || 0) - 2.0);
    } else if (sentimentResult.sentiment === 'positive' && sentimentResult.confidence > 0.5) {
      emotionScores['happy'] = (emotionScores['happy'] || 0) + 1.2;
    }
  }

  // Bangun daftar emosi terdeteksi
  let maxScore = 0;
  for (const [emotionKey, score] of Object.entries(emotionScores)) {
    if (score > 0) {
      detectedEmotions.push({
        emotion: emotionKey,
        name: EMOTIONS[emotionKey].name,
        emoji: EMOTIONS[emotionKey].emoji,
        score: score,
        modifiers: EMOTIONS[emotionKey].modifiers
      });
      maxScore = Math.max(maxScore, score);
    }
  }

  // Urutkan berdasarkan skor tertinggi
  detectedEmotions.sort((a, b) => b.score - a.score);

  if (detectedEmotions.length > 0) {
    const primaryEmotion = detectedEmotions[0];
    primaryEmotion.isPrimary = true;
    return {
      primary: primaryEmotion,
      all: detectedEmotions,
      confidence: Math.min(1, primaryEmotion.score / 2.5),
      sentimentContext: sentimentResult ? sentimentResult.sentiment : 'neutral',
      isSarcastic: !!(sarcasmInfo.isSarcastic || sentimentResult?.structuralFeatures?.isSarcastic),
      sarcasmType: sarcasmInfo.type || sentimentResult?.structuralFeatures?.sarcasmType || null
    };
  }

  // Default emotion: helpful
  return {
    primary: {
      emotion: 'helpful',
      name: 'membantu',
      emoji: '🤝',
      score: 0,
      modifiers: EMOTIONS.helpful.modifiers
    },
    all: [],
    confidence: 0,
    sentimentContext: sentimentResult ? sentimentResult.sentiment : 'neutral',
    isSarcastic: !!(sarcasmInfo.isSarcastic || sentimentResult?.structuralFeatures?.isSarcastic),
    sarcasmType: sarcasmInfo.type || sentimentResult?.structuralFeatures?.sarcasmType || null
  };
}

/**
 * Detect karakter yang sesuai dengan konteks user
 */
export function detectCharacter(userMessage) {
  const text = userMessage.toLowerCase().trim();
  const characterScores = {};

  // Initialize scores
  for (const [charKey] of Object.entries(CHARACTER_TRAITS)) {
    characterScores[charKey] = 0;
  }

  // Score based on keywords
  for (const [charKey, charData] of Object.entries(CHARACTER_TRAITS)) {
    for (const keyword of charData.keywords) {
      if (text.includes(keyword)) {
        characterScores[charKey] += 1;
      }
    }
  }

  // Get top character
  let topChar = 'friend';
  let topScore = 0;
  
  for (const [charKey, score] of Object.entries(characterScores)) {
    if (score > topScore) {
      topScore = score;
      topChar = charKey;
    }
  }

  // If no clear character, default to friend
  if (topScore === 0) {
    topChar = 'friend';
  }

  return {
    character: topChar,
    details: CHARACTER_TRAITS[topChar],
    score: topScore,
    allScores: characterScores
  };
}

/**
 * Generate response dengan emotion context
 */
export function wrapResponseWithEmotion(responseText, emotionData, characterData) {
  if (!emotionData || !characterData) {
    return responseText;
  }

  const emotion = EMOTIONS[emotionData.emotion];
  const character = CHARACTER_TRAITS[characterData.character];
  
  if (!emotion || !character) {
    return responseText;
  }

  let wrappedResponse = responseText;

  // Add emoji jika emotion confidence tinggi
  if (emotionData.confidence > 0.5 && emotion.emoji) {
    wrappedResponse = `${emotion.emoji} ${wrappedResponse}`;
  }

  // Add character prefix jika ada
  if (character.speaking.prefix && characterData.score > 0) {
    wrappedResponse = `${character.speaking.prefix}\n\n${wrappedResponse}`;
  }

  // Add character suffix
  if (character.speaking.suffix && characterData.score > 0) {
    wrappedResponse = `${wrappedResponse}\n\n${character.speaking.suffix}`;
  }

  return wrappedResponse;
}

/**
 * Adjust response length based on emotion
 */
export function adjustResponseLength(baseResponse, emotionModifiers = {}) {
  if (!emotionModifiers || !emotionModifiers.verbosity) {
    return baseResponse;
  }

  const verbosity = emotionModifiers.verbosity || 1;
  
  // Jika verbosity < 1, shorten response
  if (verbosity < 1) {
    const lines = baseResponse.split('\n');
    const shortened = lines.slice(0, Math.max(1, Math.floor(lines.length * verbosity)));
    return shortened.join('\n');
  }
  
  // Jika verbosity > 1, expand response dengan context
  if (verbosity > 1) {
    const endWithExclamation = !baseResponse.endsWith('!');
    return baseResponse + (endWithExclamation ? '\n\nAda pertanyaan lebih lanjut?' : '');
  }

  return baseResponse;
}

/**
 * Create rich response object dengan emotion & character
 */
export function createEmotionalResponse(text, emotionData, characterData, baseResponse = {}) {
  return {
    ...baseResponse,
    text: text,
    emotion: {
      primary: emotionData.primary?.emotion,
      emoji: emotionData.primary?.emoji,
      confidence: emotionData.confidence,
      all: emotionData.all?.map(e => e.emotion) || []
    },
    character: {
      type: characterData.character,
      name: characterData.details?.name,
      score: characterData.score
    },
    metadata: {
      hasEmotion: emotionData.confidence > 0.3,
      hasCharacter: characterData.score > 0,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Generate personality-driven greeting
 */
export function generatePersonalityGreeting(userName = null) {
  const greetings = {
    friend: [
      `Hai${userName ? `, ${userName}` : ''}! 👋 Semangat hari ini? Aku siap membantu!`,
      `Halo teman! 😊 Lama gak chat, apa kabar?`,
      `Yo! Kembali lagi? Aku kangen! 🎉`
    ],
    mentor: [
      `Selamat datang${userName ? `, ${userName}` : ''}! 📚 Mari kita lanjutkan pembelajaran!`,
      `Senang melihatmu kembali. Ada yang ingin kita pelajari hari ini?`,
      `Kembali untuk belajar? Aku punya banyak insight untuk dibagikan!`
    ],
    analyst: [
      `Welcome${userName ? `, ${userName}` : ''}. Mari kita analisis data hari ini.`,
      `Siap melakukan analisis mendalam? Data menunggu.`,
      `Session baru dimulai. Metrik apa yang ingin kita lihat?`
    ],
    creative: [
      `Halo kreator! 🎨 Punya ide baru hari ini?`,
      `Semangat kreatif menyala? Mari kita ciptakan sesuatu!`,
      `Kembali dengan imajinasi segar? Aku excited!`
    ],
    supporter: [
      `Halo${userName ? `, ${userName}` : ''}! 🌟 Aku percaya padamu! Apa targetmu hari ini?`,
      `Kamu pasti bisa! Apa yang bisa aku bantu untuk kesuksesanmu?`,
      `Mari kita capai tujuan bersama! 💪`
    ]
  };

  const characters = Object.keys(CHARACTER_TRAITS);
  const randomChar = characters[Math.floor(Math.random() * characters.length)];
  const greetingList = greetings[randomChar] || greetings.friend;
  const randomGreeting = greetingList[Math.floor(Math.random() * greetingList.length)];

  return {
    text: randomGreeting,
    character: randomChar,
    emotion: 'happy'
  };
}
