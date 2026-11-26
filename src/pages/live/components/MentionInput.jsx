import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AtSign, X, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient';

export const MentionInput = ({ value, onChange, onMention }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Search users in database with debounce (menggunakan RPC get_public_profiles agar aman dari privasi email RLS)
  const searchUsers = useCallback(async (query) => {
    if (!query || !isSupabaseConfigured || !supabase) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      let { data, error } = await supabase
        .rpc('get_public_profiles')
        .ilike('nama', `%${query}%`)
        .limit(5);

      if (error) {
        const fallback = await supabase
          .from('profiles')
          .select('id, nama, role')
          .ilike('nama', `%${query}%`)
          .limit(5);
        data = fallback.data;
        error = fallback.error;
      }

      if (!error) setSuggestions(data || []);
    } catch (err) {
      console.error('Mention search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Handle input change and detect @
  const handleInputChange = (e) => {
    const text = e.target.value;
    onChange(text);

    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const charBeforeAt = lastAtIndex === 0 ? '' : text[lastAtIndex - 1];
      if (charBeforeAt === '' || /\s/.test(charBeforeAt)) {
        const afterAt = text.substring(lastAtIndex + 1);
        if (/^[a-zA-Z0-9_]*$/.test(afterAt)) {
          setShowSuggestions(true);

          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => {
            searchUsers(afterAt);
          }, 180);
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

    if (onMention) onMention(user);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        handleSelectUser(suggestions[0]);
      } else {
        const form = e.target.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full group/mention">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Tulis sinyal... ketik @ untuk mention"
        className="w-full bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-2xl sm:rounded-3xl pl-11 sm:pl-12 lg:pl-14 pr-14 sm:pr-16 py-3 sm:py-4 lg:py-5 text-xs sm:text-sm text-[var(--theme-text)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all resize-none min-h-[48px] sm:min-h-[56px] lg:min-h-[60px] custom-scrollbar backdrop-blur-xl"
        rows="2"
      />

      {/* Suggestions Dropdown (Glassmorphism) */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-[#0f172a] border border-[var(--theme-border)] rounded-[2rem] shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-[var(--theme-border)] bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AtSign className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Target Operative</span>
              </div>
              {loading && <div className="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />}
            </div>

            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
              {suggestions.map((user) => (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full p-3 flex items-center gap-4 hover:bg-white/10 rounded-2xl transition-all group/item text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-300 font-black text-sm border border-white/5 group-hover/item:scale-110 transition-all">
                    {user.nama?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white italic tracking-tight">{user.nama}</p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{user.role}</p>
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
