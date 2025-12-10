import { Download, Upload } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";

export function StorageSettings({ settings, handleSave, exportKnowledgeBase, fileStats, formatFileSize, knowledgeStats }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/30">
        <h4 className="font-medium text-blue-400 mb-2">Storage Overview</h4>
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
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Auto Backup</span>
            <p className="text-xs text-gray-500">Backup otomatis data penting</p>
          </div>
          <ToggleSwitch 
            checked={settings.autoSave}
            onChange={(value) => handleSave("autoSave", value)}
            id="autoSave"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Analytics</span>
            <p className="text-xs text-gray-500">Kumpulkan data penggunaan</p>
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
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
          className="px-4 py-2 rounded-lg bg-green-900/30 hover:bg-green-800/50 transition text-green-400 border border-green-500/30 flex items-center justify-center gap-2"
        >
          <Download size={14} />
          Export Data
        </button>
        <button
          onClick={() => {/* TODO: Implement import */}}
          className="px-4 py-2 rounded-lg bg-blue-900/30 hover:bg-blue-800/50 transition text-blue-400 border border-blue-500/30 flex items-center justify-center gap-2"
        >
          <Upload size={14} />
          Import Data
        </button>
      </div>
    </div>
  );
}