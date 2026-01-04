import { useParams, Link } from "react-router-dom";
import { useGalleryData } from "./hooks/useGalleryData";
import MediaNotFound from "./components/MediaNotFound";
import { sanitizeUrl, generateAltText } from "./utils/sanitizers";

export default function AlbumDetail() {
  const { id } = useParams();
  const { allMedia, loading } = useGalleryData();

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl bg-[#0b0b0b] p-8 rounded-2xl text-gray-300">Memuat...</div>
    </main>
  );

  const item = allMedia.find(a => String(a.id) === String(id) && a.type === "album");

  if (!item) return <MediaNotFound type="album" id={id} />;

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-5xl mx-auto bg-[#0f1724] rounded-2xl overflow-hidden shadow-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{item.title}</h1>
        <p className="text-gray-300 text-sm sm:text-base mb-4">{item.desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.isArray(item.src) ? item.src.map((s, idx) => (
            <img 
              key={idx} 
              src={sanitizeUrl(s)} 
              alt={`${item.title} - Foto ${idx + 1} dari ${item.src.length}`}
              className="w-full h-48 sm:h-56 lg:h-64 rounded-lg object-cover" 
              loading="lazy" 
            />
          )) : (
            <img 
              src={sanitizeUrl(item.src)} 
              alt={generateAltText(item)}
              className="w-full h-48 sm:h-56 lg:h-64 rounded-lg object-cover" 
              loading="lazy" 
            />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-sm sm:text-base mb-3">Komentar ({item.engagement?.comments || 0})</h3>
          <div className="flex flex-col gap-3">
            {item.comments_preview && item.comments_preview.length > 0 ? (
              item.comments_preview.map((c, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <img 
                    src={sanitizeUrl(c.avatar, '/default-avatar.jpg')} 
                    alt={`${c.user} avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" 
                    loading="lazy" 
                  />
                  <div>
                    <div className="text-sm font-medium text-pink-300">{c.user}</div>
                    <div className="text-sm text-gray-300">{c.comment}</div>
                    <div className="text-xs text-gray-500">{new Date(c.posted_at).toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">Belum ada komentar.</div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link to="/gallery" className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors">← Kembali ke Galeri</Link>
        </div>
      </div>
    </main>
  );
}
