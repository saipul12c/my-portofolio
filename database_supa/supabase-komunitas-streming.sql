-- FINAL CONSOLIDATED MIGRATION: Schema + Full Data + RLS + Extensions
-- This script merges all previous migration steps into a single source of truth.
-- Run this in your Supabase SQL Editor.

-- ==========================================
-- 0. CLEANUP (Optional: Uncomment if you want a fresh start)
-- ==========================================
-- DROP TABLE IF EXISTS public.video_comments CASCADE;
-- DROP TABLE IF EXISTS public.video_shorts CASCADE;
-- DROP TABLE IF EXISTS public.videos CASCADE;
-- DROP TABLE IF EXISTS public.communities CASCADE;

-- ==========================================
-- 1. Communities Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Track owner
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    members INTEGER DEFAULT 0,
    location TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_website TEXT,
    social_media_facebook TEXT,
    social_media_twitter TEXT,
    social_media_instagram TEXT,
    social_media_linkedin TEXT,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are viewable by everyone" 
ON public.communities FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create communities" 
ON public.communities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners can update their communities" 
ON public.communities FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their communities" 
ON public.communities FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 2. Streaming - Videos Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Track owner/uploader
    title TEXT NOT NULL,
    channel TEXT NOT NULL,
    views_text TEXT DEFAULT '0 views',
    upload_time TEXT DEFAULT 'Recently',
    duration TEXT,
    thumbnail TEXT,
    video_url TEXT,
    channel_logo TEXT,
    is_verified BOOLEAN DEFAULT false,
    subscribers TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    description TEXT,
    progress INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    category TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    quality TEXT[] DEFAULT '{"360p", "480p", "720p", "1080p"}',
    has_captions BOOLEAN DEFAULT true,
    is_live BOOLEAN DEFAULT false,
    live_viewers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone" 
ON public.videos FOR SELECT USING (true);

CREATE POLICY "Owners can update their videos" 
ON public.videos FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their videos" 
ON public.videos FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 3. Streaming - Video Shorts Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.video_shorts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    channel TEXT,
    thumbnail TEXT,
    duration TEXT,
    views TEXT DEFAULT '0 views',
    video_url TEXT,
    channel_logo TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    music_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Shorts
ALTER TABLE public.video_shorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shorts are viewable by everyone" 
ON public.video_shorts FOR SELECT USING (true);

-- ==========================================
-- 4. Streaming - Video Comments Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.video_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    -- user_id references auth.users which is handled by Supabase Auth
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, 
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Video Comments
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
ON public.video_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post comments" 
ON public.video_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- 5. User Profiles Cleanup & Extensions
-- ==========================================
-- Note: 'users' table usually exists in 'public', but 'auth.users' is managed by Supabase.
-- This part assumes you have a public.users pattern or similar.
-- We'll add it to auth.users if needed or public if you use a profile table.
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'public' AND TABLE_NAME = 'users') THEN
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME='avatar_url') THEN
            ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
        END IF;
    END IF;
END $$;

-- ==========================================
-- 6. FULL DATA SEEDING (Merged & Exhaustive)
-- ==========================================

-- --- Communities ---
INSERT INTO public.communities (name, description, category, members, tags, is_active)
VALUES 
('Komunitas React Indonesia', 'Wadah berkumpulnya developer React di Indonesia untuk berbagi ilmu dan projek.', 'Programming', 1250, '{"react", "javascript", "frontend"}', true),
('UI/UX Design ID', 'Komunitas desain antarmuka dan pengalaman pengguna terbesar di Indonesia.', 'Design', 850, '{"ui", "ux", "figma", "design"}', true),
('Backend Dev Indonesia', 'Diskusi mendalam tentang sistem backend, database, dan arsitektur server.', 'Programming', 920, '{"node", "golang", "database", "backend"}', true)
ON CONFLICT DO NOTHING;

-- --- Videos ---
INSERT INTO public.videos (title, channel, views_text, upload_time, duration, thumbnail, video_url, channel_logo, is_verified, subscribers, likes_count, comments_count, description, progress, is_new, category, tags)
VALUES 
('Learn React 19 in 60 Minutes - Full Tutorial with Hooks, State, and Effects', 'React Mastery', '1.2M views', '2 days ago', '12:45', '/videos/thumbnails/react-tutorial.jpg', '/videos/sample1.mp4', 'https://i.pravatar.cc/40?img=7', true, '2.3M', 125000, 4238, 'In this comprehensive React 19 tutorial, we cover everything...', 65, true, '{"Programming", "React"}', '{"react", "javascript", "frontend"}'),
('Building Modern UI with Tailwind CSS - Complete Guide 2024', 'CSS Pro', '850K views', '1 week ago', '24:30', '/videos/thumbnails/tailwind-css.jpg', '/videos/sample2.mp4', 'https://i.pravatar.cc/40?img=8', true, '1.1M', 89000, 2145, 'Master Tailwind CSS with this complete guide.', 0, false, '{"Programming", "CSS"}', '{"tailwind", "css", "frontend"}'),
('JavaScript Advanced Patterns 2024 - Factory, Singleton, Observer', 'JS Wizard', '2.1M views', '3 days ago', '45:15', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop', NULL, 'https://i.pravatar.cc/40?img=9', true, '3.4M', 210000, 8756, 'Deep dive into advanced JavaScript patterns...', 30, false, '{"Programming", "JavaScript"}', '{"patterns", "architecture"}'),
('LIVE: Build a Real-time Chat App with Socket.io', 'Web Dev Live', '15K watching now', 'Live', 'LIVE', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop', NULL, 'https://i.pravatar.cc/40?img=10', true, '450K', 42000, 1234, 'Live coding session: Building a real-time chat application...', 0, false, '{"Programming", "Live"}', '{"socket.io", "realtime"}'),
('How I Built a Million Dollar SaaS in 30 Days', 'Startup Stories', '3.4M views', '2 weeks ago', '25:45', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop', NULL, 'https://i.pravatar.cc/40?img=11', true, '5.2M', 350000, 12456, 'Complete journey of building a SaaS product...', 0, false, '{"Business", "Startup"}', '{"saas", "business"}'),
('TypeScript for React Developers - Full Type Safety Guide', 'TypeScript Pro', '980K views', '4 days ago', '38:45', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop', NULL, 'https://i.pravatar.cc/40?img=12', true, '1.8M', 95000, 3421, 'Master TypeScript with React.', 0, false, '{"Programming", "TypeScript"}', '{"typescript", "react"}'),
('Node.js Backend Architecture - Microservices & REST API', 'Backend Master', '1.5M views', '1 month ago', '1:05:20', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop', NULL, 'https://i.pravatar.cc/40?img=15', true, '2.9M', 180000, 6789, 'Learn Node.js backend architecture.', 80, false, '{"Programming", "Backend"}', '{"node", "microservices"}'),
('Python Data Science - Machine Learning Tutorial 2024', 'Data Science Pro', '2.8M views', '3 weeks ago', '55:10', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop', NULL, 'https://i.pravatar.cc/40?img=16', true, '4.1M', 310000, 9876, 'Complete Python data science tutorial.', 0, false, '{"Programming", "Data Science"}', '{"python", "ml"}'),
('Kehidupan Kampus', 'Tim Media Edukasi', '15.8K views', '2024-04-02', '02:45', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://randomuser.me/api/portraits/men/40.jpg', true, '12.5K', 4200, 85, 'Cuplikan video pendek tentang suasana belajar mahasiswa.', 0, false, '{"Education"}', '{"kampus", "mahasiswa"}'),
('Belajar Digital', 'Media EduTech', '12.3K views', '2024-07-01', '03:10', 'https://www.w3schools.com/html/movie.mp4', 'https://www.w3schools.com/html/movie.mp4', 'https://randomuser.me/api/portraits/men/33.jpg', true, '10.4K', 3100, 50, 'Projek media pembelajaran berbasis video animatif.', 0, false, '{"Project"}', '{"digital", "animation"}')
ON CONFLICT DO NOTHING;

-- --- Shorts ---
INSERT INTO public.video_shorts (title, channel, views, duration, thumbnail, video_url, channel_logo, likes_count, music_info)
VALUES 
('React useState in 60 seconds', 'React Tips', '2.5M views', '0:58', '/videos/thumbnails/short1.jpg', '/videos/shorts/short1.mp4', 'https://i.pravatar.cc/40?img=17', 125000, 'Original sound - React Tips'),
('CSS Grid vs Flexbox - Which one?', 'CSS Master', '1.8M views', '0:45', '/videos/thumbnails/short2.jpg', '/videos/shorts/short2.mp4', 'https://i.pravatar.cc/40?img=18', 98000, 'Trending sound - CSS Master'),
('JavaScript Array Methods Explained', 'JS Guru', '3.2M views', '0:52', '/videos/thumbnails/short3.jpg', '/videos/shorts/short3.mp4', 'https://i.pravatar.cc/40?img=19', 210000, 'Original sound - JS Guru'),
('Ngoding 10 Detik', 'DevShort Indonesia', '82.3K views', '0:10', '/thumbnails/short1.jpg', '/videos/mov_bbb.mp4', '/avatars/devshort1.jpg', 5200, 'Campus Vibes'),
('Debugging Kilat', 'JS Ninja', '54K views', '0:15', '/thumbnails/short2.jpg', '/videos/movie.mp4', '/avatars/jsninja.jpg', 4300, 'Digital Flow'),
('React Tips 30 Detik', 'React Guru', '65K views', '0:30', '/thumbnails/short3.jpg', '/videos/react_tips.mp4', '/avatars/reactguru.jpg', 5300, 'Original sound'),
('TikTok JavaScript Hack', 'DevShort TikTok', '48K views', '0:20', '/thumbnails/short4.jpg', '/videos/tiktok_js_hack.mp4', '/avatars/devshort2.jpg', 3900, 'Trending music')
ON CONFLICT DO NOTHING;
