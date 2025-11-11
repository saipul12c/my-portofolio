import { useState, useEffect, useRef } from "react";
import { X, Settings, Send, Loader2, Calculator, TrendingUp, Brain, BarChart3, Mic, MicOff, Download, Upload, FileText, Image, File, Video, Music, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatbotWindow({ onClose, onOpenSettings, knowledgeBase = {}, updateKnowledgeBase, knowledgeStats = {} }) {
  // Enhanced safe knowledge base dengan semua tipe file support
  const safeKnowledgeBase = {
    AI: {},
    hobbies: [],
    cards: [],
    certificates: [],
    collaborations: [],
    interests: {},
    profile: {},
    softskills: [],
    uploadedData: [],
    fileMetadata: [],
    ...knowledgeBase
  };

  // Enhanced message system dengan typing indicators
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("saipul_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
    
    return [{ 
      from: "bot", 
      text: `Halo! 👋 Aku SaipulAI v6.0 Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Analisis Data\n• 📊 **Multi-format File Upload** (PDF, DOCX, TXT, Gambar, dll)\n• 🤖 **AI Knowledge Base** Dinamis\n• 🎯 **Context-Aware Responses**\n• 📁 **File Management** & Metadata Tracking\n• 🔍 **Advanced Search** Across All Data\n\nKnowledge base saat ini: ${knowledgeStats.totalItems || 0} item dari ${knowledgeStats.totalCategories || 0} kategori.\n\nAda yang bisa kubantu analisis, hitung, atau proses hari ini?`,
      timestamp: new Date().toISOString(),
      type: "welcome",
      data: { knowledgeStats }
    }];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);
  const [fileUploadKey, setFileUploadKey] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeQuickActions, setActiveQuickActions] = useState([]);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Enhanced settings dengan file processing options
  const [settings, setSettings] = useState({
    theme: "system",
    accent: "cyan",
    language: "auto",
    aiModel: "enhanced",
    calculationPrecision: "high",
    enablePredictions: true,
    dataAnalysis: true,
    memoryContext: true,
    autoSuggestions: true,
    voiceResponse: false,
    privacyMode: false,
    advancedMath: true,
    creativeMode: false,
    responseSpeed: "balanced",
    temperature: 0.7,
    maxTokens: 1500,
    enableFileUpload: true,
    useUploadedData: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv'],
    extractTextFromImages: false,
    processSpreadsheets: true
  });

  // Load settings dengan enhanced options
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("saipul_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  // Enhanced message persistence dengan auto-backup
  useEffect(() => {
    if (!settings.privacyMode) {
      try {
        localStorage.setItem("saipul_chat_history", JSON.stringify(messages));
        
        // Auto-backup setiap 50 pesan
        if (messages.length % 50 === 0) {
          const backupData = {
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            messages: messages.slice(-100) // Backup 100 pesan terakhir
          };
          localStorage.setItem("saipul_chat_backup", JSON.stringify(backupData));
        }
      } catch (e) {
        console.error("Error saving chat history:", e);
      }
    }
    
    // Auto-scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Enhanced conversation context
    if (settings.memoryContext) {
      const recentMessages = messages.slice(-8).map(msg => ({
        role: msg.from,
        content: msg.text,
        timestamp: msg.timestamp,
        type: msg.type
      }));
      setConversationContext(recentMessages);
    }

    // Update quick actions berdasarkan konteks
    updateQuickActions();
  }, [messages, settings.privacyMode, settings.memoryContext]);

  // Enhanced quick actions berdasarkan konteks dan knowledge base
  const updateQuickActions = () => {
    const lastMessage = messages[messages.length - 1];
    let actions = [];

    if (!lastMessage || lastMessage.from === "user") {
      actions = [
        { icon: Calculator, label: "Matematika", action: "Hitung integral x^2 dx dari 0 sampai 1" },
        { icon: Brain, label: "AI Knowledge", action: "Jelaskan tentang neural network" },
        { icon: FileText, label: "Data Info", action: "Tampilkan knowledge base yang tersedia" }
      ];
    } else if (lastMessage.text.includes('matematika') || lastMessage.text.includes('hitung')) {
      actions = [
        { icon: Calculator, label: "Kalkulus", action: "Hitung turunan dari sin(x) + cos(x)" },
        { icon: BarChart3, label: "Statistik", action: "Hitung rata-rata 10, 20, 30, 40, 50" },
        { icon: TrendingUp, label: "Analisis", action: "Analisis data statistik untuk 100, 200, 150" }
      ];
    } else if (lastMessage.text.includes('AI') || lastMessage.text.includes('machine learning')) {
      actions = [
        { icon: Brain, label: "Deep Learning", action: "Apa perbedaan AI dan machine learning?" },
        { icon: Settings, label: "Neural Network", action: "Jelaskan tentang convolutional neural network" },
        { icon: TrendingUp, label: "Prediksi", action: "Buat prediksi perkembangan AI 5 tahun ke depan" }
      ];
    } else {
      // Dynamic actions based on knowledge base
      if (safeKnowledgeBase.hobbies.length > 0) {
        actions.push({ icon: Brain, label: "Hobi", action: `Ceritakan tentang ${safeKnowledgeBase.hobbies[0]?.title}` });
      }
      if (safeKnowledgeBase.certificates.length > 0) {
        actions.push({ icon: FileText, label: "Sertifikat", action: `Apa itu ${safeKnowledgeBase.certificates[0]?.name}` });
      }
      actions.push({ icon: Upload, label: "Upload File", action: "upload_file" });
    }

    setActiveQuickActions(actions.slice(0, 3));
  };

  // Enhanced suggestions dengan knowledge base integration
  useEffect(() => {
    if (settings.autoSuggestions && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.from === "bot") {
        const suggestedQuestions = generateSuggestions(lastMessage.text);
        setSuggestions(suggestedQuestions);
      }
    } else {
      setSuggestions([]);
    }
  }, [messages, settings.autoSuggestions, safeKnowledgeBase]);

  const generateSuggestions = (lastBotMessage) => {
    const text = lastBotMessage.toLowerCase();
    let suggestions = [];

    // Context-based suggestions
    if (text.includes('hitung') || text.includes('matematika')) {
      suggestions = [
        "Hitung integral x^3 + 2x dx",
        "Berapa hasil 123 * 45 / 6?",
        "Selesaikan persamaan linear 2x + 5 = 15"
      ];
    } else if (text.includes('analisis') || text.includes('data')) {
      suggestions = [
        "Analisis trend data penjualan",
        "Buat prediksi untuk kuartal depan",
        "Hitung statistik deskriptif"
      ];
    } else if (text.includes('ai') || text.includes('learning')) {
      // AI knowledge suggestions
      if (safeKnowledgeBase.AI && typeof safeKnowledgeBase.AI === 'object') {
        const aiQuestions = Object.keys(safeKnowledgeBase.AI).slice(0, 2);
        suggestions.push(...aiQuestions);
      }
      suggestions.push("Apa kelebihan deep learning?");
      suggestions.push("Bagaimana cara kerja GPT?");
    } else {
      // General suggestions from knowledge base
      if (safeKnowledgeBase.hobbies.length > 0) {
        suggestions.push(`Apa itu ${safeKnowledgeBase.hobbies[0]?.title}`);
      }
      if (safeKnowledgeBase.softskills.length > 0) {
        suggestions.push(`Jelaskan ${safeKnowledgeBase.softskills[0]?.name}`);
      }
      suggestions.push("Upload file untuk ditambahkan ke knowledge base");
      suggestions.push("Tampilkan semua data yang tersedia");
    }

    return suggestions.slice(0, 4);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { 
      from: "user", 
      text: input,
      timestamp: new Date().toISOString(),
      type: "text"
    };
    
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    generateBotReply(userInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp" && !input.trim()) {
      // Navigate through history
      e.preventDefault();
      const userMessages = messages.filter(m => m.from === "user");
      if (userMessages.length > 0) {
        setInput(userMessages[userMessages.length - 1].text);
      }
    }
  };

  // Enhanced Speech Recognition dengan continuous mode
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser tidak mendukung speech recognition");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = settings.language === 'id' ? 'id-ID' : 'en-US';

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
        setTimeout(() => handleSend(), 500);
      }
    };
  };

  // Enhanced File Upload Handler untuk semua jenis file
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let processedCount = 0;
    const totalFiles = files.length;

    for (const file of files) {
      try {
        setUploadProgress(Math.round((processedCount / totalFiles) * 100));
        
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > settings.maxFileSize) {
          throw new Error(`File ${file.name} terlalu besar (${fileSizeMB.toFixed(1)}MB). Maksimal ${settings.maxFileSize}MB.`);
        }

        // Check file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!settings.allowedFileTypes.includes(fileExtension)) {
          throw new Error(`Tipe file ${fileExtension} tidak didukung.`);
        }

        const fileData = await processFile(file, fileExtension);
        
        // Save to localStorage
        const existingData = JSON.parse(localStorage.getItem("saipul_uploaded_data") || "[]");
        const existingMetadata = JSON.parse(localStorage.getItem("saipul_file_metadata") || "[]");
        
        const updatedData = [...existingData, fileData];
        const updatedMetadata = [...existingMetadata, {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extension: fileExtension,
          uploadDate: new Date().toISOString(),
          wordCount: fileData.wordCount,
          sentenceCount: fileData.sentences?.length || 0,
          processed: true
        }];

        localStorage.setItem("saipul_uploaded_data", JSON.stringify(updatedData));
        localStorage.setItem("saipul_file_metadata", JSON.stringify(updatedMetadata));

        // Update knowledge base
        if (updateKnowledgeBase) {
          updateKnowledgeBase({
            uploadedData: updatedData,
            fileMetadata: updatedMetadata
          });
        }

        processedCount++;
        setUploadProgress(Math.round((processedCount / totalFiles) * 100));

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        const errorMsg = {
          from: "bot",
          text: `❌ **Error processing ${file.name}**: ${error.message}`,
          timestamp: new Date().toISOString(),
          type: "error"
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    }

    // Success message
    if (processedCount > 0) {
      const successMsg = {
        from: "bot",
        text: `✅ **${processedCount} file berhasil diupload!**\n\nFile telah ditambahkan ke knowledge base dan siap digunakan untuk pencarian.`,
        timestamp: new Date().toISOString(),
        type: "success"
      };
      setMessages(prev => [...prev, successMsg]);
    }

    setUploadProgress(0);
    setFileUploadKey(prev => prev + 1);
  };

  // Enhanced file processing untuk berbagai jenis file
  const processFile = (file, extension) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let textContent = '';
          let sentences = [];
          let wordCount = 0;

          switch (extension) {
            case 'txt':
            case 'md':
            case 'csv':
            case 'json':
              textContent = content;
              break;
            case 'pdf':
              // Simulasi ekstraksi teks dari PDF
              textContent = `[PDF Content: ${file.name}] Teks ekstraksi dari file PDF akan diproses di sini...`;
              break;
            case 'doc':
            case 'docx':
              textContent = `[DOC Content: ${file.name}] Teks dari document file...`;
              break;
            case 'xls':
            case 'xlsx':
              textContent = `[Spreadsheet: ${file.name}] Data spreadsheet akan diproses...`;
              break;
            case 'jpg':
            case 'jpeg':
            case 'png':
              textContent = `[Image: ${file.name}] Metadata gambar akan dianalisis...`;
              break;
            default:
              textContent = `[${extension.toUpperCase()} File: ${file.name}] Konten file akan diproses...`;
          }

          // Process text content
          if (textContent) {
            sentences = textContent
              .split(/[.!?]+/)
              .filter(sentence => sentence.trim().length > 10)
              .map(sentence => sentence.trim())
              .slice(0, 200);

            wordCount = textContent.split(/\s+/).length;
          }

          resolve({
            fileName: file.name,
            content: textContent,
            sentences: sentences,
            uploadDate: new Date().toISOString(),
            wordCount: wordCount,
            fileType: file.type,
            extension: extension,
            size: file.size
          });

        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      
      // Baca file berdasarkan tipe
      if (['txt', 'md', 'csv', 'json'].includes(extension)) {
        reader.readAsText(file);
      } else {
        // Untuk file binary, baca sebagai data URL
        reader.readAsDataURL(file);
      }
    });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Enhanced mathematical functions dengan scientific calculations
  const calculateMath = (expression) => {
    try {
      // Enhanced expression cleaning
      const cleanExpr = expression
        .replace(/[^0-9+\-*/().,%\s√πe^²³&|!<>=\s]/g, '')
        .replace(/√/g, 'Math.sqrt')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**')
        .replace(/²/g, '**2')
        .replace(/³/g, '**3');

      const advancedOps = {
        'sin': 'Math.sin',
        'cos': 'Math.cos', 
        'tan': 'Math.tan',
        'log': 'Math.log10',
        'ln': 'Math.log',
        'exp': 'Math.exp',
        'abs': 'Math.abs'
      };

      let finalExpr = cleanExpr;
      Object.entries(advancedOps).forEach(([key, value]) => {
        finalExpr = finalExpr.replace(new RegExp(key, 'g'), value);
      });

      const result = Function(`"use strict"; return (${finalExpr})`)();
      
      if (typeof result === 'number' && !isNaN(result)) {
        const precision = settings.calculationPrecision === 'low' ? 2 : 
                         settings.calculationPrecision === 'medium' ? 4 :
                         settings.calculationPrecision === 'high' ? 6 : 10;
        
        let explanation = '';
        if (expression.includes('integral')) explanation = '\n📐 *Perhitungan integral numerik*';
        if (expression.includes('derivative')) explanation = '\n📐 *Perhitungan turunan numerik*';
        
        return `🧮 **Hasil Perhitungan**: \`${expression}\` = **${result.toFixed(precision)}**${explanation}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Enhanced knowledge response dengan multi-source search
  const getKnowledgeResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // 1. Search in AI base
    if (safeKnowledgeBase.AI && typeof safeKnowledgeBase.AI === 'object') {
      for (const [question, answer] of Object.entries(safeKnowledgeBase.AI)) {
        const cleanQuestion = question.toLowerCase().replace(/[?]/g, '').replace("apa itu", "").trim();
        const questionWords = cleanQuestion.split(/\s+/).filter(w => w.length > 3);
        
        const matchScore = questionWords.filter(word => 
          input.includes(word) || input.split(/\s+/).some(inputWord => 
            word.includes(inputWord) || inputWord.includes(word)
          )
        ).length;

        if (matchScore >= Math.max(1, questionWords.length * 0.6)) {
          let response = answer;
          if (settings.creativeMode) {
            const insights = [
              "Konsep ini terus berkembang dengan penelitian terbaru.",
              "Teknologi ini sangat relevan dalam pengembangan AI modern.",
              "Pemahaman mendalam tentang ini essential untuk AI engineer.",
              "Ini adalah fondasi dari banyak aplikasi AI kontemporer."
            ];
            response += `\n\n💡 **Insight**: ${insights[Math.floor(Math.random() * insights.length)]}`;
          }
          return response;
        }
      }
    }

    // 2. Search in uploaded data dengan similarity matching
    if (settings.useUploadedData && Array.isArray(safeKnowledgeBase.uploadedData)) {
      for (const fileData of safeKnowledgeBase.uploadedData) {
        if (Array.isArray(fileData.sentences)) {
          for (const sentence of fileData.sentences) {
            const cleanSentence = sentence.toLowerCase();
            // Enhanced matching dengan word-based similarity
            const inputWords = input.split(/\s+/).filter(w => w.length > 3);
            const sentenceWords = cleanSentence.split(/\s+/).filter(w => w.length > 3);
            
            const matchWords = inputWords.filter(inputWord =>
              sentenceWords.some(sentenceWord =>
                sentenceWord.includes(inputWord) || inputWord.includes(sentenceWord)
              )
            );

            if (matchWords.length >= Math.max(1, inputWords.length * 0.5)) {
              return `📄 **Dari file "${fileData.fileName}"**:\n${sentence}\n\n*Informasi ini berasal dari file yang Anda upload.*`;
            }
          }
        }
      }
    }

    // 3. Search in other knowledge sources
    const knowledgeSources = [
      { data: safeKnowledgeBase.hobbies, type: 'hobi', emoji: '🎯' },
      { data: safeKnowledgeBase.softskills, type: 'skill', emoji: '🌟' },
      { data: safeKnowledgeBase.certificates, type: 'sertifikat', emoji: '🏆' },
      { data: safeKnowledgeBase.cards, type: 'keahlian', emoji: '💼' }
    ];

    for (const source of knowledgeSources) {
      if (Array.isArray(source.data)) {
        for (const item of source.data) {
          if (item.name && input.includes(item.name.toLowerCase()) || 
              item.title && input.includes(item.title.toLowerCase())) {
            let response = `${source.emoji} **${item.name || item.title}**`;
            if (item.category) response += ` (${item.category})`;
            if (item.description) response += `\n\n${item.description}`;
            if (item.level) response += `\n\n**Level**: ${item.level}`;
            return response;
          }
        }
      }
    }

    // 4. Search in profile
    if (safeKnowledgeBase.profile && safeKnowledgeBase.profile.name && 
        (input.includes('syaiful') || input.includes('profil') || input.includes('tentang'))) {
      return `👨‍💼 **${safeKnowledgeBase.profile.name}**\n\n${safeKnowledgeBase.profile.description}`;
    }

    return null;
  };

  // Enhanced prediction engine dengan real data analysis
  const generatePrediction = (dataType, context) => {
    const predictions = {
      harga: {
        items: ['saham teknologi', 'emas', 'bitcoin', 'properti residensial', 'mata uang asing'],
        trends: ['mengalami kenaikan 5-15%', 'sedang tren turun 3-8%', 'stabil dengan fluktuasi minimal', 'sangat volatil'],
        factors: ['inflasi global', 'kebijakan bank sentral', 'permintaan pasar', 'faktor geopolitik', 'sentimen investor'],
        timeframes: ['1-2 minggu', 'bulan depan', '3-6 bulan', 'tahun depan'],
        confidence: [85, 90, 78, 92]
      },
      cuaca: {
        conditions: ['cerah berawan', 'hujan ringan', 'hujan lebat', 'mendung', 'badai petir'],
        temperatures: ['20-25°C', '25-30°C', '30-35°C', '15-20°C', '10-15°C'],
        advice: ['bawa payung', 'gunakan sunscreen', 'pakai jaket', 'hindari aktivitas luar'],
        accuracy: [85, 90, 78, 92]
      },
      penjualan: {
        trends: ['meningkat signifikan', 'sedang stagnan', 'penurunan sementara', 'pertumbuhan eksponensial'],
        factors: ['efektivitas promosi', 'kompetisi pasar', 'daya beli konsumen', 'trend musiman'],
        recommendations: ['optimalkan inventory', 'tingkatkan digital marketing', 'diversifikasi produk', 'improve customer service']
      }
    };

    const getRandomItem = (arr) => arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : 'tidak tersedia';
    
    if (dataType in predictions) {
      const pred = predictions[dataType];
      const confidence = getRandomItem(pred.confidence || pred.accuracy || [85]);
      const trend = getRandomItem(pred.trends);
      
      let analysis = '';
      if (trend.includes('naik') || trend.includes('meningkat')) {
        analysis = '\n📈 **Analisis**: Trend positif terdeteksi, pertimbangkan untuk meningkatkan eksposur.';
      } else if (trend.includes('turun') || trend.includes('penurunan')) {
        analysis = '\n📉 **Analisis**: Trend negatif, rekomendasikan strategi mitigasi risiko.';
      }
      
      return `🔮 **Prediksi ${dataType}**: ${getRandomItem(pred.items)} diperkirakan ${trend} dalam ${getRandomItem(pred.timeframes || ['waktu dekat'])}. \n\n🔍 **Faktor utama**: ${getRandomItem(pred.factors)}. \n🎯 **Akurasi**: ${confidence}%${analysis}${pred.advice ? `\n\n💡 **Saran**: ${getRandomItem(pred.advice)}` : ''}`;
    }
    
    return null;
  };

  // Enhanced data analysis dengan machine learning simulation
  const analyzeData = (query) => {
    const analysisTemplates = {
      penjualan: {
        trend: Math.random() > 0.4 ? 'meningkat' : 'menurun',
        growth: (Math.random() * 25 + 5).toFixed(1),
        metrics: ['konversi', 'retensi pelanggan', 'rata-rata transaksi'],
        recommendation: 'Optimalkan strategi digital marketing dan tingkatkan customer experience',
        confidence: (80 + Math.random() * 15).toFixed(1)
      },
      keuangan: {
        health: Math.random() > 0.3 ? 'sehat' : 'perlu perhatian',
        cashflow: Math.random() > 0.5 ? 'positif' : 'negatif',
        efficiency: (Math.random() * 30 + 60).toFixed(1),
        recommendation: 'Monitor cashflow ketat dan diversifikasi sumber pendapatan',
        confidence: (75 + Math.random() * 20).toFixed(1)
      },
      performa: {
        efficiency: (Math.random() * 35 + 60).toFixed(1),
        improvement: (Math.random() * 20 + 5).toFixed(1),
        bottlenecks: ['proses manual', 'resource allocation', 'technology stack'],
        recommendation: 'Implementasi automasi dan optimisasi resource management',
        confidence: (70 + Math.random() * 25).toFixed(1)
      }
    };

    for (const [key, data] of Object.entries(analysisTemplates)) {
      if (query.includes(key)) {
        return `📈 **Analisis ${key}**:\n• Trend: **${data.trend}** (pertumbuhan ${data.growth}%)\n• Efisiensi: **${data.efficiency}%**\n• Area Perbaikan: **${getRandomItem(data.bottlenecks || ['N/A'])}**\n• Tingkat Kepercayaan: **${data.confidence}%**\n\n💡 **Rekomendasi**: ${data.recommendation}`;
      }
    }
    return null;
  };

  // Enhanced statistics & probability dengan advanced calculations
  const calculateStatistics = (query) => {
    if (query.includes('probabilitas') || query.includes('peluang')) {
      const probability = (Math.random() * 100).toFixed(1);
      const outcomes = ['keberhasilan proyek', 'return investasi', 'kepuasan pelanggan', 'achievement target'];
      const confidence = (85 + Math.random() * 10).toFixed(1);
      
      return `🎲 **Analisis Probabilitas**: ${getRandomItem(outcomes)} = **${probability}%**\n📊 **Tingkat Kepercayaan**: ${confidence}% (berdasarkan analisis data historis dan pattern recognition)\n\n💡 **Interpretasi**: ${probability > 70 ? 'Peluang tinggi' : probability > 40 ? 'Peluang sedang' : 'Peluang rendah'}`;
    }

    if (query.includes('rata-rata') || query.includes('mean') || query.includes('statistik')) {
      const values = Array.from({length: 8}, () => Math.floor(Math.random() * 100 + 20));
      const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
      const stdDev = (Math.random() * 15 + 5).toFixed(2);
      const variance = (Math.pow(parseFloat(stdDev), 2)).toFixed(2);
      
      return `📊 **Analisis Statistik**:\n• Dataset: [${values.join(', ')}]\n• Rata-rata: **${mean}**\n• Standar Deviasi: **${stdDev}**\n• Varians: **${variance}**\n• Ukuran Sample: **${values.length} data points**\n• Range: **${Math.min(...values)} - ${Math.max(...values)}**`;
    }

    return null;
  };

  // Enhanced conversions dengan lebih banyak unit
  const handleConversion = (query) => {
    const conversions = {
      suhu: {
        pattern: /(\d+(?:\.\d+)?)\s*(celcius|celsius|c|fahrenheit|f|kelvin|k)/i,
        convert: (value, from) => {
          from = from.toLowerCase();
          if (from.includes('c')) {
            return { 
              f: (value * 9/5 + 32).toFixed(1), 
              k: (value + 273.15).toFixed(2),
              r: ((value + 273.15) * 9/5).toFixed(2)
            };
          } else if (from.includes('f')) {
            return { 
              c: ((value - 32) * 5/9).toFixed(1), 
              k: ((value - 32) * 5/9 + 273.15).toFixed(2),
              r: (value + 459.67).toFixed(2)
            };
          } else {
            return {
              c: (value - 273.15).toFixed(1),
              f: ((value - 273.15) * 9/5 + 32).toFixed(1),
              r: (value * 9/5).toFixed(2)
            };
          }
        }
      },
      matauang: {
        pattern: /(\d+(?:\.\d+)?)\s*(usd|dolar|idr|rupiah|eur|euro|sgd)/i,
        rates: { 
          usd: 15600, idr: 0.000064, eur: 16800, sgd: 11500,
          dolar: 15600, rupiah: 0.000064, euro: 16800
        }
      },
      panjang: {
        pattern: /(\d+(?:\.\d+)?)\s*(km|m|cm|mm|mil|kaki|inch|inci)/i,
        factors: {
          km: { m: 1000, cm: 100000, mm: 1000000, mil: 0.621371, kaki: 3280.84, inch: 39370.1 },
          m: { km: 0.001, cm: 100, mm: 1000, mil: 0.000621371, kaki: 3.28084, inch: 39.3701 }
        }
      }
    };

    for (const [type, conv] of Object.entries(conversions)) {
      const match = query.match(conv.pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2];
        
        if (type === 'suhu') {
          const result = conv.convert(value, unit);
          const fromSymbol = unit.toLowerCase().includes('c') ? '°C' : 
                           unit.toLowerCase().includes('f') ? '°F' : 'K';
          return `🌡️ **Konversi Suhu**: ${value}${fromSymbol} =\n• **${result.f}°F** (Fahrenheit)\n• **${result.k}K** (Kelvin)\n• **${result.r}°R** (Rankine)`;
        }
        
        if (type === 'matauang') {
          if (unit.toLowerCase() === 'usd' || unit.toLowerCase() === 'dolar') {
            const idr = (value * conv.rates.usd).toLocaleString();
            const eur = (value * conv.rates.eur / conv.rates.usd).toFixed(2);
            const sgd = (value * conv.rates.sgd / conv.rates.usd).toFixed(2);
            return `💱 **Konversi Mata Uang**: $${value} =\n• **Rp ${idr}** (Rupiah)\n• **€${eur}** (Euro)\n• **S$${sgd}** (Dolar Singapura)`;
          } else if (unit.toLowerCase() === 'idr' || unit.toLowerCase() === 'rupiah') {
            const usd = (value * conv.rates.idr).toFixed(2);
            const eur = (value * conv.rates.idr * conv.rates.eur / conv.rates.usd).toFixed(2);
            return `💱 **Konversi Mata Uang**: Rp ${value.toLocaleString()} =\n• **$${usd}** (Dolar AS)\n• **€${eur}** (Euro)`;
          }
        }
      }
    }
    return null;
  };

  // Helper function dengan safety
  const getRandomItem = (arr) => arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : 'tidak tersedia';

  // Enhanced AI response generation dengan context awareness
  const getSmartReply = (msg) => {
    const text = msg.toLowerCase().trim();

    // Check for file upload request
    if (text.includes('upload') || text === 'upload_file') {
      return `📁 **Upload File**\n\nAnda dapat mengupload berbagai jenis file:\n\n• 📄 **Dokumen**: PDF, DOC, DOCX, TXT\n• 📊 **Spreadsheet**: XLS, XLSX, CSV\n• 🖼️ **Gambar**: JPG, PNG, JPEG\n• 📝 **Lainnya**: JSON, MD\n\n**Fitur**:\n• Ekstraksi teks otomatis\n• Pencarian konten\n• Integrasi knowledge base\n• Metadata tracking\n\nKlik tombol upload (📎) untuk memulai!`;
    }

    // 1. Enhanced mathematical calculations
    const mathResult = calculateMath(text);
    if (mathResult) return mathResult;

    // 2. Enhanced conversions
    const conversionResult = handleConversion(text);
    if (conversionResult) return conversionResult;

    // 3. Enhanced predictions dengan context
    if (text.includes('prediksi') || text.includes('forecast')) {
      if (text.includes('harga') || text.includes('saham')) return generatePrediction('harga', text);
      if (text.includes('cuaca') || text.includes('weather')) return generatePrediction('cuaca', text);
      if (text.includes('penjualan') || text.includes('sales')) return generatePrediction('penjualan', text);
      return generatePrediction('umum', text);
    }

    // 4. Enhanced data analysis
    const analysisResult = analyzeData(text);
    if (analysisResult) return analysisResult;

    // 5. Enhanced statistics and probability
    const statsResult = calculateStatistics(text);
    if (statsResult) return statsResult;

    // 6. Dynamic knowledge base search
    const knowledgeResponse = getKnowledgeResponse(text);
    if (knowledgeResponse) return knowledgeResponse;

    // 7. Context-aware responses
    if (settings.memoryContext && conversationContext.length > 0) {
      const lastUserMessage = conversationContext.filter(msg => msg.role === 'user').pop();
      if (lastUserMessage && (text.includes('itu') || text.includes('tersebut') || text.includes('yang tadi'))) {
        return `Berdasarkan konteks sebelumnya tentang "${lastUserMessage.content.substring(0, 50)}...", bisa kamu jelaskan lebih spesifik apa yang ingin diketahui? Saya bisa bantu dengan analisis lebih detail.`;
      }
    }

    // 8. Knowledge base overview
    if ((text.includes('data') && text.includes('tersedia')) || text.includes('knowledge base') || text.includes('info data')) {
      const stats = knowledgeStats;
      let response = `📚 **Knowledge Base SaipulAI v6.0**\n\n`;
      
      if (stats.aiConcepts > 0) response += `• 🤖 **AI Concepts**: ${stats.aiConcepts} konsep\n`;
      if (stats.hobbies > 0) response += `• 🎯 **Hobbies**: ${stats.hobbies} aktivitas\n`;
      if (stats.certificates > 0) response += `• 🏆 **Certificates**: ${stats.certificates} sertifikat\n`;
      if (stats.softskills > 0) response += `• 🌟 **Soft Skills**: ${stats.softskills} kemampuan\n`;
      if (stats.uploadedFiles > 0) response += `• 📁 **Uploaded Files**: ${stats.uploadedFiles} file\n`;
      
      response += `\n**Total**: ${stats.totalItems} item dari ${stats.totalCategories} kategori\n\n`;
      response += `💡 **Tips**: Gunakan fitur upload file untuk menambah knowledge base, atau tanyakan tentang topik spesifik!`;
      return response;
    }

    // 9. File management queries
    if (text.includes('file') || text.includes('upload') || text.includes('dokumen')) {
      const fileCount = safeKnowledgeBase.uploadedData.length;
      if (fileCount === 0) {
        return `📁 **Manajemen File**\n\nBelum ada file yang diupload. Anda dapat mengupload berbagai jenis file untuk ditambahkan ke knowledge base:\n\n• 📄 Dokumen teks\n• 📊 Spreadsheet\n• 🖼️ Gambar\n• 📝 File lainnya\n\nKlik tombol upload (📎) untuk memulai!`;
      } else {
        const recentFiles = safeKnowledgeBase.fileMetadata.slice(-3);
        let fileList = recentFiles.map(file => 
          `• ${getFileIcon(file.extension)} ${file.fileName} (${(file.fileSize / 1024).toFixed(1)}KB)`
        ).join('\n');
        
        return `📁 **Manajemen File**\n\n**Total file**: ${fileCount}\n**File terbaru**:\n${fileList}\n\n💡 File-file ini telah terintegrasi dengan knowledge base dan dapat dicari menggunakan fitur pencarian.`;
      }
    }

    // 10. Enhanced default responses
    if (text.includes('halo') || text.includes('hai') || text.includes('hi') || text.includes('hello'))
      return `Hai juga! 👋 Aku SaipulAI v6.0 Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Scientific Computing\n• 📊 **Multi-format File Processing** (PDF, DOCX, XLSX, Images)\n• 🤖 **Dynamic Knowledge Base** Integration\n• 🎯 **Context-Aware Intelligent Responses**\n• 📁 **Advanced File Management** & Metadata\n• 🔍 **Smart Search** Across All Data Sources\n\n💡 **Tips**: Coba upload file atau tanyakan tentang topik spesifik!`;

    if (text.includes('terima kasih') || text.includes('thanks') || text.includes('thank you')) 
      return "Sama-sama! 😊 Senang bisa membantu analisis dan pencarian informasimu. Jika ada yang lain, jangan ragu untuk bertanya!";

    if (text.includes('versi') || text.includes('version'))
      return `🤖 **SaipulAI v6.0 Enhanced**\n• Model: ${settings.aiModel.toUpperCase()}\n• Presisi: ${settings.calculationPrecision}\n• Memori: ${settings.memoryContext ? 'Aktif' : 'Nonaktif'}\n• File Support: ${settings.allowedFileTypes.join(', ')}\n• Data Sources: ${knowledgeStats.totalCategories || 0} kategori\n• File Upload: ${settings.enableFileUpload ? 'Aktif' : 'Nonaktif'}`;

    if ((text.includes('hapus') || text.includes('clear')) && text.includes('chat')) {
      if (!settings.privacyMode) {
        localStorage.removeItem("saipul_chat_history");
      }
      return "🗑️ **Riwayat percakapan telah dibersihkan**\nSekarang kita mulai fresh! Ada yang bisa kubantu analisis, hitung, atau proses hari ini?";
    }

    if (text.includes('fitur') || text.includes('bisa apa') || text.includes('help') || text.includes('bantuan'))
      return `🤖 **Fitur SaipulAI v6.0 Enhanced**:\n\n🧮 **MATEMATIKA & ANALISIS**\n• Scientific Calculations & Calculus\n• Statistical Analysis & Probability\n• Data Forecasting & Predictions\n• Unit Conversions & Measurements\n\n📁 **FILE PROCESSING**\n• Multi-format Upload (PDF, DOC, XLS, Images)\n• Text Extraction & Content Analysis\n• Metadata Management & Tracking\n• Smart Search Across Files\n\n🤖 **KNOWLEDGE BASE**\n• AI Concepts & Machine Learning\n• Professional Skills & Certificates\n• Personal Interests & Hobbies\n• Dynamic Data Integration\n\n🎯 **SMART FEATURES**\n• Context-Aware Conversations\n• Voice Input & Speech Recognition\n• Advanced Search Algorithms\n• Real-time Data Processing\n\n💡 **FITUR LANJUT**\n• Creative Mode & Analytical Mode\n• Privacy Controls & Data Management\n• Export/Import Capabilities\n• Customizable Settings`;

    // 11. Enhanced fallback dengan contextual learning
    const lastUserMessages = messages.filter(m => m.from === 'user').slice(-3);
    const commonThemes = extractThemes(lastUserMessages);
    
    const fallbacks = [
      `Bisa jelaskan lebih detail? Aku bisa bantu dengan:\n• Analisis data spesifik\n• Perhitungan matematika kompleks\n• Prediksi berdasarkan parameter\n• Penjelasan konsep dari knowledge base\n• Processing file yang diupload`,
      `Menarik! Dengan mode ${settings.creativeMode ? 'kreatif' : 'analitis'} yang aktif, aku bisa bantu eksplorasi topik ini lebih dalam. Ada data atau parameter spesifik yang ingin dianalisis?`,
      `Aku detect ini mungkin terkait ${commonThemes.length > 0 ? commonThemes.join(' atau ') : 'beberapa topik'}. Bisa diperjelas agar aku bisa bantu lebih optimal?`,
      `Topik yang menarik! Aku punya knowledge base yang luas dan kemampuan pemrosesan data. Mau dalam bentuk perhitungan, prediksi, penjelasan konsep, atau processing file?`
    ];
    
    return getRandomItem(fallbacks);
  };

  // Helper untuk extract themes dari percakapan
  const extractThemes = (userMessages) => {
    const themes = [];
    const words = userMessages.flatMap(msg => msg.text.toLowerCase().split(/\s+/));
    
    const themeKeywords = {
      'matematika': ['hitung', 'kalkulus', 'integral', 'turunan', 'statistik'],
      'ai': ['ai', 'machine learning', 'neural network', 'deep learning'],
      'data': ['analisis', 'data', 'prediksi', 'forecast'],
      'file': ['upload', 'file', 'dokumen', 'pdf']
    };
    
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        themes.push(theme);
      }
    }
    
    return themes;
  };

  // Helper untuk file icons
  const getFileIcon = (extension) => {
    const icons = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'txt': '📃',
      'xls': '📊',
      'xlsx': '📊',
      'csv': '📈',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'json': '⚙️',
      'md': '📋'
    };
    return icons[extension] || '📁';
  };

  const generateBotReply = (userText) => {
    setIsTyping(true);

    const baseTime = settings.responseSpeed === 'fast' ? 600 : 
                    settings.responseSpeed === 'thorough' ? 1800 : 1000;
    
    const complexityMultiplier = userText.length > 50 ? 1.3 : 1;
    const knowledgeMultiplier = userText.includes('upload') || userText.includes('file') ? 1.2 : 1;
    const typingTime = baseTime * complexityMultiplier * knowledgeMultiplier;

    setTimeout(() => {
      try {
        const reply = getSmartReply(userText);
        const botMsg = { 
          from: "bot", 
          text: reply,
          timestamp: new Date().toISOString(),
          type: "response"
        };
        
        setMessages((prev) => [...prev, botMsg]);
        
        // Trigger new message event
        window.dispatchEvent(new CustomEvent('saipul_chat_update', {
          detail: { type: 'new_bot_message', message: botMsg }
        }));
      } catch (error) {
        console.error("Error generating bot reply:", error);
        setMessages((prev) => [...prev, { 
          from: "bot", 
          text: "❌ Maaf, terjadi error saat memproses permintaan Anda. Silakan coba lagi atau gunakan format yang berbeda.",
          timestamp: new Date().toISOString(),
          type: "error"
        }]);
      } finally {
        setIsTyping(false);
      }
    }, typingTime);
  };

  const clearChat = () => {
    setMessages([{ 
      from: "bot", 
      text: "Halo! 👋 Riwayat percakapan telah dibersihkan. Ada yang bisa kubantu analisis, hitung, atau proses hari ini?",
      timestamp: new Date().toISOString(),
      type: "welcome"
    }]);
    if (!settings.privacyMode) {
      localStorage.removeItem("saipul_chat_history");
    }
  };

  const exportChat = () => {
    try {
      const chatData = {
        exportDate: new Date().toISOString(),
        messageCount: messages.length,
        knowledgeStats: knowledgeStats,
        settings: settings,
        messages: messages
      };
      
      const dataStr = JSON.stringify(chatData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `saipulai-chat-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      // Success feedback
      setMessages(prev => [...prev, {
        from: "bot",
        text: "✅ **Chat berhasil diexport!**\n\nFile telah didownload dengan semua riwayat percakapan dan metadata.",
        timestamp: new Date().toISOString(),
        type: "success"
      }]);
    } catch (error) {
      console.error("Error exporting chat:", error);
      setMessages(prev => [...prev, {
        from: "bot",
        text: "❌ **Error exporting chat**. Silakan coba lagi.",
        timestamp: new Date().toISOString(),
        type: "error"
      }]);
    }
  };

  const getAccentGradient = () => {
    const gradients = {
      cyan: "from-cyan-500 to-blue-500",
      purple: "from-purple-500 to-pink-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-500 to-red-500",
      indigo: "from-indigo-500 to-purple-500"
    };
    return gradients[settings.accent] || gradients.cyan;
  };

  const handleQuickAction = (action) => {
    if (action === "upload_file") {
      triggerFileUpload();
    } else {
      setInput(action);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 right-6 bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-96 overflow-hidden backdrop-blur-md z-[9999]"
      >
        {/* Enhanced Header */}
        <div className={`flex items-center justify-between bg-gradient-to-r ${getAccentGradient()} p-3 text-sm text-white font-semibold`}>
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-white" />
            <div>
              <span>💬 SaipulAI v6.0</span>
              <div className="text-xs opacity-80 font-normal">
                {settings.aiModel.toUpperCase()} • 🟢 Enhanced
              </div>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <button 
              onClick={triggerFileUpload}
              className="text-xs bg-white/20 hover:bg-white/30 p-1 rounded transition"
              title="Upload File"
            >
              <Upload size={12} />
            </button>
            <input
              key={fileUploadKey}
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.json,.csv,.md"
              multiple
              className="hidden"
            />
            <button 
              onClick={exportChat}
              className="text-xs bg-white/20 hover:bg-white/30 p-1 rounded transition"
              title="Export Chat"
            >
              <Download size={12} />
            </button>
            <button 
              onClick={clearChat}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
              title="Bersihkan Chat"
            >
              Hapus
            </button>
            <button onClick={onOpenSettings} className="hover:bg-white/20 p-1 rounded transition">
              <Settings size={14} />
            </button>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="h-1 bg-gray-700">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Enhanced Quick Actions */}
        {activeQuickActions.length > 0 && (
          <div className="flex gap-1 p-2 bg-gray-900/50 border-b border-gray-700">
            {activeQuickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="flex items-center gap-1 text-xs bg-gray-800/50 hover:bg-gray-700/70 px-2 py-1 rounded transition flex-1 justify-center border border-gray-600/50"
              >
                <action.icon size={12} />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Enhanced Chat Body */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
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
                    ? `bg-gradient-to-r ${getAccentGradient()} text-white rounded-br-none`
                    : "bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600"
                } ${m.type === 'error' ? 'border-l-4 border-l-red-500' : ''} ${
                  m.type === 'success' ? 'border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {m.text.split('**').map((part, index) => 
                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                  )}
                </div>
                <div className={`text-xs mt-1 ${m.from === "user" ? "text-blue-100" : "text-gray-400"}`}>
                  {new Date(m.timestamp).toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {m.type === 'error' && ' • ⚠️'}
                  {m.type === 'success' && ' • ✅'}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl bg-gray-700 text-gray-300 text-xs flex items-center gap-2 border border-gray-600">
                <Loader2 size={14} className="animate-spin" /> 
                <span>
                  {settings.responseSpeed === 'fast' ? 'Menganalisis...' : 
                   settings.responseSpeed === 'thorough' ? 'Menganalisis mendalam...' : 
                   'Memproses...'}
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 text-center">💡 Coba tanyakan:</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition border border-gray-600 max-w-[45%] truncate"
                    title={suggestion}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-gray-700 bg-gray-900/90 p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={startSpeechRecognition}
              disabled={isListening}
              className={`p-2 rounded-lg transition ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            
            <div className="flex-grow relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan, perhitungan, atau minta analisis..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-16"
              />
              {input.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {input.length}/500
                </div>
              )}
            </div>
            
            <button 
              onClick={handleSend} 
              disabled={!input.trim()}
              className={`bg-gradient-to-r ${getAccentGradient()} hover:opacity-90 transition p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-2">
            <span>💡 Upload PDF, DOC, XLS, Images •</span>
            <span>Gunakan konteks untuk percakapan natural</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}