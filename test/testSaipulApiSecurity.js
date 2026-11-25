import assert from 'assert';
import handler, { sanitizeHistory } from '../api/saipul.js';

console.log('🛡️  Memulai Pengujian Sistem Keamanan & Rate Limiting SaipulAI API...\n');

let passedTests = 0;
let totalTests = 0;

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
// 1. Pengujian OWASP Security Headers
// ==========================================
console.log('--- 1. Pengujian OWASP Security Headers ---');

await asyncTest('Header keamanan OWASP terpasang pada respons HTTP', async () => {
  const headers = {};
  const mockReq = {
    method: 'GET',
    url: '/api/saipul',
    headers: { host: 'localhost:3001' }
  };
  const mockRes = {
    statusCode: 200,
    setHeader: (k, v) => { headers[k] = v; },
    end: () => {}
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(headers['X-Content-Type-Options'], 'nosniff');
  assert.strictEqual(headers['X-Frame-Options'], 'DENY');
  assert.strictEqual(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.strictEqual(headers['Access-Control-Allow-Origin'], '*');
});

// ==========================================
// 2. Pengujian PII (Personally Identifiable Information) Filter
// ==========================================
console.log('\n--- 2. Pengujian Penyaringan Data Sensitif (PII) ---');

await asyncTest('Menolak kueri yang mengandung nomor kartu kredit / NIK 16 digit', async () => {
  let responseData = '';
  let statusCode = 200;
  const mockReq = {
    method: 'POST',
    headers: { host: 'localhost:3001' },
    body: { message: 'Nomor kartu saya adalah 1234567812345678 tolong simpan' }
  };
  const mockRes = {
    set statusCode(code) { statusCode = code; },
    get statusCode() { return statusCode; },
    setHeader: () => {},
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(statusCode, 400);
  const json = JSON.parse(responseData);
  assert.strictEqual(json.success, false);
  assert.ok(json.error.includes('data sensitif'));
});

await asyncTest('Menolak kueri yang membocorkan password atau PIN eksplisit', async () => {
  let responseData = '';
  let statusCode = 200;
  const mockReq = {
    method: 'POST',
    headers: { host: 'localhost:3001' },
    body: { message: 'kata sandi: RahasiaBanget123!' }
  };
  const mockRes = {
    set statusCode(code) { statusCode = code; },
    get statusCode() { return statusCode; },
    setHeader: () => {},
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(statusCode, 400);
  const json = JSON.parse(responseData);
  assert.strictEqual(json.success, false);
});

// ==========================================
// 3. Pengujian Batas Ukuran Payload (DoS Protection)
// ==========================================
console.log('\n--- 3. Pengujian Batas Ukuran Payload (Payload Too Large) ---');

await asyncTest('Menolak payload POST yang melebihi batas 64 KB dengan HTTP 413', async () => {
  let responseData = '';
  let statusCode = 200;
  // Buat string melebihi 64 KB (65000 karakter)
  const hugeString = 'A'.repeat(66000);
  const mockReq = {
    method: 'POST',
    headers: { host: 'localhost:3001' },
    body: hugeString
  };
  const mockRes = {
    set statusCode(code) { statusCode = code; },
    get statusCode() { return statusCode; },
    setHeader: () => {},
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(statusCode, 413, `Harus mengembalikan HTTP 413, didapat: ${statusCode}`);
  const json = JSON.parse(responseData);
  assert.strictEqual(json.success, false);
  assert.ok(json.error.includes('Ukuran payload'));
});

// ==========================================
// 4. Pengujian Batas Panjang Karakter Pesan / Query
// ==========================================
console.log('\n--- 4. Pengujian Batas Panjang Karakter Pesan ---');

await asyncTest('Menolak pesan yang melebihi 2500 karakter dengan HTTP 400', async () => {
  let responseData = '';
  let statusCode = 200;
  const longQuery = 'Halo '.repeat(600); // 3000 karakter
  const mockReq = {
    method: 'POST',
    headers: { host: 'localhost:3001' },
    body: { message: longQuery }
  };
  const mockRes = {
    set statusCode(code) { statusCode = code; },
    get statusCode() { return statusCode; },
    setHeader: () => {},
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(statusCode, 400);
  const json = JSON.parse(responseData);
  assert.strictEqual(json.success, false);
  assert.ok(json.error.includes('2500 karakter'));
});

// ==========================================
// 5. Pengujian Sanitasi Riwayat Dialog (History Sanitization)
// ==========================================
console.log('\n--- 5. Pengujian Sanitasi Riwayat Dialog (History Array) ---');

await asyncTest('Memotong array riwayat percakapan menjadi maksimal 10 entri aman', async () => {
  const hugeHistory = Array.from({ length: 50 }, (_, i) => ({
    role: 'user',
    content: `Pesan ${i}`,
    maliciousField: 'exploit'
  }));
  hugeHistory.push({ __proto__: { admin: true } });

  const sanitized = sanitizeHistory(hugeHistory);
  assert.ok(sanitized.length <= 10, 'History harus dibatasi maksimal 10 entri');
  assert.strictEqual(sanitized[sanitized.length - 1].content, 'Pesan 49');
  assert.strictEqual(sanitized[0].maliciousField, undefined, 'Field selain role dan content harus dibuang');
});

// ==========================================
// 6. Pengujian HTTP Method Whitelisting
// ==========================================
console.log('\n--- 6. Pengujian Pembatasan Metode HTTP (405 Method Not Allowed) ---');

await asyncTest('Menolak metode selain GET, POST, OPTIONS (misal: DELETE/PUT)', async () => {
  let responseData = '';
  let statusCode = 200;
  const mockReq = {
    method: 'DELETE',
    headers: { host: 'localhost:3001' }
  };
  const mockRes = {
    set statusCode(code) { statusCode = code; },
    get statusCode() { return statusCode; },
    setHeader: () => {},
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(statusCode, 405);
  const json = JSON.parse(responseData);
  assert.strictEqual(json.success, false);
});

// ==========================================
// 7. Pengujian Pembatasan Endpoint Publik (/api/saipul Only)
// ==========================================
console.log('\n--- 7. Pengujian Pembatasan Endpoint Publik (/api/saipul Only) ---');

for (const blockedPath of ['/api/posts', '/api/projects', '/api/gallery', '/api/auth/me', '/api/saipul/admin', '/api/saipul-internal']) {
  await asyncTest(`Menolak endpoint non-publik (${blockedPath}) dengan HTTP 404`, async () => {
    let responseData = '';
    let statusCode = 200;
    const headers = {};
    const mockReq = {
      method: 'GET',
      url: blockedPath,
      headers: { host: 'localhost:3001' }
    };
    const mockRes = {
      set statusCode(code) { statusCode = code; },
      get statusCode() { return statusCode; },
      setHeader: (k, v) => { headers[k] = v; },
      end: (chunk) => { responseData = chunk; }
    };

    await handler(mockReq, mockRes);
    assert.strictEqual(statusCode, 404, `${blockedPath} harus mengembalikan HTTP 404, didapat: ${statusCode}`);
    assert.strictEqual(headers['X-Content-Type-Options'], 'nosniff');
    const json = JSON.parse(responseData);
    assert.strictEqual(json.success, false);
  });
}

await asyncTest('Tetap mengizinkan endpoint publik /api/saipul/ dan query string', async () => {
  let responseData = '';
  let statusCode = 200;
  const mockReq = {
    method: 'GET',
    url: '/api/saipul/?q=halo',
    headers: { host: 'localhost:3001' }
  };
  const mockRes = {
    set statusCode(code) { statusCode = code; },
    get statusCode() { return statusCode; },
    setHeader: () => {},
    end: (chunk) => { responseData = chunk; }
  };

  await handler(mockReq, mockRes);
  assert.strictEqual(statusCode, 200);
  const json = JSON.parse(responseData);
  assert.strictEqual(json.success, true);
});

await asyncTest('Netlify Event menolak path non-publik (/api/posts) dengan HTTP 404', async () => {
  const res = await handler({
    httpMethod: 'POST',
    path: '/api/posts',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'hack' })
  });
  assert.strictEqual(res.statusCode, 404);
  const json = JSON.parse(res.body);
  assert.strictEqual(json.success, false);
});

// ==========================================
// 8. Pengujian Netlify Functions Security & Rate Limiting
// ==========================================
console.log('\n--- 8. Pengujian Lingkungan Netlify Functions ---');

await asyncTest('Netlify Event menyertakan header keamanan dan menolak payload terlalu besar', async () => {
  const event = {
    httpMethod: 'POST',
    headers: {
      'x-forwarded-for': '198.51.100.1',
      'content-type': 'application/json'
    },
    body: 'B'.repeat(66000)
  };

  const res = await handler(event);
  assert.strictEqual(res.statusCode, 413);
  assert.strictEqual(res.headers['X-Content-Type-Options'], 'nosniff');
  assert.strictEqual(res.headers['X-Frame-Options'], 'DENY');
});

await asyncTest('Netlify Event menolak spam query melampaui rate limit 30 req/menit', async () => {
  const spamIp = '203.0.113.88';
  let lastStatus = 200;

  for (let i = 0; i < 35; i++) {
    const event = {
      httpMethod: 'GET',
      headers: { 'client-ip': spamIp },
      queryStringParameters: { q: 'halo' }
    };
    const res = await handler(event);
    lastStatus = res.statusCode;
  }

  assert.strictEqual(lastStatus, 429, 'Permintaan ke-35 dari IP yang sama harus terkena 429 Rate Limit');
});

console.log(`\n===========================================`);
console.log(`🏁 Hasil Pengujian Keamanan API: ${passedTests}/${totalTests} Lolos`);
console.log(`===========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
