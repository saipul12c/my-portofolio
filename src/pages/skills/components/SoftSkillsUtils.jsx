// SoftSkillsUtils.jsx
export const levelToProgress = (level) => {
  if (!level) return 0;
  const l = String(level).toLowerCase().trim();
  // Lebih lengkap & fleksibel
  const map = {
    ahli: 100,
    master: 100,
    expert: 100,
    mahir: 80,
    advanced: 80,
    menengah: 60,
    intermediate: 60,
    dasar: 40,
    pemula: 20,
    beginner: 20,
  };
  if (map[l] !== undefined) return map[l];
  // Jika level adalah angka dalam string, gunakan itu (bounded 0-100)
  const n = Number(level);
  if (!Number.isNaN(n)) return Math.max(0, Math.min(100, n));
  // default
  return 40;
};

export const escapeHTML = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const formatYouTubeURL = (url) => {
  if (!url || typeof url !== "string") return "";
  try {
    const u = url.trim();

    const isDummyId = (id) => {
      if (!id) return true;
      const lower = id.toLowerCase();
      return /^(example\d*|xyz\d*|test\d*|sample\d*)$/i.test(lower);
    };

    // Jika sudah dalam bentuk embed, return langsung jika bukan dummy
    if (u.includes("/embed/")) {
      const id = u.split("/embed/")[1].split(/[?&]/)[0];
      if (!id || isDummyId(id)) return "";
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    // regex untuk menangkap id dari bentuk umum
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([A-Za-z0-9_-]{8,})/, // watch?v=
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{5,})/, // shorts
      /youtu\.be\/([A-Za-z0-9_-]{5,})/, // youtu.be
      /youtube\.com\/v\/([A-Za-z0-9_-]{5,})/, // /v/
    ];

    for (const p of patterns) {
      const m = u.match(p);
      if (m && m[1]) {
        if (isDummyId(m[1])) return "";
        return `https://www.youtube.com/embed/${m[1]}?rel=0`;
      }
    }

    // Kalau url mengandung v= di query, fallback parse
    if (u.includes("watch?v=")) {
      const id = u.split("watch?v=")[1].split("&")[0];
      if (id && !isDummyId(id)) return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    // No valid match
    return "";
  } catch {
    return "";
  }
};

export const highlightText = (text, keyword) => {
  if (!text) return "";
  const safeText = escapeHTML(text);
  if (!keyword) return safeText;
  const k = String(keyword).trim();
  if (k.length === 0) return safeText;

  const escapedKeyword = escapeHTML(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const reg = new RegExp(`(${escapedKeyword})`, "gi");

  return safeText.replace(
    reg,
    `<mark class="bg-yellow-400/70 text-black rounded px-1">$1</mark>`
  );
};