import { useCallback, useEffect, useState } from 'react';

export const useRecaptcha = () => {
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(null);

  // Sitekey untuk reCAPTCHA v3 - Ganti dengan sitekey Anda sendiri
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Load reCAPTCHA script saat komponen mount
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      setRecaptchaError('reCAPTCHA Site Key tidak dikonfigurasi');
      return;
    }

    // Cek apakah script sudah ada
    if (window.grecaptcha) {
      setIsRecaptchaReady(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha) {
        setIsRecaptchaReady(true);
        setRecaptchaError(null);
      }
    };

    script.onerror = () => {
      setRecaptchaError('Gagal memuat reCAPTCHA script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup jika perlu
    };
  }, [RECAPTCHA_SITE_KEY]);

  // Function untuk mendapatkan reCAPTCHA token
  const getRecaptchaToken = useCallback(async (action = 'submit_form') => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA belum siap'));
        return;
      }

      if (!RECAPTCHA_SITE_KEY) {
        reject(new Error('reCAPTCHA Site Key tidak dikonfigurasi'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action })
          .then((token) => {
            resolve(token);
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  }, [RECAPTCHA_SITE_KEY]);

  return {
    isRecaptchaReady,
    recaptchaError,
    getRecaptchaToken,
    siteKey: RECAPTCHA_SITE_KEY,
  };
};
