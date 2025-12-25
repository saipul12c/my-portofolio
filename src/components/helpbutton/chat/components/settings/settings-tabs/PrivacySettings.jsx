import { ToggleSwitch } from "../components/ToggleSwitch";

export function PrivacySettings({ settings, handleSave, clearUploadedData }) {
  const handleClearChatHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat chat? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        localStorage.removeItem("saipul_chat_history");
        alert("Riwayat chat berhasil dihapus!");
      } catch (e) {
        console.error("Error clearing chat history:", e);
        alert("Error menghapus riwayat chat.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg saipul-row">
          <div>
            <span style={{ color: 'var(--saipul-text)' }}>Privacy Mode</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Tidak menyimpan riwayat percakapan</p>
          </div>
          <ToggleSwitch 
            checked={settings.privacyMode}
            onChange={(value) => handleSave("privacyMode", value)}
            id="privacyMode"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg saipul-row">
          <div>
            <span style={{ color: 'var(--saipul-text)' }}>Voice Response</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Output audio (text-to-speech)</p>
          </div>
          <ToggleSwitch 
            checked={settings.voiceResponse}
            onChange={(value) => handleSave("voiceResponse", value)}
            id="voiceResponse"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg saipul-row">
          <div>
            <span style={{ color: 'var(--saipul-text)' }}>Analytics & Tracking</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Kumpulkan data penggunaan</p>
          </div>
          <ToggleSwitch 
            checked={settings.enableAnalytics}
            onChange={(value) => handleSave("enableAnalytics", value)}
            id="enableAnalytics"
          />
        </div>
      </div>

      <div className="p-3 rounded-lg border saipul-panel security-overview">
        <h4 className="font-medium mb-2" style={{ color: 'var(--saipul-accent)' }}>Data & Security</h4>
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
          onClick={handleClearChatHistory}
          className="w-full px-4 py-2 rounded-lg saipul-btn saipul-btn-danger flex items-center justify-center gap-2"
          style={{ border: '1px solid var(--saipul-border)', color: 'var(--saipul-accent)' }}
        >
          🗑️ Hapus Semua Riwayat Chat
        </button>
        
        <button
          onClick={clearUploadedData}
          className="w-full px-4 py-2 rounded-lg saipul-btn saipul-btn-warning flex items-center justify-center gap-2"
          style={{ border: '1px solid var(--saipul-border)', color: 'var(--saipul-text)' }}
        >
          🗑️ Hapus Semua Data Uploaded
        </button>
      </div>
    </div>
  );
}