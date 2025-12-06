import { Brain, X, Settings } from "lucide-react";

export function ChatHeader({ onClose, onOpenSettings }) {
  return (
    <div className="flex items-center justify-between bg-blue-600 p-3 text-white">
      <div className="flex items-center gap-2">
        <Brain size={20} />
        <div>
          <span className="font-bold">Live Chat</span>
          <div className="text-xs opacity-80">Customer Support</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-blue-500 transition"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-blue-500 transition"
          title="Close Chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}