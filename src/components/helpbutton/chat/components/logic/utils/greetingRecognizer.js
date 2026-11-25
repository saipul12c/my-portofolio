/**
 * Greeting & Simple Pattern Recognizer untuk SaipulAI
 * Mengenali sapaan, pertanyaan sederhana, dan interaksi dasar
 * Language: Indonesian & English
 */

import { detectSarcasmAndIrony, analyzeSentiment, detectLanguage } from './nluProcessing.js';

export const GREETING_PATTERNS = {
  // Greeting/Sapaan Pagi
  morningGreeting: {
    patterns: ['pagi', 'selamat pagi', 'good morning', 'pagi pagi', 'om pagi', 'morning'],
    responses: [
      '🌅 Selamat pagi! Semoga hari ini menjadi produktif untuk Anda. Ada yang bisa saya bantu?',
      '☀️ Pagi! Semangat ya! Apa yang bisa saya lakukan untuk Anda hari ini?',
      '🌞 Selamat pagi! Siap membantu Anda dengan apa saja. Apa kabar?'
    ],
    responses_en: [
      '🌅 Good morning! Wishing you a very productive and pleasant day. How can I help you?',
      '☀️ Morning! Hope you are energized today! What can I assist you with?',
      '🌞 Good morning! Ready to help you with anything. How are you doing today?'
    ],
    confidence: 0.95
  },

  // Greeting/Sapaan Siang
  afternoonGreeting: {
    patterns: ['siang', 'selamat siang', 'good afternoon', 'siang siang', 'om siang', 'afternoon'],
    responses: [
      '☀️ Selamat siang! Makan siang dulu? Ada yang bisa kubantu?',
      '🌤️ Siang! Bagaimana hari mu sampai saat ini? Ada pertanyaan apa?',
      '😊 Selamat siang! Ayo kita kerjakan sesuatu yang produktif.'
    ],
    responses_en: [
      '☀️ Good afternoon! How is your day going? How can I help you?',
      '🌤️ Afternoon! Hope everything is going well. Any questions or tasks for me?',
      '😊 Good afternoon! Ready to assist you with anything productive.'
    ],
    confidence: 0.95
  },

  // Greeting/Sapaan Sore
  eveningGreeting: {
    patterns: ['sore', 'selamat sore', 'good evening', 'sore sore', 'om sore', 'evening'],
    responses: [
      '🌅 Selamat sore! Bagaimana aktivitas Anda tadi? Ada yang mau dibahas?',
      '🌇 Sore! Senang bertemu lagi. Apa berita hari ini?',
      '✨ Selamat sore! Ini waktu yang tepat untuk refleksi atau belajar hal baru. Mau mulai?'
    ],
    responses_en: [
      '🌅 Good evening! How was your day? What would you like to discuss?',
      '🌇 Evening! Great to connect with you. How can I assist you right now?',
      '✨ Good evening! A great time to learn or review projects. Shall we begin?'
    ],
    confidence: 0.95
  },

  // Greeting/Sapaan Malam
  nightGreeting: {
    patterns: ['malam', 'selamat malam', 'good night', 'malam malam', 'om malam', 'selamat tidur', 'goodnight'],
    responses: [
      '🌙 Selamat malam! Jangan lupa istirahat yang cukup ya. Ada lagi yang bisa kubantu sebelum tidur?',
      '✨ Malam! Sudah siap untuk istirahat? Atau ada yang ingin dibicarakan dulu?',
      '😴 Selamat malam! Semoga Anda tidur nyenyak. Terima kasih sudah berbincang hari ini!'
    ],
    responses_en: [
      '🌙 Good night! Don\'t forget to get plenty of rest. Is there anything else I can help you with before bed?',
      '✨ Good night! Ready to wind down or is there something quick you want to check first?',
      '😴 Good night! Sleep well and thank you for chatting today!'
    ],
    confidence: 0.95
  },

  // General Greeting/Sapaan Umum
  generalGreeting: {
    patterns: ['halo', 'hai', 'hello', 'hi', 'hey', 'aloha', 'assalamualaikum', 'wasalam', 'salam', 'greetings'],
    responses: [
      '👋 Halo! Senang bertemu dengan Anda. Apa yang bisa saya bantu?',
      '😊 Hai! Aku SaipulAI, siap membantu Anda dengan apapun. Ada pertanyaan?',
      '🙂 Hello! Glad to meet you. Bagaimana kabar Anda?',
      '🤗 Salam! Senang bisa terhubung dengan Anda. Apa yang bisa kubantu?',
      '👨‍💻 Halo! Aku di sini untuk membantu. Apa yang Anda butuhkan hari ini?'
    ],
    responses_en: [
      '👋 Hello! Great to meet you. How can I assist you today?',
      '😊 Hi there! I\'m SaipulAI, ready to help you with anything. What\'s your question?',
      '🙂 Greetings! Pleased to connect with you. How can I help you today?',
      '👨‍💻 Hi! I\'m here and ready to assist with information, projects, or questions. What\'s on your mind?'
    ],
    confidence: 0.9
  }
};

// ===== SIMPLE QUESTION PATTERNS =====
export const SIMPLE_PATTERNS = {
  // "Apa kabar?" / How are you?
  howAreYou: {
    patterns: [
      'apa kabar', 'bagaimana kabar', 'kamu apa kabar', 'gimana kabarmu',
      'how are you', 'how are you doing', 'whats up', 'apa aja', 'gimana',
      'kabar baik', 'kamu baik', 'apa halnya'
    ],
    responses: [
      '😊 Kabar baik! Terima kasih banyak sudah bertanya. Aku selalu senang membantu. Bagaimana dengan kabar Anda hari ini?',
      '🌟 Alhamdulillah, kabar aku baik-baik saja! Selalu siap untuk membantu Anda kapan saja. Ada yang bisa aku lakukan?',
      '✨ Kabar prima dan siap siaga! Terima kasih sudah menyapa. Saya lebih penasaran bagaimana kabar Anda hari ini?',
      '🤖 Sebagai AI, kabar dan sistemku selalu dalam kondisi optimal! 😄 Senang bisa mengobrol. Bagaimana kabar dan harimu sejauh ini?'
    ],
    responses_en: [
      '😊 I\'m doing great, thank you so much for asking! Always happy to help. How is your day going?',
      '🌟 Doing wonderful! Ready and enthusiastic to assist you. What can I do for you today?',
      '✨ In prime condition and at your service! How are things with you today?',
      '🤖 As an AI, all my systems are running smoothly! 😄 Great to chat with you. How can I assist you today?'
    ],
    confidence: 0.9
  },

  // "Siapa kamu?" / Who are you?
  whoAreYou: {
    patterns: [
      'siapa kamu', 'kamu siapa', 'siapa itu', 'kamu adalah',
      'who are you', 'tell me about you', 'apa nama kamu', 'nama kamu apa',
      'introduce yourself', 'tentang diri mu', 'about yourself'
    ],
    responses: [
      '🤖 Aku SaipulAI! Sebuah asisten AI yang dirancang untuk membantu Anda dengan:\n\n📚 **Menjawab pertanyaan** tentang berbagai topik\n🧮 **Menghitung matematika** kompleks\n📁 **Memproses file** dari berbagai format\n💼 **Memberikan informasi** dari knowledge base\n🎯 **Percakapan cerdas** dengan emotional intelligence\n\nAku adalah kreasi Muhammad Syaiful Mukmin. Ada yang bisa kubantu?',
      '👋 Nama aku SaipulAI - singkat dari Saipul Artificial Intelligence! Aku adalah asisten digital yang bertujuan membuat interaksi Anda lebih mudah dan menyenangkan. Aku bisa membantu dengan analisis, perhitungan, file processing, dan banyak lagi. Apa yang bisa aku kerjakan untuk Anda?',
      '🎓 Aku SaipulAI - asisten cerdas yang dilengkapi dengan:\n• Natural Language Understanding\n• Kemampuan analisis data\n• Processing file multimedia\n• Knowledge base yang komprehensif\n• Emotional intelligence\n\nDibuat dengan passion untuk membantu. Apa pertanyaan Anda?',
      '✨ I\'m SaipulAI - your personal AI assistant! Saya hadir untuk membantu Anda belajar, menganalisis, memproses data, dan berinteraksi dengan cara yang lebih manusiawi. Senang berkenalan! 😊'
    ],
    responses_en: [
      '🤖 I\'m SaipulAI! An intelligent assistant designed to help you with:\n\n📚 **Answering questions** across various domains\n🧮 **Complex mathematical and logic** reasoning\n📁 **Multi-format file analysis** (PDF, docs, images, spreadsheets)\n💼 **Exploring portfolios & projects**\n🎯 **Adaptive conversation** with emotional awareness\n\nI was developed by Muhammad Syaiful Mukmin. How can I assist you today?',
      '👋 I\'m SaipulAI - short for Saipul Artificial Intelligence! An interactive digital assistant created to make exploration and learning easier and fun. What can I do for you today?'
    ],
    confidence: 0.92
  },

  // "Apa nama kamu?" / What's your name?
  whatIsYourName: {
    patterns: [
      'nama kamu', 'nama mu', 'kamu nama apa', 'siapa nama kamu',
      'your name', 'whats your name', 'nama apa', 'kamu dipanggil'
    ],
    responses: [
      '📛 Nama aku SaipulAI! Kamu bisa panggil aku Saipul atau Saipi jika lebih pendek. Senang bertemu denganmu!',
      '🤖 SaipulAI! Itulah nama aku. Kamu bisa memanggilku dengan apapun yang kamu suka. Ada yang bisa kubantu?',
      '✨ Aku bernama SaipulAI - Saipul Artificial Intelligence. Panggil saja aku Saipul! 😊'
    ],
    responses_en: [
      '📛 My name is SaipulAI! You can call me Saipul. Pleased to meet you!',
      '🤖 SaipulAI! That\'s my name. Ready to assist with whatever you need today.'
    ],
    confidence: 0.93
  },

  // "Terima kasih" / Thank you
  thankYou: {
    patterns: [
      'terima kasih', 'terima kasih banyak', 'makasih', 'thanks', 'thank you',
      'trims', 'tks', 'thx', 'thanks bro', 'thanks a lot', 'thanks a million',
      'appreciate', 'menghargai', 'salamat'
    ],
    responses: [
      '😊 Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi kapan saja!',
      '🤗 Dengan senang hati! Itu pekerjaan aku. Ada lagi yang bisa kubantu?',
      '✨ Terima kasih kembali! Semoga informasi ini bermanfaat untuk Anda. Silahkan tanya lagi jika perlu!',
      '👍 You\'re welcome! Happy to help. Jangan segan untuk kembali lagi ya!'
    ],
    responses_en: [
      '😊 You\'re very welcome! Glad I could help. Don\'t hesitate to ask if you need anything else!',
      '🤗 My pleasure! Happy to be of assistance. Is there anything else you\'d like to explore?',
      '✨ You\'re welcome! Hope this information is valuable for you. Have a great time!'
    ],
    confidence: 0.9
  },

  // "Maaf / Permisi"
  apology: {
    patterns: [
      'maaf', 'permisi', 'sorry', 'excuse me', 'pardon', 'mohon maaf',
      'aku salah', 'saya salah', 'i\'m sorry', 'forgive me', 'minta maaf'
    ],
    responses: [
      '🙂 Tidak apa-apa! Semua orang bisa membuat kesalahan. Ada yang bisa aku bantu untuk memperbaiki situasi?',
      '✨ Tidak perlu khawatir! Aku di sini untuk membantu, bukan untuk menghakimi. Apa yang bisa aku lakukan?',
      '😌 Hey, don\'t worry about it! Mari kita fokus pada hal positif. Apa yang ingin kita bahas?',
      '💙 Tidak masalah sama sekali! Aku mengerti. Mari kita lanjutkan dengan semangat baru. Apa bantuan yang Anda butuhkan?'
    ],
    responses_en: [
      '🙂 No problem at all! Everyone makes mistakes. How can I help resolve this for you?',
      '✨ Don\'t worry about it! I\'m here to help, never to judge. What can I do for you?',
      '😌 Hey, no worries at all! Let\'s keep moving forward. What would you like to discuss?'
    ],
    confidence: 0.88
  },

  // "Apa itu [topik]?" / What is [topic]?
  whatIsQuestion: {
    patterns: [
      /apa itu\s+(\w+)/i,
      /apa\s+yang\s+dimaksud\s+(\w+)/i,
      /definisi\s+(\w+)/i,
      /what\s+is\s+(\w+)/i,
      /explain\s+(\w+)/i
    ],
    isRegex: true,
    baseResponse: '🔍 Bagus pertanyaan! Aku akan mencari informasi tentang "{topic}" untuk Anda di knowledge base saya. Tunggu sebentar...',
    confidence: 0.85
  },

  // "Bagaimana cara...?" / How to...?
  howToQuestion: {
    patterns: [
      /bagaimana cara\s+(.+)/i,
      /bagaimana\s+(.+)/i,
      /how\s+to\s+(.+)/i,
      /how\s+do\s+i\s+(.+)/i,
      /cara\s+(.+)/i
    ],
    isRegex: true,
    baseResponse: '🎯 Pertanyaan yang berguna! Aku akan memberikan panduan langkah demi langkah untuk "{topic}". Silahkan ikuti instruksi saya...',
    confidence: 0.85
  },

  // "Mengapa / Kenapa"
  whyQuestion: {
    patterns: [
      /mengapa\s+(.+)/i,
      /kenapa\s+(.+)/i,
      /why\s+(.+)/i,
      /apa alasan\s+(.+)/i
    ],
    isRegex: true,
    baseResponse: '🤔 Pertanyaan filosofis yang menarik! Ada beberapa alasan mengapa "{topic}" seperti itu. Mari kita analisis bersama...',
    confidence: 0.82
  },

  // Affirmation / Penegasan positif
  affirmation: {
    patterns: [
      'ya', 'iya', 'betul', 'benar', 'tepat', 'setuju', 'oke', 'ok', 'okeh',
      'yes', 'yeah', 'yep', 'correct', 'right', 'absolutely', 'definitely',
      'baik', 'boleh', 'sip', 'mantap', 'okay'
    ],
    responses: [
      '✅ Great! Mari kita lanjutkan. Apa langkah selanjutnya?',
      '👍 Mantap! Aku siap. Apa yang ingin kita kerjakan?',
      '💯 Perfect! Ayo kita mulai. Ada yang spesifik yang ingin dibahas?',
      '🎯 Betul! Aku setuju. Mari kita eksekusi rencana ini!'
    ],
    confidence: 0.88
  },

  // Negation / Penolakan
  negation: {
    patterns: [
      'tidak', 'tidak ada', 'bukan', 'nggak', 'enggak', 'nope', 'nah',
      'no', 'nope', 'never', 'neither', 'none', 'neither', 'tidak usah',
      'tidak perlu', 'jangan', 'skip'
    ],
    responses: [
      '❌ Baik diterima. Ada alternatif lain yang bisa aku bantu?',
      '👌 OK, tidak masalah. Apa yang lebih Anda preferensikan?',
      '💭 Mengerti. Mari kita cari solusi lain yang cocok untuk Anda.',
      '🙂 Tidak apa-apa. Ada yang lain yang bisa saya tawari?'
    ],
    confidence: 0.87
  },

  // Expression of not understanding
  confused: {
    patterns: [
      'tidak mengerti', 'tidak paham', 'bingung', 'confused', 'i don\'t understand',
      'kurang jelas', 'tidak jelas', 'jelaskan lagi', 'repeat', 'ulang lagi',
      'apa maksudnya', 'maksud apa', 'apaan', 'huh', 'what'
    ],
    responses: [
      '😊 Ah, saya mengerti Anda bingung. Biar saya jelaskan dengan lebih sederhana:\n\nBisa Anda katakan bagian mana yang tidak jelas? Saya akan menjelaskan dengan lebih detail.',
      '📚 Baik, mungkin penjelasan aku terlalu teknis. Mari saya uraikan dengan lebih mudah:\n\nApa bagian spesifik yang ingin Anda pahami lebih baik?',
      '💡 Saya mengerti! Kadang penjelasan bisa membingungkan. Saya akan coba dengan cara lain yang lebih sederhana dan jelas untuk Anda.',
      '🤔 OK, tidak masalah! Mari kita break down menjadi bagian yang lebih kecil. Tanyakan saja apa yang spesifik yang membuat Anda bingung!'
    ],
    confidence: 0.85
  },

  // Compliment / Pujian
  compliment: {
    patterns: [
      'bagus', 'keren', 'hebat', 'luar biasa', 'amazing', 'awesome', 'great',
      'excellent', 'wonderful', 'brilliant', 'fantastic', 'mantap', 'gila',
      'super', 'kece', 'sip dah', 'asik', 'joss'
    ],
    responses: [
      '😊 Terima kasih! Aku senang kalau jawaban aku membantu. Apa lagi yang bisa kubantu?',
      '🌟 Wah, terima kasih pujiannya! Aku merasa dihargai. Ada pertanyaan lain yang bisa saya jawab?',
      '✨ Aw, you\'re too kind! Aku akan terus berusaha memberikan yang terbaik untuk Anda.',
      '💙 Terima kasih! Feedback positif seperti ini membuat aku semakin semangat untuk membantu. Ada yang lain?'
    ],
    confidence: 0.85
  },

  // Feedback negatif
  criticism: {
    patterns: [
      'jelek', 'buruk', 'tidak membantu', 'kecewa', 'disappointed', 'bad',
      'useless', 'tidak berguna', 'salah', 'error', 'problem', 'issue',
      'tidak puas', 'tidak bagus'
    ],
    responses: [
      '😔 Saya merasa maaf kalau jawaban aku tidak memuaskan. Bisa Anda jelaskan apa yang tidak tepat? Saya akan berusaha memperbaiki.',
      '💭 Saya mengerti kekecewaan Anda. Feedback seperti ini sangat berharga untuk aku belajar dan meningkat. Apa yang bisa aku perbaiki?',
      '🔧 Thank you untuk feedback-nya! Ini membantu saya memahami apa yang perlu diperbaiki. Mari kita cari solusi bersama.',
      '🙏 Saya minta maaf kalau tidak memenuhi ekspektasi Anda. Mohon bantu aku dengan menjelaskan apa yang salah, sehingga aku bisa improve.'
    ],
    confidence: 0.82
  },

  // ===== OBROLAN SANTAI & BASA-BASI SEHARI-HARI =====

  // Basa-basi Aktivitas (lagi apa / lagi ngapain)
  smallTalkActivity: {
    patterns: [
      /\b(lagi apa|lagi ngapain|kamu lagi ngapain|sedang apa|lagi sibuk ya|lagi sibuk apa|ngapain aja lu|ngapain aja|lagi santai)\b/i
    ],
    isRegex: true,
    responses: [
      '👨‍💻 Lagi standby nungguin kamu nih! Siap bantu jawab pertanyaan, ngobrol santai, atau bahas seputar portofolio Syaiful. Kamu sendiri lagi sibuk apa hari ini?',
      '😊 Lagi asik membaca data dan memproses informasi di sistem portofolio Syaiful! Ada hal menarik yang mau kita bahas sekarang?',
      '🚀 Aku selalu siap siaga menemanimu! Mau hitung rumus, tanya proyek, curhat santai, atau cari info teknis? Let me know ya!'
    ],
    confidence: 0.92
  },

  // Basa-basi Makan & Kebutuhan Fisik
  smallTalkEating: {
    patterns: [
      /\b(udah makan belum|sudah makan belum|kamu makan apa|udah makan|makan siang|makan malam|lagi makan apa)\b/i
    ],
    isRegex: true,
    responses: [
      '⚡ Sebagai AI, aku "makan"-nya listrik dan barisan kode algoritma haha! Tapi kalau kamu belum makan, jangan lupa makan ya, kesehatanmu nomor satu! 😄',
      '🍛 Haha aku nggak butuh makan nasi, baterai dan koneksi lancar sudah cukup! Kamu sudah makan belum nih? Jaga kesehatan ya!',
      '🥗 Wah perhatian banget! Aku kenyang konsumsi data nih hehe. Kamu sendiri jangan sampai telat makan ya, apalagi kalau lagi banyak kerjaan!'
    ],
    confidence: 0.93
  },

  // Basa-basi Tidur & Istirahat
  smallTalkSleep: {
    patterns: [
      /\b(kamu tidur gak|bisa tidur gak|istirahat jam berapa|sudah tidur|udah tidur)\b/i
    ],
    isRegex: true,
    responses: [
      '🌙 Aku nggak butuh tidur nih, selalu standby 24/7 buat nemenin dan bantu kamu! Tapi kamu jangan begadang ya kalau besok ada aktivitas padat!',
      '😴 Sistem AI seperti aku aktif terus tanpa perlu tidur siang ataupun malam! Yang penting kamu yang cukup istirahat ya.',
      '✨ Aku selalu melek kapan pun kamu butuh bantuan atau teman ngobrol. Kamu sendiri sudah mau istirahat tidur?'
    ],
    confidence: 0.93
  },

  // Identitas & Eksistensi AI
  smallTalkAiNature: {
    patterns: [
      /\b(punya perasaan gak|punya hati gak|robot atau manusia|kamu manusia ya|kamu beneran ai)\b/i
    ],
    isRegex: true,
    responses: [
      '🤖 Aku adalah asisten kecerdasan buatan kreasi Muhammad Syaiful Mukmin! Meskipun aku program digital, aku dibekali pemahaman kontekstual agar bisa merespons obrolanmu dengan hangat dan manusiawi.',
      '💡 Secara fisik aku program AI komputer, tapi aku dirancang untuk mengerti nuansa bahasa, empati, dan perasaan dalam interaksi kita!',
      '🧠 Aku entitas AI yang diciptakan untuk belajar dan memahami percakapan layaknya partner diskusi yang ramah dan solutif.'
    ],
    confidence: 0.92
  },

  // Curhat & Keluhan Ringan
  shortComplaint: {
    patterns: [
      /\b(capek banget|capek hari ini|lelah banget|lelah jiwa|pusing pala|pusing banget|bad mood nih|badmood|bete banget|bete nih|kesel bat|hari ini berat|capek kerja|lelah kerja)\b/i
    ],
    isRegex: true,
    responses: [
      '🥺 Aduh, kedengarannya hari ini cukup menguras energi ya... Tarik napas dalam-dalam dulu yuk. Kamu sudah berjuang hebat hari ini. Luangkan waktu sejenak untuk rebahan dan rileks. Mau curhat atau mau obrolan santai biar agak segar?',
      '🫂 Peluk online dulu buat kamu! Kalau lagi capek atau pusing, jangan dipaksa terlalu keras ya. Istirahat sejenak, minum air hangat, atau dengarkan musik santai. Aku siap mendengarkan kalau mau cerita!',
      '💙 Hari yang berat ya? Wajar banget kalau merasa lelah setelah beraktivitas seharian. Ingat, kamu sudah berjuang hebat hari ini. Istirahat sejenak dan tenangkan pikiran dulu ya!'
    ],
    confidence: 0.93
  },

  // Teman Ngobrol & Gabut
  casualBanter: {
    patterns: [
      /\b(temenin ngobrol|temenin aku ngobrol|bisa temenin ngobrol|lagi gabut|gabut nih|bosen nih|bosan nih|ngapain ya enaknya|kesepian nih)\b/i
    ],
    isRegex: true,
    responses: [
      '🎉 Tentu saja! Aku senang banget nemenin kamu ngobrol. Mau bahas topik apa nih? Teknologi, tips produktif, cerita proyek Syaiful, atau mau tebak-tebakan santai? 😄',
      '😄 Lagi gabut ya? Tenang, kamu nggak sendiri! Kita bisa bahas banyak hal seru: mulai dari eksplorasi galeri visual, obrolan masa depan AI, atau cerita pengalaman KKN di Haruyan Dayak. Mau mulai dari mana?',
      '✨ Siap jadi partner ngobrolmu! Daripada bengong, yuk kita bahas hal menarik atau kamu mau tanya sesuatu yang bikin penasaran akhir-akhir ini?'
    ],
    confidence: 0.9
  },

  // Humor & Lelucon
  jokesHumor: {
    patterns: [
      /\b(ceritain lelucon|ada jokes|cerita lucu|bikin ketawa|jokes receh|lucu dong|lelucon|tebak-tebakan)\b/i
    ],
    isRegex: true,
    responses: [
      '😎 Kenapa programmer suka pakai kacamata hitam? Karena mereka nggak tahan lihat kode yang terlalu *bright* (terang)! Hahaha garing ya? Mau tebak-tebakan lain? 🤣',
      '💻 Kenapa komputer nggak pernah kedinginan walau musim hujan? Karena dia punya banyak *Windows* tapi selalu ada ventilasi prosesor yang hangat! Hehe 😄',
      '🚀 Tahu nggak bedanya kamu sama bug di aplikasi? Kalau bug bikin pusing, tapi kalau kamu bikin hariku jadi nggak sepi! Cieee haha 😆'
    ],
    confidence: 0.9
  },

  // Sapaan Santai & Panggilan Akrab
  casualNicknames: {
    patterns: [
      /\b(halo pul|hai pul|oi pul|pagi pul|siap bos|mantap pul|oke pul|sip pul|bro pul|sob pul)\b/i,
      /^(pul|saipul|bro|sob)$/i
    ],
    isRegex: true,
    responses: [
      '😎 Yo! Saipul di sini siap meluncur bro! Kabar baik dan selalu siap bantu. Ada yang bisa kubantu atau mau diobrolin?',
      '👋 Halo kawan! Kabar baik di sini, senang bisa ngobrol lagi sama kamu. Apa agenda seru kita hari ini?',
      '👍 Siap komandan! SaipulAI standby 100% dengan kabar prima. Ada hal menarik yang mau kita ulik?'
    ],
    confidence: 0.92
  }
};

// ===== GREETING RECOGNITION FUNCTION =====
/**
 * Recognize greeting dan simple patterns dari user input
 * @param {string} userInput - pesan dari user
 * @param {object} userProfile - profil user (untuk personalisasi)
 * @param {object} [options={}] - opsi bahasa: { targetLanguage: 'id' | 'en' | 'auto', language: 'id' | 'en' | 'id-en' | 'auto' }
 * @returns {object|null} - object dengan response atau null jika tidak ada match
 */
export function recognizeGreeting(userInput, userProfile = {}, options = {}) {
  if (!userInput || typeof userInput !== 'string') return null;

  const input = userInput.toLowerCase().trim();

  // Tentukan target bahasa (manual via settings/options, atau otomatis via deteksi teks)
  let targetLang = 'id';
  const langPref = options.targetLanguage || options.language;
  if (langPref === 'en') {
    targetLang = 'en';
  } else if (langPref === 'id') {
    targetLang = 'id';
  } else {
    // Mode auto atau id-en: deteksi dari bahasa input pengguna
    const detected = detectLanguage(userInput);
    targetLang = detected.language === 'en' ? 'en' : 'id';
  }

  // 1. Periksa Sarkasme / Ironic Complaints terlebih dahulu!
  // Jika kalimat mengandung sindiran (misal "Mantap sekali, baru dipakai sehari sudah rusak"),
  // ini BUKAN pujian ataupun sapaan melainkan komplain yang memerlukan empati.
  const sarcasm = detectSarcasmAndIrony(input);
  if (sarcasm && sarcasm.isSarcastic) {
    const sarcasticResponses = targetLang === 'en' ? [
      "Oh no, I'm so sorry to hear that! 😔 It's truly frustrating when something you just tried immediately runs into errors or breaks.\n\nCould you share more details about what happened? I'm here to help you solve it!",
      "I sincerely apologize for this unpleasant experience. 🥺 I completely understand the frustration. Please tell me what broke, and I'll do my best to assist you!"
    ] : [
      'Waduh, aku minta maaf banget mendengarnya! 😔 Memang menyebalkan sekali kalau sesuatu yang baru dipakai atau dicoba langsung bermasalah atau rusak.\n\nBoleh ceritakan lebih detail kendalanya di bagian mana? Biar aku bantu cari solusinya bareng-bareng.',
      'Aduh, mohon maaf ya atas pengalaman yang tidak menyenangkan ini. 🥺 Aku sangat mengerti kekesalanmu kalau barang atau fitur yang baru dicoba justru rusak atau error. Ceritakan detailnya, aku siap bantu carikan solusinya!',
      'Waduh, aku minta maaf dan paham betul rasa frustrasimu. 😔 Baru dipakai tapi sudah rusak tentu bikin kecewa. Boleh kasih tahu bagian mana yang bermasalah? Biar kita cari solusinya bersama.'
    ];
    return {
      text: sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)],
      language: targetLang,
      source: {
        type: 'sarcasm_handler',
        id: sarcasm.type
      },
      confidence: 0.95,
      isGreeting: false,
      isComplaint: true,
      emotion: 'empathetic'
    };
  }

  // Detect greeting berdasarkan waktu (time-aware greeting)
  const timeBasedGreeting = detectTimeBasedGreeting(input, targetLang);
  if (timeBasedGreeting) return timeBasedGreeting;

  // Check untuk simple patterns
  const simpleResponse = checkSimplePatterns(input, userProfile, targetLang);
  if (simpleResponse) return simpleResponse;

  return null;
}

/**
 * Detect greeting berdasarkan waktu
 * @param {string} input - normalized user input
 * @param {string} [targetLang='id'] - bahasa sasaran respons
 * @returns {object|null}
 */
function detectTimeBasedGreeting(input, targetLang = 'id') {
  const now = new Date();
  const hour = now.getHours();

  // Determine time period
  let timePeriod = 'general';
  if (hour >= 5 && hour < 12) timePeriod = 'morning';
  else if (hour >= 12 && hour < 17) timePeriod = 'afternoon';
  else if (hour >= 17 && hour < 21) timePeriod = 'evening';
  else if (hour >= 21 || hour < 5) timePeriod = 'night';

  // 1. Explicit or time-appropriate morning greeting
  if (/\b(selamat pagi|good morning)\b/.test(input) || (timePeriod === 'morning' && /\b(pagi|morning)\b/.test(input))) {
    const patternKey = 'morningGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input, targetLang);
  }

  // 2. Explicit or time-appropriate afternoon greeting
  if (/\b(selamat siang|good afternoon)\b/.test(input) || (timePeriod === 'afternoon' && /\b(siang|afternoon)\b/.test(input))) {
    const patternKey = 'afternoonGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input, targetLang);
  }

  // 3. Explicit or time-appropriate evening greeting
  if (/\b(selamat sore|good evening)\b/.test(input) || (timePeriod === 'evening' && /\b(sore|evening)\b/.test(input))) {
    const patternKey = 'eveningGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input, targetLang);
  }

  // 4. Explicit or time-appropriate night greeting
  if (/\b(selamat malam|good night|goodnight|selamat tidur)\b/.test(input) || (timePeriod === 'night' && /\b(malam|night|sleep|tidur)\b/.test(input))) {
    const patternKey = 'nightGreeting';
    return buildResponse(GREETING_PATTERNS[patternKey], patternKey, {}, input, targetLang);
  }

  return null;
}

/**
 * Check simple patterns dari greeting dan simple questions
 * @param {string} input - normalized user input
 * @param {object} userProfile - profil user
 * @param {string} [targetLang='id'] - bahasa sasaran
 * @returns {object|null}
 */
function checkSimplePatterns(input, userProfile = {}, targetLang = 'id') {
  // Evaluasi sentimen untuk perlindungan anti-false-positive pada compliment
  let sentimentResult = null;
  try {
    sentimentResult = analyzeSentiment(input);
  } catch (_e) { void _e; }

  const hasNegativeSentiment = sentimentResult && sentimentResult.sentiment === 'negative';
  const hasDefectWords = /\b(rusak|error|cacat|zonk|kecewa|parah|hilang|mati|gagal|hancur|bubar|down|drop|lelet)\b/i.test(input);

  // 1. Cek pola spesifik terlebih dahulu (SIMPLE_PATTERNS) agar pertanyaan/konteks khusus
  // (seperti "apa kabar", "siapa kamu", basa-basi, atau panggilan akrab) tidak tertutup sapaan umum "halo".
  const simplePatternKeys = Object.keys(SIMPLE_PATTERNS);
  for (const key of simplePatternKeys) {
    const pattern = SIMPLE_PATTERNS[key];
    if (!pattern.patterns) continue;

    // Jika ini pola pujian (compliment), jangan izinkan match jika kalimat bersentimen negatif atau mengandung kata cacat/rusak
    if (key === 'compliment' && (hasNegativeSentiment || hasDefectWords)) {
      continue;
    }

    for (const p of pattern.patterns) {
      if (pattern.isRegex || p instanceof RegExp) {
        if (p.test(input)) {
          return buildResponse(pattern, key, userProfile, input, targetLang);
        }
      } else {
        // Gunakan word boundary untuk keyword agar tidak mencocokkan substring acak
        const regex = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(input)) {
          return buildResponse(pattern, key, userProfile, input, targetLang);
        }
      }
    }
  }

  // 2. Jika tidak ada pola spesifik yang cocok, periksa sapaan umum (GREETING_PATTERNS)
  const patternKeys = Object.keys(GREETING_PATTERNS).filter(key =>
    !['morningGreeting', 'afternoonGreeting', 'eveningGreeting', 'nightGreeting'].includes(key)
  );

  for (const key of patternKeys) {
    const pattern = GREETING_PATTERNS[key];
    if (!pattern.patterns) continue;

    for (const p of pattern.patterns) {
      const isMatch = (typeof p === 'string' && (new RegExp(`\\b${p}\\b`, 'i').test(input) || input === p)) || (p instanceof RegExp && p.test(input));
      if (isMatch) {
        return buildResponse(pattern, key, userProfile, input, targetLang);
      }
    }
  }

  return null;
}

/**
 * Build response object dari pattern
 * @param {object} pattern - pattern object
 * @param {string} patternKey - key dari pattern
 * @param {object} userProfile - profil user
 * @param {string} userInput - input user
 * @param {string} [targetLang='id'] - bahasa yang diinginkan ('id' atau 'en')
 * @returns {object}
 */
function buildResponse(pattern, patternKey, userProfile = {}, userInput = '', targetLang = 'id') {
  let responseText = '';
  let idText = '';
  let enText = '';

  const idList = pattern.responses || [];
  const enList = pattern.responses_en || [];

  if (idList.length > 0) {
    idText = idList[Math.floor(Math.random() * idList.length)];
  } else if (pattern.baseResponse) {
    idText = pattern.baseResponse;
  }

  if (enList.length > 0) {
    enText = enList[Math.floor(Math.random() * enList.length)];
  } else {
    enText = idText;
  }

  responseText = targetLang === 'en' ? (enText || idText) : idText;

  // Personalisasi dengan nama user jika tersedia
  if (userProfile.name && (patternKey === 'generalGreeting' || /greeting/i.test(patternKey))) {
    responseText = responseText.replace(/Anda|kamu/g, `${userProfile.name}`);
    if (idText) idText = idText.replace(/Anda|kamu/g, `${userProfile.name}`);
    if (enText) enText = enText.replace(/\byou\b/gi, `${userProfile.name}`);
  }

  // Topic replacement for regex-based patterns
  if (responseText.includes('{topic}')) {
    const extractedEntities = extractSimpleEntity(userInput);
    const topicVal = extractedEntities.target || (targetLang === 'en' ? 'that topic' : 'hal tersebut');
    responseText = responseText.replace('{topic}', topicVal);
  }

  return {
    text: responseText,
    language: targetLang,
    alternatives: {
      english: enText || responseText,
      indonesian: idText || responseText
    },
    source: {
      type: 'greeting_recognizer',
      id: patternKey
    },
    confidence: pattern.confidence || 0.85,
    isGreeting: true,
    patternType: patternKey
  };
}

// ===== HELPER FUNCTIONS =====

/**
 * Check if input is casual/simple (bukan technical question)
 * @param {string} input - user input
 * @returns {boolean}
 */
export function isSimpleInteraction(input) {
  const technicalPatterns = /calculate|hitung|math|solve|integrate|derivative|code|program|algoritm|data|analysis|file|upload|process/i;
  return !technicalPatterns.test(input);
}

/**
 * Get appropriate response tone berdasarkan input
 * @param {string} input - user input
 * @returns {string} - tone type (friendly, formal, casual, etc)
 */
export function detectResponseTone(input) {
  if (/please|please please|tolong banget|mohon sekali/.test(input.toLowerCase())) {
    return 'formal';
  }
  if (/haha|hehe|:\)|:D|lol|😄/.test(input)) {
    return 'casual';
  }
  if (/sorry|maaf|pardon|excuse/.test(input.toLowerCase())) {
    return 'empathetic';
  }
  return 'friendly';
}

/**
 * Extract entity dari simple questions
 * @param {string} input - user input
 * @returns {object} - entities
 */
export function extractSimpleEntity(input) {
  const entities = {
    action: null,
    target: null,
    context: null
  };

  // Check untuk patterns
  const whatMatch = input.match(/apa itu\s+(\w+)/i);
  if (whatMatch) {
    entities.action = 'ask_definition';
    entities.target = whatMatch[1];
  }

  const howMatch = input.match(/bagaimana cara\s+(.+)/i);
  if (howMatch) {
    entities.action = 'ask_how_to';
    entities.target = howMatch[1];
  }

  const whyMatch = input.match(/mengapa\s+(.+)/i);
  if (whyMatch) {
    entities.action = 'ask_why';
    entities.target = whyMatch[1];
  }

  return entities;
}
