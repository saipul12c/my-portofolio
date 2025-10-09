import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LaunchGuard({ children }) {
  const envDate = import.meta.env.VITE_LAUNCH_DATE;
  const launchDate = new Date(envDate);
  const [isReady, setIsReady] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const diff = now - launchDate;

      // kalau udah lebih dari 30 hari, skip launching selamanya
      const daysPassed = diff / (1000 * 60 * 60 * 24);
      if (daysPassed > 30) {
        setIsLaunched(true);
        setIsReady(true);
        return;
      }

      // kalau sudah waktunya (beri buffer 3 detik biar gak pingpong)
      if (now.getTime() >= launchDate.getTime() - 3000) {
        setIsLaunched(true);
      } else {
        setIsLaunched(false);
      }

      // tandai sudah siap ngecek
      setIsReady(true);
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  // Jangan render apapun sampai pengecekan pertama selesai
  if (!isReady) return null;

  // Belum waktunya, arahkan ke /launching
  if (!isLaunched && location.pathname !== "/launching") {
    return <Navigate to="/launching" replace />;
  }

  // Sudah waktunya tapi masih di /launching → langsung ke /
  if (isLaunched && location.pathname === "/launching") {
    return <Navigate to="/" replace />;
  }

  return children;
}