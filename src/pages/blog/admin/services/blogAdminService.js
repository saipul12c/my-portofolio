/**
 * 📦 blogAdminService.js
 * Service utama manajemen data blog (CRUD, Moderasi Komentar, Kategori, Export/Import, & Metrik).
 * Mendukung penyimpanan lokal persisten instan + sinkronisasi dua arah ke Supabase.
 */

import { supabase } from '../../../../lib/supabaseClient';
import { getDynamicMetrics, setDynamicMetrics } from '../../services/blogSupabase';

const STORAGE_POSTS_KEY = 'blog_custom_posts';
const STORAGE_CATEGORIES_KEY = 'blog_custom_categories';
const STORAGE_COMMENTS_KEY = 'blog_admin_all_comments';

// 📚 Data bawaan awal (Seed Data Berisi Konten Berkualitas)
export const DEFAULT_SEED_POSTS = [
  {
    id: "post_1",
    slug: "tips-fotografi-pemula-komposisi-cahaya",
    url: "/blog/tips-fotografi-pemula-komposisi-cahaya",
    title: "Tips Fotografi Pemula: Memahami Komposisi dan Pencahayaan Natural",
    metaTitle: "Tips Fotografi Pemula | Panduan Komposisi & Cahaya",
    metaDescription: "Pelajari teknik dasar fotografi seperti rule of thirds, leading lines, dan cara memanfaatkan golden hour secara maksimal.",
    author: "M. Syaiful Mukmin",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    authorBio: "Software Engineer, Creator, dan Penggemar Fotografi.",
    authorLink: "/about",
    date: "2026-02-15",
    updatedAt: "2026-02-16",
    status: "published",
    scheduledAt: null,
    revisions: [
      {
        id: "rev_seed_1",
        savedAt: "2026-02-15T08:00:00Z",
        title: "Tips Fotografi Pemula: Memahami Komposisi dan Pencahayaan Natural",
        content: "Fotografi adalah seni melukis dengan cahaya...",
        wordCount: 820,
        summary: "Versi rilis orisinal"
      }
    ],
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    imageFull: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80",
    category: "Fotografi",
    tags: ["fotografi", "kamera", "pencahayaan", "komposisi", "visual"],
    readTime: "6 menit",
    wordCount: 820,
    readingLevel: "mudah",
    views: 1840,
    likes: 312,
    shares: 88,
    rating: 4.9,
    totalRatings: 34,
    featured: true,
    excerpt: "Fotografi bukan semata soal mahalnya alat, melainkan kepekaan menangkap momen melalui komposisi yang seimbang dan pencahayaan yang tepat.",
    content: `## Memulai Perjalanan Fotografi Anda

Fotografi adalah seni melukis dengan cahaya. Banyak pemula mengira bahwa foto yang memukau hanya bisa dihasilkan oleh kamera seharga puluhan juta. Kenyataannya, **pemahaman tentang komposisi dan arah datangnya cahaya** jauh lebih berpengaruh terhadap hasil akhir foto Anda.

---

### 1. Rule of Thirds (Aturan Sepertiga)
Bayangkan bingkai foto Anda terbagi menjadi 9 kotak sama besar melalui 2 garis vertikal dan 2 garis horizontal. Letakkan objek utama (focal point) di salah satu dari empat titik temu garis tersebut.

> "Komposisi yang baik memandu mata pemirsa langsung ke cerita yang ingin Anda sampaikan."

\`\`\`
  +---+---+---+
  |   | o |   |   <- Letakkan objek pada titik temu (o)
  +---+---+---+
  | o |   |   |
  +---+---+---+
\`\`\`

---

### 2. Memanfaatkan Golden Hour
Waktu terbaik untuk memotret dengan cahaya natural adalah sekitar 1 jam setelah matahari terbit dan 1 jam sebelum matahari terbenam:
- **Cahaya hangat (warm tone)** yang lembut.
- **Bayangan panjang (soft shadow)** yang memberi dimensi dramatis pada subjek.
- Tidak menimbulkan kontras berlebihan pada wajah subjek.

---

### Kesimpulan
Eksperimenlah sesering mungkin. Gunakan perangkat apa pun yang Anda miliki saat ini, dan mulailah memperhatikan bagaimana cahaya berinteraksi dengan benda-benda di sekitar Anda!`,
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "post_2",
    slug: "arsitektur-frontend-modern-react-clean-code",
    url: "/blog/arsitektur-frontend-modern-react-clean-code",
    title: "Membangun Arsitektur Frontend Modern dengan React dan Clean Code",
    metaTitle: "Arsitektur Frontend React Bersih & Terukur",
    metaDescription: "Panduan praktis menyusun folder, modularisasi hooks, dan menjaga performa aplikasi React di skala enterprise.",
    author: "M. Syaiful Mukmin",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    authorBio: "Software Engineer, Creator, dan Penggemar Fotografi.",
    authorLink: "/about",
    date: "2026-03-01",
    updatedAt: "2026-03-02",
    status: "published",
    scheduledAt: null,
    revisions: [],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    imageFull: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    category: "Teknologi",
    tags: ["react", "frontend", "javascript", "clean code", "arsitektur"],
    readTime: "8 menit",
    wordCount: 1150,
    readingLevel: "menengah",
    views: 2650,
    likes: 489,
    shares: 142,
    rating: 5.0,
    totalRatings: 52,
    featured: true,
    excerpt: "Ketika aplikasi bertumbuh, menjaga struktur kode tetap bersih, modular, dan mudah di-maintain adalah kunci utama kebahagiaan developer.",
    content: `## Mengapa Arsitektur Itu Penting?

Banyak proyek React dimulai dengan cepat tanpa aturan folder yang ketat. Namun ketika komponen telah mencapai puluhan hingga ratusan, bug misterius dan *re-render* yang tidak terkontrol mulai bermunculan.

### Prinsip Single Responsibility
Pastikan setiap komponen hanya menangani satu tugas utama:
1. **Container Component**: Mengatur state dan fetching data.
2. **Presentational Component**: Murni menerima props dan merender tampilan UI.

\`\`\`jsx
// Contoh pemisahan logika ke custom hook
export function useArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return { articles, loading };
}
\`\`\`

Dengan memisahkan state ke dalam custom hook, komponen tampilan menjadi sangat ringan dan mudah diuji (*testable*).`,
    gallery: []
  },
  {
    id: "post_3",
    slug: "strategi-branding-digital-di-era-kecerdasan-buatan",
    url: "/blog/strategi-branding-digital-di-era-kecerdasan-buatan",
    title: "Strategi Branding Digital dan Pembuatan Konten di Era AI",
    metaTitle: "Strategi Branding Digital di Era AI | Portofolio Modern",
    metaDescription: "Bagaimana personal branding tetap autentik dan bernilai tinggi di tengah banjirnya konten generatif AI.",
    author: "M. Syaiful Mukmin",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    authorBio: "Software Engineer, Creator, dan Penggemar Fotografi.",
    authorLink: "/about",
    date: "2026-03-10",
    updatedAt: "2026-03-11",
    status: "published",
    scheduledAt: null,
    revisions: [],
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    imageFull: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Desain & Kreatif",
    tags: ["branding", "ai", "desain", "kreativitas", "karir"],
    readTime: "5 menit",
    wordCount: 740,
    readingLevel: "mudah",
    views: 1290,
    likes: 215,
    shares: 47,
    rating: 4.8,
    totalRatings: 18,
    featured: false,
    excerpt: "Di saat AI dapat memproduksi ratusan artikel dalam hitungan detik, apa yang membuat pembaca tetap memilih karya Anda? Jawabannya adalah sentuhan emosi manusiawi.",
    content: `## Nilai Keaslian di Tengah Konten Masal

Kehadiran alat AI generatif mengubah lansekap produksi konten secara radikal. Namun, semakin mudah konten diproduksi secara instan, semakin tinggi pula apresiasi audiens terhadap **kisah nyata, kegagalan berharga, dan perspektif personal**.

### Tiga Pilar Branding Autentik
- **Transparansi**: Bagikan perjalanan di balik layar, bukan hanya kesuksesan semata.
- **Konsistensi Suara**: Miliki ciri khas gaya tulisan yang unik dan hangat.
- **Koneksi Dua Arah**: Dengarkan komunitas Anda dan balas pesan atau diskusi dengan tulus.`,
    gallery: []
  }
];

export const DEFAULT_SEED_CATEGORIES = [
  { id: "cat_1", name: "Fotografi", color: "#06b6d4", icon: "Camera", description: "Tips kamera, teknik angle, lighting, dan editing visual" },
  { id: "cat_2", name: "Teknologi", color: "#3b82f6", icon: "Code", description: "Web development, React, JavaScript, arsitektur software" },
  { id: "cat_3", name: "Desain & Kreatif", color: "#8b5cf6", icon: "Palette", description: "UI/UX, branding, estetika grafis, dan ide kreatif" },
  { id: "cat_4", name: "Pendidikan", color: "#10b981", icon: "BookOpen", description: "Wawasan edukasi, metode belajar, dan literasi digital" },
  { id: "cat_5", name: "Opini & Cerita", color: "#f59e0b", icon: "Coffee", description: "Refleksi pribadi, catatan harian, dan pandangan hidup" },
  { id: "cat_6", name: "Seni & Budaya", color: "#ec4899", icon: "Music", description: "Teater, tari kolosal, budaya Banjar, dan pagelaran seni tradisi" },
  { id: "cat_7", name: "Manajemen Event", color: "#eab308", icon: "Briefcase", description: "Organisasi panggung, logistik, rapat evaluasi, dan krisis manajemen" },
  { id: "cat_8", name: "Musik & Audio", color: "#6366f1", icon: "Volume2", description: "Aransemen akustik, sound engineering, dan vokal panggung" },
  { id: "cat_9", name: "Fotografi & Media", color: "#14b8a6", icon: "Film", description: "Stage photography live, dokumentasi visual, dan arsip momen" },
  { id: "cat_10", name: "Seni Pertunjukan", color: "#f43f5e", icon: "Award", description: "Dramaturgi, refleksi aktor, penjiwaan karakter, dan katarsis seni" }
];

/**
 * 🛠️ Helpers Slug & ReadTime
 */
export const generateSlug = (text) => {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const calculateReadTime = (content) => {
  if (!content) return "1 menit";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} menit`;
};

/**
 * 1. Ambil Semua Artikel untuk Admin (Published + Drafts)
 */
export const getAdminPosts = async () => {
  let posts = [];

  // 1. Cek LocalStorage terlebih dahulu (Instant responsiveness)
  try {
    const raw = localStorage.getItem(STORAGE_POSTS_KEY);
    if (raw) {
      posts = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading local posts:', e);
  }

  // Jika masih kosong sama sekali, inisialisasi dengan Seed Posts
  if (!Array.isArray(posts) || posts.length === 0) {
    posts = [...DEFAULT_SEED_POSTS];
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      // ignore
    }
  }

  // 2. Jika Supabase aktif, coba sinkronkan data terbaru dari server
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Format post dari Supabase
        const supabasePosts = data.map(p => ({
          id: String(p.id),
          slug: p.slug,
          url: p.url || `/blog/${p.slug}`,
          title: p.title,
          metaTitle: p.meta_title || p.title,
          metaDescription: p.meta_description || p.excerpt,
          excerpt: p.excerpt,
          content: p.content,
          author: p.author,
          authorAvatar: p.author_avatar,
          authorBio: p.author_bio,
          authorLink: p.author_link || '',
          date: p.date,
          updatedAt: p.updated_at,
          status: p.status || 'published',
          scheduledAt: p.scheduled_at || null,
          revisions: Array.isArray(p.revisions) ? p.revisions : [],
          thumbnail: p.thumbnail,
          imageFull: p.image_full || p.thumbnail,
          category: p.category,
          tags: Array.isArray(p.tags) ? p.tags : [],
          readTime: p.read_time || '5 menit',
          wordCount: p.word_count || 0,
          readingLevel: p.reading_level || 'mudah',
          views: p.views || 0,
          likes: p.likes || 0,
          shares: p.shares || 0,
          rating: Number(p.rating || 5.0),
          totalRatings: p.total_ratings || 1,
          featured: Boolean(p.featured),
          coverVideo: p.cover_video || '',
          gallery: Array.isArray(p.gallery) ? p.gallery : []
        }));

        // Gabungkan: jika ada post lokal yang belum ada di supabase, pertahankan
        const existingSlugs = new Set(supabasePosts.map(p => p.slug));
        const merged = [...supabasePosts];
        posts.forEach(lp => {
          if (!existingSlugs.has(lp.slug)) {
            merged.push(lp);
          }
        });

        posts = merged;
        localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
      }
    }
  } catch (err) {
    console.warn('Supabase offline or table missing, using local storage:', err);
  }

  // ⚡ Auto-Publisher: Periksa apakah ada artikel terjadwal yang sudah waktunya terbit
  const now = new Date();
  let hasAutoPublished = false;
  posts = posts.map(p => {
    if (p.status === 'scheduled' && p.scheduledAt && new Date(p.scheduledAt) <= now) {
      hasAutoPublished = true;
      return {
        ...p,
        status: 'published',
        date: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }
    return p;
  });

  if (hasAutoPublished) {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }

  // Hydrate dengan dynamic metrics per artikel
  return posts.map(p => {
    const dyn = getDynamicMetrics(p.slug, {
      views: p.views,
      likes: p.likes,
      shares: p.shares,
      rating: p.rating,
      totalRatings: p.totalRatings
    });
    return {
      ...p,
      views: dyn.views,
      likes: dyn.likes,
      shares: dyn.shares,
      rating: dyn.rating,
      totalRatings: dyn.totalRatings
    };
  });
};

/**
 * 2. Ambil Hanya Artikel Published (Untuk Tampilan Publik /blog)
 */
export const getPublicPosts = async () => {
  const all = await getAdminPosts();
  return all.filter(p => p.status === 'published');
};

/**
 * 3. Simpan / Buat Artikel Baru (Create)
 */
export const createPost = async (postData) => {
  const slug = postData.slug?.trim() || generateSlug(postData.title);
  const now = new Date().toISOString().split('T')[0];
  const words = (postData.content || '').trim().split(/\s+/).filter(Boolean).length;
  const readTime = postData.readTime || calculateReadTime(postData.content);

  const newPost = {
    id: 'post_' + Date.now(),
    slug,
    url: `/blog/${slug}`,
    title: postData.title?.trim() || 'Tanpa Judul',
    metaTitle: postData.metaTitle?.trim() || postData.title?.trim() || 'Artikel Blog',
    metaDescription: postData.metaDescription?.trim() || postData.excerpt?.trim() || '',
    excerpt: postData.excerpt?.trim() || '',
    content: postData.content || '',
    author: postData.author?.trim() || 'M. Syaiful Mukmin',
    authorAvatar: postData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorBio: postData.authorBio || 'Software Engineer, Creator, dan Penggemar Fotografi.',
    authorLink: postData.authorLink || '/about',
    date: postData.date || now,
    updatedAt: now,
    status: postData.status || 'published', // 'published' | 'draft' | 'scheduled'
    scheduledAt: postData.scheduledAt || null,
    revisions: [
      {
        id: 'rev_' + Date.now(),
        savedAt: new Date().toISOString(),
        title: postData.title?.trim() || 'Tanpa Judul',
        content: postData.content || '',
        excerpt: postData.excerpt?.trim() || '',
        wordCount: words,
        summary: postData.status === 'scheduled' 
          ? `Dijadwalkan terbit pada ${postData.scheduledAt}` 
          : (postData.status === 'published' ? 'Diterbitkan pertama kali' : 'Draf awal dibuat')
      }
    ],
    thumbnail: postData.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    imageFull: postData.imageFull || postData.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    category: postData.category || 'Teknologi',
    tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags ? postData.tags.split(',').map(t => t.trim().toLowerCase()) : []),
    readTime,
    wordCount: words,
    readingLevel: postData.readingLevel || 'mudah',
    views: Number(postData.views || 0),
    likes: Number(postData.likes || 0),
    shares: Number(postData.shares || 0),
    rating: Number(postData.rating || 5.0),
    totalRatings: Number(postData.totalRatings || 1),
    featured: Boolean(postData.featured),
    gallery: Array.isArray(postData.gallery) ? postData.gallery : []
  };

  // 1. Simpan ke Local Storage
  const posts = await getAdminPosts();
  // Pastikan slug unik
  if (posts.some(p => p.slug === newPost.slug)) {
    newPost.slug = `${newPost.slug}-${Date.now().toString().slice(-4)}`;
    newPost.url = `/blog/${newPost.slug}`;
  }
  const updatedList = [newPost, ...posts];
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(updatedList));

  // Inisialisasi dynamic metrics
  setDynamicMetrics(newPost.slug, {
    views: newPost.views,
    likes: newPost.likes,
    shares: newPost.shares,
    rating: newPost.rating,
    totalRatings: newPost.totalRatings
  });

  // 2. Simpan ke Supabase jika tersedia
  try {
    if (supabase) {
      await supabase.from('blog_posts').insert({
        slug: newPost.slug,
        title: newPost.title,
        meta_title: newPost.metaTitle,
        meta_description: newPost.metaDescription,
        excerpt: newPost.excerpt,
        content: newPost.content,
        author: newPost.author,
        author_avatar: newPost.authorAvatar,
        author_bio: newPost.authorBio,
        author_link: newPost.authorLink,
        date: newPost.date,
        updated_at: newPost.updatedAt,
        status: newPost.status,
        thumbnail: newPost.thumbnail,
        image_full: newPost.imageFull,
        category: newPost.category,
        tags: newPost.tags,
        read_time: newPost.readTime,
        word_count: newPost.wordCount,
        reading_level: newPost.readingLevel,
        views: newPost.views,
        likes: newPost.likes,
        shares: newPost.shares,
        rating: newPost.rating,
        total_ratings: newPost.totalRatings,
        featured: newPost.featured,
        cover_video: newPost.coverVideo || null,
        gallery: Array.isArray(newPost.gallery) ? newPost.gallery : []
      });
    }
  } catch (err) {
    console.warn('⚠️ Gagal simpan post ke Supabase (tersimpan secara lokal):', err);
  }

  return newPost;
};

/**
 * 4. Update Artikel
 */
export const updatePost = async (identifier, updatedFields) => {
  const posts = await getAdminPosts();
  const index = posts.findIndex(p => p.id === identifier || p.slug === identifier);

  if (index === -1) {
    throw new Error('Artikel tidak ditemukan.');
  }

  const current = posts[index];
  const now = new Date().toISOString().split('T')[0];
  const content = updatedFields.content !== undefined ? updatedFields.content : current.content;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = updatedFields.readTime || calculateReadTime(content);

  // Simpan riwayat revisi (maksimal 20 snapshot terakhir)
  const existingRevisions = Array.isArray(current.revisions) ? current.revisions : [];
  const revisionSnapshot = {
    id: 'rev_' + Date.now(),
    savedAt: new Date().toISOString(),
    title: updatedFields.title || current.title,
    content: content,
    excerpt: updatedFields.excerpt || current.excerpt,
    wordCount: words,
    summary: updatedFields.revisionSummary || 
      (updatedFields.status === 'scheduled' 
        ? `Dijadwalkan untuk ${updatedFields.scheduledAt || current.scheduledAt}`
        : (updatedFields.status === 'published' ? 'Pembaruan artikel rilis' : 'Pembaruan draf tersimpan'))
  };

  const merged = {
    ...current,
    ...updatedFields,
    updatedAt: now,
    wordCount: words,
    readTime,
    revisions: [revisionSnapshot, ...existingRevisions].slice(0, 20)
  };

  posts[index] = merged;
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));

  // Update metrik jika ada perubahan
  if (updatedFields.views !== undefined || updatedFields.likes !== undefined) {
    setDynamicMetrics(merged.slug, {
      views: merged.views,
      likes: merged.likes,
      shares: merged.shares,
      rating: merged.rating,
      totalRatings: merged.totalRatings
    });
  }

  // Sync ke Supabase jika aktif
  try {
    if (supabase) {
      await supabase
        .from('blog_posts')
        .update({
          title: merged.title,
          slug: merged.slug,
          meta_title: merged.metaTitle,
          meta_description: merged.metaDescription,
          excerpt: merged.excerpt,
          content: merged.content,
          author: merged.author,
          author_avatar: merged.authorAvatar,
          author_bio: merged.authorBio,
          author_link: merged.authorLink,
          updated_at: merged.updatedAt,
          status: merged.status,
          thumbnail: merged.thumbnail,
          image_full: merged.imageFull,
          category: merged.category,
          tags: merged.tags,
          read_time: merged.readTime,
          word_count: merged.wordCount,
          reading_level: merged.readingLevel,
          featured: merged.featured,
          cover_video: merged.coverVideo || null,
          gallery: Array.isArray(merged.gallery) ? merged.gallery : []
        })
        .or(`id.eq.${current.id},slug.eq.${current.slug}`);
    }
  } catch (err) {
    console.warn('⚠️ Gagal update post ke Supabase (tersimpan secara lokal):', err);
  }

  return merged;
};

/**
 * 5. Hapus Artikel (Delete)
 */
export const deletePost = async (identifier) => {
  const posts = await getAdminPosts();
  const target = posts.find(p => p.id === identifier || p.slug === identifier);
  if (!target) return false;

  const filtered = posts.filter(p => p.id !== identifier && p.slug !== identifier);
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(filtered));

  // Sync delete ke Supabase
  try {
    if (supabase) {
      await supabase
        .from('blog_posts')
        .delete()
        .or(`id.eq.${target.id},slug.eq.${target.slug}`);
    }
  } catch (err) {
    console.warn('⚠️ Gagal delete post dari Supabase (terhapus secara lokal):', err);
  }

  return true;
};

/**
 * 6. Duplikasi Artikel (Duplicate as Draft)
 */
export const duplicatePost = async (identifier) => {
  const posts = await getAdminPosts();
  const source = posts.find(p => p.id === identifier || p.slug === identifier);
  if (!source) throw new Error('Artikel sumber tidak ditemukan.');

  const duplicatedData = {
    ...source,
    id: 'post_' + Date.now(),
    title: `${source.title} (Salinan)`,
    slug: `${source.slug}-salinan-${Date.now().toString().slice(-4)}`,
    status: 'draft',
    views: 0,
    likes: 0,
    shares: 0,
    rating: 5.0,
    totalRatings: 1,
    featured: false
  };

  return await createPost(duplicatedData);
};

/**
 * 6b. Pulihkan Versi Revisi Sebelumnya (Restore Revision)
 */
export const restorePostRevision = async (identifier, revisionId) => {
  const posts = await getAdminPosts();
  const post = posts.find(p => p.id === identifier || p.slug === identifier);
  if (!post) throw new Error('Artikel tidak ditemukan.');

  const targetRevision = (post.revisions || []).find(r => r.id === revisionId);
  if (!targetRevision) throw new Error('Riwayat revisi tidak ditemukan.');

  return await updatePost(identifier, {
    title: targetRevision.title,
    content: targetRevision.content,
    excerpt: targetRevision.excerpt || post.excerpt,
    revisionSummary: `Dipulihkan dari revisi: ${new Date(targetRevision.savedAt).toLocaleString('id-ID')}`
  });
};

/**
 * 7. Toggle Cepat Status (Published <-> Draft)
 */
export const togglePostStatus = async (identifier) => {
  const posts = await getAdminPosts();
  const target = posts.find(p => p.id === identifier || p.slug === identifier);
  if (!target) return null;

  const nextStatus = target.status === 'published' ? 'draft' : 'published';
  return await updatePost(identifier, { status: nextStatus });
};

/**
 * 8. Toggle Cepat Unggulan (Featured)
 */
export const togglePostFeatured = async (identifier) => {
  const posts = await getAdminPosts();
  const target = posts.find(p => p.id === identifier || p.slug === identifier);
  if (!target) return null;

  return await updatePost(identifier, { featured: !target.featured });
};

/**
 * 9. Manajemen Komentar Seluruh Blog (Moderasi)
 */
export const getAllComments = async () => {
  let comments = [];
  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    if (raw) comments = JSON.parse(raw);
  } catch {
    comments = [];
  }

  // Tarik juga komentar per-slug yang disimpan oleh sistem komentar public
  const posts = await getAdminPosts();
  posts.forEach(p => {
    try {
      const perSlugRaw = localStorage.getItem(`blog_comments_${p.slug}`);
      if (perSlugRaw) {
        const parsed = JSON.parse(perSlugRaw);
        if (Array.isArray(parsed)) {
          parsed.forEach(c => {
            if (!comments.some(item => item.id === c.id)) {
              comments.push({
                ...c,
                postSlug: p.slug,
                postTitle: p.title,
                status: c.status || 'approved'
              });
            }
          });
        }
      }
    } catch {
      // ignore
    }
  });

  // Jika Supabase aktif, ambil juga dari tabel blog_comments
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach(c => {
          if (!comments.some(item => item.id === c.id)) {
            const matchedPost = posts.find(p => p.slug === c.post_slug);
            comments.push({
              id: c.id,
              postSlug: c.post_slug,
              postTitle: matchedPost?.title || c.post_slug,
              name: c.name,
              email: c.email,
              message: c.message,
              avatar: c.avatar,
              date: c.created_at,
              status: c.status || 'approved'
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('Supabase comments fetch error:', err);
  }

  return comments.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
};

export const deleteAdminComment = async (commentId, postSlug) => {
  // 1. Hapus dari general comments storage
  try {
    const all = await getAllComments();
    const filtered = all.filter(c => c.id !== commentId);
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(filtered));

    // 2. Hapus dari per-slug storage
    if (postSlug) {
      const key = `blog_comments_${postSlug}`;
      const slugRaw = localStorage.getItem(key);
      if (slugRaw) {
        const list = JSON.parse(slugRaw);
        localStorage.setItem(key, JSON.stringify(list.filter(c => c.id !== commentId)));
      }
    }

    // 3. Sync Supabase
    if (supabase) {
      await supabase.from('blog_comments').delete().eq('id', commentId);
    }
    return true;
  } catch (e) {
    console.warn('Error deleting comment:', e);
    return false;
  }
};

export const updateCommentStatus = async (commentId, postSlug, newStatus) => {
  try {
    const all = await getAllComments();
    const updated = all.map(c => c.id === commentId ? { ...c, status: newStatus } : c);
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(updated));

    if (postSlug) {
      const key = `blog_comments_${postSlug}`;
      const slugRaw = localStorage.getItem(key);
      if (slugRaw) {
        const list = JSON.parse(slugRaw);
        localStorage.setItem(key, JSON.stringify(list.map(c => c.id === commentId ? { ...c, status: newStatus } : c)));
      }
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * 10. Manajemen Kategori & Tag
 */
export const getAdminCategories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_SEED_CATEGORIES;
};

export const saveAdminCategories = (categories) => {
  try {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch {
    return false;
  }
};

/**
 * 11. Statistik Keseluruhan (Analytics & Metrics)
 */
export const getOverallBlogStats = async () => {
  const posts = await getAdminPosts();
  const comments = await getAllComments();

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const featuredPosts = posts.filter(p => p.featured).length;

  const totalViews = posts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
  const totalShares = posts.reduce((sum, p) => sum + (Number(p.shares) || 0), 0);
  const avgRating = totalPosts > 0 
    ? (posts.reduce((sum, p) => sum + (Number(p.rating) || 5.0), 0) / totalPosts).toFixed(1)
    : "5.0";

  // Hitung postingan teratas berdasarkan views
  const topPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  // Grouping kategori beserta jumlah artikel
  const categories = getAdminCategories();
  const categoryStats = categories.map(cat => ({
    ...cat,
    count: posts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length
  }));

  // Metrik grafik tren 6 bulan terakhir
  const monthlyData = [
    { month: 'Okt', views: Math.round(totalViews * 0.12), posts: 1 },
    { month: 'Nov', views: Math.round(totalViews * 0.18), posts: 2 },
    { month: 'Des', views: Math.round(totalViews * 0.22), posts: 1 },
    { month: 'Jan', views: Math.round(totalViews * 0.35), posts: 3 },
    { month: 'Feb', views: Math.round(totalViews * 0.55), posts: 4 },
    { month: 'Mar', views: totalViews, posts: totalPosts }
  ];

  return {
    totalPosts,
    publishedPosts,
    scheduledPosts,
    draftPosts,
    featuredPosts,
    totalViews,
    totalLikes,
    totalShares,
    avgRating,
    totalComments: comments.length,
    topPosts,
    categoryStats,
    monthlyData,
    recentComments: comments.slice(0, 5)
  };
};

/**
 * 12. Backup & Restore Data Blog (Export / Import JSON)
 */
export const exportBlogBackup = async () => {
  const posts = await getAdminPosts();
  const comments = await getAllComments();
  const categories = getAdminCategories();

  const backupData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    blogTitle: "M. Syaiful Mukmin Blog",
    posts,
    comments,
    categories
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-blog-syaiful-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
};

export const importBlogBackup = async (jsonString, mode = 'merge') => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.posts || !Array.isArray(data.posts)) {
      throw new Error("Format file JSON tidak valid. Properti 'posts' tidak ditemukan.");
    }

    if (mode === 'overwrite') {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(data.posts));
      if (Array.isArray(data.categories)) {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(data.categories));
      }
    } else {
      // Merge mode
      const currentPosts = await getAdminPosts();
      const existingSlugs = new Set(currentPosts.map(p => p.slug));
      const merged = [...currentPosts];
      
      data.posts.forEach(p => {
        if (!existingSlugs.has(p.slug)) {
          merged.push(p);
        }
      });
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(merged));
    }
    return { success: true, count: data.posts.length };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const resetBlogToSeed = () => {
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(DEFAULT_SEED_POSTS));
  localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(DEFAULT_SEED_CATEGORIES));
  return true;
};
