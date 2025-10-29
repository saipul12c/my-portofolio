import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogs from "../../../data/blog/data.json";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogs.find((b) => b.slug === slug);

  // === 🚨 Jika artikel tidak ditemukan ===
  if (!post) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-gray-400 mb-6">
          Maaf, artikel yang kamu cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/blog"
          className="text-cyan-400 hover:text-cyan-300 transition font-medium"
        >
          ← Kembali ke Blog
        </Link>
      </section>
    );
  }

  // === 🔗 Artikel Terkait ===
  const related = Array.isArray(post.relatedPosts)
    ? blogs.filter((b) => post.relatedPosts.includes(b.slug))
    : [];

  // === 🕓 Format waktu baca ===
  const formatReadTime = (time) => {
    if (!time) return "Waktu baca tidak tersedia";
    const num = parseInt(time);
    return isNaN(num) ? time : `${num} menit baca`;
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-10 text-gray-200">
      {/* === 🖼 Gambar Utama === */}
      {post.imageFull || post.thumbnail ? (
        <img
          src={post.imageFull || post.thumbnail}
          alt={post.title}
          loading="lazy"
          className="w-full h-72 object-cover rounded-2xl mb-8 shadow-md"
        />
      ) : (
        <div className="w-full h-64 bg-gray-800/70 rounded-2xl mb-8 flex items-center justify-center text-gray-500">
          Tidak ada gambar
        </div>
      )}

      {/* === 📝 Judul & Info Utama === */}
      <h1 className="text-4xl font-bold mb-3 text-white leading-tight">
        {post.title}
      </h1>
      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mb-6">
        {post.author && <span>✍️ {post.author}</span>}
        {post.date && (
          <span>• {new Date(post.date).toLocaleDateString("id-ID")}</span>
        )}
        {post.readTime && <span>• ⏱ {formatReadTime(post.readTime)}</span>}
        {post.rating && <span>• ⭐ {post.rating}</span>}
        {post.views && <span>• 👁 {post.views.toLocaleString()}</span>}
        {post.likes && <span>• ❤️ {post.likes.toLocaleString()}</span>}
      </div>

      {/* === 📖 Konten Artikel (Markdown) === */}
      <div className="prose prose-invert max-w-none leading-relaxed mb-10">
        {post.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        ) : (
          <p>Konten artikel belum tersedia.</p>
        )}
      </div>

      {/* === 🖼 Galeri Gambar === */}
      {Array.isArray(post.gallery) && post.gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {post.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`gallery-${i}`}
              loading="lazy"
              className="rounded-xl object-cover w-full h-36 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 transition-transform duration-300"
            />
          ))}
        </div>
      )}

      {/* === 🏷 Tag Artikel === */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="mb-10">
          <h3 className="font-semibold text-lg mb-3 text-white">Tag:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-700/70 text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-cyan-600/40 hover:text-white transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* === ✍️ Profil Penulis === */}
      {(post.author || post.authorAvatar || post.authorBio) && (
        <div className="flex items-center gap-4 bg-gray-800/70 rounded-xl p-5 mb-12 border border-white/10 hover:border-cyan-400/20 transition-all">
          <img
            src={post.authorAvatar || "/default-avatar.png"}
            alt={post.author || "Author"}
            loading="lazy"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-400/30"
          />
          <div>
            {post.author && (
              <h3 className="text-lg font-semibold text-white">
                {post.author}
              </h3>
            )}
            {post.authorBio && (
              <p className="text-gray-400 text-sm mb-2">{post.authorBio}</p>
            )}
            {post.authorLink && (
              <Link
                to={post.authorLink}
                className="text-cyan-400 text-sm hover:underline hover:text-cyan-300 transition"
              >
                Lihat Profil →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* === 💬 Komentar === */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Komentar ({post.commentCount || post.comments?.length || 0})
        </h3>

        {Array.isArray(post.comments) && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((c, i) => (
              <div
                key={i}
                className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 hover:border-cyan-400/20 transition-all"
              >
                <p className="text-sm text-gray-400 mb-1">
                  <strong className="text-gray-200">{c.name}</strong> •{" "}
                  {c.date
                    ? new Date(c.date).toLocaleDateString("id-ID")
                    : "Tanggal tidak diketahui"}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {c.message || ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">Belum ada komentar.</p>
        )}
      </div>

      {/* === 🔗 Artikel Terkait === */}
      {related.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Artikel Terkait
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/blog/${r.slug}`}
                className="bg-gray-800/70 rounded-xl p-4 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-cyan-400/20 transition-all duration-300"
              >
                {r.thumbnail && (
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="font-semibold text-lg text-white mb-1 line-clamp-2">
                  {r.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {r.excerpt || "Baca artikel selengkapnya..."}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* === 🔙 Tombol Kembali === */}
      <div className="mt-12 text-center">
        <Link
          to="/blog"
          className="text-cyan-400 hover:text-cyan-300 hover:underline text-lg font-medium transition"
        >
          ← Kembali ke Blog
        </Link>
      </div>
    </article>
  );
}
