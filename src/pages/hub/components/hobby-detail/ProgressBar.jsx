export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}