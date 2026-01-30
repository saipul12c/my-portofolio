import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env manually
const envRaw = fs.readFileSync(new URL('../.env', import.meta.url));
const env = Object.fromEntries(
  envRaw
    .toString()
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => l.split('='))
    .map(([k, ...v]) => [k, v.join('=')])
);

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or ANON key not found in .env');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async () => {
  try {
    const timestamp = Date.now();
    const email = `test+${timestamp}@example.com`;
    const password = `Passw0rd!${timestamp}`;
    const username = `testuser${timestamp}`;

    console.log('Signing up with', email);
    const { data, error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });

    if (signError) {
      console.error('SignUp error:', signError);
      process.exit(3);
    }

    const userId = data?.user?.id || data?.id || null;
    console.log('Received user id:', userId);

    if (!userId) {
      console.error('No user id returned from signup');
      process.exit(4);
    }

    // Wait a moment for any trigger to insert profile
    await new Promise(r => setTimeout(r, 1500));

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, username, created_at')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error querying users table:', profileError);
      process.exit(5);
    }

    console.log('Profile row found in `users` table:');
    console.log(profile);

    if (profile.id === userId) {
      console.log('SUCCESS: profile.id matches auth user id');
      process.exit(0);
    } else {
      console.error('MISMATCH: profile.id does not match user id');
      process.exit(6);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();
