import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js'

// Import komponen modular
import CommunityStatistics from './components/CommunityStatistics';
import CommunityFilters from './components/CommunityFilters';
import CommunityGrid from './components/CommunityGrid';
import CommunityModal from './components/CommunityModal';
import CommunityForm from './components/CommunityForm';

// Inisialisasi Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY 
const supabase = createClient(supabaseUrl, supabaseKey)

const Komunitas = () => {
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
    is_active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch data komunitas dari Supabase
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data.map(community => ({
        ...community,
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
      setError('Gagal memuat data komunitas');
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics dari Supabase
  const fetchStatistics = async () => {
    try {
      const { count: totalCommunities, error: countError } = await supabase
        .from('communities')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const { count: activeCommunities, error: activeError } = await supabase
        .from('communities')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (activeError) throw activeError;

      const { data: membersData, error: membersError } = await supabase
        .from('communities')
        .select('members');

      if (membersError) throw membersError;

      const totalMembers = membersData?.reduce((sum, community) => sum + (community.members || 0), 0) || 0;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('communities')
        .select('category');

      if (categoriesError) throw categoriesError;

      const uniqueCategories = [...new Set(categoriesData?.map(c => c.category).filter(Boolean))];

      setStatistics({
        totalCommunities: totalCommunities || 0,
        activeCommunities: activeCommunities || 0,
        totalMembers,
        categories: uniqueCategories
      });
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
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus komunitas ini?')) {
      try {
        const { error } = await supabase
          .from('communities')
          .delete()
          .eq('id', id);

        if (error) throw error;

        fetchCommunities();
        fetchStatistics();
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
        const { error } = await supabase
          .from('communities')
          .update(communityData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('communities')
          .insert([{
            ...communityData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col px-6 sm:px-10 md:px-20 relative overflow-hidden">
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
            is_active: true
          });
          setShowForm(true);
        }}
      />

      {/* Communities Grid */}
      <CommunityGrid
        communities={currentItems}
        error={error}
        onRetry={fetchCommunities}
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