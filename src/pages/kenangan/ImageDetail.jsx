import { useParams, Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { useGalleryData } from "./hooks/useGalleryData";
import MediaNotFound from "./components/MediaNotFound";
import GalleryShareBar from "./gallery/GalleryShareBar";
import GalleryRecommendations from "./gallery/GalleryRecommendations";
import { sanitizeUrl, generateAltText } from "./utils/sanitizers";

export default function ImageDetail() {
  const { id } = useParams();
  const { allMedia, loading } = useGalleryData();

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-xl bg-[#0f1724] border border-white/10 p-8 rounded-2xl text-gray-300 animate-pulse text-center">
        Memuat detail foto...
      </div>
    </main>
  );

  const item = allMedia.find(i => String(i.id) === String(id) && i.type === "image");

  if (!item) return <MediaNotFound type="image" id={id} />;

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-10 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Back */}
        <div className="mb-6">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            ← Kembali ke Galeri
          </Link>
        </div>

        <div className="bg-[#0f1724] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Image Preview */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-black/40 rounded-xl p-2 border border-white/5">
              <img 
                src={sanitizeUrl(item.src)} 
                alt={generateAltText(item)} 
                className="w-full h-auto max-h-[60vh] lg:max-h-[70vh] rounded-lg object-contain shadow-lg" 
                loading="lazy" 
              />
            </div>

            {/* Content & Creator */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div>
                {/* Creator Header */}
                {item.creator && (
                  <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10 flex-wrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={sanitizeUrl(item.creator.avatar, "/default-avatar.jpg")}
                        alt={item.creator.display_name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400/40"
                      />
                      <div>
                        <div className="flex items-center gap-1 font-semibold text-white text-sm">
                          <span>{item.creator.display_name}</span>
                          {item.creator.verified && (
                            <UserCheck size={15} className="text-cyan-400" title="Verified Creator" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">@{item.creator.username}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs rounded-full uppercase tracking-wider font-semibold">
                      {item.category || "Foto"}
                    </span>
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{item.title}</h1>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">{item.desc}</p>
                
                {/* Tags */}
                {item.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-6">
                    {item.tags.map((t, i) => (
                      <span key={i} className="text-xs bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-2.5 py-1 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Bar */}
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl mb-6">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Bagikan & Unduh</h4>
                  <GalleryShareBar media={item} />
                </div>
              </div>

              {/* Comments Preview */}
              <div className="border-t border-white/10 pt-4 mt-auto">
                <h3 className="font-semibold text-sm sm:text-base text-white mb-3">
                  Komentar ({item.engagement?.comments || 0})
                </h3>
                <div className="flex flex-col gap-3">
                  {item.comments_preview && item.comments_preview.length > 0 ? (
                    item.comments_preview.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <img 
                          src={sanitizeUrl(c.avatar, '/default-avatar.jpg')} 
                          alt={`${c.user} avatar`}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover" 
                          loading="lazy" 
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-cyan-300">{c.user}</div>
                          <div className="text-xs sm:text-sm text-gray-300 mt-0.5">{c.comment}</div>
                          <div className="text-[11px] text-gray-500 mt-1">{new Date(c.posted_at).toLocaleString()}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-xs italic">Belum ada komentar.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <GalleryRecommendations allMedia={allMedia} currentMedia={item} />
      </div>
    </main>
  );
}
