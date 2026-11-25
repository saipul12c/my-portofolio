import { useState, useCallback } from "react";
import { getFileIcon } from '../../logic/utils/fileIcons';
import { 
  processFileGeneric, 
  saveUploadedData, 
  removeSingleUploadedFile, 
  readStoredUploadedData,
  STORAGE_KEYS, 
  exportKnowledgeBase as exportKB,
  formatFileSize 
} from '../../logic/utils/fileProcessor';
import { storageService } from '../../logic/utils/storageService';

export function useFileManagement(settings, updateKnowledgeBase, safeKnowledgeBase, knowledgeStats) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileStats, setFileStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    byType: {},
    recentUploads: []
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const loadFileStatistics = useCallback(() => {
    try {
      const { uploadedData: files, fileMetadata: metadata } = readStoredUploadedData();

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
        const ext = file.extension || 'file';
        if (!stats.byType[ext]) stats.byType[ext] = { count: 0, totalSize: 0 };
        stats.byType[ext].count++;
        stats.byType[ext].totalSize += file.fileSize || 0;
      });

      setFileStats(stats);
    } catch (e) {
      console.error("Error loading file statistics:", e);
    }
  }, []);

  const handleFileUpload = useCallback(async (event) => {
    if (settings && settings.enableFileUpload === false) {
      alert("File upload dinonaktifkan. Aktifkan di pengaturan terlebih dahulu.");
      return;
    }

    const fileList = event?.target?.files || (event instanceof FileList ? event : Array.isArray(event) ? event : null);
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setIsUploading(true);
    setUploadProgress(5);

    let processedCount = 0;
    const totalFiles = files.length;
    let errors = [];

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      try {
        const fileData = await processFileGeneric(file, settings);
        const { updatedData, updatedMetadata } = saveUploadedData(fileData);

        if (updateKnowledgeBase) {
          updateKnowledgeBase({ uploadedData: updatedData, fileMetadata: updatedMetadata });
        }

        processedCount++;
        const pct = Math.round(((i + 1) / totalFiles) * 100);
        setUploadProgress(pct);

        try {
          window.dispatchEvent(new CustomEvent('saipul_upload_progress', {
            detail: { file: file.name, progress: pct, current: i + 1, total: totalFiles }
          }));
        } catch (_e) { void _e; }

      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
        errors.push(`${file.name}: ${err.message}`);
        try {
          window.dispatchEvent(new CustomEvent('saipul_file_process_error', {
            detail: { file: file.name, error: err.message }
          }));
        } catch (_e) { void _e; }
      }
    }

    loadFileStatistics();
    setIsUploading(false);
    setTimeout(() => setUploadProgress(0), 1000);

    if (processedCount > 0) {
      try {
        window.dispatchEvent(new CustomEvent('saipul_all_files_processed', { detail: { count: processedCount } }));
      } catch (_e) { void _e; }
    }

    if (errors.length > 0) {
      alert(`Pemberitahuan Upload:\n${processedCount} berhasil.\n${errors.length} gagal:\n• ${errors.join('\n• ')}`);
    }

    // Reset input value jika dipicu dari event input
    if (event?.target && event.target.value !== undefined) {
      event.target.value = '';
    }
  }, [settings, updateKnowledgeBase, loadFileStatistics]);

  const deleteSingleFile = useCallback((fileName) => {
    if (confirm(`Hapus file "${fileName}" dari memori SaipulAI?`)) {
      const { updatedData, updatedMetadata } = removeSingleUploadedFile(fileName);
      if (updateKnowledgeBase) {
        updateKnowledgeBase({ uploadedData: updatedData, fileMetadata: updatedMetadata });
      }
      loadFileStatistics();
    }
  }, [updateKnowledgeBase, loadFileStatistics]);

  const clearUploadedData = useCallback(() => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data yang diupload? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        storageService.remove(STORAGE_KEYS.UPLOADED_DATA);
        storageService.remove(STORAGE_KEYS.FILE_METADATA);
        setUploadedFiles([]);
        setFileStats({ totalFiles: 0, totalSize: 0, byType: {}, recentUploads: [] });
        
        if (updateKnowledgeBase) {
          updateKnowledgeBase({
            uploadedData: [],
            fileMetadata: []
          });
        }
        
        alert("Semua data yang diupload telah berhasil dibersihkan!");
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
    } catch (e) {
      console.error("Error exporting knowledge base:", e);
      alert("Error exporting knowledge base.");
    }
  }, [safeKnowledgeBase, fileStats, settings, knowledgeStats, uploadedFiles]);

  return {
    uploadedFiles,
    fileStats,
    uploadProgress,
    isUploading,
    loadFileStatistics,
    handleFileUpload,
    deleteSingleFile,
    clearUploadedData,
    exportKnowledgeBase,
    getFileIcon,
    formatFileSize
  };
}
