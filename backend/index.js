const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*' } });

// CORS
const allowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];
app.use(cors({ origin: allowed }));

app.use(express.json());

// Serve frontend public/data as backend-static so frontend can fetch via backend
const FRONTEND_PUBLIC_DATA = path.join(__dirname, '..', 'public', 'data');
if (existsSync(FRONTEND_PUBLIC_DATA)) {
  app.use('/data', express.static(FRONTEND_PUBLIC_DATA));
}

// Serve simple avatar static assets located under backend/public/avatar
const BACKEND_AVATAR_DIR = path.join(__dirname, 'public', 'avatar');
if (existsSync(BACKEND_AVATAR_DIR)) {
  app.use('/avatar', express.static(BACKEND_AVATAR_DIR));
}

// Generic endpoint to serve static JSON or other files from frontend folders
app.get('/api/static/*', async (req, res) => {
  const rel = req.params[0] || '';
  // Candidate locations (public/data first, then src/data)
  const candidates = [
    path.join(__dirname, '..', 'public', 'data', rel),
    path.join(__dirname, '..', 'src', 'data', rel)
  ];

  for (const p of candidates) {
    try {
      if (existsSync(p)) {
        // If it's a directory, reject
        const stat = await fs.stat(p);
        if (stat.isDirectory()) continue;
        const txt = await fs.readFile(p, 'utf8');
        if (p.toLowerCase().endsWith('.json')) {
          try {
            return res.json(JSON.parse(txt || 'null'));
          } catch (err) {
            return res.status(500).json({ error: 'Invalid JSON file' });
          }
        }
        // fallback: send raw content with content-type by extension
        const ext = path.extname(p).slice(1) || 'txt';
        res.type(ext).send(txt);
        return;
      }
    } catch (err) {
      // continue to next candidate
    }
  }

  res.status(404).json({ error: 'Static file not found' });
});

// Data directory inside backend
const DB_DIR = path.join(__dirname, 'data');
const DATA_FILES = {
  users: path.join(DB_DIR, 'users.json'),
  communities: path.join(DB_DIR, 'communities.json'),
  channels: path.join(DB_DIR, 'channels.json'),
  messages: path.join(DB_DIR, 'messages.json')
};

const MESSAGES_DIR = path.join(DB_DIR, 'messages');
const USERS_DIR = path.join(DB_DIR, 'users');

async function ensureDataFiles() {
  if (!existsSync(DB_DIR)) {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
  if (!existsSync(USERS_DIR)) {
    await fs.mkdir(USERS_DIR, { recursive: true });
  }
  if (!existsSync(MESSAGES_DIR)) {
    await fs.mkdir(MESSAGES_DIR, { recursive: true });
  }
  for (const key of Object.keys(DATA_FILES)) {
    const p = DATA_FILES[key];
    if (!existsSync(p)) {
      await fs.writeFile(p, '[]', 'utf8');
    }
  }

  // lightweight migration: if global messages.json has items, create per-channel files
  try {
    const globalMsgs = await readJSON(DATA_FILES.messages);
    if (globalMsgs && globalMsgs.length > 0) {
      const byChannel = new Map();
      globalMsgs.forEach(m => {
        const cid = String(m.channel_id || 'unknown');
        if (!byChannel.has(cid)) byChannel.set(cid, []);
        byChannel.get(cid).push(m);
      });
      for (const [cid, msgs] of byChannel.entries()) {
        const p = path.join(MESSAGES_DIR, `${cid}.json`);
        if (!existsSync(p)) {
          await fs.writeFile(p, JSON.stringify(msgs, null, 2), 'utf8');
        }
      }
    }
  } catch (err) {
    // non-fatal
    console.warn('Migration to per-channel message files failed:', err.message || err);
  }
}

async function readJSON(file) {
  try {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    return [];
  }
}

async function readChannelMessagesFile(channelId) {
  const p = path.join(MESSAGES_DIR, `${channelId}.json`);
  try {
    if (!existsSync(p)) return [];
    const txt = await fs.readFile(p, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (err) {
    return [];
  }
}

async function getProfileForUser(userId) {
  if (!userId) return null;
  try {
    // per-user profile file (public profile) takes precedence
    const userFile = path.join(USERS_DIR, `${userId}.json`);
    if (existsSync(userFile)) {
      const txt = await fs.readFile(userFile, 'utf8');
      return JSON.parse(txt || '{}');
    }

    // fallback: search in central users list
    const users = await readJSON(DATA_FILES.users);
    const u = users.find(x => String(x.id) === String(userId));
    if (u) return { id: u.id, username: u.username, avatar_url: u.avatar_url };
    return null;
  } catch (err) {
    return null;
  }
}

async function writeChannelMessagesFile(channelId, data) {
  const p = path.join(MESSAGES_DIR, `${channelId}.json`);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Backwards-compatible alias used by frontend helpers (some places call /api/health)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// --- AUTH ---
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  await ensureDataFiles();
  const users = await readJSON(DATA_FILES.users);
  // Ensure unique email and username
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
  if (username && users.find(u => (u.username || '').toLowerCase() === String(username).toLowerCase())) return res.status(409).json({ error: 'Username already taken' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    username: username || email.split('@')[0],
    password_hash: hashed,
    role: 'user',
    created_at: new Date().toISOString()
  };

  // add to central users list
  users.push(newUser);
  await writeJSON(DATA_FILES.users, users);

  // create per-user profile file (public profile only)
  const profile = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
    created_at: newUser.created_at
  };
  const userFile = path.join(USERS_DIR, `${newUser.id}.json`);
  await fs.writeFile(userFile, JSON.stringify(profile, null, 2), 'utf8');

  const token = jwt.sign({ sub: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: { id: newUser.id, email: newUser.email, username: newUser.username }, token });
});

app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  await ensureDataFiles();
  const users = await readJSON(DATA_FILES.users);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
});

function getUserFromAuthHeader(req) {
  const h = req.headers.authorization;
  if (!h) return null;
  const parts = h.split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.sub;
  } catch (err) {
    return null;
  }
}

app.get('/api/auth/me', async (req, res) => {
  await ensureDataFiles();
  const userId = getUserFromAuthHeader(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const users = await readJSON(DATA_FILES.users);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
});

// Update profile
app.put('/api/profiles/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const updates = req.body;
  const users = await readJSON(DATA_FILES.users);
  const idx = users.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  // prevent password overwrite via this endpoint
  delete updates.password;
  delete updates.password_hash;
  users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
  await writeJSON(DATA_FILES.users, users);
  const user = users[idx];
  res.json({ id: user.id, email: user.email, username: user.username, role: user.role, avatar_url: user.avatar_url });
});

// --- COMMUNITIES ---
app.get('/api/communities', async (req, res) => {
  await ensureDataFiles();
  const data = await readJSON(DATA_FILES.communities);
  // newest first
  data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(data);
});

app.get('/api/communities/:id', async (req, res) => {
  await ensureDataFiles();
  const data = await readJSON(DATA_FILES.communities);
  const item = data.find(d => String(d.id) === String(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/communities', async (req, res) => {
  await ensureDataFiles();
  const payload = req.body;
  const data = await readJSON(DATA_FILES.communities);
  const newItem = { id: uuidv4(), ...payload, created_at: new Date().toISOString() };
  data.push(newItem);
  await writeJSON(DATA_FILES.communities, data);
  res.status(201).json(newItem);
});

app.put('/api/communities/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const payload = req.body;
  const data = await readJSON(DATA_FILES.communities);
  const idx = data.findIndex(d => String(d.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data[idx] = { ...data[idx], ...payload, updated_at: new Date().toISOString() };
  await writeJSON(DATA_FILES.communities, data);
  res.json(data[idx]);
});

app.delete('/api/communities/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  let data = await readJSON(DATA_FILES.communities);
  const idx = data.findIndex(d => String(d.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = data.splice(idx,1);
  await writeJSON(DATA_FILES.communities, data);
  res.json({ deleted: removed[0] });
});

// --- SERVERS / CHANNELS ---
app.get('/api/servers', async (req, res) => {
  await ensureDataFiles();
  // servers are derived from channels' server_id or stored separately; create simple servers list
  const channels = await readJSON(DATA_FILES.channels);
  const serverMap = new Map();
  channels.forEach(c => {
    if (!serverMap.has(c.server_id)) {
      serverMap.set(c.server_id, { id: c.server_id, name: c.server_name || 'Server', icon: '🟢', created_at: c.created_at });
    }
  });
  res.json(Array.from(serverMap.values()));
});

app.get('/api/channels', async (req, res) => {
  await ensureDataFiles();
  const serverId = req.query.server_id;
  let channels = await readJSON(DATA_FILES.channels);
  if (serverId) channels = channels.filter(c => String(c.server_id) === String(serverId));
  channels.sort((a,b) => (a.position || 0) - (b.position || 0));
  res.json(channels);
});

app.post('/api/channels', async (req, res) => {
  await ensureDataFiles();
  const payload = req.body; // should include server_id, name, position
  const channels = await readJSON(DATA_FILES.channels);
  const serverChannels = channels.filter(c => String(c.server_id) === String(payload.server_id));
  if (serverChannels.length >= 50) return res.status(400).json({ error: 'Max 50 channels per server' });
  const newCh = { id: uuidv4(), ...payload, created_at: new Date().toISOString() };
  channels.push(newCh);
  await writeJSON(DATA_FILES.channels, channels);
  res.status(201).json(newCh);
});

// --- MESSAGES: persisted + realtime via socket.io ---
app.get('/api/messages', async (req, res) => {
  await ensureDataFiles();
  const channelId = req.query.channel_id;
  // If per-channel file exists, read that to avoid scanning large global file.
  if (channelId) {
    let messages = await readChannelMessagesFile(channelId);
    messages.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    const enriched = await Promise.all(messages.slice(-200).map(async (m) => ({
      ...m,
      profiles: await getProfileForUser(m.user_id)
    })));
    return res.json(enriched);
  }

  // fallback: return last 200 from global messages file
  let messages = await readJSON(DATA_FILES.messages);
  messages.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  const last = messages.slice(-200);
  const enriched = await Promise.all(last.map(async (m) => ({ ...m, profiles: await getProfileForUser(m.user_id) })));
  res.json(enriched);
});

app.post('/api/messages', async (req, res) => {
  await ensureDataFiles();
  const { channel_id, user_id, content } = req.body;
  if (!channel_id || !user_id || !content) return res.status(400).json({ error: 'channel_id, user_id, content required' });
  const messages = await readJSON(DATA_FILES.messages);
  const newMessage = { id: uuidv4(), channel_id, user_id, content, created_at: new Date().toISOString() };
  messages.push(newMessage);
  await writeJSON(DATA_FILES.messages, messages);

  // also write to per-channel file to keep files smaller and easier to manage
  try {
    const chMsgs = await readChannelMessagesFile(channel_id);
    chMsgs.push(newMessage);
    await writeChannelMessagesFile(channel_id, chMsgs);
  } catch (err) {
    console.warn('Failed to write per-channel messages file', err.message || err);
  }
  // prepare enriched object with author profile
  try {
    const profile = await getProfileForUser(user_id);
    const outgoing = { ...newMessage, profiles: profile };
    // broadcast via socket.io
    io.to(String(channel_id)).emit('message', outgoing);
    res.status(201).json(outgoing);
  } catch (err) {
    // best-effort: still return minimally enriched payload
    io.to(String(channel_id)).emit('message', newMessage);
    res.status(201).json({ ...newMessage, profiles: null });
  }
});

// Endpoint: top active channels by distinct users (default limit 10)
app.get('/api/channels/active', async (req, res) => {
  await ensureDataFiles();
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
  const channels = await readJSON(DATA_FILES.channels);

  // For each channel, try to read per-channel messages file first, fallback to scanning global messages
  const results = await Promise.all(channels.map(async (ch) => {
    let chMsgs = await readChannelMessagesFile(ch.id);
    if (!chMsgs || chMsgs.length === 0) {
      // fallback: scan global messages once
      const allMsgs = await readJSON(DATA_FILES.messages);
      chMsgs = allMsgs.filter(m => String(m.channel_id) === String(ch.id));
    }
    const message_count = chMsgs.length;
    const unique_users = new Set(chMsgs.filter(m => m.user_id).map(m => String(m.user_id)));
    return {
      ...ch,
      message_count,
      member_count: unique_users.size
    };
  }));

  // sort by member_count desc, then message_count desc
  results.sort((a,b) => (b.member_count - a.member_count) || (b.message_count - a.message_count));
  res.json(results.slice(0, limit));
});

// Socket.IO handlers
io.on('connection', (socket) => {
  socket.on('join', (payload) => {
    // payload: { channelId, user }
    if (!payload || !payload.channelId) return;
    socket.join(String(payload.channelId));
    socket.emit('joined', { channelId: payload.channelId });
  });

  socket.on('leave', (payload) => {
    if (!payload || !payload.channelId) return;
    socket.leave(String(payload.channelId));
  });

  socket.on('message', async (payload) => {
    // payload: { channelId, userId, content }
    try {
      if (!payload || !payload.channelId || !payload.content) return;
      await ensureDataFiles();
      const messages = await readJSON(DATA_FILES.messages);
      const newMessage = { id: uuidv4(), channel_id: payload.channelId, user_id: payload.userId || null, content: payload.content, created_at: new Date().toISOString() };
      messages.push(newMessage);
      await writeJSON(DATA_FILES.messages, messages);
      // attach profile info before broadcasting
      const profile = await getProfileForUser(payload.userId || null);
      io.to(String(payload.channelId)).emit('message', { ...newMessage, profiles: profile });
    } catch (err) {
      console.error('Socket message error', err);
    }
  });
});

// Ensure data files exist then start server
ensureDataFiles().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend JSON server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to prepare data files:', err);
});
