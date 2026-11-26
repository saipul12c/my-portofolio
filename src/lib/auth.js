import { assertSupabase } from './supabaseClient';

export async function signup({ email, password, username }) {
  const client = assertSupabase();
  const { data, error } = await client.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { nama: username?.trim() } }
  });
  if (error) throw error;
  return data;
}

export async function signin({ email, password }) {
  const client = assertSupabase();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });
  if (error) throw error;
  return data;
}

export async function me() {
  const client = assertSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data?.user || null;
}

export default { signup, signin, me };
