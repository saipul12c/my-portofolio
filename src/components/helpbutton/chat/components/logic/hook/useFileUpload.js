import { useState, useCallback } from 'react';
import { processFileGeneric, saveUploadedData, formatFileSize } from '../utils/fileProcessor.js';

export function useFileUpload(settings, updateKnowledgeBase, setMessages) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const handleFileUpload = useCallback(async (event) => {
    const fileList = event?.target?.files || (event instanceof FileList ? event : Array.isArray(event) ? event : null);
    if (!fileList || !fileList.length) return;

    const files = Array.from(fileList);
    setIsUploading(true);
    setUploadProgress(10);

    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      try {
        const fileData = await processFileGeneric(file, settings);
        const { updatedData, updatedMetadata } = saveUploadedData(fileData);

        if (typeof updateKnowledgeBase === 'function') {
          updateKnowledgeBase({
            uploadedData: updatedData,
            fileMetadata: updatedMetadata
          });
        }

        const pct = Math.round(((i + 1) / totalFiles) * 100);
        setUploadProgress(pct);

        if (typeof setMessages === 'function') {
          const docMsg = {
            id: `doc_upload_${Date.now()}_${i}`,
            from: "bot",
            text: `📎 **Berkas "${fileData.fileName}" berhasil diunggah!**\n\n• **Ukuran**: ${formatFileSize(fileData.size)}\n• **Tipe**: \`.${fileData.extension}\`\n• **Indeks Pengetahuan**: **${fileData.sentences?.length || 0} kalimat** dan **${fileData.wordCount || 0} kata** telah dipelajari.\n\nKamu sekarang bisa langsung bertanya: *"Apa isi dari ${fileData.fileName}?"* atau meminta ringkasan topik tertentu dari dokumen tersebut.`,
            timestamp: new Date().toISOString(),
            type: "system_doc_upload",
            confidence: 1.0
          };
          setMessages(prev => [...prev, docMsg]);
        }

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        if (typeof setMessages === 'function') {
          const errorMsg = {
            id: `doc_error_${Date.now()}_${i}`,
            from: "bot",
            text: `❌ **Gagal memproses berkas "${file.name}"**:\n${error.message}`,
            timestamp: new Date().toISOString(),
            type: "error"
          };
          setMessages(prev => [...prev, errorMsg]);
        }
      }
    }

    setIsUploading(false);
    setUploadProgress(0);
    setFileUploadKey(prev => prev + 1);

    if (event?.target && event.target.value !== undefined) {
      event.target.value = '';
    }
  }, [settings, updateKnowledgeBase, setMessages]);

  return {
    uploadProgress,
    isUploading,
    fileUploadKey,
    setFileUploadKey,
    handleFileUpload,
    setUploadProgress
  };
}
