import { useState } from 'react';
import { processFileGeneric, saveUploadedData, STORAGE_KEYS } from '../utils/fileProcessor';

export function useFileUpload(settings, updateKnowledgeBase, setMessages) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let processedCount = 0;
    const totalFiles = files.length;

    for (const file of files) {
      try {
        setUploadProgress(Math.round((processedCount / totalFiles) * 100));
        
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > settings.maxFileSize) {
          throw new Error(`File ${file.name} terlalu besar (${fileSizeMB.toFixed(1)}MB). Maksimal ${settings.maxFileSize}MB.`);
        }

        // process and validate file using shared util
        const fileData = await processFileGeneric(file, settings);
        const { updatedData, updatedMetadata } = saveUploadedData(fileData);

        if (updateKnowledgeBase) {
          updateKnowledgeBase({
            uploadedData: updatedData,
            fileMetadata: updatedMetadata
          });
        }

        processedCount++;
        setUploadProgress(Math.round((processedCount / totalFiles) * 100));

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        const errorMsg = {
          from: "bot",
          text: `❌ **Error processing ${file.name}**: ${error.message}`,
          timestamp: new Date().toISOString(),
          type: "error"
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    }

    if (processedCount > 0) {
      const successMsg = {
        from: "bot",
        text: `✅ **${processedCount} file berhasil diupload!**\n\nFile telah ditambahkan ke knowledge base dan siap digunakan untuk pencarian.`,
        timestamp: new Date().toISOString(),
        type: "success"
      };
      setMessages(prev => [...prev, successMsg]);
    }

    setUploadProgress(0);
    setFileUploadKey(prev => prev + 1);
  };

  // file processing delegated to processFileGeneric in utils

  return {
    uploadProgress,
    fileUploadKey,
    setFileUploadKey,
    handleFileUpload,
    setUploadProgress
  };
}