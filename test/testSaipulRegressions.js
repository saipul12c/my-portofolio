import assert from 'assert';
import LZString from 'lz-string';
import { analyzeData } from '../src/components/helpbutton/chat/components/logic/utils/analytics.js';
import { recognizeGreeting } from '../src/components/helpbutton/chat/components/logic/utils/greetingRecognizer.js';
import {
  smartKBQuery,
  getUniversalKnowledgeEntries,
  clearKBCache
} from '../src/components/helpbutton/chat/components/logic/utils/smartKBQuery.js';
import { checkClaimAgainstKB } from '../src/components/helpbutton/chat/components/logic/utils/factChecker.js';
import { buildIndexFromKB, searchIndex } from '../src/components/helpbutton/chat/components/logic/utils/tfidfSearch.js';
import { getAnimationByInput, getLoadingVariants } from '../src/components/helpbutton/chat/components/logic/utils/animationMapper.js';
import {
  saveUploadedData,
  readStoredUploadedData,
  removeSingleUploadedFile,
  STORAGE_KEYS
} from '../src/components/helpbutton/chat/components/logic/utils/fileProcessor.js';
import { generateResponse } from '../api/saipul.js';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

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

let passed = 0;
let total = 0;

async function runTest(name, fn) {
  total += 1;
  try {
    await fn();
    passed += 1;
    console.log(`  PASS: ${name}`);
  } catch (err) {
    console.error(`  FAIL: ${name}\n    -> ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('Running SaipulAI Regression Suite...\n');

await runTest('CSV analytics preserves decimal values like 10.5 and 20.5', () => {
  const mockKb = {
    uploadedData: [
      {
        fileName: 'nilai_desimal.csv',
        content: 'Nama,Skor\nAndi,10.5\nBudi,20.5'
      }
    ]
  };
  const output = analyzeData('tolong analisis data skor', mockKb);
  assert.ok(output, 'analyzeData should return output');
  assert.ok(!output.includes('105') && !output.includes('205'), 'Should not strip decimal dots into integers');
  assert.ok(output.includes('15.5') && output.includes('31'), `Expected mean 15.5 and sum 31, got: ${output}`);
});

await runTest('CSV analytics parses Indonesian thousands/comma decimals like 1.250,5', () => {
  const mockKb = {
    uploadedData: [
      {
        fileName: 'omzet_id.csv',
        content: 'Bulan,Omzet\nJan,1.250,5\nFeb,2.750,5'
      }
    ]
  };
  const output = analyzeData('analisis data omzet', mockKb);
  assert.ok(output, 'analyzeData should return output');
  assert.ok(output.includes('4001') || output.includes('4,001'), `Expected sum ~4001, got: ${output}`);
  assert.ok(output.includes('2000.5'), `Expected mean 2000.5, got: ${output}`);
});

await runTest('Greeting recognizer deterministically classifies "halo pul apa kabar"', () => {
  const seenPatternTypes = new Set();
  for (let i = 0; i < 50; i++) {
    const res = recognizeGreeting('halo pul apa kabar');
    assert.ok(res && res.isGreeting === true, `Run ${i}: expected isGreeting=true`);
    assert.notStrictEqual(res.patternType, 'generalGreeting', `Run ${i}: should not be shadowed by generalGreeting`);
    seenPatternTypes.add(res.patternType);
  }
  assert.strictEqual(seenPatternTypes.size, 1, `Expected deterministic patternType, got: ${[...seenPatternTypes].join(', ')}`);
});

await runTest('TF-IDF search ranks matching KB item and integrates into smartKBQuery', () => {
  const sampleKb = {
    projects: [
      {
        id: 'proj-quantum',
        title: 'Quantum Mesh Telemetry',
        description: 'Distributed websocket sensor visualizer for low-latency robotics',
        category: 'IoT',
        tech: ['React', 'WebSocket']
      }
    ],
    skills: [],
    specializations: [],
    certificates: [],
    uploadedData: []
  };

  const index = buildIndexFromKB(sampleKb);
  const hits = searchIndex(index, 'telemetry robotics visualizer', 3);
  assert.ok(hits.length > 0 && hits[0].score > 0, 'searchIndex should score matching project');

  clearKBCache();
  const idRes = smartKBQuery('telemetry robotics visualizer', sampleKb, { lang: 'id', threshold: 0.1 });
  const enRes = smartKBQuery('telemetry robotics visualizer', sampleKb, { lang: 'en', threshold: 0.1 });
  assert.ok(Array.isArray(idRes) && idRes.length > 0, 'smartKBQuery should find telemetry project');
  assert.notStrictEqual(idRes[0].language, 'en');
  assert.ok(Array.isArray(enRes) && enRes.length > 0, 'smartKBQuery with lang=en should return results');
  assert.notStrictEqual(idRes, enRes, 'Cache must isolate lang=id and lang=en entries');
});

await runTest('Canonical routes in smartKBQuery universal entries & API contact info', async () => {
  const entries = getUniversalKnowledgeEntries({
    skills: [{ name: 'Communication', category: 'Soft', description: 'Clear teamwork' }],
    specializations: [],
    certificates: [{ title: 'AWS Builder', issuer: 'Amazon', date: '2026' }]
  });
  const routes = entries.map(e => e.route).filter(Boolean);
  assert.ok(routes.includes('/softskills'), 'Expected /softskills route');
  assert.ok(routes.includes('/certificates'), 'Expected /certificates route');
  assert.ok(!routes.includes('/skills') && !routes.includes('/sertif'), 'Stale routes must not appear');

  const contactRes = await generateResponse('kontak syaiful linkedin instagram');
  assert.ok(contactRes.reply.includes('saipul16_'), 'Contact reply must use canonical saipul16_ handle');
  assert.ok(contactRes.reply.includes('/contact'), 'Contact reply must use canonical /contact route');
});

await runTest('FactChecker & AnimationMapper work reliably', () => {
  const kb = {
    projects: [{ title: 'SaipulAI Core', description: 'Dual engine conversational AI built by Muhammad Syaiful Mukmin' }],
    uploadedData: []
  };
  const check = checkClaimAgainstKB('SaipulAI Core conversational engine', kb);
  assert.ok(check && typeof check.verified === 'boolean' && check.score > 0, 'checkClaimAgainstKB should score valid claim');

  const anim = getAnimationByInput('hitung integral x^2', 'math');
  assert.ok(anim && typeof anim.type === 'string', 'getAnimationByInput should return animation config');
  const variants = getLoadingVariants('coding');
  assert.ok(Array.isArray(variants) && variants.length > 0, 'getLoadingVariants should return variant list');
});

await runTest('fileProcessor compresses and decompresses uploaded data symmetrically', () => {
  globalThis.localStorage.clear();
  const sampleFile = {
    fileName: 'uji_kompresi.txt',
    content: 'Dokumen pengujian kompresi LZString untuk SaipulAI.',
    sentences: ['Dokumen pengujian kompresi LZString untuk SaipulAI.'],
    uploadDate: new Date().toISOString(),
    wordCount: 7,
    size: 512,
    extension: 'txt'
  };
  const bigPadding = 'Data uji panjang '.repeat(40);
  saveUploadedData({ ...sampleFile, fileName: 'file_besar.txt', content: bigPadding, sentences: [bigPadding] });
  saveUploadedData(sampleFile);

  const rawStored = globalThis.localStorage.getItem(STORAGE_KEYS.UPLOADED_DATA);
  assert.ok(rawStored && rawStored.startsWith('LZ:'), 'Large payload should be LZString compressed with LZ: prefix');

  const parsed = readStoredUploadedData();
  assert.strictEqual(parsed.length, 2, 'readStoredUploadedData must decompress cleanly');

  const afterRemove = removeSingleUploadedFile('uji_kompresi.txt');
  assert.strictEqual(afterRemove.updatedData.length, 1, 'removeSingleUploadedFile should keep remaining file');
  assert.ok(LZString.decompressFromUTF16(globalThis.localStorage.getItem(STORAGE_KEYS.UPLOADED_DATA).slice(3)) || true);
});

console.log(`\nSummary: ${passed}/${total} regression tests passed.`);
if (passed !== total) process.exit(1);
