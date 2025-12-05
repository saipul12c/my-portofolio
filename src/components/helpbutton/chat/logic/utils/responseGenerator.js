// responseGenerator.js
// Fungsi utama untuk menghasilkan respons chatbot
// Terhubung ke settingan chatbot

import knowledgeBase from './knowledgeBase';
import { calculateMath } from '../../components/logic/utils/mathCalculator';

// Fungsi untuk mengambil setting dari chatbot
export function getChatbotSettings(settings) {
  // Contoh: settings = { mode: 'default', allowMath: true, ... }
  return settings || {};
}

// Fungsi utama untuk menghasilkan respons
export function generateResponse(input, settings = {}, knowledgeBase = {}) {
  const chatbotSettings = getChatbotSettings(settings);
  const question = input.trim().toLowerCase();

  // 1. Check if the question exists in the dynamic knowledge base
  for (const value of Object.values(knowledgeBase)) {
    if (typeof value === 'object' && value !== null) {
      if (value[question]) {
        return value[question];
      }
    }
  }

  // 2. Check if the question is a mathematical calculation
  if (chatbotSettings.allowMath && /\d+[+\-*/]\d+/.test(question)) {
    try {
      return calculateMath(question, chatbotSettings.calculationPrecision);
    } catch {
      return 'Sorry, I cannot calculate that question.';
    }
  }

  // 3. Fallback: Generic response
  return 'Sorry, I do not have a specific answer for that question. Please try asking something else.';
}

export default generateResponse;
