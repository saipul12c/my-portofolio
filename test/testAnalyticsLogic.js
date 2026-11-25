import assert from 'assert';
import { 
  generatePrediction, 
  analyzeData, 
  calculateStatistics, 
  logResponseQuality, 
  getResponseMetrics, 
  clearResponseMetrics,
  saipulAnalytics 
} from '../src/components/helpbutton/chat/components/logic/utils/analytics.js';
import { kbMonitor } from '../src/components/helpbutton/chat/components/logic/utils/kbMonitoring.js';

console.log('🧪 Memulai Pengujian Suite Logika Analitik SaipulAI...\n');

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

// ==========================================
// 1. Pengujian Modul Prediksi & Forecasting
// ==========================================
console.log('--- 1. Pengujian Prediksi (generatePrediction) ---');

test('Prediksi harga emas menghasilkan analisis terstruktur dan tidak null', () => {
  const res = generatePrediction('harga', 'prediksi harga emas batangan');
  assert.ok(res, 'Respon prediksi harga tidak boleh null');
  assert.ok(typeof res === 'string' && res.length > 50, 'Respon harus berupa teks terperinci');
  assert.ok(res.includes('Emas batangan'), 'Respon harus menyebutkan Emas batangan');
  assert.ok(res.includes('Proyeksi Tren'), 'Respon harus memuat proyeksi tren');
});

test('Prediksi cuaca tidak menghasilkan "item terkait" dan memuat informasi lokasi', () => {
  const res = generatePrediction('cuaca', 'prediksi cuaca di bandung besok');
  assert.ok(res, 'Respon cuaca tidak boleh null');
  assert.ok(!res.includes('item terkait diperkirakan'), 'Tidak boleh ada bug grammar "item terkait diperkirakan"');
  assert.ok(res.includes('Bandung') || res.includes('Prakiraan Cuaca'), 'Harus menyertakan konteks cuaca kota');
  assert.ok(res.includes('Suhu'), 'Harus menyertakan estimasi suhu');
});

test('Prediksi umum (topik bebas) tidak mengembalikan null atau string "null"', () => {
  const res = generatePrediction('umum', 'prediksi perkembangan AI di tahun depan');
  assert.ok(res !== null, 'Prediksi umum tidak boleh null');
  assert.ok(res !== 'null', 'Prediksi umum tidak boleh string literal "null"');
  assert.ok(res.includes('Analisis Proyeksi'), 'Harus menghasilkan format proyeksi umum');
});

// ==========================================
// 2. Pengujian Statistik Deterministik
// ==========================================
console.log('\n--- 2. Pengujian Statistik Deterministik (calculateStatistics) ---');

test('Menghitung Mean, Median, Sum, Min, Max secara eksak dari angka pengguna', () => {
  // Input angka: 10, 20, 30, 40
  // Sum = 100, Mean = 25, Median = 25, Range = 10 s/d 40 (30)
  const res = calculateStatistics('hitung rata-rata dari 10, 20, 30, 40');
  assert.ok(res, 'Respon statistik tidak boleh null');
  assert.ok(res.includes('25.00') || res.includes('25'), 'Mean harus 25');
  assert.ok(res.includes('100'), 'Sum harus 100');
  assert.ok(res.includes('10') && res.includes('40'), 'Min 10 dan Max 40 harus ada');
  assert.ok(res.includes('Varians') && res.includes('Standar Deviasi'), 'Parameter sebaran data harus ada');
});

test('Menghitung dataset dengan angka desimal', () => {
  const res = calculateStatistics('analisis statistik nilai 75.5, 80.5, 90.0');
  assert.ok(res, 'Harus memproses angka desimal');
  assert.ok(res.includes('82.00') || res.includes('82'), 'Rata-rata 75.5 + 80.5 + 90 = 246 / 3 = 82');
});

test('Menjawab teori probabilitas dadu dan koin secara ilmiah', () => {
  const resDadu = calculateStatistics('berapa probabilitas dadu muncul angka 4?');
  assert.ok(resDadu && resDadu.includes('16.67%'), 'Peluang dadu 1/6 harus 16.67%');

  const resKoin = calculateStatistics('apa peluang pelemparan koin?');
  assert.ok(resKoin && resKoin.includes('50%'), 'Peluang koin harus 50%');
});

test('Memberikan panduan jika pengguna meminta rata-rata tanpa menyertakan angka', () => {
  const res = calculateStatistics('bagaimana cara menghitung rata-rata?');
  assert.ok(res && res.includes('Panduan Perhitungan Statistik'), 'Harus memberi panduan input angka');
});

// ==========================================
// 3. Pengujian Analisis Data & Integrasi Dokumen
// ==========================================
console.log('\n--- 3. Pengujian Analisis Data & File Terunggah (analyzeData) ---');

test('Menganalisis dokumen tabel CSV yang diunggah secara nyata', () => {
  const mockKb = {
    uploadedData: [
      {
        fileName: 'laporan_penjualan.csv',
        content: 'Bulan,Omzet\nJanuari,100\nFebruari,150\nMaret,200\nApril,250'
      }
    ]
  };

  const res = analyzeData('tolong analisis data penjualan dari dokumen tabel', mockKb);
  assert.ok(res, 'Respon analisis data dokumen tidak boleh null');
  assert.ok(res.includes('laporan_penjualan.csv'), 'Harus menyebut nama dokumen');
  assert.ok(res.includes('Omzet'), 'Harus mendeteksi kolom angka Omzet');
  assert.ok(res.includes('175.00') || res.includes('175'), 'Rata-rata 100+150+200+250 = 700 / 4 = 175');
  assert.ok(res.includes('700'), 'Total omzet harus 700');
});

test('Menghasilkan kerangka analisis keuangan jika tidak ada dokumen terunggah', () => {
  const res = analyzeData('bagaimana analisis kesehatan keuangan usaha?');
  assert.ok(res, 'Respon analisis keuangan tidak boleh null');
  assert.ok(res.includes('Analisis Kesehatan Keuangan'), 'Harus memberikan kerangka finansial');
  assert.ok(res.includes('Likuiditas'), 'Harus memuat pilar evaluasi');
});

// ==========================================
// 4. Pengujian Telemetri & Monitoring
// ==========================================
console.log('\n--- 4. Pengujian Telemetri (saipulAnalytics & kbMonitor) ---');

test('saipulAnalytics mencatat event dan dapat mengambil riwayat event', () => {
  saipulAnalytics.clearEvents();
  saipulAnalytics.trackEvent('test_click', { button: 'send' });
  const events = saipulAnalytics.getEvents();
  assert.ok(events.length >= 1, 'Event harus tersimpan');
  assert.strictEqual(events[events.length - 1].event, 'test_click');
});

test('logResponseQuality mencatat kualitas jawaban ke storage', () => {
  clearResponseMetrics();
  logResponseQuality({ query: 'uji coba', intent: 'test', confidence: 0.95 });
  const metrics = getResponseMetrics();
  assert.ok(metrics.length >= 1, 'Metrik respons harus tersimpan');
  assert.strictEqual(metrics[metrics.length - 1].intent, 'test');
});

test('kbMonitor mencatat kueri dan menghitung success rate', () => {
  kbMonitor.reset();
  kbMonitor.recordQuery('pertanyaan 1', 'ai', true);
  kbMonitor.recordQuery('pertanyaan 2', 'uploaded', true);
  kbMonitor.recordQuery('pertanyaan gagal', 'none', false);

  const stats = kbMonitor.getStats();
  assert.strictEqual(stats.totalQueries, 3, 'Total kueri harus 3');
  assert.strictEqual(stats.successfulQueries, 2, 'Kueri sukses harus 2');
  assert.strictEqual(stats.failedQueries, 1, 'Kueri gagal harus 1');
  assert.strictEqual(stats.successRate, '66.67%', 'Success rate harus 66.67%');
});

// ==========================================
// Ringkasan Pengujian
// ==========================================
console.log(`\n===========================================`);
console.log(`🏁 Hasil Pengujian Analitik: ${passedTests}/${totalTests} Lolos`);
console.log(`===========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
