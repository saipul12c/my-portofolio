import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "./hook/useChatbot";
import { useFileUpload } from "./hook/useFileUpload";
import { useSpeechRecognition } from "./hook/useSpeechRecognition";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { QuickActions } from "./components/QuickActions";
import { Suggestions } from "./components/Suggestions";
import { getSmartReply } from "./utils/responseGenerator";

export function ChatbotWindow({ onClose, onOpenSettings, knowledgeBase = {}, updateKnowledgeBase, knowledgeStats = {} }) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    isTyping,
    setIsTyping,
    suggestions,
    conversationContext,
    settings,
    activeQuickActions,
    handleSend,
    handleKeyDown,
    clearChat,
    exportChat,
    getAccentGradient,
    safeKnowledgeBase
  } = useChatbot(knowledgeBase, knowledgeStats);

  const {
    uploadProgress,
    fileUploadKey,
    setFileUploadKey,
    handleFileUpload
  } = useFileUpload(settings, updateKnowledgeBase, setMessages);

  const {
    isListening,
    startSpeechRecognition
  } = useSpeechRecognition(settings, setInput, handleSend);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleQuickAction = (action) => {
    if (action === "upload_file") {
      triggerFileUpload();
    } else {
      setInput(action);
    }
  };

  const generateBotReply = (userText) => {
    setIsTyping(true);

    const baseTime = settings.responseSpeed === 'fast' ? 600 : 
                    settings.responseSpeed === 'thorough' ? 1800 : 1000;
    
    const complexityMultiplier = userText.length > 50 ? 1.3 : 1;
    const knowledgeMultiplier = userText.includes('upload') || userText.includes('file') ? 1.2 : 1;
    const typingTime = baseTime * complexityMultiplier * knowledgeMultiplier;

    setTimeout(() => {
      try {
        const reply = getSmartReply(userText, settings, conversationContext, safeKnowledgeBase, knowledgeStats);
        const botMsg = { 
          from: "bot", 
          text: reply,
          timestamp: new Date().toISOString(),
          type: "response"
        };
        
        setMessages((prev) => [...prev, botMsg]);
        
        window.dispatchEvent(new CustomEvent('saipul_chat_update', {
          detail: { type: 'new_bot_message', message: botMsg }
        }));
      } catch (error) {
        console.error("Error generating bot reply:", error);
        setMessages((prev) => [...prev, { 
          from: "bot", 
          text: "❌ Maaf, terjadi error saat memproses permintaan Anda. Silakan coba lagi atau gunakan format yang berbeda.",
          timestamp: new Date().toISOString(),
          type: "error"
        }]);
      } finally {
        setIsTyping(false);
      }
    }, typingTime);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 right-6 bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-96 overflow-hidden backdrop-blur-md z-[9999]"
      >
        <ChatHeader
          onClose={onClose}
          onOpenSettings={onOpenSettings}
          triggerFileUpload={triggerFileUpload}
          exportChat={exportChat}
          clearChat={clearChat}
          getAccentGradient={getAccentGradient}
          settings={settings}
        />

        {uploadProgress > 0 && (
          <div className="h-1 bg-gray-700">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <QuickActions
          activeQuickActions={activeQuickActions}
          handleQuickAction={handleQuickAction}
        />

        <div className="max-h-80 overflow-y-auto p-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isTyping={false}
              getAccentGradient={getAccentGradient}
              settings={settings}
            />
          ))}

          {isTyping && (
            <ChatMessage
              message={{ from: "bot", text: "" }}
              isTyping={true}
              getAccentGradient={getAccentGradient}
              settings={settings}
            />
          )}

          <Suggestions
            suggestions={suggestions}
            setInput={setInput}
          />

          <div ref={chatEndRef} />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyDown={handleKeyDown}
          isListening={isListening}
          startSpeechRecognition={startSpeechRecognition}
          getAccentGradient={getAccentGradient}
        />

        <input
          key={fileUploadKey}
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.json,.csv,.md"
          multiple
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
}