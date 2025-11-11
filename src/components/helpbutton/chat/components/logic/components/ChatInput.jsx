import { Send, Mic, MicOff } from "lucide-react";

export function ChatInput({
  input,
  setInput,
  handleSend,
  handleKeyDown,
  isListening,
  startSpeechRecognition,
  getAccentGradient
}) {
  return (
    <div className="border-t border-gray-700 bg-gray-900/90 p-2">
      <div className="flex items-center gap-2">
        <button
          onClick={startSpeechRecognition}
          disabled={isListening}
          className={`p-2 rounded-lg transition ${
            isListening 
              ? "bg-red-500 text-white animate-pulse" 
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          title="Voice Input"
        >
          {isListening ? <MicOff size={14} /> : <Mic size={14} />}
        </button>
        
        <div className="flex-grow relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan, perhitungan, atau minta analisis..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-16"
          />
          {input.length > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {input.length}/500
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSend} 
          disabled={!input.trim()}
          className={`bg-gradient-to-r ${getAccentGradient()} hover:opacity-90 transition p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-2">
        <span>💡 Upload PDF, DOC, XLS, Images •</span>
        <span>Gunakan konteks untuk percakapan natural</span>
      </div>
    </div>
  );
}