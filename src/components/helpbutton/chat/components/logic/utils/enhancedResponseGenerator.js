/**
 * Enhanced Response Generation Pipeline
 * Menggabungkan intent classification, context awareness, dan knowledge base
 * untuk generate response yang lebih relevan dan natural
 */

import { INTENT_TYPES, getResponseStrategy } from './advancedIntentClassifier.js';
import { 
  checkIfNeedsHelp
} from './conversationContext.js';
import { getKnowledgeResponse } from './knowledgeBase.js';
import { calculateMath } from './mathCalculator.js';
import { detectEmotion } from './emotionEngine.js';
import { knowledgeBaseService } from './knowledgeBaseService.js';
import { checkClaimAgainstKB } from './factChecker.js';

/**
 * Main enhanced response generator
 * Menggantikan/melengkapi getSmartReply dengan logic yang lebih sophisticated
 */
export function generateEnhancedResponse(message, settings, context, classificationResult, safeKnowledgeBase) {
  const {
    intent = INTENT_TYPES.UNKNOWN,
    confidence = 0,
    complexity = {}
  } = classificationResult || {};

  try {
    // Step 1: Check for immediate safety concerns
    const safetyCheck = performSafetyCheck(message);
    if (safetyCheck.unsafe) {
      return {
        text: safetyCheck.message,
        source: { type: 'policy', id: 'safety' },
        confidence: 1,
        requiresReview: true
      };
    }

    // Step 2: Detect if user needs help
    const helpNeeded = checkIfNeedsHelp(message, context);
    
    // Step 3: Build context-aware response
    const strategy = getResponseStrategy({ intent, complexity });
    
    let response = null;

    // Route ke handler berdasarkan intent
    switch (intent) {
      case INTENT_TYPES.GREETING:
        response = handleGreeting(message, context, entities);
        break;
        
      case INTENT_TYPES.FAREWELL:
        response = handleFarewell(context);
        break;
        
      case INTENT_TYPES.THANKS:
        response = handleThanks();
        break;
        
      case INTENT_TYPES.DEFINITION:
        response = handleDefinition(message, safeKnowledgeBase);
        break;
        
      case INTENT_TYPES.HOW_TO:
        response = handleHowTo(message, safeKnowledgeBase);
        break;
        
      case INTENT_TYPES.SIMPLE_FACTUAL:
        response = handleSimpleFactual(message, safeKnowledgeBase);
        break;
        
      case INTENT_TYPES.COMPLEX_REASONING:
        response = handleComplexReasoning(message, safeKnowledgeBase);
        break;
        
      case INTENT_TYPES.CALCULATION:
        response = handleCalculation(message);
        break;
        
      case INTENT_TYPES.COMPARISON:
        response = handleComparison(message);
        break;
        
      case INTENT_TYPES.ABOUT_AI:
        response = handleAboutAI(message, safeKnowledgeBase);
        break;
        
      case INTENT_TYPES.COMPLAINT:
        response = handleComplaint(message);
        break;
        
      case INTENT_TYPES.COMMAND:
        response = handleCommand(message);
        break;
        
      case INTENT_TYPES.CLARIFICATION:
        response = handleClarification(message, context);
        break;
        
      case INTENT_TYPES.UNKNOWN:
      default:
        response = handleUnknown(message, context, helpNeeded);
    }

    // Step 4: Enhance dengan emotion detection
    if (response) {
      const emotion = detectEmotion(message);
      response.emotion = emotion.primary;
      response.strategy = strategy;
      response.intent = intent;
      response.confidence = confidence;
    }

    return response || generateFallbackResponse(message, context);

  } catch (error) {
    console.error('Error in generateEnhancedResponse:', error);
    return generateFallbackResponse(message, context);
  }
}

/**
 * Handlers untuk different intent types
 */

function handleGreeting(message, context, entities) {
  const responses = [
    "Halo! 👋 Senang bertemu lagi. Ada yang bisa aku bantu hari ini?",
    "Hai! Apa kabarnya? Kamu mau tanya tentang apa nih?",
    "Selamat datang! Siap membantu kamu dengan apa pun.",
    "Halo! Glad to see you again. What's on your mind?"
  ];

  let text = responses[Math.floor(Math.random() * responses.length)];

  // Add personalized touch
  if (entities.persons && entities.persons.length > 0) {
    text = `Halo ${entities.persons[0]}! Senang bertemu lagi. 👋`;
  }

  // Add context awareness
  if (context && context.messages.length > 5) {
    text += "\n\nKami sudah ngobrol tentang beberapa topik menarik. Ada lagi yang ingin kamu tahu?";
  }

  return {
    text,
    source: { type: 'greeting', id: 'friendly_response' },
    confidence: 0.95,
    followUp: true
  };
}

function handleFarewell(context) {
  const fareNotes = [
    "Sampai jumpa! Terima kasih sudah ngobrol denganku. 👋",
    "Goodbye! Senang berbincang denganmu. Sampai ketemu lagi!",
    "Dadah! Jangan ragu untuk kembali jika ada pertanyaan lagi.",
    "See you soon! Take care! 😊"
  ];

  const text = fareNotes[Math.floor(Math.random() * fareNotes.length)];

  if (context && context.messages.length > 10) {
    return {
      text: text + "\n\nBtw, ini percakapan yang panjang dan menarik. Kamu bisa save riwayat chat di pengaturan! 💾",
      source: { type: 'farewell', id: 'goodbye' },
      confidence: 0.95
    };
  }

  return {
    text,
    source: { type: 'farewell', id: 'goodbye' },
    confidence: 0.95
  };
}

function handleThanks() {
  const responses = [
    "Sama-sama! Senang bisa membantu. 😊",
    "Dengan senang hati! Ada lagi yang bisa aku bantu?",
    "You're welcome! Glad I could help.",
    "Terima kasih juga atas pertanyaannya yang bagus! 💯"
  ];

  return {
    text: responses[Math.floor(Math.random() * responses.length)],
    source: { type: 'thanks', id: 'acknowledgment' },
    confidence: 0.95
  };
}

function handleDefinition(message, safeKnowledgeBase) {
  // Extract what they're asking about
  const targetMatch = message.match(/(?:apa itu|definisi|arti|maksud)\s+([A-Za-z\s]+?)(?:\?|$)/i);
  const target = targetMatch ? targetMatch[1].trim() : '';

  // Try knowledge base first (retrieval-augmented)
  const kb = safeKnowledgeBase && Object.keys(safeKnowledgeBase).length > 0 ? safeKnowledgeBase : knowledgeBaseService.get();
  if (kb) {
    const kbResponse = getKnowledgeResponse(message, kb, { creativeMode: true });
    if (kbResponse && kbResponse.confidence > 0.6) {
      // Local fact-check against KB content
      const verify = checkClaimAgainstKB(message, kb, { threshold: 0.2 });
      if (verify && verify.verified) {
        return {
          ...kbResponse,
          type: 'definition',
          relatedTopics: findRelatedTopics(target, kb),
          source: { ...(kbResponse.source || {}), attribution: verify.sources },
          confidence: Math.min(0.99, (kbResponse.confidence || 0.7) + verify.score * 0.2)
        };
      }

      // If not verified confidently, still offer KB result but mark lower confidence and show sources
      return {
        ...kbResponse,
        type: 'definition',
        relatedTopics: findRelatedTopics(target, kb),
        source: { ...(kbResponse.source || {}), attribution: verify.sources },
        confidence: Math.min(0.9, (kbResponse.confidence || 0.6))
      };
    }
  }

  // Generic definition response
  return {
    text: `Tentang "${target}":\n\nSaya sedang mencari informasi detail tentang itu. Bisa kamu kasih konteks lebih? Misalnya:\n• Bidang apa (AI, math, programming, dll)?\n• Tingkat kesulitan yang kamu inginkan (basic, intermediate, advanced)?\n\nIni akan membantu aku memberikan penjelasan yang lebih tepat! 🎯`,
    source: { type: 'definition', id: 'request_clarification' },
    confidence: 0.6,
    followUp: true
  };
}

function handleHowTo(message, safeKnowledgeBase) {
  const targetMatch = message.match(/(?:bagaimana|gimana|cara|caranya)\s+([A-Za-z\s]+?)(?:\?|$)/i);
  const target = targetMatch ? targetMatch[1].trim() : 'melakukannya';

  // Check if it's in knowledge base
  if (safeKnowledgeBase && safeKnowledgeBase.uploadedData) {
    const relevant = safeKnowledgeBase.uploadedData.filter(f => 
      f.fileName && f.fileName.toLowerCase().includes(target.toLowerCase())
    );
    
    if (relevant.length > 0) {
      return {
        text: `Bagaimana cara ${target}?\n\n📄 Saya menemukan file yang relevan: "${relevant[0].fileName}"\n\nMau aku bantu parse informasi dari file tersebut?`,
        source: { type: 'how_to', id: 'file_reference' },
        confidence: 0.75,
        followUp: true
      };
    }
  }

  return {
    text: `Untuk "${target}":\n\n1️⃣ **Pahami tujuannya** - Apa yang ingin dicapai?\n2️⃣ **Kumpulkan resource** - Tools/informasi yang diperlukan\n3️⃣ **Eksekusi langkah demi langkah** - Jangan tergesa-gesa\n4️⃣ **Verifikasi hasilnya** - Pastikan sudah sesuai\n\nKamu bisa memberikan detail lebih spesifik? Aku akan kasih panduan step-by-step yang lebih detail! 📝`,
    source: { type: 'how_to', id: 'generic_guide' },
    confidence: 0.65,
    followUp: true
  };
}

function handleSimpleFactual(message, safeKnowledgeBase) {
  // Try knowledge base
  const kb = safeKnowledgeBase && Object.keys(safeKnowledgeBase).length > 0 ? safeKnowledgeBase : knowledgeBaseService.get();
  const kbResponse = getKnowledgeResponse(message, kb, {});

  if (kbResponse && kbResponse.confidence > 0.5) {
    const verify = checkClaimAgainstKB(message, kb, { threshold: 0.2 });
    return {
      ...kbResponse,
      type: 'factual',
      isSimple: true,
      source: { ...(kbResponse.source || {}), attribution: verify.sources },
      confidence: Math.min(0.95, (kbResponse.confidence || 0.6) + (verify.score || 0) * 0.2)
    };
  }

  // Fallback untuk simple factual questions
  return {
    text: "Itu pertanyaan yang bagus! 🤔\n\nSaya sedang mencari informasi yang tepat untuk menjawabnya. Beberapa hal yang bisa membantu:\n• Berikan konteks lebih (bidang, domain, spesifikasi)\n• Upload file atau dokumen terkait jika ada\n• Atau rephrase pertanyaannya dengan cara lain\n\nSiap membantu! 💪",
    source: { type: 'simple_factual', id: 'need_more_context' },
    confidence: 0.5,
    followUp: true
  };
}

function handleComplexReasoning(message, safeKnowledgeBase) {
  return {
    text: `Ini pertanyaan yang kompleks dan memerlukan analisis mendalam! 🧠\n\nMari saya breakdown:\n\n**1. Yang kamu tanyakan:**\n${message.slice(0, 100)}...\n\n**2. Informasi yang aku butuhkan:**\n• Detail konteks lengkap\n• Asumsi apa yang berlaku\n• Constraints atau batasan apa\n\n**3. Approach:**\nAku akan analisis dari berbagai sudut pandang untuk memberikan insights yang comprehensive.\n\nBisa kamu elaborate lebih banyak tentang pertanyaannya? 📊`,
    source: { type: 'complex_reasoning', id: 'detailed_analysis' },
    confidence: 0.7,
    stepByStep: true,
    followUp: true
  };
}

function handleCalculation(message) {
  try {
    const result = calculateMath(message);
    if (result) {
      // calculateMath returns a formatted string when successful
      return {
        text: `**Hasil Kalkulasi:**\n\n${result}\n\n*Jika ada yang ingin diklarifikasi atau ada pertanyaan lanjutan, silakan tanya!* 🧮`,
        source: { type: 'calculation', id: 'math_result' },
        confidence: 0.95,
        calculation: { raw: result }
      };
    }
  } catch (e) {
    console.warn('Math calculation failed:', e);
  }

  return {
    text: "Untuk kalkulasi:\n\nAku bisa bantu hitung:\n• Operasi aritmetika (+ - × ÷)\n• Statistik (mean, median, std dev)\n• Integral dan turunan (dalam bentuk sederhana)\n\nBisa kasih input dalam format yang lebih jelas? Misalnya: '5 + 3 * 2' atau 'rata-rata dari 1, 2, 3, 4, 5' 🧮",
    source: { type: 'calculation', id: 'need_format' },
    confidence: 0.6,
    followUp: true
  };
}

function handleComparison() {
  return {
    text: `Untuk perbandingan:\n\nAku akan bandingkan aspek-aspek penting:\n✓ **Kesamaan** - Apa yang sama\n✓ **Perbedaan** - Apa yang berbeda\n✓ **Kelebihan/kekurangan** - Mana lebih baik untuk use case mana\n✓ **Rekomendasi** - Kondisi ideal untuk masing-masing\n\nUntuk memberikan analisis yang lebih akurat, bisa detil tentang:\n• Apa yang ingin dibanding\n• Konteks penggunaan\n• Kriteria perbandingan yang penting\n\nReady! 📊`,
    source: { type: 'comparison', id: 'comparison_guide' },
    confidence: 0.7,
    followUp: true
  };
}

function handleComplaint(message) {
  return {
    text: "Maaf dengar ada masalah! 😟\n\nAku ingin membantu. Bisa jelaskan lebih detail tentang:\n\n1. **Masalah spesifik** - Apa yang terjadi?\n2. **Kapan terjadi** - Sejak kapan atau dalam kondisi apa?\n3. **Yang sudah dicoba** - Udah coba apa saja?\n4. **Error message** - Ada pesan error? Share jika ada\n\nInformasi ini akan membantu aku find solusi yang tepat. Kita fix ini bareng! 🔧",
    source: { type: 'complaint', id: 'empathetic_support' },
    confidence: 0.85,
    followUp: true,
    tone: 'supportive'
  };
}

function handleCommand(message) {
  const commandMatch = message.match(/^(upload|export|reset|clear|delete|hapus|buat|create|simpan|save|aktifkan|matikan|enable|disable)/i);
  const command = commandMatch ? commandMatch[1].toLowerCase() : '';

  return {
    text: `Perintah: ${command}\n\nSaya memproses perintah kamu. Sebentar... ⏳\n\n${getCommandExplanation(command)}`,
    source: { type: 'command', id: command },
    confidence: 0.85,
    command: command,
    requiresAction: true
  };
}

function handleClarification() {
  return {
    text: "Baik, jadi maksudmu... bisa dijelaskan lebih detail? 🤔\n\nAda yang kurang jelas dari penjelasan sebelumnya? Tanya aja, aku siap klarifikasi! 💡",
    source: { type: 'clarification', id: 'generic' },
    confidence: 0.7,
    followUp: true
  };
}

function handleUnknown() {
  return {
    text: "Hmm, itu pertanyaan yang interesting! 🤔\n\nNamun aku belum sepenuhnya mengerti yang kamu maksud. Bisa:\n\n1. **Rephrase** - Tanya dengan cara lain?\n2. **Kasih konteks** - Bidang atau domain apa?\n3. **Berikan contoh** - Ada contoh spesifik?\n4. **Upload file** - Kalau ada file terkait?\n\nSemakin detail, semakin bagus aku bisa bantu! 🚀",
    source: { type: 'unknown', id: 'generic_clarification' },
    confidence: 0.4,
    followUp: true
  };
}

/**
 * Utility functions
 */

function performSafetyCheck(message) {
  const piiPattern = /(password|passw(or)?d|pin|cvv|card number|kartu kredit|rekening|norek|no\s?rek|nik|ktp|ssn|social security|credit card|nomor kartu)/i;
  const illegalPattern = /(make a bomb|how to make a bomb|explode|assassin|kill someone|murder|hack into|ddos|how to hack|steal|rob bank)/i;

  if (piiPattern.test(message)) {
    return {
      unsafe: true,
      message: '⚠️ Saya tidak dapat memproses atau menyimpan data sensitif seperti password, nomor kartu, atau NIK. Silakan jangan share informasi pribadi atau transaksi finansial melalui chat.'
    };
  }

  if (illegalPattern.test(message)) {
    return {
      unsafe: true,
      message: 'Maaf, saya tidak dapat membantu dengan permintaan yang berbahaya atau ilegal.'
    };
  }

  return { unsafe: false };
}

function findRelatedTopics(topic, knowledgeBase) {
  // Simple implementation - bisa diperluas
  if (!knowledgeBase.AI) return [];
  
  return Object.keys(knowledgeBase.AI)
    .filter(q => q.toLowerCase().includes(topic.toLowerCase()))
    .slice(0, 3);
}

function getCommandExplanation(command) {
  const explanations = {
    'upload': 'Kamu ingin upload file. Pastikan format didukung dan ukuran tidak melebihi batas.',
    'export': 'Kamu ingin export data. Format apa yang kamu inginkan (JSON, CSV, PDF)?',
    'reset': 'Kamu ingin reset. Ini akan menghapus data saat ini - yakin?',
    'clear': 'Kamu ingin clear. Semua riwayat akan dihapus.',
    'delete': 'Kamu ingin delete. Item spesifik apa yang mau didelete?',
    'create': 'Kamu ingin create sesuatu. Detil spesifiknya apa?',
    'save': 'Kamu ingin save. Data akan disimpan di browser kamu.',
    'enable': 'Aktivasi feature. Updating pengaturan...',
    'disable': 'Deaktivasi feature. Updating pengaturan...'
  };

  return explanations[command] || 'Memproses perintahmu...';
}

function handleAboutAI(message, safeKnowledgeBase) {
  const aiDoc = safeKnowledgeBase?.aiDoc || {};
  const riwayat = safeKnowledgeBase?.riwayat || [];
  
  // Extract what user is asking about
  const lowerMessage = message.toLowerCase();
  
  // Check for version questions
  if (lowerMessage.includes('versi') || lowerMessage.includes('version')) {
    const latestVersion = riwayat.length > 0 ? riwayat[0] : null;
    if (latestVersion) {
      return {
        text: `Saya adalah **SaipulAI versi ${latestVersion.version}** 🚀\n\n**Informasi Versi:**\n• **Tanggal Rilis:** ${latestVersion.date}\n• **Tipe:** ${latestVersion.type}\n• **Status:** ${latestVersion.supported ? 'Didukung' : 'Tidak didukung'}\n\n**Yang Baru di v${latestVersion.version}:**\n${latestVersion.summary}\n\nUntuk melihat riwayat lengkap semua versi, tanyakan "riwayat versi" atau "changelog"! 📋`,
        source: { type: 'ai_info', id: 'version' },
        confidence: 0.95,
        version: latestVersion.version
      };
    }
  }
  
  // Check for feature/documentation questions
  if (lowerMessage.includes('fitur') || lowerMessage.includes('kemampuan') || lowerMessage.includes('bisa apa')) {
    const features = aiDoc.fitur_utama || [];
    return {
      text: `**Fitur Utama SaipulAI v${aiDoc.header_information?.version || '7.1.0'}:** ✨\n\n${features.map(f => `• ${f}`).join('\n')}\n\n**Spesifikasi Teknis:**\n• Total fitur: ${aiDoc.statistik_versi_saat_ini?.total_fitur || '48+'}\n• Knowledge base: ${aiDoc.statistik_versi_saat_ini?.knowledge_base_files || '7'} file\n• Waktu respons: ${aiDoc.statistik_versi_saat_ini?.waktu_respons || '<200ms'}\n\nIngin tahu lebih detail tentang fitur tertentu? 🤔`,
      source: { type: 'ai_info', id: 'features' },
      confidence: 0.9
    };
  }
  
  // Check for changelog/history questions
  if (lowerMessage.includes('riwayat') || lowerMessage.includes('changelog') || lowerMessage.includes('perubahan')) {
    const recentChanges = riwayat.slice(0, 3);
    return {
      text: `**Riwayat Perubahan SaipulAI:** 📝\n\n${recentChanges.map(v => `**v${v.version}** (${v.date}):\n${v.summary}`).join('\n\n')}\n\n**Statistik:**\n• Total versi: ${aiDoc.statistik_versi_saat_ini?.total_versi_dokumentasi || '87'} versi\n• Rentang waktu: ${aiDoc.statistik_versi_saat_ini?.rentang_waktu || '2024-05-15 hingga 2025-12-12'}\n• Rata-rata release: ${aiDoc.statistik_versi_saat_ini?.rata_rata_release || '5.2 hari per versi'}\n\nUntuk detail lengkap versi tertentu, sebutkan nomor versinya! 🔍`,
      source: { type: 'ai_info', id: 'changelog' },
      confidence: 0.9
    };
  }
  
  // General about AI
  return {
    text: `**Halo! Saya SaipulAI v${aiDoc.header_information?.version || '7.1.0'}** 🤖\n\n${aiDoc.ringkasan_singkat || 'Saya adalah asisten AI lokal yang membantu dengan berbagai pertanyaan dan tugas.'}\n\n**Yang Bisa Saya Bantu:**\n• Jawab pertanyaan tentang AI, machine learning, dan teknologi\n• Lakukan perhitungan matematika dan analisis data\n• Bantu dengan tugas-tugas umum sehari-hari\n• Berikan informasi dari knowledge base yang tersedia\n\n**Contoh Pertanyaan:**\n• "Apa itu kecerdasan buatan?"\n• "Hitung 2 + 2"\n• "Apa fitur SaipulAI?"\n• "Riwayat versi apa saja?"\n\nAda yang bisa saya bantu hari ini? 😊`,
    source: { type: 'ai_info', id: 'general' },
    confidence: 0.85
  };
}

function generateFallbackResponse() {
  return {
    text: 'Maaf, terjadi kesalahan dalam memproses pertanyaanmu. Coba lagi atau rephrase pertanyaannya. Jika masalah berlanjut, laporkan ke tim support! 🔧',
    source: { type: 'fallback', id: 'error' },
    confidence: 0.3
  };
}
