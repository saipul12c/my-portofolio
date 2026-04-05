import React, { useState, useRef, useEffect } from 'react';
import { AtSign, X, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabaseClient';

export const MentionInput = ({ value, onChange, onMention }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Search users in database (Secure profile lookup)
  const searchUsers = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nama, role')
        .ilike('nama', `%${query}%`)
        .limit(5);

      if (!error) setSuggestions(data || []);
    } catch (err) {
      console.error('Mention search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change and detect @
  const handleInputChange = (e) => {
    const text = e.target.value;
    onChange(text);

    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      // Ensure there's no space before @ (except start of string)
      const charBeforeAt = lastAtIndex === 0 ? '' : text[lastAtIndex - 1];
      if (charBeforeAt === '' || /\s/.test(charBeforeAt)) {
        const afterAt = text.substring(lastAtIndex + 1);
        if (/^[a-zA-Z0-9_]*$/.test(afterAt)) {
          setSearchQuery(afterAt);
          searchUsers(afterAt);
          setShowSuggestions(true);
          return;
        }
      }
    }
    setShowSuggestions(false);
  };

  const handleSelectUser = (user) => {
    const lastAtIndex = value.lastIndexOf('@');
    const beforeAt = value.substring(0, lastAtIndex);
    const newValue = beforeAt + `@${user.nama} `;
    
    onChange(newValue);
    setShowSuggestions(false);
    setSearchQuery('');
    
    if (onMention) onMention(user);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full group/mention">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder="Tulis sinyal... gunakan @nama untuk mention"
        className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-8 py-5 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all resize-none min-h-[60px] custom-scrollbar backdrop-blur-xl"
        rows="2"
      />

      {/* Suggestions Dropdown (Glassmorphism) */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AtSign className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Target Operative</span>
              </div>
              {loading && <div className="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />}
            </div>

            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
              {suggestions.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full p-3 flex items-center gap-4 hover:bg-white/5 rounded-2xl transition-all group/item text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-white/40 font-black text-sm border border-white/5 group-hover/item:scale-110 transition-all">
                    {user.nama?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white italic tracking-tight">{user.nama}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{user.role}</p>
                  </div>
                  <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <Check className="w-4 h-4 text-cyan-400" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
