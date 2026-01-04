// HappyNewYears.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

const HappyNewYears = () => {
  const [show, setShow] = useState(false);
  const [fireworks, setFireworks] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showSpecialMessage, setShowSpecialMessage] = useState(false);
  const [showName, setShowName] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  
  const messages = [
    "🎉 SELAMAT TAHUN BARU 2025! 🎉",
    "",
    "Di awal tahun yang penuh harapan ini,",
    "marilah kita panjatkan syukur atas segala rahmat,",
    "kesempatan, dan pembelajaran di tahun 2024.",
    "",
    "Semoga tahun 2025 membawa:",
    "• Kebahagiaan yang berlimpah",
    "• Kesehatan yang prima", 
    "• Kesuksesan dalam setiap langkah",
    "• Kedamaian dalam hati",
    "• Rezeki yang berkah dan halal",
    "",
    "Mari tinggalkan beban masa lalu,",
    "mulai lembaran baru dengan semangat,",
    "tekad, dan harapan yang lebih cerah.",
    "",
    "📜 Pesan Khusus:"
  ];

  // Cek apakah sudah di client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cek apakah overlay sudah pernah ditampilkan
  useEffect(() => {
    if (!isClient) return;
    
    const hasShown = localStorage.getItem('happyNewYearShown');
    const currentYear = new Date().getFullYear();
    
    // Tampilkan hanya jika belum pernah ditampilkan di tahun ini
    if (!hasShown || parseInt(hasShown) < currentYear) {
      // Delay sedikit untuk memastikan DOM sudah siap
      setTimeout(() => {
        setShow(true);
        localStorage.setItem('happyNewYearShown', currentYear.toString());
      }, 500);
      
      // Set timeout untuk auto close setelah 30 detik
      const timer = setTimeout(() => {
        setShow(false);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  // Mencegah scroll saat overlay terbuka
  useEffect(() => {
    if (!isClient) return;
    
    if (show) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [show, isClient]);

  // Efek untuk membuat kembang api yang lebih spektakuler
  useEffect(() => {
    if (!show || !isClient) return;
    
    const createFirework = () => {
      const colors = [
        '#FF5E5E', '#FFD166', '#06D6A0', '#118AB2', '#EF476F',
        '#FF9E6D', '#C44569', '#574B90', '#F97CCD', '#7BDFF2',
        '#FFEA00', '#9D4EDD', '#FF6B6B', '#4ECDC4', '#FF9A76'
      ];
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 30 + 20;
      const particleCount = Math.floor(Math.random() * 15) + 10;
      const fireworkType = Math.random() > 0.5 ? 'circle' : 'burst';
      
      const particles = [];
      
      if (fireworkType === 'circle') {
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const velocity = Math.random() * 4 + 2;
          particles.push({
            id: `${Date.now()}-${i}`,
            x,
            y,
            color,
            size: Math.random() * 5 + 2,
            angle,
            velocity,
            distance: 0,
            trail: []
          });
        }
      } else {
        // Burst pattern
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 5 + 3;
          particles.push({
            id: `${Date.now()}-${i}`,
            x,
            y,
            color,
            size: Math.random() * 6 + 3,
            angle,
            velocity,
            distance: 0,
            trail: []
          });
        }
      }
      
      setFireworks(prev => [...prev, ...particles]);
    };
    
    // Buat kembang api setiap 150ms selama 10 detik
    const interval = setInterval(createFirework, 150);
    
    const stopTimer = setTimeout(() => {
      clearInterval(interval);
    }, 10000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, [show, isClient]);

  // Animasikan partikel dengan efek trail
  useEffect(() => {
    if (!isClient || fireworks.length === 0) return;
    
    const moveParticles = () => {
      setFireworks(prev => 
        prev.map(p => {
          const newDistance = p.distance + p.velocity * 0.5;
          const newX = p.x + Math.cos(p.angle) * newDistance;
          const newY = p.y + Math.sin(p.angle) * newDistance;
          
          // Tambahkan trail
          const newTrail = [...p.trail, { x: p.x, y: p.y }];
          if (newTrail.length > 3) newTrail.shift();
          
          return {
            ...p,
            x: newX,
            y: newY,
            distance: newDistance,
            size: p.size * 0.93,
            trail: newTrail
          };
        }).filter(p => p.distance < 50 && p.size > 0.8)
      );
    };
    
    const animationInterval = setInterval(moveParticles, 40);
    return () => clearInterval(animationInterval);
  }, [fireworks.length, isClient]);

  // Efek typing untuk pesan
  useEffect(() => {
    if (!show || !isTyping || !isClient) return;
    
    if (textIndex < messages.length) {
      const currentMessage = messages[textIndex];
      
      if (charIndex < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + currentMessage[charIndex]);
          setCharIndex(prev => prev + 1);
        }, 35);
        
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + '\n');
          setCharIndex(0);
          setTextIndex(prev => prev + 1);
        }, 200);
        
        return () => clearTimeout(timeout);
      }
    } else {
      setIsTyping(false);
      const timeout = setTimeout(() => {
        setShowSpecialMessage(true);
        
        // Tampilkan nama khusus setelah pesan khusus
        setTimeout(() => {
          setShowName(true);
        }, 1500);
      }, 800);
      
      return () => clearTimeout(timeout);
    }
  }, [show, textIndex, charIndex, isTyping, isClient]);

  const handleClose = useCallback(() => {
    setShow(false);
    document.body.style.overflow = '';
    document.body.style.height = '';
  }, []);

  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && show) {
      handleClose();
    }
  }, [show, handleClose]);

  // Event listener untuk tombol escape
  useEffect(() => {
    if (!isClient) return;
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey, isClient]);

  // Komponen utama
  const OverlayContent = () => {
    if (!show || !isClient) return null;

    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0829 0%, #05041a 70%, #02010e 100%)',
          fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}
        ref={containerRef}
      >
        {/* Kembang api dengan trail */}
        {fireworks.map(particle => (
          <React.Fragment key={particle.id}>
            {/* Trail particles */}
            {particle.trail.map((pos, idx) => (
              <div
                key={`${particle.id}-trail-${idx}`}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${particle.size * (0.3 + idx * 0.2)}px`,
                  height: `${particle.size * (0.3 + idx * 0.2)}px`,
                  backgroundColor: particle.color,
                  opacity: 0.3 * (1 - idx * 0.3),
                  transition: 'all 0.05s linear',
                  transform: `translate(-50%, -50%)`
                }}
              />
            ))}
            
            {/* Main particle */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: `radial-gradient(circle at 30% 30%, ${particle.color}, ${particle.color}00)`,
                boxShadow: `0 0 15px ${particle.color}, 0 0 30px ${particle.color}40`,
                transition: 'all 0.1s linear',
                transform: `translate(-50%, -50%)`
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Efek cahaya latar yang lebih dinamis */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-128 h-128 bg-gradient-to-r from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        </div>
        
        {/* Konten utama */}
        <div className="relative z-20 w-full max-w-4xl p-4 mx-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 via-gray-900/90 to-gray-900/80 backdrop-blur-md border border-gray-700/50 shadow-[0_0_60px_rgba(0,150,255,0.15)]">
            {/* Efek kilau premium */}
            <div className="absolute inset-0 rounded-3xl opacity-40" style={{
              background: 'linear-gradient(125deg, transparent 25%, rgba(255,215,0,0.1) 45%, rgba(0,200,255,0.1) 55%, transparent 75%)',
              backgroundSize: '300% 300%',
              animation: 'shimmer 6s infinite linear'
            }}></div>
            
            {/* Ornamen sudut dekoratif */}
            <div className="absolute -top-2 -left-2 w-24 h-24 border-t-4 border-l-4 border-cyan-400/50 rounded-tl-3xl"></div>
            <div className="absolute -top-2 -right-2 w-24 h-24 border-t-4 border-r-4 border-pink-400/50 rounded-tr-3xl"></div>
            <div className="absolute -bottom-2 -left-2 w-24 h-24 border-b-4 border-l-4 border-yellow-400/50 rounded-bl-3xl"></div>
            <div className="absolute -bottom-2 -right-2 w-24 h-24 border-b-4 border-r-4 border-purple-400/50 rounded-br-3xl"></div>
            
            <div className="relative p-6 md:p-10 lg:p-12">
              {/* Header dengan efek premium */}
              <div className="relative mb-12 text-center">
                <div className="inline-block relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-transparent to-pink-500/20 rounded-2xl blur-xl"></div>
                  <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-wider">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 animate-gradient-x">
                      🎊 SELAMAT TAHUN BARU 🎊
                    </span>
                  </h1>
                </div>
                
                {/* Tahun dengan efek glow */}
                <div className="mt-8 mb-6 relative">
                  <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-white/5 absolute inset-0 flex items-center justify-center">
                    2025
                  </div>
                  <div className="relative text-6xl md:text-7xl lg:text-8xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                      2025
                    </span>
                  </div>
                  <div className="h-1.5 w-2/3 mx-auto mt-4 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent rounded-full"></div>
                </div>
              </div>
              
              {/* Konten pesan */}
              <div className="max-w-3xl mx-auto mb-10">
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 md:p-8 border border-gray-700/50 shadow-inner relative overflow-hidden">
                  {/* Efek latar teks */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5"></div>
                  
                  <div className="relative">
                    <div className="text-lg md:text-xl text-gray-100 font-mono whitespace-pre-line min-h-72 leading-relaxed">
                      {displayedText}
                      {isTyping && (
                        <span className="inline-block w-3 h-7 ml-1.5 bg-gradient-to-b from-cyan-400 to-blue-500 animate-pulse rounded-sm"></span>
                      )}
                      
                      {/* Pesan khusus */}
                      {showSpecialMessage && (
                        <div className="space-y-4 animate-fadeInUp">
                          <div className="mt-6 pt-6 border-t border-gray-700/50">
                            <p className="text-xl text-cyan-200 italic mb-4">
                              "Di tahun yang baru ini, semoga setiap langkah kita diiringi keberkahan, 
                              setiap usaha membuahkan hasil terbaik, dan setiap hari dipenuhi dengan 
                              makna dan kebahagiaan."
                            </p>
                          </div>
                          
                          {/* Nama khusus dengan efek spesial */}
                          {showName && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-xl border border-yellow-500/30 shadow-lg relative overflow-hidden">
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl"></div>
                              <div className="relative">
                                <div className="flex items-center justify-center mb-4">
                                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-3"></div>
                                  <div className="text-sm text-yellow-300 font-semibold tracking-wider">
                                    UCAPAN KHUSUS UNTUK:
                                  </div>
                                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse ml-3"></div>
                                </div>
                                
                                <div className="text-3xl md:text-4xl font-bold text-center mb-4">
                                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                    Muhammad Syaiful Mukmin
                                  </span>
                                </div>
                                
                                <div className="text-xl text-center text-cyan-300 mb-6 leading-relaxed">
                                  Semoga tahun 2025 menjadi tahun terbaik dalam perjalanan hidupmu!
                                  <br />
                                  <span className="text-lg text-emerald-300">
                                    Diberkahi dalam karir, kesehatan, keluarga, dan spiritualitas. 🌟
                                  </span>
                                </div>
                                
                                {/* Pesan untuk semua */}
                                <div className="mt-8 pt-6 border-t border-gray-700/50">
                                  <p className="text-lg text-center text-gray-200">
                                    <span className="text-yellow-300 font-semibold">Dan untuk kita semua,</span>
                                    <br />
                                    Semoga tahun ini membawa perubahan positif,
                                    <br />
                                    pertumbuhan yang berarti, dan kebahagiaan sejati!
                                    <br />
                                    <span className="text-2xl mt-2 inline-block">🎉 🎊 ✨</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-700/30">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse shadow-[0_0_8px_green]"></div>
                    <span className="text-sm text-gray-300 font-medium">Pesan Spesial Tahun Baru</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-400 mr-3">
                      <span className="text-yellow-300 font-bold">{new Date().getFullYear()}</span>
                      <span className="mx-2">→</span>
                      <span className="text-cyan-300 font-bold">{new Date().getFullYear() + 1}</span>
                    </div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Tombol aksi */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
                <button
                  onClick={handleClose}
                  className="group relative px-10 py-4 text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none min-w-48"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 blur group-hover:blur-md transition-all opacity-70"></div>
                  <span className="relative flex items-center justify-center">
                    Lanjutkan Ke 2025
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="group relative px-10 py-4 text-lg font-semibold text-gray-300 transition-all duration-300 border border-gray-600 rounded-full hover:bg-gray-800/50 hover:border-gray-500 hover:scale-105 focus:outline-none min-w-48 backdrop-blur-sm"
                >
                  <span className="relative flex items-center justify-center">
                    <svg className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Muat Ulang Ucapan
                  </span>
                </button>
              </div>
              
              {/* Footer */}
              <div className="mt-12 text-center">
                <div className="text-sm text-gray-500 mb-2">
                  Ucapan ini akan tampil sekali di awal tahun {new Date().getFullYear()}
                </div>
                <div className="text-xs text-gray-600">
                  Dibuat dengan ❤️ untuk menyambut tahun baru yang penuh harapan
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Efek bintang latar yang lebih banyak */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 4 + 1;
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 5;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${duration}s infinite ${delay}s alternate`,
                  boxShadow: `0 0 ${size * 3}px white`
                }}
              />
            );
          })}
        </div>
        
        {/* Confetti efek */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ['#FF5E5E', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 20 + 10;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            
            return (
              <div
                key={`confetti-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size * 0.3}px`,
                  backgroundColor: color,
                  opacity: 0.8,
                  animation: `confettiFall ${duration}s ${delay}s infinite linear`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  borderRadius: '2px'
                }}
              />
            );
          })}
        </div>
        
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -100% -100%; }
            100% { background-position: 100% 100%; }
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes animate-gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes confettiFall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: animate-gradient-x 3s ease infinite;
          }
        `}</style>
      </div>
    );
  };

  // Gunakan portal untuk render di luar DOM utama
  if (!isClient) return null;
  
  return ReactDOM.createPortal(
    <OverlayContent />,
    document.body
  );
};

// HOC untuk memudahkan penggunaan di semua halaman
export const withHappyNewYears = (WrappedComponent) => {
  return function WithHappyNewYears(props) {
    return (
      <>
        <WrappedComponent {...props} />
        <HappyNewYears />
      </>
    );
  };
};

// Hook untuk mengontrol tampilan manual
export const useHappyNewYears = () => {
  const [isShown, setIsShown] = useState(false);
  
  const show = useCallback(() => {
    setIsShown(true);
    document.body.style.overflow = 'hidden';
  }, []);
  
  const hide = useCallback(() => {
    setIsShown(false);
    document.body.style.overflow = '';
  }, []);
  
  const toggle = useCallback(() => {
    setIsShown(prev => !prev);
    document.body.style.overflow = isShown ? '' : 'hidden';
  }, [isShown]);
  
  return { show, hide, toggle, isShown };
};

// Komponen wrapper untuk App utama
export const HappyNewYearsProvider = ({ children }) => {
  return (
    <>
      {children}
      <HappyNewYears />
    </>
  );
};

export default HappyNewYears;