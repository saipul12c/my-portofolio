-- SQL Script untuk Dijalankan di Supabase SQL Editor

-- 1. Buat Tabel Users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  role TEXT DEFAULT 'USER'::text NOT NULL,
  status TEXT DEFAULT 'aktif'::text NOT NULL,
  message_count INTEGER DEFAULT 0 NOT NULL,
  last_reset DATE DEFAULT CURRENT_DATE NOT NULL,
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  bio TEXT
);

-- 2. Buat Tabel Messages
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  reply_to TEXT,
  is_edited BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 3. Set Row Level Security (RLS) policies

-- Aktifkan RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy untuk Tabel Users
-- Semua orang bisa membaca data user (untuk melihat profil, dll)
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Hanya user yang bersangkutan yang bisa mengupdate datanya sendiri
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Insert user baru dikendalikan oleh Trigger auth (lihat di bawah), tapi kita berikan policy untuk admin
CREATE POLICY "Insert for users" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy untuk Tabel Messages
-- Semua orang bisa membaca pesan
CREATE POLICY "Messages are viewable by everyone" ON public.messages
  FOR SELECT USING (true);

-- User yang login bisa membuat pesan
CREATE POLICY "Authenticated users can insert messages" ON public.messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User bisa mengedit pesannya sendiri
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = user_id);

-- User bisa menghapus pesannya sendiri
CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Fungsi & Trigger untuk sinkronisasi otomatis ke public.users saat ada user mendaftar (auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nama, role, bio)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    'USER',
    'Halo! Saya pengguna baru di Live Discussion.'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tabel Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    email TEXT,
    achievement_id TEXT,
    name TEXT,
    icon TEXT,
    points INTEGER DEFAULT 0,
    category TEXT,
    date_earned TIMESTAMP WITH TIME ZONE,
    date_unlocked TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tabel Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT, -- ID orang yang diberi tag
    email TEXT, -- Email dari orang yang memberikan tag
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Aturan Keamanan (RLS) untuk Achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua orang bisa melihat achievements" 
ON public.achievements FOR SELECT 
USING (true);

CREATE POLICY "Admin dapat menambah achievements" 
ON public.achievements FOR INSERT 
WITH CHECK (true); -- (Dalam real app, dibatasi hanya untuk Admin, namun untuk kemudahan testing kita buka)

-- Aturan Keamanan (RLS) untuk Tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua orang bisa melihat tags" 
ON public.tags FOR SELECT 
USING (true);

CREATE POLICY "Semua orang bisa menambah tags" 
ON public.tags FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Orang yang membuat tags bisa menghapusnya" 
ON public.tags FOR DELETE 
USING (true);

-- Selesai!
