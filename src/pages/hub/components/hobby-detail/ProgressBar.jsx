export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-white/6 rounded-full h-3 overflow-hidden relative">
      <div 
        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-1000"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs text-white/90 font-semibold pointer-events-none">
        {percentage}%
      </div>
    </div>
  );
}