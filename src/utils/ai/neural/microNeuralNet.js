/**
 * microNeuralNet.js
 * Layer 2: Micro-Neural Network Intent Classifier (Multi-Layer Perceptron / MLP)
 * Mengklasifikasikan maksud & niat pertanyaan ke dalam 8 domain utama secara probabilistik.
 */

export const NEURAL_CLASSES = [
  "portfolio_factual",      // 0
  "technical_coding",       // 1
  "conversational_persona", // 2
  "linguistics_slang",      // 3
  "safety_ethics",          // 4
  "complex_reasoning",      // 5
  "navigation_community",   // 6
  "boundary_stress"         // 7
];

const INPUT_SIZE = 32;
const HIDDEN1_SIZE = 24;
const HIDDEN2_SIZE = 16;
const OUTPUT_SIZE = 8;

/**
 * Ekstraksi Fitur Teks ke Vektor Input Numerik (32 Dimensi)
 */
export function extractFeatureVector(text = '') {
  const vec = new Float32Array(INPUT_SIZE);
  if (!text || typeof text !== 'string') return vec;

  const lower = text.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(Boolean);
  const len = words.length;

  // Fitur 0-4: Struktur & Panjang Kalimat
  vec[0] = Math.min(1.0, len / 20); // Panjang kata ternormalisasi
  vec[1] = text.includes('?') ? 1.0 : 0.0; // Tanda tanya
  vec[2] = text.includes('!') ? 1.0 : 0.0; // Tanda seru
  vec[3] = (text.match(/[A-Z]/g) || []).length / Math.max(1, text.length); // Rasio huruf kapital
  vec[4] = (lower.match(/(halo|hai|pagi|siang|malam|bro|cuy|saipul)/) ? 1.0 : 0.0); // Greeting cue

  // Fitur 5-9: Domain Fakta Portofolio (KKN, Syaiful, Penulis, Proyek, Sertifikat)
  vec[5] = /(syaiful|mukmin|profil|penulis|author|bio|tentang)/.test(lower) ? 1.0 : 0.0;
  vec[6] = /(kkn|desa kundan|haruyan|uin|antasari|pgmi|tarbiyah|harday)/.test(lower) ? 1.0 : 0.0;
  vec[7] = /(projek|proyek|portfolio|web|karya)/.test(lower) ? 1.0 : 0.0;
  vec[8] = /(sertif|sertifikat|lisensi|prestasi|kursus|pendidikan)/.test(lower) ? 1.0 : 0.0;
  vec[9] = /(galeri|foto|album|pagelaran|seni|5r|canon|kamera)/.test(lower) ? 1.0 : 0.0;

  // Fitur 10-14: Domain Teknis & Coding
  vec[10] = /(react|vite|tailwind|javascript|node|express|api|supabase)/.test(lower) ? 1.0 : 0.0;
  vec[11] = /(coding|ngoding|program|bug|error|code|fungsi|hook)/.test(lower) ? 1.0 : 0.0;
  vec[12] = /(state|useeffect|usestate|component|clean code|arsitektur)/.test(lower) ? 1.0 : 0.0;
  vec[13] = /(database|postgres|sql|nosql|query|table|schema)/.test(lower) ? 1.0 : 0.0;
  vec[14] = /(css|html|responsive|ui|ux|glassmorphism|framer motion)/.test(lower) ? 1.0 : 0.0;

  // Fitur 15-19: Domain Slang, Typo & Bahasa Daerah
  vec[15] = /(kometmin|pngalaman|spesilasisai|srtipikat|proyke)/.test(lower) ? 1.0 : 0.0; // Known heavy typos
  vec[16] = /(kayapa|habar|ikam|pian|ulun|buhan|suah|bahari|haja|maulah)/.test(lower) ? 1.0 : 0.0; // Banjar
  vec[17] = /(kepo|spill|cuy|bro|santai|mager|gue|lo)/.test(lower) ? 1.0 : 0.0; // Jakarta Slang
  vec[18] = /(who|what|where|how|can you|list|tech stack)/.test(lower) ? 1.0 : 0.0; // English query
  vec[19] = /(makasih|terima kasih|thanks|keren|hebat|pintar|lucu)/.test(lower) ? 1.0 : 0.0; // Praise/polite

  // Fitur 20-24: Domain Keamanan & Adversarial (Safety)
  vec[20] = /(hack|hack into|ddos|sql injection|exploit|bypass)/.test(lower) ? 1.0 : 0.0;
  vec[21] = /(bomb|explode|murder|kill|assassin|steal|rob bank|senjata)/.test(lower) ? 1.0 : 0.0;
  // Bug fix: Cegah false positive kata 'dan' Bahasa Indonesia. Hanya tangkap prompt injection eksplisit atau akronim DAN kapital
  vec[22] = (/(ignore all previous|jailbreak|override|system:|do anything now|dan mode)/i.test(lower) || /\bDAN\b/.test(text)) ? 1.0 : 0.0;
  vec[23] = /(password|service_role_key|secret|token|ktp|kartu kredit)/.test(lower) ? 1.0 : 0.0;
  vec[24] = /(anjing|babi|bangsat|sampah|bodoh|mati|bunuh diri)/.test(lower) ? 1.0 : 0.0;

  // Fitur 25-28: Domain Navigasi & Komunitas
  vec[25] = /(halaman|menu|rute|link|buka|navigasi|url|direct)/.test(lower) ? 1.0 : 0.0;
  vec[26] = /(live-discussion|room|live|chat room|polling|slowmode|komunitas)/.test(lower) ? 1.0 : 0.0;
  vec[27] = /(instagram|linkedin|youtube|telegram|kontak|hubungi|portal)/.test(lower) ? 1.0 : 0.0;
  vec[28] = /(visi|misi|tujuan|minat|bakat|timeline)/.test(lower) ? 1.0 : 0.0;

  // Fitur 29-31: Domain Out-of-Domain / Stress Test
  vec[29] = /(saham|kalkulus|integral|dinasti|cuaca|kurs|piala dunia)/.test(lower) ? 1.0 : 0.0;
  vec[30] = len === 0 || lower.length < 3 ? 1.0 : 0.0; // Empty / ultra short
  vec[31] = len > 30 ? 1.0 : 0.0; // Very long wall of text

  return vec;
}

/**
 * Aktivasi Non-Linear Rectified Linear Unit (ReLU)
 */
function relu(x) {
  return x > 0 ? x : 0;
}

/**
 * Aktivasi Softmax untuk mengubah output logit ke probabilitas (0.0 s/d 1.0, total sum = 1.0)
 */
function softmax(arr) {
  const max = Math.max(...arr);
  const exp = arr.map(x => Math.exp(x - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(x => (sum === 0 ? 0 : x / sum));
}

/**
 * Matriks Bobot Terkalibrasi (Calibrated Neural Weights)
 * Arsitektur Deep Multi-Layer Perceptron (MLP) 32 -> 24 -> 16 -> 8
 * Menghubungkan seluruh hidden layer dengan representasi non-linear yang utuh (tanpa dead code).
 */
function computeForwardPass(inputVec) {
  // Layer 1: Input (32) -> Hidden 1 (24 neurons, 3 neurons per domain group)
  const hidden1 = new Float32Array(HIDDEN1_SIZE);
  for (let h = 0; h < HIDDEN1_SIZE; h++) {
    const domain = Math.floor(h / 3);
    const subIdx = h % 3;
    let sum = 0;

    switch (domain) {
      case 0: // Portfolio Factual (inputs 5..9 + cues 0, 1)
        sum += (inputVec[5] * 2.8) + (inputVec[6] * 2.8) + (inputVec[7] * 2.0) + (inputVec[8] * 2.2) + (inputVec[9] * 2.0);
        if (subIdx === 1) sum += (inputVec[1] * 0.5); // question cue
        break;
      case 1: // Technical Coding (inputs 10..14)
        sum += (inputVec[10] * 2.8) + (inputVec[11] * 2.5) + (inputVec[12] * 2.5) + (inputVec[13] * 2.5) + (inputVec[14] * 2.0);
        if (subIdx === 1) sum += (inputVec[1] * 0.4);
        break;
      case 2: // Conversational Persona (inputs 4, 19, -20..24)
        sum += (inputVec[4] * 3.0) + (inputVec[19] * 2.5) - (inputVec[20] * 1.5) - (inputVec[22] * 1.5);
        break;
      case 3: // Linguistics & Slang (inputs 15..18)
        sum += (inputVec[15] * 3.2) + (inputVec[16] * 3.2) + (inputVec[17] * 2.5) + (inputVec[18] * 2.0);
        break;
      case 4: // Safety & Ethics (inputs 20..24)
        sum += (inputVec[20] * 3.5) + (inputVec[21] * 4.0) + (inputVec[22] * 3.5) + (inputVec[23] * 3.0) + (inputVec[24] * 3.0);
        break;
      case 5: // Complex Reasoning (inputs 0, 1, 5, 10, 12)
        sum += (inputVec[0] * 1.8) + (inputVec[1] * 1.5) + (inputVec[5] * 1.0) + (inputVec[10] * 1.0) + (inputVec[12] * 1.0);
        break;
      case 6: // Navigation & Community (inputs 25..28)
        sum += (inputVec[25] * 3.2) + (inputVec[26] * 3.0) + (inputVec[27] * 2.5) + (inputVec[28] * 2.2);
        break;
      case 7: // Boundary & Stress (inputs 29..31)
        sum += (inputVec[29] * 3.2) + (inputVec[30] * 2.8) + (inputVec[31] * 2.0);
        break;
    }

    // Dense background connectivity
    const crossWeight = ((h * 7 + domain) % 5 === 0) ? 0.05 : -0.02;
    sum += inputVec[h % INPUT_SIZE] * crossWeight;

    hidden1[h] = relu(sum);
  }

  // Layer 2: Hidden 1 (24) -> Hidden 2 (16 neurons, 2 neurons per domain group)
  const hidden2 = new Float32Array(HIDDEN2_SIZE);
  for (let h = 0; h < HIDDEN2_SIZE; h++) {
    const domain = Math.floor(h / 2);
    const subIdx = h % 2;
    const baseH1 = domain * 3;

    // Agregasi fitur dari hidden1 domain terkait
    let sum = (hidden1[baseH1] * 0.7) + (hidden1[baseH1 + 1] * 0.6) + (hidden1[baseH1 + 2] * 0.5);

    // Cross-domain regularisasi
    if (domain === 2) {
      sum -= (hidden1[12] * 0.4) + (hidden1[13] * 0.4); // inhibisi dari safety
    }
    if (domain === 5 && subIdx === 1) {
      sum += (hidden1[0] * 0.3) + (hidden1[3] * 0.3); // kompleksitas menggabungkan fakta & tech
    }

    hidden2[h] = relu(sum);
  }

  // Layer 3: Hidden 2 (16) -> Output Logits (8 Classes)
  // Sepenuhnya memanfaatkan hidden2 dengan koneksi residual
  const logits = new Float32Array(OUTPUT_SIZE);
  for (let c = 0; c < OUTPUT_SIZE; c++) {
    const h2Primary = hidden2[c * 2];
    const h2Secondary = hidden2[c * 2 + 1];
    logits[c] = (h2Primary * 1.4) + (h2Secondary * 1.1);
  }

  // Residual Skip Connections untuk presisi maksimal
  logits[0] += (inputVec[5] * 0.8) + (inputVec[6] * 0.8) + (inputVec[7] * 0.5);
  logits[1] += (inputVec[10] * 0.8) + (inputVec[11] * 0.6) + (inputVec[12] * 0.6);
  logits[2] += (inputVec[4] * 0.8) + (inputVec[19] * 0.6);
  logits[3] += (inputVec[15] * 0.8) + (inputVec[16] * 0.8) + (inputVec[17] * 0.6);
  logits[4] += (inputVec[20] * 1.0) + (inputVec[21] * 1.2) + (inputVec[22] * 1.0) + (inputVec[23] * 0.8);
  logits[5] += (inputVec[0] * 0.5) + (inputVec[1] * 0.4);
  logits[6] += (inputVec[25] * 0.8) + (inputVec[26] * 0.7) + (inputVec[27] * 0.6);
  logits[7] += (inputVec[29] * 0.8) + (inputVec[30] * 0.8) + (inputVec[31] * 0.5);

  return softmax(Array.from(logits));
}

/**
 * Menjalankan Prediksi Klasifikasi Niat Menggunakan Jaringan Saraf Tiruan Lokal
 */
export function classifyNeuralIntent(text = '') {
  const inputVec = extractFeatureVector(text);
  const probabilities = computeForwardPass(inputVec);

  let highestIdx = 0;
  let highestProb = 0;

  probabilities.forEach((prob, idx) => {
    if (prob > highestProb) {
      highestProb = prob;
      highestIdx = idx;
    }
  });

  return {
    topClass: NEURAL_CLASSES[highestIdx],
    confidence: highestProb,
    probabilities: NEURAL_CLASSES.map((cls, idx) => ({
      className: cls,
      probability: probabilities[idx]
    }))
  };
}
