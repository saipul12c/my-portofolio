export const FILTERS = [
  'All', 'Gaming', 'Music', 'Live', 'Mixes', 'React', 
  'JavaScript', 'CSS', 'Recently uploaded', 'Watched',
  'New to you', 'Computer Programming', 'Anime', 
  'Chill-out music', 'Podcasts', 'Coding', 'AI'
];

export const SEARCH_SUGGESTIONS = [
  'react tutorials',
  'javascript projects',
  'tailwind css',
  'next.js 14',
  'typescript course',
  'web development',
  'css animations',
  'node.js backend',
  'python data science',
  'machine learning',
  'react native',
  'vue.js tutorial',
  'angular framework',
  'docker containers',
  'kubernetes orchestration'
];

export const VIDEO_QUALITIES = [
  { label: '360p', value: '360p' },
  { label: '480p', value: '480p' },
  { label: '720p HD', value: '720p' },
  { label: '1080p Full HD', value: '1080p' },
  { label: '1440p 2K', value: '1440p' },
  { label: '2160p 4K', value: '2160p' }
];

export const PLAYBACK_SPEEDS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2x', value: 2 }
];

export const CATEGORIES = [
  'All', 'Gaming', 'Music', 'Sports', 'Education', 
  'Entertainment', 'News', 'Technology', 'Cooking',
  'Travel', 'Fitness', 'Comedy', 'Science', 'Art'
];

export const KEYBOARD_SHORTCUTS = {
  'Space': 'Play/Pause',
  'K': 'Play/Pause',
  'J': 'Rewind 10 seconds',
  'L': 'Forward 10 seconds',
  'F': 'Fullscreen',
  'M': 'Mute',
  'ArrowUp': 'Volume Up',
  'ArrowDown': 'Volume Down',
  'C': 'Toggle Captions',
  'Shift+N': 'Next Video',
  'Shift+P': 'Previous Video'
};

export const NOTIFICATIONS = [
  {
    id: 1,
    title: 'New video from React Mastery',
    message: 'Just uploaded: "React 19 New Features Explained"',
    time: '2 minutes ago',
    read: false,
    type: 'upload'
  },
  {
    id: 2,
    title: 'Live stream starting soon',
    message: 'CSS Pro is going live in 15 minutes',
    time: '1 hour ago',
    read: false,
    type: 'live'
  },
  {
    id: 3,
    title: 'Comment reply',
    message: 'Someone replied to your comment',
    time: '3 hours ago',
    read: true,
    type: 'comment'
  }
];