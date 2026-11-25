/**
 * Universal Knowledge Base Hub
 * Menggabungkan seluruh data JSON mentah proyek ke dalam 1 Single Source of Truth
 * untuk digunakan oleh seluruh agen AI (SaipulAI, Blog AI, Project AI, SoftSkills AI, FAQ AI).
 */

import {
  projectsData,
  softskillsData,
  specializationsData,
  experiencesData,
  docsSectionsData,
  plannedVersionsData,
  commitmentsData,
  faqsData,
  profileData,
  cardsData,
  certificatesData,
  collaborationsData,
  hobbiesData,
  chatHobbiesData,
  interestsData,
  aiBaseData,
  testimonialsData,
  languagesData,
  educationData,
  blogsData,
  photosData,
  aiDocData,
  riwayatData,
  galleryData,
  galleryAlbumsData,
  galleryImagesData,
  galleryShortsData,
  galleryVideosData,
  streamingVideosData,
  streamingShortsData,
  comingSoonData,
  maintenanceData,
  qodamData,
  zodiacData,
  visiData,
  streamingUserData,
} from '#kb-datasets';
import { getAuthorProfiles } from '../../pages/blog/services/authorProfileService.js';
import { getCachedMessages } from '../../pages/live/utils/cacheManager.js';
import { kknOverview, kknStats, kknOutputs, kknPillars } from '../../pages/akademik/sarjana/kkn/data/kknData.js';
import { getLearnedBenchmarkKnowledge } from './benchmarkLearner.js';

// Data Visi, Misi & Minat Bakat (dari halaman /visi dan src/data/visi/data.json)
export const visiMisiData = {
  visi: visiData?.visi?.segments?.map(s => s.text).join('') || "Menjadi pendidik dan kreator media edukatif yang adaptif terhadap kemajuan teknologi dan inovasi digital, sekaligus menginspirasi melalui pembelajaran kreatif, interaktif, dan berdampak. Berkomitmen menciptakan solusi edukasi yang inklusif, berkelanjutan, dan memberikan manfaat positif bagi individu maupun masyarakat luas.",
  misi: Array.isArray(visiData?.misi?.items) ? visiData.misi.items : [
    "Menciptakan solusi digital yang relevan & bermanfaat bagi masyarakat.",
    "Membangun ruang kolaboratif dan edukatif untuk kreator muda dan pendidik.",
    "Terus belajar, bereksperimen, dan berinovasi tanpa batas dalam arsitektur modern.",
    "Berkontribusi positif melalui integrasi teknologi mutakhir dan empati kemanusiaan."
  ],
  minatBakat: Array.isArray(visiData?.minatBakat) ? visiData.minatBakat : [
    { title: "Web Development", desc: "Membangun pengalaman digital yang interaktif & berjiwa dengan standar clean code." },
    { title: "Photography & Visual", desc: "Menangkap momen berharga jadi karya visual yang bercerita dan artistik." },
    { title: "UI/UX Design", desc: "Menggabungkan estetika modern glassmorphism dengan kenyamanan logika pengguna." },
    { title: "Creative Strategy", desc: "Menemukan ide segar dan mengubahnya jadi solusi nyata berdampak." },
    { title: "Content Creation", desc: "Membuat konten edukasi bermutu tinggi yang relate & meaningful bagi pembelajar." },
    { title: "Personal Growth", desc: "Terus meng-upgrade mindset, skill, dan etika profesional setiap hari." }
  ],
  timeline: Array.isArray(visiData?.timeline) ? visiData.timeline : [
    { year: "2021", text: "Awal langkah kecil — belajar desain dan pemrograman web secara otodidak." },
    { year: "2022", text: "Mulai membangun proyek freelance dan kolaborasi kreatif." },
    { year: "2023", text: "Mendalami UI/UX modern, arsitektur frontend, dan merilis portofolio digital pertama." },
    { year: "2024", text: "Aktif dalam komunitas teknologi dan edukasi digital, membagikan wawasan." },
    { year: "2025", text: "Fokus mengembangkan platform digital untuk kolaborasi, AI terintegrasi, dan edukasi generasi penerus." }
  ],
  filosofiKreatif: visiData?.filosofiKreatif || {},
  coreValues: visiData?.coreValues || {},
  langkahSelanjutnya: visiData?.langkahSelanjutnya || {},
  quote: visiData?.quote || {}
};

// Data Akun Sosial & Platform Resmi (dari halaman /portal & /contact)
export const portalPlatforms = [
  { platform: "Instagram", username: "@saipul16_", url: "https://instagram.com/saipul16_", desc: "Dokumentasi visual, update proyek, dan cerita kreatif." },
  { platform: "LinkedIn", username: "Muhammad Syaiful Mukmin", url: "https://linkedin.com/in/saipul16_", desc: "Koneksi profesional, rekam jejak karir, dan keahlian software engineering." },
  { platform: "GitHub / Twitter", username: "@saipul16_", url: "https://twitter.com/saipul16_", desc: "Diskusi teknologi dan repositori open-source." },
  { platform: "YouTube", username: "@saipul16_", url: "https://youtube.com/@saipul16_", desc: "Konten video edukatif dan sinematografi." },
  { platform: "Telegram", username: "@saipul16_", url: "https://t.me/saipul16_", desc: "Saluran komunikasi dan diskusi langsung." },
  { platform: "Website Resmi", username: "syaiful-mukmin.netlify.app", url: "/", desc: "Pusat portofolio, blog teknologi, galeri karya, dan SaipulAI." }
];

// Direktori Lengkap Seluruh Halaman Website untuk Pemandu Navigasi AI
export const sitePagesDirectory = [
  { path: "/", title: "Beranda Utama", category: "Utama", desc: "Halaman muka portofolio dengan pengenalan interaktif, proyek unggulan, dan statistik utama." },
  { path: "/about", title: "Tentang Saya (About)", category: "Profil", desc: "Profil biografi lengkap, kartu keahlian, filosofi, minat, dan identitas profesional." },
  { path: "/cv-saya", title: "CV Digital Interaktif", category: "Karir", desc: "Curriculum Vitae interaktif mencakup ringkasan profesional, keahlian teknis, dan riwayat pekerjaan." },
  { path: "/visi", title: "Visi, Misi & Minat", category: "Profil", desc: "Visi masa depan, misi strategis, minat bakat, dan timeline perjalanan karir." },
  { path: "/projects", title: "Showcase Proyek Web", category: "Proyek", desc: "Katalog 22+ proyek aplikasi web modern lengkap dengan filter teknologi dan demo." },
  { path: "/softskills", title: "Keahlian & Soft Skills", category: "Keahlian", desc: "Daftar kompetensi interpersonal, kepemimpinan, komunikasi, dan metodologi kerja." },
  { path: "/certificates", title: "Sertifikat & Lisensi", category: "Prestasi", desc: "Daftar sertifikat kompetensi resmi dari berbagai platform edukasi dan teknologi." },
  { path: "/education", title: "Pendidikan & Kursus", category: "Pendidikan", desc: "Riwayat pendidikan formal, kursus pemrograman, dan pelatihan profesional." },
  { path: "/blog", title: "Blog & Artikel Edukatif", category: "Blog", desc: "Kumpulan artikel mendalam tentang web development, clean code, dan inovasi digital." },
  { path: "/blog/authors/m-syaiful-mukmin", title: "Profil Penulis Blog", category: "Blog", desc: "Halaman profil penulis blog dengan biografi, keahlian, dan daftar artikel terbitan." },
  { path: "/gallery", title: "Galeri & Media Visual", category: "Karya Visual", desc: "Pusat koleksi foto studio 5R, album pagelaran seni angkatan 22, dan video kreatif." },
  { path: "/photography", title: "Fotografi Portofolio", category: "Karya Visual", desc: "Koleksi foto artistik, dokumentasi event, dan kurasi visual resolusi tinggi." },
  { path: "/S1-PGMI", title: "Akademik Sarjana S1-PGMI", category: "Akademik", desc: "Informasi dan rekam jejak akademik program studi S1 PGMI FTK UIN Antasari Banjarmasin." },
  { path: "/kkn", title: "Laporan KKN Desa Kundan", category: "Akademik", desc: "Dokumentasi 32 hari pengabdian KKN di Desa Kundan Haruyan Dayak, HARDAY FEST, dan pembinaan 4 sekolah." },
  { path: "/sempro-skripsi", title: "Seminar Proposal Skripsi", category: "Akademik", desc: "Tahapan seminar proposal penelitian sarjana." },
  { path: "/sidang-skripsi", title: "Sidang Skripsi Munaqasyah", category: "Akademik", desc: "Sidang ujian akhir skripsi sarjana." },
  { path: "/wisuda", title: "Momen Wisuda Sarjana", category: "Akademik", desc: "Perayaan kelulusan dan penganugerahan gelar sarjana." },
  { path: "/Live-Discussion", title: "Live Discussion Room", category: "Komunitas", desc: "Ruang obrolan langsung komunitas dengan dukungan asisten cerdas SaipulAI." },
  { path: "/testimoni", title: "Testimoni & Klien", category: "Ulasan", desc: "Rekomendasi profesional, testimoni rekan kerja, dan ulasan hasil kolaborasi proyek." },
  { path: "/portal", title: "Portal Navigasi & Sosial", category: "Navigasi", desc: "Pusat penghubung seluruh akun media sosial, tautan platform, dan jalan pintas website." },
  { path: "/help/docs", title: "Dokumentasi Sistem & AI", category: "Bantuan", desc: "Panduan lengkap penggunaan sistem, arsitektur SaipulAI, dan fitur portofolio." },
  { path: "/help/faq", title: "Tanya Jawab (FAQ)", category: "Bantuan", desc: "Jawaban cepat atas pertanyaan yang sering diajukan seputar layanan dan portofolio." },
  { path: "/help/commitment", title: "Komitmen Layanan", category: "Bantuan", desc: "Prinsip dedikasi kerja, jaminan kualitas, dan integritas profesional." },
  { path: "/help/version", title: "Versi & Changelog", category: "Bantuan", desc: "Riwayat pembaruan fitur, perbaikan sistem, dan roadmap versi aplikasi." },
  { path: "/live-cs/security", title: "Keamanan Sistem", category: "Keamanan", desc: "Standar keamanan data, proteksi privasi, dan transparansi pemrosesan AI lokal." },
  { path: "/hobbies", title: "Minat & Hobi", category: "Personal", desc: "Aktivitas kegemaran seperti fotografi, coding eksperimental, dan literasi teknologi." },
  { path: "/bahasa", title: "Kemampuan Bahasa & Teknologi", category: "Personal", desc: "Katalog penguasaan bahasa komunikasi (Indonesia, Inggris, Jawa, Jepang) dan ekosistem teknologi modern (React, JavaScript, Python, TypeScript, Docker, Vue, Go, SQL, dll.) dengan penjelasan detail penguasaan." },
  { path: "/bahasa/detail/:slug", title: "Detail Bahasa & Teknologi", category: "Personal", desc: "Halaman spesifik yang memuat tingkat kemahiran, framework, tools, kelebihan, kekurangan, serta proyek nyata terkait." },
  { path: "/coming-soon", title: "Fitur Mendatang (Roadmap)", category: "Inovasi", desc: "Platform baru yang sedang dikembangkan seperti CreativeHub dan livestreaming." },
  { path: "/contact", title: "Hubungi Penulis / Admin", category: "Kontak", desc: "Formulir interaktif untuk mengirimkan pesan, tawaran kolaborasi, atau feedback." }
];

// Cache blogs dinamis dari Supabase
let runtimeBlogs = [];
export const setKnowledgeBaseBlogs = (blogs = []) => {
  if (Array.isArray(blogs)) {
    runtimeBlogs = blogs;
  }
};

// Cache room diskusi dinamis dari Live Room / Supabase
let runtimeDiscussionMessages = [];
export const setDiscussionRoomData = (messages = []) => {
  if (Array.isArray(messages)) {
    runtimeDiscussionMessages = messages;
  }
};

export const getDiscussionRoomData = () => {
  if (runtimeDiscussionMessages.length > 0) return runtimeDiscussionMessages;
  try {
    const cachedUmum = getCachedMessages('umum');
    const cachedProjek = getCachedMessages('projek');
    return [...(Array.isArray(cachedUmum) ? cachedUmum : []), ...(Array.isArray(cachedProjek) ? cachedProjek : [])];
  } catch {
    return [];
  }
};

// Normalisasi ekstrak array aman
const extractArray = (data, fallbackKey = null) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (fallbackKey && Array.isArray(data[fallbackKey])) return data[fallbackKey];
    const firstArray = Object.values(data).find(v => Array.isArray(v));
    if (firstArray) return firstArray;
  }
  return [];
};

/**
 * Mengambil seluruh database mentah yang telah dinormalisasi
 */
export const getUnifiedKnowledgeBase = () => {
  const authorProfilesObj = typeof getAuthorProfiles === 'function' ? getAuthorProfiles() : {};
  const authorProfilesList = Array.isArray(authorProfilesObj) ? authorProfilesObj : Object.values(authorProfilesObj || {});

  const allHobbies = [
    ...extractArray(hobbiesData, 'hobbies'),
    ...extractArray(chatHobbiesData, 'hobbies')
  ];

  const galleryItems = extractArray(galleryData);
  const galleryAlbums = extractArray(galleryAlbumsData);
  const galleryImages = extractArray(galleryImagesData);
  const galleryShorts = extractArray(galleryShortsData);
  const galleryVideos = extractArray(galleryVideosData);

  const slugifyHelper = (text = '') =>
    text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');

  const bahasaSehariHariList = extractArray(languagesData?.bahasaSehariHari);
  const bahasaPemrogramanList = extractArray(languagesData?.bahasaPemrograman);
  const allLanguagesList = [
    ...bahasaSehariHariList.map((item) => ({
      ...item,
      category: 'bahasa_sehari_hari',
      categoryLabel: 'Bahasa Sehari-hari',
      type: 'bahasa',
      name: item.nama,
      title: item.nama,
      slug: slugifyHelper(item.nama),
      detailUrl: `/bahasa/detail/${slugifyHelper(item.nama)}`,
      desc: item.deskripsi || item.penjelasan,
    })),
    ...bahasaPemrogramanList.map((item) => ({
      ...item,
      category: 'bahasa_pemrograman',
      categoryLabel: 'Teknologi & Pemrograman',
      type: 'teknologi',
      name: item.nama,
      title: item.nama,
      slug: slugifyHelper(item.nama),
      detailUrl: `/bahasa/detail/${slugifyHelper(item.nama)}`,
      desc: item.deskripsi || item.penjelasan,
    })),
  ];

  return {
    profile: profileData || {},
    authorProfiles: authorProfilesList,
    cards: extractArray(cardsData, 'cards'),
    projects: extractArray(projectsData, 'projects'),
    skills: extractArray(softskillsData, 'skills'),
    specializations: extractArray(specializationsData, 'specializations'),
    experiences: extractArray(experiencesData, 'experiences'),
    documents: extractArray(docsSectionsData, 'sections'),
    plannedVersions: extractArray(plannedVersionsData, 'versions'),
    commitments: extractArray(commitmentsData, 'commitments'),
    faq: extractArray(faqsData, 'faqs'),
    hobbies: allHobbies,
    certificates: extractArray(certificatesData, 'certificates'),
    collaborations: extractArray(collaborationsData, 'collaborations'),
    interests: interestsData || {},
    aiBase: aiBaseData || {},
    AI: aiBaseData || {},
    testimonials: extractArray(testimonialsData, 'testimonials'),
    languages: allLanguagesList,
    languagesDetail: {
      sehariHari: bahasaSehariHariList,
      pemrograman: bahasaPemrogramanList,
      all: allLanguagesList,
      metadata: languagesData?.metadata || {}
    },
    education: extractArray(educationData, 'courses'),
    blogs: runtimeBlogs.length > 0 ? runtimeBlogs : extractArray(blogsData, 'blogs'),
    photos: extractArray(photosData, 'photos'),
    gallery: {
      items: galleryItems,
      albums: galleryAlbums,
      images: galleryImages,
      shorts: galleryShorts,
      videos: galleryVideos
    },
    galleryAlbums,
    galleryImages,
    galleryVideos,
    streamingVideos: extractArray(streamingVideosData),
    streamingShorts: extractArray(streamingShortsData),
    streamingUser: streamingUserData || {},
    discussionRoom: getDiscussionRoomData(),
    comingsoon: extractArray(comingSoonData),
    maintenance: maintenanceData || {},
    qodam: extractArray(qodamData),
    zodiac: extractArray(zodiacData),
    academic: {
      overview: kknOverview || {},
      stats: kknStats || [],
      outputs: kknOutputs || [],
      pillars: kknPillars || []
    },
    visiMisi: visiMisiData,
    portalPlatforms: portalPlatforms,
    sitePages: sitePagesDirectory,
    benchmarkLearner: getLearnedBenchmarkKnowledge(),
    aiDoc: aiDocData || {},
    riwayat: extractArray(riwayatData, 'riwayat')
  };
};

/**
 * Statistik ringkas ukuran knowledge base (menghitung kedalaman konten secara akurat tanpa duplikasi)
 */
export const getKnowledgeStats = () => {
  const kb = getUnifiedKnowledgeBase();
  let totalItems = 0;
  const counted = new Set();

  const countDeep = (obj) => {
    if (!obj || counted.has(obj)) return 0;
    counted.add(obj);

    if (Array.isArray(obj)) {
      return obj.length;
    }
    if (typeof obj === 'object') {
      let sum = 0;
      for (const val of Object.values(obj)) {
        if (Array.isArray(val)) {
          if (!counted.has(val)) {
            counted.add(val);
            sum += val.length;
          }
        } else if (typeof val === 'object' && val !== null) {
          sum += countDeep(val);
        } else if (typeof val === 'string' && val.trim().length > 0) {
          sum += 1;
        }
      }
      return sum;
    }
    return 0;
  };

  Object.values(kb).forEach(val => {
    totalItems += countDeep(val);
  });

  return {
    totalCategories: Object.keys(kb).length,
    totalItems: totalItems
  };
};

/**
 * Multi-Entity Cross Linker
 * Menghubungkan satu topik/keyword ke seluruh domain data yang relevan:
 * Projects, Blogs, Skills, Certificates, Testimonials, Education, dll.
 */
export const findRelatedEntities = (keyword = '') => {
  if (!keyword || typeof keyword !== 'string') {
    return {
      keyword: '',
      hasMatches: false,
      projects: [],
      blogs: [],
      skills: [],
      certificates: [],
      testimonials: [],
      education: [],
      faq: []
    };
  }

  const k = keyword.toLowerCase().trim();
  const kb = getUnifiedKnowledgeBase();

  const matchText = (text) => typeof text === 'string' && text.toLowerCase().includes(k);
  const matchArray = (arr) => Array.isArray(arr) && arr.some(item => matchText(typeof item === 'string' ? item : item?.name || item?.title || ''));

  // 1. Projects
  const matchedProjects = kb.projects.filter(p =>
    matchText(p.title) || matchText(p.description) || matchText(p.desc) || matchArray(p.tech) || matchArray(p.tags)
  );

  // 2. Blogs
  const matchedBlogs = kb.blogs.filter(b =>
    matchText(b.title) || matchText(b.excerpt) || matchArray(b.tags) || matchText(b.author)
  );

  // 3. Skills
  const matchedSkills = kb.skills.filter(s =>
    matchText(s.name) || matchText(s.description) || matchText(s.category) || matchArray(s.tags)
  );

  // 4. Certificates
  const matchedCertificates = kb.certificates.filter(c =>
    matchText(c.title) || matchText(c.name) || matchText(c.issuer) || matchArray(c.skills) || matchArray(c.tags)
  );

  // 5. Testimonials
  const matchedTestimonials = kb.testimonials.filter(t =>
    matchText(t.name) || matchText(t.role) || matchText(t.quote) || matchText(t.message) || matchText(t.company)
  );

  // 6. Education
  const matchedEducation = kb.education.filter(e =>
    matchText(e.title) || matchText(e.institution) || matchText(e.platform) || matchArray(e.skills)
  );

  // 7. FAQ
  const matchedFAQ = (kb.faq || []).filter(f =>
    matchText(f.question) || matchText(f.answer)
  );

  // 8. Experiences (Pengalaman Kerja & Karir)
  const matchedExperiences = (kb.experiences || []).filter(e =>
    matchText(e.title) || matchText(e.position) || matchText(e.company) || matchText(e.description) ||
    matchArray(e.tags) || matchArray(e.achievements)
  );

  // 9. Specializations (Keahlian & Spesialisasi)
  const matchedSpecializations = (kb.specializations || []).filter(s =>
    matchText(s.title) || matchText(s.description) || matchArray(s.skills)
  );

  // 10. Author Profiles (Profil Penulis Blog)
  const matchedAuthorProfiles = (kb.authorProfiles || []).filter(a =>
    matchText(a.name) || matchText(a.bio) || matchText(a.expertise) || matchText(a.location) || matchText(a.company)
  );

  // 11. Gallery & Albums (Koleksi Galeri Foto & Album)
  const galleryItems = [
    ...(kb.galleryAlbums || []),
    ...(kb.galleryImages || []),
    ...(kb.gallery?.items || [])
  ];
  const matchedGallery = galleryItems.filter(g =>
    matchText(g.title) || matchText(g.desc) || matchText(g.category) || matchArray(g.tags)
  );

  // 12. Discussion Room (Insight & Percakapan Room Live)
  const matchedDiscussion = (kb.discussionRoom || []).filter(d =>
    matchText(d.content) || matchText(d.username) || matchText(d.reply_to_name)
  );

  // 13. Academic & KKN Pengabdian
  const kknMatches = [];
  if (kb.academic?.overview) {
    const ov = kb.academic.overview;
    if (matchText(ov.title) || matchText(ov.location) || matchText(ov.subtitle) || matchText(ov.programStudy) || matchText(ov.university)) {
      kknMatches.push(ov);
    }
  }

  // 14. Visi, Misi & Minat Bakat
  const visiMatches = [];
  if (kb.visiMisi) {
    if (matchText(kb.visiMisi.visi) || kb.visiMisi.misi?.some(m => matchText(m)) || kb.visiMisi.minatBakat?.some(mb => matchText(mb.title) || matchText(mb.desc))) {
      visiMatches.push(kb.visiMisi);
    }
  }

  // 15. Languages & Technologies (Kemampuan Bahasa & Teknologi /bahasa)
  const matchedLanguages = (kb.languages || []).filter(l =>
    matchText(l.nama) || matchText(l.name) || matchText(l.deskripsi) || matchText(l.penjelasan) ||
    matchArray(l.kemampuan) || matchArray(l.framework) || matchArray(l.tools)
  );

  // 16. Site Pages Directory
  const matchedPages = (kb.sitePages || []).filter(p =>
    matchText(p.title) || matchText(p.desc) || matchText(p.path) || matchText(p.category)
  );

  // 17. Hobbies & Minat Personal (/hobbies)
  const matchedHobbies = (kb.hobbies || []).filter(h =>
    matchText(h.title) || matchText(h.desc) || matchText(h.category) ||
    matchArray(h.metadata?.tools) || matchText(h.metadata?.difficulty)
  );

  const totalMatches = matchedProjects.length + matchedBlogs.length + matchedSkills.length +
    matchedCertificates.length + matchedTestimonials.length + matchedEducation.length +
    matchedExperiences.length + matchedSpecializations.length + matchedAuthorProfiles.length +
    matchedGallery.length + matchedDiscussion.length + kknMatches.length + visiMatches.length +
    matchedLanguages.length + matchedPages.length + matchedHobbies.length + matchedFAQ.length;

  return {
    keyword: k,
    hasMatches: totalMatches > 0,
    totalMatches,
    projects: matchedProjects,
    blogs: matchedBlogs,
    skills: matchedSkills,
    specializations: matchedSpecializations,
    languages: matchedLanguages,
    hobbies: matchedHobbies,
    experiences: matchedExperiences,
    authorProfiles: matchedAuthorProfiles,
    gallery: matchedGallery,
    discussionRoom: matchedDiscussion,
    academic: kknMatches,
    visiMisi: visiMatches,
    sitePages: matchedPages,
    certificates: matchedCertificates,
    testimonials: matchedTestimonials,
    education: matchedEducation,
    faq: matchedFAQ
  };
};

export default getUnifiedKnowledgeBase;

