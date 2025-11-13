import { useState, useMemo, useRef, useCallback } from "react";
import { smartFilter } from "../utils/searchUtils";

export const useCertificatesSearch = (certificates) => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const suggestionRef = useRef(null);

  const categories = useMemo(
    () => ["All", ...new Set(certificates.map((c) => c.category))],
    [certificates]
  );

  // Smart Filtering
  const filteredCertificates = useMemo(
    () => smartFilter(certificates, search, filterCategory),
    [certificates, search, filterCategory]
  );

  // Pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);

  // Suggestion Dropdown
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const all = certificates.flatMap((c) => [
      { type: "title", value: c.title },
      { type: "issuer", value: c.issuer },
      ...(c.tags || []).map((t) => ({ type: "tag", value: t })),
    ]);
    const unique = Array.from(new Set(all.map((a) => a.value)));
    return unique
      .filter((v) => v.toLowerCase().includes(q))
      .slice(0, 6)
      .map((v) => ({ value: v }));
  }, [search, certificates]);

  // Ghost Autocomplete
  const ghostText = useMemo(() => {
    if (!search.trim()) return "";
    const q = search.toLowerCase();
    const match = certificates
      .flatMap((c) => [c.title, c.issuer, ...(c.tags || [])])
      .find((v) => v.toLowerCase().startsWith(q));
    if (!match) return "";
    return match.slice(search.length);
  }, [search, certificates]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      setSearch(suggestions[activeIndex].value);
      setActiveIndex(-1);
    }
  }, [suggestions, activeIndex]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    resetPagination();
  }, [resetPagination]);

  const handleCategoryChange = useCallback((value) => {
    setFilterCategory(value);
    resetPagination();
  }, [resetPagination]);

  return {
    search,
    setSearch: handleSearchChange,
    filterCategory,
    setFilterCategory: handleCategoryChange,
    activeIndex,
    setActiveIndex,
    currentPage,
    setCurrentPage,
    categories,
    filteredCertificates,
    currentCertificates,
    totalPages,
    suggestions,
    ghostText,
    suggestionRef,
    handleKeyDown,
    itemsPerPage
  };
};