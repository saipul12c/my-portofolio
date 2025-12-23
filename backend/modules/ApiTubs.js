module.exports = function registerApiTubs(app, deps = {}) {
  const router = require('express').Router();
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES, readChannelMessagesFile, writeChannelMessagesFile, getProfileForUser, io } = deps;
  const { v4: uuidv4 } = require('uuid');

  // Streaming / youtube-like endpoints (lightweight mocks)
  router.get('/api/videos', async (req, res) => {
    await ensureDataFiles(); const q = (req.query.q || '').toString().toLowerCase(); let videos = await readJSON(DATA_FILES.youtube_videos); if (q) videos = videos.filter(v => JSON.stringify(v).toLowerCase().includes(q)); res.json(videos.slice(0, 100));
  });

  router.get('/api/videos/:id', async (req, res) => { await ensureDataFiles(); const videos = await readJSON(DATA_FILES.youtube_videos); const v = videos.find(x => String(x.id) === String(req.params.id)); if (!v) return res.status(404).json({ error: 'Video not found' }); res.json(v); });

  router.post('/api/videos', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; const videos = await readJSON(DATA_FILES.youtube_videos); const newV = { id: uuidv4(), ...payload, created_at: new Date().toISOString() }; videos.push(newV); await writeJSON(DATA_FILES.youtube_videos, videos); res.status(201).json(newV); });

  // Streams
  router.get('/api/streams', async (req, res) => { await ensureDataFiles(); const streams = await readJSON(DATA_FILES.youtube_live_streams || DATA_FILES.youtube_live_streams); res.json(streams || []); });

  router.post('/api/streams/start', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; const streams = await readJSON(DATA_FILES.youtube_live_streams || DATA_FILES.youtube_live_streams); const s = { id: uuidv4(), title: payload.title || 'Live Stream', status: 'live', ingest: payload.ingest || null, created_at: new Date().toISOString() }; streams.push(s); await writeJSON(DATA_FILES.youtube_live_streams || DATA_FILES.youtube_live_streams, streams); res.status(201).json(s); });

  router.post('/api/streams/:id/stop', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const streams = await readJSON(DATA_FILES.youtube_live_streams || DATA_FILES.youtube_live_streams); const idx = streams.findIndex(x => String(x.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Stream not found' }); streams[idx].status = 'ended'; streams[idx].ended_at = new Date().toISOString(); await writeJSON(DATA_FILES.youtube_live_streams || DATA_FILES.youtube_live_streams, streams); res.json(streams[idx]); });

  // Chat endpoints for streams
  router.get('/api/streams/:id/chat', async (req, res) => { await ensureDataFiles(); const id = req.params.id; let msgs = await readChannelMessagesFile(id); if (!msgs) msgs = []; msgs.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); const out = await Promise.all(msgs.slice(-200).map(async (m) => ({ ...m, profiles: await getProfileForUser(m.user_id) }))); res.json(out); });

  router.post('/api/streams/:id/chat', async (req, res) => { await ensureDataFiles(); const id = req.params.id; const { user_id, content } = req.body || {}; if (!user_id || !content) return res.status(400).json({ error: 'user_id and content required' }); const msg = { id: uuidv4(), channel_id: id, user_id, content, created_at: new Date().toISOString() }; try { const ch = await readChannelMessagesFile(id); ch.push(msg); await writeChannelMessagesFile(id, ch); } catch (err) { } try { if (io) io.to(String(id)).emit('message', msg); } catch (err) {} res.status(201).json(msg); });

  // Extras similar to legacy /api/streaming/extra/:num
  router.post('/api/streaming/extra/:num', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.expanded_streaming); const payload = req.body && Object.keys(req.body).length ? req.body : { id: uuidv4(), created_at: new Date().toISOString() }; const item = { id: uuidv4(), ...payload, auto_index: parseInt(req.params.num, 10) || 0, created_at: new Date().toISOString() }; coll.push(item); await writeJSON(DATA_FILES.expanded_streaming, coll); res.status(201).json(item); });

  router.get('/api/streaming/extra/:num', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.expanded_streaming); const q = String(req.query.q || '').toLowerCase().trim(); const out = q ? coll.filter(x => JSON.stringify(x).toLowerCase().includes(q)) : coll; res.json(out); });

  app.use('/', router);
};
