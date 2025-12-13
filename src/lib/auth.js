import api from './backend';

export async function signup({ email, password, username }) {
  return api.apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
}

export async function signin({ email, password }) {
  return api.apiFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function me() {
  return api.apiFetch('/api/auth/me', { method: 'GET' });
}

export default { signup, signin, me };
