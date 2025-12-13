import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Auth buttons were moved into the special pages (streming & discond)
  // to allow custom layouts per-page. Navbar no longer renders auth links.

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/photography", label: "Photography" },
    { to: "/projects", label: "Projects" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
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
                className={`relative text-base font-medium tracking-wide transition-all duration-300 ${
                  location.pathname === item.to
                    ? "text-cyan-400 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400"
                    : "text-gray-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Auth controls removed from global Navbar. */}
        </ul>
      </div>

      {/* Menu Mobile */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-3/4 sm:w-2/5 bg-[var(--color-gray-900)] backdrop-blur-lg shadow-2xl border-l border-blue-900/40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-blue-900/40 bg-[#0f172a]/95">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
            onClick={() => setIsOpen(false)}
          >
            Syaiful
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-cyan-300 hover:text-white transition"
          >
            <X size={28} />
          </button>
        </div>

        <ul className="flex flex-col items-start px-6 py-6 space-y-5 bg-[var(--color-gray-900)]">
          {links.map((item) => (
            <li key={item.to} className="w-full">
              <Link
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-lg font-medium px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.to
                    ? "text-cyan-400 bg-blue-900/60 border border-blue-700/50"
                    : "text-gray-200 hover:text-cyan-300 hover:bg-blue-900/40 border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Auth controls removed from mobile menu too. */}
        </ul>
      </div>
    </nav>
  );
}