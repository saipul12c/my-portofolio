/**
 * Multi-turn Context Management & Memory System
 * Mengelola konteks percakapan untuk response yang lebih coherent
 */

import { INTENT_TYPES } from './advancedIntentClassifier.js';

const CONTEXT_WINDOW_SIZE = 10; // Track last 10 messages
const CONTEXT_TTL = 30 * 60 * 1000; // 30 menit context lifetime

/**
 * Context Store untuk track conversation state
 */
class ConversationContextManager {
  constructor() {
    this.messages = [];
    this.intents = [];
    this.entities = [];
    this.topics = [];
    this.unresolvedQuestions = [];
    this.userProfile = {};
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
  }

  /**
   * Add message to context dengan metadata
   */
  addMessage(message, metadata = {}) {
    const contextMsg = {
      content: message,
      timestamp: Date.now(),
      intent: metadata.intent,
      entities: metadata.entities || [],
      topics: metadata.topics || [],
      sender: metadata.sender || 'user',
      ...metadata
    };

    this.messages.push(contextMsg);
    this.lastActivityTime = Date.now();

    // Maintain window size
    if (this.messages.length > CONTEXT_WINDOW_SIZE) {
      this.messages.shift();
    }

    // Track intents
    if (metadata.intent) {
      this.intents.push(metadata.intent);
      if (this.intents.length > 5) this.intents.shift();
    }

    // Track entities
    if (metadata.entities && metadata.entities.length > 0) {
      this.entities.push(...metadata.entities);
      // Remove duplicates
      this.entities = [...new Set(this.entities)];
    }

    // Track topics
    if (metadata.topics && metadata.topics.length > 0) {
      this.topics.push(...metadata.topics);
      this.topics = [...new Set(this.topics)];
    }

    return contextMsg;
  }

  /**
   * Mark question sebagai pending (unresolved)
   */
  addUnresolvedQuestion(question, questionType = 'clarification') {
    this.unresolvedQuestions.push({
      question,
      type: questionType,
      timestamp: Date.now(),
      resolved: false
    });
  }

  /**
   * Resolve pending question
   */
  resolveQuestion(index) {
    if (this.unresolvedQuestions[index]) {
      this.unresolvedQuestions[index].resolved = true;
      this.unresolvedQuestions[index].resolvedAt = Date.now();
    }
  }

  /**
   * Get recent context untuk response generation
   */
  getRecentContext(count = 3) {
    return this.messages.slice(-count);
  }

  /**
   * Get conversation summary
   */
  getSummary() {
    return {
      messageCount: this.messages.length,
      topIntents: this.intents.slice(-3),
      mainTopics: this.topics,
      recentEntities: this.entities.slice(-5),
      unresolved: this.unresolvedQuestions.filter(q => !q.resolved),
      duration: Date.now() - this.sessionStartTime,
      lastActivity: Date.now() - this.lastActivityTime
    };
  }

  /**
   * Check if context is still valid (not expired)
   */
  isValid() {
    return (Date.now() - this.lastActivityTime) < CONTEXT_TTL;
  }

  /**
   * Reset context
   */
  clear() {
    this.messages = [];
    this.intents = [];
    this.entities = [];
    this.topics = [];
    this.unresolvedQuestions = [];
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
  }
}

/**
 * Detect if current message is follow-up ke previous
 */
export function isFollowUp(currentMessage, lastMessage, recentIntents) {
  if (!lastMessage) return false;

  const patterns = [
    /^(terus|lalu|dan|setelah itu|bagaimana dengan|apa lagi)/i,
    /^(yang itu|itu|itu apa|itu maksudnya apa)/i,
    /^(bisa tidak|bagaimana caranya|gimana caranya)/i,
    /^(tapi|namun|selain itu|lebih|kurang|berbeda)/i,
    /^(seperti|misal|contoh|misalnya)/i
  ];

  // Check if starts with follow-up markers
  for (const pattern of patterns) {
    if (pattern.test(currentMessage)) {
      return true;
    }
  }

  // Check if uses pronouns referring to previous context
  if (/^(dia|mereka|itu|itu apa|siapa|mana)/i.test(currentMessage) && recentIntents.length > 0) {
    return true;
  }

  return false;
}

/**
 * Extract topics/themes dari message
 */
export function extractTopics(message, entities = []) {
  const topics = [];
  
  const topicPatterns = {
    'mathematics': /\b(hitung|kalkulus|integral|turunan|statistik|aljabar|geometri|trigonometri|matrix|linear|derivative|integral)\b/i,
    'ai_ml': /\b(ai|machine learning|neural|deep learning|model|training|dataset|algorithm|supervised|unsupervised)\b/i,
    'data': /\b(data|analisis|prediksi|forecast|trend|pattern|korelasi|regression|classification)\b/i,
    'programming': /\b(code|coding|program|javascript|python|java|function|variable|loop|condition)\b/i,
    'file_handling': /\b(file|upload|download|export|format|csv|json|pdf|excel|document)\b/i,
    'general_knowledge': /\b(apakah|bagaimana|mengapa|sejarah|definisi|konsep|teori|prinsip)\b/i,
    'personal': /\b(portfolio|skill|pengalaman|project|sertifikat|hobi|minat|pendidikan|karir)\b/i,
  };

  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(message)) {
      topics.push(topic);
    }
  }

  // Check entity types
  if (entities.persons && entities.persons.length > 0) {
    topics.push('person_mention');
  }
  if (entities.skills && entities.skills.length > 0) {
    topics.push('skill_discussion');
  }

  return [...new Set(topics)];
}

/**
 * Build contextual prefix untuk response
 * Membantu bot acknowledge user context
 */
export function buildContextualPrefix(context) {
  // Jika follow-up question
  if (context.unresolvedQuestions.length > 0) {
    const lastQuestion = context.unresolvedQuestions[context.unresolvedQuestions.length - 1];
    if (!lastQuestion.resolved) {
      return `Tentang pertanyaanmu sebelumnya mengenai "${lastQuestion.question.slice(0, 40)}...": `;
    }
  }

  // Jika continuing topic
  if (context.topics.length > 0) {
    return `Melanjutkan dari topik ${context.topics[context.topics.length - 1]}: `;
  }

  // Jika reply ke specific entity mention
  if (context.entities.length > 0) {
    return `Mengenai ${context.entities[context.entities.length - 1]}: `;
  }

  return '';
}

/**
 * Detect potential confusion dan suggest clarification
 */
export function detectPotentialConfusion(message, context) {
  const issues = [];

  // Ambiguous pronouns tanpa clear antecedent
  if (/^(itu|dia|mereka|ini)\b/i.test(message) && context.messages.length < 2) {
    issues.push({
      type: 'ambiguous_pronoun',
      severity: 'medium',
      suggestion: 'Bot harus tanya: "Apa yang kamu maksud dengan itu?"'
    });
  }

  // Contradictory statements
  const recent = context.getRecentContext(2);
  if (recent.length >= 2) {
    const isNegative = /\b(tidak|bukan|gak|nggak|nope)\b/i.test(message);
    const previousWasPositive = /\b(ya|iya|yes|benar|ok|setuju)\b/i.test(recent[0].content);
    
    if (isNegative && previousWasPositive) {
      issues.push({
        type: 'contradiction',
        severity: 'high',
        suggestion: 'Ada kontradiksi - bot harus clarify'
      });
    }
  }

  // Incomplete information
  if (/\b(di mana|kapan|siapa|berapa)\b/i.test(message) && message.length < 20) {
    issues.push({
      type: 'incomplete_query',
      severity: 'medium',
      suggestion: 'Query terlalu singkat, bot bisa tanya detail lebih'
    });
  }

  return issues;
}

/**
 * Check jika user memerlukan help/clarification
 */
export function checkIfNeedsHelp(message) {
  const helpPattern = /\b(bisa|bisakah|apakah bisa|bagaimana|gimana|tolong|help|bantuan|stuck|error|tidak bisa|gagal)\b/i;
  
  if (!helpPattern.test(message)) {
    return false;
  }

  // Analyze what they might need help with
  const helpTypes = {
    'technical': /\b(error|bug|crash|tidak bisa|gagal|tidak jalan|not working)\b/i,
    'understanding': /\b(bagaimana|gimana|cara|caranya|apa maksudnya|maksud|artinya)\b/i,
    'capability': /\b(bisa|apakah bisa|boleh|mungkin tidak)\b/i,
    'process': /\b(langkah|tahap|proses|tutorial|guide|panduan)\b/i
  };

  const needs = [];
  for (const [type, pattern] of Object.entries(helpTypes)) {
    if (pattern.test(message)) {
      needs.push(type);
    }
  }

  return {
    needsHelp: true,
    helpTypes: needs,
    confidence: message.includes('?') ? 0.9 : 0.7
  };
}

export { ConversationContextManager };
