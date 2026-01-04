/**
 * Animation Mapper Helper
 * Maps input types and contexts to appropriate loading animations
 */

export const ANIMATION_MAP = {
  // By input type
  image: 'photo',
  video: 'video',
  document: 'shimmer',
  file: 'shimmer',
  math: 'dna',
  analysis: 'wave',
  search: 'spotlight',
  process: 'bouncing',
  thinking: 'thinking',
  default: 'random',

  // By keywords
  photo: 'photo',
  picture: 'photo',
  gambar: 'photo',
  foto: 'photo',

  film: 'video',
  video_clip: 'video',

  analyze: 'shimmer',
  analisis: 'shimmer',
  analyz: 'shimmer',
  proses: 'wave',
  calculate: 'dna',
  compute: 'dna',
  hitung: 'dna',

  find: 'spotlight',
  cari: 'spotlight',

  think: 'thinking',
  pikir: 'thinking',
};

/**
 * Determine animation type based on input text
 * @param {string} input - User input text
 * @param {string} inputType - Classification type (if available)
 * @returns {string} Animation type name
 */
export function getAnimationByInput(input = '', inputType = '') {
  // First check by explicit inputType
  if (inputType && ANIMATION_MAP[inputType.toLowerCase()]) {
    return ANIMATION_MAP[inputType.toLowerCase()];
  }

  // Check by keywords in input
  const lowerInput = input.toLowerCase();
  for (const [keyword, animation] of Object.entries(ANIMATION_MAP)) {
    if (keyword !== 'default' && lowerInput.includes(keyword)) {
      return animation;
    }
  }

  // Return random for variety
  return 'random';
}

/**
 * Get animation with loading variants based on context
 * @param {string} animationType - Animation type
 * @param {string} context - Context of the request
 * @returns {Object} Animation config with variants
 */
export function getAnimationConfig(animationType = 'random', context = '') {
  const variants = getLoadingVariants(context);
  
  return {
    loadingAnimation: animationType,
    loadingVariants: variants,
  };
}

/**
 * Get appropriate loading label variants based on context
 * @param {string} context - Context of processing
 * @returns {Array<string>} Array of loading messages
 */
export function getLoadingVariants(context = '') {
  const contextLower = context.toLowerCase();

  // Photo/Image processing
  if (contextLower.includes('photo') || contextLower.includes('image') || contextLower.includes('gambar')) {
    return [
      'Menganalisis foto...',
      'Mendeteksi obyek...',
      'Memproses gambar...',
      'Mengekstrak informasi...',
    ];
  }

  // Video processing
  if (contextLower.includes('video') || contextLower.includes('film')) {
    return [
      'Memproses video...',
      'Menganalisis frame...',
      'Mendeteksi gerakan...',
      'Mengekstrak metadata...',
    ];
  }

  // Data analysis
  if (contextLower.includes('analisis') || contextLower.includes('analyze') || contextLower.includes('data')) {
    return [
      'Menganalisis data...',
      'Menghitung statistik...',
      'Memproses dataset...',
      'Mengidentifikasi pola...',
    ];
  }

  // Mathematical/Computing
  if (contextLower.includes('hitung') || contextLower.includes('compute') || contextLower.includes('math')) {
    return [
      'Menghitung...',
      'Memproses rumus...',
      'Melakukan komputasi...',
      'Menganalisis nilai...',
    ];
  }

  // Search/Find
  if (contextLower.includes('cari') || contextLower.includes('search') || contextLower.includes('find')) {
    return [
      'Mencari informasi...',
      'Memindai database...',
      'Mengumpulkan hasil...',
      'Memfilter data...',
    ];
  }

  // Process/Generate
  if (contextLower.includes('proses') || contextLower.includes('process') || contextLower.includes('generate')) {
    return [
      'Memproses permintaan...',
      'Menghasilkan konten...',
      'Merangkai respons...',
      'Mempersiapkan jawaban...',
    ];
  }

  // Default variants
  return [
    'Memikirkan...',
    'Memproses...',
    'Sedang diproses...',
    'Menganalisis...',
  ];
}

/**
 * Get all animation types available
 */
export const ANIMATION_TYPES = [
  'thinking',
  'wave',
  'photo',
  'video',
  'pulse',
  'shimmer',
  'orbit',
  'bouncing',
  'spotlight',
  'dna',
];

/**
 * Get random animation type
 */
export function getRandomAnimation() {
  return ANIMATION_TYPES[Math.floor(Math.random() * ANIMATION_TYPES.length)];
}

export default {
  ANIMATION_MAP,
  ANIMATION_TYPES,
  getAnimationByInput,
  getAnimationConfig,
  getLoadingVariants,
  getRandomAnimation,
};
