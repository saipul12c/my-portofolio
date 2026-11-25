/**
 * test/testSaipulAIContextEvolution.js
 * Pengujian Khusus Peningkatan Kemampuan SaipulAI:
 * 1. Deteksi Sarkasme, Makna Tersirat & Pergeseran Valensi Struktur Bahasa
 * 2. Pemahaman Percakapan Sederhana (Sapaan santai, Basa-basi, Keluhan ringan)
 * 3. Variasi Respons pada Input yang Sama (Non-deterministik vs Fakta Mutlak/Matematika)
 * 4. Adaptasi terhadap Perubahan Pertanyaan & Pergeseran Topik (Follow-up & Topic Shift)
 */

import { analyzeSentiment, detectSarcasmAndIrony } from '../src/components/helpbutton/chat/components/logic/utils/nluProcessing.js';
import { detectEmotion } from '../src/components/helpbutton/chat/components/logic/utils/emotionEngine.js';
import { classifyIntent, INTENT_TYPES } from '../src/components/helpbutton/chat/components/logic/utils/advancedIntentClassifier.js';
import { recognizeGreeting } from '../src/components/helpbutton/chat/components/logic/utils/greetingRecognizer.js';
import { analyzeQueryDynamics } from '../src/components/helpbutton/chat/components/logic/utils/conversationContext.js';
import { solveMathQuery } from '../src/components/helpbutton/chat/components/logic/utils/mathEngine.js';
import { calculateMath } from '../src/components/helpbutton/chat/components/logic/utils/mathCalculator.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(` \x1b[32m✓ PASS\x1b[0m | ${message}`);
  } else {
    console.error(` \x1b[31m✗ FAIL\x1b[0m | ${message}`);
  }
}

console.log('\n========================================================================');
console.log('  🧪 PENGUJIAN EVOLUSI KEMAMPUAN LINGUISTIK & KONTEKSTUAL SAIPULAI');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// 1. UJI SARKASME & PEMBALIKAN STRUKTUR BAHASA
// -----------------------------------------------------------------------------
console.log('\x1b[1m📌 1. Deteksi Sarkasme & Makna Tersirat:\x1b[0m');

const sarcasmQuery1 = "Mantap sekali, baru dipakai sehari sudah rusak";
const sarcasm1 = detectSarcasmAndIrony(sarcasmQuery1);
const sentiment1 = analyzeSentiment(sarcasmQuery1);
const emotion1 = detectEmotion(sarcasmQuery1);
const intent1 = classifyIntent(sarcasmQuery1);
const greeting1 = recognizeGreeting(sarcasmQuery1);

assert(sarcasm1.isSarcastic === true, `Sarkasme terdeteksi pada "${sarcasmQuery1}"`);
assert(sentiment1.sentiment === 'negative', `Sentimen menjadi negatif (${sentiment1.polarity}) pada kalimat tersirat`);
assert(emotion1.primary.emotion === 'empathetic', `Emosi AI menjadi 'empathetic' (bukan gembira semu)`);
assert(intent1.intent === INTENT_TYPES.COMPLAINT, `Intent tergolong COMPLAINT (bukan PRAISE)`);
assert(greeting1.isComplaint === true && greeting1.text.toLowerCase().includes('maaf'), `Respons bot menunjukkan empati/permintaan maaf, bukan terima kasih pujian`);
assert(!greeting1.text.includes('Terima kasih! Aku senang'), `Anti-false-positive: tidak lagi berterima kasih atas komplain rusak`);

// Sindiran lain
const sarcasmQuery2 = "Hebat ya, begini doang gak bisa";
const sarcasm2 = detectSarcasmAndIrony(sarcasmQuery2);
const sentiment2 = analyzeSentiment(sarcasmQuery2);
assert(sarcasm2.isSarcastic === true, `Sindiran retoris terdeteksi: "${sarcasmQuery2}"`);
assert(sentiment2.sentiment === 'negative', `Sentimen sindiran retoris bernilai negatif`);

// Slang intensifier vs Defect collocation
const slangPositive = analyzeSentiment("Keren parah aplikasinya");
assert(slangPositive.sentiment === 'positive', `"Keren parah" dikenali positif (slang intensifier)`);

const defectCollocation = analyzeSentiment("Baterainya cepat habis dan gampang drop");
assert(defectCollocation.sentiment === 'negative', `"Cepat habis" dikenali negatif (bukan positif dari kata 'cepat')`);

// -----------------------------------------------------------------------------
// 2. UJI PEMAHAMAN PERCAKAPAN SEDERHANA & BASA-BASI
// -----------------------------------------------------------------------------
console.log('\n\x1b[1m📌 2. Pemahaman Obrolan Sederhana, Basa-basi & Keluhan Ringan:\x1b[0m');

const chitChat1 = recognizeGreeting("lagi apa?");
assert(chitChat1 && (chitChat1.text.includes('standby') || chitChat1.text.includes('asik') || chitChat1.text.includes('siap')), `Basa-basi aktivitas dijawab santai & luwes ("lagi apa?")`);

const chitChat2 = recognizeGreeting("udah makan belum?");
assert(chitChat2 && (chitChat2.text.includes('makan') || chitChat2.text.includes('listrik') || chitChat2.text.includes('sehat')), `Basa-basi keseharian dijawab hangat & playful ("udah makan belum?")`);

const complaint1 = recognizeGreeting("capek banget hari ini");
assert(complaint1 && (complaint1.text.includes('napas') || complaint1.text.includes('istirahat') || complaint1.text.includes('hebat') || complaint1.text.includes('Peluk')), `Keluhan singkat dijawab empatik & menenangkan ("capek banget hari ini")`);

const jokeQuery = recognizeGreeting("ceritain lelucon dong");
assert(jokeQuery && (jokeQuery.text.includes('Kenapa') || jokeQuery.text.includes('bug') || jokeQuery.text.includes('Windows') || jokeQuery.text.includes('haha')), `Merespon permintaan humor/lelucon secara santai`);

const callName = recognizeGreeting("halo pul apa kabar");
assert(callName && (callName.text.toLowerCase().includes('kabar') || callName.text.toLowerCase().includes('saipul') || callName.text.toLowerCase().includes('yo') || callName.text.toLowerCase().includes('baik')), `Menyapa balik panggilan akrab / tanya kabar ("halo pul apa kabar")`);

// -----------------------------------------------------------------------------
// 3. UJI VARIASI RESPONS PADA INPUT YANG SAMA
// -----------------------------------------------------------------------------
console.log('\n\x1b[1m📌 3. Variasi Respons pada Input yang Sama:\x1b[0m');

const repeatedQuery = "apa itu artificial intelligence";
const ctxRepeat0 = [];
const ctxRepeat1 = [{ role: 'user', content: repeatedQuery }];
const ctxRepeat2 = [
  { role: 'user', content: repeatedQuery },
  { role: 'bot', content: 'AI adalah kecerdasan buatan...' },
  { role: 'user', content: repeatedQuery }
];

const dyn0 = analyzeQueryDynamics(repeatedQuery, ctxRepeat0);
const dyn1 = analyzeQueryDynamics(repeatedQuery, ctxRepeat1);
const dyn2 = analyzeQueryDynamics(repeatedQuery, ctxRepeat2);

assert(dyn0.isRepeat === false, `Pertama kali: isRepeat adalah false`);
assert(dyn1.isRepeat === true && dyn1.repeatCount === 1, `Pengulangan ke-1: isRepeat = true, repeatCount = 1 (memicu variasi penyampaian baru)`);
assert(dyn2.isRepeat === true && dyn2.repeatCount >= 2, `Pengulangan ke-2+: isRepeat = true, repeatCount >= 2 (memicu pengakuan repetisi & klarifikasi ramah)`);

// Intent classification untuk repetisi
const repIntent = classifyIntent(repeatedQuery, { messages: [{ role: 'user', content: repeatedQuery }] });
assert(repIntent.intent === INTENT_TYPES.REPEAT_QUERY, `Intent classifier mengenali REPEAT_QUERY pada input yang sama persis`);

// -----------------------------------------------------------------------------
// 4. UJI ADAPTASI TERHADAP PERUBAHAN PERTANYAAN & PERGESERAN TOPIK
// -----------------------------------------------------------------------------
console.log('\n\x1b[1m📌 4. Adaptasi Perubahan Pertanyaan & Pergeseran Topik:\x1b[0m');

// A. Pertanyaan Lanjutan (Follow-up)
const ctxFollowUp = [
  { role: 'user', content: 'Apa saja proyek yang dibuat Syaiful?' },
  { role: 'bot', content: 'Syaiful membuat 22+ proyek web termasuk sistem SaipulAI, SIM KKN, dan web portfolio...' }
];
const followUpQuery = "terus yang pakai React yang mana?";
const dynamicsFollowUp = analyzeQueryDynamics(followUpQuery, ctxFollowUp);
assert(dynamicsFollowUp.isFollowUp === true, `Mendeteksi bahwa pertanyaan "terus yang pakai React yang mana?" adalah kelanjutan`);
assert(dynamicsFollowUp.suggestedBridge.includes('Menyambung'), `Menyediakan jembatan transisi percakapan yang luwes: "${dynamicsFollowUp.suggestedBridge.trim()}"`);

// B. Penyempitan Batasan (Constraint Refinement)
const refinementQuery = "maksudku proyek mobile saja";
const dynamicsRefinement = analyzeQueryDynamics(refinementQuery, ctxFollowUp);
assert(dynamicsRefinement.isConstraintRefinement === true, `Mendeteksi penyempitan konteks ("maksudku proyek mobile saja")`);
assert(dynamicsRefinement.suggestedBridge.includes('mempersempit'), `Menyediakan jembatan penyempitan: "${dynamicsRefinement.suggestedBridge.trim()}"`);

// C. Pergeseran Topik (Topic Shift)
const ctxShift = [
  { role: 'user', content: 'Hitung integral 2x dx dari 0 sampai 5' },
  { role: 'bot', content: 'Hasil integralnya adalah 25.' }
];
const shiftQuery = "hobi Syaiful apa aja?";
const dynamicsShift = analyzeQueryDynamics(shiftQuery, ctxShift);
assert(dynamicsShift.isTopicShift === true, `Mendeteksi pergeseran topik dari matematika ke hobi pribadi`);
assert(dynamicsShift.suggestedBridge.includes('Beralih'), `Menyediakan transisi topik: "${dynamicsShift.suggestedBridge.trim()}"`);

// -----------------------------------------------------------------------------
// 5. UJI LOGIKA MATEMATIKA LANJUTAN (GOLDEN SYNTHESIS EDITION)
// -----------------------------------------------------------------------------
console.log('\n\x1b[1m📌 5. Logika Matematika Lanjutan (Golden Synthesis):\x1b[0m');

// A. Format Ribuan Indonesia vs Internasional
const thousandCalc = solveMathQuery("10.000 + 5.000 berapa?");
assert(thousandCalc.isMath && thousandCalc.result === 15000, `Format ribuan Indonesia "10.000 + 5.000" menghasilkan 15.000 (bukan 15)`);

// B. Persamaan Linear (ax + b = c)
const linearEq = solveMathQuery("selesaikan 2x + 10 = 20");
assert(linearEq.isMath && linearEq.result === 5, `Persamaan linear "2x + 10 = 20" diselesaikan x = 5`);

// C. Persamaan Kuadrat (ax^2 + bx + c = 0)
const quadEq = solveMathQuery("x^2 - 5x + 6 = 0");
assert(quadEq.isMath && String(quadEq.result).includes('x₁ = 3') && String(quadEq.result).includes('x₂ = 2'), `Persamaan kuadrat "x^2 - 5x + 6 = 0" diselesaikan x₁ = 3, x₂ = 2`);

// D. Integral Simbolik Tak Tentu
const indefInt = solveMathQuery("integral dari 2x dx");
assert(indefInt.isMath && String(indefInt.result).includes('x^2') && String(indefInt.result).includes('+ C'), `Integral tak tentu "integral dari 2x dx" menghasilkan x^2 + C`);

// E. Integral Tentu Numerik (Simpson's Rule)
const defInt = solveMathQuery("integral x^2 dari 0 sampai 3");
assert(defInt.isMath && Math.abs(defInt.result - 9) < 0.01, `Integral tentu numerik "integral x^2 dari 0 sampai 3" menghasilkan 9`);

// F. Turunan (Derivative)
const derivCalc = solveMathQuery("turunan x^2 pada 2");
assert(derivCalc.isMath && derivCalc.result === 4, `Turunan "turunan x^2 pada 2" menghasilkan 4`);

// G. Safe Façade calculateMath compatibility
const facadeCalc = calculateMath("2x + 10 = 20");
assert(facadeCalc && facadeCalc.includes('Penyelesaian Persamaan Linear') && facadeCalc.includes('5'), `Safe façade calculateMath mendelegasikan persamaan linear secara konsisten`);

console.log('\n========================================================================');
console.log(`  🏆 REKAPITULASI: ${passed}/${total} PENGUJIAN LULUS (${((passed/total)*100).toFixed(1)}%)`);
console.log('========================================================================\n');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
