import { useState, useRef, useEffect } from 'react';
import { Brain, X, Settings, Volume2, VolumeX, MoreVertical } from "lucide-react";

export function ChatHeader({ onClose, onOpenSettings, onToggleSpeech, onNewChat, onOpenHistory, ttsEnabled = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="flex items-center justify-between p-3" style={{ background: 'var(--saipul-accent)', color: 'var(--saipul-surface)' }}>
      <div className="flex items-center gap-2">
        <Brain size={20} />
        <div>
          <span className="font-bold">Live Chat</span>
          <div className="text-xs opacity-80">Customer Support</div>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(v => !v)}
          className="p-2 rounded-full transition"
          title="Lainnya"
          style={{ background: 'transparent', color: 'inherit' }}
        >
          <MoreVertical size={18} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded shadow-lg z-50" style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', border: '1px solid var(--saipul-border)' }}>
            <button
              className="w-full text-left px-3 py-2"
              onClick={() => { try { if (onNewChat) onNewChat(); } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)' }}
            >
              Obrolan Baru
            </button>
            <button
              className="w-full text-left px-3 py-2"
              onClick={() => { try { if (onOpenHistory) onOpenHistory(); } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)' }}
            >
              Riwayat
            </button>
            <button
              className="w-full text-left px-3 py-2"
              onClick={() => { try { if (onToggleSpeech) onToggleSpeech(); } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)' }}
            >
              {ttsEnabled ? 'Matikan Suara Otomatis' : 'Aktifkan Suara Otomatis'}
            </button>
            <button
              className="w-full text-left px-3 py-2"
              onClick={() => { try { window.location.href = '/live-cs/privacy'; } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)' }}
              aria-label="Buka halaman Privasi"
            >
              Privasi
            </button>
            <button
              className="w-full text-left px-3 py-2"
              onClick={() => { try { window.location.href = '/live-cs/security'; } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)' }}
              aria-label="Buka halaman Keamanan"
            >
              Keamanan
            </button>
            <button
              className="w-full text-left px-3 py-2"
              onClick={() => { try { if (onOpenSettings) onOpenSettings(); } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)' }}
            >
              Pengaturan
            </button>
            <button
              className="w-full text-left px-3 py-2 border-t"
              onClick={() => { try { if (onClose) onClose(); } catch (e) { void e; } setOpen(false); }}
              style={{ background: 'transparent', color: 'var(--saipul-text)', borderTop: '1px solid var(--saipul-border)' }}
            >
              Tutup Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}