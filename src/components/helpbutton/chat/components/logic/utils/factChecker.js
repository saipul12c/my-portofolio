/**
 * Simple local fact-checker / verifier
 * - Tidak menggunakan layanan eksternal atau model LLM
 * - Melakukan verifikasi dasar menggunakan token overlap heuristics
 * - Mengembalikan skor kecocokan terhadap dokumentasi di KB
 */

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function ngramTokens(text, n = 2) {
  const toks = tokenize(text);
  const grams = new Set();
  for (let i = 0; i <= toks.length - n; i++) grams.add(toks.slice(i, i + n).join(' '));
  return grams;
}

function overlapScore(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common++;
  return common / Math.max(ta.size, tb.size);
}

function ngramScore(a, b, maxN = 3) {
  // average of ngram Jaccard for n=1..maxN
  let total = 0;
  let count = 0;
  for (let n = 1; n <= maxN; n++) {
    const A = ngramTokens(a, n);
    const B = ngramTokens(b, n);
    if (A.size === 0 || B.size === 0) { total += 0; count++; continue; }
    const inter = [...A].filter(x => B.has(x)).length;
    const uni = new Set([...A, ...B]).size;
    total += uni === 0 ? 0 : inter / uni;
    count++;
  }
  return count > 0 ? total / count : 0;
}

/**
 * Check query/claim against a knowledge base object.
 * @param {string} claim
 * @param {object} kb - KB object from knowledgeBaseService.get()
 * @param {object} opts
 * @returns {object} { verified: boolean, score, best, sources }
 */
export function checkClaimAgainstKB(claim, kb, opts = {}) {
  const topN = opts.topN || 3;
  const results = [];

  if (!claim || !kb) return { verified: false, score: 0, best: null, sources: [] };

  // Flatten KB into searchable strings with source metadata
  const entries = [];
  for (const [section, value] of Object.entries(kb)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const item of value) entries.push({ section, text: typeof item === 'string' ? item : JSON.stringify(item) });
    } else if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) entries.push({ section, text: typeof v === 'string' ? v : JSON.stringify(v), id: k });
    } else if (typeof value === 'string') {
      entries.push({ section, text: value });
    }
  }

  for (const e of entries) {
    const tokenOverlap = overlapScore(claim, e.text);
    const ngramOverlap = ngramScore(claim, e.text, opts.maxN || 3);
    // length-based boost (shorter doc with match may be more precise)
    const lengthFactor = Math.max(0.5, Math.min(1.5, 100 / (e.text.length + 10)));
    // source boosts provided in opts.sourceBoosts e.g., { uploadedData: 1.5 }
    const sourceBoost = (opts.sourceBoosts && opts.sourceBoosts[e.section]) || 1.0;

    const combined = (0.6 * ngramOverlap) + (0.4 * tokenOverlap);
    const scored = combined * lengthFactor * sourceBoost;
    if (scored > 0) results.push({ score: scored, entry: e, raw: { tokenOverlap, ngramOverlap } });
  }

  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, topN);
  const best = top[0] || null;
  const score = best ? best.score : 0;

  // Heuristic thresholding (allow opts.threshold)
  const threshold = typeof opts.threshold === 'number' ? opts.threshold : 0.3;
  const verified = score >= threshold;

  // compute source scoring breakdown
  const sources = top.map(r => ({ section: r.entry.section, id: r.entry.id || null, score: r.score, details: r.raw }));

  // composite confidence normalized to 0..1
  const maxPossible = top.length > 0 ? top[0].score : 1;
  const confidence = Math.max(0, Math.min(1, score));

  return { verified, score, confidence, best: best ? best.entry : null, sources };
}

export default { checkClaimAgainstKB };
