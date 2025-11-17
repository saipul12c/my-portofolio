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