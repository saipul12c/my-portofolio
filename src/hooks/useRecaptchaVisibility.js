import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecaptcha } from '../context/useRecaptcha';

/**
 * Hook untuk mengelola CSS class yang menampilkan/menyembunyikan reCAPTCHA badge
 * Menambahkan class 'recaptcha-visible' ke document body saat di halaman /contact
 */
export function useRecaptchaVisibility() {
  const location = useLocation();
  const { showRecaptcha, hideRecaptcha } = useRecaptcha();

  useEffect(() => {
    const isContactPage = location.pathname === '/contact';
    
    if (isContactPage) {
      // Tambahkan class untuk show reCAPTCHA badge
      document.documentElement.classList.add('recaptcha-visible');
      showRecaptcha();
    } else {
      // Hapus class untuk hide reCAPTCHA badge
      document.documentElement.classList.remove('recaptcha-visible');
      hideRecaptcha();
    }

    return () => {
      // Cleanup saat unmount atau location berubah
      document.documentElement.classList.remove('recaptcha-visible');
      hideRecaptcha();
    };
  }, [location.pathname, showRecaptcha, hideRecaptcha]);
}
