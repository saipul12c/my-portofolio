import { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useChatbot } from "./logic/hook/useChatbot";
import { ChatHeader } from "./logic/components/ChatHeader";
import { ChatMessage } from "./logic/components/ChatMessage";
import { ChatInput } from "./logic/components/ChatInput";
import { Suggestions } from "./logic/components/Suggestions";
import ReportModal from "./logic/components/ReportModal";
import Sentiment from "sentiment";

export function ChatbotWindow({ onClose, onOpenSettings, knowledgeBase = {}, knowledgeStats = {} }) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    suggestions,
    handleSend,
    handleKeyDown,
    getAccentGradient,
    generateBotReply
  , settings } = useChatbot(knowledgeBase, knowledgeStats);
  // Handler untuk quick actions (like, dislike, regenerate, report)
  const handleQuickAction = (action, messageId, extra) => {
    
    if (action === "like") {
      setMessages((prev) => prev.map((msg) =>
        msg.id === messageId ? { ...msg, liked: true, disliked: false } : msg
      ));
    } else if (action === "dislike") {
      setMessages((prev) => prev.map((msg) =>
        msg.id === messageId ? { ...msg, disliked: true, liked: false } : msg
      ));
    } else if (action === "regenerate") {
      // Regenerate response for bot message
      const msg = messages.find((m) => m.id === messageId);
      if (msg && msg.from === "bot") {

        generateBotReply(msg.text);
      }
    } else if (action === "report") {
      // Simpan laporan ke localStorage dan tampilkan feedback
      const reportData = {
        messageId,
        ...extra,
        timestamp: new Date().toISOString()
      };
      try {
        const reports = JSON.parse(localStorage.getItem("saipul_chat_reports") || "[]");
        reports.push(reportData);
        localStorage.setItem("saipul_chat_reports", JSON.stringify(reports));
      } catch (e) {
        console.error("Failed to save chat report", e);
      }
      setMessages((prev) => [...prev, {
        from: "user",
        text: `Laporan dikirim: ${JSON.stringify(reportData)}`,
        timestamp: new Date().toISOString(),
        type: "report"
      }]);
    } else if (action === "delete") {
      // Remove message from UI and update persisted history (unless privacyMode)
      setMessages((prev) => {
        const updated = prev.filter(m => m.id !== messageId);
        try {
          if (!settings || !settings.privacyMode) {
            localStorage.setItem("saipul_chat_history", JSON.stringify(updated));
          }
        } catch (e) {
          console.error('Failed to update chat history after delete', e);
        }
        return updated;
      });
    }
  };

  const chatEndRef = useRef(null);
  const sentimentAnalyzer = new Sentiment();
  const inputRef = useRef(null);

  const [toast, setToast] = useState({ show: false, text: "" });

  useEffect(() => {
    const handler = (e) => {
      const text = (e && e.detail && e.detail.text) || "Tersalin";
      setToast({ show: true, text });
      setTimeout(() => setToast({ show: false, text: "" }), 1600);
    };
    window.addEventListener("saipul_copy", handler);
    return () => window.removeEventListener("saipul_copy", handler);
  }, []);

  // Listen for external shortcut events to open settings or focus input
  useEffect(() => {
    const openHandler = () => onOpenSettings && onOpenSettings();
    const focusHandler = () => { if (inputRef && inputRef.current) inputRef.current.focus(); };

    window.addEventListener('saipul_open_settings', openHandler);
    window.addEventListener('saipul_focus_input', focusHandler);

    return () => {
      window.removeEventListener('saipul_open_settings', openHandler);
      window.removeEventListener('saipul_focus_input', focusHandler);
    };
  }, [onOpenSettings]);

  const analyzeSentiment = (text) => {
    const result = sentimentAnalyzer.analyze(text);
    if (result.score > 0) return "positive";
    if (result.score < 0) return "negative";
    return "neutral";
  };

  const handleSendWithSentiment = () => {
    const sentiment = analyzeSentiment(input);
    handleSend({ text: input, sentiment });
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md h-[80vh] bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
      {/* Header */}
      <ChatHeader onClose={onClose} onOpenSettings={onOpenSettings} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isTyping={index === messages.length - 1}
            getAccentGradient={getAccentGradient}
            sentiment={message.sentiment}
            handleQuickAction={handleQuickAction}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        {suggestions && suggestions.length > 0 && (
          <div className="mb-3">
            <Suggestions
              suggestions={suggestions}
              setInput={(s) => setInput(s)}
              onSelect={(s) => {
                // isi input lalu langsung kirim
                setInput(s);
                setTimeout(() => handleSendWithSentiment(), 80);
              }}
            />
          </div>
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          handleSend={handleSendWithSentiment}
          handleKeyDown={handleKeyDown}
        />
      </div>

      {/* Toast */}
      <div className="pointer-events-none">
        <div className={`fixed z-50 transition-opacity duration-200 ${toast.show ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute -bottom-16 right-8 bg-black/80 text-white text-xs px-3 py-2 rounded-md shadow-lg">
            {toast.text}
          </div>
        </div>
      </div>
    </div>
  );
}