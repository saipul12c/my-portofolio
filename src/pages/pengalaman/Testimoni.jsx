import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import testimonialsData from "../../data/testimoni/testimonials.json";
import TestimoniHeader from "./components/TestimoniHeader";
import TestimoniSearchFilter from "./components/pencarian/TestimoniSearchFilter";
import TestimoniGrid from "./components/grid/TestimoniGrid";
import TestimoniModal from "./components/popup/TestimoniModal";
import { formatTanggal, similarity } from "./components/utilsTestimoni";

// Constants
const ITEMS_PER_PAGE = 6;
const DEBOUNCE_DELAY = 200;

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
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Handle URL parameter untuk auto-open modal
  useEffect(() => {
    if (id) {
      const testimonialId = parseInt(id, 10);
      if (!isNaN(testimonialId)) {
        const foundTestimonial = testimonialsData.find(t => t.id === testimonialId);
        if (foundTestimonial) {
          setSelected(foundTestimonial);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }, [id]);

  // Handle close modal dengan update URL
  const handleCloseModal = useCallback(() => {
    setSelected(null);
    navigate('/testimoni', { replace: true });
  }, [navigate]);

  // Handle select testimonial dengan update URL
  const handleSelectTestimonial = useCallback((testimonial) => {
    setSelected(testimonial);
    navigate(`/testimoni/${testimonial.id}`, { replace: true });
  }, [navigate]);

  // Optimized debounce search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, minRating, selectedTag]);

  // Close suggestions when clicking outside
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

  // Handle escape key dan body scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selected) {
        handleCloseModal();
      }
    };

    if (selected) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [selected, handleCloseModal]);

  // Kalkulasi tags dari data
  const tags = useMemo(() => {
    const t = new Set();
    testimonialsData.forEach((i) => i.tags?.forEach((tag) => t.add(tag)));
    return ["all", ...Array.from(t)];
  }, []);

  // Process & sort testimonials (hanya 1x saat mount atau data berubah)
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

  // Generate suggestions hanya saat debouncedQuery berubah
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

  // Filter testimonials berdasarkan kriteria
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

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate average rating
  const avgRating = useMemo(() => {
    const ratedTestimonials = testimonialsData.filter(t => t.rating);
    if (ratedTestimonials.length === 0) return "0.00";
    const total = ratedTestimonials.reduce((acc, t) => acc + (t.rating || 0), 0);
    return (total / ratedTestimonials.length).toFixed(2);
  }, []);

  // Handle search selection
  const handleSearchSelect = useCallback((value) => {
    setSearchQuery(value);
    setDebouncedQuery(value);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  }, []);

  // Handle tag selection
  const handleTagSelect = useCallback((tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    if (selected) {
      navigate('/testimoni', { replace: true });
    }
  }, [selected, navigate]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-3 sm:px-6 md:px-10 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="w-full max-w-7xl">
        <TestimoniHeader avgRating={avgRating} />
      </div>
      <div className="w-full max-w-7xl">
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
      </div>
      <div className="w-full max-w-7xl">
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
      </div>
      <AnimatePresence>
        {selected && (
          <TestimoniModal
            selected={selected}
            onClose={handleCloseModal}
            debouncedQuery={debouncedQuery}
            searchQuery={searchQuery}
          />
        )}
      </AnimatePresence>
    </main>
  );
}