import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, VolumeX, Heart, MessageCircle, Share2, 
  MoreVertical, Pause, Play, ChevronUp, ChevronDown,
  Music, Bookmark
} from 'lucide-react';
import useVideoPlayer from '../../hooks/useVideoPlayer';

const ShortsPlayer = ({ short, onNext, onPrevious, onClose }) => {
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const {
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    updateVolume,
    toggleMute
  } = useVideoPlayer(videoRef);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onNext();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          videoRef.current?.requestFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, onNext, onPrevious, toggleMute]);

  // Auto play on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Save to liked shorts
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Save to watch later
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: short.title,
        text: `Check out this short: ${short.title}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="relative h-screen max-h-[100vh] bg-black flex flex-col items-center justify-center">
      {/* Video Player */}
      <div className="relative w-full max-w-[400px] h-full max-h-[calc(100vh-80px)]">
        <video
          ref={videoRef}
          src={short.videoUrl}
          className="w-full h-full object-contain"
          loop
          onClick={togglePlay}
        />

        {/* Video Info Overlay */}
        <div className="absolute bottom-20 left-4 right-4 text-white">
          <h3 className="text-lg font-semibold mb-2">{short.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={short.channelLogo} 
                alt={short.channel}
                className="w-8 h-8 rounded-full"
                loading="lazy"
              />
              <span className="font-medium">{short.channel}</span>
              <button className="px-3 py-1 bg-white text-black text-sm rounded-full font-semibold">
                Subscribe
              </button>
            </div>
            <div className="text-sm text-gray-300">
              {short.views} • {short.uploadTime}
            </div>
          </div>

          {/* Music */}
          <div className="flex items-center gap-2 mt-3">
            <Music size={16} />
            <span className="text-sm">{short.music}</span>
          </div>

          {/* Tags */}
          {short.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {short.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800/80 text-white text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
          <button 
            onClick={handleLike}
            className="flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isLiked ? 'bg-red-500/20' : 'bg-white/10'
            }`}>
              <Heart size={24} className={isLiked ? 'fill-red-500 text-red-500' : 'text-white'} />
            </div>
            <span className="text-xs mt-1">{short.likes.toLocaleString()}</span>
          </button>

          <button 
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <span className="text-xs mt-1">{short.comments.toLocaleString()}</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Share2 size={24} />
            </div>
            <span className="text-xs mt-1">Share</span>
          </button>

          <button 
            onClick={handleSave}
            className="flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isSaved ? 'bg-blue-500/20' : 'bg-white/10'
            }`}>
              <Bookmark size={24} className={isSaved ? 'fill-blue-500 text-blue-500' : 'text-white'} />
            </div>
            <span className="text-xs mt-1">Save</span>
          </button>

          <button className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <MoreVertical size={24} />
            </div>
          </button>
        </div>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
              <Play size={40} fill="white" />
            </div>
          </div>
        )}

        {/* Volume Control */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => updateVolume(parseInt(e.target.value))}
            className="w-24 accent-white"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <button 
          onClick={onPrevious}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          onClick={onNext}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
      >
        <span className="text-xl">×</span>
      </button>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
          {/* Comments implementation */}
        </div>
      )}
    </div>
  );
};

export default ShortsPlayer;