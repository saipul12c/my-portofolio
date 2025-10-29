"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import testimonialsData from "../../data/testimoni/testimonials.json";
import TestimoniHeader from "./components/TestimoniHeader";
import TestimoniSearchFilter from "./components/pencarian/TestimoniSearchFilter";
import TestimoniGrid from "./components/grid/TestimoniGrid";
import TestimoniModal from "./components/popup/TestimoniModal";
import { formatTanggal, similarity } from "./components/utilsTestimoni";

export default function Testimoni() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  const itemsPerPage = 6;

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => setCurrentPage(1), [debouncedQuery, minRating, selectedTag]);

  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !suggestionRef.current?.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // tags
  const tags = useMemo(() => {
    const t = new Set();
    testimonialsData.forEach((i) => i.tags?.forEach((tag) => t.add(tag)));
    return ["all", ...t];
  }, []);

  // proses data & urutkan
  const processedTestimonials = useMemo(
    () =>
      testimonialsData
        .map((t) => ({
          ...t,
          text: t.text ?? "",
          name: t.name ?? "Anonymous",
          formattedDate: formatTanggal(t.date),
          tags: t.tags ?? [],
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  // suggestions
  const suggestions = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];
    return processedTestimonials
      .map((t) => {
        const fields = [t.name, t.role, t.project, t.company, ...(t.tags || [])];
        const sims = fields.map((f) => similarity(q, f));
        return { ...t, relevance: Math.max(...sims) };
      })
      .filter((t) => t.relevance > 0.22)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);
  }, [debouncedQuery, processedTestimonials]);

  // filtering
  const filtered = useMemo(() => {
    const q = (debouncedQuery || "").toLowerCase();
    return processedTestimonials.filter((t) => {
      const matchText =
        !q ||
        [t.name, t.role, t.project, t.company, ...(t.tags || []), t.text]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const ratingOK = t.rating >= minRating;
      const tagOK = selectedTag === "all" || t.tags?.includes(selectedTag);
      return matchText && ratingOK && tagOK;
    });
  }, [processedTestimonials, debouncedQuery, minRating, selectedTag]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const avgRating = useMemo(() => {
    const total = testimonialsData.reduce((acc, t) => acc + (t.rating || 0), 0);
    return (total / testimonialsData.length).toFixed(2);
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 sm:px-10 py-12 sm:py-24">
      <TestimoniHeader avgRating={avgRating} />
      <TestimoniSearchFilter
        {...{
          searchQuery,
          setSearchQuery,
          debouncedQuery,
          suggestions,
          focusedIndex,
          setFocusedIndex,
          showSuggestions,
          setShowSuggestions,
          inputRef,
          suggestionRef,
          minRating,
          setMinRating,
          selectedTag,
          setSelectedTag,
          tags,
          setDebouncedQuery,
        }}
      />
      <TestimoniGrid
        paginated={paginated}
        filtered={filtered}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSelected={setSelected}
        debouncedQuery={debouncedQuery}
        searchQuery={searchQuery}
      />
      <AnimatePresence>
        {selected && (
          <TestimoniModal
            selected={selected}
            onClose={() => setSelected(null)}
            debouncedQuery={debouncedQuery}
            searchQuery={searchQuery}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
