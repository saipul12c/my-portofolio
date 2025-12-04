import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
// ✅ PERBAIKAN: Import langsung dari contexts, bukan dari hooks
import { useAuth } from './contexts/AuthContext';
import { useChat } from './contexts/ChatContext';
import { useCommunity } from '../../context/CommunityContext';
import ServerSidebar from './components/layout/ServerSidebar';
import ChannelSidebar from './components/layout/ChannelSidebar';
import ChatArea from './components/layout/ChatArea';
import MemberSidebar from './components/layout/MemberSidebar';
import AuthModal from './components/auth/AuthModal';
import UserProfile from './components/auth/UserProfile';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Komoniti = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: chatLoading } = useChat();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { selectedCommunity } = useCommunity();
  const { setSelectedServer, createServer } = useChat();

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
      } catch (e) {
        // ignore if chat context not ready
      }
    }
  }, [selectedCommunity, setSelectedServer]);

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

  return (
    <div className="h-screen bg-[var(--color-gray-900)] flex text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Server Sidebar */}
      <ServerSidebar onProfileClick={() => setShowProfileModal(true)} />

      {/* Channel Sidebar */}
      <ChannelSidebar />

      {/* Selected community banner (sync from Komunitas page) */}
      {selectedCommunity && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-[#111216]/80 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-4 backdrop-blur">
            <div>
              <div className="text-sm text-gray-300">Komunitas dipilih</div>
              <div className="text-white font-semibold">{selectedCommunity.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    if (createServer) {
                      await createServer(selectedCommunity.name);
                    }
                  } catch (e) {
                    console.error('Error opening community as server:', e);
                  }
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
              >
                Buka di Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <ChatArea />

      {/* Members Sidebar */}
      <MemberSidebar />

      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfile onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default Komoniti;