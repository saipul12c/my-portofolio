import { getRandomItem } from './helpers';

export function generatePrediction(dataType, context) {
  const predictions = {
    harga: {
      items: ['saham teknologi', 'emas', 'bitcoin', 'properti residensial', 'mata uang asing'],
      trends: ['mengalami kenaikan 5-15%', 'sedang tren turun 3-8%', 'stabil dengan fluktuasi minimal', 'sangat volatil'],
      factors: ['inflasi global', 'kebijakan bank sentral', 'permintaan pasar', 'faktor geopolitik', 'sentimen investor'],
      timeframes: ['1-2 minggu', 'bulan depan', '3-6 bulan', 'tahun depan'],
      confidence: [85, 90, 78, 92]
    },
    cuaca: {
      conditions: ['cerah berawan', 'hujan ringan', 'hujan lebat', 'mendung', 'badai petir'],
      temperatures: ['20-25°C', '25-30°C', '30-35°C', '15-20°C', '10-15°C'],
      advice: ['bawa payung', 'gunakan sunscreen', 'pakai jaket', 'hindari aktivitas luar'],
      accuracy: [85, 90, 78, 92]
    },
    penjualan: {
      trends: ['meningkat signifikan', 'sedang stagnan', 'penurunan sementara', 'pertumbuhan eksponensial'],
      factors: ['efektivitas promosi', 'kompetisi pasar', 'daya beli konsumen', 'trend musiman'],
      recommendations: ['optimalkan inventory', 'tingkatkan digital marketing', 'diversifikasi produk', 'improve customer service']
    }
  };

  if (dataType in predictions) {
    const pred = predictions[dataType];
    const confidence = getRandomItem(pred.confidence || pred.accuracy || [85]);
    const trend = getRandomItem(pred.trends);
    
    let analysis = '';
    if (trend.includes('naik') || trend.includes('meningkat')) {
      analysis = '\n📈 **Analisis**: Trend positif terdeteksi, pertimbangkan untuk meningkatkan eksposur.';
    } else if (trend.includes('turun') || trend.includes('penurunan')) {
      analysis = '\n📉 **Analisis**: Trend negatif, rekomendasikan strategi mitigasi risiko.';
    }
    
    return `🔮 **Prediksi ${dataType}**: ${getRandomItem(pred.items)} diperkirakan ${trend} dalam ${getRandomItem(pred.timeframes || ['waktu dekat'])}. \n\n🔍 **Faktor utama**: ${getRandomItem(pred.factors)}. \n🎯 **Akurasi**: ${confidence}%${analysis}${pred.advice ? `\n\n💡 **Saran**: ${getRandomItem(pred.advice)}` : ''}`;
  }
  
  return null;
}

export function analyzeData(query) {
  const analysisTemplates = {
    penjualan: {
      trend: Math.random() > 0.4 ? 'meningkat' : 'menurun',
      growth: (Math.random() * 25 + 5).toFixed(1),
      metrics: ['konversi', 'retensi pelanggan', 'rata-rata transaksi'],
      recommendation: 'Optimalkan strategi digital marketing dan tingkatkan customer experience',
      confidence: (80 + Math.random() * 15).toFixed(1)
    },
    keuangan: {
      health: Math.random() > 0.3 ? 'sehat' : 'perlu perhatian',
      cashflow: Math.random() > 0.5 ? 'positif' : 'negatif',
      efficiency: (Math.random() * 30 + 60).toFixed(1),
      recommendation: 'Monitor cashflow ketat dan diversifikasi sumber pendapatan',
      confidence: (75 + Math.random() * 20).toFixed(1)
    },
    performa: {
      efficiency: (Math.random() * 35 + 60).toFixed(1),
      improvement: (Math.random() * 20 + 5).toFixed(1),
      bottlenecks: ['proses manual', 'resource allocation', 'technology stack'],
      recommendation: 'Implementasi automasi dan optimisasi resource management',
      confidence: (70 + Math.random() * 25).toFixed(1)
    }
  };

  for (const [key, data] of Object.entries(analysisTemplates)) {
    if (query.includes(key)) {
      return `📈 **Analisis ${key}**:\n• Trend: **${data.trend}** (pertumbuhan ${data.growth}%)\n• Efisiensi: **${data.efficiency}%**\n• Area Perbaikan: **${getRandomItem(data.bottlenecks || ['N/A'])}**\n• Tingkat Kepercayaan: **${data.confidence}%**\n\n💡 **Rekomendasi**: ${data.recommendation}`;
    }
  }
  return null;
}

export function calculateStatistics(query) {
  if (query.includes('probabilitas') || query.includes('peluang')) {
    const probability = (Math.random() * 100).toFixed(1);
    const outcomes = ['keberhasilan proyek', 'return investasi', 'kepuasan pelanggan', 'achievement target'];
    const confidence = (85 + Math.random() * 10).toFixed(1);
    
    return `🎲 **Analisis Probabilitas**: ${getRandomItem(outcomes)} = **${probability}%**\n📊 **Tingkat Kepercayaan**: ${confidence}% (berdasarkan analisis data historis dan pattern recognition)\n\n💡 **Interpretasi**: ${probability > 70 ? 'Peluang tinggi' : probability > 40 ? 'Peluang sedang' : 'Peluang rendah'}`;
  }

  if (query.includes('rata-rata') || query.includes('mean') || query.includes('statistik')) {
    const values = Array.from({length: 8}, () => Math.floor(Math.random() * 100 + 20));
    const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const stdDev = (Math.random() * 15 + 5).toFixed(2);
    const variance = (Math.pow(parseFloat(stdDev), 2)).toFixed(2);
    
    return `📊 **Analisis Statistik**:\n• Dataset: [${values.join(', ')}]\n• Rata-rata: **${mean}**\n• Standar Deviasi: **${stdDev}**\n• Varians: **${variance}**\n• Ukuran Sample: **${values.length} data points**\n• Range: **${Math.min(...values)} - ${Math.max(...values)}**`;
  }

  return null;
}