import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';

import DashboardSidebar from './components/DashboardSidebar';
import DashboardNavbar from './components/DashboardNavbar';
import OverviewTab from './components/tabs/OverviewTab';
import PostsTab from './components/tabs/PostsTab';
import CommentsTab from './components/tabs/CommentsTab';
import CategoriesTab from './components/tabs/CategoriesTab';
import DataManagerTab from './components/tabs/DataManagerTab';
import SettingsTab from './components/tabs/SettingsTab';
import AuthorsTab from './components/tabs/AuthorsTab';
import EditorialCalendarTab from './components/tabs/EditorialCalendarTab';
import MediaLibraryTab from './components/tabs/MediaLibraryTab';
import PostEditorModal from './components/tabs/PostEditorModal';

import { 
  getAdminPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  duplicatePost, 
  togglePostStatus, 
  togglePostFeatured, 
  getAllComments, 
  deleteAdminComment, 
  updateCommentStatus, 
  getAdminCategories, 
  saveAdminCategories, 
  getOverallBlogStats,
  bulkDeletePosts,
  bulkUpdatePostStatus,
  bulkUpdatePostCategory
} from './services/blogAdminService';
import { getAdminSession, logoutAdmin } from './services/blogAdminAuth';

export default function BlogAdminDashboard() {
  const navigate = useNavigate();

  // Navigation & session state
  const [activeTab, setActiveTab] = useState('overview');
  const [adminSession, setAdminSession] = useState(null);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

  // Data states
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter preset to pass from Overview to Posts tab
  const [postFilterPreset, setPostFilterPreset] = useState({ category: 'all', status: 'all', search: '' });

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Muat data awal secara komprehensif
  const loadAllData = useCallback(async () => {
    try {
      const [fetchedPosts, fetchedComments, fetchedCategories, fetchedStats] = await Promise.all([
        getAdminPosts(),
        getAllComments(),
        Promise.resolve(getAdminCategories()),
        getOverallBlogStats()
      ]);

      setPosts(fetchedPosts);
      setComments(fetchedComments);
      setCategories(fetchedCategories);
      setStats(fetchedStats);
      setLastUpdatedTime(new Date().toLocaleTimeString('id-ID'));
    } catch (err) {
      console.warn('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      navigate('/blog-admin/login', { replace: true });
      return;
    }
    setAdminSession(session);
    loadAllData();
  }, [navigate, loadAllData]);

  // Logout handler
  const handleLogout = () => {
    logoutAdmin();
    navigate('/blog-admin/login', { replace: true });
  };

  // Navigate helper with filter preset (from Overview drilldown)
  const handleNavigateToPosts = (preset = {}) => {
    setPostFilterPreset(prev => ({ ...prev, ...preset }));
    setActiveTab('posts');
  };

  // Post Actions
  const handleOpenCreateModal = (preset = null) => {
    setEditingPost(preset ? { ...preset } : null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleSavePost = async (postPayload, existingId) => {
    try {
      if (existingId) {
        await updatePost(existingId, postPayload);
        showToast('success', 'Artikel berhasil diperbarui!');
      } else {
        await createPost(postPayload);
        showToast('success', 'Artikel baru berhasil dibuat dan disimpan!');
      }
      await loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan artikel');
      throw err;
    }
  };

  const handleDeletePost = async (identifier) => {
    try {
      await deletePost(identifier);
      showToast('success', 'Artikel berhasil dihapus!');
      await loadAllData();
    } catch (err) {
      showToast('error', 'Gagal menghapus artikel: ' + err.message);
    }
  };

  const handleDuplicatePost = async (identifier) => {
    try {
      await duplicatePost(identifier);
      showToast('success', 'Artikel berhasil disalin sebagai draf baru!');
      await loadAllData();
    } catch (err) {
      showToast('error', 'Gagal menduplikasi artikel: ' + err.message);
    }
  };

  const handleToggleStatus = async (identifier) => {
    try {
      const updated = await togglePostStatus(identifier);
      if (updated) {
        showToast('success', `Status artikel diubah menjadi: ${updated.status === 'published' ? 'Terbit' : 'Draf'}`);
        await loadAllData();
      }
    } catch {
      showToast('error', 'Gagal mengubah status artikel');
    }
  };

  const handleToggleFeatured = async (identifier) => {
    try {
      const updated = await togglePostFeatured(identifier);
      if (updated) {
        showToast('success', updated.featured ? 'Artikel ditandai sebagai Unggulan!' : 'Tanda unggulan dihapus.');
        await loadAllData();
      }
    } catch {
      showToast('error', 'Gagal mengubah status unggulan');
    }
  };

  // Bulk / Batch Actions
  const handleBulkDelete = async (identifiers) => {
    try {
      const count = await bulkDeletePosts(identifiers);
      showToast('success', `${count} artikel berhasil dihapus massal!`);
      await loadAllData();
    } catch (err) {
      showToast('error', 'Gagal menghapus artikel: ' + err.message);
    }
  };

  const handleBulkStatusChange = async (identifiers, newStatus) => {
    try {
      const count = await bulkUpdatePostStatus(identifiers, newStatus);
      showToast('success', `Status ${count} artikel berhasil diubah ke: ${newStatus}!`);
      await loadAllData();
    } catch (err) {
      showToast('error', 'Gagal memperbarui status artikel: ' + err.message);
    }
  };

  const handleBulkCategoryChange = async (identifiers, newCategory) => {
    try {
      const count = await bulkUpdatePostCategory(identifiers, newCategory);
      showToast('success', `Kategori ${count} artikel berhasil diubah ke: ${newCategory}!`);
      await loadAllData();
    } catch (err) {
      showToast('error', 'Gagal memperbarui kategori artikel: ' + err.message);
    }
  };

  // Comment Actions
  const handleDeleteComment = async (commentId, postSlug) => {
    try {
      await deleteAdminComment(commentId, postSlug);
      showToast('success', 'Komentar berhasil dihapus.');
      await loadAllData();
    } catch {
      showToast('error', 'Gagal menghapus komentar.');
    }
  };

  const handleUpdateCommentStatus = async (commentId, postSlug, newStatus) => {
    try {
      await updateCommentStatus(commentId, postSlug, newStatus);
      showToast('success', `Komentar diubah menjadi: ${newStatus}`);
      await loadAllData();
    } catch {
      showToast('error', 'Gagal memperbarui status komentar.');
    }
  };

  // Categories Actions
  const handleSaveCategories = (newCategories) => {
    saveAdminCategories(newCategories);
    setCategories(newCategories);
    showToast('success', 'Daftar kategori berhasil diperbarui!');
    loadAllData();
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Ringkasan & Metrik Analitik';
      case 'posts': return 'Manajemen Konten & Artikel';
      case 'calendar': return 'Kalender Editorial & Penjadwalan Rilis';
      case 'media': return 'Galeri Media Terpadu & Unsplash';
      case 'comments': return 'Moderasi Komentar & Diskusi';
      case 'categories': return 'Kelola Kategori & Tagar';
      case 'authors': return 'Manajemen Profil Penulis';
      case 'data': return 'Manajemen Basis Data & Cadangan';
      case 'settings': return 'Pengaturan & Keamanan Akses';
      default: return 'Blog Control Hub';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 selection:text-cyan-200 flex">
      
      {/* 🧭 Sidebar Navigasi Independen */}
      <DashboardSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminSession={adminSession}
        stats={stats}
        onLogout={handleLogout}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        openCreateModal={handleOpenCreateModal}
      />

      {/* 🖥️ Area Konten Utama */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen bg-slate-950 overflow-x-hidden">
        
        {/* Navbar Atas */}
        <DashboardNavbar 
          activeTabTitle={getTabTitle()}
          setIsOpenMobile={setIsOpenMobile}
          openCreateModal={handleOpenCreateModal}
          onRefresh={loadAllData}
          posts={posts}
          onEditPost={handleOpenEditModal}
          lastUpdatedTime={lastUpdatedTime}
        />

        {/* Main Body per Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-gray-400">Sinkronisasi Data Blog Dashboard...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <OverviewTab 
                    stats={stats}
                    openCreateModal={handleOpenCreateModal}
                    onEditPost={handleOpenEditModal}
                    setActiveTab={setActiveTab}
                    onNavigateToPosts={handleNavigateToPosts}
                    posts={posts}
                  />
                )}

                {activeTab === 'posts' && (
                  <PostsTab 
                    posts={posts}
                    categories={categories}
                    onEditPost={handleOpenEditModal}
                    onDeletePost={handleDeletePost}
                    onDuplicatePost={handleDuplicatePost}
                    onToggleStatus={handleToggleStatus}
                    onToggleFeatured={handleToggleFeatured}
                    openCreateModal={handleOpenCreateModal}
                    onBulkDelete={handleBulkDelete}
                    onBulkStatusChange={handleBulkStatusChange}
                    onBulkCategoryChange={handleBulkCategoryChange}
                    filterPreset={postFilterPreset}
                  />
                )}

                {activeTab === 'calendar' && (
                  <EditorialCalendarTab 
                    posts={posts}
                    onEditPost={handleOpenEditModal}
                    openCreateModal={handleOpenCreateModal}
                  />
                )}

                {activeTab === 'media' && (
                  <MediaLibraryTab />
                )}

                {activeTab === 'comments' && (
                  <CommentsTab 
                    comments={comments}
                    onDeleteComment={handleDeleteComment}
                    onUpdateStatus={handleUpdateCommentStatus}
                  />
                )}

                {activeTab === 'categories' && (
                  <CategoriesTab 
                    categories={categories}
                    posts={posts}
                    onSaveCategories={handleSaveCategories}
                  />
                )}

                {activeTab === 'authors' && (
                  <AuthorsTab 
                    posts={posts}
                    setToast={showToast}
                  />
                )}

                {activeTab === 'data' && (
                  <DataManagerTab 
                    posts={posts}
                    stats={stats}
                    onDataChanged={loadAllData}
                    setToast={({ type, message }) => showToast(type, message)}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab 
                    onProfileUpdated={() => {
                      setAdminSession(getAdminSession());
                      loadAllData();
                    }}
                    setToast={({ type, message }) => showToast(type, message)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* ✍️ Modal Editor Artikel Komprehensif */}
      <PostEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSavePost}
        initialPost={editingPost}
        categories={categories}
      />

      {/* 🔔 Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/30 text-red-200'
                : 'bg-slate-900/90 border-cyan-500/30 text-cyan-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            )}
            <span className="text-xs font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}