// === Fuzzy Smart Search ===
export const smartFilter = (certs, query, category) => {
  if (!query && category === "All") return certs;
  const q = query.toLowerCase().trim();

  const scoreItem = (cert) => {
    let score = 0;
    const boost = (field, weight = 1) => {
      const text = field?.toLowerCase() || "";
      if (text.startsWith(q)) score += 5 * weight;
      else if (text.includes(q)) score += 3 * weight;
      else if (q.split(" ").every((w) => text.includes(w))) score += 2 * weight;
    };

    boost(cert.title, 2);
    boost(cert.issuer);
    cert.tags?.forEach((t) => boost(t));
    if (category !== "All" && cert.category !== category) score -= 5;

    return score;
  };

  return certs
    .map((c) => ({ ...c, score: scoreItem(c) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
};

// === Helper function untuk shuffle array ===
export const shuffleArray = (array) => {
  if (!array || array.length === 0) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// === Highlight pencarian ===
export const highlightMatch = (text, query) => {
  if (!text) return "";
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    "<mark class='bg-cyan-400/30 text-cyan-200'>$1</mark>"
  );
};