// responseGenerator.js
// Fungsi utama untuk menghasilkan respons chatbot
// Terhubung ke settingan chatbot


import knowledgeBase from './knowledgeBase';
import { calculateMath } from '../../components/logic/utils/mathCalculator';
import {
  recognizeIntent,
  determineType,
  extractEntities,
  searchResponseInJson,
  sanitizeInput,
  filterOutput
} from './nlp';
import { fetchGeminiResponse } from './geminiApi';

// Fungsi untuk mengambil setting dari chatbot
export function getChatbotSettings(settings) {
  return settings || {};
}

// Intent detection sederhana
// Fungsi intent dan tipe baru dari nlp.js

// Cari jawaban di knowledgeBase dan AI-base
function findAnswer(input, knowledgeBase) {
  // Tetap gunakan pencarian lama untuk fallback
  const text = input.trim().toLowerCase();
  for (const value of Object.values(knowledgeBase)) {
    if (typeof value === 'object' && value !== null) {
      for (const key of Object.keys(value)) {
        if (key.trim().toLowerCase() === text) {
          return value[key];
        }
      }
      for (const key of Object.keys(value)) {
        if (text.includes(key.trim().toLowerCase())) {
          return value[key];
        }
      }
    }
  }
  return null;
}

// Fungsi utama untuk menghasilkan respons
export function generateResponse(input, settings = {}, knowledgeBaseObj = {}) {
  const chatbotSettings = getChatbotSettings(settings);
  const question = sanitizeInput(input.trim());
  const intent = recognizeIntent(question);
  const type = determineType(question);
  const entities = extractEntities(question);
  let context = {};
  if (settings && settings.context) context = settings.context;

  // 1. Sapaan
  if (intent === 'GREETING') {
    return filterOutput('Halo! Saya chatbot yang siap membantu Anda. Ada yang bisa saya bantu hari ini?');
  }

  // 2. Mengenali "human" atau benda hidup
  if (intent === 'HUMAN_INTERACTION' || intent === 'LIVING_BEING') {
    return filterOutput('Ya, saya adalah program AI, tapi saya dirancang untuk berinteraksi dengan manusia dan mengenali makhluk hidup secara natural. Silakan bertanya apa saja!');
  }

  // 3. Pencarian respon di file JSON (AI-base)
  const jsonResponse = searchResponseInJson(intent, entities, context);
  if (jsonResponse) {
    return filterOutput(jsonResponse);
  }

  // 4. Pertanyaan: Cari di knowledgeBase dan AI-base
  const answer = findAnswer(question, knowledgeBaseObj);
  if (type === 'question' && answer) {
    return filterOutput(answer);
  }

  // 5. Kalkulasi matematika
  if (chatbotSettings.allowMath && type === 'calculation') {
    try {
      return filterOutput(calculateMath(question, chatbotSettings.calculationPrecision));
    } catch {
      return filterOutput('Maaf, saya tidak bisa menghitung pertanyaan tersebut.');
    }
  }

  // 6. Feedback
  if (type === 'feedback') {
    return filterOutput('Terima kasih atas feedback Anda!');
  }

  // 7. Fallback: Jawaban default lebih natural
  if (answer) {
    return filterOutput(answer);
  }
  if (type === 'question') {
    // Integrasi Gemini sebagai fallback async
    // NOTE: Fungsi ini harus diubah menjadi async jika ingin respons real-time
    // Untuk integrasi sync, gunakan placeholder dan update di UI secara async
    (async () => {
      const geminiResp = await fetchGeminiResponse(question);
      if (geminiResp) {
        window.dispatchEvent(new CustomEvent('saipul_chat_gemini', { detail: { input: question, response: geminiResp } }));
      }
    })();
    return filterOutput('Maaf, saya belum punya jawaban spesifik untuk pertanyaan itu. Silakan tanya hal lain atau gunakan kata yang berbeda.');
  }
  // Fallback terakhir
  (async () => {
    const geminiResp = await fetchGeminiResponse(question);
    if (geminiResp) {
      window.dispatchEvent(new CustomEvent('saipul_chat_gemini', { detail: { input: question, response: geminiResp } }));
    }
  })();
  return filterOutput('Saya tidak yakin maksud Anda. Silakan sapa, bertanya, atau beri perintah yang jelas.');
}

export default generateResponse;
