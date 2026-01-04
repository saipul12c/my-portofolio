export const formatDate = (dateString) => {
  if (!dateString) {
    // Return current date as default
    const now = new Date();
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(now);
  }
  
  // Handle various date formats
  let date;
  
  // Check if it's a timestamp number
  if (typeof dateString === 'number') {
    date = new Date(dateString);
  } 
  // Check if it's a string timestamp (numeric)
  else if (/^\d+$/.test(dateString)) {
    date = new Date(parseInt(dateString));
  }
  // ISO format or other string formats
  else {
    date = new Date(dateString);
  }
  
  // Validate date
  if (isNaN(date.getTime())) {
    return "Baru saja";
  }
  
  const now = new Date();
  const diffTime = now - date;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Show relative time for recent messages
  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};