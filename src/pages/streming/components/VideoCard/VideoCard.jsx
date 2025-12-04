import React, { useState } from 'react';
import { 
  Clock, MoreVertical, Play, CheckCircle, Watch, 
  Save, Download, Share, Flag, ThumbsUp, UserPlus,
  Eye
} from 'lucide-react';

const VideoCard = ({ video, onVideoClick, onMenuAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onMenuAction) {
      onMenuAction('like', video, !isLiked);
    }
  };

  const handleMenuClick = (action, e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onMenuAction) {
      onMenuAction(action, video);
    }
  };

  return (
    <div 
      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black mb-3">
        <div className="relative w-full h-full">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Live Badge */}
        {video.isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}

        {/* Progress Bar */}
        {video.progress && video.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div 
              className="h-full bg-red-600" 
              style={{ width: `${video.progress}%` }}
            />
          </div>
        )}

        {/* Duration/Live Viewers */}
        <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded-md font-medium">
          {video.isLive ? (
            <div className="flex items-center gap-1">
              <Eye size={10} />
              {video.liveViewers?.toLocaleString() || '0'}
            </div>
          ) : video.duration}
        </div>
        
        {/* Quick Actions */}
        <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button 
            className="w-8 h-8 bg-black/80 rounded-full flex items-center justify-center hover:bg-black"
            onClick={(e) => handleMenuClick('watchLater', e)}
          >
            <Clock size={16} />
          </button>
          <button 
            className="w-8 h-8 bg-black/80 rounded-full flex items-center justify-center hover:bg-black"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Play Button Overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => onVideoClick(video)}
          >
            <div className="bg-red-600 p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
              <Play size={24} fill="white" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {/* Channel Avatar */}
        <div className="relative flex-shrink-0">
          <img 
            src={video.channelLogo} 
            alt={video.channel}
            className="w-10 h-10 rounded-full hover:ring-2 hover:ring-gray-600 transition-all"
          />
          {video.verified && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 bg-white rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">
              {video.channel}
            </span>
            {video.verified && (
              <CheckCircle className="w-3 h-3 text-gray-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>{video.views}</span>
            {!video.isLive && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{video.uploadTime}</span>
              </>
            )}
            {video.isNew && (
              <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-sm">
                NEW
              </span>
            )}
          </div>
          {/* Tags */}
          {video.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {video.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Like Button (desktop only) */}
        <div className="hidden lg:flex items-center">
          <button 
            onClick={handleLikeClick}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ThumbsUp size={18} />
          </button>
        </div>

        {/* Video Menu Popup */}
        {showMenu && (
          <div className="absolute right-0 mt-12 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 w-64 z-50">
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 rounded-t-lg"
              onClick={(e) => handleMenuClick('queue', e)}
            >
              <Watch size={18} />
              <span>Add to queue</span>
            </button>
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800"
              onClick={(e) => handleMenuClick('watchLater', e)}
            >
              <Clock size={18} />
              <span>Save to Watch Later</span>
            </button>
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800"
              onClick={(e) => handleMenuClick('saveToPlaylist', e)}
            >
              <Save size={18} />
              <span>Save to playlist</span>
            </button>
            <div className="h-px bg-gray-800"></div>
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800"
              onClick={(e) => handleMenuClick('subscribe', e)}
            >
              <UserPlus size={18} />
              <span>Subscribe to {video.channel}</span>
            </button>
            <div className="h-px bg-gray-800"></div>
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800"
              onClick={(e) => handleMenuClick('download', e)}
            >
              <Download size={18} />
              <span>Download</span>
            </button>
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800"
              onClick={(e) => handleMenuClick('share', e)}
            >
              <Share size={18} />
              <span>Share</span>
            </button>
            <div className="h-px bg-gray-800"></div>
            <button 
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 rounded-b-lg text-red-400"
              onClick={(e) => handleMenuClick('report', e)}
            >
              <Flag size={18} />
              <span>Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;