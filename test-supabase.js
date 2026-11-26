/**
 * Supabase Health & Compliance Diagnostic Script (2025/2026 Standards)
 * Jalankan via: npm run test:supabase
 *
 * Script ini TIDAK pernah mencetak nilai mentah API key/rahasia ke terminal.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const loadLocalEnv = () => {
  const vars = {};
  for (const filename of ['.env', '.env.local']) {
    const filePath = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      vars[key] = val;
    }
  }
  return vars;
};

const isGitTracked = (file) => {
  try {
    execSync(`git ls-files --error-unmatch ${file}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const describeKeyType = (key) => {
  if (!key) return 'missing';
  if (key.startsWith('sb_secret_')) return 'sb_secret_';
  if (key.startsWith('sb_publishable_')) return 'sb_publishable_';
  if (key.startsWith('eyJ')) return 'legacy_jwt';
  return 'unknown_format';
};

async function runDiagnostics() {
  const args = new Set(process.argv.slice(2));
  const skipNetwork = args.has('--offline');
  let hasError = false;
  let hasWarning = false;

  console.log('\n====================================================');
  console.log('🧪 SUPABASE IMPLEMENTATION & 2026 COMPLIANCE CHECK');
  console.log('====================================================');

  // 1. Cek versi @supabase/supabase-js
  try {
    const supaPkgPath = path.resolve(process.cwd(), 'node_modules/@supabase/supabase-js/package.json');
    if (fs.existsSync(supaPkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(supaPkgPath, 'utf8'));
      console.log(`📦 @supabase/supabase-js terpasang: v${pkg.version}`);
    } else {
      console.log('⚠️  @supabase/supabase-js belum ditemukan di node_modules (jalankan npm install).');
      hasWarning = true;
    }
  } catch (err) {
    console.log('⚠️  Gagal membaca versi @supabase/supabase-js:', err.message);
    hasWarning = true;
  }

  // 2. Cek Git tracking untuk file sensitif
  if (isGitTracked('.env')) {
    console.log('🚨 KEAMANAN: File .env masih terlacak di Git! Jalankan "git rm --cached .env" dan rotasi API key jika sudah di-push.');
    hasWarning = true;
  } else {
    console.log('✅ Git tracking: .env tidak terlacak (aman).');
  }

  // 3. Cek konfigurasi env tanpa mencetak secret mentah
  const fileEnv = args.has('--no-env-file') ? {} : loadLocalEnv();
  const url = (process.env.VITE_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL || '').trim();
  const pubKey = (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || fileEnv.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();
  const secretKey = (
    process.env.SUPABASE_SECRET_KEY ||
    fileEnv.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    fileEnv.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim();

  if (!url || !/^https?:\/\//i.test(url)) {
    console.log('⚠️  VITE_SUPABASE_URL belum dikonfigurasi (lihat .env.example). Lewati tes jaringan.');
    console.log('====================================================\n');
    process.exit(0);
  }

  const urlHost = new URL(url).hostname;
  console.log(`🌐 Project Host : ${urlHost}`);

  const pubType = describeKeyType(pubKey);
  if (pubType === 'sb_secret_') {
    console.log('❌ CRITICAL: VITE_SUPABASE_PUBLISHABLE_KEY memakai sb_secret_ key! Segera ganti ke sb_publishable_.');
    hasError = true;
  } else if (pubType === 'sb_publishable_') {
    console.log('✅ Publishable Key: Memakai standar baru sb_publishable_...');
  } else if (pubType === 'legacy_jwt') {
    console.log('⚠️  Publishable Key: Masih memakai legacy JWT anon key (eyJ...). Disarankan migrasi ke sb_publishable_ sebelum sunset late 2026.');
    hasWarning = true;
  } else if (pubType === 'missing') {
    console.log('❌ VITE_SUPABASE_PUBLISHABLE_KEY belum diisi.');
    hasError = true;
  } else {
    console.log('⚠️  Publishable Key: Format tidak dikenali.');
    hasWarning = true;
  }

  const secType = describeKeyType(secretKey);
  if (secType === 'sb_secret_') {
    console.log('🔑 Server Secret Key: SUPABASE_SECRET_KEY (sb_secret_...) tersedia.');
  } else if (secType === 'legacy_jwt') {
    console.log('ℹ️  Server Secret Key: Memakai legacy service_role JWT. Disarankan beralih ke SUPABASE_SECRET_KEY (sb_secret_...).');
  }

  if (skipNetwork || hasError) {
    console.log('====================================================\n');
    process.exit(hasError ? 1 : 0);
  }

  // 4. Tes konektivitas, GRANTs (Oct 30 2026), RPC & RLS privasi
  console.log('\n🔍 Memeriksa tabel, GRANTs (Oct 2026+), RPC, dan RLS...');
  const client = createClient(url, pubKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const publicTables = ['blog_posts', 'communities', 'videos', 'system_config'];
  for (const table of publicTables) {
    const { error } = await client.from(table).select('*', { head: true, count: 'exact' });
    if (!error) {
      console.log(`✅ Tabel public.${table}: dapat diakses.`);
    } else if (error.code === '42501') {
      console.log(`❌ Tabel public.${table}: 42501 permission denied (kemungkinan missing GRANT pasca update Supabase 30 Okt 2026). Jalankan ulang SQL di database_supa/!`);
      hasError = true;
    } else {
      console.log(`⚠️  Tabel public.${table}: ${error.message} (${error.code || 'unknown'})`);
      hasWarning = true;
    }
  }

  // Cek RPC profil publik
  const { error: rpcErr } = await client.rpc('get_public_profiles').limit(1);
  if (!rpcErr) {
    console.log('✅ RPC public.get_public_profiles(): aktif.');
  } else if (rpcErr.code === 'PGRST202' || rpcErr.code === '42883') {
    console.log('⚠️  RPC public.get_public_profiles() belum ada. Jalankan ulang database_supa/supabase-Live-diskusi.sql.');
    hasWarning = true;
  } else {
    console.log(`⚠️  RPC get_public_profiles: ${rpcErr.message}`);
    hasWarning = true;
  }

  // Cek privasi email pada public.users untuk akses anon
  const { data: anonUsers, error: anonUsersErr } = await client.from('users').select('email').limit(1);
  if (!anonUsersErr && Array.isArray(anonUsers) && anonUsers.length > 0 && anonUsers[0]?.email) {
    console.log('🚨 PRIVASI RLS: Kolom email pada public.users masih terbaca oleh anon! Jalankan ulang database_supa/supabase-Live-diskusi.sql.');
    hasWarning = true;
  } else {
    console.log('✅ Privasi Email RLS (public.users): terlindungi dari pembacaan anon.');
  }

  console.log('\n====================================================');
  if (hasError) {
    console.log('❌ Diagnostic selesai dengan ERROR (lihat detail di atas).');
  } else if (hasWarning) {
    console.log('⚠️  Diagnostic selesai dengan beberapa peringatan.');
  } else {
    console.log('✅ Semua pemeriksaan Supabase lolos!');
  }
  console.log('====================================================\n');
  process.exit(hasError ? 1 : 0);
}

runDiagnostics().catch((err) => {
  console.error('❌ Diagnostic gagal dijalankan:', err.message);
  process.exit(1);
});
