/**
 * StorageService - Safe wrapper untuk localStorage dan sessionStorage
 * Menangani:
 * - Private browsing mode (localStorage tidak tersedia)
 * - Fallback ke sessionStorage
 * - Fallback ke in-memory storage
 * - Error handling untuk setiap operasi
 * - Automatic cleanup untuk old/expired data
 */

class StorageService {
  constructor() {
    this.memoryStore = new Map();
    this.storageType = this.detectStorageType();
  }

  /**
   * Detect available storage type
   * Priority: localStorage > sessionStorage > memory
   */
  detectStorageType() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return 'localStorage';
    } catch {
      console.warn('localStorage tidak tersedia (private mode?), gunakan sessionStorage');
      try {
        const test = '__test__';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return 'sessionStorage';
      } catch {
        console.warn('sessionStorage juga tidak tersedia, gunakan memory storage');
        return 'memory';
      }
    }
  }

  /**
   * Get item dari storage
   * @param {string} key
   * @param {*} fallback - Default value jika tidak ditemukan
   * @returns {*} - Parsed value atau fallback
   */
  get(key, fallback = null) {
    try {
      let item;

      if (this.storageType === 'localStorage') {
        item = localStorage.getItem(key);
      } else if (this.storageType === 'sessionStorage') {
        item = sessionStorage.getItem(key);
      } else {
        item = this.memoryStore.has(key) ? this.memoryStore.get(key) : null;
      }

      if (item === null) {
        return fallback;
      }

      try {
        return JSON.parse(item);
      } catch {
        // Jika bukan JSON valid, return as string
        return item;
      }
    } catch (e) {
      console.warn(`StorageService.get('${key}') error:`, e.message);
      return fallback;
    }
  }

  /**
   * Set item ke storage
   * @param {string} key
   * @param {*} value - Any value (akan di-JSON.stringify)
   * @returns {boolean} - true jika berhasil, false jika gagal
   */
  set(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

      if (this.storageType === 'localStorage') {
        localStorage.setItem(key, stringValue);
      } else if (this.storageType === 'sessionStorage') {
        sessionStorage.setItem(key, stringValue);
      } else {
        this.memoryStore.set(key, stringValue);
      }

      return true;
    } catch (e) {
      console.warn(`StorageService.set('${key}') error:`, e.message);
      // Fallback ke memory jika storage penuh
      if (this.storageType !== 'memory') {
        this.memoryStore.set(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
      return false;
    }
  }

  /**
   * Remove item dari storage
   * @param {string} key
   * @returns {boolean} - true jika berhasil
   */
  remove(key) {
    try {
      if (this.storageType === 'localStorage') {
        localStorage.removeItem(key);
      } else if (this.storageType === 'sessionStorage') {
        sessionStorage.removeItem(key);
      } else {
        this.memoryStore.delete(key);
      }
      return true;
    } catch (e) {
      console.warn(`StorageService.remove('${key}') error:`, e.message);
      return false;
    }
  }

  /**
   * Clear semua storage untuk key pattern tertentu
   * @param {string} pattern - Regex pattern atau prefix string
   * @returns {number} - Jumlah items yang dihapus
   */
  clear(pattern = null) {
    try {
      let deleted = 0;

      if (this.storageType === 'localStorage') {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (!pattern || key.includes(pattern)) {
            localStorage.removeItem(key);
            deleted++;
          }
        });
      } else if (this.storageType === 'sessionStorage') {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (!pattern || key.includes(pattern)) {
            sessionStorage.removeItem(key);
            deleted++;
          }
        });
      } else {
        if (!pattern) {
          deleted = this.memoryStore.size;
          this.memoryStore.clear();
        } else {
          this.memoryStore.forEach((value, key) => {
            if (key.includes(pattern)) {
              this.memoryStore.delete(key);
              deleted++;
            }
          });
        }
      }

      return deleted;
    } catch (e) {
      console.warn(`StorageService.clear() error:`, e.message);
      return 0;
    }
  }

  /**
   * Check apakah key exists
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    try {
      if (this.storageType === 'localStorage') {
        return localStorage.getItem(key) !== null;
      } else if (this.storageType === 'sessionStorage') {
        return sessionStorage.getItem(key) !== null;
      } else {
        return this.memoryStore.has(key);
      }
    } catch {
      return false;
    }
  }

  /**
   * Get all keys dari storage
   * @returns {string[]} - Array of keys
   */
  keys() {
    try {
      if (this.storageType === 'localStorage') {
        return Object.keys(localStorage);
      } else if (this.storageType === 'sessionStorage') {
        return Object.keys(sessionStorage);
      } else {
        return Array.from(this.memoryStore.keys());
      }
    } catch {
      return [];
    }
  }

  /**
   * Get storage size estimation
   * @returns {object} - { used: bytes, max: bytes, percentage: 0-100 }
   */
  getSize() {
    try {
      let used = 0;
      const keys = this.keys();

      keys.forEach((key) => {
        const item = this.storageType === 'localStorage'
          ? localStorage.getItem(key)
          : this.storageType === 'sessionStorage'
          ? sessionStorage.getItem(key)
          : this.memoryStore.get(key);

        if (item) {
          used += new Blob([item]).size;
        }
      });

      // Estimate max: localStorage typically 5-10MB, sessionStorage 5MB
      const max = this.storageType === 'memory' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

      return {
        used,
        max,
        percentage: Math.round((used / max) * 100),
        type: this.storageType
      };
    } catch {
      return { used: 0, max: 0, percentage: 0, type: this.storageType };
    }
  }

  /**
   * Safe batch operations
   * @param {function} callback - Function yang menerima storage instance
   * @returns {*} - Return value dari callback
   */
  batch(callback) {
    try {
      return callback(this);
    } catch (e) {
      console.error('StorageService batch error:', e);
      throw e;
    }
  }

  /**
   * Export all data (for backup/debugging)
   * @returns {object} - All key-value pairs
   */
  exportAll() {
    const result = {};
    try {
      this.keys().forEach((key) => {
        result[key] = this.get(key);
      });
    } catch (e) {
      console.warn('StorageService.exportAll() error:', e.message);
    }
    return result;
  }

  /**
   * Import data (for restore/debugging)
   * @param {object} data - Key-value pairs to import
   * @param {boolean} merge - true = merge dengan existing, false = replace
   * @returns {number} - Jumlah items yang di-import
   */
  importData(data, merge = false) {
    let imported = 0;
    try {
      if (!merge) {
        this.clear();
      }

      Object.entries(data || {}).forEach(([key, value]) => {
        if (this.set(key, value)) {
          imported++;
        }
      });
    } catch (e) {
      console.warn('StorageService.importData() error:', e.message);
    }
    return imported;
  }

  /**
   * Cleanup old data berdasarkan timestamp dalam key
   * Format key: 'prefix_timestamp' atau data harus punya createdAt
   * @param {number} maxAgeMs - Max age dalam milliseconds
   * @returns {number} - Jumlah items yang dihapus
   */
  cleanup(maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
    let deleted = 0;
    const now = Date.now();

    try {
      this.keys().forEach((key) => {
        try {
          const item = this.get(key);

          // Check timestamp dalam key (format: prefix_12345678)
          const parts = key.split('_');
          if (parts.length > 1) {
            const timestamp = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(timestamp) && now - timestamp > maxAgeMs) {
              this.remove(key);
              deleted++;
              return;
            }
          }

          // Check createdAt dalam value
          if (typeof item === 'object' && item?.createdAt) {
            const createdAt = new Date(item.createdAt).getTime();
            if (now - createdAt > maxAgeMs) {
              this.remove(key);
              deleted++;
            }
          }
        } catch {
          // Ignore error untuk individual items
        }
      });
    } catch (e) {
      console.warn('StorageService.cleanup() error:', e.message);
    }

    return deleted;
  }
}

// Create singleton instance
export const storageService = new StorageService();

// Export class untuk testing
export default StorageService;
