import { useState, useMemo } from "react";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import faqsData from "./data/faqs.json";

export default function HelpFAQItem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  // 🔍 Filter pertanyaan berdasarkan pencarian
  const filteredFaqs = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return faqsData.filter((item) => item.question.toLowerCase().includes(q));
  }, [searchTerm]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIdx, startIdx + itemsPerPage);

  // 🔁 Toggle buka/tutup FAQ
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  // 🔢 Ganti halaman
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenIndex(null); // tutup semua FAQ saat ganti halaman
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  // 📜 Pagination dinamis (contoh: [1] ... [4][5][6] ... [17])
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage > delta + 2) range.push(1, "left-ellipsis");
    else for (let i = 1; i < left; i++) range.push(i);

    for (let i = left; i <= right; i++) range.push(i);

    if (currentPage < totalPages - (delta + 1)) range.push("right-ellipsis", totalPages);
    else for (let i = right + 1; i <= totalPages; i++) range.push(i);

    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen flex flex-col items-center justify-start px-6 py-24 bg-gradient-to-b from-[#0d111a] via-[#111726] to-[#0d111a] text-white overflow-hidden scroll-smooth font-inter">
        {/* === Background Glow === */}
        <div className="absolute inset-0 -z-10 pointer-events-none select-none">
          <div className="absolute top-1/4 left-[10%] w-60 h-60 bg-cyan-400/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 right-[10%] w-64 h-64 bg-purple-400/10 rounded-full blur-[90px]" />
        </div>

        {/* === Header === */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mb-16"
        >
          <div className="flex justify-center items-center gap-2 text-cyan-300 mb-4">
            <HelpCircle className="w-6 h-6" />
            <span className="uppercase tracking-wider text-xs font-semibold">
              Bantuan & FAQ
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-300">
            Pusat Pertanyaan
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Temukan jawaban seputar{" "}
            <span className="text-cyan-300">teknologi</span>,{" "}
            <span className="text-pink-300">kreativitas</span>, dan{" "}
            <span className="text-amber-300">pendidikan digital</span> ✨
          </p>
        </m.div>

        {/* === Search Bar === */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3 mb-12 w-full max-w-lg"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari pertanyaan..."
              className="w-full bg-[#141a28]/60 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all duration-300 backdrop-blur-md"
            />
          </div>
          <p className="text-xs text-gray-500">
            Menampilkan {filteredFaqs.length} dari {faqsData.length} pertanyaan
          </p>
        </m.div>

        {/* === FAQ Cards Grid === */}
        <m.section
          layout
          transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
        >
          <AnimatePresence mode="popLayout">
            {paginatedFaqs.map((faq, i) => {
              const globalIndex = startIdx + i; // ✅ gunakan index global
              const isOpen = openIndex === globalIndex;
              return (
                <m.div
                  key={faq.question}
                  layoutId={faq.question}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="relative group bg-[#141a28]/60 p-7 rounded-2xl border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition-all duration-400 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                >
                  <button
                    onClick={() => toggle(globalIndex)}
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                  >
                    <span className="font-semibold text-white/90 group-hover:text-cyan-300 transition-colors text-base md:text-lg">
                      {faq.question}
                    </span>
                    <m.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown
                        size={20}
                        className="text-gray-400 group-hover:text-cyan-300 transition"
                      />
                    </m.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4"
                      >
                        {faq.answer}
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.section>

        {/* === Pagination Controls (Dinamis) === */}
        {filteredFaqs.length > itemsPerPage && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-2 mt-14 flex-wrap"
          >
            {/* Tombol Prev */}
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full text-sm font-medium border border-white/10 ${
                currentPage === 1
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-white hover:border-cyan-400/40"
              }`}
            >
              Prev
            </button>

            {visiblePages.map((page, idx) =>
              page === "left-ellipsis" || page === "right-ellipsis" ? (
                <span key={idx} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => changePage(page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                    currentPage === page
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                      : "border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/40"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Tombol Next */}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-medium border border-white/10 ${
                currentPage === totalPages
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-white hover:border-cyan-400/40"
              }`}
            >
              Next
            </button>
          </m.div>
        )}

        {/* === Empty State === */}
        {filteredFaqs.length === 0 && (
          <div className="text-center text-gray-500 py-20 text-sm">
            Tidak ada hasil untuk pencarianmu.
          </div>
        )}

        {/* === Footer === */}
        <m.footer
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center text-gray-600 text-xs"
        >
          Dibuat dengan semangat 💡 oleh{" "}
          <span className="text-cyan-400 font-semibold">
            Muhammad Syaiful Mukmin
          </span>
          <br />
          <span className="text-gray-500">© 2025 — Semua Hak Dilindungi</span>
        </m.footer>
      </main>
    </LazyMotion>
  );
}
