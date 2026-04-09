import { useState, useMemo, useEffect, useCallback, useRef, useReducer } from "react";
import nlp from "compromise";
import Fuse from "fuse.js";

// DATA IMPORTS (5-level up to src)
import projectsData from "../../../../../data/projects.json";
import eduData from "../../../../../data/pendidikan/data.json";
import blogsData from "../../../../../data/blog/data.json";
import softSkillsData from "../../../../../data/skills/softskills.json";

// SHARED COMPONENTS DATA (5-level up to src)
import faqsData from "../../../../../components/helpbutton/faq/data/faqs.json";
import commitmentsData from "../../../../../components/helpbutton/komit/data/commitments.json";

// ============================================================================
// KONSTANTA & DATA MASTERPIECE
// ============================================================================
const VIBE_MAP = {
  futuristik: ["Digital Islamic Gallery", "MyPortfolio Website"],
  edukatif: ["EduLearn Media", "Smart Teaching Tools"],
  minimalis: ["MyPortfolio Website", "EduLearn Media"],
  inovatif: ["Smart Teaching Tools", "Digital Islamic Gallery"]
};

const PROJECT_WISDOM = {
  vision: "Visi Syaiful adalah mendemokratisasi teknologi pendidikan agar bisa diakses secara inklusif melalui media interaktif.",
  philosophy: "Ia memegang prinsip 'Purpose-Driven Development'; setiap proyek dan kursus yang diambil harus menjawab kegelisahan nyata."
};

const SENTIMENT_POOLS = {
  positive: {
    intros: [
      "Luar biasa! Senang sekali Anda mengapresiasi perjalanan karir ini. Ini detailnya:",
      "Terima kasih atas energinya! Mari kita bedah kompetensi hebat ini bersama:",
      "Wah, antusiasme Anda sangat menular! Ini yang saya temukan di bank data saya:",
      "Satu kehormatan bisa berbagi progres ini dengan Anda. Lihat pencapaian ini:",
      "Energi positif Anda sangat terasa! Mari kita jelajahi mahakarya Syaiful ini:",
      "Luar biasa! Apresiasi Anda adalah bahan bakar inovasi kami. Ini ulasannya:",
      "Senang melihat Anda tertarik pada detail ini! Mari kita jelajahi rekam jejaknya:",
      "Mari kita rayakan keberhasilan teknis ini dengan melihat detail lebih dalam:",
      "Anda membawa vibe yang sangat produktif! Ini data yang Anda butuhkan:"
    ],
    closings: [
      "Senang bisa berbagi semangat ini! Ingin berkolaborasi dengan Syaiful? [Klik di sini]",
      "Apresiasi Anda sangat berarti bagi pengembangan inovasi ini. Ada yang lain?",
      "Syaiful sangat berdedikasi pada setiap ilmu yang didapatnya. Terus jelajahi!",
      "Pencapaian ini hanyalah awal. Apakah Anda ingin melihat visi masa depannya?",
      "Semangat kolaborasi dimulai dari apresiasi seperti ini. Mari kita diskusikan lebih lanjut!",
      "Terima kasih telah menghargai proses kreatif ini. Ada proyek lain yang membuat Anda penasaran?",
      "Syaiful selalu percaya bahwa dibalik apresiasi ada potensi kerjasama besar. Hubungi kami!",
      "Ingin melihat lebih banyak karya dengan standar tinggi ini? Jelajahi folder proyek lainnya.",
      "Apresiasi Anda adalah validasi terbaik bagi kerja keras Syaiful selama ini."
    ]
  },
  impressed: {
    intros: [
      "Wah, Anda tampak sangat terkesan! Mari saya tunjukkan lebih detail di balik layar:",
      "Pilihan yang tepat! Ini adalah salah satu milestone paling membanggakan Syaiful:",
      "Anda memiliki mata yang tajam untuk detail berkualitas. Ini ulasan lengkapnya:",
      "Kesan Anda sangat tepat! Proyek ini memang dirancang untuk memukau. Lihat detailnya:",
      "Anda baru saja menemukan salah satu permata di portofolio Syaiful! Ini ulasannya:"
    ],
    closings: [
      "Terkesima dengan teknologinya? Syaiful selalu terbuka untuk berbagi insight.",
      "Inovasi ini adalah hasil dari ribuan jam dedikasi. Menarik, bukan?",
      "Apakah Anda ingin melihat proyek lain dengan standar kualitas yang sama?",
      "Kualitas adalah harga mati bagi Syaiful. Ingin melihat bagaimana ini diimplementasikan di blog?",
      "Senang bisa memukau pengamat kritis seperti Anda. Masih ada banyak kejutan di sini!"
    ]
  },
  philosophical: {
    intros: [
      "Pertanyaan yang sangat mendalam. Sesuai dengan filosofi 'Purpose-Driven' Syaiful:",
      "Mari kita lihat makna di balik angka dan data ini melalui visi Syaiful:",
      "Menarik untuk menelaah sisi strategis dari pertanyaan Anda ini:",
      "Mari kita selami dimensi intelektual dari mahakarya ini bersama:",
      "Di balik setiap baris kode, ada filosofi kuat yang ingin Syaiful sampaikan:"
    ],
    closings: [
      "Syaiful percaya bahwa teknologi tanpa visi adalah hampa. Bagaimana menurut Anda?",
      "Setiap baris kode di sini ditulis dengan tujuan nyata. Apakah ini searah dengan Anda?",
      "Visi ini terus berkembang. Mari kita jadikan ini bagian dari diskusi masa depan.",
      "Inovasi sejati berakar pada nilai yang kuat. Apakah Anda melihat nilai tersebut di sini?",
      "Mari kita ciptakan masa depan yang bermakna melalui teknologi yang berdampak."
    ]
  },
  spiritual: {
    intros: [
      "MasyaAllah, pertanyaan Anda menyentuh sisi spiritual dari dedikasi Syaiful:",
      "Bismillah, mari kita lihat bagaimana nilai-nilai luhur diintegrasikan ke dalam teknologi:",
      "Ini adalah upaya Syaiful untuk mensinergikan iman dan teknologi digital:",
      "Menarik melihat ketertarikan Anda pada aspek keberkahan di setiap karya ini:"
    ],
    closings: [
      "Semoga teknologi ini menjadi wasilah kebaikan bagi banyak orang. Aamiin.",
      "Bagi Syaiful, kode adalah dakwah visual. Apakah Anda merasakan ketenangan di sini?",
      "Ingin berdiskusi lebih lanjut tentang Digital Islamic Inovasi bersama Syaiful?",
      "Semoga apa yang kita jelajahi hari ini membawa manfaat dunia dan akhirat."
    ]
  },
  technical: {
    intros: [
      "Analisis teknis yang tajam! Mari kita bedah stack dan arsitekturnya secara mendalam:",
      "Senang berdiskusi dengan sesama rekan teknis. Ini detail framework dan logic-nya:",
      "Mari kita masuk ke mode 'developer' dan membedah struktur data di balik ini:",
      "Anda bertanya tentang hal yang sangat spesifik. Mari kita lihat kode dan performanya:"
    ],
    closings: [
      "Performa adalah prioritas utama kami. Ada bagian optimasi lain yang ingin Anda bahas?",
      "Ingin melihat repository atau arsitektur sistem ini lebih detail di GitHub?",
      "Syaiful selalu terbuka untuk 'code review' dan diskusi arsitektur tingkat tinggi.",
      "Apakah analisis teknis ini sudah menjawab rasa penasaran engineer Anda?"
    ]
  },
  puzzled: {
    intros: [
      "Jangan khawatir, mari saya bantu uraikan konsep ini agar lebih jelas dan inklusif:",
      "Memang cukup menantang secara teknis, ini versi sederhananya untuk Anda:",
      "Mari kita bedah langkah demi langkah agar Anda paham jalurnya dengan mudah:",
      "Ada kebingungan? Syaiful selalu percaya bahwa teknologi harus memudahkan, bukan mempersulit. Ini penjelasannya:",
      "Tenang, saya di sini untuk menyederhanakan kompleksitas data ini untuk Anda:",
      "Terima kasih telah bertanya. Mari kita buat informasi ini menjadi lebih ringan:",
      "Kebingungan adalah awal dari pemahaman. Mari kita luruskan konteksnya bersama:",
      "Kadang data bisa terasa berat. Mari saya bawakan dengan bahasa yang lebih sederhana:"
    ],
    closings: [
      "Apakah penjelasan konteks ini cukup membantu mencerahkan Anda?",
      "Masih bingung? Syaiful sangat senang berdiskusi secara langsung lewat halaman kontak.",
      "Ingin saya jelaskan bagian sertifikasi atau proyek lainnya dengan bahasa yang lebih santai?",
      "Kesederhanaan adalah kunci. Apakah ulasan ini sudah cukup ringkas bagi Anda?",
      "Jangan ragu untuk bertanya lagi sampai Anda benar-benar mendapatkan gambaran utuhnya.",
      "Syaiful sangat terbuka untuk sesi diskusi jika Anda masih membutuhkan klarifikasi.",
      "Tugas saya adalah memastikan Anda pulang dengan jawaban yang memuaskan.",
      "Masih merasa ada yang mengganjal? Mari kita coba dari sudut pandang yang berbeda."
    ]
  },
  curious: {
    intros: [
      "Rasa ingin tahu adalah awal dari inovasi! Inilah informasi yang Anda cari:",
      "Pertanyaan bagus! Mari kita selami lebih dalam data portofolio ini:",
      "Saya suka antusiasme Anda untuk menggali lebih dalam. Ini detail rahasianya:",
      "Keingintahuan Anda sangat diapresiasi! Mari kita buka lembaran detailnya:",
      "Penasaran dengan cara kerjanya? Mari kita telusuri jejak digital Syaiful:"
    ],
    closings: [
      "Masih ingin menggali lebih dalam? Ada banyak lapisan menarik di portofolio ini.",
      "Rasa penasaran Anda memotivasi kami. Ingin berdiskusi teknis dengan Syaiful?",
      "Apakah informasi ini cukup untuk memuaskan keingintahuan Anda untuk saat ini?",
      "Teruslah menggali! Selalu ada detail baru di setiap sudut portofolio Syaiful.",
      "Ingin tahu lebih banyak tentang blog atau sertifikasi lainnya? Saya siap membantu."
    ]
  },
  neutral: {
    intros: [
      "Tentu, mari kita telaah data portofolio dan nuansa kalimat Anda secara objektif:",
      "Berdasarkan catatan teknis dan pendalaman konteks kami, berikut ulasan faktualnya:",
      "Menarik, ini informasi mendalam yang bisa saya sampaikan dari pusat data:",
      "Menjawab pertanyaan Anda, berikut adalah poin-poin penting yang saya temukan:",
      "Mari kita tinjau rekam jejak digital Syaiful terkait hal ini secara mendalam:",
      "Ini adalah data yang mencerminkan realitas perjalanan karir Syaiful:",
      "Berdasarkan query Anda, berikut adalah ulasan yang berhasil saya petakan:",
      "Menelaah database masterpiece Syaiful, saya menemukan informasi berikut:"
    ],
    closings: [
      "Ada detail teknis, visi, atau kursus lain yang ingin Anda jelajahi lebih lanjut?",
      "Semoga ulasan konteks ini memberikan gambaran kompetensi yang jelas bagi Anda.",
      "Ingin melihat bagaimana kursus ini membantu Syaiful di dunia nyata untuk menjawab tantangan?",
      "Informasi ini selalu diperbarui sesuai dengan progres terbaru Syaiful. Ada lagi?",
      "Semoga ini memberikan perspektif yang berguna bagi perjalanan eksplorasi portofolio Anda.",
      "Masih ada banyak data yang bisa kita bedah. Ingin pindah ke topik blog atau FAQ?",
      "Ulasan data ini didukung oleh fakta dan bukti karya nyata Syaiful.",
      "Mari kita lanjutkan penjelajahan jika Anda masih membutuhkan informasi tambahan."
    ]
  }
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
};

const generateDynamicIntro = (sentiment, context, isFollowUp) => {
  const greeting = getTimeBasedGreeting();
  if (isFollowUp && context.currentTopic) {
    return `${greeting}! Baik, mari kita lanjutkan eksplorasi tentang **${context.currentTopic}**.`;
  }
  return `${greeting}! ` + pickRandom(SENTIMENT_POOLS[sentiment]?.intros || SENTIMENT_POOLS.neutral.intros);
};

const generateDynamicOutro = (sentiment, ctaSuggestion) => {
  if (ctaSuggestion) {
    return "✨ Tertarik dengan rekam jejak teknis Syaiful? Syaiful sangat terbuka untuk diskusi kolaborasi di halaman Kontak!";
  }
  return pickRandom(SENTIMENT_POOLS[sentiment]?.closings || SENTIMENT_POOLS.neutral.closings);
};

// ============================================================================
// KNOWLEDGE GRAPH ENGINE (Integrated all domains)
// ============================================================================
const buildKnowledgeGraph = (projects, courses, blogs, skills) => {
  const graph = {
    projects: new Map(),
    courses: new Map(),
    blogs: new Map(),
    skills: new Map(),
    relations: []
  };
  
  projects.forEach(proj => {
    graph.projects.set(proj.id || proj.title, proj);
    proj.tech?.forEach(tech => {
      if (!graph.skills.has(tech)) graph.skills.set(tech, new Set());
      graph.skills.get(tech).add(proj.id || proj.title);
    });
  });
  
  courses.forEach(course => {
    graph.courses.set(course.id || course.title, course);
    course.skills_learned?.forEach(skill => {
      if (!graph.skills.has(skill)) graph.skills.set(skill, new Set());
      graph.skills.get(skill).add(course.id || course.title);
    });
  });

  blogs.forEach(blog => {
    graph.blogs.set(blog.slug || blog.title, blog);
    blog.tags?.forEach(tag => {
      if (!graph.skills.has(tag)) graph.skills.set(tag, new Set());
      graph.skills.get(tag).add(blog.slug || blog.title);
      
      // Virtual Blog-to-Project link via tags
      projects.forEach(proj => {
        if (proj.tech?.includes(tag) || proj.tags?.includes(tag)) {
          graph.relations.push({
            type: 'BLOG_PROJECT_TAG_LINK',
            blogId: blog.slug || blog.title,
            projectId: proj.id || proj.title,
            tag: tag
          });
        }
      });
    });
  });

  if (skills?.skills) {
    skills.skills.forEach(s => {
      if (!graph.skills.has(s.name)) graph.skills.set(s.name, new Set());
      s.tags?.forEach(tag => {
        if (!graph.skills.has(tag)) graph.skills.set(tag, new Set());
      });
    });
  }
  
  // Link projects and courses by skills
  projects.forEach(proj => {
    const projSkills = new Set(proj.tech);
    courses.forEach(course => {
      const courseSkills = new Set(course.skills_learned);
      const intersection = [...projSkills].filter(s => courseSkills.has(s));
      if (intersection.length > 0) {
        graph.relations.push({
          type: 'PROJECT_COURSE_SKILL_MATCH',
          projectId: proj.id || proj.title,
          courseId: course.id || course.title,
          sharedSkills: intersection
        });
      }
    });
  });
  
  return graph;
};

// ============================================================================
// DIALOG STATE MACHINE
// ============================================================================
const initialState = {
  entities: [],           
  history: [],            
  currentTopic: null,     
  lastMentioned: { project: null, course: null, skill: null, blog: null, faq: null },
  pendingClarification: null, 
  userPreferences: { detailLevel: 'medium', preferredTopics: [] },
  turnCount: 0
};

const dialogReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_QUERY':
      return { ...state, history: [...state.history, action.payload], turnCount: state.turnCount + 1 };
    case 'SET_ENTITIES':
      return {
        ...state,
        entities: action.payload,
        lastMentioned: {
          project: action.payload.find(e => e.type === 'project')?.data || state.lastMentioned.project,
          course: action.payload.find(e => e.type === 'course')?.data || state.lastMentioned.course,
          skill: action.payload.find(e => e.type === 'skill')?.data || state.lastMentioned.skill,
          blog: action.payload.find(e => e.type === 'blog')?.data || state.lastMentioned.blog,
          faq: action.payload.find(e => e.type === 'faq')?.data || state.lastMentioned.faq
        }
      };
    case 'SET_CURRENT_TOPIC': return { ...state, currentTopic: action.payload };
    case 'REQUEST_CLARIFICATION': return { ...state, pendingClarification: action.payload };
    case 'RESOLVE_CLARIFICATION': return { ...state, pendingClarification: null };
    case 'UPDATE_PREFERENCES': return { ...state, userPreferences: { ...state.userPreferences, ...action.payload } };
    case 'RESET': return initialState;
    default: return state;
  }
};

// ============================================================================
// CONTEXTUAL SENSITIVITY ENGINE (v9.0)
// ============================================================================
const analyzeQueryAdvanced = (text, context, knowledgeGraph) => {
  const doc = nlp(text.toLowerCase());
  const sentiment = detectSentiment(text, context);
  
  // SEMANTIC MODIFIERS
  const modifiers = {
    isLearning: /\b(belajar|kursus|kelas|serti|pendidikan|pelatihan|studi|ingin tahu cara)\b/i.test(text),
    isEvaluation: /\b(bagaimana|apa dampak|bagus|jelek|rating|kualitas|berhasil|sukses)\b/i.test(text),
    isRelational: /\b(kaitan|hubungan|relasi|terkait|berdasarkan|banding|sama dengan)\b/i.test(text),
    isAction: /\b(tampilkan|cari|sebutkan|daftar|list|tunjukkan|buka)\b/i.test(text)
  };

  const intent = classifyIntentAdvanced(text, doc, context, modifiers);
  const explicit = extractExplicitEntitiesAdvanced(text, doc, knowledgeGraph);
  const referenced = resolveContextReferenceAdvanced(text, context, knowledgeGraph);
  
  let resolvedEntities = referenced ? [referenced] : explicit;
  const needsClarification = checkIfClarificationNeeded(intent, resolvedEntities, text);
  const preferences = extractPreferences(text);
  
  return {
    doc, sentiment, intent, explicitEntities: explicit,
    referencedEntity: referenced, resolvedEntities,
    isFollowUp: referenced !== null || /(itu|tadi|sebelumnya|yang|tersebut|dia|nya)\b/.test(text),
    needsClarification, preferences, modifiers
  };
};

const detectSentiment = (text, context) => {
  if (/(keren|hebat|wow|suka|mantap|luar|banget|good|nice|top|mantul)/i.test(text)) return 'positive';
  if (/(bingung|pusing|sulit|susah|mana|gimana|cara|maksud|bantu|jelaskan|tidak paham|kurang jelas)/i.test(text)) return 'puzzled';
  return 'neutral';
};

const classifyIntentAdvanced = (text, doc, context, modifiers) => {
  const norm = text.toLowerCase();
  
  // 1. DYNAMIC SEMANTIC OVERRIDES
  if (modifiers.isLearning && /\bskills?\b/i.test(norm)) return { type: 'COURSE_INQUIRY', slots: {} };
  if (modifiers.isEvaluation && /\bskills?\b/i.test(norm)) return { type: 'IMPACT_INQUIRY', slots: {} };
  if (modifiers.isRelational) return { type: 'RELATION_INQUIRY', slots: {} };

  // 2. High-Specific Intents
  if (/\b(soft\s*skills?|kecakapan|interpersonal|adaptasi|komunikasi)\b/i.test(norm)) return { type: 'SKILL_INQUIRY', slots: {} };
  if (/\b(visi|filosofi|prinsip|tujuan|pandangan)\b/i.test(norm)) return { type: 'VISION_INQUIRY', slots: {} };
  if (/\b(blog|artikel|tulisan|post|kabar)\b/i.test(norm)) return { type: 'BLOG_INQUIRY', slots: {} };
  if (/\b(faq|tanya|jawab|pertanyaan|bantuan|tanya-jawab)\b/i.test(norm)) return { type: 'FAQ_INQUIRY', slots: {} };
  if (/\b(komitmen|janji|moral|prinsip kerja)\b/i.test(norm)) return { type: 'COMMITMENT_INQUIRY', slots: {} };
  
  if (/\b(futuristik|edukatif|minimalis|inovatif)\b/i.test(norm)) {
    return { type: 'VIBE_INQUIRY', vibe: Object.keys(VIBE_MAP).find(v => norm.includes(v)) };
  }

  if (/\b(proyek|project|portfolio|karya|aplikasi|buat)\b/i.test(norm)) return { type: 'PROJECT_INQUIRY', slots: { specific: null } };
  if (/\b(kursus|pelatihan|sertifikat|belajar|kelas|pendidikan|sekolah)\b/i.test(norm)) return { type: 'COURSE_INQUIRY', slots: { specific: null } };
  
  if (/\b(siapa|profil|tentang|kompetensi|kapasitas|biodata|cv|resume)\b/i.test(norm)) return { type: 'PROFILE_INQUIRY', slots: {} };
  if (/\bskills?\b/i.test(norm)) return { type: 'PROFILE_INQUIRY', slots: {} };

  if (/\b(fitur|bisa|fungsi|kemampuan|guna|manfaat)\b/i.test(norm)) return { type: 'FEATURE_INQUIRY', slots: {} };
  if (/\b(tech|teknologi|stack|bahasa|pemrograman|framework|library)\b/i.test(norm)) return { type: 'TECH_INQUIRY', slots: {} };
  if (/\b(dampak|hasil|impact|benefit)\b/i.test(norm)) return { type: 'IMPACT_INQUIRY' };
  if (/\b(kapan|waktu|timeline|durasi|proses)\b/i.test(norm)) return { type: 'TIMELINE_INQUIRY' };
  
  if (/\b(salam|halo|hai|selamat|pagi|siang|sore|malam)\b/i.test(norm) && norm.length < 15) return { type: 'GREETING', slots: {} };
  
  const lastIntent = context.history[context.history.length - 1]?.intent?.type;
  if (lastIntent && /\b(lanjut|detail|lebih|jelaskan|terus|lagi)\b/i.test(norm)) return { type: `CONTINUE_${lastIntent}`, slots: {} };
  
  return { type: 'GENERAL_INQUIRY', slots: {} };
};

const extractExplicitEntitiesAdvanced = (text, doc, knowledgeGraph) => {
  const entities = [];
  const nouns = doc.nouns().out('array');
  const ignoreList = ['proyek', 'project', 'kursus', 'course', 'pelatihan', 'pendidikan', 'keahlian', 'skill', 'sertifikat', 'sertifikasi', 'blog', 'artikel', 'faq'];
  
  nouns.forEach(noun => {
    const n = noun.toLowerCase().trim();
    if (n.length < 3 || ignoreList.includes(n)) return;
    
    const projMatch = [...knowledgeGraph.projects.values()].find(p => p.title.toLowerCase().includes(n) || n.includes(p.title.toLowerCase().substring(0, 5)));
    if (projMatch) { if (!entities.some(e => e.value === projMatch.title)) entities.push({ type: 'project', value: projMatch.title, data: projMatch }); return; }
    
    const courseMatch = [...knowledgeGraph.courses.values()].find(c => c.title.toLowerCase().includes(n) || n.includes(c.title.toLowerCase().substring(0, 5)));
    if (courseMatch) { if (!entities.some(e => e.value === courseMatch.title)) entities.push({ type: 'course', value: courseMatch.title, data: courseMatch }); return; }

    const blogMatch = [...knowledgeGraph.blogs.values()].find(b => b.title.toLowerCase().includes(n) || n.includes(b.title.toLowerCase().substring(0, 5)));
    if (blogMatch) { if (!entities.some(e => e.value === blogMatch.title)) entities.push({ type: 'blog', value: blogMatch.title, data: blogMatch }); return; }
    
    if (knowledgeGraph.skills.has(n)) { if (!entities.some(e => e.value === n)) entities.push({ type: 'skill', value: n, data: n }); }
  });
  return entities;
};

const resolveContextReferenceAdvanced = (text, context, knowledgeGraph) => {
  if (!/(itu|tadi|sebelumnya|yang|tersebut|dia|nya|proyek|kursus|blog|faq)\b/i.test(text)) return null;
  if (context.lastMentioned.project) return { type: 'project', value: context.lastMentioned.project.title, data: context.lastMentioned.project };
  if (context.lastMentioned.course) return { type: 'course', value: context.lastMentioned.course.title, data: context.lastMentioned.course };
  if (context.lastMentioned.blog) return { type: 'blog', value: context.lastMentioned.blog.title, data: context.lastMentioned.blog };
  return null;
};

const checkIfClarificationNeeded = (intent, resolvedEntities, text) => {
  const requiresSpecificEntity = ['FEATURE_INQUIRY', 'TECH_INQUIRY', 'IMPACT_INQUIRY', 'TIMELINE_INQUIRY'].includes(intent.type);
  if (requiresSpecificEntity && resolvedEntities.length === 0) {
    return { question: "Mohon maaf, konteks kalimat Anda merujuk pada detail spesifik. Bisa sebutkan nama proyek atau kursus yang dimaksud?", options: null };
  }
  if (resolvedEntities.length > 1) {
    return { question: "Saya menangkap beberapa konteks berbeda. Mana yang ingin Anda bahas?", options: resolvedEntities.map(e => e.value) };
  }
  return null;
};

const extractPreferences = (text) => {
  const prefs = {};
  if (/(detail|rinci|jelas|mendalam)/i.test(text)) prefs.detailLevel = 'high';
  if (/(singkat|ringkas|cepat)/i.test(text)) prefs.detailLevel = 'low';
  return prefs;
};

// ============================================================================
// MAIN HOOK
// ============================================================================
export const useProjectAI = (searchTerm, debounceDelay = 300) => {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [aiResponse, setAiResponse] = useState(null);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [dialogState, dispatch] = useReducer(dialogReducer, initialState);
  
  const timeoutRef = useRef(null);
  const debounceRef = useRef(null);

  const projects = useMemo(() => projectsData.projects || [], []);
  const courses = useMemo(() => eduData.courses || [], []);
  const blogs = useMemo(() => blogsData || [], []);
  const faqs = useMemo(() => faqsData || [], []);
  const commits = useMemo(() => commitmentsData.commitments || [], []);
  const skills = useMemo(() => softSkillsData.skills || [], []);

  const knowledgeGraph = useMemo(() => buildKnowledgeGraph(projects, courses, blogs, softSkillsData), [projects, courses, blogs]);
  
  const fusePro = useMemo(() => new Fuse(projects, { keys: ["title", "overview", "tech", "tags"], threshold: 0.35 }), [projects]);
  const fuseEdu = useMemo(() => new Fuse(courses, { keys: ["title", "provider", "skills_learned"], threshold: 0.35 }), [courses]);
  const fuseBlog = useMemo(() => new Fuse(blogs, { keys: ["title", "category", "tags", "excerpt"], threshold: 0.35 }), [blogs]);
  const fuseFaq = useMemo(() => new Fuse(faqs, { keys: ["question", "answer"], threshold: 0.35 }), [faqs]);

  const profileSummary = useMemo(() => {
    const techCounts = {}; projects.forEach(p => p.tech?.forEach(t => techCounts[t] = (techCounts[t] || 0) + 1));
    const topTech = Object.entries(techCounts).sort((a,b) => b[1] - a[1]).slice(0, 3).map(i => i[0]);
    return { topTech, totalPro: projects.length, totalCert: courses.length, totalBlog: blogs.length };
  }, [projects, courses, blogs]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedTerm(searchTerm), debounceDelay);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, debounceDelay]);

  const generateResponse = useCallback((term, state) => {
    if (!term || term.trim().length < 2) return null;

    const analysis = analyzeQueryAdvanced(term, state, knowledgeGraph);
    const { intent, resolvedEntities, sentiment, isFollowUp, needsClarification, preferences, modifiers } = analysis;
    
    if (Object.keys(preferences).length) dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    
    if (needsClarification) {
      dispatch({ type: 'REQUEST_CLARIFICATION', payload: needsClarification });
      setAiResponse({ query: term, answer: `${needsClarification.question}${needsClarification.options ? '\n- ' + needsClarification.options.join('\n- ') : ''}`, sentiment: 'neutral', sessionId: "CLAR-" + Math.random().toString(36).substring(2, 7).toUpperCase(), isClarification: true });
      return null;
    }
    
    if (state.pendingClarification) dispatch({ type: 'RESOLVE_CLARIFICATION' });

    let matchedProject = resolvedEntities.find(e => e.type === 'project')?.data || (isFollowUp ? state.lastMentioned.project : null);
    let matchedCourse = resolvedEntities.find(e => e.type === 'course')?.data || (isFollowUp ? state.lastMentioned.course : null);
    let matchedBlog = resolvedEntities.find(e => e.type === 'blog')?.data || fuseBlog.search(term).map(r => r.item)[0];
    
    const answers = [];
    let insightType = "general";
    let ctaSuggestion = false;
    let newTopic = '';
    const aiResponseData = { query: term, sentiment, sessionId: "CONTEXT-" + Math.random().toString(36).substring(2, 7).toUpperCase(), insightType, profileSummary };

    switch (intent.type) {
      case 'VISION_INQUIRY':
        answers.push(`**Visi Syaiful**: ${PROJECT_WISDOM.vision}\n\n**Filosofi Pengembangan**: ${PROJECT_WISDOM.philosophy}`);
        newTopic = "Visi & Filosofi";
        break;
      case 'BLOG_INQUIRY':
      case 'CONTINUE_BLOG_INQUIRY':
        if (matchedBlog) {
          answers.push(`Berdasarkan konteks kalimat Anda, blog **"${matchedBlog.title}"** adalah yang paling relevan. \n\n${matchedBlog.excerpt}`);
          newTopic = matchedBlog.title;
        } else {
          answers.push(`Syaiful aktif menulis di blog dengan total **${blogs.length} artikel**. Topik utamanya meliputi ${Array.from(new Set(blogs.map(b => b.category))).slice(0, 3).join(", ")}.`);
          // Populate list for gallery
          aiResponseData.relatedBlogs = blogs.slice(0, 3);
        }
        insightType = "vibe";
        break;
      case 'FAQ_INQUIRY':
        const faqMatch = fuseFaq.search(term).map(r => r.item)[0];
        if (faqMatch) answers.push(`**T**: ${faqMatch.question}\n**J**: ${faqMatch.answer}`);
        else answers.push("Gunakan menu FAQ untuk bantuan navigasi atau pertanyaan teknis portofolio.");
        break;
      case 'COMMITMENT_INQUIRY':
        const commitMatch = commits.find(c => term.toLowerCase().includes(c.title.toLowerCase()) || c.desc.toLowerCase().includes(term.toLowerCase())) || commits[0];
        answers.push(`**Komitmen Syaiful**: ${commitMatch.title}. \n\n${commitMatch.desc}`);
        break;
      case 'SKILL_INQUIRY':
        const skillMatch = skills.find(s => term.toLowerCase().includes(s.name.toLowerCase()));
        if (skillMatch) answers.push(`**${skillMatch.name}**: ${skillMatch.description} (Level: ${skillMatch.level})`);
        else answers.push(`Dalam aspek interpersonal, Syaiful memiliki soft skill seperti **${skills.slice(0, 3).map(s => s.name).join(", ")}**.`);
        break;
      case 'PROFILE_INQUIRY':
        answers.push(`Secara keseluruhan, Syaiful mengelola **${profileSummary.totalPro} proyek**, **${profileSummary.totalCert} sertifikasi**, dan **${profileSummary.totalBlog} artikel**. Keahlian utamanya: **${profileSummary.topTech.join(", ")}**.`);
        ctaSuggestion = true;
        break;
      case 'PROJECT_INQUIRY':
      case 'CONTINUE_PROJECT_INQUIRY':
        if (matchedProject) {
          answers.push(`**${matchedProject.title}**: ${matchedProject.overview}`);
          if (state.userPreferences.detailLevel === 'high') answers.push(`\n🔧 Tech: ${matchedProject.tech.join(", ")}\n✨ Impact: ${matchedProject.impact}`);
          newTopic = matchedProject.title;
          if (matchedProject.rating >= 4.8) ctaSuggestion = true;
        } else {
          answers.push(`Syaiful memiliki beragam portofolio. Berikut adalah beberapa mahakarya terbaru kami:`);
          aiResponseData.relatedProjects = projects.slice(0, 3);
        }
        break;
      case 'COURSE_INQUIRY':
      case 'CONTINUE_COURSE_INQUIRY':
        if (matchedCourse) {
          answers.push(`**${matchedCourse.title}** (${matchedCourse.provider}). Pelatihan ini mendalami: ${matchedCourse.skills_learned.join(", ")}.`);
          newTopic = matchedCourse.title;
        } else {
          answers.push("Terdapat berbagai sertifikasi pendidikan yang menunjang rekam jejak profesional Syaiful. Berikut daftar terbarunya:");
          aiResponseData.relatedCourses = courses.slice(0, 3);
        }
        break;
      case 'IMPACT_INQUIRY':
        if (matchedProject) { answers.push(`Dampak nyata **${matchedProject.title}**: ${matchedProject.impact}.`); insightType = "impact"; }
        else if (matchedCourse) answers.push(`Hasil dari kursus ini adalah penguasaan skill: ${matchedCourse.skills_learned.join(", ")}.`);
        else answers.push("Setiap langkah Syaiful didasari pada keinginan untuk menjawab tantangan nyata.");
        break;
      case 'RELATION_INQUIRY':
        const virtualRel = knowledgeGraph.relations.find(r => r.blogId === matchedBlog?.title || r.projectId === matchedProject?.title);
        if (virtualRel) answers.push(`Konteks kalimat Anda menghubungkan **${matchedBlog?.title || matchedProject?.title}** melalui kesamaan tag: **${virtualRel.tag || virtualRel.sharedSkills?.join(", ")}**.`);
        else answers.push("Data kami saling terhubung melalui ekosistem teknologi yang konsisten.");
        break;
      case 'GREETING':
        answers.push(`Halo! Saya asisten master yang kini dibekali pemahaman konteks kalimat. Anda bisa bertanya tentang apapun di portofolio Syaiful.`);
        break;
      default:
        answers.push("Maaf, kalimat Anda memiliki nuansa yang sedang saya pelajari. Bisakah Anda memperjelas apakah ini tentang proyek, blog, atau skill?");
    }

    const intro = generateDynamicIntro(sentiment, state, isFollowUp);
    const outro = generateDynamicOutro(sentiment, ctaSuggestion);
    const answer = `${intro}\n\n${answers.join("\n")}\n\n${outro}`;
    
    dispatch({ type: 'ADD_QUERY', payload: { text: term, intent: intent.type, sentiment, timestamp: Date.now() } });
    const entities = [];
    if (matchedProject) entities.push({ type: 'project', data: matchedProject });
    if (matchedCourse) entities.push({ type: 'course', data: matchedCourse });
    if (matchedBlog) entities.push({ type: 'blog', data: matchedBlog });
    if (entities.length) dispatch({ type: 'SET_ENTITIES', payload: entities });
    if (newTopic) dispatch({ type: 'SET_CURRENT_TOPIC', payload: newTopic });

    aiResponseData.answer = answer;
    aiResponseData.matchedProject = matchedProject;
    aiResponseData.matchedCourse = matchedCourse;
    aiResponseData.matchedBlog = matchedBlog;
    
    setAiResponse(aiResponseData);
  }, [knowledgeGraph, profileSummary, projects, blogs, fuseBlog, fuseFaq, commits, skills, courses]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!debouncedTerm || debouncedTerm.trim().length < 2) { setAiResponse(null); setIsThinking(false); setThinkingStep(0); return; }
    setIsThinking(true); setThinkingStep(1);
    timeoutRef.current = setTimeout(() => {
      setThinkingStep(2);
      timeoutRef.current = setTimeout(() => {
        setThinkingStep(3);
        timeoutRef.current = setTimeout(() => {
          try { generateResponse(debouncedTerm, dialogState); } catch (e) { console.error(e); } finally { setIsThinking(false); setThinkingStep(0); }
        }, 800);
      }, 700);
    }, 600);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [debouncedTerm, generateResponse]);

  return { isThinking, thinkingStep, aiResponse, resetContext: () => dispatch({ type: 'RESET' }), dialogState };
};