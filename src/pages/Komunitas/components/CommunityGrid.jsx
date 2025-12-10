import { motion } from "framer-motion";
import { Users, MapPin, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

const CommunityGrid = ({
  communities,
  error,
  onRetry,
  onAddCommunity,
  onViewDetails,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (error) {
    return (
      <motion.section
        className="max-w-6xl mx-auto w-full py-8"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-2xl p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </motion.button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="max-w-6xl mx-auto w-full py-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {communities.map(community => (
          <motion.div
            key={community.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-500/50 backdrop-blur-xl rounded-2xl overflow-hidden transition-all group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                  {community.name}
                </h3>
                {community.is_active === false && (
                  <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30">
                    Non-Aktif
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {community.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{(community.members || 0).toLocaleString()} anggota</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{community.location || 'Lokasi tidak tersedia'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{
                    (() => {
                      const d = community.created_at ? new Date(community.created_at) : null;
                      return d && !isNaN(d.getTime()) ? d.toLocaleDateString('id-ID') : 'Tanggal tidak tersedia';
                    })()
                  }</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {community.category ? (
                  <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-500/30">
                    {community.category}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs px-2 py-1">Kategori tidak tersedia</span>
                )}
                {community.tags && community.tags.length > 0 && community.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
                {community.tags && community.tags.length > 2 && (
                  <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded border border-white/20">
                    +{community.tags.length - 2}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewDetails(community)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Detail</span>
                </motion.button>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(community)}
                    className="text-green-400 hover:text-green-300 p-1 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(community.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {communities.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Tidak ada komunitas ditemukan
          </h3>
          <p className="text-gray-400 mb-4">
            Coba ubah filter pencarian atau tambahkan komunitas baru
          </p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddCommunity && onAddCommunity()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg"
            >
              Tambah Komunitas
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center items-center space-x-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Previous
          </motion.button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 border rounded-xl transition-colors ${
                currentPage === page
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-500/50'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {page}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default CommunityGrid;