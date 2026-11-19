import React from "react";

export const ProgressBar = ({ value, label, color, showValue = true }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{label}</span>
            {showValue && <span className="text-sm font-bold">{value}%</span>}
        </div>
        <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);