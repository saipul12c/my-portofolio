import { ToggleSwitch } from "../components/ToggleSwitch";

export function GeneralSettings({ settings, handleSave }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Tema</label>
          <select 
            value={settings.theme}
            onChange={(e) => handleSave("theme", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent"
            style={{ background: 'var(--saipul-surface)', color: 'var(--saipul-text)', borderColor: 'var(--saipul-border)' }}
          >
            <option value="system">System Auto</option>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
            <option value="auto">Auto Switch</option>
            <option value="sepia">Sepia (Warm)</option>
            <option value="solar">Solar (Soft)</option>
            <option value="midnight">Midnight (Deep)</option>
            <option value="soft">Soft Light</option>
            <option value="contrast">High Contrast</option>
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
            <option value="cyan">Cyan</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="orange">Orange</option>
            <option value="teal">Teal</option>
            <option value="rose">Rose</option>
            <option value="lime">Lime</option>
            <option value="amber">Amber</option>
            <option value="pink">Pink</option>
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