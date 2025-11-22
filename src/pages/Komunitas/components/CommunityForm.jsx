import { motion } from "framer-motion";
import { X } from 'lucide-react';

const CommunityForm = ({ showForm, editingId, formData, onInputChange, onSubmit, onClose }) => {
  if (!showForm) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#1e293b] border border-cyan-500/30 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingId ? 'Edit Komunitas' : 'Tambah Komunitas Baru'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Komunitas *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                  className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kategori *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  required
                  className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows="3"
                className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jumlah Anggota
                </label>
                <input
                  type="number"
                  name="members"
                  value={formData.members}
                  onChange={onInputChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h3 className="font-semibold text-white mb-4">Informasi Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="contact_website"
                    value={formData.contact_website}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <h3 className="font-semibold text-white mb-4">Media Sosial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="social_media_facebook"
                    value={formData.social_media_facebook}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="social_media_twitter"
                    value={formData.social_media_twitter}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="social_media_instagram"
                    value={formData.social_media_instagram}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="social_media_linkedin"
                    value={formData.social_media_linkedin}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={onInputChange}
                  className="rounded border-gray-600 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Komunitas Aktif</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-600">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                Batal
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                {editingId ? 'Update' : 'Simpan'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommunityForm;