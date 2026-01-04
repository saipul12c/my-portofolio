import { processNLU } from './src/components/helpbutton/chat/components/logic/utils/nluProcessing.js';
import { getSmartReply } from './src/components/helpbutton/chat/components/logic/utils/responseGenerator.js';
import { buildVocabularyFromKB } from './src/components/helpbutton/chat/components/logic/utils/spellChecker.js';

function assert(cond, msg) {
  if (!cond) throw new Error('Assertion failed: ' + msg);
}

async function run() {
  console.log('Running lightweight NLU tests...');

  // PII test
  const input = 'Halo, email saya test.user@example.com dan no 08123456789';
  const res = processNLU(input, {});
  assert(res.processing && Array.isArray(res.processing.pii) && res.processing.pii.length >= 1, 'PII should be detected');

  // Spell correction
  const kb = { cards: ['belajar javascript', 'react components'] };
  const vocab = buildVocabularyFromKB(kb);
  const res2 = processNLU('belajar javasript', { vocab });
  assert(res2.processing.spellCorrections && res2.processing.spellCorrections.length >= 1, 'Spell correction should run');

  // Smart reply greeting
  const r = getSmartReply('halo', { calculationPrecision: 4, debugMode: false, responseStyle: null, memoryContext: false, enableFileUpload: true }, [], { uploadedData: [], fileMetadata: [] }, {});
  assert(r && r.text && r.text.length > 0, 'Smart reply should return text for greeting');

  console.log('All lightweight NLU tests passed.');
}

run().catch(e => { console.error(e); process.exit(2); });
