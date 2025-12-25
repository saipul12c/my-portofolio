import { useParams, Link } from "react-router-dom";
import { useGalleryData } from "./hooks/useGalleryData";

export default function VideoDetail() {
  const { id } = useParams();
  const { allMedia, loading } = useGalleryData();

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl bg-[#0b0b0b] p-8 rounded-2xl text-gray-300">Memuat...</div>
    </main>
  );

  const item = allMedia.find(v => String(v.id) === String(id) && v.type === "video");

  if (!item) return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl bg-[#0b0b0b] p-8 rounded-2xl text-gray-300">Video tidak ditemukan.</div>
    </main>
  );

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-5xl mx-auto bg-[#0f1724] rounded-2xl overflow-hidden shadow-lg p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-1/2">
            <video src={item.src} controls className="w-full h-auto max-h-[60vh] lg:max-h-[70vh] rounded-lg" />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">{item.title}</h1>
            <p className="text-gray-300 text-sm sm:text-base">{item.desc}</p>
            <div className="flex gap-2 flex-wrap">
              {item.tags?.map((t,i) => (
                <span key={i} className="text-xs bg-purple-500/10 px-2 py-1 rounded">{t}</span>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-sm sm:text-base">Komentar ({item.engagement?.comments || 0})</h3>
              <div className="mt-3 flex flex-col gap-3">
                {item.comments_preview && item.comments_preview.length > 0 ? (
                  item.comments_preview.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <img src={c.avatar} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" loading="lazy" />
                      <div>
                        <div className="text-sm font-medium text-purple-300">{c.user}</div>
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
        </div>
      </div>
    </main>
  );
}
