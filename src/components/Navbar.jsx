import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Info, Camera, Folder, Image, Mail } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Auth buttons were moved into the special pages (streming & discond)
  // to allow custom layouts per-page. Navbar no longer renders auth links.

  const links = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/about", label: "About", icon: <Info size={18} /> },
    { to: "/photography", label: "Photography", icon: <Camera size={18} /> },
    { to: "/projects", label: "Projects", icon: <Folder size={18} /> },
    { to: "/gallery", label: "Gallery", icon: <Image size={18} /> },
    { to: "/contact", label: "Contact", icon: <Mail size={18} /> },
  ];

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
          className="md:hidden focus:outline-none text-blue-300 hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((item) => (
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

          {/* Auth controls removed from global Navbar. */}
        </ul>
      </div>

      {/* Menu Mobile (rendered via portal so it sits above page stacking contexts) */}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              style={{ zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />

            <div
              className={`md:hidden fixed top-0 right-0 h-full w-3/4 sm:w-2/5 bg-gradient-to-tr from-[#07102a] to-[#071b2f] backdrop-blur-lg shadow-2xl border-l border-blue-900/40 transform transition-transform duration-300 ease-in-out rounded-l-3xl ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ zIndex: 9999, willChange: "transform" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/30">
                <Link
                  to="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">SM</div>
                  <div>
                    <div className="text-lg font-semibold text-cyan-200">Syaiful</div>
                    <div className="text-xs text-gray-300">Muhammad Syaiful Mukmin</div>
                  </div>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-300 hover:text-white transition p-2 rounded-md"
                  aria-label="Close menu"
                >
                  <X size={26} />
                </button>
              </div>

              <ul className="flex flex-col items-start px-4 py-6 space-y-3">
                {links.map((item) => (
                  <li key={item.to} className="w-full">
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 w-full text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.to
                          ? "text-cyan-400 bg-blue-900/60 border border-blue-700/50 shadow-inner"
                          : "text-gray-200 hover:text-cyan-300 hover:bg-blue-900/30 hover:translate-x-1"
                      }`}
                    >
                      <span className="text-cyan-300">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      <span className="text-sm text-blue-300/80">›</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="relative px-6 py-8 border-t border-cyan-500/20 bg-gradient-to-b from-gray-900/10 to-gray-900/40 backdrop-blur-sm text-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>

                {/* Animated Border Effect */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                <div className="relative z-10">
                  {/* Social Media Icons */}
                  <div className="flex justify-center space-x-6 mb-4">
                    <a href="https://github.com/saipul12c" target="_blank" rel="noopener noreferrer" 
                       className="group p-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>

                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                       className="group p-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>

                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                       className="group p-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 hover:from-sky-500 hover:to-sky-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>

                    <a href="https://instagram.com/saipul16_" target="_blank" rel="noopener noreferrer"
                       className="group p-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/20">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>

                  {/* Main Text */}
                  <div className="mb-3">
                    <div className="text-sm text-cyan-200 font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse-slow">
                      🚀 Website Ini adalah Projek Pertama saya dan masih dalam pengembangan
                    </div>
                    <div className="text-xs text-gray-300 mt-2 font-medium">
                      Dibangun dengan <span className="text-cyan-300">React</span> • <span className="text-cyan-300">Tailwind CSS</span> • <span className="text-cyan-300">Vite</span>
                    </div>
                  </div>

                  {/* Developer Info */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
                      <div className="text-xs text-gray-400">
                        <span className="text-cyan-300 font-bold">Muhammad Syaiful Mukmin</span> • Full Stack Developer
                      </div>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-2 tracking-wide">
                      © {new Date().getFullYear()} • v1.0.0-beta • Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
                    </div>
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