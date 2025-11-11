import { calculateMath } from './mathCalculator';
import { getKnowledgeResponse } from './knowledgeBase';
import { handleConversion } from './conversions';
import { generatePrediction, analyzeData, calculateStatistics } from './analytics';
import { extractThemes, getRandomItem } from './helpers';

export function getSmartReply(msg, settings, conversationContext, safeKnowledgeBase, knowledgeStats) {
  const text = msg.toLowerCase().trim();

  if (text.includes('upload') || text === 'upload_file') {
    return `📁 **Upload File**\n\nAnda dapat mengupload berbagai jenis file:\n\n• 📄 **Dokumen**: PDF, DOC, DOCX, TXT\n• 📊 **Spreadsheet**: XLS, XLSX, CSV\n• 🖼️ **Gambar**: JPG, PNG, JPEG\n• 📝 **Lainnya**: JSON, MD\n\n**Fitur**:\n• Ekstraksi teks otomatis\n• Pencarian konten\n• Integrasi knowledge base\n• Metadata tracking\n\nKlik tombol upload (📎) untuk memulai!`;
  }

  const mathResult = calculateMath(text, settings.calculationPrecision);
  if (mathResult) return mathResult;

  const conversionResult = handleConversion(text);
  if (conversionResult) return conversionResult;

  if (text.includes('prediksi') || text.includes('forecast')) {
    if (text.includes('harga') || text.includes('saham')) return generatePrediction('harga', text);
    if (text.includes('cuaca') || text.includes('weather')) return generatePrediction('cuaca', text);
    if (text.includes('penjualan') || text.includes('sales')) return generatePrediction('penjualan', text);
    return generatePrediction('umum', text);
  }

  const analysisResult = analyzeData(text);
  if (analysisResult) return analysisResult;

  const statsResult = calculateStatistics(text);
  if (statsResult) return statsResult;

  const knowledgeResponse = getKnowledgeResponse(text, safeKnowledgeBase, settings);
  if (knowledgeResponse) return knowledgeResponse;

  if (settings.memoryContext && conversationContext.length > 0) {
    const lastUserMessage = conversationContext.filter(msg => msg.role === 'user').pop();
    if (lastUserMessage && (text.includes('itu') || text.includes('tersebut') || text.includes('yang tadi'))) {
      return `Berdasarkan konteks sebelumnya tentang "${lastUserMessage.content.substring(0, 50)}...", bisa kamu jelaskan lebih spesifik apa yang ingin diketahui? Saya bisa bantu dengan analisis lebih detail.`;
    }
  }

  if ((text.includes('data') && text.includes('tersedia')) || text.includes('knowledge base') || text.includes('info data')) {
    const stats = knowledgeStats;
    let response = `📚 **Knowledge Base SaipulAI v6.0**\n\n`;
    
    if (stats.aiConcepts > 0) response += `• 🤖 **AI Concepts**: ${stats.aiConcepts} konsep\n`;
    if (stats.hobbies > 0) response += `• 🎯 **Hobbies**: ${stats.hobbies} aktivitas\n`;
    if (stats.certificates > 0) response += `• 🏆 **Certificates**: ${stats.certificates} sertifikat\n`;
    if (stats.softskills > 0) response += `• 🌟 **Soft Skills**: ${stats.softskills} kemampuan\n`;
    if (stats.uploadedFiles > 0) response += `• 📁 **Uploaded Files**: ${stats.uploadedFiles} file\n`;
    
    response += `\n**Total**: ${stats.totalItems} item dari ${stats.totalCategories} kategori\n\n`;
    response += `💡 **Tips**: Gunakan fitur upload file untuk menambah knowledge base, atau tanyakan tentang topik spesifik!`;
    return response;
  }

  if (text.includes('file') || text.includes('upload') || text.includes('dokumen')) {
    const fileCount = safeKnowledgeBase.uploadedData.length;
    if (fileCount === 0) {
      return `📁 **Manajemen File**\n\nBelum ada file yang diupload. Anda dapat mengupload berbagai jenis file untuk ditambahkan ke knowledge base:\n\n• 📄 Dokumen teks\n• 📊 Spreadsheet\n• 🖼️ Gambar\n• 📝 File lainnya\n\nKlik tombol upload (📎) untuk memulai!`;
    } else {
      const recentFiles = safeKnowledgeBase.fileMetadata.slice(-3);
      let fileList = recentFiles.map(file => 
        `• ${getFileIcon(file.extension)} ${file.fileName} (${(file.fileSize / 1024).toFixed(1)}KB)`
      ).join('\n');
      
      return `📁 **Manajemen File**\n\n**Total file**: ${fileCount}\n**File terbaru**:\n${fileList}\n\n💡 File-file ini telah terintegrasi dengan knowledge base dan dapat dicari menggunakan fitur pencarian.`;
    }
  }

  if (text.includes('halo') || text.includes('hai') || text.includes('hi') || text.includes('hello'))
    return `Hai juga! 👋 Aku SaipulAI v6.0 Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Scientific Computing\n• 📊 **Multi-format File Processing** (PDF, DOCX, XLSX, Images)\n• 🤖 **Dynamic Knowledge Base** Integration\n• 🎯 **Context-Aware Intelligent Responses**\n• 📁 **Advanced File Management** & Metadata\n• 🔍 **Smart Search** Across All Data Sources\n\n💡 **Tips**: Coba upload file atau tanyakan tentang topik spesifik!`;

  if (text.includes('terima kasih') || text.includes('thanks') || text.includes('thank you')) 
    return "Sama-sama! 😊 Senang bisa membantu analisis dan pencarian informasimu. Jika ada yang lain, jangan ragu untuk bertanya!";

  if (text.includes('versi') || text.includes('version'))
    return `🤖 **SaipulAI v6.0 Enhanced**\n• Model: ${settings.aiModel.toUpperCase()}\n• Presisi: ${settings.calculationPrecision}\n• Memori: ${settings.memoryContext ? 'Aktif' : 'Nonaktif'}\n• File Support: ${settings.allowedFileTypes.join(', ')}\n• Data Sources: ${knowledgeStats.totalCategories || 0} kategori\n• File Upload: ${settings.enableFileUpload ? 'Aktif' : 'Nonaktif'}`;

  if ((text.includes('hapus') || text.includes('clear')) && text.includes('chat')) {
    return "🗑️ **Riwayat percakapan telah dibersihkan**\nSekarang kita mulai fresh! Ada yang bisa kubantu analisis, hitung, atau proses hari ini?";
  }

  if (text.includes('fitur') || text.includes('bisa apa') || text.includes('help') || text.includes('bantuan'))
    return `🤖 **Fitur SaipulAI v6.0 Enhanced**:\n\n🧮 **MATEMATIKA & ANALISIS**\n• Scientific Calculations & Calculus\n• Statistical Analysis & Probability\n• Data Forecasting & Predictions\n• Unit Conversions & Measurements\n\n📁 **FILE PROCESSING**\n• Multi-format Upload (PDF, DOC, XLS, Images)\n• Text Extraction & Content Analysis\n• Metadata Management & Tracking\n• Smart Search Across Files\n\n🤖 **KNOWLEDGE BASE**\n• AI Concepts & Machine Learning\n• Professional Skills & Certificates\n• Personal Interests & Hobbies\n• Dynamic Data Integration\n\n🎯 **SMART FEATURES**\n• Context-Aware Conversations\n• Voice Input & Speech Recognition\n• Advanced Search Algorithms\n• Real-time Data Processing\n\n💡 **FITUR LANJUT**\n• Creative Mode & Analytical Mode\n• Privacy Controls & Data Management\n• Export/Import Capabilities\n• Customizable Settings`;

  const lastUserMessages = conversationContext.filter(msg => msg.role === 'user').slice(-3);
  const commonThemes = extractThemes(lastUserMessages);
  
  const fallbacks = [
    `Bisa jelaskan lebih detail? Aku bisa bantu dengan:\n• Analisis data spesifik\n• Perhitungan matematika kompleks\n• Prediksi berdasarkan parameter\n• Penjelasan konsep dari knowledge base\n• Processing file yang diupload`,
    `Menarik! Dengan mode ${settings.creativeMode ? 'kreatif' : 'analitis'} yang aktif, aku bisa bantu eksplorasi topik ini lebih dalam. Ada data atau parameter spesifik yang ingin dianalisis?`,
    `Aku detect ini mungkin terkait ${commonThemes.length > 0 ? commonThemes.join(' atau ') : 'beberapa topik'}. Bisa diperjelas agar aku bisa bantu lebih optimal?`,
    `Topik yang menarik! Aku punya knowledge base yang luas dan kemampuan pemrosesan data. Mau dalam bentuk perhitungan, prediksi, penjelasan konsep, atau processing file?`
  ];
  
  return getRandomItem(fallbacks);
}

function getFileIcon(extension) {
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
}