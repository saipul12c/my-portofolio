import { useCallback } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import useHobbies from "./hooks/useHobbies";
import HobbyHeader from "./components/hobbies/HobbyHeader";
import HobbyFilter from "./components/hobbies/HobbyFilter";
import HobbyGrid from "./components/hobbies/HobbyGrid";
import BackgroundGlow from "./components/shared/BackgroundGlow";

export default function Hobbies() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    displayedHobbies,
    totalHobbies,
    filteredCount,
    hasMore,
    loadMore
  } = useHobbies();

  const handleResetFilter = useCallback(() => {
    setSelectedCategory("Semua");
    setSearchQuery("");
  }, [setSelectedCategory, setSearchQuery]);

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-20 md:py-24 bg-gradient-to-b from-[var(--color-gray-900)] via-[#111726] to-[var(--color-gray-900)] text-white overflow-hidden scroll-smooth">
        <BackgroundGlow />
        
        <HobbyHeader />
        
        <HobbyFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalHobbies={totalHobbies}
          filteredCount={filteredCount}
        />

        <HobbyGrid
          displayedHobbies={displayedHobbies}
          totalCount={filteredCount}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onResetFilter={handleResetFilter}
        />
      </main>
    </LazyMotion>
  );
}