module.exports = function registerApiGlobal(app, deps = {}) {
  // Shared routes used by both Tubs and Komunitas
  const router = require('express').Router();
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, JWT_SECRET, getUserFromAuthHeader } = deps;
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const { v4: uuidv4 } = require('uuid');

  // Health
  router.get('/health', (req, res) => res.json({ status: 'ok' }));
  router.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  // Auth: signup
  router.post('/api/auth/signup', async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
    if (username && users.find(u => (u.username || '').toLowerCase() === String(username).toLowerCase())) return res.status(409).json({ error: 'Username already taken' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), email, username: username || email.split('@')[0], password_hash: hashed, role: 'user', created_at: new Date().toISOString() };
    users.push(newUser);
    await writeJSON(DATA_FILES.users, users);
    const profile = { id: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role, created_at: newUser.created_at };
    const userFile = require('path').join(USERS_DIR, `${newUser.id}.json`);
    await require('fs').promises.writeFile(userFile, JSON.stringify(profile, null, 2), 'utf8');
    const token = jwt.sign({ sub: newUser.id }, JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.status(201).json({ user: { id: newUser.id, email: newUser.email, username: newUser.username }, token });
  });

  // Auth: signin
  router.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
  });

  // Auth: me
  router.get('/api/auth/me', async (req, res) => {
    await ensureDataFiles();
    const userId = getUserFromAuthHeader ? getUserFromAuthHeader(req) : null;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const users = await readJSON(DATA_FILES.users);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
  });

  // Update profile
  router.put('/api/profiles/:id', async (req, res) => {
    await ensureDataFiles();
    const id = req.params.id; const updates = req.body;
    const users = await readJSON(DATA_FILES.users);
    const idx = users.findIndex(u => String(u.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    delete updates.password; delete updates.password_hash;
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    await writeJSON(DATA_FILES.users, users);
    const user = users[idx];
    res.json({ id: user.id, email: user.email, username: user.username, role: user.role, avatar_url: user.avatar_url });
  });

  // Users list and public profile
  router.get('/api/users', async (req, res) => {
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    const q = String(req.query.q || '').toLowerCase().trim();
    let out = users.map(u => ({ id: u.id, username: u.username, email: u.email, avatar_url: u.avatar_url, role: u.role }));
    if (q) out = out.filter(u => (u.username || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
    res.json(out);
  });

  router.get('/api/users/:id', async (req, res) => {
    await ensureDataFiles();
    // try per-user file first
    try {
      const txt = await require('fs').promises.readFile(require('path').join(USERS_DIR, `${req.params.id}.json`), 'utf8');
      return res.json(JSON.parse(txt || '{}'));
    } catch (err) {
      // fallback to central users list
    }
    const profile = (await readJSON(DATA_FILES.users)).find(u => String(u.id) === String(req.params.id));
    if (!profile) return res.status(404).json({ error: 'User not found' });
    res.json({ id: profile.id, username: profile.username, avatar_url: profile.avatar_url });
  });

  // Update avatar
  router.post('/api/users/:id/avatar', async (req, res) => {
    await ensureDataFiles();
    const id = req.params.id; const { avatar_url } = req.body || {};
    if (!avatar_url) return res.status(400).json({ error: 'avatar_url required' });
    const userFile = require('path').join(USERS_DIR, `${id}.json`);
    try {
      if (require('fs').existsSync(userFile)) {
        const txt = await require('fs').promises.readFile(userFile, 'utf8');
        const obj = JSON.parse(txt || '{}'); obj.avatar_url = avatar_url; obj.updated_at = new Date().toISOString();
        await require('fs').promises.writeFile(userFile, JSON.stringify(obj, null, 2), 'utf8');
      }
      const users = await readJSON(DATA_FILES.users);
      const idx = users.findIndex(u => String(u.id) === String(id));
      if (idx !== -1) { users[idx].avatar_url = avatar_url; users[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.users, users); }
      res.json({ id, avatar_url });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update avatar' });
    }
  });

  // User messages
  router.get('/api/users/:id/messages', async (req, res) => {
    await ensureDataFiles();
    const uid = req.params.id; const allMsgs = await readJSON(DATA_FILES.messages);
    const filtered = allMsgs.filter(m => String(m.user_id) === String(uid));
    filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    res.json(filtered.slice(-200));
  });

  // Simple global search
  router.get('/api/search', async (req, res) => {
    await ensureDataFiles();
    const q = String(req.query.q || '').toLowerCase().trim();
    if (!q) return res.status(400).json({ error: 'q query parameter required' });
    const [communities, channels, users] = await Promise.all([ readJSON(DATA_FILES.communities), readJSON(DATA_FILES.channels), readJSON(DATA_FILES.users) ]);
    const cRes = communities.filter(c => (c.name || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)).slice(0,20);
    const chRes = channels.filter(c => (c.name || '').toLowerCase().includes(q)).slice(0,20);
    const uRes = users.filter(u => (u.username || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)).slice(0,20).map(u => ({ id: u.id, username: u.username, avatar_url: u.avatar_url }));
    res.json({ communities: cRes, channels: chRes, users: uRes });
  });

  // Site stats
  router.get('/api/stats', async (req, res) => {
    await ensureDataFiles();
    const [users, channels, communities, messages] = await Promise.all([ readJSON(DATA_FILES.users), readJSON(DATA_FILES.channels), readJSON(DATA_FILES.communities), readJSON(DATA_FILES.messages) ]);
    res.json({ users: users.length, channels: channels.length, communities: communities.length, messages: messages.length });
  });

  // Account tiers
  router.get('/api/account-tiers', async (req, res) => { await ensureDataFiles(); const tiers = await readJSON(DATA_FILES.account_tiers); res.json(tiers); });
  router.post('/api/account-tiers', async (req, res) => { await ensureDataFiles(); const payload = req.body; if (!payload || !payload.name) return res.status(400).json({ error: 'name required' }); const tiers = await readJSON(DATA_FILES.account_tiers); const newTier = { id: uuidv4(), ...payload, created_at: new Date().toISOString() }; tiers.push(newTier); await writeJSON(DATA_FILES.account_tiers, tiers); res.status(201).json(newTier); });
  router.put('/api/account-tiers/:id', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const payload = req.body; const tiers = await readJSON(DATA_FILES.account_tiers); const idx = tiers.findIndex(t => String(t.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); tiers[idx] = { ...tiers[idx], ...payload, updated_at: new Date().toISOString() }; await writeJSON(DATA_FILES.account_tiers, tiers); res.json(tiers[idx]); });
  router.delete('/api/account-tiers/:id', async (req, res) => { await ensureDataFiles(); const id = req.params.id; let tiers = await readJSON(DATA_FILES.account_tiers); const idx = tiers.findIndex(t => String(t.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); const removed = tiers.splice(idx,1)[0]; await writeJSON(DATA_FILES.account_tiers, tiers); res.json({ deleted: removed }); });

  app.use('/', router);
};
