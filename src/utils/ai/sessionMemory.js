/**
 * Shared AI Session Memory
 * Menyimpan konteks topik obrolan pengguna antar halaman secara persisten selama sesi berlangsung (sessionStorage).
 * Memungkinkan AI di halaman Blog, Proyek, Skills, atau Chatbot mengenali apa yang sedang dieksplorasi user.
 */

const STORAGE_KEY = 'saipul_ai_session_memory';
const MAX_HISTORY = 5;

const isBrowser = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

/**
 * Mengambil memori sesi saat ini
 */
export const getSessionMemory = () => {
  if (!isBrowser()) {
    return { lastTopic: null, lastAgent: null, recentTopics: [], visitCount: 0 };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastTopic: null, lastAgent: null, recentTopics: [], visitCount: 0 };
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca AI Session Memory:', e);
    return { lastTopic: null, lastAgent: null, recentTopics: [], visitCount: 0 };
  }
};

/**
 * Mencatat topik yang baru saja dicari atau didiskusikan oleh user
 * @param {string} topic - Topik atau kata kunci yang dicari/ditanyakan
 * @param {string} agentName - Nama AI pengirim ('SaipulAI', 'BlogAI', 'ProjectAI', 'SoftSkillsAI', 'FAQAI')
 */
export const recordAITopic = (topic = '', agentName = 'AI') => {
  if (!isBrowser() || !topic || typeof topic !== 'string') return;
  const clean = topic.trim();
  if (clean.length < 2) return;

  try {
    const memory = getSessionMemory();
    const updatedTopics = [clean, ...memory.recentTopics.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_HISTORY);

    const newMemory = {
      lastTopic: clean,
      lastAgent: agentName,
      recentTopics: updatedTopics,
      updatedAt: new Date().toISOString(),
      visitCount: (memory.visitCount || 0) + 1
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newMemory));
  } catch (e) {
    console.warn('Gagal menyimpan AI Session Memory:', e);
  }
};

/**
 * Menghasilkan sapaan kontekstual personal jika user sebelumnya membahas topik di AI lain
 * @param {string} currentAgent - Nama AI penerima ('BlogAI', 'ProjectAI', dll)
 */
export const getCrossAgentGreeting = (currentAgent = '') => {
  const memory = getSessionMemory();
  if (!memory.lastTopic || memory.lastAgent === currentAgent) {
    return null;
  }

  const agentNames = {
    'SaipulAI': 'Live Chat SaipulAI',
    'BlogAI': 'AI Blog Assistant',
    'ProjectAI': 'Project Master AI',
    'SoftSkillsAI': 'AI Kompetensi',
    'FAQAI': 'FAQ Assistant'
  };

  const prevAgentLabel = agentNames[memory.lastAgent] || memory.lastAgent || 'halaman sebelumnya';

  return `Melanjutkan pencarianmu tentang "${memory.lastTopic}" di ${prevAgentLabel}, ini ringkasan cerdas yang saya siapkan:`;
};

/**
 * Menghapus memori sesi
 */
export const clearSessionMemory = () => {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Gagal menghapus AI Session Memory:', e);
  }
};

export default {
  getSessionMemory,
  recordAITopic,
  getCrossAgentGreeting,
  clearSessionMemory
};

