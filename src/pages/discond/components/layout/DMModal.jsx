import { useEffect, useState, useRef } from 'react';
import Modal from '../ui/Modal';
import api from '../../lib/api';
import { io } from 'socket.io-client';

export default function DMModal({ dmId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.dm.messages.list(dmId).catch(() => null);
        if (!mounted) return;
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (dmId) load();
    // setup socket for realtime messages
    const base = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : undefined;
    let socket;
    try {
      socket = io(base, { withCredentials: true });
      socket.on('dm_message', (msg) => {
        if (msg && String(msg.dm_id || msg.dmId || msg.conversation_id) === String(dmId)) {
          setMessages(prev => [...prev, msg]);
        }
      });
    } catch (e) { socket = null; }

    return () => { mounted = false; if (socket) try { socket.disconnect(); } catch {} };
  }, [dmId]);

  const post = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.dm.messages.post(dmId, { content: text.trim() });
      // append locally for responsiveness
      setMessages(prev => [...prev, { id: `local-${Date.now()}`, content: text.trim(), created_at: new Date().toISOString() }]);
      setText('');
    } catch (e) {
      console.error('DM send failed', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal onClose={onClose} size="lg">
      <div className="flex flex-col h-[60vh]">
        <div className="flex-1 overflow-auto p-3 bg-[#2f3136] rounded mb-3">
          {loading ? (
            <div className="text-gray-300">Memuat pesan...</div>
          ) : (
            messages.map(m => (
              <div key={m.id} className="mb-2">
                <div className="text-sm text-gray-300">{m.profiles?.username || m.username || m.from || 'Pengguna'}</div>
                <div className="text-white bg-[#40444b] inline-block rounded px-3 py-2 mt-1">{m.content}</div>
                <div className="text-xs text-gray-500 mt-1">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 bg-[#40444b] rounded px-3 py-2 text-white" placeholder="Ketik pesan..." />
          <button onClick={post} disabled={sending || !text.trim()} className="px-3 py-2 bg-cyan-600 text-white rounded">{sending ? 'Mengirim...' : 'Kirim'}</button>
        </div>
      </div>
    </Modal>
  );
}
