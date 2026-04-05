import { ToggleSwitch } from "../components/ToggleSwitch";
import { AI_MODELS, TOKEN_OPTIONS } from '../settingsConfig';

export function AISettings({ settings, handleSave }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[var(--saipul-text-secondary)] mb-2">Model AI</label>
        <select 
          value={settings.aiModel}
          onChange={(e) => handleSave("aiModel", e.target.value)}
          className="w-full bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg px-3 py-2 text-[var(--saipul-text-primary)] focus:ring-2 focus:ring-[var(--saipul-accent)] outline-none"
        >
          {AI_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <p className="text-xs text-[var(--saipul-text-muted)] mt-1">Enhanced: Optimalkan untuk analisis multidomain dan reasoning kompleks</p>
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
            {TOKEN_OPTIONS.map(t => (
              <option key={t} value={t}>{t === 800 ? 'Ringkas' : t === 1500 ? 'Standar' : t === 2500 ? 'Detail' : 'Komprehensif'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { id: 'advancedMath', label: 'Mode Matematika Lanjutan', sub: 'Aktifkan kalkulus dan aljabar kompleks' },
          { id: 'creativeMode', label: 'Mode Kreatif', sub: 'Generasi konten kreatif dan solusi inovatif' }
        ].map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
            <div>
              <span className="text-[var(--saipul-text-primary)]">{item.label}</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">{item.sub}</p>
            </div>
            <ToggleSwitch 
              checked={settings[item.id]}
              onChange={(value) => handleSave(item.id, value)}
              id={item.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}