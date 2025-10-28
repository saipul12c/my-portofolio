import { useState, useEffect, useRef } from "react";
import { X, Settings, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatbotWindow({ onClose, onOpenSettings }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("saipul_chat_history");
    return saved
      ? JSON.parse(saved)
      : [{ from: "bot", text: "Halo! 👋 Aku SaipulAI, siap bantu kamu hari ini!" }];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("saipul_chat_history", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    generateBotReply(userInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const generateBotReply = (userText) => {
    setIsTyping(true);

    setTimeout(() => {
      const reply = getSmartReply(userText, messages);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const getSmartReply = (msg, history) => {
    const text = msg.toLowerCase();

    if (text.includes("halo") || text.includes("hai")) {
      return "Hai juga! 👋 Senang kamu datang lagi. Ada yang bisa kubantu?";
    }
    if (text.includes("terima kasih")) return "Sama-sama! 😊 Aku senang bisa bantu kamu.";
    if (text.includes("versi")) return "Kamu ngobrol dengan SaipulAI v3.0 ⚙️";
    if (text.includes("hapus") && text.includes("chat")) {
      localStorage.removeItem("saipul_chat_history");
      return "Riwayat chat telah dihapus 🗑️";
    }

    const fallback = [
      "Menarik juga! Bisa jelaskan lebih detail?",
      "Hmm... sepertinya topik menarik 😄",
      "Aku belum yakin, tapi aku bisa bantu cari tahu.",
    ];
    return fallback[Math.floor(Math.random() * fallback.length)];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-20 right-6 bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-80 overflow-hidden backdrop-blur-md z-[9999]"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900/90 p-3 text-sm text-white font-semibold">
          <span>💬 SaipulAI (v3.0)</span>
          <div className="flex gap-2 items-center">
            <button onClick={onOpenSettings} className="hover:text-cyan-400 transition">
              <Settings size={16} />
            </button>
            <button onClick={onClose} className="hover:text-red-400 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="max-h-64 overflow-y-auto p-3 space-y-2 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[75%] break-words shadow-md ${
                  m.from === "user"
                    ? "bg-cyan-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl bg-gray-700 text-gray-300 text-xs flex items-center gap-1 animate-pulse">
                <Loader2 size={14} className="animate-spin" /> SaipulAI sedang mengetik...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-gray-700 bg-gray-900/90 p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            className="flex-grow bg-transparent outline-none text-white text-sm px-2 placeholder-gray-400"
          />
          <button onClick={handleSend} className="text-cyan-400 hover:text-white transition p-1">
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
