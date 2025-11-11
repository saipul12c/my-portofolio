import { Brain, Upload, Download, Settings, X } from "lucide-react";

export function ChatHeader({ 
  onClose, 
  onOpenSettings, 
  triggerFileUpload, 
  exportChat, 
  clearChat, 
  getAccentGradient, 
  settings 
}) {
  return (
    <div className={`flex items-center justify-between bg-gradient-to-r ${getAccentGradient()} p-3 text-sm text-white font-semibold`}>
      <div className="flex items-center gap-2">
        <Brain size={16} className="text-white" />
        <div>
          <span>💬 SaipulAI v6.0</span>
          <div className="text-xs opacity-80 font-normal">
            {settings.aiModel.toUpperCase()} • 🟢 Enhanced
          </div>
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <button 
          onClick={triggerFileUpload}
          className="text-xs bg-white/20 hover:bg-white/30 p-1 rounded transition"
          title="Upload File"
        >
          <Upload size={12} />
        </button>
        <button 
          onClick={exportChat}
          className="text-xs bg-white/20 hover:bg-white/30 p-1 rounded transition"
          title="Export Chat"
        >
          <Download size={12} />
        </button>
        <button 
          onClick={clearChat}
          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
          title="Bersihkan Chat"
        >
          Hapus
        </button>
        <button onClick={onOpenSettings} className="hover:bg-white/20 p-1 rounded transition">
          <Settings size={14} />
        </button>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}