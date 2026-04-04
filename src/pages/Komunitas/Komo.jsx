import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from "framer-motion";
import { 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Import komponen modular
import CommunityStatistics from './components/CommunityStatistics';
import CommunityFilters from './components/CommunityFilters';
import CommunityGrid from './components/CommunityGrid';
import CommunityModal from './components/CommunityModal';
import CommunityForm from './components/CommunityForm';
import { useCommunity } from '../../context/CommunityContext';
import communityApi from './lib/communityApi';
import { uploadMedia } from '../../utils/storageHelper';

const Komunitas = () => {
  const { setSelectedCommunity: setSelectedCommunityGlobal } = useCommunity();
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    is_active: true,
    image_url: '',
    image_file: null
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch data komunitas dari Supabase
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const data = await communityApi.communities.list();
      setCommunities(data);
      setFilteredCommunities(data);
    } catch (err) {
      setError('Gagal memuat data komunitas');
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics dari Supabase
  const fetchStatistics = async () => {
    try {
      const stats = await communityApi.communities.getStats();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    fetchCommunities();
    fetchStatistics();
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
      is_active: community.is_active !== false,
      image_url: community.image_url || '',
      image_file: null
    });
    setEditingId(community.id);
    setShowForm(true);
    if (setSelectedCommunityGlobal) setSelectedCommunityGlobal(community);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus komunitas ini?')) {
      try {
        await communityApi.communities.delete(id);
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
      let currentImageUrl = formData.image_url;

      // Handle image upload if a new file is selected
      if (formData.image_file) {
        try {
          currentImageUrl = await uploadMedia(formData.image_file, 'media', 'communities');
        } catch (err) {
          console.error('Failed to upload image:', err);
          // Continue without updating image if upload fails
        }
      }

      // Destructure image_file out of formData for database submission
      const { image_file, ...submissionData } = formData;
      
      const communityData = {
        ...submissionData,
        image_url: currentImageUrl,
        members: parseInt(formData.members) || 0,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        await communityApi.communities.update(editingId, communityData);
      } else {
        await communityApi.communities.create(communityData);
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
        is_active: true,
        image_url: '',
        image_file: null
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
            is_active: true,
            image_url: '',
            image_file: null
          });
          setShowForm(true);
        }}
      />

      {/* Communities Grid */}
      <CommunityGrid
        communities={currentItems}
        error={error}
        onRetry={() => { fetchCommunities(); fetchStatistics(); }}
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