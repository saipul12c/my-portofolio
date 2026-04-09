import { useMemo } from "react";

// === 🧠 Semantic Mapping (Synonyms & Context) ===
const SEMANTIC_MAP = {
  "pencipta": ["author", "penulis", "pembuat"],
  "penulis": ["author", "pencipta"],
  "foto": ["fotografi", "shutter", "lensa", "kamera"],
  "fotografi": ["foto", "kamera"],
  "gambar": ["ilustrasi", "visual", "desain", "foto"],
  "ai": ["kecerdasan", "artificial", "intelijen", "bot"],
  "koding": ["pemrograman", "coding", "developer", "software"],
  "proyek": ["project", "manajemen", "tugas"],
  "desain": ["design", "ui", "ux", "visual"],
  "belajar": ["tutorial", "panduan", "tips", "edukasi"]
};

export const useBlogFilters = (processedBlogs, searchTerm, selectedCategory, sortBy) => {
  const filteredBlogs = useMemo(() => {
    // 1. First, always apply category filter
    let filtered = processedBlogs.filter((post) => {
      return selectedCategory === "all" || post.category === selectedCategory;
    });

    const lowerSearch = searchTerm.toLowerCase().trim();
    
    if (!lowerSearch) {
      // Direct return for clean states, just sorting
      return sortBlogs(filtered, sortBy);
    }

    // 2. Clean punctuation and tokenize
    const searchTokens = lowerSearch.replace(/[?.,!]/g, "").split(/\s+/).filter(t => t.length > 1);
    
    // Semantic Expansion: Add synonyms to tokens
    const expandedTokens = [...searchTokens];
    searchTokens.forEach(token => {
      if (SEMANTIC_MAP[token]) {
        expandedTokens.push(...SEMANTIC_MAP[token]);
      }
    });
    
    const uniqueTokens = Array.from(new Set(expandedTokens));

    // 3. Calculate search scores for the already category-filtered blogs
    let scored = filtered.map((post) => {
      let score = 0;
      const title = post.title.toLowerCase();
      const author = post.author.toLowerCase();
      const excerpt = (post.excerpt || "").toLowerCase();
      const content = (post.content || "").toLowerCase();
      const tags = (post.tags || []).map(t => t.toLowerCase());
      const labels = (post.labels || []).map(l => l.toLowerCase());

      // 1. Check for Exact Phrase Match (Highest Priority)
      if (title.includes(lowerSearch)) score += 100;
      else if (tags.includes(lowerSearch)) score += 80;

      // 2. Keyword Scoring (Weighted)
      uniqueTokens.forEach(token => {
        if (title.includes(token)) score += 50;
        if (author.includes(token)) score += 40;
        if (tags.includes(token)) score += 30;
        if (labels.includes(token)) score += 25;
        if (excerpt.includes(token)) score += 15;
        if (content.includes(token)) score += 5;
      });

      return { ...post, searchScore: score };
    });

    // 4. Remove items with 0 score (only relevant matches)
    let searchResult = scored.filter(p => p.searchScore > 0);

    // 5. Sort by relevance (searchScore) first, then by user-selected sortBy as a tie-breaker
    return searchResult.sort((a, b) => {
      // Primary: Search Relevance
      if (b.searchScore !== a.searchScore) {
        return b.searchScore - a.searchScore;
      }
      
      // Secondary: User Selected Sort (Tie-breaker)
      // We leverage a small trick: reuse sortBlogs logic for tie-breaking
      const tieBreakerBatch = sortBlogs([a, b], sortBy);
      return tieBreakerBatch[0].id === a.id ? -1 : 1;
    });
  }, [processedBlogs, searchTerm, selectedCategory, sortBy]);

  return filteredBlogs;
};

// Helper to handle existing sorting logic
function sortBlogs(blogs, sortBy) {
  const result = [...blogs];
  switch (sortBy) {
    case "newest":
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "popular":
      result.sort((a, b) => b.views - a.views);
      break;
    case "trending":
      result.sort((a, b) => ((b.likes || 0) + (b.shares || 0)) - ((a.likes || 0) + (a.shares || 0)));
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }
  return result;
}