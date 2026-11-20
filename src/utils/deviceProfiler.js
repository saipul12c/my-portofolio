/**
 * deviceProfiler.js
 * Adaptive Hardware-Aware Profiler untuk mendeteksi kapasitas riil perangkat (CPU, RAM, Jaringan)
 * Memungkinkan website berjalan adaptif: Full Visual di perangkat flagship & GPU-Light di perangkat entry/hemat daya,
 * tanpa pernah mengorbankan atau menghapus fitur apa pun.
 */

import { useState, useEffect } from 'react';

/**
 * Mengambil profil kemampuan perangkat saat ini
 */
export function getDeviceCapability() {
  if (typeof window === 'undefined') {
    return {
      tier: 'mid',
      isLowTier: false,
      isMidTier: true,
      isHighTier: false,
      isMobile: false,
      saveData: false,
      effectiveType: '4g',
      prefersReducedMotion: false,
      hardwareConcurrency: 4,
      deviceMemory: 4,
    };
  }

  const isMobile = window.innerWidth < 768;
  const nav = typeof navigator !== 'undefined' ? navigator : {};

  // Membaca spesifikasi hardware riil (Web Standard API)
  const deviceMemory = nav.deviceMemory || 4; // RAM dalam GB (misal: 1, 2, 4, 8)
  const hardwareConcurrency = nav.hardwareConcurrency || 4; // Jumlah logical CPU cores

  // Status koneksi jaringan
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};
  const saveData = Boolean(conn.saveData);
  const effectiveType = conn.effectiveType || '4g';

  // Preferensi pengguna untuk reduced-motion
  const prefersReducedMotion = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Klasifikasi Tier Perangkat:
  // Low: RAM <= 3GB ATAU core CPU <= 4 ATAU mode hemat kuota aktif ATAU jaringan lambat (2G/3G)
  // High: RAM >= 6GB DAN core CPU >= 8 DAN jaringan 4G/5G
  // Mid: Di antara low dan high
  let tier = 'mid';
  if (saveData || effectiveType === '2g' || effectiveType === '3g' || deviceMemory <= 3 || (isMobile && hardwareConcurrency <= 4)) {
    tier = 'low';
  } else if (deviceMemory >= 6 && hardwareConcurrency >= 8 && !saveData) {
    tier = 'high';
  }

  return {
    tier,
    isLowTier: tier === 'low',
    isMidTier: tier === 'mid',
    isHighTier: tier === 'high',
    isMobile,
    saveData,
    effectiveType,
    prefersReducedMotion,
    hardwareConcurrency,
    deviceMemory,
  };
}

/**
 * React Hook untuk menggunakan profil kapabilitas perangkat secara reaktif
 */
export function useDeviceCapability() {
  const [capability, setCapability] = useState(getDeviceCapability);

  useEffect(() => {
    const handleUpdate = () => {
      setCapability(getDeviceCapability());
    };

    window.addEventListener('resize', handleUpdate, { passive: true });

    // Dengarkan perubahan status koneksi jika didukung
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && typeof conn.addEventListener === 'function') {
      conn.addEventListener('change', handleUpdate);
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      if (conn && typeof conn.removeEventListener === 'function') {
        conn.removeEventListener('change', handleUpdate);
      }
    };
  }, []);

  return capability;
}

/**
 * Menjalankan fungsi berat saat browser berada dalam kondisi idle
 * Mencegah blocking pada thread utama
 */
export function runWhenIdle(callback, timeout = 3000) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 800);
  }
}
