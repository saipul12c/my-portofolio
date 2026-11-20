import { useState, useEffect } from "react";

export const useScroll = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let currentShow = false;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 400;
          if (shouldShow !== currentShow) {
            currentShow = shouldShow;
            setShowScrollTop(shouldShow);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { showScrollTop };
};
