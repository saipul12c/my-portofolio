import { useState, useCallback } from "react";
import { getFileIcon } from '../../logic/utils/fileIcons';
import { processFileGeneric, saveUploadedData, STORAGE_KEYS, exportKnowledgeBase as exportKB } from '../../logic/utils/fileProcessor';
import { storageService } from '../../logic/utils/storageService';

export function useFileManagement(settings, updateKnowledgeBase, safeKnowledgeBase, knowledgeStats) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileStats, setFileStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    byType: {},
    recentUploads: []
  });
  const [_uploadProgress, setUploadProgress] = useState(0);

  const loadFileStatistics = useCallback(() => {
    try {
      const savedUploadedData = storageService.get(STORAGE_KEYS.UPLOADED_DATA, []);
      const savedFileMetadata = storageService.get(STORAGE_KEYS.FILE_METADATA, []);
      
      let files = Array.isArray(savedUploadedData) ? savedUploadedData : [];
      let metadata = Array.isArray(savedFileMetadata) ? savedFileMetadata : [];

      setUploadedFiles(metadata.map(file => ({
        name: file.fileName,
        size: file.fileSize,
        type: file.fileType,
        extension: file.extension,
        uploadDate: file.uploadDate,
        sentences: file.sentenceCount,
        words: file.wordCount,
        processed: file.processed
      })));

      const stats = {
        totalFiles: files.length,
        totalSize: files.reduce((sum, file) => sum + (file.size || 0), 0),
        byType: {},
        recentUploads: metadata.slice(-5).reverse()
      };

      metadata.forEach(file => {
        const ext = file.extension;
        if (!stats.byType[ext]) stats.byType[ext] = { count: 0, totalSize: 0 };
        stats.byType[ext].count++;
        stats.byType[ext].totalSize += file.fileSize || 0;
      });

      setFileStats(stats);
    } catch (e) {
      console.error("Error loading file statistics:", e);
    }
  }, []);

  // file processing delegated to shared util: processFileGeneric

  const handleFileUpload = useCallback((event) => {
    if (!settings.enableFileUpload) {
      alert("File upload dinonaktifkan. Aktifkan di pengaturan terlebih dahulu.");
      return;
    }

    const files = Array.from(event.target.files);
    if (!files.length) return;

    let processedCount = 0;
    const totalFiles = files.length;

    files.forEach((file, index) => {
      setTimeout(() => {
        processFileGeneric(file, settings)
          .then(fileData => {
            const { updatedData, updatedMetadata } = saveUploadedData(fileData);

            if (updateKnowledgeBase) {
              updateKnowledgeBase({ uploadedData: updatedData, fileMetadata: updatedMetadata });
            }

            processedCount++;
            const pct = Math.round((processedCount / totalFiles) * 100);
            setUploadProgress(pct);
            try { window.dispatchEvent(new CustomEvent('saipul_upload_progress', { detail: { file: file.name, progress: pct } })); } catch (e) { void e; }

            loadFileStatistics();

            if (processedCount === totalFiles) {
              setTimeout(() => setUploadProgress(0), 800);
              try { window.dispatchEvent(new CustomEvent('saipul_all_files_processed', { detail: { count: processedCount } })); } catch (e) { void e; }
            }
          })
          .catch(error => {
            console.error(`Error processing file ${file.name}:`, error);
            try { window.dispatchEvent(new CustomEvent('saipul_file_process_error', { detail: { file: file.name, error: error.message } })); } catch (e) { void e; }
          });
      }, index * 500);
    });
  }, [settings, updateKnowledgeBase, loadFileStatistics]);

  const clearUploadedData = useCallback(() => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data yang diupload? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        localStorage.removeItem(STORAGE_KEYS.UPLOADED_DATA);
        localStorage.removeItem(STORAGE_KEYS.FILE_METADATA);
        setUploadedFiles([]);
        setFileStats({ totalFiles: 0, totalSize: 0, byType: {}, recentUploads: [] });
        
        if (updateKnowledgeBase) {
          updateKnowledgeBase({
            uploadedData: [],
            fileMetadata: []
          });
        }
        
        alert("Semua data yang diupload telah dihapus!");
      } catch (e) {
        console.error("Error clearing uploaded data:", e);
        alert("Error clearing uploaded data.");
      }
    }
  }, [updateKnowledgeBase]);

  const exportKnowledgeBase = useCallback(() => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        knowledgeBase: safeKnowledgeBase,
        fileStats: fileStats,
        settings: settings,
        stats: knowledgeStats,
        uploadedFiles: uploadedFiles
      };
      exportKB(exportData);
      alert("Knowledge base berhasil diexport!");
    } catch (e) {
      console.error("Error exporting knowledge base:", e);
      alert("Error exporting knowledge base.");
    }
  }, [safeKnowledgeBase, fileStats, settings, knowledgeStats, uploadedFiles]);

  

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    uploadedFiles,
    fileStats,
    loadFileStatistics,
    handleFileUpload,
    clearUploadedData,
    exportKnowledgeBase,
    getFileIcon,
    formatFileSize
  };
}