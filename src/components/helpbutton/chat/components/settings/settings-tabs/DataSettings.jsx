import { ToggleSwitch } from "../components/ToggleSwitch";

export function DataSettings({ settings, handleSave, fileStats, formatFileSize, totalKBCategories }) {
  return (
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
          <ToggleSwitch 
            checked={settings.dataAnalysis}
            onChange={(value) => handleSave("dataAnalysis", value)}
            id="dataAnalysis"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Prediksi & Forecasting</span>
            <p className="text-xs text-gray-500">Aktifkan model prediktif</p>
          </div>
          <ToggleSwitch 
            checked={settings.enablePredictions}
            onChange={(value) => handleSave("enablePredictions", value)}
            id="enablePredictions"
          />
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
  );
}