import { 
  FiCalendar,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiStar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiBook,
  FiTag,
  FiBookmark,
  FiShare2
} from "react-icons/fi";

export const getLabelColor = (label) => {
  switch (label) {
    case "Baru": return "bg-green-500/20 border-green-500/30 text-green-300";
    case "Rekomendasi": return "bg-cyan-500/20 border-cyan-500/30 text-cyan-300";
    case "Hot": return "bg-orange-500/20 border-orange-500/30 text-orange-300";
    case "Premium": return "bg-purple-500/20 border-purple-500/30 text-purple-300";
    default: return "bg-gray-500/20 border-gray-500/30 text-gray-300";
  }
};

export const getTagColor = (tag, index) => {
  const colors = [
    "bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border-cyan-500/40 text-cyan-300",
    "bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/40 text-purple-300",
    "bg-gradient-to-r from-pink-500/20 to-pink-600/20 border-pink-500/40 text-pink-300",
    "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/40 text-orange-300",
    "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/40 text-green-300",
    "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-300",
    "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/40 text-yellow-300",
    "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/40 text-red-300",
  ];
  return colors[index % colors.length];
};

export const cleanContent = (content) => {
  if (!content) return "";
  
  if (typeof content === "object") {
    return Object.values(content)
      .map(item => String(item).replace(/###\s?/g, '').trim())
      .filter(item => item.length > 0)
      .join('\n\n');
  }
  
  return String(content).replace(/###\s?/g, '').trim();
};

export const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  
  return new Date(dateString).toLocaleDateString("id-ID", { ...defaultOptions, ...options });
};

export const STATS_CONFIG = [
  { icon: FiEye, valueKey: 'views', label: 'Views', color: 'cyan' },
  { icon: FiHeart, valueKey: 'likes', label: 'Likes', color: 'red' },
  { icon: FiMessageSquare, valueKey: 'commentCount', label: 'Comments', color: 'green' },
  { icon: FiStar, valueKey: 'rating', label: 'Rating', color: 'yellow' }
];

// Minimal Markdown -> HTML renderer (supports headings, paragraphs, lists, bold, italic, code, links)
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const inlineFormat = (text) => {
  if (!text) return '';
  // escape first
  let t = escapeHtml(text);
  // links [text](url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // bold **text**
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // italic *text*
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // inline code `code`
  t = t.replace(/`(.+?)`/g, '<code class="rounded bg-gray-900 px-1 py-0.5">$1</code>');
  return t;
};

export const markdownToHtml = (raw) => {
  if (!raw) return '';
  const content = String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = content.split('\n');

  let html = '';
  let paragraphBuffer = [];
  const listStack = []; // [{type: 'ul'|'ol', indent}]

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const txt = paragraphBuffer.join(' ').trim();
    if (txt) html += `<p>${inlineFormat(txt)}</p>`;
    paragraphBuffer = [];
  };

  const closeListsTo = (targetIndent) => {
    while (listStack.length && listStack[listStack.length - 1].indent >= targetIndent) {
      const last = listStack.pop();
      html += `</${last.type}>`;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {
      flushParagraph();
      closeListsTo(0);
      continue;
    }

    // Heading
    const hMatch = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (hMatch) {
      flushParagraph();
      closeListsTo(0);
      const level = hMatch[1].length;
      const text = inlineFormat(hMatch[2].trim());
      html += `<h${level} class="mt-4 mb-2 font-bold text-white">${text}</h${level}>`;
      continue;
    }

    // List item
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const indentSpaces = listMatch[1].length;
      const marker = listMatch[2];
      const isOrdered = /\d+\./.test(marker);
      const type = isOrdered ? 'ol' : 'ul';
      const itemText = listMatch[3];

      const indentLevel = Math.floor(indentSpaces / 2);

      // open nested lists if needed
      if (!listStack.length || indentLevel > listStack[listStack.length - 1].indent) {
        // open new list
        html += `<${type} class="pl-6 mb-2">`;
        listStack.push({ type, indent: indentLevel });
      } else if (indentLevel < listStack[listStack.length - 1].indent) {
        // close until matching
        closeListsTo(indentLevel);
        // if top list type differs, open new
        if (!listStack.length || listStack[listStack.length - 1].type !== type) {
          html += `<${type} class="pl-6 mb-2">`;
          listStack.push({ type, indent: indentLevel });
        }
      } else {
        // same level, if type differs replace
        if (listStack[listStack.length - 1].type !== type) {
          closeListsTo(indentLevel);
          html += `<${type} class="pl-6 mb-2">`;
          listStack.push({ type, indent: indentLevel });
        }
      }

      html += `<li class="mb-1 text-gray-200 leading-6">${inlineFormat(itemText.trim())}</li>`;
      continue;
    }

    // Normal paragraph line
    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  closeListsTo(0);

  return html;
};