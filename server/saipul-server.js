/**
 * Standalone Node.js HTTP Server for SaipulAI API
 * 
 * Penggunaan:
 *   node server/saipul-server.js
 * 
 * Server ini dapat dideploy secara independen pada VPS, Render, Railway,
 * atau dijalankan di mesin lokal pada port pilihan (default: 3001).
 */

import http from 'http';
import handler from '../api/saipul.js';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(async (req, res) => {
  try {
    // Teruskan request ke serverless handler api/saipul.js
    await handler(req, res);
  } catch (err) {
    console.error('[SaipulAI Server Error]:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Terjadi kesalahan internal pada server SaipulAI.'
      }));
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log('========================================================');
  console.log(`🤖 SaipulAI Standalone Server v8.0.0 aktif!`);
  console.log(`📡 URL API: http://localhost:${PORT}/api/saipul`);
  console.log(`💡 Health Check: http://localhost:${PORT}/api/saipul`);
  console.log(`🔒 Zero Sensitive Keys • CORS Enabled • PII Filter Active`);
  console.log('========================================================');
});
