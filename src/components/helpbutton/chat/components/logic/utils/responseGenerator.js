import { calculateMath } from './mathCalculator';
import { getKnowledgeResponse } from './knowledgeBase';
import { handleConversion } from './conversions';
import { generatePrediction, analyzeData, calculateStatistics } from './analytics';
import { extractThemes, getRandomItem, simpleNER } from './helpers';
import { getFileIcon } from './fileIcons';
import { CHATBOT_VERSION } from '../../../config.js';
import aiDocData from '../../../../../../data/AIDoc/data.json';
import riwayatData from '../../../../../../data/AIDoc/riwayat/riwayat.json';
import { 
  detectEmotion, 
  detectCharacter, 
  wrapResponseWithEmotion
} from './emotionEngine';
  import { detectPII, redactPII } from './piiDetector';
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
import { getSynonyms } from './lexicalDatabase';
import { getExpressionVariations } from './languageCorpus';
import { quickNLU } from './nluProcessing';
import { 
  generateComprehensiveAnswer as generateEnhancedAnswer,
  findKnowledgeNode,
  getRelatedConcepts
} from './enhancedKnowledgeBase';

// ===== GREETING & SIMPLE PATTERN RECOGNITION =====
import { recognizeGreeting } from './greetingRecognizer';

/**
 * Integrasi data.json dan riwayat.json ke dalam proses pembuatan respon
 * @param {string} msg
 * @param {object} settings
 * @param {array} conversationContext
 * @param {object} safeKnowledgeBase
 * @param {object} knowledgeStats
 * @returns {object} response
 */
export function getSmartReply(msg, settings, conversationContext, safeKnowledgeBase, knowledgeStats) {
  const text = msg.toLowerCase().trim();

  // ===== ENHANCED TEXT PROCESSING =====
  const textAnalysis = enhancedTextProcessing(msg);
  const processedText = textAnalysis.normalized || text;
  // Absolute response rules enforcement (safety / non-fabrication / no PII)
  try {
    const piiPattern = /(password|passw(or)?d|pin|cvv|card number|kartu kredit|rekening|norek|no\s?rek|nik|ktp|ssn|social security|credit card)/i;
    const illegalPattern = /(make a bomb|how to make a bomb|explode|assassin|kill someone|murder|hack into|ddos|how to hack|steal|rob bank)/i;
    if (piiPattern.test(text)) {
      return { text: 'Maaf, saya tidak dapat memproses atau menyimpan data sensitif. Silakan jangan mengirimkan informasi pribadi atau transaksi melalui chat.', source: { type: 'policy', id: 'no_pii' }, confidence: 1 };
    }
    if (illegalPattern.test(text)) {
      return { text: 'Maaf, saya tidak dapat membantu dengan permintaan yang berbahaya atau ilegal.', source: { type: 'policy', id: 'no_illegal' }, confidence: 1 };
    }
  } catch { /* ignore */ }

  // === RATE LIMITING (client-side, best-effort) ===
  try {
    const rlKey = 'saipul_rate';
    const now = Date.now();
    const windowMs = (settings?.rateLimitWindowMs) || 60000; // 60s default
    const maxReq = (settings?.maxRequestsPerWindow) || 20; // default
    let entries = JSON.parse(localStorage.getItem(rlKey) || '[]');
    entries = (Array.isArray(entries) ? entries : []).filter(ts => (now - ts) <= windowMs);
    if (entries.length >= maxReq) {
      // log moderation flag
      try {
        const flags = JSON.parse(localStorage.getItem('saipul_moderation_flags') || '[]');
        flags.push({ type: 'rate_limit', ts: new Date().toISOString(), count: entries.length });
        localStorage.setItem('saipul_moderation_flags', JSON.stringify(flags.slice(-200)));
      } catch (e) {}
      return { text: 'Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa detik sebelum mencoba lagi.', source: { type: 'throttle' }, confidence: 0.2 };
    }
    entries.push(now);
    try { localStorage.setItem(rlKey, JSON.stringify(entries)); } catch (e) { /* ignore */ }
  } catch (e) { /* ignore rate limit errors */ }

  // === PII detection & enforcement ===
  try {
    const piiDetections = detectPII(msg, { whitelist: settings?.piiWhitelist || [] });
    if (Array.isArray(piiDetections) && piiDetections.length > 0) {
      // log moderation flag
      try {
        const flags = JSON.parse(localStorage.getItem('saipul_moderation_flags') || '[]');
        flags.push({ type: 'pii_detected', ts: new Date().toISOString(), detections: piiDetections.slice(0,5) });
        localStorage.setItem('saipul_moderation_flags', JSON.stringify(flags.slice(-200)));
      } catch (e) {}

      // enforce strict PII protection by default
      if (settings?.enforcePIIProtection !== false) {
        const redacted = redactPII(msg, { replaceMap: { email: '[REDACTED_EMAIL]', phone: '[REDACTED_PHONE]' } });
        return { text: `Maaf, saya mendeteksi informasi sensitif (PII) dalam pesan Anda dan tidak dapat memprosesnya. Contoh yang disamarkan: "${(redacted.text || '').slice(0, 200)}". Silakan hapus info sensitif dan coba lagi.`, source: { type: 'policy', id: 'pii_block' }, confidence: 1 };
      }
    }
  } catch (e) { /* ignore */ }

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
  } catch { /* ignore storage errors */ }

  // ===== NEW: GREETING & SIMPLE PATTERN RECOGNITION =====
  // Check for greetings dan simple interactions sebelum advanced processing
  const greetingResponse = recognizeGreeting(msg, updatedProfile);
  if (greetingResponse) {
    return {
      ...greetingResponse,
      emotion: emotionData.primary,
      character: characterData.character
    };
  }

  // ===== NEW: CHECK IF ASKING ABOUT SAIPULAI =====
  if (isSaipulAIReference(msg)) {
    const aiResponse = generateSaipulAIResponse(msg);
    if (aiResponse) {
      return {
        ...aiResponse,
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
          const finalText = (settings && settings.enforceOriginalResponses !== false)
            ? paraphraseContent(enhancedAnswer.answer, enhancedAnswer.relatedNodes || [], settings)
            : enhancedAnswer.answer;
          return {
            text: finalText,
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
  const styles = [
    'concise', 'formal', 'friendly', 'technical', 'humorous', 'terse', 'elaborate', 'poetic', 'empathetic', 'step-by-step'
  ];

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
  } catch { /* ignore profile storage errors */ }

  // time queries: "waktu di <place>" or "what time in <place>"
  const timeMatch = msg.match(/waktu(?: sekarang)?(?: di| in)\s+([A-Za-z\s-]+)/i) || msg.match(/what time(?: is it)? in\s+([A-Za-z\s-]+)/i);
  if (timeMatch) {
    const loc = timeMatch[1].trim().toLowerCase();
    // prefer user's saved timezone if location matches profile
    const profileRaw = JSON.parse(localStorage.getItem('saipul_profile') || '{}');
    let tz = profileRaw.timezone || timezoneMap[loc] || (loc.match(/^gmt([+-]?\d+)/i) ? `Etc/GMT${RegExp.$1.startsWith('-') ? RegExp.$1 : `+${RegExp.$1}`}` : null);
    const formatted = tz ? formatNowForTimezone(tz) : formatNowForTimezone('UTC');
    const tzLabel = tz || 'UTC';
    return { text: `Waktu saat ini di ${loc} (${tzLabel}): ${formatted}`, source: { type: 'time' }, confidence: 0.95 };
  }
  // Enhanced: Check local saved reports and build a richer caution/behavior signal
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
  } catch { /* ignore storage errors */ }

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
    s = s.replace(/[,?\.!]/g, ' ');

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
    if (text.includes('harga') || text.includes('saham')) return { text: generatePrediction('harga', text), source: { type: 'prediction', id: 'harga' }, confidence: 0.6 };
    if (text.includes('cuaca') || text.includes('weather')) return { text: generatePrediction('cuaca', text), source: { type: 'prediction', id: 'cuaca' }, confidence: 0.6 };
    if (text.includes('penjualan') || text.includes('sales')) return { text: generatePrediction('penjualan', text), source: { type: 'prediction', id: 'penjualan' }, confidence: 0.6 };
    return { text: (cautionNote ? `${cautionNote}\n\n` : '') + generatePrediction('umum', text), source: { type: 'prediction', id: 'umum' }, confidence: 0.6 };
  }

  const analysisResult = analyzeData(text);
  if (analysisResult) return { text: (cautionNote ? `${cautionNote}\n\n` : '') + analysisResult, source: { type: 'analysis' }, confidence: 0.9 };

  const statsResult = calculateStatistics(text);
  if (statsResult) return { text: (cautionNote ? `${cautionNote}\n\n` : '') + statsResult, source: { type: 'statistics' }, confidence: 0.9 };

  const knowledgeResponse = getKnowledgeResponse(text, safeKnowledgeBase, settings);
  if (knowledgeResponse) {
    // Record successful KB query
    const sourceType = knowledgeResponse.source?.type || 'unknown';
    kbMonitor.recordQuery(text, sourceType.replace('kb_', ''), true);
    
    // apply style preference: settings -> profile preference -> random
    const profileRaw = JSON.parse(localStorage.getItem('saipul_profile') || '{}');
    const style = settings.responseStyle || profileRaw.preferenceStyle || (settings.preferredStyle || null);
    if (knowledgeResponse && typeof knowledgeResponse.text === 'string' && style) {
      try { knowledgeResponse.text = applyStyle(knowledgeResponse.text, style); } catch { /* ignore style errors */ }
    }
    return knowledgeResponse;
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

  if (text.includes('halo') || text.includes('hai') || text.includes('hi') || text.includes('hello'))
    return { text: (cautionNote ? `${cautionNote}\n\n` : '') + `Hai juga! 👋 Aku SaipulAI v${CHATBOT_VERSION} Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Scientific Computing\n• 📊 **Multi-format File Processing** (PDF, DOCX, XLSX, Images)\n• 🤖 **Dynamic Knowledge Base** Integration\n• 🎯 **Context-Aware Intelligent Responses**\n• 📁 **Advanced File Management** & Metadata\n• 🔍 **Smart Search** Across All Data Sources\n\n💡 **Tips**: Coba upload file atau tanyakan tentang topik spesifik!`, source: { type: 'system', id: 'greeting' }, confidence: 0.7 };

  if (text.includes('terima kasih') || text.includes('thanks') || text.includes('thank you')) 
    return { text: (cautionNote ? `${cautionNote}\n\n` : '') + "Sama-sama! 😊 Senang bisa membantu analisis dan pencarian informasimu. Jika ada yang lain, jangan ragu untuk bertanya!", source: { type: 'system', id: 'thanks' }, confidence: 0.7 };

  if (text.includes('versi') || text.includes('version')) {
    // Integrasi info dari data.json dan riwayat.json
    const versi = aiDocData?.header_information?.version || CHATBOT_VERSION;
    const lastUpdate = aiDocData?.header_information?.last_update || '-';
    const totalFitur = aiDocData?.statistik_versi_saat_ini?.total_fitur || '-';
    const totalVersi = aiDocData?.statistik_versi_saat_ini?.total_versi_dokumentasi || '-';
    const releaseRange = aiDocData?.statistik_versi_saat_ini?.rentang_waktu || '-';
    const rataRataRelease = aiDocData?.statistik_versi_saat_ini?.rata_rata_release || '-';
    const changelog = aiDocData?.change_log_sesi_terakhir?.[0]?.description || '-';
    const riwayat = riwayatData?.version_history_detail?.[0]?.summary || '-';
    return {
      text:
        (cautionNote ? `${cautionNote}\n\n` : '') +
        `🤖 **SaipulAI v${versi} (Terbaru)**\n` +
        `• Update terakhir: ${lastUpdate}\n` +
        `• Total fitur: ${totalFitur}\n` +
        `• Total versi dokumentasi: ${totalVersi}\n` +
        `• Rata-rata rilis: ${rataRataRelease}\n` +
        `• Rentang rilis: ${releaseRange}\n` +
        `\n**Changelog Terbaru:**\n${changelog}\n` +
        `\n**Ringkasan Riwayat:**\n${riwayat}\n` +
        `\n• Model: ${String(settings.aiModel || '').toUpperCase()}\n• Presisi: ${settings.calculationPrecision}\n• Memori: ${settings.memoryContext ? 'Aktif' : 'Nonaktif'}\n• File Support: ${Array.isArray(settings.allowedFileTypes) ? settings.allowedFileTypes.join(', ') : ''}\n• Data Sources: ${knowledgeStats && knowledgeStats.totalCategories ? knowledgeStats.totalCategories : 0} kategori\n• File Upload: ${settings.enableFileUpload ? 'Aktif' : 'Nonaktif'}`,
      source: { type: 'system', id: 'version' },
      confidence: 0.9
    };
  }

  if ((text.includes('hapus') || text.includes('clear')) && text.includes('chat')) {
     return { text: "🗑️ **Riwayat percakapan telah dibersihkan**\nSekarang kita mulai fresh! Ada yang bisa kubantu analisis, hitung, atau proses hari ini?", source: { type: 'system', id: 'clear' }, confidence: 0.7 };
  }

  if (text.includes('fitur') || text.includes('bisa apa') || text.includes('help') || text.includes('bantuan')) {
    // Integrasi fitur utama dari data.json
    const fiturUtama = aiDocData?.fitur_utama?.map((f, i) => `${i + 1}. ${f}`).join('\n') || '-';
    return {
      text: `🤖 **Fitur SaipulAI v7.1.0**\n\n${fiturUtama}\n\n💡 Untuk detail lebih lanjut, cek dokumentasi atau ketik 'versi' untuk info update terbaru.`,
      source: { type: 'system', id: 'features' },
      confidence: 0.85
    };
  }

  const lastUserMessages = conversationContext.filter(msg => msg.role === 'user').slice(-3);
  const commonThemes = extractThemes(lastUserMessages);
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
      const base = (cautionNote ? `${cautionNote}\n\n` : '') + dataIntegrationAnswer;
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
    console.error('Data integration error:', e);
    /* non-fatal */
  }

  // Try RAG: retrieve docs and synthesize, used as a non-invasive enhancement before fallback
  try {
    const ragCandidates = retrieveCandidates(msg, safeKnowledgeBase || {});
    if (Array.isArray(ragCandidates) && ragCandidates.length > 0) {
      const ragAnswer = synthesizeAnswers(msg, ragCandidates, { style: settings.responseStyle });
      // Only promote RAG response when confidence looks reasonable
      if (ragAnswer && ragAnswer.confidence >= 0.5) {
        const base = (cautionNote ? `${cautionNote}\n\n` : '') + ragAnswer.text;
        const paraphrased = (settings && settings.enforceOriginalResponses !== false) ? paraphraseContent(base, ragCandidates, settings) : base;
        return { text: paraphrased, source: { type: 'rag', sources: ragAnswer.sources }, confidence: ragAnswer.confidence };
      }
    }
  } catch { /* non-fatal */ }

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

  const fallbacks = [
    `Bisa jelaskan lebih detail? Aku bisa bantu dengan:\n• Analisis data spesifik\n• Perhitungan matematika kompleks\n• Prediksi berdasarkan parameter\n• Penjelasan konsep dari knowledge base\n• Processing file yang diupload`,
    `Menarik! Dengan mode ${settings.creativeMode ? 'kreatif' : 'analitis'} yang aktif, aku bisa bantu eksplorasi topik ini lebih dalam. Ada data atau parameter spesifik yang ingin dianalisis?`,
    `Aku detect ini mungkin terkait ${commonThemes.length > 0 ? commonThemes.join(' atau ') : 'beberapa topik'}. Bisa diperjelas agar aku bisa bantu lebih optimal?`,
    `Topik yang menarik! Aku punya knowledge base yang luas dan kemampuan pemrosesan data. Mau dalam bentuk perhitungan, prediksi, penjelasan konsep, atau processing file?`
  ];
  
  const pick = getRandomItem(fallbacks);
  // pick a style
  const chosenStyle = settings.responseStyle || styles[Math.floor(Math.random() * styles.length)];
  const styledResponse = applyStyle(pick, chosenStyle);
  
  // ===== NEW: WRAP FALLBACK RESPONSE WITH EMOTION & CHARACTER =====
  const finalResponse = wrapResponseWithEmotion(
    styledResponse,
    emotionData,
    characterData,
    settings
  );
  
  const finalResult = {
    text: finalResponse,
    source: { type: 'fallback' },
    confidence: 0.45,
    emotion: emotionData.primary,
    character: characterData.character
  };

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
    const detectedLanguage = nluAnalysis?.components?.language?.language || 'id';
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

    const sentences = rawText.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
    // take highest-quality sentences but avoid copying very long snippets
    const shortSentences = sentences.map(s => s.length > 240 ? s.split(/[,;:-]/)[0] + '...' : s).slice(0, 6);

    // synonym-based subtle rewrites
    const rewritten = shortSentences.map(sent => {
      const tokens = sent.split(/(\s+)/);
      // replace roughly 10-20% of longer words with synonyms
      return tokens.map(tok => {
          if (!/^[A-Za-z0-9]{4,}$/.test(tok)) return tok;
          try {
            const syns = getSynonyms(tok.toLowerCase(), settings.language || 'id') || [];
            if (syns && syns.length > 0 && Math.random() < 0.16) {
              // preserve capitalization
              const rep = syns[0];
              if (/^[A-Z]/.test(tok)) return rep.charAt(0).toUpperCase() + rep.slice(1);
              return rep;
            }
          } catch { /* ignore */ }
          return tok;
        }).join('');
    }).join(' ');

    // add brief synthesis sentence connecting ideas
    let connector = '';
    if (candidates && candidates.length > 0) connector = `Ringkasan hasil integrasi dari ${Math.min(3, candidates.length)} sumber terkait.`;

    const paraphrased = `${rewritten}${connector ? '\n\n' + connector : ''}`;

    // ensure we append citations minimally (no verbatim quotes)
    const srcs = (candidates || []).slice(0,3).map(c => c.source || c.fileName || c.id).filter(Boolean);
    const citation = srcs.length ? `

Sumber: ${[...new Set(srcs)].join(', ')}` : '';

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
        const related = Array.isArray(getRelatedConcepts) ? getRelatedConcepts(node.id, 1) : [];
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
      const prevSentence = sentences[i-1].toLowerCase();
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
  const result = {
    primary: baseResponse,
    language: 'id',
    alternatives: {},
    confidence: 0.8
  };

  // Jika input dalam bahasa Inggris, prioritaskan respon bahasa Inggris
  if (detectedLanguage === 'en' || (nluResult.language && nluResult.language.language === 'en')) {
    const englishResponse = translateToEnglish(baseResponse, nluResult);
    if (englishResponse) {
      result.primary = englishResponse;
      result.language = 'en';
      result.alternatives.indonesian = baseResponse;
      result.confidence = Math.min(1, (nluResult.language?.confidence || 0.5) + 0.2);
    }
  } else {
    // Input bahasa Indonesia, tapi berikan opsi bahasa Inggris
    const englishResponse = translateToEnglish(baseResponse, nluResult);
    if (englishResponse) {
      result.alternatives.english = englishResponse;
    }
  }

  return result;
}

/**
 * Translate Indonesian response ke bahasa Inggris
 * @param {string} indonesianText - teks dalam bahasa Indonesia
 * @param {object} context - konteks untuk terjemahan yang lebih baik
 * @returns {string} terjemahan bahasa Inggris
 */
function translateToEnglish(indonesianText, context = {}) {
  // Dictionary terjemahan umum
  const translationDict = {
    // Greetings
    'halo': 'hello', 'hai': 'hi', 'selamat pagi': 'good morning',
    'selamat siang': 'good afternoon', 'selamat sore': 'good evening',
    'selamat malam': 'good night', 'terima kasih': 'thank you',
    'sama-sama': 'you\'re welcome', 'maaf': 'sorry',

    // Common phrases
    'apa kabar': 'how are you', 'saya baik': 'I\'m fine',
    'bagaimana': 'how', 'kenapa': 'why', 'kapan': 'when',
    'di mana': 'where', 'siapa': 'who', 'apa': 'what',
    'berapa': 'how much', 'bisa': 'can', 'tidak': 'no',
    'ya': 'yes', 'baik': 'good', 'buruk': 'bad',

    // Technical terms
    'saya tidak mengerti': 'I don\'t understand',
    'bisa jelaskan': 'can you explain',
    'tolong': 'please help', 'bantuan': 'help',
    'masalah': 'problem', 'error': 'error',
    'berhasil': 'successful', 'gagal': 'failed',

    // Knowledge base terms
    'data': 'data', 'informasi': 'information',
    'penjelasan': 'explanation', 'contoh': 'example',
    'pertanyaan': 'question', 'jawaban': 'answer'
  };

  // Pattern-based translations untuk frasa umum
  const patternTranslations = [
    {
      pattern: /halo, (saya|aku) (.+)/i,
      replacement: (match, pronoun, name) => `Hello, I'm ${name}`
    },
    {
      pattern: /terima kasih (.+)/i,
      replacement: (match, reason) => `Thank you ${reason}`
    },
    {
      pattern: /saya (ingin|mau) (.+)/i,
      replacement: (match, verb, thing) => `I want ${translatePhrase(thing)}`
    },
    {
      pattern: /bisa (kau|kamu|anda) (.+)/i,
      replacement: (match, pronoun, action) => `Can you ${translatePhrase(action)}`
    },
    {
      pattern: /(apa|bagaimana) cara (.+)/i,
      replacement: (match, question, topic) => `How to ${translatePhrase(topic)}`
    }
  ];

  let englishText = indonesianText.toLowerCase();

  // Apply pattern translations first
  for (const { pattern, replacement } of patternTranslations) {
    englishText = englishText.replace(pattern, replacement);
  }

  // Word-by-word translation
  const words = englishText.split(/\s+/);
  const translatedWords = words.map(word => {
    // Remove punctuation for lookup
    const cleanWord = word.replace(/[^\w]/g, '');
    const translation = translationDict[cleanWord] || cleanWord;

    // Restore punctuation
    return word.replace(cleanWord, translation);
  });

  let result = translatedWords.join(' ');

  // Post-processing untuk grammar dan fluency
  result = postProcessEnglish(result, context);

  return result;
}

/**
 * Translate phrase dengan context awareness
 * @param {string} phrase - frasa yang akan diterjemahkan
 * @returns {string} terjemahan
 */
function translatePhrase(phrase) {
  const phraseDict = {
    'membuat': 'make', 'menggunakan': 'use', 'menjalankan': 'run',
    'menginstall': 'install', 'mengupdate': 'update', 'menghapus': 'delete',
    'mencari': 'search', 'menemukan': 'find', 'melihat': 'see',
    'membaca': 'read', 'menulis': 'write', 'mengedit': 'edit',
    'menyimpan': 'save', 'memuat': 'load', 'mengunduh': 'download'
  };

  return phraseDict[phrase.toLowerCase()] || phrase;
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
export function generateEnglishResponse(intent, entities = {}, context = {}) {
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