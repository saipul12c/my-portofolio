export const STORAGE_KEYS = {
  UPLOADED_DATA: 'saipul_uploaded_data',
  FILE_METADATA: 'saipul_file_metadata'
};

export const SETTINGS_KEY = 'saipul_settings';

export const DEFAULT_ALLOWED_TYPES = ['txt', 'md', 'csv', 'json', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];

import { DEFAULT_SETTINGS } from '../../../config.js';

export function extractSentences(text = '', max = 250) {
  if (!text) return [];
  return text
    .split(/[.!?\n]+/)
    .filter(s => s && s.trim().length > 8)
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

function maybeDecompress(v) {
  try {
    if (!v) return null;
    if (typeof window !== 'undefined' && window.LZString && typeof window.LZString.decompress === 'function') {
      const decompressed = window.LZString.decompress(v);
      if (decompressed) return JSON.parse(decompressed);
    }
    return JSON.parse(v);
  } catch {
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  }
}

function maybeCompress(obj) {
  try {
    const str = JSON.stringify(obj);
    if (typeof window !== 'undefined' && window.LZString && typeof window.LZString.compress === 'function') {
      return window.LZString.compress(str);
    }
    return str;
  } catch {
    return JSON.stringify(obj);
  }
}

/**
 * Membaca data & metadata berkas terunggah secara konsisten (terkompresi maupun JSON polos)
 */
export function readStoredUploadedData() {
  try {
    if (typeof localStorage === 'undefined') {
      return { uploadedData: [], fileMetadata: [] };
    }
    const rawData = localStorage.getItem(STORAGE_KEYS.UPLOADED_DATA);
    const rawMeta = localStorage.getItem(STORAGE_KEYS.FILE_METADATA);
    const uploadedData = maybeDecompress(rawData);
    const fileMetadata = maybeDecompress(rawMeta);
    return {
      uploadedData: Array.isArray(uploadedData) ? uploadedData : [],
      fileMetadata: Array.isArray(fileMetadata) ? fileMetadata : []
    };
  } catch {
    return { uploadedData: [], fileMetadata: [] };
  }
}

/**
 * Menyimpan data berkas ke localStorage dengan kompresi dan perlindungan kuota (Quota-Safe)
 */
export function saveUploadedData(fileData) {
  const { uploadedData: existingData, fileMetadata: existingMetadata } = readStoredUploadedData();

  // Hindari duplikasi berkas dengan nama yang sama persis (timpa versi lama)
  const filteredData = existingData.filter(d => d.fileName !== fileData.fileName);
  const filteredMetadata = existingMetadata.filter(m => m.fileName !== fileData.fileName);

  const updatedData = [...filteredData, fileData];
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
  const updatedMetadata = [...filteredMetadata, meta];

  // Fungsi internal untuk mencoba penyimpanan dengan pemangkasan cerdas jika kuota penuh
  const tryPersist = (dataList, metaList) => {
    try {
      localStorage.setItem(STORAGE_KEYS.UPLOADED_DATA, maybeCompress(dataList));
      localStorage.setItem(STORAGE_KEYS.FILE_METADATA, maybeCompress(metaList));
      return true;
    } catch (quotaError) {
      console.warn("Storage quota warning, applying smart payload optimization...", quotaError);
      // Optimasi kuota tahap 1: Hapus raw content dari file-file lama, sisakan sentences dan metadata
      try {
        const leanData = dataList.map((item, idx) => {
          if (idx < dataList.length - 1 && item.content && item.content.length > 2000) {
            return { ...item, content: item.content.slice(0, 1000) + '... [konten diringkas untuk efisiensi penyimpanan]' };
          }
          return item;
        });
        localStorage.setItem(STORAGE_KEYS.UPLOADED_DATA, maybeCompress(leanData));
        localStorage.setItem(STORAGE_KEYS.FILE_METADATA, maybeCompress(metaList));
        return true;
      } catch {
        // Optimasi kuota tahap 2: Simpan hanya 10 file terbaru
        try {
          const recentData = dataList.slice(-10);
          const recentMeta = metaList.slice(-10);
          localStorage.setItem(STORAGE_KEYS.UPLOADED_DATA, JSON.stringify(recentData));
          localStorage.setItem(STORAGE_KEYS.FILE_METADATA, JSON.stringify(recentMeta));
          return true;
        } catch (_e3) {
          console.error("Gagal menyimpan ke localStorage bahkan setelah optimasi kuota:", _e3);
          return false;
        }
      }
    }
  };

  tryPersist(updatedData, updatedMetadata);

  // Dispatch event agar useChatbot dan seluruh komponen langsung menyegarkan state
  try {
    window.dispatchEvent(new CustomEvent('saipul_kb_updated', {
      detail: { knowledgeBase: null, uploadedData: updatedData, fileMetadata: updatedMetadata }
    }));
  } catch (e) {
    console.warn('Failed to dispatch saipul_kb_updated', e);
  }

  try {
    window.dispatchEvent(new CustomEvent('saipul_file_processed', {
      detail: { file: fileData.fileName, metadata: meta }
    }));
  } catch (e) {
    console.warn('Failed to dispatch saipul_file_processed', e);
  }

  return { updatedData, updatedMetadata };
}

/**
 * Hapus satu berkas tertentu dari memori dan storage
 */
export function removeSingleUploadedFile(fileName) {
  try {
    const { uploadedData: data, fileMetadata: meta } = readStoredUploadedData();
    if (!data.length && !meta.length) return { updatedData: [], updatedMetadata: [] };

    const updatedData = data.filter(f => f.fileName !== fileName);
    const updatedMetadata = meta.filter(m => m.fileName !== fileName);

    localStorage.setItem(STORAGE_KEYS.UPLOADED_DATA, maybeCompress(updatedData));
    localStorage.setItem(STORAGE_KEYS.FILE_METADATA, maybeCompress(updatedMetadata));

    window.dispatchEvent(new CustomEvent('saipul_kb_updated', {
      detail: { knowledgeBase: null, uploadedData: updatedData, fileMetadata: updatedMetadata }
    }));

    return { updatedData, updatedMetadata };
  } catch (err) {
    console.error("Error removing uploaded file:", err);
    return { updatedData: [], updatedMetadata: [] };
  }
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
    return { ok: false, reason: `File ${file.name} terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimal ${maxMb}MB.` };
  }
  if (!allowed.includes(extension)) {
    return { ok: false, reason: `Tipe file .${extension} tidak didukung. Tipe yang didukung: ${allowed.join(', ')}.` };
  }
  return { ok: true, extension };
}

/**
 * Ekstraktor teks cerdas untuk berkas teks, markdown, CSV tabel, dan JSON
 */
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
          let customSentences = [];

          switch (extension) {
            case 'txt':
            case 'md':
              textContent = typeof content === 'string' ? content : '';
              break;

            case 'csv': {
              const rawStr = typeof content === 'string' ? content : '';
              const lines = rawStr.split(/\r?\n/).filter(line => line.trim().length > 0);
              if (lines.length > 0) {
                const headers = lines[0].split(/[,;\t]/).map(h => h.trim().replace(/^["']|["']$/g, ''));
                const rowCount = lines.length - 1;

                // Bangun ringkasan tabel CSV
                const sampleRows = lines.slice(1, Math.min(lines.length, 6)).map((row, idx) => {
                  const cells = row.split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
                  return `Baris ${idx + 1}: ${headers.map((h, i) => `${h}=${cells[i] || ''}`).join(', ')}`;
                }).join('\n');

                textContent = `[Dokumen Tabel CSV: ${file.name}]\nKolom: ${headers.join(', ')}\nTotal Data: ${rowCount} baris.\nPratinjau Data:\n${sampleRows}\n\nKonten Lengkap:\n${rawStr}`;

                // Ekstrak tiap baris sebagai unit pengetahuan (sentence)
                lines.slice(1, 150).forEach((row, idx) => {
                  const cells = row.split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
                  const rowSentence = `Data ${file.name} baris ${idx + 1}: ${headers.map((h, i) => `${h} adalah ${cells[i] || '-'}`).join(', ')}.`;
                  customSentences.push(rowSentence);
                });
              } else {
                textContent = rawStr;
              }
              break;
            }

            case 'json':
              try {
                const jsonData = JSON.parse(content);
                if (Array.isArray(jsonData)) {
                  textContent = `[Dokumen JSON Array: ${file.name}]\nTotal Elemen: ${jsonData.length}\n${JSON.stringify(jsonData.slice(0, 50), null, 2)}`;
                  jsonData.slice(0, 50).forEach((item, idx) => {
                    customSentences.push(`Item ${idx + 1} pada ${file.name}: ${JSON.stringify(item)}.`);
                  });
                } else if (typeof jsonData === 'object' && jsonData !== null) {
                  textContent = `[Dokumen JSON Objek: ${file.name}]\nKunci: ${Object.keys(jsonData).join(', ')}\n${JSON.stringify(jsonData, null, 2)}`;
                  Object.entries(jsonData).forEach(([k, v]) => {
                    customSentences.push(`Atribut ${k} pada ${file.name}: ${typeof v === 'object' ? JSON.stringify(v) : v}.`);
                  });
                } else {
                  textContent = String(jsonData);
                }
              } catch {
                textContent = typeof content === 'string' ? content : '';
              }
              break;

            case 'pdf':
              textContent = `[Dokumen PDF: ${file.name}]\nUkuran: ${formatFileSize(file.size)}. Dokumen PDF telah terindeks sebagai referensi berkas.`;
              customSentences.push(`File PDF bernama ${file.name} dengan ukuran ${formatFileSize(file.size)} telah diunggah.`);
              break;

            case 'doc':
            case 'docx':
              textContent = `[Dokumen Word: ${file.name}]\nUkuran: ${formatFileSize(file.size)}. Dokumen Word telah terindeks sebagai referensi berkas.`;
              customSentences.push(`File dokumen Word bernama ${file.name} telah diunggah ke Knowledge Base.`);
              break;

            case 'xls':
            case 'xlsx':
              textContent = `[Spreadsheet Excel: ${file.name}]\nUkuran: ${formatFileSize(file.size)}. Lembar kerja Excel telah terindeks sebagai referensi berkas.`;
              customSentences.push(`File spreadsheet Excel bernama ${file.name} telah terdaftar di memori SaipulAI.`);
              break;

            case 'jpg':
            case 'jpeg':
            case 'png':
              textContent = `[Gambar: ${file.name}]\nTipe: ${file.type}, Ukuran: ${formatFileSize(file.size)}.`;
              customSentences.push(`File gambar visual ${file.name} telah diunggah.`);
              break;

            default:
              textContent = `[Dokumen ${extension?.toUpperCase() || 'FILE'}: ${file.name}] Ukuran: ${formatFileSize(file.size)}.`;
              customSentences.push(`File ${file.name} telah diunggah ke sistem.`);
          }

          const extracted = extractSentences(textContent, settings.maxSentences || 250);
          const finalSentences = customSentences.length > 0 ? [...customSentences, ...extracted].slice(0, 300) : extracted;
          const wordCount = textContent ? textContent.split(/\s+/).filter(Boolean).length : 0;

          resolve({
            fileName: file.name,
            content: textContent,
            sentences: finalSentences,
            uploadDate: new Date().toISOString(),
            wordCount,
            fileType: file.type || `application/${extension}`,
            extension,
            size: file.size
          });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error(`Gagal membaca berkas ${file.name}`));

      if (['txt', 'md', 'csv', 'json'].includes(extension)) {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsDataURL(file);
      }
    } catch (err) {
      reject(err);
    }
  });
}
