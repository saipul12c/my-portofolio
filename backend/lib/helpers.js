const path = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const jwt = require('jsonwebtoken');

const DB_DIR = path.join(__dirname, '..', 'data');
const DATA_FILES = {
  users: path.join(DB_DIR, 'users.json'),
  communities: path.join(DB_DIR, 'communities.json'),
  channels: path.join(DB_DIR, 'channels.json'),
  messages: path.join(DB_DIR, 'messages.json')
};

DATA_FILES.bots = path.join(DB_DIR, 'bots.json');
DATA_FILES.account_tiers = path.join(DB_DIR, 'account_tiers.json');
DATA_FILES.expanded_community = path.join(DB_DIR, 'expanded_community.json');
DATA_FILES.expanded_streaming = path.join(DB_DIR, 'expanded_streaming.json');
DATA_FILES.discord_servers = path.join(DB_DIR, 'discord_servers.json');
DATA_FILES.discord_invites = path.join(DB_DIR, 'discord_invites.json');
DATA_FILES.discord_roles = path.join(DB_DIR, 'discord_roles.json');
DATA_FILES.discord_webhooks = path.join(DB_DIR, 'discord_webhooks.json');
DATA_FILES.discord_presence = path.join(DB_DIR, 'discord_presence.json');
DATA_FILES.youtube_channels = path.join(DB_DIR, 'youtube_channels.json');
DATA_FILES.youtube_videos = path.join(DB_DIR, 'youtube_videos.json');
DATA_FILES.youtube_comments = path.join(DB_DIR, 'youtube_comments.json');
DATA_FILES.youtube_playlists = path.join(DB_DIR, 'youtube_playlists.json');
DATA_FILES.youtube_live_streams = path.join(DB_DIR, 'youtube_live_streams.json');
DATA_FILES.youtube_analytics = path.join(DB_DIR, 'youtube_analytics.json');

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
    console.warn('Migration to per-channel message files failed:', err && err.message);
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

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
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

async function writeChannelMessagesFile(channelId, data) {
  const p = path.join(MESSAGES_DIR, `${channelId}.json`);
  await fs.writeFile(p, JSON.stringify(data, null, 2), 'utf8');
}

async function getProfileForUser(userId) {
  if (!userId) return null;
  try {
    const userFile = path.join(USERS_DIR, `${userId}.json`);
    if (existsSync(userFile)) {
      const txt = await fs.readFile(userFile, 'utf8');
      return JSON.parse(txt || '{}');
    }
    const users = await readJSON(DATA_FILES.users);
    const u = users.find(x => String(x.id) === String(userId));
    if (u) return { id: u.id, username: u.username, avatar_url: u.avatar_url };
    return null;
  } catch (err) {
    return null;
  }
}

async function tryReadStreamingFile(name) {
  const p1 = path.join(__dirname, '..', 'src', 'pages', 'streming', 'data', name);
  const p2 = path.join(__dirname, '..', 'public', 'data', 'streming', name);
  try {
    if (existsSync(p1)) return await readJSON(p1);
    if (existsSync(p2)) return await readJSON(p2);
  } catch (err) {
    return [];
  }
  return [];
}

function getUserFromAuthHeader(req) {
  const h = req.headers && req.headers.authorization;
  if (!h) return null;
  const parts = h.split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const payload = jwt.verify(token, module.exports && module.exports.JWT_SECRET);
    return payload.sub;
  } catch (err) {
    return null;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

module.exports = {
  DB_DIR,
  DATA_FILES,
  MESSAGES_DIR,
  USERS_DIR,
  ensureDataFiles,
  readJSON,
  writeJSON,
  readChannelMessagesFile,
  writeChannelMessagesFile,
  getProfileForUser,
  tryReadStreamingFile,
  getUserFromAuthHeader,
  JWT_SECRET
};
