import { ToggleSwitch } from "../components/ToggleSwitch";
import { Battery, Cpu, HardDrive, Zap } from "lucide-react";

export function PerformanceSettings({ settings, handleSave }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-500/30">
        <h4 className="font-medium text-orange-400 mb-2 flex items-center gap-2">
          <Zap size={16} /> Status Performa Sistem
        </h4>
        <div className="text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span>Mode AI:</span>
            <span className="text-green-400">{settings.aiModel.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Response Speed:</span>
            <span className="text-green-400">{settings.responseSpeed}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory Usage:</span>
            <span className="text-green-400">Optimal</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Power:</span>
            <span className="text-green-400">High</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Battery size={16} className="text-gray-400" />
            <div>
              <span className="text-white">Battery Saver Mode</span>
              <p className="text-xs text-gray-500">Mengurangi konsumsi daya</p>
            </div>
          </div>
          <ToggleSwitch 
            checked={settings.batterySaver}
            onChange={(value) => handleSave("batterySaver", value)}
            id="batterySaver"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Cpu size={16} className="text-gray-400" />
            <div>
              <span className="text-white">Hardware Acceleration</span>
              <p className="text-xs text-gray-500">Gunakan GPU untuk processing</p>
            </div>
          </div>
          <ToggleSwitch 
            checked={settings.hardwareAcceleration}
            onChange={(value) => handleSave("hardwareAcceleration", value)}
            id="hardwareAcceleration"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <HardDrive size={16} className="text-gray-400" />
            <div>
              <span className="text-white">Real-time Processing</span>
              <p className="text-xs text-gray-500">Proses data secara real-time</p>
            </div>
          </div>
          <ToggleSwitch 
            checked={settings.realTimeProcessing}
            onChange={(value) => handleSave("realTimeProcessing", value)}
            id="realTimeProcessing"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Cache Size</label>
        <select 
          value={settings.cacheSize}
          onChange={(e) => handleSave("cacheSize", e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option value="small">Small (50MB)</option>
          <option value="medium">Medium (100MB)</option>
          <option value="large">Large (250MB)</option>
          <option value="unlimited">Unlimited</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Ukuran cache untuk meningkatkan kecepatan respons</p>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <h4 className="font-medium text-gray-300 mb-2">Performance Tips</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Matikan Battery Saver untuk performa maksimal</li>
          <li>• Aktifkan Hardware Acceleration jika GPU tersedia</li>
          <li>• Atur Cache Size sesuai kebutuhan</li>
          <li>• Gunakan AI Model "Basic" untuk perangkat low-end</li>
        </ul>
      </div>
    </div>
  );
}