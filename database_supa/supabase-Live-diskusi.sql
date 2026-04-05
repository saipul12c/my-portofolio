-- SQL Script Live Discussion (VERSI KOMPLIT & TERPROTEKSI)
-- Script ini menjaga 100% fitur asli (Achievements, Tags, Reply) + Perbaikan Keamanan & Akses

-- 1. Buat Tabel Users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  role TEXT DEFAULT 'USER' NOT NULL,
  status TEXT DEFAULT 'aktif' NOT NULL,
  message_count INTEGER DEFAULT 0 NOT NULL,
  last_reset DATE DEFAULT CURRENT_DATE NOT NULL,
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  bio TEXT DEFAULT 'Halo! Saya pengguna baru di Live Discussion.',
  custom_status TEXT DEFAULT '',
  is_shadowbanned BOOLEAN DEFAULT false NOT NULL,
  ban_reason TEXT DEFAULT NULL,
  mute_reason TEXT DEFAULT NULL
);

-- 2. Buat Tabel Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  reply_to JSONB,
  is_edited BOOLEAN DEFAULT false NOT NULL,
  status TEXT DEFAULT 'sent' NOT NULL,
  is_pinned BOOLEAN DEFAULT false NOT NULL,
  media_url TEXT,
  correlation_id TEXT, -- New: For optimistic UI matching
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 3. Tabel Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id TEXT,
    name TEXT,
    icon TEXT,
    points INTEGER DEFAULT 0,
    category TEXT,
    date_unlocked TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, achievement_id) -- Prevent duplicate achievements
);

-- 4. Tabel Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabel Reactions
CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(message_id, user_id, emoji)
);

-- 6. Tabel Reports
CREATE TABLE IF NOT EXISTS public.reports (
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6.1 Tabel Audit Logs (Security Tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    target_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'BAN', 'MUTE', 'SHADOWBAN', 'DELETE_MESSAGE'
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6.2 Tabel Appeals (User Fair Play)
CREATE TABLE IF NOT EXISTS public.appeals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6.5 Tabel Mentions (Notifikasi Aman)
CREATE TABLE IF NOT EXISTS public.mentions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- 7. Aktifkan RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;

-- 6. Kebijakan Keamanan (Policies)

-- Helper: Get Role Level (untuk hierarki akses)
CREATE OR REPLACE FUNCTION public.get_role_level(role_name TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE role_name 
    WHEN 'SUPER_ADMIN' THEN 10
    WHEN 'ADMIN' THEN 8
    WHEN 'MODERATOR' THEN 5
    WHEN 'PREMIUM' THEN 3
    WHEN 'VERIFIED' THEN 2
    ELSE 1
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper: Check if Caller can manage Target (Hierarchy Enforcement)
CREATE OR REPLACE FUNCTION public.is_admin_of(caller_id UUID, target_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  caller_role TEXT;
  target_role TEXT;
BEGIN
  IF caller_id = target_id THEN RETURN TRUE; END IF;
  SELECT role INTO caller_role FROM public.users WHERE id = caller_id;
  SELECT role INTO target_role FROM public.users WHERE id = target_id;
  
  -- Caller must be higher rank than Target
  RETURN get_role_level(caller_role) > get_role_level(target_role) 
         AND caller_role IN ('MODERATOR', 'ADMIN', 'SUPER_ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles: Mask email for regular users
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.users;
CREATE POLICY "Public profile view" ON public.users FOR SELECT USING (true);
-- Note: Email masking is implemented via column-level security (Grants) or Views.
-- For RLS row-level, we combine it with data masking logic in the Select policy if possible, 
-- but since Supabase doesn't support column RLS natively in Select Using, we use a VIEW later.

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE 
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() 
  AND get_role_level(me.role) > get_role_level(public.users.role)
  AND me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
));

DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;
CREATE POLICY "Users can delete own profile" ON public.users FOR DELETE 
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() 
  AND get_role_level(me.role) > get_role_level(public.users.role)
  AND me.role IN ('ADMIN', 'SUPER_ADMIN')
));

DROP POLICY IF EXISTS "Messages are viewable by everyone" ON public.messages;
CREATE POLICY "Messages are viewable by everyone" ON public.messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
CREATE POLICY "Authenticated users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can manage own messages" ON public.messages;
CREATE POLICY "Users can manage own messages" ON public.messages FOR ALL USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() 
  AND get_role_level(me.role) >= 4 -- MODERATOR or higher can manage messages
));

DROP POLICY IF EXISTS "View achievements" ON public.achievements;
CREATE POLICY "View achievements" ON public.achievements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can unlock own achievements" ON public.achievements;
CREATE POLICY "Users can unlock own achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id OR get_role_level((SELECT role FROM public.users WHERE id = auth.uid())) >= 4);

DROP POLICY IF EXISTS "View tags" ON public.tags;
CREATE POLICY "View tags" ON public.tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Post tags" ON public.tags;
CREATE POLICY "Post tags" ON public.tags FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid()); -- Paksa cek user_id

-- New Policies for Reactions & Reports
DROP POLICY IF EXISTS "View reactions" ON public.reactions;
CREATE POLICY "View reactions" ON public.reactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Post reactions" ON public.reactions;
CREATE POLICY "Post reactions" ON public.reactions FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());
DROP POLICY IF EXISTS "Delete own reactions" ON public.reactions;
CREATE POLICY "Delete own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "View reports" ON public.reports;
CREATE POLICY "View reports" ON public.reports FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() AND me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
));
CREATE POLICY "Submit reports" ON public.reports FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND reporter_id = auth.uid());

-- Mentions Policies
CREATE POLICY "Users can view own mentions" ON public.mentions FOR SELECT USING (auth.uid() = target_id);
CREATE POLICY "System/Users can insert mentions" ON public.mentions FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND sender_id = auth.uid());
CREATE POLICY "Users can mark own mentions as read" ON public.mentions FOR UPDATE USING (auth.uid() = target_id);

-- Audit Logs Policies (Admin Only)
CREATE POLICY "View audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND get_role_level(me.role) >= 4)
);

-- Appeals Policies
CREATE POLICY "Users can view own appeals" ON public.appeals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit appeals" ON public.appeals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage appeals" ON public.appeals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND get_role_level(me.role) >= 4)
);


-- 7. Fungsi & Trigger (Otomatisasi)

-- A. Sinkronisasi User dari Auth (SECURITY DEFINER untuk Bypass RLS saat pendaftaran)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, nama, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    'USER'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nama = COALESCE(EXCLUDED.nama, users.nama);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- B. Verifikasi Identitas & Limitasi (Anti-Spoofing & Rate Limiting)
CREATE OR REPLACE FUNCTION public.handle_message_security()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
    user_status TEXT;
    user_mute_until TIMESTAMP WITH TIME ZONE;
    user_limit INTEGER;
    current_count INTEGER;
BEGIN
    -- 1. Paksa User ID asli dari Auth
    new.user_id := auth.uid();
    
    -- 2. Ambil data asli dari tabel users (Anti-Spoofing & Moderation Check)
    SELECT role, nama, message_count, status, mute_until 
    INTO user_role, new.username, current_count, user_status, user_mute_until
    FROM public.users WHERE id = auth.uid();
    
    -- 3. Verifikasi Profil & Moderasi
    IF user_role IS NULL THEN
        RAISE EXCEPTION 'Profil belum siap. Silakan tunggu 1 detik atau login kembali.';
    END IF;

    IF user_status = 'nonaktif' OR user_status = 'banned' THEN
        RAISE EXCEPTION 'Akun Anda telah dinonaktifkan atau dibanned dari diskusi.';
    END IF;

    IF user_mute_until IS NOT NULL AND user_mute_until > now() THEN
        RAISE EXCEPTION 'Muted: %. Alasan: %', user_mute_until, (SELECT mute_reason FROM public.users WHERE id = auth.uid());
    END IF;

    IF user_status = 'banned' THEN
        RAISE EXCEPTION 'Banned: %. Mohon ajukan banding jika Anda merasa ini adalah kesalahan.', (SELECT ban_reason FROM public.users WHERE id = auth.uid());
    END IF;

    -- 4. Tetapkan Role asli (Mencegah user ngaku-ngaku Admin)
    new.role := user_role;

    -- 5. Cek Rate Limit (Backend Enforcement)
    user_limit := CASE 
        WHEN user_role = 'SUPER_ADMIN' THEN 999999
        WHEN user_role = 'ADMIN' THEN 500
        WHEN user_role = 'MODERATOR' THEN 100
        WHEN user_role = 'PREMIUM' THEN 50
        WHEN user_role = 'VERIFIED' THEN 10
        ELSE 5 
    END;

    IF current_count >= user_limit THEN
        RAISE EXCEPTION 'Limit pesan tercapai. Silakan coba lagi bulan depan atau upgrade akun Anda.';
    END IF;

    -- 6. Set timestamp otomatis & Metadata
    new.timestamp := EXTRACT(EPOCH FROM now()) * 1000;

    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_message_before_insert ON public.messages;
CREATE TRIGGER on_message_before_insert
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_message_security();

-- C. Hitung Pesan & Achievements Otomatis (After Insert)
CREATE OR REPLACE FUNCTION public.handle_message_inserted_logic()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
    new_count INTEGER;
BEGIN
  -- 1. Increment message count
  UPDATE public.users 
  SET message_count = message_count + 1 
  WHERE id = new.user_id
  RETURNING message_count INTO new_count;

  -- 2. Unlock Achievements Otomatis
  -- Case 1: First Message
  IF new_count = 1 THEN
    INSERT INTO public.achievements (user_id, achievement_id, name, icon, points, category)
    VALUES (new.user_id, 'first_message', 'Peserta Baru', '🚀', 10, 'global')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- Case 2: 10 Messages
  IF new_count = 10 THEN
    INSERT INTO public.achievements (user_id, achievement_id, name, icon, points, category)
    VALUES (new.user_id, 'tenth_message', 'Pengamat Handal', '🧐', 25, 'global')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_message_inserted_logic();

-- D. Otomasi Reset Pesan
CREATE OR REPLACE FUNCTION public.reset_monthly_message_counts()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users SET message_count = 0, last_reset = CURRENT_DATE;
END;
$$;

-- Aktifkan ekstensi agar bisa menjadwalkan reset bulanan
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('reset-monthly-counts', '0 0 1 * *', $$
  SELECT public.reset_monthly_message_counts();
$$);

-- D. Cleanup / Archiving (Untuk menangani data milyaran)
CREATE OR REPLACE FUNCTION public.archive_old_messages(days_to_keep INTEGER)
RETURNS integer 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.messages 
    WHERE created_at < (now() - (days_to_keep || ' days')::interval);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- F. Statistik Dashboard Server-Side (High Performance & Secure)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    caller_role TEXT;
    total_users INTEGER;
    active_users INTEGER;
    total_messages INTEGER;
    today_messages INTEGER;
BEGIN
    -- Security Check: Only Moderator and up can access stats
    SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
    
    IF get_role_level(caller_role) < 4 OR caller_role IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Operasi ini memerlukan hak akses administratif.';
    END IF;

    SELECT count(*) INTO total_users FROM public.users;
    SELECT count(*) INTO active_users FROM public.users WHERE status = 'aktif' OR status = 'active';
    SELECT count(*) INTO total_messages FROM public.messages;
    SELECT count(*) INTO today_messages FROM public.messages WHERE created_at >= CURRENT_DATE;
    
    RETURN json_build_object(
        'totalUsers', total_users,
        'activeUsers', active_users,
        'totalMessages', total_messages,
        'todayMessages', today_messages
    );
END;
$$;

-- 8. Izin Akses (Grants - Principle of Least Privilege)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

-- Grant minimal permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Tables
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.messages TO authenticated, anon;
GRANT INSERT ON public.messages TO authenticated;
GRANT SELECT ON public.achievements TO authenticated, anon;
GRANT SELECT ON public.tags TO authenticated, anon;
GRANT INSERT ON public.tags TO authenticated;

-- Functions
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats TO authenticated;

-- 9. View Khusus untuk Email Privacy
CREATE OR REPLACE VIEW public.profiles AS
SELECT 
    id, 
    nama, 
    role, 
    status, 
    message_count, 
    bio,
    custom_status,
    mute_until,
    is_shadowbanned,
    tanggal_daftar,
    ban_reason,
    mute_reason,
    -- Email PRIVACY check
    CASE 
        WHEN auth.uid() = id OR (SELECT get_role_level(role) FROM public.users WHERE id = auth.uid()) >= 4 
        THEN email 
        ELSE NULL 
    END as email
FROM public.users;

GRANT SELECT ON public.profiles TO authenticated;

-- 9. Indeks Performa
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON public.messages(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON public.reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);

-- BRIN Index untuk Skala Masif (Milyaran Data)
-- BRIN sangat efisien untuk data yang diinsert berurutan berdasarkan waktu
CREATE INDEX IF NOT EXISTS idx_messages_brin_time ON public.messages USING BRIN (created_at);
CREATE INDEX IF NOT EXISTS idx_messages_brin_timestamp ON public.messages USING BRIN (timestamp);

-- SELESAI

-------------------------------------------------------------------------------
-- SEED DATA UNTUK PENGETESAN (OPSIONAL)
-------------------------------------------------------------------------------
-- Jalankan bagian ini jika Anda ingin mengisi database dengan akun contoh.
-- Akun: superadmin@test.com, admin@test.com, mod@test.com, user@test.com
-- Password Default: LiveTest123! (Semua akun menggunakan password ini)
-------------------------------------------------------------------------------

-- 1. Tambahkan Akun ke auth.users (ID manual agar konsisten untuk testing)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, instance_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'superadmin@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Sang Arsitek"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Penjaga Gerbang"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('00000000-0000-0000-0000-000000000003', 'mod@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Moderator Alpha"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('00000000-0000-0000-0000-000000000004', 'premium@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Sultan Diskusi"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('00000000-0000-0000-0000-000000000005', 'verified@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Warga Terverifikasi"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('00000000-0000-0000-0000-000000000006', 'user@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Pengunjung Baru"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- Catatan: Trigger on_auth_user_created akan otomatis mengisi tabel public.users.
-- Namun kita perlu update Role-nya secara manual karena defaultnya adalah 'USER'.

-- 2. Update Role di public.users
UPDATE public.users SET role = 'SUPER_ADMIN' WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.users SET role = 'ADMIN' WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.users SET role = 'MODERATOR' WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE public.users SET role = 'PREMIUM' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE public.users SET role = 'VERIFIED' WHERE id = '00000000-0000-0000-0000-000000000005';

-- 3. Tambahkan Pesan Contoh
INSERT INTO public.messages (user_id, username, content, role, timestamp)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Sang Arsitek', 'Halo semuanya! Selamat datang di sistem Live Discussion yang baru.', 'SUPER_ADMIN', EXTRACT(EPOCH FROM now()) * 1000),
  ('00000000-0000-0000-0000-000000000002', 'Penjaga Gerbang', 'Hai Arsitek! Sistem sudah berjalan stabil. Saya akan memantau keamanan.', 'ADMIN', (EXTRACT(EPOCH FROM now()) * 1000) + 1000),
  ('00000000-0000-0000-0000-000000000004', 'Sultan Diskusi', 'Wah, tampilannya keren banget! Pakai glassmorphism ya?', 'PREMIUM', (EXTRACT(EPOCH FROM now()) * 1000) + 2000),
  ('00000000-0000-0000-0000-000000000003', 'Moderator Alpha', 'Tolong jaga bahasa ya teman-teman agar diskusi tetap sehat.', 'MODERATOR', (EXTRACT(EPOCH FROM now()) * 1000) + 3000),
  ('00000000-0000-0000-0000-000000000006', 'Pengunjung Baru', 'Izin gabung min, saya baru pertama kali di sini.', 'USER', (EXTRACT(EPOCH FROM now()) * 1000) + 4000);

-- 4. Tambahkan Achievement Contoh
INSERT INTO public.achievements (user_id, achievement_id, name, icon, points, category)
VALUES 
  ('00000000-0000-0000-0000-000000000006', 'first_message', 'Peserta Baru', '🚀', 10, 'global'),
  ('00000000-0000-0000-0000-000000000001', 'admin_community_builder', 'Pembangun Komunitas', '🏢', 100, 'admin');

-- -- upgraget akun email
-- UPDATE public.users 
-- SET role = 'SUPER_ADMIN' 
-- WHERE email = 'ucup7@gmail.com';
