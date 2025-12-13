module.exports = function registerApiKomunita(app, deps = {}) {
  // Community-related routes (servers, channels, messages, discord-like APIs)
  const router = require('express').Router();
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES, USERS_DIR, MESSAGES_DIR, readChannelMessagesFile, writeChannelMessagesFile, getProfileForUser, io } = deps;
  const { v4: uuidv4 } = require('uuid');

  // Communities CRUD
  router.get('/api/communities', async (req, res) => {
    await ensureDataFiles();
    const data = await readJSON(DATA_FILES.communities);
    data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(data);
  });

  router.get('/api/communities/:id', async (req, res) => {
    await ensureDataFiles();
    const data = await readJSON(DATA_FILES.communities);
    const item = data.find(d => String(d.id) === String(req.params.id));
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  router.post('/api/communities', async (req, res) => {
    await ensureDataFiles();
    const payload = req.body; const data = await readJSON(DATA_FILES.communities);
    const newItem = { id: uuidv4(), ...payload, created_at: new Date().toISOString() };
    data.push(newItem); await writeJSON(DATA_FILES.communities, data); res.status(201).json(newItem);
  });

  router.put('/api/communities/:id', async (req, res) => {
    await ensureDataFiles(); const id = req.params.id; const payload = req.body; const data = await readJSON(DATA_FILES.communities); const idx = data.findIndex(d => String(d.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); data[idx] = { ...data[idx], ...payload, updated_at: new Date().toISOString() }; await writeJSON(DATA_FILES.communities, data); res.json(data[idx]);
  });

  router.delete('/api/communities/:id', async (req, res) => {
    await ensureDataFiles(); const id = req.params.id; let data = await readJSON(DATA_FILES.communities); const idx = data.findIndex(d => String(d.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); const removed = data.splice(idx,1); await writeJSON(DATA_FILES.communities, data); res.json({ deleted: removed[0] });
  });

  // Servers derived from channels
  router.get('/api/servers', async (req, res) => {
    await ensureDataFiles();
    let servers = await readJSON(DATA_FILES.discord_servers);
    // If no explicit servers stored, derive from channels but avoid duplicates
    // when multiple channels share the same server name (case-insensitive).
    if (!servers || servers.length === 0) {
      const channels = await readJSON(DATA_FILES.channels);
      const nameMap = new Map();
      channels.forEach(c => {
        const name = (c.server_name || `Server ${c.server_id}`).toString().trim();
        const key = name.toLowerCase();
        if (!nameMap.has(key)) {
          nameMap.set(key, { id: c.server_id, name, icon: '🟢', created_at: c.created_at });
        } else {
          const existing = nameMap.get(key);
          // prefer the entry with earlier created_at if present
          if (c.created_at && existing.created_at && new Date(c.created_at) < new Date(existing.created_at)) {
            nameMap.set(key, { id: c.server_id, name, icon: '🟢', created_at: c.created_at });
          }
        }
      });
      servers = Array.from(nameMap.values());
    }
    res.json(servers);
  });

  // Channels list/create
  router.get('/api/channels', async (req, res) => { await ensureDataFiles(); const serverId = req.query.server_id; let channels = await readJSON(DATA_FILES.channels); if (serverId) channels = channels.filter(c => String(c.server_id) === String(serverId)); channels.sort((a,b) => (a.position || 0) - (b.position || 0)); res.json(channels); });

  router.post('/api/channels', async (req, res) => { await ensureDataFiles(); const payload = req.body; const channels = await readJSON(DATA_FILES.channels); const serverChannels = channels.filter(c => String(c.server_id) === String(payload.server_id)); if (serverChannels.length >= 50) return res.status(400).json({ error: 'Max 50 channels per server' }); const newCh = { id: uuidv4(), ...payload, created_at: new Date().toISOString() }; channels.push(newCh); await writeJSON(DATA_FILES.channels, channels); res.status(201).json(newCh); });

  // Channel active
  router.get('/api/channels/active', async (req, res) => {
    await ensureDataFiles(); const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10))); const channels = await readJSON(DATA_FILES.channels);
    const results = await Promise.all(channels.map(async (ch) => { let chMsgs = await readChannelMessagesFile(ch.id); if (!chMsgs || chMsgs.length === 0) { const allMsgs = await readJSON(DATA_FILES.messages); chMsgs = allMsgs.filter(m => String(m.channel_id) === String(ch.id)); } const message_count = chMsgs.length; const unique_users = new Set(chMsgs.filter(m => m.user_id).map(m => String(m.user_id))); return { ...ch, message_count, member_count: unique_users.size }; }));
    results.sort((a,b) => (b.member_count - a.member_count) || (b.message_count - a.message_count)); res.json(results.slice(0, limit));
  });

  // Messages list/post/edit/delete
  router.get('/api/messages', async (req, res) => {
    await ensureDataFiles(); const channelId = req.query.channel_id; if (channelId) { let messages = await readChannelMessagesFile(channelId); messages.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); const enriched = await Promise.all(messages.slice(-200).map(async (m) => ({ ...m, profiles: await getProfileForUser(m.user_id) }))); return res.json(enriched); } let messages = await readJSON(DATA_FILES.messages); messages.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); const last = messages.slice(-200); const enriched = await Promise.all(last.map(async (m) => ({ ...m, profiles: await getProfileForUser(m.user_id) }))); res.json(enriched);
  });

  router.post('/api/messages', async (req, res) => { await ensureDataFiles(); const { channel_id, user_id, content } = req.body; if (!channel_id || !user_id || !content) return res.status(400).json({ error: 'channel_id, user_id, content required' }); const messages = await readJSON(DATA_FILES.messages); const newMessage = { id: uuidv4(), channel_id, user_id, content, created_at: new Date().toISOString() }; messages.push(newMessage); await writeJSON(DATA_FILES.messages, messages); try { const chMsgs = await readChannelMessagesFile(channel_id); chMsgs.push(newMessage); await writeChannelMessagesFile(channel_id, chMsgs); } catch (err) { }
    try { const profile = await getProfileForUser(user_id); const outgoing = { ...newMessage, profiles: profile }; if (io) io.to(String(channel_id)).emit('message', outgoing); return res.status(201).json(outgoing); } catch (err) { if (io) io.to(String(channel_id)).emit('message', newMessage); return res.status(201).json({ ...newMessage, profiles: null }); }
  });

  router.patch('/api/messages/:id', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const { content } = req.body || {}; if (typeof content !== 'string') return res.status(400).json({ error: 'content required' }); let messages = await readJSON(DATA_FILES.messages); const idx = messages.findIndex(m => String(m.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Message not found' }); messages[idx].content = content; messages[idx].edited_at = new Date().toISOString(); await writeJSON(DATA_FILES.messages, messages); const channelId = messages[idx].channel_id; try { const chMsgs = await readChannelMessagesFile(channelId); const cidx = chMsgs.findIndex(m => String(m.id) === String(id)); if (cidx !== -1) { chMsgs[cidx].content = content; chMsgs[cidx].edited_at = messages[idx].edited_at; await writeChannelMessagesFile(channelId, chMsgs); } } catch (err) {} res.json(messages[idx]); });

  router.delete('/api/messages/:id', async (req, res) => { await ensureDataFiles(); const id = req.params.id; let messages = await readJSON(DATA_FILES.messages); const idx = messages.findIndex(m => String(m.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Message not found' }); const removed = messages.splice(idx, 1)[0]; await writeJSON(DATA_FILES.messages, messages); try { const chMsgs = await readChannelMessagesFile(removed.channel_id); const cidx = chMsgs.findIndex(m => String(m.id) === String(id)); if (cidx !== -1) { chMsgs.splice(cidx, 1); await writeChannelMessagesFile(removed.channel_id, chMsgs); } } catch (err) {} res.json({ deleted: removed }); });

  // Channel summary
  router.get('/api/channels/:id/summary', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const channels = await readJSON(DATA_FILES.channels); const ch = channels.find(c => String(c.id) === String(id)); if (!ch) return res.status(404).json({ error: 'Channel not found' }); let chMsgs = await readChannelMessagesFile(id); if (!chMsgs || chMsgs.length === 0) { const allMsgs = await readJSON(DATA_FILES.messages); chMsgs = allMsgs.filter(m => String(m.channel_id) === String(id)); } chMsgs.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); const last = chMsgs.length ? chMsgs[chMsgs.length - 1] : null; const uniqueUsers = new Set(chMsgs.filter(m => m.user_id).map(m => String(m.user_id))); res.json({ channel: ch, message_count: chMsgs.length, member_count: uniqueUsers.size, last_message: last }); });

  // Channel settings (convenience endpoint to satisfy frontends expecting /settings)
  router.get('/api/channels/:id/settings', async (req, res) => {
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
    const settings = {
      channel: ch,
      server: { id: ch.server_id, name: ch.server_name },
      message_count: chMsgs.length,
      member_count: uniqueUsers.size,
      last_message: last,
      subchannels: Array.isArray(ch.subchannels) ? ch.subchannels : []
    };
    res.json(settings);
  });

  router.post('/api/channels/:id/rename', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const { name } = req.body || {}; if (!name) return res.status(400).json({ error: 'name required' }); const channels = await readJSON(DATA_FILES.channels); const idx = channels.findIndex(c => String(c.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Channel not found' }); channels[idx].name = name; channels[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.channels, channels); res.json(channels[idx]); });

  // Community members
  router.post('/api/communities/:id/members', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const { user_id } = req.body || {}; if (!user_id) return res.status(400).json({ error: 'user_id required' }); const data = await readJSON(DATA_FILES.communities); const idx = data.findIndex(d => String(d.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); data[idx].members = Array.isArray(data[idx].members) ? data[idx].members : []; if (!data[idx].members.includes(user_id)) data[idx].members.push(user_id); data[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.communities, data); res.json({ id: data[idx].id, members: data[idx].members }); });

  router.delete('/api/communities/:id/members/:userId', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const userId = req.params.userId; const data = await readJSON(DATA_FILES.communities); const idx = data.findIndex(d => String(d.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); data[idx].members = Array.isArray(data[idx].members) ? data[idx].members.filter(m => String(m) !== String(userId)) : []; data[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.communities, data); res.json({ id: data[idx].id, members: data[idx].members }); });

  // Channels stats
  router.get('/api/channels/stats', async (req, res) => { await ensureDataFiles(); const serverId = req.query.server_id; const channels = await readJSON(DATA_FILES.channels); const filtered = serverId ? channels.filter(c => String(c.server_id) === String(serverId)) : channels; const results = await Promise.all(filtered.map(async (ch) => { let chMsgs = await readChannelMessagesFile(ch.id); if (!chMsgs || chMsgs.length === 0) { const allMsgs = await readJSON(DATA_FILES.messages); chMsgs = allMsgs.filter(m => String(m.channel_id) === String(ch.id)); } const message_count = chMsgs.length; const unique_users = new Set(chMsgs.filter(m => m.user_id).map(m => String(m.user_id))); let subchannel_count = 0; if (Array.isArray(ch.subchannels)) subchannel_count = ch.subchannels.length; return { ...ch, message_count, member_count: unique_users.size, subchannel_count }; })); results.sort((a,b) => (b.member_count - a.member_count) || (b.message_count - a.message_count)); res.json(results); });

  // Bots
  router.get('/api/bots', async (req, res) => { await ensureDataFiles(); const bots = await readJSON(DATA_FILES.bots); res.json(bots); });

  router.post('/api/bots', async (req, res) => { await ensureDataFiles(); const { username, display_name, description } = req.body || {}; if (!username) return res.status(400).json({ error: 'username required' }); const users = await readJSON(DATA_FILES.users); if (users.find(u => (u.username || '').toLowerCase() === String(username).toLowerCase())) return res.status(409).json({ error: 'Username already taken' }); const botId = uuidv4(); const botUser = { id: botId, username, display_name: display_name || username, role: 'bot', created_at: new Date().toISOString() }; users.push(botUser); await writeJSON(DATA_FILES.users, users); const profile = { id: botId, username, display_name: botUser.display_name, role: 'bot', created_at: botUser.created_at, description }; const userFile = require('path').join(USERS_DIR, `${botId}.json`); await require('fs').promises.writeFile(userFile, JSON.stringify(profile, null, 2), 'utf8'); const bots = await readJSON(DATA_FILES.bots); const botRecord = { id: botId, user_id: botId, username, display_name: botUser.display_name, description, created_at: botUser.created_at }; bots.push(botRecord); await writeJSON(DATA_FILES.bots, bots); res.status(201).json(botRecord); });

  router.delete('/api/bots/:id', async (req, res) => { await ensureDataFiles(); const id = req.params.id; let bots = await readJSON(DATA_FILES.bots); const bidx = bots.findIndex(b => String(b.id) === String(id) || String(b.user_id) === String(id)); if (bidx === -1) return res.status(404).json({ error: 'Bot not found' }); const removedBot = bots.splice(bidx, 1)[0]; await writeJSON(DATA_FILES.bots, bots); const users = await readJSON(DATA_FILES.users); const uidx = users.findIndex(u => String(u.id) === String(removedBot.user_id) || String(u.id) === String(removedBot.id)); if (uidx !== -1) { users.splice(uidx,1); await writeJSON(DATA_FILES.users, users); } try { const uf = require('path').join(USERS_DIR, `${removedBot.user_id}.json`); if (require('fs').existsSync(uf)) await require('fs').promises.unlink(uf); } catch (err) {} res.json({ deleted: removedBot }); });

  router.post('/api/bots/:id/send', async (req, res) => { await ensureDataFiles(); const botId = req.params.id; const { channel_id, content } = req.body || {}; if (!channel_id || !content) return res.status(400).json({ error: 'channel_id and content required' }); const bots = await readJSON(DATA_FILES.bots); const bot = bots.find(b => String(b.id) === String(botId) || String(b.user_id) === String(botId)); if (!bot) return res.status(404).json({ error: 'Bot not found' }); const messages = await readJSON(DATA_FILES.messages); const newMessage = { id: uuidv4(), channel_id: channel_id, user_id: bot.user_id || bot.id, content, created_at: new Date().toISOString(), bot: true }; messages.push(newMessage); await writeJSON(DATA_FILES.messages, messages); try { const chMsgs = await readChannelMessagesFile(channel_id); chMsgs.push(newMessage); await writeChannelMessagesFile(channel_id, chMsgs); } catch (err) {} const profile = await getProfileForUser(newMessage.user_id); const outgoing = { ...newMessage, profiles: profile }; if (io) io.to(String(channel_id)).emit('message', outgoing); res.status(201).json(outgoing); });

  // Subchannels
  router.post('/api/channels/:id/subchannels', async (req, res) => { await ensureDataFiles(); const parentId = req.params.id; const { name, position } = req.body || {}; if (!name) return res.status(400).json({ error: 'name required' }); const channels = await readJSON(DATA_FILES.channels); const idx = channels.findIndex(c => String(c.id) === String(parentId)); if (idx === -1) return res.status(404).json({ error: 'Parent channel not found' }); const sub = { id: uuidv4(), name, position: typeof position === 'number' ? position : (channels[idx].subchannels ? channels[idx].subchannels.length : 0), created_at: new Date().toISOString() }; channels[idx].subchannels = Array.isArray(channels[idx].subchannels) ? channels[idx].subchannels : []; channels[idx].subchannels.push(sub); channels[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.channels, channels); res.status(201).json(sub); });

  router.delete('/api/channels/:id/subchannels/:subId', async (req, res) => { await ensureDataFiles(); const parentId = req.params.id; const subId = req.params.subId; const channels = await readJSON(DATA_FILES.channels); const idx = channels.findIndex(c => String(c.id) === String(parentId)); if (idx === -1) return res.status(404).json({ error: 'Parent channel not found' }); channels[idx].subchannels = Array.isArray(channels[idx].subchannels) ? channels[idx].subchannels.filter(s => String(s.id) !== String(subId)) : []; channels[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.channels, channels); res.json({ id: parentId, subchannels: channels[idx].subchannels }); });

  router.post('/api/channels/:id/subchannels/:subId/rename', async (req, res) => { await ensureDataFiles(); const parentId = req.params.id; const subId = req.params.subId; const { name } = req.body || {}; if (!name) return res.status(400).json({ error: 'name required' }); const channels = await readJSON(DATA_FILES.channels); const idx = channels.findIndex(c => String(c.id) === String(parentId)); if (idx === -1) return res.status(404).json({ error: 'Parent channel not found' }); channels[idx].subchannels = Array.isArray(channels[idx].subchannels) ? channels[idx].subchannels : []; const sidx = channels[idx].subchannels.findIndex(s => String(s.id) === String(subId)); if (sidx === -1) return res.status(404).json({ error: 'Subchannel not found' }); channels[idx].subchannels[sidx].name = name; channels[idx].subchannels[sidx].updated_at = new Date().toISOString(); channels[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.channels, channels); res.json(channels[idx].subchannels[sidx]); });

  // Discord-like endpoints: servers, invites, roles, webhooks, presence
  router.get('/api/discord/servers', async (req, res) => { await ensureDataFiles(); let servers = await readJSON(DATA_FILES.discord_servers); if (!servers || servers.length === 0) { const channels = await readJSON(DATA_FILES.channels); const map = new Map(); channels.forEach(c => { if (!map.has(c.server_id)) map.set(c.server_id, { id: c.server_id, name: c.server_name || `Server ${c.server_id}` }); }); servers = Array.from(map.values()); } res.json(servers); });

  router.post('/api/discord/servers', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; if (!payload.name) return res.status(400).json({ error: 'name required' }); const coll = await readJSON(DATA_FILES.discord_servers); const item = { id: uuidv4(), name: payload.name, meta: payload.meta || {}, created_at: new Date().toISOString() }; coll.push(item); await writeJSON(DATA_FILES.discord_servers, coll); res.status(201).json(item); });

  router.get('/api/discord/servers/:id', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.discord_servers); const item = coll.find(x => String(x.id) === String(req.params.id)); if (!item) return res.status(404).json({ error: 'Server not found' }); res.json(item); });

  router.post('/api/discord/servers/:id/invite', async (req, res) => { await ensureDataFiles(); const serverId = req.params.id; const payload = req.body || {}; const invites = await readJSON(DATA_FILES.discord_invites); const invite = { id: uuidv4(), server_id: serverId, code: uuidv4().split('-')[0], max_uses: payload.max_uses || 0, created_at: new Date().toISOString(), expires_at: payload.expires_at || null }; invites.push(invite); await writeJSON(DATA_FILES.discord_invites, invites); res.status(201).json(invite); });

  router.get('/api/discord/servers/:id/invites', async (req, res) => { await ensureDataFiles(); const serverId = req.params.id; const invites = await readJSON(DATA_FILES.discord_invites); res.json((invites || []).filter(i => String(i.server_id) === String(serverId))); });

  router.post('/api/discord/roles', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; if (!payload.server_id || !payload.name) return res.status(400).json({ error: 'server_id and name required' }); const roles = await readJSON(DATA_FILES.discord_roles); const role = { id: uuidv4(), server_id: payload.server_id, name: payload.name, permissions: payload.permissions || [], created_at: new Date().toISOString() }; roles.push(role); await writeJSON(DATA_FILES.discord_roles, roles); res.status(201).json(role); });

  router.get('/api/discord/roles', async (req, res) => { await ensureDataFiles(); const serverId = req.query.server_id; let roles = await readJSON(DATA_FILES.discord_roles); if (serverId) roles = roles.filter(r => String(r.server_id) === String(serverId)); res.json(roles); });

  router.post('/api/discord/webhooks', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; if (!payload.server_id || !payload.channel_id || !payload.url) return res.status(400).json({ error: 'server_id, channel_id and url required' }); const hooks = await readJSON(DATA_FILES.discord_webhooks); const h = { id: uuidv4(), server_id: payload.server_id, channel_id: payload.channel_id, url: payload.url, name: payload.name || 'webhook', created_at: new Date().toISOString() }; hooks.push(h); await writeJSON(DATA_FILES.discord_webhooks, hooks); res.status(201).json(h); });

  router.get('/api/discord/webhooks', async (req, res) => { await ensureDataFiles(); const serverId = req.query.server_id; let hooks = await readJSON(DATA_FILES.discord_webhooks); if (serverId) hooks = hooks.filter(h => String(h.server_id) === String(serverId)); res.json(hooks); });

  router.post('/api/discord/webhooks/:id/send', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const payload = req.body || {}; const hooks = await readJSON(DATA_FILES.discord_webhooks); const hook = hooks.find(h => String(h.id) === String(id)); if (!hook) return res.status(404).json({ error: 'Webhook not found' }); const content = payload.content || payload.message || 'Webhook message'; const messages = await readJSON(DATA_FILES.messages); const newMessage = { id: uuidv4(), channel_id: hook.channel_id, user_id: null, content, created_at: new Date().toISOString(), webhook_id: hook.id }; messages.push(newMessage); await writeJSON(DATA_FILES.messages, messages); try { const chMsgs = await readChannelMessagesFile(hook.channel_id); chMsgs.push(newMessage); await writeChannelMessagesFile(hook.channel_id, chMsgs); } catch (err) {} if (io) io.to(String(hook.channel_id)).emit('message', newMessage); res.status(201).json(newMessage); });

  router.get('/api/discord/presence/:userId', async (req, res) => { await ensureDataFiles(); const presence = await readJSON(DATA_FILES.discord_presence); const p = (presence || []).find(x => String(x.user_id) === String(req.params.userId)); res.json(p || { user_id: req.params.userId, status: 'offline' }); });

  router.post('/api/discord/presence/:userId', async (req, res) => { await ensureDataFiles(); const uid = req.params.userId; const payload = req.body || {}; const presence = await readJSON(DATA_FILES.discord_presence); const idx = presence.findIndex(x => String(x.user_id) === String(uid)); const entry = { user_id: uid, status: payload.status || 'online', activities: payload.activities || [], updated_at: new Date().toISOString() }; if (idx === -1) presence.push(entry); else presence[idx] = { ...presence[idx], ...entry }; await writeJSON(DATA_FILES.discord_presence, presence); res.json(entry); });

  // Community extra endpoints (moved from legacy index.js numbered routes)
  router.post('/api/community/extra/:num', async (req, res) => {
    await ensureDataFiles();
    try {
      const coll = await readJSON(DATA_FILES.expanded_community);
      const payload = (req.body && Object.keys(req.body).length) ? req.body : { id: require('uuid').v4(), kind: 'community_extra', created_at: new Date().toISOString() };
      const item = { id: require('uuid').v4(), ...payload, auto_index: parseInt(req.params.num, 10) || 0, created_at: new Date().toISOString() };
      coll.push(item);
      await writeJSON(DATA_FILES.expanded_community, coll);
      return res.status(201).json(item);
    } catch (err) {
      return res.status(500).json({ error: 'failed to create community item' });
    }
  });

  router.get('/api/community/extra/:num', async (req, res) => {
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

  app.use('/', router);
};

// Additional lightweight endpoints (non-API prefixed) to match requested surface
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
