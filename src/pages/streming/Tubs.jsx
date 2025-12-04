import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sliders, MoreVertical, Search, TrendingUp, 
  Video, Camera, Plus, Sparkles, Zap
} from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import FilterBar from './components/FilterBar/FilterBar';
import VideoCard from './components/VideoCard/VideoCard';
import VideoPlayerModal from './components/VideoPlayerModal/VideoPlayerModal';
import ShortsPlayer from './components/ShortsPlayer/ShortsPlayer';
import RecommendationBanner from './components/RecommendationBanner/RecommendationBanner';
import videosData from './data/videosData.json';
import shortsData from './data/shortsData.json';
import userData from './data/userData.json';
import { NOTIFICATIONS } from './utils/constants';
import { videoHistory, likedVideos, userSettings } from './utils/storage';

const Tubs = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState(videosData);
  const [shorts] = useState(shortsData);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedShort, setSelectedShort] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isShortsOpen, setIsShortsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user] = useState(userData);
  const [notifications] = useState(NOTIFICATIONS);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recommended');

  // Load user settings
  useEffect(() => {
    const settings = userSettings.get();
    setIsDarkMode(settings.darkMode);
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    userSettings.update({ darkMode: newDarkMode });
  };

  const handleSearch = useCallback((query = searchQuery) => {
    if (query.trim()) {
      const filtered = videosData.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.channel.toLowerCase().includes(query.toLowerCase()) ||
        video.description?.toLowerCase().includes(query.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setVideos(filtered);
    } else {
      setVideos(videosData);
    }
  }, [searchQuery]);

  const handleVoiceSearch = () => {
    // Check if browser supports Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Voice search failed. Please try again.');
      };
      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
    videoHistory.add(video);
  };

  const handleShortClick = (short) => {
    setSelectedShort(short);
    setIsShortsOpen(true);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'Shorts') {
      // Show shorts
    } else if (filter === 'Live') {
      const liveVideos = videosData.filter(video => video.isLive);
      setVideos(liveVideos);
    } else if (filter !== 'All') {
      const filtered = videosData.filter(video => 
        video.category?.includes(filter) || 
        video.tags?.includes(filter.toLowerCase())
      );
      setVideos(filtered);
    } else {
      setVideos(videosData);
    }
  };

  const handleMenuAction = (action, video) => {
    switch (action) {
      case 'like':
        likedVideos.toggle(video);
        break;
      case 'watchLater':
        // Add to watch later
        console.log('Added to watch later:', video.title);
        break;
      case 'saveToPlaylist':
        // Open playlist modal
        console.log('Save to playlist:', video.title);
        break;
      case 'subscribe':
        // Subscribe to channel
        console.log('Subscribe to channel:', video.channel);
        break;
      case 'download':
        // Download video
        console.log('Download video:', video.title);
        break;
      case 'share':
        // Share video
        if (navigator.share) {
          navigator.share({
            title: video.title,
            text: `Check out this video: ${video.title}`,
            url: window.location.href,
          });
        }
        break;
      case 'report':
        console.log('Report video:', video.title);
        break;
      default:
        break;
    }
  };

  const nextShort = () => {
    const currentIndex = shorts.findIndex(s => s.id === selectedShort?.id);
    if (currentIndex < shorts.length - 1) {
      setSelectedShort(shorts[currentIndex + 1]);
    }
  };

  const previousShort = () => {
    const currentIndex = shorts.findIndex(s => s.id === selectedShort?.id);
    if (currentIndex > 0) {
      setSelectedShort(shorts[currentIndex - 1]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Close modals with Escape
      if (e.key === 'Escape') {
        if (isPlayerOpen) setIsPlayerOpen(false);
        if (isShortsOpen) setIsShortsOpen(false);
      }
      
      // Search with /
      if (e.key === '/' && !e.ctrlKey) {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlayerOpen, isShortsOpen]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user}
        />
        
        {/* main no longer uses fixed left margin - flex layout + sidebar widths handle spacing */}
        <main className={`flex-1 transition-all duration-300 overflow-x-hidden`}>
          <Header 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleVoiceSearch={handleVoiceSearch}
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            user={user}
            notifications={notifications}
            onShortsClick={() => setSelectedShort(shorts[0])}
          />
          
          <FilterBar 
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            showShorts={true}
          />
          
          {/* Main Content */}
          <div className="px-4 lg:px-6 py-4">
            {/* Recommendations Banner */}
            <RecommendationBanner type="personalized" />
            
            {/* Content Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {activeFilter === 'Shorts' ? 'Shorts' : 
                   activeFilter === 'Live' ? 'Live Now' : 
                   'Recommended videos'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeFilter === 'Shorts' 
                    ? 'Short videos to watch right now' 
                    : 'Videos you might like based on your watch history'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white dark:bg-gray-700' : ''
                    }`}
                  >
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white dark:bg-gray-700' : ''
                    }`}
                  >
                    <div className="w-5 h-5 flex flex-col justify-between">
                      <div className="w-full h-1 bg-current rounded-sm"></div>
                      <div className="w-full h-1 bg-current rounded-sm"></div>
                      <div className="w-full h-1 bg-current rounded-sm"></div>
                    </div>
                  </button>
                </div>
                
                {/* Sort Options */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="oldest">Oldest</option>
                </select>
                
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Content Grid/List */}
            {activeFilter === 'Shorts' ? (
              // Shorts Grid
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-12">
                {shorts.map(short => (
                  <div 
                    key={short.id} 
                    onClick={() => handleShortClick(short)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black mb-2">
                      <img 
                        src={short.thumbnail} 
                        alt={short.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded-md">
                        {short.duration}
                      </div>
                    </div>
                    <h3 className="font-semibold line-clamp-2 text-sm">{short.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {short.views}
                    </p>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              // Videos Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                {videos.map(video => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onVideoClick={handleVideoClick}
                    onMenuAction={handleMenuAction}
                  />
                ))}
              </div>
            ) : (
              // Videos List View
              <div className="space-y-4 pb-12">
                {videos.map(video => (
                  <div 
                    key={video.id} 
                    onClick={() => handleVideoClick(video)}
                    className="flex gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                  >
                    <div className="relative flex-shrink-0 w-64 aspect-video rounded-lg overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded-md">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-red-500 dark:group-hover:text-red-400">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <img 
                          src={video.channelLogo} 
                          alt={video.channel}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-600 dark:text-gray-400">{video.channel}</span>
                        {video.verified && (
                          <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">✓</span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{video.views}</span>
                        <span>{video.uploadTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {videos.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 text-center py-12">
                <Search size={80} className="text-gray-400 dark:text-gray-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">No videos found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                  Try different keywords or check out our trending videos
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('All');
                    setVideos(videosData);
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full transition-colors font-medium"
                >
                  Browse trending videos
                </button>
              </div>
            )}

            {/* Load More Button */}
            {videos.length > 0 && activeFilter !== 'Shorts' && (
              <div className="flex justify-center py-8">
                <button className="px-8 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full transition-colors font-medium">
                  Load more videos
                </button>
              </div>
            )}
          </div>

          {/* Video Player Modal */}
          {selectedVideo && (
            <VideoPlayerModal
              video={selectedVideo}
              isOpen={isPlayerOpen}
              onClose={() => setIsPlayerOpen(false)}
            />
          )}

          {/* Shorts Player Modal */}
          {selectedShort && (
            <ShortsPlayer
              short={selectedShort}
              onClose={() => setIsShortsOpen(false)}
              onNext={nextShort}
              onPrevious={previousShort}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Tubs;