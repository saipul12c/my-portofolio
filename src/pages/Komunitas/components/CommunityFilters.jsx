import { motion } from "framer-motion";
import { Search, Filter, Plus } from 'lucide-react';

const CommunityFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryFilter,
  showActiveOnly,
  onActiveOnlyChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  categories,
  onAddCommunity
}) => {
  return (
    <motion.section
      className="max-w-6xl mx-auto w-full py-8"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="bg-white/5 border border-white/20 backdrop-blur-xl rounded-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari komunitas..."
                value={searchTerm}
                onChange={onSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryFilter(e.target.value)}
                className="bg-white/5 border border-gray-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Active Only Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => onActiveOnlyChange(e.target.checked)}
                className="rounded border-gray-600 bg-white/5 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-300">Aktif Saja</span>
            </label>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-white/5 border border-gray-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
            >
              <option value="name">Sortir Nama</option>
              <option value="members">Sortir Anggota</option>
              <option value="created_at">Sortir Tanggal</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value)}
              className="bg-white/5 border border-gray-600 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddCommunity}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/50"
            >
              <Plus className="h-5 w-5" />
              <span>Tambah Komunitas</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.slice(0, 6).map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryFilter(category)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/20'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CommunityFilters;