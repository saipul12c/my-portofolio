import React from 'react';
import { Link } from 'react-router-dom';

const MetricCard = ({ metric, index }) => {
  const content = (
    <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-blue-900/40 hover:border-cyan-400/50 transition-all hover:scale-105 group cursor-pointer">
      <div className="text-2xl mb-2">{metric.icon}</div>
      <div className="text-2xl font-bold text-white">{metric.value}</div>
      <div className="text-gray-400 text-sm group-hover:text-cyan-300 transition-colors">
        {metric.label}
      </div>
    </div>
  );

  return metric.link ? (
    <Link to={metric.link}>{content}</Link>
  ) : (
    content
  );
};

export default MetricCard;