import { m } from "framer-motion";

export default function HobbyHeader() {
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl mb-16"
    >
      <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-purple-300">
        Aktivitas & Ketertarikan
      </h1>
      <p className="mt-6 text-gray-400 text-lg leading-relaxed">
        Hidup bukan cuma kerja dan belajar. Kadang kita butuh waktu buat{" "}
        <HighlightedText text="eksplor" color="cyan" />,{" "}
        <HighlightedText text="berkarya" color="pink" />, dan{" "}
        <HighlightedText text="bernapas" color="amber" /> ✨
      </p>
    </m.div>
  );
}

function HighlightedText({ text, color }) {
  const colorClasses = {
    cyan: "text-cyan-300",
    pink: "text-pink-300", 
    amber: "text-amber-300"
  };

  return <span className={colorClasses[color]}>{text}</span>;
}