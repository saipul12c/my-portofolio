// Fungsi untuk generate warna acak yang konsisten berdasarkan string
export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
    { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
    { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
    { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
    { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
    { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
    { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
    { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  ];
  
  return colors[Math.abs(hash) % colors.length];
};