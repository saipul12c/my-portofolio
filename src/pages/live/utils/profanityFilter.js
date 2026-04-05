/**
 * Utilitas Filter Kata Kasar (Profanity Filter)
 * Membantu menjaga komunitas tetap bersih dan profesional.
 */

const BAD_WORDS = [
  // Indonesian (Extreme)
  'anjing', 'babi', 'monyet', 'bangsat', 'memek', 'kontol', 'jembut', 'asu', 'perek', 'lonte', 'bajingan', 'pelacur',
  'setan', 'iblis', 'pukimak', 'bodoh', 'tolol', 'goblok', 'idiot', 'gila', 'sinting', 'sarap',
  // English (Extreme)
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'bastard', 'piss', 'nigger', 'faggot'
];

/**
 * Memeriksa apakah teks mengandung kata-kata terlarang.
 * @param {string} text 
 * @returns {boolean}
 */
export const containsProfanity = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return BAD_WORDS.some(word => lowerText.includes(word));
};

/**
 * Membersihkan teks dengan mengganti kata terlarang dengan asteris (*).
 * @param {string} text 
 * @returns {string}
 */
export const cleanProfanity = (text) => {
  if (!text) return text;
  let cleaned = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleaned = cleaned.replace(regex, '*'.repeat(word.length));
  });
  return cleaned;
};
