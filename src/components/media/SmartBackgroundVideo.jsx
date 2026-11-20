import React, { useRef, useState, useEffect } from 'react';
import { useDeviceCapability } from '../../utils/deviceProfiler';

/**
 * SmartBackgroundVideo
 * Memutar video latar belakang dengan cerdas:
 * 1. Otomatis pause saat keluar dari layar (IntersectionObserver) untuk menghemat decoder GPU HP
 * 2. Transisi opacity halus dari poster ke video (anti black-flash)
 * 3. Adaptif terhadap mode hemat kuota / jaringan 2G/3G
 */
export default function SmartBackgroundVideo({
  src,
  poster = '',
  className = 'absolute top-0 left-0 w-full h-full object-cover z-0',
  fallbackGradient = 'bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900',
  children
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { saveData } = useDeviceCapability();

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Jika mode hemat data ekstrem aktif, jangan auto-stream video besar
    if (saveData) {
      video.pause();
      return;
    }

    // IntersectionObserver: Hanya putar saat terlihat di viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay policy browser handle gracefully
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [saveData]);

  const handlePlaying = () => {
    setIsPlaying(true);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Fallback (Anti Black Flash) */}
      <div className={`absolute inset-0 ${fallbackGradient}`} />

      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster || undefined}
        autoPlay
        loop
        muted
        playsInline
        onPlaying={handlePlaying}
        className={`${className} transition-opacity duration-700 ease-out ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={src} type="video/mp4" />
        {children}
      </video>
    </div>
  );
}
