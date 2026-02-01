/**
 * Google reCAPTCHA v3 Integration (Updated 2025) - FRONTEND ONLY VERSION
 * 
 * PENTING: reCAPTCHA v3 bekerja di BACKGROUND, tidak ada widget/popup!
 * 
 * CATATAN: VERSION INI HANYA UNTUK FRONTEND. 
 * Untuk validasi lengkap, butuh backend dengan VITE_RECAPTCHA_SECRET_KEY
 * 
 * Gunakan environment variables:
 * VITE_RECAPTCHA_SITE_KEY=your_site_key (wajib untuk frontend)
 * 
 * Dokumentasi: https://developers.google.com/recaptcha/docs/v3
 */

/**
 * Load reCAPTCHA v3 script dengan sitekey
 * @param {string} siteKey - Optional site key untuk render parameter
 * @returns {Promise<void>}
 */
export const loadRecaptchaScript = (siteKey = null) => {
  return new Promise((resolve, reject) => {
    // Check if script already loaded
    if (window.grecaptcha) {
      console.log('✅ reCAPTCHA already loaded');
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      // Wait for it to load
      existingScript.onload = () => resolve();
      existingScript.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
      return;
    }

    const script = document.createElement('script');
    
    // Gunakan siteKey jika disediakan (membantu dengan timing issues)
    if (siteKey) {
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    } else {
      script.src = 'https://www.google.com/recaptcha/api.js';
    }
    
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ reCAPTCHA script loaded');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load reCAPTCHA script');
      reject(new Error('Failed to load reCAPTCHA script'));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Execute reCAPTCHA v3 verification
 * CATATAN: grecaptcha.ready() HARUS digunakan sebelum execute!
 * 
 * @param {string} action - Action name (e.g., 'submit_contact_form')
 * @returns {Promise<string>} - reCAPTCHA token
 */
export const executeRecaptcha = async (action = 'submit_contact_form') => {
  try {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.warn('⚠️ VITE_RECAPTCHA_SITE_KEY tidak dikonfigurasi di .env');
      throw new Error('reCAPTCHA tidak dikonfigurasi');
    }

    console.log('🔄 Loading reCAPTCHA with site key (first 10 chars):', siteKey.substring(0, 10) + '...');

    // Pastikan library loaded dengan site key
    await loadRecaptchaScript(siteKey);

    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA library tidak tersedia');
    }

    // PENTING: Gunakan grecaptcha.ready() untuk ensure library siap
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        console.log('🔄 Executing reCAPTCHA for action:', action);
        window.grecaptcha
          .execute(siteKey, { action })
          .then((token) => {
            console.log('✅ reCAPTCHA token obtained for action:', action);
            console.log('📋 Token (first 30 chars):', token.substring(0, 30) + '...');
            resolve(token);
          })
          .catch((error) => {
            console.error('❌ reCAPTCHA execution failed:', error);
            console.log('🔍 Error details:', {
              message: error.message,
              name: error.name,
              stack: error.stack
            });
            reject(error);
          });
      });
    });
  } catch (error) {
    console.error('❌ executeRecaptcha error:', error.message);
    throw error;
  }
};

/**
 * SIMPLE FRONTEND-ONLY VALIDATION
 * Hanya cek jika token memiliki format yang benar (panjang minimal)
 * CATATAN: Ini BUKAN validasi sebenarnya, hanya validasi dasar!
 * 
 * @param {string} token - reCAPTCHA token dari frontend
 * @returns {boolean} - Basic format validation
 */
export const validateRecaptchaTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Basic format check: reCAPTCHA tokens are usually long strings
  // Minimal length check (biasanya > 1000 karakter)
  return token.length > 500;
};

/**
 * Optional: Cek jika reCAPTCHA tersedia di window object
 * @returns {boolean}
 */
export const isRecaptchaAvailable = () => {
  return !!window.grecaptcha;
};