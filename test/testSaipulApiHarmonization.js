import assert from 'assert';
import handler, { generateResponse } from '../api/saipul.js';

console.log('🧪 Memulai Pengujian Harmonisasi SaipulAI API  v8.0.0...\n');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Pesan Galat: ${err.message}`);
    process.exitCode = 1;
  }
}

async function asyncTest(description, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Pesan Galat: ${err.message}`);
    process.exitCode = 1;
  }
}

// ==========================================
// 1. Pengujian Logika Matematika Lanjutan di API
// ==========================================
console.log('--- 1. Pengujian Matematika Lanjutan SaipulAI API ---');

test('Menyelesaikan Persamaan Linear: 2x + 10 = 20 -> x = 5', () => {
  const res = generateResponse('selesaikan 2x + 10 = 20');
  assert.strictEqual(res.intent, 'calculation');
  assert.ok(res.reply.includes('5'), `Hasil harus memuat nilai x = 5, didapat: ${res.reply}`);
});

test('Menyelesaikan Persamaan Kuadrat: x^2 - 5x + 6 = 0 -> x₁ = 3, x₂ = 2', () => {
  const res = generateResponse('selesaikan x^2 - 5x + 6 = 0');
  assert.strictEqual(res.intent, 'calculation');
  assert.ok(res.reply.includes('3') && res.reply.includes('2'), `Hasil harus memuat akar 3 dan 2: ${res.reply}`);
});

test('Menghitung Integral Simbolik: integral dari 2x dx -> x^2 + C', () => {
  const res = generateResponse('integral dari 2x dx');
  assert.strictEqual(res.intent, 'calculation');
  assert.ok(res.reply.includes('x^2 + C'), `Hasil integral harus x^2 + C: ${res.reply}`);
});

test('Menangani Pemisah Ribuan Titik Indonesia: 10.000 + 5.000 -> 15.000', () => {
  const res = generateResponse('hitung 10.000 + 5.000');
  assert.strictEqual(res.intent, 'calculation');
  assert.ok(res.reply.includes('15.000') || res.reply.includes('15000'), `Hasil harus 15.000: ${res.reply}`);
});

// ==========================================
// 2. Pengujian Deteksi Sarkasme & Sentimen Dinamis
// ==========================================
console.log('\n--- 2. Pengujian Deteksi Sarkasme & Makna Tersirat di API ---');

test('Mengenali Sarkasme: "Mantap sekali, baru dipakai sehari sudah rusak"', () => {
  const res = generateResponse('Mantap sekali, baru dipakai sehari sudah rusak');
  assert.ok(res.sarcasm && res.sarcasm.isSarcastic, 'Sarkasme harus terdeteksi');
  assert.strictEqual(res.sentiment.sentiment, 'negative', 'Sentimen harus bernilai negatif');
  assert.strictEqual(res.emotion, 'empathetic', 'Emosi bot harus empatik');
  assert.ok(res.reply.includes('Mohon maaf'), 'Respons harus meminta maaf empatik, bukan terima kasih');
});

test('Mengenali Sindiran Retoris: "Hebat ya, begini doang gak bisa"', () => {
  const res = generateResponse('Hebat ya, begini doang gak bisa');
  assert.ok(res.sarcasm && res.sarcasm.isSarcastic, 'Sindiran retoris harus terdeteksi sarkasme');
  assert.strictEqual(res.sentiment.sentiment, 'negative', 'Sentimen harus negatif');
});

// ==========================================
// 3. Pengujian Analitik Data & Statistik Eksak
// ==========================================
console.log('\n--- 3. Pengujian Analitik & Statistik Deterministik di API ---');

test('Menghitung Rata-rata dan Sebaran Data Eksak Pengguna', () => {
  const res = generateResponse('hitung rata-rata dari 10, 20, 30, 40');
  assert.strictEqual(res.intent, 'statistics');
  assert.ok(res.reply.includes('25.00') || res.reply.includes('25'), 'Mean harus 25');
  assert.ok(res.reply.includes('100'), 'Sum harus 100');
  assert.ok(res.reply.includes('Standar Deviasi'), 'Harus menyertakan standar deviasi');
});

test('Menghasilkan Proyeksi Tren Pasar (Emas/Saham)', () => {
  const res = generateResponse('prediksi harga emas batangan bulan depan');
  assert.strictEqual(res.intent, 'prediction');
  assert.ok(res.reply.includes('Emas batangan'), 'Harus menyebutkan aset emas');
  assert.ok(res.reply.includes('Proyeksi Tren'), 'Harus menyajikan proyeksi tren');
});

// ==========================================
// 4. Pengujian Konteks Percakapan Multi-turn (History Payload)
// ==========================================
console.log('\n--- 4. Pengujian Konteks Percakapan & Jembatan Transisi di API ---');

test('Menyambung Konteks Sebelumnya Menggunakan History', () => {
  const history = [
    { role: 'user', content: 'ceritakan proyek portofoliomu' },
    { role: 'assistant', content: 'Syaiful telah mengembangkan lebih dari 22+ proyek interaktif...' }
  ];

  const res = generateResponse('terus yang pakai React yang mana?', { history });
  assert.ok(
    res.reply.includes('Menyambung') || res.reply.includes('React') || res.intent === 'web_tech' || res.intent === 'projects',
    'Respons harus peka terhadap konteks riwayat dialog'
  );
});

// ==========================================
// 5. Pengujian Sapaan Alami & Basa-Basi Santai
// ==========================================
console.log('\n--- 5. Pengujian Obrolan Santai & Sapaan di API ---');

test('Merespon basa-basi aktivitas secara luwes: "lagi apa?"', () => {
  const res = generateResponse('lagi apa pul?');
  assert.strictEqual(res.intent, 'small_talk');
  assert.ok(res.reply.length > 10, 'Harus ada balasan obrolan santai');
});

test('Merespon sapaan halo secara hangat', () => {
  const res = generateResponse('halo syaiful, apa kabar?');
  assert.strictEqual(res.intent, 'greeting');
  assert.ok(res.reply.includes('Halo') || res.reply.includes('Hai') || res.reply.includes('kabar'), 'Harus menyapa atau menjawab kabar');
});

// ==========================================
// 6. Pengujian HTTP Server Handler (Mock Request & Response)
// ==========================================
console.log('\n--- 6. Pengujian HTTP Handler Endpoint (/api/saipul) ---');

await asyncTest('Endpoint POST /api/saipul memproses pesan dan mengembalikan JSON terpadu', async () => {
  let responseData = '';
  let responseHeaders = {};

  const mockReq = {
    method: 'POST',
    headers: { host: 'localhost:3001' },
    body: {
      message: 'hitung 25 * 4',
      style: 'friendly'
    }
  };

  const mockRes = {
    statusCode: 200,
    setHeader: (k, v) => { responseHeaders[k] = v; },
    end: (chunk) => {
      responseData = chunk;
    }
  };

  await handler(mockReq, mockRes);
  const parsed = JSON.parse(responseData);

  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.version, '8.0.0');
  assert.ok(parsed.reply.includes('100'), `Hasil kalkulasi 25 * 4 harus 100: ${parsed.reply}`);
});

await asyncTest('Endpoint GET /api/saipul mengembalikan metadata arsitektur terpadu', async () => {
  let responseData = '';

  const mockReq = {
    method: 'GET',
    url: '/api/saipul',
    headers: { host: 'localhost:3001' }
  };

  const mockRes = {
    statusCode: 200,
    setHeader: () => { },
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  const parsed = JSON.parse(responseData);

  assert.strictEqual(parsed.status, 'online');
  assert.strictEqual(parsed.version, '8.0.0');
  assert.ok(Array.isArray(parsed.capabilities), 'Harus memuat daftar kapabilitas');
  assert.ok(parsed.capabilities.length >= 4, 'Minimal 4 kapabilitas terdaftar');
});

// ==========================================
// Ringkasan Pengujian
// ==========================================
console.log(`\n===========================================`);
console.log(`🏁 Hasil Pengujian Harmonisasi API: ${passedTests}/${totalTests} Lolos`);
console.log(`===========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
