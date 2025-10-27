import { HelpCircle } from "lucide-react";

export default function HelpFAQItem() {
  return (
    <li>
      <a
        href="/faq"
        className="flex items-center gap-2 text-cyan-300 hover:text-white transition-colors"
      >
        <HelpCircle size={15} />
        FAQ (Pertanyaan Umum)
      </a>
    </li>
  );
}
