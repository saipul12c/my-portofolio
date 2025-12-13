import { useState, useEffect, useRef } from 'react';
import './discond-theme.css';
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from 'react-router-dom';
// ✅ PERBAIKAN: Import langsung dari contexts, bukan dari hooks
import { useAuth } from './contexts/AuthContext';
import { useChat } from './contexts/ChatContext';
import api from './lib/api';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '../../context/CommunityContext';
import ServerSidebar from './components/layout/ServerSidebar';
import ChannelSidebar from './components/layout/ChannelSidebar';
import ChatArea from './components/layout/ChatArea';
import MemberSidebar from './components/layout/MemberSidebar';
import AuthModal from './components/auth/AuthModal';
import UserProfile from './components/auth/UserProfile';
import DMModal from './components/layout/DMModal';
import Help from './Help';
import ChannelHelp from './ChannelHelp';
import Version from './Version';
import ChannelSettingsPanel from './components/layout/ChannelSettingsPanel';
import PinnedMessages from './components/layout/PinnedMessages';
import MembersList from './components/layout/MembersList';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Komoniti = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: chatLoading } = useChat();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDMModal, setShowDMModal] = useState(false);
  const [dmIdState, setDmIdState] = useState(null);
  const [showSelectedBanner, setShowSelectedBanner] = useState(false);
  const bannerRef = useRef(null);
  const autoHideMs = 5000; // auto-hide after 5s
  const { selectedCommunity } = useCommunity();
  const { setSelectedServer, createServer, servers, channels, members } = useChat();
  const navigate = useNavigate();
  const [profileMember, setProfileMember] = useState(null);
  const location = useLocation();
  const [showMobileServers, setShowMobileServers] = useState(false);
  const [showMobileChannels, setShowMobileChannels] = useState(false);
  const [showMobileMembers, setShowMobileMembers] = useState(false);

  useEffect(() => {
    if (selectedCommunity) {
      // If a community was selected from Komunitas page, create a lightweight server object
      // and set it as selectedServer so the chat UI can show context.
      const serverLike = {
        id: `community-${selectedCommunity.id}`,
        name: selectedCommunity.name,
        icon: selectedCommunity.tags?.[0] || '🌐',
        is_public: true,
        created_at: selectedCommunity.created_at || new Date().toISOString()
      };
      try {
        setSelectedServer(serverLike);
      } catch {
        void 0; // ignore if chat context not ready
      }
    }
  }, [selectedCommunity, setSelectedServer]);

  useEffect(() => {
    if (selectedCommunity) {
      try {
        const key = `community-banner-dismissed:${selectedCommunity.id}`;
        const dismissed = sessionStorage.getItem(key);
        if (!dismissed) setShowSelectedBanner(true);
        else setShowSelectedBanner(false);
      } catch {
        setShowSelectedBanner(true);
      }
    } else setShowSelectedBanner(false);
  }, [selectedCommunity]);

  useEffect(() => {
    if (!showSelectedBanner) return;

    // outside click handler
    const onDocClick = (e) => {
      if (bannerRef.current && !bannerRef.current.contains(e.target)) {
        try {
          if (selectedCommunity) sessionStorage.setItem(`community-banner-dismissed:${selectedCommunity.id}`, '1');
        } catch { void 0; }
        setShowSelectedBanner(false);
      }
    };

    // auto-hide timer
    const timer = setTimeout(() => {
      try {
        if (selectedCommunity) sessionStorage.setItem(`community-banner-dismissed:${selectedCommunity.id}`, '1');
      } catch { void 0; }
      setShowSelectedBanner(false);
    }, autoHideMs);

    document.addEventListener('mousedown', onDocClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', onDocClick);
    };
  }, [showSelectedBanner, selectedCommunity]);

  // Sync route -> context: read URL parts and set selected server/channel accordingly
  useEffect(() => {
    try {
      // Expected paths: /discord/servers/:serverId or /discord/servers/:serverId/channels/:channelId or /discord/profile/:userId
      const parts = location.pathname.replace(/(^\/+|\/+$)/g, '').split('/');
      const idx = parts.indexOf('servers');
      if (idx !== -1) {
        const serverId = parts[idx + 1];
        if (serverId) {
          const found = servers?.find(s => String(s.id) === String(serverId)) || null;
          // support community-<id> synthetic server ids
          setSelectedServer(found || (serverId.startsWith('community-') ? { id: serverId, name: serverId, icon: '🌐', is_public: true } : null));
        }

        const chIdx = parts.indexOf('channels');
        if (chIdx !== -1) {
          const channelId = parts[chIdx + 1];
          if (channelId) {
            const foundCh = channels?.find(c => String(c.id) === String(channelId)) || null;
            if (foundCh) {
              try { setSelectedServer(foundCh.server_id ? servers.find(s=>s.id===foundCh.server_id) : null); } catch { void 0; }
            }
          }
        }
      }
    } catch {
      void 0; // ignore routing sync errors
    }
  }, [location.pathname, servers, channels, setSelectedServer]);

  // Open DM modal when route contains /dm/:dmId
  useEffect(() => {
    try {
      const parts = location.pathname.replace(/(^\/+|\/+$)/g, '').split('/');
      const idx = parts.indexOf('dm');
      if (idx !== -1) {
        const id = parts[idx + 1];
        if (id) {
          setDmIdState(id);
          setShowDMModal(true);
          return;
        }
      }
    } catch { void 0; }
  }, [location.pathname]);

  // Open profile modal when route contains /profile/:userId
  useEffect(() => {
    try {
      const parts = location.pathname.replace(/(^\/+|\/+$)/g, '').split('/');
      const idx = parts.indexOf('profile');
      if (idx !== -1) {
        const userId = parts[idx + 1];
        if (userId) {
          // try find in loaded members first
          const found = (members || []).find(m => String(m.id) === String(userId));
          if (found) {
            setProfileMember(found);
            setShowProfileModal(true);
            return;
          }

          // fallback: fetch user by id
          (async () => {
            try {
              const u = await api.users.get(userId).catch(() => null);
              if (u) setProfileMember(u);
            } catch (e) { /* ignore */ }
            setShowProfileModal(true);
          })();
          return;
        }
      }

      // if route doesn't include profile, ensure modal closed
      // but don't override explicit UI open (e.g. when clicking profile button)
      // only close if we previously opened via route
      if (!location.pathname.includes('/profile/')) {
        // keep existing showProfileModal if user opened it via UI; do nothing
      }
    } catch { void 0; }
  }, [location.pathname, members]);

  if (authLoading || chatLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-900)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-900)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--color-gray-800)] rounded-lg p-8 max-w-md w-full text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Komuniti</h1>
          <p className="text-gray-400 mb-6">
            Platform komunitas Indonesia untuk berbagi dan berkolaborasi
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded transition-colors font-medium"
          >
            Mulai Sekarang
          </button>
        </motion.div>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    );
  }

  const MainLayout = () => (
    <div className="discond-root h-screen bg-[var(--color-gray-900)] flex text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Server Sidebar (desktop) */}
      <div className="hidden md:flex">
        <ServerSidebar onProfileClick={() => setShowProfileModal(true)} onAuthRequest={() => setShowAuthModal(true)} />
      </div>

      {/* Channel Sidebar (desktop) */}
      <div className="hidden md:flex">
        <ChannelSidebar />
      </div>

      {/* Selected community banner (sync from Komunitas page) */}
      <AnimatePresence>
        {selectedCommunity && showSelectedBanner && (
          <motion.div
            key={selectedCommunity.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div
              ref={bannerRef}
              onClick={() => {
                try {
                  if (selectedCommunity) sessionStorage.setItem(`community-banner-dismissed:${selectedCommunity.id}`, '1');
                } catch { void 0; }
                setShowSelectedBanner(false);
              }}
              className="bg-[#111216]/80 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-4 backdrop-blur cursor-pointer"
            >
              <div>
                <div className="text-sm text-gray-300">Komunitas dipilih</div>
                <div className="text-white font-semibold">{selectedCommunity.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      if (createServer) {
                        const res = await createServer(selectedCommunity.name);
                        if (res?.error) console.error('Gagal membuka community di chat:', res.error);
                      }
                    } catch (err) {
                      console.error('Error opening community as server:', err);
                    }
                    try {
                      if (selectedCommunity) sessionStorage.setItem(`community-banner-dismissed:${selectedCommunity.id}`, '1');
                    } catch { void 0; }
                    setShowSelectedBanner(false);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
                >
                  Buka di Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <ChatArea
        onOpenServers={() => setShowMobileServers(true)}
        onOpenChannels={() => setShowMobileChannels(true)}
        onOpenMembers={() => setShowMobileMembers(true)}
      />

      {/* Members Sidebar */}
      <div className="hidden md:flex">
        <MemberSidebar />
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfile
          onClose={() => {
            setShowProfileModal(false);
            setProfileMember(null);
            try {
              if (location.pathname.includes('/profile/')) navigate('/discord', { replace: true });
            } catch { /* ignore */ }
          }}
          member={profileMember}
        />
      )}

      {showDMModal && dmIdState && (
        <DMModal dmId={dmIdState} onClose={() => { setShowDMModal(false); setDmIdState(null); try { if (location.pathname.includes('/dm/')) navigate('/discord', { replace: true }); } catch {} }} />
      )}
    </div>
  );

  // Mobile overlays
  const MobileOverlays = () => (
    <>
      {/* backdrop */}
      {(showMobileServers || showMobileChannels || showMobileMembers) && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => { setShowMobileServers(false); setShowMobileChannels(false); setShowMobileMembers(false); }} />
      )}

      {/* Server sidebar (mobile) */}
      {showMobileServers && (
        <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
          <ServerSidebar onProfileClick={() => { setShowProfileModal(true); setShowMobileServers(false); }} mobileClose={() => setShowMobileServers(false)} onAuthRequest={() => { setShowAuthModal(true); setShowMobileServers(false); }} />
        </div>
      )}

      {/* Channel sidebar (mobile) */}
      {showMobileChannels && (
        <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
          <ChannelSidebar mobileClose={() => setShowMobileChannels(false)} />
        </div>
      )}

      {/* Member sidebar (mobile) */}
      {showMobileMembers && (
        <div className="fixed right-0 top-0 bottom-0 z-50 md:hidden">
          <MemberSidebar mobileClose={() => setShowMobileMembers(false)} />
        </div>
      )}
    </>
  );

  // Route-aware rendering: allow deep links to servers/channels and profile
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="servers/:serverId" element={<MainLayout />} />
        <Route path="servers/:serverId/channels/:channelId" element={<MainLayout />} />
        <Route path="profile/:userId" element={<MainLayout />} />
        <Route path="help" element={<ChannelHelp />} />
        <Route path="help/channel" element={<Help />} />
        <Route path="channel-help" element={<ChannelHelp />} />
        <Route path="channel-help/:channelId" element={<ChannelHelp />} />
        <Route path="version" element={<Version />} />
        {/* fallback to main layout for any other nested paths */}
        <Route path="*" element={<MainLayout />} />
      </Routes>
      <MobileOverlays />
    </>
  );
};

export default Komoniti;