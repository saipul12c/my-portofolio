export const detectFiles = (text) => {
  if (!text || typeof text !== "string") return [];

  // Improved Regex:
  // 1. Files: letters/digits/underscores/dashes, then a dot, then common extensions (js/jsx/json/css/md/etc)
  // 2. Folders: paths ending with / or common directory patterns like src/, data/, components/
  const fileRegex = /\b([a-zA-Z0-9_\-./]+\.(?:js|jsx|json|css|html|md|py|sh|ts|tsx|txt|yml|yaml))\b/g;
  const folderRegex = /\b([a-zA-Z0-9_\-.]+\/([a-zA-Z0-9_\-.]+\/)*)/g;

  const files = text.match(fileRegex) || [];
  const folders = text.match(folderRegex) || [];

  // Exclude some false positives (e.g. urls, version numbers like 1.0.0)
  const isExcluded = (str) => {
    if (str.startsWith('http')) return true;
    if (/^\d+\.\d+\.\d+$/.test(str)) return true; // Version like 2.0.0
    return false;
  };

  return [...new Set([...files, ...folders])]
    .filter(item => !isExcluded(item))
    .map(item => {
      const name = item;
      const isFolder = name.endsWith('/') || !name.includes('.');
      return {
        type: isFolder ? "folder" : "file",
        name: name,
        desc: isFolder ? "Directory reference" : "Source file"
      };
    });
};
