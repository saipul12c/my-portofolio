/**
 * test/testFileUploadLogic.js
 * Pengujian Unit & Siklus Hidup Logika Pemrosesan Berkas SaipulAI
 */

import { 
  validateFile, 
  extractSentences, 
  formatFileSize, 
  saveUploadedData, 
  removeSingleUploadedFile, 
  STORAGE_KEYS 
} from '../src/components/helpbutton/chat/components/logic/utils/fileProcessor.js';

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

// Mock localStorage jika di lingkungan Node.js murni
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

// Mock window dan CustomEvent jika di Node.js
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    dispatchEvent: () => true
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init) {
      this.type = type;
      this.detail = init?.detail;
    }
  };
}

console.log('\n========================================================================');
console.log('  📁 PENGUJIAN LOGIKA PEMROSESAN & SIKLUS HIDUP BERKAS SAIPULAI');
console.log('========================================================================\n');

// 1. Uji Validasi Berkas
console.log('\x1b[1m📌 1. Validasi Berkas (Ekstensi & Batas Ukuran):\x1b[0m');

const validTxt = { name: 'catatan.txt', size: 1024 * 50 }; // 50 KB
const val1 = validateFile(validTxt, { maxFileSize: 10 });
assert(val1.ok === true && val1.extension === 'txt', `Berkas catatan.txt (50KB) valid dan diterima`);

const oversizedFile = { name: 'video_besar.mp4', size: 1024 * 1024 * 25 }; // 25 MB
const val2 = validateFile(oversizedFile, { maxFileSize: 10 });
assert(val2.ok === false && val2.reason.includes('terlalu besar'), `Berkas 25MB ditolak jika melebihi batas 10MB`);

const unsupportedFile = { name: 'program.exe', size: 1024 * 10 };
const val3 = validateFile(unsupportedFile, { maxFileSize: 10, allowedFileTypes: ['txt', 'md', 'csv', 'json'] });
assert(val3.ok === false && val3.reason.includes('tidak didukung'), `Ekstensi berbahaya .exe ditolak`);

// 2. Uji Format Ukuran Berkas
console.log('\n\x1b[1m📌 2. Format Ukuran Berkas (Bytes Formatting):\x1b[0m');
assert(formatFileSize(0) === '0 Bytes', `0 bytes diformat menjadi "0 Bytes"`);
assert(formatFileSize(1024) === '1 KB', `1024 bytes diformat menjadi "1 KB"`);
assert(formatFileSize(1024 * 1024 * 2.5) === '2.5 MB', `2.5 MB diformat dengan tepat`);

// 3. Uji Ekstraksi Kalimat Dokumen
console.log('\n\x1b[1m📌 3. Ekstraksi Kalimat untuk Indeks Knowledge Base:\x1b[0m');
const sampleDoc = "SaipulAI adalah asisten pintar. Dibuat oleh Muhammad Syaiful Mukmin! Memiliki memori kontekstual?";
const sentences = extractSentences(sampleDoc);
assert(sentences.length === 3, `Dokumen 3 kalimat dipecah tepat menjadi 3 unit pengetahuan`);
assert(sentences[0].includes('SaipulAI adalah asisten pintar'), `Kalimat pertama terekstraksi bersih`);

// 4. Uji Penyimpanan Berkas & Pencegahan Duplikasi
console.log('\n\x1b[1m📌 4. Penyimpanan Berkas & Anti-Duplikasi Nama:\x1b[0m');
const testFile1 = {
  fileName: 'profil_saya.txt',
  content: 'Saya adalah seorang software engineer.',
  sentences: ['Saya adalah seorang software engineer.'],
  uploadDate: new Date().toISOString(),
  wordCount: 6,
  size: 500,
  extension: 'txt'
};

const save1 = saveUploadedData(testFile1);
assert(save1.updatedData.length === 1, `Berkas pertama berhasil disimpan ke storage`);

// Upload ulang file dengan nama yang sama (pembaruan data, bukan duplikasi)
const testFile1Updated = {
  ...testFile1,
  content: 'Saya adalah seorang software engineer spesialis AI.'
};
const save2 = saveUploadedData(testFile1Updated);
assert(save2.updatedData.length === 1, `Upload ulang file dengan nama yang sama menimpa versi lama (tidak duplikat)`);

// 5. Uji Penghapusan Berkas Tertentu
console.log('\n\x1b[1m📌 5. Penghapusan Berkas Spesifik:\x1b[0m');
const testFile2 = {
  fileName: 'data_transaksi.csv',
  content: 'id,nama,jumlah\n1,Budi,50000',
  sentences: ['Data baris 1: Budi jumlah 50000'],
  uploadDate: new Date().toISOString(),
  wordCount: 8,
  size: 800,
  extension: 'csv'
};
saveUploadedData(testFile2);

const delResult = removeSingleUploadedFile('profil_saya.txt');
assert(delResult.updatedData.every(f => f.fileName !== 'profil_saya.txt'), `Berkas profil_saya.txt berhasil dihapus secara spesifik`);
assert(delResult.updatedData.some(f => f.fileName === 'data_transaksi.csv'), `Berkas data_transaksi.csv tetap utuh di memori`);

console.log('\n========================================================================');
console.log(`  🏆 REKAPITULASI: ${passed}/${total} PENGUJIAN LULUS (${((passed/total)*100).toFixed(1)}%)`);
console.log('========================================================================\n');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
