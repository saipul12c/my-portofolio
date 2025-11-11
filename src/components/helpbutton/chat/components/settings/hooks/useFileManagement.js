import { useState } from "react";

export function useFileManagement(settings, updateKnowledgeBase, safeKnowledgeBase, knowledgeStats) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileStats, setFileStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    byType: {},
    recentUploads: []
  });

  const loadFileStatistics = () => {
    try {
      const savedUploadedData = localStorage.getItem("saipul_uploaded_data");
      const savedFileMetadata = localStorage.getItem("saipul_file_metadata");
      
      let files = [];
      let metadata = [];
      
      if (savedUploadedData) {
        files = JSON.parse(savedUploadedData);
      }
      if (savedFileMetadata) {
        metadata = JSON.parse(savedFileMetadata);
      }

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
        if (!stats.byType[ext]) {
          stats.byType[ext] = { count: 0, totalSize: 0 };
        }
        stats.byType[ext].count++;
        stats.byType[ext].totalSize += file.fileSize || 0;
      });

      setFileStats(stats);
    } catch (e) {
      console.error("Error loading file statistics:", e);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let processedCount = 0;
    const totalFiles = files.length;

    files.forEach((file, index) => {
      setTimeout(() => {
        processFile(file)
          .then(fileData => {
            const existingData = JSON.parse(localStorage.getItem("saipul_uploaded_data") || "[]");
            const existingMetadata = JSON.parse(localStorage.getItem("saipul_file_metadata") || "[]");
            
            const updatedData = [...existingData, fileData];
            const updatedMetadata = [...existingMetadata, {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              extension: file.name.split('.').pop()?.toLowerCase(),
              uploadDate: new Date().toISOString(),
              wordCount: fileData.wordCount,
              sentenceCount: fileData.sentences?.length || 0,
              processed: true
            }];

            localStorage.setItem("saipul_uploaded_data", JSON.stringify(updatedData));
            localStorage.setItem("saipul_file_metadata", JSON.stringify(updatedMetadata));

            if (updateKnowledgeBase) {
              updateKnowledgeBase({
                uploadedData: updatedData,
                fileMetadata: updatedMetadata
              });
            }

            processedCount++;
            loadFileStatistics();

            if (processedCount === totalFiles) {
              alert(`✅ ${processedCount} file berhasil diupload dan diproses!`);
            }
          })
          .catch(error => {
            console.error(`Error processing file ${file.name}:`, error);
            alert(`❌ Error processing ${file.name}: ${error.message}`);
          });
      }, index * 500);
    });
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (file.size > settings.maxFileSize * 1024 * 1024) {
        reject(new Error(`File size exceeds ${settings.maxFileSize}MB limit`));
        return;
      }

      if (!settings.allowedFileTypes.includes(extension)) {
        reject(new Error(`File type .${extension} not allowed`));
        return;
      }

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let textContent = '';
          let sentences = [];
          let wordCount = 0;

          switch (extension) {
            case 'txt':
            case 'md':
            case 'csv':
              textContent = content;
              break;
            case 'json':
              try {
                const jsonData = JSON.parse(content);
                textContent = typeof jsonData === 'object' ? 
                  JSON.stringify(jsonData, null, 2) : String(jsonData);
              } catch {
                textContent = content;
              }
              break;
            case 'pdf':
              textContent = `[PDF Content: ${file.name}] Simulated PDF text extraction would go here...`;
              break;
            case 'doc':
            case 'docx':
              textContent = `[DOC Content: ${file.name}] Simulated document text extraction...`;
              break;
            case 'xls':
            case 'xlsx':
              textContent = `[Spreadsheet: ${file.name}] Simulated spreadsheet data extraction...`;
              break;
            case 'jpg':
            case 'jpeg':
            case 'png':
              textContent = `[Image: ${file.name}] ${settings.extractTextFromImages ? 
                'Simulated OCR text extraction...' : 'Image metadata analysis...'}`;
              break;
            default:
              textContent = `[${extension.toUpperCase()} File: ${file.name}] Content processing...`;
          }

          if (textContent) {
            sentences = textContent
              .split(/[.!?]+/)
              .filter(sentence => sentence.trim().length > 10)
              .map(sentence => sentence.trim())
              .slice(0, 200);

            wordCount = textContent.split(/\s+/).length;
          }

          resolve({
            fileName: file.name,
            content: textContent,
            sentences: sentences,
            uploadDate: new Date().toISOString(),
            wordCount: wordCount,
            fileType: file.type,
            extension: extension,
            size: file.size
          });

        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      
      if (['txt', 'md', 'csv', 'json'].includes(extension)) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const clearUploadedData = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data yang diupload? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        localStorage.removeItem("saipul_uploaded_data");
        localStorage.removeItem("saipul_file_metadata");
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
  };

  const exportKnowledgeBase = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        knowledgeBase: safeKnowledgeBase,
        fileStats: fileStats,
        settings: settings,
        stats: knowledgeStats
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `saipulai-knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      alert("Knowledge base berhasil diexport!");
    } catch (e) {
      console.error("Error exporting knowledge base:", e);
      alert("Error exporting knowledge base.");
    }
  };

  const getFileIcon = (extension) => {
    const icons = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'txt': '📃',
      'xls': '📊',
      'xlsx': '📊',
      'csv': '📈',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'json': '⚙️',
      'md': '📋'
    };
    return icons[extension] || '📁';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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