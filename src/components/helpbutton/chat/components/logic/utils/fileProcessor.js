export const STORAGE_KEYS = {
  UPLOADED_DATA: 'saipul_uploaded_data',
  FILE_METADATA: 'saipul_file_metadata'
};

export const SETTINGS_KEY = 'saipul_settings';

export const DEFAULT_ALLOWED_TYPES = ['txt','md','csv','json','pdf','doc','docx','xls','xlsx','jpg','jpeg','png'];

import { DEFAULT_SETTINGS } from '../../../config.js';

export function extractSentences(text = '', max = 200) {
  if (!text) return [];
  return text
    .split(/[.!?]+/)
    .filter(s => s && s.trim().length > 10)
    .map(s => s.trim())
    .slice(0, max);
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function saveUploadedData(fileData) {
  const maybeDecompress = (v) => {
    try {
      if (!v) return null;
      if (window && window.LZString && typeof window.LZString.decompress === 'function') return JSON.parse(window.LZString.decompress(v));
      return JSON.parse(v);
    } catch (e) { void e; try { return JSON.parse(v); } catch (_e) { void _e; return null; } }
  };

  const maybeCompress = (obj) => {
    try {
      const str = JSON.stringify(obj);
      if (window && window.LZString && typeof window.LZString.compress === 'function') return window.LZString.compress(str);
      return str;
    } catch (e) { void e; return JSON.stringify(obj); }
  };

  const existingData = maybeDecompress(localStorage.getItem(STORAGE_KEYS.UPLOADED_DATA)) || [];
  const existingMetadata = maybeDecompress(localStorage.getItem(STORAGE_KEYS.FILE_METADATA)) || [];

  const updatedData = [...existingData, fileData];
  const meta = {
    fileName: fileData.fileName,
    fileSize: fileData.size,
    fileType: fileData.fileType,
    extension: fileData.extension,
    uploadDate: fileData.uploadDate,
    wordCount: fileData.wordCount,
    sentenceCount: fileData.sentences?.length || 0,
    processed: true
  };
  const updatedMetadata = [...existingMetadata, meta];

  try {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_DATA, maybeCompress(updatedData));
    localStorage.setItem(STORAGE_KEYS.FILE_METADATA, maybeCompress(updatedMetadata));
  } catch (e) { void e;
    // fallback to plain JSON
    try { localStorage.setItem(STORAGE_KEYS.UPLOADED_DATA, JSON.stringify(updatedData)); } catch (_e) { void _e; }
    try { localStorage.setItem(STORAGE_KEYS.FILE_METADATA, JSON.stringify(updatedMetadata)); } catch (_e) { void _e; }
  }

  // Dispatch an event so other parts of the app (useChatbot) can refresh KB state
  try {
    window.dispatchEvent(new CustomEvent('saipul_kb_updated', { detail: { knowledgeBase: null, uploadedData: updatedData, fileMetadata: updatedMetadata } }));
  } catch (e) {
    console.warn('Failed to dispatch saipul_kb_updated', e);
  }

  // Dispatch processed event for real-time notifications
  try {
    window.dispatchEvent(new CustomEvent('saipul_file_processed', { detail: { file: fileData.fileName, metadata: updatedMetadata[updatedMetadata.length - 1] } }));
  } catch (e) {
    console.warn('Failed to dispatch saipul_file_processed', e);
  }

  return { updatedData, updatedMetadata };
}

export function exportKnowledgeBase(payload, filename = `saipulai-knowledge-base-${new Date().toISOString().split('T')[0]}.json`) {
  const dataStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateFile(file, settings = {}) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const maxMb = settings.maxFileSize || 10;
  const allowed = settings.allowedFileTypes || DEFAULT_ALLOWED_TYPES;
  if ((file.size / (1024 * 1024)) > maxMb) {
    return { ok: false, reason: `File ${file.name} terlalu besar. Maks ${maxMb}MB.` };
  }
  if (!allowed.includes(extension)) {
    return { ok: false, reason: `Tipe file .${extension} tidak didukung.` };
  }
  return { ok: true, extension };
}

export function processFileGeneric(file, settings = {}) {
  return new Promise((resolve, reject) => {
    try {
      const validation = validateFile(file, settings);
      if (!validation.ok) return reject(new Error(validation.reason));

      const extension = validation.extension;
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let textContent = '';

          switch (extension) {
            case 'txt': case 'md': case 'csv':
              textContent = content;
              break;
            case 'json':
              try {
                const jsonData = JSON.parse(content);
                textContent = typeof jsonData === 'object' ? JSON.stringify(jsonData, null, 2) : String(jsonData);
              } catch {
                textContent = content;
              }
              break;
            case 'pdf':
              textContent = `[PDF Content: ${file.name}] (Simulated extraction)`;
              break;
            case 'doc': case 'docx':
              textContent = `[DOC Content: ${file.name}] (Simulated extraction)`;
              break;
            case 'xls': case 'xlsx':
              textContent = `[Spreadsheet: ${file.name}] (Simulated extraction)`;
              break;
            case 'jpg': case 'jpeg': case 'png':
              textContent = settings.extractTextFromImages ? `[Image OCR: ${file.name}]` : `[Image meta: ${file.name}]`;
              break;
            default:
              textContent = `[${extension?.toUpperCase() || 'FILE'}: ${file.name}] Content processed`;
          }

          const sentences = extractSentences(textContent, settings.maxSentences || 200);
          const wordCount = textContent ? textContent.split(/\s+/).filter(Boolean).length : 0;

          resolve({
            fileName: file.name,
            content: textContent,
            sentences,
            uploadDate: new Date().toISOString(),
            wordCount,
            fileType: file.type,
            extension,
            size: file.size
          });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      if (['txt','md','csv','json'].includes(extension)) reader.readAsText(file);
      else reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });
}
