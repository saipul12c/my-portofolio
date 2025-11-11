export function GeneralSettings({ settings, handleSave, fileStats, formatFileSize }) {
  return (
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
  );
}