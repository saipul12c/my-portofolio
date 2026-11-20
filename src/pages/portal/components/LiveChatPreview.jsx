import React, { useState, useEffect, memo } from 'react';
import { MdChat, MdForum } from 'react-icons/md';
import { supabase } from '../../../lib/supabaseClient';

const LiveChatPreview = memo(({ navigate, isMobile = false }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchChats = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, username, content, role, timestamp')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (!error && data && isMounted) {
          setRecentChats(data);
        }
      } catch (err) {
        console.warn('LiveChatPreview fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChats();

    const channel = supabase
      .channel('portal-chat-realtime-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (isMounted) {
            setRecentChats((prev) => [payload.new, ...prev].slice(0, 10));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          if (isMounted) {
            setRecentChats((prev) => prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg)));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          if (isMounted) {
            setRecentChats((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-800">
      <h3 className="text-sm sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <MdChat className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        Live Discussion {isMobile ? 'Preview' : ''}
      </h3>

      <div className="space-y-3 mb-4 sm:mb-6">
        {loading ? (
          <div className="py-6 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : recentChats.length > 0 ? (
          recentChats.map((chat, i) => (
            <div
              key={chat.id || i}
              className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                isMobile ? 'bg-gray-800/20' : 'hover:bg-gray-800/30'
              }`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5 select-none">
                {chat.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-white truncate">{chat.username || 'Anonim'}</span>
                  <span className="text-[9px] text-gray-500 bg-gray-800 px-1 py-0.2 rounded uppercase tracking-tight">
                    {chat.role || 'USER'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{chat.content || '...'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 space-y-2">
            <MdForum className="w-8 h-8 text-cyan-500/30 mx-auto" />
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Belum ada percakapan</p>
            <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed px-2">
              Jadilah yang pertama memulai diskusi di komunitas kami!
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/Live-Discussion')}
        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-semibold hover:border-cyan-500/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <MdForum className="w-4 h-4" />
        {isMobile ? 'Gabung Diskusi Sekarang →' : 'Gabung Diskusi →'}
      </button>
    </div>
  );
});

LiveChatPreview.displayName = 'LiveChatPreview';
export default LiveChatPreview;
