import { useMemo } from "react";

export const useTestimonialFilter = (filteredTestimonials, sortBy) => {
  const sortedTestimonials = useMemo(() => {
    if (filteredTestimonials.length === 0) return [];

    return [...filteredTestimonials].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "oldest":
          return new Date(a.date || 0) - new Date(b.date || 0);
        case "latest":
        default:
          return new Date(b.date || 0) - new Date(a.date || 0);
      }
    });
  }, [filteredTestimonials, sortBy]);

  return { sortedTestimonials };
};