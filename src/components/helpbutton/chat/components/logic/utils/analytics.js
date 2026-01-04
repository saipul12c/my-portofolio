import { getRandomItem } from './helpers';
import { storageService } from './storageService.js';

function choose(arr, fallback) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return fallback;
  return getRandomItem(arr);
}

function clampConfidence(n) {
  const num = Math.max(0, Math.min(100, Number(n) || 0));
  return Math.round(num * 10) / 10;
}

export function generatePrediction(dataType, opts = {}) {
  void opts;
  const predictions = {
    harga: {
      items: ['saham sektor teknologi', 'emas batangan', 'bitcoin', 'properti residensial', 'mata uang asing (USD/IDR)'],
      trends: ['mengalami kenaikan moderat 3-12%', 'sedang tren turun 3-8%', 'stabil dengan fluktuasi kecil', 'sangat volatil, berhati-hati'],
      factors: ['inflasi global', 'kebijakan bank sentral', 'permintaan pasar', 'faktor geopolitik', 'sentimen investor'],
      timeframes: ['1-2 minggu', 'bulan depan', '3-6 bulan', 'tahun depan'],
      confidence: [72, 78, 85, 90]
    },
    cuaca: {
      conditions: ['cerah berawan', 'hujan ringan', 'hujan lebat', 'mendung', 'badai petir'],
      temperatures: ['20-25°C', '25-30°C', '30-35°C', '15-20°C', '10-15°C'],
      advice: ['bawa payung', 'gunakan sunscreen', 'pakai jaket', 'hindari aktivitas luar'],
      accuracy: [70, 80, 88, 92]
    },
    penjualan: {
      items: ['produk A', 'produk B', 'kategori elektronik', 'kategori fashion'],
      trends: ['meningkat signifikan', 'sedang stagnan', 'penurunan sementara', 'pertumbuhan eksponensial'],
      factors: ['efektivitas promosi', 'kompetisi pasar', 'daya beli konsumen', 'trend musiman'],
      recommendations: ['optimalkan inventory', 'tingkatkan digital marketing', 'diversifikasi produk', 'tingkatkan layanan pelanggan'],
      confidence: [65, 75, 82, 90]
    }
  };

  const pred = predictions[dataType];
  if (!pred) return null;

  const item = choose(pred.items || pred.items, 'item terkait');
  const trend = choose(pred.trends || pred.conditions, 'stabil');
  const timeframe = choose(pred.timeframes, 'waktu dekat');
  const factor = choose(pred.factors || pred.advice, 'faktor utama tidak jelas');
  const conf = clampConfidence(choose(pred.confidence || pred.accuracy, 80));

  let analysis = '';
  if (/naik|meningkat|positif|positifkan|kenaikan/i.test(trend)) {
    analysis = '\n📈 Analisis: Trend cenderung positif — pertimbangkan penguatan posisi sesuai toleransi risiko.';
  } else if (/turun|penurunan|negatif|menurun/i.test(trend)) {
    analysis = '\n📉 Analisis: Trend negatif — evaluasi mitigasi risiko dan lindung nilai.';
  } else if (/volatil/i.test(trend)) {
    analysis = '\n⚠️ Analisis: Pergerakan tinggi; tingkatkan kehati-hatian dan pertimbangkan diversifikasi.';
  }

  const suggestions = pred.recommendations ? `\n\n💡 Rekomendasi: ${choose(pred.recommendations)}` : (pred.advice ? `\n\n💡 Saran: ${choose(pred.advice)}` : '');

  return `🔮 Prediksi ${dataType}: ${item} diperkirakan ${trend} dalam ${timeframe}.\n\n🔍 Faktor utama: ${factor}.\n🎯 Est. akurasi: ${conf}%${analysis}${suggestions}`;
}

export function analyzeData(query = '') {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  const templates = {
    penjualan: () => {
      const trend = Math.random() > 0.45 ? 'meningkat' : 'menurun';
      const growth = (Math.random() * 30 + 2).toFixed(1);
      const efficiency = (Math.random() * 25 + 65).toFixed(1);
      const bottleneck = choose(['proses manual', 'alokasi sumber daya', 'stack teknologi', 'logistik'], 'proses internal');
      const confidence = clampConfidence(70 + Math.random() * 25);
      return `📈 Analisis penjualan:\n• Trend: **${trend}** (perkiraan growth ${growth}%)\n• Efisiensi operasional: **${efficiency}%**\n• Area perbaikan: **${bottleneck}**\n• Tingkat kepercayaan: **${confidence}%**\n\n💡 Rekomendasi: Optimalkan pemasaran digital, perkuat retensi pelanggan, dan review manajemen inventory.`;
    },
    keuangan: () => {
      const health = Math.random() > 0.5 ? 'sehat' : 'perlu perhatian';
      const cashflow = Math.random() > 0.6 ? 'positif' : 'negatif';
      const efficiency = (Math.random() * 30 + 60).toFixed(1);
      const confidence = clampConfidence(65 + Math.random() * 30);
      return `💼 Analisis keuangan:\n• Kesehatan: **${health}**\n• Cashflow: **${cashflow}**\n• Efisiensi: **${efficiency}%**\n• Tingkat kepercayaan: **${confidence}%**\n\n💡 Rekomendasi: Monitor cashflow, kontrol biaya, dan diversifikasi pendapatan.`;
    },
    performa: () => {
      const efficiency = (Math.random() * 30 + 60).toFixed(1);
      const improvement = (Math.random() * 20 + 3).toFixed(1);
      const conf = clampConfidence(60 + Math.random() * 30);
      return `⚙️ Analisis performa:\n• Efisiensi: **${efficiency}%**\n• Potensi peningkatan: **${improvement}%**\n• Confidence: **${conf}%**\n\n💡 Rekomendasi: Otomatiskan proses manual dan tinjau alokasi resource.`;
    }
  };

  for (const key of Object.keys(templates)) {
    if (q.includes(key)) return templates[key]();
  }
  return null;
}

export function calculateStatistics(query = '') {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  if (q.includes('probabilitas') || q.includes('peluang')) {
    const probability = (Math.random() * 100).toFixed(1);
    const outcomes = ['keberhasilan proyek', 'return investasi', 'kepuasan pelanggan', 'pencapaian target'];
    const confidence = clampConfidence(75 + Math.random() * 20);
    const interp = probability > 70 ? 'Peluang tinggi' : probability > 40 ? 'Peluang sedang' : 'Peluang rendah';
    return `🎲 Analisis probabilitas: ${choose(outcomes)} = **${probability}%**\n📊 Kepercayaan: **${confidence}%**\n\n💡 Interpretasi: ${interp}`;
  }

  if (q.includes('rata-rata') || q.includes('mean') || q.includes('statistik')) {
    const count = 8 + Math.floor(Math.random() * 8);
    const values = Array.from({ length: count }, () => Math.floor(Math.random() * 100 + 10));
    const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const variance = (values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length).toFixed(2);
    const stdDev = Math.sqrt(variance).toFixed(2);
    return `📊 Analisis statistik:\n• Dataset: [${values.join(', ')}]\n• Rata-rata: **${mean}**\n• Standar deviasi: **${stdDev}**\n• Varians: **${variance}**\n• Ukuran sample: **${values.length}**\n• Range: **${Math.min(...values)} - ${Math.max(...values)}**`;
  }

  return null;
}

/**
 * Log response quality metrics to storage for later analysis
 * @param {object} meta - { query, intent, confidence, factualityScore, verified, timestamp }
 */
export function logResponseQuality(meta = {}) {
  try {
    const key = 'saipul_response_metrics';
    const list = storageService.get(key, []);
    const entry = { ...meta, timestamp: new Date().toISOString() };
    list.push(entry);
    // keep recent 1000 entries max
    storageService.set(key, list.slice(-1000));
    return true;
  } catch (e) {
    console.warn('analytics.logResponseQuality error:', e?.message || e);
    return false;
  }
}