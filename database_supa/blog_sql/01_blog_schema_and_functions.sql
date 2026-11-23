-- ==============================================================================
-- 🚀 SUPABASE SCHEMA, RPC FUNCTIONS & POLICIES FOR BLOG SYSTEM
-- ==============================================================================
-- File: 01_blog_schema_and_functions.sql
-- Urutan Eksekusi: Jalankan file ini PERTAMA di Supabase SQL Editor
-- ==============================================================================

-- 1. Tabel Utama: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  url TEXT,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL,
  author_avatar TEXT,
  author_bio TEXT,
  author_link TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published',
  thumbnail TEXT,
  image_full TEXT,
  cover_video TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  labels JSONB DEFAULT '[]'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  read_time TEXT,
  word_count INTEGER DEFAULT 0,
  reading_level TEXT DEFAULT 'mudah',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  total_ratings INTEGER DEFAULT 1,
  featured BOOLEAN DEFAULT FALSE,
  series TEXT,
  source TEXT,
  language TEXT DEFAULT 'id',
  translations JSONB DEFAULT '{}'::jsonb,
  canonical_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  related_posts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Komentar: blog_comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id TEXT UNIQUE,
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Suka: blog_likes (Dukungan perangkat anonim & user login)
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_blog_like UNIQUE (post_slug, device_id)
);

-- 4. Tabel Simpan/Bookmark: blog_bookmarks
CREATE TABLE IF NOT EXISTS public.blog_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_blog_bookmark UNIQUE (post_slug, device_id)
);

-- 5. Tabel Rating: blog_ratings (Dukungan rating bintang 1-5 per perangkat)
CREATE TABLE IF NOT EXISTS public.blog_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_blog_rating UNIQUE (post_slug, device_id)
);

-- Indexing Performa Tinggi
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON public.blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_slug ON public.blog_comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON public.blog_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_likes_lookup ON public.blog_likes(post_slug, device_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_lookup ON public.blog_bookmarks(post_slug, device_id);
CREATE INDEX IF NOT EXISTS idx_blog_ratings_lookup ON public.blog_ratings(post_slug, device_id);

-- ==============================================================================
-- ⚙️ ATOMIC RPC FUNCTIONS
-- ==============================================================================

-- 1. Tambah Views Post
CREATE OR REPLACE FUNCTION public.increment_blog_views(target_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = COALESCE(views, 0) + 1
  WHERE slug = target_slug;
END;
$$;

-- 2. Tambah Like Post
CREATE OR REPLACE FUNCTION public.increment_blog_likes(target_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.blog_posts
  SET likes = COALESCE(likes, 0) + 1
  WHERE slug = target_slug;
END;
$$;

-- 3. Kurangi Like Post
CREATE OR REPLACE FUNCTION public.decrement_blog_likes(target_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.blog_posts
  SET likes = GREATEST(COALESCE(likes, 0) - 1, 0)
  WHERE slug = target_slug;
END;
$$;

-- 4. Tambah Share Post
CREATE OR REPLACE FUNCTION public.increment_blog_shares(target_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.blog_posts
  SET shares = COALESCE(shares, 0) + 1
  WHERE slug = target_slug;
END;
$$;

-- 5. Submit Rating & Kalkulasi Rata-rata Dinamis
CREATE OR REPLACE FUNCTION public.submit_blog_rating(target_slug TEXT, user_device_id TEXT, score NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_avg NUMERIC;
  v_count INTEGER;
BEGIN
  INSERT INTO public.blog_ratings (post_slug, device_id, rating, updated_at)
  VALUES (target_slug, user_device_id, score, NOW())
  ON CONFLICT (post_slug, device_id)
  DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW();

  SELECT ROUND(AVG(rating)::numeric, 1), COUNT(*)
  INTO new_avg, v_count
  FROM public.blog_ratings
  WHERE post_slug = target_slug;

  UPDATE public.blog_posts
  SET rating = COALESCE(new_avg, score),
      total_ratings = COALESCE(v_count, 1),
      updated_at = NOW()
  WHERE slug = target_slug;

  RETURN new_avg;
END;
$$;

-- ==============================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_ratings ENABLE ROW LEVEL SECURITY;

-- Policy Blog Posts: Siapa saja dapat membaca artikel
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" 
  ON public.blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can insert blog posts" 
  ON public.blog_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can update blog posts" 
  ON public.blog_posts FOR UPDATE USING (true);

-- Policy Comments: Siapa saja dapat melihat dan menambahkan komentar
DROP POLICY IF EXISTS "Public can view comments" ON public.blog_comments;
CREATE POLICY "Public can view comments" 
  ON public.blog_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can post comments" ON public.blog_comments;
CREATE POLICY "Public can post comments" 
  ON public.blog_comments FOR INSERT WITH CHECK (true);

-- Policy Likes: Publik dapat melihat dan mengelola data suka
DROP POLICY IF EXISTS "Public can read likes" ON public.blog_likes;
CREATE POLICY "Public can read likes" 
  ON public.blog_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert likes" ON public.blog_likes;
CREATE POLICY "Public can insert likes" 
  ON public.blog_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete likes" ON public.blog_likes;
CREATE POLICY "Public can delete likes" 
  ON public.blog_likes FOR DELETE USING (true);

-- Policy Bookmarks: Publik dapat melihat dan mengelola bookmark
DROP POLICY IF EXISTS "Public can read bookmarks" ON public.blog_bookmarks;
CREATE POLICY "Public can read bookmarks" 
  ON public.blog_bookmarks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert bookmarks" ON public.blog_bookmarks;
CREATE POLICY "Public can insert bookmarks" 
  ON public.blog_bookmarks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete bookmarks" ON public.blog_bookmarks;
CREATE POLICY "Public can delete bookmarks" 
  ON public.blog_bookmarks FOR DELETE USING (true);

-- Policy Ratings: Publik dapat melihat dan memberikan rating
DROP POLICY IF EXISTS "Public can read ratings" ON public.blog_ratings;
CREATE POLICY "Public can read ratings" 
  ON public.blog_ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert ratings" ON public.blog_ratings;
CREATE POLICY "Public can insert ratings" 
  ON public.blog_ratings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update ratings" ON public.blog_ratings;
CREATE POLICY "Public can update ratings" 
  ON public.blog_ratings FOR UPDATE USING (true);

-- ==============================================================================
-- 🔑 PERMISSIONS & GRANTS (Mencegah Error 42501 "permission denied for table")
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Tabel Blog
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;

GRANT SELECT, INSERT ON public.blog_comments TO anon, authenticated;
GRANT UPDATE, DELETE ON public.blog_comments TO authenticated;

GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON public.blog_ratings TO anon, authenticated;
GRANT DELETE ON public.blog_ratings TO authenticated;

-- RPC Functions Blog
GRANT EXECUTE ON FUNCTION public.increment_blog_views(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_blog_likes(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_blog_likes(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_blog_shares(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_blog_rating(TEXT, TEXT, NUMERIC) TO anon, authenticated;

-- ==============================================================================
-- 📡 REALTIME CONFIGURATION
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'blog_posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'blog_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_comments;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Publication might not exist in non-supabase pg instances
END $$;
