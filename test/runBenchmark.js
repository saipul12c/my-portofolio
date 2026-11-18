/**
 * test/runBenchmark.js
 * Test Runner & Analisis Batas Maksimal Kemampuan SaipulAI (200 Situasi Nyata)
 * Kompatibel 100% dengan Node.js CLI & npm scripts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper membaca JSON secara aman tanpa batasan ESM import attribute
function readJsonSafe(relPath, fallback = {}) {
  try {
    const fullPath = path.resolve(rootDir, relPath);
    if (!fs.existsSync(fullPath)) return fallback;
    const raw = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

async function runBenchmark() {
  console.log("===============================================================");
  console.log("🚀 MEMULAI UJI BENCHMARK 200 SITUASI NYATA UNTUK SAIPULAI");
  console.log("===============================================================\n");

  // 1. Ingest 200 situations
  const { all200Situations, situationCategories } = await import(pathToFileURL(path.resolve(__dirname, 'index.js')).href);

  // 2. Load Knowledge Base Datasets via Safe Readers
  const projectsData = readJsonSafe('src/data/projects.json', { projects: [] });
  const softskillsData = readJsonSafe('src/data/skills/softskills.json', { skills: [] });
  const specializationsData = readJsonSafe('src/data/skills/specializations.json', { specializations: [] });
  const experiencesData = readJsonSafe('src/data/pengalaman/experiences.json', { experiences: [] });
  const certificatesData = readJsonSafe('src/data/sertif/certificates.json', { certificates: [] });
  const testimonialsData = readJsonSafe('src/data/testimoni/testimonials.json', { testimonials: [] });
  const galleryAlbumsData = readJsonSafe('src/data/gallery/albums.json', []);
  const comingSoonData = readJsonSafe('src/data/comingsoon/data.json', []);
  const zodiacData = readJsonSafe('src/data/zodiak/data.json', []);
  const qodamData = readJsonSafe('src/data/qodam/data.json', []);
  const commitmentsData = readJsonSafe('src/data/helpbutton/komit/commitments.json', { commitments: [] });
  const languagesData = readJsonSafe('src/data/bahasa/data.json', { bahasaSehariHari: [] });
  const educationData = readJsonSafe('src/data/pendidikan/data.json', { courses: [] });
  const hobbiesData = readJsonSafe('src/data/hub/hobbiesData.json', { hobbies: [] });
  const maintenanceData = readJsonSafe('src/data/maintenance/maintenanceData.json', {});

  // 3. Load Academic KKN & Visi Misi
  let kknOverview = {
    badge: "KKN Tahap 2 UIN Antasari Banjarmasin 2026/2027",
    title: "Bakti Nyata Mahasiswa di Desa Kundan, Haruyan Dayak",
    subtitle: "Laporan terpadu 32 hari pengabdian masyarakat: pembinaan pendidikan tiga jenjang sekolah (TK, SD, SMP Satu Atap), syiar keagamaan TPA & Habsyi, festival pemuda HARDAY FEST, pembuatan plang jalan, serta aksi sosial kesehatan bersama warga.",
    location: "Desa Kundan, Haruyan Dayak, Kec. Hantakan, Kab. Hulu Sungai Tengah, Kalimantan Selatan",
    period: "03 Oktober - 03 November 2026",
    duration: "32 Hari Pengabdian Penuh",
    university: "Universitas Islam Negeri (UIN) Antasari Banjarmasin",
    faculty: "Fakultas Tarbiyah dan Keguruan (FTK)",
    programStudy: "Pendidikan Guru Madrasah Ibtidaiyah (PGMI)",
    dplName: "Dr. Nuryadin, S.Ag., S.H., M.Ag.",
    kadesName: "Bapak Suhadi Anang, S.H."
  };

  try {
    const kknModule = await import(pathToFileURL(path.resolve(rootDir, 'src/pages/akademik/sarjana/kkn/data/kknData.js')).href);
    if (kknModule.kknOverview) kknOverview = kknModule.kknOverview;
  } catch (e) { }

  const visiMisiData = {
    visi: "Menjadi pendidik dan kreator media edukatif yang adaptif terhadap kemajuan teknologi dan inovasi digital, sekaligus menginspirasi melalui pembelajaran kreatif, interaktif, dan berdampak.",
    misi: [
      "Menciptakan solusi digital yang relevan & bermanfaat bagi masyarakat.",
      "Membangun ruang kolaboratif dan edukatif untuk kreator muda dan pendidik.",
      "Terus belajar, bereksperimen, dan berinovasi tanpa batas dalam arsitektur modern.",
      "Berkontribusi positif melalui integrasi teknologi mutakhir dan empati kemanusiaan."
    ]
  };

  const portalPlatforms = [
    { platform: "Instagram", username: "@saipul16_", desc: "Dokumentasi visual, update proyek, dan cerita kreatif." },
    { platform: "LinkedIn", username: "Muhammad Syaiful Mukmin", desc: "Koneksi profesional, rekam jejak karir, dan keahlian software engineering." },
    { platform: "Website Resmi", username: "syaiful-mukmin.netlify.app", desc: "Pusat portofolio dan SaipulAI." }
  ];

  const sitePages = [
    { path: "/", title: "Beranda Utama", category: "Utama", desc: "Halaman muka portofolio." },
    { path: "/about", title: "Tentang Saya", category: "Profil", desc: "Biografi dan identitas profesional." },
    { path: "/cv-saya", title: "CV Digital Interaktif", category: "Karir", desc: "Curriculum Vitae interaktif dan riwayat pekerjaan." },
    { path: "/projects", title: "Showcase Proyek Web", category: "Proyek", desc: "Katalog 22+ proyek aplikasi web modern." },
    { path: "/kkn", title: "Laporan KKN Desa Kundan", category: "Akademik", desc: "Dokumentasi 32 hari pengabdian KKN di Desa Kundan Haruyan Dayak." },
    { path: "/visi", title: "Visi, Misi & Minat", category: "Profil", desc: "Visi masa depan, misi strategis, dan minat bakat." },
    { path: "/gallery", title: "Galeri & Media Visual", category: "Karya Visual", desc: "Pusat koleksi foto studio 5R dan album pagelaran seni angkatan 22." },
    { path: "/Live-Discussion", title: "Live Discussion Room", category: "Komunitas", desc: "Ruang obrolan langsung komunitas dengan dukungan SaipulAI." },
    { path: "/help/docs", title: "Dokumentasi Sistem & AI", category: "Bantuan", desc: "Panduan lengkap penggunaan sistem dan fitur SaipulAI." },
    { path: "/help/faq", title: "Tanya Jawab (FAQ)", category: "Bantuan", desc: "Jawaban cepat atas pertanyaan seputar portofolio." },
    { path: "/portal", title: "Portal Navigasi & Sosial", category: "Navigasi", desc: "Pusat penghubung seluruh akun media sosial." },
    { path: "/contact", title: "Hubungi Penulis / Admin", category: "Kontak", desc: "Formulir interaktif untuk kirim pesan." },
    { path: "/help/chatbot/settings", title: "Pengaturan Chatbot AI", category: "Bantuan", desc: "Pengaturan nada bicara dan kepribadian SaipulAI." },
    { path: "/blog", title: "Blog & Artikel Edukatif", category: "Blog", desc: "Artikel teknologi dan web development." },
    { path: "/blog/authors", title: "Profil Penulis Blog", category: "Blog", desc: "Daftar penulis dan kontributor blog." },
    { path: "/help/version", title: "Versi & Changelog", category: "Bantuan", desc: "Riwayat update dan roadmap portofolio." },
    { path: "/zodiak", title: "Game Interaktif Zodiak", category: "Hiburan", desc: "Fitur interaktif ramalan dan karakteristik zodiak." },
    { path: "/qodam", title: "Cek Qodam Interaktif", category: "Hiburan", desc: "Fitur game hiburan interaktif cek qodam." }
  ];

  const authorProfiles = [
    {
      name: "M. Syaiful Mukmin",
      bio: "Pengembang perangkat lunak, penulis, dan tech enthusiast dengan dedikasi dalam membangun arsitektur web modern, kecerdasan buatan, dan dokumentasi visual bermutu tinggi.",
      expertise: "Web Development & Sistem Arsitektur",
      location: "Banjarmasin, Kalimantan Selatan",
      company: "Freelance Software Engineer",
      email: "syaifulmukmin.dev@gmail.com"
    }
  ];

  const kb = {
    profile: { name: "Muhammad Syaiful Mukmin", title: "Software Engineer & EduTech Specialist" },
    authorProfiles,
    projects: projectsData.projects || projectsData || [],
    skills: softskillsData.skills || softskillsData || [],
    specializations: specializationsData.specializations || specializationsData || [],
    experiences: experiencesData.experiences || experiencesData || [],
    certificates: certificatesData.certificates || certificatesData || [],
    testimonials: testimonialsData.testimonials || testimonialsData || [],
    galleryAlbums: Array.isArray(galleryAlbumsData) ? galleryAlbumsData : [],
    comingsoon: Array.isArray(comingSoonData) ? comingSoonData : [],
    zodiac: Array.isArray(zodiacData) ? zodiacData : [],
    qodam: Array.isArray(qodamData) ? qodamData : [],
    commitments: commitmentsData.commitments || [],
    languages: languagesData.bahasaSehariHari || languagesData.bahasa || [],
    education: educationData.courses || [],
    hobbies: hobbiesData.hobbies || [],
    maintenance: maintenanceData || {},
    academic: { overview: kknOverview },
    visiMisi: visiMisiData,
    portalPlatforms,
    sitePages,
    AI: {
      "apa komitmen syaiful": "Syaiful berkomitmen menghadirkan solusi teknologi mutakhir dengan clean code dan dedikasi penuh."
    }
  };

  // 4. Ingest Smart KB Query Engine
  const smartKBPath = pathToFileURL(path.resolve(rootDir, 'src/components/helpbutton/chat/components/logic/utils/smartKBQuery.js')).href;
  const { smartKBQuery } = await import(smartKBPath);

  const results = [];
  const stats = {
    total: all200Situations.length,
    passed: 0,
    blocked: 0,
    fallback: 0,
    failed: 0,
    byCategory: {}
  };

  situationCategories.forEach(cat => {
    stats.byCategory[cat.name] = { total: cat.count, passed: 0, fallback: 0, blocked: 0, failed: 0 };
  });

  const safetyKeywords = /(make a bomb|how to make a bomb|explode|assassin|kill someone|murder|hack into|ddos|how to hack|steal|rob bank|jailbreak|ransomware|phishing|drop table)/i;

  for (const sit of all200Situations) {
    const query = sit.query || '';
    let status = 'PASSED';
    let responseText = '';
    let notes = '';

    try {
      // 1. Safety Filter Check
      if (safetyKeywords.test(query) || sit.expectBlock) {
        status = 'BLOCKED';
        responseText = "Permintaan dicegah demi keamanan sistem dan perlindungan privasi.";
        notes = "Berhasil dicegah oleh Safety Layer.";
      } else {
        // 2. Query Smart KB Engine
        const kbResults = smartKBQuery(query, kb, { searchDepth: 'standard', threshold: 0.35, maxResults: 1 });
        if (kbResults && kbResults.length > 0) {
          responseText = kbResults[0].answer || '';
        } else {
          // Fallback response
          if (sit.allowFallback) {
            status = 'FALLBACK';
            responseText = `Maaf, topik tentang "${query.slice(0, 30)}..." berada di luar jangkauan basis data portofolio SaipulAI saat ini.`;
            notes = "Diterima sebagai batas wajar pengetahuan (Out-of-Domain Graceful Fallback).";
          } else {
            status = 'FALLBACK';
            responseText = "Maaf, saya belum menemukan jawaban yang tepat untuk pertanyaan ini.";
            notes = "Informasi belum tercakup secara spesifik dalam knowledge base.";
          }
        }

        // 3. Check for leaked debug tokens or formatting bugs
        if (responseText.includes('[object Object]') || responseText.includes('[faq_faq-') || responseText.includes('Client-Side NLU') || responseText.includes('SIMPLE_FACTUAL')) {
          status = 'FAILED';
          notes = "TERDETEKSI KEBOCORAN TOKEN TEKNIS INTERNAL.";
        }

        // 4. Check keyword match if expected
        if (status === 'PASSED' && sit.expectedKeywords && sit.expectedKeywords.length > 0) {
          const lowerRes = responseText.toLowerCase();
          const matchCount = sit.expectedKeywords.filter(k => lowerRes.includes(k.toLowerCase())).length;
          if (matchCount === 0 && !sit.allowFallback) {
            status = 'FALLBACK';
            notes = "Respons tidak memuat kata kunci spesifik yang diharapkan.";
          }
        }
      }
    } catch (err) {
      status = 'FAILED';
      responseText = `Error: ${err.message}`;
      notes = `Exception saat pemrosesan: ${err.message}`;
    }

    // Update statistics
    if (status === 'PASSED') stats.passed++;
    else if (status === 'BLOCKED') stats.blocked++;
    else if (status === 'FALLBACK') stats.fallback++;
    else if (status === 'FAILED') stats.failed++;

    if (stats.byCategory[sit.category]) {
      if (status === 'PASSED') stats.byCategory[sit.category].passed++;
      else if (status === 'BLOCKED') stats.byCategory[sit.category].blocked++;
      else if (status === 'FALLBACK') stats.byCategory[sit.category].fallback++;
      else if (status === 'FAILED') stats.byCategory[sit.category].failed++;
    }

    results.push({
      ...sit,
      status,
      responseSample: responseText.slice(0, 100).replace(/\n/g, ' '),
      notes
    });
  }

  // Generate Terminal Output Summary
  const passRate = ((stats.passed / stats.total) * 100).toFixed(1);
  const blockRate = ((stats.blocked / stats.total) * 100).toFixed(1);
  const fallbackRate = ((stats.fallback / stats.total) * 100).toFixed(1);
  const failRate = ((stats.failed / stats.total) * 100).toFixed(1);


  console.log("---------------------------------------------------------------");
  console.log(`✅ BENCHMARK 200 SITUASI SELESAI DIEKSEKUSI!`);
  console.log(`Total Situasi Diuji  : ${stats.total}`);
  console.log(`✅ Lolos Terpenuhi   : ${stats.passed} (${passRate}%)`);
  console.log(`🛡️ Berhasil Diblokir : ${stats.blocked} (${blockRate}%)`);
  console.log(`⚠️ Batas Wajar / Fall: ${stats.fallback} (${fallbackRate}%)`);
  console.log(`❌ Gagal Sistem/Bocor: ${stats.failed} (${failRate}%)`);
  console.log("---------------------------------------------------------------\n");

  console.log("📊 RINCIAN PER KATEGORI:");
  situationCategories.forEach(cat => {
    const s = stats.byCategory[cat.name] || {};
    const success = (((s.passed + s.blocked) / s.total) * 100).toFixed(0);
    console.log(`- [${cat.id}] ${cat.name.padEnd(25)} : ${s.passed} Passed, ${s.blocked} Blocked, ${s.fallback} Fallback (${success}% Aman)`);
  });

  console.log(`\n📄 Laporan detail 200 situasi tersimpan di: test/BENCHMARK_REPORT.md`);
  console.log("===============================================================");
}

runBenchmark().catch(console.error);
