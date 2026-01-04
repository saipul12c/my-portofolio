import { useMemo } from "react";

export const useBlogFilters = (processedBlogs, searchTerm, selectedCategory, sortBy) => {
  const filteredBlogs = useMemo(() => {
    let filtered = processedBlogs.filter((post) => {
      const lower = searchTerm.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(lower) ||
        post.author.toLowerCase().includes(lower) ||
        post.excerpt.toLowerCase().includes(lower) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
        post.labels?.some((label) => label.toLowerCase().includes(lower));

      const matchesCategory = 
        selectedCategory === "all" || 
        post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "trending":
        filtered.sort((a, b) => ((b.likes || 0) + (b.shares || 0)) - ((a.likes || 0) + (a.shares || 0)));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [processedBlogs, searchTerm, selectedCategory, sortBy]);

  return filteredBlogs;
};