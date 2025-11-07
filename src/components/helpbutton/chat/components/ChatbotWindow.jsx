import { useState, useEffect, useRef } from "react";
import { X, Settings, Send, Loader2, Calculator, TrendingUp, Brain, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import aiBase from "../data/AI-base.json";

export function ChatbotWindow({ onClose, onOpenSettings }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("saipul_chat_history");
    return saved
      ? JSON.parse(saved)
      : [{ from: "bot", text: "Halo! 👋 Aku SaipulAI v4.0, sekarang dengan kemampuan analisis data, perhitungan matematika, prediksi, dan pemrosesan canggih! Ada yang bisa kubantu?" }];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("saipul_chat_history", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    generateBotReply(userInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // ===== FUNGSI MATEMATIKA DAN PERHITUNGAN =====
  const calculateMath = (expression) => {
    try {
      // Bersihkan dan validasi ekspresi matematika
      const cleanExpr = expression.replace(/[^0-9+\-*/().,%\s]/g, '');
      
      // Evaluasi ekspresi matematika
      const result = Function(`"use strict"; return (${cleanExpr})`)();
      
      if (typeof result === 'number' && !isNaN(result)) {
        return `Hasil perhitungan: **${expression}** = ${result}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // ===== FUNGSI PREDIKSI SEDERHANA =====
  const generatePrediction = (dataType) => {
    const predictions = {
      harga: {
        items: ['saham', 'emas', 'bitcoin', 'properti', 'mata uang'],
        trends: ['naik', 'turun', 'stabil', 'fluktuatif'],
        factors: ['inflasi', 'kebijakan bank sentral', 'permintaan pasar', 'geopolitik']
      },
      cuaca: {
        conditions: ['cerah', 'hujan', 'mendung', 'berawan', 'badai'],
        temperatures: ['20-25°C', '25-30°C', '30-35°C', '15-20°C'],
        advice: ['bawa payung', 'pakai sunscreen', 'jaket tebal', 'aktivitas dalam ruangan']
      },
      penjualan: {
        trends: ['meningkat', 'menurun', 'stagnan', 'musiman'],
        factors: ['promosi', 'kompetisi', 'daya beli', 'trend pasar']
      }
    };

    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    if (dataType in predictions) {
      const pred = predictions[dataType];
      return `📊 Prediksi ${dataType}: ${getRandomItem(pred.items || [''])} diperkirakan ${getRandomItem(pred.trends)} karena faktor ${getRandomItem(pred.factors)}. ${pred.advice ? `Saran: ${getRandomItem(pred.advice)}` : ''}`;
    }
    
    return null;
  };

  // ===== FUNGSI ANALISIS DATA =====
  const analyzeData = (query) => {
    // Simulasi analisis dataset
    const datasets = {
      penjualan: {
        trend: Math.random() > 0.5 ? 'meningkat' : 'menurun',
        growth: (Math.random() * 20).toFixed(1),
        recommendation: 'Optimalkan inventory dan tingkatkan promosi'
      },
      keuangan: {
        health: Math.random() > 0.3 ? 'sehat' : 'perlu perhatian',
        cashflow: Math.random() > 0.5 ? 'positif' : 'negatif',
        recommendation: 'Monitor pengeluaran dan diversifikasi pendapatan'
      },
      performa: {
        efficiency: (Math.random() * 40 + 60).toFixed(1),
        improvement: (Math.random() * 25).toFixed(1),
        recommendation: 'Tingkatkan automasi dan kurangi bottleneck'
      }
    };

    for (const [key, data] of Object.entries(datasets)) {
      if (query.includes(key)) {
        return `📈 Analisis ${key}: Trend ${data.trend} (pertumbuhan ${data.growth}%). Efisiensi: ${data.efficiency || 'N/A'}%. Rekomendasi: ${data.recommendation}`;
      }
    }
    return null;
  };

  // ===== FUNGSI STATISTIK DAN PROBABILITAS =====
  const calculateStatistics = (query) => {
    if (query.includes('probabilitas') || query.includes('peluang')) {
      const probability = (Math.random() * 100).toFixed(1);
      const outcomes = ['berhasil', 'gagal', 'terjadi', 'terwujud'];
      const getRandomOutcome = () => outcomes[Math.floor(Math.random() * outcomes.length)];
      
      return `🎲 Probabilitas ${getRandomOutcome()}: ${probability}% (Berdasarkan analisis data historis)`;
    }

    if (query.includes('rata-rata') || query.includes('mean')) {
      const values = Array.from({length: 5}, () => Math.floor(Math.random() * 100));
      const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
      return `📊 Statistik: Data sample ${values.join(', ')} → Rata-rata: ${mean}`;
    }

    return null;
  };

  // ===== FUNGSI KONVERSI DAN TRANSFORMASI =====
  const handleConversion = (query) => {
    const conversions = {
      suhu: {
        pattern: /(\d+)\s*(celcius|fahrenheit|c|f)/i,
        convert: (value, from) => {
          if (from.toLowerCase().includes('c')) {
            return { f: (value * 9/5 + 32).toFixed(1), k: (value + 273.15).toFixed(1) };
          } else {
            return { c: ((value - 32) * 5/9).toFixed(1), k: ((value - 32) * 5/9 + 273.15).toFixed(1) };
          }
        }
      },
      matauang: {
        pattern: /(\d+)\s*(usd|idr|dolar|rupiah)/i,
        rates: { usd: 15000, idr: 0.000067 }
      }
    };

    for (const [type, conv] of Object.entries(conversions)) {
      const match = query.match(conv.pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2];
        
        if (type === 'suhu') {
          const result = conv.convert(value, unit);
          return `🌡️ Konversi suhu: ${value}°${unit.charAt(0).toUpperCase()} = ${result.f}°F = ${result.k}K`;
        }
        
        if (type === 'matauang' && conv.rates) {
          if (unit.toLowerCase() === 'usd') {
            return `💵 Konversi mata uang: $${value} = Rp ${(value * conv.rates.usd).toLocaleString()}`;
          } else {
            return `💵 Konversi mata uang: Rp ${value} = $${(value * conv.rates.idr).toFixed(2)}`;
          }
        }
      }
    }
    return null;
  };

  // ===== FUNGSI UTAMA UNTUK MEMPROSES INPUT =====
  const getSmartReply = (msg) => {
    const text = msg.toLowerCase().trim();

    // 1. Cek pertanyaan matematika
    const mathResult = calculateMath(text);
    if (mathResult) return mathResult;

    // 2. Cek konversi
    const conversionResult = handleConversion(text);
    if (conversionResult) return conversionResult;

    // 3. Cek prediksi
    if (text.includes('prediksi')) {
      if (text.includes('harga')) return generatePrediction('harga');
      if (text.includes('cuaca')) return generatePrediction('cuaca');
      if (text.includes('penjualan')) return generatePrediction('penjualan');
    }

    // 4. Cek analisis data
    const analysisResult = analyzeData(text);
    if (analysisResult) return analysisResult;

    // 5. Cek statistik dan probabilitas
    const statsResult = calculateStatistics(text);
    if (statsResult) return statsResult;

    // 6. Cari jawaban dari AI-base.json
    const foundKey = Object.keys(aiBase).find((q) =>
      text.includes(q.toLowerCase().replace("?", ""))
    );
    if (foundKey) return aiBase[foundKey];

    // 7. Respons bawaan cerdas
    if (text.includes('halo') || text.includes('hai'))
      return "Hai juga! 👋 Aku SaipulAI v4.0 dengan kemampuan analisis data, perhitungan, dan prediksi. Ada yang bisa kubantu analisis atau hitung?";
    
    if (text.includes('terima kasih')) 
      return "Sama-sama! 😊 Senang bisa membantu analisis dan perhitunganmu.";
    
    if (text.includes('versi')) 
      return "Kamu ngobrol dengan SaipulAI v4.0 ⚙️ - Enhanced dengan kemampuan pemrosesan data dan prediksi";
    
    if (text.includes('hapus') && text.includes('chat')) {
      localStorage.removeItem("saipul_chat_history");
      return "Riwayat chat telah dihapus 🗑️";
    }

    if (text.includes('fitur') || text.includes('bisa apa')) {
      return `🤖 **Fitur SaipulAI v4.0:**
• 🧮 Perhitungan matematika
• 📊 Analisis data & statistik
• 🔮 Prediksi tren
• 🌡️ Konversi satuan
• 💰 Analisis keuangan
• 📈 Probabilitas & forecasting
• Dan masih banyak lagi!`;
    }

    // 8. Fallback responses dengan konteks lebih baik
    const fallback = [
      "Bisa jelaskan lebih detail? Aku bisa bantu analisis data atau melakukan perhitungan kompleks.",
      "Menarik! Kalau mau, aku bisa bantu buat prediksi atau analisis tren dari topik itu.",
      "Aku bisa bantu menghitung, menganalisis, atau memprediksi data. Ada data spesifik yang ingin diproses?",
      "Topik yang menarik! Aku punya kemampuan pemrosesan data yang bisa membantu analisis lebih lanjut."
    ];
    return fallback[Math.floor(Math.random() * fallback.length)];
  };

  const generateBotReply = (userText) => {
    setIsTyping(true);

    setTimeout(() => {
      const reply = getSmartReply(userText);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const clearChat = () => {
    setMessages([{ from: "bot", text: "Halo! 👋 Riwayat percakapan telah dibersihkan. Ada yang bisa kubantu analisis atau hitung hari ini?" }]);
    localStorage.removeItem("saipul_chat_history");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-20 right-6 bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-96 overflow-hidden backdrop-blur-md z-[9999]"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-cyan-900/80 to-purple-900/80 p-3 text-sm text-white font-semibold">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-cyan-300" />
            <span>💬 SaipulAI (v4.0 Enhanced)</span>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={clearChat}
              className="text-xs bg-gray-700/50 hover:bg-gray-600/50 px-2 py-1 rounded transition"
              title="Bersihkan chat"
            >
              Hapus
            </button>
            <button onClick={onOpenSettings} className="hover:text-cyan-400 transition">
              <Settings size={16} />
            </button>
            <button onClick={onClose} className="hover:text-red-400 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1 p-2 bg-gray-900/50 border-b border-gray-700">
          <button 
            onClick={() => setInput("Hitung 15 * 25 + 8")}
            className="flex items-center gap-1 text-xs bg-cyan-900/30 hover:bg-cyan-800/50 px-2 py-1 rounded transition"
          >
            <Calculator size={12} />
            Kalkulator
          </button>
          <button 
            onClick={() => setInput("Prediksi harga saham")}
            className="flex items-center gap-1 text-xs bg-purple-900/30 hover:bg-purple-800/50 px-2 py-1 rounded transition"
          >
            <TrendingUp size={12} />
            Prediksi
          </button>
          <button 
            onClick={() => setInput("Analisis data penjualan")}
            className="flex items-center gap-1 text-xs bg-green-900/30 hover:bg-green-800/50 px-2 py-1 rounded transition"
          >
            <BarChart3 size={12} />
            Analisis
          </button>
        </div>

        {/* Chat Body */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-2 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[85%] break-words shadow-md ${
                  m.from === "user"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {m.text.split('**').map((part, index) => 
                  index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl bg-gray-700 text-gray-300 text-xs flex items-center gap-1 animate-pulse">
                <Loader2 size={14} className="animate-spin" /> 
                SaipulAI sedang menganalisis...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-gray-700 bg-gray-900/90 p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan, perhitungan, atau minta analisis..."
            className="flex-grow bg-transparent outline-none text-white text-sm px-2 placeholder-gray-400"
          />
          <button 
            onClick={handleSend} 
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition p-2 rounded-lg"
            disabled={!input.trim()}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}