import { motion } from "framer-motion";
import { X, Users, MapPin, Calendar, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

const CommunityModal = ({ showModal, selectedCommunity, onClose }) => {
  if (!showModal || !selectedCommunity) return null;

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
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCommunity.name}
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

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-3">Deskripsi</h3>
              <p className="text-gray-300 leading-relaxed">{selectedCommunity.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-3">Informasi</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="h-4 w-4 mr-3 text-cyan-400" />
                    <span>{selectedCommunity.members?.toLocaleString()} anggota</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-cyan-400" />
                    <span>{selectedCommunity.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-cyan-400" />
                    <span>Bergabung {new Date(selectedCommunity.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">Kategori & Tags</h3>
                <div className="space-y-3">
                  <span className="bg-cyan-500/20 text-cyan-300 text-sm px-3 py-2 rounded-xl border border-cyan-500/30">
                    {selectedCommunity.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommunity.tags?.map(tag => (
                      <span
                        key={tag}
                        className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {(selectedCommunity.contact?.email || selectedCommunity.contact?.phone || selectedCommunity.contact?.website) && (
              <div>
                <h3 className="font-semibold text-white mb-3">Kontak</h3>
                <div className="space-y-3">
                  {selectedCommunity.contact?.email && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Mail className="h-4 w-4 mr-3 text-cyan-400" />
                      <a 
                        href={`mailto:${selectedCommunity.contact.email}`} 
                        className="hover:text-cyan-300 transition-colors"
                      >
                        {selectedCommunity.contact.email}
                      </a>
                    </div>
                  )}
                  {selectedCommunity.contact?.phone && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Phone className="h-4 w-4 mr-3 text-cyan-400" />
                      <a 
                        href={`tel:${selectedCommunity.contact.phone}`} 
                        className="hover:text-cyan-300 transition-colors"
                      >
                        {selectedCommunity.contact.phone}
                      </a>
                    </div>
                  )}
                  {selectedCommunity.contact?.website && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Globe className="h-4 w-4 mr-3 text-cyan-400" />
                      <a 
                        href={selectedCommunity.contact.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-cyan-300 transition-colors flex items-center"
                      >
                        {selectedCommunity.contact.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedCommunity.social_media && (
              <div>
                <h3 className="font-semibold text-white mb-3">Media Sosial</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedCommunity.social_media.facebook && (
                    <a
                      href={selectedCommunity.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-2 transition-colors"
                    >
                      <span>Facebook</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {selectedCommunity.social_media.twitter && (
                    <a
                      href={selectedCommunity.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-2 transition-colors"
                    >
                      <span>Twitter</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {selectedCommunity.social_media.instagram && (
                    <a
                      href={selectedCommunity.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 text-sm flex items-center space-x-2 transition-colors"
                    >
                      <span>Instagram</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {selectedCommunity.social_media.linkedin && (
                    <a
                      href={selectedCommunity.social_media.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 text-sm flex items-center space-x-2 transition-colors"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommunityModal;