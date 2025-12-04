// src/pages/website/captcha/main.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Volume2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Key,
} from "lucide-react";

// ---------- KONSTANTA & KONFIGURASI ----------
const DEFAULT_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // exclude ambiguous 0,O,1,I,L
const TOKEN_EXPIRY_MINUTES = 5; // Token berlaku 5 menit
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 30000; // 30 detik
const IP_BLOCK_DURATION_MS = 300000; // 5 menit untuk simulasi blok IP

// ---------- UTILITIES ----------
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper untuk deterministic pseudo-random
function seededInt(seed, index, range) {
  const x = Math.sin(seed * 100000 + index * 9973) * 10000;
  return Math.abs(Math.floor(x) % range);
}

// Generator karakter dengan checksum sederhana
const generateCaptcha = (length, chars = DEFAULT_CHARS, seed = Math.random()) => {
  const characters = Array.from({ length }, (_, i) =>
    chars[seededInt(seed, i + 13, chars.length)]
  ).join("");

  // Tambah checksum sederhana (karakter terakhir adalah checksum dari karakter sebelumnya)
  if (length > 1) {
    const checksumIndex = characters.split("").reduce((acc, char) => 
      acc + char.charCodeAt(0), 0) % chars.length;
    return characters + chars[checksumIndex];
  }
  return characters;
};

// Scramble styles dengan variasi lebih banyak
const scrambleStyles = (i, difficulty, seed, isAnimating) => {
  const sOff = seededInt(seed, i + 7, 1000) / 1000;
  const rnd = Math.random();
  
  const rotate = (randInt(-25, 25) + (sOff - 0.5) * 10) / Math.max(1, difficulty / 1.5);
  const skewX = (randInt(-15, 15) + (sOff - 0.5) * 6) / (difficulty + 1);
  const translateX = randInt(-8 * difficulty, 8 * difficulty) + Math.round((sOff - 0.5) * 6);
  const translateY = randInt(-6 * difficulty, 6 * difficulty) + Math.round((sOff - 0.5) * 4);
  const scale = 1 + (rnd - 0.5) * 0.3;
  const hue = seededInt(seed, i + 11, 360);
  const light = 35 + seededInt(seed, i + 17, 30);
  const saturation = 60 + seededInt(seed, i + 5, 20);
  
  // Animasi tambahan jika sedang berjalan
  const animation = isAnimating ? {
    animation: `float ${1 + rnd * 2}s ease-in-out infinite`,
    animationDelay: `${i * 0.1}s`,
  } : {};

  return {
    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) skewX(${skewX}deg) scale(${scale})`,
    filter: `drop-shadow(${randInt(-3, 3)}px ${randInt(-3, 3)}px 2px rgba(0,0,0,${
      0.15 + rnd * 0.25
    }))`,
    color: `hsl(${hue}deg ${saturation}% ${light}%)`,
    ...animation,
  };
};

// ---------- SIMULASI BACKEND SECURITY ----------
class CaptchaSecurityManager {
  constructor() {
    this.attempts = new Map(); // Simulasi penyimpanan percobaan
    this.tokens = new Map(); // Simulasi penyimpanan token
    this.blockedIPs = new Map(); // Simulasi IP yang diblokir
  }

  // Generate token dengan timestamp
  generateToken(captchaText, clientId) {
    const token = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      captcha: captchaText,
      clientId,
      timestamp: Date.now(),
      expires: Date.now() + (TOKEN_EXPIRY_MINUTES * 60 * 1000),
      verified: false
    };
    
    this.tokens.set(token.id, token);
    
    // Cleanup token lama setiap kali generate baru
    setTimeout(() => this.cleanupExpiredTokens(), 1000);
    
    return token;
  }

  // Verifikasi token dengan client
  verifyToken(tokenId, clientInput, clientId) {
    const token = this.tokens.get(tokenId);
    
    if (!token) {
      return { success: false, reason: 'Token tidak valid atau kadaluarsa' };
    }
    
    if (token.expires < Date.now()) {
      this.tokens.delete(tokenId);
      return { success: false, reason: 'Token telah kadaluarsa' };
    }
    
    if (token.clientId !== clientId) {
      return { success: false, reason: 'Client ID tidak cocok' };
    }
    
    // Cek apakah IP diblokir (simulasi)
    if (this.blockedIPs.has(clientId) && this.blockedIPs.get(clientId) > Date.now()) {
      return { success: false, reason: 'Akses dibatasi sementara' };
    }
    
    const success = clientInput.toUpperCase() === token.captcha;
    
    if (success) {
      token.verified = true;
      token.verifiedAt = Date.now();
      this.tokens.set(tokenId, token);
      
      // Reset attempts pada sukses
      this.attempts.delete(clientId);
      
      return { success: true, token: token.id };
    } else {
      // Tracking attempts
      const attemptCount = (this.attempts.get(clientId) || 0) + 1;
      this.attempts.set(clientId, attemptCount);
      
      // Blokir jika terlalu banyak attempts
      if (attemptCount >= MAX_ATTEMPTS) {
        this.blockedIPs.set(clientId, Date.now() + IP_BLOCK_DURATION_MS);
        return { success: false, reason: 'Terlalu banyak percobaan. Coba lagi nanti.' };
      }
      
      return { success: false, reason: 'Kode CAPTCHA salah' };
    }
  }

  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [id, token] of this.tokens.entries()) {
      if (token.expires < now) {
        this.tokens.delete(id);
      }
    }
  }

  getAttempts(clientId) {
    return this.attempts.get(clientId) || 0;
  }
}

// Inisialisasi security manager
const securityManager = new CaptchaSecurityManager();

// ---------- SUB COMPONENT ----------
function LetterSVG({ letter, style, index, seed, isAnimating }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="60"
      height="80"
      aria-hidden="true"
      focusable="false"
      className="inline-block align-middle transition-all duration-300"
      style={{
        transform: style.transform,
        filter: style.filter,
        ...style.animation ? { animation: style.animation } : {}
      }}
    >
      <defs>
        {/* Distorsi unik untuk setiap karakter */}
        <filter id={`distort${Math.floor(seed * 100000)}${index}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            baseFrequency={`0.0${2 + index % 3}`}
            numOctaves="2"
            seed={Math.floor(seed * 1000 + index)}
            result="turbulence"
          />
          <feDisplacementMap
            in2="turbulence"
            in="SourceGraphic"
            scale={3 + index}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        
        {/* Gradien unik untuk setiap karakter */}
        <linearGradient id={`grad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={style.color} />
          <stop offset="100%" stopColor={style.color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      
      {/* Latar belakang karakter dengan efek */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="15"
        fill={`url(#grad${index})`}
        opacity="0.1"
      />
      
      {/* Karakter utama */}
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontSize="64"
        fontFamily="'Segoe UI', 'Inter', ui-sans-serif, system-ui"
        fontWeight={700}
        fill={style.color}
        style={{ userSelect: "none" }}
        filter={`url(#distort${Math.floor(seed * 100000)}${index})`}
      >
        {letter}
      </text>
      
      {/* Overlay untuk efek kedalaman */}
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontSize="64"
        fontFamily="'Segoe UI', 'Inter', ui-sans-serif, system-ui"
        fontWeight={700}
        fill="white"
        fillOpacity="0.1"
        style={{ userSelect: "none" }}
      >
        {letter}
      </text>
    </svg>
  );
}

// ---------- MAIN COMPONENT ----------
export default function SecureCaptcha({
  length = 6,
  difficulty = 2,
  onMatch = (token) => console.log('CAPTCHA verified:', token),
  onError = (error) => console.error('CAPTCHA error:', error),
  ariaLabel = "Human verification challenge with enhanced security",
  clientId = `client_${typeof window !== 'undefined' ? window.location.hostname : 'unknown'}_${Math.random().toString(36).substr(2, 8)}`,
  autoRefresh = true,
  showSecurityInfo = true,
}) {
  // State utama
  const [seed, setSeed] = useState(() => Math.random());
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha(length, DEFAULT_CHARS, seed));
  const [token, setToken] = useState(null);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lastResult, setLastResult] = useState(null); // null | 'ok' | 'fail' | 'blocked'
  const [darkMode, setDarkMode] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [shake, setShake] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [securityLevel, setSecurityLevel] = useState("medium");
  const [cooldown, setCooldown] = useState(0);
  
  const inputRef = useRef(null);
  const mounted = useRef(true);
  const clientIdRef = useRef(clientId);

  // Effect untuk cleanup
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Generate token baru saat captchaText berubah
  useEffect(() => {
    if (mounted.current) {
      const newToken = securityManager.generateToken(captchaText, clientIdRef.current);
      setToken(newToken);
      setAttempts(securityManager.getAttempts(clientIdRef.current));
    }
  }, [captchaText]);

  // Update captcha text saat seed berubah
  useEffect(() => {
    setCaptchaText(generateCaptcha(length, DEFAULT_CHARS, seed));
    setInput("");
    setLastResult(null);
  }, [seed, length]);

  // Timer untuk cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Split menjadi karakter
  const chars = useMemo(() => captchaText.split(""), [captchaText]);

  // Styles untuk setiap karakter
  const perCharStyles = useMemo(
    () => chars.map((_, i) => scrambleStyles(i, difficulty, seed, isAnimating)),
    [chars, difficulty, seed, isAnimating]
  );

  // Generate noise lines dengan variasi lebih banyak
  const noiseLines = useMemo(() => {
    const n = 5 + difficulty * 4;
    return Array.from({ length: n }).map((_, i) => {
      const topOffset = seededInt(seed, i + 21, 140) - 20;
      const leftOffset = seededInt(seed, i + 31, 120) - 10;
      const width = 30 + seededInt(seed, i + 41, 90);
      const height = 1 + seededInt(seed, i + 51, 5);
      const rotate = seededInt(seed, i + 61, 90) - 45;
      const opacity = 0.05 + (seededInt(seed, i + 71, 25) / 100);
      const color = darkMode 
        ? `rgba(255,255,255,${opacity})`
        : `rgba(0,0,0,${opacity})`;
      
      return {
        top: `${topOffset}%`,
        left: `${leftOffset}%`,
        width: `${width}%`,
        height: `${height}px`,
        rotate: `${rotate}deg`,
        opacity,
        color,
      };
    });
  }, [difficulty, seed, darkMode]);

  // Accessibility: read challenge
  const speakChallenge = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onError('Speech synthesis not supported');
      return;
    }
    
    const utter = new SpeechSynthesisUtterance(chars.join(" "));
    utter.rate = 0.8;
    utter.pitch = 1;
    utter.volume = 1;
    utter.lang = "en-US";
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    
    // Efek visual saat berbicara
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), chars.length * 200);
  }, [chars, onError]);

  // Refresh captcha dengan delay untuk mencegah spam
  const refresh = useCallback(() => {
    if (cooldown > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 420);
      return;
    }
    
    setSeed(Math.random());
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Cooldown 2 detik
    setCooldown(2);
    
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [cooldown]);

  // Verifikasi input dengan token
  const verify = useCallback(
    async (e) => {
      e?.preventDefault();
      
      if (!token || cooldown > 0) return;
      
      const normalized = input.trim().replace(/[^A-Z0-9]/gi, "").toUpperCase();
      
      if (normalized.length !== captchaText.length) {
        setLastResult("fail");
        setShake(true);
        setTimeout(() => setShake(false), 420);
        return;
      }
      
      // Simulasi network delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const result = securityManager.verifyToken(token.id, normalized, clientIdRef.current);
      
      setAttempts(securityManager.getAttempts(clientIdRef.current));
      setLastResult(result.success ? "ok" : result.reason.includes('Terlalu banyak') ? "blocked" : "fail");
      
      if (result.success) {
        onMatch(result.token);
        
        // Auto refresh jika diaktifkan
        if (autoRefresh) {
          setTimeout(() => {
            if (mounted.current) refresh();
          }, 1500);
        }
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 420);
        
        // Cooldown setelah kegagalan
        setCooldown(1);
        
        if (result.reason.includes('Terlalu banyak')) {
          onError('Too many attempts. Please wait 5 minutes.');
        }
      }
    },
    [input, captchaText, token, onMatch, onError, autoRefresh, refresh, cooldown]
  );

  // Update security level berdasarkan attempts
  useEffect(() => {
    if (attempts >= 2) {
      setSecurityLevel("high");
    } else if (attempts >= 1) {
      setSecurityLevel("medium");
    } else {
      setSecurityLevel("low");
    }
  }, [attempts]);

  // CSS untuk animasi
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-pulse-slow {
      animation: pulse 2s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      
      <div
        className={`w-full max-w-2xl transition-colors duration-300 ${darkMode ? "dark" : ""}`}
        role="group"
        aria-label={ariaLabel}
      >
        <div
          className={`relative rounded-2xl p-6 shadow-2xl border-2 transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-gray-100"
              : "bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-800"
          } ${securityLevel === "high" ? "border-red-300 dark:border-red-700" : ""}`}
        >
          {/* Header dengan info keamanan */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Shield size={20} className={securityLevel === "high" ? "text-red-500" : "text-indigo-500"} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm uppercase opacity-70 font-bold tracking-wide">
                    Secure CAPTCHA v2.0
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${securityLevel === "high" ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : securityLevel === "medium" ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {securityLevel.toUpperCase()} SECURITY
                  </div>
                </div>
                <div className="text-xs opacity-80 mt-1">Type the characters below to verify you're human</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={refresh}
                disabled={cooldown > 0}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-all ${
                  cooldown > 0
                    ? "opacity-50 cursor-not-allowed"
                    : darkMode
                    ? "border-gray-600 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                aria-label="Refresh challenge"
              >
                <RefreshCw size={14} className={cooldown > 0 ? "animate-spin" : ""} />
                {cooldown > 0 ? `${cooldown}s` : "Refresh"}
              </button>

              <button
                type="button"
                onClick={speakChallenge}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Hear challenge"
              >
                <Volume2 size={14} />
                Hear
              </button>

              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </div>

          {/* CAPTCHA AREA */}
          <div
            className={`relative overflow-hidden rounded-xl border-2 p-6 ${
              darkMode
                ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600"
                : "bg-gradient-to-r from-gray-50 to-white border-gray-300"
            } ${isAnimating ? "animate-pulse-slow" : ""}`}
            style={{ minHeight: 140 }}
          >
            {/* Noise lines */}
            {noiseLines.map((ln, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  top: ln.top,
                  left: ln.left,
                  width: ln.width,
                  height: ln.height,
                  transform: `rotate(${ln.rotate})`,
                  background: `linear-gradient(90deg, ${ln.color}, transparent)`,
                  opacity: ln.opacity,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Letters */}
            <div className="relative z-10 flex justify-center gap-3">
              {chars.map((ch, idx) => (
                <div key={idx} className="flex items-center justify-center" style={{ width: 70, height: 100 }}>
                  <div className="relative">
                    <LetterSVG 
                      letter={ch} 
                      style={perCharStyles[idx]} 
                      index={idx} 
                      seed={seed}
                      isAnimating={isAnimating}
                    />
                    
                    {/* Overlay protection */}
                    <div 
                      className="absolute inset-0 rounded-md"
                      style={{
                        background: `radial-gradient(circle at ${idx*20}% ${idx*15}%, transparent 30%, ${darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'} 70%)`,
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Extra SVG noise */}
            <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 500 200" preserveAspectRatio="none">
              {Array.from({ length: 5 + difficulty * 2 }).map((_, i) => {
                const x1 = randInt(0, 500);
                const y1 = randInt(0, 200);
                const x2 = randInt(0, 500);
                const y2 = randInt(0, 200);
                const strokeW = 0.3 + Math.random() * 2;
                const opacity = 0.03 + Math.random() * 0.15;
                const color = darkMode 
                  ? `rgba(255,255,255,${opacity})`
                  : `rgba(0,0,0,${opacity})`;
                const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + randInt(-80, 80)} ${(y1 + y2) / 2 + randInt(-60, 60)} ${x2} ${y2}`;
                return <path key={i} d={d} stroke={color} strokeWidth={strokeW} fill="none" strokeLinecap="round" />;
              })}
            </svg>

            {/* Security overlay text */}
            <div className="absolute bottom-2 right-3 text-xs opacity-30">
              <Lock size={10} className="inline mr-1" />
              PROTECTED
            </div>
          </div>

          {/* INPUT AREA */}
          <form onSubmit={verify} className={`mt-6 flex items-start gap-3 ${shake ? "animate-shake" : ""}`}>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder={`Enter ${captchaText.length} characters`}
                type={showInput ? "text" : "password"}
                className={`w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:ring-indigo-500"
                    : "bg-white border-gray-300 placeholder:text-gray-400 focus:ring-indigo-300"
                } ${lastResult === "fail" ? "border-red-500 dark:border-red-500" : ""}`}
                aria-invalid={lastResult === "fail"}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                maxLength={captchaText.length}
                pattern={`[A-Z0-9]{${captchaText.length}}`}
                title={`Enter exactly ${captchaText.length} characters`}
              />
              
              <button
                type="button"
                onClick={() => setShowInput(!showInput)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showInput ? "Hide text" : "Show text"}
              >
                {showInput ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              
              <div className="text-xs mt-1 flex justify-between">
                <span className={attempts > 0 ? "text-yellow-600 dark:text-yellow-400" : ""}>
                  {attempts > 0 && <AlertTriangle size={10} className="inline mr-1" />}
                  Attempts: {attempts}/{MAX_ATTEMPTS}
                </span>
                <span>
                  Length: {input.length}/{captchaText.length}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={cooldown > 0 || input.length !== captchaText.length}
              className={`px-6 py-3 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                cooldown > 0 || input.length !== captchaText.length
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300"
              } text-white`}
            >
              <Key size={14} />
              Verify
            </button>
          </form>

          {/* FEEDBACK & SECURITY INFO */}
          <div className="mt-6 space-y-3">
            {/* Feedback message */}
            <div className="min-h-[1.5rem] text-sm flex items-center gap-2">
              {lastResult === "ok" && (
                <>
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-green-500 font-semibold">Verified successfully!</span>
                  <span className="text-xs opacity-70 ml-2">
                    Token: {token?.id?.substring(0, 12)}...
                  </span>
                </>
              )}

              {lastResult === "fail" && (
                <>
                  <XCircle className="text-red-500" size={18} />
                  <span className="text-red-500">Incorrect code. Please try again.</span>
                </>
              )}

              {lastResult === "blocked" && (
                <>
                  <AlertTriangle className="text-red-500" size={18} />
                  <span className="text-red-500 font-semibold">
                    Too many attempts. Please wait 5 minutes or refresh.
                  </span>
                </>
              )}

              {lastResult === null && (
                <div className="flex items-center gap-2">
                  <span className="opacity-70">
                    Enter the {captchaText.length} characters shown above
                  </span>
                </div>
              )}
            </div>

            {/* Security information panel */}
            {showSecurityInfo && (
              <div className={`text-xs rounded-lg p-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <Lock size={12} />
                  Security Information
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-70">Token ID:</span>
                    <div className="font-mono truncate" title={token?.id}>
                      {token?.id?.substring(0, 20)}...
                    </div>
                  </div>
                  <div>
                    <span className="opacity-70">Expires in:</span>
                    <div>
                      {token?.expires ? `${Math.max(0, Math.floor((token.expires - Date.now()) / 60000))} minutes` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="opacity-70">Client ID:</span>
                    <div className="font-mono truncate" title={clientIdRef.current}>
                      {clientIdRef.current.substring(0, 15)}...
                    </div>
                  </div>
                  <div>
                    <span className="opacity-70">Difficulty:</span>
                    <div>Level {difficulty}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer notes */}
          <div className="mt-4 text-xs opacity-50 text-center">
            This CAPTCHA helps prevent automated submissions. Data is processed securely and not stored permanently.
          </div>
        </div>
      </div>
    </>
  );
}