module.exports = function registerApiTubs(app, deps = {}) {
  // Streaming-related routes and YouTube-like endpoints
  const router = require('express').Router();
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES, tryReadStreamingFile } = deps;
  const { v4: uuidv4 } = require('uuid');

  // Helper to safely call tryReadStreamingFile if provided
  async function _tryRead(name) {
    if (typeof tryReadStreamingFile === 'function') return await tryReadStreamingFile(name);
    // fallback: try to read from src/pages/streming/data or public/data/streming
    const path = require('path'); const fs = require('fs'); const p1 = path.join(__dirname, '..', 'src', 'pages', 'streming', 'data', name); const p2 = path.join(__dirname, '..', 'public', 'data', 'streming', name);
    try { if (fs.existsSync(p1)) return JSON.parse(await require('fs').promises.readFile(p1, 'utf8')); if (fs.existsSync(p2)) return JSON.parse(await require('fs').promises.readFile(p2, 'utf8')); } catch (err) { return []; } return [];
  }

  router.get('/api/videos', async (req, res) => {
    try {
      const q = String(req.query.q || '').trim().toLowerCase();
      const videos = await _tryRead('videosData.json');
      if (q) {
        const filtered = videos.filter(v => (v.title || '').toLowerCase().includes(q) || (v.description || '').toLowerCase().includes(q) || (v.channel || '').toLowerCase().includes(q));
        return res.json(filtered);
      }
      res.json(videos);
    } catch (err) { res.status(500).json({ error: 'Failed to read videos data' }); }
  });

  router.get('/api/shorts', async (req, res) => { try { const shorts = await _tryRead('shortsData.json'); res.json(shorts); } catch (err) { res.status(500).json({ error: 'Failed to read shorts data' }); } });

  router.get('/api/streaming-users', async (req, res) => { try { const users = await _tryRead('userData.json'); return res.json(users); } catch (err) { res.status(500).json({ error: 'Failed to read streaming user data' }); } });

  // Expanded streaming endpoints (POST/GET pairs) mirror original server behavior
  router.post('/api/streaming/extra/:num', async (req, res) => { await ensureDataFiles(); try { const coll = await readJSON(DATA_FILES.expanded_streaming); const payload = (req.body && Object.keys(req.body).length) ? req.body : { id: uuidv4(), kind: 'streaming_extra', created_at: new Date().toISOString() }; const item = { id: uuidv4(), ...payload, created_at: new Date().toISOString() }; coll.push(item); await writeJSON(DATA_FILES.expanded_streaming, coll); return res.status(201).json(item); } catch (err) { return res.status(500).json({ error: 'failed to create streaming item' }); } });

  router.get('/api/streaming/extra/:num', async (req, res) => { await ensureDataFiles(); try { const coll = await readJSON(DATA_FILES.expanded_streaming); const q = String(req.query.q || '').toLowerCase().trim(); const out = q ? coll.filter(x => JSON.stringify(x).toLowerCase().includes(q)) : coll; return res.json(out); } catch (err) { return res.status(500).json({ error: 'failed to read streaming items' }); } });

  // YouTube-like endpoints
  router.get('/api/youtube/channels', async (req, res) => { await ensureDataFiles(); const q = String(req.query.q || '').toLowerCase().trim(); let coll = await readJSON(DATA_FILES.youtube_channels); if (q) coll = coll.filter(c => (c.title || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)); res.json(coll); });

  router.post('/api/youtube/channels', async (req, res) => { await ensureDataFiles(); const payload = req.body || {}; if (!payload.title) return res.status(400).json({ error: 'title required' }); const coll = await readJSON(DATA_FILES.youtube_channels); const item = { id: uuidv4(), title: payload.title, description: payload.description || '', created_at: new Date().toISOString() }; coll.push(item); await writeJSON(DATA_FILES.youtube_channels, coll); res.status(201).json(item); });

  router.get('/api/youtube/channels/:id', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.youtube_channels); const item = coll.find(c => String(c.id) === String(req.params.id)); if (!item) return res.status(404).json({ error: 'Channel not found' }); res.json(item); });

  // Return authoritative list of youtube videos (reflects persisted updates)
  router.get('/api/youtube/videos', async (req, res) => {
    await ensureDataFiles();
    try {
      const vids = await readJSON(DATA_FILES.youtube_videos);
      res.json(vids || []);
    } catch (err) {
      res.status(500).json({ error: 'failed to read youtube videos' });
    }
  });

  router.get('/api/youtube/channels/:id/videos', async (req, res) => { await ensureDataFiles(); const vids = await readJSON(DATA_FILES.youtube_videos); res.json((vids || []).filter(v => String(v.channel_id) === String(req.params.id))); });

  router.post('/api/youtube/videos', async (req, res) => { await ensureDataFiles(); const p = req.body || {}; if (!p.title || !p.channel_id) return res.status(400).json({ error: 'title and channel_id required' }); const coll = await readJSON(DATA_FILES.youtube_videos); const item = { id: uuidv4(), channel_id: p.channel_id, title: p.title, description: p.description || '', views: p.views || 0, likes: p.likes || 0, created_at: new Date().toISOString() }; coll.push(item); await writeJSON(DATA_FILES.youtube_videos, coll); res.status(201).json(item); });

  router.get('/api/youtube/videos/:id', async (req, res) => { await ensureDataFiles(); const vids = await readJSON(DATA_FILES.youtube_videos); const v = vids.find(x => String(x.id) === String(req.params.id)); if (!v) return res.status(404).json({ error: 'Video not found' }); res.json(v); });

  router.post('/api/youtube/videos/:id/comments', async (req, res) => { await ensureDataFiles(); const vid = req.params.id; const p = req.body || {}; if (!p.author || !p.message) return res.status(400).json({ error: 'author and message required' }); const coll = await readJSON(DATA_FILES.youtube_comments); const c = { id: uuidv4(), video_id: vid, author: p.author, message: p.message, created_at: new Date().toISOString() }; coll.push(c); await writeJSON(DATA_FILES.youtube_comments, coll); res.status(201).json(c); });

  router.get('/api/youtube/videos/:id/comments', async (req, res) => {
    await ensureDataFiles();
    try {
      const vid = req.params.id;
      const coll = await readJSON(DATA_FILES.youtube_comments);
      const filtered = (coll || []).filter(x => String(x.video_id) === String(vid));
      // support pagination via ?page & ?per
      const page = Math.max(1, Number(req.query.page || 1));
      const per = Math.max(1, Math.min(200, Number(req.query.per || 20)));
      const total = filtered.length;
      if (req.query.page) {
        const start = (page - 1) * per;
        const data = filtered.slice(start, start + per);
        return res.json({ page, per, total, data });
      }
      // fallback: return last 200 comments as before
      return res.json(filtered.slice(-200));
    } catch (err) {
      return res.status(500).json({ error: 'failed to read comments' });
    }
  });

  // Persist like/unlike for a video (updates `youtube_videos.json` likes count)
  router.post('/api/videos/:id/like', async (req, res) => {
    await ensureDataFiles();
    try {
      const id = req.params.id;
      const payload = req.body || {};
      const vids = await readJSON(DATA_FILES.youtube_videos);
      const idx = vids.findIndex(v => String(v.id) === String(id));
      if (idx === -1) return res.status(404).json({ error: 'Video not found' });
      // payload.liked true => increment, false => decrement; if not provided, no-op
      if (typeof payload.liked === 'boolean') {
        const delta = payload.liked ? 1 : -1;
        vids[idx].likes = Math.max(0, (Number(vids[idx].likes || 0) + delta));
        vids[idx].updated_at = new Date().toISOString();
        await writeJSON(DATA_FILES.youtube_videos, vids);
      }
      return res.json(vids[idx]);
    } catch (err) {
      return res.status(500).json({ error: 'failed to update likes' });
    }
  });

  router.get('/api/youtube/live', async (req, res) => { await ensureDataFiles(); const coll = await readJSON(DATA_FILES.youtube_live_streams); res.json(coll || []); });

  router.get('/api/youtube/analytics/channel/:id', async (req, res) => { await ensureDataFiles(); const channelId = req.params.id; const vids = (await readJSON(DATA_FILES.youtube_videos)).filter(v => String(v.channel_id) === String(channelId)); const analytics = await readJSON(DATA_FILES.youtube_analytics); const total_views = vids.reduce((s, v) => s + (v.views || 0), 0); const total_likes = vids.reduce((s, v) => s + (v.likes || 0), 0); const extra = analytics.find(a => String(a.channel_id) === String(channelId)) || {}; res.json({ channel_id: channelId, total_videos: vids.length, total_views, total_likes, extra }); });

  // ---------- Streaming, ingest, recordings, chat, clips, uploads, captions, scheduling, metrics, monetization, moderation, discovery, webhooks ----------

  // Start a live stream session
  router.post('/api/streams/start', async (req, res) => {
    await ensureDataFiles();
    try {
      const streams = await readJSON(DATA_FILES.youtube_live_streams);
      const body = req.body || {};
      const stream_key = uuidv4();
      const id = uuidv4();
      const ingest = { rtmp: `rtmp://localhost:1935/live/${stream_key}`, srt: `srt://localhost:9000/${id}`, recommended: { bitrate: '2500k', resolution: '1280x720', fps: 30 } };
      const stream = { id, stream_key, title: body.title || 'Untitled Stream', channel_id: body.channel_id || null, status: 'live', started_at: new Date().toISOString(), viewers_current: 0, ingest };
      streams.push(stream);
      await writeJSON(DATA_FILES.youtube_live_streams, streams);
      res.status(201).json({ stream_id: id, stream_key, ingest });
    } catch (err) { res.status(500).json({ error: 'failed to start stream' }); }
  });

  // Stop a live stream session
  router.post('/api/streams/:id/stop', async (req, res) => {
    await ensureDataFiles();
    try {
      const id = req.params.id;
      const streams = await readJSON(DATA_FILES.youtube_live_streams);
      const idx = streams.findIndex(s => String(s.id) === String(id));
      if (idx === -1) return res.status(404).json({ error: 'Stream not found' });
      streams[idx].status = 'offline';
      streams[idx].stopped_at = new Date().toISOString();
      await writeJSON(DATA_FILES.youtube_live_streams, streams);
      // optionally create a VOD entry if recording requested
      if (req.body && req.body.create_vod) {
        const vids = await readJSON(DATA_FILES.youtube_videos);
        const v = { id: uuidv4(), channel_id: streams[idx].channel_id || null, title: req.body.vod_title || (`VOD - ${streams[idx].title || 'Stream'}`), description: req.body.vod_description || '', views: 0, likes: 0, created_at: new Date().toISOString() };
        vids.push(v); await writeJSON(DATA_FILES.youtube_videos, vids);
      }
      res.json({ ok: true, stream: streams[idx] });
    } catch (err) { res.status(500).json({ error: 'failed to stop stream' }); }
  });

  // Stream status
  router.get('/api/streams/:id/status', async (req, res) => { await ensureDataFiles(); try { const streams = await readJSON(DATA_FILES.youtube_live_streams); const s = streams.find(x => String(x.id) === String(req.params.id)); if (!s) return res.status(404).json({ error: 'Not found' }); res.json({ id: s.id, status: s.status || 'offline', started_at: s.started_at, viewers_current: s.viewers_current || 0 }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Update stream metadata
  router.put('/api/streams/:id', async (req, res) => { await ensureDataFiles(); try { const streams = await readJSON(DATA_FILES.youtube_live_streams); const idx = streams.findIndex(s => String(s.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); const allowed = ['title','category','tags','language','description']; const updates = {}; for (const k of allowed) if (k in req.body) updates[k] = req.body[k]; streams[idx] = { ...streams[idx], ...updates, updated_at: new Date().toISOString() }; await writeJSON(DATA_FILES.youtube_live_streams, streams); res.json(streams[idx]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Manifest / play URL
  router.get('/api/streams/:id/manifest', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const streams = await readJSON(DATA_FILES.youtube_live_streams); const s = streams.find(x => String(x.id) === String(id)); if (!s) return res.status(404).json({ error: 'Not found' }); const hls = `${req.protocol}://${req.get('host')}/hls/${id}/index.m3u8`; res.json({ hls, dash: `${req.protocol}://${req.get('host')}/dash/${id}/manifest.mpd`, play_url: `${req.protocol}://${req.get('host')}/watch/${id}` }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Regenerate stream key
  router.post('/api/streams/:id/keys/regenerate', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const streams = await readJSON(DATA_FILES.youtube_live_streams); const idx = streams.findIndex(s => String(s.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); const newKey = uuidv4(); streams[idx].stream_key = newKey; streams[idx].updated_at = new Date().toISOString(); await writeJSON(DATA_FILES.youtube_live_streams, streams); res.json({ stream_id: id, stream_key: newKey }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Ingest info
  router.get('/api/streams/ingest-info', async (req, res) => { await ensureDataFiles(); try { res.json({ rtmp: { url: 'rtmp://live.example.com/live', port: 1935 }, srt: { url: 'srt://live.example.com:9000', port: 9000 }, recommended: { video_bitrate: '2500k', audio_bitrate: '128k', keyframe_interval: 2 } }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Authorize ingest - short lived token
  router.post('/api/streams/:id/authorize-ingest', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const streams = await readJSON(DATA_FILES.youtube_live_streams); const s = streams.find(x => String(x.id) === String(id)); if (!s) return res.status(404).json({ error: 'Not found' }); const token = uuidv4(); const ttl = (req.body && req.body.ttl) ? Number(req.body.ttl) : 60; const expires_at = new Date(Date.now() + ttl * 1000).toISOString(); s.ingest_token = { token, expires_at }; await writeJSON(DATA_FILES.youtube_live_streams, streams); res.json({ token, expires_at }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Request recording / archive retrieval
  router.post('/api/streams/:id/recordings', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const recs = await readJSON(DATA_FILES.youtube_analytics); // reuse analytics as recordings store for minimal impl
    const rec = { id: uuidv4(), stream_id: id, status: 'queued', requested_at: new Date().toISOString(), params: req.body || {} }; recs.push(rec); await writeJSON(DATA_FILES.youtube_analytics, recs); res.status(201).json(rec); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Recording status
  router.get('/api/recordings/:id/status', async (req, res) => { await ensureDataFiles(); try { const recs = await readJSON(DATA_FILES.youtube_analytics); const r = recs.find(x => String(x.id) === String(req.params.id)); if (!r) return res.status(404).json({ error: 'Not found' }); res.json({ id: r.id, status: r.status || 'queued', progress: r.progress || 0, renditions: r.renditions || [] }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Download final VOD (returns a presigned-like URL)
  router.get('/api/recordings/:id/download', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; res.json({ url: `${req.protocol}://${req.get('host')}/downloads/recordings/${id}.mp4`, expires_in: 3600 }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Request additional renditions
  router.post('/api/recordings/:id/convert', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const recs = await readJSON(DATA_FILES.youtube_analytics); const idx = recs.findIndex(x => String(x.id) === String(id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); recs[idx].conversion_requested = req.body || {}; recs[idx].status = 'processing'; await writeJSON(DATA_FILES.youtube_analytics, recs); res.json(recs[idx]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Signed HLS URL
  router.get('/api/streams/:id/hls-url', async (req, res) => { await ensureDataFiles(); try { const url = `${req.protocol}://${req.get('host')}/hls/${req.params.id}/index.m3u8?sig=${uuidv4()}`; res.json({ url, expires_in: 300 }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Thumbnail and preview
  router.get('/api/streams/:id/thumbnail', async (req, res) => { await ensureDataFiles(); try { res.json({ url: `${req.protocol}://${req.get('host')}/thumbs/${req.params.id}.jpg` }); } catch (err) { res.status(500).json({ error: 'failed' }); } });
  router.get('/api/streams/:id/preview', async (req, res) => { await ensureDataFiles(); try { res.json({ url: `${req.protocol}://${req.get('host')}/preview/${req.params.id}.gif` }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Chat: messages (paginated) - reuse messages data file
  router.get('/api/streams/:id/chat/messages', async (req, res) => { await ensureDataFiles(); try { const all = await readJSON(DATA_FILES.messages); const id = req.params.id; const q = String(req.query.q || '').toLowerCase(); let filtered = all.filter(m => String(m.stream_id) === String(id)); if (q) filtered = filtered.filter(m => (m.text||'').toLowerCase().includes(q)); const page = Math.max(1, Number(req.query.page||1)); const per = Math.max(1, Math.min(200, Number(req.query.per||50))); const start = (page-1)*per; res.json({ page, per, total: filtered.length, data: filtered.slice(start, start+per) }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Post chat message
  router.post('/api/streams/:id/chat/message', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const p = req.body || {}; if (!p.author || !p.text) return res.status(400).json({ error: 'author and text required' }); const all = await readJSON(DATA_FILES.messages); const msg = { id: uuidv4(), stream_id: id, author: p.author, text: p.text, created_at: new Date().toISOString() }; all.push(msg); await writeJSON(DATA_FILES.messages, all); // Note: emission via socket not implemented here
    res.status(201).json(msg); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Chat moderation actions
  router.post('/api/streams/:id/chat/moderation', async (req, res) => { await ensureDataFiles(); try { const action = req.body && req.body.action; if (!action) return res.status(400).json({ error: 'action required' }); // very minimal
    res.json({ ok: true, action }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/streams/:id/chat/mods', async (req, res) => { await ensureDataFiles(); try { res.json([]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Clips
  router.post('/api/streams/:id/clips', async (req, res) => { await ensureDataFiles(); try { const id = req.params.id; const p = req.body || {}; if (typeof p.start === 'undefined' || typeof p.end === 'undefined') return res.status(400).json({ error: 'start and end required' }); const clips = await readJSON(DATA_FILES.youtube_comments); const clip = { id: uuidv4(), stream_id: id, start: p.start, end: p.end, url: `${req.protocol}://${req.get('host')}/clips/${uuidv4()}.mp4`, created_at: new Date().toISOString() }; clips.push(clip); await writeJSON(DATA_FILES.youtube_comments, clips); res.status(201).json(clip); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/clips/:id', async (req, res) => { await ensureDataFiles(); try { const clips = await readJSON(DATA_FILES.youtube_comments); const c = clips.find(x => String(x.id) === String(req.params.id)); if (!c) return res.status(404).json({ error: 'Not found' }); res.json(c); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Highlights
  router.post('/api/streams/:id/highlights', async (req, res) => { await ensureDataFiles(); try { const h = { id: uuidv4(), stream_id: req.params.id, status: 'queued', created_at: new Date().toISOString() }; const aux = await readJSON(DATA_FILES.expanded_streaming); aux.push(h); await writeJSON(DATA_FILES.expanded_streaming, aux); res.status(201).json(h); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Uploads: init and complete
  router.post('/api/uploads/init', async (req, res) => { await ensureDataFiles(); try { const p = req.body || {}; const uploadId = uuidv4(); res.status(201).json({ upload_id: uploadId, presigned_url: `${req.protocol}://${req.get('host')}/upload/${uploadId}`, multipart: false }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/uploads/complete', async (req, res) => { await ensureDataFiles(); try { const p = req.body || {}; if (!p.upload_id) return res.status(400).json({ error: 'upload_id required' }); // trigger transcode (queued)
    res.json({ ok: true, upload_id: p.upload_id, status: 'transcode_queued' }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Video assets
  router.get('/api/videos/:id/assets', async (req, res) => { await ensureDataFiles(); try { res.json({ renditions: [], subtitles: [], thumbnails: [] }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/videos/:id/thumbnail', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true, url: `${req.protocol}://${req.get('host')}/thumbs/${req.params.id}.jpg` }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Captions
  router.post('/api/videos/:id/captions', async (req, res) => { await ensureDataFiles(); try { res.status(201).json({ id: uuidv4(), video_id: req.params.id, status: 'uploaded' }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/videos/:id/captions', async (req, res) => { await ensureDataFiles(); try { res.json([]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/streams/:id/transcript/live', async (req, res) => { await ensureDataFiles(); try { res.json({ token: uuidv4(), ws_url: `wss://${req.get('host')}/transcripts/${req.params.id}` }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Scheduling
  router.post('/api/streams/schedule', async (req, res) => { await ensureDataFiles(); try { const sched = await readJSON(DATA_FILES.expanded_streaming); const ev = { id: uuidv4(), ...req.body, created_at: new Date().toISOString() }; sched.push(ev); await writeJSON(DATA_FILES.expanded_streaming, sched); res.status(201).json(ev); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/streams/schedule', async (req, res) => { await ensureDataFiles(); try { const sched = await readJSON(DATA_FILES.expanded_streaming); res.json(sched); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.put('/api/streams/schedule/:id', async (req, res) => { await ensureDataFiles(); try { const sched = await readJSON(DATA_FILES.expanded_streaming); const idx = sched.findIndex(x => String(x.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); sched[idx] = { ...sched[idx], ...req.body, updated_at: new Date().toISOString() }; await writeJSON(DATA_FILES.expanded_streaming, sched); res.json(sched[idx]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/events/upcoming', async (req, res) => { await ensureDataFiles(); try { const sched = await readJSON(DATA_FILES.expanded_streaming); res.json(sched.slice(-50)); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Metrics
  router.get('/api/streams/:id/metrics/realtime', async (req, res) => { await ensureDataFiles(); try { res.json({ viewers: Math.floor(Math.random()*1000), bitrate_histogram: [], dropped_frames: 0 }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/streams/:id/metrics/history', async (req, res) => { await ensureDataFiles(); try { res.json({ points: [] }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/streams/:id/health', async (req, res) => { await ensureDataFiles(); try { res.json({ encoder: { fps: 30, bitrate: '2500k' }, avg_latency_ms: 120 }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Monetization
  router.post('/api/streams/:id/superchat', async (req, res) => { await ensureDataFiles(); try { const p = req.body || {}; if (!p.amount || !p.author) return res.status(400).json({ error: 'amount and author required' }); const obj = { id: uuidv4(), stream_id: req.params.id, amount: p.amount, author: p.author, created_at: new Date().toISOString() }; const coll = await readJSON(DATA_FILES.youtube_analytics); coll.push(obj); await writeJSON(DATA_FILES.youtube_analytics, coll); res.status(201).json(obj); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/streams/:id/tips', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true, status: 'processed' }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/creators/:id/revenue', async (req, res) => { await ensureDataFiles(); try { res.json({ id: req.params.id, revenue: 0, breakdown: [] }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/creators/:id/memberships', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Moderation & reports
  router.post('/api/videos/:id/report', async (req, res) => { await ensureDataFiles(); try { const reports = await readJSON(DATA_FILES.expanded_streaming); const r = { id: uuidv4(), video_id: req.params.id, reason: req.body.reason || 'unspecified', created_at: new Date().toISOString() }; reports.push(r); await writeJSON(DATA_FILES.expanded_streaming, reports); res.status(201).json(r); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/mod/reports', async (req, res) => { await ensureDataFiles(); try { const reports = await readJSON(DATA_FILES.expanded_streaming); res.json(reports); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/mod/actions/:id', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true, action: req.body.action || 'none' }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Discovery & personalization
  router.get('/api/streams/trending', async (req, res) => { await ensureDataFiles(); try { const live = await readJSON(DATA_FILES.youtube_live_streams); res.json(live.slice(0,20)); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/videos/recommended', async (req, res) => { await ensureDataFiles(); try { const vids = await readJSON(DATA_FILES.youtube_videos); res.json(vids.slice(0,20)); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/users/:id/watchlist', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/videos/:id/playlist', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Subscriptions & notifications
  router.post('/api/users/:id/subscribe', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/users/:id/subscribers', async (req, res) => { await ensureDataFiles(); try { res.json([]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/notifications/subscribe', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/notifications/webhook', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Comments & pinning (VOD)
  router.post('/api/videos/:id/comments', async (req, res) => { await ensureDataFiles(); try { const vids = await readJSON(DATA_FILES.youtube_comments); const p = req.body || {}; if (!p.author || !p.message) return res.status(400).json({ error: 'author and message required' }); const c = { id: uuidv4(), video_id: req.params.id, author: p.author, message: p.message, created_at: new Date().toISOString() }; vids.push(c); await writeJSON(DATA_FILES.youtube_comments, vids); res.status(201).json(c); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.patch('/api/comments/:id', async (req, res) => { await ensureDataFiles(); try { const coll = await readJSON(DATA_FILES.youtube_comments); const idx = coll.findIndex(x => String(x.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); coll[idx] = { ...coll[idx], ...req.body, updated_at: new Date().toISOString() }; await writeJSON(DATA_FILES.youtube_comments, coll); res.json(coll[idx]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/comments/:id/pin', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Search & tags
  router.get('/api/search/videos', async (req, res) => { await ensureDataFiles(); try { const q = String(req.query.q || '').toLowerCase().trim(); const vids = await readJSON(DATA_FILES.youtube_videos); let out = vids; if (q) out = vids.filter(v => (v.title||'').toLowerCase().includes(q) || (v.description||'').toLowerCase().includes(q)); res.json(out); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/videos/:id/tags', async (req, res) => { await ensureDataFiles(); try { const vids = await readJSON(DATA_FILES.youtube_videos); const idx = vids.findIndex(v => String(v.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); vids[idx].tags = req.body.tags || vids[idx].tags || []; await writeJSON(DATA_FILES.youtube_videos, vids); res.json(vids[idx]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Developer / webhooks
  router.post('/api/webhooks/streams/:id', async (req, res) => { await ensureDataFiles(); try { res.status(201).json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/thirdparty/ingest/test', async (req, res) => { await ensureDataFiles(); try { res.json({ ok: true, received: req.body || {} }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/keys/developer', async (req, res) => { await ensureDataFiles(); try { res.json([]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Accessibility & localization
  router.post('/api/videos/:id/translate-captions', async (req, res) => { await ensureDataFiles(); try { res.json({ job_id: uuidv4(), status: 'queued' }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.get('/api/videos/:id/cc-languages', async (req, res) => { await ensureDataFiles(); try { res.json([]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Admin
  router.get('/api/admin/streams', async (req, res) => { await ensureDataFiles(); try { const live = await readJSON(DATA_FILES.youtube_live_streams); res.json(live); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/admin/streams/:id/force-stop', async (req, res) => { await ensureDataFiles(); try { const streams = await readJSON(DATA_FILES.youtube_live_streams); const idx = streams.findIndex(s => String(s.id) === String(req.params.id)); if (idx === -1) return res.status(404).json({ error: 'Not found' }); streams[idx].status = 'aborted'; streams[idx].stopped_at = new Date().toISOString(); await writeJSON(DATA_FILES.youtube_live_streams, streams); res.json({ ok: true }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // Misc
  router.get('/api/streams/:id/related', async (req, res) => { await ensureDataFiles(); try { res.json([]); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  router.post('/api/streams/:id/share', async (req, res) => { await ensureDataFiles(); try { res.json({ short_link: `${req.protocol}://${req.get('host')}/s/${uuidv4()}` }); } catch (err) { res.status(500).json({ error: 'failed' }); } });

  // end of extended routes

  app.use('/', router);
};
