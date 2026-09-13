import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prioritaskan .env di folder ini (test/LIVE-DISCUSSION/.env), lalu root .env
const LOCAL_ENV_PATH = path.resolve(__dirname, '.env');
const ROOT_ENV_PATH = path.resolve(process.cwd(), '.env');
const TARGET_ENV_PATH = fs.existsSync(LOCAL_ENV_PATH) ? LOCAL_ENV_PATH : ROOT_ENV_PATH;

// 1. Membaca & Menyimpan Konfigurasi .env
function loadEnv() {
  const env = {};

  const parseFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key) {
        env[key.trim()] = vals.join('=').trim();
      }
    }
  };

  // 1. Baca root .env jika ada
  parseFile(ROOT_ENV_PATH);
  // 2. Baca local .env (test/LIVE-DISCUSSION/.env) agar diutamakan
  parseFile(LOCAL_ENV_PATH);

  if (Object.keys(env).length === 0) {
    throw new Error(`.env file tidak ditemukan di ${LOCAL_ENV_PATH} maupun ${ROOT_ENV_PATH}`);
  }

  return env;
}

function saveEnvKey(key, value) {
  const savePath = fs.existsSync(LOCAL_ENV_PATH) ? LOCAL_ENV_PATH : TARGET_ENV_PATH;
  let content = fs.existsSync(savePath) ? fs.readFileSync(savePath, 'utf8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  fs.writeFileSync(savePath, content, 'utf8');
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
let serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL tidak ditemukan di .env!');
  process.exit(1);
}

const rl = readline.createInterface({ input, output });

// 2. Inisialisasi Supabase Admin Client
async function getSupabaseAdminClient() {
  if (!serviceRoleKey) {
    console.log('================================================================');
    console.log('🛡️  KUNCI ADMIN DIPERLUKAN (SUPABASE SERVICE ROLE KEY)');
    console.log('================================================================');
    console.log('Untuk mengelola akun (ganti password akun lain, ubah email secara');
    console.log('langsung, & hapus akun auth tanpa membuka dashboard Supabase),');
    console.log('dibutuhkan "service_role secret" dari Supabase Anda.\n');
    console.log('📍 Cara ambil: Buka Supabase -> Project Settings -> API -> service_role secret\n');

    const inputKey = await rl.question('👉 Masukkan Service Role Key Anda: ');
    if (!inputKey.trim()) {
      console.log('⚠️  Kunci tidak dimasukkan. Mencoba menggunakan ANON_KEY (fitur auth.admin mungkin terbatas)...');
      serviceRoleKey = anonKey;
    } else {
      serviceRoleKey = inputKey.trim();
      const saveChoice = await rl.question('💾 Simpan kunci ini ke file .env agar tidak perlu input lagi? (y/n) [default: y]: ');
      if (saveChoice.toLowerCase() !== 'n') {
        saveEnvKey('SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey);
        console.log('✅ Service Role Key berhasil disimpan ke .env!\n');
      }
    }
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Format Role
const USER_ROLES = {
  SUPER_ADMIN: { level: 10, name: 'Super Admin', badge: '👑' },
  ADMIN: { level: 8, name: 'Admin', badge: '🛡️' },
  MODERATOR: { level: 5, name: 'Moderator', badge: '⭐' },
  PREMIUM: { level: 3, name: 'Premium', badge: '💎' },
  VERIFIED: { level: 2, name: 'Verified', badge: '✅' },
  USER: { level: 1, name: 'User', badge: '👤' }
};

// 3. FUNGSI-FUNGSI MANAJEMEN AKUN

// A. Lihat Semua Akun
async function listAllUsers(adminClient) {
  console.log('\n⏳ Mengambil data akun dari Supabase Auth & Database...');
  
  // Ambil dari auth.users
  let authUsers = [];
  try {
    const { data, error } = await adminClient.auth.admin.listUsers();
    if (error) throw error;
    authUsers = data.users || [];
  } catch (err) {
    console.warn(`   ⚠️  Tidak bisa mengambil auth.users: ${err.message}`);
  }

  // Ambil dari public.users (urutkan berdasarkan tanggal_daftar / fallback created_at)
  let { data: dbUsers, error: dbError } = await adminClient
    .from('users')
    .select('*')
    .order('tanggal_daftar', { ascending: false });

  if (dbError && dbError.message.includes('tanggal_daftar')) {
    const retry = await adminClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    dbUsers = retry.data;
    dbError = retry.error;
  }

  if (dbError) {
    console.warn(`   ⚠️  Tidak bisa mengambil public.users: ${dbError.message}`);
    if (authUsers.length === 0) {
      console.error('❌ Gagal mengambil data user:', dbError.message);
      return [];
    }
  }

  // Gabungkan data auth dan database
  const userMap = new Map();

  authUsers.forEach(u => {
    userMap.set(u.id, {
      id: u.id,
      email: u.email,
      nama: u.user_metadata?.nama || u.email?.split('@')[0],
      role: u.user_metadata?.role || u.app_metadata?.role || 'USER',
      status: 'aktif',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at || 'Belum pernah',
      email_confirmed: u.email_confirmed_at ? '✅ Ya' : '⏳ Belum'
    });
  });

  (dbUsers || []).forEach(u => {
    const existing = userMap.get(u.id);
    if (existing) {
      existing.nama = u.nama || existing.nama;
      existing.role = u.role || existing.role;
      existing.status = u.status || existing.status;
      existing.message_count = u.message_count || 0;
    } else {
      userMap.set(u.id, {
        id: u.id,
        email: u.email,
        nama: u.nama,
        role: u.role || 'USER',
        status: u.status || 'aktif',
        created_at: u.tanggal_daftar || u.created_at,
        last_sign_in_at: '-',
        email_confirmed: 'Database Only',
        message_count: u.message_count || 0
      });
    }
  });

  const list = Array.from(userMap.values());

  console.log('\n========================================================================================================');
  console.log(`📋 TOTAL DATA AKUN TERDAFTAR: ${list.length}`);
  console.log('========================================================================================================');
  console.log('No | Nama Lengkap            | Email                           | Role        | Status  | ID Akun');
  console.log('---|-------------------------|---------------------------------|-------------|---------|--------------------------------------');

  list.forEach((u, i) => {
    const no = (i + 1).toString().padEnd(2);
    const nama = (u.nama || '-').slice(0, 23).padEnd(23);
    const email = (u.email || '-').slice(0, 31).padEnd(31);
    const roleBadge = `${USER_ROLES[u.role]?.badge || '👤'} ${u.role}`.slice(0, 11).padEnd(11);
    const status = (u.status || 'aktif').slice(0, 7).padEnd(7);
    console.log(`${no} | ${nama} | ${email} | ${roleBadge} | ${status} | ${u.id}`);
  });
  console.log('========================================================================================================');
  console.log('ℹ️  INFO KEAMANAN PASSWORD:');
  console.log('   Di Supabase (dan standar keamanan dunia), password dienkripsi 1 arah (Bcrypt Hash).');
  console.log('   Password teks polos TIDAK PERNAH disimpan di server, namun Anda bisa me-reset');
  console.log('   atau mengganti password akun apapun ke kata sandi baru melalui menu [4].\n');

  return list;
}

// B. Ubah Username / Nama
async function updateUsername(adminClient, userList) {
  const target = await pickUser(userList, 'mengganti nama / username');
  if (!target) return;

  console.log(`\nAkun terpilih: ${target.nama} (${target.email})`);
  const newName = await rl.question('👉 Masukkan Nama Baru: ');
  if (!newName.trim()) {
    console.log('❌ Batal: Nama tidak boleh kosong.');
    return;
  }

  console.log('⏳ Memperbarui nama...');

  // 1. Update di public.users
  const { error: dbErr } = await adminClient
    .from('users')
    .update({ nama: newName.trim() })
    .eq('id', target.id);

  // 2. Update di auth user_metadata
  try {
    await adminClient.auth.admin.updateUserById(target.id, {
      user_metadata: { nama: newName.trim() }
    });
  } catch (e) {
    // Abaikan jika service role tidak aktif
  }

  if (dbErr) {
    console.error('❌ Gagal memperbarui database:', dbErr.message);
  } else {
    console.log(`✅ Sukses! Nama berhasil diubah menjadi: "${newName.trim()}"`);
  }
}

// C. Ubah Email
async function updateEmail(adminClient, userList) {
  const target = await pickUser(userList, 'mengganti email');
  if (!target) return;

  console.log(`\nAkun terpilih: ${target.nama} (${target.email})`);
  const newEmail = await rl.question('👉 Masukkan Email Baru: ');
  const cleanEmail = newEmail.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    console.log('❌ Format email tidak valid.');
    return;
  }

  console.log('⏳ Memperbarui email...');

  // 1. Update di Auth (tanpa perlu kirim token verifikasi jika pakai service role)
  try {
    const { data, error: authErr } = await adminClient.auth.admin.updateUserById(target.id, {
      email: cleanEmail,
      email_confirm: true // Langsung konfirmasi
    });

    if (authErr) throw authErr;
  } catch (err) {
    console.error('❌ Gagal update di Supabase Auth:', err.message);
    return;
  }

  // 2. Update di public.users
  await adminClient
    .from('users')
    .update({ email: cleanEmail })
    .eq('id', target.id);

  console.log(`✅ Sukses! Email berhasil diubah menjadi: "${cleanEmail}"`);
}

// D. Ganti / Reset Password
async function updatePassword(adminClient, userList) {
  const target = await pickUser(userList, 'mengganti password');
  if (!target) return;

  console.log(`\nAkun terpilih: ${target.nama} (${target.email})`);
  const newPassword = await rl.question('👉 Masukkan Password Baru (minimal 6 karakter): ');
  if (newPassword.length < 6) {
    console.log('❌ Password minimal 6 karakter.');
    return;
  }

  console.log('⏳ Mengubah password di Supabase Auth...');
  try {
    const { data, error } = await adminClient.auth.admin.updateUserById(target.id, {
      password: newPassword
    });

    if (error) throw error;
    console.log(`✅ Sukses! Password untuk akun "${target.email}" berhasil diperbarui ke password baru.`);
  } catch (err) {
    console.error('❌ Gagal mengubah password:', err.message);
  }
}

// E. Ubah Role / Tingkatan Akun
async function updateRole(adminClient, userList) {
  const target = await pickUser(userList, 'mengubah role');
  if (!target) return;

  console.log(`\nAkun terpilih: ${target.nama} (${target.email})`);
  console.log(`Role saat ini : ${target.role}`);
  console.log('\nPILIHAN ROLE YANG TERSEDIA:');
  console.log('1. USER        (Pengguna Standar)');
  console.log('2. VERIFIED    (Terverifikasi ✅)');
  console.log('3. PREMIUM     (Pengguna Premium 💎)');
  console.log('4. MODERATOR   (Moderator Ruangan ⭐)');
  console.log('5. ADMIN       (Administrator Sistem 🛡️)');
  console.log('6. SUPER_ADMIN (Pemilik / Super Admin 👑)');

  const roleChoice = await rl.question('\n👉 Pilih nomor role (1-6): ');
  const roles = ['USER', 'VERIFIED', 'PREMIUM', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
  const index = parseInt(roleChoice) - 1;

  if (isNaN(index) || index < 0 || index >= roles.length) {
    console.log('❌ Pilihan tidak valid.');
    return;
  }

  const selectedRole = roles[index];
  console.log(`⏳ Mengubah role menjadi ${selectedRole}...`);

  // 1. Update di public.users
  const { error: dbError } = await adminClient
    .from('users')
    .update({ role: selectedRole, updated_at: new Date().toISOString() })
    .eq('id', target.id);

  // 2. Update di Supabase Auth Metadata (agar JWT / session frontend sinkron)
  let authWarning = null;
  try {
    const { error: authErr } = await adminClient.auth.admin.updateUserById(target.id, {
      user_metadata: { role: selectedRole },
      app_metadata: { role: selectedRole }
    });
    if (authErr) authWarning = authErr.message;
  } catch (err) {
    authWarning = err.message;
  }

  if (dbError) {
    console.error('❌ Gagal mengubah role di database:', dbError.message);
  } else {
    target.role = selectedRole; // Update cache lokal
    console.log(`✅ Sukses! Role akun "${target.email}" berhasil diubah menjadi: ${selectedRole}`);
    if (authWarning) {
      console.warn(`   ℹ️  Catatan Auth: ${authWarning}`);
    }
  }
}

// F. Hapus Akun Permanen
async function deleteUser(adminClient, userList) {
  const target = await pickUser(userList, 'MENGHAPUS akun');
  if (!target) return;

  console.log(`\n⚠️  PERINGATAN: Anda akan menghapus akun:`);
  console.log(`   Nama  : ${target.nama}`);
  console.log(`   Email : ${target.email}`);
  console.log(`   ID    : ${target.id}`);

  const confirm = await rl.question('❓ Ketik "HAPUS" untuk konfirmasi penghapusan permanen: ');
  if (confirm.trim() !== 'HAPUS') {
    console.log('❌ Dibatalkan: Akun aman dan tidak dihapus.');
    return;
  }

  console.log('⏳ Menghapus akun dari Supabase Auth & Database...');

  // 1. Hapus dari Auth (Otomatis CASCADE ke public.users karena foreign key)
  let authSuccess = false;
  try {
    const { error: authErr } = await adminClient.auth.admin.deleteUser(target.id);
    if (authErr) throw authErr;
    authSuccess = true;
  } catch (err) {
    console.warn(`   ⚠️  Auth Delete: ${err.message}`);
  }

  // 2. Hapus manual dari public.users (sebagai backup jika cascade belum terpasang)
  const { error: dbErr } = await adminClient
    .from('users')
    .delete()
    .eq('id', target.id);

  if (authSuccess || !dbErr) {
    console.log(`✅ Sukses! Akun "${target.email}" berhasil dihapus secara permanen dari sistem.`);
  } else {
    console.error('❌ Gagal menghapus akun:', dbErr?.message);
  }
}

// Helper: Memilih User Berdasarkan Nomor Urut
async function pickUser(userList, actionText) {
  if (!userList || userList.length === 0) {
    console.log('⚠️  Daftar akun kosong. Memuat ulang data...');
    return null;
  }

  const numStr = await rl.question(`\n👉 Masukkan NOMOR URUT akun yang ingin di-${actionText} (1-${userList.length}) [Ketik 0 untuk batal]: `);
  const num = parseInt(numStr);

  if (isNaN(num) || num === 0) {
    console.log('❌ Aksi dibatalkan.');
    return null;
  }

  if (num < 1 || num > userList.length) {
    console.log('❌ Nomor urut tidak ditemukan.');
    return null;
  }

  return userList[num - 1];
}

// G. Sinkronisasi / Seed Akun Uji Coba (Dummy Users)
async function seedTestUsers(adminClient) {
  console.log('\n⏳ Menyiapkan pembuatan / sinkronisasi 6 akun uji coba...');

  const sampleUsers = [
    { id: '00000000-0000-0000-0000-000000000001', email: 'superadmin@test.com', nama: 'Sang Arsitek', role: 'SUPER_ADMIN' },
    { id: '00000000-0000-0000-0000-000000000002', email: 'admin@test.com', nama: 'Penjaga Gerbang', role: 'ADMIN' },
    { id: '00000000-0000-0000-0000-000000000003', email: 'mod@test.com', nama: 'Moderator Alpha', role: 'MODERATOR' },
    { id: '00000000-0000-0000-0000-000000000004', email: 'premium@test.com', nama: 'Sultan Diskusi', role: 'PREMIUM' },
    { id: '00000000-0000-0000-0000-000000000005', email: 'verified@test.com', nama: 'Warga Terverifikasi', role: 'VERIFIED' },
    { id: '00000000-0000-0000-0000-000000000006', email: 'user@test.com', nama: 'Pengunjung Baru', role: 'USER' }
  ];

  for (const u of sampleUsers) {
    let userId = u.id;
    // 1. Buat di Auth jika belum ada
    try {
      const { data, error } = await adminClient.auth.admin.createUser({
        id: u.id,
        email: u.email,
        password: 'LiveTest123!',
        email_confirm: true,
        user_metadata: { nama: u.nama, role: u.role },
        app_metadata: { role: u.role }
      });
      if (error && !error.message.includes('already registered')) {
        console.warn(`   ⚠️  Info Auth untuk ${u.email}: ${error.message}`);
      } else if (data?.user) {
        userId = data.user.id;
      }
    } catch (err) {
      // Abaikan jika akun sudah ada
    }

    // 2. Upsert ke public.users
    const { error: dbErr } = await adminClient
      .from('users')
      .upsert({
        id: userId,
        email: u.email,
        nama: u.nama,
        role: u.role,
        status: 'aktif'
      }, { onConflict: 'id' });

    if (dbErr) {
      console.warn(`   ⚠️  Gagal update database untuk ${u.email}: ${dbErr.message}`);
    } else {
      console.log(`   ✅ Akun siap: ${u.email} [${u.role}]`);
    }
  }

  console.log('\n🎉 Selesai! Semua 6 akun uji coba telah disinkronkan ke Auth & Database.\n');
}

// 4. MENU UTAMA INTERAKTIF
async function main() {
  console.clear();
  console.log('================================================================');
  console.log('🚀 LIVE-DISCUSSION USER MANAGEMENT CONSOLE (SUPABASE CLI)');
  console.log('================================================================');
  console.log(`🌐 Supabase URL: ${supabaseUrl}\n`);

  const adminClient = await getSupabaseAdminClient();
  let cachedUsers = await listAllUsers(adminClient);

  while (true) {
    console.log('\n----------------------------------------------------------------');
    console.log('📌 MENU TINDAKAN MANAJEMEN AKUN:');
    console.log('----------------------------------------------------------------');
    console.log(' [1] 📋 Muat Ulang & Tampilkan Semua Akun');
    console.log(' [2] ✏️  Ubah Username / Nama Akun');
    console.log(' [3] 📧 Ubah Email Akun');
    console.log(' [4] 🔑 Ganti / Reset Password Akun');
    console.log(' [5] 👑 Ubah Role / Tingkatan Akun');
    console.log(' [6] 🗑️  Hapus Akun Permanen');
    console.log(' [7] 🧪 Sinkron / Seed 6 Akun Uji Coba (Dummy Users)');
    console.log(' [0] 🚪 Keluar dari Console');
    console.log('----------------------------------------------------------------');

    const choice = await rl.question('👉 Masukkan nomor pilihan (0-7): ');

    switch (choice.trim()) {
      case '1':
        cachedUsers = await listAllUsers(adminClient);
        break;
      case '2':
        await updateUsername(adminClient, cachedUsers);
        cachedUsers = await listAllUsers(adminClient);
        break;
      case '3':
        await updateEmail(adminClient, cachedUsers);
        cachedUsers = await listAllUsers(adminClient);
        break;
      case '4':
        await updatePassword(adminClient, cachedUsers);
        break;
      case '5':
        await updateRole(adminClient, cachedUsers);
        cachedUsers = await listAllUsers(adminClient);
        break;
      case '6':
        await deleteUser(adminClient, cachedUsers);
        cachedUsers = await listAllUsers(adminClient);
        break;
      case '7':
        await seedTestUsers(adminClient);
        cachedUsers = await listAllUsers(adminClient);
        break;
      case '0':
        console.log('\n👋 Menutup Management Console. Terima kasih!\n');
        rl.close();
        process.exit(0);
      default:
        console.log('⚠️  Pilihan tidak valid. Silakan pilih 0-7.');
        break;
    }
  }
}

main().catch(err => {
  console.error('\n❌ Fatal Error:', err);
  rl.close();
  process.exit(1);
});
