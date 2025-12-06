import { Send } from "lucide-react";
import { AI_DOCS_PATH, CHATBOT_VERSION } from '../../../config';

export function ChatInput({ input, setInput, handleSend }) {
  return (
    <div className="p-3 bg-gray-200 border-t border-gray-300">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ color: '#111', backgroundColor: '#fff' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#444', textAlign: 'left' }}>
        SaipulAI dapat melakukan kesalahan, periksa kembali V{' '}
        <a
          href={AI_DOCS_PATH}
          style={{ textDecoration: 'none', color: '#007BFF', cursor: 'pointer', borderBottom: '1px dashed transparent' }}
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