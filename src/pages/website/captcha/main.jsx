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
} from "lucide-react";

const DEFAULT_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // exclude ambiguous 0,O,1,I

// ---------- UTILITIES ----------
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * lightweight deterministic pseudo-random helper derived from seed+index
 * returns integer in [0, range-1]
 */
function seededInt(seed, index, range) {
  // simple deterministic hash -> use sin to generate pseudo randomness
  const v = Math.abs(
    Math.floor(Math.sin(seed * 100000 + index * 9973) * 1000000)
  );
  return v % range;
}

const pickChars = (length, chars = DEFAULT_CHARS, seed = Math.random()) =>
  Array.from({ length }, (_, i) =>
    chars[seededInt(seed, i + 13, chars.length)]
  ).join("");

// scrambleStyles now accepts seed so eslint sees seed is used when included in deps
const scrambleStyles = (i, difficulty, seed) => {
  // mix seeded deterministic offsets with some runtime randomness (keeps visuals lively)
  const sOff = seededInt(seed, i + 7, 1000) / 1000; // 0..0.999
  const rotate = (randInt(-25, 25) + (sOff - 0.5) * 10) / Math.max(1, difficulty / 1.5);
  const skewX = (randInt(-15, 15) + (sOff - 0.5) * 6) / (difficulty + 1);
  const translateX = randInt(-8 * difficulty, 8 * difficulty) + Math.round((sOff - 0.5) * 6);
  const translateY = randInt(-6 * difficulty, 6 * difficulty) + Math.round((sOff - 0.5) * 4);
  const scale = 1 + (Math.random() - 0.5) * 0.3;
  const hue = seededInt(seed, i + 11, 360);
  const light = 35 + seededInt(seed, i + 17, 30);

  return {
    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) skewX(${skewX}deg) scale(${scale})`,
    filter: `drop-shadow(${randInt(-3, 3)}px ${randInt(-3, 3)}px 2px rgba(0,0,0,${
      0.15 + Math.random() * 0.25
    }))`,
    color: `hsl(${hue}deg ${60 + seededInt(seed, i + 5, 20)}% ${light}%)`,
  };
};

// ---------- SUB COMPONENT ----------
function LetterSVG({ letter, style, index, seed }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="60"
      height="80"
      aria-hidden="true"
      focusable="false"
      className="inline-block align-middle transition-transform duration-300"
      style={{
        transform: style.transform,
        filter: style.filter,
      }}
    >
      <defs>
        <filter id={`w${Math.floor(seed * 100000)}${index}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            baseFrequency="0.8"
            numOctaves="1"
            seed={Math.floor(seed * 1000 + index)}
            result="t"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="t" mode="screen" />
        </filter>
      </defs>
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontSize="64"
        fontFamily="Inter, ui-sans-serif, system-ui"
        fontWeight={700}
        fill={style.color}
        style={{ userSelect: "none" }}
        filter={`url(#w${Math.floor(seed * 100000)}${index})`}
      >
        {letter}
      </text>
    </svg>
  );
}

// ---------- MAIN COMPONENT ----------
export default function Captcha({
  length = 5,
  difficulty = 2,
  onMatch = () => {},
  ariaLabel = "Human verification challenge",
}) {
  // seed is used to deterministically change visuals when refreshed
  const [seed, setSeed] = useState(() => Math.random());
  // answer uses seed to pick chars deterministically (so changing seed re-picks)
  const [answer, setAnswer] = useState(() => pickChars(length, DEFAULT_CHARS, seed));
  const [input, setInput] = useState("");
  const [tries, setTries] = useState(0);
  const [lastResult, setLastResult] = useState(null); // null | 'ok' | 'fail'
  const [darkMode, setDarkMode] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      mounted.current = false;
    };
  }, []);

  // when seed changes we also regenerate answer deterministically
  useEffect(() => {
    setAnswer(pickChars(length, DEFAULT_CHARS, seed));
    // reset input / feedback on new seed
    setInput("");
    setLastResult(null);
    setTries(0);
  }, [seed, length]);

  // split into chars (depends only on answer)
  const chars = useMemo(() => answer.split(""), [answer]);

  // per-character styles — depends on chars, difficulty, and seed (seed used inside scrambleStyles)
  const perCharStyles = useMemo(
    () => chars.map((_, i) => scrambleStyles(i, difficulty, seed)),
    [chars, difficulty, seed]
  );

  // noise lines: we include seed in generation and use it explicitly, so eslint won't complain
  const noiseLines = useMemo(() => {
    const n = 5 + difficulty * 3;
    // use seededInt to influence position deterministically
    return Array.from({ length: n }).map((_, i) => {
      const topOffset = seededInt(seed, i + 21, 140) - 20; // -20 .. 119
      const leftOffset = seededInt(seed, i + 31, 120) - 10; // -10 .. 109
      const width = 30 + seededInt(seed, i + 41, 90); // 30..119
      const height = 1 + seededInt(seed, i + 51, 5); // 1..5
      const rotate = seededInt(seed, i + 61, 90) - 45; // -45..44
      const opacity = 0.07 + (seededInt(seed, i + 71, 20) / 100); // 0.07..0.26
      return {
        top: `${topOffset}%`,
        left: `${leftOffset}%`,
        width: `${width}%`,
        height: `${height}px`,
        rotate: `${rotate}deg`,
        opacity,
      };
    });
  }, [difficulty, seed]);

  // accessibility: read challenge
  const speakChallenge = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(answer.split("").join(" "));
    utter.rate = 0.9;
    utter.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [answer]);

  // refresh: generate a new seed (effects cascade via useEffect)
  const refresh = useCallback(() => {
    setSeed(Math.random());
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    // focus input on next tick
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  // verify input
  const verify = useCallback(
    (e) => {
      e?.preventDefault();
      const normalized = input.trim().replace(/[^A-Z0-9]/gi, "").toUpperCase();
      const success = normalized === answer;
      setTries((t) => t + 1);
      setLastResult(success ? "ok" : "fail");
      if (success) {
        onMatch(answer);
        // small success delay then refresh
        setTimeout(() => {
          if (mounted.current) refresh();
        }, 800);
      } else {
        // shake animation
        setShake(true);
        setTimeout(() => setShake(false), 420);
      }
    },
    [input, answer, onMatch, refresh]
  );

  // auto-refresh after too many failures (rate-limit)
  useEffect(() => {
    if (lastResult === "fail" && tries >= Math.max(3, difficulty + 1)) {
      const t = setTimeout(() => refresh(), 700);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [lastResult, tries, difficulty, refresh]);

  return (
    <div
      className={`w-full max-w-lg transition-colors duration-300 ${darkMode ? "dark" : ""}`}
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className={`relative rounded-2xl p-6 shadow-xl border transition-all duration-300 ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-100"
            : "bg-white/80 backdrop-blur-md border-gray-200 text-gray-800"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase opacity-70 font-semibold tracking-wide">
              Captcha Challenge
            </div>
            <div className="text-sm opacity-80">Type the characters below</div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Refresh challenge"
            >
              <RefreshCw size={14} /> Refresh
            </button>

            <button
              type="button"
              onClick={speakChallenge}
              className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Hear challenge"
            >
              <Volume2 size={14} /> Hear
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />} Mode
            </button>
          </div>
        </div>

        {/* CAPTCHA AREA */}
        <div
          className={`relative overflow-hidden rounded-xl border border-dashed p-4 ${
            darkMode ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
          }`}
          style={{ minHeight: 110 }}
        >
          {/* noise lines (absolute positioned) */}
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
                background: "linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0.03))",
                opacity: ln.opacity,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* letters */}
          <div className="relative z-10 flex justify-center gap-2">
            {chars.map((ch, idx) => (
              <div key={idx} className="flex items-center justify-center" style={{ width: 64, height: 90 }}>
                <div className="flex items-center justify-center rounded-md px-1 py-1 select-none" style={{ transformStyle: "preserve-3d" }}>
                  <LetterSVG letter={ch} style={perCharStyles[idx]} index={idx} seed={seed} />
                </div>
              </div>
            ))}
          </div>

          {/* extra svg arcs for visual noise */}
          <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 400 180" preserveAspectRatio="none">
            {Array.from({ length: 3 + difficulty }).map((_, i) => {
              const x1 = randInt(0, 400);
              const y1 = randInt(0, 180);
              const x2 = randInt(0, 400);
              const y2 = randInt(0, 180);
              const strokeW = 0.6 + Math.random() * 2.5;
              const opacity = 0.06 + Math.random() * 0.22;
              const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + randInt(-60, 60)} ${(y1 + y2) / 2 + randInt(-40, 40)} ${x2} ${y2}`;
              return <path key={i} d={d} stroke={`rgba(0,0,0,${opacity})`} strokeWidth={strokeW} fill="none" strokeLinecap="round" />;
            })}
          </svg>
        </div>

        {/* INPUT AREA */}
        <form onSubmit={verify} className={`mt-5 flex items-start gap-3 transition-transform ${shake ? "animate-shake" : ""}`}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Type here"
            className={`flex-1 px-3 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all ${
              darkMode ? "bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:ring-indigo-500" : "bg-white border-gray-300 placeholder:text-gray-400 focus:ring-indigo-300"
            }`}
            aria-invalid={lastResult === "fail"}
            autoComplete="off"
          />

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
          >
            Verify
          </button>
        </form>

        {/* FEEDBACK */}
        <div className="mt-4 min-h-[1.5rem] text-sm flex items-center gap-2">
          {lastResult === "ok" && (
            <>
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-green-500">Verified successfully!</span>
            </>
          )}

          {lastResult === "fail" && (
            <>
              <XCircle className="text-red-500" size={16} />
              <span className="text-red-500">Incorrect, please try again or refresh.</span>
            </>
          )}

          {lastResult === null && (
            <span className="opacity-70">
              You have {Math.max(0, 3 - tries)} attempts before auto-refresh.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
