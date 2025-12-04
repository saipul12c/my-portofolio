import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Settings, Maximize, Minimize, CheckCircle, ThumbsUp, Share2, 
  Download, MoreVertical, Sliders, Captions, Repeat, 
  Clock, Bookmark, UserPlus, Flag, Heart, ChevronRight,
  Send, ThumbsDown, ExternalLink, RotateCcw
} from 'lucide-react';
import CommentSection from '../CommentSection/CommentSection';
import useVideoPlayer from '../../hooks/useVideoPlayer';

const VideoPlayerModal = ({ video, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    showControls,
    
    togglePlay,
    seek,
    skip,
    updateVolume,
    toggleMute,
    changeSpeed,
    toggleFullscreen,
    formatTime,
    setShowControls
  } = useVideoPlayer(videoRef);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'j':
          e.preventDefault();
          skip(-10);
          break;
        case 'l':
          e.preventDefault();
          skip(10);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'c':
          e.preventDefault();
          // Toggle captions
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          updateVolume(Math.min(100, volume + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          updateVolume(Math.max(0, volume - 10));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, togglePlay, skip, toggleMute, toggleFullscreen, updateVolume, volume, onClose]);

  if (!isOpen) return null;

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
    // Save like to storage
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleSave = () => {
    setSaved(!saved);
    // Save to watch later or playlist
  };

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  const handleDownload = () => {
    // Implement download functionality
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <button
          onClick={onClose}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
          <span>Back to browsing</span>
        </button>
        
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
            <ExternalLink size={18} className="mr-2 inline" />
            Open in app
          </button>
          <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          <div 
            ref={containerRef}
            className="relative flex-1 bg-black"
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => {
              if (isPlaying) {
                setTimeout(() => setShowControls(false), 2000);
              }
            }}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              onClick={togglePlay}
            />

            {/* Video Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <X size={20} />
                  </button>
                  <div className="text-white">
                    <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                    <p className="text-sm text-gray-300">{video.channel}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80">
                    <Settings size={20} />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  {isPlaying ? (
                    <Pause size={40} fill="white" />
                  ) : (
                    <Play size={40} fill="white" />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600"
                  />
                  <div className="flex justify-between text-sm text-gray-300 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={togglePlay}
                      className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} fill="white" />}
                    </button>
                    
                    <button 
                      onClick={() => skip(-10)}
                      className="flex items-center gap-1 text-gray-300 hover:text-white"
                    >
                      <SkipBack size={20} />
                      <span className="text-sm">10s</span>
                    </button>
                    
                    <button 
                      onClick={() => skip(10)}
                      className="flex items-center gap-1 text-gray-300 hover:text-white"
                    >
                      <span className="text-sm">10s</span>
                      <SkipForward size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={toggleMute}
                        className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
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

                    <div className="text-sm">
                      {playbackSpeed}x
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center"
                    >
                      <Settings size={20} />
                    </button>
                    <button 
                      onClick={toggleFullscreen}
                      className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center"
                    >
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Menu */}
            {showSettings && (
              <div className="absolute bottom-20 right-4 bg-gray-900 rounded-lg p-4 w-64 shadow-2xl z-50">
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Playback speed</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          changeSpeed(speed);
                          setPlaybackSpeed(speed);
                        }}
                        className={`py-2 rounded ${playbackSpeed === speed ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Quality</h4>
                  <div className="space-y-1">
                    {video.quality?.map(quality => (
                      <button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`w-full text-left px-3 py-2 rounded ${selectedQuality === quality ? 'bg-red-600' : 'hover:bg-gray-800'}`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Info Panel */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="max-w-4xl">
              <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={video.channelLogo} 
                      alt={video.channel}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{video.channel}</span>
                        {video.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <span className="text-sm text-gray-400">{video.subscribers} subscribers</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleSubscribe}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                      subscribed 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {subscribed ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Like/Dislike */}
                  <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
                    <button 
                      onClick={handleLike}
                      className={`px-4 py-2 flex items-center gap-2 transition-colors ${liked ? 'text-blue-400 bg-blue-400/10' : 'hover:bg-gray-700'}`}
                    >
                      <ThumbsUp size={20} />
                      <span>{video.likes.toLocaleString()}</span>
                    </button>
                    <div className="w-px h-6 bg-gray-700"></div>
                    <button 
                      onClick={handleDislike}
                      className={`px-4 py-2 transition-colors ${disliked ? 'text-blue-400 bg-blue-400/10' : 'hover:bg-gray-700'}`}
                    >
                      <ThumbsDown size={20} />
                    </button>
                  </div>

                  <button 
                    onClick={handleSave}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${saved ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    <Bookmark size={20} />
                    <span>Save</span>
                  </button>

                  <button 
                    onClick={handleDownload}
                    className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    <Download size={20} />
                    <span>Download</span>
                  </button>

                  <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-900 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold">{video.views}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{video.uploadTime}</span>
                </div>
                <p className={`text-gray-300 ${!showDescription && 'line-clamp-3'}`}>
                  {video.description}
                </p>
                <button 
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors mt-2"
                >
                  {showDescription ? 'Show less' : 'Show more'}
                </button>
                
                {/* Tags */}
                {video.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {video.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-800 text-blue-400 text-sm rounded-full hover:bg-gray-700 cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-gray-800 mb-6">
                <button 
                  onClick={() => setActiveTab('comments')}
                  className={`pb-3 font-semibold ${activeTab === 'comments' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
                >
                  {video.comments.toLocaleString()} Comments
                </button>
                <button 
                  onClick={() => setActiveTab('related')}
                  className={`pb-3 font-semibold ${activeTab === 'related' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
                >
                  Related Videos
                </button>
                <button 
                  onClick={() => setActiveTab('chapters')}
                  className={`pb-3 font-semibold ${activeTab === 'chapters' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
                >
                  Chapters
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'comments' && (
                <CommentSection />
              )}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div className="w-96 border-l border-gray-800 overflow-y-auto p-6">
          <h3 className="font-semibold text-lg mb-4">Up next</h3>
          {/* Related videos list would go here */}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;