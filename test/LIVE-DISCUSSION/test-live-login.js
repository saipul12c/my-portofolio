import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
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

const USER_ROLES = {
  SUPER_ADMIN: { level: 10, name: 'Super Admin', badge: '👑' },
  ADMIN: { level: 8, name: 'Admin', badge: '🛡️' },
  MODERATOR: { level: 5, name: 'Moderator', badge: '⭐' },
  PREMIUM: { level: 3, name: 'Premium', badge: '💎' },
  VERIFIED: { level: 2, name: 'Verified', badge: '✅' },
  USER: { level: 1, name: 'User', badge: '👤' }
};

async function main() {
  console.log('====================================================');
  console.log('🧪 PENGUJIAN LOGIN AKUN (LIVE-DISCUSSION/LOGIN)');
  console.log('====================================================');
  console.log(`🌐 Supabase URL : ${supabaseUrl}\n`);

  let testEmail = process.argv[2];
  let testPassword = process.argv[3];

  // Jika tidak ada argumen di CLI, minta input manual dari terminal
  if (!testEmail) {
    const rl = readline.createInterface({ input, output });
    console.log('📝 INPUT KREDENSIAL MANUAL:');
    console.log('   (Tekan ENTER langsung untuk menggunakan data default)\n');

    const inputEmail = await rl.question('👉 Masukkan Email    [default: user@test.com] : ');
    testEmail = inputEmail.trim() || 'user@test.com';

    const inputPassword = await rl.question('👉 Masukkan Password [default: Password123]   : ');
    testPassword = inputPassword.trim() || 'Password123';

    rl.close();
    console.log('');
  }

  console.log('----------------------------------------------------');
  console.log(`🔑 Menguji Akun : ${testEmail}`);
  console.log('----------------------------------------------------\n');

  // ----------------------------------------------------
  // UJI 1: Login Berhasil dengan Kredensial yang Dimasukkan
  // ----------------------------------------------------
  console.log('📌 [UJI 1] Menguji login dengan kredensial yang dimasukkan...');
  try {
    const cleanEmail = testEmail.trim().toLowerCase();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: testPassword
    });

    if (authError) {
      console.error(`   ❌ Login Gagal: ${authError.message}`);
      console.warn(`   💡 Catatan: Pastikan email dan password yang Anda ketik sudah benar.`);
      console.log('      (Tips: Jalankan "node test-live-daftar.js" jika ingin membuat akun baru).');
    } else {
      console.log('   ✅ Berhasil Login ke Supabase Auth!');
      console.log(`   User ID    : ${authData.user.id}`);
      console.log(`   Email      : ${authData.user.email}`);

      // ----------------------------------------------------
      // UJI 2: Mengambil Profil & Menentukan Hak Akses Role
      // ----------------------------------------------------
      console.log('\n📌 [UJI 2] Mengambil profil dari tabel public.users & memeriksa role...');
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.warn(`   ⚠️  Gagal membaca public.users: ${profileError.message}`);
      }

      const role = (profile?.role || 'USER').toUpperCase();
      const roleConfig = USER_ROLES[role] || USER_ROLES.USER;
      const username = profile?.nama || authData.user.user_metadata?.nama || cleanEmail.split('@')[0];
      const status = profile?.status || 'aktif';

      console.log(`   Nama Tampil: ${username}`);
      console.log(`   Role       : ${roleConfig.badge} ${roleConfig.name} (Level ${roleConfig.level})`);
      console.log(`   Status     : ${status}`);

      // Simulasi routing redirect
      if (['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(role)) {
        console.log('   🚀 Arah Redirect: /Live-Discussion/dashboard (Akses Dashboard Moderasi)');
      } else {
        console.log('   💬 Arah Redirect: /Live-Discussion (Room Obrolan Diskusi Publik)');
      }

      // Logout setelah tes berhasil
      await supabase.auth.signOut();
      console.log('   🚪 Sesi pengujian auth berhasil dibersihkan (signOut).');
    }
  } catch (err) {
    console.error('   ❌ Terjadi kesalahan pada Uji 1:', err.message);
  }

  // ----------------------------------------------------
  // UJI 3: Proteksi Login dengan Password Salah
  // ----------------------------------------------------
  console.log('\n📌 [UJI 3] Menguji proteksi sistem jika password salah...');
  try {
    const { data: failData, error: failError } = await supabase.auth.signInWithPassword({
      email: testEmail.trim().toLowerCase(),
      password: 'KataSandiSalahPastiDitolak123!'
    });

    if (failError) {
      console.log(`   ✅ Ditolak dengan benar oleh sistem: "${failError.message}"`);
    } else {
      console.error('   ❌ Bahaya: Login dengan password salah malah berhasil!');
    }
  } catch (err) {
    console.log(`   ✅ Terdeteksi penolakan: ${err.message}`);
  }

  // ----------------------------------------------------
  // UJI 4: Proteksi Login dengan Email Palsu / Tidak Terdaftar
  // ----------------------------------------------------
  console.log('\n📌 [UJI 4] Menguji proteksi sistem jika email belum terdaftar...');
  try {
    const randomEmail = `nonexistent_${Date.now()}@domainpalsu.xyz`;
    const { data: noUserData, error: noUserError } = await supabase.auth.signInWithPassword({
      email: randomEmail,
      password: 'RandomPassword123'
    });

    if (noUserError) {
      console.log(`   ✅ Ditolak dengan benar oleh sistem: "${noUserError.message}"`);
    } else {
      console.error('   ❌ Bahaya: Email tidak terdaftar malah bisa masuk!');
    }
  } catch (err) {
    console.log(`   ✅ Terdeteksi penolakan: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log('🎉 PENGUJIAN LOGIN SELESAI!');
  console.log('====================================================\n');
}

main();
