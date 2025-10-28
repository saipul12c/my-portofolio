import HelpFAQItem from "./faq/HelpFAQItem";
import HelpChatbotItem from "./chat/HelpChatbotItem";
import HelpDocsItem from "./docs/HelpDocsItem";
import HelpCommitmentItem from "./komit/HelpCommitmentItem";
import HelpVersionInfo from "./versiWeb/HelpVersionInfo";

export default function HelpMenu({ onOpenChatbot }) {
  return (
    <div className="absolute bottom-12 right-0 bg-gray-900/95 border border-gray-700 rounded-2xl shadow-lg p-4 w-64 -translate-x-4 backdrop-blur-md animate-fadeIn transition-all duration-300 ease-in-out">
      {/* Header kecil */}
      <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2 pl-1">
        Menu Bantuan
      </div>

      <ul className="space-y-3 text-sm">
        {/* Item bantuan umum */}
        <HelpFAQItem />
        <HelpDocsItem />
        <HelpCommitmentItem />

        {/* Pemisah chatbot */}
        <div className="pt-1 border-t border-gray-700">
          <HelpChatbotItem onOpenChatbot={onOpenChatbot} />
        </div>

        <hr className="border-gray-700 my-2" />

        {/* Versi */}
        <HelpVersionInfo />
      </ul>

      {/* Footer kecil */}
      <div className="text-[10px] text-gray-500 text-center mt-3">
        © {new Date().getFullYear()} SaipulAI Project
      </div>
    </div>
  );
}
