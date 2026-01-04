import { Send } from "lucide-react";
import { AI_DOCS_PATH, CHATBOT_VERSION } from '../../../config';

export function ChatInput({ input, setInput, handleSend, inputRef, handleKeyDown }) {
  return (
    <div className="p-2 sm:p-3" style={{ background: 'var(--saipul-surface)', borderTop: '1px solid var(--saipul-border)' }}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          className="flex-grow p-2 border rounded-lg focus:outline-none text-sm sm:text-base"
          style={{ borderColor: 'var(--saipul-border)', background: 'var(--saipul-surface)', color: 'var(--saipul-text)' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 sm:p-2 rounded-lg"
          style={{ background: 'var(--saipul-accent)', color: 'var(--saipul-surface)', opacity: !input.trim() ? 0.5 : 1 }}
        >
          <Send size={18} />
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--saipul-muted)', textAlign: 'left' }}>
        SaipulAI dapat melakukan kesalahan, periksa kembali V{' '}
        <a
          href={AI_DOCS_PATH}
          style={{ textDecoration: 'none', color: 'var(--saipul-accent)', cursor: 'pointer', borderBottom: '1px dashed transparent' }}
          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
          onMouseLeave={e => e.target.style.textDecoration = 'none'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CHATBOT_VERSION}
        </a>
      </div>
    </div>
  );
}