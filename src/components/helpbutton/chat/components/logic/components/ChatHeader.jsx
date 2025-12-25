import { Brain, X, Settings } from "lucide-react";

export function ChatHeader({ onClose, onOpenSettings }) {
  return (
    <div className="flex items-center justify-between p-3" style={{ background: 'var(--saipul-accent)', color: 'var(--saipul-surface)' }}>
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
          className="p-2 rounded-full transition"
          title="Settings"
          style={{ background: 'transparent', color: 'inherit' }}
        >
          <Settings size={18} />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full transition"
          title="Close Chat"
          style={{ background: 'transparent', color: 'inherit' }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}