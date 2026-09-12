import { useParams, Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { useGalleryData } from "./hooks/useGalleryData";
import MediaNotFound from "./components/MediaNotFound";
import GalleryShareBar from "./gallery/GalleryShareBar";
import GalleryRecommendations from "./gallery/GalleryRecommendations";
import { sanitizeUrl, generateAltText } from "./utils/sanitizers";

export default function AlbumDetail() {
  const { id } = useParams();
  const { allMedia, loading } = useGalleryData();

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-xl bg-[#0f1724] border border-white/10 p-8 rounded-2xl text-gray-300 animate-pulse text-center">
        Memuat detail album...
      </div>
    </main>
  );

  const item = allMedia.find(a => String(a.id) === String(id) && a.type === "album");

  if (!item) return <MediaNotFound type="album" id={id} />;

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-10 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Back */}
        <div className="mb-6">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            ← Kembali ke Galeri
          </Link>
        </div>

        <div className="bg-[#0f1724] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8">
          {/* Creator Profile */}
          {item.creator && (
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10 flex-wrap">
              <div className="flex items-center gap-3">
                <img
                  src={sanitizeUrl(item.creator.avatar, "/default-avatar.jpg")}
                  alt={item.creator.display_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/40"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <span>{item.creator.display_name}</span>
                    {item.creator.verified && (
                      <UserCheck size={16} className="text-cyan-400" title="Verified Creator" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">@{item.creator.username}</span>
                </div>
              </div>

              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs rounded-full uppercase tracking-wider font-semibold">
                Album • {Array.isArray(item.src) ? item.src.length : 1} Foto
              </span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">{item.title}</h1>
          <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">{item.desc}</p>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {item.tags.map((t, idx) => (
                <span key={idx} className="text-xs bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.isArray(item.src) ? item.src.map((s, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-xl border border-white/5 bg-black/40">
                <img 
                  src={sanitizeUrl(s)} 
                  alt={`${item.title} - Foto ${idx + 1} dari ${item.src.length}`}
                  className="w-full h-52 sm:h-60 lg:h-64 rounded-xl object-cover group-hover:scale-105 transition duration-300" 
                  loading="lazy" 
                />
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[11px] text-gray-300 backdrop-blur-sm">
                  {idx + 1} / {item.src.length}
                </div>
              </div>
            )) : (
              <img 
                src={sanitizeUrl(item.src)} 
                alt={generateAltText(item)}
                className="w-full h-64 rounded-xl object-cover" 
                loading="lazy" 
              />
            )}
          </div>

          {/* Actions & Share Bar */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-8">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bagikan & Unduh Album</h4>
            <GalleryShareBar media={item} currentIndex={0} />
          </div>

          {/* Comments Preview */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4 text-white">
              Komentar ({item.engagement?.comments || 0})
            </h3>
            <div className="flex flex-col gap-4">
              {item.comments_preview && item.comments_preview.length > 0 ? (
                item.comments_preview.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <img 
                      src={sanitizeUrl(c.avatar, '/default-avatar.jpg')} 
                      alt={`${c.user} avatar`}
                      className="w-9 h-9 rounded-full object-cover border border-white/10" 
                      loading="lazy" 
                    />
                    <div>
                      <div className="text-sm font-medium text-pink-300">{c.user}</div>
                      <div className="text-sm text-gray-300 mt-0.5">{c.comment}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(c.posted_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm italic">Belum ada komentar.</div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <GalleryRecommendations allMedia={allMedia} currentMedia={item} />
      </div>
    </main>
  );
}
