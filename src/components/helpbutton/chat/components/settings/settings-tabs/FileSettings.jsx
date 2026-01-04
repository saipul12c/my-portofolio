import { Upload, Trash2 } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { FILE_SIZE_OPTIONS, FILE_TYPE_PRESETS } from '../settingsConfig';
import { useRef, useEffect } from 'react';

export function FileSettings({ 
  settings, 
  handleSave, 
  handleFileUpload, 
  clearUploadedData, 
  getFileIcon, 
  formatFileSize, 
  fileStats,
  uploadProgress
}) {
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      if (fileInputRef && fileInputRef.current) fileInputRef.current.click();
    };
    window.addEventListener('saipul_open_upload', handler);
    return () => window.removeEventListener('saipul_open_upload', handler);
  }, []);
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Upload File</span>
            <p className="text-xs text-gray-500">Aktifkan upload file multi-format</p>
          </div>
          <ToggleSwitch 
            checked={settings.enableFileUpload}
            onChange={(value) => handleSave("enableFileUpload", value)}
            id="enableFileUpload"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Gunakan Data Uploaded</span>
            <p className="text-xs text-gray-500">Gunakan data dari file untuk respons</p>
          </div>
          <ToggleSwitch 
            checked={settings.useUploadedData}
            onChange={(value) => handleSave("useUploadedData", value)}
            id="useUploadedData"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div>
            <span className="text-white">Ekstrak Teks dari Gambar</span>
            <p className="text-xs text-gray-500">OCR simulation untuk gambar</p>
          </div>
          <ToggleSwitch 
            checked={settings.extractTextFromImages}
            onChange={(value) => handleSave("extractTextFromImages", value)}
            id="extractTextFromImages"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Max File Size (MB)</label>
          <select 
            value={settings.maxFileSize}
            onChange={(e) => handleSave("maxFileSize", parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {FILE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s} MB</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">File Types Allowed</label>
          <select 
            value={Array.isArray(settings.allowedFileTypes) ? settings.allowedFileTypes.join(',') : settings.allowedFileTypes}
            onChange={(e) => handleSave("allowedFileTypes", e.target.value.split(','))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {FILE_TYPE_PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {settings.enableFileUpload && (
        <div className="p-4 bg-gray-800/30 rounded-lg border border-dashed border-gray-600">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-300 mb-1">Upload File Multi-Format</span>
            <span className="text-xs text-gray-500 text-center">
              Support: PDF, DOC, XLS, Images, JSON, CSV, TXT
              <br />
              Max: {settings.maxFileSize}MB per file
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept={settings.allowedFileTypes.map(ext => `.${ext}`).join(',')}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
          </label>
        </div>
      )}

      {typeof uploadProgress === 'number' && uploadProgress > 0 && (
        <div className="mt-3">
          <div className="text-xs text-gray-400 mb-1">Upload Progress: {uploadProgress}%</div>
          <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
            <div style={{ width: `${uploadProgress}%` }} className="h-2 bg-cyan-500 transition-all" />
          </div>
        </div>
      )}

      {fileStats.totalFiles > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-green-400">File Statistics</h4>
            <span className="text-xs text-gray-400">{fileStats.totalFiles} files • {formatFileSize(fileStats.totalSize)}</span>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-xs text-gray-400">Distribution by Type:</h5>
            {Object.entries(fileStats.byType).map(([type, data]) => (
              <div key={type} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1">
                  {getFileIcon(type)} .{type}
                </span>
                <span>
                  {data.count} files • {formatFileSize(data.totalSize)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h5 className="text-xs text-gray-400">Recent Uploads:</h5>
            {fileStats.recentUploads.map((file, index) => (
              <div key={index} className="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.extension)}
                  <div>
                    <div className="text-white">{file.fileName}</div>
                    <div className="text-gray-400">
                      {new Date(file.uploadDate).toLocaleDateString()} • {formatFileSize(file.fileSize)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={clearUploadedData}
            className="w-full px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-800/50 transition text-red-400 border border-red-500/30 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Hapus Semua Data Uploaded
          </button>
        </div>
      )}
    </div>
  );
}