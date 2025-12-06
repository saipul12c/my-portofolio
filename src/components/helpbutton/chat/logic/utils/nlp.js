
import nlp from 'compromise';

// Daftar kata kunci untuk setiap niat
const intentKeywords = {
    GREETING: ['hai', 'halo', 'hi', 'selamat pagi', 'selamat siang', 'selamat malam', 'assalamualaikum', 'salam', 'apa kabar', 'hey'],
    FAREWELL: ['selamat tinggal', 'sampai jumpa', 'dah', 'bye', 'dadah', 'see you'],
    THANK_YOU: ['terima kasih', 'makasih', 'hatur nuhun', 'thanks', 'thank you'],
    AFFIRMATION: ['ya', 'betul', 'benar', 'setuju', 'yup', 'oke', 'ok'],
    NEGATION: ['tidak', 'bukan', 'jangan', 'no', 'ga', 'enggak'],
    INQUIRY: ['apa', 'siapa', 'kapan', 'di mana', 'mengapa', 'bagaimana', 'berapa', 'kenapa', 'which', 'where', 'when', 'who', 'how', 'why'],
    REQUEST: ['tolong', 'minta', 'bisakah', 'dapatkah', 'please', 'bisa tolong'],
    CALCULATION: ['hitung', 'jumlahkan', 'kurangi', 'kali', 'bagi', 'berapa hasil', 'calculate', 'count', 'sum', 'subtract', 'multiply', 'divide'],
    DATE_TIME: ['hari apa', 'tanggal berapa', 'jam berapa', 'sekarang', 'hari ini', 'besok', 'kemarin', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'],
    FEEDBACK: ['bagus', 'keren', 'mantap', 'kurang', 'jelek', 'feedback', 'saran', 'kritik', 'pujian'],
    HUMAN_INTERACTION: ['kamu siapa', 'siapa namamu', 'siapa pembuatmu', 'apa kabarmu', 'umur kamu', 'asal kamu', 'ceritakan tentang kamu'],
    INFORMATION_SEEKING: ['jelaskan', 'berikan informasi', 'cari tahu', 'apa itu', 'info', 'informasi', 'penjelasan'],
    LIVING_BEING: ['manusia', 'hewan', 'tumbuhan', 'makhluk hidup', 'binatang', 'flora', 'fauna', 'organisme'],
    GENERAL_OBJECT: ['benda', 'barang', 'objek', 'alat', 'device', 'tools', 'thing'],
    DAY: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu', 'hari'],
    UNCATEGORIZED: [],
};
// Fungsi untuk mendeteksi sapaan
export function detectGreeting(text) {
    const lowerText = text.toLowerCase();
    return intentKeywords.GREETING.some(keyword => lowerText.includes(keyword));
}

// Fungsi untuk mendeteksi hari
export function detectDay(text) {
    const lowerText = text.toLowerCase();
    return intentKeywords.DAY.some(keyword => lowerText.includes(keyword));
}

// Fungsi untuk mendeteksi apakah membahas manusia/benda hidup
export function detectLivingBeing(text) {
    const lowerText = text.toLowerCase();
    return intentKeywords.LIVING_BEING.some(keyword => lowerText.includes(keyword));
}

// Fungsi untuk membedakan tipe pertanyaan, hitungan, sapaan, info, feedback
export function determineType(text) {
    const intent = recognizeIntent(text);
    if (intent === 'CALCULATION') return 'calculation';
    if (intent === 'GREETING') return 'greeting';
    if (intent === 'INQUIRY') return 'question';
    if (intent === 'FEEDBACK') return 'feedback';
    if (intent === 'INFORMATION_SEEKING') return 'information';
    if (intent === 'HUMAN_INTERACTION') return 'human_interaction';
    if (intent === 'DATE_TIME' || intent === 'DAY') return 'datetime';
    if (intent === 'REQUEST') return 'request';
    return 'other';
}

// Fungsi untuk mencari respon di file JSON
import fs from 'fs';
export function searchResponseInJson(intent, entities, context = {}, jsonPath = null) {
    // Default path jika tidak diberikan
    const path = jsonPath || 'src/components/helpbutton/chat/data/AI-base.json';
    try {
        const raw = fs.readFileSync(path);
        const data = JSON.parse(raw);
        // Cari respon berdasarkan intent dan entitas
        let responses = data[intent] || [];
        // Filter berdasarkan entitas jika ada
        if (entities && Object.keys(entities).length > 0) {
            responses = responses.filter(res => {
                return Object.values(entities).flat().some(ent => res.toLowerCase().includes(ent.toLowerCase()));
            });
        }
        // Jika ada konteks, filter juga
        if (context && context.topic) {
            responses = responses.filter(res => res.toLowerCase().includes(context.topic.toLowerCase()));
        }
        return responses.length > 0 ? responses[0] : null;
    } catch (e) {
        return null;
    }
}

// Fungsi untuk mengenali niat (intent)
export function recognizeIntent(text) {
    const lowerText = text.toLowerCase();
    for (const intent in intentKeywords) {
        if (intentKeywords[intent].some(keyword => lowerText.includes(keyword))) {
            return intent;
        }
    }
    return 'UNCATEGORIZED';
}

// Fungsi untuk mengekstrak entitas
export function extractEntities(text) {
    const doc = nlp(text);
    const entities = {
        PERSON: doc.people().out('array'),
        PLACE: doc.places().out('array'),
        ORGANIZATION: doc.organizations().out('array'),
        DATE: doc.dates().out('array'),
        VALUE: doc.values().out('array'),
        NOUNS: doc.nouns().out('array'),
    };
    return entities;
}

// Fungsi untuk memvalidasi dan membersihkan input
export function sanitizeInput(text) {
    // Hapus karakter yang berpotensi berbahaya dan escape script
    let sanitizedText = text.replace(/[<>]/g, '');
    sanitizedText = sanitizedText.replace(/script/gi, '');
    sanitizedText = sanitizedText.replace(/(alert|onerror|onload|iframe|img|src)/gi, '');
    return sanitizedText;
}

// Fungsi untuk memfilter output
export function filterOutput(text) {
    // Sensor kata-kata yang tidak pantas dan potensi SARA
    const badWords = ['bodoh', 'gila', 'tolol', 'anjing', 'babi', 'bangsat', 'kontol', 'sial', 'idiot', 'hina', 'rasis'];
    let filteredText = text;
    badWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        filteredText = filteredText.replace(regex, '***');
    });
    // Sensor script dan html
    filteredText = filteredText.replace(/<[^>]*>?/gm, '');
    filteredText = filteredText.replace(/script/gi, '');
    return filteredText;
}
