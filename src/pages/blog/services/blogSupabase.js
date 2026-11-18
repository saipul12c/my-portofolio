/**
 * 🚀 blogSupabase.js
 * 
 * Service penghubung antara komponen Blog dan Supabase.
 * Dilengkapi dengan fallback otomatis ke localStorage dan data.json lokal
 * sehingga aplikasi tetap berjalan 100% mulus dan DINAMIS baik saat Supabase aktif maupun offline.
 */

import { supabase } from '../../../lib/supabaseClient';

// Dapatkan atau buat Device ID unik per browser untuk like/bookmark/rating anonim
export const getDeviceId = () => {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem('blog_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('blog_device_id', deviceId);
  }
  return deviceId;
};

/**
 * 💡 Dynamic Metrics Store (Local Overrides)
 * Memastikan interaksi user (views, likes, shares, rating) langsung tersimpan
 * secara dinamis dan persisten di browser, bahkan ketika Supabase offline.
 */
export const getDynamicMetrics = (slug, fallback = {}) => {
  if (typeof window === 'undefined' || !slug) return fallback;
  try {
    const raw = localStorage.getItem(`blog_metrics_${slug}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        views: typeof parsed.views === 'number' ? parsed.views : (fallback.views || 0),
        likes: typeof parsed.likes === 'number' ? parsed.likes : (fallback.likes || 0),
        shares: typeof parsed.shares === 'number' ? parsed.shares : (fallback.shares || 0),
        rating: typeof parsed.rating === 'number' ? parsed.rating : (fallback.rating || 5.0),
        totalRatings: typeof parsed.totalRatings === 'number' ? parsed.totalRatings : (fallback.totalRatings || 1),
      };
    }
  } catch (e) {
    console.warn('Error reading dynamic metrics:', e);
  }
  return {
    views: fallback.views || 0,
    likes: fallback.likes || 0,
    shares: fallback.shares || 0,
    rating: fallback.rating || 5.0,
    totalRatings: fallback.totalRatings || 1,
  };
};

export const setDynamicMetrics = (slug, metrics) => {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const current = getDynamicMetrics(slug, {});
    const updated = { ...current, ...metrics };
    localStorage.setItem(`blog_metrics_${slug}`, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving dynamic metrics:', e);
  }
};

// Konversi data snake_case Supabase ke format camelCase frontend
export const formatSupabasePost = (p) => {
  if (!p) return null;
  return {
    id: p.id,
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
    thumbnail: p.thumbnail,
    imageFull: p.image_full || p.thumbnail,
    coverVideo: p.cover_video,
    category: p.category,
    tags: Array.isArray(p.tags) ? p.tags : [],
    labels: Array.isArray(p.labels) ? p.labels : [],
    keywords: Array.isArray(p.keywords) ? p.keywords : [],
    readTime: p.read_time || '5 menit',
    wordCount: p.word_count || 0,
    readingLevel: p.reading_level || 'mudah',
    views: p.views || 0,
    likes: p.likes || 0,
    shares: p.shares || 0,
    rating: Number(p.rating || 5.0),
    totalRatings: p.total_ratings || 1,
    featured: Boolean(p.featured),
    series: p.series,
    source: p.source,
    language: p.language || 'id',
    translations: p.translations || {},
    canonicalUrl: p.canonical_url || '',
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    relatedPosts: Array.isArray(p.related_posts) ? p.related_posts : []
  };
};

/**
 * 1. Ambil semua artikel dari Supabase + hydrasi metrik dinamis
 */
export const fetchAllPosts = async () => {
  let posts = [];
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        posts = data.map(formatSupabasePost);
      }
    }
  } catch (err) {
    console.warn('⚠️ Supabase fetchAllPosts offline/gagal:', err);
  }

  // Integrasi mulus: ambil postingan yang tersimpan dari Blog Admin Storage
  try {
    const rawLocal = localStorage.getItem('blog_custom_posts');
    if (rawLocal) {
      const parsedLocal = JSON.parse(rawLocal);
      if (Array.isArray(parsedLocal)) {
        const publishedLocal = parsedLocal.filter(p => p.status === 'published');
        const existingSlugs = new Set(posts.map(p => p.slug));
        publishedLocal.forEach(lp => {
          if (!existingSlugs.has(lp.slug)) {
            posts.push(lp);
          }
        });
      }
    }
  } catch (e) {
    console.warn('Error merging local blog posts:', e);
  }

  // Sinkronkan dengan dynamic metrics lokal
  return posts.map(p => {
    const dyn = getDynamicMetrics(p.slug, {
      views: p.views,
      likes: p.likes,
      shares: p.shares || 0,
      rating: p.rating || 5.0,
      totalRatings: p.totalRatings || 1
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
 * 2. Ambil artikel berdasarkan slug + hydrasi metrik dinamis
 */
export const fetchPostBySlug = async (slug) => {
  if (!slug) return null;
  let post = null;

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        post = formatSupabasePost(data);
      }
    }
  } catch (err) {
    console.warn('⚠️ Supabase fetchPostBySlug fallback:', err);
  }

  // Fallback ke penyimpanan lokal blog admin jika belum ada di Supabase
  if (!post) {
    try {
      const rawLocal = localStorage.getItem('blog_custom_posts');
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          post = parsed.find(p => p.slug === slug || p.id === slug) || null;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!post) return null;

  // Terapkan metrik dinamis
  const dyn = getDynamicMetrics(slug, {
    views: post.views,
    likes: post.likes,
    shares: post.shares || 0,
    rating: post.rating || 5.0,
    totalRatings: post.totalRatings || 1
  });

  return {
    ...post,
    views: dyn.views,
    likes: dyn.likes,
    shares: dyn.shares,
    rating: dyn.rating,
    totalRatings: dyn.totalRatings
  };
};

/**
 * 3. Ambil komentar artikel secara DINAMIS (Supabase + LocalStorage)
 * Tidak lagi memaksakan komentar palsu bawaan jika sudah ada komentar asli.
 */
export const fetchComments = async (postSlug) => {
  if (!postSlug) return [];

  // Ambil komentar lokal yang pernah disimpan user di browser ini
  let localComments = [];
  try {
    const saved = localStorage.getItem(`blog_comments_${postSlug}`);
    if (saved) localComments = JSON.parse(saved);
  } catch {
    localComments = [];
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const formatted = data.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          message: c.message,
          avatar: c.avatar,
          date: c.created_at
        }));

        // Gabungkan Supabase dengan komentar lokal yang belum ter-sync
        const combined = [...formatted];
        localComments.forEach(loc => {
          if (!combined.some(c => c.id === loc.id || (c.name === loc.name && c.message === loc.message))) {
            combined.unshift(loc);
          }
        });

        return combined;
      }
    }
  } catch (err) {
    console.warn('⚠️ Supabase fetchComments fallback ke local:', err);
  }

  // Jika Supabase offline atau belum diisi, kembalikan komentar dinamis lokal
  return localComments;
};

/**
 * 4. Tambah komentar baru (Simpan ke Supabase & LocalStorage secara dinamis)
 */
export const addComment = async ({ postSlug, name, email, message, avatar = null, userId = null }) => {
  if (!postSlug || !name || !message) {
    throw new Error('Nama dan pesan komentar wajib diisi.');
  }

  const newComment = {
    id: 'local_' + Date.now(),
    name: name.trim(),
    email: email ? email.trim() : null,
    message: message.trim(),
    avatar: avatar || null,
    date: new Date().toISOString()
  };

  // Simpan ke localStorage terlebih dahulu (instant UI update)
  try {
    const storageKey = `blog_comments_${postSlug}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    localStorage.setItem(storageKey, JSON.stringify([newComment, ...existing]));
  } catch (e) {
    console.warn('Failed saving comment to localStorage:', e);
  }

  // Kirim ke Supabase jika terhubung
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_slug: postSlug,
          user_id: userId || null,
          name: newComment.name,
          email: newComment.email,
          message: newComment.message,
          avatar: newComment.avatar
        })
        .select()
        .single();

      if (!error && data) {
        newComment.id = data.id;
        newComment.date = data.created_at;
      }
    }
  } catch (err) {
    console.warn('⚠️ Supabase addComment offline, tersimpan secara lokal:', err);
  }

  return newComment;
};

/**
 * 5. Cek status Suka (Like) artikel
 */
export const getLikeStatus = (postSlug) => {
  if (typeof window === 'undefined' || !postSlug) return false;
  return localStorage.getItem(`blog_liked_${postSlug}`) === 'true';
};

/**
 * 6. Toggle Suka (Like) artikel (Supabase + LocalStorage persisten)
 */
export const toggleLike = async (postSlug, currentLikes = 0) => {
  if (!postSlug) return { isLiked: false, count: currentLikes };

  const deviceId = getDeviceId();
  const currentlyLiked = getLikeStatus(postSlug);
  const nextLiked = !currentlyLiked;

  // Dapatkan metrik tersimpan
  const metrics = getDynamicMetrics(postSlug, { likes: currentLikes });
  const baseLikes = typeof metrics.likes === 'number' ? metrics.likes : currentLikes;
  const nextCount = nextLiked ? baseLikes + 1 : Math.max(0, baseLikes - 1);

  // Simpan state & count ke local storage secara persisten
  localStorage.setItem(`blog_liked_${postSlug}`, String(nextLiked));
  setDynamicMetrics(postSlug, { likes: nextCount });

  // Sync dengan Supabase
  try {
    if (supabase) {
      if (nextLiked) {
        await supabase
          .from('blog_likes')
          .insert({ post_slug: postSlug, device_id: deviceId })
          .select();
        await supabase.rpc('increment_blog_likes', { target_slug: postSlug });
      } else {
        await supabase
          .from('blog_likes')
          .delete()
          .eq('post_slug', postSlug)
          .eq('device_id', deviceId);
        await supabase.rpc('decrement_blog_likes', { target_slug: postSlug });
      }
    }
  } catch (err) {
    console.warn('⚠️ Supabase toggleLike offline/fallback:', err);
  }

  return { isLiked: nextLiked, count: nextCount };
};

/**
 * 7. Cek status Bookmark artikel
 */
export const getBookmarkStatus = (postSlug) => {
  if (typeof window === 'undefined' || !postSlug) return false;
  return localStorage.getItem(`blog_bookmarked_${postSlug}`) === 'true';
};

/**
 * 8. Toggle Bookmark artikel (Supabase + LocalStorage)
 */
export const toggleBookmark = async (postSlug) => {
  if (!postSlug) return false;

  const deviceId = getDeviceId();
  const currentlyBookmarked = getBookmarkStatus(postSlug);
  const nextBookmarked = !currentlyBookmarked;

  localStorage.setItem(`blog_bookmarked_${postSlug}`, String(nextBookmarked));

  try {
    if (supabase) {
      if (nextBookmarked) {
        await supabase
          .from('blog_bookmarks')
          .insert({ post_slug: postSlug, device_id: deviceId });
      } else {
        await supabase
          .from('blog_bookmarks')
          .delete()
          .eq('post_slug', postSlug)
          .eq('device_id', deviceId);
      }
    }
  } catch (err) {
    console.warn('⚠️ Supabase toggleBookmark offline/fallback:', err);
  }

  return nextBookmarked;
};

/**
 * 9. Catat Views artikel secara DINAMIS (Per sesi tab & persisten)
 */
export const recordView = async (postSlug, currentViews = 0) => {
  if (!postSlug || typeof window === 'undefined') return currentViews;

  const sessionKey = `viewed_${postSlug}`;
  const isAlreadyViewedInSession = sessionStorage.getItem(sessionKey);

  const metrics = getDynamicMetrics(postSlug, { views: currentViews });
  let nextViews = typeof metrics.views === 'number' ? metrics.views : currentViews;

  if (!isAlreadyViewedInSession) {
    sessionStorage.setItem(sessionKey, '1');
    nextViews += 1;
    setDynamicMetrics(postSlug, { views: nextViews });

    try {
      if (supabase) {
        await supabase.rpc('increment_blog_views', { target_slug: postSlug });
      }
    } catch (err) {
      // silently ignore view tracking errors
    }
  }

  return nextViews;
};

/**
 * 10. Ambil & Catat Shares artikel secara DINAMIS
 */
export const getShareCount = (postSlug, fallbackShares = 0) => {
  const metrics = getDynamicMetrics(postSlug, { shares: fallbackShares });
  return typeof metrics.shares === 'number' ? metrics.shares : fallbackShares;
};

export const recordShare = async (postSlug, currentShares = 0) => {
  if (!postSlug) return currentShares;

  const metrics = getDynamicMetrics(postSlug, { shares: currentShares });
  const baseShares = typeof metrics.shares === 'number' ? metrics.shares : currentShares;
  const nextShares = baseShares + 1;

  // Simpan secara lokal
  setDynamicMetrics(postSlug, { shares: nextShares });

  // Sync ke Supabase
  try {
    if (supabase) {
      await supabase.rpc('increment_blog_shares', { target_slug: postSlug });
    }
  } catch (err) {
    console.warn('⚠️ Supabase increment_blog_shares offline/fallback:', err);
  }

  return nextShares;
};

/**
 * 11. Cek & Berikan Rating Bintang (1–5) secara DINAMIS & INTERAKTIF
 */
export const getUserRating = (postSlug) => {
  if (typeof window === 'undefined' || !postSlug) return 0;
  const saved = localStorage.getItem(`blog_user_rating_${postSlug}`);
  return saved ? Number(saved) : 0;
};

export const submitRating = async (postSlug, newScore, currentRating = 5.0, totalRatings = 1) => {
  if (!postSlug || !newScore) {
    return { userRating: 0, rating: currentRating, totalRatings };
  }

  const deviceId = getDeviceId();
  const previousUserRating = getUserRating(postSlug);
  const metrics = getDynamicMetrics(postSlug, { rating: currentRating, totalRatings });

  const curRating = typeof metrics.rating === 'number' ? metrics.rating : (currentRating || 5.0);
  const curTotal = typeof metrics.totalRatings === 'number' ? metrics.totalRatings : (totalRatings || 1);

  let nextRating;
  let nextTotal;

  if (previousUserRating > 0) {
    // Pengguna mengupdate rating sebelumnya
    const totalScore = (curRating * curTotal) - previousUserRating + newScore;
    nextTotal = curTotal;
    nextRating = Math.max(1, Math.min(5, Math.round((totalScore / nextTotal) * 10) / 10));
  } else {
    // Pengguna baru pertama kali memberi rating
    const totalScore = (curRating * curTotal) + newScore;
    nextTotal = curTotal + 1;
    nextRating = Math.max(1, Math.min(5, Math.round((totalScore / nextTotal) * 10) / 10));
  }

  // Simpan pilihan user dan rating akumulasi secara persisten di localStorage
  localStorage.setItem(`blog_user_rating_${postSlug}`, String(newScore));
  setDynamicMetrics(postSlug, { rating: nextRating, totalRatings: nextTotal });

  // Sync ke Supabase
  try {
    if (supabase) {
      await supabase
        .from('blog_ratings')
        .upsert({
          post_slug: postSlug,
          device_id: deviceId,
          rating: newScore,
          updated_at: new Date().toISOString()
        }, { onConflict: 'post_slug,device_id' });

      await supabase.rpc('submit_blog_rating', {
        target_slug: postSlug,
        user_device_id: deviceId,
        score: newScore
      });
    }
  } catch (err) {
    console.warn('⚠️ Supabase submitRating offline/fallback:', err);
  }

  return {
    userRating: newScore,
    rating: nextRating,
    totalRatings: nextTotal
  };
};

/**
 * 12. Realtime Subscriptions untuk sinkronisasi dinamis multi-user/multi-tab
 */
export const subscribeToBlogPosts = (onUpdate) => {
  if (!supabase || typeof supabase.channel !== 'function') return () => {};
  try {
    const channel = supabase
      .channel('realtime:blog_posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
          if (typeof onUpdate === 'function') onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // ignore cleanup error
      }
    };
  } catch (err) {
    console.warn('Realtime subscribeToBlogPosts error:', err);
    return () => {};
  }
};

export const subscribeToComments = (postSlug, onComment) => {
  if (!supabase || typeof supabase.channel !== 'function' || !postSlug) return () => {};
  try {
    const channel = supabase
      .channel(`realtime:comments:${postSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blog_comments',
          filter: `post_slug=eq.${postSlug}`
        },
        (payload) => {
          if (payload?.new && typeof onComment === 'function') {
            onComment({
              id: payload.new.id,
              name: payload.new.name,
              email: payload.new.email,
              message: payload.new.message,
              avatar: payload.new.avatar,
              date: payload.new.created_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // ignore cleanup error
      }
    };
  } catch (err) {
    console.warn('Realtime subscribeToComments error:', err);
    return () => {};
  }
};
