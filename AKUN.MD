-- Daftar Akun untuk login:
-- 1. superadmin@test.com | Pw: Password123
-- 2. admin@test.com      | Pw: Password123
-- 3. moderator@test.com  | Pw: Password123
-- 4. premium@test.com    | Pw: Password123
-- 5. verified@test.com   | Pw: Password123
-- 6. user@test.com       | Pw: Password123

PS C:\Users\Hype GLK\Downloads\projek\my-porto> node test-live-daftar.js
====================================================
🧪 PENGUJIAN PENDAFTARAN AKUN (LIVE-DISCUSSION/DAFTAR)
====================================================
🌐 Supabase URL: https://mbqrhlhkhveasyzxixho.supabase.co

📌 [UJI 1] Memvalidasi aturan form input...
   ✅ Validasi format nama, email, dan kekuatan password: LOLOS

📌 [UJI 2] Mendaftarkan akun baru ke Supabase Auth...
   Nama     : Test User 2977
   Email    : test_user_1789261622977@gmail.com
   Password : Password123
   ✅ Berhasil membuat akun di Supabase Auth!
   User ID  : 7e3cfc5d-465f-481f-9cee-7e6ae5b106f5
   Identities: 1 link
   ℹ️  Sesi Login Langsung Aktif (Auto-Confirm Aktif)

📌 [UJI 3] Memeriksa sinkronisasi trigger ke tabel public.users...
   Mengecek database (sisa percobaan: 5)... DITEMUKAN!
   ✅ Trigger Supabase berhasil membuat data di public.users:
      - ID     : 7e3cfc5d-465f-481f-9cee-7e6ae5b106f5
      - Nama   : Test User 2977
      - Role   : USER
      - Status : aktif

📌 [UJI 4] Menguji proteksi pendaftaran dengan email yang sama...
   ✅ Ditolak dengan benar oleh Supabase: "User already registered"

====================================================
🎉 PENGUJIAN PENDAFTARAN SELESAI!
====================================================
PS C:\Users\Hype GLK\Downloads\projek\my-porto> 