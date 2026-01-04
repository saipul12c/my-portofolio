/**
 * Enhanced Knowledge Base with NLU Integration
 * Knowledge base yang diperkaya dengan:
 * - Semantic understanding (makna, relasi, aturan)
 * - Entity linking
 * - Relationship inference
 * - Context awareness
 * 
 * Bukan hanya daftar Q&A, tapi sistem yang memahami
 * struktur pengetahuan dan hubungan antar konsep
 */

import { getSynonyms as _getSynonyms, getLemma as _getLemma, getWordMeaning as _getWordMeaning } from './lexicalDatabase';
import { getExpressionVariations as _getExpressionVariations } from './languageCorpus';
import { analyzeNLU, extractEntities } from './nluDataset';

/**
 * KNOWLEDGE STRUCTURE
 * Struktur pengetahuan yang kaya dengan semantic relations
 */
export const EnhancedKnowledgeBase = {
  /**
   * KNOWLEDGE NODES
   * Setiap konsep adalah sebuah node dengan properties dan relations
   */
  nodes: {
    // AI Concepts
    'ai': {
      id: 'node_ai_01',
      name: 'Artificial Intelligence',
      aliases: ['ai', 'kecerdasan buatan', 'intelligence'],
      definition: 'Simulasi dari proses intelejen manusia yang dilakukan oleh mesin atau sistem komputer',
      category: 'technology',
      subcategories: ['machine learning', 'deep learning', 'nlp', 'computer vision'],
      properties: {
        isAbstract: true,
        domain: 'technology',
        complexity: 'advanced',
        learningLevel: 'intermediate'
      },
      expandedDescription: `
Kecerdasan Buatan (AI) adalah cabang ilmu komputer yang berfokus pada pengembangan sistem 
yang dapat melakukan tugas-tugas yang biasanya memerlukan kecerdasan manusia. 

Karakteristik utama AI:
1. Pembelajaran dari data (machine learning)
2. Pengambilan keputusan otomatis
3. Pemecahan masalah
4. Pemahaman bahasa alami
5. Pengenalan pola

Aplikasi AI modern mencakup chatbot, rekomendasi produk, diagnosis medis, dan banyak lagi.
      `,
      relatedConcepts: ['machine_learning', 'neural_networks', 'nlp', 'computer_vision']
    },

    'machine_learning': {
      id: 'node_ml_01',
      name: 'Machine Learning',
      aliases: ['ml', 'pembelajaran mesin', 'learning'],
      definition: 'Teknik dalam AI yang memungkinkan sistem belajar dari data tanpa diprogram secara eksplisit',
      category: 'technology',
      properties: {
        isAbstract: true,
        domain: 'technology',
        complexity: 'advanced',
        learningLevel: 'intermediate'
      },
      expandedDescription: `
Machine Learning adalah teknik yang memungkinkan komputer untuk belajar dari data.

Tiga jenis utama Machine Learning:
1. Supervised Learning: Belajar dari data berlabel
2. Unsupervised Learning: Menemukan pola dalam data tanpa label
3. Reinforcement Learning: Belajar melalui reward dan punishment

Algoritma populer: Decision Trees, Random Forest, SVM, Neural Networks, dsb.
      `,
      relatedConcepts: ['ai', 'neural_networks', 'data', 'algorithm'],
      prerequisites: ['algebra', 'statistics']
    },

    'neural_networks': {
      id: 'node_nn_01',
      name: 'Neural Networks',
      aliases: ['nn', 'jaringan saraf', 'neural network'],
      definition: 'Struktur komputasi yang terinspirasi dari jaringan saraf biologis',
      category: 'technology',
      properties: {
        isAbstract: true,
        domain: 'technology',
        complexity: 'advanced',
        learningLevel: 'advanced'
      },
      expandedDescription: `
Jaringan Saraf (Neural Networks) adalah model komputasi yang meniru struktur otak manusia.

Komponen utama:
- Nodes (neuron): Unit pemrosesan dasar
- Edges (koneksi): Menghubungkan neurons dengan weights
- Layers: Organized structure dari neurons
- Activation functions: Memperkenalkan non-linearitas

Deep Learning menggunakan neural networks dengan banyak layers (deep architecture).
      `,
      relatedConcepts: ['ai', 'machine_learning', 'deep_learning'],
      prerequisites: ['linear_algebra', 'calculus']
    },

    'nlp': {
      id: 'node_nlp_01',
      name: 'Natural Language Processing',
      aliases: ['nlp', 'pemrosesan bahasa alami', 'language processing'],
      definition: 'Cabang AI yang fokus pada pemahaman dan pemrosesan bahasa manusia',
      category: 'technology',
      properties: {
        isAbstract: true,
        domain: 'technology',
        complexity: 'advanced',
        learningLevel: 'intermediate'
      },
      expandedDescription: `
Natural Language Processing (NLP) memungkinkan mesin memahami, menginterpretasi, dan menghasilkan bahasa manusia.

Tugas-tugas NLP utama:
1. Tokenization: Memecah teks menjadi token
2. POS Tagging: Mengidentifikasi bagian speech
3. Named Entity Recognition: Mengidentifikasi entities
4. Sentiment Analysis: Mendeteksi sentimen
5. Machine Translation: Terjemahan otomatis
6. Question Answering: Menjawab pertanyaan

Tools populer: NLTK, spaCy, Hugging Face Transformers, dsb.
      `,
      relatedConcepts: ['ai', 'machine_learning', 'corpus_linguistics'],
      applications: ['chatbot', 'sentiment_analysis', 'translation', 'question_answering']
    }
  },

  /**
   * RELATIONSHIPS
   * Menghubungkan berbagai nodes dengan tipe relasi yang berbeda
   */
  relationships: [
    {
      source: 'ai',
      target: 'machine_learning',
      type: 'has_subcategory',
      weight: 0.95,
      description: 'Machine Learning adalah bagian penting dari AI'
    },
    {
      source: 'machine_learning',
      target: 'neural_networks',
      type: 'has_subcategory',
      weight: 0.9,
      description: 'Neural Networks adalah teknik machine learning yang populer'
    },
    {
      source: 'ai',
      target: 'nlp',
      type: 'has_subcategory',
      weight: 0.95,
      description: 'NLP adalah aplikasi penting dari AI'
    },
    {
      source: 'nlp',
      target: 'machine_learning',
      type: 'uses_technique',
      weight: 0.9,
      description: 'NLP menggunakan teknik machine learning'
    },
    {
      source: 'neural_networks',
      target: 'machine_learning',
      type: 'is_method_of',
      weight: 0.95,
      description: 'Neural networks adalah salah satu metode dalam machine learning'
    }
  ],

  /**
   * RULES
   * Aturan inferensi untuk membantu menjawab pertanyaan
   */
  rules: [
    {
      id: 'rule_001',
      condition: 'ask about (X) AND X has_subcategory Y',
      conclusion: 'mention Y as subcategories',
      priority: 0.8
    },
    {
      id: 'rule_002',
      condition: 'ask how (X) works AND X uses_technique Y',
      conclusion: 'explain Y as mechanism',
      priority: 0.9
    },
    {
      id: 'rule_003',
      condition: 'ask when to use (X) AND X has_application Y',
      conclusion: 'list Y as use cases',
      priority: 0.85
    },
    {
      id: 'rule_004',
      condition: 'ask prerequisite of (X) AND X has_prerequisite Y',
      conclusion: 'recommend learning Y first',
      priority: 0.9
    }
  ],

  /**
   * CONTEXT STORE
   * Menyimpan konteks pembelajaran pengguna
   */
  contextStore: {
    userLearningPath: [],
    mentionedConcepts: [],
    askedQuestions: [],
    understandingLevel: 'beginner' // beginner, intermediate, advanced
  }
};

/**
 * Find knowledge node by query
 * @param {string} query - query string
 * @param {object} nluResult - hasil NLU analysis (optional parameter untuk future use)
 * @returns {object} knowledge node yang paling relevan
 */
export function findKnowledgeNode(query) {
  const normalized = query.toLowerCase().trim();
  const candidates = [];

  // Find nodes yang match dengan query
  for (const [nodeKey, nodeData] of Object.entries(EnhancedKnowledgeBase.nodes)) {
    let score = 0;

    // Exact match pada nama
    if (nodeData.name.toLowerCase() === normalized) {
      score += 1.0;
    }

    // Match pada aliases
    if (nodeData.aliases.some(alias => normalized.includes(alias) || alias.includes(normalized.split(/\s+/)[0]))) {
      score += 0.8;
    }

    // Partial word match
    const queryWords = normalized.split(/\s+/).filter(w => w.length > 2);
    const nodeWords = nodeData.name.toLowerCase().split(/\s+/);
    const commonWords = queryWords.filter(qw => nodeWords.some(nw => nw.includes(qw) || qw.includes(nw)));
    if (commonWords.length > 0) {
      score += 0.5 * (commonWords.length / queryWords.length);
    }

    if (score > 0) {
      candidates.push({
        nodeId: nodeKey,
        ...nodeData,
        matchScore: score
      });
    }
  }

  // Sort by score dan return yang terbaik
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  return candidates.length > 0 ? candidates[0] : null;
}

/**
 * Get related concepts dari sebuah node
 * @param {string} nodeId - ID dari node
 * @param {number} maxDepth - kedalaman pencarian
 * @returns {array} related concepts
 */
export function getRelatedConcepts(nodeId, maxDepth = 2) {
  const node = EnhancedKnowledgeBase.nodes[nodeId];
  if (!node) return [];

  const related = [];
  const visited = new Set([nodeId]);
  const queue = [{ nodeId, depth: 0 }];

  while (queue.length > 0 && visited.size < 10) {
    const { nodeId: currentId, depth } = queue.shift();

    if (depth > maxDepth) continue;

    // Find relationships
    const relationships = EnhancedKnowledgeBase.relationships.filter(
      r => r.source === currentId || r.target === currentId
    );

    relationships.forEach(rel => {
      const targetId = rel.source === currentId ? rel.target : rel.source;

      if (!visited.has(targetId)) {
        visited.add(targetId);
        related.push({
          nodeId: targetId,
          relationType: rel.type,
          description: rel.description,
          weight: rel.weight,
          depth: depth + 1,
          ...EnhancedKnowledgeBase.nodes[targetId]
        });

        if (depth < maxDepth) {
          queue.push({ nodeId: targetId, depth: depth + 1 });
        }
      }
    });
  }

  return related.sort((a, b) => b.weight - a.weight);
}

/**
 * Generate comprehensive answer menggunakan knowledge structure
 * @param {string} question - pertanyaan dari user
 * @param {object} nluResult - hasil NLU analysis
 * @returns {object} comprehensive answer
 */
export function generateComprehensiveAnswer(question, nluResult = null) {
  // Analyze pertanyaan
  const nlu = nluResult || analyzeNLU(question);
  const entities = extractEntities(question);

  // Find relevant knowledge nodes
  const relatedNodes = [];
  for (const entity of entities) {
    const node = findKnowledgeNode(entity.value, nlu);
    if (node) {
      relatedNodes.push(node);
    }
  }

  // Jika tidak ada entity specific, gunakan intent untuk mencari
  if (relatedNodes.length === 0) {
    const queryWords = question.split(/\s+/).slice(2, 5).join(' '); // Take keywords
    const node = findKnowledgeNode(queryWords, nlu);
    if (node) relatedNodes.push(node);
  }

  const primaryNode = relatedNodes[0];

  if (!primaryNode) {
    return {
      success: false,
      answer: 'Maaf, saya tidak menemukan informasi tentang topik tersebut di knowledge base saya.',
      source: { type: 'not_found' },
      confidence: 0
    };
  }

  // Build answer berdasarkan question type
  const answerParts = [];

  // Definisi dasar
  answerParts.push(`**${primaryNode.name}** adalah ${primaryNode.definition}`);

  // Deskripsi expanded
  if (primaryNode.expandedDescription) {
    answerParts.push(primaryNode.expandedDescription.trim());
  }

  // Related concepts
  const related = getRelatedConcepts(primaryNode.id);
  if (related.length > 0) {
    answerParts.push('\n📚 **Konsep terkait:**');
    related.slice(0, 3).forEach(rel => {
      answerParts.push(`- ${rel.name}: ${rel.definition}`);
    });
  }

  // Applications
  if (primaryNode.applications) {
    answerParts.push('\n💡 **Aplikasi:**');
    primaryNode.applications.forEach(app => {
      answerParts.push(`- ${app}`);
    });
  }

  // Prerequisites
  if (primaryNode.prerequisites) {
    answerParts.push('\n📖 **Prasyarat pengetahuan:**');
    primaryNode.prerequisites.forEach(prereq => {
      answerParts.push(`- ${prereq}`);
    });
  }

  return {
    success: true,
    answer: answerParts.join('\n'),
    source: {
      type: 'knowledge_base',
      nodeId: primaryNode.id,
      nodeName: primaryNode.name
    },
    relatedNodes: related.slice(0, 3),
    confidence: Math.min(0.95, 0.7 + (related.length * 0.1)),
    timestamp: new Date().toISOString()
  };
}

/**
 * Validate dan enrich knowledge dengan semantic checking
 * @param {string} statement - pernyataan yang akan divalidasi
 * @returns {object} validation result
 */
export function validateKnowledgeStatement(statement) {
  const entities = extractEntities(statement);
  const validations = {
    statement: statement,
    semanticIntegrity: true,
    entityValidation: [],
    relationshipValidation: [],
    issues: []
  };

  // Validate setiap entity
  entities.forEach(entity => {
    const node = findKnowledgeNode(entity.value);
    validations.entityValidation.push({
      entity: entity.value,
      found: !!node,
      nodeId: node ? node.id : null
    });

    if (!node) {
      validations.semanticIntegrity = false;
      validations.issues.push(`Entity "${entity.value}" tidak ditemukan dalam knowledge base`);
    }
  });

  return validations;
}

/**
 * Expand knowledge dengan information baru
 * @param {string} newKnowledge - pengetahuan baru yang akan ditambahkan
 * @returns {object} result
 */
export function expandKnowledgeBase(newKnowledge) {
  // Parse dan validate new knowledge
  const validation = validateKnowledgeStatement(newKnowledge);

  if (!validation.semanticIntegrity) {
    return {
      success: false,
      message: 'Knowledge baru mengandung entities yang tidak valid',
      issues: validation.issues
    };
  }

  // Store new knowledge (dalam implementasi real, ini akan disimpan ke database)
  return {
    success: true,
    message: 'Knowledge berhasil ditambahkan',
    timestamp: new Date().toISOString()
  };
}

/**
 * Infer new knowledge dari relationships yang ada
 * @param {string} sourceNodeId - node sumber untuk inferensi
 * @returns {array} inferred knowledge
 */
export function inferNewKnowledge(sourceNodeId) {
  const node = EnhancedKnowledgeBase.nodes[sourceNodeId];
  if (!node) return [];

  const inferences = [];
  const relationships = EnhancedKnowledgeBase.relationships.filter(
    r => r.source === sourceNodeId || r.target === sourceNodeId
  );

  // Simple transitive inference
  relationships.forEach(rel => {
    const targetId = rel.source === sourceNodeId ? rel.target : rel.source;
    const targetRelations = EnhancedKnowledgeBase.relationships.filter(
      r => (r.source === targetId || r.target === targetId) && 
          (r.source !== sourceNodeId && r.target !== sourceNodeId)
    );

    targetRelations.forEach(tRel => {
      const transitiveTarget = tRel.source === targetId ? tRel.target : tRel.source;
      inferences.push({
        source: sourceNodeId,
        intermediate: targetId,
        target: transitiveTarget,
        inference: `${sourceNodeId} → ${targetId} → ${transitiveTarget}`,
        confidence: rel.weight * tRel.weight
      });
    });
  });

  return inferences;
}

export default {
  EnhancedKnowledgeBase,
  findKnowledgeNode,
  getRelatedConcepts,
  generateComprehensiveAnswer,
  validateKnowledgeStatement,
  expandKnowledgeBase,
  inferNewKnowledge
};
