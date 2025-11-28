import { useState, useMemo } from "react";
import hobbiesData from "../../../data/hub/hobbiesData.json";
import { generateSlug, addRandomLabels, sortHobbiesByLabel } from "../utils/hobbyUtils";

export default function useHobbies() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Process hobbies data with useMemo for performance
  const processedHobbies = useMemo(() => {
    const withSlugs = hobbiesData.map(hobby => ({
      ...hobby,
      slug: generateSlug(hobby.title)
    }));
    
    const withLabels = addRandomLabels(withSlugs);
    
    return sortHobbiesByLabel(withLabels);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return ["Semua", ...new Set(processedHobbies.map((h) => h.category))];
  }, [processedHobbies]);

  // Filter hobbies by selected category
  const filteredHobbies = useMemo(() => {
    if (selectedCategory === "Semua") {
      return processedHobbies;
    }
    return processedHobbies.filter((hobby) => hobby.category === selectedCategory);
  }, [selectedCategory, processedHobbies]);

  return {
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredHobbies,
    totalHobbies: processedHobbies.length,
    filteredCount: filteredHobbies.length
  };
}