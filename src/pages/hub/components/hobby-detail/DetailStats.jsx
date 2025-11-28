import { Calendar, Star } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function DetailStats({ stats }) {
  return (
    <div className="bg-[#141a28]/60 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4 text-cyan-300">📈 Statistik</h3>
      <div className="space-y-4">
        <ProgressSection 
          label="Progress" 
          value={stats.completion} 
          showPercentage 
        />
        
        <StatItem 
          label="Rating" 
          value={`${stats.rating}/5.0`}
          icon={<Star size={16} className="text-yellow-400 fill-yellow-400" />}
        />
        
        <StatItem 
          label="Jam/Minggu" 
          value={`${stats.hoursPerWeek} jam`}
          icon={<Calendar size={16} />}
        />
      </div>
    </div>
  );
}

function ProgressSection({ label, value, showPercentage = false }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">{label}</span>
        {showPercentage && <span className="text-white font-medium">{value}%</span>}
      </div>
      <ProgressBar percentage={value} />
    </div>
  );
}

function StatItem({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-white flex items-center gap-1">
        {icon}
        {value}
      </span>
    </div>
  );
}