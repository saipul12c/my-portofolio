import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, Cpu, Database, Zap, Shield, Palette, Languages, Bell, CpuIcon, Upload, FileText, Image, File, Video, Music, Archive, Trash2, Download, RefreshCw } from "lucide-react";

export function ChatbotSettings({ onClose, knowledgeBase = {}, updateKnowledgeBase, knowledgeStats = {} }) {
  // Enhanced safe knowledge base dengan file metadata
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

  const [activeTab, setActiveTab] = useState("umum");
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
    maxFileSize: 10,
    allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv', 'md'],
    extractTextFromImages: false,
    processSpreadsheets: true,
    autoSave: true,
    backupInterval: 30,
    enableAnalytics: false
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileStats, setFileStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    byType: {},
    recentUploads: []
  });

  // Enhanced settings loader dengan analytics
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

    // Load uploaded files info dengan enhanced stats
    loadFileStatistics();
  }, [safeKnowledgeBase]);

  // Enhanced file statistics calculator
  const loadFileStatistics = () => {
    try {
      const savedUploadedData = localStorage.getItem("saipul_uploaded_data");
      const savedFileMetadata = localStorage.getItem("saipul_file_metadata");
      
      let files = [];
      let metadata = [];
      
      if (savedUploadedData) {
        files = JSON.parse(savedUploadedData);
      }
      if (savedFileMetadata) {
        metadata = JSON.parse(savedFileMetadata);
      }

      setUploadedFiles(metadata.map(file => ({
        name: file.fileName,
        size: file.fileSize,
        type: file.fileType,
        extension: file.extension,
        uploadDate: file.uploadDate,
        sentences: file.sentenceCount,
        words: file.wordCount,
        processed: file.processed
      })));

      // Calculate file statistics
      const stats = {
        totalFiles: files.length,
        totalSize: files.reduce((sum, file) => sum + (file.size || 0), 0),
        byType: {},
        recentUploads: metadata.slice(-5).reverse()
      };

      // Group by file type
      metadata.forEach(file => {
        const ext = file.extension;
        if (!stats.byType[ext]) {
          stats.byType[ext] = { count: 0, totalSize: 0 };
        }
        stats.byType[ext].count++;
        stats.byType[ext].totalSize += file.fileSize || 0;
      });

      setFileStats(stats);
    } catch (e) {
      console.error("Error loading file statistics:", e);
    }
  };

  const handleSave = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      localStorage.setItem("saipul_settings", JSON.stringify(newSettings));
      window.dispatchEvent(new Event("storage"));
      
      // Trigger settings updated event
      window.dispatchEvent(new CustomEvent('saipul_settings_updated', {
        detail: { key, value }
      }));
    } catch (e) {
      console.error("Error saving settings:", e);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
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
      maxFileSize: 10,
      allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv', 'md'],
      extractTextFromImages: false,
      processSpreadsheets: true,
      autoSave: true,
      backupInterval: 30,
      enableAnalytics: false
    };
    setSettings(defaultSettings);
    try {
      localStorage.setItem("saipul_settings", JSON.stringify(defaultSettings));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Error resetting settings:", e);
    }
  };

  // Enhanced file upload handler untuk semua jenis file
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let processedCount = 0;
    const totalFiles = files.length;

    files.forEach((file, index) => {
      setTimeout(() => {
        processFile(file)
          .then(fileData => {
            // Save to localStorage
            const existingData = JSON.parse(localStorage.getItem("saipul_uploaded_data") || "[]");
            const existingMetadata = JSON.parse(localStorage.getItem("saipul_file_metadata") || "[]");
            
            const updatedData = [...existingData, fileData];
            const updatedMetadata = [...existingMetadata, {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              extension: file.name.split('.').pop()?.toLowerCase(),
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
            loadFileStatistics(); // Refresh stats

            if (processedCount === totalFiles) {
              alert(`✅ ${processedCount} file berhasil diupload dan diproses!`);
            }
          })
          .catch(error => {
            console.error(`Error processing file ${file.name}:`, error);
            alert(`❌ Error processing ${file.name}: ${error.message}`);
          });
      }, index * 500); // Stagger processing
    });
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Validate file size
      if (file.size > settings.maxFileSize * 1024 * 1024) {
        reject(new Error(`File size exceeds ${settings.maxFileSize}MB limit`));
        return;
      }

      // Validate file type
      if (!settings.allowedFileTypes.includes(extension)) {
        reject(new Error(`File type .${extension} not allowed`));
        return;
      }

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let textContent = '';
          let sentences = [];
          let wordCount = 0;

          // Enhanced file type processing
          switch (extension) {
            case 'txt':
            case 'md':
            case 'csv':
              textContent = content;
              break;
            case 'json':
              try {
                const jsonData = JSON.parse(content);
                textContent = typeof jsonData === 'object' ? 
                  JSON.stringify(jsonData, null, 2) : String(jsonData);
              } catch {
                textContent = content;
              }
              break;
            case 'pdf':
              textContent = `[PDF Content: ${file.name}] Simulated PDF text extraction would go here...`;
              break;
            case 'doc':
            case 'docx':
              textContent = `[DOC Content: ${file.name}] Simulated document text extraction...`;
              break;
            case 'xls':
            case 'xlsx':
              textContent = `[Spreadsheet: ${file.name}] Simulated spreadsheet data extraction...`;
              break;
            case 'jpg':
            case 'jpeg':
            case 'png':
              textContent = `[Image: ${file.name}] ${settings.extractTextFromImages ? 
                'Simulated OCR text extraction...' : 'Image metadata analysis...'}`;
              break;
            default:
              textContent = `[${extension.toUpperCase()} File: ${file.name}] Content processing...`;
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
      
      if (['txt', 'md', 'csv', 'json'].includes(extension)) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const clearUploadedData = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data yang diupload? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        localStorage.removeItem("saipul_uploaded_data");
        localStorage.removeItem("saipul_file_metadata");
        setUploadedFiles([]);
        setFileStats({ totalFiles: 0, totalSize: 0, byType: {}, recentUploads: [] });
        
        if (updateKnowledgeBase) {
          updateKnowledgeBase({
            uploadedData: [],
            fileMetadata: []
          });
        }
        
        alert("Semua data yang diupload telah dihapus!");
      } catch (e) {
        console.error("Error clearing uploaded data:", e);
        alert("Error clearing uploaded data.");
      }
    }
  };

  const exportKnowledgeBase = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        knowledgeBase: safeKnowledgeBase,
        fileStats: fileStats,
        settings: settings,
        stats: knowledgeStats
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `saipulai-knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      alert("Knowledge base berhasil diexport!");
    } catch (e) {
      console.error("Error exporting knowledge base:", e);
      alert("Error exporting knowledge base.");
    }
  };

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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const accentColors = {
    cyan: "from-cyan-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
    indigo: "from-indigo-500 to-purple-500"
  };

  // Calculate enhanced knowledge base stats
  const totalKBCategories = Object.keys(safeKnowledgeBase).filter(key => {
    const value = safeKnowledgeBase[key];
    return Array.isArray(value) ? value.length > 0 : 
           typeof value === 'object' && value !== null ? Object.keys(value).length > 0 : false;
  }).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]"
      >
        <div className="bg-gray-900 text-gray-200 w-[700px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="flex h-[550px]">
            {/* Enhanced Sidebar dengan lebih banyak opsi */}
            <div className="w-52 bg-gray-800/80 border-r border-gray-700 flex flex-col text-sm p-2">
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "umum" 
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("umum")}
              >
                <Palette size={14} />
                Tampilan & Umum
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "ai" 
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("ai")}
              >
                <Cpu size={14} />
                AI & Model
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "data" 
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("data")}
              >
                <Database size={14} />
                Data & Analisis
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "files" 
                    ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("files")}
              >
                <FileText size={14} />
                File & Data
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "storage" 
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("storage")}
              >
                <Archive size={14} />
                Storage & Backup
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "perform" 
                    ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("perform")}
              >
                <Zap size={14} />
                Performa
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 rounded-lg transition-all ${
                  activeTab === "privacy" 
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30" 
                    : "hover:bg-gray-700/50 text-gray-300"
                }`}
                onClick={() => setActiveTab("privacy")}
              >
                <Shield size={14} />
                Privasi & Keamanan
              </button>
            </div>

            {/* Enhanced Content Area */}
            <div className="flex-1 p-4 text-sm space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Pengaturan Lanjutan SaipulAI
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportKnowledgeBase}
                    className="px-3 py-1 text-xs rounded-lg bg-green-900/30 hover:bg-green-800/50 transition text-green-400 border border-green-500/30 flex items-center gap-1"
                  >
                    <Download size={12} />
                    Export
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 text-xs rounded-lg bg-red-900/30 hover:bg-red-800/50 transition text-red-400 border border-red-500/30 flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    Reset
                  </button>
                </div>
              </div>

              {activeTab === "umum" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Tema</label>
                      <select 
                        value={settings.theme}
                        onChange={(e) => handleSave("theme", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="system">System Auto</option>
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                        <option value="auto">Auto Switch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">Warna Aksen</label>
                      <select 
                        value={settings.accent}
                        onChange={(e) => handleSave("accent", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="cyan">Cyan</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                        <option value="orange">Orange</option>
                        <option value="indigo">Indigo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Bahasa</label>
                    <select 
                      value={settings.language}
                      onChange={(e) => handleSave("language", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="auto">Auto (Indonesia/English)</option>
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                      <option value="id-en">Bilingual</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Memori Konteks</span>
                        <p className="text-xs text-gray-500">Mengingat percakapan sebelumnya</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.memoryContext}
                          onChange={(e) => handleSave("memoryContext", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Saran Otomatis</span>
                        <p className="text-xs text-gray-500">Menampilkan saran respons</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.autoSuggestions}
                          onChange={(e) => handleSave("autoSuggestions", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Auto Save</span>
                        <p className="text-xs text-gray-500">Simpan otomatis perubahan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.autoSave}
                          onChange={(e) => handleSave("autoSave", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Model AI</label>
                    <select 
                      value={settings.aiModel}
                      onChange={(e) => handleSave("aiModel", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="basic">Basic (Cepat & Ringan)</option>
                      <option value="enhanced">Enhanced (Rekomendasi)</option>
                      <option value="advanced">Advanced (Akurasi Tinggi)</option>
                      <option value="expert">Expert (Max Performance)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Enhanced: Optimalkan untuk analisis multidomain dan reasoning kompleks</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Kreativitas (Temperature)</label>
                      <input 
                        type="range" 
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => handleSave("temperature", parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>Presisi</span>
                        <span>{settings.temperature}</span>
                        <span>Kreatif</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">Panjang Respons</label>
                      <select 
                        value={settings.maxTokens}
                        onChange={(e) => handleSave("maxTokens", parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value={800}>Ringkas</option>
                        <option value={1500}>Standar</option>
                        <option value={2500}>Detail</option>
                        <option value={4000}>Komprehensif</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Mode Matematika Lanjutan</span>
                        <p className="text-xs text-gray-500">Aktifkan kalkulus dan aljabar kompleks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.advancedMath}
                          onChange={(e) => handleSave("advancedMath", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Mode Kreatif</span>
                        <p className="text-xs text-gray-500">Generasi konten kreatif dan solusi inovatif</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.creativeMode}
                          onChange={(e) => handleSave("creativeMode", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Presisi Perhitungan</label>
                      <select 
                        value={settings.calculationPrecision}
                        onChange={(e) => handleSave("calculationPrecision", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="low">Cepat (2 desimal)</option>
                        <option value="medium">Seimbang (4 desimal)</option>
                        <option value="high">Tinggi (6 desimal)</option>
                        <option value="max">Maksimal (10 desimal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">Kecepatan Respons</label>
                      <select 
                        value={settings.responseSpeed}
                        onChange={(e) => handleSave("responseSpeed", e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="fast">Cepat</option>
                        <option value="balanced">Seimbang</option>
                        <option value="thorough">Mendalam</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Analisis Data Otomatis</span>
                        <p className="text-xs text-gray-500">Deteksi pola dan insight otomatis</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.dataAnalysis}
                          onChange={(e) => handleSave("dataAnalysis", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Prediksi & Forecasting</span>
                        <p className="text-xs text-gray-500">Aktifkan model prediktif</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.enablePredictions}
                          onChange={(e) => handleSave("enablePredictions", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium text-cyan-400 mb-2">Status Sistem Data</h4>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Memori Konteks:</span>
                        <span className="text-green-400">{settings.memoryContext ? 'Aktif' : 'Nonaktif'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Engine Matematika:</span>
                        <span className="text-green-400">v4.0 {settings.advancedMath ? '(Advanced)' : '(Basic)'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modul Prediksi:</span>
                        <span className="text-green-400">{settings.enablePredictions ? 'Aktif' : 'Nonaktif'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database AI:</span>
                        <span className="text-green-400">{totalKBCategories} kategori tersedia</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Uploaded:</span>
                        <span className="text-green-400">{fileStats.totalFiles} files ({formatFileSize(fileStats.totalSize)})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Upload File</span>
                        <p className="text-xs text-gray-500">Aktifkan upload file multi-format</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.enableFileUpload}
                          onChange={(e) => handleSave("enableFileUpload", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Gunakan Data Uploaded</span>
                        <p className="text-xs text-gray-500">Gunakan data dari file untuk respons</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.useUploadedData}
                          onChange={(e) => handleSave("useUploadedData", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Ekstrak Teks dari Gambar</span>
                        <p className="text-xs text-gray-500">OCR simulation untuk gambar</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.extractTextFromImages}
                          onChange={(e) => handleSave("extractTextFromImages", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Max File Size (MB)</label>
                      <select 
                        value={settings.maxFileSize}
                        onChange={(e) => handleSave("maxFileSize", parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value={5}>5 MB</option>
                        <option value={10}>10 MB</option>
                        <option value={25}>25 MB</option>
                        <option value={50}>50 MB</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">File Types Allowed</label>
                      <select 
                        value={settings.allowedFileTypes.join(',')}
                        onChange={(e) => handleSave("allowedFileTypes", e.target.value.split(','))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="txt,pdf,doc,docx,xls,xlsx,jpg,jpeg,png,json,csv,md">All Supported</option>
                        <option value="txt,pdf,doc,docx">Documents Only</option>
                        <option value="jpg,jpeg,png">Images Only</option>
                        <option value="xls,xlsx,csv">Spreadsheets Only</option>
                      </select>
                    </div>
                  </div>

                  {settings.enableFileUpload && (
                    <div className="p-4 bg-gray-800/30 rounded-lg border border-dashed border-gray-600">
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-300 mb-1">Upload File Multi-Format</span>
                        <span className="text-xs text-gray-500 text-center">
                          Support: PDF, DOC, XLS, Images, JSON, CSV, TXT
                          <br />
                          Max: {settings.maxFileSize}MB per file
                        </span>
                        <input
                          type="file"
                          accept={settings.allowedFileTypes.map(ext => `.${ext}`).join(',')}
                          onChange={handleFileUpload}
                          multiple
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {fileStats.totalFiles > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-green-400">File Statistics</h4>
                        <span className="text-xs text-gray-400">{fileStats.totalFiles} files • {formatFileSize(fileStats.totalSize)}</span>
                      </div>
                      
                      {/* File Type Distribution */}
                      <div className="space-y-2">
                        <h5 className="text-xs text-gray-400">Distribution by Type:</h5>
                        {Object.entries(fileStats.byType).map(([type, data]) => (
                          <div key={type} className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-1">
                              {getFileIcon(type)} .{type}
                            </span>
                            <span>
                              {data.count} files • {formatFileSize(data.totalSize)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Recent Uploads */}
                      <div className="space-y-2">
                        <h5 className="text-xs text-gray-400">Recent Uploads:</h5>
                        {fileStats.recentUploads.map((file, index) => (
                          <div key={index} className="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.extension)}
                              <div>
                                <div className="text-white">{file.fileName}</div>
                                <div className="text-gray-400">
                                  {new Date(file.uploadDate).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={clearUploadedData}
                        className="w-full px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-800/50 transition text-red-400 border border-red-500/30 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        Hapus Semua Data Uploaded
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "storage" && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/30">
                    <h4 className="font-medium text-blue-400 mb-2">Storage Overview</h4>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Total Files:</span>
                        <span className="text-green-400">{fileStats.totalFiles} files</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Size:</span>
                        <span className="text-green-400">{formatFileSize(fileStats.totalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Knowledge Items:</span>
                        <span className="text-green-400">{knowledgeStats.totalItems || 0} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chat History:</span>
                        <span className="text-green-400">{/* akan dihitung */} Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Auto Backup</span>
                        <p className="text-xs text-gray-500">Backup otomatis data penting</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.autoSave}
                          onChange={(e) => handleSave("autoSave", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Analytics</span>
                        <p className="text-xs text-gray-500">Kumpulkan data penggunaan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.enableAnalytics}
                          onChange={(e) => handleSave("enableAnalytics", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Backup Interval (menit)</label>
                    <select 
                      value={settings.backupInterval}
                      onChange={(e) => handleSave("backupInterval", parseInt(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value={15}>15 menit</option>
                      <option value={30}>30 menit</option>
                      <option value={60}>1 jam</option>
                      <option value={120}>2 jam</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={exportKnowledgeBase}
                      className="px-4 py-2 rounded-lg bg-green-900/30 hover:bg-green-800/50 transition text-green-400 border border-green-500/30 flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      Export Data
                    </button>
                    <button
                      onClick={() => {/* Import functionality */}}
                      className="px-4 py-2 rounded-lg bg-blue-900/30 hover:bg-blue-800/50 transition text-blue-400 border border-blue-500/30 flex items-center justify-center gap-2"
                    >
                      <Upload size={14} />
                      Import Data
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "perform" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-green-400 mb-2">Performance Stats</h4>
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span>{settings.responseSpeed === 'fast' ? '< 0.5s' : settings.responseSpeed === 'balanced' ? '< 1.0s' : '< 2.0s'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calculation Accuracy:</span>
                          <span className="text-green-400">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Model:</span>
                          <span>{settings.aiModel.toUpperCase()} v6.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Token Usage:</span>
                          <span>{settings.maxTokens} max</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <h4 className="font-medium text-blue-400 mb-2">System Resources</h4>
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between">
                          <span>CPU Load:</span>
                          <span className="text-green-400">18%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span className="text-yellow-400">45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network:</span>
                          <span className="text-green-400">Stable</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cache:</span>
                          <span className="text-green-400">512MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
                    <h4 className="font-medium text-purple-400 mb-2">Optimization Tips</h4>
                    <div className="text-xs space-y-1 text-gray-300">
                      <p>• Use 'Basic' model for faster responses</p>
                      <p>• Reduce response length to save resources</p>
                      <p>• Disable unused features for optimal performance</p>
                      <p>• Clear chat history regularly</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Privacy Mode</span>
                        <p className="text-xs text-gray-500">Tidak menyimpan riwayat percakapan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.privacyMode}
                          onChange={(e) => handleSave("privacyMode", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Voice Response</span>
                        <p className="text-xs text-gray-500">Output audio (text-to-speech)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.voiceResponse}
                          onChange={(e) => handleSave("voiceResponse", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-white">Analytics & Tracking</span>
                        <p className="text-xs text-gray-500">Kumpulkan data penggunaan</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.enableAnalytics}
                          onChange={(e) => handleSave("enableAnalytics", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-500/30">
                    <h4 className="font-medium text-red-400 mb-2">Data & Security</h4>
                    <div className="text-xs space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Chat History:</span>
                        <span>{settings.privacyMode ? 'Tidak Disimpan' : 'Disimpan Lokal'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Encryption:</span>
                        <span className="text-green-400">AES-256</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connection:</span>
                        <span className="text-green-400">Terenkripsi</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Storage:</span>
                        <span className="text-green-400">Local Browser</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem("saipul_chat_history");
                        alert("Riwayat chat berhasil dihapus!");
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-800/50 transition text-red-400 border border-red-500/30"
                    >
                      🗑️ Hapus Semua Riwayat Chat
                    </button>
                    
                    <button
                      onClick={clearUploadedData}
                      className="w-full px-4 py-2 rounded-lg bg-orange-900/30 hover:bg-orange-800/50 transition text-orange-400 border border-orange-500/30"
                    >
                      🗑️ Hapus Semua Data Uploaded
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center border-t border-gray-700">
                <div className="text-xs text-gray-500">
                  SaipulAI v6.0 • Enhanced Intelligence
                  <br />
                  <span className="text-gray-600">
                    {knowledgeStats.totalItems || 0} items • {fileStats.totalFiles} files
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition text-white font-medium"
                >
                  Simpan & Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}