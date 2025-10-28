import { MessageCircle } from "lucide-react";

export default function HelpChatbotItem({ onOpenChatbot }) {
  return (
    <li>
      <button
        onClick={onOpenChatbot}
        className="flex items-center gap-2 text-green-400 hover:text-white transition-all duration-200 w-full text-left"
      >
        <MessageCircle size={15} />
        SaipulAI (Chatbot)
      </button>
    </li>
  );
}
