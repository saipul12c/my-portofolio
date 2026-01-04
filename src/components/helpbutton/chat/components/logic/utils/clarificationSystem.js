/**
 * Clarification & Fallback System
 * Sistem untuk handle ambiguity, incomplete queries, dan uncertain situations
 * dengan cara yang helpful dan user-friendly
 */

import { INTENT_TYPES } from './advancedIntentClassifier';
import { extractTopics } from './conversationContext';

/**
 * Clarification prompt types
 */
export const CLARIFICATION_TYPES = {
  AMBIGUOUS_ENTITY: 'ambiguous_entity',
  INCOMPLETE_QUERY: 'incomplete_query',
  MULTIPLE_INTERPRETATIONS: 'multiple_interpretations',
  CONTEXT_DEPENDENCY: 'context_dependency',
  MISSING_SPECIFICATION: 'missing_specification',
  UNCLEAR_INTENT: 'unclear_intent'
};

/**
 * Generate clarification prompt yang user-friendly
 */
export function generateClarificationPrompt(situation, context = {}) {
  const { type, data, message } = situation;

  const prompts = {
    [CLARIFICATION_TYPES.AMBIGUOUS_ENTITY]: () => {
      const { entity, options } = data;
      return {
        text: `Tentang "${entity}"...\n\nAku temukan beberapa kemungkinan:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nMaksudmu yang mana? 🤔`,
        followUpRequired: true,
        options
      };
    },

    [CLARIFICATION_TYPES.INCOMPLETE_QUERY]: () => {
      const { missing, example } = data;
      return {
        text: `Pertanyaanmu kurang lengkap. Biar aku bisa bantu lebih baik, butuh info tentang:\n\n${missing.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nContoh: "${example}"\n\nBisa elaborate? 💡`,
        followUpRequired: true,
        missingFields: missing
      };
    },

    [CLARIFICATION_TYPES.MULTIPLE_INTERPRETATIONS]: () => {
      const { interpretations } = data;
      return {
        text: `Ada beberapa cara aku bisa interpretasikan pertanyaanmu:\n\n${interpretations.map((interp, i) => `**${i + 1}. ${interp.title}**\n${interp.description}`).join('\n\n')}\n\nMaksudmu yang mana? 🎯`,
        followUpRequired: true,
        interpretations
      };
    },

    [CLARIFICATION_TYPES.CONTEXT_DEPENDENCY]: () => {
      const { contextWhat, examples } = data;
      return {
        text: `Jawabannya tergantung dari ${contextWhat}.\n\nContoh:\n${examples.map((ex, i) => `• Jika ${ex.condition}: ${ex.consequence}`).join('\n')}\n\nSitua sianmu yang mana? 🤷`,
        followUpRequired: true,
        examples
      };
    },

    [CLARIFICATION_TYPES.MISSING_SPECIFICATION]: () => {
      const { specs, suggestedValues } = data;
      return {
        text: `Untuk menjawab dengan akurat, aku perlu tahu:\n\n${specs.map((spec, i) => {
          const values = suggestedValues[spec];
          return `**${i + 1}. ${spec}**${values ? `\n  Opsi: ${values.join(', ')}` : ''}`;
        }).join('\n\n')}\n\nKasih detil? 📋`,
        followUpRequired: true,
        specs,
        suggestedValues
      };
    },

    [CLARIFICATION_TYPES.UNCLEAR_INTENT]: () => {
      const { possibleIntents } = data;
      return {
        text: `Saya kurang jelas dengan maksudmu. Maksudnya:\n\n${possibleIntents.map((intent, i) => `${i + 1}. ${intent.label} - ${intent.description}`).join('\n\n')}\n\nAta ada yang lain? 🤨`,
        followUpRequired: true,
        possibleIntents
      };
    }
  };

  const handler = prompts[type];
  if (handler) {
    return {
      type,
      ...handler()
    };
  }

  // Default fallback
  return {
    type: 'generic',
    text: "Bisa tolong clarify pertanyaanmu? Aku ingin memastikan aku jawab yang benar! 😊",
    followUpRequired: true
  };
}

/**
 * Detect situations yang perlu clarification
 */
export function detectClarificationNeeded(message, context = {}, knowledgeBase = {}) {
  const situations = [];
  const lowerMsg = message.toLowerCase();

  // 1. Check untuk ambiguous pronouns
  if (/^(itu|dia|mereka|ini)\b/.test(lowerMsg)) {
    if (!context.lastMentionedEntity) {
      situations.push({
        type: CLARIFICATION_TYPES.AMBIGUOUS_ENTITY,
        data: {
          entity: message.slice(0, 20),
          options: ['hal sebelumnya', 'sesuatu yang spesifik', 'topik dari pertanyaan terakhir']
        },
        confidence: 0.8
      });
    }
  }

  // 2. Check untuk incomplete questions
  const questionMarkers = message.match(/\b(apa|bagaimana|gimana|mengapa|kenapa|kapan|berapa|di mana|siapa)\b/i);
  if (questionMarkers && message.length < 15) {
    situations.push({
      type: CLARIFICATION_TYPES.INCOMPLETE_QUERY,
      data: {
        missing: ['Topik spesifik', 'Konteks lebih detail', 'Parameter/spesifikasi'],
        example: 'Misalnya: "Bagaimana cara kerja neural networks dalam machine learning?"'
      },
      confidence: 0.75
    });
  }

  // 3. Check untuk potentially ambiguous entities
  const entities = /\b(file|data|project|setting|feature|itu|ini)\b/gi;
  const matches = message.match(entities);
  if (matches && matches.length > 1) {
    situations.push({
      type: CLARIFICATION_TYPES.MULTIPLE_INTERPRETATIONS,
      data: {
        interpretations: [
          {
            title: 'Tentang file/data',
            description: 'Kamu ingin tanya tentang upload, format, atau processing'
          },
          {
            title: 'Tentang fitur/setting',
            description: 'Kamu ingin tahu cara menggunakan atau mengonfigurasi'
          },
          {
            title: 'Tentang konsep umum',
            description: 'Kamu ingin mengerti maksud dari istilah tertentu'
          }
        ]
      },
      confidence: 0.6
    });
  }

  // 4. Check untuk context-dependent answers
  if (/\b(lebih baik|mana|bagus|cocok|sesuai|pas)\b/i.test(lowerMsg)) {
    situations.push({
      type: CLARIFICATION_TYPES.CONTEXT_DEPENDENCY,
      data: {
        contextWhat: 'use case dan requirements spesifikmu',
        examples: [
          { condition: 'kamu butuh kecepatan', consequence: 'pilihan A lebih baik' },
          { condition: 'kamu butuh akurasi', consequence: 'pilihan B lebih optimal' },
          { condition: 'kamu terbatas budget', consequence: 'pilihan C lebih efisien' }
        ]
      },
      confidence: 0.65
    });
  }

  // 5. Check untuk missing critical specifications
  if (/\b(analisis|hitung|buat|proses)\b/i.test(lowerMsg) && !message.includes('file') && !message.includes('data')) {
    situations.push({
      type: CLARIFICATION_TYPES.MISSING_SPECIFICATION,
      data: {
        specs: ['Tipe data input', 'Format output yang diinginkan', 'Batasan atau constraints'],
        suggestedValues: {
          'Tipe data input': ['Angka', 'Teks', 'File (CSV/JSON)', 'Campuran'],
          'Format output yang diinginkan': ['Angka', 'Tabel', 'Grafik', 'Penjelasan tertulis'],
          'Batasan atau constraints': ['Tidak ada', 'Ukuran terbatas', 'Waktu processing terbatas']
        }
      },
      confidence: 0.7
    });
  }

  // Return yang paling confident
  if (situations.length > 0) {
    return situations.sort((a, b) => b.confidence - a.confidence)[0];
  }

  return null;
}

/**
 * Smart fallback response ketika bot uncertain
 */
export function generateSmartFallback(message, confidence, context = {}) {
  // Categorize fallback type based on confidence
  let fallbackType = 'generic';
  
  if (confidence < 0.3) {
    fallbackType = 'very_uncertain';
  } else if (confidence < 0.6) {
    fallbackType = 'partially_understood';
  } else if (confidence < 0.8) {
    fallbackType = 'confident_but_offer_clarification';
  }

  const fallbacks = {
    very_uncertain: {
      text: `Maaf, aku belum sepenuhnya mengerti maksudmu 😅\n\nBiar aku bisa bantu lebih baik, coba:\n\n1. **Rephrase pertanyaannya** dengan cara lain\n2. **Kasih konteks tambahan** (bidang, domain, spesifikasi)\n3. **Upload file** kalau ada yang terkait\n4. **Berikan contoh** dari apa yang kamu maksud\n\nUntuk hasil terbaik, pertanyaan yang lebih detail akan sangat membantu! 💡`,
      suggestion: 'Coba berikan konteks lebih spesifik'
    },

    partially_understood: {
      text: `Aku kurang 100% yakin dengan pertanyaanmu.\n\nSepemahamanku, kamu bertanya tentang:\n> "${message.slice(0, 60)}..."\n\nApa itu benar? Atau ada yang perlu aku clarify? 🤔`,
      suggestion: 'Confirm atau rephrase untuk kejelasan'
    },

    confident_but_offer_clarification: {
      text: `Okay, aku cukup yakin dengan pertanyaanmu.\n\nNamun, untuk jawaban yang lebih akurat dan sesuai kebutuhan, bisa clarify:\n\n• **Level detail** yang kamu inginkan (basic/intermediate/advanced)?\n• **Use case spesifik** atau konteks aplikasinya?\n• Mau **step-by-step** atau **summary** saja?\n\nBeri input ini dan aku bisa optimize responsenya! 🎯`,
      suggestion: 'Spesifikasi preferensi jawaban'
    },

    generic: {
      text: `Hmm, ada sesuatu yang tidak jelas dari pertanyaanmu.\n\nBisa bantu dengan:\n\n📝 **Menulis ulang** pertanyaan lebih spesifik?\n🎯 **Fokus pada satu topik** saja (jangan terlalu panjang)?\n📎 **Upload file** kalau ada yang relevan?\n💬 **Kasih contoh** dari apa yang kamu inginkan?\n\nJangan khawatir, kita bisa solve ini bareng! 🚀`,
      suggestion: 'Provide more specific information'
    }
  };

  const fallback = fallbacks[fallbackType] || fallbacks.generic;

  return {
    text: fallback.text,
    source: { type: 'fallback', subtype: fallbackType, confidence },
    suggestion: fallback.suggestion,
    followUp: true,
    allowReformulation: true
  };
}

/**
 * Parse user reformulation/clarification
 */
export function parseUserClarification(userResponse, previousClarification) {
  const { type, options, interpretations, missingFields } = previousClarification;

  const parsed = {
    understood: false,
    selectedOption: null,
    selectedInterpretation: null,
    providedInformation: {},
    confidence: 0
  };

  const lowerResponse = userResponse.toLowerCase();

  // If it was a numbered choice
  const choiceMatch = userResponse.match(/^(\d+)/);
  if (choiceMatch) {
    const choiceNum = parseInt(choiceMatch[1]) - 1;

    if (type === CLARIFICATION_TYPES.AMBIGUOUS_ENTITY && options) {
      parsed.selectedOption = options[choiceNum];
      parsed.understood = true;
      parsed.confidence = 0.95;
    } else if (type === CLARIFICATION_TYPES.MULTIPLE_INTERPRETATIONS && interpretations) {
      parsed.selectedInterpretation = interpretations[choiceNum];
      parsed.understood = true;
      parsed.confidence = 0.95;
    }
  }

  // If provided new information
  if (missingFields) {
    for (const field of missingFields) {
      if (userResponse.includes(field)) {
        parsed.providedInformation[field] = userResponse;
      }
    }
    if (Object.keys(parsed.providedInformation).length > 0) {
      parsed.understood = true;
      parsed.confidence = 0.7;
    }
  }

  // If rephrased/elaborated
  if (!parsed.understood && userResponse.length > 50) {
    parsed.understood = true;
    parsed.confidence = 0.65;
    parsed.elaboration = userResponse;
  }

  return parsed;
}

/**
 * Suggest alternative queries kalau user's query tidak match
 */
export function suggestAlternativeQueries(originalQuery, failureReason = '') {
  const suggestions = {
    'no_match': [
      'Coba: "Jelaskan konsep [topik]"',
      'Coba: "Bagaimana cara [action]?"',
      'Coba: "Apa perbedaan antara [A] dan [B]?"',
      'Coba: "Mana yang lebih baik, [A] atau [B]?"'
    ],
    'ambiguous': [
      'Coba lebih spesifik: "Tentang [topik spesifik]"',
      'Coba beri konteks: "[konteks] - [pertanyaan]"',
      'Coba pisahkan: Tanya satu hal per kali'
    ],
    'incomplete': [
      'Tambahkan: "[pertanyaan] - [detail spesifik]?"',
      'Berikan konteks: "[topik] - [spesifikasi]"',
      'Upload file jika ada yang relevan'
    ]
  };

  return {
    reason: failureReason,
    alternatives: suggestions[failureReason] || suggestions.no_match,
    example: 'Misalnya: "Bagaimana cara train neural network dengan TensorFlow untuk image classification?"'
  };
}

/**
 * Check jika response memerlukan confirmation
 */
export function shouldRequestConfirmation(response, intent) {
  const confirmationNeeded = [
    INTENT_TYPES.COMMAND,
    INTENT_TYPES.REQUEST,
    'data_deletion',
    'important_action'
  ];

  return confirmationNeeded.includes(intent);
}

/**
 * Generate confirmation prompt
 */
export function generateConfirmationPrompt(action, details = {}) {
  const { target, consequence } = details;

  const prompts = {
    'data_deletion': `Kamu mau delete "${target}"?\n\nKarena: ${consequence}\n\nApa kamu yakin? (ya/tidak) ⚠️`,
    'important_action': `Confirm action: "${action}"?\n\nDetails: ${consequence}\n\nOkay? (ya/tidak)`,
    'file_upload': `Upload file "${target}"?\n\nSize: ${consequence}\n\nConfirm? (ya/tidak)`
  };

  const prompt = prompts[details.type] || `Confirm: ${action}? (ya/tidak)`;

  return {
    text: prompt,
    requiresConfirmation: true,
    action,
    details
  };
}
