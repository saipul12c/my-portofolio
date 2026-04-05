import { ToggleSwitch } from "../components/ToggleSwitch";
import { CACHE_SIZES } from '../settingsConfig';
import { Battery, Cpu, HardDrive, Zap } from "lucide-react";

export function PerformanceSettings({ settings, handleSave }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-[var(--saipul-accent-1)]/10 to-[var(--saipul-accent-2)]/10 rounded-lg border border-[var(--saipul-accent-1)]/20 shadow-inner">
        <h4 className="font-medium text-[var(--saipul-accent-1)] mb-2 flex items-center gap-2">
          <Zap size={16} /> Status Performa Sistem
        </h4>
        <div className="text-xs space-y-2 text-[var(--saipul-text-secondary)]">
          <div className="flex justify-between items-center">
            <span>Mode AI:</span>
            <span className="text-[var(--saipul-accent-1)] font-semibold">{String(settings.aiModel || '').toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Response Speed:</span>
            <span className="text-[var(--saipul-accent-1)]">{settings.responseSpeed || 'Balanced'}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory Usage:</span>
            <span className="text-[var(--saipul-accent-2)]">Optimal</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { id: 'batterySaver', label: 'Battery Saver Mode', sub: 'Mengurangi konsumsi daya', icon: Battery },
          { id: 'hardwareAcceleration', label: 'Hardware Acceleration', sub: 'Gunakan GPU untuk processing', icon: Cpu },
          { id: 'realTimeProcessing', label: 'Real-time Processing', sub: 'Proses data secara real-time', icon: HardDrive }
        ].map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
            <div className="flex items-center gap-3">
              <item.icon size={16} className="text-[var(--saipul-accent-1)]" />
              <div>
                <span className="text-[var(--saipul-text-primary)]">{item.label}</span>
                <p className="text-xs text-[var(--saipul-text-secondary)]">{item.sub}</p>
              </div>
            </div>
            <ToggleSwitch 
              checked={settings[item.id]}
              onChange={(value) => handleSave(item.id, value)}
              id={item.id}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-[var(--saipul-text-secondary)] mb-2">Cache Size</label>
        <select 
          value={settings.cacheSize}
          onChange={(e) => handleSave("cacheSize", e.target.value)}
          className="w-full bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg px-3 py-2 text-[var(--saipul-text-primary)] focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
        >
          {CACHE_SIZES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <p className="text-xs text-[var(--saipul-text-muted)] mt-1">Ukuran cache untuk meningkatkan kecepatan respons</p>
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