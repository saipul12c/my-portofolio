import { BookOpen } from "lucide-react";

export default function HelpDocsItem() {
  return (
    <li>
      <a
        href="/docs"
        className="flex items-center gap-2 text-blue-400 hover:text-white transition-colors"
      >
        <BookOpen size={15} />
        How To Use / Dokumentasi
      </a>
    </li>
  );
}
