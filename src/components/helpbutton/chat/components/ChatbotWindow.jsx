import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useChatbot } from "./logic/hook/useChatbot";
import { ChatHeader } from "./logic/components/ChatHeader";
import { ChatMessage } from "./logic/components/ChatMessage";
import { ChatInput } from "./logic/components/ChatInput";
import ReportModal from "./logic/components/ReportModal";
import Sentiment from "sentiment";

export function ChatbotWindow({ onClose, onOpenSettings, knowledgeBase = {}, knowledgeStats = {} }) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSend,
    handleKeyDown,
    getAccentGradient,
    reportIssue,
    generateBotReply
  } = useChatbot(knowledgeBase, knowledgeStats);
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
      } catch {}
      setMessages((prev) => [...prev, {
        from: "user",
        text: `Laporan dikirim: ${JSON.stringify(reportData)}`,
        timestamp: new Date().toISOString(),
        type: "report"
      }]);
    }
  };

  const chatEndRef = useRef(null);
  const sentimentAnalyzer = new Sentiment();

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
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSendWithSentiment}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}