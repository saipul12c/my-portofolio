// DEPRECATED: root ApiTubs removed — use backend/modules/ApiTubs
module.exports = function deprecatedApiTubs() {
  throw new Error('ApiTubs has been removed. Use backend/modules/ApiTubs instead.');
};
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
