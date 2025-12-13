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
const multer = require('multer');

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*', credentials: true } });

// CORS
const allowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];
app.use(cors({ origin: allowed, credentials: true }));

app.use(express.json());

const MODULES_HANDLING_ROUTES = true;

// Serve frontend public/data as backend-static so frontend can fetch via backend
const FRONTEND_PUBLIC_DATA = path.join(__dirname, '..', 'public', 'data');
if (existsSync(FRONTEND_PUBLIC_DATA)) {
  app.use('/data', express.static(FRONTEND_PUBLIC_DATA));
}

// Serve built frontend (Vite `dist`) when available to provide one-process deployment
const FRONTEND_DIST = path.join(__dirname, '..', 'dist');
if (existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  // Catch-all: serve index.html for non-API routes (SPA support)
  app.get('*', (req, res, next) => {
    const p = req.path || '';
    // let API/socket/static routes pass through
    if (p.startsWith('/api') || p.startsWith('/socket.io') || p.startsWith('/data') || p.startsWith('/avatar') || p.startsWith('/api/static')) return next();
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Serve simple avatar static assets located under backend/public/avatar
const BACKEND_AVATAR_DIR = path.join(__dirname, 'public', 'avatar');
if (existsSync(BACKEND_AVATAR_DIR)) {
  app.use('/avatar', express.static(BACKEND_AVATAR_DIR));
}

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!existsSync(UPLOADS_DIR)) {
  try { fs.mkdir(UPLOADS_DIR, { recursive: true }); } catch (err) { /* ignore */ }
}
app.use('/uploads', express.static(UPLOADS_DIR));

// multer setup for multipart uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
  filename: function (req, file, cb) { const name = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'')}`; cb(null, name); }
});
const upload = multer({ storage });

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

// Load shared helpers (centralized file I/O and utility functions)
const helpers = require('./lib/helpers');
const {
  ensureDataFiles,
  readJSON,
  writeJSON,
  DATA_FILES,
  USERS_DIR,
  MESSAGES_DIR,
  readChannelMessagesFile,
  writeChannelMessagesFile,
  getProfileForUser,
  tryReadStreamingFile,
  getUserFromAuthHeader,
  JWT_SECRET
} = helpers;

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Backwards-compatible alias used by frontend helpers (some places call /api/health)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket.IO handlers
io.on('connection', (socket) => {
  // Attempt to authenticate socket using token provided by client in `handshake.auth.token`
  try {
    const hs = socket.handshake || {};
    let token = null;
    if (hs.auth && hs.auth.token) token = hs.auth.token;
    // also accept Authorization header from websocket upgrade (some clients send headers)
    if (!token && hs.headers && hs.headers.authorization) {
      const parts = String(hs.headers.authorization || '').split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') token = parts[1];
    }
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        // payload.sub contains user id per Auth implementation
        socket.userId = payload && payload.sub ? payload.sub : null;
        socket.emit('authenticated', { user_id: socket.userId });
      } catch (err) {
        socket.userId = null;
      }
    } else {
      socket.userId = null;
    }
  } catch (err) {
    socket.userId = null;
  }
  socket.on('join', (payload) => {
    // payload: { channelId }
    if (!payload || !payload.channelId) return;
    socket.join(String(payload.channelId));
    socket.emit('joined', { channelId: payload.channelId });
  });

  socket.on('leave', (payload) => {
    if (!payload || !payload.channelId) return;
    socket.leave(String(payload.channelId));
  });

  socket.on('message', async (payload) => {
    // payload: { channelId, content } -- user identity is taken from authenticated socket when available
    try {
      if (!payload || !payload.channelId || !payload.content) return;
      await ensureDataFiles();
      const senderId = socket.userId || (payload.userId || null);
      const messages = await readJSON(DATA_FILES.messages);
      const newMessage = { id: uuidv4(), channel_id: payload.channelId, user_id: senderId, content: payload.content, created_at: new Date().toISOString() };
      messages.push(newMessage);
      await writeJSON(DATA_FILES.messages, messages);
      // write per-channel file if present
      try {
        const chMsgs = await readChannelMessagesFile(payload.channelId);
        chMsgs.push(newMessage);
        await writeChannelMessagesFile(payload.channelId, chMsgs);
      } catch (err) { /* non-fatal */ }
      // attach profile info before broadcasting
      const profile = await getProfileForUser(senderId || null);
      io.to(String(payload.channelId)).emit('message', { ...newMessage, profiles: profile });
    } catch (err) {
      console.error('Socket message error', err);
    }
  });

  // handle typing events from sockets in addition to HTTP POST /api/typing
  socket.on('typing', (payload) => {
    try {
      // payload: { channel_id, typing }
      if (!payload || !payload.channel_id) return;
      const user_id = socket.userId || payload.user_id || null;
      const out = { channel_id: payload.channel_id, user_id, typing: !!payload.typing, at: new Date().toISOString() };
      io.to(String(payload.channel_id)).emit('typing', out);
    } catch (err) { /* ignore */ }
  });
});

// start: skip defining many legacy routes when modules handle them
if (!MODULES_HANDLING_ROUTES) {

// List all users (sanitized)
app.get('/api/users', async (req, res) => {
  await ensureDataFiles();
  const users = await readJSON(DATA_FILES.users);
  const q = String(req.query.q || '').toLowerCase().trim();
  let out = users.map(u => ({ id: u.id, username: u.username, email: u.email, avatar_url: u.avatar_url, role: u.role }));
  if (q) out = out.filter(u => (u.username || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  res.json(out);
});

// Get public profile for a user
app.get('/api/users/:id', async (req, res) => {
  await ensureDataFiles();
  const profile = await getProfileForUser(req.params.id);
  if (!profile) return res.status(404).json({ error: 'User not found' });
  res.json(profile);
});

// Update user avatar (accepts JSON { avatar_url })
app.post('/api/users/:id/avatar', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const { avatar_url } = req.body || {};
  if (!avatar_url) return res.status(400).json({ error: 'avatar_url required' });
  // update per-user profile file if exists, otherwise update central list
  const userFile = path.join(USERS_DIR, `${id}.json`);
  try {
    if (existsSync(userFile)) {
      const txt = await fs.readFile(userFile, 'utf8');
      const obj = JSON.parse(txt || '{}');
      obj.avatar_url = avatar_url;
      obj.updated_at = new Date().toISOString();
      await fs.writeFile(userFile, JSON.stringify(obj, null, 2), 'utf8');
    }
    const users = await readJSON(DATA_FILES.users);
    const idx = users.findIndex(u => String(u.id) === String(id));
    if (idx !== -1) {
      users[idx].avatar_url = avatar_url;
      users[idx].updated_at = new Date().toISOString();
      await writeJSON(DATA_FILES.users, users);
    }
    res.json({ id, avatar_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Get messages for a user (across channels, last 200)
app.get('/api/users/:id/messages', async (req, res) => {
  await ensureDataFiles();
  const uid = req.params.id;
  const allMsgs = await readJSON(DATA_FILES.messages);
  const filtered = allMsgs.filter(m => String(m.user_id) === String(uid));
  filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  res.json(filtered.slice(-200));
});

// Edit a message (simple text update)
app.patch('/api/messages/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const { content } = req.body || {};
  if (typeof content !== 'string') return res.status(400).json({ error: 'content required' });
  let messages = await readJSON(DATA_FILES.messages);
  const idx = messages.findIndex(m => String(m.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages[idx].content = content;
  messages[idx].edited_at = new Date().toISOString();
  await writeJSON(DATA_FILES.messages, messages);
  // update per-channel file if present
  const channelId = messages[idx].channel_id;
  try {
    const chMsgs = await readChannelMessagesFile(channelId);
    const cidx = chMsgs.findIndex(m => String(m.id) === String(id));
    if (cidx !== -1) {
      chMsgs[cidx].content = content;
      chMsgs[cidx].edited_at = messages[idx].edited_at;
      await writeChannelMessagesFile(channelId, chMsgs);
    }
  } catch (err) {
    // non-fatal
  }
  res.json(messages[idx]);
});

// Delete a message by id
app.delete('/api/messages/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  let messages = await readJSON(DATA_FILES.messages);
  const idx = messages.findIndex(m => String(m.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  const removed = messages.splice(idx, 1)[0];
  await writeJSON(DATA_FILES.messages, messages);
  // remove from per-channel file if present
  try {
    const chMsgs = await readChannelMessagesFile(removed.channel_id);
    const cidx = chMsgs.findIndex(m => String(m.id) === String(id));
    if (cidx !== -1) {
      chMsgs.splice(cidx, 1);
      await writeChannelMessagesFile(removed.channel_id, chMsgs);
    }
  } catch (err) {
    // ignore
  }
  res.json({ deleted: removed });
});

// Simple global search across communities, channels, users
app.get('/api/search', async (req, res) => {
  await ensureDataFiles();
  const q = String(req.query.q || '').toLowerCase().trim();
  if (!q) return res.status(400).json({ error: 'q query parameter required' });
  const [communities, channels, users] = await Promise.all([
    readJSON(DATA_FILES.communities),
    readJSON(DATA_FILES.channels),
    readJSON(DATA_FILES.users)
  ]);
  const cRes = communities.filter(c => (c.name || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)).slice(0,20);
  const chRes = channels.filter(c => (c.name || '').toLowerCase().includes(q)).slice(0,20);
  const uRes = users.filter(u => (u.username || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)).slice(0,20).map(u => ({ id: u.id, username: u.username, avatar_url: u.avatar_url }));
  res.json({ communities: cRes, channels: chRes, users: uRes });
});

// Channel summary: counts, last message, active users
app.get('/api/channels/:id/summary', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const channels = await readJSON(DATA_FILES.channels);
  const ch = channels.find(c => String(c.id) === String(id));
  if (!ch) return res.status(404).json({ error: 'Channel not found' });
  let chMsgs = await readChannelMessagesFile(id);
  if (!chMsgs || chMsgs.length === 0) {
    const allMsgs = await readJSON(DATA_FILES.messages);
    chMsgs = allMsgs.filter(m => String(m.channel_id) === String(id));
  }
  chMsgs.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  const last = chMsgs.length ? chMsgs[chMsgs.length - 1] : null;
  const uniqueUsers = new Set(chMsgs.filter(m => m.user_id).map(m => String(m.user_id)));
  res.json({ channel: ch, message_count: chMsgs.length, member_count: uniqueUsers.size, last_message: last });
});

// Rename a channel (lightweight helper route)
app.post('/api/channels/:id/rename', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const channels = await readJSON(DATA_FILES.channels);
  const idx = channels.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  channels[idx].name = name;
  channels[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.channels, channels);
  res.json(channels[idx]);
});

// Channel settings: get and put (persisted on channel object under `settings`)
app.get('/api/channels/:id/settings', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const channels = await readJSON(DATA_FILES.channels);
  const ch = channels.find(c => String(c.id) === String(id));
  if (!ch) return res.status(404).json({ error: 'Channel not found' });
  const settings = ch.settings || { muted: false, pinned_ids: [] };
  res.json(settings);
});

app.put('/api/channels/:id/settings', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const payload = req.body || {};
  const channels = await readJSON(DATA_FILES.channels);
  const idx = channels.findIndex(c => String(c.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Channel not found' });
  channels[idx].settings = { ...(channels[idx].settings || { muted: false, pinned_ids: [] }), ...payload, updated_at: new Date().toISOString() };
  channels[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.channels, channels);
  res.json(channels[idx].settings);
});

// Manage community members: add member
app.post('/api/communities/:id/members', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const data = await readJSON(DATA_FILES.communities);
  const idx = data.findIndex(d => String(d.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data[idx].members = Array.isArray(data[idx].members) ? data[idx].members : [];
  if (!data[idx].members.includes(user_id)) data[idx].members.push(user_id);
  data[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.communities, data);
  res.json({ id: data[idx].id, members: data[idx].members });
});

// Remove community member
app.delete('/api/communities/:id/members/:userId', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  const userId = req.params.userId;
  const data = await readJSON(DATA_FILES.communities);
  const idx = data.findIndex(d => String(d.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data[idx].members = Array.isArray(data[idx].members) ? data[idx].members.filter(m => String(m) !== String(userId)) : [];
  data[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.communities, data);
  res.json({ id: data[idx].id, members: data[idx].members });
});

// Simple site-wide stats
app.get('/api/stats', async (req, res) => {
  await ensureDataFiles();
  const [users, channels, communities, messages] = await Promise.all([
    readJSON(DATA_FILES.users),
    readJSON(DATA_FILES.channels),
    readJSON(DATA_FILES.communities),
    readJSON(DATA_FILES.messages)
  ]);
  res.json({ users: users.length, channels: channels.length, communities: communities.length, messages: messages.length });
});

// ----------------------------
// New non-destructive endpoints
// ----------------------------

// Channels stats: dynamic message_count and member_count for all channels
app.get('/api/channels/stats', async (req, res) => {
  await ensureDataFiles();
  const serverId = req.query.server_id;
  const channels = await readJSON(DATA_FILES.channels);
  const filtered = serverId ? channels.filter(c => String(c.server_id) === String(serverId)) : channels;

  const results = await Promise.all(filtered.map(async (ch) => {
    let chMsgs = await readChannelMessagesFile(ch.id);
    if (!chMsgs || chMsgs.length === 0) {
      const allMsgs = await readJSON(DATA_FILES.messages);
      chMsgs = allMsgs.filter(m => String(m.channel_id) === String(ch.id));
    }
    const message_count = chMsgs.length;
    const unique_users = new Set(chMsgs.filter(m => m.user_id).map(m => String(m.user_id)));
    // include subchannels counts if present
    let subchannel_count = 0;
    if (Array.isArray(ch.subchannels)) subchannel_count = ch.subchannels.length;
    return { ...ch, message_count, member_count: unique_users.size, subchannel_count };
  }));

  results.sort((a,b) => (b.member_count - a.member_count) || (b.message_count - a.message_count));
  res.json(results);
});

// Account tiers (Tingkatan Akun)
app.get('/api/account-tiers', async (req, res) => {
  await ensureDataFiles();
  const tiers = await readJSON(DATA_FILES.account_tiers);
  res.json(tiers);
});

app.post('/api/account-tiers', async (req, res) => {
  await ensureDataFiles();
  const payload = req.body;
  if (!payload || !payload.name) return res.status(400).json({ error: 'name required' });
  const tiers = await readJSON(DATA_FILES.account_tiers);
  const newTier = { id: uuidv4(), ...payload, created_at: new Date().toISOString() };
  tiers.push(newTier);
  await writeJSON(DATA_FILES.account_tiers, tiers);
  res.status(201).json(newTier);
});

app.put('/api/account-tiers/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id; const payload = req.body;
  const tiers = await readJSON(DATA_FILES.account_tiers);
  const idx = tiers.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tiers[idx] = { ...tiers[idx], ...payload, updated_at: new Date().toISOString() };
  await writeJSON(DATA_FILES.account_tiers, tiers);
  res.json(tiers[idx]);
});

app.delete('/api/account-tiers/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  let tiers = await readJSON(DATA_FILES.account_tiers);
  const idx = tiers.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = tiers.splice(idx,1)[0];
  await writeJSON(DATA_FILES.account_tiers, tiers);
  res.json({ deleted: removed });
});

// Bots management and botHelper features
app.get('/api/bots', async (req, res) => {
  await ensureDataFiles();
  const bots = await readJSON(DATA_FILES.bots);
  res.json(bots);
});

// Create a bot user and bot record. Payload: { username, display_name, description }
app.post('/api/bots', async (req, res) => {
  await ensureDataFiles();
  const { username, display_name, description } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const users = await readJSON(DATA_FILES.users);
  if (users.find(u => (u.username || '').toLowerCase() === String(username).toLowerCase())) return res.status(409).json({ error: 'Username already taken' });

  const botId = uuidv4();
  // create minimal user record marked as bot
  const botUser = {
    id: botId,
    username,
    display_name: display_name || username,
    role: 'bot',
    created_at: new Date().toISOString()
  };
  users.push(botUser);
  await writeJSON(DATA_FILES.users, users);

  // create per-user profile file
  const profile = { id: botId, username, display_name: botUser.display_name, role: 'bot', created_at: botUser.created_at, description };
  const userFile = path.join(USERS_DIR, `${botId}.json`);
  await fs.writeFile(userFile, JSON.stringify(profile, null, 2), 'utf8');

  // record bot metadata
  const bots = await readJSON(DATA_FILES.bots);
  const botRecord = { id: botId, user_id: botId, username, display_name: botUser.display_name, description, created_at: botUser.created_at };
  bots.push(botRecord);
  await writeJSON(DATA_FILES.bots, bots);

  res.status(201).json(botRecord);
});

// Delete a bot (removes bot record and user record, and user profile file)
app.delete('/api/bots/:id', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id;
  let bots = await readJSON(DATA_FILES.bots);
  const bidx = bots.findIndex(b => String(b.id) === String(id) || String(b.user_id) === String(id));
  if (bidx === -1) return res.status(404).json({ error: 'Bot not found' });
  const removedBot = bots.splice(bidx, 1)[0];
  await writeJSON(DATA_FILES.bots, bots);

  // remove from users central list
  const users = await readJSON(DATA_FILES.users);
  const uidx = users.findIndex(u => String(u.id) === String(removedBot.user_id) || String(u.id) === String(removedBot.id));
  if (uidx !== -1) {
    users.splice(uidx,1);
    await writeJSON(DATA_FILES.users, users);
  }
  // remove per-user file if present
  try { const uf = path.join(USERS_DIR, `${removedBot.user_id}.json`); if (existsSync(uf)) await fs.unlink(uf); } catch (err) {}

  res.json({ deleted: removedBot });
});

// Bot send message: POST /api/bots/:id/send { channel_id, content }
app.post('/api/bots/:id/send', async (req, res) => {
  await ensureDataFiles();
  const botId = req.params.id;
  const { channel_id, content } = req.body || {};
  if (!channel_id || !content) return res.status(400).json({ error: 'channel_id and content required' });
  const bots = await readJSON(DATA_FILES.bots);
  const bot = bots.find(b => String(b.id) === String(botId) || String(b.user_id) === String(botId));
  if (!bot) return res.status(404).json({ error: 'Bot not found' });

  // create message as bot
  const messages = await readJSON(DATA_FILES.messages);
  const newMessage = { id: uuidv4(), channel_id: channel_id, user_id: bot.user_id || bot.id, content, created_at: new Date().toISOString(), bot: true };
  messages.push(newMessage);
  await writeJSON(DATA_FILES.messages, messages);
  try {
    const chMsgs = await readChannelMessagesFile(channel_id);
    chMsgs.push(newMessage);
    await writeChannelMessagesFile(channel_id, chMsgs);
  } catch (err) {
    // non-fatal
  }
  // attach profile
  const profile = await getProfileForUser(newMessage.user_id);
  const outgoing = { ...newMessage, profiles: profile };
  io.to(String(channel_id)).emit('message', outgoing);
  res.status(201).json(outgoing);
});

// GET messages by channel (supports ?channel_id= and pagination via ?limit & ?before)
app.get('/api/messages', async (req, res) => {
  await ensureDataFiles();
  const channelId = req.query.channel_id;
  const limit = Math.max(1, Math.min(500, parseInt(req.query.limit || '200', 10)));
  const before = req.query.before;
  try {
    let msgs = [];
    if (channelId) msgs = await readChannelMessagesFile(channelId);
    else msgs = await readJSON(DATA_FILES.messages);
    msgs.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    if (before) msgs = msgs.filter(m => new Date(m.created_at) < new Date(before));
    if (limit) msgs = msgs.slice(-limit);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read messages' });
  }
});

// Create message via REST API (creates global and per-channel message, broadcasts via socket)
app.post('/api/messages', async (req, res) => {
  await ensureDataFiles();
  const { channel_id, user_id: body_user_id, content, attachments } = req.body || {};
  if (!channel_id || !content) return res.status(400).json({ error: 'channel_id and content required' });
  // Determine authenticated user from Authorization header if present
  const authUser = getUserFromAuthHeader ? getUserFromAuthHeader(req) : null;
  if (req.headers && req.headers.authorization && !authUser) return res.status(401).json({ error: 'Invalid token' });
  const senderId = authUser || body_user_id || null;
  try {
    const messages = await readJSON(DATA_FILES.messages);
    const newMessage = { id: uuidv4(), channel_id, user_id: senderId, content, attachments: attachments || [], created_at: new Date().toISOString() };
    messages.push(newMessage);
    await writeJSON(DATA_FILES.messages, messages);
    try {
      const chMsgs = await readChannelMessagesFile(channel_id);
      chMsgs.push(newMessage);
      await writeChannelMessagesFile(channel_id, chMsgs);
    } catch (err) { /* non-fatal */ }
    const profile = await getProfileForUser(user_id || null);
    const outgoing = { ...newMessage, profiles: profile };
    io.to(String(channel_id)).emit('message', outgoing);
    res.status(201).json(outgoing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// React to a message
app.post('/api/messages/:id/react', async (req, res) => {
  await ensureDataFiles();
  const id = req.params.id; const { emoji, user_id } = req.body || {};
  if (!emoji) return res.status(400).json({ error: 'emoji required' });
  try {
    const messages = await readJSON(DATA_FILES.messages);
    const idx = messages.findIndex(m => String(m.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Message not found' });
    // use authenticated user if token provided
    const authUser = getUserFromAuthHeader ? getUserFromAuthHeader(req) : null;
    if (req.headers && req.headers.authorization && !authUser) return res.status(401).json({ error: 'Invalid token' });
    const reactor = authUser || user_id || null;
    messages[idx].reactions = Array.isArray(messages[idx].reactions) ? messages[idx].reactions : [];
    const rIdx = messages[idx].reactions.findIndex(r => r.emoji === emoji);
    if (rIdx === -1) messages[idx].reactions.push({ emoji, users: [reactor] });
    else {
      const uidx = messages[idx].reactions[rIdx].users.indexOf(reactor);
      if (uidx === -1) messages[idx].reactions[rIdx].users.push(reactor);
    }
    await writeJSON(DATA_FILES.messages, messages);
    // update channel file if present
    try {
      const chMsgs = await readChannelMessagesFile(messages[idx].channel_id);
      const cidx = chMsgs.findIndex(m => String(m.id) === String(id));
      if (cidx !== -1) { chMsgs[cidx].reactions = messages[idx].reactions; await writeChannelMessagesFile(messages[idx].channel_id, chMsgs); }
    } catch (err) {}
    io.to(String(messages[idx].channel_id)).emit('reaction', { message_id: id, reactions: messages[idx].reactions });
    res.json({ id, reactions: messages[idx].reactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to react to message' });
  }
});

// Presence (simple set/get)
app.post('/api/presence', async (req, res) => {
  await ensureDataFiles();
  const { user_id, status } = req.body || {};
  if (!user_id || !status) return res.status(400).json({ error: 'user_id and status required' });
  try {
    const presence = await readJSON(DATA_FILES.discord_presence);
    const idx = presence.findIndex(p => String(p.user_id) === String(user_id));
    const entry = { user_id, status, updated_at: new Date().toISOString() };
    if (idx === -1) presence.push(entry); else presence[idx] = { ...presence[idx], ...entry };
    await writeJSON(DATA_FILES.discord_presence, presence);
    io.emit('presence', entry);
    res.json(entry);
  } catch (err) { res.status(500).json({ error: 'Failed to set presence' }); }
});

// Typing indicator (broadcasts typing event)
app.post('/api/typing', async (req, res) => {
  const { channel_id, user_id: body_user_id, typing } = req.body || {};
  // allow auth header to determine user id
  const authUser = getUserFromAuthHeader ? getUserFromAuthHeader(req) : null;
  if (req.headers && req.headers.authorization && !authUser) return res.status(401).json({ error: 'Invalid token' });
  const user_id = authUser || body_user_id;
  if (!channel_id || !user_id) return res.status(400).json({ error: 'channel_id and user_id required' });
  const payload = { channel_id, user_id, typing: !!typing, at: new Date().toISOString() };
  io.to(String(channel_id)).emit('typing', payload);
  res.json(payload);
});

// Upload endpoint
app.post('/api/uploads', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const url = `/uploads/${req.file.filename}`;
  // minimal metadata
  const meta = { url, filename: req.file.originalname, size: req.file.size, mime: req.file.mimetype, created_at: new Date().toISOString() };
  res.status(201).json(meta);
});

// Servers and channels endpoints (basic CRUD using DATA_FILES.discord_servers and channels.json)
app.get('/api/servers', async (req, res) => {
  await ensureDataFiles();
  const data = await readJSON(DATA_FILES.discord_servers);
  res.json(data || []);
});

app.post('/api/servers', async (req, res) => {
  await ensureDataFiles();
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const servers = await readJSON(DATA_FILES.discord_servers);
  const newServer = { id: uuidv4(), name, description: description || '', created_at: new Date().toISOString() };
  servers.push(newServer);
  await writeJSON(DATA_FILES.discord_servers, servers);
  res.status(201).json(newServer);
});

app.get('/api/servers/:sid/channels', async (req, res) => {
  await ensureDataFiles();
  const sid = req.params.sid;
  const channels = await readJSON(DATA_FILES.channels);
  const filtered = channels.filter(c => String(c.server_id) === String(sid));
  res.json(filtered);
});

app.post('/api/servers/:sid/channels', async (req, res) => {
  await ensureDataFiles();
  const sid = req.params.sid; const { name, type } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const channels = await readJSON(DATA_FILES.channels);
  const ch = { id: uuidv4(), server_id: sid, name, type: type || 'text', created_at: new Date().toISOString() };
  channels.push(ch);
  await writeJSON(DATA_FILES.channels, channels);
  res.status(201).json(ch);
});

// Invite generator (simple token recorded in discord_invites file)
app.post('/api/servers/:sid/invite', async (req, res) => {
  await ensureDataFiles();
  const sid = req.params.sid; const { expires_in } = req.body || {};
  const invites = await readJSON(DATA_FILES.discord_invites);
  const token = uuidv4();
  const invite = { id: token, server_id: sid, created_at: new Date().toISOString(), expires_at: expires_in ? new Date(Date.now() + (Number(expires_in) * 1000)).toISOString() : null };
  invites.push(invite);
  await writeJSON(DATA_FILES.discord_invites, invites);
  res.status(201).json(invite);
});

// Subchannel management: store subchannels as nested array on parent channel
app.post('/api/channels/:id/subchannels', async (req, res) => {
  await ensureDataFiles();
  const parentId = req.params.id;
  const { name, position } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const channels = await readJSON(DATA_FILES.channels);
  const idx = channels.findIndex(c => String(c.id) === String(parentId));
  if (idx === -1) return res.status(404).json({ error: 'Parent channel not found' });
  const sub = { id: uuidv4(), name, position: typeof position === 'number' ? position : (channels[idx].subchannels ? channels[idx].subchannels.length : 0), created_at: new Date().toISOString() };
  channels[idx].subchannels = Array.isArray(channels[idx].subchannels) ? channels[idx].subchannels : [];
  channels[idx].subchannels.push(sub);
  channels[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.channels, channels);
  res.status(201).json(sub);
});

app.delete('/api/channels/:id/subchannels/:subId', async (req, res) => {
  await ensureDataFiles();
  const parentId = req.params.id; const subId = req.params.subId;
  const channels = await readJSON(DATA_FILES.channels);
  const idx = channels.findIndex(c => String(c.id) === String(parentId));
  if (idx === -1) return res.status(404).json({ error: 'Parent channel not found' });
  channels[idx].subchannels = Array.isArray(channels[idx].subchannels) ? channels[idx].subchannels.filter(s => String(s.id) !== String(subId)) : [];
  channels[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.channels, channels);
  res.json({ id: parentId, subchannels: channels[idx].subchannels });
});

app.post('/api/channels/:id/subchannels/:subId/rename', async (req, res) => {
  await ensureDataFiles();
  const parentId = req.params.id; const subId = req.params.subId; const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const channels = await readJSON(DATA_FILES.channels);
  const idx = channels.findIndex(c => String(c.id) === String(parentId));
  if (idx === -1) return res.status(404).json({ error: 'Parent channel not found' });
  channels[idx].subchannels = Array.isArray(channels[idx].subchannels) ? channels[idx].subchannels : [];
  const sidx = channels[idx].subchannels.findIndex(s => String(s.id) === String(subId));
  if (sidx === -1) return res.status(404).json({ error: 'Subchannel not found' });
  channels[idx].subchannels[sidx].name = name;
  channels[idx].subchannels[sidx].updated_at = new Date().toISOString();
  channels[idx].updated_at = new Date().toISOString();
  await writeJSON(DATA_FILES.channels, channels);
  res.json(channels[idx].subchannels[sidx]);
});


function _sampleCommunity(i) {
  return { id: uuidv4(), kind: 'community_extra', index: i, title: `Auto community item ${i}`, description: `Generated item ${i}`, created_at: new Date().toISOString() };
}

function _sampleStreaming(i) {
  return { id: uuidv4(), kind: 'streaming_extra', index: i, title: `Auto streaming item ${i}`, description: `Generated stream item ${i}`, created_at: new Date().toISOString() };
}

for (let i = 1; i <= 50; i++) {
  const route = `/api/community/extra/${i}`;
  if (i % 2 === 1) {
    // POST -> create an entry (body optional)
    app.post(route, async (req, res) => {
      await ensureDataFiles();
      try {
        const coll = await readJSON(DATA_FILES.expanded_community);
        const payload = (req.body && Object.keys(req.body).length) ? req.body : _sampleCommunity(i);
        const item = { id: uuidv4(), ...payload, auto_index: i, created_at: new Date().toISOString() };
        coll.push(item);
        await writeJSON(DATA_FILES.expanded_community, coll);
        return res.status(201).json(item);
      } catch (err) {
        return res.status(500).json({ error: 'failed to create community item' });
      }
    });
  } else {
    // GET -> list/filter
    app.get(route, async (req, res) => {
      await ensureDataFiles();
      try {
        const coll = await readJSON(DATA_FILES.expanded_community);
        const q = String(req.query.q || '').toLowerCase().trim();
        const out = q ? coll.filter(x => JSON.stringify(x).toLowerCase().includes(q)) : coll;
        return res.json(out);
      } catch (err) {
        return res.status(500).json({ error: 'failed to read community items' });
      }
    });
  }
}

for (let i = 1; i <= 50; i++) {
  const route = `/api/streaming/extra/${i}`;
  if (i % 2 === 1) {
    // POST -> create an entry (body optional)
    app.post(route, async (req, res) => {
      await ensureDataFiles();
      try {
        const coll = await readJSON(DATA_FILES.expanded_streaming);
        const payload = (req.body && Object.keys(req.body).length) ? req.body : _sampleStreaming(i);
        const item = { id: uuidv4(), ...payload, auto_index: i, created_at: new Date().toISOString() };
        coll.push(item);
        await writeJSON(DATA_FILES.expanded_streaming, coll);
        return res.status(201).json(item);
      } catch (err) {
        return res.status(500).json({ error: 'failed to create streaming item' });
      }
    });
  } else {
    // GET -> list/filter
    app.get(route, async (req, res) => {
      await ensureDataFiles();
      try {
        const coll = await readJSON(DATA_FILES.expanded_streaming);
        const q = String(req.query.q || '').toLowerCase().trim();
        const out = q ? coll.filter(x => JSON.stringify(x).toLowerCase().includes(q)) : coll;
        return res.json(out);
      } catch (err) {
        return res.status(500).json({ error: 'failed to read streaming items' });
      }
    });
  }
}
} // end if (!MODULES_HANDLING_ROUTES) - second block (additional endpoints)

// Register API modules with helpers (grouped routes)
try {
  const registerApis = require('./routes/registerApis');
  registerApis(app, { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, JWT_SECRET, getUserFromAuthHeader, getProfileForUser, readChannelMessagesFile, writeChannelMessagesFile, tryReadStreamingFile, io });
} catch (err) {
  console.warn('Failed to register API modules:', err && err.message);
}

// Ensure data files exist then start server
ensureDataFiles().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend JSON server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to prepare data files:', err);
});
