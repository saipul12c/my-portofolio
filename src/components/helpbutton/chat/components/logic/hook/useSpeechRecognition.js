import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom Hook untuk Web Speech API (Speech-to-Text / Voice Input)
 * Mendukung browser modern (Chrome, Edge, Safari, Opera)
 * 
 * Fitur & Proteksi:
 * - Anti InvalidStateError (double start protection)
 * - Anti memory leak (auto abort on unmount)
 * - Smart append transcript (tidak menimpa teks yang sudah diketik pengguna)
 * - Graceful error handling (menangani 'no-speech' dan 'aborted' secara halus tanpa alert())
 * - Language-aware (Bahasa Indonesia & English)
 */
export function useSpeechRecognition(arg1, arg2) {
  // Dukungan fleksibel: useSpeechRecognition(settings, setInput) atau useSpeechRecognition({ settings, input, setInput, inputRef })
  const isObjectConfig = arg1 && typeof arg1 === 'object' && !('language' in arg1) && ('setInput' in arg1 || 'onTranscript' in arg1);
  const settings = isObjectConfig ? arg1.settings : arg1;
  const setInput = isObjectConfig ? arg1.setInput : arg2;
  const inputRef = isObjectConfig ? arg1.inputRef : null;

  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [speechLang, setSpeechLang] = useState(() => 
    (settings?.voiceLanguage === 'en' || settings?.language === 'en') ? 'en-US' : 'id-ID'
  );
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');

  // Sinkronkan bahasa default saat pengaturan bahasa berubah
  useEffect(() => {
    if (settings?.voiceLanguage === 'en' || settings?.language === 'en') {
      setSpeechLang('en-US');
    } else if (settings?.voiceLanguage === 'id' || settings?.language === 'id') {
      setSpeechLang('id-ID');
    }
  }, [settings?.voiceLanguage, settings?.language]);

  const toggleSpeechLang = useCallback(() => {
    setSpeechLang(prev => prev === 'en-US' ? 'id-ID' : 'en-US');
  }, []);

  // Periksa dukungan SpeechRecognition di browser
  const isSupported = typeof window !== 'undefined' && 
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Bersihkan recognition saat komponen di-unmount (Mencegah Memory Leak)
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Abaikan error saat cleanup
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  // Hentikan perekaman suara secara aman
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    }
    setIsListening(false);
  }, []);

  // Mulai perekaman suara
  const startListening = useCallback((onEndCallback, currentInput = '') => {
    if (!isSupported) {
      const msg = 'Browser Anda belum mendukung Speech Recognition. Gunakan Chrome, Edge, atau Safari.';
      setError(msg);
      console.warn(msg);
      return null;
    }

    // Jika sedang aktif, hentikan instans lama untuk mencegah InvalidStateError
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    setError(null);
    baseTextRef.current = typeof currentInput === 'string' ? currentInput : '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Tentukan bahasa dari pengaturan chat atau toggle aktif
    const lang = speechLang || ((settings?.voiceLanguage === 'en' || settings?.language === 'en') ? 'en-US' : 'id-ID');
    recognition.lang = lang;

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const text = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + text.trim();
        } else {
          interimTranscript += text;
        }
      }

      const spokenText = finalTranscript + (interimTranscript ? (finalTranscript ? ' ' : '') + interimTranscript : '');
      
      if (typeof setInput === 'function') {
        // Gabungkan dengan teks dasar yang sudah ada di input (tidak menimpa teks lama)
        const combined = baseTextRef.current
          ? `${baseTextRef.current.trim()} ${spokenText}`.trim()
          : spokenText;
        setInput(combined);
      }
    };

    recognition.onerror = (event) => {
      // Error no-speech dan aborted adalah kejadian normal saat pengguna diam atau membatalkan
      if (event.error === 'no-speech' || event.error === 'aborted') {
        setIsListening(false);
        return;
      }

      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setError(
        event.error === 'not-allowed'
          ? 'Izin mikrofon ditolak. Silakan izinkan akses mikrofon di browser Anda.'
          : `Gagal merekam suara (${event.error})`
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;

      if (finalTranscript.trim() && typeof onEndCallback === 'function') {
        onEndCallback(finalTranscript.trim());
      }

      // Fokuskan kembali kursor ke input
      if (inputRef?.current) {
        inputRef.current.focus();
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn('Gagal memulai speech recognition:', err);
      setIsListening(false);
      recognitionRef.current = null;
      setError('Gagal mengaktifkan mikrofon.');
    }

    return recognition;
  }, [isSupported, settings, setInput, inputRef, speechLang]);

  // Toggle antara mendengarkan dan berhenti
  const toggleListening = useCallback((onEndCallback, currentInput = '') => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onEndCallback, currentInput);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    error,
    speechLang,
    toggleSpeechLang,
    setSpeechLang,
    startListening,
    stopListening,
    toggleListening,
    // Alias untuk kompatibilitas fungsi lama
    startSpeechRecognition: startListening
  };
}
