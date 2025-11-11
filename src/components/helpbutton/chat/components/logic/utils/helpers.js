export function extractThemes(userMessages) {
  const themes = [];
  const words = userMessages.flatMap(msg => msg.content.toLowerCase().split(/\s+/));
  
  const themeKeywords = {
    'matematika': ['hitung', 'kalkulus', 'integral', 'turunan', 'statistik'],
    'ai': ['ai', 'machine learning', 'neural network', 'deep learning'],
    'data': ['analisis', 'data', 'prediksi', 'forecast'],
    'file': ['upload', 'file', 'dokumen', 'pdf']
  };
  
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
      themes.push(theme);
    }
  }
  
  return themes;
}

export function getRandomItem(arr) {
  return arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : 'tidak tersedia';
}