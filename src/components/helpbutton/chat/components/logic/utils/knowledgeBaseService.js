/**
 * 🎯 KNOWLEDGE BASE SERVICE
 * 
 * Centralizes knowledge base state management
 * Eliminates multiple sources of truth in KB state
 * 
 * PROBLEM (Current):
 * - KB state exists in multiple places:
 *   1. HelpChatbotItem.jsx local state
 *   2. useChatbot.js local state
 *   3. localStorage (saipul_uploaded_data, saipul_file_metadata)
 *   4. ChatbotSettings.jsx props
 * 
 * - This causes:
 *   ❌ Sync issues (data diverges)
 *   ❌ Race conditions
 *   ❌ Hard to debug
 *   ❌ Memory leaks from multiple state copies
 * 
 * SOLUTION:
 * - Single KnowledgeBaseService
 * - Centralizes all KB operations
 * - Provides consistent API
 * - Handles storage/state internally
 */

import { storageService } from './storageService';
import { buildIndexFromKB, searchIndex } from './tfidfSearch';

// Storage keys
const STORAGE_KEYS = {
  KB_STATE: 'saipul_kb_state',
  UPLOADED_DATA: 'saipul_uploaded_data',
  FILE_METADATA: 'saipul_file_metadata',
  KB_STATS: 'saipul_kb_stats',
  KB_CACHE: 'saipul_kb_cache'
};

// Default KB structure
const DEFAULT_KB = {
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

/**
 * Knowledge Base Service
 * Single source of truth for KB state
 */
class KnowledgeBaseService {
  constructor() {
    this.kb = { ...DEFAULT_KB };
    this.stats = {
      totalItems: 0,
      totalCategories: 0,
      lastUpdated: null,
      loadTime: null
    };
    this.listeners = []; // For change notifications
    this.isLoading = false;
    this.lastError = null;
    this.tfidfIndex = null;
  }

  /**
   * Load KB from storage/remote
   * @returns {Promise<object>} - Loaded KB
   */
  async load(source = 'storage') {
    if (this.isLoading) {
      console.warn('KB load already in progress');
      return this.kb;
    }

    this.isLoading = true;
    const startTime = Date.now();

    try {
      if (source === 'storage') {
        return await this.loadFromStorage();
      } else if (source === 'remote') {
        return await this.loadFromRemote();
      } else {
        return await this.loadFromBoth();
      }
    } catch (error) {
      console.error('KB load error:', error);
      this.lastError = error;
      // Fallback to partial KB from storage
      try {
        const partialKB = storageService.get(STORAGE_KEYS.KB_STATE, { ...DEFAULT_KB });
        this.kb = { ...DEFAULT_KB, ...partialKB };
      } catch {
        this.kb = { ...DEFAULT_KB };
      }
      return this.kb;
    } finally {
      this.isLoading = false;
      this.stats.loadTime = Date.now() - startTime;
      this.updateStats();
      this.notify('load', { kb: this.kb, loadTime: this.stats.loadTime });
    }
  }

  /**
   * Load KB from local storage
   * @private
   */
  async loadFromStorage() {
    const stored = storageService.get(STORAGE_KEYS.KB_STATE, { ...DEFAULT_KB });
    const uploadedData = storageService.get(STORAGE_KEYS.UPLOADED_DATA, []);
    const fileMetadata = storageService.get(STORAGE_KEYS.FILE_METADATA, []);

    this.kb = {
      ...DEFAULT_KB,
      ...stored,
      uploadedData,
      fileMetadata
    };

    // build TF-IDF index for semantic search
    try {
      this.tfidfIndex = buildIndexFromKB(this.kb);
    } catch (e) {
      console.warn('Failed to build TF-IDF index from storage KB', e);
      this.tfidfIndex = null;
    }

    return this.kb;
  }

  /**
   * Load KB from remote (JSON files)
   * @private
   */
  async loadFromRemote() {
    const localFiles = [
      { path: '/src/components/helpbutton/chat/data/cards.json', key: 'cards' },
      { path: '/src/components/helpbutton/chat/data/certificates.json', key: 'certificates' },
      { path: '/src/components/helpbutton/chat/data/collaborations.json', key: 'collaborations' },
      { path: '/src/components/helpbutton/chat/data/interests.json', key: 'interests' },
      { path: '/src/components/helpbutton/chat/data/profile.json', key: 'profile' },
      { path: '/src/components/helpbutton/chat/data/softskills.json', key: 'softskills' },
      { path: '/src/components/helpbutton/chat/data/AI-base.json', key: 'AI' }
    ];

    const publicFiles = [
      { path: 'public/data/about/cards.json', key: 'cards' },
      { path: 'public/data/about/certificates.json', key: 'certificates' },
      { path: 'public/data/about/collaborations.json', key: 'collaborations' },
      { path: 'public/data/about/interests.json', key: 'interests' },
      { path: 'public/data/about/profile.json', key: 'profile' },
      { path: 'public/data/about/softskills.json', key: 'softskills' }
    ];

    const loaded = { ...DEFAULT_KB };
    const errors = [];

    // Load from local files
    for (const { path, key } of localFiles) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          if (key === 'AI') {
            loaded[key] = { ...loaded[key], ...data };
          } else {
            loaded[key] = data;
          }
        }
      } catch (error) {
        errors.push({ file: path, error: error.message });
      }
    }

    // Fallback to public files
    for (const { path, key } of publicFiles) {
      try {
        if (!loaded[key] || (Array.isArray(loaded[key]) && loaded[key].length === 0)) {
          const response = await fetch(path);
          if (response.ok) {
            const data = await response.json();
            loaded[key] = data;
          }
        }
      } catch (error) {
        errors.push({ file: path, error: error.message });
      }
    }

    if (errors.length > 0) {
      console.warn('Some KB files failed to load:', errors);
    }

    this.kb = loaded;
    this.lastError = errors.length > 0 ? errors : null;

    // build TF-IDF index for semantic search
    try {
      this.tfidfIndex = buildIndexFromKB(this.kb);
    } catch (e) {
      console.warn('Failed to build TF-IDF index from remote KB', e);
      this.tfidfIndex = null;
    }

    return this.kb;
  }

  /**
   * Load from both storage and remote (merge)
   * Storage takes priority, remote fills gaps
   * @private
   */
  async loadFromBoth() {
    await this.loadFromStorage();
    const remote = await this.loadFromRemote();

    // Merge: storage has priority for uploaded data
    // But remote fills in default KB items
    this.kb = {
      ...remote,
      uploadedData: this.kb.uploadedData,
      fileMetadata: this.kb.fileMetadata
    };

    return this.kb;
  }

  /**
   * Update KB section
   * @param {string} key - KB section (e.g., 'cards', 'AI', 'uploadedData')
   * @param {*} value - New value for section
   * @param {object} options - Update options
   */
  update(key, value, options = {}) {
    if (!(key in DEFAULT_KB)) {
      console.warn(`Unknown KB section: ${key}`);
      return false;
    }

    try {
      this.kb[key] = value;

      // Auto-save to storage unless disabled
      if (options.skipSave !== true) {
        this.save();
      }

      this.updateStats();
      // rebuild index incrementally (simple full rebuild)
      try { this.tfidfIndex = buildIndexFromKB(this.kb); } catch { this.tfidfIndex = null; }
      this.notify('update', { key, value });
      return true;
    } catch (error) {
      console.error(`Error updating KB[${key}]:`, error);
      return false;
    }
  }

  /**
   * Update multiple KB sections
   * @param {object} updates - { key: value, ... }
   * @param {object} options - Update options
   */
  updateMultiple(updates, options = {}) {
    try {
      for (const [key, value] of Object.entries(updates)) {
        if (key in DEFAULT_KB) {
          this.kb[key] = value;
        }
      }

      // Save once after all updates
      if (options.skipSave !== true) {
        this.save();
      }

      this.updateStats();
      try { this.tfidfIndex = buildIndexFromKB(this.kb); } catch { this.tfidfIndex = null; }
      this.notify('multiUpdate', { updates });
      return true;
    } catch (error) {
      console.error('Error in batch KB update:', error);
      return false;
    }
  }

  /**
   * Save KB to storage
   * @param {string} target - 'storage' | 'all'
   */
  save(target = 'storage') {
    try {
      if (target === 'storage' || target === 'all') {
        // Save KB state (excluding uploaded data, that's separate)
        const toSave = { ...this.kb };
        delete toSave.uploadedData;
        delete toSave.fileMetadata;
        storageService.set(STORAGE_KEYS.KB_STATE, toSave);

        // Save uploaded data separately
        storageService.set(STORAGE_KEYS.UPLOADED_DATA, this.kb.uploadedData);
        storageService.set(STORAGE_KEYS.FILE_METADATA, this.kb.fileMetadata);

        // Save stats
        storageService.set(STORAGE_KEYS.KB_STATS, this.stats);
      }

      this.notify('save', { target });
      return true;
    } catch (error) {
      console.error('Error saving KB:', error);
      return false;
    }
  }

  /**
   * Get KB section
   */
  get(key = null) {
    if (key === null) {
      return { ...this.kb };
    }

    if (key in this.kb) {
      return structuredClone(this.kb[key]); // Deep copy to prevent mutations
    }

    console.warn(`KB section not found: ${key}`);
    return null;
  }

  /**
   * Get KB stats
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Update KB statistics
   * @private
   */
  updateStats() {
    this.stats.totalItems = 0;
    this.stats.totalCategories = 0;
    this.stats.lastUpdated = new Date().toISOString();

    for (const [_key, value] of Object.entries(this.kb)) {
      if (Array.isArray(value)) {
        this.stats.totalItems += value.length;
        if (value.length > 0) this.stats.totalCategories++;
      } else if (typeof value === 'object' && value !== null) {
        const count = Object.keys(value).length;
        this.stats.totalItems += count;
        if (count > 0) this.stats.totalCategories++;
      }
    }
  }

  /**
   * Clear KB
   * @param {boolean} includingStorage - Also clear from storage
   */
  clear(includingStorage = false) {
    this.kb = { ...DEFAULT_KB };

    if (includingStorage) {
      storageService.remove(STORAGE_KEYS.KB_STATE);
      storageService.remove(STORAGE_KEYS.UPLOADED_DATA);
      storageService.remove(STORAGE_KEYS.FILE_METADATA);
      storageService.remove(STORAGE_KEYS.KB_STATS);
    }

    this.updateStats();
    this.notify('clear', { includingStorage });
  }

  /**
   * Reset to default KB
   */
  reset() {
    this.clear(true);
    this.save();
  }

  /**
   * Search KB
   * @param {string} query - Search query
   * @returns {object} - Search results { category: [results] }
   */
  search(query) {
    if (!query || typeof query !== 'string') {
      return {};
    }

    const q = query.toLowerCase();
    // Use TF-IDF semantic search when available
    if (this.tfidfIndex) {
      try {
        const hits = searchIndex(this.tfidfIndex, query, 10);
        // Group by section
        const grouped = {};
        hits.forEach(h => {
          const section = h.meta && h.meta.section ? h.meta.section : 'misc';
          if (!grouped[section]) grouped[section] = [];
          grouped[section].push({ id: h.id, score: h.score, text: h.text });
        });
        return grouped;
      } catch (e) {
        console.warn('TF-IDF search failed, falling back to substring search', e);
      }
    }

    // Fallback: substring search (legacy behavior)
    const results = {};

    for (const [key, value] of Object.entries(this.kb)) {
      if (Array.isArray(value)) {
        const matches = value.filter(item =>
          typeof item === 'string' ? item.toLowerCase().includes(q) :
          typeof item === 'object' && item ? 
            JSON.stringify(item).toLowerCase().includes(q) : false
        );
        if (matches.length > 0) {
          results[key] = matches;
        }
      } else if (typeof value === 'object' && value !== null) {
        const matches = {};
        for (const [k, v] of Object.entries(value)) {
          if (typeof v === 'string' && v.toLowerCase().includes(q)) {
            matches[k] = v;
          }
        }
        if (Object.keys(matches).length > 0) {
          results[key] = matches;
        }
      }
    }

    return results;
  }

  /**
   * Subscribe to KB changes
   * @param {function} callback - Called with (event, data)
   * @returns {function} - Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all subscribers of changes
   * @private
   */
  notify(event, data) {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in KB change listener:', error);
      }
    }
  }

  /**
   * Export KB for backup
   */
  export() {
    return {
      timestamp: new Date().toISOString(),
      version: '1.0',
      kb: structuredClone(this.kb),
      stats: { ...this.stats }
    };
  }

  /**
   * Import KB from backup
   */
  import(data) {
    try {
      if (!data || !data.kb) {
        throw new Error('Invalid backup data');
      }

      this.kb = { ...DEFAULT_KB, ...data.kb };
      this.updateStats();
      this.save();
      this.notify('import', { imported: true });
      return true;
    } catch (error) {
      console.error('Error importing KB:', error);
      return false;
    }
  }
}

// Create singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();

export default KnowledgeBaseService;
