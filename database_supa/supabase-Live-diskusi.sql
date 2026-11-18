-- ==============================================================================
-- SQL SCRIPT LIVE DISCUSSION (VERSI SEMPURNA & TERPROTEKSI)
-- Mendukung 100% Fitur Halaman Live-Discussion & Dashboard Moderasi
-- ==============================================================================

-- 1. Buat Tabel Users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  role TEXT DEFAULT 'USER' NOT NULL,
  status TEXT DEFAULT 'aktif' NOT NULL, -- 'aktif', 'nonaktif', 'banned'
  message_count INTEGER DEFAULT 0 NOT NULL,
  last_reset DATE DEFAULT CURRENT_DATE NOT NULL,
  tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  bio TEXT DEFAULT 'Halo! Saya pengguna baru di Live Discussion.',
  custom_status TEXT DEFAULT '',
  is_shadowbanned BOOLEAN DEFAULT false NOT NULL,
  mute_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  mute_reason TEXT DEFAULT NULL,
  ban_reason TEXT DEFAULT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CONSTRAINT nama_length_check CHECK (char_length(nama) <= 50),
  CONSTRAINT bio_length_check CHECK (char_length(bio) <= 500),
  CONSTRAINT status_length_check CHECK (char_length(custom_status) <= 100)
);

-- Migrasi jika tabel sudah terbuat sebelumnya
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ban_reason TEXT DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

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
  correlation_id TEXT, -- Optimistic UI matching
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  timestamp BIGINT NOT NULL,
  CONSTRAINT content_length_check CHECK (char_length(content) <= 3000)
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_shadowbanned ON public.users(is_shadowbanned);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- 3. Tabel Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id TEXT,
    name TEXT,
    icon TEXT,
    description TEXT,
    points INTEGER DEFAULT 0,
    category TEXT,
    date_unlocked TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS description TEXT;

-- 4. Tabel Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    color TEXT DEFAULT 'cyan',
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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    reporter_id UUID CONSTRAINT reports_reporter_id_fkey REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6.1 Tabel Audit Logs (Security Tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID CONSTRAINT audit_logs_admin_id_fkey REFERENCES public.users(id) ON DELETE SET NULL,
    target_id UUID CONSTRAINT audit_logs_target_id_fkey REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'BAN', 'MUTE', 'SHADOWBAN', 'DELETE_MESSAGE', 'ROLE_CHANGE', 'DELETE_USER'
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

-- 6.3 Tabel Mentions (Notifikasi Aman)
CREATE TABLE IF NOT EXISTS public.mentions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(message_id, target_id)
);

-- 6.4 Tabel System Config (Pusat Pengaturan Dinamis)
CREATE TABLE IF NOT EXISTS public.system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed initial config
INSERT INTO public.system_config (key, value) VALUES 
('message_limits', '{
    "SUPER_ADMIN": 999999,
    "ADMIN": 500,
    "MODERATOR": 100,
    "PREMIUM": 50,
    "VERIFIED": 25,
    "USER": 5
}'::jsonb),
('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 7. Aktifkan Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Helper: Get Role Level
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

-- Helper: Check if Caller can manage Target
CREATE OR REPLACE FUNCTION public.is_admin_of(caller_id UUID, target_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  caller_role TEXT;
  target_role TEXT;
BEGIN
  IF caller_id = target_id THEN RETURN TRUE; END IF;
  SELECT role INTO caller_role FROM public.users WHERE id = caller_id;
  SELECT role INTO target_role FROM public.users WHERE id = target_id;
  
  RETURN get_role_level(caller_role) > get_role_level(target_role) 
         AND caller_role IN ('MODERATOR', 'ADMIN', 'SUPER_ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==============================================================================
-- Kebijakan Keamanan (RLS Policies)
-- ==============================================================================

-- Users Policies
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.users;
CREATE POLICY "Public can view basic profiles" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE 
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() 
  AND get_role_level(me.role) > get_role_level(public.users.role)
  AND me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
))
WITH CHECK (auth.uid() = id OR EXISTS (
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

-- Messages Policies
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON public.messages;
CREATE POLICY "Messages are viewable by everyone" ON public.messages FOR SELECT USING (
  NOT EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = public.messages.user_id 
    AND u.is_shadowbanned = true
  ) 
  OR auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.users me 
    WHERE me.id = auth.uid() 
    AND (me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR'))
  )
);

DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
CREATE POLICY "Authenticated users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can manage own messages" ON public.messages;
CREATE POLICY "Users can manage own messages" ON public.messages FOR ALL USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.users me 
    WHERE me.id = auth.uid() 
    AND get_role_level(me.role) >= 5 -- MODERATOR atau lebih tinggi
  )
);

-- Achievements Policies
DROP POLICY IF EXISTS "View achievements" ON public.achievements;
CREATE POLICY "View achievements" ON public.achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can unlock own achievements" ON public.achievements;
CREATE POLICY "Users can unlock own achievements" ON public.achievements FOR INSERT WITH CHECK (
  auth.uid() = user_id OR get_role_level((SELECT role FROM public.users WHERE id = auth.uid())) >= 5
);

-- Tags Policies
DROP POLICY IF EXISTS "View tags" ON public.tags;
CREATE POLICY "View tags" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Post tags" ON public.tags;
CREATE POLICY "Post tags" ON public.tags FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Reactions Policies
DROP POLICY IF EXISTS "View reactions" ON public.reactions;
CREATE POLICY "View reactions" ON public.reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Post reactions" ON public.reactions;
CREATE POLICY "Post reactions" ON public.reactions FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

DROP POLICY IF EXISTS "Delete own reactions" ON public.reactions;
CREATE POLICY "Delete own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- Reports Policies
DROP POLICY IF EXISTS "View reports" ON public.reports;
CREATE POLICY "View reports" ON public.reports FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() AND me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
));

DROP POLICY IF EXISTS "Submit reports" ON public.reports;
CREATE POLICY "Submit reports" ON public.reports FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND reporter_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() AND me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
));

DROP POLICY IF EXISTS "Admins can delete reports" ON public.reports;
CREATE POLICY "Admins can delete reports" ON public.reports FOR DELETE USING (EXISTS (
  SELECT 1 FROM public.users me 
  WHERE me.id = auth.uid() AND me.role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
));

-- Mentions Policies
DROP POLICY IF EXISTS "Users can view own mentions" ON public.mentions;
CREATE POLICY "Users can view own mentions" ON public.mentions FOR SELECT USING (auth.uid() = target_id);

DROP POLICY IF EXISTS "System/Users can insert mentions" ON public.mentions;
CREATE POLICY "System/Users can insert mentions" ON public.mentions FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND sender_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own mentions" ON public.mentions;
CREATE POLICY "Users can update own mentions" ON public.mentions FOR UPDATE USING (auth.uid() = target_id);

DROP POLICY IF EXISTS "Users can delete own mentions" ON public.mentions;
CREATE POLICY "Users can delete own mentions" ON public.mentions FOR DELETE USING (auth.uid() = target_id);

-- Audit Logs Policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND get_role_level(me.role) >= 5)
);

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_logs;
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND get_role_level(me.role) >= 5)
);

-- Appeals Policies
DROP POLICY IF EXISTS "Users can view own appeals" ON public.appeals;
CREATE POLICY "Users can view own appeals" ON public.appeals FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND get_role_level(me.role) >= 5)
);

DROP POLICY IF EXISTS "Users can submit appeals" ON public.appeals;
CREATE POLICY "Users can submit appeals" ON public.appeals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage appeals" ON public.appeals;
CREATE POLICY "Admins can manage appeals" ON public.appeals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND get_role_level(me.role) >= 5)
);

-- System Config Policies
DROP POLICY IF EXISTS "Anyone can view config" ON public.system_config;
CREATE POLICY "Anyone can view config" ON public.system_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage config" ON public.system_config;
CREATE POLICY "Admins can manage config" ON public.system_config FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND me.role IN ('ADMIN', 'SUPER_ADMIN'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users me WHERE me.id = auth.uid() AND me.role IN ('ADMIN', 'SUPER_ADMIN'))
);

-- ==============================================================================
-- Fungsi & Triggers Otomatis
-- ==============================================================================

-- A. Sinkronisasi User Baru dari Auth ke Public Users (Anti Injeksi Role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, nama, role, tanggal_daftar, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    -- Keamanan: Cegah injeksi role dari client metadata (raw_user_meta_data).
    -- Hanya izinkan role khusus jika ditetapkan melalui raw_app_meta_data (service_role / Supabase Admin Console)
    COALESCE(new.raw_app_meta_data->>'role', 'USER'),
    COALESCE(new.created_at, timezone('utc'::text, now())),
    COALESCE(new.created_at, timezone('utc'::text, now()))
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

-- B. Verifikasi Identitas & Limitasi Pesan (Anti-Spoofing & Cooldown)
CREATE OR REPLACE FUNCTION public.handle_message_security()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
    user_status TEXT;
    user_mute_until TIMESTAMP WITH TIME ZONE;
    user_limit INTEGER;
    current_count INTEGER;
    last_msg TIMESTAMP WITH TIME ZONE;
    user_last_reset DATE;
    is_maintenance BOOLEAN;
    role_limits JSONB;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN new;
    END IF;

    -- Profanity Filter (Dual-Layer Server-Side Defense)
    IF new.content ~* '\y(anjing|babi|monyet|bangsat|memek|kontol|jembut|asu|perek|lonte|bajingan|pelacur|pukimak|tolol|goblok|fuck|shit|asshole|bitch|cunt|dick|pussy|bastard)\y' THEN
        RAISE EXCEPTION 'Pesan Anda mengandung kata-kata yang tidak diperbolehkan. Mohon jaga kesopanan.';
    END IF;

    -- Validasi Keamanan Media URL
    IF new.media_url IS NOT NULL AND (new.media_url !~* '^https?://' OR new.media_url ~* 'javascript:') THEN
        RAISE EXCEPTION 'URL media tidak valid atau tidak aman.';
    END IF;

    -- Ambil data asli dari tabel users
    SELECT role, nama, message_count, status, mute_until, last_message_at, last_reset 
    INTO user_role, new.username, current_count, user_status, user_mute_until, last_msg, user_last_reset
    FROM public.users WHERE id = auth.uid();

    -- Auto-reset harian jika tanggal sudah berganti
    IF user_last_reset IS NULL OR user_last_reset < CURRENT_DATE THEN
        UPDATE public.users 
        SET message_count = 0, last_reset = CURRENT_DATE 
        WHERE id = auth.uid();
        current_count := 0;
    END IF;

    -- Cek Maintenance Mode
    SELECT (value::BOOLEAN) INTO is_maintenance FROM public.system_config WHERE key = 'maintenance_mode';
    IF is_maintenance = true AND user_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
        RAISE EXCEPTION 'Sistem sedang dalam pemeliharaan (Maintenance Mode). Silakan coba lagi nanti.';
    END IF;

    -- Paksa User ID asli dari Auth (Anti-Spoofing)
    new.user_id := auth.uid();
    
    -- Verifikasi Profil & Moderasi
    IF user_role IS NULL THEN
        RAISE EXCEPTION 'Profil belum siap. Silakan tunggu 1 detik atau login kembali.';
    END IF;

    IF user_status = 'nonaktif' OR user_status = 'banned' THEN
        RAISE EXCEPTION 'Akun Anda telah dinonaktifkan atau dibanned dari diskusi.';
    END IF;

    IF user_mute_until IS NOT NULL AND user_mute_until > now() THEN
        RAISE EXCEPTION 'Muted: Anda sedang di-mute sampai %. Alasan: %', user_mute_until, (SELECT COALESCE(mute_reason, 'Pelanggaran Aturan') FROM public.users WHERE id = auth.uid());
    END IF;

    -- Anti-Spam Cooldown (2 Detik, Bebas untuk Moderator/Admin)
    IF user_role NOT IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR') THEN
        IF last_msg IS NOT NULL AND now() - last_msg < interval '2 seconds' THEN
            RAISE EXCEPTION 'Tenang! Anda mengirim pesan terlalu cepat. Mohon tunggu 2 detik antar pesan.';
        END IF;
    END IF;

    -- Tetapkan Role asli
    new.role := user_role;

    -- Cek Limit Pesan
    SELECT value INTO role_limits FROM public.system_config WHERE key = 'message_limits';
    user_limit := (role_limits->>user_role)::INTEGER;
    IF user_limit IS NULL THEN user_limit := 5; END IF;

    IF current_count >= user_limit THEN
        RAISE EXCEPTION 'Limit harian tercapai (%/%). Upgrade akun atau tunggu besok untuk mengirim lebih banyak pesan.', current_count, user_limit;
    END IF;

    -- Tetapkan timestamp
    new.timestamp := EXTRACT(EPOCH FROM now()) * 1000;
    
    -- Update last_message_at
    UPDATE public.users SET last_message_at = now() WHERE id = auth.uid();

    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_message_before_insert ON public.messages;
CREATE TRIGGER on_message_before_insert
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_message_security();

-- B2. Proteksi Saat Edit Pesan (Anti Profanity & Bypass Mute pada Update)
CREATE OR REPLACE FUNCTION public.handle_message_update_security()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_status TEXT;
    user_mute_until TIMESTAMP WITH TIME ZONE;
    caller_role TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN new;
    END IF;

    -- Kunci metadata agar tidak di-spoof
    new.id := old.id;
    new.user_id := old.user_id;
    new.timestamp := old.timestamp;
    new.created_at := old.created_at;

    -- Profanity Filter saat update
    IF new.content ~* '\y(anjing|babi|monyet|bangsat|memek|kontol|jembut|asu|perek|lonte|bajingan|pelacur|pukimak|tolol|goblok|fuck|shit|asshole|bitch|cunt|dick|pussy|bastard)\y' THEN
        RAISE EXCEPTION 'Pesan Anda mengandung kata-kata yang tidak diperbolehkan. Mohon jaga kesopanan.';
    END IF;

    -- Validasi Keamanan Media URL
    IF new.media_url IS NOT NULL AND (new.media_url !~* '^https?://' OR new.media_url ~* 'javascript:') THEN
        RAISE EXCEPTION 'URL media tidak valid atau tidak aman.';
    END IF;

    -- Cek Status Akun & Mute
    SELECT role, status, mute_until 
    INTO caller_role, user_status, user_mute_until
    FROM public.users WHERE id = auth.uid();

    IF user_status = 'nonaktif' OR user_status = 'banned' THEN
        RAISE EXCEPTION 'Akun Anda dinonaktifkan atau dibanned.';
    END IF;

    IF user_mute_until IS NOT NULL AND user_mute_until > now() THEN
        RAISE EXCEPTION 'Muted: Anda sedang di-mute dan tidak dapat mengubah pesan.';
    END IF;

    new.is_edited := true;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_message_before_update ON public.messages;
CREATE TRIGGER on_message_before_update
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_message_update_security();

-- C. Hitung Pesan & Unlock Achievement & Parse Mentions Otomatis
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
  IF new_count = 1 THEN
    INSERT INTO public.achievements (user_id, achievement_id, name, icon, description, points, category)
    VALUES (new.user_id, 'first_message', 'Peserta Baru', '🚀', 'Kirim pesan pertama Anda', 10, 'global')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  IF new_count = 10 THEN
    INSERT INTO public.achievements (user_id, achievement_id, name, icon, description, points, category)
    VALUES (new.user_id, 'tenth_message', 'Pengamat Handal', '🧐', 'Kirim 10 sinyal diskusi', 25, 'global')
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  -- 3. Parse Mentions (@nama atau @nama_lengkap) secara dinamis & aman
  IF new.content ~ '@' AND new.user_id IS NOT NULL THEN
    INSERT INTO public.mentions (message_id, sender_id, target_id)
    SELECT DISTINCT
      new.id,
      new.user_id,
      u.id
    FROM public.users u
    WHERE u.id != new.user_id
      AND new.content ~* ('@' || replace(regexp_replace(u.nama, '([.*+?^=!:${}()|\[\]\/\\])', '\\\1', 'g'), ' ', '\s+'))
    ON CONFLICT (message_id, target_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_message_inserted_logic();

-- D1. Proteksi Sebelum Update Profil & Cegah Eskalasi Hak Akses (Anti Privilege Escalation & Self-Unban)
CREATE OR REPLACE FUNCTION public.handle_user_before_update()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_role TEXT;
    caller_level INTEGER;
    target_current_level INTEGER;
BEGIN
    -- Izinkan operasi jika berasal dari service_role / internal Supabase maintenance
    IF auth.role() = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Ambil role dan level pemanggil
    SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
    caller_level := get_role_level(caller_role);
    target_current_level := get_role_level(OLD.role);

    -- 1. Proteksi Perubahan Role: Cegah pengguna biasa mengubah role sendiri atau orang lain
    IF (OLD.role IS DISTINCT FROM NEW.role) THEN
        IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') OR caller_level <= target_current_level THEN
            RAISE EXCEPTION 'Pelanggaran Keamanan: Anda tidak memiliki wewenang untuk mengubah role.';
        END IF;

        -- Admin biasa tidak boleh membuat SUPER_ADMIN (hanya SUPER_ADMIN yang boleh)
        IF NEW.role = 'SUPER_ADMIN' AND caller_role != 'SUPER_ADMIN' THEN
            RAISE EXCEPTION 'Pelanggaran Keamanan: Hanya SUPER_ADMIN yang berhak menetapkan role SUPER_ADMIN.';
        END IF;
    END IF;

    -- 2. Proteksi Status: Cegah unban / un-mute mandiri oleh user yang disanksi
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR') OR caller_level <= target_current_level THEN
            RAISE EXCEPTION 'Pelanggaran Keamanan: Anda tidak memiliki wewenang untuk mengubah status akun ini.';
        END IF;
    END IF;

    -- 3. Proteksi Hukuman Mute dan Shadowban
    IF (OLD.mute_until IS DISTINCT FROM NEW.mute_until) OR 
       (OLD.is_shadowbanned IS DISTINCT FROM NEW.is_shadowbanned) THEN
        IF caller_role NOT IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR') OR caller_level <= target_current_level THEN
            RAISE EXCEPTION 'Pelanggaran Keamanan: Anda tidak memiliki wewenang untuk memodifikasi sanksi moderasi.';
        END IF;
    END IF;

    -- 4. Cegah manipulasi hitungan pesan mandiri oleh pengguna biasa
    IF (OLD.message_count IS DISTINCT FROM NEW.message_count) AND 
       caller_role NOT IN ('SUPER_ADMIN', 'ADMIN') AND 
       auth.uid() = OLD.id THEN
        NEW.message_count := OLD.message_count;
    END IF;

    -- Update timestamp updated_at otomatis
    NEW.updated_at := timezone('utc'::text, now());

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_before_update ON public.users;
CREATE TRIGGER on_user_before_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_before_update();

-- D2. Audit Moderasi User Otomatis
CREATE OR REPLACE FUNCTION public.handle_user_moderation_audit()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_id UUID;
BEGIN
    admin_id := auth.uid();

    IF (OLD.role IS DISTINCT FROM NEW.role) OR 
       (OLD.status IS DISTINCT FROM NEW.status) OR 
       (OLD.mute_until IS DISTINCT FROM NEW.mute_until) OR
       (OLD.is_shadowbanned IS DISTINCT FROM NEW.is_shadowbanned) THEN
       
       INSERT INTO public.audit_logs (admin_id, target_id, action, reason, metadata)
       VALUES (
           admin_id,
           NEW.id,
           CASE 
               WHEN OLD.role IS DISTINCT FROM NEW.role THEN 'ROLE_CHANGE'
               WHEN OLD.status IS DISTINCT FROM NEW.status THEN 
                   CASE WHEN NEW.status IN ('banned', 'nonaktif') THEN 'BAN' ELSE 'UNBAN' END
               WHEN OLD.mute_until IS DISTINCT FROM NEW.mute_until THEN 'MUTE_UPDATE'
               WHEN OLD.is_shadowbanned IS DISTINCT FROM NEW.is_shadowbanned THEN 'SHADOWBAN_TOGGLE'
               ELSE 'UPDATE_PROFILE'
           END,
           COALESCE(NEW.ban_reason, NEW.mute_reason, 'System automated audit'),
           jsonb_build_object(
               'old_data', jsonb_build_object('role', OLD.role, 'status', OLD.status, 'mute_until', OLD.mute_until, 'shadowbanned', OLD.is_shadowbanned),
               'new_data', jsonb_build_object('role', NEW.role, 'status', NEW.status, 'mute_until', NEW.mute_until, 'shadowbanned', NEW.is_shadowbanned)
           )
       );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_moderation_audit ON public.users;
CREATE TRIGGER on_user_moderation_audit
  AFTER UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_moderation_audit();

-- E. Audit Hapus User
CREATE OR REPLACE FUNCTION public.handle_user_deletion_audit()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.audit_logs (admin_id, target_id, action, reason)
    VALUES (
        auth.uid(),
        OLD.id,
        'DELETE_USER',
        'User record manually deleted'
    );
    RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_user_deletion_audit ON public.users;
CREATE TRIGGER on_user_deletion_audit
  BEFORE DELETE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_deletion_audit();

-- F. Statistik Server-Side untuk Dashboard Admin
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
    SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
    
    IF get_role_level(caller_role) < 4 OR caller_role IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Operasi ini memerlukan hak akses administratif.';
    END IF;

    SELECT count(*)::INTEGER INTO total_users FROM public.users;
    SELECT count(*)::INTEGER INTO active_users FROM public.users WHERE status = 'aktif';
    SELECT count(*)::INTEGER INTO total_messages FROM public.messages;
    SELECT count(*)::INTEGER INTO today_messages FROM public.messages WHERE created_at >= CURRENT_DATE;
    
    RETURN json_build_object(
        'totalUsers', total_users,
        'activeUsers', active_users,
        'totalMessages', total_messages,
        'todayMessages', today_messages
    );
END;
$$;

-- G. Reset Pesan Bulanan
CREATE OR REPLACE FUNCTION public.reset_monthly_message_counts()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users SET message_count = 0, last_reset = CURRENT_DATE;
END;
$$;

-- Ekstensi pg_cron (Aman jika pg_cron tidak tersedia)
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  PERFORM cron.schedule('reset-monthly-counts', '0 0 1 * *', 'SELECT public.reset_monthly_message_counts();');
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Catatan: pg_cron tidak aktif pada instance ini: %', SQLERRM;
END $$;

-- H. Pengarsipan Pesan Lama
CREATE OR REPLACE FUNCTION public.archive_old_messages(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_role TEXT;
    deleted_rows INTEGER;
BEGIN
    SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
    IF get_role_level(caller_role) < 8 OR caller_role IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Operasi pengarsipan hanya untuk Administrator.';
    END IF;

    DELETE FROM public.messages
    WHERE created_at < (now() - (days_to_keep || ' days')::INTERVAL)
      AND is_pinned = false;

    GET DIAGNOSTICS deleted_rows = ROW_COUNT;
    RETURN deleted_rows;
END;
$$;

-- ==============================================================================
-- 8. Izin Akses Lengkap (Grants - Principle of Least Privilege + CRUD Lengkap)
-- ==============================================================================
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Users (Pengguna bisa baca profil orang lain dan update profil sendiri via RLS)
GRANT SELECT ON public.users TO authenticated, anon;
GRANT UPDATE, DELETE ON public.users TO authenticated;

-- Messages (Pengguna bisa kirim, edit, dan hapus pesan sendiri; baca semua via RLS)
GRANT SELECT ON public.messages TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.messages TO authenticated;

-- Achievements
GRANT SELECT ON public.achievements TO authenticated, anon;
GRANT INSERT ON public.achievements TO authenticated;

-- Tags
GRANT SELECT ON public.tags TO authenticated, anon;
GRANT INSERT, DELETE ON public.tags TO authenticated;

-- Reactions (Pengguna bisa beri reaksi dan batalkan reaksi)
GRANT SELECT ON public.reactions TO authenticated, anon;
GRANT INSERT, DELETE ON public.reactions TO authenticated;

-- Reports & Appeals (Termasuk DELETE untuk admin/moderator)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appeals TO authenticated;

-- Mentions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentions TO authenticated;

-- Audit Logs
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- System Config
GRANT SELECT ON public.system_config TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.system_config TO authenticated;

-- RPC Functions
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_role_level TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.archive_old_messages TO authenticated;

-- ==============================================================================
-- 9. View Profiles (Email Privacy)
-- ==============================================================================
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
    last_message_at,
    CASE 
        WHEN auth.uid() = id OR (SELECT get_role_level(role) FROM public.users WHERE id = auth.uid()) >= 4 
        THEN email 
        ELSE NULL 
    END as email
FROM public.users;

GRANT SELECT ON public.profiles TO authenticated, anon;

-- ==============================================================================
-- 10. Konfigurasi Supabase Realtime (Krusial untuk Sinkronisasi Langsung)
-- ==============================================================================

-- Setting Replica Identity agar event UPDATE & DELETE membawa payload lengkap
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.reactions REPLICA IDENTITY FULL;
ALTER TABLE public.mentions REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;

-- Daftarkan ke Publikasi Realtime Supabase (Idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mentions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ==============================================================================
-- 11. Indeks Performa Lanjutan
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON public.messages(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON public.reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_message_id ON public.reports(message_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);

-- BRIN Index untuk Skala Masif
CREATE INDEX IF NOT EXISTS idx_messages_brin_time ON public.messages USING BRIN (created_at);
CREATE INDEX IF NOT EXISTS idx_messages_brin_timestamp ON public.messages USING BRIN (timestamp);

-- ==============================================================================
-- 12. DATA CONTOH UNTUK PENGETESAN 
-- ==============================================================================
-- Jalankan bagian ini jika Anda ingin mengisi database dengan akun contoh.
-- Akun: superadmin@test.com, admin@test.com, mod@test.com, user@test.com
-- Password Default: LiveTest123! (Semua akun menggunakan password ini)

INSERT INTO auth.users (
  id, 
  instance_id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at
)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'superadmin@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Sang Arsitek"}', now(), now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Penjaga Gerbang"}', now(), now()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mod@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Moderator Alpha"}', now(), now()),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'premium@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Sultan Diskusi"}', now(), now()),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'verified@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Warga Terverifikasi"}', now(), now()),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user@test.com', '$2a$10$7EqIF5sPH6z62cv0wS1h7.t7.nZ2X9m3sW8UpxuY4m3Y5v6/5r7qG', now(), '{"provider":"email","providers":["email"]}', '{"nama":"Pengunjung Baru"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sinkronisasi / Insert ke public.users
INSERT INTO public.users (id, email, nama, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'superadmin@test.com', 'Sang Arsitek', 'SUPER_ADMIN'),
  ('00000000-0000-0000-0000-000000000002', 'admin@test.com', 'Penjaga Gerbang', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000003', 'mod@test.com', 'Moderator Alpha', 'MODERATOR'),
  ('00000000-0000-0000-0000-000000000004', 'premium@test.com', 'Sultan Diskusi', 'PREMIUM'),
  ('00000000-0000-0000-0000-000000000005', 'verified@test.com', 'Warga Terverifikasi', 'VERIFIED'),
  ('00000000-0000-0000-0000-000000000006', 'user@test.com', 'Pengunjung Baru', 'USER')
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  role = EXCLUDED.role;

-- Update Role di public.users
UPDATE public.users SET role = 'SUPER_ADMIN' WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.users SET role = 'ADMIN' WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.users SET role = 'MODERATOR' WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE public.users SET role = 'PREMIUM' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE public.users SET role = 'VERIFIED' WHERE id = '00000000-0000-0000-0000-000000000005';

-- Tambahkan Pesan Contoh
INSERT INTO public.messages (user_id, username, content, role, timestamp)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Sang Arsitek', 'Halo semuanya! Selamat datang di sistem Live Discussion yang baru.', 'SUPER_ADMIN', EXTRACT(EPOCH FROM now()) * 1000),
  ('00000000-0000-0000-0000-000000000002', 'Penjaga Gerbang', 'Hai Arsitek! Sistem sudah berjalan stabil. Saya akan memantau keamanan.', 'ADMIN', (EXTRACT(EPOCH FROM now()) * 1000) + 1000),
  ('00000000-0000-0000-0000-000000000004', 'Sultan Diskusi', 'Wah, tampilannya keren banget! Pakai glassmorphism ya?', 'PREMIUM', (EXTRACT(EPOCH FROM now()) * 1000) + 2000),
  ('00000000-0000-0000-0000-000000000003', 'Moderator Alpha', 'Tolong jaga bahasa ya teman-teman agar diskusi tetap sehat.', 'MODERATOR', (EXTRACT(EPOCH FROM now()) * 1000) + 3000),
  ('00000000-0000-0000-0000-000000000006', 'Pengunjung Baru', 'Izin gabung min, saya baru pertama kali di sini.', 'USER', (EXTRACT(EPOCH FROM now()) * 1000) + 4000)
ON CONFLICT (id) DO NOTHING;

-- Tambahkan Achievement Contoh
INSERT INTO public.achievements (user_id, achievement_id, name, icon, description, points, category)
VALUES 
  ('00000000-0000-0000-0000-000000000006', 'first_message', 'Peserta Baru', '🚀', 'Kirim sinyal pertama Anda di diskusi', 10, 'global'),
  ('00000000-0000-0000-0000-000000000001', 'admin_community_builder', 'Pembangun Komunitas', '🏢', 'Kelola komunitas selama 30 hari', 100, 'admin')
ON CONFLICT (user_id, achievement_id) DO UPDATE SET
  description = EXCLUDED.description;

-- Tambahkan Tag Contoh
INSERT INTO public.tags (user_id, tag_name, color)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Developer', 'cyan'),
  ('00000000-0000-0000-0000-000000000002', 'Staff', 'red'),
  ('00000000-0000-0000-0000-000000000004', 'VIP', 'gold')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 13. Supabase Storage Setup (live_discussion_media)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('live_discussion_media', 'live_discussion_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy agar siapapun bisa melihat media yang diunggah
DROP POLICY IF EXISTS "Public can view live discussion media" ON storage.objects;
CREATE POLICY "Public can view live discussion media" ON storage.objects FOR SELECT
USING (bucket_id = 'live_discussion_media');

-- Policy agar user terautentikasi bisa upload media ke folder milik mereka (user_id/*)
DROP POLICY IF EXISTS "Authenticated users can upload live discussion media" ON storage.objects;
CREATE POLICY "Authenticated users can upload live discussion media" ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'live_discussion_media' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy agar pemilik media atau moderator/admin bisa menghapus media
DROP POLICY IF EXISTS "Users or admins can delete live discussion media" ON storage.objects;
CREATE POLICY "Users or admins can delete live discussion media" ON storage.objects FOR DELETE
USING (
  bucket_id = 'live_discussion_media' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.users me 
      WHERE me.id = auth.uid() AND get_role_level(me.role) >= 5
    )
  )
);

-- ==============================================================================
-- 14. FITUR BARU: CHANNELS, BEST ANSWER, POLLING & SEARCH
-- ==============================================================================

-- 14.1 Kolom Tambahan di Tabel Messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'umum';
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_best_answer BOOLEAN DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS poll_data JSONB DEFAULT NULL;

-- Indeks Performa untuk Channel & Best Answer
CREATE INDEX IF NOT EXISTS idx_messages_channel ON public.messages(channel);
CREATE INDEX IF NOT EXISTS idx_messages_is_best_answer ON public.messages(is_best_answer) WHERE is_best_answer = true;

-- 14.2 Tabel Polls (Untuk Manajemen Polling Terpisah & Realtime)
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    creator_name TEXT NOT NULL,
    channel TEXT DEFAULT 'umum' NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    is_closed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14.3 Tabel Poll Votes (Pencegahan Double Voting)
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(poll_id, user_id)
);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Policy Polls: Semua orang bisa baca
DROP POLICY IF EXISTS "Public can view polls" ON public.polls;
CREATE POLICY "Public can view polls" ON public.polls FOR SELECT USING (true);

-- Policy Polls: User authenticated bisa buat polling
DROP POLICY IF EXISTS "Authenticated can insert polls" ON public.polls;
CREATE POLICY "Authenticated can insert polls" ON public.polls FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy Poll Votes: Semua orang bisa baca hasil
DROP POLICY IF EXISTS "Public can view poll votes" ON public.poll_votes;
CREATE POLICY "Public can view poll votes" ON public.poll_votes FOR SELECT USING (true);

-- Policy Poll Votes: User bisa insert voting miliknya sendiri
DROP POLICY IF EXISTS "Users can vote once" ON public.poll_votes;
CREATE POLICY "Users can vote once" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Realtime Publication untuk Polls
DO $$ 
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ==============================================================================
-- SELESAI
-- ==============================================================================
