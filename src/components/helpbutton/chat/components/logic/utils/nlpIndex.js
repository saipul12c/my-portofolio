/**
 * NLP Components Index
 * Central export point untuk semua NLP modules
 * 
 * Import dari file ini untuk kemudahan:
 * import { quickNLU, findKnowledgeNode, analyzeLexical } from './nlpIndex';
 */

// ===== LEXICAL DATABASE IMPORTS & EXPORTS =====
export {
  LexicalDatabase,
  getLemma,
  getSynonyms,
  getWordMeaning,
  getWordVariants,
  normalizeWord,
  analyzeLexical
} from './lexicalDatabase';

// ===== LANGUAGE CORPUS IMPORTS & EXPORTS =====
export {
  LanguageCorpus,
  getCorpusExamples,
  getCorpusStatistics,
  findSimilarSentences,
  getConversationPattern,
  getExpressionVariations,
  getContextResponse,
  analyzeSentenceInCorpus
} from './languageCorpus';

// ===== NLU DATASET IMPORTS & EXPORTS =====
export {
  NLUDataset,
  classifyIntent,
  extractEntities,
  classifySentenceType,
  analyzeNLU,
  getSuggestedResponse
} from './nluDataset';

// ===== NLU PROCESSING IMPORTS & EXPORTS =====
export {
  processNLU,
  comprehensiveNLU,
  quickNLU,
  extractCorpusInsights,
  enrichEntityData,
  extractSemanticRelations
} from './nluProcessing';

// ===== ENHANCED KNOWLEDGE BASE IMPORTS & EXPORTS =====
export {
  EnhancedKnowledgeBase,
  findKnowledgeNode,
  getRelatedConcepts,
  generateComprehensiveAnswer,
  validateKnowledgeStatement,
  expandKnowledgeBase,
  inferNewKnowledge
} from './enhancedKnowledgeBase';

// ===== RESPONSE GENERATOR IMPORTS & EXPORTS =====
export {
  enrichResponseWithLexical,
  getResponseAlternatives,
  adjustResponseConfidence,
  addRelatedConceptsSuggestions
} from './responseGenerator';

// ===== INTERNAL IMPORTS FOR NLP BUNDLE =====
import { quickNLU, comprehensiveNLU } from './nluProcessing';
import { generateComprehensiveAnswer } from './enhancedKnowledgeBase';
import { 
  analyzeLexical, 
  getLemma, 
  getSynonyms, 
  normalizeWord, 
  getWordMeaning, 
  getWordVariants 
} from './lexicalDatabase';
import { 
  findSimilarSentences, 
  getExpressionVariations, 
  getContextResponse, 
  getCorpusExamples, 
  getCorpusStatistics 
} from './languageCorpus';
import {
  classifyIntent,
  extractEntities,
  classifySentenceType,
  analyzeNLU,
  getSuggestedResponse
} from './nluDataset';
import {
  processNLU,
  extractCorpusInsights,
  enrichEntityData,
  extractSemanticRelations
} from './nluProcessing';
import {
  findKnowledgeNode,
  getRelatedConcepts,
  validateKnowledgeStatement,
  expandKnowledgeBase,
  inferNewKnowledge
} from './enhancedKnowledgeBase';
import {
  enrichResponseWithLexical,
  getResponseAlternatives,
  adjustResponseConfidence,
  addRelatedConceptsSuggestions
} from './responseGenerator';

/**
 * CONVENIENCE BUNDLE
 * Untuk use case yang paling umum
 */
export const NLPBundle = {
  // Quick analysis
  quickAnalysis: (msg) => {
    return quickNLU(msg);
  },
  
  // Comprehensive analysis
  comprehensiveAnalysis: (msg) => {
    return comprehensiveNLU(msg);
  },
  
  // Knowledge lookup
  getAnswer: (question) => {
    return generateComprehensiveAnswer(question);
  },
  
  // Word analysis
  analyzeWord: (word, lang = 'id') => {
    return analyzeLexical(word, lang);
  },
  
  // Find similar sentences
  findSimilar: (sentence, threshold = 0.6) => {
    return findSimilarSentences(sentence, threshold);
  },
  
  // Full NLU
  fullAnalysis: (msg) => {
    return analyzeNLU(msg);
  }
};

/**
 * EXAMPLE USAGE
 * 
 * Option 1: Import specific functions
 * import { quickNLU, findKnowledgeNode } from './nlpIndex';
 * 
 * Option 2: Import bundle
 * import { NLPBundle } from './nlpIndex';
 * const analysis = NLPBundle.quickAnalysis(msg);
 * 
 * Option 3: Import everything
 * import * as NLP from './nlpIndex';
 * const nlu = NLP.quickNLU(msg);
 */

export default {
  // Lexical
  analyzeLexical,
  getLemma,
  getSynonyms,
  normalizeWord,
  getWordMeaning,
  getWordVariants,
  
  // Corpus
  findSimilarSentences,
  getExpressionVariations,
  getContextResponse,
  getCorpusExamples,
  getCorpusStatistics,
  
  // NLU Dataset
  classifyIntent,
  extractEntities,
  classifySentenceType,
  analyzeNLU,
  getSuggestedResponse,
  
  // NLU Processing
  quickNLU,
  comprehensiveNLU,
  processNLU,
  enrichEntityData,
  extractSemanticRelations,
  extractCorpusInsights,
  
  // Knowledge Base
  findKnowledgeNode,
  getRelatedConcepts,
  generateComprehensiveAnswer,
  validateKnowledgeStatement,
  expandKnowledgeBase,
  inferNewKnowledge,
  
  // Response Helpers
  enrichResponseWithLexical,
  getResponseAlternatives,
  adjustResponseConfidence,
  addRelatedConceptsSuggestions,
  
  // Bundle
  NLPBundle
};
