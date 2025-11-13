"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import testimonialsData from "../../data/testimoni/testimonials.json";
import TestimoniHeader from "./components/TestimoniHeader";
import TestimoniSearchFilter from "./components/pencarian/TestimoniSearchFilter";
import TestimoniGrid from "./components/grid/TestimoniGrid";
import TestimoniModal from "./components/popup/TestimoniModal";
import { formatTanggal, similarity } from "./components/utilsTestimoni";

export default function Testimoni() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNavigatingFromUrl, setIsNavigatingFromUrl] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  const itemsPerPage = 6;

  // Handle URL parameter untuk auto-open modal
  useEffect(() => {
    if (id) {
      const testimonialId = parseInt(id);
      if (!isNaN(testimonialId)) {
        const foundTestimonial = testimonialsData.find(t => t.id === testimonialId);
        if (foundTestimonial) {
          setIsNavigatingFromUrl(true);
          setSelected(foundTestimonial);
          // Scroll ke atas saat modal dibuka dari URL
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }, [id]);

  // Handle close modal dengan update URL
  const handleCloseModal = useCallback(() => {
    setSelected(null);
    if (isNavigatingFromUrl) {
      navigate('/testimoni', { replace: true });
      setIsNavigatingFromUrl(false);
    }
  }, [navigate, isNavigatingFromUrl]);

  // Handle select testimonial dengan update URL
  const handleSelectTestimonial = useCallback((testimonial) => {
    setSelected(testimonial);
    navigate(`/testimoni/${testimonial.id}`, { replace: true });
  }, [navigate]);

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

  // Handle escape key untuk close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selected) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selected, handleCloseModal]);

  // Prevent body scroll ketika modal terbuka
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

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
          rating: t.rating ?? 0,
          verified: t.verified ?? false
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
        const sims = fields.map((f) => similarity(q, f?.toString() || ''));
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
      const ratingOK = (t.rating || 0) >= minRating;
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
    const ratedTestimonials = testimonialsData.filter(t => t.rating);
    if (ratedTestimonials.length === 0) return "0.00";
    const total = ratedTestimonials.reduce((acc, t) => acc + (t.rating || 0), 0);
    return (total / ratedTestimonials.length).toFixed(2);
  }, []);

  // Enhanced search function dengan URL support
  const handleSearchSelect = useCallback((value) => {
    setSearchQuery(value);
    setDebouncedQuery(value);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  }, []);

  // Enhanced tag filter dengan URL reset
  const handleTagSelect = useCallback((tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    // Reset URL jika sedang melihat detail testimonial
    if (selected) {
      navigate('/testimoni', { replace: true });
    }
  }, [selected, navigate]);

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
          setSelectedTag: handleTagSelect,
          tags,
          setDebouncedQuery,
          onSearchSelect: handleSearchSelect,
        }}
      />
      <TestimoniGrid
        paginated={paginated}
        filtered={filtered}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSelected={handleSelectTestimonial}
        debouncedQuery={debouncedQuery}
        searchQuery={searchQuery}
        selectedId={selected?.id}
      />
      <AnimatePresence>
        {selected && (
          <TestimoniModal
            selected={selected}
            onClose={handleCloseModal}
            debouncedQuery={debouncedQuery}
            searchQuery={searchQuery}
            isFromUrl={isNavigatingFromUrl}
          />
        )}
      </AnimatePresence>
    </main>
  );
}