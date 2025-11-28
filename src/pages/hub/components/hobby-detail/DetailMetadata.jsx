import { Clock } from "lucide-react";
import { getDifficultyStyles, getPriorityStyles } from "../../utils/hobbyUtils";

export default function DetailMetadata({ metadata }) {
  return (
    <div className="bg-[#141a28]/60 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-4 text-cyan-300">📊 Informasi Aktivitas</h3>
      <div className="space-y-4">
        <MetadataItem 
          label="Tingkat Kesulitan" 
          value={metadata.difficulty}
          valueStyles={getDifficultyStyles(metadata.difficulty)}
        />
        
        <MetadataItem 
          label="Waktu yang Dibutuhkan" 
          value={metadata.timeRequired}
          icon={<Clock size={16} />}
        />
        
        <MetadataItem 
          label="Prioritas" 
          value={metadata.priority}
          valueStyles={getPriorityStyles(metadata.priority)}
        />
      </div>
    </div>
  );
}

function MetadataItem({ label, value, valueStyles = "", icon = null }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={`flex items-center gap-1 ${valueStyles}`}>
        {icon}
        {value}
      </span>
    </div>
  );
}