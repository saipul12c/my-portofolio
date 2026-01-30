// Format date untuk disimpan ke SheetDB (DD/MM/YYYY, HH.MM.SS)
export const formatDateForSheetDB = (date = new Date()) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year}, ${hours}.${minutes}.${seconds}`;
};

// Parse dan format SheetDB date ke format manusiawi
export const formatSheetDBDateToHuman = (dateString) => {
  if (!dateString) return "Tanggal tidak tersedia";
  
  try {
    // Parse format: "DD/MM/YYYY, HH.MM.SS"
    const regex = /(\d{2})\/(\d{2})\/(\d{4}),\s+(\d{2})\.(\d{2})\.(\d{2})/;
    const match = dateString.match(regex);
    
    if (!match) {
      // Fallback untuk format lain
      return formatDate(dateString);
    }
    
    const [, day, month, year, hours, minutes, seconds] = match;
    const date = new Date(year, parseInt(month) - 1, day, hours, minutes, seconds);
    
    if (isNaN(date.getTime())) {
      return "Tanggal tidak valid";
    }
    
    const now = new Date();
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Show relative time untuk recent messages
    if (diffMinutes < 1) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes}m lalu`;
    if (diffHours < 24) return `${diffHours}h lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays}h lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w lalu`;
    
    // Format: "12 Jan 2026, 14:35"
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (error) {
    return formatDate(dateString);
  }
};

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