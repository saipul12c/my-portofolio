import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain, Cpu, Database, Zap } from "lucide-react";

export function ChatbotSettings({ onClose }) {
  const [activeTab, setActiveTab] = useState("umum");
  const [settings, setSettings] = useState({
    theme: "system",
    accent: "default",
    language: "auto",
    aiModel: "enhanced",
    calculationPrecision: "high",
    enablePredictions: true,
    dataAnalysis: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("saipul_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("saipul_settings", JSON.stringify(newSettings));
    window.dispatchEvent(new Event("storage"));
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: "system",
      accent: "default",
      language: "auto",
      aiModel: "enhanced",
      calculationPrecision: "high",
      enablePredictions: true,
      dataAnalysis: true
    };
    setSettings(defaultSettings);
    localStorage.setItem("saipul_settings", JSON.stringify(defaultSettings));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]"
      >
        <div className="bg-gray-900 text-gray-200 w-[500px] rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-40 bg-gray-800 border-r border-gray-700 flex flex-col text-sm">
              <button 
                className={`p-3 text-left flex items-center gap-2 ${activeTab === "umum" ? "bg-gray-700/60" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("umum")}
              >
                <Brain size={14} />
                Umum
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 ${activeTab === "ai" ? "bg-gray-700/60" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("ai")}
              >
                <Cpu size={14} />
                AI & Model
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 ${activeTab === "data" ? "bg-gray-700/60" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("data")}
              >
                <Database size={14} />
                Data & Analisis
              </button>
              <button 
                className={`p-3 text-left flex items-center gap-2 ${activeTab === "perform" ? "bg-gray-700/60" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("perform")}
              >
                <Zap size={14} />
                Performa
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 text-sm space-y-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-white text-lg">Pengaturan Lanjutan</h3>

              {activeTab === "umum" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Tema</label>
                    <select 
                      value={settings.theme}
                      onChange={(e) => handleSave("theme", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="system">System</option>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Bahasa</label>
                    <select 
                      value={settings.language}
                      onChange={(e) => handleSave("language", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="auto">Auto (Indonesia/English)</option>
                      <option value="id">Indonesia</option>
                      <option value="en">English</option>
                    </select>
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
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="basic">Basic (Cepat)</option>
                      <option value="enhanced">Enhanced (Rekomendasi)</option>
                      <option value="advanced">Advanced (Akurasi Tinggi)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Enhanced: Optimalkan untuk analisis dan perhitungan</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Prediksi & Forecasting</span>
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
              )}

              {activeTab === "data" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Presisi Perhitungan</label>
                    <select 
                      value={settings.calculationPrecision}
                      onChange={(e) => handleSave("calculationPrecision", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="low">Cepat (2 desimal)</option>
                      <option value="medium">Seimbang (4 desimal)</option>
                      <option value="high">Tinggi (6 desimal)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Analisis Data Otomatis</span>
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

                  <div className="p-3 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-cyan-400 mb-2">Status Sistem</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Memori Chat:</span>
                        <span className="text-green-400">Aktif</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Engine Matematika:</span>
                        <span className="text-green-400">v2.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modul Prediksi:</span>
                        <span className="text-green-400">Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "perform" && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-cyan-400 mb-2">Statistik Performa</h4>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span>{"< 1.2s"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Akurasi Perhitungan:</span>
                        <span className="text-green-400">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model AI:</span>
                        <span>Enhanced v4.0</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-800/50 transition text-red-400"
                  >
                    Reset ke Default
                  </button>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
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