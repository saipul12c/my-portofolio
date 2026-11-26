-- ==============================================================================
-- 🛠️ SUPABASE SCHEMA & REALTIME SETUP: MODUL MAINTENANCE TERPUSAT
-- ==============================================================================
-- Jalankan file ini di Supabase SQL Editor.
-- Aman dijalankan berulang kali (idempotent) dan kompatibel dengan
-- database_supa/supabase-Live-diskusi.sql.
-- ==============================================================================

-- 1. Pastikan tabel public.system_config tersedia
CREATE TABLE IF NOT EXISTS public.system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Policy baca publik agar seluruh pengunjung dapat memeriksa status maintenance
DROP POLICY IF EXISTS "Anyone can view config" ON public.system_config;
CREATE POLICY "Anyone can view config"
  ON public.system_config
  FOR SELECT
  USING (true);

-- Policy tulis hanya untuk ADMIN dan SUPER_ADMIN
DROP POLICY IF EXISTS "Admins can manage config" ON public.system_config;
CREATE POLICY "Admins can manage config"
  ON public.system_config
  FOR ALL
  TO authenticated
  USING (
    UPPER(COALESCE((select auth.jwt()) -> 'app_metadata' ->> 'role', '')) IN ('ADMIN', 'SUPER_ADMIN')
    OR EXISTS (
      SELECT 1 FROM public.users me
      WHERE me.id = (select auth.uid())
        AND UPPER(me.role) IN ('ADMIN', 'SUPER_ADMIN')
    )
  )
  WITH CHECK (
    UPPER(COALESCE((select auth.jwt()) -> 'app_metadata' ->> 'role', '')) IN ('ADMIN', 'SUPER_ADMIN')
    OR EXISTS (
      SELECT 1 FROM public.users me
      WHERE me.id = (select auth.uid())
        AND UPPER(me.role) IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Explicit GRANTs (Standar Supabase Data API)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.system_config TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.system_config TO authenticated;
GRANT ALL ON public.system_config TO service_role;

-- 2. Seed konfigurasi awal site_maintenance (tidak menimpa jika sudah ada)
INSERT INTO public.system_config (key, value)
VALUES (
  'site_maintenance',
  '{
    "globalEnabled": false,
    "pageOverrides": {},
    "pageNotes": {},
    "pageConfigs": {},
    "customPaths": [],
    "helpButtonMaintenance": false,
    "allowAdminBypass": true,
    "title": "Situs Sedang Dalam Perawatan",
    "description": "Kami sedang memperbarui sistem agar lebih cepat, aman, dan nyaman untuk semua pengunjung 🌍 Terima kasih sudah menunggu dengan sabar 🙏",
    "startedAt": "",
    "targetTime": "",
    "footerNote": "Kami berusaha agar semuanya siap sebelum kamu sempat refill kopi ☕",
    "contactEmail": "",
    "showHomeButton": true,
    "showProgressBar": true,
    "showCountdown": true,
    "messages": [
      "Memeriksa koneksi jaringan...",
      "Mengatur ulang pengaturan sistem...",
      "Memperbarui fitur agar lebih cepat...",
      "Memastikan data tetap aman...",
      "Menjalankan pemeriksaan server...",
      "Menyesuaikan performa aplikasi...",
      "Hampir selesai, tinggal sentuhan akhir... ✨"
    ],
    "updatedAt": "",
    "updatedBy": ""
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Pastikan key maintenance_mode (untuk Live Discussion) juga tersedia
INSERT INTO public.system_config (key, value)
VALUES ('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. Tabel Log Aktivitas Maintenance (Audit Trail khusus Dashboard Maintenance)
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL DEFAULT 'Admin',
  action TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'site',
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_maintenance_logs_created_at
  ON public.maintenance_logs(created_at DESC);

ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view maintenance logs" ON public.maintenance_logs;
CREATE POLICY "Admins can view maintenance logs"
  ON public.maintenance_logs
  FOR SELECT
  TO authenticated
  USING (
    UPPER(COALESCE((select auth.jwt()) -> 'app_metadata' ->> 'role', '')) IN ('ADMIN', 'SUPER_ADMIN')
    OR EXISTS (
      SELECT 1 FROM public.users me
      WHERE me.id = (select auth.uid())
        AND UPPER(me.role) IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

DROP POLICY IF EXISTS "Admins can insert maintenance logs" ON public.maintenance_logs;
CREATE POLICY "Admins can insert maintenance logs"
  ON public.maintenance_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    UPPER(COALESCE((select auth.jwt()) -> 'app_metadata' ->> 'role', '')) IN ('ADMIN', 'SUPER_ADMIN')
    OR EXISTS (
      SELECT 1 FROM public.users me
      WHERE me.id = (select auth.uid())
        AND UPPER(me.role) IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

GRANT SELECT, INSERT ON public.maintenance_logs TO authenticated;
GRANT ALL ON public.maintenance_logs TO service_role;

-- 4. Aktifkan Supabase Realtime pada public.system_config
--    Agar perubahan status di Dashboard Maintenance langsung sinkron otomatis ke semua halaman pengunjung!
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'system_config'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.system_config;
  END IF;
EXCEPTION
  WHEN duplicate_object OR undefined_object THEN NULL;
END $$;

-- ==============================================================================
-- SELESAI
-- ==============================================================================
