import { Calculator, Brain, FileText, BarChart3, TrendingUp, Settings, Upload } from "lucide-react";

const iconMap = {
  Calculator,
  Brain,
  FileText,
  BarChart3,
  TrendingUp,
  Settings,
  Upload
};

export function QuickActions({ activeQuickActions, handleQuickAction }) {
  if (activeQuickActions.length === 0) return null;

  return (
    <div className="flex gap-1 p-2 bg-gray-900/50 border-b border-gray-700">
      {activeQuickActions.map((action, index) => {
        const IconComponent = iconMap[action.icon];
        return (
          <button 
            key={index}
            onClick={() => handleQuickAction(action.action)}
            className="flex items-center gap-1 text-xs bg-gray-800/50 hover:bg-gray-700/70 px-2 py-1 rounded transition flex-1 justify-center border border-gray-600/50"
          >
            {IconComponent && <IconComponent size={12} />}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}