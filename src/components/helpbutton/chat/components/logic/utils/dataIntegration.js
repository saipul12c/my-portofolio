/**
 * Data Integration Helper
 * Mengintegrasikan semua data dari folder data/ ke dalam respons chatbot
 * 
 * PENTING: generateComprehensiveAnswer dipindahkan ke enhancedKnowledgeBase.js
 * File ini fokus pada search, loading, dan formatting data dari berbagai sumber
 */

import { generateComprehensiveAnswer as generateEnhancedAnswer } from './enhancedKnowledgeBase.js';

/**
 * Load semua data dari JSON files dan parse
 */
export function loadDataFromKnowledgeBase(knowledgeBase = {}) {
  const data = {
    profile: {},
    cards: [],
    certificates: [],
    collaborations: [],
    interests: {},
    skills: [],
    aiBase: {},
    uploadedData: [],
    experiences: [],
    specializations: [],
    languages: [],
    authorProfiles: [],
    gallery: [],
    discussionRoom: [],
    comingsoon: [],
    zodiac: [],
    qodam: [],
    metadata: {
      loadedAt: new Date().toISOString(),
      itemsCount: 0
    }
  };

  try {
    // Load profile
    if (knowledgeBase.profile) {
      data.profile = typeof knowledgeBase.profile === 'string' 
        ? JSON.parse(knowledgeBase.profile)
        : knowledgeBase.profile;
    }

    // Load cards
    if (knowledgeBase.cards && Array.isArray(knowledgeBase.cards)) {
      data.cards = knowledgeBase.cards;
    }

    // Load certificates
    if (knowledgeBase.certificates && Array.isArray(knowledgeBase.certificates)) {
      data.certificates = knowledgeBase.certificates;
    }

    // Load collaborations
    if (knowledgeBase.collaborations && Array.isArray(knowledgeBase.collaborations)) {
      data.collaborations = knowledgeBase.collaborations;
    }

    // Load interests
    if (knowledgeBase.interests) {
      data.interests = typeof knowledgeBase.interests === 'string'
        ? JSON.parse(knowledgeBase.interests)
        : knowledgeBase.interests;
    }

    // Load soft skills
    if (knowledgeBase.softskills && Array.isArray(knowledgeBase.softskills)) {
      data.skills = knowledgeBase.softskills;
    } else if (knowledgeBase.skills && Array.isArray(knowledgeBase.skills)) {
      data.skills = knowledgeBase.skills;
    }

    // Load AI Base
    if (knowledgeBase.ai) {
      data.aiBase = typeof knowledgeBase.ai === 'string'
        ? JSON.parse(knowledgeBase.ai)
        : knowledgeBase.ai;
    } else if (knowledgeBase.aiBase) {
      data.aiBase = typeof knowledgeBase.aiBase === 'string'
        ? JSON.parse(knowledgeBase.aiBase)
        : knowledgeBase.aiBase;
    }

    // Load uploaded data
    if (knowledgeBase.uploadedData && Array.isArray(knowledgeBase.uploadedData)) {
      data.uploadedData = knowledgeBase.uploadedData;
    }

    // Load experiences
    if (knowledgeBase.experiences && Array.isArray(knowledgeBase.experiences)) {
      data.experiences = knowledgeBase.experiences;
    }

    // Load specializations
    if (knowledgeBase.specializations && Array.isArray(knowledgeBase.specializations)) {
      data.specializations = knowledgeBase.specializations;
    }

    // Load languages & technologies (/bahasa)
    if (knowledgeBase.languages && Array.isArray(knowledgeBase.languages)) {
      data.languages = knowledgeBase.languages;
    } else if (knowledgeBase.languagesDetail?.all && Array.isArray(knowledgeBase.languagesDetail.all)) {
      data.languages = knowledgeBase.languagesDetail.all;
    }

    // Load authorProfiles
    if (knowledgeBase.authorProfiles) {
      data.authorProfiles = Array.isArray(knowledgeBase.authorProfiles)
        ? knowledgeBase.authorProfiles
        : Object.values(knowledgeBase.authorProfiles);
    }

    // Load gallery
    if (knowledgeBase.galleryAlbums && Array.isArray(knowledgeBase.galleryAlbums)) {
      data.gallery = knowledgeBase.galleryAlbums;
    } else if (knowledgeBase.gallery && Array.isArray(knowledgeBase.gallery.albums)) {
      data.gallery = knowledgeBase.gallery.albums;
    }

    // Load discussionRoom
    if (knowledgeBase.discussionRoom && Array.isArray(knowledgeBase.discussionRoom)) {
      data.discussionRoom = knowledgeBase.discussionRoom;
    }

    // Load comingsoon
    if (knowledgeBase.comingsoon && Array.isArray(knowledgeBase.comingsoon)) {
      data.comingsoon = knowledgeBase.comingsoon;
    }

    // Load zodiac & qodam
    if (knowledgeBase.zodiac && Array.isArray(knowledgeBase.zodiac)) {
      data.zodiac = knowledgeBase.zodiac;
    }
    if (knowledgeBase.qodam && Array.isArray(knowledgeBase.qodam)) {
      data.qodam = knowledgeBase.qodam;
    }

    // Count items
    data.metadata.itemsCount = 
      Object.keys(data.profile).length +
      data.cards.length +
      data.certificates.length +
      data.collaborations.length +
      Object.keys(data.interests).length +
      data.skills.length +
      Object.keys(data.aiBase).length +
      data.uploadedData.length +
      data.experiences.length +
      data.specializations.length +
      data.languages.length +
      data.authorProfiles.length +
      data.gallery.length +
      data.discussionRoom.length +
      data.comingsoon.length +
      data.zodiac.length +
      data.qodam.length;

  } catch (error) {
    console.error('Error loading knowledge base data:', error);
  }

  return data;
}

/**
 * Search across all data sources
 */
export function searchAcrossDataSources(query, knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  const normalizedQuery = query.toLowerCase().trim();
  const results = {
    profile: [],
    cards: [],
    certificates: [],
    skills: [],
    aiBase: [],
    uploaded: [],
    interests: [],
    collaborations: [],
    experiences: [],
    specializations: [],
    languages: [],
    authorProfiles: [],
    gallery: [],
    discussionRoom: [],
    allMatches: []
  };

  // Search in profile
  if (data.profile) {
    for (const [key, value] of Object.entries(data.profile)) {
      const text = (value || '').toString().toLowerCase();
      if (text.includes(normalizedQuery)) {
        results.profile.push({ field: key, value: value, type: 'profile' });
        results.allMatches.push({ field: key, value: value, type: 'profile', score: 1 });
      }
    }
  }

  // Search in cards
  for (const card of data.cards) {
    const cardText = `${card.title || ''} ${card.content || ''}`.toLowerCase();
    if (cardText.includes(normalizedQuery)) {
      results.cards.push(card);
      results.allMatches.push({ ...card, type: 'card', score: 1 });
    }
  }

  // Search in certificates
  for (const cert of data.certificates) {
    const certText = `${cert.name || ''} ${cert.issuer || ''} ${cert.description || ''}`.toLowerCase();
    if (certText.includes(normalizedQuery)) {
      results.certificates.push(cert);
      results.allMatches.push({ ...cert, type: 'certificate', score: 1 });
    }
  }

  // Search in skills
  for (const skill of data.skills) {
    const skillText = `${skill.name || ''} ${skill.description || ''} ${skill.tags?.join(' ') || ''}`.toLowerCase();
    if (skillText.includes(normalizedQuery)) {
      results.skills.push(skill);
      results.allMatches.push({ ...skill, type: 'skill', score: 1 });
    }
  }

  // Search in AI Base
  for (const [question, answer] of Object.entries(data.aiBase)) {
    const aiText = `${question || ''} ${answer || ''}`.toLowerCase();
    if (aiText.includes(normalizedQuery)) {
      results.aiBase.push({ question, answer });
      results.allMatches.push({ question, answer, type: 'ai_concept', score: 1 });
    }
  }

  // Search in interests
  if (typeof data.interests === 'object') {
    const interestText = JSON.stringify(data.interests).toLowerCase();
    if (interestText.includes(normalizedQuery)) {
      results.interests.push(data.interests);
      results.allMatches.push({ ...data.interests, type: 'interests', score: 1 });
    }
  }

  // Search in collaborations
  for (const collab of data.collaborations) {
    const collabText = `${collab.title || ''} ${collab.description || ''}`.toLowerCase();
    if (collabText.includes(normalizedQuery)) {
      results.collaborations.push(collab);
      results.allMatches.push({ ...collab, type: 'collaboration', score: 1 });
    }
  }

  // Search in uploaded files
  for (const file of data.uploadedData) {
    const fileText = `${file.fileName || ''} ${file.extractedText || ''} ${file.preview || ''}`.toLowerCase();
    if (fileText.includes(normalizedQuery)) {
      results.uploaded.push(file);
      results.allMatches.push({ ...file, type: 'uploaded_file', score: 1 });
    }
  }

  // Search in author profiles
  for (const auth of data.authorProfiles) {
    const authText = `${auth.name || ''} ${auth.bio || ''} ${auth.expertise || ''} ${auth.company || ''}`.toLowerCase();
    if (authText.includes(normalizedQuery)) {
      results.authorProfiles.push(auth);
      results.allMatches.push({ ...auth, type: 'author_profile', score: 1 });
    }
  }

  // Search in experiences
  for (const exp of data.experiences) {
    const expText = `${exp.title || ''} ${exp.position || ''} ${exp.company || ''} ${exp.description || ''} ${exp.tags?.join(' ') || ''}`.toLowerCase();
    if (expText.includes(normalizedQuery)) {
      results.experiences.push(exp);
      results.allMatches.push({ ...exp, type: 'experience', score: 1 });
    }
  }

  // Search in specializations
  for (const spec of data.specializations) {
    const specText = `${spec.title || ''} ${spec.description || ''} ${spec.skills?.join(' ') || ''}`.toLowerCase();
    if (specText.includes(normalizedQuery)) {
      results.specializations.push(spec);
      results.allMatches.push({ ...spec, type: 'specialization', score: 1 });
    }
  }

  // Search in languages & technologies (/bahasa)
  for (const lang of (data.languages || [])) {
    const langText = `${lang.nama || lang.name || ''} ${lang.tingkat || ''} ${lang.deskripsi || ''} ${lang.penjelasan || ''} ${(lang.kemampuan || []).join(' ')} ${(lang.framework || []).join(' ')} ${(lang.tools || []).join(' ')}`.toLowerCase();
    if (langText.includes(normalizedQuery)) {
      results.languages.push(lang);
      results.allMatches.push({ ...lang, type: 'language', score: 1 });
    }
  }

  // Search in gallery
  for (const gal of data.gallery) {
    const galText = `${gal.title || ''} ${gal.desc || ''} ${gal.category || ''} ${gal.tags?.join(' ') || ''}`.toLowerCase();
    if (galText.includes(normalizedQuery)) {
      results.gallery.push(gal);
      results.allMatches.push({ ...gal, type: 'gallery', score: 1 });
    }
  }

  // Search in discussion room
  for (const disc of data.discussionRoom) {
    const discText = `${disc.content || ''} ${disc.username || ''}`.toLowerCase();
    if (discText.includes(normalizedQuery)) {
      results.discussionRoom.push(disc);
      results.allMatches.push({ ...disc, type: 'discussion_room', score: 1 });
    }
  }

  // Sort all matches by relevance (simple heuristic)
  results.allMatches.sort((a, b) => {
    const typeOrder = { 
      'author_profile': 6,
      'profile': 5, 
      'experience': 5,
      'specialization': 4,
      'skill': 4, 
      'ai_concept': 4, 
      'card': 3, 
      'certificate': 3, 
      'gallery': 3,
      'collaboration': 2, 
      'interests': 2, 
      'discussion_room': 2,
      'uploaded_file': 1 
    };
    return (typeOrder[b.type] || 0) - (typeOrder[a.type] || 0);
  });

  return results;
}

/**
 * Get formatted profile information
 */
export function getProfileInfo(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  const profile = data.profile;

  if (!profile || Object.keys(profile).length === 0) {
    return null;
  }

  let info = `**Tentang Penulis:**\n\n`;
  
  if (profile.name) {
    info += `Nama: ${profile.name}\n`;
  }
  
  if (profile.title) {
    info += `Profesi: ${profile.title}\n`;
  }
  
  if (profile.description) {
    info += `Deskripsi: ${profile.description}\n`;
  }
  
  if (profile.highlight1) {
    info += `Fokus: ${profile.highlight1}\n`;
  }

  return info;
}

/**
 * Get all skills with formatting
 */
export function getFormattedSkills(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  const skills = data.skills;

  if (!skills || skills.length === 0) {
    return null;
  }

  let output = `**💡 Soft Skills & Keahlian:**\n\n`;
  
  const grouped = {};
  for (const skill of skills) {
    const category = skill.category || 'Umum';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(skill);
  }

  for (const [category, items] of Object.entries(grouped)) {
    output += `**${category}:**\n`;
    for (const skill of items.slice(0, 5)) {
      const level = skill.level ? ` (${skill.level})` : '';
      const icon = skill.icon ? `${skill.icon} ` : '';
      output += `- ${icon}${skill.name}${level}\n`;
      if (skill.description) {
        output += `  *${skill.description}*\n`;
      }
    }
    output += '\n';
  }

  return output;
}

/**
 * Get formatted languages & tech stack summary (/bahasa)
 */
export function getLanguagesSummary(knowledgeBase = {}) {
  const languages = Array.isArray(knowledgeBase.languages)
    ? knowledgeBase.languages
    : (knowledgeBase.languagesDetail?.all || []);

  if (!languages || languages.length === 0) return null;

  const spoken = languages.filter(l => l.category === 'bahasa_sehari_hari');
  const coding = languages.filter(l => l.category === 'bahasa_pemrograman');

  let text = '🌐 **Kemampuan Bahasa & Teknologi Muhammad Syaiful Mukmin**:\n\n';

  if (spoken.length > 0) {
    text += '🗣️ **Bahasa Komunikasi**:\n';
    spoken.forEach(s => {
      text += `• **${s.nama || s.name}** (${s.tingkat || 'Aktif'} - ${s.level}%): ${s.deskripsi || s.penjelasan || ''}\n`;
    });
    text += '\n';
  }

  if (coding.length > 0) {
    text += '💻 **Teknologi & Bahasa Pemrograman Utama**:\n';
    coding.slice(0, 8).forEach(c => {
      const fw = Array.isArray(c.framework) && c.framework.length > 0 ? ` (Framework: ${c.framework.slice(0, 3).join(', ')})` : '';
      text += `• **${c.nama || c.name}** (${c.tingkat} - ${c.level}%)${fw}\n`;
    });
  }

  text += '\n🔗 *Lihat penjelasan lengkap setiap bahasa di halaman*: `/bahasa`';
  return text;
}

/**
 * Get certificate summary
 */
export function getCertificateSummary(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  const certificates = data.certificates;

  if (!certificates || certificates.length === 0) {
    return null;
  }

  let output = `**🏆 Sertifikasi & Penghargaan:**\n\n`;
  
  for (const cert of certificates.slice(0, 10)) {
    output += `- **${cert.name || cert.title}**\n`;
    if (cert.issuer) output += `  Dari: ${cert.issuer}\n`;
    if (cert.date) output += `  Tahun: ${cert.date}\n`;
    if (cert.description) output += `  ${cert.description}\n`;
  }

  return output;
}

/**
 * Get AI concepts summary
 */
export function getAIConceptsSummary(knowledgeBase = {}, limit = 5) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  const aiBase = data.aiBase;

  if (!aiBase || Object.keys(aiBase).length === 0) {
    return null;
  }

  let output = `**🤖 Konsep AI yang Aku Tahu:**\n\n`;
  
  const entries = Object.entries(aiBase).slice(0, limit);
  for (const [question, answer] of entries) {
    output += `• **${question}**\n  ${answer}\n\n`;
  }

  return output;
}

/**
 * Get interests & hobbies
 */
export function getInterestsInfo(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  const interests = data.interests;

  if (!interests || Object.keys(interests).length === 0) {
    return null;
  }

  let output = `**✨ Minat & Hobi Pribadi:**\n\n`;
  
  if (interests.sectionTitle) {
    output += `${interests.sectionTitle}\n\n`;
  }
  
  if (interests.description) {
    output += `${interests.description}\n`;
  }

  return output;
}

/**
 * Get collaborations summary
 */
export function getCollaborationsSummary(collaborations = []) {
  if (!collaborations || collaborations.length === 0) {
    return null;
  }

  let output = `**🤝 Kolaborasi & Proyek:**\n\n`;
  
  for (const collab of collaborations.slice(0, 5)) {
    output += `- **${collab.title || collab.name}**\n`;
    if (collab.description) output += `  ${collab.description}\n`;
    if (collab.role) output += `  Peran: ${collab.role}\n`;
    if (collab.date || collab.period) output += `  Waktu: ${collab.date || collab.period}\n`;
  }

  return output;
}

/**
 * Suggest relevant data based on user query
 */
export function suggestDataBasedOnQuery(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const suggestions = {
    showProfile: false,
    showSkills: false,
    showCertificates: false,
    showAI: false,
    showInterests: false,
    showCollaborations: false,
    showLanguages: false,
    showData: []
  };

  // Determine what to show
  if (/siapa|tentang|profile|portofolio|resume|cv/.test(normalizedQuery)) {
    suggestions.showProfile = true;
    suggestions.showCertificates = true;
  }

  if (/bahasa|language|pemrograman|coding|koding|tech stack|teknologi|javascript|react|python|typescript|docker|vue|sql|golang|rust|php|java/.test(normalizedQuery)) {
    suggestions.showLanguages = true;
  }

  if (/keahlian|skill|mampu|bisa|dapat|kemampuan/.test(normalizedQuery)) {
    suggestions.showSkills = true;
  }

  if (/sertifikat|award|penghargaan|prestasi/.test(normalizedQuery)) {
    suggestions.showCertificates = true;
  }

  if (/ai|machine learning|artificial intelligence|coding|programming|python/.test(normalizedQuery)) {
    suggestions.showAI = true;
    suggestions.showSkills = true;
  }

  if (/hobi|minat|kegemaran|suka|senang|aktivitas/.test(normalizedQuery)) {
    suggestions.showInterests = true;
  }

  if (/kolaborasi|proyek|kerja sama|kerjasama|project/.test(normalizedQuery)) {
    suggestions.showCollaborations = true;
  }

  if (/data|informasi|data apa|ada apa/.test(normalizedQuery)) {
    suggestions.showProfile = true;
    suggestions.showAI = true;
  }

  return suggestions;
}

/**
 * Generate comprehensive answer combining multiple data sources
 * WRAPPER: Menggabungkan Enhanced Knowledge Base answer dengan Data Integration results
 * 
 * @param {string} query - user query
 * @param {object} knowledgeBase - seluruh knowledge base (profile, skills, certificates, dll)
 * @returns {string|null} comprehensive answer atau null jika tidak ada match
 */
export function generateComprehensiveAnswer(query, knowledgeBase = {}) {
  try {
    // First: Try enhanced knowledge base untuk AI concepts dan structured knowledge
    const enhancedAnswer = generateEnhancedAnswer(query, null);
    if (enhancedAnswer && enhancedAnswer.success && enhancedAnswer.confidence > 0.6) {
      return enhancedAnswer.answer;
    }

    // Second: Try data integration search untuk personal data, skills, certificates
    const searchResults = searchAcrossDataSources(query, knowledgeBase);
    const suggestions = suggestDataBasedOnQuery(query, knowledgeBase);
    
    let answer = '';
    const used = [];

    // Add relevant profile info
    if (suggestions.showProfile && searchResults.profile.length > 0) {
      answer += getProfileInfo(knowledgeBase) || '';
      used.push('profile');
    }

    // Add relevant skills
    if (suggestions.showSkills && searchResults.skills.length > 0) {
      const skillsInfo = getFormattedSkills(knowledgeBase);
      if (skillsInfo) {
        answer += (answer ? '\n\n' : '') + skillsInfo;
        used.push('skills');
      }
    }

    // Add certificates
    if (suggestions.showCertificates && searchResults.certificates.length > 0) {
      const certInfo = getCertificateSummary(knowledgeBase);
      if (certInfo) {
        answer += (answer ? '\n\n' : '') + certInfo;
        used.push('certificates');
      }
    }

    // Add AI concepts
    if (suggestions.showAI && searchResults.aiBase.length > 0) {
      const aiInfo = getAIConceptsSummary(knowledgeBase, 3);
      if (aiInfo) {
        answer += (answer ? '\n\n' : '') + aiInfo;
        used.push('ai_concepts');
      }
    }

    // Add interests
    if (suggestions.showInterests && searchResults.interests.length > 0) {
      const interestInfo = getInterestsInfo(knowledgeBase);
      if (interestInfo) {
        answer += (answer ? '\n\n' : '') + interestInfo;
        used.push('interests');
      }
    }

    // Add collaborations
    if (suggestions.showCollaborations && searchResults.collaborations.length > 0) {
      const collabInfo = getCollaborationsSummary(searchResults.collaborations);
      if (collabInfo) {
        answer += (answer ? '\n\n' : '') + collabInfo;
        used.push('collaborations');
      }
    }

    // Add languages & tech stack
    if (suggestions.showLanguages && (searchResults.languages.length > 0 || (knowledgeBase.languages && knowledgeBase.languages.length > 0))) {
      const langInfo = getLanguagesSummary(knowledgeBase);
      if (langInfo) {
        answer += (answer ? '\n\n' : '') + langInfo;
        used.push('languages');
      }
    }

    // Add all matched search results if not already covered
    if (searchResults.allMatches.length > 0 && used.length === 0) {
      answer += `**Hasil Pencarian:**\n\n`;
      for (const match of searchResults.allMatches.slice(0, 5)) {
        if (match.type === 'ai_concept') {
          answer += `• **${match.question}**: ${match.answer}\n`;
        } else if (match.type === 'language') {
          answer += `• **${match.nama || match.name}** (${match.tingkat || 'Aktif'} - ${match.level}%): ${match.deskripsi || match.penjelasan || ''}\n`;
        } else if (match.type === 'skill') {
          answer += `• **${match.name}**: ${match.description}\n`;
        } else if (match.type === 'card') {
          answer += `• **${match.title}**: ${match.content}\n`;
        } else if (match.type === 'certificate') {
          answer += `• **${match.name}** (${match.issuer}): ${match.description || match.issueDate}\n`;
        } else if (match.type === 'collaboration') {
          answer += `• **${match.title}**: ${match.description}\n`;
        } else {
          answer += `• ${JSON.stringify(match).slice(0, 100)}\n`;
        }
      }
    }

    return answer && answer.trim().length > 20 ? answer : null;
  } catch (e) {
    console.error('Error in generateComprehensiveAnswer:', e);
    return null;
  }
}

/**
 * Get data statistics
 */
export function getDataStatistics(knowledgeBase = {}) {
  const loadedData = loadDataFromKnowledgeBase(knowledgeBase);

  return {
    profileFields: Object.keys(loadedData.profile).length,
    cards: loadedData.cards.length,
    certificates: loadedData.certificates.length,
    collaborations: loadedData.collaborations.length,
    skills: loadedData.skills.length,
    aiConcepts: Object.keys(loadedData.aiBase).length,
    uploadedFiles: loadedData.uploadedData.length,
    totalItems: loadedData.metadata.itemsCount,
    experiences: loadedData.experiences.length,
    specializations: loadedData.specializations.length,
    authorProfiles: loadedData.authorProfiles.length,
    gallery: loadedData.gallery.length,
    discussionRoom: loadedData.discussionRoom.length,
    categories: [
      'profile',
      'cards',
      'certificates',
      'collaborations',
      'skills',
      'experiences',
      'specializations',
      'author_profiles',
      'gallery',
      'discussion_room',
      'ai_concepts',
      'uploaded_files'
    ].filter(cat => {
      const map = {
        'profile': loadedData.profile,
        'cards': loadedData.cards,
        'certificates': loadedData.certificates,
        'collaborations': loadedData.collaborations,
        'skills': loadedData.skills,
        'experiences': loadedData.experiences,
        'specializations': loadedData.specializations,
        'author_profiles': loadedData.authorProfiles,
        'gallery': loadedData.gallery,
        'discussion_room': loadedData.discussionRoom,
        'ai_concepts': loadedData.aiBase,
        'uploaded_files': loadedData.uploadedData
      };
      return Array.isArray(map[cat]) ? map[cat].length > 0 : Object.keys(map[cat] || {}).length > 0;
    })
  };
}

/**
 * Get Author Profiles Summary
 */
export function getAuthorProfilesSummary(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  if (!data.authorProfiles || data.authorProfiles.length === 0) return null;

  let output = `✍️ **Daftar Penulis Blog:**\n\n`;
  for (const auth of data.authorProfiles) {
    output += `• **${auth.name}**\n  ${auth.bio || ''}\n  *Keahlian: ${auth.expertise || '-'} | Lokasi: ${auth.location || '-'}*\n\n`;
  }
  return output;
}

/**
 * Get Experiences Summary
 */
export function getExperiencesSummary(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  if (!data.experiences || data.experiences.length === 0) return null;

  let output = `💼 **Riwayat Pengalaman & Karir:**\n\n`;
  for (const exp of data.experiences) {
    output += `• **${exp.position || exp.title}** (${exp.company || '-'})\n  Periode: ${exp.period || '-'}\n  ${exp.description || ''}\n\n`;
  }
  return output;
}

/**
 * Get Gallery Summary
 */
export function getGallerySummary(knowledgeBase = {}) {
  const data = loadDataFromKnowledgeBase(knowledgeBase);
  if (!data.gallery || data.gallery.length === 0) return null;

  let output = `🖼️ **Koleksi Galeri & Album:**\n\n`;
  for (const gal of data.gallery.slice(0, 5)) {
    output += `• **${gal.title}** (${gal.category || 'Fotografi'})\n  ${gal.desc || ''}\n\n`;
  }
  return output;
}
