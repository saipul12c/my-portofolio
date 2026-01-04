/**
 * Simple TF-IDF index for semantic-ish local search
 * - Indexes KB documents (stringified) and computes TF-IDF vectors
 * - Returns top-N results by cosine similarity
 */

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().split(/[^\p{L}\d']+/u).filter(Boolean);
}

function dot(a, b) {
  let s = 0;
  for (const k of Object.keys(a)) if (b[k]) s += a[k] * b[k];
  return s;
}

function magnitude(vec) {
  let s = 0;
  for (const v of Object.values(vec)) s += v * v;
  return Math.sqrt(s);
}

export function buildIndexFromKB(kb) {
  const docs = [];
  const addDoc = (id, text, meta = {}) => { docs.push({ id, text, meta }); };
  for (const [section, value] of Object.entries(kb)) {
    if (Array.isArray(value)) value.forEach((v, i) => addDoc(`${section}:${i}`, typeof v === 'string' ? v : JSON.stringify(v), { section }));
    else if (typeof value === 'object' && value !== null) Object.entries(value).forEach(([k, v]) => addDoc(`${section}:${k}`, typeof v === 'string' ? v : JSON.stringify(v), { section }));
    else addDoc(section, String(value), { section });
  }

  const df = {};
  const termFreqs = [];
  docs.forEach(doc => {
    const tokens = tokenize(doc.text);
    const tf = {};
    tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
    Object.keys(tf).forEach(t => df[t] = (df[t] || 0) + 1);
    termFreqs.push(tf);
  });

  const N = docs.length;
  const idf = {};
  Object.keys(df).forEach(t => idf[t] = Math.log(1 + N / df[t]));

  const vectors = termFreqs.map(tf => {
    const vec = {};
    Object.entries(tf).forEach(([t, f]) => vec[t] = f * (idf[t] || 0));
    return vec;
  });

  const mags = vectors.map(v => magnitude(v));

  return { docs, vectors, mags, idf };
}

export function searchIndex(index, query, topN = 5) {
  if (!index || !query) return [];
  const qtokens = tokenize(query);
  const qtf = {};
  qtokens.forEach(t => qtf[t] = (qtf[t] || 0) + 1);
  const qvec = {};
  Object.entries(qtf).forEach(([t, f]) => { if (index.idf[t]) qvec[t] = f * index.idf[t]; });
  const qmag = magnitude(qvec) || 1;

  const scored = index.docs.map((doc, i) => {
    const sim = dot(qvec, index.vectors[i]) / (qmag * (index.mags[i] || 1));
    return { doc, score: sim || 0 };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, topN).filter(r => r.score > 0).map(r => ({ id: r.doc.id, score: r.score, text: r.doc.text, meta: r.doc.meta }));
}

export default { buildIndexFromKB, searchIndex };
