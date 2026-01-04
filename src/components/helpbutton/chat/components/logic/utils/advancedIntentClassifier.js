/**
 * Advanced Intent Classifier
 * Mengklasifikasikan intent user dengan akurasi tinggi
 * Menangani: greeting, question, statement, command, complex reasoning, dsb
 */

import { processNLU } from './nluProcessing';
import { enhancedEntityRecognition } from './entityRecognition';

export const INTENT_TYPES = {
  // Simple Intents
  GREETING: 'greeting',
  FAREWELL: 'farewell',
  CONFIRMATION: 'confirmation',
  DENIAL: 'denial',
  THANKS: 'thanks',
  
  // Information Seeking
  SIMPLE_FACTUAL: 'simple_factual', // Pertanyaan faktual sederhana
  COMPLEX_REASONING: 'complex_reasoning', // Pertanyaan memerlukan reasoning
  HOW_TO: 'how_to',
  DEFINITION: 'definition',
  COMPARISON: 'comparison',
  ABOUT_AI: 'about_ai', // Pertanyaan tentang SaipulAI sendiri
  
  // Action-oriented
  COMMAND: 'command',
  REQUEST: 'request',
  SUGGESTION: 'suggestion',
  
  // Data & Analysis
  CALCULATION: 'calculation',
  ANALYSIS: 'analysis',
  PREDICTION: 'prediction',
  
  // Sentiment & Emotional
  COMPLAINT: 'complaint',
  PRAISE: 'praise',
  CONCERN: 'concern',
  
  // Meta
  CLARIFICATION: 'clarification',
  CORRECTION: 'correction',
  UNKNOWN: 'unknown'
};

/**
 * Intent Keywords Database
 */
const INTENT_PATTERNS = {
  [INTENT_TYPES.GREETING]: {
    patterns: [
      /^(halo|hai|hello|pagi|siang|sore|malam|selamat|assalamualaikum|assalam|hola|bonjour)/i,
      /\b(gimana kabar|apa kabar|kamu baik|kamu oke)\b/i,
      /^(apa yang baru|ada yang baru|apa itu)\s+(kabar|cerita)/i
    ],
    confidence_boost: 0.15
  },
  [INTENT_TYPES.FAREWELL]: {
    patterns: [
      /^(bye|sampai|goodbye|sampai jumpa|dadah|see you|selamat tinggal|selamat jalan)/i,
      /\b(terima kasih|thanks|terimakasih)\s+(semuanya|semua|bantuannya)?$/i
    ],
    confidence_boost: 0.15
  },
  [INTENT_TYPES.THANKS]: {
    patterns: [
      /^(terima kasih|thanks|thankyou|grazie|merci|arigatou|terimakasih)/i,
      /\b(terima kasih|thanks|makasih)\b/i,
      /(bagus|mantap|hebat|awesome|great|nice|good).*(terima kasih|thanks)/i
    ],
    confidence_boost: 0.12
  },
  [INTENT_TYPES.CONFIRMATION]: {
    patterns: [
      /^(ya|yes|iya|benar|betul|setuju|sepakat|ok|oke|okay|baik|baiklah|bagus|persis|tepat)/i,
      /^(benar|right|correct)/i
    ],
    confidence_boost: 0.18
  },
  [INTENT_TYPES.DENIAL]: {
    patterns: [
      /^(tidak|tidak ada|gak|nggak|no|bukan|tidak juga|nope)/i,
      /^(saya tidak|aku tidak|kami tidak)/i
    ],
    confidence_boost: 0.18
  },
  [INTENT_TYPES.DEFINITION]: {
    patterns: [
      /\b(apa itu|apa arti|artinya apa|definisi|pengertian|maksudnya|yang dimaksud)\b/i,
      /^(jelaskan|explain|define)\s+/i
    ],
    confidence_boost: 0.16
  },
  [INTENT_TYPES.HOW_TO]: {
    patterns: [
      /\b(bagaimana|gimana|how|caranya|cara|langkah)\s+(cara|caranya)?/i,
      /^(cara|tutorial|panduan|guide)\s+/i,
      /\b(step|langkah|tahap|proses)\s+(demi|by)\b/i
    ],
    confidence_boost: 0.16
  },
  [INTENT_TYPES.COMPARISON]: {
    patterns: [
      /\b(dibanding|vs|versus|daripada|lebih|kurang|perbedaan|persamaan)\b/i,
      /\b(mana yang lebih|antara|atau)\b/i
    ],
    confidence_boost: 0.14
  },
  [INTENT_TYPES.ABOUT_AI]: {
    patterns: [
      /\b(saipulai|saipul ai|ai ini|chatbot ini|asisten ini)\b/i,
      /\b(versi|version|update|fitur|apa yang bisa|kemampuan|spesifikasi)\s+(saipulai|ai|chatbot|asisten)/i,
      /\b(dokumentasi|panduan|help|manual|bantuan)\s+(ai|chatbot|saipulai)/i,
      /\b(apa itu|jelaskan|tentang)\s+(saipulai|ai ini|chatbot)/i
    ],
    confidence_boost: 0.18
  },
  [INTENT_TYPES.CALCULATION]: {
    patterns: [
      /\b(hitung|kalkulus|integral|turunan|statistik|rata\s*rata|median|standar deviasi)\b/i,
      /\b(berapa|how much|hasil|sama dengan|=)\b/i,
      /^\d+\s*[\+\-\*\/÷]\s*\d+/
    ],
    confidence_boost: 0.17
  },
  [INTENT_TYPES.ANALYSIS]: {
    patterns: [
      /\b(analisis|analiza|analyze|analisis data|data mining|prediksi|forecast)\b/i,
      /\b(trend|pattern|pola|hubungan|korelasi|insight)\b/i
    ],
    confidence_boost: 0.15
  },
  [INTENT_TYPES.COMMAND]: {
    patterns: [
      /^(upload|export|reset|clear|delete|hapus|buat|create|simpan|save|buka|open)/i,
      /^(aktifkan|matikan|enable|disable|mulai|start|stop|pause)/i
    ],
    confidence_boost: 0.18
  },
  [INTENT_TYPES.REQUEST]: {
    patterns: [
      /\b(bisa|bisa kah|apakah bisa|bisa tidak|apa bisa)\b/i,
      /^(tolong|coba|please|boleh|bisa tidak)\s+/i
    ],
    confidence_boost: 0.15
  },
  [INTENT_TYPES.COMPLAINT]: {
    patterns: [
      /\b(error|masalah|problem|tidak bisa|gagal|fail|rusak|broken|bug)\b/i,
      /\b(keluh|keluhan|mengapa|kenapa)\s+(kok|tidak bisa|error)/i
    ],
    confidence_boost: 0.17
  },
  [INTENT_TYPES.PRAISE]: {
    patterns: [
      /\b(bagus|hebat|keren|mantap|awesome|great|excellent|top|best|terbaik)\b/i,
      /\b(suka|love|sempurna|perfect|puas|satisfaction)\b/i
    ],
    confidence_boost: 0.14
  },
  [INTENT_TYPES.CONCERN]: {
    patterns: [
      /\b(khawatir|takut|worry|concern|was|risiko|danger|bahaya)\b/i,
      /\b(bagaimana kalau|apa yang terjadi|jika)\s+/i
    ],
    confidence_boost: 0.13
  },
  [INTENT_TYPES.CLARIFICATION]: {
    patterns: [
      /^(apa\s+maksud|maksud|artinya|yang dimaksud|bisa dijelaskan|bisa dijelasin)/i,
      /\b(apa yang dimaksud|maksudnya apa|maksud kamu)\b/i,
      /\b(bisa lebih jelas|bisa dijelaskan|bisa detail|bisa lengkap)\b/i,
      /\b(saya tidak paham|tidak mengerti|bingung|confused)\b/i
    ],
    confidence_boost: 0.14
  },
  [INTENT_TYPES.CORRECTION]: {
    patterns: [
      /^(bukan|tidak itu|maksud saya|yang saya maksud|sebenarnya)/i,
      /\b(salah|error|itu salah|bukan itu|aku maksud)\b/i,
      /\b(maksudnya|yang dimaksud|intended)\b/i
    ],
    confidence_boost: 0.15
  },
  [INTENT_TYPES.PREDICTION]: {
    patterns: [
      /\b(prediksi|ramalan|forecast|perkiraan|estimasi|prediksi)\b/i,
      /\b(akan terjadi|akan jadi|kemungkinan|nanti|besok|lusa|minggu depan)\b/i,
      /\b(trend|massa depan|future|kedepannya)\b/i
    ],
    confidence_boost: 0.16
  },
  [INTENT_TYPES.SUGGESTION]: {
    patterns: [
      /\b(saran|rekomendasi|suggestion|advice|apa yang harus|bagaimana cara)\b/i,
      /\b(lebih baik|sebaiknya|disarankan|recommended)\b/i,
      /\b(alternatif|pilihan|option|choice)\b/i
    ],
    confidence_boost: 0.15
  }
};

/**
 * Classify user intent dengan multi-level approach
 * @param {string} text - user message
 * @param {object} conversationContext - konteks conversation sebelumnya
 * @returns {object} intent classification result
 */
export function classifyIntent(text, conversationContext = {}) {
  const normalized = text.toLowerCase().trim();
  
  if (!text || text.length === 0) {
    return {
      intent: INTENT_TYPES.UNKNOWN,
      confidence: 0,
      reason: 'empty_input'
    };
  }

  // Level 1: Quick Pattern Matching
  const patternResults = matchPatterns(normalized);
  if (patternResults.confidence > 0.85) {
    return {
      ...patternResults,
      level: 'pattern'
    };
  }

  // Level 2: Complexity Analysis
  const complexityScore = analyzeComplexity(text);
  
  // Level 3: NLU Analysis untuk matching yang lebih sophisticated
  const nluAnalysis = analyzeWithNLU(text);
  
  // Level 4: Context-based Classification
  const contextAnalysis = analyzeWithContext(text, conversationContext);

  // Combine results
  const finalResult = combineResults(patternResults, complexityScore, nluAnalysis, contextAnalysis);
  
  return finalResult;
}

/**
 * Match user text against intent patterns
 */
function matchPatterns(normalized) {
  let bestMatch = {
    intent: INTENT_TYPES.UNKNOWN,
    confidence: 0,
    matches: []
  };

  for (const [intent, data] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of data.patterns) {
      if (pattern.test(normalized)) {
        const confidence = Math.min(0.95, data.confidence_boost + 0.2);
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent,
            confidence,
            matches: [pattern.toString()]
          };
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Analyze complexity: simple vs complex reasoning
 */
function analyzeComplexity(text) {
  const features = {
    wordCount: text.split(/\s+/).length,
    hasConjunctions: /\b(dan|atau|juga|selain|serta|karena|sebelum|sesudah|ketika|jika)\b/i.test(text),
    hasMultipleClauses: (text.match(/,/g) || []).length > 1,
    hasConditionals: /\b(jika|kalau|bila|asalkan|dengan syarat)\b/i.test(text),
    hasComparatives: /\b(lebih|kurang|dibanding|vs|versus)\b/i.test(text),
    hasNegations: /\b(tidak|bukan|jangan|belum)\b/i.test(text),
    questionWords: (text.match(/\b(apa|bagaimana|mengapa|kenapa|kapan|di mana|siapa|berapa)\b/i) || []).length,
    hasSpecificContext: /\b(file|data|project|system|setting|config)\b/i.test(text)
  };

  // Score complexity
  let complexityScore = 0;
  if (features.hasConjunctions) complexityScore += 0.15;
  if (features.hasMultipleClauses) complexityScore += 0.2;
  if (features.hasConditionals) complexityScore += 0.25;
  if (features.hasComparatives) complexityScore += 0.15;
  if (features.wordCount > 15) complexityScore += 0.2;
  if (features.questionWords > 1) complexityScore += 0.15;

  const isComplex = complexityScore > 0.5;

  return {
    isComplex,
    complexityScore: Math.min(1, complexityScore),
    features
  };
}

/**
 * Advanced NLU-based analysis
 */
function analyzeWithNLU(text) {
  try {
    const nluResult = processNLU(text, {
      includeLexical: true,
      includeCorpus: true,
      includeNLU: true
    });

    const entities = enhancedEntityRecognition(text);
    
    // Detect if it's asking about something specific
    const isFactual = entities.topics.length > 0 || entities.organizations.length > 0;
    const requiresReasoning = nluResult.components?.nlu?.intent_scores?.some(s => 
      ['analysis', 'reasoning', 'comparison', 'prediction'].includes(s.intent)
    ) || false;

    return {
      hasEntities: Object.values(entities).some(arr => Array.isArray(arr) && arr.length > 0),
      isFactual,
      requiresReasoning,
      entities
    };
  } catch (e) {
    console.warn('NLU analysis failed:', e);
    return { hasEntities: false, isFactual: false, requiresReasoning: false };
  }
}

/**
 * Analyze with conversation context
 */
function analyzeWithContext(text, conversationContext) {
  const { lastBotIntent, turnCount, hasUnresolvedQuestion } = conversationContext;
  
  let contextConfidence = 0;
  let likelyIntent = null;

  // Jika user merespons pertanyaan bot sebelumnya
  if (hasUnresolvedQuestion) {
    const simpleAnswerPattern = /^(ya|tidak|iya|bukan|ya|yes|no)/i;
    if (simpleAnswerPattern.test(text)) {
      likelyIntent = INTENT_TYPES.CONFIRMATION;
      contextConfidence = 0.85;
    }
  }

  // Jika user melanjutkan topik (turn 2+)
  if (turnCount > 1 && lastBotIntent === INTENT_TYPES.DEFINITION) {
    if (/\b(terus|lalu|dan|setelah itu|bagaimana dengan)\b/i.test(text)) {
      likelyIntent = INTENT_TYPES.CLARIFICATION;
      contextConfidence = 0.75;
    }
  }

  return {
    likelyIntent,
    contextConfidence,
    suggestsFollowUp: /\b(juga|juga apa|apa lagi|yang lain)\b/i.test(text)
  };
}

/**
 * Combine all results untuk final classification
 */
function combineResults(patternResults, complexityScore, nluAnalysis, contextAnalysis) {
  let finalConfidence = patternResults.confidence;
  let finalIntent = patternResults.intent;

  // Enhanced confidence calculation
  let confidenceFactors = [];

  // Pattern matching confidence
  confidenceFactors.push({
    name: 'pattern_match',
    confidence: patternResults.confidence,
    weight: 0.4
  });

  // NLU analysis confidence
  if (nluAnalysis.intent) {
    const nluConfidence = nluAnalysis.intent.confidence || 0;
    confidenceFactors.push({
      name: 'nlu_analysis',
      confidence: nluConfidence,
      weight: 0.3
    });

    // Boost if NLU intent matches pattern intent
    if (nluAnalysis.intent.intent === patternResults.intent) {
      finalConfidence += 0.1;
    }
  }

  // Context analysis confidence
  if (contextAnalysis.contextConfidence > 0) {
    confidenceFactors.push({
      name: 'context_analysis',
      confidence: contextAnalysis.contextConfidence,
      weight: 0.2
    });
  }

  // Complexity-based adjustments
  if (complexityScore.isComplex) {
    confidenceFactors.push({
      name: 'complexity_adjustment',
      confidence: complexityScore.complexityScore,
      weight: 0.1
    });
  }

  // Calculate weighted confidence
  let totalWeight = 0;
  let weightedSum = 0;

  confidenceFactors.forEach(factor => {
    weightedSum += factor.confidence * factor.weight;
    totalWeight += factor.weight;
  });

  finalConfidence = totalWeight > 0 ? weightedSum / totalWeight : finalConfidence;

  // Intent selection logic
  if (finalIntent === INTENT_TYPES.UNKNOWN) {
    // Try to determine from other sources
    if (contextAnalysis.likelyIntent && contextAnalysis.contextConfidence > 0.6) {
      finalIntent = contextAnalysis.likelyIntent;
      finalConfidence = contextAnalysis.contextConfidence;
    } else if (nluAnalysis.intent && nluAnalysis.intent.confidence > 0.5) {
      finalIntent = nluAnalysis.intent.intent;
      finalConfidence = nluAnalysis.intent.confidence;
    } else if (complexityScore.isComplex) {
      finalIntent = INTENT_TYPES.COMPLEX_REASONING;
      finalConfidence = Math.max(0.5, complexityScore.complexityScore);
    } else if (nluAnalysis.isFactual) {
      finalIntent = INTENT_TYPES.SIMPLE_FACTUAL;
      finalConfidence = 0.6;
    }
  }

  // Additional boosts
  if (nluAnalysis.hasEntities && finalIntent !== INTENT_TYPES.UNKNOWN) {
    finalConfidence = Math.min(1, finalConfidence + 0.05);
  }

  if (patternResults.matches && patternResults.matches.length > 1) {
    finalConfidence = Math.min(1, finalConfidence + 0.05);
  }

  return {
    intent: finalIntent,
    confidence: Math.min(1, Math.max(0, finalConfidence)),
    complexity: complexityScore,
    entities: nluAnalysis.entities || [],
    reasoning: nluAnalysis.requiresReasoning || false,
    followUpSuggested: contextAnalysis.suggestsFollowUp || false,
    confidenceBreakdown: confidenceFactors
  };
}

/**
 * Get optimal response strategy based on intent
 */
export function getResponseStrategy(classificationResult) {
  const { intent, complexity } = classificationResult;

  const strategies = {
    [INTENT_TYPES.GREETING]: {
      type: 'friendly_response',
      tone: 'warm',
      includeContext: false,
      followUp: true
    },
    [INTENT_TYPES.SIMPLE_FACTUAL]: {
      type: 'direct_answer',
      tone: 'informative',
      includeContext: true,
      followUp: false
    },
    [INTENT_TYPES.COMPLEX_REASONING]: {
      type: 'detailed_explanation',
      tone: 'analytical',
      includeContext: true,
      stepByStep: true,
      followUp: true
    },
    [INTENT_TYPES.HOW_TO]: {
      type: 'step_by_step_guide',
      tone: 'instructional',
      numbered: true,
      includeExamples: true,
      followUp: true
    },
    [INTENT_TYPES.DEFINITION]: {
      type: 'definition_with_context',
      tone: 'educational',
      includeExamples: true,
      relatedConcepts: true,
      followUp: true
    },
    [INTENT_TYPES.COMMAND]: {
      type: 'action_response',
      tone: 'professional',
      confirmation: true
    },
    [INTENT_TYPES.COMPLAINT]: {
      type: 'empathetic_response',
      tone: 'supportive',
      offerSolution: true,
      followUp: true
    },
    [INTENT_TYPES.UNKNOWN]: {
      type: 'clarification_request',
      tone: 'helpful',
      askForClarification: true,
      suggestions: true
    }
  };

  return strategies[intent] || strategies[INTENT_TYPES.UNKNOWN];
}
