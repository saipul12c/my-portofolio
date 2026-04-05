import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdEmail, MdShare, MdQrCode, MdHome, MdInfo, MdFolderOpen, 
  MdMailOutline, MdContentCopy, MdDownload, MdChat, MdForum, MdOpenInNew, MdVerified 
} from 'react-icons/md';
import { HiOutlineClipboardCopy, HiClipboardCheck } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Avatar from '../ui/Avatar';
import MobilePlatformCard from '../ui/MobilePlatformCard';

// Import QR Code generator
import QRCode from 'qrcode';

// Import Hobbies data and icons
import hobbiesData from '../../../data/hub/hobbiesData.json';
import { iconMap } from '../../owner/utils/iconMap';
import { generateSlug } from '../../hub/utils/hobbyUtils';
import { supabase } from '../../../lib/supabaseClient';

const usesData = [
  {
    category: 'Hardware',
    icon: '🖥️',
    color: 'cyan',
    items: [
      { name: 'MacBook Pro M2', description: 'Primary machine for development and long-term projects.', url: 'https://www.apple.com/macbook-pro/' },
      { name: 'ASUS VivoBook 14', description: 'Daily driver for quick tasks and Windows-specific development.', url: 'https://www.asus.com/laptops/for-home/vivobook/' },
      { name: 'iPhone 13', description: 'Testing mobile responsiveness and iOS specific features.', url: 'https://www.apple.com/iphone-13/' }
    ]
  },
  {
    category: 'Editor',
    icon: '✏️',
    color: 'blue',
    items: [
      { name: 'Visual Studio Code', description: 'My primary editor for web and full-stack development.', url: 'https://code.visualstudio.com/' },
      { name: 'Cursor AI', description: 'AI-powered code editor that supercharges productivity.', url: 'https://cursor.sh/' },
      { name: 'One Dark Pro', description: 'My go-to VS Code color theme — easy on the eyes.', url: 'https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme' }
    ]
  },
  {
    category: 'Terminal',
    icon: '💻',
    color: 'green',
    items: [
      { name: 'Windows Terminal', description: 'Modern terminal application for command-line users.', url: 'https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701' },
      { name: 'Warp', description: 'The terminal for the 21st century, with built-in AI.', url: 'https://www.warp.dev/' },
      { name: 'Oh My Posh', description: 'Prompt theme engine for any shell.', url: 'https://ohmyposh.dev/' }
    ]
  },
  {
    category: 'Apps',
    icon: '📱',
    color: 'purple',
    items: [
      { name: 'Figma', description: 'Collaborative interface design tool for all my UI/UX needs.', url: 'https://www.figma.com/' },
      { name: 'Notion', description: 'All-in-one workspace for notes, tasks, and project management.', url: 'https://www.notion.so/' },
      { name: 'Postman', description: 'API platform for developers to design, build, and test APIs.', url: 'https://www.postman.com/' }
    ]
  },
  {
    category: 'Browser',
    icon: '🌐',
    color: 'yellow',
    items: [
      { name: 'Arc Browser', description: 'A more personal and organized way to browse the web.', url: 'https://arc.net/' },
      { name: 'Google Chrome', description: 'Essential for testing and using developer tools.', url: 'https://www.google.com/chrome/' },
      { name: 'React DevTools', description: 'Inspect the React component hierarchy and state.', url: 'https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbhfkeoomakeohkd' }
    ]
  },
  {
    category: 'Tech Stack',
    icon: '🚀',
    color: 'pink',
    items: [
      { name: 'React.js + Vite', description: 'The core technologies I use to build modern web apps.', url: 'https://react.dev/' },
      { name: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.', url: 'https://tailwindcss.com/' },
      { name: 'Supabase', description: 'The open-source Firebase alternative for my backends.', url: 'https://supabase.com/' }
    ]
  }
];

const MobileLayout = memo(({
  platformData,
  handleCopyEmail,
  handleShare,
  copied,
  activeTab,
  setActiveTab,
  stats,
  certificates = [],
  openCertModal
}) => {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [hoveredWebNav, setHoveredWebNav] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  // Fetch recent Live Discussion messages & Setup Realtime
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('username, content, role, timestamp')
          .order('timestamp', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        if (data) setRecentChats(data);
      } catch (err) {
        console.warn('Could not fetch chats:', err);
      }
    };

    fetchRecentChats();

    // Realtime Subscription
    const channel = supabase
      .channel('portal-chat-preview')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        setRecentChats(prev => [payload.new, ...prev].slice(0, 10));
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        setRecentChats(prev => prev.map(msg => msg.id === payload.new.id ? payload.new : msg));
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        setRecentChats(prev => prev.filter(msg => msg.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Pre-process hobbies to include slugs once
  const hobbiesWithSlugs = useMemo(() => {
    return hobbiesData.map(h => ({
      ...h,
      slug: generateSlug(h.title)
    }));
  }, []);

  const [displayedHobbies, setDisplayedHobbies] = useState(hobbiesWithSlugs.slice(0, 6));

  // Rotate hobbies one-by-one every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const indexToReplace = Math.floor(Math.random() * 6);
      
      const availableHobbies = hobbiesWithSlugs.filter(h => 
        !displayedHobbies.some(dh => dh.id === h.id)
      );
      
      if (availableHobbies.length > 0) {
        const newHobby = availableHobbies[Math.floor(Math.random() * availableHobbies.length)];
        
        setDisplayedHobbies(prev => {
          const next = [...prev];
          next[indexToReplace] = newHobby;
          return next;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [displayedHobbies, hobbiesWithSlugs]);

  // Logic for rotating certificates (Max 3 displayed on mobile)
  const [displayedCerts, setDisplayedCerts] = useState([]);

  useEffect(() => {
    if (certificates.length > 0) {
      setDisplayedCerts(certificates.slice(0, 3));
    }
  }, [certificates]);

  useEffect(() => {
    if (certificates.length <= 3) return;

    const interval = setInterval(() => {
      setDisplayedCerts(prev => {
        const newCerts = [...prev];
        const indexToReplace = Math.floor(Math.random() * Math.min(prev.length, 3));
        
        // Find a certificate that is not currently displayed
        const displayedIds = new Set(prev.map(c => c.id));
        const availableCerts = certificates.filter(c => !displayedIds.has(c.id));
        
        if (availableCerts.length > 0) {
          const randomNewCert = availableCerts[Math.floor(Math.random() * availableCerts.length)];
          newCerts[indexToReplace] = randomNewCert;
        }
        
        return newCerts;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [certificates]);

  // Generate QR Code URL
  useEffect(() => {
    const portalUrl = 'https://syaiful-mukmin.netlify.app/portal';
    
    if (showQRModal && !qrCodeUrl) {
      generateQRCode(portalUrl);
    }
  }, [showQRModal, qrCodeUrl]);

  const generateQRCode = async (text) => {
    try {
      setIsGenerating(true);
      const url = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `syaiful-mukmin-portal-qrcode-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const copyQRCodeLink = () => {
    const portalUrl = 'https://syaiful-mukmin.netlify.app/portal';
    navigator.clipboard.writeText(portalUrl).then(() => {
      alert('Link portal berhasil disalin!');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-4 pb-20">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-center mb-6">
          <Avatar />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-1.5">
            Muhammad Syaiful Mukmin
            <MdVerified className="w-5 h-5 text-blue-500 fill-blue-500" />
          </h1>
          <p className="text-gray-400 mb-6">Digital Creator & Developer</p>
          
          {/* Email card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 max-w-md mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <MdEmail className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Contact Email</p>
                  <p className="text-sm text-white font-medium truncate">hello@yourworld.com</p>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`p-2 rounded-lg flex-shrink-0 transition-colors ${copied ? 'bg-green-500/20' : 'bg-gray-800 hover:bg-gray-700'}`}
                aria-label={copied ? 'Copied' : 'Copy email'}
              >
                {copied ? (
                  <HiClipboardCheck className="w-5 h-5 text-green-400" />
                ) : (
                  <HiOutlineClipboardCopy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - Symmetric Grid Layout (4 columns now: Links, Chat, Stats, Website) */}
        <div className="grid grid-cols-4 gap-1 mb-8 bg-gray-900/40 backdrop-blur-md rounded-2xl p-1.5 max-w-md mx-auto border border-gray-800/50 shadow-lg">
          {['social', 'chat', 'setup', 'website'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 rounded-xl text-[11px] xs:text-xs font-semibold transition-all duration-300 text-center flex items-center justify-center ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              {tab === 'social' ? 'Links' : tab === 'setup' ? 'Stats' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="max-w-md mx-auto">
          {activeTab === 'social' && (
            <div className="space-y-3">
              {Object.entries(platformData).map(([key, data]) => (
                <MobilePlatformCard
                  key={key}
                  platform={key.charAt(0).toUpperCase() + key.slice(1)}
                  icon={data.icon}
                  username={data.username}
                  url={data.url}
                />
              ))}
              
              {/* About Syaiful Mukmin Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
                  <h3 className="text-white font-semibold text-sm mb-2">👋 Tentang Syaiful Mukmin</h3>
                  <p className="text-gray-300 text-[11px] leading-relaxed mb-3">
                    Muhammad Syaiful Mukmin adalah seorang digital creator dan developer passionate yang berkomitmen untuk menciptakan solusi inovatif dan konten berkualitas tinggi.
                  </p>
                  <button
                    onClick={() => navigate("/about")}
                    className="w-full px-3 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg text-white text-[11px] font-medium transition-colors"
                  >
                    Selengkapnya
                  </button>
                </div>
              </div>

              {/* Hobbies Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <span className="text-base">🎨</span>
                    My Hobbies
                  </h3>
                  <button 
                    onClick={() => navigate("/hobbies")}
                    className="text-[10px] text-gray-500 hover:text-white transition-colors"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {displayedHobbies.map((hobby) => {
                    const IconComponent = iconMap[hobby.icon];
                    return (
                      <div 
                        key={hobby.id} 
                        onClick={() => navigate(`/hobbies/${hobby.slug}`)}
                        className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 active:scale-95 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-gray-800">
                              {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${hobby.iconColor || 'text-gray-400'}`} />}
                            </span>
                            <span className="text-white text-xs font-medium">{hobby.title}</span>
                          </div>
                          <span className="text-[9px] text-gray-500 font-mono">{hobby.stats?.completion || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-1 rounded-full bg-gradient-to-r ${hobby.color || 'from-blue-500 to-cyan-400'} transition-all duration-1000 ease-in-out`} 
                            style={{ width: `${hobby.stats?.completion || 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <MdChat className="w-4 h-4 text-cyan-400" />
                  Live Discussion Preview
                </h3>
                <div className="space-y-3 mb-6">
                  {recentChats.length > 0 ? recentChats.map((chat, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-xl bg-gray-800/20">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
                        {chat.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-white truncate">{chat.username || 'Anonim'}</span>
                          <span className="text-[9px] text-gray-500 bg-gray-700/50 px-1 rounded uppercase tracking-tighter">{chat.role || 'USER'}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1">{chat.content || '...'}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 space-y-2">
                      <MdForum className="w-8 h-8 text-cyan-500/30 mx-auto" />
                      <p className="text-xs text-gray-400 font-medium">Belum ada percakapan</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed px-4">Jadilah yang pertama memulai diskusi di komunitas kami!</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate("/Live-Discussion")}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <MdForum className="w-4 h-4" />
                  Gabung Diskusi Sekarang →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Featured Certificates Section (Rotating Max 3) */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    Featured Certificates
                  </h3>
                  <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">New</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {displayedCerts.map((cert) => (
                    <div 
                      key={cert.id}
                      onClick={() => openCertModal(cert)}
                      className="bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 flex justify-between items-center active:scale-95 transition-all group"
                    >
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-bold group-hover:text-cyan-400 transition-colors line-clamp-1">{cert.title}</span>
                        <span className="text-[9px] text-gray-500">{cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">
                          {cert.year}
                        </span>
                        <MdOpenInNew className="w-3 h-3 text-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => navigate('/sertifikat')}
                  className="w-full mt-4 py-2 text-[10px] text-gray-500 hover:text-gray-300 text-center border-t border-gray-800/50 pt-3"
                >
                  Lihat Semua Sertifikat →
                </button>
              </div>

              {/* Hardware & Setup Category */}
              <div className="space-y-4">
                <div className="px-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-base">⚙️</span>
                    Uses & Setup
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">Hardware and professional tools.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {usesData.map((category, idx) => (
                    <div key={idx} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl">{category.icon}</span>
                        <h3 className={`text-sm font-black bg-gradient-to-r ${
                          category.color === 'blue' ? 'from-blue-400 to-cyan-400' :
                          category.color === 'green' ? 'from-green-400 to-emerald-400' :
                          category.color === 'purple' ? 'from-purple-400 to-pink-400' :
                          'from-yellow-400 to-orange-400'
                        } bg-clip-text text-transparent uppercase tracking-wider`}>
                          {category.category}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {category.items.map((item, iIdx) => (
                          <a key={iIdx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white text-xs font-bold group-hover:text-blue-400 transition-colors">{item.name}</span>
                              <MdOpenInNew className="w-3 h-3 text-cyan-400/30 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics (Merged from Old Stats) */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-base">📊</span>
                  Interaction Metrics
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-lg font-bold text-white">{stats.connections}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Links</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-lg font-bold text-white">{stats.reach}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Reach</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <p className="text-lg font-bold text-white">{stats.engagement}</p>
                    <p className="text-[9px] text-gray-500 uppercase">Rate</p>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-400 font-medium">Growth vs Last Year</span>
                    <span className="text-[10px] text-green-400 font-bold">↑ 233%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          )}




          {activeTab === 'website' && (
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-medium mb-4">Jelajahi Website</p>
              
              {/* Home Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('home')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg text-white font-medium hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
                >
                  <MdHome className="w-5 h-5" />
                  Home
                </button>
                {hoveredWebNav === 'home' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Kembali ke halaman utama website
                  </div>
                )}
              </div>

              {/* About Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('about')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/about")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdInfo className="w-5 h-5" />
                  Tentang
                </button>
                {hoveredWebNav === 'about' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Pelajari lebih lanjut tentang saya
                  </div>
                )}
              </div>

              {/* Portfolio Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('portfolio')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/projects")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdFolderOpen className="w-5 h-5" />
                  Portfolio
                </button>
                {hoveredWebNav === 'portfolio' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Lihat portfolio & proyek saya
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setHoveredWebNav('contact')}
                  onMouseLeave={() => setHoveredWebNav(null)}
                  onClick={() => navigate("/contact")}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-medium hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MdMailOutline className="w-5 h-5" />
                  Kontak
                </button>
                {hoveredWebNav === 'contact' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    Hubungi saya untuk kolaborasi
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <div className="flex gap-3 bg-gray-900/90 backdrop-blur-lg rounded-2xl p-3 border border-gray-800">
            <button
              onClick={handleShare}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <MdShare className="w-5 h-5" />
              Share Profile
            </button>
            <button 
              onClick={() => setShowQRModal(!showQRModal)}
              className="p-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl border border-emerald-500/50 active:scale-95 transition-transform hover:opacity-90"
            >
              <MdQrCode className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 max-w-sm w-full qr-animation">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Portal Profile QR Code</h3>
                  <p className="text-gray-400 text-sm mt-1">Scan untuk mengunjungi portal saya</p>
                </div>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* QR Code Container */}
              <div className="relative bg-white p-4 rounded-xl mb-6 flex items-center justify-center qr-pulse">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-sm">Membuat QR Code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="relative">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code Portal Muhammad Syaiful Mukmin"
                      className="w-64 h-64 mx-auto"
                    />
                    {/* Scan line effect */}
                    <div className="scan-line"></div>
                    
                    {/* Logo overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        SM
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MdQrCode className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600">Menginisialisasi QR Code...</p>
                  </div>
                )}
              </div>
              
              {/* URL Display */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-xs mb-2">Link Portal:</p>
                <p className="text-white text-sm font-mono break-all">https://syaiful-mukmin.netlify.app/portal</p>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadQRCode}
                  disabled={!qrCodeUrl}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    qrCodeUrl 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:opacity-90 active:scale-95' 
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <MdDownload className="w-5 h-5" />
                  {downloadSuccess ? 'Berhasil!' : 'Download'}
                </button>
                
                <button
                  onClick={copyQRCodeLink}
                  className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all"
                >
                  <MdContentCopy className="w-5 h-5" />
                  Salin Link
                </button>
              </div>
              
              {/* Usage Instructions */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-xs text-center">
                  Gunakan QR Code ini untuk membagikan portal saya ke orang lain. 
                  QR Code akan mengarahkan ke: <span className="text-emerald-400">syaiful-mukmin.netlify.app/portal</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MobileLayout.displayName = 'MobileLayout';

export default MobileLayout;