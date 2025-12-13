import { useState } from 'react';

export function useSpeechRecognition(settings, setInput) {
  const [isListening, setIsListening] = useState(false);

  const startSpeechRecognition = (onEndCallback) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser tidak mendukung speech recognition");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = settings && settings.language === 'id' ? 'id-ID' : 'en-US';

    recognition.start();
    setIsListening(true);

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setInput(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscript.trim()) {
        if (typeof onEndCallback === 'function') onEndCallback(finalTranscript.trim());
      }
    };

    return recognition;
  };

  return {
    isListening,
    startSpeechRecognition
  };
}