// Local storage helper functions
export const storage = {
  // Get item from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },

  // Set item to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item to localStorage:', error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return false;
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Video history storage
export const videoHistory = {
  // Add video to history
  add: (video) => {
    const history = storage.get('watchHistory') || [];
    const existingIndex = history.findIndex(item => item.id === video.id);
    
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    history.unshift({
      ...video,
      watchedAt: new Date().toISOString(),
      progress: video.progress || 0
    });
    
    // Keep only last 100 videos
    const trimmedHistory = history.slice(0, 100);
    storage.set('watchHistory', trimmedHistory);
  },

  // Get watch history
  get: () => {
    return storage.get('watchHistory') || [];
  },

  // Clear watch history
  clear: () => {
    storage.remove('watchHistory');
  }
};

// Liked videos storage
export const likedVideos = {
  // Add/remove video from liked videos
  toggle: (video) => {
    const liked = storage.get('likedVideos') || [];
    const existingIndex = liked.findIndex(item => item.id === video.id);
    
    if (existingIndex !== -1) {
      liked.splice(existingIndex, 1);
      storage.set('likedVideos', liked);
      return false; // Video unliked
    } else {
      liked.unshift({
        ...video,
        likedAt: new Date().toISOString()
      });
      storage.set('likedVideos', liked);
      return true; // Video liked
    }
  },

  // Check if video is liked
  isLiked: (videoId) => {
    const liked = storage.get('likedVideos') || [];
    return liked.some(item => item.id === videoId);
  },

  // Get liked videos
  get: () => {
    return storage.get('likedVideos') || [];
  }
};

// User settings storage
export const userSettings = {
  // Get user settings
  get: () => {
    const defaultSettings = {
      autoplay: true,
      quality: '1080p',
      captions: true,
      darkMode: true,
      notifications: true,
      playbackSpeed: 1,
      volume: 80,
      keyboardShortcuts: true
    };
    
    const savedSettings = storage.get('userSettings');
    return { ...defaultSettings, ...savedSettings };
  },

  // Update user settings
  update: (newSettings) => {
    const currentSettings = userSettings.get();
    const updatedSettings = { ...currentSettings, ...newSettings };
    storage.set('userSettings', updatedSettings);
    return updatedSettings;
  }
};

// Type declaration for SpeechRecognition (fix untuk Tubs.jsx)
export const isSpeechRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const getSpeechRecognition = () => {
  if (isSpeechRecognitionSupported()) {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  return null;
};