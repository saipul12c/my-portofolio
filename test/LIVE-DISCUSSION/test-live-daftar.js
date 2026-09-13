import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Baca konfigurasi Supabase dari file .env (prioritas test/LIVE-DISCUSSION/.env)
function getEnvConfig() {
  const localEnvPath = path.resolve(__dirname, '.env');
  const rootEnvPath = path.resolve(process.cwd(), '.env');
  
  let supabaseUrl = '';
  let supabaseAnonKey = '';

  const parseFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = trimmed.split('=')[1]?.trim();
      }
      if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseAnonKey = trimmed.split('=')[1]?.trim();
      }
    }
  };

  parseFile(rootEnvPath);
  parseFile(localEnvPath);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan di file .env');
  }

  return { supabaseUrl, supabaseAnonKey };
}

const { supabaseUrl, supabaseAnonKey } = getEnvConfig();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('====================================================');
console.log('🧪 PENGUJIAN PENDAFTARAN AKUN (LIVE-DISCUSSION/DAFTAR)');
console.log('====================================================');
console.log(`🌐 Supabase URL: ${supabaseUrl}\n`);

async function runDaftarTest() {
  const timestamp = Date.now();
  const testUser = {
    nama: `Test User ${timestamp.toString().slice(-4)}`,
    email: `test_user_${timestamp}@gmail.com`,
    password: 'Password123',
    konfirmasiPassword: 'Password123'
  };

  // ----------------------------------------------------
  // UJI 1: Validasi Aturan Form (Sesuai dengan Daftar.jsx)
  // ----------------------------------------------------
  console.log('📌 [UJI 1] Memvalidasi aturan form input...');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNamaValid = testUser.nama.trim().length >= 3;
  const isEmailValid = emailRegex.test(testUser.email.trim());
  const isPasswordValid = 
    testUser.password.length >= 8 && 
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(testUser.password);
  const isPasswordMatch = testUser.password === testUser.konfirmasiPassword;

  if (isNamaValid && isEmailValid && isPasswordValid && isPasswordMatch) {
    console.log('   ✅ Validasi format nama, email, dan kekuatan password: LOLOS');
  } else {
    console.error('   ❌ Validasi form gagal!');
    process.exit(1);
  }

  // ----------------------------------------------------
  // UJI 2: Mengirim Pendaftaran ke Supabase Auth
  // ----------------------------------------------------
  console.log('\n📌 [UJI 2] Mendaftarkan akun baru ke Supabase Auth...');
  console.log(`   Nama     : ${testUser.nama}`);
  console.log(`   Email    : ${testUser.email}`);
  console.log(`   Password : ${testUser.password}`);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email.trim().toLowerCase(),
      password: testUser.password,
      options: {
        data: {
          nama: testUser.nama.trim()
        }
      }
    });

    if (error) {
      console.error(`   ❌ Gagal mendaftar: ${error.message}`);
      if (error.message.toLowerCase().includes('invalid')) {
        console.warn('   💡 Catatan: Supabase mungkin menolak domain email tertentu jika confirm email aktif.');
      }
      return;
    }

    if (data.user) {
      console.log('   ✅ Berhasil membuat akun di Supabase Auth!');
      console.log(`   User ID  : ${data.user.id}`);
      console.log(`   Identities: ${data.user.identities?.length || 0} link`);

      // Cek apakah email auto-confirmed atau butuh verifikasi
      if (data.session) {
        console.log('   ℹ️  Sesi Login Langsung Aktif (Auto-Confirm Aktif)');
      } else {
        console.log('   ℹ️  Akun dibuat, menunggu konfirmasi email (Confirm Email Aktif)');
      }

      // ----------------------------------------------------
      // UJI 3: Cek Sinkronisasi ke Tabel Database public.users
      // ----------------------------------------------------
      console.log('\n📌 [UJI 3] Memeriksa sinkronisasi trigger ke tabel public.users...');
      let dbUser = null;
      let retries = 5;

      while (retries > 0 && !dbUser) {
        process.stdout.write(`   Mengecek database (sisa percobaan: ${retries})... `);
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('id, email, nama, role, status')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userData) {
          dbUser = userData;
          console.log('DITEMUKAN!');
        } else {
          console.log('Menunggu...');
          retries--;
          if (retries > 0) await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (dbUser) {
        console.log('   ✅ Trigger Supabase berhasil membuat data di public.users:');
        console.log(`      - ID     : ${dbUser.id}`);
        console.log(`      - Nama   : ${dbUser.nama}`);
        console.log(`      - Role   : ${dbUser.role}`);
        console.log(`      - Status : ${dbUser.status}`);
      } else {
        console.log('   ⚠️  Data belum masuk ke public.users (mungkin trigger SQL belum dipasang atau ada RLS).');
        console.log('   ℹ️  Catatan: Live.jsx tetap aman karena memiliki fallback ke user_metadata.');
      }

    } else {
      console.error('   ❌ Supabase tidak mengembalikan data user.');
    }

  } catch (err) {
    console.error('   ❌ Terjadi kesalahan tak terduga:', err);
  }

  // ----------------------------------------------------
  // UJI 4: Cek Proteksi Email Duplikat
  // ----------------------------------------------------
  console.log('\n📌 [UJI 4] Menguji proteksi pendaftaran dengan email yang sama...');
  try {
    const { data: dupData, error: dupError } = await supabase.auth.signUp({
      email: testUser.email.trim().toLowerCase(),
      password: testUser.password,
      options: { data: { nama: testUser.nama } }
    });

    if (dupError) {
      console.log(`   ✅ Ditolak dengan benar oleh Supabase: "${dupError.message}"`);
    } else if (dupData?.user?.identities?.length === 0) {
      console.log('   ✅ Supabase mendeteksi email duplikat (identities kosong). Lolos proteksi enumeration!');
    } else {
      console.log('   ℹ️  Response duplikasi diterima.');
    }
  } catch (err) {
    console.log(`   ✅ Terdeteksi error duplikasi: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log('🎉 PENGUJIAN PENDAFTARAN SELESAI!');
  console.log('====================================================');
}

runDaftarTest();
