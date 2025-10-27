export const levelToProgress = (level) => {
  const map = { ahli: 100, mahir: 80, menengah: 60 };
  return map[level?.toLowerCase()] || 40;
};

export const formatYouTubeURL = (url) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1].split("&")[0];
  else if (url.includes("shorts/")) videoId = url.split("shorts/")[1].split("?")[0];
  else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
  return `https://www.youtube.com/embed/${videoId}?rel=0`;
};

export const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-yellow-400/70 text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
};
