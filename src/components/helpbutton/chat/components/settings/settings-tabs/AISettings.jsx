import { ToggleSwitch } from "../components/ToggleSwitch";

export function AISettings({ settings, handleSave }) {
  return (
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
          <ToggleSwitch 
            checked={settings.advancedMath}
            onChange={(value) => handleSave("advancedMath", value)}
            id="advancedMath"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Mode Kreatif</span>
            <p className="text-xs text-gray-500">Generasi konten kreatif dan solusi inovatif</p>
          </div>
          <ToggleSwitch 
            checked={settings.creativeMode}
            onChange={(value) => handleSave("creativeMode", value)}
            id="creativeMode"
          />
        </div>
      </div>
    </div>
  );
}