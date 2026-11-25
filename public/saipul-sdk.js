/**
 * SaipulAI Web SDK  v8.0.0
 * Universal Client-Side Integration for SaipulAI
 * 
 * Bebas kredensial sensitif. Siap pakai untuk integrasi web pihak ketiga.
 */
(function (global) {
  'use strict';

  class SaipulAI {
    /**
     * @param {Object} options
     * @param {string} [options.endpoint] - URL endpoint SaipulAI API (default: '/api/saipul')
     * @param {string} [options.style] - Gaya respon: 'friendly' | 'formal' | 'concise'
     * @param {number} [options.timeout] - Timeout request dalam milidetik (default: 8000)
     */
    constructor(options = {}) {
      this.endpoint = options.endpoint || (typeof window !== 'undefined' && window.location ? `${window.location.origin}/api/saipul` : '/api/saipul');
      this.defaultStyle = options.style || 'friendly';
      this.timeout = options.timeout || 8000;
      this.version = '8.0.0';
    }

    /**
     * Kirim pesan obrolan ke SaipulAI
     * @param {string} message
     * @param {Object} [overrideOptions]
     * @returns {Promise<{success: boolean, reply: string, intent?: string, language?: string, error?: string}>}
     */
    async chat(message, overrideOptions = {}) {
      if (!message || typeof message !== 'string' || !message.trim()) {
        throw new Error('[SaipulAI SDK] Pesan tidak boleh kosong.');
      }

      const payload = {
        message: message.trim(),
        style: overrideOptions.style || this.defaultStyle
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('[SaipulAI SDK] Permintaan melebihi batas waktu (timeout).');
        }
        throw err;
      }
    }

    /**
     * Hitung ekspresi matematika cepat (mendukung frasa alami maupun simbolik)
     * @param {string} expression Contoh: "15 * (4 + 6)" atau "akar kuadrat dari 144"
     */
    async calculate(expression) {
      return this.chat(`hitung ${expression}`);
    }

    /**
     * Status cek konektivitas endpoint
     */
    async ping() {
      try {
        const res = await fetch(this.endpoint, { method: 'GET' });
        return await res.json();
      } catch (err) {
        return { status: 'offline', error: err.message };
      }
    }

    /**
     * Versi SDK
     */
    static getVersion() {
      return '8.0.0';
    }
  }

  // Export ke environment browser atau CommonJS/ESM
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaipulAI;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () { return SaipulAI; });
  } else {
    global.SaipulAI = SaipulAI;
  }
})(typeof window !== 'undefined' ? window : globalThis);
