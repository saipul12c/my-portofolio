module.exports = function registerApiAI(app, deps = {}) {
  const router = require('express').Router();
  const fetch = global.fetch || require('node-fetch');
  const { ensureDataFiles, readJSON, writeJSON, DATA_FILES } = deps;

  const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

  router.post('/api/ai/chat', async (req, res) => {
    const { messages, model = 'gpt-3.5-turbo' } = req.body || {};
    if (!messages) return res.status(400).json({ error: 'messages required' });
    if (!OPENAI_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY not configured' });
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model, messages })
      });
      const data = await r.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'AI proxy failed', details: String(err) });
    }
  });

  router.post('/api/ai/moderate', async (req, res) => {
    const { input } = req.body || {};
    if (!input) return res.status(400).json({ error: 'input required' });
    if (!OPENAI_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY not configured' });
    try {
      const r = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ input })
      });
      const data = await r.json(); res.json(data);
    } catch (err) { res.status(500).json({ error: 'moderation failed', details: String(err) }); }
  });

  router.post('/api/ai/summarize', async (req, res) => {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text required' });
    if (!OPENAI_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY not configured' });
    try {
      const r = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: 'text-davinci-003', prompt: `Summarize:
\n${text}`, max_tokens: 200 })
      });
      const data = await r.json(); res.json(data);
    } catch (err) { res.status(500).json({ error: 'summarize failed', details: String(err) }); }
  });

  app.use('/', router);
};
