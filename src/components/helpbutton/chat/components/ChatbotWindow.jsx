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
    suggestionsVisible,
    closeSuggestions,
    closeSuggestionsForCurrent,
    choosePreferredResponse,
    recordFeedback,
    handleSend,
    handleKeyDown,
    clearChat,
    getAccentGradient,
    generateBotReply,
    settings } = useChatbot(knowledgeBase, knowledgeStats);
  // Handler untuk quick actions (like, dislike, regenerate, report)
  const handleQuickAction = (action, messageId, extra) => {
    
      if (action === "like") {
      setMessages((prev) => prev.map((msg) =>
        msg.id === messageId ? { ...msg, liked: true, disliked: false } : msg
      ));
      try { recordFeedback(messageId, 'like'); } catch (e) { void e; }
    } else if (action === "dislike") {
      setMessages((prev) => prev.map((msg) =>
        msg.id === messageId ? { ...msg, disliked: true, liked: false } : msg
      ));
      try { recordFeedback(messageId, 'dislike'); } catch (e) { void e; }
    } else if (action === "regenerate") {
      // Regenerate response for bot message: use the user prompt that preceded this bot reply
      const msgIndex = messages.findIndex((m) => m.id === messageId);
      if (msgIndex !== -1) {
        // find previous user message before this bot reply
        let userText = null;
        for (let i = msgIndex - 1; i >= 0; i--) {
          if (messages[i] && messages[i].from === 'user' && messages[i].text) { userText = messages[i].text; break; }
        }
        // fallback: if no user message found, do not regenerate using bot text (to avoid duplication)
        if (userText) {
          generateBotReply(userText, { replaceMessageId: messageId });
          try { recordFeedback(messageId, 'regen'); } catch (e) { void e; }
        } else {
          // no preceding user prompt found; optionally show a small toast or ignore
          console.warn('Regenerate: no preceding user prompt found for message', messageId);
        }
      }
    } else if (action === "report") {
      // Dispatch centralized report event; useChatbot will persist/enrich it
        try {
          const payload = { messageId, ...(extra || {}), timestamp: new Date().toISOString() };
          window.dispatchEvent(new CustomEvent('saipul_chat_report', { detail: payload }));
          try { recordFeedback(messageId, 'report'); } catch (e) { void e; }
        } catch (e) {
          console.error('Failed to dispatch report event', e);
        }
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
      } else if (action === 'prefer_response') {
        try {
          if (typeof choosePreferredResponse === 'function') choosePreferredResponse(messageId, extra || {});
        } catch (e) { console.error('prefer_response error', e); }
        return;
      } else if (action === 'upload_file') {
        // Open settings and switch to Files tab so user can upload
        try {
          if (onOpenSettings) onOpenSettings();
          window.dispatchEvent(new CustomEvent('saipul_open_settings_tab', { detail: { tab: 'files' } }));
        } catch (e) { void e; }
      } else if (typeof action === 'string' && action && !['like','dislike','regenerate','report','delete'].includes(action)) {
        // Treat remaining string actions as quick prompts: fill input and send
        try {
          setInput(action);
          setTimeout(() => handleSendWithSentiment(), 80);
        } catch (e) { console.error('Error executing quick action prompt', e); }
      }
  };

  const chatEndRef = useRef(null);
  const sentimentAnalyzer = new Sentiment();
  const inputRef = useRef(null);

  const [toast, setToast] = useState({ show: false, text: "" });
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState(() => { try { return JSON.parse(localStorage.getItem('saipul_chat_sessions') || '[]'); } catch (e) { void e; return []; } });

  useEffect(() => {
    const handler = (e) => {
      const text = (e && e.detail && e.detail.text) || "Tersalin";
      setToast({ show: true, text });
      setTimeout(() => setToast({ show: false, text: "" }), 1600);
    };
    window.addEventListener("saipul_copy", handler);
    return () => window.removeEventListener("saipul_copy", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const count = e?.detail?.count;
      const text = `Preferensi tersimpan${count ? ` (total: ${count})` : ''}`;
      setToast({ show: true, text });
      setTimeout(() => setToast({ show: false, text: '' }), 2000);
    };
    window.addEventListener('saipul_preference_saved', handler);
    return () => window.removeEventListener('saipul_preference_saved', handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      try { setSessions(JSON.parse(localStorage.getItem('saipul_chat_sessions') || '[]')); } catch (e) { void e; setSessions([]); }
    };
    window.addEventListener('saipul_sessions_updated', handler);
    return () => window.removeEventListener('saipul_sessions_updated', handler);
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

  const saveCurrentSession = () => {
    try {
      if (!messages || messages.length === 0) return null;
      if (settings && settings.privacyMode) {
        // do not persist when privacyMode
        return null;
      }
      const existing = JSON.parse(localStorage.getItem('saipul_chat_sessions') || '[]');
      const title = (messages.find(m => m.from === 'user' && m.text && m.text.length > 0)?.text || messages[0]?.text || '').slice(0, 120);
      const session = {
        id: `sess_${Date.now()}`,
        title: title || `Sesi ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages,
        settingsSnapshot: settings || {}
      };
      existing.push(session);
      // cap sessions to last 50
      while (existing.length > 50) existing.shift();
      localStorage.setItem('saipul_chat_sessions', JSON.stringify(existing));
      try { window.dispatchEvent(new CustomEvent('saipul_sessions_updated', { detail: { count: existing.length } })); } catch (_e) { void _e; }
      setSessions(existing);
      return session;
    } catch (e) { console.error('saveCurrentSession error', e); return null; }
  };

  const handleNewChat = () => {
    try {
      saveCurrentSession();
      // clear chat UI
      if (typeof clearChat === 'function') clearChat();
      setToast({ show: true, text: 'Obrolan baru dimulai' });
      setTimeout(() => setToast({ show: false, text: '' }), 1400);
    } catch (e) { console.error('handleNewChat', e); }
  };

  const openHistory = () => setShowHistory(true);

  const loadSession = (id) => {
    try {
      const all = JSON.parse(localStorage.getItem('saipul_chat_sessions') || '[]');
      const s = all.find(x => x.id === id);
      if (s && s.messages) {
        setMessages(s.messages);
        setShowHistory(false);
      }
    } catch (e) { console.error('loadSession', e); }
  };

  const deleteSession = (id) => {
    try {
      const all = JSON.parse(localStorage.getItem('saipul_chat_sessions') || '[]');
      const next = all.filter(x => x.id !== id);
      localStorage.setItem('saipul_chat_sessions', JSON.stringify(next));
      setSessions(next);
      try { window.dispatchEvent(new CustomEvent('saipul_sessions_updated', { detail: { count: next.length } })); } catch (_e) { void _e; }
    } catch (e) { console.error('deleteSession', e); }
  };

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
    <div className="saipul-chat-root fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 w-full sm:max-w-md max-h-[92vh] h-full sm:h-[80vh] shadow-lg rounded-none sm:rounded-lg flex flex-col overflow-hidden mx-0 sm:mx-0" style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Header */}
      <ChatHeader
        onClose={onClose}
        onOpenSettings={onOpenSettings}
        onNewChat={handleNewChat}
        onOpenHistory={openHistory}
        onToggleSpeech={() => { try { window.dispatchEvent(new Event('saipul_toggle_speech')); } catch (e) { void e; } }}
        ttsEnabled={!!(settings && settings.voiceResponse)}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {(() => {
          const lastBotIndex = (() => {
            for (let i = messages.length - 1; i >= 0; i--) {
              const m = messages[i];
              if (m && m.from === 'bot' && m.type !== 'error') return i;
            }
            return -1;
          })();

          return messages.map((message, index) => (
            <div key={message.id || index}>
              <ChatMessage
                message={message}
                isTyping={index === messages.length - 1}
                getAccentGradient={getAccentGradient}
                sentiment={message.sentiment}
                handleQuickAction={handleQuickAction}
              />
              {index === lastBotIndex && suggestions && suggestions.length > 0 && suggestionsVisible && (
                <div className="mt-2 mb-3 p-2 rounded-md bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-300">Saran pertanyaan</div>
                    <button onClick={() => { try { if (closeSuggestionsForCurrent) closeSuggestionsForCurrent(); else if (closeSuggestions) closeSuggestions(); } catch (e) { void e; } }} className="text-xs text-gray-400">Tutup</button>
                  </div>
                  <Suggestions
                    suggestions={suggestions}
                    setInput={(s) => setInput(s)}
                    onSelect={(s) => {
                      setInput(s);
                      setTimeout(() => handleSendWithSentiment(), 80);
                    }}
                  />
                </div>
              )}
            </div>
          ));
        })()}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4" style={{ background: 'var(--saipul-surface)', borderTop: '1px solid var(--saipul-border)' }}>
        {/* suggestions are shown below bot replies; input area only contains ChatInput */}
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
          <div className="bottom-6 left-1/2 transform -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-8 md:right-12 fixed bg-black/80 text-white text-xs px-3 py-2 rounded-md shadow-lg">
            {toast.text}
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full h-full sm:h-auto max-w-lg bg-var(--saipul-modal-bg) rounded-none sm:rounded-lg p-4" style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', border: '1px solid var(--saipul-border)' }}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Riwayat Obrolan</h4>
              <div className="flex gap-2">
                <button onClick={() => { setShowHistory(false); }} className="text-sm px-2 py-1">Tutup</button>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {sessions.length === 0 && <div className="text-sm text-gray-400">Belum ada sesi tersimpan.</div>}
              {sessions.slice().reverse().map(s => (
                <div key={s.id} className="p-2 border rounded flex justify-between items-start bg-gray-800/20">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-gray-400">{new Date(s.timestamp).toLocaleString()} • {s.messageCount} pesan</div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button onClick={() => loadSession(s.id)} className="px-2 py-1 text-xs rounded" aria-label={`Muat sesi ${s.title}`}>Muat</button>
                    <button onClick={() => { deleteSession(s.id); }} className="px-2 py-1 text-xs rounded text-red-400" aria-label={`Hapus sesi ${s.title}`}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}