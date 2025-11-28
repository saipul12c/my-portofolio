import { m } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NavigationButton({ onBack }) {
  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-6 left-6 z-50"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>
    </m.div>
  );
}