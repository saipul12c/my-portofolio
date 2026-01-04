/**
 * Smart Knowledge Base Query Engine
 * Mengoptimalkan pencarian dan retrieval informasi dari knowledge base
 * dengan semantic similarity, fuzzy matching, dan caching
 */

import { analyzeLexical, getSynonyms, getLemma, normalizeWord } from './lexicalDatabase';
import { findSimilarSentences } from './languageCorpus';

const QUERY_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 menit cache

/**
 * Advanced search di knowledge base dengan multiple strategies
 */
export function smartKBQuery(userQuery, knowledgeBase, options = {}) {
  const {
    searchDepth = 'comprehensive', // 'quick', 'standard', 'comprehensive'
    threshold = 0.5,
    maxResults = 5,
    useCache = true,
    returnMetadata = true
  } = options;

  // Check cache
  const cacheKey = `${userQuery}:${searchDepth}`;
  if (useCache && QUERY_CACHE.has(cacheKey)) {
    const cached = QUERY_CACHE.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.result;
    }
  }

  let results = [];

  // Strategy 1: Exact Keyword Match (fastest)
  const exactMatches = searchExactMatch(userQuery, knowledgeBase);
  results.push(...exactMatches.map(r => ({ ...r, matchType: 'exact', score: 1.0 })));

  // Strategy 2: Synonym-based Search
  const synonymMatches = searchWithSynonyms(userQuery, knowledgeBase);
  results.push(...synonymMatches);

  // Strategy 3: Semantic/Fuzzy Search (slower but comprehensive)
  if (searchDepth !== 'quick') {
    const fuzzyMatches = searchFuzzyMatch(userQuery, knowledgeBase, threshold);
    results.push(...fuzzyMatches);
  }

  // Strategy 4: Related Concepts (contextual)
  if (searchDepth === 'comprehensive') {
    const relatedMatches = searchRelatedConcepts(userQuery, knowledgeBase);
    results.push(...relatedMatches);
  }

  // Deduplicate dan sort
  const deduplicated = deduplicateResults(results);
  const sorted = deduplicated.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const final = sorted.slice(0, maxResults);

  // Cache result
  if (useCache) {
    QUERY_CACHE.set(cacheKey, {
      result: final,
      timestamp: Date.now()
    });
  }

  return final.map(r => returnMetadata ? r : r.answer);
}

/**
 * Search with exact keyword matching
 */
function searchExactMatch(query, knowledgeBase) {
  const results = [];
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  // Search di AI knowledge base
  if (knowledgeBase.AI && typeof knowledgeBase.AI === 'object') {
    for (const [question, answer] of Object.entries(knowledgeBase.AI)) {
      const questionWords = question.toLowerCase().split(/\s+/);
      const matchCount = queryWords.filter(qw => 
        questionWords.some(qw2 => qw2.includes(qw) || qw.includes(qw2))
      ).length;

      if (matchCount >= Math.min(2, queryWords.length * 0.6)) {
        results.push({
          source: 'ai_kb',
          question,
          answer,
          relevanceScore: 0.9 + (matchCount / queryWords.length) * 0.1,
          matchedWords: matchCount,
          matchType: 'exact'
        });
      }
    }
  }

  // Search di uploaded files
  if (knowledgeBase.uploadedData && Array.isArray(knowledgeBase.uploadedData)) {
    for (const fileData of knowledgeBase.uploadedData) {
      if (Array.isArray(fileData.sentences)) {
        for (const sentence of fileData.sentences) {
          const sentenceWords = sentence.toLowerCase().split(/\s+/);
          const matchCount = queryWords.filter(qw =>
            sentenceWords.some(sw => sw.includes(qw) || qw.includes(sw))
          ).length;

          if (matchCount >= queryWords.length * 0.5) {
            results.push({
              source: 'uploaded_file',
              fileName: fileData.fileName,
              answer: sentence,
              relevanceScore: 0.85 + (matchCount / queryWords.length) * 0.15,
              matchedWords: matchCount,
              matchType: 'exact'
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Search menggunakan synonyms dan variations
 */
function searchWithSynonyms(query, knowledgeBase) {
  const results = [];
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  // Expand query dengan synonyms
  const expandedKeywords = new Set();
  expandedKeywords.add(query.toLowerCase());

  for (const keyword of keywords) {
    expandedKeywords.add(keyword);
    const synonyms = getSynonyms(keyword);
    synonyms.forEach(s => expandedKeywords.add(s));
    
    // Add lemmatized form
    const lemma = getLemma(keyword);
    if (lemma) expandedKeywords.add(lemma);
  }

  // Search dengan expanded keywords
  if (knowledgeBase.AI && typeof knowledgeBase.AI === 'object') {
    for (const [question, answer] of Object.entries(knowledgeBase.AI)) {
      const questionLower = question.toLowerCase();
      let maxScore = 0;

      for (const keyword of expandedKeywords) {
        if (questionLower.includes(keyword)) {
          maxScore = Math.max(maxScore, 0.8);
        }
      }

      if (maxScore > 0) {
        results.push({
          source: 'ai_kb_synonym',
          question,
          answer,
          relevanceScore: maxScore,
          matchType: 'synonym'
        });
      }
    }
  }

  return results;
}

/**
 * Fuzzy/semantic search untuk match yang less strict
 */
function searchFuzzyMatch(query, knowledgeBase, threshold = 0.5) {
  const results = [];
  const queryNormalized = normalizeWord(query.toLowerCase());

  // Calculate similarity score untuk setiap entry
  if (knowledgeBase.AI && typeof knowledgeBase.AI === 'object') {
    for (const [question, answer] of Object.entries(knowledgeBase.AI)) {
      const similarity = calculateSimilarity(queryNormalized, question.toLowerCase());
      
      if (similarity >= threshold) {
        results.push({
          source: 'ai_kb_fuzzy',
          question,
          answer,
          relevanceScore: similarity,
          matchType: 'fuzzy'
        });
      }
    }
  }

  return results;
}

/**
 * Search untuk related concepts (lebih context-aware)
 */
function searchRelatedConcepts(query, knowledgeBase) {
  const results = [];
  
  // Map topics ke knowledge items
  const topicMap = {
    'ai': ['machine learning', 'neural network', 'deep learning'],
    'machine learning': ['supervised', 'unsupervised', 'algorithm'],
    'data': ['analysis', 'visualization', 'statistics'],
    'programming': ['code', 'function', 'variable', 'class'],
    'mathematics': ['calculus', 'algebra', 'statistics', 'probability']
  };

  const lowerQuery = query.toLowerCase();
  for (const [topic, relatedTerms] of Object.entries(topicMap)) {
    if (lowerQuery.includes(topic)) {
      // Cari knowledge items tentang related terms
      if (knowledgeBase.AI && typeof knowledgeBase.AI === 'object') {
        for (const [question, answer] of Object.entries(knowledgeBase.AI)) {
          if (relatedTerms.some(term => question.toLowerCase().includes(term))) {
            results.push({
              source: 'related_concept',
              question,
              answer,
              relevanceScore: 0.65,
              relatedTo: topic,
              matchType: 'conceptual'
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Calculate similarity antara 2 strings (0-1)
 * Using Levenshtein distance approach
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance calculation
 */
function levenshteinDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Deduplicate results berdasarkan answer similarity
 */
function deduplicateResults(results) {
  const seen = new Set();
  const deduplicated = [];

  for (const result of results) {
    const key = result.answer.slice(0, 50); // Use first 50 chars as key
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(result);
    }
  }

  return deduplicated;
}

/**
 * Augment response dengan related information
 */
export function augmentResponseWithContext(response, knowledgeBase, userQuery) {
  const related = smartKBQuery(userQuery, knowledgeBase, {
    searchDepth: 'standard',
    maxResults: 3
  });

  if (related.length > 1) {
    const suggestions = related.slice(1).map(r => r.question).join('\n• ');
    
    response.suggestedQuestions = [
      `Kamu juga tertarik dengan:\n• ${suggestions}`,
      `Topik terkait yang mungkin kamu mau tahu:\n• ${suggestions}`
    ];
  }

  return response;
}

/**
 * Clear cache (optional)
 */
export function clearKBCache() {
  QUERY_CACHE.clear();
}

/**
 * Get cache stats (for monitoring)
 */
export function getCacheStats() {
  return {
    itemsInCache: QUERY_CACHE.size,
    cacheSize: JSON.stringify([...QUERY_CACHE]).length,
    ttl: CACHE_TTL
  };
}

/**
 * Batch search untuk multiple queries
 */
export function batchKBQuery(queries, knowledgeBase, options = {}) {
  return queries.map(query => ({
    query,
    results: smartKBQuery(query, knowledgeBase, options)
  }));
}
