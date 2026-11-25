/**
 * streamGenerator.js
 * Asynchronous Generator & Server-Sent Events (SSE) Client untuk SaipulAI
 * 
 * Fitur:
 * 1. streamTextGenerator: Asynchronous generator yang mengalirkan kata demi kata dengan ritme alami (jeda tanda baca).
 * 2. fetchSSEStream: Klien SSE (Server-Sent Events) untuk streaming langsung dari endpoint /api/saipul.
 * 3. smartStreamResponse: Hybrid orchestrator yang mengalirkan jawaban panjang secara real-time.
 */

/**
 * Asynchronous Generator lokal yang memecah teks menjadi token kata dan mengalirkannya secara bertahap.
 * Memberikan efek typewriter alami layaknya ChatGPT / Gemini.
 * 
 * @param {string} text - Teks lengkap jawaban bot
 * @param {object} options - Konfigurasi kecepatan alir teks
 * @yields {{ token: string, accumulated: string, isDone: boolean, progress: number }}
 */
export async function* streamTextGenerator(text = '', options = {}) {
  if (!text) return;

  const {
    baseDelayMs = 22,
    punctuationDelayMs = 90,
    signal = null
  } = options;

  // Pisahkan teks menjadi token kata dan spasi pembatas
  const tokens = String(text).split(/(\s+)/);
  let accumulated = '';

  for (let i = 0; i < tokens.length; i++) {
    if (signal?.aborted) break;

    const token = tokens[i];
    accumulated += token;

    const isDone = i === tokens.length - 1;
    yield {
      token,
      accumulated,
      isDone,
      progress: Math.round(((i + 1) / tokens.length) * 100)
    };

    if (token.trim().length > 0 && !isDone) {
      let delay = baseDelayMs;
      // Berikan ritme alami manusiawi: jeda sedikit lebih lama pada tanda titik, seru, dan koma
      if (/[.!?]$/.test(token)) {
        delay = punctuationDelayMs;
      } else if (/[,;:]$/.test(token)) {
        delay = Math.round(punctuationDelayMs * 0.5);
      }
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

/**
 * Asynchronous Generator untuk menerima Server-Sent Events (SSE) dari endpoint /api/saipul
 * 
 * @param {string} query - Pertanyaan pengguna
 * @param {object} options - Opsi permintaan { style, history, signal }
 * @yields {{ type: 'metadata'|'token'|'done', token?: string, accumulated: string, isDone: boolean, metadata?: any }}
 */
export async function* fetchSSEStream(query, options = {}) {
  const { style = 'friendly', history = [], signal = null } = options;

  const response = await fetch('/api/saipul', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({
      message: query,
      stream: true,
      style,
      history
    }),
    signal
  });

  if (!response.ok || !response.body) {
    throw new Error(`SSE streaming failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let accumulated = '';
  let currentEvent = 'message';

  try {
    while (true) {
      if (signal?.aborted) {
        await reader.cancel();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.slice(6).trim();
        } else if (trimmed.startsWith('data:')) {
          const rawData = trimmed.slice(5).trim();
          try {
            const parsed = JSON.parse(rawData);

            if (currentEvent === 'token' && parsed.token !== undefined) {
              accumulated += parsed.token;
              yield {
                type: 'token',
                token: parsed.token,
                accumulated,
                isDone: false
              };
            } else if (currentEvent === 'metadata') {
              yield {
                type: 'metadata',
                metadata: parsed,
                accumulated,
                isDone: false
              };
            } else if (currentEvent === 'done') {
              yield {
                type: 'done',
                data: parsed,
                accumulated: parsed.fullText || accumulated,
                isDone: true
              };
            }
          } catch {
            // Abaikan parsing pada potongan baris parsial
          }
        }
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Senyap
    }
  }
}

/**
 * Helper alir respons yang menggabungkan SSE remote dengan fallback generator lokal
 * Memastikan pengalaman pengguna selalu mulus tanpa jeda blocking.
 */
export async function* smartStreamResponse(query, localFallbackText, options = {}) {
  const { useOnlineSSE = false, ...genOptions } = options;

  if (useOnlineSSE) {
    try {
      for await (const chunk of fetchSSEStream(query, genOptions)) {
        yield chunk;
      }
      return;
    } catch (err) {
      console.warn('Fallback ke local asynchronous generator:', err.message);
    }
  }

  // Fallback lokal yang sangat cepat & andal
  for await (const chunk of streamTextGenerator(localFallbackText, genOptions)) {
    yield {
      type: 'token',
      token: chunk.token,
      accumulated: chunk.accumulated,
      isDone: chunk.isDone
    };
  }
}
