import React from 'react';
import { TrendingUp, Sparkles, Clock, Zap, ArrowRight } from 'lucide-react';

const RecommendationBanner = ({ type = 'trending' }) => {
  const banners = {
    trending: {
      icon: <TrendingUp className="text-yellow-500" />,
      title: "Trending in your area",
      description: "Videos that are popular in your location right now",
      gradient: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/30",
      buttonText: "Explore trending"
    },
    personalized: {
      icon: <Sparkles className="text-purple-500" />,
      title: "Recommended for you",
      description: "Based on your watch history and interests",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      buttonText: "View recommendations"
    },
    watchLater: {
      icon: <Clock className="text-blue-500" />,
      title: "Continue watching",
      description: "Pick up where you left off",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      buttonText: "Resume watching"
    },
    new: {
      icon: <Zap className="text-green-500" />,
      title: "New from subscriptions",
      description: "15 new videos from channels you follow",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30",
      buttonText: "See what's new"
    }
  };

  const banner = banners[type];

  const handleDismiss = () => {
    // Implement dismiss logic
    console.log('Dismissing banner');
  };

  const handleExplore = () => {
    // Implement explore logic
    console.log('Exploring recommendations');
  };

  return (
    <div className={`bg-gradient-to-r ${banner.gradient} border ${banner.border} rounded-2xl p-6 mb-8 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            {banner.icon}
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
            <p className="text-gray-300">{banner.description}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={handleExplore}
                className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                {banner.buttonText}
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={handleDismiss}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats or Preview */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-300">Videos</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">3h 42m</div>
            <div className="text-sm text-gray-300">Watch time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-gray-300">Channels</div>
          </div>
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/50 w-3/4"></div>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mt-2">
          <span>75% match with your interests</span>
          <span>Updated just now</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationBanner;