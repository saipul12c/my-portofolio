import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook untuk mendeteksi pembaruan versi aplikasi web di sisi klien
 * @param {Object} options
 * @param {number} options.checkIntervalMs - Interval polling berkala (default: 3 menit)
 * @param {boolean} options.autoCheckOnFocus - Apakah cek ulang saat user kembali ke tab (default: true)
 */
export function useVersionCheck({
  checkIntervalMs = 3 * 60 * 1000,
  autoCheckOnFocus = true
} = {}) {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState(null);
  const [newBuildTime, setNewBuildTime] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Dapatkan versi & build time lokal yang disuntikkan saat build
  const currentVersion = import.meta.env?.VITE_APP_VERSION || 
    (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.20.0');
    
  const currentBuildTime = import.meta.env?.VITE_BUILD_TIME || 
    (typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null);

  const isCheckingRef = useRef(false);

  const checkForUpdate = useCallback(async (isManual = false) => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      // Query string timestamp + no-store menjamin tidak mengambil cache browser
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error(`Status HTTP: ${response.status}`);
      }

      const data = await response.json();
      const serverVersion = data.version;
      const serverBuildTime = data.buildTime;

      // Cek apakah versi semver berbeda
      const isVersionDifferent = Boolean(
        serverVersion && currentVersion && serverVersion !== currentVersion
      );

      // Cek apakah waktu build di server lebih baru (khusus production)
      const isBuildNewer = Boolean(
        import.meta.env.PROD &&
        serverBuildTime &&
        currentBuildTime &&
        Number(serverBuildTime) > Number(currentBuildTime)
      );

      if (isVersionDifferent || isBuildNewer) {
        const updateKey = `dismissed_update_${serverVersion || serverBuildTime}`;
        const previouslyDismissed = sessionStorage.getItem(updateKey) === 'true';

        setNewVersion(serverVersion || currentVersion);
        setNewBuildTime(serverBuildTime || null);

        if (!previouslyDismissed || isManual) {
          setHasUpdate(true);
          setIsDismissed(false);
        }
      } else {
        if (isManual) {
          setHasUpdate(false);
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[VersionCheck] Info:', err.message);
      }
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [currentVersion, currentBuildTime]);

  useEffect(() => {
    // 1. Pengecekan awal dengan delay singkat (agar tidak mengganggu render awal aplikasi)
    const initialTimer = setTimeout(() => {
      checkForUpdate();
    }, 2500);

    // 2. Polling berkala setiap X milidetik
    const intervalTimer = setInterval(() => {
      checkForUpdate();
    }, checkIntervalMs);

    // 3. Pengecekan saat tab kembali aktif/fokus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && autoCheckOnFocus) {
        checkForUpdate();
      }
    };

    const handleFocus = () => {
      if (autoCheckOnFocus) {
        checkForUpdate();
      }
    };

    if (autoCheckOnFocus) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);
    }

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      if (autoCheckOnFocus) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      }
    };
  }, [checkForUpdate, checkIntervalMs, autoCheckOnFocus]);

  // Fungsi reload untuk user
  const reloadApp = useCallback(() => {
    // Hapus flag dismissal agar setelah reload kembali segar
    if (newVersion || newBuildTime) {
      sessionStorage.removeItem(`dismissed_update_${newVersion || newBuildTime}`);
    }
    // Hard reload
    window.location.reload();
  }, [newVersion, newBuildTime]);

  // Fungsi dismiss sementara untuk sesi browsing saat ini
  const dismissUpdate = useCallback(() => {
    if (newVersion || newBuildTime) {
      sessionStorage.setItem(`dismissed_update_${newVersion || newBuildTime}`, 'true');
    }
    setIsDismissed(true);
  }, [newVersion, newBuildTime]);

  return {
    hasUpdate: hasUpdate && !isDismissed,
    newVersion,
    currentVersion,
    newBuildTime,
    isChecking,
    reloadApp,
    dismissUpdate,
    checkForUpdate: () => checkForUpdate(true)
  };
}
