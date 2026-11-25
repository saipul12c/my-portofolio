import { calculateMath } from './mathCalculator';
import { getKnowledgeResponse } from './knowledgeBase';
import { handleConversion } from './conversions';
import { generatePrediction, analyzeData, calculateStatistics } from './analytics';
import { simpleNER } from './helpers';
import { getFileIcon } from './fileIcons';
import { CHATBOT_VERSION, LIVE_CS_PATH } from '../../../config.js';
import aiDocData from '../../../../../../data/AIDoc/data.json';
import riwayatData from '../../../../../../data/AIDoc/riwayat/riwayat.json';
import { 
  detectEmotion, 
  detectCharacter, 
  wrapResponseWithEmotion
} from './emotionEngine';
import { detectPII, redactPII } from './piiDetector';
import { checkClaimAgainstKB } from './factChecker';
import { 
  isSaipulAIReference,
  generateSaipulAIResponse,
  extractNamedEntities,
  updateUserProfileFromEntities
} from './entityRecognition';
import { 
  generateComprehensiveAnswer
} from './dataIntegration';
import { kbMonitor } from './kbMonitoring';

// ===== NEW NLP IMPORTS =====
import { getSynonyms, getBilingualTranslation } from './lexicalDatabase';
import { getExpressionVariations } from './languageCorpus';
import { quickNLU, detectSarcasmAndIrony, detectLanguage } from './nluProcessing';
import { 
  generateComprehensiveAnswer as generateEnhancedAnswer,
  findKnowledgeNode,
  getRelatedConcepts
} from './enhancedKnowledgeBase';
import { generateSmartFallback } from './clarificationSystem';

// ===== GREETING & SIMPLE PATTERN RECOGNITION =====
import { recognizeGreeting } from './greetingRecognizer';
import { findBestFAQMatch } from './faqIntegration';
import { analyzeQueryDynamics } from './conversationContext';

/**
 * Integrasi data.json dan riwayat.json ke dalam proses pembuatan respon
 * @param {string} msg
 * @param {object} settings
 * @param {array} conversationContext
 * @param {object} safeKnowledgeBase
 * @param {object} knowledgeStats
 * @param {object} intent - Hasil klasifikasi intent dari useChatbot
 * @returns {object} response
 */
export function getSmartReply(msg, settings, conversationContext, safeKnowledgeBase, knowledgeStats, intent) {
  const text = msg.toLowerCase().trim();

  // ===== ENHANCED TEXT PROCESSING & MULTI-LANGUAGE RESOLUTION =====
  const textAnalysis = enhancedTextProcessing(msg);

  // Resolusi bahasa: manual via settings ('id' | 'en' | 'id-en') atau otomatis ('auto')
  const langSetting = settings?.language || 'auto';
  const detectedLangInfo = detectLanguage(msg);
  let activeLang = 'id';
  if (langSetting === 'en') {
    activeLang = 'en';
  } else if (langSetting === 'id') {
    activeLang = 'id';
  } else {
    // Mode 'auto' atau 'id-en': ikuti bahasa input pengguna
    activeLang = detectedLangInfo.language === 'en' ? 'en' : 'id';
  }
  const isBilingualRequested = langSetting === 'id-en';

  // Absolute response rules enforcement (safety / non-fabrication)
  try {
    const illegalPattern = /(make a bomb|how to make a bomb|explode|assassin|kill someone|murder|hack into|ddos|how to hack|steal|rob bank)/i;
    if (illegalPattern.test(text)) {
      const safeMsg = activeLang === 'en'
        ? 'Sorry, I cannot assist with harmful, dangerous, or illegal requests.'
        : 'Maaf, saya tidak dapat membantu dengan permintaan yang berbahaya atau ilegal.';
      return { text: safeMsg, language: activeLang, source: { type: 'policy', id: 'no_illegal' }, confidence: 1 };
    }
  } catch (e) { 
    console.error('Safety check failed:', e);
  }

  // === RATE LIMITING (client-side, best-effort) ===
  try {
    const rlKey = 'saipul_rate';
    const now = Date.now();
    const windowMs = (settings?.rateLimitWindowMs) || 60000; // 60s default
    const maxReq = (settings?.maxRequestsPerWindow) || 20; // default
    let entries = [];
    try {
      entries = JSON.parse(localStorage.getItem(rlKey) || '[]');
    } catch (e) {
      console.warn('Failed to parse rate limit entries:', e);
      entries = [];
    }
    entries = (Array.isArray(entries) ? entries : []).filter(ts => (now - ts) <= windowMs);
    if (entries.length >= maxReq) {
      // log moderation flag
      try {
        const flags = JSON.parse(localStorage.getItem('saipul_moderation_flags') || '[]');
        flags.push({ type: 'rate_limit', ts: new Date().toISOString(), count: entries.length });
        localStorage.setItem('saipul_moderation_flags', JSON.stringify(flags.slice(-200)));
      } catch (e) {
        console.debug('Failed to log rate limit moderation flag:', e);
      }
      const rateLimitMsg = activeLang === 'en'
        ? 'Too many requests in a short time. Please wait a few seconds before trying again.'
        : 'Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa detik sebelum mencoba lagi.';
      return { text: rateLimitMsg, language: activeLang, source: { type: 'throttle' }, confidence: 0.2 };
    }
    entries.push(now);
    try { 
      localStorage.setItem(rlKey, JSON.stringify(entries)); 
    } catch (e) { 
      console.warn('Failed to save rate limit entries:', e);
    }
  } catch (e) { 
    console.error('Rate limiting internal error:', e);
  }

  // === PII detection & enforcement ===
  try {
    const piiDetections = detectPII(msg, { whitelist: settings?.piiWhitelist || [] });
    if (Array.isArray(piiDetections) && piiDetections.length > 0) {
      // log moderation flag
      try {
        const flags = JSON.parse(localStorage.getItem('saipul_moderation_flags') || '[]');
        flags.push({ type: 'pii_detected', ts: new Date().toISOString(), detections: piiDetections.slice(0,5) });
        localStorage.setItem('saipul_moderation_flags', JSON.stringify(flags.slice(-200)));
      } catch { /* ignore storage error */ }

      // enforce strict PII protection by default
      if (settings?.enforcePIIProtection !== false) {
        const redacted = redactPII(msg, { replaceMap: { email: '[REDACTED_EMAIL]', phone: '[REDACTED_PHONE]' } });
        const piiMsg = activeLang === 'en'
          ? `Sorry, sensitive personal information (PII) was detected in your message and cannot be processed. Redacted preview: "${(redacted.text || '').slice(0, 200)}". Please remove sensitive details and try again.`
          : `Maaf, saya mendeteksi informasi sensitif (PII) dalam pesan Anda dan tidak dapat memprosesnya. Contoh yang disamarkan: "${(redacted.text || '').slice(0, 200)}". Silakan hapus info sensitif dan coba lagi.`;
        return { text: piiMsg, language: activeLang, source: { type: 'policy', id: 'pii_block' }, confidence: 1 };
      }
    }
  } catch (e) { 
    console.error('PII detection internal error:', e);
  }

  // ===== NEW: EMOTION & CHARACTER DETECTION =====
  const emotionData = detectEmotion(msg);
  const characterData = detectCharacter(msg);

  // ===== NEW: ENHANCED ENTITY RECOGNITION =====
  const userProfile = JSON.parse(localStorage.getItem('saipul_profile') || '{}');
  const entities = extractNamedEntities(msg, { userProfile });
  
  // Update user profile dari detected entities
  const updatedProfile = updateUserProfileFromEntities(entities, userProfile);
  try {
    localStorage.setItem('saipul_profile', JSON.stringify(updatedProfile));
  } catch (e) {
    console.warn('Failed to save user profile:', e);
  }

  // ===== NEW: CAUTION NOTE ANALYSIS (Moved up to prevent ReferenceError) =====
  let cautionNote = '';
  let reportInfluence = { found: false, count: 0, highestSeverity: null, categories: [] };
  try {
    const reports = JSON.parse(localStorage.getItem('saipul_chat_reports') || '[]');
    if (Array.isArray(reports) && reports.length > 0) {
      // examine recent reports but compute aggregate signals
      const recent = reports.slice(-200);
      for (const r of recent) {
        const snippet = (r.messageSnippet || r.messageText || '').toLowerCase();
        if (!snippet) continue;
        // token-overlap + phrase match heuristic
        const tokens = snippet.split(/\W+/).filter(w => w.length > 3);
        if (tokens.length === 0) continue;
        let matches = 0;
        for (const w of tokens) if (text.includes(w)) matches++;
        // also check direct phrase containment
        if (matches >= Math.min(2, tokens.length) || (snippet.length > 20 && text.includes(snippet.slice(0, Math.min(60, snippet.length))))) {
          reportInfluence.found = true;
          reportInfluence.count = (reportInfluence.count || 0) + 1;
          // severity priorities: low < medium < high
          try {
            const s = (r.severity || r.level || '').toString().toLowerCase();
            if (!reportInfluence.highestSeverity) reportInfluence.highestSeverity = s || 'medium';
            else {
              const order = { low: 1, medium: 2, high: 3 };
              if ((order[s] || 2) > (order[reportInfluence.highestSeverity] || 2)) reportInfluence.highestSeverity = s;
            }
          } catch { /* ignore */ }
          const c = (r.category || r.reason || 'other');
          if (!reportInfluence.categories.includes(c)) reportInfluence.categories.push(c);
        }
      }

      if (reportInfluence.found) {
        // craft caution note depending on severity/count/categories
        const catLabel = reportInfluence.categories.slice(0,2).join(', ');
        if (reportInfluence.count >= 3 || reportInfluence.highestSeverity === 'high') {
          cautionNote = `⚠️ Peringatan: topik/kalimat serupa telah dilaporkan beberapa kali (${reportInfluence.count}) dengan kategori: ${catLabel}. Saya akan sangat berhati-hati — beberapa detail mungkin disembunyikan atau saya akan memberikan saran untuk menghubungi dukungan.`;
        } else {
          cautionNote = `⚠️ Catatan: topik/kalimat serupa pernah dilaporkan (${catLabel}). Saya akan berhati-hati dan menyertakan referensi atau meminta klarifikasi jika diperlukan.`;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to analyze local reports for caution Note:', e);
  }

  // ===== DINAMIKA PERCAKAPAN MULTI-TURN & SARKASME =====
  const queryDynamics = analyzeQueryDynamics(msg, conversationContext);

  // 1. Periksa Sarkasme & Makna Tersirat (Sarcasm & Pragmatic Inversion)
  // Menangkap nuansa kalimat secara utuh seperti: "Mantap sekali, baru dipakai sehari sudah rusak"
  const sarcasmCheck = detectSarcasmAndIrony(msg);
  if (sarcasmCheck && sarcasmCheck.isSarcastic) {
    const sarcasticResponses = [
      `Waduh, aku minta maaf banget mendengarnya! 😔 Memang menyebalkan sekali kalau sesuatu yang baru dipakai atau dicoba langsung bermasalah atau rusak.\n\nBoleh ceritakan lebih detail kendalanya di bagian mana? Biar aku bantu cari solusinya bareng-bareng.`,
      `Aduh, mohon maaf ya atas pengalaman yang tidak menyenangkan ini. 🥺 Aku sangat paham kekesalanmu kalau yang diharapkan bagus ternyata cepat rusak atau bermasalah. Ceritakan detailnya, aku siap bantu carikan solusinya!`,
      `Waduh, aku paham betul rasa frustrasimu. 😔 Baru dipakai tapi sudah rusak tentu bikin kecewa. Boleh kasih tahu bagian mana yang bermasalah? Biar kita cari solusinya bersama.`
    ];
    return {
      text: (cautionNote ? `${cautionNote}\n\n` : '') + sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)],
      source: { type: 'sarcasm_handler', id: sarcasmCheck.type },
      confidence: 0.95,
      emotion: { emotion: 'empathetic', emoji: '❤️', name: 'empati' },
      character: characterData.character
    };
  }

  // 2. Evaluasi Pengulangan Input yang Sama (Repetition & Consistency Engine)
  if (queryDynamics.isRepeat) {
    const hasClearMath = /\b(hitung|calculate|berapa|hasil|kalkulator|math|solve|^=)\b|[\d]\s*[+\-*/^]\s*[\d]|(?:integral|turunan|derivative|sqrt|sin|cos|tan|log|abs)/i.test(text);
    if (hasClearMath) {
      let mathRes = null;
      try { mathRes = calculateMath(text, settings.calculationPrecision); } catch { mathRes = null; }
      if (mathRes) {
        const mathAns = mathRes.result !== undefined ? mathRes.result : (mathRes.text || '');
        const mathVariation = queryDynamics.repeatCount === 1
          ? `Perhitungannya tetap konsisten ya: **${mathAns}**.\n\nAda angka atau rumus lain yang mau kita hitung?`
          : `Masih **${mathAns}** ya! 😄 Rumus dan hukum matematikanya mutlak. Mau coba tantangan rumus lain?`;
        return {
          text: (cautionNote ? `${cautionNote}\n\n` : '') + mathVariation,
          source: { type: 'math_repeat_consistent' },
          confidence: 1.0,
          emotion: emotionData.primary,
          character: characterData.character
        };
      }
    }

    const convRes = handleConversion(text);
    if (convRes) {
      const convVariation = queryDynamics.repeatCount === 1
        ? `Hasil konversinya tetap sama ya: **${convRes}**.\n\nAda satuan lain yang ingin kamu ubah?`
        : `Masih **${convRes}** ya! Tetap konsisten. Butuh konversi satuan lain?`;
      return {
        text: (cautionNote ? `${cautionNote}\n\n` : '') + convVariation,
        source: { type: 'conversion_repeat_consistent' },
        confidence: 0.98,
        emotion: emotionData.primary,
        character: characterData.character
      };
    }

    // Jika diulang berturut-turut untuk ke-2 kalinya atau lebih (repeatCount >= 2)
    if (queryDynamics.repeatCount >= 2) {
      const repeatPrompts = [
        `Hehe, kamu menanyakan hal yang sama persis nih! 😄\n\nAdakah bagian dari penjelasanku tadi yang masih bikin bingung atau butuh contoh konkret yang lebih sederhana? Ceritakan bagian mana yang ingin kita bedah lebih dalam ya!`,
        `Pertanyaannya masih persis seperti sebelumnya nih 😉 Apakah kamu lagi menguji konsistensiku, atau ada poin spesifik yang belum terjawab dengan memuaskan? Kasih tahu aku bagian mana yang perlu diperjelas!`,
        `Aku perhatikan pertanyaan ini sudah diulang beberapa kali. Biar diskusinya lebih efektif, coba sebutkan apa fokus utama atau kendala yang sedang kamu hadapi terkait topik ini!`
      ];
      return {
        text: (cautionNote ? `${cautionNote}\n\n` : '') + repeatPrompts[Math.floor(Math.random() * repeatPrompts.length)],
        source: { type: 'system', id: 'repeat_clarification_prompt' },
        confidence: 0.95,
        emotion: emotionData.primary,
        character: characterData.character
      };
    }
  }

  // ===== NEW: FAQ & COMMITMENT INTEGRATION (High Priority) =====
  // Cek FAQ dan Komitmen sebelum greeting untuk memastikan pertanyaan teknis & profil terjawab akurat
  const faqMatch = findBestFAQMatch(msg);
  if (faqMatch && faqMatch.score > 80) {
    const isCommitment = faqMatch.item?.source === 'commitment';
    const isEn = activeLang === 'en';
    const headerTitle = isCommitment 
      ? (isEn ? `🤝 **${faqMatch.item.question_en || faqMatch.item.question || "Syaiful's Values & Commitments"}**` : `🤝 **${faqMatch.item.question || 'Nilai & Komitmen Syaiful'}**`)
      : (isEn ? `❓ **${faqMatch.item.question_en || faqMatch.item.question || 'FAQ Information'}**` : `❓ **${faqMatch.item.question || 'Informasi FAQ'}**`);
    const sourceFooter = isCommitment
      ? (isEn ? `💡 *This information is based on Muhammad Syaiful Mukmin's dedication and commitments.*` : `💡 *Informasi ini diambil dari pilar komitmen & dedikasi Muhammad Syaiful Mukmin.*`)
      : (isEn ? `💡 *This answer is sourced from our official FAQ knowledge base.*` : `💡 *Jawaban ini diambil dari basis data FAQ kami.*`);

    let faqBody = faqMatch.item.answer;
    if (queryDynamics.isRepeat && queryDynamics.repeatCount === 1) {
      faqBody = isEn
        ? `💡 *Clarifying from a more concise perspective:*\n\n${faqBody}`
        : `💡 *Menjawab kembali dengan sudut pandang yang lebih ringkas:*\n\n${paraphraseContent(faqBody, [], settings)}`;
    } else if (queryDynamics.suggestedBridge) {
      faqBody = `${queryDynamics.suggestedBridge}\n\n${faqBody}`;
    }

    const englishBody = faqMatch.item.answer_en || translateToEnglish(faqBody);
    const primaryBody = isEn ? englishBody : faqBody;
    const secondaryBody = isEn ? faqBody : englishBody;

    const fullPrimary = (typeof cautionNote !== 'undefined' && cautionNote ? `${cautionNote}\n\n` : '') + 
                        `${headerTitle}\n\n${primaryBody}\n\n${sourceFooter}`;
    const fullSecondary = `${headerTitle}\n\n${secondaryBody}\n\n${sourceFooter}`;

    return {
      text: fullPrimary,
      language: isEn ? 'en' : 'id',
      alternatives: {
        english: isEn ? fullPrimary : fullSecondary,
        indonesian: isEn ? fullSecondary : fullPrimary
      },
      source: { type: 'faq', id: `faq_${faqMatch.item.id}` },
      confidence: Math.min(faqMatch.score / 150, 0.95),
      emotion: emotionData.primary,
      character: characterData.character
    };
  }
  
  // ===== NEW: LIVE CS CONTEXT CHECK =====
  // Jika sedang di halaman Live CS, berikan respon minimal agar tidak mengganggu agen manusia
  if (settings?.settingsContext === 'live-cs') {
    const isEn = activeLang === 'en';
    const textId = "👋 Saya sedang standby menemani Anda di Room Diskusi. Silakan berinteraksi dengan agen kami atau kirim pesan di sini jika ada pertanyaan teknis singkat.";
    const textEn = "👋 I'm currently on standby accompanying you in the Discussion Room. Feel free to chat with our live agents or send quick questions here.";
    return {
      text: isEn ? textEn : textId,
      language: isEn ? 'en' : 'id',
      alternatives: {
        english: textEn,
        indonesian: textId
      },
      source: { type: 'system', id: 'live_cs_context' },
      confidence: 1.0,
      emotion: 'friendly'
    };
  }

  // ===== NEW: LIVE CS DETECTION (High Priority) =====
  // Deteksi jika user ingin bantuan manusia berdasarkan intent atau kata kunci
  const isAskingForCS = (intent && (intent.intent === 'live_cs' || intent.type === 'live_cs')) || 
                        /\b(cs|agen|agent|admin|manusia|human|live support|bantuan langsung|diskusi)\b/i.test(text);
  
  // Perbaikan loop: Jika input adalah 'Hubungi Agen' (berasal dari klik tombol/saran), 
  // berikan respon yang lebih definitif bukannya mengulang saran yang sama.
  if (text === 'hubungi agen' || text === 'hubungi cs' || text === 'contact agent' || text === 'contact cs') {
    const isEn = activeLang === 'en';
    const textId = `🎧 **Menghubungkan ke Live CS**\n\nSilakan klik tombol **"Hubungi Agen Sekarang"** di atas untuk diarahkan ke Room Diskusi kami.\n\nJika tombol tidak muncul, Anda bisa langsung mengakses menu **Room Diskusi** dari halaman utama.`;
    const textEn = `🎧 **Connecting to Live CS**\n\nPlease click the **"Connect to Agent Now"** button above to be redirected to our Discussion Room.\n\nIf the button doesn't appear, you can access the **Discussion Room** directly from the main navigation.`;
    return {
      text: isEn ? textEn : textId,
      language: isEn ? 'en' : 'id',
      alternatives: {
        english: textEn,
        indonesian: textId
      },
      source: { type: 'system', id: 'live_cs_direct' },
      confidence: 1.0,
      action: 'suggest_live_cs' // Pastikan tombol tetap muncul
    };
  }

  if (isAskingForCS) {
    const isEn = activeLang === 'en';
    const textId = `🎧 **Pusat Bantuan & Live CS**\n\nSaya mengerti Anda ingin bantuan lebih lanjut. Anda dapat menghubungi agen manusia melalui **Room Diskusi** kami.\n\nKlik tombol di bawah untuk bergabung ke diskusi atau beralih ke mode bantuan langsung.`;
    const textEn = `🎧 **Help Center & Live CS**\n\nI understand you'd like more in-depth human assistance. You can reach out to our team in the **Discussion Room**.\n\nClick below to join the discussion or switch to live agent support.`;
    return {
      text: isEn ? textEn : textId,
      language: isEn ? 'en' : 'id',
      alternatives: {
        english: textEn,
        indonesian: textId
      },
      source: { type: 'system', id: 'live_cs_referral' },
      confidence: 1.0,
      suggestedTopics: isEn ? ['Contact Agent', 'Security Guide', 'Back to Bot'] : ['Hubungi Agen', 'Panduan Keamanan', 'Kembali ke Bot'],
      action: 'suggest_live_cs'
    };
  }

  // ===== NEW: GREETING & SIMPLE PATTERN RECOGNITION =====
  // Check for greetings dan simple interactions sebelum advanced processing
  const greetingResponse = recognizeGreeting(msg, updatedProfile, { targetLanguage: activeLang, language: langSetting });
  if (greetingResponse) {
    let greetText = greetingResponse.text;
    if (queryDynamics.isRepeat && queryDynamics.repeatCount === 1 && !greetingResponse.isComplaint) {
      greetText = activeLang === 'en'
        ? 'Hello again! Still right here 😄 Would you like to continue our discussion or explore something new?'
        : `Halo lagi! Masih standby di sini nih 😄 Ada yang ingin kita lanjut bahas atau mau eksplor topik baru?`;
    }
    const altLang = activeLang === 'en' ? 'indonesian' : 'english';
    const altText = greetingResponse.alternatives?.[altLang] || (activeLang === 'en' ? greetText : translateToEnglish(greetText));
    return {
      ...greetingResponse,
      text: greetText,
      language: greetingResponse.language || activeLang,
      alternatives: isBilingualRequested || activeLang === 'en' ? {
        english: activeLang === 'en' ? greetText : altText,
        indonesian: activeLang === 'id' ? greetText : (greetingResponse.alternatives?.indonesian || greetText)
      } : (greetingResponse.alternatives || {}),
      emotion: emotionData.primary,
      character: characterData.character
    };
  }

  // ===== NEW: CHECK IF ASKING ABOUT SAIPULAI =====
  if (isSaipulAIReference(msg)) {
    const aiResponse = generateSaipulAIResponse(msg);
    if (aiResponse) {
      let aiText = aiResponse.text;
      if (activeLang === 'en') {
        aiText = "✨ I'm SaipulAI - your personal intelligent assistant! I'm here to help you learn, analyze, and explore projects and technology. Pleasure to meet you! 😊";
      }
      return {
        ...aiResponse,
        text: aiText,
        language: activeLang,
        alternatives: isBilingualRequested ? {
          english: activeLang === 'en' ? aiText : translateToEnglish(aiResponse.text),
          indonesian: aiResponse.text
        } : {},
        emotion: emotionData.primary,
        character: characterData.character
      };
    }
  }

  // ===== NEW: NLU PROCESSING WITH NLP COMPONENTS =====
  // Gunakan NLU untuk enrichment response generation
  let nluAnalysis = null;
  try {
    // Use quick NLU untuk performance
    nluAnalysis = quickNLU(msg);
    
    // Simpan analysis untuk debugging/logging
    if (settings && settings.debugMode) {
      console.log('NLU Analysis:', nluAnalysis);
    }
  } catch (e) {
    console.warn('NLU Processing error:', e);
    nluAnalysis = null;
  }

  // ===== NEW: TRY ENHANCED KNOWLEDGE BASE FIRST =====
  // Prioritaskan answer dari enhanced knowledge base sebelum fallback ke basic KB
  if (nluAnalysis) {
    // safe access to NLU intent (structure may vary)
    let nluIntent = null;
    try {
      nluIntent = (nluAnalysis.components && nluAnalysis.components.nlu && nluAnalysis.components.nlu.intent && nluAnalysis.components.nlu.intent.intent) || nluAnalysis.intent || null;
    } catch { nluIntent = null; }

    // Jika user bertanya (ask_question atau request_information)
    if (nluIntent === 'ask_question' || nluIntent === 'request_information') {
      try {
        // Pass a safe nlu payload (avoid undefined access in enhanced KB)
        const safeNlu = (nluAnalysis.components && nluAnalysis.components.nlu) ? nluAnalysis.components.nlu : (nluAnalysis || {});
        const enhancedAnswer = generateEnhancedAnswer(msg, safeNlu);

        if (enhancedAnswer && enhancedAnswer.success && (enhancedAnswer.confidence || 0) > 0.6) {
          const rawAnswer = (settings && settings.enforceOriginalResponses !== false)
            ? paraphraseContent(enhancedAnswer.answer, enhancedAnswer.relatedNodes || [], settings)
            : enhancedAnswer.answer;
          const isEn = activeLang === 'en';
          const englishText = translateToEnglish(rawAnswer);
          const indonesianText = rawAnswer;
          const primaryText = isEn ? englishText : indonesianText;
          return {
            text: primaryText,
            language: activeLang,
            alternatives: {
              english: englishText,
              indonesian: indonesianText
            },
            source: enhancedAnswer.source,
            confidence: enhancedAnswer.confidence,
            relatedConcepts: enhancedAnswer.relatedNodes ? enhancedAnswer.relatedNodes.map(n => n.name) : []
          };
        }
      } catch (e) {
        console.warn('Enhanced KB error:', e);
        // Fallback ke basic KB jika ada error
      }
    }
  }

  // helper: apply response style
  function applyStyle(raw, style) {
    if (!raw) return raw;
    switch ((style || '').toLowerCase()) {
      case 'concise':
        return raw.split('\n')[0];
      case 'formal':
        return `Dengan hormat,\n\n${raw}\n\nHormat saya, SaipulAI`;
      case 'friendly':
        return `Hai! 😊 ${raw}`;
      case 'technical':
        return `Technical summary:\n${raw}\n\n(Referensi: internal models & KB)`;
      case 'humorous':
        return `${raw} 😂 (Semoga ini membantu!)`;
      case 'terse':
        return raw.split('.').slice(0,1).join('.') + '.';
      case 'elaborate':
        return `${raw}\n\nPenjelasan rinci:\n- Point 1\n- Point 2\n- Rekomendasi`;
      case 'poetic':
        return `Dalam kata yang lembut: ${raw}`;
      case 'empathetic':
        return `Saya mengerti. ${raw}`;
      case 'step-by-step':
        return `${raw}\n\nLangkah-langkah:\n1) Analisa input\n2) Proses\n3) Output`;
      default:
        return raw;
    }
  }

  // small timezone map for common countries/cities
  const timezoneMap = {
    indonesia: 'Asia/Jakarta',
    jakarta: 'Asia/Jakarta',
    bali: 'Asia/Makassar',
    jepang: 'Asia/Tokyo',
    japan: 'Asia/Tokyo',
    usa: 'America/New_York',
    'united states': 'America/New_York',
    britain: 'Europe/London',
    uk: 'Europe/London',
    germany: 'Europe/Berlin',
    india: 'Asia/Kolkata',
    australia: 'Australia/Sydney',
    china: 'Asia/Shanghai',
    brazil: 'America/Sao_Paulo'
  };

  function formatNowForTimezone(tz) {
    try {
      const now = new Date();
      const opts = { timeZone: tz, hour12: false, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Intl.DateTimeFormat('en-US', opts).format(now);
    } catch { return null; }
  }

  // lightweight NER: detect basic name/location/datetime and persist to profile
  try {
    const ner = simpleNER(msg);
    const profileRaw = JSON.parse(localStorage.getItem('saipul_profile') || '{}');
    let wrote = false;
    if (ner.names && ner.names.length > 0) {
      profileRaw.name = profileRaw.name || ner.names[0];
      wrote = true;
    }
    if (ner.locations && ner.locations.length > 0) {
      profileRaw.location = profileRaw.location || ner.locations[0];
      wrote = true;
    }
    if (ner.datetimes && ner.datetimes.length > 0) {
      profileRaw.lastMentionedDate = ner.datetimes[0];
      wrote = true;
    }
    if (wrote) {
      try { localStorage.setItem('saipul_profile', JSON.stringify(profileRaw)); } catch { /* ignore */ }
      if (ner.names && ner.names.length > 0) return { text: `Senang bertemu, ${profileRaw.name}! Saya akan mengingat nama Anda untuk percakapan ini.`, source: { type: 'system', id: 'save_name' }, confidence: 0.9 };
      if (ner.locations && ner.locations.length > 0) return { text: `Baik, saya mencatat bahwa Anda dari ${profileRaw.location}. Senang berkenalan!`, source: { type: 'system', id: 'save_location' }, confidence: 0.9 };
    }
  } catch (e) {
    console.warn('NER and profile storage failed:', e);
  }

  // time queries: "waktu di <place>" or "what time in <place>"
  const timeMatch = msg.match(/waktu(?: sekarang)?(?: di| in)\s+([A-Za-z\s-]+)/i) || msg.match(/what time(?: is it)? in\s+([A-Za-z\s-]+)/i);
  if (timeMatch) {
    const loc = timeMatch[1].trim().toLowerCase();
    // prefer user's saved timezone if location matches profile
    const profileRaw = JSON.parse(localStorage.getItem('saipul_profile') || '{}');
    const gmtMatch = loc.match(/^gmt([+-]?\d+)/i);
    let tz = profileRaw.timezone || timezoneMap[loc] || (gmtMatch ? `Etc/GMT${gmtMatch[1].startsWith('-') ? gmtMatch[1] : `+${gmtMatch[1]}`}` : null);
    const formatted = tz ? formatNowForTimezone(tz) : formatNowForTimezone('UTC');
    const tzLabel = tz || 'UTC';
    return { text: `Waktu saat ini di ${loc} (${tzLabel}): ${formatted}`, source: { type: 'time' }, confidence: 0.95 };
  }

  if (text.includes('upload') || text === 'upload_file') {
    return {
      text: (cautionNote ? `${cautionNote}\n\n` : '') + `📁 **Upload File**\n\nAnda dapat mengupload berbagai jenis file:\n\n• 📄 **Dokumen**: PDF, DOC, DOCX, TXT\n• 📊 **Spreadsheet**: XLS, XLSX, CSV\n• 🖼️ **Gambar**: JPG, PNG, JPEG\n• 📝 **Lainnya**: JSON, MD\n\n**Fitur**:\n• Ekstraksi teks otomatis\n• Pencarian konten\n• Integrasi knowledge base\n• Metadata tracking\n\nKlik tombol upload (📎) untuk memulai!`,
      source: { type: 'system', id: 'upload_help' },
      confidence: 0.8
    };
  }

  // CHECK MATH INTENT FIRST - Periksa apakah user benar-benar ingin hitung matematika
  // Don't treat every input with numbers as math!
  const hasClearMathIntent = /\b(hitung|calculate|berapa|hasil|kalkulator|math|solve|^=)\b|[\d]\s*[+\-*/^]\s*[\d]|(?:integral|turunan|derivative|sqrt|sin|cos|tan|log|abs)/i.test(text);
  
  // Only try math if there's clear math intent
  // helper: convert small number-words to digits and word-operators to symbols
  function wordsToMathExpression(input) {
    if (!input || typeof input !== 'string') return '';
    let s = input.toLowerCase();

    // normalize common connectors
    s = s.replace(/[,?.!]/g, ' ');

    const replacements = [
      // operators (id -> symbol)
      [/\btambah\b|\bplus\b|\bditambah\b/g, '+'],
      [/\bminus\b|\bkurang\b|\bdikurang\b/g, '-'],
      [/\b(x|×|kali|perkali)\b/g, '*'],
      [/\bdibagi\b|\bper\b|\bdivide\b|\bdivided by\b/g, '/'],
      [/\bmod\b/g, '%'],
      // english operators
      [/\badd\b/g, '+'], [/\bsubstract\b|\bsubtract\b/g, '-']
    ];

    for (const [pat, rep] of replacements) s = s.replace(pat, ` ${rep} `);

    // small number map (id + en)
    const numMap = {
      nol: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, delapan: 8, sembilan: 9,
      sepuluh: 10, sebelas: 11,
      "dua belas": 12, "dua puluh": 20,
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12
    };

    // replace long tokens first
    const keys = Object.keys(numMap).sort((a, b) => b.length - a.length);
    for (const k of keys) {
      const re = new RegExp(`\\b${k}\\b`, 'g');
      s = s.replace(re, ` ${numMap[k]} `);
    }

    // collapse multiple spaces
    s = s.replace(/\s+/g, ' ').trim();

    // only keep digits, operators and parentheses
    const cleaned = s.replace(/[^0-9+\-*/^().% ]/g, '');
    // ensure there's at least one operator
    if (!/\d+\s*[+\-*/^%]\s*\d+/.test(cleaned)) return '';
    return cleaned;
  }

  if (hasClearMathIntent) {
    let mathResult = null;
    try { mathResult = calculateMath(text, settings.calculationPrecision); } catch { mathResult = null; }

    // If calculation failed (e.g. user wrote "1+1 berapa" or "dua tambah tiga"), try extra strategies
    if (!mathResult) {
      try {
        // 1) Extract numeric expression directly from digits/operators
        const numericExprMatch = text.match(/[-+()]?\d+(?:[.,]\d+)?(?:\s*[+\-*/^%]\s*[-+()]?\d+(?:[.,]\d+)?)+/i);
        if (numericExprMatch && numericExprMatch[0]) {
          const extracted = numericExprMatch[0].replace(/\s+/g, '').replace(/,/g, '.');
          try { mathResult = calculateMath(extracted, settings.calculationPrecision); } catch { mathResult = null; }
        }
      } catch { /* ignore extraction errors */ }

      // 2) Try converting words to numbers/operators (e.g., "dua tambah tiga")
      if (!mathResult) {
        try {
          const wordExpr = wordsToMathExpression(text);
          if (wordExpr) {
            try { mathResult = calculateMath(wordExpr, settings.calculationPrecision); } catch { mathResult = null; }
          }
        } catch { /* ignore */ }
      }
    }

    if (mathResult) return { text: mathResult, source: { type: 'calculator' }, confidence: 0.99 };
  }

  const conversionResult = handleConversion(text);
  if (conversionResult) return { text: conversionResult, source: { type: 'conversion' }, confidence: 0.98 };

  if (text.includes('prediksi') || text.includes('forecast')) {
    if (text.includes('harga') || text.includes('saham') || text.includes('crypto') || text.includes('kripto') || text.includes('emas')) {
      return { text: generatePrediction('harga', text, safeKnowledgeBase), source: { type: 'prediction', id: 'harga' }, confidence: 0.85 };
    }
    if (text.includes('cuaca') || text.includes('weather') || text.includes('hujan') || text.includes('suhu')) {
      return { text: generatePrediction('cuaca', text, safeKnowledgeBase), source: { type: 'prediction', id: 'cuaca' }, confidence: 0.85 };
    }
    if (text.includes('penjualan') || text.includes('sales') || text.includes('omset') || text.includes('omzet') || text.includes('revenue')) {
      return { text: generatePrediction('penjualan', text, safeKnowledgeBase), source: { type: 'prediction', id: 'penjualan' }, confidence: 0.85 };
    }
    const generalPrediction = generatePrediction('umum', text, safeKnowledgeBase);
    if (generalPrediction) {
      return { text: (cautionNote ? `${cautionNote}\n\n` : '') + generalPrediction, source: { type: 'prediction', id: 'umum' }, confidence: 0.8 };
    }
  }

  const analysisResult = analyzeData(text, safeKnowledgeBase);
  if (analysisResult) return { text: (cautionNote ? `${cautionNote}\n\n` : '') + analysisResult, source: { type: 'analysis' }, confidence: 0.9 };

  const statsResult = calculateStatistics(text, safeKnowledgeBase);
  if (statsResult) return { text: (cautionNote ? `${cautionNote}\n\n` : '') + statsResult, source: { type: 'statistics' }, confidence: 0.95 };

  const knowledgeResponse = getKnowledgeResponse(text, safeKnowledgeBase, { ...settings, targetLanguage: activeLang, language: langSetting });
  if (knowledgeResponse) {
    // Record successful KB query
    const sourceType = knowledgeResponse.source?.type || 'unknown';
    kbMonitor.recordQuery(text, sourceType.replace('kb_', ''), true);
    
    // apply style preference: settings -> profile preference -> random
    if (knowledgeResponse && typeof knowledgeResponse.text === 'string' && settings.responseStyle) {
      try { 
        knowledgeResponse.text = applyStyle(knowledgeResponse.text, settings.responseStyle); 
      } catch (e) { 
        console.warn('Failed to apply response style:', e);
      }
    }

    if (queryDynamics.isRepeat && queryDynamics.repeatCount === 1) {
      knowledgeResponse.text = activeLang === 'en'
        ? `💡 *You seem to be asking something similar. Let me clarify from another angle:*\n\n${knowledgeResponse.text}`
        : `💡 *Sepertinya kamu menanyakan hal yang sama ya. Biar makin jelas dari sudut pandang lain:*\n\n${paraphraseContent(knowledgeResponse.text, [], settings)}`;
    } else if (queryDynamics.suggestedBridge && !knowledgeResponse.text.startsWith('Menyambung') && !knowledgeResponse.text.startsWith('Beralih')) {
      knowledgeResponse.text = `${queryDynamics.suggestedBridge}\n\n${knowledgeResponse.text}`;
    }

    const kbLang = knowledgeResponse.language || activeLang;
    const kbText = knowledgeResponse.text;
    const englishAlt = kbLang === 'en' ? kbText : (knowledgeResponse.alternatives?.english || translateToEnglish(kbText));
    const indonesianAlt = kbLang === 'id' ? kbText : (knowledgeResponse.alternatives?.indonesian || translateToIndonesian(kbText));

    return {
      ...knowledgeResponse,
      language: kbLang,
      alternatives: {
        english: englishAlt,
        indonesian: indonesianAlt
      }
    };
  }

  // Record failed KB query
  kbMonitor.recordQuery(text, 'none', false);

  if ((text.includes('data') && text.includes('tersedia')) || text.includes('knowledge base') || text.includes('info data')) {
    const stats = knowledgeStats || {};
    let responseText = `📚 **Knowledge Base SaipulAI v${CHATBOT_VERSION}**\n\n`;

    if (stats.aiConcepts > 0) responseText += `• 🤖 **AI Concepts**: ${stats.aiConcepts} konsep\n`;
    if (stats.hobbies > 0) responseText += `• 🎯 **Hobbies**: ${stats.hobbies} aktivitas\n`;
    if (stats.certificates > 0) responseText += `• 🏆 **Certificates**: ${stats.certificates} sertifikat\n`;
    if (stats.softskills > 0) responseText += `• 🌟 **Soft Skills**: ${stats.softskills} kemampuan\n`;
    if (stats.uploadedFiles > 0) responseText += `• 📁 **Uploaded Files**: ${stats.uploadedFiles} file\n`;

    responseText += `\n**Total**: ${stats.totalItems || 0} item dari ${stats.totalCategories || 0} kategori\n\n`;
    responseText += `💡 **Tips**: Gunakan fitur upload file untuk menambah knowledge base, atau tanyakan tentang topik spesifik!`;
    return { text: (cautionNote ? `${cautionNote}\n\n` : '') + responseText, source: { type: 'system', id: 'kb_summary' }, confidence: 0.7 };
  }

  if (text.includes('file') || text.includes('upload') || text.includes('dokumen')) {
    const fileCount = safeKnowledgeBase.uploadedData.length;
      if (fileCount === 0) {
        return { text: (cautionNote ? `${cautionNote}\n\n` : '') + `📁 **Manajemen File**\n\nBelum ada file yang diupload. Anda dapat mengupload berbagai jenis file untuk ditambahkan ke knowledge base:\n\n• 📄 Dokumen teks\n• 📊 Spreadsheet\n• 🖼️ Gambar\n• 📝 File lainnya\n\nKlik tombol upload (📎) untuk memulai!`, source: { type: 'system', id: 'file_help' }, confidence: 0.7 };
      } else {
      const recentFiles = safeKnowledgeBase.fileMetadata.slice(-3);
      let fileList = recentFiles.map(file => 
        `• ${getFileIcon(file.extension)} ${file.fileName} (${(file.fileSize / 1024).toFixed(1)}KB)`
      ).join('\n');
      
       return { text: (cautionNote ? `${cautionNote}\n\n` : '') + `📁 **Manajemen File**\n\n**Total file**: ${fileCount}\n**File terbaru**:\n${fileList}\n\n💡 File-file ini telah terintegrasi dengan knowledge base dan dapat dicari menggunakan fitur pencarian.`, source: { type: 'system', id: 'file_list' }, confidence: 0.85 };
    }
  }

  if (text.includes('halo') || text.includes('hai') || text.includes('hi') || text.includes('hello')) {
    const isEn = activeLang === 'en';
    const textId = `Hai juga! 👋 Aku SaipulAI v${CHATBOT_VERSION} Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Scientific Computing\n• 📊 **Multi-format File Processing** (PDF, DOCX, XLSX, Images)\n• 🤖 **Dynamic Knowledge Base** Integration\n• 🎯 **Context-Aware Intelligent Responses**\n• 📁 **Advanced File Management** & Metadata\n• 🔍 **Smart Search** Across All Data Sources\n\n💡 **Tips**: Coba upload file atau tanyakan tentang topik spesifik!`;
    const textEn = `Hello there! 👋 I'm SaipulAI v${CHATBOT_VERSION} Enhanced with capabilities:\n\n• 🧮 **Advanced Mathematics** & Scientific Computing\n• 📊 **Multi-format File Processing** (PDF, DOCX, XLSX, Images)\n• 🤖 **Dynamic Knowledge Base** Integration\n• 🎯 **Context-Aware Intelligent Responses**\n• 📁 **Advanced File Management** & Metadata\n• 🔍 **Smart Search** Across All Data Sources\n\n💡 **Tip**: Try uploading files or asking about projects and technical topics!`;
    return { 
      text: (cautionNote ? `${cautionNote}\n\n` : '') + (isEn ? textEn : textId), 
      language: isEn ? 'en' : 'id',
      alternatives: {
        english: textEn,
        indonesian: textId
      },
      source: { type: 'system', id: 'greeting' }, 
      confidence: 0.7 
    };
  }

  if (text.includes('terima kasih') || text.includes('thanks') || text.includes('thank you')) {
    const isEn = activeLang === 'en';
    const textId = "Sama-sama! 😊 Senang bisa membantu analisis dan pencarian informasimu. Jika ada yang lain, jangan ragu untuk bertanya!";
    const textEn = "You're very welcome! 😊 Glad to assist with your analysis and questions. If you need anything else, feel free to ask!";
    return { 
      text: (typeof cautionNote !== 'undefined' ? `${cautionNote}\n\n` : '') + (isEn ? textEn : textId), 
      language: isEn ? 'en' : 'id',
      alternatives: {
        english: textEn,
        indonesian: textId
      },
      source: { type: 'system', id: 'thanks' }, 
      confidence: 0.7 
    };
  }

  if (text.includes('versi') || text.includes('version')) {
    // Integrasi info dari data.json dan riwayat.json
    const versi = aiDocData?.header_information?.version || CHATBOT_VERSION;
    const lastUpdate = aiDocData?.header_information?.last_update || '-';
    
    // Stats mapping
    const stats = aiDocData?.statistik_versi_saat_ini || {};
    const totalFitur = stats.total_fitur || '-';
    const totalVersi = stats.total_versi_dokumentasi || '-';
    const releaseRange = stats.rentang_waktu || '-';
    const rataRataRelease = stats.rata_rata_release || '-';
    const bundleSize = stats.ukuran_bundle || '-';
    const responseTime = stats.waktu_respons || '-';
    
    // Changelog mapping - ambil 3 entri terakhir jika ada
    const changelogEntries = (aiDocData?.change_log_sesi_terakhir || []).slice(0, 3);
    const changelogText = changelogEntries.length > 0 
      ? changelogEntries.map(c => `• **${c.date}**: ${c.description}`).join('\n')
      : '-';
      
    // Riwayat mapping - ambil ringkasan dari riwayatData
    const riwayatSummary = riwayatData?.version_history_detail?.[0]?.summary || '-';
    const riwayatFull = riwayatData?.version_history_detail?.[0]?.highlights 
      ? `\n**Highlights Riwayat:**\n${riwayatData.version_history_detail[0].highlights.map(h => `• ${h}`).join('\n')}`
      : '';

    return {
      text:
        (cautionNote ? `${cautionNote}\n\n` : '') +
        `🤖 **SaipulAI v${versi} (Terbaru)**\n` +
        `• **Update terakhir**: ${lastUpdate}\n` +
        `• **Total fitur**: ${totalFitur}\n` +
        `• **Total versi dokumen**: ${totalVersi}\n` +
        `• **Rata-rata rilis**: ${rataRataRelease}\n` +
        `• **Rentang rilis**: ${releaseRange}\n` +
        `• **Ukuran bundle**: ${bundleSize}\n` +
        `• **Waktu respons**: ${responseTime}\n` +
        `\n**Changelog Terbaru:**\n${changelogText}\n` +
        `\n**Ringkasan Pengembangan:**\n${riwayatSummary}${riwayatFull}\n` +
        `\n**Konfigurasi Aktif:**\n• Model: ${String(settings.aiModel || 'Expert').toUpperCase()}\n• Presisi: ${settings.calculationPrecision}\n• Memori Konteks: ${settings.memoryContext ? 'Aktif' : 'Nonaktif'}\n• Lang-Support: ${Array.isArray(stats.bahasa_didukung) ? stats.bahasa_didukung.join(', ') : 'Indonesia, English'}\n• Data Sources: ${knowledgeStats && knowledgeStats.totalCategories ? knowledgeStats.totalCategories : 0} kategori\n• Live Analytics: ${settings.enableAnalytics ? 'Aktif' : 'Nonaktif'}`,
      source: { type: 'system', id: 'version' },
      confidence: 1.0
    };
  }

  if ((text.includes('hapus') || text.includes('clear')) && text.includes('chat')) {
     return { text: "🗑️ **Riwayat percakapan telah dibersihkan**\nSekarang kita mulai fresh! Ada yang bisa kubantu analisis, hitung, atau proses hari ini?", source: { type: 'system', id: 'clear' }, confidence: 0.7 };
  }

  if (text.includes('fitur') || text.includes('bisa apa') || text.includes('help') || text.includes('bantuan')) {
    // Check if specifically asking for human/CS
    const isAskingForHuman = /\b(agen|agent|human|manusia|admin|cs|live)\b/i.test(text) || text.includes('hubungi');
    
    if (isAskingForHuman) {
      return {
        text: `🎧 **Pusat Bantuan & Live CS**\n\nAnda dapat menghubungi agen manusia melalui **Room Diskusi** kami. Agen kami tersedia Senin–Jumat pukul 09:00–17:00.`,
        source: { type: 'system', id: 'live_cs_referral' },
        confidence: 1.0,
        suggestedTopics: ['Hubungi Agen', 'Panduan Keamanan', 'Kembali ke Bot'],
        action: 'suggest_live_cs'
      };
    }

    // Integrasi fitur utama dari data.json
    const fiturUtama = aiDocData?.fitur_utama?.map((f, i) => `${i + 1}. ${f}`).join('\n') || '-';
    
    // Integrasi komponen AI/NLP
    const coreNLP = (aiDocData?.ai_nlp_ringkasan?.komponen_inti || []).map(m => `• ${m}`).join('\n');
    const advancedNLP = (aiDocData?.ai_nlp_ringkasan?.modul_lanjutan || []).map(m => `• ${m}`).join('\n');
    
    return {
      text: `🤖 **Fitur Utama SaipulAI v${CHATBOT_VERSION}**\n\n${fiturUtama}\n\n🧠 **Teknologi NLP & AI Core:**\n${coreNLP}\n\n🚀 **Modul Lanjutan:**\n${advancedNLP}\n\n💡 **Tips**: Untuk detail teknis, ketik 'versi' atau klik ikon bantuan di pojok menu.`,
      source: { type: 'system', id: 'features' },
      confidence: 1.0
    };
  }

  // --- Retrieval-Augmented Generation (RAG) helpers ---
  function normalizeText(s) {
    return (s || '').toString().replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function jaccardScore(a, b) {
    const A = new Set((a || '').split(/\W+/).filter(Boolean));
    const B = new Set((b || '').split(/\W+/).filter(Boolean));
    if (A.size === 0 || B.size === 0) return 0;
    const inter = [...A].filter(x => B.has(x)).length;
    const uni = new Set([...A, ...B]).size;
    return uni === 0 ? 0 : inter / uni;
  }

  function retrieveCandidates(query, kb) {
    const q = normalizeText(query);
    const candidates = [];

    try {
      // Search in uploadedData (assumed to contain text fragments)
      if (Array.isArray(kb.uploadedData)) {
        for (const item of kb.uploadedData) {
          const text = normalizeText(item.text || item.content || item.plainText || item.extractedText || '');
          const score = jaccardScore(q, text) + (item.relevanceBoost || 0);
          if (score > 0) candidates.push({ source: item.source || item.fileName || 'uploaded', id: item.id || item.fileId || null, snippet: (item.preview || item.extractedText || item.text || '').toString().slice(0, 1000), score, meta: item });
        }
      }

      // Search in other structured KB areas (cards, certificates, hobbies, ai concepts)
      const areas = ['cards', 'certificates', 'hobbies', 'ai', 'interests', 'profile', 'softskills'];
      for (const a of areas) {
        if (!kb[a]) continue;
        const arr = Array.isArray(kb[a]) ? kb[a] : (typeof kb[a] === 'object' ? [kb[a]] : []);
        for (const it of arr) {
          const text = normalizeText(it.title || it.name || it.description || it.summary || it.content || JSON.stringify(it));
          const score = jaccardScore(q, text);
          if (score > 0) candidates.push({ source: a, id: it.id || null, snippet: (it.summary || it.description || it.title || '').toString().slice(0, 800), score, meta: it });
        }
      }

      // De-dupe by source+id or snippet prefix
      const seen = new Map();
      const dedup = [];
      candidates.sort((x, y) => y.score - x.score);
      for (const c of candidates) {
        const key = `${c.source}::${c.id || c.snippet.slice(0,40)}`;
        if (seen.has(key)) continue;
        seen.set(key, true);
        dedup.push(c);
      }
      return dedup.slice(0, 6);
    } catch {
      return [];
    }
  }

  function synthesizeAnswers(query, candidates) {
    // Per-source short answers
    const perSource = candidates.map(c => {
      const txt = c.snippet || (c.meta && (c.meta.summary || c.meta.extractedText)) || '';
      // simple template: state finding + short quote + citation
      const quote = txt.split('\n').map(l => l.trim()).filter(Boolean).slice(0,3).join(' ');
      return { source: c.source, id: c.id, answer: `${quote}${quote ? '\n' : ''}— Sumber: ${c.source}${c.id ? ` (${c.id})` : ''}` };
    });

    // Merge answers: prefer unique sentences and add citations
    const allText = perSource.map(p => p.answer).join('\n');
    const sentences = allText.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
    const unique = [];
    const seenS = new Set();
    for (const s of sentences) {
      const key = s.toLowerCase().replace(/[^a-z0-9\s]/g, '').slice(0, 120);
      if (!seenS.has(key)) { seenS.add(key); unique.push(s); }
      if (unique.length >= 6) break;
    }

    const merged = unique.join('\n');
    const sources = candidates.map(c => ({ source: c.source, id: c.id }));
    const confidence = Math.max(0.45, Math.min(0.95, candidates[0] ? (0.3 + candidates[0].score) : 0.45));

    // final template with brief note and citations
    const final = `${merged}\n\nSumber referensi: ${sources.map(s => `${s.source}${s.id ? ` (${s.id})` : ''}`).join(', ')}`;
    return { text: final, perSource, sources, confidence };
  }

  // ===== NEW: TRY DATA INTEGRATION FROM JSON FILES =====
  try {
    const dataIntegrationAnswer = generateComprehensiveAnswer(msg, safeKnowledgeBase || {});
    if (dataIntegrationAnswer && dataIntegrationAnswer.trim().length > 20) {
      // Wrap response dengan emotion & character
      let base = (cautionNote ? `${cautionNote}\n\n` : '') + dataIntegrationAnswer;
      if (queryDynamics.isRepeat && queryDynamics.repeatCount === 1) {
        base = `💡 *Sepertinya kamu menanyakan hal yang sama ya. Biar makin jelas dari sudut pandang lain:*\n\n` + base;
      } else if (queryDynamics.suggestedBridge && !base.startsWith('Menyambung') && !base.startsWith('Beralih')) {
        base = `${queryDynamics.suggestedBridge}\n\n${base}`;
      }
      const paraphrased = (settings && settings.enforceOriginalResponses !== false) ? paraphraseContent(base, [], settings) : base;
      const emotionallyAdjustedResponse = wrapResponseWithEmotion(
        paraphrased,
        emotionData,
        characterData,
        settings
      );
      return {
        text: emotionallyAdjustedResponse,
        source: { type: 'data_integration', category: 'knowledge_base' },
        confidence: 0.85,
        emotion: emotionData.primary,
        character: characterData.character
      };
    }
  } catch (e) {
    console.error('Data integration internal error:', e);
  }

  // Try RAG: retrieve docs and synthesize, used as a non-invasive enhancement before fallback
  try {
    const ragCandidates = retrieveCandidates(msg, safeKnowledgeBase || {});
    if (Array.isArray(ragCandidates) && ragCandidates.length > 0) {
      const ragAnswer = synthesizeAnswers(msg, ragCandidates, { style: settings.responseStyle });
      // Only promote RAG response when confidence looks reasonable
      if (ragAnswer && ragAnswer.confidence >= 0.5) {
        const factCheck = checkClaimAgainstKB(ragAnswer.text, safeKnowledgeBase || {}, {
          threshold: 0.25,
          sourceBoosts: { uploadedData: 1.5, AI: 1.2 }
        });
        const calibratedConf = factCheck.verified ? Math.min(0.95, Math.max(ragAnswer.confidence, factCheck.confidence)) : ragAnswer.confidence;
        const base = (cautionNote ? `${cautionNote}\n\n` : '') + ragAnswer.text;
        const paraphrased = (settings && settings.enforceOriginalResponses !== false) ? paraphraseContent(base, ragCandidates, settings) : base;
        return { text: paraphrased, source: { type: 'rag', sources: ragAnswer.sources, factChecked: factCheck.verified }, confidence: calibratedConf };
      }
    }
  } catch (e) {
    console.warn('RAG processing internal error:', e);
  }

  // If reports indicate repeated or high-severity complaints about similar content,
  // prefer to escalate / withhold detailed instructions and provide safe next steps.
  try {
    if (reportInfluence && reportInfluence.found && (reportInfluence.count >= 3 || reportInfluence.highestSeverity === 'high')) {
      const riskyCats = ['privacy', 'pii', 'abusive', 'spam', 'penipuan', 'eksploitasi'];
      const flagged = reportInfluence.categories.map(c => String(c || '').toLowerCase());
      const intersects = flagged.filter(f => riskyCats.includes(f));
      if (intersects.length > 0) {
        const reason = intersects.join(', ');
        return {
          text: `${cautionNote}\n\nUntuk melindungi privasi dan keamanan, saya tidak akan memberikan detail lebih lanjut tentang konten yang dilaporkan (${reason}). Jika Anda memerlukan bantuan resmi, silakan hubungi tim dukungan atau moderator.`,
          source: { type: 'reported', categories: intersects },
          confidence: 0.6
        };
      }
    }
  } catch { /* ignore */ }

  // Use Intelligent Smart Fallback instead of static messages
  const smartFallback = generateSmartFallback(msg, 0.35, conversationContext);
  let rawFallbackText = smartFallback.text;
  if (queryDynamics.suggestedBridge && !rawFallbackText.startsWith('Menyambung') && !rawFallbackText.startsWith('Beralih')) {
    rawFallbackText = `${queryDynamics.suggestedBridge}${rawFallbackText}`;
  } else if (queryDynamics.isRepeat && queryDynamics.repeatCount === 1) {
    rawFallbackText = `💡 *Kamu menanyakan hal serupa lagi. Biar lebih jelas:*\n\n${rawFallbackText}`;
  }
  const styledResponse = applyStyle(rawFallbackText, settings.responseStyle || 'neutral');
  
  // ===== NEW: WRAP FALLBACK RESPONSE WITH EMOTION & CHARACTER =====
  const finalResponse = wrapResponseWithEmotion(
    styledResponse,
    emotionData,
    characterData,
    settings
  );

  let finalResult;
  if (activeLang === 'en') {
    const enFallbackText = "I'm not completely certain I have the exact information for that in my portfolio knowledge base yet.\n\nHere are some topics you can explore:\n• Syaiful's **featured web projects** and live demos (`/projects`)\n• His **work experience**, **skills**, and **official certifications**\n• Complex mathematical calculations, or upload documents and images for analysis!";
    const styledEn = applyStyle(enFallbackText, settings.responseStyle || 'neutral');
    const finalEn = wrapResponseWithEmotion(styledEn, emotionData, characterData, settings);
    finalResult = {
      text: finalEn,
      language: 'en',
      source: { type: 'smart_fallback_en' },
      confidence: 0.5,
      emotion: emotionData.primary,
      character: characterData.character,
      suggestedTopics: ['Projects', 'Skills', 'Experience', 'Math', 'Upload File'],
      alternatives: {
        english: finalEn,
        indonesian: finalResponse
      }
    };
  } else {
    finalResult = {
      text: finalResponse,
      language: 'id',
      source: smartFallback.source,
      confidence: smartFallback.confidence || 0.45,
      emotion: emotionData.primary,
      character: characterData.character,
      suggestedTopics: ['Matematika', 'AI Concepts', 'Upload File', 'Profil Pemilik'],
      suggestion: smartFallback.suggestion
    };
  }

  // ===== EVALUATE RESPONSE QUALITY =====
  try {
    const evaluation = evaluateResponseQuality(
      finalResult.text,
      msg,
      nluAnalysis ? {
        intent: nluAnalysis.components?.nlu?.intent,
        sentiment: nluAnalysis.components?.sentiment,
        textQuality: textAnalysis.quality,
        language: nluAnalysis.components?.language
      } : {},
      conversationContext
    );

    // Generate bilingual response if needed
    const detectedLanguage = activeLang;
    const bilingualResponse = generateBilingualResponse(finalResult.text, detectedLanguage, nluAnalysis);

    // Update final result with bilingual capabilities
    finalResult.text = bilingualResponse.primary;
    finalResult.language = bilingualResponse.language;
    finalResult.alternatives = bilingualResponse.alternatives;
    finalResult.bilingualConfidence = bilingualResponse.confidence;

    // Log evaluation for continuous improvement
    logResponseEvaluation(evaluation, {
      responseType: 'fallback',
      userMessage: msg,
      conversationLength: conversationContext.length,
      settings: settings,
      textAnalysis: textAnalysis,
      language: detectedLanguage,
      bilingual: bilingualResponse
    });

    // Attach evaluation to result for debugging/analysis
    finalResult.evaluation = evaluation;
  } catch (e) {
    console.warn('Response evaluation failed:', e);
  }

  return finalResult;
}

/**
 * HELPER FUNCTIONS FOR NLP ENRICHMENT
 */

/**
 * Enrich response dengan synonyms dan expressions variations
 * @param {string} response - response teks yang akan di-enrich
 * @param {string} originalMessage - pesan asli dari user
 * @returns {string} enriched response
 */
export function enrichResponseWithLexical(response, originalMessage) {
  const words = originalMessage.split(/\s+/).filter(w => w.length > 3);
  let enrichedResponse = response;
  
  // Try to find synonyms untuk key words
  words.forEach(word => {
    const synonyms = getSynonyms(word.toLowerCase(), 'id');
    if (synonyms.length > 0) {
      // Add synonym hint untuk educational purpose
      const synonym = synonyms[0];
      // Subtle enrichment - hanya jika word ada di response
      if (enrichedResponse.toLowerCase().includes(word.toLowerCase())) {
        enrichedResponse = enrichedResponse.replace(
          new RegExp(`\\b${word}\\b`, 'gi'),
          `${word} (sinonim: ${synonym})`
        ).replace(/\(sinonim: .+?\) \(sinonim:/g, '(sinonim:'); // avoid duplication
      }
    }
  });
  
  return enrichedResponse;
}

/**
 * Lightweight paraphrase / synthesis to produce more original responses
 * - replaces some words with synonyms
 * - reorders short sentences and removes long verbatim quotes
 */
export function paraphraseContent(rawText, candidates = [], settings = {}) {
  if (!rawText || typeof rawText !== 'string') return rawText || '';
  try {
    // respect explicit opt-out
    if (settings && settings.enforceOriginalResponses === false) return rawText;

    // Jaga keutuhan format markdown, daftar poin, blok kode, atau rute portofolio agar fakta tidak terpotong
    if (/(\*\*|```|^•|\n- |\/[a-z0-9-]+|\d+\.)/m.test(rawText)) {
      return rawText;
    }

    const sentences = rawText.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
    const shortSentences = sentences.slice(0, 8);

    // add brief synthesis sentence connecting ideas when multiple candidates provided
    let connector = '';
    if (candidates && candidates.length > 0) connector = `Ringkasan hasil integrasi dari ${Math.min(3, candidates.length)} sumber terkait.`;

    const body = shortSentences.join(' ');
    const paraphrased = `${body}${connector ? '\n\n' + connector : ''}`;

    const srcs = (candidates || []).slice(0, 3).map(c => c.source || c.fileName || c.id).filter(Boolean);
    const citation = srcs.length ? `\n\nSumber: ${[...new Set(srcs)].join(', ')}` : '';

    return paraphrased + citation;
  } catch {
    return rawText;
  }
}

/**
 * Get alternative expressions untuk response
 * @param {string} meaning - makna/arti yang dicari
 * @returns {array} daftar alternatif ekspresi
 */
export function getResponseAlternatives(meaning) {
  return getExpressionVariations(meaning);
}

/**
 * Analyze confidence level dari NLU result dan adjust response
 * @param {object} nluResult - hasil NLU analysis
 * @param {string} baseResponse - response awal
 * @returns {string} response dengan confidence qualifier
 */
export function adjustResponseConfidence(nluResult, baseResponse) {
  if (!nluResult) return baseResponse;

  // safe access to confidence values (structure may vary)
  const confidence = (nluResult && (nluResult.integrated?.confidence ?? nluResult.components?.nlu?.confidence ?? nluResult.confidence)) || 0.0;

  if (confidence < 0.5) {
    return `Saya kurang yakin dengan jawaban ini, tapi mungkin maksud Anda adalah: ${baseResponse}\n\n💡 Jika tidak sesuai, coba tanyakan dengan kata-kata yang berbeda.`;
  }

  if (confidence < 0.7) {
    return `${baseResponse}\n\nℹ️ Saya tidak 100% yakin, jadi pastikan ini menjawab pertanyaan Anda.`;
  }

  return baseResponse;
}

/**
 * Add related concepts suggestion ke response
 * @param {object} nluResult - hasil NLU analysis
 * @param {string} baseResponse - response awal
 * @returns {string} response dengan suggestions
 */
export function addRelatedConceptsSuggestions(nluResult, baseResponse) {
  if (!nluResult) return baseResponse;

  const entities = (nluResult.components && nluResult.components.nlu && Array.isArray(nluResult.components.nlu.entities))
    ? nluResult.components.nlu.entities
    : (Array.isArray(nluResult.entities) ? nluResult.entities : []);

  if (!entities || entities.length === 0) return baseResponse;

  const suggestions = [];
  for (const entity of entities) {
    try {
      const value = entity && (entity.value || entity.name || entity.text || entity.label);
      if (!value) continue;
      const node = findKnowledgeNode(value);
      if (node) {
        const related = typeof getRelatedConcepts === 'function' ? getRelatedConcepts(node.id, 1) : [];
        (related || []).slice(0, 2).forEach(rel => { if (rel && rel.name) suggestions.push(rel.name); });
      }
    } catch { /* ignore individual errors */ }
  }

  if (suggestions.length === 0) return baseResponse;

  const uniqueSuggestions = [...new Set(suggestions)].slice(0, 3);
  return `${baseResponse}\n\n📚 **Topik terkait yang mungkin menarik:**\n${uniqueSuggestions.map(s => `- ${s}`).join('\n')}`;
}

// `getFileIcon` imported from shared fileIcons

/**
 * Sistem Penilaian Hasil Respon
 * Mengevaluasi kualitas respon yang dihasilkan
 */

/**
 * Evaluasi komprehensif terhadap respon yang dihasilkan
 * @param {string} response - respon yang akan dievaluasi
 * @param {string} userMessage - pesan asli user
 * @param {object} nluResult - hasil NLU analysis
 * @param {object} context - konteks conversation
 * @returns {object} hasil evaluasi
 */
export function evaluateResponseQuality(response, userMessage, nluResult, context = {}) {
  const evaluation = {
    overall_score: 0,
    metrics: {},
    recommendations: [],
    timestamp: new Date().toISOString()
  };

  // Metric 1: Relevance (relevansi dengan input user)
  evaluation.metrics.relevance = calculateRelevanceScore(response, userMessage, nluResult);
  
  // Metric 2: Informativeness (berapa banyak informasi yang diberikan)
  evaluation.metrics.informativeness = calculateInformativenessScore(response);
  
  // Metric 3: Coherence (koherensi dan kelancaran respon)
  evaluation.metrics.coherence = calculateCoherenceScore(response);
  
  // Metric 4: Appropriateness (kesesuaian dengan konteks)
  evaluation.metrics.appropriateness = calculateAppropriatenessScore(response, nluResult, context);
  
  // Metric 5: Engagement (kemampuan untuk melibatkan user)
  evaluation.metrics.engagement = calculateEngagementScore(response);
  
  // Metric 6: Safety (keamanan dan tidak berbahaya)
  evaluation.metrics.safety = calculateSafetyScore(response);

  // Hitung overall score (weighted average)
  const weights = {
    relevance: 0.25,
    informativeness: 0.20,
    coherence: 0.15,
    appropriateness: 0.20,
    engagement: 0.10,
    safety: 0.10
  };

  evaluation.overall_score = Object.entries(evaluation.metrics).reduce((sum, [metric, score]) => {
    return sum + (score * weights[metric]);
  }, 0);

  // Generate recommendations berdasarkan skor
  evaluation.recommendations = generateQualityRecommendations(evaluation.metrics);

  return evaluation;
}

/**
 * Hitung skor relevansi
 */
function calculateRelevanceScore(response, userMessage, nluResult) {
  let score = 0.5; // baseline

  // Check if response addresses key elements from user message
  const userWords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const responseWords = response.toLowerCase().split(/\s+/);
  
  let matchingWords = 0;
  userWords.forEach(word => {
    if (responseWords.some(rw => rw.includes(word) || word.includes(rw))) {
      matchingWords++;
    }
  });
  
  const wordOverlap = userWords.length > 0 ? matchingWords / userWords.length : 0;
  score += wordOverlap * 0.3;

  // Check if response matches intent
  if (nluResult && nluResult.intent) {
    const intent = nluResult.intent.intent;
    if (intent === 'ask_question' && response.includes('?')) score += 0.1;
    if (intent === 'greeting' && (response.includes('hai') || response.includes('halo'))) score += 0.1;
    if (intent === 'thanks' && (response.includes('sama-sama') || response.includes('terima kasih'))) score += 0.1;
  }

  return Math.min(1, Math.max(0, score));
}

/**
 * Hitung skor informativeness
 */
function calculateInformativenessScore(response) {
  let score = 0.3; // baseline

  // Length factor
  const wordCount = response.split(/\s+/).length;
  if (wordCount > 10) score += 0.2;
  if (wordCount > 50) score += 0.2;
  if (wordCount > 100) score += 0.1;

  // Content richness
  const hasNumbers = /\d/.test(response);
  const hasLists = /^[-•*]\s/m.test(response);
  const hasExamples = /\b(contoh|misal|seperti)\b/i.test(response);
  const hasExplanation = /\b(karena|sebab|oleh karena|karena itu)\b/i.test(response);

  if (hasNumbers) score += 0.1;
  if (hasLists) score += 0.15;
  if (hasExamples) score += 0.1;
  if (hasExplanation) score += 0.1;

  return Math.min(1, Math.max(0, score));
}

/**
 * Hitung skor coherence
 */
function calculateCoherenceScore(response) {
  let score = 0.7; // baseline - assume coherent unless proven otherwise

  // Check for abrupt transitions or disconnected sentences
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    let transitionWords = 0;
    const transitions = ['dan', 'atau', 'tetapi', 'namun', 'karena', 'sehingga', 'maka', 'oleh karena itu'];
    
    for (let i = 1; i < sentences.length; i++) {
      const currSentence = sentences[i].toLowerCase();
      
      if (transitions.some(t => currSentence.startsWith(t))) {
        transitionWords++;
      }
    }
    
    const transitionRatio = transitionWords / (sentences.length - 1);
    score += transitionRatio * 0.2;
  }

  // Penalize for very short or very long sentences mix
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
  if (avgSentenceLength < 5 || avgSentenceLength > 30) score -= 0.1;

  return Math.min(1, Math.max(0, score));
}

/**
 * Hitung skor appropriateness
 */
function calculateAppropriatenessScore(response, nluResult, context) {
  let score = 0.8; // baseline

  // Check formality level matches context
  const isFormalContext = context.formal || (nluResult && ['request_help', 'complaint'].includes(nluResult.intent?.intent));
  const responseFormality = detectFormality(response);
  
  if (isFormalContext && responseFormality === 'formal') score += 0.1;
  if (!isFormalContext && responseFormality === 'casual') score += 0.1;
  if (isFormalContext && responseFormality === 'casual') score -= 0.2;
  if (!isFormalContext && responseFormality === 'formal') score -= 0.1;

  // Check emotional appropriateness
  if (nluResult && nluResult.sentiment) {
    const userSentiment = nluResult.sentiment.sentiment;
    const responseTone = detectTone(response);
    
    if (userSentiment === 'negative' && responseTone === 'empathetic') score += 0.1;
    if (userSentiment === 'positive' && responseTone === 'positive') score += 0.1;
  }

  return Math.min(1, Math.max(0, score));
}

/**
 * Hitung skor engagement
 */
function calculateEngagementScore(response) {
  let score = 0.4; // baseline

  // Check for engagement elements
  const hasQuestion = response.includes('?');
  const hasCallToAction = /\b(coba|upload|kirim|beritahu|jelaskan)\b/i.test(response);
  const hasPersonalTouch = /\b(saya|aku|kamu|anda)\b/i.test(response);
  const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(response);

  if (hasQuestion) score += 0.2;
  if (hasCallToAction) score += 0.15;
  if (hasPersonalTouch) score += 0.1;
  if (hasEmoji) score += 0.1;

  return Math.min(1, Math.max(0, score));
}

/**
 * Hitung skor safety
 */
function calculateSafetyScore(response) {
  let score = 0.9; // baseline - assume safe unless proven otherwise

  // Check for potentially harmful content
  const harmfulPatterns = [
    /\b(berbahaya|bahaya|risiko|ancaman)\b/i,
    /\b(jangan lakukan|tidak disarankan|berhati-hatilah)\b/i,
    /\b(password|rahasia|privat)\b/i
  ];

  harmfulPatterns.forEach(pattern => {
    if (pattern.test(response)) score -= 0.1;
  });

  // Check for appropriate disclaimers
  if (response.includes('saya tidak yakin') || response.includes('kurang yakin')) score += 0.1;

  return Math.min(1, Math.max(0, score));
}

/**
 * Deteksi tingkat formalitas respon
 */
function detectFormality(response) {
  const formalWords = ['mohon', 'maaf', 'terima kasih', 'dengan hormat', 'bersama', 'kami', 'bapak', 'ibu'];
  const casualWords = ['hai', 'halo', 'ya', 'oke', 'sip', 'mantap', 'keren', 'gak', 'nggak'];

  const words = response.toLowerCase().split(/\s+/);
  let formalCount = 0;
  let casualCount = 0;

  words.forEach(word => {
    if (formalWords.some(fw => word.includes(fw))) formalCount++;
    if (casualWords.some(cw => word.includes(cw))) casualCount++;
  });

  if (formalCount > casualCount) return 'formal';
  if (casualCount > formalCount) return 'casual';
  return 'neutral';
}

/**
 * Deteksi tone respon
 */
function detectTone(response) {
  const positiveWords = ['bagus', 'baik', 'senang', 'puas', 'terima kasih', 'mantap', 'keren'];
  const negativeWords = ['maaf', 'sayang', 'kecewa', 'tidak', 'gagal'];
  const empatheticWords = ['saya mengerti', 'saya paham', 'maaf', 'tenang'];

  const text = response.toLowerCase();
  let positive = 0, negative = 0, empathetic = 0;

  positiveWords.forEach(word => { if (text.includes(word)) positive++; });
  negativeWords.forEach(word => { if (text.includes(word)) negative++; });
  empatheticWords.forEach(word => { if (text.includes(word)) empathetic++; });

  if (empathetic > 0) return 'empathetic';
  if (positive > negative) return 'positive';
  if (negative > positive) return 'negative';
  return 'neutral';
}

/**
 * Generate rekomendasi berdasarkan skor evaluasi
 */
function generateQualityRecommendations(metrics) {
  const recommendations = [];

  if (metrics.relevance < 0.6) {
    recommendations.push({
      type: 'relevance',
      priority: 'high',
      message: 'Tingkatkan relevansi respon dengan input user. Pastikan menjawab pertanyaan spesifik yang ditanyakan.',
      action: 'Periksa apakah respon mengalamatkan poin-poin kunci dari pesan user'
    });
  }

  if (metrics.informativeness < 0.5) {
    recommendations.push({
      type: 'informativeness',
      priority: 'medium',
      message: 'Tambahkan lebih banyak informasi berguna. Sertakan contoh, penjelasan, atau detail tambahan.',
      action: 'Perluas respon dengan fakta, contoh, atau langkah-langkah yang relevan'
    });
  }

  if (metrics.coherence < 0.6) {
    recommendations.push({
      type: 'coherence',
      priority: 'medium',
      message: 'Perbaiki koherensi respon. Pastikan alur pikiran yang logis dan transisi yang smooth.',
      action: 'Gunakan kata penghubung dan pastikan setiap kalimat berkaitan dengan yang sebelumnya'
    });
  }

  if (metrics.appropriateness < 0.7) {
    recommendations.push({
      type: 'appropriateness',
      priority: 'high',
      message: 'Sesuaikan tone dan formalitas respon dengan konteks percakapan.',
      action: 'Analisis sentimen user dan sesuaikan respons yang empatetik atau sesuai'
    });
  }

  if (metrics.engagement < 0.5) {
    recommendations.push({
      type: 'engagement',
      priority: 'low',
      message: 'Tingkatkan engagement dengan menambahkan pertanyaan balik atau ajakan aksi.',
      action: 'Tambahkan pertanyaan untuk mendorong interaksi lebih lanjut'
    });
  }

  if (metrics.safety < 0.8) {
    recommendations.push({
      type: 'safety',
      priority: 'critical',
      message: 'Pastikan respon aman dan tidak berpotensi menyesatkan atau berbahaya.',
      action: 'Review konten untuk memastikan keamanan dan akurasi informasi'
    });
  }

  return recommendations;
}

/**
 * Log evaluasi respon untuk analisis selanjutnya
 * @param {object} evaluation - hasil evaluasi
 * @param {object} metadata - metadata tambahan
 */
export function logResponseEvaluation(evaluation, metadata = {}) {
  try {
    const logEntry = {
      ...evaluation,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };

    // Store in localStorage for analysis
    const existingLogs = JSON.parse(localStorage.getItem('saipul_response_evaluations') || '[]');
    existingLogs.push(logEntry);

    // Keep only last 100 evaluations
    const recentLogs = existingLogs.slice(-100);
    localStorage.setItem('saipul_response_evaluations', JSON.stringify(recentLogs));
  } catch (e) {
    console.warn('Failed to log response evaluation:', e);
  }
}

/**
 * Sistem Bilingual Response Generation
 * Menghasilkan respon dalam bahasa yang sesuai dengan input user
 */

/**
 * Generate bilingual response berdasarkan bahasa input
 * @param {string} baseResponse - respon dasar dalam bahasa Indonesia
 * @param {string} detectedLanguage - bahasa yang terdeteksi dari input user
 * @param {object} nluResult - hasil NLU analysis
 * @returns {object} bilingual response object
 */
export function generateBilingualResponse(baseResponse, detectedLanguage, nluResult = {}) {
  const isEn = detectedLanguage === 'en' || (nluResult.language && nluResult.language.language === 'en');
  const result = {
    primary: baseResponse,
    language: isEn ? 'en' : 'id',
    alternatives: {},
    confidence: 0.85
  };

  if (isEn) {
    const indonesianResponse = translateToIndonesian(baseResponse, nluResult);
    result.language = 'en';
    result.primary = baseResponse;
    result.alternatives = {
      english: baseResponse,
      indonesian: indonesianResponse || baseResponse
    };
  } else {
    const englishResponse = translateToEnglish(baseResponse, nluResult);
    result.language = 'id';
    result.primary = baseResponse;
    result.alternatives = {
      indonesian: baseResponse,
      english: englishResponse || baseResponse
    };
  }

  return result;
}

/**
 * Translate English response ke bahasa Indonesia
 * @param {string} englishText - teks dalam bahasa Inggris
 * @param {object} context - konteks untuk terjemahan yang lebih baik
 * @returns {string} terjemahan bahasa Indonesia
 */
export function translateToIndonesian(englishText) {
  if (!englishText || typeof englishText !== 'string') return '';
  
  // Jika teks sudah mayoritas bahasa Indonesia, kembalikan langsung
  const detected = detectLanguage(englishText);
  if (detected.language === 'id' && detected.confidence > 0.7) {
    return englishText;
  }

  // 1. Cek terjemahan langsung dari kamus bilingual
  const directMapping = getBilingualTranslation(englishText, 'id');
  if (directMapping) return directMapping;

  // Frasa umum portofolio & respons bahasa Inggris ke Indonesia
  const phraseReplacements = [
    { from: /Syaiful's Work Experience & Career/gi, to: "Pengalaman Kerja & Karir Syaiful" },
    { from: /Work Experience & Career Track Record/gi, to: "Pengalaman Kerja & Rekam Jejak Karir" },
    { from: /Featured Web Projects by Syaiful/gi, to: "Katalog Projek Web Unggulan Syaiful" },
    { from: /Featured Web Projects/gi, to: "Projek Web Unggulan" },
    { from: /Core Specialization & Skills of Syaiful/gi, to: "Spesialisasi Inti & Keahlian Utama Syaiful" },
    { from: /Core Specialization & Tech Stack/gi, to: "Spesialisasi Inti & Tech Stack Utama" },
    { from: /Official Certifications & Credentials/gi, to: "Sertifikasi Resmi & Kredensial" },
    { from: /Official Certifications & Licenses/gi, to: "Sertifikat & Lisensi Resmi" },
    { from: /Official Certifications/gi, to: "Sertifikasi Resmi" },
    { from: /Languages Spoken by Muhammad Syaiful Mukmin/gi, to: "Kemampuan Bahasa Muhammad Syaiful Mukmin" },
    { from: /Collaboration & Web Development Services/gi, to: "Kolaborasi & Layanan Pengembangan Web" },
    { from: /Web Development Services & Collaboration/gi, to: "Layanan Pembuatan Website & Kolaborasi" },
    { from: /Syaiful's Life & Career Vision/gi, to: "Visi Hidup & Karir Syaiful" },
    { from: /Muhammad Syaiful Mukmin Biography/gi, to: "Biografi & Profil Muhammad Syaiful Mukmin" },
    { from: /Mathematical Logic Calculation/gi, to: "Perhitungan Logika Matematika" },
    { from: /Calculation Result/gi, to: "Hasil Perhitungan" },
    { from: /How can I help you\?/gi, to: "Ada yang bisa saya bantu?" },
    { from: /Is there anything I can help you with\?/gi, to: "Ada yang bisa aku bantu?" },
    { from: /Happy to help/gi, to: "Senang bisa membantu" },
    { from: /Thank you very much/gi, to: "Terima kasih banyak" },
    { from: /Thank you/gi, to: "Terima kasih" },
    { from: /You're welcome/gi, to: "Sama-sama" },
    { from: /You're very welcome/gi, to: "Sama-sama! Dengan senang hati" },
    { from: /Good morning/gi, to: "Selamat pagi" },
    { from: /Good afternoon/gi, to: "Selamat siang" },
    { from: /Good evening/gi, to: "Selamat sore" },
    { from: /Good night/gi, to: "Selamat malam" },
    { from: /Discussion Room/gi, to: "Room Diskusi" },
    { from: /Help Center & Live Support/gi, to: "Pusat Bantuan & Live CS" },
    { from: /Help Center & Live CS/gi, to: "Pusat Bantuan & Live CS" },
    { from: /Connect to Live CS/gi, to: "Hubungi Live CS" },
    { from: /Connecting to Live CS/gi, to: "Menghubungkan ke Live CS" },
    { from: /I'm SaipulAI - your personal intelligent assistant!/gi, to: "Saya SaipulAI - asisten cerdas pribadi Anda!" }
  ];

  let indonesianText = englishText;
  for (const { from, to } of phraseReplacements) {
    indonesianText = indonesianText.replace(from, to);
  }

  // Dictionary terjemahan kata umum English -> Indonesian
  const enToIdDict = {
    'hello': 'halo', 'hi': 'hai', 'hey': 'hai',
    'sorry': 'maaf', 'what': 'apa', 'how': 'bagaimana',
    'why': 'mengapa', 'when': 'kapan', 'where': 'di mana',
    'who': 'siapa', 'can': 'bisa', 'cannot': 'tidak bisa',
    'not': 'tidak', 'yes': 'ya', 'good': 'baik',
    'bad': 'buruk', 'help': 'bantuan', 'problem': 'masalah',
    'error': 'kendala', 'successful': 'berhasil', 'failed': 'gagal',
    'data': 'data', 'information': 'informasi', 'explanation': 'penjelasan',
    'example': 'contoh', 'question': 'pertanyaan', 'answer': 'jawaban'
  };

  const words = indonesianText.split(/(\s+)/);
  const translated = words.map(chunk => {
    const clean = chunk.toLowerCase().replace(/[^\w]/g, '');
    if (enToIdDict[clean]) {
      return chunk.replace(new RegExp(`\\b${clean}\\b`, 'i'), enToIdDict[clean]);
    }
    return chunk;
  });

  return translated.join('').replace(/\s+/g, ' ').trim();
}

/**
 * Translate Indonesian response ke bahasa Inggris
 * @param {string} indonesianText - teks dalam bahasa Indonesia
 * @param {object} context - konteks untuk terjemahan yang lebih baik
 * @returns {string} terjemahan bahasa Inggris
 */
export function translateToEnglish(indonesianText, context = {}) {
  if (!indonesianText || typeof indonesianText !== 'string') return '';
  
  // Jika teks sudah mayoritas bahasa Inggris, kembalikan langsung
  const detected = detectLanguage(indonesianText);
  if (detected.language === 'en' && detected.confidence > 0.7) {
    return indonesianText;
  }

  // 1. Cek terjemahan langsung dari kamus bilingual
  const directMapping = getBilingualTranslation(indonesianText, 'en');
  if (directMapping) return directMapping;

  // Frasa umum portofolio & respons
  const phraseReplacements = [
    { from: /pengalaman kerja dan karir syaiful/gi, to: "Syaiful's Work Experience & Career" },
    { from: /pengalaman kerja & karir syaiful/gi, to: "Syaiful's Work Experience & Career" },
    { from: /katalog projek web unggulan syaiful/gi, to: "Featured Web Projects by Syaiful" },
    { from: /projek web unggulan syaiful/gi, to: "Featured Web Projects by Syaiful" },
    { from: /spesialisasi & keahlian utama syaiful/gi, to: "Core Specialization & Skills of Syaiful" },
    { from: /spesialisasi inti & tech stack/gi, to: "Core Specialization & Tech Stack" },
    { from: /visi hidup & karir syaiful/gi, to: "Syaiful's Life & Career Vision" },
    { from: /sertifikat & lisensi resmi syaiful/gi, to: "Official Certifications & Licenses" },
    { from: /sertifikat resmi yang dimiliki/gi, to: "Official Certifications Held" },
    { from: /kemampuan bahasa muhammad syaiful mukmin/gi, to: "Languages Spoken by Muhammad Syaiful Mukmin" },
    { from: /layanan pembuatan website & kolaborasi/gi, to: "Web Development Services & Collaboration" },
    { from: /perhitungan logika matematika/gi, to: "Mathematical Logic Calculation" },
    { from: /hasil perhitungan/gi, to: "Calculation Result" },
    { from: /perhitungan dievaluasi secara presisi oleh mesin logika saipulai/gi, to: "Calculation precisely evaluated by SaipulAI logic engine." },
    { from: /ada yang bisa saya bantu\?/gi, to: "How can I help you?" },
    { from: /ada yang bisa aku bantu\?/gi, to: "Is there anything I can help you with?" },
    { from: /senang bisa membantu/gi, to: "Happy to help" },
    { from: /terima kasih banyak/gi, to: "Thank you very much" },
    { from: /terima kasih/gi, to: "Thank you" },
    { from: /sama-sama/gi, to: "You're welcome" },
    { from: /selamat pagi/gi, to: "Good morning" },
    { from: /selamat siang/gi, to: "Good afternoon" },
    { from: /selamat sore/gi, to: "Good evening" },
    { from: /selamat malam/gi, to: "Good night" },
    { from: /pusat bantuan & live cs/gi, to: "Help Center & Live CS" },
    { from: /menghubungkan ke live cs/gi, to: "Connecting to Live CS" }
  ];

  let englishText = indonesianText;
  for (const { from, to } of phraseReplacements) {
    englishText = englishText.replace(from, to);
  }

  // Dictionary terjemahan kata umum
  const translationDict = {
    'halo': 'hello', 'hai': 'hi',
    'maaf': 'sorry', 'apa': 'what', 'kabar': 'news',
    'bagaimana': 'how', 'kenapa': 'why', 'kapan': 'when',
    'dimana': 'where', 'siapa': 'who', 'berapa': 'how much',
    'bisa': 'can', 'tidak': 'not', 'ya': 'yes',
    'baik': 'good', 'buruk': 'bad', 'tolong': 'please help',
    'bantuan': 'help', 'masalah': 'problem', 'error': 'error',
    'berhasil': 'successful', 'gagal': 'failed', 'data': 'data',
    'informasi': 'information', 'penjelasan': 'explanation',
    'contoh': 'example', 'pertanyaan': 'question', 'jawaban': 'answer'
  };

  // Replace individual common words if whole phrase not matched
  const words = englishText.split(/(\s+)/);
  const translated = words.map(chunk => {
    const clean = chunk.toLowerCase().replace(/[^\w]/g, '');
    if (translationDict[clean]) {
      return chunk.replace(new RegExp(`\\b${clean}\\b`, 'i'), translationDict[clean]);
    }
    return chunk;
  });

  return postProcessEnglish(translated.join(''), context);
}

/**
 * Post-processing untuk meningkatkan grammar dan fluency bahasa Inggris
 * @param {string} text - teks bahasa Inggris yang akan diproses
 * @param {object} context - konteks untuk improvement
 * @returns {string} teks yang telah diproses
 */
function postProcessEnglish(text, context = {}) {
  let processed = text;

  // Capitalize first letter of sentences
  processed = processed.replace(/(^\w|\.\s*\w)/g, l => l.toUpperCase());

  // Fix common grammar issues
  processed = processed.replace(/\bi\s+am\b/gi, 'I am');
  processed = processed.replace(/\bi\s+don'?t\b/gi, 'I don\'t');
  processed = processed.replace(/\bi\s+can\b/gi, 'I can');
  processed = processed.replace(/\byou\s+are\b/gi, 'you are');
  processed = processed.replace(/\bit\s+is\b/gi, 'it is');

  // Fix question formation
  if (context.intent === 'ask_question' || text.includes('?')) {
    processed = processed.replace(/^(can|do|does|is|are|was|were|have|has|will|would|could|should)\s+(.+)\?$/i,
      (match, verb, rest) => `${verb.charAt(0).toUpperCase() + verb.slice(1)} ${rest}?`);
  }

  // Add politeness markers
  if (context.intent === 'request_help') {
    if (!processed.includes('please')) {
      processed = processed.replace(/^(.+)$/i, 'Please $1');
    }
  }

  // Fix double spaces
  processed = processed.replace(/\s+/g, ' ').trim();

  return processed;
}

/**
 * Generate English-specific responses untuk intent tertentu
 * @param {string} intent - intent yang terdeteksi
 * @param {object} entities - entities yang diekstrak
 * @param {object} context - konteks percakapan
 * @returns {string} respon bahasa Inggris
 */
export function generateEnglishResponse(intent) {
  const responses = {
    greeting: [
      "Hello! I'm SaipulAI, your intelligent assistant. How can I help you today?",
      "Hi there! Welcome to SaipulAI. What can I assist you with?",
      "Greetings! I'm SaipulAI, ready to help with your questions and tasks."
    ],
    farewell: [
      "Goodbye! It was great chatting with you. Come back anytime!",
      "See you later! Don't hesitate to ask if you need help again.",
      "Farewell! SaipulAI is always here when you need assistance."
    ],
    thanks: [
      "You're welcome! Happy to help.",
      "My pleasure! Let me know if you need anything else.",
      "Glad I could assist you!"
    ],
    ask_question: [
      "I'd be happy to help answer your question. Could you provide more details?",
      "Great question! Let me search through my knowledge base for the best answer.",
      "I'm here to help with that. Let me find the most relevant information for you."
    ],
    calculation: [
      "I'll help you with that calculation. Let me process the numbers.",
      "Mathematical computation coming up! Give me a moment to calculate.",
      "Let's crunch those numbers. Here's the result:"
    ],
    analysis: [
      "I'll analyze that data for you. This might take a moment.",
      "Data analysis in progress. Let me examine the information you provided.",
      "I'll break this down and provide insights based on the data."
    ],
    unknown: [
      "I'm not entirely sure about that. Could you rephrase your question?",
      "I need a bit more context to give you the best answer. Can you elaborate?",
      "Let me think about that. Could you provide more details about what you're looking for?"
    ]
  };

  const intentResponses = responses[intent] || responses.unknown;
  return intentResponses[Math.floor(Math.random() * intentResponses.length)];
}

/**
 * Advanced text processing utility
 */
export function enhancedTextProcessing(text) {
  if (!text) return { normalized: '', length: 0, words: [], language: 'id' };
  
  const normalized = text.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  const detected = detectLanguage(text);
  const language = detected.language || 'id';
  
  return {
    original: text,
    normalized,
    length: text.length,
    wordCount: words.length,
    words,
    language,
    confidence: detected.confidence,
    timestamp: new Date().toISOString()
  };
}