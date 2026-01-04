import { Download, Upload } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";

export function StorageSettings({ settings, handleSave, exportKnowledgeBase, fileStats, formatFileSize, knowledgeStats }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border saipul-panel storage-overview">
        <h4 className="font-medium mb-2" style={{ color: 'var(--saipul-accent)' }}>Storage Overview</h4>
        <div className="text-xs space-y-2">
          <div className="flex justify-between">
            <span>Total Files:</span>
            <span className="text-green-400">{fileStats.totalFiles} files</span>
          </div>
          <div className="flex justify-between">
            <span>Total Size:</span>
            <span className="text-green-400">{formatFileSize(fileStats.totalSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Knowledge Items:</span>
            <span className="text-green-400">{knowledgeStats.totalItems || 0} items</span>
          </div>
          <div className="flex justify-between">
            <span>Chat History:</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg saipul-row">
          <div>
            <span style={{ color: 'var(--saipul-text)' }}>Auto Backup</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Backup otomatis data penting</p>
          </div>
          <ToggleSwitch 
            checked={settings.autoSave}
            onChange={(value) => handleSave("autoSave", value)}
            id="autoSave"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg saipul-row">
          <div>
            <span style={{ color: 'var(--saipul-text)' }}>Analytics</span>
            <p className="text-xs" style={{ color: 'var(--saipul-muted)' }}>Kumpulkan data penggunaan</p>
          </div>
          <ToggleSwitch 
            checked={settings.enableAnalytics}
            onChange={(value) => handleSave("enableAnalytics", value)}
            id="enableAnalytics"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Backup Interval (menit)</label>
        <select 
          value={settings.backupInterval}
          onChange={(e) => handleSave("backupInterval", parseInt(e.target.value))}
          className="w-full rounded-lg px-3 py-2"
          style={{ background: 'var(--saipul-surface)', border: '1px solid var(--saipul-border)', color: 'var(--saipul-text)' }}
        >
          <option value={15}>15 menit</option>
          <option value={30}>30 menit</option>
          <option value={60}>1 jam</option>
          <option value={120}>2 jam</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={exportKnowledgeBase}
          className="px-4 py-2 rounded-lg saipul-btn saipul-btn-export flex items-center justify-center gap-2"
          style={{ border: '1px solid var(--saipul-border)', color: 'var(--saipul-accent)' }}
        >
          <Download size={14} />
          Export Data
        </button>
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const importedData = JSON.parse(event.target.result);
                    alert('Import berhasil! Data telah diimpor.');
                    console.log('Imported data:', importedData);
                  } catch (error) {
                    void error;
                    alert('Error mengimpor data: Format tidak valid.');
                  }
                };
                reader.readAsText(file);
              }
            };
            input.click();
          }}
          className="px-4 py-2 rounded-lg saipul-btn saipul-btn-import flex items-center justify-center gap-2"
          style={{ border: '1px solid var(--saipul-border)', color: 'var(--saipul-text)' }}
        >
          <Upload size={14} />
          Import Data
        </button>
      </div>
    </div>
  );
}