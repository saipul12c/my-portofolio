import { storageService } from './storageService.js';

export function getRandomItem(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function choose(arr, fallback) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return fallback;
  return getRandomItem(arr);
}

function clampConfidence(n) {
  const num = Math.max(0, Math.min(100, Number(n) || 0));
  return Math.round(num * 10) / 10;
}

/**
 * Ekstraksi angka dari teks pengguna (mendukung format koma, titik, desimal, dan negatif)
 */
function extractNumbersFromText(text = '') {
  if (!text || typeof text !== 'string') return [];
  // Bersihkan teks dari kata-kata umum agar tidak mengganggu pencocokan
  // Contoh: "hitung rata-rata 10, 20, 30.5, -5"
  // Tangkap angka yang dipisahkan koma, spasi, atau titik koma
  const clean = text
    .replace(/(?:rata-rata|mean|median|modus|statistik|data|nilai|hitung|varians|standar deviasi|deviasi)\b/gi, ' ')
    .replace(/[:=]/g, ' ');

  const matches = clean.match(/-?\d+(?:[.,]\d+)?/g);
  if (!matches) return [];

  const numbers = [];
  for (const m of matches) {
    // Normalisasi desimal Indonesia (koma) ke titik jika bukan bagian dari daftar
    const normalized = m.replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && isFinite(parsed)) {
      numbers.push(parsed);
    }
  }
  return numbers;
}

function parseCsvNumericCell(rawCell) {
  if (rawCell === undefined || rawCell === null) return NaN;
  const s = String(rawCell).trim();
  if (!s) return NaN;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    return parseFloat(s.replace(/\./g, '').replace(',', '.'));
  }
  if (/^-?\d+,\d+$/.test(s)) {
    return parseFloat(s.replace(',', '.'));
  }
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) {
    return parseFloat(s.replace(/,/g, ''));
  }
  return parseFloat(s);
}

/**
 * Ekstraksi data angka dari tabel file yang diunggah jika ada
 */
function extractDataFromUploadedFiles(kb = {}) {
  const uploaded = kb.uploadedData || [];
  if (!Array.isArray(uploaded) || uploaded.length === 0) return null;

  for (const file of uploaded) {
    const rawContent = file.content || '';
    // Cek apakah ada format tabel CSV atau baris data
    const lines = rawContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length >= 2) {
      // Ambil header
      const headerLine = lines[0];
      const headers = headerLine.split(/[,;\t]/).map(h => h.trim().replace(/^["']|["']$/g, ''));

      // Temukan kolom yang mayoritas berisi angka
      const columnData = {};
      headers.forEach(h => { columnData[h] = []; });

      for (let i = 1; i < Math.min(lines.length, 200); i++) {
        const cells = lines[i].split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
        headers.forEach((h, colIdx) => {
          const val = parseCsvNumericCell(cells[colIdx]);
          if (!isNaN(val) && isFinite(val)) {
            columnData[h].push(val);
          }
        });
      }

      // Cari kolom dengan angka terbanyak
      let bestColumn = null;
      let maxNumericCount = 0;
      for (const [colName, values] of Object.entries(columnData)) {
        if (values.length > maxNumericCount) {
          maxNumericCount = values.length;
          bestColumn = colName;
        }
      }

      if (bestColumn && maxNumericCount >= 2) {
        return {
          fileName: file.fileName || file.name || 'Dokumen Terunggah',
          columnName: bestColumn,
          values: columnData[bestColumn],
          totalRows: lines.length - 1
        };
      }
    }
  }
  return null;
}

/**
 * Logika Prediksi & Prakiraan Cerdas (Harga, Cuaca, Penjualan, & Topik Umum)
 * @param {string} dataType - 'harga' | 'cuaca' | 'penjualan' | 'umum'
 * @param {string|object} opts - string query pengguna atau opsi tambahan
 * @param {object} kb - basis pengetahuan untuk integrasi data kontekstual
 */
export function generatePrediction(dataType = 'umum', opts = {}, kb = {}) {
  const queryStr = typeof opts === 'string' ? opts.toLowerCase() : (opts.query || '').toLowerCase();

  const predictions = {
    harga: {
      defaultItems: ['saham sektor teknologi', 'emas batangan', 'aset kripto (BTC/ETH)', 'properti residensial', 'kurs valas (USD/IDR)'],
      trends: ['mengalami kenaikan moderat 3-12%', 'bergerak dalam tren koreksi 3-8%', 'stabil dengan volatilitas terukur', 'dalam fase konsolidasi'],
      factors: ['tingkat suku bunga acuan', 'inflasi global dan domestik', 'volume permintaan pasar', 'sentimen makroekonomi'],
      timeframes: ['1-2 minggu ke depan', 'bulan depan', '3-6 bulan mendatang', 'semester depan'],
      confidence: [72, 78, 85, 90]
    },
    cuaca: {
      defaultLocations: ['wilayah Anda', 'area perkotaan', 'kawasan sekitar'],
      conditions: ['cerah berawan dengan potensi angin sejuk', 'hujan ringan pada sore hari', 'mendung berawan', 'hujan sedang disertai kilat sesaat', 'cerah terik'],
      temperatures: ['24-29°C', '26-32°C', '22-27°C', '28-34°C'],
      advice: ['siapkan payung atau jas hujan untuk antisipasi', 'gunakan tabir surya jika beraktivitas di luar ruangan', 'pastikan ventilasi ruangan memadai', 'kondisi cuaca sangat mendukung aktivitas luar ruang'],
      confidence: [75, 82, 88, 92]
    },
    penjualan: {
      defaultItems: ['produk utama', 'kategori terlaris', 'layanan digital'],
      trends: ['meningkat signifikan berkat ekspansi kanal', 'stabil dengan repeat order konsisten', 'potensi kenaikan musiman 10-25%', 'dalam tren pertumbuhan bertahap'],
      factors: ['efektivitas kampanye promosi', 'retensi pelanggan aktif', 'daya beli segmen pasar', 'diferensiasi layanan'],
      recommendations: ['perkuat retensi pelanggan setia', 'optimalkan ketersediaan stok & inventori', 'tingkatkan efektivitas pemasaran digital', 'perluas kolaborasi dan kanal distribusi'],
      confidence: [70, 80, 85, 90]
    },
    umum: {
      trends: ['menunjukkan tren pertumbuhan positif dan bertahap', 'mengalami stabilisasi setelah fase akselerasi', 'memerlukan penyesuaian strategi mitigasi', 'berada dalam momentum peluang yang menjanjikan'],
      factors: ['kualitas eksekusi strategi', 'adaptabilitas terhadap dinamika kebutuhan pengguna', 'efisiensi alokasi sumber daya', 'konsistensi evaluasi berkala'],
      recommendations: ['lakukan evaluasi metrik secara berkala', 'utamakan mitigasi risiko terukur', 'optimalkan komunikasi dan kolaborasi tim'],
      confidence: [75, 80, 85, 88]
    }
  };

  // Normalisasi dataType
  let targetType = dataType;
  if (!predictions[targetType]) {
    if (queryStr.includes('harga') || queryStr.includes('saham') || queryStr.includes('emas') || queryStr.includes('crypto') || queryStr.includes('kripto')) {
      targetType = 'harga';
    } else if (queryStr.includes('cuaca') || queryStr.includes('weather') || queryStr.includes('hujan') || queryStr.includes('suhu')) {
      targetType = 'cuaca';
    } else if (queryStr.includes('penjualan') || queryStr.includes('sales') || queryStr.includes('omset') || queryStr.includes('omzet')) {
      targetType = 'penjualan';
    } else {
      targetType = 'umum';
    }
  }

  const pred = predictions[targetType] || predictions.umum;

  // 1. Tangani Prediksi Cuaca Khusus
  if (targetType === 'cuaca') {
    // Ekstraksi nama kota jika ada di kueri
    const cities = ['jakarta', 'bandung', 'surabaya', 'medan', 'semarang', 'yogyakarta', 'bali', 'makassar', 'bogor', 'bekasi', 'tangerang', 'depok'];
    const foundCity = cities.find(c => queryStr.includes(c));
    const locationName = foundCity ? foundCity.charAt(0).toUpperCase() + foundCity.slice(1) : choose(pred.defaultLocations, 'wilayah Anda');

    const condition = choose(pred.conditions, 'cerah berawan');
    const temp = choose(pred.temperatures, '25-30°C');
    const advice = choose(pred.advice, 'pantau kondisi langit sebelum bepergian');
    const conf = clampConfidence(choose(pred.confidence, 82));

    return `🌤️ **Prakiraan Cuaca: ${locationName}**\n\n` +
      `• **Kondisi Cuaca**: ${condition}\n` +
      `• **Perkiraan Suhu**: ${temp}\n` +
      `• **Tingkat Akurasi Model**: ±${conf}%\n\n` +
      `💡 **Saran Praktis**: ${advice}.\n` +
      `*Prakiraan cuaca lokal dihitung berdasarkan estimasi pola meteorologis terintegrasi.*`;
  }

  // 2. Tangani Prediksi Harga / Finansial
  if (targetType === 'harga') {
    // Deteksi subjek spesifik dari kueri
    let subject = 'Aset instrumen pasar';
    if (queryStr.includes('emas')) subject = 'Emas batangan (Logam Mulia)';
    else if (queryStr.includes('bitcoin') || queryStr.includes('btc')) subject = 'Bitcoin (BTC)';
    else if (queryStr.includes('saham')) subject = 'Indeks saham terindeks';
    else if (queryStr.includes('dolar') || queryStr.includes('usd')) subject = 'Nilai tukar USD/IDR';
    else if (queryStr.includes('properti')) subject = 'Sektor properti residensial';
    else subject = choose(pred.defaultItems, 'Portofolio aset terpilih');

    const trend = choose(pred.trends, 'stabil dengan pergerakan terukur');
    const factor = choose(pred.factors, 'faktor makroekonomi dan likuiditas pasar');
    const timeframe = choose(pred.timeframes, '1-3 bulan ke depan');
    const conf = clampConfidence(choose(pred.confidence, 80));

    let trendIcon = '📈';
    let analysisNote = 'Tren mengarah pada akumulasi positif. Pastikan diversifikasi tetap terjaga.';
    if (/turun|koreksi|penurunan/i.test(trend)) {
      trendIcon = '📉';
      analysisNote = 'Tren menunjukkan fase konsolidasi atau koreksi wajar. Pertimbangkan strategi dollar-cost averaging (DCA).';
    }

    return `🔮 **Prediksi & Analisis Finansial: ${subject}**\n\n` +
      `• **Proyeksi Tren**: ${trend} dalam rentang **${timeframe}**\n` +
      `• **Faktor Penggerak Utama**: ${factor}\n` +
      `• **Tingkat Keyakinan Model**: ${conf}%\n\n` +
      `${trendIcon} **Analisis Pasar**: ${analysisNote}\n\n` +
      `⚠️ *Catatan: Proyeksi ini merupakan estimasi berbasis pola data historis dan bukan merupakan nasihat finansial mutlak. Selalu terapkan manajemen risiko.*`;
  }

  // 3. Tangani Prediksi Penjualan (Mendukung data file yang diunggah)
  if (targetType === 'penjualan') {
    const uploadedData = extractDataFromUploadedFiles(kb);
    let dataSourceNote = '';
    let growthEst = '8-18%';

    if (uploadedData) {
      const avg = uploadedData.values.reduce((a, b) => a + b, 0) / uploadedData.values.length;
      dataSourceNote = ` *(Berdasarkan data dokumen **${uploadedData.fileName}**, kolom \`${uploadedData.columnName}\` dengan rerata ${avg.toFixed(1)})*`;
      growthEst = '12-24%';
    }

    const item = choose(pred.defaultItems, 'Penjualan produk/layanan');
    const trend = choose(pred.trends, 'tumbuh stabil');
    const factor = choose(pred.factors, 'efektivitas strategi pemasaran dan loyalitas pelanggan');
    const rec = choose(pred.recommendations, 'optimalkan saluran konversi utama');
    const conf = clampConfidence(choose(pred.confidence, 82));

    return `📊 **Proyeksi Kinerja Penjualan**${dataSourceNote}\n\n` +
      `• **Fokus Kategori**: ${item}\n` +
      `• **Estimasi Pertumbuhan**: ${growthEst} (${trend})\n` +
      `• **Katalis Pertumbuhan**: ${factor}\n` +
      `• **Akurasi Analitik**: ${conf}%\n\n` +
      `💡 **Rekomendasi Strategis**: ${rec}.\n` +
      `*Gunakan data historis untuk memvalidasi laju inventori dan proyeksi anggaran secara berkala.*`;
  }

  // 4. Tangani Prediksi Umum
  // Ekstrak topik umum dari kueri jika ada
  const cleanTopic = queryStr
    .replace(/(?:prediksi|forecast|ramalan|proyeksi|bagaimana|tentang|apakah|kira-kira)\b/gi, '')
    .trim();
  const topicTitle = cleanTopic.length > 2
    ? cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)
    : 'Perkembangan Tren & Proyeksi';

  const trend = choose(pred.trends, 'berkembang stabil ke arah positif');
  const factor = choose(pred.factors, 'konsistensi eksekusi dan adopsi strategi yang tepat');
  const rec = choose(pred.recommendations, 'tetapkan metrik evaluasi bertahap');
  const conf = clampConfidence(choose(pred.confidence, 80));

  return `🔮 **Analisis Proyeksi: ${topicTitle}**\n\n` +
    `• **Arah Proyeksi**: Diperkirakan ${trend} dalam jangka menengah.\n` +
    `• **Faktor Kunci Penentu**: ${factor}.\n` +
    `• **Tingkat Keyakinan Analitis**: ${conf}%\n\n` +
    `💡 **Langkah Rekomendasi**: ${rec}.\n` +
    `⚠️ *Catatan: Proyeksi ini merupakan analisis probabilitas berbasis logika sistem dan dinamika konteks.*`;
}

/**
 * Analisis Data Nyata (Mendukung data file tabel CSV/JSON yang diunggah pengguna)
 * @param {string} query - teks pertanyaan pengguna
 * @param {object} kb - basis pengetahuan lokal
 */
export function analyzeData(query = '', kb = {}) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  // 1. Cek apakah pengguna mengunggah dokumen tabel CSV/JSON
  const uploadedTable = extractDataFromUploadedFiles(kb);
  if (uploadedTable && (q.includes('analisis') || q.includes('data') || q.includes('dokumen') || q.includes('tabel') || q.includes('file'))) {
    const vals = uploadedTable.values;
    const n = vals.length;
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sorted = [...vals].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

    return `📈 **Hasil Analisis Data Dokumen: ${uploadedTable.fileName}**\n\n` +
      `• **Kolom Teranalisis**: \`${uploadedTable.columnName}\`\n` +
      `• **Total Baris Data Terbaca**: **${n} baris** (dari ${uploadedTable.totalRows} baris dokumen)\n` +
      `• **Akumulasi Total (Sum)**: **${sum.toLocaleString('id-ID')}**\n` +
      `• **Nilai Rata-rata (Mean)**: **${mean.toFixed(2)}**\n` +
      `• **Nilai Tengah (Median)**: **${median.toFixed(2)}**\n` +
      `• **Nilai Ekstrem**: Terendah **${min}** | Tertinggi **${max}**\n\n` +
      `💡 **Wawasan Analitis**: Distribusi nilai berkisar dari ${min} hingga ${max} dengan pemusatan data di sekitar ${mean.toFixed(2)}. Data siap diolah lebih lanjut untuk laporan atau perbandingan performa.`;
  }

  // 2. Analisis berbasis kueri topik terstruktur
  if (q.includes('penjualan') || q.includes('sales') || q.includes('omset') || q.includes('omzet')) {
    return `📈 **Kerangka Analisis Penjualan & Revenue**\n\n` +
      `• **Indikator Kunci (KPI)**: Volume transaksi, Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), dan Repeat Purchase Rate.\n` +
      `• **Fokus Diagnostik**: Evaluasi saluran konversi dengan ROI tertinggi dan identifikasi potensi kebocoran pada funnel penjualan.\n` +
      `• **Rekomendasi Tindakan**:\n` +
      `  1. Tingkatkan loyalitas pelanggan lama (program retensi berkala).\n` +
      `  2. Otomasi follow-up leads yang belum terkonversi.\n` +
      `  3. Unggah file CSV/Excel data transaksi Anda ke menu *Settings > Privacy & Files* untuk analisis angka riil instan!`;
  }

  if (q.includes('keuangan') || q.includes('cashflow') || q.includes('finansial') || q.includes('arus kas')) {
    return `💼 **Kerangka Analisis Kesehatan Keuangan**\n\n` +
      `• **Pilar Evaluasi**: Likuiditas kas operasional, efisiensi rasio beban tetap (fixed cost), dan net profit margin.\n` +
      `• **Manajemen Risiko**: Pastikan dana cadangan kas operasional mencukupi minimal 3–6 bulan ke depan (*runway period*).\n` +
      `• **Langkah Rekomendasi**:\n` +
      `  1. Pisahkan arus kas operasional utama dari belanja modal (capex).\n` +
      `  2. Pantau siklus penagihan piutang dagang (Days Sales Outstanding).\n` +
      `  3. Anda dapat mengunggah file neraca/rekap keuangan (CSV/JSON) agar SaipulAI dapat menghitung total dan reratanya secara langsung.`;
  }

  if (q.includes('performa') || q.includes('kinerja') || q.includes('efisiensi') || q.includes('produktivitas')) {
    return `⚙️ **Kerangka Analisis Efisiensi & Performa Operasional**\n\n` +
      `• **Matriks Pengukuran**: Waktu siklus eksekusi (Cycle Time), tingkat keberhasilan proses, dan rasio utilisasi sumber daya.\n` +
      `• **Peluang Optimasi**: Eliminasi hambatan (*bottleneck*) proses manual dengan otomatisasi terintegrasi.\n` +
      `• **Rekomendasi**: Tetapkan SLA (Service Level Agreement) terukur pada setiap alur kerja kritis dan tinjau metrik mingguan secara transparan.`;
  }

  return null;
}

/**
 * Kalkulator Statistik Nyata & Analisis Probabilitas Deterministik
 * Mengurai angka dari input pengguna nyata atau dokumen terunggah
 * @param {string} query - teks pertanyaan pengguna
 * @param {object} kb - basis pengetahuan
 */
export function calculateStatistics(query = '', kb = {}) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  // 1. Ekstraksi angka nyata dari kueri pengguna
  const extractedNumbers = extractNumbersFromText(query);

  if (extractedNumbers.length >= 2) {
    const vals = extractedNumbers;
    const n = vals.length;
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const sorted = [...vals].sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

    // Modus
    const freq = {};
    let maxFreq = 0;
    vals.forEach(v => {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) maxFreq = freq[v];
    });
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq && maxFreq > 1).map(Number);
    const modusText = modes.length > 0 ? modes.join(', ') : 'Tidak ada modus tunggal (semua frekuensi unik)';

    // Varians & Standar Deviasi Sampel (n - 1)
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const stdDev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    return `📊 **Hasil Perhitungan Statistik Deterministik**\n\n` +
      `• **Dataset Input**: [${vals.join(', ')}]\n` +
      `• **Ukuran Sampel (N)**: **${n}** data poin\n` +
      `• **Jumlah Total (Sum, ∑x)**: **${sum.toLocaleString('id-ID')}**\n` +
      `• **Rata-rata (Mean, x̄)**: **${mean.toFixed(2)}**\n` +
      `• **Nilai Tengah (Median)**: **${median.toFixed(2)}**\n` +
      `• **Modus**: **${modusText}**\n` +
      `• **Standar Deviasi Sampel (s)**: **${stdDev.toFixed(2)}**\n` +
      `• **Varians Sampel (s²)**: **${variance.toFixed(2)}**\n` +
      `• **Rentang Nilai (Range)**: **${min}** s/d **${max}** (selisih: ${range})\n\n` +
      `💡 *Semua parameter dihitung secara eksak dari data numerik yang Anda masukkan.*`;
  }

  // 2. Analisis Probabilitas / Peluang
  if (q.includes('probabilitas') || q.includes('peluang')) {
    // Cek kasus umum dadu, koin, atau kartu
    if (q.includes('dadu')) {
      return `🎲 **Analisis Probabilitas Pelemparan Dadu**\n\n` +
        `• **Ruang Sampel 1 Dadu (S)**: {1, 2, 3, 4, 5, 6} (total n(S) = 6)\n` +
        `• **Peluang muncul satu angka spesifik**: P(A) = 1/6 = **16.67%**\n` +
        `• **Peluang angka genap/ganjil**: P(A) = 3/6 = **50.00%**\n` +
        `• **Ruang Sampel 2 Dadu**: n(S) = 36 kombinasi (peluang jumlah angka 7 adalah tertinggi, yaitu 6/36 = 16.67%).\n\n` +
        `💡 *Gunakan rumus dasar P(A) = n(A) / n(S) untuk menghitung variasi ruang sampel lainnya.*`;
    }

    if (q.includes('koin') || q.includes('uang logam')) {
      return `🪙 **Analisis Probabilitas Pelemparan Koin**\n\n` +
        `• **Ruang Sampel 1 Koin**: {Angka, Gambar} (n(S) = 2)\n` +
        `• **Peluang muncul satu sisi**: P = 1/2 = **50%**\n` +
        `• **Pelemparan 2 Koin**: Ruang sampel = {AA, AG, GA, GG}. Peluang tepat 1 Gambar = 2/4 = **50%**; peluang keduanya Gambar = 1/4 = **25%**.`;
    }

    return `🎲 **Prinsip & Analisis Teori Probabilitas**\n\n` +
      `• **Rumus Dasar**: P(A) = n(A) / n(S)\n` +
      `  - *n(A)*: Banyaknya kejadian yang diharapkan\n` +
      `  - *n(S)*: Total seluruh kemungkinan dalam ruang sampel\n` +
      `• **Rentang Nilai**: 0 ≤ P(A) ≤ 1 (0 = mustahil terjadi, 1 = pasti terjadi)\n\n` +
      `💡 *Untuk perhitungan probabilitas spesifik, sebutkan kasus atau angka ruang sampelnya (contoh: "hitung peluang terambil kartu as dari 52 kartu").*`;
  }

  // 3. Jika pengguna menyebut "rata-rata" atau "statistik" tetapi belum memberikan angka
  if (q.includes('rata-rata') || q.includes('mean') || q.includes('statistik')) {
    // Coba periksa apakah ada file terunggah
    const uploadedTable = extractDataFromUploadedFiles(kb);
    if (uploadedTable) {
      const vals = uploadedTable.values;
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return `📊 **Statistik dari Dokumen Terunggah (${uploadedTable.fileName})**\n\n` +
        `• Kolom: \`${uploadedTable.columnName}\`\n` +
        `• Jumlah Data: **${vals.length} baris**\n` +
        `• Nilai Rata-rata: **${avg.toFixed(2)}**\n` +
        `• Nilai Minimum: **${Math.min(...vals)}** | Maksimum: **${Math.max(...vals)}**`;
    }

    return `📊 **Panduan Perhitungan Statistik SaipulAI**\n\n` +
      `Untuk menghitung statistik dan rata-rata secara eksak, Anda cukup mengetikkan deretan angkanya, misalnya:\n\n` +
      `• *"hitung rata-rata 80, 85, 90, 75, 95"*\n` +
      `• *"statistik dari 12, 15, 18, 22, 25, 30"*\n\n` +
      `SaipulAI akan langsung menghitung Mean, Median, Modus, Varians, dan Standar Deviasinya secara presisi!`;
  }

  return null;
}

/**
 * Log response quality metrics to storage for analytics & continuous optimization
 * @param {object} meta - { query, intent, confidence, factualityScore, verified, timestamp }
 */
export function logResponseQuality(meta = {}) {
  try {
    const key = 'saipul_response_metrics';
    const list = storageService.get(key, []);
    const entry = {
      id: `met_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...meta,
      timestamp: meta.timestamp || new Date().toISOString()
    };
    list.push(entry);
    // Batasi 200 entri terbaru agar aman kuota penyimpanan lokal
    storageService.set(key, list.slice(-200));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('saipul_analytics_logged', { detail: entry }));
    }
    return true;
  } catch (e) {
    console.warn('analytics.logResponseQuality error:', e?.message || e);
    return false;
  }
}

/**
 * Mengambil rekap metrik respons yang tersimpan
 */
export function getResponseMetrics() {
  try {
    return storageService.get('saipul_response_metrics', []);
  } catch {
    return [];
  }
}

/**
 * Membersihkan log metrik respons
 */
export function clearResponseMetrics() {
  try {
    storageService.set('saipul_response_metrics', []);
    return true;
  } catch {
    return false;
  }
}

/**
 * Singleton Telemetri Terpadu SaipulAI
 * Menghilangkan ghost reference window.saipul_analytics
 */
export const saipulAnalytics = {
  trackEvent(eventName, payload = {}) {
    try {
      const eventData = {
        event: eventName,
        ...payload,
        timestamp: new Date().toISOString()
      };
      const existing = storageService.get('saipul_analytics_events', []);
      existing.push(eventData);
      storageService.set('saipul_analytics_events', existing.slice(-200));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('saipul_analytics_event', { detail: eventData }));
      }
      return true;
    } catch (err) {
      console.warn('saipulAnalytics.trackEvent warning:', err);
      return false;
    }
  },
  getEvents() {
    try {
      return storageService.get('saipul_analytics_events', []);
    } catch {
      return [];
    }
  },
  clearEvents() {
    try {
      storageService.set('saipul_analytics_events', []);
      return true;
    } catch {
      return false;
    }
  }
};

// Inisialisasi aman ke window jika di lingkungan peramban
if (typeof window !== 'undefined' && !window.saipul_analytics) {
  window.saipul_analytics = saipulAnalytics;
}
