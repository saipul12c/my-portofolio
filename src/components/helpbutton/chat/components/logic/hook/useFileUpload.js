import { useState } from 'react';

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

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!settings.allowedFileTypes.includes(fileExtension)) {
          throw new Error(`Tipe file ${fileExtension} tidak didukung.`);
        }

        const fileData = await processFile(file, fileExtension);
        
        const existingData = JSON.parse(localStorage.getItem("saipul_uploaded_data") || "[]");
        const existingMetadata = JSON.parse(localStorage.getItem("saipul_file_metadata") || "[]");
        
        const updatedData = [...existingData, fileData];
        const updatedMetadata = [...existingMetadata, {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          extension: fileExtension,
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

  const processFile = (file, extension) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
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
            case 'json':
              textContent = content;
              break;
            case 'pdf':
              textContent = `[PDF Content: ${file.name}] Teks ekstraksi dari file PDF akan diproses di sini...`;
              break;
            case 'doc':
            case 'docx':
              textContent = `[DOC Content: ${file.name}] Teks dari document file...`;
              break;
            case 'xls':
            case 'xlsx':
              textContent = `[Spreadsheet: ${file.name}] Data spreadsheet akan diproses...`;
              break;
            case 'jpg':
            case 'jpeg':
            case 'png':
              textContent = `[Image: ${file.name}] Metadata gambar akan dianalisis...`;
              break;
            default:
              textContent = `[${extension.toUpperCase()} File: ${file.name}] Konten file akan diproses...`;
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

  return {
    uploadProgress,
    fileUploadKey,
    setFileUploadKey,
    handleFileUpload,
    setUploadProgress
  };
}