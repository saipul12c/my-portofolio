import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const nluPath = pathToFileURL(path.resolve(rootDir, 'src/components/helpbutton/chat/components/logic/utils/nluProcessing.js')).href;
const { detectLanguage } = await import(nluPath);

const lexicalPath = pathToFileURL(path.resolve(rootDir, 'src/components/helpbutton/chat/components/logic/utils/lexicalDatabase.js')).href;
const { getBilingualTranslation, getSynonyms } = await import(lexicalPath);

const greetingPath = pathToFileURL(path.resolve(rootDir, 'src/components/helpbutton/chat/components/logic/utils/greetingRecognizer.js')).href;
const { recognizeGreeting } = await import(greetingPath);

const smartKBPath = pathToFileURL(path.resolve(rootDir, 'src/components/helpbutton/chat/components/logic/utils/smartKBQuery.js')).href;
const { smartKBQuery } = await import(smartKBPath);

console.log('=== MULTI-LANGUAGE TEST SUITE FOR SAIPULAI ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. TEST LANGUAGE DETECTION
console.log('--- 1. Testing detectLanguage ---');
const idQueries = [
  'halo apa kabar kamu hari ini?',
  'siapa syaiful mukminin itu?',
  'tampilkan semua proyek yang sudah dibuat',
  'apa saja keahlian dan sertifikatnya?',
  'bagaimana cara menghubungi syaiful?'
];

const enQueries = [
  'hello, how are you doing today?',
  'who is Syaiful Mukminin?',
  'show me all the projects you have built',
  'what are his skills and certifications?',
  'how can I contact or hire Syaiful?'
];

for (const q of idQueries) {
  const result = detectLanguage(q);
  assert(result.language === 'id', `"${q}" detected as Indonesian (${result.language})`);
}

for (const q of enQueries) {
  const result = detectLanguage(q);
  assert(result.language === 'en', `"${q}" detected as English (${result.language})`);
}

// 2. TEST BILINGUAL TRANSLATION LOOKUP & LEXICAL DATABASE
console.log('\n--- 2. Testing getBilingualTranslation & Lexical Fallback ---');
const trans1 = getBilingualTranslation('projek', 'en');
assert(trans1 === 'projects' || trans1 === 'project', `Translation 'projek' -> 'en': ${trans1}`);
const trans2 = getBilingualTranslation('skills', 'id');
assert(trans2 === 'keahlian' || trans2 === 'kemampuan', `Translation 'skills' -> 'id': ${trans2}`);
const trans3 = getBilingualTranslation('contact', 'id');
assert(trans3 === 'kontak' || trans3 === 'hubungi', `Translation 'contact' -> 'id': ${trans3}`);

const synId = getSynonyms('proyek', 'id');
assert(Array.isArray(synId) && synId.length > 0, `Synonyms for 'proyek' in ID found: ${synId.join(', ')}`);
const synEn = getSynonyms('project', 'en');
assert(Array.isArray(synEn) && synEn.length > 0, `Synonyms for 'project' in EN found: ${synEn.join(', ')}`);

// 3. TEST GREETING RECOGNIZER IN MULTI-LANGUAGE
console.log('\n--- 3. Testing recognizeGreeting in Multi-Language ---');
const greetEn = recognizeGreeting('hello good morning', {}, { targetLanguage: 'en' });
assert(greetEn !== null, 'Greeting recognized for English morning');
assert(greetEn && greetEn.language === 'en', `Greeting language is 'en': ${greetEn?.language}`);
assert(greetEn && greetEn.text.toLowerCase().includes('morning'), `Greeting English text: "${greetEn?.text}"`);
assert(greetEn && greetEn.alternatives && greetEn.alternatives.indonesian, `Greeting has Indonesian alternative: "${greetEn?.alternatives?.indonesian}"`);

const greetId = recognizeGreeting('selamat pagi', {}, { targetLanguage: 'id' });
assert(greetId !== null, 'Greeting recognized for Indonesian morning');
assert(greetId && greetId.language === 'id', `Greeting language is 'id': ${greetId?.language}`);
assert(greetId && greetId.text.toLowerCase().includes('pagi'), `Greeting Indonesian text: "${greetId?.text}"`);
assert(greetId && greetId.alternatives && greetId.alternatives.english, `Greeting has English alternative: "${greetId?.alternatives?.english}"`);

const greetAutoEn = recognizeGreeting('thank you very much', {}, { targetLanguage: 'auto' });
assert(greetAutoEn !== null, 'Auto Greeting recognized for "thank you very much"');
assert(greetAutoEn && greetAutoEn.language === 'en', `Auto Greeting detected 'en': ${greetAutoEn?.language}`);

const greetAutoId = recognizeGreeting('terima kasih banyak', {}, { targetLanguage: 'auto' });
assert(greetAutoId !== null, 'Auto Greeting recognized for "terima kasih banyak"');
assert(greetAutoId && greetAutoId.language === 'id', `Auto Greeting detected 'id': ${greetAutoId?.language}`);

// 4. TEST SMART KB QUERY IN MULTI-LANGUAGE
console.log('\n--- 4. Testing smartKBQuery Direct Intents & Options ---');
const kbMock = {
  projects: [{ id: 1, title: 'Portfolio Website', role: 'Fullstack Dev', description: 'Personal web app with SaipulAI' }],
  skills: [{ name: 'React', level: 'Advanced' }],
  experiences: [{ role: 'Frontend Engineer', company: 'Tech Corp' }]
};

// 4A: English who is Syaiful
const kbEnWhoResults = smartKBQuery('who is syaiful', kbMock, { targetLanguage: 'en', language: 'en' });
assert(Array.isArray(kbEnWhoResults) && kbEnWhoResults.length > 0, 'smartKBQuery answered "who is syaiful" in English');
const kbEnWho = kbEnWhoResults[0];
assert(kbEnWho && kbEnWho.answer && (kbEnWho.answer.includes('Syaiful Mukmin') || kbEnWho.answer.includes('Muhammad Syaiful')), `Text contains Syaiful Mukmin: "${kbEnWho?.answer?.slice(0, 80)}..."`);
assert(kbEnWho && kbEnWho.language === 'en', `KB result language is 'en': ${kbEnWho?.language}`);
assert(kbEnWho && kbEnWho.alternatives && kbEnWho.alternatives.indonesian, `KB result contains Indonesian translation alternative`);

// 4B: English skills query
const kbEnSkillsResults = smartKBQuery('what are your skills', kbMock, { targetLanguage: 'en', language: 'en' });
assert(Array.isArray(kbEnSkillsResults) && kbEnSkillsResults.length > 0, 'smartKBQuery answered "what are your skills" in English');
const kbEnSkills = kbEnSkillsResults[0];
assert(kbEnSkills && kbEnSkills.answer && (kbEnSkills.answer.includes('Specialization') || kbEnSkills.answer.includes('Stack')), `Text contains Specialization or Stack: "${kbEnSkills?.answer?.slice(0, 80)}..."`);
assert(kbEnSkills && kbEnSkills.language === 'en', `KB skills language is 'en': ${kbEnSkills?.language}`);

// 4C: English date & time query
const kbEnTimeResults = smartKBQuery('what time is it now', kbMock, { targetLanguage: 'en', language: 'en' });
assert(Array.isArray(kbEnTimeResults) && kbEnTimeResults.length > 0, 'smartKBQuery answered "what time is it now" in English');
const kbEnTime = kbEnTimeResults[0];
assert(kbEnTime && kbEnTime.answer && (kbEnTime.answer.includes('current time') || kbEnTime.answer.includes('Current time')), `Time text formatted in English: "${kbEnTime?.answer}"`);

// 4D: Indonesian date & time query
const kbIdTimeResults = smartKBQuery('jam berapa sekarang', kbMock, { targetLanguage: 'id', language: 'id' });
assert(Array.isArray(kbIdTimeResults) && kbIdTimeResults.length > 0, 'smartKBQuery answered "jam berapa sekarang" in Indonesian');
const kbIdTime = kbIdTimeResults[0];
assert(kbIdTime && kbIdTime.answer && (kbIdTime.answer.includes('pukul') || kbIdTime.answer.includes('Waktu')), `Time text formatted in Indonesian: "${kbIdTime?.answer}"`);

// 4E: Auto language detection in smartKBQuery
const kbAutoEnResults = smartKBQuery('tell me about his career and experience', kbMock, { targetLanguage: 'auto' });
assert(Array.isArray(kbAutoEnResults) && kbAutoEnResults.length > 0, 'smartKBQuery answered English career query in Auto mode');
const kbAutoEn = kbAutoEnResults[0];
assert(kbAutoEn && kbAutoEn.language === 'en', `Auto mode correctly produced 'en' response for career: ${kbAutoEn?.language}`);

const kbAutoIdResults = smartKBQuery('bagaimana pengalaman kerja syaiful', kbMock, { targetLanguage: 'auto' });
assert(Array.isArray(kbAutoIdResults) && kbAutoIdResults.length > 0, 'smartKBQuery answered Indonesian career query in Auto mode');
const kbAutoId = kbAutoIdResults[0];
assert(kbAutoId && kbAutoId.language === 'id', `Auto mode correctly produced 'id' response for career: ${kbAutoId?.language}`);

console.log(`\n========================================`);
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
