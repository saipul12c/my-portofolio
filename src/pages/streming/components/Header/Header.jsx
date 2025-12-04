import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Upload, Bell, Mic, X, Play, Menu, 
  Video, Camera, Plus, User, Settings, Moon, Sun,
  Keyboard, HelpCircle, TrendingUp, MessageCircle,
  Globe, Shield, LogOut, MoreVertical
} from 'lucide-react';
import { SEARCH_SUGGESTIONS } from '../../utils/constants';
import { debounce } from '../../utils/helpers';

const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  handleVoiceSearch,
  toggleSidebar,
  toggleTheme,
  isDarkMode,
  user,
  notifications,
  onUploadClick,
  onShortsClick
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef(null);

  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  const debouncedSearch = debounce((value) => {
    if (value.trim()) {
      handleSearch(value);
    }
  }, 500);

  const handleInputChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleSearch('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowNotifications(false);
      setShowUserMenu(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-dropdown')) {
        setShowSuggestions(false);
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowSettings(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 bg-white dark:bg-black py-3 flex items-center justify-between z-50 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6">
      {/* Left Section - Logo and Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Play size={20} fill="white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline">JasPro Tubs</span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative header-dropdown">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
              setShowSuggestions(false);
            }}
            className="flex"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyPress}
                className="w-full px-5 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 border-r-0 rounded-l-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button 
              type="submit" 
              className="px-6 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 border-l-0 rounded-r-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Voice Search */}
          <button 
            onClick={handleVoiceSearch}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <Mic size={20} />
          </button>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              {searchQuery ? (
                <>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Search for "{searchQuery}"
                  </div>
                  {SEARCH_SUGGESTIONS
                    .filter(suggestion => 
                      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-5 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3"
                      >
                        <Search size={16} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{suggestion}</span>
                      </button>
                    ))}
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Trending searches
                  </div>
                  {SEARCH_SUGGESTIONS.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-5 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3"
                    >
                      <TrendingUp size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{suggestion}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center gap-2">
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={onShortsClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Create Short"
          >
            <Camera size={22} />
          </button>
          
          <button 
            onClick={onUploadClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Upload video"
          >
            <Upload size={22} />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={22} />
          </button>
          
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Keyboard shortcuts"
          >
            <Keyboard size={22} />
          </button>
          
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Help"
          >
            <HelpCircle size={22} />
          </button>
        </div>

        {/* Notifications */}
        <div className="relative header-dropdown">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Notifications"
          >
            <Bell size={22} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  Mark all as read
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications?.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'upload' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        notification.type === 'live' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        {notification.type === 'upload' ? <Video size={18} /> :
                         notification.type === 'live' ? <Play size={18} /> :
                         <MessageCircle size={18} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 text-center">
                <button className="text-blue-500 hover:text-blue-600 text-sm">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative header-dropdown">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={user?.avatar || 'https://i.pravatar.cc/40'} 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={user?.avatar || 'https://i.pravatar.cc/40'} 
                    alt="User" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{user?.name || 'User'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <User size={18} />
                  <span>Your channel</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Play size={18} />
                  <span>YouTube Studio</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Settings size={18} />
                  <span>Settings</span>
                </a>
              </div>
              
              <div className="py-2 border-t border-gray-200 dark:border-gray-800">
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Moon size={18} />
                  <span>Appearance: {isDarkMode ? 'Dark' : 'Light'}</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Globe size={18} />
                  <span>Language: English</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Shield size={18} />
                  <span>Restricted Mode: Off</span>
                </a>
              </div>
              
              <div className="py-2 border-t border-gray-200 dark:border-gray-800">
                <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500">
                  <LogOut size={18} />
                  <span>Sign out</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <MoreVertical size={22} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 w-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 p-4">
          <h3 className="font-semibold text-lg mb-4">Settings</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Video Quality</h4>
              <select className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <option>1080p (Recommended)</option>
                <option>720p</option>
                <option>480p</option>
                <option>360p</option>
              </select>
            </div>
            <div>
              <h4 className="font-medium mb-2">Autoplay</h4>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Autoplay next video</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;