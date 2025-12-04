import { 
  Home, TrendingUp as Trending, Music, Film, 
  GamepadIcon, Newspaper, Lightbulb, ShoppingBag, 
  Youtube, History, User, Watch, ThumbsUp, Clock,
  TrendingUp, Settings, UserPlus, Radio, Tv,
  Award, Compass, Zap, Users, Star, Folder
} from 'lucide-react';

export const mainMenu = [
  { icon: <Home size={22} />, label: 'Home', active: true },
  { icon: <Compass size={22} />, label: 'Explore' },
  { icon: <Tv size={22} />, label: 'Shorts' },
  { icon: <Users size={22} />, label: 'Subscriptions' },
  { icon: <Folder size={22} />, label: 'Library' },
  { icon: <History size={22} />, label: 'History' },
  { icon: <Clock size={22} />, label: 'Watch Later' },
  { icon: <ThumbsUp size={22} />, label: 'Liked Videos' },
  { icon: <Music size={22} />, label: 'Music' },
  { icon: <GamepadIcon size={22} />, label: 'Gaming' },
  { icon: <Newspaper size={22} />, label: 'News' },
  { icon: <Award size={22} />, label: 'Sports' },
  { icon: <Lightbulb size={22} />, label: 'Learning' },
  { icon: <ShoppingBag size={22} />, label: 'Shopping' },
  { icon: <Radio size={22} />, label: 'Live' },
];

export const subscriptions = [
  { logo: 'https://i.pravatar.cc/40?img=1', label: 'Tech Channel', live: true, category: 'Technology' },
  { logo: 'https://i.pravatar.cc/40?img=2', label: 'Music Pro', new: 3, category: 'Music' },
  { logo: 'https://i.pravatar.cc/40?img=3', label: 'Gaming World', category: 'Gaming' },
  { logo: 'https://i.pravatar.cc/40?img=4', label: 'Cooking Master', category: 'Cooking' },
  { logo: 'https://i.pravatar.cc/40?img=5', label: 'Travel Vlogs', category: 'Travel' },
  { logo: 'https://i.pravatar.cc/40?img=13', label: 'Science Daily', category: 'Science' },
  { logo: 'https://i.pravatar.cc/40?img=14', label: 'Tech Reviews', category: 'Technology' },
];

export const explore = [
  { icon: <TrendingUp size={22} />, label: 'Trending' },
  { icon: <Music size={22} />, label: 'Music' },
  { icon: <Film size={22} />, label: 'Movies' },
  { icon: <GamepadIcon size={22} />, label: 'Gaming' },
  { icon: <Newspaper size={22} />, label: 'News' },
  { icon: <Award size={22} />, label: 'Sports' },
  { icon: <Lightbulb size={22} />, label: 'Learning' },
  { icon: <Zap size={22} />, label: 'Live' },
];

export const moreFromYoutube = [
  { icon: <Youtube size={22} />, label: 'YouTube Premium' },
  { icon: <Film size={22} />, label: 'YouTube Studio' },
  { icon: <Music size={22} />, label: 'YouTube Music' },
  { icon: <GamepadIcon size={22} />, label: 'YouTube Kids' },
  { icon: <Tv size={22} />, label: 'YouTube TV' },
];

export const userMenu = [
  { icon: <User size={22} />, label: 'Your channel' },
  { icon: <History size={22} />, label: 'History' },
  { icon: <Watch size={22} />, label: 'Your videos' },
  { icon: <Clock size={22} />, label: 'Watch later' },
  { icon: <ThumbsUp size={22} />, label: 'Liked videos' },
  { icon: <Settings size={22} />, label: 'Settings' },
];