import { motion } from "framer-motion";
import { Hash, Pin, Bell, BellOff, Users, Inbox, HelpCircle, Search, Plus, Gift, Image, Smile, Sticker, Menu, List } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ChannelSettings from './ChannelSettings';
import Modal from '../ui/Modal';
import { MessageReactions, ThreadView } from '../features';
import api from '../../lib/api';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { Sun } from 'lucide-react';

const ChatArea = ({ onOpenServers, onOpenChannels, onOpenMembers }) => {
  const [message, setMessage] = useState('');
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('notifications');
  const [openHelp, setOpenHelp] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [channelMuted, setChannelMuted] = useState(false);
  const messagesEndRef = useRef(null);
  const { selectedChannel, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const { members, sendTyping } = useChat();
  const [openThreadId, setOpenThreadId] = useState(null);

  const typingUsers = (members || []).filter(m => m.typing && String(m.id) !== String(user?.id));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedChannel) { setChannelMuted(false); return; }
      // Skip backend settings fetch for mock or synthetic channels (local/dev)
      if (selectedChannel.__mock || String(selectedChannel.id).startsWith('community-') || String(selectedChannel.id).startsWith('local-') || String(selectedChannel.id).startsWith('ch-')) {
        setChannelMuted(false);
        return;
      }
      try {
        const s = await api.channels.settings.get(selectedChannel.id).catch(() => null);
        if (!mounted) return;
        setChannelMuted(!!(s && s.muted));
      } catch (e) { console.error(e); }
    })();
    return () => { mounted = false; };
  }, [selectedChannel]);

  // Check AI availability
  useEffect(() => {
    (async () => {
      try {
        const cfg = await api.request('/api/ai/config').catch(() => null);
        setAiAvailable(!!(cfg && cfg.openai));
      } catch (e) { setAiAvailable(false); }
    })();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const tab = e?.detail?.tab || 'settings';
      setSettingsTab(tab);
      setOpenSettings(true);
    };
    window.addEventListener('discond:open-channel-settings', handler);
    return () => window.removeEventListener('discond:open-channel-settings', handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      try { sendTyping(false); } catch { }
      setMessage('');
    }
  };

  // typing debounce
  const typingTimeoutRef = useRef(null);
  const onInputChange = (val) => {
    setMessage(val);
    try {
      sendTyping(true);
    } catch { }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      try { sendTyping(false); } catch { }
    }, 1500);
  };

  if (!selectedChannel) {
    return (
      <div className="flex-1 bg-[var(--dc-bg)] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-[var(--dc-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Selamat Datang di Komuniti! 👋</h3>
            <p className="text-gray-400 max-w-md">
              Pilih server dan channel untuk mulai berkomunikasi dengan komunitas Indonesia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 bg-[var(--dc-bg)] flex flex-col">
      {/* Channel Header */}
      <div className="h-12 border-b border-[rgba(255,255,255,0.06)] px-4 flex items-center justify-between shadow-sm bg-[var(--dc-surface-2)]">
        <div className="flex items-center space-x-2">
          {/* Mobile controls: show on small screens only */}
          <div className="flex items-center space-x-2 md:hidden mr-2">
            <button onClick={() => onOpenServers?.()} className="p-2 text-gray-300 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => onOpenChannels?.()} className="p-2 text-gray-300 hover:text-white">
              <List className="w-5 h-5" />
            </button>
            <button onClick={() => onOpenMembers?.()} className="p-2 text-gray-300 hover:text-white">
              <Users className="w-5 h-5" />
            </button>
          </div>
            <Hash className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-semibold">{selectedChannel.name}</h3>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <p className="text-gray-400 text-sm">{selectedChannel.topic || 'Channel diskusi umum'}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button title={channelMuted ? 'Notifikasi (dibisukan)' : 'Notifikasi'} onClick={() => { setOpenSettings(true); setSettingsTab('notifications'); }} className="text-gray-400 hover:text-gray-300 transition-colors">
            {channelMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </button>
          <button onClick={() => { setOpenSettings(true); setSettingsTab('pins'); }} className="text-gray-400 hover:text-gray-300 transition-colors">
            <Pin className="w-5 h-5" />
          </button>
          <button onClick={() => { onOpenMembers?.(); setOpenSettings(true); setSettingsTab('members'); }} className="text-gray-400 hover:text-gray-300 transition-colors">
            <Users className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#202225] text-sm text-white px-2 py-1 rounded w-32 focus:w-40 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-2 top-1.5" />
          </div>
          
          <button onClick={() => { setOpenSettings(true); setSettingsTab('pins'); }} className="text-gray-400 hover:text-gray-300 transition-colors">
            <Inbox className="w-5 h-5" />
          </button>
          <button onClick={() => { setOpenHelp(true); }} className="text-gray-400 hover:text-gray-300 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button title="AI Assistant" onClick={() => setOpenAI(true)} className="text-gray-400 hover:text-gray-300 transition-colors">
            <Sun className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[var(--dc-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Selamat datang di #{selectedChannel.name}! 👋</h3>
          <p className="text-gray-400">
            Ini adalah awal dari channel #{selectedChannel.name}. Kirim pesan pertama Anda!
          </p>
        </div>

        {/* Messages (group consecutive messages from same author) */}
        {messages.map((msg, index) => {
          const prev = index > 0 ? messages[index - 1] : null;
          const sameAuthor = prev && prev.profiles && msg.profiles && prev.profiles.id && msg.profiles.id && String(prev.profiles.id) === String(msg.profiles.id);
          const member = members && members.find(m => String(m.id) === String(msg.user_id || (msg.profiles && msg.profiles.id)));
          return (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-3 p-2 message-item group"
            >
              <div className="flex-shrink-0">
                {!sameAuthor ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--dc-cyan)] relative">
                    {msg.profiles?.avatar_url ? (
                      <img alt={msg.profiles?.username || 'user'} src={msg.profiles.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                        {msg.profiles?.username?.substring(0, 2).toUpperCase() || 'US'}
                      </div>
                    )}
                    {/* presence badge */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[var(--dc-bg-2)]" style={{ backgroundColor: member && member.presence === 'online' ? 'var(--dc-accent)' : member && member.presence === 'idle' ? '#f59e0b' : member && member.presence === 'dnd' ? '#ef4444' : '#6b7280' }} />
                  </div>
                ) : (
                  <div className="w-10 h-10" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {!sameAuthor && (
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-white">
                      {msg.profiles?.username || 'Unknown User'}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {msg.created_at ? formatTime(msg.created_at) : 'Sekarang'}
                    </span>
                  </div>
                )}

                <p className={`mt-1 text-gray-300 ${sameAuthor ? 'ml-0' : ''}`}>
                  {msg.content}
                </p>

                {/* Reactions display */}
                {Array.isArray(msg.reactions) && msg.reactions.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {msg.reactions.map(r => (
                      <div key={r.emoji} className="flex items-center gap-1 bg-[#2f3136] text-sm text-gray-200 px-2 py-1 rounded cursor-pointer">
                        <span>{r.emoji}</span>
                        <span className="text-xs text-gray-300">{(r.users || []).filter(Boolean).length}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover actions: reactions and open thread */}
              <div className="ml-2 flex items-start">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <MessageReactions
                    messageId={msg.id}
                    onReact={(emoji, id) => {
                      try { api.messages.react(id || msg.id, emoji); } catch (err) { console.error('Failed to react', err); }
                    }}
                  />
                  <button title="Open thread" onClick={() => setOpenThreadId(msg.thread_id || msg.id)} className="p-1 bg-[var(--dc-surface)] rounded hover:bg-[var(--dc-surface-2)] text-gray-200">🧵</button>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <div className="flex -space-x-2">
              {typingUsers.slice(0,4).map(u => (
                <div key={u.id} className="w-6 h-6 rounded-full bg-[var(--dc-surface)] flex items-center justify-center text-xs text-white border border-[var(--dc-bg-2)]">{(u.username||u.name||'U').substring(0,2).toUpperCase()}</div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="italic">{typingUsers.length === 1 ? `${typingUsers[0].username || typingUsers[0].name} mengetik` : `${typingUsers.length} orang mengetik`}</span>
              <div className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="message-input rounded-lg px-4">
          <div className="flex items-center">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-300">
              <Plus className="w-5 h-5" />
            </button>

            <textarea
              value={message}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={`Message #${selectedChannel.name}`}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onBlur={() => { try { sendTyping(false); } catch { } }}
              className="flex-1 resize-none bg-transparent text-white py-2 px-2 focus:outline-none placeholder-gray-400"
            />
            
            <div className="flex items-center space-x-1">
              <button type="button" className="p-2 text-gray-400 hover:text-gray-300">
                <Gift className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-gray-300">
                <Image className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-gray-300">
                <Sticker className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-gray-300">
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-gray-400 px-4">
          Tekan Enter untuk mengirim • Shift+Enter untuk baris baru
        </div>
      </div>
      {openSettings && (
        <ChannelSettings channel={selectedChannel} openTab={settingsTab} onClose={() => setOpenSettings(false)} />
      )}

      {openHelp && (
        <Modal onClose={() => setOpenHelp(false)} size="sm">
          <div className="text-white">
            <h3 className="font-semibold text-lg mb-2">Bantuan Channel</h3>
            <p className="text-gray-300 text-sm">Ini adalah bantuan singkat untuk fitur channel. Klik ikon untuk mengakses pengaturan, pin, dan daftar anggota.</p>
            <div className="mt-4 text-right">
              <button onClick={() => setOpenHelp(false)} className="px-3 py-1 rounded bg-cyan-600">Tutup</button>
            </div>
          </div>
        </Modal>
      )}
      {openAI && (
        <Modal onClose={() => setOpenAI(false)} size="md">
          <div className="text-white">
            <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
            {!aiAvailable ? (
              <p className="text-yellow-300 text-sm mb-3">AI tidak dikonfigurasi pada server (OPENAI_API_KEY tidak tersedia).</p>
            ) : (
              <p className="text-gray-300 text-sm mb-3">Kirim prompt singkat, AI akan membalas di sini.</p>
            )}
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={4} className="w-full p-2 bg-[#242629] text-white rounded mb-2" placeholder="Tanyakan sesuatu atau minta ringkasan..." />
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => { setAiPrompt(''); setAiResponse(null); }} className="px-3 py-1 rounded bg-gray-700 text-white">Reset</button>
              <button disabled={!aiAvailable} onClick={async () => {
                if (!aiAvailable) return;
                if (!aiPrompt.trim()) return;
                setAiLoading(true); setAiResponse(null);
                try {
                  const res = await api.ai.chat({ prompt: aiPrompt });
                  setAiResponse(res?.data || res);
                } catch (err) {
                  setAiResponse({ error: err?.error || (err && err.message) || 'Request failed' });
                } finally { setAiLoading(false); }
              }} className={`px-3 py-1 rounded ${aiAvailable ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'}`}>{aiLoading ? 'Mengirim...' : 'Kirim'}</button>
            </div>
            <div className="mt-3">
              {aiResponse && (
                <pre className="whitespace-pre-wrap text-sm bg-[#101113] p-3 rounded text-gray-200">{JSON.stringify(aiResponse, null, 2)}</pre>
              )}
            </div>
          </div>
        </Modal>
      )}
      {openThreadId && (
        <Modal onClose={() => setOpenThreadId(null)} size="md">
          <div className="text-white">
            <ThreadView threadId={openThreadId} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChatArea;
