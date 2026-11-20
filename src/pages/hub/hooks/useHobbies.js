import { useState, useMemo, useCallback } from "react";
import hobbiesData from "../../../data/hub/hobbiesData.json";
import { generateSlug, addRandomLabels, sortHobbiesByLabel, filterHobbies } from "../utils/hobbyUtils";

// Number of items to render initially and per batch to prevent DOM overload
const PAGE_SIZE = 9;

export default function useHobbies() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Process hobbies data once with useMemo for performance
  const processedHobbies = useMemo(() => {
    const withSlugs = hobbiesData.map(hobby => ({
      ...hobby,
      slug: hobby.slug || generateSlug(hobby.title)
    }));
    
    const withLabels = addRandomLabels(withSlugs);
    return sortHobbiesByLabel(withLabels);
  }, []);

  // Get unique categories once
  const categories = useMemo(() => {
    return ["Semua", ...new Set(processedHobbies.map((h) => h.category))];
  }, [processedHobbies]);

  // Filter hobbies by selected category and search query
  const filteredHobbies = useMemo(() => {
    return filterHobbies(processedHobbies, {
      category: selectedCategory,
      searchTerm: searchQuery
    });
  }, [processedHobbies, selectedCategory, searchQuery]);

  // Progressive slicing to ensure fast initial render and low DOM weight in the long term
  const displayedHobbies = useMemo(() => {
    return filteredHobbies.slice(0, visibleCount);
  }, [filteredHobbies, visibleCount]);

  const hasMore = visibleCount < filteredHobbies.length;

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  return {
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    categories,
    filteredHobbies,
    displayedHobbies,
    totalHobbies: processedHobbies.length,
    filteredCount: filteredHobbies.length,
    displayedCount: displayedHobbies.length,
    hasMore,
    loadMore
  };
}