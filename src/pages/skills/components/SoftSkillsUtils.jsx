// SoftSkillsUtils.jsx

export const levelToProgress = (level) => {
  if (!level) return 0;
  const l = String(level).toLowerCase().trim();
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
  const n = Number(level);
  if (!Number.isNaN(n)) return Math.max(0, Math.min(100, n));
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
      return /^(example\d*|xyz\d*|test\d*|sample\d*)$/i.test(id.toLowerCase());
    };

    // If already an embed URL
    if (u.includes("/embed/")) {
      const id = u.split("/embed/")[1].split(/[?&]/)[0];
      if (!id || isDummyId(id)) return "";
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([A-Za-z0-9_-]{8,})/,
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{5,})/,
      /youtu\.be\/([A-Za-z0-9_-]{5,})/,
      /youtube\.com\/v\/([A-Za-z0-9_-]{5,})/,
    ];

    for (const p of patterns) {
      const m = u.match(p);
      if (m && m[1]) {
        if (isDummyId(m[1])) return "";
        return `https://www.youtube.com/embed/${m[1]}?rel=0`;
      }
    }

    if (u.includes("watch?v=")) {
      const id = u.split("watch?v=")[1].split("&")[0];
      if (id && !isDummyId(id)) return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    return "";
  } catch {
    return "";
  }
};

export const highlightText = (text, keyword) => {
  if (!text) return "";
  if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
    return escapeHTML(text);
  }
  const safeText = escapeHTML(text);
  const k = keyword.trim();
  const escapedKeyword = escapeHTML(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escapedKeyword) return safeText;

  try {
    const reg = new RegExp(`(${escapedKeyword})`, "gi");
    return safeText.replace(
      reg,
      `<mark class="bg-yellow-400/70 text-black rounded px-1 font-medium">$1</mark>`
    );
  } catch {
    return safeText;
  }
};
