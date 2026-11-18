import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, Home, Info, Camera, Folder, Image, Mail, BookOpen,
  ChevronDown, Sparkles, Compass
} from "lucide-react";
import pkg from "../../package.json";
import docsData from "../data/helpbutton/docs/docsSections.json";
import PLANNED_VERSIONS from "./helpbutton/versiWeb/data/plannedVersions";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const rawVersion = pkg?.version || "1.0.0";
  const displayVersion = rawVersion.startsWith("v") ? rawVersion : `v${rawVersion}`;
  const versionSlug = displayVersion.toLowerCase().replace(/\./g, "-").replace(/[^a-z0-9-]/g, "");

  const normalizedVersion = rawVersion.replace(/^v/, "");
  let resolvedVersionSlug = null;

  try {
    const docMatch = docsData.find(d => d && (d.version === normalizedVersion || d.version === rawVersion || d.version === displayVersion.replace(/^v/, '')));
    if (docMatch && docMatch.slug) {
      resolvedVersionSlug = docMatch.slug;
    }
  } catch {
    // ignore if docsData not available
  }

  if (!resolvedVersionSlug) {
    const plannedMatch = PLANNED_VERSIONS.find(p => p.version && p.version.replace(/^v/, "") === normalizedVersion);
    if (plannedMatch) {
      resolvedVersionSlug = plannedMatch.version.toLowerCase().replace(/\./g, "-");
    }
  }

  if (!resolvedVersionSlug) resolvedVersionSlug = versionSlug;

  // Tutup dropdown desktop saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPortfolioDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup menu mobile & dropdown saat rute berpindah
  useEffect(() => {
    setIsOpen(false);
    setPortfolioDropdownOpen(false);
  }, [location.pathname]);

  // 1. Menu Utama
  const mainLinks = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/about", label: "About", icon: <Info size={18} /> },
  ];

  // 2. Karya & Portofolio (Showcase)
  const portfolioLinks = [
    { to: "/projects", label: "Projects", icon: <Folder size={18} />, desc: "Aplikasi & Kode" },
    { to: "/photography", label: "Photography", icon: <Camera size={18} />, desc: "Karya Fotografi" },
    { to: "/gallery", label: "Gallery", icon: <Image size={18} />, desc: "Momen & Album" },
    { to: "/blog", label: "Blog", icon: <BookOpen size={18} />, desc: "Artikel & Tulisan" },
  ];

  // Portfolio items for desktop dropdown (excluding blog as blog is top-level on desktop)
  const desktopPortfolioLinks = portfolioLinks.slice(0, 3);

  // 3. Kontak
  const contactLink = { to: "/contact", label: "Contact", icon: <Mail size={18} /> };

  const isDesktopPortfolioActive = desktopPortfolioLinks.some(link => location.pathname === link.to);

  return (
    <nav className="backdrop-blur-md bg-[#0f172a]/90 text-white sticky top-0 z-50 shadow-md border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          My<span className="text-gray-100">-Portfolio</span>
        </Link>

        {/* Tombol Hamburger (Mobile) */}
        <button
          className="md:hidden focus:outline-none text-blue-300 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menu Desktop (Dikelompokkan menjadi 5 tombol rapi) */}
        <ul className="hidden md:flex items-center gap-6">
          {/* Menu Utama: Home & About */}
          {mainLinks.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`relative flex items-center gap-2 text-base font-medium tracking-wide transition-all duration-300 ${
                  location.pathname === item.to
                    ? "text-cyan-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400"
                    : "text-gray-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                }`}
              >
                <span className="text-cyan-300">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Dropdown Karya & Portofolio */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPortfolioDropdownOpen(!portfolioDropdownOpen)}
              onMouseEnter={() => setPortfolioDropdownOpen(true)}
              className={`relative flex items-center gap-1.5 text-base font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                isDesktopPortfolioActive
                  ? "text-cyan-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400"
                  : "text-gray-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
              }`}
            >
              <span className="text-cyan-300"><Folder size={18} /></span>
              <span>Portfolio</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${portfolioDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Floating Dropdown Card */}
            {portfolioDropdownOpen && (
              <div
                onMouseLeave={() => setPortfolioDropdownOpen(false)}
                className="absolute top-full left-0 mt-3 w-64 p-2 bg-[#09152b]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-950/50 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400/80 px-3 py-1.5">
                  Karya & Galeri
                </div>
                <div className="space-y-1">
                  {desktopPortfolioLinks.map((sub) => {
                    const isActive = location.pathname === sub.to;
                    return (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? "bg-cyan-400/20 text-cyan-300" : "bg-white/5 text-cyan-400"}`}>
                          {sub.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold leading-tight">{sub.label}</div>
                          <div className="text-[11px] text-gray-400 leading-tight mt-0.5">{sub.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </li>

          {/* Blog */}
          <li>
            <Link
              to="/blog"
              className={`relative flex items-center gap-2 text-base font-medium tracking-wide transition-all duration-300 ${
                location.pathname === "/blog" || location.pathname.startsWith("/blog/")
                  ? "text-cyan-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400"
                  : "text-gray-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
              }`}
            >
              <span className="text-cyan-300"><BookOpen size={18} /></span>
              <span>Blog</span>
            </Link>
          </li>

          {/* Contact (CTA Button) */}
          <li>
            <Link
              to={contactLink.to}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === contactLink.to
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 shadow-md shadow-cyan-500/30"
                  : "bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:scale-105"
              }`}
            >
              <span>{contactLink.icon}</span>
              <span>{contactLink.label}</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Menu Mobile Drawer (Render via portal agar selalu di atas layer apapun) */}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {/* Backdrop overlay */}
            <div
              className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              style={{ zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Sidebar */}
            <div
              className={`md:hidden fixed top-0 right-0 h-[100dvh] max-h-[100dvh] w-[82%] sm:w-80 max-w-[340px] bg-gradient-to-b from-[#091124] via-[#07162c] to-[#040a14] backdrop-blur-2xl shadow-2xl border-l border-cyan-500/20 transform transition-transform duration-300 ease-in-out rounded-l-3xl flex flex-col z-[9999] overflow-hidden ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ willChange: "transform" }}
            >
              {/* 1. Header (Profil Singkat & Tombol Close) - Flex-shrink-0 */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/15 flex-shrink-0 bg-white/[0.02]">
                <Link
                  to="/"
                  className="flex items-center gap-3 min-w-0"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-cyan-500/30 flex-shrink-0">
                    SM
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-cyan-200 truncate">Syaiful</div>
                    <div className="text-[11px] text-gray-400 truncate">M. Syaiful Mukmin</div>
                  </div>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition flex-shrink-0 ml-2"
                  aria-label="Tutup menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* 2. Scrollable Body (Dikelompokkan rapi & hemat ruang) - Flex-1 Overflow-Y */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
                {/* 🧭 Grup 1: Menu Utama */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400/80 px-2 flex items-center gap-1.5">
                    <Compass size={13} />
                    <span>Navigasi Utama</span>
                  </div>
                  <div className="space-y-1">
                    {mainLinks.map((item) => {
                      const isActive = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                              : "text-gray-300 hover:text-white hover:bg-white/5 hover:translate-x-1"
                          }`}
                        >
                          <span className={isActive ? "text-cyan-300" : "text-cyan-400/80"}>{item.icon}</span>
                          <span className="flex-1 text-sm">{item.label}</span>
                          <span className="text-xs text-cyan-400/50">›</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* ✨ Grup 2: Karya & Portofolio (Grid 2x2 - Menghemat ruang & sangat rapi!) */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400/80 px-2 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>Karya & Portofolio</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {portfolioLinks.map((item) => {
                      const isActive = location.pathname === item.to || (item.to === "/blog" && location.pathname.startsWith("/blog/"));
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsOpen(false)}
                          className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-400/50 text-cyan-200 shadow-md shadow-cyan-500/10"
                              : "bg-white/[0.03] border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-cyan-500/30 hover:scale-[1.02]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`p-1.5 rounded-lg ${isActive ? "bg-cyan-400/20 text-cyan-300" : "bg-white/5 text-cyan-400"}`}>
                              {item.icon}
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold leading-tight">{item.label}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* ✉️ Grup 3: Hubungi Saya (Tombol Call to Action) */}
                <div className="pt-1">
                  <Link
                    to={contactLink.to}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                      location.pathname === contactLink.to
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 shadow-cyan-500/30 font-bold"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-200 hover:from-cyan-500/30 hover:to-blue-600/30 hover:border-cyan-400"
                    }`}
                  >
                    <Mail size={16} />
                    <span>Hubungi Saya</span>
                  </Link>
                </div>
              </div>

              {/* 3. Footer (Ikon Medsos & Info Ringkas) - Flex-shrink-0 (Tidak Pernah Terpotong) */}
              <div className="flex-shrink-0 px-4 py-3.5 border-t border-cyan-500/15 bg-black/40 backdrop-blur-md text-center mt-auto">
                {/* Social Media Icons */}
                <div className="flex justify-center items-center gap-3">
                  <a
                    href="https://github.com/saipul12c"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all text-gray-300"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>

                  <a
                    href="https://linkedin.com/in/syaifulmukmin"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all text-gray-300"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all text-gray-300"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>

                  <a
                    href="https://instagram.com/saipul16_"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all text-gray-300"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>

                {/* Ringkasan Status & Versi - Sangat padat & pasti muat */}
                <div className="mt-2.5">
                  <div className="text-[11px] text-cyan-300 font-medium">
                    🚀 Portofolio • <Link to={`/help/version/${resolvedVersionSlug}`} onClick={() => setIsOpen(false)} className="hover:underline">Versi {displayVersion}</Link>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    © {new Date().getFullYear()} <Link to="/owner" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-300 hover:underline">Muhammad Syaiful Mukmin</Link>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </nav>
  );
}
