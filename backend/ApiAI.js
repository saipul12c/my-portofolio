// Lightweight AI proxy endpoints (OpenAI-compatible)
module.exports = function registerApiAI(app, deps = {}) {
  const router = require('express').Router();
  const { v4: uuidv4 } = require('uuid');

  // helper: get fetch (Node 18+ has global.fetch)
  let fetchFn = null;
  try {
    fetchFn = global.fetch || require('node-fetch');
  } catch (err) {
    fetchFn = global.fetch;
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

  // Expose AI configuration so frontend can disable AI UI when not configured
  router.get('/api/ai/config', async (req, res) => {
    return res.json({ openai: !!OPENAI_KEY });
  });

  // Simple chat proxy: POST /api/ai/chat { provider:'openai', model, messages, prompt }
  router.post('/api/ai/chat', async (req, res) => {
    const body = req.body || {};
    const provider = body.provider || 'openai';

    if (provider === 'openai') {
      if (!OPENAI_KEY) return res.status(400).json({ error: 'OPENAI_API_KEY not configured' });
      const model = body.model || 'gpt-3.5-turbo';
      const messages = body.messages || (body.prompt ? [{ role: 'user', content: String(body.prompt) }] : []);
      try {
        const r = await (fetchFn)(`https://api.openai.com/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages, max_tokens: body.max_tokens || 512, temperature: typeof body.temperature === 'number' ? body.temperature : 0.7 })
        });
        const data = await r.json();
        return res.json({ ok: true, provider: 'openai', data });
      } catch (err) {
        console.error('AI chat error', err);
        return res.status(500).json({ error: 'AI provider request failed', detail: err && err.message });
      }
    }

    // fallback: echo
    return res.json({ ok: true, provider: 'mock', data: { reply: body.prompt ? `Echo: ${String(body.prompt).slice(0,200)}` : 'no prompt' } });
  });

  // Summarize text: POST /api/ai/summarize { text }
  router.post('/api/ai/summarize', async (req, res) => {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text required' });
    if (!OPENAI_KEY) return res.status(400).json({ error: 'OPENAI_API_KEY not configured' });
    const prompt = `Ringkas teks berikut dalam 3-6 kalimat berbahasa Indonesia:\n\n${text}`;
    try {
      const r = await (fetchFn)(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 300 })
      });
      const data = await r.json();
      return res.json({ ok: true, data });
    } catch (err) {
      console.error('AI summarize error', err);
      return res.status(500).json({ error: 'Summarization failed', detail: err && err.message });
    }
  });

  // Moderation: POST /api/ai/moderate { input }
  router.post('/api/ai/moderate', async (req, res) => {
    const { input } = req.body || {};
    if (!input) return res.status(400).json({ error: 'input required' });
    if (!OPENAI_KEY) return res.status(400).json({ error: 'OPENAI_API_KEY not configured' });
    try {
      const r = await (fetchFn)(`https://api.openai.com/v1/moderations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await r.json();
      return res.json({ ok: true, data });
    } catch (err) {
      console.error('AI moderation error', err);
      return res.status(500).json({ error: 'Moderation failed', detail: err && err.message });
    }
  });

  app.use('/', router);
};
