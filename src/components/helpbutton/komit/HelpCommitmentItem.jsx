import { Heart } from "lucide-react";

export default function HelpCommitmentItem() {
  return (
    <li>
      <a
        href="/commitment"
        className="flex items-center gap-2 text-pink-400 hover:text-white transition-colors"
      >
        <Heart size={15} />
        Komitmen Kami
      </a>
    </li>
  );
}
