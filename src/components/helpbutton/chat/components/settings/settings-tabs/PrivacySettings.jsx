import { ToggleSwitch } from "../components/ToggleSwitch";

export function PrivacySettings({ settings, handleSave, clearUploadedData }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Privacy Mode</span>
            <p className="text-xs text-gray-500">Tidak menyimpan riwayat percakapan</p>
          </div>
          <ToggleSwitch 
            checked={settings.privacyMode}
            onChange={(value) => handleSave("privacyMode", value)}
            id="privacyMode"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Voice Response</span>
            <p className="text-xs text-gray-500">Output audio (text-to-speech)</p>
          </div>
          <ToggleSwitch 
            checked={settings.voiceResponse}
            onChange={(value) => handleSave("voiceResponse", value)}
            id="voiceResponse"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Analytics & Tracking</span>
            <p className="text-xs text-gray-500">Kumpulkan data penggunaan</p>
          </div>
          <ToggleSwitch 
            checked={settings.enableAnalytics}
            onChange={(value) => handleSave("enableAnalytics", value)}
            id="enableAnalytics"
          />
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
  );
}