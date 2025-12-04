import { motion } from "framer-motion";
import { Hash, Pin, Bell, Users, Inbox, HelpCircle, Search, Plus, Gift, Image, Smile, Sticker } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const ChatArea = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { selectedChannel, messages, sendMessage } = useChat();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  if (!selectedChannel) {
    return (
      <div className="flex-1 bg-[#36393f] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#40444b] rounded-full flex items-center justify-center mx-auto mb-4">
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
    <div className="flex-1 bg-[#36393f] flex flex-col">
      {/* Channel Header */}
      <div className="h-12 border-b border-gray-700 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-semibold">{selectedChannel.name}</h3>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <p className="text-gray-400 text-sm">{selectedChannel.topic || 'Channel diskusi umum'}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <Pin className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
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
          
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <Inbox className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#40444b] rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Selamat datang di #{selectedChannel.name}! 👋</h3>
          <p className="text-gray-400">
            Ini adalah awal dari channel #{selectedChannel.name}. Kirim pesan pertama Anda!
          </p>
        </div>

        {/* Messages */}
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-3 p-2 hover:bg-[#2f3136] rounded group"
          >
            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-cyan-600">
              {msg.profiles?.avatar_url ? (
                <img alt={msg.profiles?.username || 'user'} src={msg.profiles.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                  {msg.profiles?.username?.substring(0, 2).toUpperCase() || 'US'}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold text-white">
                  {msg.profiles?.username || 'Unknown User'}
                </span>
                <span className="text-gray-400 text-xs">
                  {msg.created_at ? formatTime(msg.created_at) : 'Sekarang'}
                </span>
              </div>
              
              <p className="mt-1 text-gray-300">
                {msg.content}
              </p>
            </div>
          </motion.div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-[#40444b] rounded-lg px-4">
          <div className="flex items-center">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-300">
              <Plus className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${selectedChannel.name}`}
              className="flex-1 bg-transparent text-white py-3 px-2 focus:outline-none placeholder-gray-400"
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
    </div>
  );
};

export default ChatArea;