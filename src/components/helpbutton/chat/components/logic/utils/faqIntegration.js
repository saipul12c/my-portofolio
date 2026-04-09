/**
 * faqIntegration.js
 * Bridge for sharing FAQ data and logic with Live Chat system.
 */
import faqsData from "../../../../faq/data/faqs.json";
import commitmentsData from "../../../../komit/data/commitments.json";

const faqCache = new Map();

/**
 * Extract meaningful keywords from text
 */
export const extractKeywords = (text) => {
  if (!text) return [];
  const words = (text || '').toLowerCase().split(/[^a-z0-9]+/)
    .filter(word => word.length > 2)
    .filter(word => !['yang', 'dengan', 'dalam', 'untuk', 'dari', 'pada', 'ke', 'di'].includes(word));
  
  return [...new Set(words)]; 
};

/**
 * Preprocess FAQ data with keywords and categories for efficient matching
 */
export const preprocessFAQData = () => {
  if (faqCache.has('preprocessed')) return faqCache.get('preprocessed');

  const processed = faqsData.map((item, index) => {
    const question = item.question.toLowerCase();
    const answer = item.answer.toLowerCase();
    
    const questionKeywords = extractKeywords(question);
    const answerKeywords = extractKeywords(answer);
    
    const categories = [];
    const lowerText = `${question} ${answer}`;
    if (lowerText.includes('teknologi')) categories.push('teknologi');
    if (lowerText.includes('pendidikan')) categories.push('pendidikan');
    if (lowerText.includes('kreatif')) categories.push('kreativitas');
    if (lowerText.includes('fotografi')) categories.push('fotografi');
    if (lowerText.includes('digital')) categories.push('digital');
    if (lowerText.includes('guru')) categories.push('guru');
    if (lowerText.includes('belajar')) categories.push('belajar');
    if (lowerText.includes('komitmen') || lowerText.includes('janji')) categories.push('komitmen');
    
    return {
      ...item,
      id: `faq-${index}`,
      questionKeywords,
      answerKeywords,
      categories,
      questionLength: question.length,
      answerLength: answer.length,
      fullText: `${question} ${answer}`,
      source: 'faq'
    };
  });

  // Normalize and add commitments data
  if (commitmentsData && commitmentsData.commitments) {
    commitmentsData.commitments.forEach((item, index) => {
      const question = item.title.toLowerCase();
      const pointsText = item.key_points ? item.key_points.join(", ") : "";
      const answer = `${item.desc} ${pointsText}`.toLowerCase();
      
      const questionKeywords = extractKeywords(question);
      const answerKeywords = extractKeywords(answer);

      const categories = ['komitmen'];
      const lowerText = `${question} ${answer}`;
      if (lowerText.includes('teknologi')) categories.push('teknologi');
      if (lowerText.includes('pendidikan')) categories.push('pendidikan');
      if (lowerText.includes('kreatif')) categories.push('kreativitas');
      
      processed.push({
        question: item.title,
        answer: item.desc,
        id: `komit-${item.id || index}`,
        questionKeywords,
        answerKeywords,
        categories,
        questionLength: question.length,
        answerLength: answer.length,
        fullText: `${question} ${answer}`,
        source: 'commitment'
      });
    });
  }
  
  faqCache.set('preprocessed', processed);
  return processed;
};

/**
 * Advanced scoring logic for matching query with FAQ items
 */
export const calculateMatchScore = (query, faqItem) => {
  const q = query.toLowerCase().trim();
  let score = 0;
  
  // Exact matches bonus
  if (faqItem.question.toLowerCase().includes(q)) score += 150;
  if (faqItem.answer.toLowerCase().includes(q)) score += 100;
  
  const queryWords = q.split(/[^a-z0-9]+/).filter(word => word.length > 2);
  
  queryWords.forEach(word => {
    // Keyword matches
    if (faqItem.questionKeywords.includes(word)) score += 40;
    if (faqItem.answerKeywords.includes(word)) score += 20;
    
    // Partial matches
    if (word.length > 4) {
      const partial = word.substring(0, Math.floor(word.length * 0.7));
      faqItem.questionKeywords.forEach(kw => { if (kw.includes(partial)) score += 15; });
      faqItem.answerKeywords.forEach(kw => { if (kw.includes(partial)) score += 10; });
    }
  });

  // Synonym handling
  const synonymGroups = {
    'belajar': ['pelajari', 'studi', 'pembelajaran', 'mengajar'],
    'guru': ['pendidik', 'pengajar', 'dosen'],
    'teknologi': ['digital', 'komputer', 'software', 'aplikasi'],
    'kreatif': ['inovasi', 'kreativitas', 'imajinasi'],
    'fotografi': ['foto', 'kamera', 'visual', 'gambar']
  };

  Object.entries(synonymGroups).forEach(([mainWord, synonyms]) => {
    if (faqItem.categories.includes(mainWord)) {
      synonyms.forEach(synonym => {
        if (queryWords.includes(synonym)) score += 25;
        if (q.includes(synonym)) score += 30;
      });
    }
  });
  
  // Educational context bonus
  const educationTerms = ['pendidikan', 'sekolah', 'kelas', 'murid', 'siswa', 'kurikulum'];
  educationTerms.forEach(term => {
    if (q.includes(term) && faqItem.categories.includes('pendidikan')) score += 35;
  });
  
  // Brief query bonus for concise answers
  if (queryWords.length <= 3 && faqItem.answerLength < 500) score += 20;
  
  return score;
};

/**
 * Find best matching FAQ item for a given query
 */
export const findBestFAQMatch = (query) => {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return null;
  
  const processedFAQs = preprocessFAQData();
  
  // First pass: direct matches
  const directMatches = processedFAQs.filter(item => 
    item.question.toLowerCase().includes(q) || 
    item.answer.toLowerCase().includes(q)
  );
  
  if (directMatches.length > 0) {
    const bestDirect = directMatches.reduce((best, current) => 
      current.answerLength < best.answerLength ? current : best
    );
    return { item: bestDirect, score: 200, matchType: 'direct' };
  }
  
  // Second pass: advanced scoring
  const scoredFAQs = processedFAQs.map(item => ({
    item,
    score: calculateMatchScore(q, item)
  })).filter(result => result.score > 45); 
  
  if (scoredFAQs.length === 0) return null;
  
  scoredFAQs.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.answerLength - b.item.answerLength;
  });
  
  return { ...scoredFAQs[0], matchType: 'semantic' };
};
