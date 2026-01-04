import { ToggleSwitch } from "../components/ToggleSwitch";
import { THEMES, ACCENTS, LANGUAGES } from '../settingsConfig';

export function GeneralSettings({ settings, handleSave }) {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-800/40 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Profil & Personalisasi</h4>
        <div className="grid grid-cols-1 gap-3">
          <input
            aria-label="Nama pengguna"
            placeholder="Nama (opsional)"
            value={settings.profile?.name || ''}
            onChange={(e) => {
              const v = e.target.value;
              try { window.dispatchEvent(new CustomEvent('saipul_profile_updated', { detail: { name: v } })); } catch (_e) { void _e; }
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          />
          <input
            aria-label="Kota / Lokasi"
            placeholder="Kota / Lokasi"
            value={settings.profile?.location || ''}
            onChange={(e) => {
              const v = e.target.value;
              try { window.dispatchEvent(new CustomEvent('saipul_profile_updated', { detail: { location: v } })); } catch (_e) { void _e; }
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          />
          <div className="flex gap-2">
            <input
              aria-label="Zona Waktu (IANA)"
              placeholder="Zona waktu (contoh: Asia/Jakarta)"
              value={settings.profile?.timezone || ''}
              onChange={(e) => {
                const v = e.target.value;
                try { window.dispatchEvent(new CustomEvent('saipul_profile_updated', { detail: { timezone: v } })); } catch (_e) { void _e; }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Tema</label>
          <select 
            value={settings.theme}
            onChange={(e) => handleSave("theme", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent"
            style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
          >
            {THEMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Warna Aksen</label>
          <select 
            value={settings.accent}
            onChange={(e) => handleSave("accent", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent"
            style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
          >
            {ACCENTS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
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
          {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Gaya Respons</label>
        <select
          value={settings.responseStyle || ''}
          onChange={(e) => handleSave('responseStyle', e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent"
          style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
        >
          {['concise','formal','friendly','technical','humorous','terse','elaborate','poetic','empathetic','step-by-step'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Memori Konteks</span>
            <p className="text-xs text-gray-500">Mengingat percakapan sebelumnya</p>
          </div>
          <ToggleSwitch 
            checked={settings.memoryContext}
            onChange={(value) => handleSave("memoryContext", value)}
            id="memoryContext"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Saran Otomatis</span>
            <p className="text-xs text-gray-500">Menampilkan saran respons</p>
          </div>
          <ToggleSwitch 
            checked={settings.autoSuggestions}
            onChange={(value) => handleSave("autoSuggestions", value)}
            id="autoSuggestions"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Auto Save</span>
            <p className="text-xs text-gray-500">Simpan otomatis perubahan</p>
          </div>
          <ToggleSwitch 
            checked={settings.autoSave}
            onChange={(value) => handleSave("autoSave", value)}
            id="autoSave"
          />
        </div>
      </div>
    </div>
  );
}