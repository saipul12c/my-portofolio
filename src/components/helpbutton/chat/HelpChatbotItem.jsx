import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Loader2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpChatbotItem({ onOpenChatbot }) {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("saipul_theme") || "system");
  const [accent, setAccent] = useState(() => localStorage.getItem("saipul_accent") || "default");
  const [language, setLanguage] = useState(() => localStorage.getItem("saipul_language") || "auto");

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

  const toggleChat = () => {
    setOpen((prev) => !prev);
    if (!open && onOpenChatbot) onOpenChatbot();
  };

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
    const lastBotMsg = [...history].reverse().find((m) => m.from === "bot")?.text || "";

    if (text.includes("halo") || text.includes("hai")) {
      return "Hai juga! 👋 Senang kamu datang lagi. Ada yang bisa kubantu?";
    }

    if (text.includes("terima kasih") || text.includes("makasih")) {
      return "Sama-sama! 😊 Aku senang bisa bantu kamu.";
    }

    if (text.includes("bantu") || text.includes("tolong")) {
      return "Tentu, jelaskan aja masalahnya ya. Aku akan bantu semampuku 🤖";
    }

    if (text.includes("versi")) {
      return "Sekarang kamu ngobrol sama SaipulAI versi 3.0 — lebih pintar dan punya menu pengaturan ⚙️";
    }

    if (text.includes("hapus") && text.includes("chat")) {
      localStorage.removeItem("saipul_chat_history");
      return "Semua riwayat chat telah dihapus 🗑️. Mulai dari awal yuk!";
    }

    if (text.includes("setting") || text.includes("pengaturan")) {
      setShowSettings(true);
      return "Kamu bisa ubah tema, bahasa, dan suara di menu ⚙️ Pengaturan ya!";
    }

    if (text.includes("siapa kamu") || text.includes("kamu siapa")) {
      return "Aku SaipulAI 🤖 — asisten virtual yang sekarang bisa disesuaikan sesuai gaya kamu!";
    }

    if (text.includes("dokumentasi") || text.includes("panduan")) {
      return "Coba cek menu 📘 *How To Use* di situs kamu ya!";
    }

    if (lastBotMsg.includes("bantu") && text.length > 10) {
      return "Oke, aku paham. Sepertinya kamu butuh solusi tentang itu. Boleh aku kasih beberapa saran?";
    }

    const genericReplies = [
      "Menarik juga! Bisa jelaskan lebih detail?",
      "Aku belum yakin, tapi aku bisa bantu cari tahu.",
      "Hmm... sepertinya itu topik menarik 😄",
      "Boleh ulangi sedikit biar aku makin paham?",
      "Oke noted! Aku catat ya ✍️",
    ];

    return genericReplies[Math.floor(Math.random() * genericReplies.length)];
  };

  const saveSettings = () => {
    localStorage.setItem("saipul_theme", theme);
    localStorage.setItem("saipul_accent", accent);
    localStorage.setItem("saipul_language", language);
    setShowSettings(false);
  };

  return (
    <>
      {/* Tombol Chatbot */}
      <li>
        <button
          onClick={toggleChat}
          className="flex items-center gap-2 text-green-400 hover:text-white transition-all duration-200 w-full text-left"
        >
          <MessageCircle size={15} />
          SaipulAI (Chatbot)
        </button>
      </li>

      {/* Popup Chatbot */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-80 overflow-hidden backdrop-blur-md z-[999]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-900/90 p-3 text-sm text-white font-semibold">
              <span>💬 SaipulAI (v3.0)</span>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setShowSettings(true)}
                  className="hover:text-cyan-400 transition"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className="hover:text-red-400 transition"
                >
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

            {/* Input Area */}
            <div className="flex items-center border-t border-gray-700 bg-gray-900/90 p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="flex-grow bg-transparent outline-none text-white text-sm px-2 placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                className="text-cyan-400 hover:text-white transition p-1"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000]"
          >
            <div className="bg-gray-900 text-gray-200 w-[450px] rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex">
                {/* Sidebar */}
                <div className="w-36 bg-gray-800 border-r border-gray-700 flex flex-col text-sm">
                  <button className="p-3 text-left bg-gray-700/60">Umum</button>
                  <button className="p-3 text-left hover:bg-gray-700/50">Notifikasi</button>
                  <button className="p-3 text-left hover:bg-gray-700/50">Personalisasi</button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 text-sm space-y-3">
                  <h3 className="font-semibold text-white">Umum</h3>
                  <div className="space-y-2">
                    <label className="block text-gray-400">Tema</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full"
                    >
                      <option value="system">Sistem</option>
                      <option value="light">Terang</option>
                      <option value="dark">Gelap</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-400">Warna Aksen</label>
                    <select
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full"
                    >
                      <option value="default">Default</option>
                      <option value="cyan">Cyan</option>
                      <option value="green">Hijau</option>
                      <option value="pink">Merah Muda</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-400">Bahasa</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full"
                    >
                      <option value="auto">Deteksi Otomatis</option>
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
                    >
                      Batal
                    </button>
                    <button
                      onClick={saveSettings}
                      className="px-4 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
