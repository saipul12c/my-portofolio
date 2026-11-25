import { useRef, useEffect } from "react";
import { Send, Paperclip, Loader2, Mic, MicOff } from "lucide-react";
import { AI_DOCS_PATH, CHATBOT_VERSION } from '../../../config';
import { useSpeechRecognition } from '../hook/useSpeechRecognition';

export function ChatInput({
  input,
  setInput,
  handleSend,
  inputRef,
  handleKeyDown,
  onFileUpload,
  isUploading = false,
  settings
}) {
  const attachmentInputRef = useRef(null);

  useEffect(() => {
    const handleOpenUpload = () => {
      if (typeof onFileUpload === 'function' && !isUploading) {
        attachmentInputRef.current?.click();
      }
    };
    window.addEventListener('saipul_open_upload', handleOpenUpload);
    return () => window.removeEventListener('saipul_open_upload', handleOpenUpload);
  }, [onFileUpload, isUploading]);

  // Integrasi Web Speech API (Speech-to-Text)
  const {
    isListening,
    isSupported,
    toggleListening,
    error: speechError,
    speechLang,
    toggleSpeechLang
  } = useSpeechRecognition({
    settings,
    setInput,
    inputRef
  });

  const isEn = settings?.language === 'en';
  const handleMicClick = () => {
    toggleListening(null, input);
  };

  return (
    <div className="p-2 sm:p-3" style={{ background: 'var(--saipul-surface)', borderTop: '1px solid var(--saipul-border)' }}>
      {/* Input File Tersembunyi untuk Lampiran Dokumen Langsung */}
      <input
        type="file"
        ref={attachmentInputRef}
        onChange={onFileUpload}
        multiple
        accept={(settings?.allowedFileTypes?.length ? settings.allowedFileTypes : ['txt', 'md', 'csv', 'json', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']).map(ext => `.${String(ext).replace(/^\./, '')}`).join(',')}
        className="hidden"
      />

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Tombol Lampiran Dokumen */}
        {typeof onFileUpload === 'function' && (
          <button
            type="button"
            onClick={() => attachmentInputRef.current?.click()}
            disabled={isUploading || isListening}
            title={isEn ? "Attach documents (TXT, MD, CSV, JSON, PDF, etc)" : "Lampirkan dokumen (TXT, MD, CSV, JSON, dll)"}
            className="p-2 rounded-lg transition-colors hover:brightness-110 active:scale-95 flex items-center justify-center border"
            style={{
              borderColor: 'var(--saipul-border)',
              background: 'var(--saipul-bg-card, var(--saipul-surface))',
              color: 'var(--saipul-accent)',
              opacity: isUploading || isListening ? 0.6 : 1
            }}
          >
            {isUploading ? (
              <Loader2 size={18} className="animate-spin text-[var(--saipul-accent)]" />
            ) : (
              <Paperclip size={18} />
            )}
          </button>
        )}

        {/* Tombol Input Suara / Speech Recognition */}
        {isSupported && (
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isUploading}
              title={isListening
                ? (isEn ? `Listening (${speechLang === 'en-US' ? 'English' : 'Indonesian'})... Click to stop` : `Sedang mendengarkan (${speechLang === 'en-US' ? 'English' : 'Indonesia'})... Klik untuk berhenti`)
                : (isEn ? `Voice input (${speechLang === 'en-US' ? 'English' : 'Indonesian'})` : `Bicara dengan suara (${speechLang === 'en-US' ? 'English' : 'Bahasa Indonesia'})`)}
              className={`p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center border ${isListening ? 'animate-pulse ring-2 ring-red-500 shadow-md shadow-red-500/30' : 'hover:brightness-110'
                }`}
              style={{
                borderColor: isListening ? '#ef4444' : 'var(--saipul-border)',
                background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'var(--saipul-bg-card, var(--saipul-surface))',
                color: isListening ? '#ef4444' : 'var(--saipul-accent)',
                opacity: isUploading ? 0.6 : 1
              }}
            >
              {isListening ? <MicOff size={18} className="text-red-500" /> : <Mic size={18} />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof toggleSpeechLang === 'function') toggleSpeechLang();
              }}
              title={isEn ? `Current voice language: ${speechLang === 'en-US' ? 'English' : 'Indonesian'}. Click to switch.` : `Bahasa suara saat ini: ${speechLang === 'en-US' ? 'English' : 'Bahasa Indonesia'}. Klik untuk beralih.`}
              className="absolute -top-1.5 -right-1 px-1 py-0.2 rounded-full text-[9px] font-bold border shadow-sm transition-transform hover:scale-110 active:scale-95 select-none"
              style={{
                background: 'var(--saipul-surface)',
                borderColor: 'var(--saipul-border)',
                color: 'var(--saipul-accent)',
                lineHeight: '12px'
              }}
            >
              {speechLang === 'en-US' ? 'EN' : 'ID'}
            </button>
          </div>
        )}

        {/* Input Teks Pesan */}
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? (isEn ? "Listening to your voice..." : "Mendengarkan suara Anda...")
              : isUploading
                ? (isEn ? "Uploading & processing files..." : "Mengunggah & memproses berkas...")
                : (isEn ? "Type a message or ask anything..." : "Tulis pesan atau tanya seputar dokumen...")
          }
          className={`flex-grow p-2 border rounded-lg focus:outline-none text-sm sm:text-base transition-colors ${isListening ? 'ring-1 ring-red-400 placeholder:text-red-400' : ''
            }`}
          style={{ borderColor: isListening ? '#ef4444' : 'var(--saipul-border)', background: 'var(--saipul-surface)', color: 'var(--saipul-text)' }}
        />

        {/* Tombol Kirim Pesan */}
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          title={isEn ? "Send message" : "Kirim pesan"}
          className="p-2 sm:p-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center"
          style={{ background: 'var(--saipul-accent)', color: 'var(--saipul-surface)', opacity: !input.trim() ? 0.5 : 1 }}
        >
          <Send size={18} />
        </button>
      </div>

      {speechError && (
        <div className="mt-1 text-xs text-red-400">
          ⚠️ {speechError}
        </div>
      )}

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
