// utilsTestimoni.jsx

// Format tanggal menjadi "x hari/jam lalu" atau format tanggal lokal
export const formatTanggal = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} menit lalu`;
    }
    return `${diffHours} jam lalu`;
  }

  if (diffDays <= 7) {
    return `${Math.floor(diffDays)} hari lalu`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// Fungsi pembanding sederhana untuk pencarian fuzzy
export const similarity = (a, b) => {
  if (!a || !b) return 0;
  const aa = a.toLowerCase();
  const bb = b.toLowerCase();
  const maxLen = Math.max(aa.length, bb.length);
  if (maxLen === 0) return 0;

  let same = 0;
  for (let i = 0; i < aa.length; i++) {
    if (bb.includes(aa[i])) same++;
  }
  return same / maxLen;
};
