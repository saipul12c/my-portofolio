// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Generate URL-friendly slug from title
 */
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

// =============================================================================
// DATA PROCESSING UTILITIES
// =============================================================================

/**
 * Add random labels to hobbies (35% chance)
 */
export const addRandomLabels = (hobbies) => {
  const labelTypes = ["🔥 Hot", "🆕 Baru", "⭐ Rekomendasi"];
  
  return hobbies.map((hobby) => {
    const hasLabel = Math.random() < 0.35;
    return hasLabel
      ? { 
          ...hobby, 
          label: labelTypes[Math.floor(Math.random() * labelTypes.length)],
          labelType: hasLabel ? labelTypes[Math.floor(Math.random() * labelTypes.length)].split(' ')[1] : null
        }
      : { 
          ...hobby, 
          label: null,
          labelType: null
        };
  });
};

/**
 * Sort hobbies - those with labels appear first
 */
export const sortHobbiesByLabel = (hobbies) => {
  return [...hobbies].sort((a, b) => {
    if (a.label && !b.label) return -1;
    if (!a.label && b.label) return 1;
    return 0;
  });
};

/**
 * Filter hobbies by multiple criteria
 */
export const filterHobbies = (hobbies, filters) => {
  return hobbies.filter(hobby => {
    // Category filter
    if (filters.category && filters.category !== 'Semua' && hobby.category !== filters.category) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty && hobby.metadata.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Status filter
    if (filters.status !== undefined && hobby.metadata.isActive !== filters.status) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = hobby.title.toLowerCase().includes(searchLower);
      const matchesDesc = hobby.desc.toLowerCase().includes(searchLower);
      const matchesCategory = hobby.category.toLowerCase().includes(searchLower);
      
      if (!matchesTitle && !matchesDesc && !matchesCategory) {
        return false;
      }
    }
    
    return true;
  });
};

// =============================================================================
// STYLE UTILITIES
// =============================================================================

/**
 * Get CSS classes for label based on type
 */
export const getLabelStyles = (label) => {
  if (!label) return '';
  
  if (label.includes("Hot")) {
    return "bg-red-500/30 text-red-200 border-red-400/40";
  } else if (label.includes("Baru")) {
    return "bg-green-500/30 text-green-200 border-green-400/40";
  } else {
    return "bg-amber-500/30 text-amber-200 border-amber-400/40";
  }
};

/**
 * Get CSS classes for difficulty badge
 */
export const getDifficultyStyles = (difficulty) => {
  switch (difficulty) {
    case 'Pemula':
      return 'bg-green-500/20 text-green-300 border-green-400/40';
    case 'Menengah':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40';
    case 'Advanced':
      return 'bg-red-500/20 text-red-300 border-red-400/40';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-400/40';
  }
};

/**
 * Get CSS classes for priority badge
 */
export const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500/20 text-red-300 border-red-400/40';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40';
    case 'Low':
      return 'bg-green-500/20 text-green-300 border-green-400/40';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-400/40';
  }
};

/**
 * Get color scheme for category
 */
export const getCategoryColor = (category) => {
  const colorMap = {
    'Kreatif': 'from-teal-400/30 to-sky-500/10',
    'Pembelajaran': 'from-violet-400/30 to-fuchsia-500/10',
    'Relaksasi': 'from-amber-300/30 to-orange-300/10',
    'Eksplorasi': 'from-emerald-300/30 to-lime-400/10',
    'Teknologi': 'from-sky-300/30 to-indigo-400/10',
    'Sosial': 'from-red-400/30 to-pink-400/10',
    'Produktivitas': 'from-amber-400/30 to-emerald-300/10'
  };
  
  return colorMap[category] || 'from-gray-400/30 to-gray-500/10';
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate hobby data structure
 */
export const validateHobbyData = (hobby) => {
  const requiredFields = ['id', 'title', 'desc', 'category', 'icon'];
  const missingFields = requiredFields.filter(field => !hobby[field]);
  
  if (missingFields.length > 0) {
    console.warn(`Hobby data missing required fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

/**
 * Sanitize hobby data for display
 */
export const sanitizeHobbyData = (hobby) => {
  return {
    ...hobby,
    title: hobby.title?.trim() || 'Untitled Hobby',
    desc: hobby.desc?.trim() || 'No description available',
    category: hobby.category || 'Uncategorized',
    metadata: {
      difficulty: hobby.metadata?.difficulty || 'Unknown',
      timeRequired: hobby.metadata?.timeRequired || 'Flexible',
      tools: hobby.metadata?.tools || [],
      isActive: hobby.metadata?.isActive !== false,
      priority: hobby.metadata?.priority || 'Medium',
      ...hobby.metadata
    },
    stats: {
      completion: Math.max(0, Math.min(100, hobby.stats?.completion || 0)),
      rating: Math.max(0, Math.min(5, hobby.stats?.rating || 0)),
      hoursPerWeek: Math.max(0, hobby.stats?.hoursPerWeek || 0),
      ...hobby.stats
    }
  };
};

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format time for display
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'Flexible';
  
  // Handle common time formats
  if (timeString.includes('/')) {
    return timeString; // Already formatted like "2-3 jam/sesi"
  }
  
  return timeString;
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

/**
 * Format rating for display
 */
export const formatRating = (value) => {
  return value % 1 === 0 ? `${value}.0` : value.toFixed(1);
};

// =============================================================================
// EXPORT ALL UTILITIES
// =============================================================================

export default {
  // String utilities
  generateSlug,
  capitalizeWords,
  
  // Data processing
  addRandomLabels,
  sortHobbiesByLabel,
  filterHobbies,
  
  // Style utilities
  getLabelStyles,
  getDifficultyStyles,
  getPriorityStyles,
  getCategoryColor,
  
  // Validation
  validateHobbyData,
  sanitizeHobbyData,
  
  // Formatting
  formatTime,
  formatPercentage,
  formatRating
};