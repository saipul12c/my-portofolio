/**
 * NLP Components Testing & Troubleshooting Guide
 * 
 * Gunakan file ini untuk:
 * 1. Test semua NLP components
 * 2. Debug issues
 * 3. Verify functionality
 * 4. Performance benchmarking
 */

import * as NLP from './nlpIndex';

/**
 * TESTING SUITE
 * Run these functions untuk test semua components
 */

// ===== TEST 1: LEXICAL DATABASE =====
export function testLexicalDatabase() {
  console.log('\n=== TESTING LEXICAL DATABASE ===\n');
  
  const testWords = ['baik', 'sedih', 'kecerdasan buatan', 'halo'];
  
  testWords.forEach(word => {
    console.log(`\nAnalyzing: "${word}"`);
    const analysis = NLP.analyzeLexical(word, 'id');
    console.log('- Lemma:', analysis.lemma);
    console.log('- Meaning:', analysis.meaning);
    console.log('- Category:', analysis.category);
    console.log('- Synonyms:', analysis.synonyms);
    console.log('- Confidence:', analysis.confidence);
  });
}

// ===== TEST 2: LANGUAGE CORPUS =====
export function testLanguageCorpus() {
  console.log('\n=== TESTING LANGUAGE CORPUS ===\n');
  
  const testSentences = [
    'Apa itu machine learning?',
    'Saya sedang belajar AI',
    'Terima kasih untuk bantuan Anda'
  ];
  
  testSentences.forEach(sentence => {
    console.log(`\nAnalyzing: "${sentence}"`);
    const similar = NLP.findSimilarSentences(sentence, 0.5);
    console.log('- Similar sentences found:', similar.length);
    if (similar.length > 0) {
      console.log('- Top match:', similar[0].text);
      console.log('- Similarity score:', similar[0].similarity);
    }
  });
  
  // Test expression variations
  console.log('\n\nExpression Variations:');
  const variations = NLP.getExpressionVariations('Minta bantuan');
  console.log('- Ways to ask for help:', variations);
}

// ===== TEST 3: NLU DATASET =====
export function testNLUDataset() {
  console.log('\n=== TESTING NLU DATASET ===\n');
  
  const testMessages = [
    'Apa itu artificial intelligence?',
    'Saya tidak mengerti',
    'Terima kasih banyak!',
    'Bisa bantu saya?'
  ];
  
  testMessages.forEach(msg => {
    console.log(`\nAnalyzing: "${msg}"`);
    
    // Test intent
    const intent = NLP.classifyIntent(msg);
    console.log('- Intent:', intent.intent, `(confidence: ${intent.confidence.toFixed(2)})`);
    
    // Test entities
    const entities = NLP.extractEntities(msg);
    console.log('- Entities found:', entities.length);
    entities.forEach(e => {
      console.log(`  • ${e.type}: ${e.value}`);
    });
    
    // Test sentence type
    const type = NLP.classifySentenceType(msg);
    console.log('- Sentence type:', type.sentenceType, `(confidence: ${type.confidence.toFixed(2)})`);
  });
}

// ===== TEST 4: NLU PROCESSING =====
export function testNLUProcessing() {
  console.log('\n=== TESTING NLU PROCESSING ===\n');
  
  const testMessage = 'Bagaimana cara belajar machine learning dari Jakarta?';
  
  // Test quick NLU
  console.log('Testing Quick NLU:');
  console.time('Quick NLU');
  const quick = NLP.quickNLU(testMessage);
  console.timeEnd('Quick NLU');
  console.log('- Confidence:', quick.integrated.confidence.toFixed(2));
  console.log('- Quality score:', quick.integrated.qualityScore);
  console.log('- Ready to respond:', quick.integrated.readyToRespond);
  console.log('- Recommendations:', quick.integrated.recommendations.length);
  
  // Test comprehensive NLU
  console.log('\n\nTesting Comprehensive NLU:');
  console.time('Comprehensive NLU');
  const comprehensive = NLP.comprehensiveNLU(testMessage);
  console.timeEnd('Comprehensive NLU');
  console.log('- Confidence:', comprehensive.integrated.confidence.toFixed(2));
  console.log('- Quality score:', comprehensive.integrated.qualityScore);
  console.log('- Key concepts:', comprehensive.components.lexical.keyConcepts.map(c => c.word));
  console.log('- Similar corpus sentences:', comprehensive.components.corpus.similarSentences.length);
}

// ===== TEST 5: ENHANCED KNOWLEDGE BASE =====
export function testEnhancedKnowledgeBase() {
  console.log('\n=== TESTING ENHANCED KNOWLEDGE BASE ===\n');
  
  const topics = ['AI', 'machine learning', 'neural networks'];
  
  topics.forEach(topic => {
    console.log(`\nFinding knowledge about: "${topic}"`);
    
    // Find node
    const node = NLP.findKnowledgeNode(topic);
    if (node) {
      console.log('- Node found:', node.name);
      console.log('- Definition:', node.definition.substring(0, 80) + '...');
      
      // Get related concepts
      const related = NLP.getRelatedConcepts(node.id, 1);
      console.log('- Related concepts:', related.length);
      related.slice(0, 3).forEach(r => {
        console.log(`  • ${r.name} (weight: ${r.weight})`);
      });
    } else {
      console.log('- Node not found');
    }
  });
}

// ===== TEST 6: FULL PIPELINE =====
export function testFullPipeline() {
  console.log('\n=== TESTING FULL PIPELINE ===\n');
  
  const questions = [
    'Apa itu machine learning?',
    'Bagaimana cara belajar AI?',
    'Jelaskan tentang neural networks'
  ];
  
  questions.forEach(question => {
    console.log(`\n--- Processing: "${question}" ---`);
    
    // Quick NLU
    const nlu = NLP.quickNLU(question);
    console.log('Intent:', nlu.components.nlu.intent.intent);
    console.log('Entities:', nlu.components.nlu.entities.map(e => `${e.type}:${e.value}`).join(', '));
    
    // Try to find answer
    try {
      const answer = NLP.generateComprehensiveAnswer(question);
      if (answer.success) {
        console.log('Answer found! (confidence:', answer.confidence.toFixed(2) + ')');
        console.log('First 100 chars:', answer.answer.substring(0, 100) + '...');
      } else {
        console.log('No answer found in KB');
      }
    } catch (e) {
      console.log('Error generating answer:', e.message);
    }
  });
}

/**
 * PERFORMANCE BENCHMARKING
 */

export function benchmarkNLPComponents() {
  console.log('\n=== PERFORMANCE BENCHMARKING ===\n');
  
  const testMessages = [
    'Apa itu AI?',
    'Bagaimana cara belajar machine learning?',
    'Jelaskan neural networks dengan detail',
    'Saya ingin belajar programming dari nol'
  ];
  
  // Benchmark Quick NLU
  console.log('Quick NLU Benchmark:');
  const quickTimes = [];
  testMessages.forEach(msg => {
    const start = performance.now();
    NLP.quickNLU(msg);
    const time = performance.now() - start;
    quickTimes.push(time);
  });
  console.log(`- Average: ${(quickTimes.reduce((a,b)=>a+b)/quickTimes.length).toFixed(2)}ms`);
  console.log(`- Min: ${Math.min(...quickTimes).toFixed(2)}ms`);
  console.log(`- Max: ${Math.max(...quickTimes).toFixed(2)}ms`);
  
  // Benchmark Comprehensive NLU
  console.log('\nComprehensive NLU Benchmark:');
  const compTimes = [];
  testMessages.forEach(msg => {
    const start = performance.now();
    NLP.comprehensiveNLU(msg);
    const time = performance.now() - start;
    compTimes.push(time);
  });
  console.log(`- Average: ${(compTimes.reduce((a,b)=>a+b)/compTimes.length).toFixed(2)}ms`);
  console.log(`- Min: ${Math.min(...compTimes).toFixed(2)}ms`);
  console.log(`- Max: ${Math.max(...compTimes).toFixed(2)}ms`);
  
  // Benchmark Knowledge Lookup
  console.log('\nKnowledge Lookup Benchmark:');
  const kbTimes = [];
  ['AI', 'Machine Learning', 'Neural Networks'].forEach(topic => {
    const start = performance.now();
    NLP.findKnowledgeNode(topic);
    NLP.getRelatedConcepts(NLP.findKnowledgeNode(topic).id, 1);
    const time = performance.now() - start;
    kbTimes.push(time);
  });
  console.log(`- Average: ${(kbTimes.reduce((a,b)=>a+b)/kbTimes.length).toFixed(2)}ms`);
  console.log(`- Min: ${Math.min(...kbTimes).toFixed(2)}ms`);
  console.log(`- Max: ${Math.max(...kbTimes).toFixed(2)}ms`);
}

/**
 * DEBUGGING UTILITIES
 */

export function debugMessage(message) {
  console.log('\n=== DEBUG MESSAGE ===\n');
  console.log(`Input: "${message}"\n`);
  
  // Full analysis
  const analysis = NLP.analyzeNLU(message);
  
  // Print all components
  console.log('INTENT ANALYSIS:');
  console.log('- Intent:', analysis.intent.intent);
  console.log('- Confidence:', analysis.intent.confidence.toFixed(2));
  console.log('- All scores:', analysis.intent.allScores);
  
  console.log('\nENTITY EXTRACTION:');
  analysis.entities.forEach(e => {
    console.log(`- ${e.type}: "${e.value}" (confidence: ${e.confidence})`);
  });
  
  console.log('\nSENTENCE TYPE:');
  console.log('- Type:', analysis.sentenceType.sentenceType);
  console.log('- Confidence:', analysis.sentenceType.confidence.toFixed(2));
  console.log('- Description:', analysis.sentenceType.description);
  
  console.log('\nANALYSIS SUMMARY:');
  console.log('- Is question:', analysis.analysis.isQuestion);
  console.log('- Is statement:', analysis.analysis.isStatement);
  console.log('- Is command:', analysis.analysis.isCommand);
  console.log('- Confidence:', analysis.analysis.confidence.toFixed(2));
  console.log('- Complexity:', analysis.analysis.complexity);
  
  // Try to get answer
  console.log('\nKNOWLEDGE BASE LOOKUP:');
  try {
    const answer = NLP.generateComprehensiveAnswer(message);
    if (answer.success) {
      console.log('- Answer found');
      console.log('- Source:', answer.source);
      console.log('- Confidence:', answer.confidence.toFixed(2));
      console.log('- Related concepts:', answer.relatedNodes.length);
    } else {
      console.log('- No answer found');
    }
  } catch (e) {
    console.log('- Error:', e.message);
  }
}

/**
 * RUN ALL TESTS
 */

export function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        NLP COMPONENTS TESTING SUITE                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  try {
    testLexicalDatabase();
    testLanguageCorpus();
    testNLUDataset();
    testNLUProcessing();
    testEnhancedKnowledgeBase();
    testFullPipeline();
    benchmarkNLPComponents();
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        ✅ ALL TESTS COMPLETED SUCCESSFULLY                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    console.error(error.stack);
  }
}

/**
 * QUICK TEST
 * Jalankan test minimal untuk quick verification
 */

export function quickTest() {
  console.log('Running quick test...\n');
  
  // Test 1: Word analysis
  const wordAnalysis = NLP.analyzeLexical('belajar', 'id');
  console.log('✓ Word analysis:', wordAnalysis.word);
  
  // Test 2: Intent detection
  const intent = NLP.classifyIntent('Apa itu AI?');
  console.log('✓ Intent detection:', intent.intent);
  
  // Test 3: Entity extraction
  const entities = NLP.extractEntities('Saya dari Jakarta');
  console.log('✓ Entity extraction:', entities.length, 'entities found');
  
  // Test 4: Quick NLU
  const nlu = NLP.quickNLU('Bagaimana cara belajar?');
  console.log('✓ Quick NLU: confidence', nlu.integrated.confidence.toFixed(2));
  
  // Test 5: Knowledge lookup
  const node = NLP.findKnowledgeNode('AI');
  console.log('✓ Knowledge lookup:', node ? node.name : 'not found');
  
  console.log('\n✅ Quick test passed!\n');
}

/**
 * USAGE EXAMPLES
 */

export function showExamples() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   NLP COMPONENTS EXAMPLES                    ║
╚═══════════════════════════════════════════════════════════════╝

1. ANALYZE WORD:
   const analysis = NLP.analyzeLexical('belajar', 'id');
   console.log(analysis.synonyms);  // Get synonyms

2. DETECT INTENT:
   const intent = NLP.classifyIntent('Apa itu AI?');
   console.log(intent.intent);      // 'ask_question'

3. EXTRACT ENTITIES:
   const entities = NLP.extractEntities('Saya dari Jakarta');
   // Returns: [{ type: 'LOCATION', value: 'Jakarta' }]

4. QUICK NLU ANALYSIS:
   const nlu = NLP.quickNLU(userMessage);
   if (nlu.integrated.readyToRespond) {
     // Confidence is high enough to respond
   }

5. GET KNOWLEDGE:
   const answer = NLP.generateComprehensiveAnswer('Apa itu ML?');
   console.log(answer.answer);      // Full explanation
   console.log(answer.relatedNodes);// Related concepts

6. FIND RELATED CONCEPTS:
   const node = NLP.findKnowledgeNode('machine learning');
   const related = NLP.getRelatedConcepts(node.id);
   // Get all related topics

7. FIND SIMILAR SENTENCES:
   const similar = NLP.findSimilarSentences('Apa itu AI?');
   // Find pattern in corpus

8. GET EXPRESSION VARIATIONS:
   const variations = NLP.getExpressionVariations('Minta bantuan');
   // Different ways to ask for help

═══════════════════════════════════════════════════════════════════
  `);
}

// Export for testing
export default {
  testLexicalDatabase,
  testLanguageCorpus,
  testNLUDataset,
  testNLUProcessing,
  testEnhancedKnowledgeBase,
  testFullPipeline,
  benchmarkNLPComponents,
  debugMessage,
  runAllTests,
  quickTest,
  showExamples
};

// Can be called from browser console:
// import * as testing from './nlpTesting';
// testing.quickTest();         // Run quick test
// testing.debugMessage("your message");  // Debug specific message
// testing.runAllTests();       // Run all tests
