// DEPRECATED: root ApiKomunita removed — use backend/modules/ApiKomunita
module.exports = function deprecatedApiKomunita() {
  throw new Error('ApiKomunita has been removed. Use backend/modules/ApiKomunita instead.');
};
// These are convenience aliases and simple mock implementations using the
// existing data files. They are intentionally minimal and suitable for
// development/testing only.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helpersLocal = require('./lib/helpers');
const JWT_SECRET = helpersLocal.JWT_SECRET || process.env.JWT_SECRET || 'dev-secret';

module.exports.registerExtraRoutes = function registerExtraRoutes(app, deps = {}) {
  const router2 = require('express').Router();
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR } = deps;
  // Helper to get user id from Authorization Bearer token
  function getUserIdFromReq(req) {
    const h = req.headers && req.headers.authorization;
    if (!h) return null;
    const parts = h.split(' ');
    if (parts.length !== 2) return null;
    const token = parts[1];
    try { const p = jwt.verify(token, JWT_SECRET); return p && p.sub; } catch (err) { return null; }
  }

  // Auth endpoints
  router2.post('/auth/register', async (req, res) => {
    const { email, password, username } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    if (users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ error: 'Email already registered' });
    if (username && users.find(u => (u.username || '').toLowerCase() === String(username).toLowerCase())) return res.status(409).json({ error: 'Username already taken' });
    const hashed = await bcrypt.hash(password, 10);
    const { v4: uuidv4 } = require('uuid');
    const newUser = { id: uuidv4(), email, username: username || email.split('@')[0], password_hash: hashed, role: 'user', created_at: new Date().toISOString() };
    users.push(newUser);
    await writeJSON(DATA_FILES.users, users);
    const profile = { id: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role, created_at: newUser.created_at };
    const userFile = require('path').join(USERS_DIR, `${newUser.id}.json`);
    await require('fs').promises.writeFile(userFile, JSON.stringify(profile, null, 2), 'utf8');
    const token = jwt.sign({ sub: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: newUser.id, email: newUser.email, username: newUser.username }, token });
  });

  router2.post('/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    const user = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
  });

  router2.post('/auth/logout', async (req, res) => {
    // stateless token model — frontends should drop token. Return OK for now.
    res.json({ ok: true });
  });

  router2.post('/auth/refresh', async (req, res) => {
    // accepts { token } (current token) and returns a new one if valid
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ error: 'token required' });
    try {
      const p = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
      const newToken = jwt.sign({ sub: p.sub }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token: newToken });
    } catch (err) {
      return res.status(400).json({ error: 'invalid token' });
    }
  });

  router2.post('/auth/forgot-password', async (req, res) => {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    const user = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (!user) return res.json({ ok: true });
    const { v4: uuidv4 } = require('uuid');
    user.reset_token = uuidv4();
    user.reset_expires = Date.now() + 1000 * 60 * 60; // 1 hour
    await writeJSON(DATA_FILES.users, users);
    // In real app you'd email the reset token. Return it for dev convenience.
    res.json({ ok: true, reset_token: user.reset_token });
  });

  router2.post('/auth/reset-password', async (req, res) => {
    const { token, new_password } = req.body || {};
    if (!token || !new_password) return res.status(400).json({ error: 'token and new_password required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    const user = users.find(u => u.reset_token === token && (!u.reset_expires || Date.now() < u.reset_expires));
    if (!user) return res.status(400).json({ error: 'invalid or expired token' });
    user.password_hash = await bcrypt.hash(new_password, 10);
    delete user.reset_token; delete user.reset_expires;
    await writeJSON(DATA_FILES.users, users);
    res.json({ ok: true });
  });

  router2.post('/auth/verify-email', async (req, res) => {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ error: 'token required' });
    await ensureDataFiles();
    const users = await readJSON(DATA_FILES.users);
    const user = users.find(u => u.verify_email_token === token);
    if (!user) return res.status(400).json({ error: 'invalid token' });
    user.email_verified = true; delete user.verify_email_token; user.updated_at = new Date().toISOString();
    await writeJSON(DATA_FILES.users, users);
    res.json({ ok: true });
  });

  router2.post('/auth/enable-2fa', async (req, res) => {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });
    await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const u = users.find(x => String(x.id) === String(uid)); if (!u) return res.status(404).json({ error: 'User not found' }); u.two_factor = true; await writeJSON(DATA_FILES.users, users); res.json({ ok: true });
  });

  router2.post('/auth/disable-2fa', async (req, res) => {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });
    await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const u = users.find(x => String(x.id) === String(uid)); if (!u) return res.status(404).json({ error: 'User not found' }); u.two_factor = false; await writeJSON(DATA_FILES.users, users); res.json({ ok: true });
  });

  // User preferences/profile/privacy/report
  router2.get('/users/me/preferences', async (req, res) => {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });
    await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const u = users.find(x => String(x.id) === String(uid)); if (!u) return res.status(404).json({ error: 'User not found' }); res.json(u.preferences || {});
  });

  router2.put('/users/me/profile', async (req, res) => {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });
    const updates = req.body || {};
    await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const idx = users.findIndex(x => String(x.id) === String(uid)); if (idx === -1) return res.status(404).json({ error: 'User not found' });
    delete updates.password; delete updates.password_hash;
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    await writeJSON(DATA_FILES.users, users);
    // update per-user file as well
    try { const uf = require('path').join(USERS_DIR, `${uid}.json`); await require('fs').promises.writeFile(uf, JSON.stringify(users[idx], null, 2), 'utf8'); } catch (err) {}
    res.json({ id: users[idx].id, username: users[idx].username, bio: users[idx].bio, avatar_url: users[idx].avatar_url });
  });

  router2.get('/users/:id/privacy', async (req, res) => {
    await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const u = users.find(x => String(x.id) === String(req.params.id)); if (!u) return res.status(404).json({ error: 'User not found' }); res.json(u.privacy || { who_can_dm: 'friends', show_status: true });
  });

  router2.post('/users/:id/report', async (req, res) => {
    await ensureDataFiles(); const report = { id: require('uuid').v4(), reported_id: req.params.id, reporter: getUserIdFromReq(req) || null, reason: (req.body && req.body.reason) || 'unspecified', created_at: new Date().toISOString() };
    // store in a lightweight reports.json next to data files
    const path = require('path'); const repFile = path.join(__dirname, 'data', 'reports.json');
    try {
      let list = [];
      if (require('fs').existsSync(repFile)) list = JSON.parse(await require('fs').promises.readFile(repFile, 'utf8') || '[]');
      list.push(report);
      await require('fs').promises.writeFile(repFile, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      // non-fatal
    }
    res.status(201).json({ ok: true, report });
  });

  // Friends / DM basic endpoints
  router2.post('/friends/request', async (req, res) => {
    const uid = getUserIdFromReq(req);
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });
    const { to } = req.body || {};
    if (!to) return res.status(400).json({ error: 'to user id required' });
    await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const me = users.find(x => String(x.id) === String(uid)); const other = users.find(x => String(x.id) === String(to)); if (!other) return res.status(404).json({ error: 'Target not found' });
    me.friend_requests = Array.isArray(me.friend_requests) ? me.friend_requests : [];
    if (!me.friend_requests.includes(to)) me.friend_requests.push(to);
    await writeJSON(DATA_FILES.users, users);
    res.json({ ok: true });
  });

  router2.post('/friends/accept', async (req, res) => {
    const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const { from } = req.body || {}; if (!from) return res.status(400).json({ error: 'from required' }); await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const me = users.find(x => String(x.id) === String(uid)); const other = users.find(x => String(x.id) === String(from)); if (!me || !other) return res.status(404).json({ error: 'User not found' }); me.friends = Array.isArray(me.friends) ? me.friends : []; other.friends = Array.isArray(other.friends) ? other.friends : []; if (!me.friends.includes(from)) me.friends.push(from); if (!other.friends.includes(uid)) other.friends.push(uid); me.friend_requests = (me.friend_requests || []).filter(r => String(r) !== String(from)); await writeJSON(DATA_FILES.users, users); res.json({ ok: true }); });

  router2.post('/friends/reject', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const { from } = req.body || {}; if (!from) return res.status(400).json({ error: 'from required' }); await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const me = users.find(x => String(x.id) === String(uid)); if (!me) return res.status(404).json({ error: 'User not found' }); me.friend_requests = (me.friend_requests || []).filter(r => String(r) !== String(from)); await writeJSON(DATA_FILES.users, users); res.json({ ok: true }); });

  router2.delete('/friends/:id', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const fid = req.params.id; await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const me = users.find(x => String(x.id) === String(uid)); const other = users.find(x => String(x.id) === String(fid)); if (!me) return res.status(404).json({ error: 'User not found' }); me.friends = (me.friends || []).filter(x => String(x) !== String(fid)); if (other) other.friends = (other.friends || []).filter(x => String(x) !== String(uid)); await writeJSON(DATA_FILES.users, users); res.json({ ok: true }); });

  router2.get('/friends/list', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const me = users.find(x => String(x.id) === String(uid)); const friends = (me && me.friends) ? me.friends.map(fid => users.find(u => String(u.id) === String(fid))).filter(Boolean) : []; res.json(friends.map(u => ({ id: u.id, username: u.username, avatar_url: u.avatar_url }))); });

  // Direct messages: create DM and messages (simple model stored in messages.json with dm_id)
  router2.post('/dm/create', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const { members, name } = req.body || {}; if (!Array.isArray(members) || members.length === 0) return res.status(400).json({ error: 'members array required' }); await ensureDataFiles(); const { v4: uuidv4 } = require('uuid'); const dmId = uuidv4(); // create a lightweight channel-like record
    const channels = await readJSON(DATA_FILES.channels); const dm = { id: dmId, name: name || null, is_dm: true, members: Array.from(new Set([uid, ...members])), created_at: new Date().toISOString() }; channels.push(dm); await writeJSON(DATA_FILES.channels, channels); res.status(201).json(dm); });

  router2.get('/dm/:id/messages', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const dmId = req.params.id; await ensureDataFiles(); const msgs = await readJSON(DATA_FILES.messages); const filtered = msgs.filter(m => String(m.channel_id) === String(dmId)); res.json(filtered); });

  router2.post('/dm/:id/messages', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const dmId = req.params.id; const { content } = req.body || {}; if (!content) return res.status(400).json({ error: 'content required' }); await ensureDataFiles(); const { v4: uuidv4 } = require('uuid'); const messages = await readJSON(DATA_FILES.messages); const newMessage = { id: uuidv4(), channel_id: dmId, user_id: uid, content, created_at: new Date().toISOString() }; messages.push(newMessage); await writeJSON(DATA_FILES.messages, messages); res.status(201).json(newMessage); });

  router2.post('/dm/:id/typing', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); // Just ack; real-time systems should use sockets
    res.json({ ok: true }); });

  // Block/unblock
  router2.post('/blocks/:id', async (req, res) => { const uid = getUserIdFromReq(req); if (!uid) return res.status(401).json({ error: 'Not authenticated' }); const bid = req.params.id; await ensureDataFiles(); const users = await readJSON(DATA_FILES.users); const me = users.find(x => String(x.id) === String(uid)); if (!me) return res.status(404).json({ error: 'User not found' }); me.blocks = Array.isArray(me.blocks) ? me.blocks : []; const idx = me.blocks.findIndex(x => String(x) === String(bid)); if (idx === -1) { me.blocks.push(bid); } else { me.blocks.splice(idx,1); } await writeJSON(DATA_FILES.users, users); res.json({ ok: true, blocked: me.blocks.includes(bid) }); });

  // Servers (crud) — stored in discord_servers as lightweight servers
  router2.post('/servers', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; if (!payload.name) return res.status(400).json({ error: 'name required' }); const coll = await readJSON(DATA_FILES.discord_servers); const { v4: uuidv4 } = require('uuid'); const item = { id: uuidv4(), name: payload.name, meta: payload.meta || {}, owner: getUserIdFromReq(req) || null, created_at: new Date().toISOString() }; coll.push(item); await writeJSON(DATA_FILES.discord_servers, coll); res.status(201).json(item); });

  router2.get('/servers', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.discord_servers); res.json(coll); });

  router2.get('/servers/:id', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.discord_servers); const item = coll.find(x => String(x.id) === String(req.params.id)); if (!item) return res.status(404).json({ error: 'Server not found' }); res.json(item); });

  router2.put('/servers/:id', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.discord_servers); const idx = coll.findIndex(x => String(x.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Server not found' }); coll[idx] = { ...coll[idx], ...req.body, updated_at: new Date().toISOString() }; await writeJSON(DATA_FILES.discord_servers, coll); res.json(coll[idx]); });

  router2.delete('/servers/:id', async (req, res) => { await ensureDataFiles(); let coll = await readJSON(DATA_FILES.discord_servers); const idx = coll.findIndex(x => String(x.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Server not found' }); const removed = coll.splice(idx,1)[0]; await writeJSON(DATA_FILES.discord_servers, coll); res.json({ deleted: removed }); });

  // Mount these extra routes
  app.use('/', router2);
};
