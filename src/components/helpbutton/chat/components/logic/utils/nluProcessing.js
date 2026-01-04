/**
 * NLU Processing Pipeline
 * Mengintegrasikan Lexical Database, Language Corpus, dan NLU Dataset
 * untuk pemrosesan bahasa natural yang lebih canggih
 */

import { analyzeLexical, getSynonyms, getLemma, normalizeWord } from './lexicalDatabase';
import { findSimilarSentences, analyzeSentenceInCorpus } from './languageCorpus';
import { analyzeNLU, classifyIntent as _classifyIntent, extractEntities as _extractEntities, classifySentenceType as _classifySentenceType } from './nluDataset';
import { redactPII } from './piiDetector';
import { resolvePronouns } from './coreference';
import { correctText } from './spellChecker';

/**
 * Analisis sentimen dasar
 * @param {string} text - teks yang akan dianalisis
 * @returns {object} hasil analisis sentimen
 */
function analyzeSentiment(text) {
  const positiveWords = ['bagus', 'baik', 'hebat', 'keren', 'mantap', 'suka', 'puas', 'senang', 'terima kasih', 'thanks', 'awesome', 'great', 'excellent', 'good', 'nice', 'love', 'perfect'];
  const negativeWords = ['buruk', 'jelek', 'parah', 'gagal', 'error', 'masalah', 'tidak', 'gak', 'nggak', 'benci', 'marah', 'kecewa', 'hate', 'bad', 'worst', 'terrible', 'awful', 'sucks'];

  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveScore += 1;
    if (negativeWords.some(nw => word.includes(nw))) negativeScore += 1;
  });

  const total = positiveScore + negativeScore;
  const sentiment = total === 0 ? 'neutral' : (positiveScore > negativeScore ? 'positive' : 'negative');
  const confidence = total === 0 ? 0 : Math.min(1, total / words.length);

  return {
    sentiment,
    confidence,
    scores: { positive: positiveScore, negative: negativeScore, total }
  };
}

/**
 * Deteksi bahasa yang lebih canggih dengan analisis linguistik
 * @param {string} text - teks yang akan dideteksi bahasanya
 * @returns {object} hasil deteksi bahasa yang detail
 */
function detectLanguage(text) {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  if (!cleanText) {
    return {
      language: 'unknown',
      confidence: 0,
      scores: { indonesian: 0, english: 0 },
      details: { method: 'empty_text' }
    };
  }

  // Extended word lists dengan frekuensi dan bobot
  const indonesianWords = {
    // Common words (high weight)
    'yang': 3, 'dan': 3, 'atau': 3, 'dengan': 3, 'untuk': 3, 'pada': 3,
    'ke': 2, 'dari': 2, 'oleh': 2, 'adalah': 3, 'saya': 2, 'kami': 2,
    'anda': 2, 'mereka': 2, 'dia': 2, 'itu': 2, 'ini': 2, 'apa': 2,
    'bagaimana': 3, 'kenapa': 3, 'kapan': 2, 'di': 2, 'mana': 2,
    'siapa': 2, 'berapa': 2,

    // Function words
    'tidak': 3, 'ada': 2, 'akan': 2, 'sudah': 2, 'belum': 2, 'bisa': 2,
    'harus': 2, 'ingin': 2, 'perlu': 2, 'boleh': 2, 'jangan': 2,

    // Question words
    'mengapa': 3, 'bagaimana': 3, 'dimana': 3, 'kapan': 2, 'siapa': 2,
    'apa': 2, 'berapa': 2
  };

  const englishWords = {
    // Common words (high weight)
    'the': 3, 'and': 3, 'or': 2, 'with': 2, 'for': 2, 'on': 2, 'to': 2,
    'from': 2, 'by': 2, 'is': 3, 'i': 2, 'we': 2, 'you': 2, 'they': 2,
    'he': 2, 'she': 2, 'it': 2, 'this': 2, 'that': 2, 'what': 3,
    'how': 3, 'why': 3, 'when': 2, 'where': 2, 'who': 2, 'how': 3,

    // Function words
    'not': 2, 'have': 2, 'has': 2, 'had': 2, 'will': 2, 'would': 2,
    'can': 2, 'could': 2, 'should': 2, 'must': 2, 'do': 2, 'does': 2,

    // Question words
    'why': 3, 'how': 3, 'where': 3, 'when': 2, 'who': 2, 'what': 3
  };

  // Character frequency analysis
  const charStats = analyzeCharacterFrequency(cleanText);

  // Word analysis
  const words = cleanText.split(/\s+/);
  let indonesianScore = 0;
  let englishScore = 0;
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

  // Boost scores based on character patterns
  if (charStats.indonesianChars > charStats.englishChars) {
    indonesianScore *= 1.2;
  } else if (charStats.englishChars > charStats.indonesianChars) {
    englishScore *= 1.2;
  }

  // Length-based adjustment (Indonesian words tend to be longer)
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  if (avgWordLength > 5) {
    indonesianScore *= 1.1; // Indonesian words often longer
  } else if (avgWordLength < 4) {
    englishScore *= 1.1; // English function words are shorter
  }

  const totalScore = indonesianScore + englishScore;
  let language = 'unknown';
  let confidence = 0;

  if (totalScore > 0) {
    const indonesianRatio = indonesianScore / totalScore;
    const englishRatio = englishScore / totalScore;

    if (indonesianRatio > 0.6) {
      language = 'id';
      confidence = Math.min(1, indonesianRatio + 0.1);
    } else if (englishRatio > 0.6) {
      language = 'en';
      confidence = Math.min(1, englishRatio + 0.1);
    } else {
      // Mixed or uncertain
      language = indonesianRatio > englishRatio ? 'id' : 'en';
      confidence = Math.max(0.3, Math.abs(indonesianRatio - englishRatio));
    }
  }

  // Special case: very short text
  if (words.length < 3) {
    confidence = Math.max(0.3, confidence * 0.8);
  }

  return {
    language,
    confidence,
    scores: {
      indonesian: indonesianScore,
      english: englishScore,
      total: totalScore
    },
    details: {
      method: 'linguistic_analysis',
      recognizedWords: {
        indonesian: recognizedIndonesianWords,
        english: recognizedEnglishWords
      },
      charStats,
      avgWordLength: avgWordLength.toFixed(2)
    }
  };
}

/**
 * Analisis frekuensi karakter untuk membantu deteksi bahasa
 * @param {string} text - teks yang akan dianalisis
 * @returns {object} statistik karakter
 */
function analyzeCharacterFrequency(text) {
  const chars = text.split('');
  let indonesianChars = 0;
  let englishChars = 0;

  // Indonesian-specific characters (higher frequency in Indonesian)
  const indonesianSpecific = ['a', 'i', 'u', 'e', 'o', 'n', 't', 's', 'r', 'k', 'l', 'm', 'p', 'd', 'b', 'g', 'h', 'j', 'y', 'w'];
  // English-specific patterns
  const englishSpecific = ['w', 'h', 'r', 't', 'n', 's', 'd', 'l', 'c', 'p', 'm', 'f', 'g', 'y', 'b'];

  chars.forEach(char => {
    if (indonesianSpecific.includes(char)) indonesianChars++;
    if (englishSpecific.includes(char)) englishChars++;
  });

  return {
    indonesianChars,
    englishChars,
    totalChars: chars.length,
    indonesianRatio: indonesianChars / Math.max(1, chars.length),
    englishRatio: englishChars / Math.max(1, chars.length)
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

  // 2) Coreference resolution (if contextManager provided)
  if (options.contextManager) {
    try {
      const coref = resolvePronouns(afterPII, options.contextManager);
      afterPII = coref.resolvedMessage || afterPII;
      result.processing.coreference = coref.mapping || {};
    } catch (e) { /* ignore */ }
  }

  // 3) Optional spell-correction (requires options.vocab = Set)
  let afterPII = piiResult.text;
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
      processingTime: 0
    },
    components: {}
  };

  // expose PII and spell correction metadata
  result.processing.pii = piiResult.detections || [];
  result.processing.spellCorrections = spellCorrections;

  const startTime = performance.now();

  // ===== 0. SENTIMENT & LANGUAGE ANALYSIS =====
  result.components.sentiment = analyzeSentiment(userMessage);
  result.components.language = detectLanguage(userMessage);

  // ===== 1. LEXICAL ANALYSIS =====
  if (includeLexical) {
    result.components.lexical = analyzeLexicalPipeline(userMessage, language);
  }

  // ===== 2. CORPUS ANALYSIS =====
  if (includeCorpus) {
    result.components.corpus = analyzeCorpusPipeline(userMessage, threshold);
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
function analyzeCorpusPipeline(message, threshold = 0.5) {
  const similar = findSimilarSentences(message, threshold);
  const corpusAnalysis = analyzeSentenceInCorpus(message);

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
function extractCorpusInsights(message, similarSentences) {
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
function enrichEntityData(entities) {
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
function extractSemanticRelations(nluAnalysis) {
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
  extractCorpusInsights,
  enrichEntityData,
  extractSemanticRelations
};
