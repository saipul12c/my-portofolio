import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

// 1. Baca konfigurasi dari file .env dan .env.local (prioritas .env.local)
function loadEnv() {
  const envVars = {};
  for (const filename of ['.env', '.env.local']) {
    const envPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          envVars[key] = val;
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
  return envVars;
}

const isEnvTrackedInGit = () => {
  try {
    execSync('git ls-files --error-unmatch .env', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const envVars = loadEnv();
const supabaseUrl = process.env.VITE_SUPABASE_URL || envVars.VITE_SUPABASE_URL || '';
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY || '';
let secretKey =
  process.env.SUPABASE_SECRET_KEY ||
  envVars.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  envVars.SUPABASE_SERVICE_ROLE_KEY ||
  '';

// Validasi jika user tidak sengaja memasukkan publishable key sebagai secret / service role key
if (secretKey && secretKey.startsWith('sb_publishable_')) {
  secretKey = '';
}

const VALID_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR',
  'PREMIUM',
  'VERIFIED',
  'USER'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => {
  if (rl.closed) {
    return resolve('');
  }
  rl.question(query, (ans) => resolve(ans || ''));
});

async function main() {
  console.log('\n====================================================');
  console.log('⚡ SUPABASE ROLE MANAGER - LIVE DISCUSSION');
  console.log('====================================================');
  console.log(`🌐 Supabase URL: ${supabaseUrl || '(Belum disetel di .env)'}`);

  if (!supabaseUrl) {
    console.error('❌ Error: VITE_SUPABASE_URL tidak ditemukan di .env / .env.local!');
    rl.close();
    process.exit(1);
  }

  // Prioritaskan Secret Key agar pembacaan daftar email/role user tidak terblokir RLS privasi email
  const readKey = secretKey || publishableKey;
  if (!readKey) {
    console.error('❌ Error: VITE_SUPABASE_PUBLISHABLE_KEY atau SUPABASE_SECRET_KEY tidak ditemukan!');
    rl.close();
    process.exit(1);
  }

  if (!secretKey) {
    console.log('ℹ️  Catatan: SUPABASE_SECRET_KEY belum disetel. Pembacaan via publishable key mungkin terbatas oleh RLS.');
  }

  const clientReader = createClient(supabaseUrl, readKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Ambil argumen dari command line jika ada (misal: node update-role.js ucup7@gmail.com SUPER_ADMIN)
  const args = process.argv.slice(2);
  let targetEmail = args[0]?.trim();
  let targetRole = args[1]?.trim().toUpperCase();

  console.log('\n🔍 Mengambil daftar pengguna dari database...');
  const { data: users, error: fetchErr } = await clientReader
    .from('users')
    .select('id, email, nama, role, status')
    .order('tanggal_daftar', { ascending: false });

  if (fetchErr) {
    console.error('❌ Gagal mengambil data user:', fetchErr.message);
    if (!secretKey) {
      console.error('💡 Tip: Tambahkan SUPABASE_SECRET_KEY (sb_secret_...) ke .env.local agar script dapat membaca seluruh daftar user.');
    }
    rl.close();
    process.exit(1);
  }

  let resolvedUsers = users || [];
  if (resolvedUsers.length === 0 && !secretKey) {
    console.log('\n⚠️  Daftar user kosong atau terlindungi RLS privasi email karena SUPABASE_SECRET_KEY belum disetel.');
    console.log('   Lokasi key: Supabase Dashboard > Project Settings > API Keys > Secret keys (sb_secret_...)');
    const promptReadKey = await askQuestion('👉 Masukkan SUPABASE_SECRET_KEY (sb_secret_...) untuk membaca daftar user: ');
    const cleanedReadKey = promptReadKey.trim();
    if (!cleanedReadKey || cleanedReadKey.startsWith('sb_publishable_')) {
      console.log('\n❌ Key secret tidak diberikan atau memakai sb_publishable_ key. Dibatalkan.');
      rl.close();
      process.exit(1);
    }
    const adminReader = createClient(supabaseUrl, cleanedReadKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data: adminUsers, error: adminFetchErr } = await adminReader
      .from('users')
      .select('id, email, nama, role, status')
      .order('tanggal_daftar', { ascending: false });
    if (adminFetchErr) {
      console.error('❌ Gagal membaca user dengan secret key tersebut:', adminFetchErr.message);
      rl.close();
      process.exit(1);
    }
    secretKey = cleanedReadKey;
    resolvedUsers = adminUsers || [];
  }

  if (resolvedUsers.length === 0) {
    console.log('ℹ️ Belum ada data pengguna di tabel public.users.');
    rl.close();
    process.exit(0);
  }

  // Jika argumen tidak lengkap, tampilkan tabel dan minta input interaktif
  if (!targetEmail || !targetRole) {
    console.log('\n📋 DAFTAR PENGGUNA TERDAFTAR:');
    console.log('---------------------------------------------------------------------------------------');
    console.log('No | Nama                 | Email                           | Role        | Status');
    console.log('---------------------------------------------------------------------------------------');
    resolvedUsers.forEach((u, i) => {
      const idx = String(i + 1).padEnd(2, ' ');
      const nama = String(u.nama || '-').padEnd(20, ' ').slice(0, 20);
      const email = String(u.email || '-').padEnd(31, ' ').slice(0, 31);
      const role = String(u.role || 'USER').padEnd(11, ' ');
      const status = u.status || 'aktif';
      console.log(`${idx} | ${nama} | ${email} | ${role} | ${status}`);
    });
    console.log('---------------------------------------------------------------------------------------');

    // 1. Pilih User
    const inputIdx = await askQuestion('\n👉 Masukkan nomor urut (1-' + resolvedUsers.length + ') atau ketik email user: ');
    if (!inputIdx || !inputIdx.trim()) {
      console.log('\n❌ Tidak ada user yang dipilih. Dibatalkan.');
      rl.close();
      return;
    }
    const chosenNum = parseInt(inputIdx.trim(), 10);

    if (!isNaN(chosenNum) && chosenNum >= 1 && chosenNum <= resolvedUsers.length) {
      targetEmail = resolvedUsers[chosenNum - 1].email;
    } else {
      targetEmail = inputIdx.trim().toLowerCase();
    }

    // 2. Pilih Role
    console.log('\nPILIHAN ROLE YANG TERSEDIA:');
    VALID_ROLES.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r}`);
    });

    const inputRole = await askQuestion('\n👉 Pilih nomor role (1-6) atau ketik nama role: ');
    const roleNum = parseInt(inputRole.trim(), 10);

    if (!isNaN(roleNum) && roleNum >= 1 && roleNum <= VALID_ROLES.length) {
      targetRole = VALID_ROLES[roleNum - 1];
    } else {
      targetRole = inputRole.trim().toUpperCase();
    }
  }

  // Validasi Role
  if (!VALID_ROLES.includes(targetRole)) {
    console.error(`\n❌ Role "${targetRole}" tidak valid!`);
    console.error(`   Pilihan valid: ${VALID_ROLES.join(', ')}`);
    rl.close();
    process.exit(1);
  }

  const selectedUser = resolvedUsers.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
  if (!selectedUser) {
    console.error(`\n❌ User dengan email "${targetEmail}" tidak ditemukan di database.`);
    rl.close();
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log(`🎯 Target Update: ${selectedUser.nama} (${selectedUser.email})`);
  console.log(`🔄 Role Sekarang: ${selectedUser.role} ➡️ Role Baru: ${targetRole}`);
  console.log('====================================================');

  // Selalu sediakan query SQL instan
  const sqlCommand = `UPDATE public.users SET role = '${targetRole}' WHERE email = '${selectedUser.email}';`;
  console.log('\n💡 QUERY SQL INSTAN (Bisa langsung di-copy ke Supabase SQL Editor):');
  console.log(`   ${sqlCommand}\n`);

  // Fungsi helper untuk mencoba update via Secret Key / Service Role Key
  async function performUpdate(keyToUse) {
    const adminClient = createClient(supabaseUrl, keyToUse, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data, error } = await adminClient
      .from('users')
      .update({ role: targetRole, updated_at: new Date().toISOString() })
      .eq('email', selectedUser.email)
      .select();

    if (error) {
      throw error;
    }

    // Sinkronkan juga ke auth.users app_metadata agar JWT asymmetric / claims ikut selaras
    try {
      if (selectedUser.id) {
        await adminClient.auth.admin.updateUserById(selectedUser.id, {
          app_metadata: { role: targetRole }
        });
      }
    } catch {
      // Abaikan kegagalan sinkronisasi metadata auth opsional
    }

    return data;
  }

  // Cek apakah secretKey sudah valid
  let updateSuccess = false;
  if (secretKey) {
    try {
      console.log('⏳ Mengupdate role melalui Supabase Secret Key...');
      await performUpdate(secretKey);
      updateSuccess = true;
    } catch (err) {
      console.warn('⚠️  Secret Key saat ini tidak valid (' + err.message + ').');
      secretKey = '';
    }
  }

  // Jika belum ada Secret Key yang valid, beri panduan jelas
  if (!updateSuccess) {
    console.log('ℹ️  Untuk mengupdate role langsung dari script ini, dibutuhkan:');
    console.log('   🔑 Secret Key Supabase (server/CLI only).');
    console.log('   Lokasi: Supabase Dashboard > Project Settings > API Keys > Secret keys (sb_secret_...)');
    console.log('   (Mendukung fallback legacy service_role; DILARANG memakai sb_publishable_ atau VITE_*)');

    const promptKey = await askQuestion('\n👉 Masukkan Secret Key Supabase (atau tekan Enter untuk selesai dan gunakan SQL di atas): ');
    const cleanedKey = promptKey.trim();

    if (cleanedKey) {
      if (cleanedKey.startsWith('sb_publishable_')) {
        console.error('\n❌ Ditolak: Anda memasukkan Publishable Key (sb_publishable_...), bukan Secret Key (sb_secret_...).');
      } else {
        try {
          console.log('⏳ Mencoba mengupdate role dengan key baru...');
          await performUpdate(cleanedKey);
          updateSuccess = true;

          const envTracked = isEnvTrackedInGit();
          if (envTracked) {
            console.log('\n🚨 PERINGATAN KEAMANAN GIT:');
            console.log('   File .env masih terlacak di Git! Demi keamanan, key TIDAK akan ditulis ke .env.');
            console.log('   Jalankan: git rm --cached .env');
          }

          const targetFile = '.env.local';
          const saveChoice = await askQuestion(`💾 Simpan SUPABASE_SECRET_KEY ke file ${targetFile} (aman & gitignored)? (y/n): `);
          if (saveChoice.trim().toLowerCase() === 'y') {
            const envLocalPath = path.resolve(process.cwd(), targetFile);
            fs.appendFileSync(envLocalPath, `\n# Supabase Server/CLI Secret Key (JANGAN pakai prefix VITE_)\nSUPABASE_SECRET_KEY=${cleanedKey}\n`);
            console.log(`✅ SUPABASE_SECRET_KEY berhasil disimpan aman ke ${targetFile}!`);
          }
        } catch (keyErr) {
          console.error('\n❌ Key yang dimasukkan tidak valid:', keyErr.message);
          console.log('\n💡 Silakan gunakan Query SQL di atas di Supabase SQL Editor.');
        }
      }
    } else {
      console.log('\n👍 Siap! Silakan jalankan query SQL berikut di Supabase SQL Editor:');
      console.log(`   ${sqlCommand}`);
    }
  }

  if (updateSuccess) {
    console.log('\n🎉 ====================================================');
    console.log('✅ BERHASIL MENGUPDATE ROLE PENGGUNA!');
    console.log('====================================================');
    console.log(`👤 Nama     : ${selectedUser.nama}`);
    console.log(`📧 Email    : ${selectedUser.email}`);
    console.log(`👑 Role Baru : ${targetRole}`);
    console.log('====================================================\n');
  }

  rl.close();
}

main().catch((err) => {
  console.error('\n❌ Terjadi kesalahan fatal:', err);
  rl.close();
  process.exit(1);
});
