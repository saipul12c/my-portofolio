-- init.sql
-- Setup database untuk aplikasi Live Chat

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create profiles table (untuk menyimpan data user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  role TEXT DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create messages table (untuk menyimpan pesan chat)
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create user_status table (untuk melacak status online user)
CREATE TABLE IF NOT EXISTS user_status (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create function untuk update updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Apply trigger untuk update updated_at otomatis
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_status_updated_at
  BEFORE UPDATE ON user_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;

-- 8. Create policies untuk profiles table
-- Policy: User hanya bisa membaca semua profil
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Policy: User hanya bisa mengupdate profil mereka sendiri
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 9. Create policies untuk messages table
-- Policy: Semua user bisa membaca semua pesan
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
CREATE POLICY "Messages are viewable by everyone"
  ON messages FOR SELECT
  USING (true);

-- Policy: User bisa membuat pesan baru
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa mengupdate pesan mereka sendiri (dalam waktu 5 menit)
DROP POLICY IF EXISTS "Users can update own messages within 5 minutes" ON messages;
CREATE POLICY "Users can update own messages within 5 minutes"
  ON messages FOR UPDATE
  USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

-- Policy: User hanya bisa menghapus pesan mereka sendiri (dalam waktu 5 menit)
DROP POLICY IF EXISTS "Users can delete own messages within 5 minutes" ON messages;
CREATE POLICY "Users can delete own messages within 5 minutes"
  ON messages FOR DELETE
  USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

-- 10. Create policies untuk user_status table
-- Policy: Semua user bisa melihat status online
DROP POLICY IF EXISTS "User status is viewable by everyone" ON user_status;
CREATE POLICY "User status is viewable by everyone"
  ON user_status FOR SELECT
  USING (true);

-- Policy: User hanya bisa mengupdate status mereka sendiri
DROP POLICY IF EXISTS "Users can update own status" ON user_status;
CREATE POLICY "Users can update own status"
  ON user_status FOR ALL
  USING (auth.uid() = user_id);

-- 11. Create function untuk handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NOW()
  );
  
  INSERT INTO public.user_status (user_id, is_online, last_seen)
  VALUES (NEW.id, false, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create trigger untuk auto-create profile saat user baru register
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Create function untuk update last_seen secara periodik
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Create trigger untuk update last_seen otomatis
CREATE TRIGGER update_last_seen_on_status_change
  BEFORE UPDATE OF is_online ON user_status
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_seen();

-- 15. Create indexes untuk performa query
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_status_is_online ON user_status(is_online);
CREATE INDEX IF NOT EXISTS idx_user_status_last_seen ON user_status(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 16. Create view untuk mendapatkan info user dengan status online
CREATE OR REPLACE VIEW online_users_view AS
SELECT 
  p.id,
  p.email,
  p.username,
  us.is_online,
  us.last_seen,
  EXTRACT(EPOCH FROM (NOW() - us.last_seen)) as seconds_since_last_seen
FROM profiles p
LEFT JOIN user_status us ON p.id = us.user_id
WHERE us.is_online = true
ORDER BY us.last_seen DESC;

-- 17. Create function untuk mendapatkan jumlah pesan per user
CREATE OR REPLACE FUNCTION get_user_message_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  message_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO message_count
  FROM messages
  WHERE user_id = user_uuid;
  
  RETURN message_count;
END;
$$ LANGUAGE plpgsql;

-- 18. Tambahkan komentar untuk dokumentasi
COMMENT ON TABLE profiles IS 'Tabel untuk menyimpan data profil pengguna';
COMMENT ON TABLE messages IS 'Tabel untuk menyimpan pesan chat';
COMMENT ON TABLE user_status IS 'Tabel untuk melacak status online pengguna';
COMMENT ON VIEW online_users_view IS 'View untuk melihat pengguna online dengan informasi terkini';

-- 19. Grant permissions (untuk anon dan authenticated roles)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

