/**
 * Lightweight spell correction / fuzzy matching utility
 * - Builds vocabulary from KB or provided word list
 * - Provides simple Levenshtein-based correction for short typos
 */

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function buildVocabularyFromKB(kb) {
  const vocab = new Set();
  if (!kb) return vocab;
  const addText = (t) => {
    if (!t || typeof t !== 'string') return;
    t.split(/\s+/).forEach(w => {
      const s = w.replace(/[^\p{L}\d'-]+/gu, '').toLowerCase();
      if (s) vocab.add(s);
    });
  };
  for (const v of Object.values(kb)) {
    if (Array.isArray(v)) v.forEach(item => addText(typeof item === 'string' ? item : JSON.stringify(item)));
    else if (typeof v === 'object' && v !== null) Object.values(v).forEach(item => addText(typeof item === 'string' ? item : JSON.stringify(item)));
    else addText(String(v));
  }
  return vocab;
}

export function correctWord(word, vocab, maxDist = 2) {
  if (!word || vocab.has(word.toLowerCase())) return { corrected: word, changed: false };
  const w = word.toLowerCase();
  let best = null;
  let bestDist = Infinity;
  for (const v of vocab) {
    if (Math.abs(v.length - w.length) > maxDist) continue;
    const d = levenshtein(w, v);
    if (d < bestDist) {
      bestDist = d;
      best = v;
    }
    if (bestDist === 0) break;
  }
  if (best && bestDist <= maxDist) return { corrected: best, changed: true, distance: bestDist };
  return { corrected: word, changed: false };
}

export function correctText(text, vocab, options = {}) {
  if (!text || !vocab) return { text, corrections: [] };
  const tokens = text.split(/(\s+)/);
  const corrections = [];
  const corrected = tokens.map(tok => {
    if (/^\s+$/.test(tok)) return tok;
    const w = tok.replace(/[^\p{L}\d'-]+/gu, '');
    const suffix = tok.slice(w.length ? tok.indexOf(w) + w.length : 0 + 0);
    const res = correctWord(w, vocab, options.maxDist || 2);
    if (res.changed) corrections.push({ original: w, corrected: res.corrected, distance: res.distance });
    return res.corrected + suffix;
  }).join('');
  return { text: corrected, corrections };
}

export default { buildVocabularyFromKB, correctWord, correctText };
