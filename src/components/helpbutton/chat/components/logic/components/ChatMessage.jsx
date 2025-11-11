import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ChatMessage({ 
  message, 
  isTyping, 
  getAccentGradient, 
  settings 
}) {
  if (isTyping) {
    return (
      <div className="flex justify-start">
        <div className="px-3 py-2 rounded-xl bg-gray-700 text-gray-300 text-xs flex items-center gap-2 border border-gray-600">
          <Loader2 size={14} className="animate-spin" /> 
          <span>
            {settings.responseSpeed === 'fast' ? 'Menganalisis...' : 
             settings.responseSpeed === 'thorough' ? 'Menganalisis mendalam...' : 
             'Memproses...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-3 py-2 rounded-xl max-w-[85%] break-words shadow-md ${
          message.from === "user"
            ? `bg-gradient-to-r ${getAccentGradient()} text-white rounded-br-none`
            : "bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600"
        } ${message.type === 'error' ? 'border-l-4 border-l-red-500' : ''} ${
          message.type === 'success' ? 'border-l-4 border-l-green-500' : ''
        }`}
      >
        <div className="whitespace-pre-wrap">
          {message.text.split('**').map((part, index) => 
            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
          )}
        </div>
        <div className={`text-xs mt-1 ${message.from === "user" ? "text-blue-100" : "text-gray-400"}`}>
          {new Date(message.timestamp).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {message.type === 'error' && ' • ⚠️'}
          {message.type === 'success' && ' • ✅'}
        </div>
      </div>
    </motion.div>
  );
}