import { useParams, Link } from "react-router-dom";
import blogs from "../../../data/blog/data.json";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogs.find((b) => b.slug === slug);

  if (!post) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Artikel Tidak Ditemukan
        </h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">
          ← Kembali ke Blog
        </Link>
      </section>
    );
  }

  // Cari artikel terkait
  const related = blogs.filter((b) =>
    post.relatedPosts?.includes(b.slug)
  );

  return (
    <article className="max-w-4xl mx-auto px-6 py-10 text-gray-200">
      {/* Gambar Utama */}
      <img
        src={post.imageFull || post.thumbnail}
        alt={post.title}
        className="w-full h-72 object-cover rounded-2xl mb-8"
      />

      {/* Judul & Info Utama */}
      <h1 className="text-4xl font-bold mb-3 text-white">{post.title}</h1>
      <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mb-6">
        <span>{post.author}</span>
        <span>• {new Date(post.date).toLocaleDateString("id-ID")}</span>
        <span>• ⏱ {post.readTime}</span>
        <span>• ⭐ {post.rating}</span>
        <span>• 👁 {post.views}</span>
        <span>• ❤️ {post.likes}</span>
      </div>

      {/* Konten Artikel */}
      <div className="prose prose-invert max-w-none leading-relaxed mb-8 whitespace-pre-line">
        {post.content}
      </div>

      {/* Galeri Gambar */}
      {post.gallery && post.gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {post.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`gallery-${i}`}
              className="rounded-xl object-cover w-full h-36 hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      {/* Tag */}
      {post.tags && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3 text-white">Tag:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-cyan-600 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Profil Penulis */}
      <div className="flex items-center gap-4 bg-gray-800 rounded-xl p-5 mb-10">
        <img
          src={post.authorAvatar}
          alt={post.author}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{post.author}</h3>
          <p className="text-gray-400 text-sm mb-2">{post.authorBio}</p>
          <Link
            to={post.authorLink || "#"}
            className="text-cyan-400 text-sm hover:underline"
          >
            Lihat Profil →
          </Link>
        </div>
      </div>

      {/* Komentar */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Komentar ({post.commentCount || 0})
        </h3>
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((c, i) => (
              <div
                key={i}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700"
              >
                <p className="text-sm text-gray-400 mb-1">
                  <strong>{c.name}</strong> •{" "}
                  {new Date(c.date).toLocaleDateString("id-ID")}
                </p>
                <p className="text-gray-300">{c.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Belum ada komentar.</p>
        )}
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Artikel Terkait
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/blog/${r.slug}`}
                className="bg-gray-800 rounded-xl p-4 hover:shadow-cyan-500/30 transition-all"
              >
                <img
                  src={r.thumbnail}
                  alt={r.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-lg text-white mb-2">
                  {r.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tombol kembali */}
      <div className="mt-10 text-center">
        <Link
          to="/blog"
          className="text-cyan-400 hover:underline text-lg font-medium"
        >
          ← Kembali ke Blog
        </Link>
      </div>
    </article>
  );
}
