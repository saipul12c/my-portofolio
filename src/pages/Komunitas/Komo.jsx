import { useState, useEffect } from 'react';
import { checkHealth } from '../../lib/backend';
import { motion } from "framer-motion";
import { 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
// Supabase removed: use backend `/api/*` endpoints instead

// Import komponen modular
import CommunityStatistics from './components/CommunityStatistics';
import CommunityFilters from './components/CommunityFilters';
import CommunityGrid from './components/CommunityGrid';
import CommunityModal from './components/CommunityModal';
import CommunityForm from './components/CommunityForm';
import { useCommunity } from '../../context/CommunityContext';

// Frontend always uses the backend JSON server endpoints under `/api/*`.

const Komunitas = () => {
  const { setSelectedCommunity: setSelectedCommunityGlobal } = useCommunity();
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverDown, setServerDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    members: 0,
    location: '',
    contact_email: '',
    contact_phone: '',
    contact_website: '',
    social_media_facebook: '',
    social_media_twitter: '',
    social_media_instagram: '',
    social_media_linkedin: '',
    tags: [],
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch data komunitas dari backend JSON server
  const fetchCommunities = async () => {
    try {
      setLoading(true);

      // Fetch always from local JSON backend
      const res = await fetch('/api/communities');
      if (!res.ok) {
        // treat 5xx as server problems
        if (res.status >= 500) {
          setServerDown(true);
          setError('Server sedang dalam perbaikan. Mohon coba lagi nanti.');
        }
        throw new Error('Failed to fetch from backend');
      }
      const data = await res.json();
      const transformedData = (data || []).map(community => ({
        ...community,
        // ensure consistent / safe defaults so UI doesn't show `undefined`
        members: typeof community.members === 'number' ? community.members : (Number(community.members) || 0),
        category: community.category || '',
        location: community.location || '',
        tags: Array.isArray(community.tags) ? community.tags : (typeof community.tags === 'string' && community.tags ? community.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        is_active: community.is_active !== false,
        contact: {
          email: community.contact_email || '',
          phone: community.contact_phone || '',
          website: community.contact_website || ''
        },
        social_media: {
          facebook: community.social_media_facebook || '',
          twitter: community.social_media_twitter || '',
          instagram: community.social_media_instagram || '',
          linkedin: community.social_media_linkedin || ''
        }
      }));
      setCommunities(transformedData);
      setFilteredCommunities(transformedData);
    } catch (err) {
      // network errors (e.g. server not reachable) typically surface as TypeError
      const isNetworkError = err instanceof TypeError || (err && /failed to fetch/i.test(err.message || ''));
      if (isNetworkError) {
        setServerDown(true);
        setError('Server sedang dalam perbaikan. Mohon coba lagi nanti.');
      } else {
        setError('Gagal memuat data komunitas');
      }
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics dari backend JSON server
  const fetchStatistics = async () => {
    try {
      // Statistics derived from the same `/api/communities` endpoint
      const res = await fetch('/api/communities');
      if (!res.ok) {
        if (res.status >= 500) setServerDown(true);
        throw new Error('Failed to fetch communities for statistics');
      }
      const data = await res.json();
      const totalCommunities = data.length;
      const activeCommunities = data.filter(c => c.is_active !== false).length;
      const totalMembers = data.reduce((sum, c) => sum + (c.members || 0), 0);
      const uniqueCategories = [...new Set(data.map(c => c.category).filter(Boolean))];
      setStatistics({ totalCommunities, activeCommunities, totalMembers, categories: uniqueCategories });
    } catch (err) {
      const isNetworkError = err instanceof TypeError || (err && /failed to fetch/i.test(err.message || ''));
      if (isNetworkError) setServerDown(true);
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      // quick health-check before attempting the heavier fetches
      const healthy = await checkHealth();
      if (!mounted) return;
      if (!healthy) {
        setServerDown(true);
        setError('Server sedang dalam perbaikan. Mohon coba lagi nanti.');
        setLoading(false);
        return;
      }
      await fetchCommunities();
      await fetchStatistics();
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Filter dan search
  useEffect(() => {
    let filtered = communities;

    if (searchTerm) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(community => 
        community.category === selectedCategory
      );
    }

    if (showActiveOnly) {
      filtered = filtered.filter(community => community.is_active !== false);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'members') {
        return sortOrder === 'asc' 
          ? (a.members || 0) - (b.members || 0)
          : (b.members || 0) - (a.members || 0);
      }
      if (sortBy === 'created_at') {
        return sortOrder === 'asc'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

    setFilteredCommunities(filtered);
    setCurrentPage(1);
  }, [communities, searchTerm, selectedCategory, showActiveOnly, sortBy, sortOrder]);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleViewDetails = (community) => {
    setSelectedCommunity(community);
    // also persist in global context so other pages see this selection
    if (setSelectedCommunityGlobal) setSelectedCommunityGlobal(community);
    setShowModal(true);
  };

  const handleEdit = (community) => {
    setFormData({
      name: community.name,
      description: community.description,
      category: community.category,
      members: community.members || 0,
      location: community.location || '',
      contact_email: community.contact?.email || '',
      contact_phone: community.contact?.phone || '',
      contact_website: community.contact?.website || '',
      social_media_facebook: community.social_media?.facebook || '',
      social_media_twitter: community.social_media?.twitter || '',
      social_media_instagram: community.social_media?.instagram || '',
      social_media_linkedin: community.social_media?.linkedin || '',
      tags: community.tags || [],
      is_active: community.is_active !== false
    });
    setEditingId(community.id);
    setShowForm(true);
    if (setSelectedCommunityGlobal) setSelectedCommunityGlobal(community);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus komunitas ini?')) {
      try {
        const res = await fetch(`/api/communities/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete via backend');

        await fetchCommunities();
        await fetchStatistics();
      } catch (err) {
        alert('Error menghapus komunitas');
        console.error('Error deleting community:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const communityData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        members: formData.members,
        location: formData.location,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        contact_website: formData.contact_website,
        social_media_facebook: formData.social_media_facebook,
        social_media_twitter: formData.social_media_twitter,
        social_media_instagram: formData.social_media_instagram,
        social_media_linkedin: formData.social_media_linkedin,
        tags: formData.tags,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

        if (editingId) {
          const res = await fetch(`/api/communities/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(communityData)
          });
          if (!res.ok) throw new Error('Failed to update via backend');
        } else {
          const payload = { ...communityData, created_at: new Date().toISOString() };
          const res = await fetch('/api/communities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('Failed to insert via backend');
        }

      fetchCommunities();
      fetchStatistics();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        members: 0,
        location: '',
        contact_email: '',
        contact_phone: '',
        contact_website: '',
        social_media_facebook: '',
        social_media_twitter: '',
        social_media_instagram: '',
        social_media_linkedin: '',
        tags: [],
        is_active: true
      });
    } catch (err) {
      alert('Error menyimpan komunitas');
      console.error('Error saving community:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value);
    setFormData(prev => ({
      ...prev,
      [name]: newVal
    }));
  };

  // Retry flow: re-check health then fetch
  const handleRetry = async () => {
    setError('');
    setServerDown(false);
    setLoading(true);
    const healthy = await checkHealth();
    if (!healthy) {
      setServerDown(true);
      setError('Server sedang dalam perbaikan. Mohon coba lagi nanti.');
      setLoading(false);
      return;
    }
    await fetchCommunities();
    await fetchStatistics();
    setLoading(false);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCommunities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);
  const categories = [...new Set(communities.map(c => c.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-900)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col px-6 sm:px-10 md:px-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Header Section */}
      <motion.section
        className="text-center max-w-4xl mx-auto space-y-8 py-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center gap-2 items-center mb-4">
            <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
            Komunitas Indonesia
          </h1>
          <p className="text-cyan-300 text-sm sm:text-base font-semibold">
            Temukan dan jelajahi berbagai komunitas menarik di seluruh Indonesia
          </p>
        </motion.div>

        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
          Bergabunglah dengan <span className="text-cyan-400 font-semibold">komunitas-komunitas inspiratif</span> yang 
          membawa <span className="text-purple-400 font-semibold">perubahan positif</span> di berbagai bidang. 
          Mari berkolaborasi dan tumbuh bersama! 🌟
        </p>
      </motion.section>

      {/* Statistics Section */}
      <CommunityStatistics statistics={statistics} />

      {/* Server down banner */}
      {serverDown && (
        <div className="max-w-6xl mx-auto w-full py-4">
          <div className="bg-yellow-600/10 border border-yellow-600/20 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between">
            <div className="text-sm text-yellow-300">Server sedang dalam perbaikan. Beberapa fitur mungkin tidak tersedia.</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-yellow-500 text-black rounded-xl hover:brightness-95"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <CommunityFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        selectedCategory={selectedCategory}
        onCategoryFilter={handleCategoryFilter}
        showActiveOnly={showActiveOnly}
        onActiveOnlyChange={setShowActiveOnly}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        categories={categories}
        onAddCommunity={() => {
          setEditingId(null);
          setFormData({
            name: '',
            description: '',
            category: '',
            members: 0,
            location: '',
            contact_email: '',
            contact_phone: '',
            contact_website: '',
            social_media_facebook: '',
            social_media_twitter: '',
            social_media_instagram: '',
            social_media_linkedin: '',
            tags: [],
            is_active: true
          });
          setShowForm(true);
        }}
      />

      {/* Communities Grid */}
      <CommunityGrid
        communities={currentItems}
        error={error}
        onRetry={handleRetry}
        onAddCommunity={() => {
          setEditingId(null);
          setFormData({
            name: '',
            description: '',
            category: '',
            members: 0,
            location: '',
            contact_email: '',
            contact_phone: '',
            contact_website: '',
            social_media_facebook: '',
            social_media_twitter: '',
            social_media_instagram: '',
            social_media_linkedin: '',
            tags: [],
            is_active: true
          });
          setShowForm(true);
        }}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Community Detail Modal */}
      <CommunityModal
        showModal={showModal}
        selectedCommunity={selectedCommunity}
        onClose={() => setShowModal(false)}
      />

      {/* Community Form Modal */}
      <CommunityForm
        showForm={showForm}
        editingId={editingId}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={() => setShowForm(false)}
      />
    </main>
  );
};

export default Komunitas;