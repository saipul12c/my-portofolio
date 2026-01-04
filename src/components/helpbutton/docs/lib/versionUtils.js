// versionUtils.js
// Utility functions untuk mengelola data versi dari struktur JSON baru

/**
 * Mendapatkan informasi versi terbaru dari seluruh dokumentasi
 * @param {Array} docs - Array dokumen dari JSON
 * @returns {Object} Info versi terbaru
 */
export function getLatestVersionInfo(docs = []) {
  if (!Array.isArray(docs) || docs.length === 0) {
    return {
      versiWebsite: 'v0.0.0',
      versionCode: 'build-unknown',
      versionType: 'unknown',
      lastUpdated: 'N/A',
      author: 'Unknown',
      estimatedReadTime: 'N/A',
      compatibility: {},
      tags: [],
      content: 'Tidak ada data tersedia'
    };
  }

  // Helper untuk parsing dan perbandingan versi
  const parseVersion = (version = '') => {
    if (typeof version !== 'string') return [0, 0, 0];
    const clean = version.trim().replace(/^v/, '').split('-')[0];
    const parts = clean.split('.').map(n => parseInt(n, 10) || 0);
    // Pastikan selalu ada 3 bagian
    return [parts[0], parts[1] || 0, parts[2] || 0];
  };

  const compareVersions = (a = '', b = '') => {
    const pa = parseVersion(a);
    const pb = parseVersion(b);
    for (let i = 0; i < 3; i++) {
      if (pa[i] > pb[i]) return 1;
      if (pa[i] < pb[i]) return -1;
    }
    return 0;
  };

  // Cari dokumen dengan versi tertinggi
  let latestDoc = null;
  let highestVersion = '0.0.0';

  docs.forEach(doc => {
    if (doc && doc.version && compareVersions(doc.version, highestVersion) > 0) {
      highestVersion = doc.version;
      latestDoc = doc;
    }
  });

  // Jika tidak ditemukan berdasarkan versi, ambil yang terakhir diupdate
  if (!latestDoc) {
    const docsWithDates = docs
      .filter(doc => doc && doc.lastUpdated)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    
    latestDoc = docsWithDates[0] || docs[0] || {};
  }

  // Ambil informasi dari doc yang ditemukan
  return {
    versiWebsite: latestDoc.version || 'v0.0.0',
    versionCode: latestDoc.versionCode || 'build-unknown',
    versionType: latestDoc.versionType || 'stable',
    lastUpdated: latestDoc.lastUpdated || 'Belum ada data',
    author: latestDoc.author || 'Tim Dokumentasi',
    estimatedReadTime: latestDoc.estimatedReadTime || '5 menit',
    compatibility: latestDoc.compatibility || {},
    tags: Array.isArray(latestDoc.tags) ? latestDoc.tags : [],
    content: latestDoc.content || 'Tidak ada konten tersedia',
    title: latestDoc.title || 'Tidak ada judul',
    slug: latestDoc.slug || '',
    icon: latestDoc.icon || '',
    releaseChannel: latestDoc.releaseChannel || 'production'
  };
}

/**
 * Mendapatkan statistik dokumentasi
 * @param {Array} docs - Array dokumen
 * @returns {Object} Statistik dokumen
 */
export function getDocStats(docs = []) {
  if (!Array.isArray(docs)) {
    return { 
      totalSections: 0, 
      totalSubsections: 0, 
      majorVersions: 0, 
      stableVersions: 0,
      deprecatedVersions: 0,
      totalDocs: 0,
      uniqueTags: 0,
      totalAuthors: 0
    };
  }

  const totalSections = docs.length;
  const totalSubsections = docs.reduce((acc, doc) => {
    if (!doc || !Array.isArray(doc.subsections)) return acc;
    return acc + doc.subsections.length;
  }, 0);

  // Hitung berdasarkan versionType
  const versionCounts = docs.reduce((acc, doc) => {
    if (!doc || !doc.versionType) return acc;
    acc[doc.versionType] = (acc[doc.versionType] || 0) + 1;
    return acc;
  }, {});

  // Hitung berdasarkan status dari versionHistory
  const statusCounts = docs.reduce((acc, doc) => {
    if (!doc || !Array.isArray(doc.versionHistory)) return acc;
    
    // Ambil status dari entri pertama (terbaru)
    const latestHistory = doc.versionHistory[0];
    if (latestHistory && latestHistory.status) {
      acc[latestHistory.status.toLowerCase()] = (acc[latestHistory.status.toLowerCase()] || 0) + 1;
    }
    return acc;
  }, {});

  // Hitung tag unik
  const allTags = docs.reduce((acc, doc) => {
    if (doc && Array.isArray(doc.tags)) {
      doc.tags.forEach(tag => acc.add(tag));
    }
    return acc;
  }, new Set());

  // Hitung author unik
  const allAuthors = docs.reduce((acc, doc) => {
    if (doc && doc.author) {
      acc.add(doc.author);
    }
    return acc;
  }, new Set());

  return {
    totalSections,
    totalSubsections,
    majorVersions: versionCounts.major || 0,
    stableVersions: versionCounts.stable || 0,
    deprecatedVersions: statusCounts.deprecated || 0,
    currentVersions: statusCounts.current || 0,
    supportedVersions: statusCounts.supported || 0,
    totalDocs: totalSections + totalSubsections,
    uniqueTags: allTags.size,
    totalAuthors: allAuthors.size,
    latestRelease: getLatestVersionInfo(docs).versiWebsite
  };
}

/**
 * Mendapatkan dokumen berdasarkan slug
 * @param {Array} docs - Array dokumen
 * @param {string} slug - Slug dokumen yang dicari
 * @returns {Object|null} Dokumen yang ditemukan atau null
 */
export function getDocBySlug(docs = [], slug = '') {
  if (!Array.isArray(docs) || !slug) return null;

  // Kumpulkan semua dokumen yang memiliki slug exact match
  const matches = docs.filter(doc => doc && doc.slug === slug);
  if (!matches || matches.length === 0) return null;

  if (matches.length === 1) return matches[0];

  // Jika ada beberapa entry dengan slug sama, prioritaskan yang statusnya CURRENT
  const currentMatch = matches.find(m => {
    const latestHistory = Array.isArray(m.versionHistory) ? m.versionHistory[0] : null;
    return latestHistory && String(latestHistory.status).toUpperCase() === 'CURRENT';
  });
  if (currentMatch) return currentMatch;

  // Jika tidak ada yang CURRENT, pilih versi dengan angka terbesar (semver-like)
  const parseVersionArr = (version) => {
    if (!version) return [0,0,0];
    const v = String(version).replace(/^v/i, '').split(/[^0-9]+/).filter(Boolean);
    return [parseInt(v[0]||0,10), parseInt(v[1]||0,10), parseInt(v[2]||0,10)];
  };

  matches.sort((a,b) => {
    const av = parseVersionArr(a.version || a.versionHistory?.[0]?.version);
    const bv = parseVersionArr(b.version || b.versionHistory?.[0]?.version);
    for (let i=0;i<3;i++) {
      if (av[i] !== bv[i]) return bv[i] - av[i];
    }
    return 0;
  });

  return matches[0] || null;
}

/**
 * Mendapatkan semua dokumen dengan versi tertentu
 * @param {Array} docs - Array dokumen
 * @param {string} version - Versi yang dicari
 * @returns {Array} Dokumen dengan versi tertentu
 */
export function getDocsByVersion(docs = [], version = '') {
  if (!Array.isArray(docs) || !version) return [];
  return docs.filter(doc => doc && doc.version === version);
}

/**
 * Mendapatkan semua dokumen berdasarkan tipe versi
 * @param {Array} docs - Array dokumen
 * @param {string} versionType - Tipe versi (major, stable, etc)
 * @returns {Array} Dokumen dengan tipe versi tertentu
 */
export function getDocsByVersionType(docs = [], versionType = '') {
  if (!Array.isArray(docs) || !versionType) return [];
  return docs.filter(doc => doc && doc.versionType === versionType);
}

/**
 * Mendapatkan dokumen dengan status tertentu
 * @param {Array} docs - Array dokumen
 * @param {string} status - Status yang dicari (current, supported, deprecated)
 * @returns {Array} Dokumen dengan status tertentu
 */
export function getDocsByStatus(docs = [], status = 'current') {
  if (!Array.isArray(docs) || !status) return [];
  
  return docs.filter(doc => {
    if (!doc || !Array.isArray(doc.versionHistory)) return false;
    
    const latestHistory = doc.versionHistory[0];
    return latestHistory && 
           latestHistory.status && 
           latestHistory.status.toLowerCase() === status.toLowerCase();
  });
}

/**
 * Mendapatkan riwayat perubahan untuk dokumen tertentu
 * @param {Object} doc - Dokumen
 * @returns {Array} Riwayat perubahan
 */
export function getDocChangelog(doc = {}) {
  if (!doc || !Array.isArray(doc.changelog)) return [];
  return doc.changelog;
}

/**
 * Mendapatkan riwayat versi untuk dokumen tertentu
 * @param {Object} doc - Dokumen
 * @returns {Array} Riwayat versi
 */
export function getDocVersionHistory(doc = {}) {
  if (!doc || !Array.isArray(doc.versionHistory)) return [];
  return doc.versionHistory;
}

/**
 * Mendapatkan semua dokumen yang memerlukan migrasi
 * @param {Array} docs - Array dokumen
 * @returns {Array} Dokumen yang memerlukan migrasi
 */
export function getDocsRequiringMigration(docs = []) {
  if (!Array.isArray(docs)) return [];
  
  return docs.filter(doc => {
    if (!doc || !Array.isArray(doc.versionHistory)) return false;
    
    const latestHistory = doc.versionHistory[0];
    return latestHistory && latestHistory.migrationRequired === true;
  });
}

/**
 * Mendapatkan semua dokumen dengan breaking changes
 * @param {Array} docs - Array dokumen
 * @returns {Array} Dokumen dengan breaking changes
 */
export function getDocsWithBreakingChanges(docs = []) {
  if (!Array.isArray(docs)) return [];
  
  return docs.filter(doc => {
    if (!doc || !Array.isArray(doc.versionHistory)) return false;
    
    const latestHistory = doc.versionHistory[0];
    return latestHistory && latestHistory.breakingChanges === true;
  });
}

/**
 * Mendapatkan semua dokumen yang terkait dengan dokumen tertentu
 * @param {Array} docs - Array dokumen
 * @param {string} slug - Slug dokumen utama
 * @returns {Array} Dokumen terkait
 */
export function getRelatedDocs(docs = [], slug = '') {
  if (!Array.isArray(docs) || !slug) return [];
  
  const mainDoc = getDocBySlug(docs, slug);
  if (!mainDoc || !Array.isArray(mainDoc.relatedDocs)) return [];
  
  return mainDoc.relatedDocs.map(relatedSlug => 
    getDocBySlug(docs, relatedSlug)
  ).filter(Boolean);
}

/**
 * Mendapatkan semua dokumen berdasarkan tag
 * @param {Array} docs - Array dokumen
 * @param {string|Array} tags - Tag atau array tag yang dicari
 * @returns {Array} Dokumen dengan tag tertentu
 */
export function getDocsByTag(docs = [], tags = []) {
  if (!Array.isArray(docs)) return [];
  
  const searchTags = Array.isArray(tags) ? tags : [tags];
  
  return docs.filter(doc => {
    if (!doc || !Array.isArray(doc.tags)) return false;
    
    return searchTags.some(tag => doc.tags.includes(tag));
  });
}

/**
 * Mendapatkan informasi kompatibilitas untuk dokumen tertentu
 * @param {Object} doc - Dokumen
 * @returns {Object} Informasi kompatibilitas
 */
export function getCompatibilityInfo(doc = {}) {
  if (!doc || !doc.compatibility) {
    return {
      minRequired: '1.0.0',
      testedUpTo: '1.0.0',
      browserSupport: [],
      apiCompatibility: 'v1'
    };
  }
  
  return {
    minRequired: doc.compatibility.minRequired || '1.0.0',
    testedUpTo: doc.compatibility.testedUpTo || '1.0.0',
    browserSupport: Array.isArray(doc.compatibility.browserSupport) 
      ? doc.compatibility.browserSupport 
      : [],
    apiCompatibility: doc.compatibility.apiCompatibility || 'v1'
  };
}

/**
 * Mendapatkan visual summary untuk dokumen tertentu
 * @param {Object} doc - Dokumen
 * @returns {Object} Visual summary
 */
export function getVisualSummary(doc = {}) {
  if (!doc || !doc.visual) {
    return {
      summary: 'Tidak ada summary tersedia',
      badge: 'Unknown',
      color: '#6b7280'
    };
  }
  
  return {
    summary: doc.visual.summary || 'Tidak ada summary tersedia',
    badge: doc.visual.badge || 'Unknown',
    color: doc.visual.color || '#6b7280'
  };
}

export default { 
  getLatestVersionInfo,
  getDocStats,
  getDocBySlug,
  getDocsByVersion,
  getDocsByVersionType,
  getDocsByStatus,
  getDocChangelog,
  getDocVersionHistory,
  getDocsRequiringMigration,
  getDocsWithBreakingChanges,
  getRelatedDocs,
  getDocsByTag,
  getCompatibilityInfo,
  getVisualSummary
};