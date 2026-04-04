import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp } from 'lucide-react';
import api from '../lib/api';

const RecommendationEngine = ({ currentVideoId, categories }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Get related videos based on categories
        const data = await api.videos.getRelated(currentVideoId, categories);
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentVideoId) {
      fetchRecommendations();
    }
  }, [currentVideoId, categories]);

  if (loading) {
    return <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-40 h-24 bg-gray-800 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-900/50 rounded-2xl border border-gray-800">
        <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-2" />
        <p className="text-gray-400">No recommendations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((video) => (
        <motion.div
          key={video.id}
          whileHover={{ x: 5 }}
          className="flex gap-3 group cursor-pointer"
          onClick={() => window.location.href = `/streaming/v/${video.id}`} // Simple navigation for demo
        >
          {/* Thumbnail */}
          <div className="relative w-40 h-24 flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
            />
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
              {video.duration || '0:00'}
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <Play size={20} fill="white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1 group-hover:text-blue-400 transition-colors">
              {video.title}
            </h4>
            <p className="text-xs text-gray-400 truncate mb-1">{video.channel}</p>
            <div className="flex items-center text-[10px] text-gray-500 gap-1.5 uppercase tracking-wider">
              <span>{video.views}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>{video.uploadTime}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecommendationEngine;
