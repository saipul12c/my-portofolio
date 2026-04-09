// useSoftSkillsAI.js
import { useState, useCallback, useMemo } from 'react';
import nlp from 'compromise';
import Sentiment from 'sentiment';
import blogData from '../../../../data/blog/data.json';
import faqsData from '../../../../components/helpbutton/faq/data/faqs.json';
import commitmentsData from '../../../../components/helpbutton/komit/data/commitments.json';

const sentimentAnalyzer = new Sentiment();

// --- CONFIG & CONSTANTS ---

const SYNONYM_MAP = {
  'keahlian': 'skill',
  'kemampuan': 'skill',
  'penguasaan': 'experience',
  'kemahiran': 'experience',
  'tingkat': 'level',
  'lvl': 'level',
  'sulit': 'difficulty',
  'paling': 'tertinggi',
  'terbaik': 'tertinggi',
  'ajarkan': 'how',
  'tutorial': 'how',
  'langkah': 'how',
  'tips': 'how',
  'contoh': 'example',
  'penerapan': 'example',
  'implementasi': 'example',
  'mengapa': 'why',
  'kenapa': 'why',
  'alasan': 'why',
  'pentingnya': 'why',
  'fungsi': 'why',
  'guna': 'why',
  'manfaat': 'why',
  'saipul': 'owner',
  'pemilik': 'owner',
  'pencipta': 'owner',
  'siapa': 'who',
  'anda': 'ai',
  'kamu': 'ai',
  'robot': 'ai',
};

function normalizeInput(text) {
  let normalized = text.toLowerCase().trim();
  // 1. Handle common punctuation
  normalized = normalized.replace(/[?!.,]/g, '');
  
  // 2. Map synonyms
  Object.keys(SYNONYM_MAP).forEach(syn => {
    const regex = new RegExp(`\\b${syn}\\b`, 'g');
    normalized = normalized.replace(regex, SYNONYM_MAP[syn]);
  });
  
  return normalized;
}

const INTENT_CONFIG = {
  greeting: { keywords: ['halo', 'hai', 'hi', 'hello', 'p', 'permisi', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'oi'], weight: 1.5 },
  help: { keywords: ['bantuan', 'tolong', 'help', 'bisa apa', 'fitur', 'panduan', 'cara pakai', 'list'], weight: 1.2 },
  math: { keywords: ['selisih', 'beda', 'total', 'gabungan', 'plus', 'minus', 'difference', 'sum', 'tambah', 'kurang'], weight: 1.0 },
  compare: { keywords: ['bandingkan', 'vs', 'bedanya', 'perbedaan', 'urutkan', 'ranking', 'sort', 'lebih baik', 'mana yang'], weight: 1.3 },
  stats: { keywords: ['rata-rata', 'statistik', 'tertinggi', 'terbaik', 'tersulit', 'paling', 'average', 'summary', 'sebaran', 'distribusi'], weight: 1.1 },
  count: { keywords: ['lagi', 'lanjut', 'more', 'terus', 'detail'], weight: 1.2 },
  negation: { keywords: ['bukan', 'tidak', 'jangan', 'kecuali', 'selain', 'tanpa'], weight: 1.5 },
  jobMatching: { keywords: ['cari', 'butuh', 'loker', 'lowongan', 'cocok', 'pilih', 'rekrut', 'hire', 'posisi', 'role', 'pekerjaan'], weight: 1.8 },
  why: { keywords: ['kenapa', 'mengapa', 'alasan', 'pentingnya', 'manfaat', 'fungsi', 'benefit', 'guna'], weight: 1.1 },
  how: { keywords: ['bagaimana', 'cara', 'tips', 'belajar', 'tutorial', 'langkah', 'step'], weight: 1.1 },
  what: { keywords: ['apa', 'maksud', 'definisi', 'arti', 'jelaskan', 'makna', 'detail'], weight: 1.0 },
  example: { keywords: ['contoh', 'penerapan', 'aplikasi', 'kasus', 'implementasi', 'riil'], weight: 1.1 },
  thanks: { keywords: ['terima kasih', 'thanks', 'makasih', 'oke', 'sip', 'mantap', 'keren'], weight: 1.0 },
  identity: { keywords: ['kamu siapa', 'dirimu', 'robot', 'ai', 'nama kamu', 'pencipta'], weight: 1.5 }
};

const IMPLICIT_CONFIG = {
  keywords: ['lagi', 'ulangi', 'terus', 'more', 'lanjut', 'detailkan', 'jelaskan kembali', 'next'],
};


const RESPONSE_TEMPLATES = {
  greeting: [
    "Halo! Saya Orchestrator AI. Ada yang bisa saya bantu analisis hari ini?",
    "Hai, senang bertemu Anda! Mari kita telusuri potensi soft skill Saipul bersama.",
    "Selamat datang! Saya siap menyajikan data mendalam tentang kemampuan interpersonal Saipul."
  ],
  thanks: [
    "Sama-sama! Senang bisa membantu Anda.",
    "Tentu, jangan ragu untuk bertanya lagi!",
    "Siap! Ada lagi yang ingin Anda ketahui?"
  ],
  identity: [
    "Saya adalah SaipulAI NLP v2.0, asisten virtual yang dirancang khusus untuk membedah data soft skill.",
    "Panggil saja saya Orchestrator. Saya dibangun dengan logika pemrosesan bahasa alami untuk memahami kebutuhan Anda.",
    "Saya adalah entitas cerdas yang membantu Saipul mempresentasikan keahliannya secara interaktif."
  ],
  notFound: [
    "Hmm, saya belum menemukan data spesifik mengenai itu. Bisa coba tanyakan dengan kalimat lain?",
    "Maaf, sepertinya saya tidak menangkap maksud Anda. Tanya 'Bantuan' untuk melihat apa yang bisa saya lakukan.",
    "Saya masih belajar memahami konteks tersebut. Coba sebutkan nama skill secara spesifik?"
  ],
  contextRecall: [
    "Maksud Anda terkait **{entity}**, ya?",
    "Mari kita bahas lebih lanjut mengenai **{entity}**.",
    "Tentu, ini detail tambahan untuk **{entity}**:"
  ]
};

// --- CORE UTILITIES ---

  // --- INTERNAL UTILITIES ---
  function handleJobMatching(query) {
    const roleMatch = query.match(/(?:untuk|posisi|sebagai|cari|role|pekerjaan)\s+([a-zA-Z\s]+)/i);
    const targetRole = roleMatch ? roleMatch[1].trim() : "posisi yang Anda cari";
    
    // Scoring logic
    let matchScore = 0;
    let relevantSkills = [];
    let relevantBlogs = [];

    skills.forEach(s => {
       const isDirect = targetRole.toLowerCase().includes(s.name.toLowerCase());
       const isTagMatch = (s.tags || []).some(t => targetRole.toLowerCase().includes(t.toLowerCase()));
       if (isDirect || isTagMatch) {
          matchScore += (s.experience / 2);
          relevantSkills.push(s);
       }
    });

    blogData.forEach(b => {
       if (b.title.toLowerCase().includes(targetRole.toLowerCase()) || (b.tags && b.tags.some(t => targetRole.toLowerCase().includes(t.toLowerCase())))) {
          matchScore += 15;
          relevantBlogs.push(b);
       }
    });

    matchScore = Math.min(Math.max(matchScore, 40), 99); // Min 40, Max 99
    
    let recommendation = "Perlu Eksplorasi Lebih Lanjut";
    if (matchScore > 80) recommendation = "Sangat Direkomendasikan";
    else if (matchScore >= 60) recommendation = "Potensial & Kompeten";

    let response = `### **Laporan Analisis Kecocokan** 📊\n`;
    response += `Berdasarkan kebutuhan Anda untuk **${targetRole}**, berikut adalah hasil evaluasi saya:\n\n`;
    response += `**Skor Kecocokan:** \`${matchScore}%\` – **${recommendation}**\n\n`;
    
    if (relevantSkills.length > 0) {
       response += `**Kekuatan Utama:**\n`;
       relevantSkills.slice(0, 2).forEach(s => {
          response += `* **${s.name}** (Penguasaan ${s.experience}%)\n`;
       });
    }

    if (relevantBlogs.length > 0) {
       response += `\n**Bukti Portofolio:**\nSyaiful telah membagikan wawasannya tentang topik ini di artikel: *"${relevantBlogs[0].title}"*.\n`;
    }

    response += `\n\n> [!CAUTION]\n> **Disclaimer:** Analisis ini adalah estimasi otomatis berdasarkan korelasi data publik (artikel blog & soft skills). Hasil akhir sebaiknya dikonfirmasi melalui wawancara langsung.\n\n*Apakah Anda ingin menjadwalkan pertemuan atau melihat detail skill lainnya?*`;
    
    return response;
  }

function pickTemplate(category, contextData = {}) {
  const templates = RESPONSE_TEMPLATES[category] || ["Sesuatu yang menarik ditemukan..."];
  let template = templates[Math.floor(Math.random() * templates.length)];
  
  Object.keys(contextData).forEach(key => {
    template = template.replace(`{${key}}`, contextData[key]);
  });
  
  return template;
}

function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[b.length][a.length];
}

function findBestFuzzyMatch(query, list) {
  let bestMatch = null;
  let minDistance = 999;
  const cleanQuery = query.toLowerCase().trim();
  const queryLen = cleanQuery.length;

  // Adaptive Threshold Logic
  let threshold = 3; // Default
  if (queryLen <= 4) threshold = 0;
  else if (queryLen <= 8) threshold = 2;
  else if (queryLen <= 15) threshold = 4;
  else threshold = 5;

  for (const item of list) {
    const name = item.name.toLowerCase();
    const distance = getLevenshteinDistance(cleanQuery, name);
    if (distance < minDistance && distance <= threshold) {
      minDistance = distance;
      bestMatch = item;
    }
    for (const tag of (item.tags || [])) {
      const tagDist = getLevenshteinDistance(cleanQuery, tag.toLowerCase());
      if (tagDist < minDistance && tagDist <= threshold) {
        minDistance = tagDist;
        bestMatch = item;
      }
    }
  }
  return bestMatch;
}

function createExpBar(percentage) {
  const rounded = Math.round(percentage / 10);
  return '▓'.repeat(rounded) + '░'.repeat(10 - rounded);
}

const WELCOME_MESSAGE = {
  id: 'welcome',
  from: 'bot',
  text: 'Halo! Saya Orchestrator AI. Saya siap membantu Anda menganalisis skill Saipul secara mendalam. Anda bisa merujuk ke obrolan sebelumnya atau menggabungkan instruksi (misal: "Bandingkan Komunikasi dan Kreativitas, lalu tampilkan statistik Soft Skill").',
  timestamp: new Date().toISOString()
};

const DIFFICULTY_MAP = {
  'Hard': '🔴 Sulit',
  'Medium': '🟠 Sedang',
  'Easy': '🟢 Mudah'
};

export function useSoftSkillsAI(skills = []) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionContext, setSessionContext] = useState({
    entities: [],
    lastCategory: null,
    historyLog: [],
    sentiment: 0
  });

  const calculateIntentScores = (text, doc) => {
    const scores = {};
    Object.keys(INTENT_CONFIG).forEach(intent => {
      let score = 0;
      const config = INTENT_CONFIG[intent];
      
      // Keyword match
      config.keywords.forEach(kw => {
        if (text.includes(kw)) score += config.weight;
      });

      // NLP Match patterns
      if (intent === 'greeting' && doc.match('(halo|hai|hi|hello|p|permisi|pagi|siang|sore|malam)').found) score += 2;
      if (intent === 'help' && doc.match('(bantuan|tolong|help|bisa apa|fitur)').found) score += 2;
      if (intent === 'math' && doc.match('(selisih|beda|total|gabungan|plus|minus|difference|sum)').found) score += 2;
      if (intent === 'compare' && doc.match('(bandingkan|vs|bedanya|perbedaan|urutkan|ranking|sort)').found) score += 2;

      scores[intent] = score;
    });
    return scores;
  };

  const resolveEntities = (query, context) => {
    const found = [];
    const normalizedQuery = normalizeInput(query);
    const doc = nlp(normalizedQuery);
    
    // Explicit mention & Tag matching
    skills.forEach(s => {
      const nameMatch = normalizedQuery.includes(s.name.toLowerCase());
      const tagMatch = s.tags?.some(tag => normalizedQuery.includes(tag.toLowerCase()));
      const categoryMatch = normalizedQuery.includes(s.category.toLowerCase());
      
      if (nameMatch || tagMatch || categoryMatch) {
        found.push(s);
      }
    });

    // Pronoun resolution
    const hasPronoun = doc.match('(itu|tersebut|terakhir|kemarin|tadi|pertama|semuanya|both|keduanya|ia|dia|ini)').found;
    
    if ((found.length === 0 || hasPronoun) && context.entities.length > 0) {
      if (normalizedQuery.includes('semuanya') || normalizedQuery.includes('all')) return skills;
      if (normalizedQuery.includes('pertama')) return [context.entities[0]];
      
      // Intelligent fallback: Use recently talked about entities
      const relevantContext = context.entities.slice(-2);
      if (found.length === 0) return relevantContext;
      
      // Merge found with context if pronoun exists
      return Array.from(new Set([...found, ...relevantContext]));
    }

    // Fuzzy as fallback
    if (found.length === 0) {
      const match = findBestFuzzyMatch(normalizedQuery, skills);
      if (match) found.push(match);
    }

    return Array.from(new Set(found));
  };

  const getSingleResponse = (querySegment, context) => {
    const normalizedQuery = normalizeInput(querySegment);
    if (!normalizedQuery) return null;
    
    const doc = nlp(normalizedQuery);
    
    // 0. Negation Check
    const isNegative = doc.match('(bukan|tidak|jangan|bukanlah|no)').found;
    
    // 0.1 Implicit Context Check (Situational Logic)
    const isImplicit = IMPLICIT_CONFIG.keywords.some(kw => normalizedQuery === kw || normalizedQuery.startsWith(kw + ' '));
    if (isImplicit) {
      if (context.entities.length > 0) {
        const lastEntity = context.entities[context.entities.length - 1];
        const additionalInfo = lastEntity.examples?.length > 1 ? `\n\n**Implementasi Lainnya:**\n• ${lastEntity.examples.slice(1).join('\n• ')}` : "";
        return `Melanjutkan pembahasan mengenai **${lastEntity.name}**:\n${lastEntity.description}${additionalInfo}\n\n*Ada hal spesifik lain tentang ${lastEntity.name} yang ingin Anda ketahui?*`;
      } else {
        // Bootstrap Logic: If session is empty but user says "Lagi/More"
        const topEntity = skills[0] || { name: 'Soft Skill' };
        return `Sepertinya kita baru saja memulai sesi ini! Bagaimana jika kita membahas **${topEntity.name}** sebagai langkah awal analisis kita?`;
      }
    }

    // 1. Intent Analysis
    const scores = calculateIntentScores(normalizedQuery, doc);
    const bestIntent = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    // --- NEW: PREDICTIVE CONTEXT (Lazy Trigger) ---
    let predictivePrefix = "";
    if (context.history.length === 0) {
       const lastTopicStr = localStorage.getItem('saipul_ai_last_topic');
       if (lastTopicStr) {
          try {
             const lastTopic = JSON.parse(lastTopicStr);
             const fiveMinutes = 5 * 60 * 1000;
             if (Date.now() - lastTopic.timestamp < fiveMinutes) {
                predictivePrefix = `*Btw, saya lihat Anda baru saja tertarik dengan topik **${lastTopic.name}** di Blog. Senang bisa berdiskusi lebih lanjut!* \n\n`;
                // Clear to avoid repeating
                localStorage.removeItem('saipul_ai_last_topic');
             }
          } catch(e) {}
       }
    }

    // --- NEW: JOB MATCHING ENGINE ---
    if (bestIntent === 'jobMatching' && scores.jobMatching > 0.6) {
       return predictivePrefix + handleJobMatching(normalizedQuery);
    }
    
    // 1.1 Out-of-Scope (OOS) & Cross-Context Detection
    const genericKeywords = ['presiden', 'cuaca', 'berita', 'politik', 'makan', 'resep', 'lokasi', 'alamat', 'jam', 'tanggal', 'dunia', 'negara'];
    const isGeneric = genericKeywords.some(kw => normalizedQuery.includes(kw));

    // --- NEW: CROSS-CONTEXT LOOKUP ---
    const matchBlog = blogData.find(b => b.title.toLowerCase().includes(normalizedQuery) || (b.tags && b.tags.some(t => normalizedQuery.includes(t.toLowerCase()))));
    const matchFAQ = faqsData.find(f => f.question.toLowerCase().includes(normalizedQuery) || f.answer.toLowerCase().includes(normalizedQuery));
    const matchCommit = (commitmentsData.commitments || []).find(c => c.title.toLowerCase().includes(normalizedQuery) || c.desc.toLowerCase().includes(normalizedQuery));

    if (isGeneric || (scores[bestIntent] < 0.5 && !normalizedQuery.includes('saipul') && !normalizedQuery.includes('kamu'))) {
      if (matchBlog || matchFAQ || matchCommit) {
        let response = `Saya tidak menemukan data spesifik di kategori **Soft Skill**, tapi saya menemukan info yang relevan di bagian lain:\n\n`;
        if (matchBlog) response += `> 📝 **Blog:** Ada artikel menarik berjudul **"${matchBlog.title}"** yang mungkin menjawab rasa penasaran Anda.\n\n`;
        if (matchFAQ) response += `> ❓ **FAQ:** Masalah ini dibahas di FAQ: *"${matchFAQ.answer.substring(0, 150)}..."*\n\n`;
        if (matchCommit) response += `> 🤝 **Komitmen:** Ini berkaitan dengan komitmen Saipul: *"${matchCommit.desc}"*\n\n`;
        response += `*Ingin saya bantu carikan info lebih lanjut tentang itu di Google?* [Klik di sini](https://www.google.com/search?q=${encodeURIComponent(querySegment)})`;
        return response;
      }
      const searchLink = `https://www.google.com/search?q=${encodeURIComponent(querySegment)}`;
      return `Maaf, sebagai asisten cerdas portofolio Saipul, saya memiliki keterbatasan dalam menjawab pertanyaan umum tersebut.\n\nNamun, Anda dapat menemukan jawabannya di sini: [Cari di Google](${searchLink})`;
    }

    // 2. Context Extraction
    const targets = resolveEntities(querySegment, context);
    
    // If negative and has targets, filter them OUT or handle specifically
    if (isNegative && targets.length > 0) {
      return `Saya mengerti Anda ingin mengecualikan **${targets.map(t => t.name).join(', ')}**. Ada yang lain yang ingin ditanyakan?`;
    }

    // Sentiment check
    const sentiment = sentimentAnalyzer.analyze(normalizedQuery).score;
    let tonePrefix = "";
    if (sentiment < -1) tonePrefix = "Saya mengerti ini mungkin membingungkan. ";
    if (sentiment > 2) tonePrefix = "Wow, saya senang sekali Anda bertanya! ";

    // --- PIPELINE HANDLERS ---

    // GREETING & SIMPLE RESPONSES
    if (bestIntent === 'greeting') return tonePrefix + pickTemplate('greeting');
    if (bestIntent === 'thanks') return pickTemplate('thanks');
    if (bestIntent === 'identity') return pickTemplate('identity');
    if (bestIntent === 'help') return "Saya bisa membantu Anda dengan:\n1. **Statistik**: Rata-rata atau ranking skill per kategori.\n2. **Kalkulasi**: Menghitung selisih pengalaman antar skill.\n3. **Detail**: Tips, alasan pentingnya (Why), dan contoh penerapan.\n4. **Perbandingan**: Analisis head-to-head 2 unit atau lebih.";

    // MATH ENGINE
    if (bestIntent === 'math' && targets.length >= 2) {
      const s1 = targets[0];
      const s2 = targets[1];
      if (text.includes('selisih') || text.includes('beda') || text.includes('minus')) {
        const diff = Math.abs((s1.experience || 0) - (s2.experience || 0));
        return `Selisih pengalaman antara **${s1.name}** dan **${s2.name}** adalah **${diff}%**.`;
      }
      return `Total skor gabungan **${s1.name}** & **${s2.name}** adalah **${(s1.experience || 0) + (s2.experience || 0)}%**.`;
    }

    // RANKING / COMPARISON
    if (bestIntent === 'compare' || (bestIntent === 'stats' && targets.length >= 3)) {
      if (targets.length >= 3) {
        const sorted = [...targets].sort((a, b) => (b.experience || 0) - (a.experience || 0));
        return `**Ranking ${targets.length} Skill Teratas:**\n` + sorted.map((s, i) => `${i + 1}. **${s.name}** (${s.experience}%)`).join('\n');
      }
      if (targets.length === 2) {
        const [s1, s2] = targets;
        return `**Analisis Perbandingan: ${s1.name} vs ${s2.name}**\n` +
               `• Penguasaan: ${s1.experience}% vs ${s2.experience}%\n` +
               `• Level: ${s1.level} vs ${s2.level}\n` +
               `• Kesulitan: ${DIFFICULTY_MAP[s1.difficulty] || s1.difficulty} vs ${DIFFICULTY_MAP[s2.difficulty] || s2.difficulty}\n\n` +
               `*Kesimpulan: Saipul sedikit lebih unggul di bidang ${s1.experience > s2.experience ? s1.name : s2.name}.*`;
      }
    }

    // STATS
    if (bestIntent === 'stats') {
      const activeData = targets.length > 2 ? targets : sourceData;
      if (activeData.length === 0) return "Tidak ditemukan data untuk statistik tersebut.";
      const sorted = [...activeData].sort((a, b) => (b.experience || 0) - (a.experience || 0));
      const avg = (activeData.reduce((acc, s) => acc + (s.experience || 0), 0) / activeData.length).toFixed(1);
      const loc = targetCategory ? `dalam kategori **${targetCategory}**` : "keseluruhan";
      
      if (text.includes('tersulit') || text.includes('sulit')) {
        const hardest = activeData.find(s => s.difficulty === 'Hard') || sorted[sorted.length-1];
        return `Berdasarkan data, skill paling menantang ${loc} adalah **${hardest.name}**.`;
      }
      return `**Statistik ${loc}:**\n• Rata-rata: ${avg}%\n• Tertinggi: ${sorted[0].name} (${sorted[0].experience}%)\n• Jumlah: ${activeData.length} skill.`;
    }

    // COUNT & WHO
    if (bestIntent === 'count') return `Saya mendeteksi terdapat **${sourceData.length}** skill yang relevan dalam kategori tersebut.`;
    if (bestIntent === 'who') return `**Saipul** adalah pemilik portofolio ini. Ia mengintegrasikan keahlian teknis dengan soft skill yang solid.`;

    // INDIVIDUAL SKILL DETAILS
    if (targets.length > 0) {
      const s = targets[0];
      const recallPrefix = context.entities.some(e => e.name === s.name) ? pickTemplate('contextRecall', { entity: s.name }) + "\n\n" : "";

      if (bestIntent === 'why') return `${recallPrefix}**Mengapa ${s.name} Penting?**\n${s.description}\n\n*Dalam ekosistem kerja, ${s.name} membantu Saipul dalam mitigasi masalah dan kolaborasi tim.*`;
      if (bestIntent === 'how') return `${recallPrefix}**Strategi Pengembangan ${s.name}:**\n1. Eksperimen: "${s.examples?.[0]}"\n2. Refleksi diri secara berkala.\n3. Kursus atau literatur terkait.`;
      if (bestIntent === 'example') return `${recallPrefix}**Contoh Implementasi ${s.name}:**\n${s.examples?.map(ex => `• ${ex}`).join('\n')}`;
      
      // Default: Comprehensive Details
      const expBar = createExpBar(s.experience);
      const tags = s.tags?.map(t => `#${t}`).join(' ') || "";
      
      let baseResponse = `${recallPrefix}### **${s.name}**\n` +
             `*${s.category}*\n\n` +
             `**Visi:** ${s.description}\n\n` +
             `**Level:** ✨ ${s.level}\n` +
             `**Kesulitan:** ${DIFFICULTY_MAP[s.difficulty] || s.difficulty}\n` +
             `**Penguasaan:** \`${expBar}\` ${s.experience}%\n` +
             `${tags ? `\n> ${tags}\n` : ""}` +
             `\n*Anda bisa bertanya tentang "Tips" atau "Contoh" untuk skill ini.*`;

      // --- CROSS-CONTEXT ENRICHMENT (Enriching skill with Blogs/FAQ) ---
      const relatedBlog = blogData.find(b => (b.tags || []).some(t => t.toLowerCase() === s.name.toLowerCase()));
      if (relatedBlog) {
        baseResponse += `\n\n---\n💡 **Bacaan Terkait (Blog):**\nSyaiful juga menulis tentang ini di artikel **"${relatedBlog.title}"**. [Lihat Blog](/blog)`;
      }

      return baseResponse;
    }

    return pickTemplate('notFound');
  };

  const getResponse = useCallback((input) => {
    const rawText = input.toLowerCase();
    
    // 1. Segmentation (Handle multiple instructions & Exclusion)
    const segments = rawText.split(/\s+(?:dan|lalu|kemudian|serta|and|then|plus)\s+/);
    const results = [];
    let currentEntities = [...sessionContext.entities];

    // Handling "kecuali" in a simple way
    const exclusionMatch = rawText.match(/kecuali\s+(.+)/i);
    const excludedNames = exclusionMatch ? exclusionMatch[1].split(/,|dan/).map(n => n.trim().toLowerCase()) : [];

    // 2. Iteration
    segments.forEach(segment => {
      // Logic for "Analisis semua" or similar broad queries
      const isBroadQuery = segment.includes('semua') || segment.includes('seluruh') || segment.includes('list');
      
      let targets = resolveEntities(segment, { entities: currentEntities });
      
      // Filter out excluded entities
      if (excludedNames.length > 0) {
        targets = targets.filter(t => !excludedNames.some(name => t.name.toLowerCase().includes(name)));
      }

      const res = getSingleResponse(segment, { entities: currentEntities });
      if (res) {
        results.push(res);
        currentEntities = Array.from(new Set([...currentEntities, ...targets])).slice(-10);
      }
    });

    // Handle Broad Queries if results are empty or redundant
    if (rawText.includes('kecuali') && results.length > 0) {
      // Add a small hint about what was excluded
      results[0] = `(Menampilkan data dengan mengecualikan **${excludedNames.join(', ')}**)\n\n` + results[0];
    }

    // 3. Sentiment Update
    const sent = sentimentAnalyzer.analyze(rawText).score;

    // 4. Update Context
    setSessionContext(prev => ({
      ...prev,
      entities: currentEntities,
      historyLog: [...prev.historyLog, input].slice(-20), // Sliding window for history
      sentiment: (prev.sentiment + sent) / 2
    }));

    if (results.length > 0) return results.join('\n\n---\n\n');
    
    return pickTemplate('notFound');
  }, [skills, sessionContext]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, from: 'user', text, timestamp: new Date().toISOString() }]); 
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        from: 'bot',
        text: getResponse(text),
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    }, 800);
  }, [getResponse]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setSessionContext({ entities: [], lastCategory: null, historyLog: [], sentiment: 0 });
  }, []);

  const suggestions = useMemo(() => {
    if (sessionContext.entities.length > 0) {
      const s = sessionContext.entities[sessionContext.entities.length - 1];
      
      // Smart recommendation based on tags
      const related = skills.find(other => 
        other.id !== s.id && 
        other.tags?.some(t => s.tags?.includes(t))
      );

      const items = [`Tips ${s.name}`, `Contoh ${s.name}`];
      if (related) items.push(`Bandingkan dengan ${related.name}`);
      items.push("Statistik Kategori");
      
      return items;
    }
    return ["Analisis semua skill", "Berapa jumlah skill?", "Statistik Teratas", "Siapa Saipul?"];
  }, [sessionContext.entities, skills]);


  return { messages, isTyping, sendMessage, clearChat, suggestions };
}
