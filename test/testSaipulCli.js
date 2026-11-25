import assert from 'assert';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Memulai Pengujian SaipulAI CLI  v8.0.0...\n');

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

// 1. Uji Versi dan Help
test('Opsi --version menampilkan versi 8.0.0', () => {
  const output = execSync('node bin/saipul-cli.js --version', { encoding: 'utf-8' });
  assert.ok(output.includes('SaipulAI CLI  v8.0.0'), `Harus memuat versi: ${output}`);
});

test('Opsi --help menampilkan petunjuk penggunaan lengkap', () => {
  const output = execSync('node bin/saipul-cli.js --help', { encoding: 'utf-8' });
  assert.ok(output.includes('Penggunaan:'), 'Harus memuat petunjuk penggunaan');
  assert.ok(output.includes('/help') && output.includes('/clear'), 'Harus memuat daftar slash commands');
});

// 2. Uji One-Shot Math Query dengan output JSON
test('One-shot query matematika linear via JSON: 2x + 10 = 20', () => {
  const output = execSync('node bin/saipul-cli.js "selesaikan 2x + 10 = 20" --json', { encoding: 'utf-8' });
  const parsed = JSON.parse(output);
  assert.strictEqual(parsed.intent, 'calculation');
  assert.ok(parsed.reply.includes('5'), 'Hasil persamaan harus memuat x = 5');
});

test('One-shot query persamaan kuadrat: x^2 - 5x + 6 = 0', () => {
  const output = execSync('node bin/saipul-cli.js "selesaikan x^2 - 5x + 6 = 0" --json', { encoding: 'utf-8' });
  const parsed = JSON.parse(output);
  assert.strictEqual(parsed.intent, 'calculation');
  assert.ok(parsed.reply.includes('3') && parsed.reply.includes('2'), 'Harus memuat akar 3 dan 2');
});

// 3. Uji One-Shot Deteksi Sarkasme
test('One-shot query deteksi sarkasme dan sentimen', () => {
  const output = execSync('node bin/saipul-cli.js "Mantap sekali baru dipakai sehari sudah rusak" --json', { encoding: 'utf-8' });
  const parsed = JSON.parse(output);
  assert.ok(parsed.sarcasm && parsed.sarcasm.isSarcastic, 'Sarkasme harus terdeteksi');
  assert.strictEqual(parsed.emotion, 'empathetic', 'Emosi harus empatik');
  assert.ok(parsed.reply.includes('Mohon maaf'), 'Harus meminta maaf atas keluhan');
});

// 4. Uji One-Shot Analitik & Statistik Deterministik
test('One-shot query statistik eksak: 10, 20, 30, 40', () => {
  const output = execSync('node bin/saipul-cli.js "hitung rata-rata dari 10, 20, 30, 40" --json', { encoding: 'utf-8' });
  const parsed = JSON.parse(output);
  assert.strictEqual(parsed.intent, 'statistics');
  assert.ok(parsed.reply.includes('25.00') || parsed.reply.includes('25'), 'Mean harus 25');
  assert.ok(parsed.reply.includes('100'), 'Sum harus 100');
});

// 5. Uji File Reading & Analisis Berkas
test('Analisis berkas lokal dengan opsi --file', () => {
  const tempFile = path.resolve(process.cwd(), 'test-temp-data.csv');
  fs.writeFileSync(tempFile, 'Bulan,Penjualan\nJanuari,500\nFebruari,750\nMaret,1000', 'utf-8');

  try {
    const output = execSync(`node bin/saipul-cli.js --file "${tempFile}" "analisis data ini" --json`, { encoding: 'utf-8' });
    const parsed = JSON.parse(output);
    assert.ok(parsed.reply, 'Harus menghasilkan respons analisis');
    assert.ok(parsed.reply.length > 50, 'Analisis harus terperinci');
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
});

// ==========================================
// Ringkasan Pengujian
// ==========================================
console.log(`\n===========================================`);
console.log(`🏁 Hasil Pengujian SaipulAI CLI: ${passedTests}/${totalTests} Lolos`);
console.log(`===========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
