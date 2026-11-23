import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

// 1. Baca konfigurasi dari file .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envVars = {};
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
  return envVars;
}

const envVars = loadEnv();
const supabaseUrl = process.env.VITE_SUPABASE_URL || envVars.VITE_SUPABASE_URL || '';
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY || '';
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY || '';

// Validasi jika user tidak sengaja memasukkan publishable key sebagai service role key
if (serviceRoleKey && serviceRoleKey.startsWith('sb_publishable_')) {
  serviceRoleKey = '';
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
    console.error('❌ Error: VITE_SUPABASE_URL tidak ditemukan di .env!');
    rl.close();
    process.exit(1);
  }

  // Gunakan publishableKey (atau serviceRoleKey) untuk membaca daftar user
  const readKey = publishableKey || serviceRoleKey;
  if (!readKey) {
    console.error('❌ Error: VITE_SUPABASE_PUBLISHABLE_KEY tidak ditemukan di .env!');
    rl.close();
    process.exit(1);
  }

  const clientReader = createClient(supabaseUrl, readKey);

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
    rl.close();
    process.exit(1);
  }

  if (!users || users.length === 0) {
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
    users.forEach((u, i) => {
      const idx = String(i + 1).padEnd(2, ' ');
      const nama = String(u.nama || '-').padEnd(20, ' ').slice(0, 20);
      const email = String(u.email || '-').padEnd(31, ' ').slice(0, 31);
      const role = String(u.role || 'USER').padEnd(11, ' ');
      const status = u.status || 'aktif';
      console.log(`${idx} | ${nama} | ${email} | ${role} | ${status}`);
    });
    console.log('---------------------------------------------------------------------------------------');

    // 1. Pilih User
    const inputIdx = await askQuestion('\n👉 Masukkan nomor urut (1-' + users.length + ') atau ketik email user: ');
    if (!inputIdx || !inputIdx.trim()) {
      console.log('\n❌ Tidak ada user yang dipilih. Dibatalkan.');
      rl.close();
      return;
    }
    const chosenNum = parseInt(inputIdx.trim(), 10);

    if (!isNaN(chosenNum) && chosenNum >= 1 && chosenNum <= users.length) {
      targetEmail = users[chosenNum - 1].email;
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

  const selectedUser = users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
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

  // Fungsi helper untuk mencoba update via Service Role Key
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

    // Coba sinkronkan juga ke auth.users raw_app_meta_data
    try {
      if (selectedUser.id) {
        await adminClient.auth.admin.updateUserById(selectedUser.id, {
          app_metadata: { role: targetRole }
        });
      }
    } catch (_) {}

    return data;
  }

  // Cek apakah serviceRoleKey sudah valid
  let updateSuccess = false;
  if (serviceRoleKey) {
    try {
      console.log('⏳ Mengupdate role melalui Supabase Service Role Key...');
      await performUpdate(serviceRoleKey);
      updateSuccess = true;
    } catch (err) {
      console.warn('⚠️  Service Role Key saat ini tidak valid (' + err.message + ').');
      serviceRoleKey = '';
    }
  }

  // Jika belum ada Service Role Key yang valid, beri panduan jelas
  if (!updateSuccess) {
    console.log('ℹ️  Untuk mengupdate role langsung dari script ini, dibutuhkan:');
    console.log('   🔑 Service Role Key (secret) dari Supabase.');
    console.log('   Lokasi: Supabase Dashboard > Project Settings > API > service_role (secret)');
    console.log('   (Perhatian: BUKAN anon key / publishable key)');

    const promptKey = await askQuestion('\n👉 Masukkan Service Role Key (atau tekan Enter untuk selesai dan gunakan SQL di atas): ');
    const cleanedKey = promptKey.trim();

    if (cleanedKey) {
      try {
        console.log('⏳ Mencoba mengupdate role dengan key baru...');
        await performUpdate(cleanedKey);
        updateSuccess = true;

        const saveChoice = await askQuestion('💾 Simpan Service Role Key ini ke file .env? (y/n): ');
        if (saveChoice.trim().toLowerCase() === 'y') {
          const envPath = path.resolve(process.cwd(), '.env');
          fs.appendFileSync(envPath, `\n# Supabase Admin Service Role Key\nSUPABASE_SERVICE_ROLE_KEY=${cleanedKey}\n`);
          console.log('✅ Service Role Key berhasil disimpan ke .env!');
        }
      } catch (keyErr) {
        console.error('\n❌ Key yang dimasukkan tidak valid:', keyErr.message);
        console.log('\n💡 Silakan gunakan Query SQL di atas di Supabase SQL Editor.');
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
