/**
 * Data Loader Utility
 * Menangani loading, validasi, dan normalisasi data knowledge base
 * Path: src/components/helpbutton/chat/components/logic/utils/dataLoader.js
 */

import { kbMonitor } from './kbMonitoring';

/**
 * Check if running in development mode
 * Safely access process.env to avoid eslint errors
 * eslint-disable-next-line no-undef
 */
const isDevelopment = () => {
  try {
    // eslint-disable-next-line no-undef
    return typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
  } catch {
    return false;
  }
};

/**
 * Validasi struktur data berdasarkan key
 * @param {string} key - Nama data (cards, profile, dll)
 * @param {*} data - Data yang akan divalidasi
 * @returns {boolean} - True jika valid
 */
export function validateDataStructure(key, data) {
  if (!data) return false;

  const validators = {
    // Arrays
    cards: (d) => Array.isArray(d) && d.every(item => item.title || item.name),
    certificates: (d) => Array.isArray(d) && d.every(item => item.name || item.title),
    softskills: (d) => Array.isArray(d) && d.every(item => item.title || item.name),
    hobbies: (d) => Array.isArray(d) && d.every(item => item.title || item.name),
    collaborations: (d) => Array.isArray(d) && d.every(item => item.title || item.name),
    
    // Objects
    profile: (d) => typeof d === 'object' && !Array.isArray(d) && (d.name || d.title),
    interests: (d) => typeof d === 'object' && !Array.isArray(d),
    AI: (d) => typeof d === 'object' && !Array.isArray(d) && Object.keys(d).length > 0,
    aiDoc: (d) => typeof d === 'object' && !Array.isArray(d) && d.header_information,
    riwayat: (d) => Array.isArray(d) && d.length > 0 && d[0].version
  };

  const validator = validators[key];
  if (!validator) return true; // Unknown keys pass validation
  
  return validator(data);
}

/**
 * Normalisasi data yang mungkin dibungkus dalam object
 * @param {string} key - Nama data
 * @param {*} data - Raw data dari fetch
 * @returns {*} - Normalized data
 */
export function normalizeData(key, data) {
  if (!data) return null;

  // Jika data adalah object dan key ada sebagai property, ambil property tersebut
  if (typeof data === 'object' && !Array.isArray(data) && key in data) {
    return data[key];
  }

  // Untuk array-based data, jika hasil fetch adalah { key: [...] }, ekstrak arraynya
  if (Array.isArray(data)) {
    return data;
  }

  // Untuk object-based data (profile, interests)
  if (key === 'profile' || key === 'interests' || key === 'AI') {
    if (typeof data === 'object' && !Array.isArray(data)) {
      return data;
    }
  }

  return data;
}

/**
 * Load data dengan import langsung (recommended)
 * Fallback ke fetch jika import gagal
 * @returns {Promise<Object>} Knowledge base terisi
 */
export async function loadKnowledgeBaseData() {
  const startTime = performance.now();
  
  const defaultKnowledgeBase = {
    AI: {},
    hobbies: [],
    cards: [],
    certificates: [],
    collaborations: [],
    interests: {},
    profile: {},
    softskills: [],
    uploadedData: [],
    fileMetadata: [],
    aiDoc: {},
    riwayat: []
  };

  const loadResult = {
    success: true,
    loaded: [],
    failed: [],
    errors: {},
    warnings: []
  };

  try {
    // Gunakan dynamic imports untuk loading data
    // Ini lebih reliable daripada fetch paths yang bisa 404
    const dataModules = {
      profile: () => import('../data/profile.json'),
      cards: () => import('../data/cards.json'),
      certificates: () => import('../data/certificates.json'),
      softskills: () => import('../data/softskills.json'),
      hobbies: () => import('../data/hobbies.json'),
      collaborations: () => import('../data/collaborations.json'),
      interests: () => import('../data/interests.json'),
      AI: () => import('../data/AI-base.json'),
      aiDoc: () => import('../../../data/AIDoc/data.json'),
      riwayat: () => import('../../../data/AIDoc/riwayat/riwayat.json')
    };

    // Load semua data secara parallel
    for (const [key, moduleLoader] of Object.entries(dataModules)) {
      try {
        const module = await moduleLoader();
        // Ambil default export atau keseluruhan module
        const rawData = module.default || module;
        
        // Normalisasi data
        const normalizedData = normalizeData(key, rawData);
        
        // Validasi struktur
        if (validateDataStructure(key, normalizedData)) {
          defaultKnowledgeBase[key] = normalizedData;
          loadResult.loaded.push(key);
          
          if (isDevelopment()) {
            console.log(`✅ Loaded ${key}:`, {
              type: Array.isArray(normalizedData) ? 'array' : 'object',
              size: Array.isArray(normalizedData) ? normalizedData.length : Object.keys(normalizedData).length
            });
          }
        } else {
          loadResult.warnings.push(`Data structure invalid untuk ${key}`);
          loadResult.failed.push(key);
          kbMonitor.recordWarning(`Data structure invalid untuk ${key}`, 'dataLoader');
          
          if (isDevelopment()) {
            console.warn(`⚠️ Invalid structure untuk ${key}:`, normalizedData);
          }
        }
      } catch (error) {
        loadResult.failed.push(key);
        loadResult.errors[key] = error.message;
        kbMonitor.recordError(error, `Loading ${key}`);
        
        if (isDevelopment()) {
          console.warn(`⚠️ Could not load ${key}:`, error.message);
        }
      }
    }

  } catch (error) {
    loadResult.success = false;
    loadResult.errors.global = error.message;
    kbMonitor.recordError(error, 'Global data loading');
    console.error('❌ Fatal error in knowledge base loader:', error);
  }

  const loadTimeMs = performance.now() - startTime;
  kbMonitor.recordLoadComplete(loadResult, loadTimeMs);

  // Log summary
  if (isDevelopment()) {
    console.group('📊 Knowledge Base Load Summary');
    console.log('Loaded:', loadResult.loaded);
    console.log('Failed:', loadResult.failed);
    console.log('Load Time:', `${loadTimeMs.toFixed(2)}ms`);
    if (loadResult.warnings.length > 0) {
      console.warn('Warnings:', loadResult.warnings);
    }
    if (Object.keys(loadResult.errors).length > 0) {
      console.error('Errors:', loadResult.errors);
    }
    console.log('Knowledge Base Stats:', {
      aiConcepts: Object.keys(defaultKnowledgeBase.AI).length,
      cards: defaultKnowledgeBase.cards.length,
      certificates: defaultKnowledgeBase.certificates.length,
      softskills: defaultKnowledgeBase.softskills.length,
      hobbies: defaultKnowledgeBase.hobbies.length,
      collaborations: defaultKnowledgeBase.collaborations.length,
      profileKeys: Object.keys(defaultKnowledgeBase.profile).length,
      interests: Object.keys(defaultKnowledgeBase.interests).length
    });
    console.groupEnd();
  }

  return { knowledgeBase: defaultKnowledgeBase, loadResult };
}

/**
 * Fallback loader menggunakan fetch (untuk cases tertentu)
 * @returns {Promise<Object>}
 */
export async function fallbackLoadWithFetch() {
  const defaultKnowledgeBase = {
    AI: {},
    hobbies: [],
    cards: [],
    certificates: [],
    collaborations: [],
    interests: {},
    profile: {},
    softskills: [],
    uploadedData: [],
    fileMetadata: [],
    aiDoc: {},
    riwayat: []
  };

  const files = [
    { path: '/data/about/cards.json', key: 'cards' },
    { path: '/data/about/certificates.json', key: 'certificates' },
    { path: '/data/about/softskills.json', key: 'softskills' },
    { path: '/data/about/hobbies.json', key: 'hobbies' },
    { path: '/data/about/collaborations.json', key: 'collaborations' },
    { path: '/data/about/interests.json', key: 'interests' },
    { path: '/data/about/profile.json', key: 'profile' },
    { path: '/data/about/AI-base.json', key: 'AI' }
  ];

  for (const { path, key } of files) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const data = await response.json();
        const normalizedData = normalizeData(key, data);
        if (validateDataStructure(key, normalizedData)) {
          defaultKnowledgeBase[key] = normalizedData;
        }
      }
    } catch (error) {
      if (isDevelopment()) {
        console.warn(`Could not fetch ${path}:`, error.message);
      }
    }
  }

  return { knowledgeBase: defaultKnowledgeBase };
}

/**
 * Safe accessor untuk knowledge base
 * Memastikan data selalu ada (walaupun empty)
 */
export function safeAccessKnowledgeBase(knowledgeBase) {
  return {
    AI: knowledgeBase?.AI || {},
    hobbies: Array.isArray(knowledgeBase?.hobbies) ? knowledgeBase.hobbies : [],
    cards: Array.isArray(knowledgeBase?.cards) ? knowledgeBase.cards : [],
    certificates: Array.isArray(knowledgeBase?.certificates) ? knowledgeBase.certificates : [],
    collaborations: Array.isArray(knowledgeBase?.collaborations) ? knowledgeBase.collaborations : [],
    interests: knowledgeBase?.interests || {},
    profile: knowledgeBase?.profile || {},
    softskills: Array.isArray(knowledgeBase?.softskills) ? knowledgeBase.softskills : [],
    uploadedData: Array.isArray(knowledgeBase?.uploadedData) ? knowledgeBase.uploadedData : [],
    fileMetadata: Array.isArray(knowledgeBase?.fileMetadata) ? knowledgeBase.fileMetadata : [],
    aiDoc: knowledgeBase?.aiDoc || {},
    riwayat: Array.isArray(knowledgeBase?.riwayat) ? knowledgeBase.riwayat : []
  };
}
