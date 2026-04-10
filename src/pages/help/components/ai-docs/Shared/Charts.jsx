import React from "react";

// Simple SVG Bar Chart (no deps)
export const BarChart = ({ data = [], width = 600, height = 220 }) => {
  const padding = 24;
  const maxVal = Math.max(...data.map(d => d.value || 0), 1);
  const barWidth = (width - padding * 2) / data.length;
  return (
    <svg width={width} height={height} className="w-full h-auto">
      {/* Axis */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="1" />
      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = ((d.value || 0) / maxVal) * (height - padding * 2);
        const x = padding + i * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        const w = barWidth * 0.8;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={barHeight} rx={6} fill="url(#barGradient)" />
            <text x={x + w / 2} y={height - padding + 14} fontSize="10" fill="#9CA3AF" textAnchor="middle">{d.label}</text>
            <text x={x + w / 2} y={y - 6} fontSize="11" fill="#E5E7EB" textAnchor="middle">{d.value}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Simple Gauge (progress-like)
export const Gauge = ({ label, value, unit = '', max = 100, goodIsLow = true }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = goodIsLow
    ? (pct < 40 ? 'from-emerald-500 to-green-500' : pct < 70 ? 'from-yellow-500 to-amber-500' : 'from-red-500 to-rose-500')
    : (pct > 60 ? 'from-emerald-500 to-green-500' : pct > 30 ? 'from-yellow-500 to-amber-500' : 'from-red-500 to-rose-500');
  return (
    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <span className="text-sm text-gray-400">{value}{unit}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
