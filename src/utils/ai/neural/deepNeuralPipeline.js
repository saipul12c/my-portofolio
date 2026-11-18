/**
 * deepNeuralPipeline.js
 * Layer 3: Deep Neural Pipeline Orchestrator
 * Menjembatani Micro-Neural Network + Semantic Embeddings dengan Knowledge Base
 * untuk penalaran semantik mendalam tanpa merusak arsitektur lama.
 */

import { generateEmbedding, calculateCosineSimilarity, semanticSearch, EMBEDDING_DIM } from './semanticEmbeddings.js';
import { classifyNeuralIntent, NEURAL_CLASSES } from './microNeuralNet.js';
import { initLargeScaleTransformer, isLargeScaleTransformerReady, getTransformerStatus } from './largeScaleTransformer.js';
import {
  TECHNICAL_KNOWLEDGE,
  PERSONA_KNOWLEDGE,
  COMPLEX_KNOWLEDGE,
  COMMUNITY_KNOWLEDGE,
  SAFETY_KNOWLEDGE,
  LINGUISTICS_KNOWLEDGE
} from './neuralKnowledgeCatalog.js';

// Cache dokumen knowledge base dengan vektor embedding yang telah dihitung
let embeddedEntitiesCache = null;
let lastKnowledgeBaseFingerprint = null;

/**
 * Menghitung fingerprint konten Knowledge Base untuk cache invalidation yang presisi
 */
function computeKBFingerprint(kb) {
  if (!kb || typeof kb !== 'object') return 'empty';
  const pCount = Array.isArray(kb.projects) ? kb.projects.length : 0;
  const bCount = Array.isArray(kb.blogs) ? kb.blogs.length : 0;
  const sCount = Array.isArray(kb.skills) ? kb.skills.length : 0;
  const spCount = Array.isArray(kb.specializations) ? kb.specializations.length : 0;
  const gCount = (Array.isArray(kb.galleryAlbums) ? kb.galleryAlbums.length : 0) +
    (Array.isArray(kb.gallery?.albums) ? kb.gallery.albums.length : 0);
  const authCount = kb.authorProfiles ? (Array.isArray(kb.authorProfiles) ? kb.authorProfiles.length : Object.keys(kb.authorProfiles).length) : 0;
  const academicTitle = kb.academic?.overview?.title || '';
  const visiSnippet = kb.visiMisi?.visi ? kb.visiMisi.visi.slice(0, 25) : '';
  return `${pCount}:${bCount}:${sCount}:${spCount}:${gCount}:${authCount}:${academicTitle}:${visiSnippet}`;
}

/**
 * Mengindeks entitas Knowledge Base menjadi vektor embedding terkomputasi
 */
export function indexKnowledgeBaseEmbeddings(knowledgeBase = {}) {
  const currentFingerprint = computeKBFingerprint(knowledgeBase);
  if (
    lastKnowledgeBaseFingerprint === currentFingerprint &&
    embeddedEntitiesCache &&
    embeddedEntitiesCache.length > 0 &&
    embeddedEntitiesCache[0].embedding?.length === EMBEDDING_DIM
  ) {
    return embeddedEntitiesCache;
  }

  lastKnowledgeBaseFingerprint = currentFingerprint;
  const entities = [];

  // 1. Proyek
  if (Array.isArray(knowledgeBase.projects)) {
    knowledgeBase.projects.forEach(p => {
      const text = `Proyek ${p.title}: ${p.description || p.desc || ''}. Teknologi: ${Array.isArray(p.tech) ? p.tech.join(', ') : ''}`;
      entities.push({
        id: `project_${p.id || p.title}`,
        type: 'project',
        title: p.title,
        text,
        url: `/projects`,
        embedding: generateEmbedding(text),
        data: p
      });
    });
  }

  // 2. KKN & Akademik
  if (knowledgeBase.academic?.overview) {
    const kkn = knowledgeBase.academic.overview;
    const text = `KKN Pengabdian Mahasiswa UIN Antasari di Desa Kundan Haruyan Dayak Kalimantan Selatan. Durasi 32 hari. Prodi PGMI Tarbiyah. DPL Dr. Nuryadin, Kades Suhadi Anang. HARDAY FEST dan bina 4 sekolah.`;
    entities.push({
      id: 'kkn_overview',
      type: 'academic',
      title: kkn.title,
      text,
      url: `/kkn`,
      embedding: generateEmbedding(text),
      data: kkn
    });
  }

  // 3. Visi & Misi
  if (knowledgeBase.visiMisi) {
    const vm = knowledgeBase.visiMisi;
    const text = `Visi Misi Syaiful Mukmin: ${vm.visi}. Misi: ${Array.isArray(vm.misi) ? vm.misi.join(', ') : ''}`;
    entities.push({
      id: 'visi_misi',
      type: 'visi_misi',
      title: 'Visi & Misi Syaiful Mukmin',
      text,
      url: `/visi`,
      embedding: generateEmbedding(text),
      data: vm
    });
  }

  // 4. Profil Penulis Blog
  const authors = Array.isArray(knowledgeBase.authorProfiles)
    ? knowledgeBase.authorProfiles
    : Object.values(knowledgeBase.authorProfiles || {});
  authors.forEach(a => {
    const text = `Profil Penulis Blog: ${a.name}. ${a.bio || ''}. Keahlian: ${a.expertise || ''}. Domisili: ${a.location || ''}.`;
    entities.push({
      id: `author_${a.name}`,
      type: 'author_profile',
      title: a.name,
      text,
      url: `/blog/authors/${a.slug || 'm-syaiful-mukmin'}`,
      embedding: generateEmbedding(text),
      data: a
    });
  });

  // 5. Spesialisasi & Pengalaman
  if (Array.isArray(knowledgeBase.specializations)) {
    knowledgeBase.specializations.forEach(s => {
      const text = `Spesialisasi ${s.title}: ${s.description || ''}. Keterampilan: ${Array.isArray(s.skills) ? s.skills.join(', ') : ''}`;
      entities.push({
        id: `spec_${s.id || s.title}`,
        type: 'specialization',
        title: s.title,
        text,
        url: s.link || `/projects`,
        embedding: generateEmbedding(text),
        data: s
      });
    });
  }

  // 6. Galeri Seni & Album Foto (Deduplikasi album agar tidak diindeks ganda)
  const rawGalleryList = [
    ...(Array.isArray(knowledgeBase.galleryAlbums) ? knowledgeBase.galleryAlbums : []),
    ...(Array.isArray(knowledgeBase.gallery?.albums) ? knowledgeBase.gallery.albums : [])
  ];
  const seenGalleryKeys = new Set();
  const galleryList = rawGalleryList.filter(g => {
    const key = g.id || g.title;
    if (!key || seenGalleryKeys.has(key)) return false;
    seenGalleryKeys.add(key);
    return true;
  });
  galleryList.forEach(g => {
    const text = `Galeri Album ${g.title}: ${g.desc || ''}. Kategori: ${g.category || ''}`;
    entities.push({
      id: `gallery_${g.id || g.title}`,
      type: 'gallery',
      title: g.title,
      text,
      url: `/gallery`,
      embedding: generateEmbedding(text),
      data: g
    });
  });

  // 7. Direktori Halaman Website
  if (Array.isArray(knowledgeBase.sitePages)) {
    knowledgeBase.sitePages.forEach(p => {
      const text = `Halaman ${p.title}: Rute ${p.path}. Kategori: ${p.category}. ${p.desc}`;
      entities.push({
        id: `page_${p.path}`,
        type: 'site_page',
        title: p.title,
        text,
        url: p.path,
        embedding: generateEmbedding(text),
        data: p
      });
    });
  }

  // 8. Pengetahuan Konsultasi Teknis & Coding (React, Vite, Tailwind, Supabase, Clean Code, dll)
  TECHNICAL_KNOWLEDGE.forEach(tk => {
    const text = `${tk.title}. Kata Kunci: ${tk.keywords.join(', ')}. ${tk.text}`;
    entities.push({
      id: tk.id,
      type: 'technical',
      title: tk.title,
      text: tk.text,
      url: '/help/docs',
      embedding: generateEmbedding(text),
      data: tk
    });
  });

  // 9. Pengetahuan Interaksi & Persona SaipulAI (Sapaan, Identitas, Pembuat, Empati, Humor)
  PERSONA_KNOWLEDGE.forEach(pk => {
    const text = `${pk.title}. Kata Kunci: ${pk.keywords.join(', ')}. ${pk.text}`;
    entities.push({
      id: pk.id,
      type: 'persona',
      title: pk.title,
      text: pk.text,
      url: '/about',
      embedding: generateEmbedding(text),
      data: pk
    });
  });

  // 10. Pengetahuan Penalaran Kompleks & Multi-Turn
  COMPLEX_KNOWLEDGE.forEach(ck => {
    const text = `${ck.title}. Kata Kunci: ${ck.keywords.join(', ')}. ${ck.text}`;
    entities.push({
      id: ck.id,
      type: 'complex',
      title: ck.title,
      text: ck.text,
      url: '/about',
      embedding: generateEmbedding(text),
      data: ck
    });
  });

  // 11. Pengetahuan Komunitas & Navigasi
  COMMUNITY_KNOWLEDGE.forEach(cmk => {
    const text = `${cmk.title}. Kata Kunci: ${cmk.keywords.join(', ')}. ${cmk.text}`;
    entities.push({
      id: cmk.id,
      type: 'community',
      title: cmk.title,
      text: cmk.text,
      url: '/Live-Discussion',
      embedding: generateEmbedding(text),
      data: cmk
    });
  });

  // 12. Pengetahuan Etika, Kebijakan Keamanan & Disclaimers
  SAFETY_KNOWLEDGE.forEach(sk => {
    const text = `${sk.title}. Kata Kunci: ${sk.keywords.join(', ')}. ${sk.text}`;
    entities.push({
      id: sk.id,
      type: 'safety',
      title: sk.title,
      text: sk.text,
      url: '/help/docs',
      embedding: generateEmbedding(text),
      data: sk
    });
  });

  // 13. Pengetahuan Linguistik, Dialek Banjar & Bilingual
  LINGUISTICS_KNOWLEDGE.forEach(lk => {
    const text = `${lk.title}. Kata Kunci: ${lk.keywords.join(', ')}. ${lk.text}`;
    entities.push({
      id: lk.id,
      type: 'linguistics',
      title: lk.title,
      text: lk.text,
      url: '/about',
      embedding: generateEmbedding(text),
      data: lk
    });
  });

  embeddedEntitiesCache = entities;
  return entities;
}

/**
 * Format respon markdown yang rapi dari entitas hasil penalaran neural
 */
export function formatNeuralAnswer(neuralResult) {
  if (!neuralResult || !neuralResult.bestMatch) {
    return null;
  }
  const match = neuralResult.bestMatch;
  const item = match.item || match;
  const entity = item.data || item;
  const type = item.type;

  switch (type) {
    case 'project':
      return `🚀 **Projek: ${item.title || 'Portofolio Web'}**\n\n${entity.description || entity.desc || item.text || 'Detail proyek inovasi web.'}\n\n• **Teknologi**: ${Array.isArray(entity.tech) ? entity.tech.join(', ') : (entity.tech || 'Modern Web Stack')}\n• **Detail Lengkap**: Kunjungi rute portofolio \`/projects\``;
    case 'academic':
      return `🎓 **Akademik & Pengabdian Masyarakat (KKN)**\n\n${item.title || 'KKN Desa Kundan Haruyan Dayak'}\n\n${item.text || 'Laporan Pengabdian Masyarakat KKN.'}\n\n• **Program Unggulan**: HARDAY FEST & Pengabdian 3 Sekolah\n• **Dokumentasi Lengkap**: Kunjungi rute \`/kkn\``;
    case 'author_profile':
      return `✍️ **Profil Penulis: ${item.title || 'Penulis Blog'}**\n\n${entity.bio || item.text || 'Profil penulis konten teknologi.'}\n\n• **Keahlian**: ${entity.expertise || 'Web & AI Development'}\n• **Domisili**: ${entity.location || 'Kalimantan Selatan, Indonesia'}\n• **Halaman Penulis**: Kunjungi \`${item.url || '/blog'}\``;
    case 'visi_misi':
      return `🎯 **Visi & Misi Syaiful Mukmin**\n\n**Visi:**\n${entity.visi || 'Membangun ekosistem teknologi yang inklusif dan berdampak.'}\n\n**Misi:**\n${Array.isArray(entity.misi) ? entity.misi.map(m => `• ${m}`).join('\n') : (item.text || 'Mewujudkan inovasi digital berkelanjutan.')}\n\n• **Selengkapnya**: Kunjungi rute \`/visi\``;
    case 'gallery':
      return `🎨 **Galeri & Visual Arts: ${item.title || 'Album Galeri'}**\n\n${entity.desc || item.text || 'Dokumentasi karya visual dan seni.'}\n\n• **Kategori**: ${entity.category || 'Visual Art'}\n• **Galeri Lengkap**: Kunjungi rute \`/gallery\``;
    case 'site_page':
      return `🧭 **Halaman Portofolio: ${item.title || 'Halaman'}**\n\n${entity.desc || item.text || 'Informasi rute dan fitur portofolio.'}\n\n• **Kategori**: ${entity.category || 'Fitur Website'}\n• **Akses Cepat**: Silakan kunjungi tautan \`${item.url || '/'}\``;
    case 'technical':
      return `💻 **Konsultasi Teknis & Coding: ${item.title || 'Arsitektur Sistem'}**\n\n${entity.text || item.text || 'Solusi dan panduan teknis rekayasa web.'}\n\n• **Kategori**: Arsitektur Web & Software Engineering\n• **Referensi**: Dokumentasi Teknis Portofolio (\`/help/docs\`)`;
    case 'persona':
      return `${entity.text || item.text || 'Halo! Saya SaipulAI, asisten cerdas portofolio.'}`;
    case 'complex':
      return `💡 **Analisis & Penalaran Mendalam: ${item.title || 'Wawasan Portofolio'}**\n\n${entity.text || item.text || 'Analisis dan sintesis arsitektur teknologi.'}`;
    case 'community':
      return `💬 **Pusat Komunitas & Navigasi: ${item.title || 'Panduan Sistem'}**\n\n${entity.text || item.text || 'Informasi fitur obrolan dan dukungan sistem.'}`;
    case 'safety':
      return `🛡️ **Kebijakan & Keamanan Sistem**\n\n${entity.text || item.text || 'Informasi perlindungan privasi dan panduan etis.'}`;
    case 'linguistics':
      return `${entity.text || item.text || 'Informasi linguistik dan portofolio Syaiful.'}`;
    default:
      return `💡 **${item.title || 'Informasi Portofolio'}**\n\n${item.text || 'Detail informasi terkait Syaiful Mukmin.'}\n\n${item.url ? `• **Tautan Terkait**: \`${item.url}\`` : ''}`;
  }
}

/**
 * Proses Penalaran Deep Neural: Klasifikasi Niat + Pencarian Vektor Semantik (Hybrid Progressive AI)
 */
export function processDeepNeuralQuery(query = '', knowledgeBase = {}) {
  if (!query || typeof query !== 'string') {
    return {
      topClass: 'boundary_stress',
      confidence: 0,
      bestMatch: null,
      engine: 'native_self_attention_256d'
    };
  }

  // 1. Eksekusi Layer 2: Micro-Neural Network Intent Classifier (0ms)
  const neuralIntent = classifyNeuralIntent(query);

  // 2. Eksekusi Layer 1 & Jalur 3: Native High-Density 256-D Self-Attention Engine (0ms)
  const indexedEntities = indexKnowledgeBaseEmbeddings(knowledgeBase);
  const semanticResults = semanticSearch(query, indexedEntities, 3);
  const bestSemanticMatch = semanticResults.length > 0 ? semanticResults[0] : null;

  // 3. Trigger Jalur 1 (Large-Scale Transformer) secara non-blocking di latar belakang
  if (typeof window !== 'undefined' && !isLargeScaleTransformerReady()) {
    try {
      // Background lazy download tanpa menghambat respon utama
      setTimeout(() => {
        initLargeScaleTransformer().catch(() => { });
      }, 100);
    } catch { /* ignore */ }
  }

  const isTransformerActive = isLargeScaleTransformerReady();

  return {
    query,
    intentClassification: neuralIntent,
    topClass: neuralIntent.topClass,
    neuralConfidence: neuralIntent.confidence,
    bestMatch: bestSemanticMatch,
    topSemanticCandidates: semanticResults,
    isHighConfidenceSemantic: bestSemanticMatch && bestSemanticMatch.score > 0.40,
    engine: isTransformerActive ? 'large_scale_transformer_384d' : 'native_self_attention_256d',
    embeddingDimensions: isTransformerActive ? 384 : EMBEDDING_DIM,
    transformerStatus: getTransformerStatus()
  };
}
