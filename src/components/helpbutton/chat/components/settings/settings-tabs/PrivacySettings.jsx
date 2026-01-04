import { ToggleSwitch } from "../components/ToggleSwitch";
import { VOICE_DEFAULTS } from '../settingsConfig';
import { useEffect, useState } from 'react';
import { exportUserTraining, importUserTraining, clearUserTraining } from '../../logic/utils/helpers';

export function PrivacySettings({ settings, handleSave, clearUploadedData }) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      try {
        const v = window.speechSynthesis.getVoices() || [];
        setVoices(v.map(voice => ({ name: voice.name, lang: voice.lang })));
      } catch (e) { void e; }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { try { window.speechSynthesis.onvoiceschanged = null; } catch (_e) { void _e; } };
  }, []);
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

        <div className="p-3 rounded-lg saipul-row">
          <div className="mb-2">
            <span style={{ color: 'var(--saipul-text)' }}>Voice Language</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Pilih bahasa untuk text-to-speech</p>
          </div>
          <select
            value={settings.voiceLanguage || VOICE_DEFAULTS.language}
            onChange={(e) => handleSave('voiceLanguage', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="auto">Auto (deteksi)</option>
            <option value="id">Bahasa Indonesia (id-ID)</option>
            <option value="en">English (en-US)</option>
          </select>

          {voices.length > 0 && (
            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Voice</label>
              <select
                value={settings.voiceName || ''}
                onChange={(e) => handleSave('voiceName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="">Default</option>
                {voices.map(v => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400">Rate</label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.voiceRate ?? VOICE_DEFAULTS.rate}
                onChange={(e) => handleSave('voiceRate', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400">{settings.voiceRate ?? VOICE_DEFAULTS.rate}</div>
            </div>

            <div>
              <label className="block text-xs text-gray-400">Pitch</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voicePitch ?? VOICE_DEFAULTS.pitch}
                onChange={(e) => handleSave('voicePitch', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400">{settings.voicePitch ?? VOICE_DEFAULTS.pitch}</div>
            </div>
          </div>
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

      {/* Auto-training controls */}
      <div className="p-3 rounded-lg border saipul-panel">
        <h4 className="font-medium mb-2" style={{ color: 'var(--saipul-accent)' }}>Auto-Training (Client)</h4>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span style={{ color: 'var(--saipul-text)' }}>Auto Training</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Simpan contoh input untuk meningkatkan klasifikasi (lokal)</p>
          </div>
          <ToggleSwitch
            checked={settings.autoTraining}
            onChange={(v) => handleSave('autoTraining', v)}
            id="autoTraining"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">Trigger</label>
          <select
            value={settings.autoTrainingTrigger || 'always'}
            onChange={(e) => handleSave('autoTrainingTrigger', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="always">Selalu simpan (Recommended)</option>
            <option value="heuristic">Hanya jika klasifikasi ragu</option>
            <option value="on_feedback">Simpan saat feedback (like/dislike)</option>
          </select>
        </div>

        <div className="mb-2 text-xs text-gray-400">Training store disimpan lokal di browser. Tidak akan menyimpan konten yang terdeteksi PII.</div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              try {
                const data = exportUserTraining() || [];
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `saipul_training_${new Date().toISOString().slice(0,10)}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (e) { console.error('Export training failed', e); alert('Export failed'); }
            }}
            className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-sm"
          >Export Training</button>

          <label className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-sm cursor-pointer">
            Import
            <input type="file" accept="application/json" onChange={async (ev) => {
              try {
                const f = ev.target.files && ev.target.files[0];
                if (!f) return;
                const txt = await f.text();
                const parsed = JSON.parse(txt);
                const ok = importUserTraining(parsed);
                alert(ok ? 'Import berhasil' : 'Import gagal');
                ev.target.value = '';
              } catch (e) { console.error('Import failed', e); alert('Import gagal'); }
            }} style={{ display: 'none' }} />
          </label>

          <button
            onClick={() => {
              if (!confirm('Hapus semua contoh training lokal?')) return;
              try {
                const ok = clearUserTraining();
                alert(ok ? 'Training lokal dihapus' : 'Gagal menghapus');
              } catch (e) { console.error('Clear training', e); alert('Gagal'); }
            }}
            className="px-3 py-1 rounded bg-red-800 border border-red-700 text-sm text-red-100"
          >Clear Training</button>
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