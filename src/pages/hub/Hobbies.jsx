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
    categories,
    filteredHobbies
  } = useHobbies();

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen flex flex-col items-center justify-start px-6 py-24 bg-gradient-to-b from-[#0d111a] via-[#111726] to-[#0d111a] text-white overflow-hidden scroll-smooth">
        <BackgroundGlow />
        
        <HobbyHeader />
        
        <HobbyFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <HobbyGrid filteredHobbies={filteredHobbies} />
      </main>
    </LazyMotion>
  );
}