# Backend (JSON-file DB + Realtime)

Backend ini menggunakan file JSON lokal (di `backend/data/`) untuk menyimpan data dan menyediakan REST API + realtime via Socket.IO.

Ringkasan fitur
- Auth (email/password) dengan JWT
- CRUD untuk communities
- Servers / Channels (turunan dari channels)
- Messages yang dipersist dan realtime via Socket.IO
- Bot management, Discord/YouTube/Streaming mock endpoints, dan helper endpoints (stats, search, summaries)

Persyaratan
- Node 16+

Menjalankan lokal (singkat)

1. Masuk ke folder `backend`:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Salin `.env.example` ke `.env` lalu set `JWT_SECRET` dan `ALLOWED_ORIGINS` jika perlu:

```powershell
copy .env.example .env
```

4. Jalankan server:

```powershell
npm run dev    # requires nodemon
npm run start  # run normally
```

Server default: `http://localhost:8080` (atau sesuai `PORT` di `.env`).

Catatan: ini adalah backend file-based sederhana untuk development. Untuk produksi gunakan DB nyata dan simpan `JWT_SECRET` dengan aman.

---

Struktur pendaftaran route
- `backend/index.js` adalah entry-point: menginisialisasi Express, Socket.IO, static assets dan memanggil `routes/registerApis.js`.
- API dikelompokkan ke modul fungsional:
	- `backend/modules/ApiGlobal.js` — auth, users, profiles, search, stats, account tiers, account-related helpers
	- `backend/modules/ApiKomunita.js` — communities, channels, messages, bots, discord-like endpoints
	- `backend/modules/ApiTubs.js` — streaming/video/YouTube-like endpoints, uploads, streams, recordings, clips
- Shared helpers berada di `lib/helpers.js` (lokasi `DATA_FILES`, I/O helpers, per-channel messages, JWT helper).

---

Daftar lengkap route (singkat)

Format: `HTTP_VERB PATH` — fungsi singkat, body (jika ada).

````markdown
# Backend (JSON-file DB + Realtime)

Backend ini menggunakan file JSON lokal (di `backend/data/`) untuk menyimpan data dan menyediakan REST API + realtime via Socket.IO.

Ringkasan fitur
- Auth (email/password) dengan JWT
- CRUD untuk communities
- Servers / Channels (turunan dari channels)
- Messages yang dipersist dan realtime via Socket.IO
- Bot management, Discord/YouTube/Streaming mock endpoints, dan helper endpoints (stats, search, summaries)

Persyaratan
- Node 16+

Menjalankan lokal (singkat)

1. Masuk ke folder `backend`:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Salin `.env.example` ke `.env` lalu set `JWT_SECRET` dan `ALLOWED_ORIGINS` jika perlu:

```powershell
copy .env.example .env
```

4. Jalankan server:

```powershell
npm run dev    # requires nodemon
npm run start  # run normally
```

Server default: `http://localhost:8080` (atau sesuai `PORT` di `.env`).

Catatan: ini adalah backend file-based sederhana untuk development. Untuk produksi gunakan DB nyata dan simpan `JWT_SECRET` dengan aman.

---

Struktur pendaftaran route
- `backend/index.js` adalah entry-point: menginisialisasi Express, Socket.IO, static assets dan memanggil `routes/registerApis.js`.
- API dikelompokkan ke modul fungsional:
	- `backend/modules/ApiGlobal.js` — auth, users, profiles, search, stats, account tiers, account-related helpers
	- `backend/modules/ApiKomunita.js` — communities, channels, messages, bots, discord-like endpoints
	- `backend/modules/ApiTubs.js` — streaming/video/YouTube-like endpoints, uploads, streams, recordings, clips
- Shared helpers berada di `lib/helpers.js` (lokasi `DATA_FILES`, I/O helpers, per-channel messages, JWT helper).

---

Daftar lengkap route (singkat)

Format: `HTTP_VERB PATH` — fungsi singkat, body (jika ada).

**Health & Static**
- GET `/health` — health check. Response `{ status: 'ok' }`.
- GET `/api/health` — alias kompatibilitas.
- GET `/data/*` — serve static dari `../public/data` (jika ada).
- GET `/avatar/*` — serve avatar dari `backend/public/avatar`.
- GET `/api/static/*` — serve JSON/asset dari `public/data/*` atau `src/data/*`.

**Auth & Profiles (backend/modules/ApiGlobal)**
- POST `/api/auth/signup` — daftar baru. Body: `{ email, password, username? }`. Response: `{ user, token }`.
- POST `/api/auth/signin` — login. Body: `{ email, password }`. Response: `{ user, token }`.
- GET `/api/auth/me` — ambil user dari `Authorization` header. Response: `{ id, email, username, role }`.
- PUT `/api/profiles/:id` — update profil publik. Body: allowed fields (e.g. `username`, `avatar_url`, `display_name`, `description`).

**Users (backend/modules/ApiGlobal / backend/modules/ApiKomunita overlap intentionally)**
- GET `/api/users` — list semua user (sanitized). Query `q` optional.
- GET `/api/users/:id` — public profile (per-user file preferred, fallback central list).
- POST `/api/users/:id/avatar` — update avatar. Body `{ avatar_url }`.
- GET `/api/users/:id/messages` — pesan yang dibuat user (max 200).

**Communities (ApiKomunita)**
- GET `/api/communities` — list communities.
- GET `/api/communities/:id` — get community.
- POST `/api/communities` — create community. Body: payload.
- PUT `/api/communities/:id` — update.
- DELETE `/api/communities/:id` — delete.
- POST `/api/communities/:id/members` — add member. Body: `{ user_id }`.
- DELETE `/api/communities/:id/members/:userId` — remove member.

**Servers / Channels (ApiKomunita)**
- GET `/api/servers` — derived list of servers (from channels) or stored list.
- GET `/api/channels` — list channels; optional `server_id` filter.
- POST `/api/channels` — create channel. Body: `{ server_id, name, position, ... }`.
- POST `/api/channels/:id/rename` — rename channel. Body: `{ name }`.

Subchannels
- POST `/api/channels/:id/subchannels` — add subchannel to parent. Body: `{ name, position? }`.
- DELETE `/api/channels/:id/subchannels/:subId` — remove subchannel.
- POST `/api/channels/:id/subchannels/:subId/rename` — rename subchannel.

**Messages (ApiKomunita)**
- GET `/api/messages` — list messages; optional `channel_id` reads per-channel file; returns last ~200 by default.
- POST `/api/messages` — create message. Body: `{ channel_id, user_id, content }`. Emits Socket.IO `message` to channel room.
- PATCH `/api/messages/:id` — edit message. Body: `{ content }`.
- DELETE `/api/messages/:id` — delete message.

Socket.IO (realtime)
# Backend (JSON-file DB + Realtime)

Backend ini menggunakan file JSON lokal (di `backend/data/`) untuk menyimpan data dan menyediakan REST API + realtime via Socket.IO.

Ringkasan fitur
- Auth (email/password) dengan JWT
- CRUD untuk communities, servers, channels, messages
- Messages dipersist dan realtime via Socket.IO
- Bot management, Discord-like endpoints, YouTube/streaming-like endpoints
- Helper endpoints (stats, search, account tiers, uploads, summaries)

Persyaratan
- Node 16+

Menjalankan lokal (singkat)

1. Masuk ke folder `backend`:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Salin `.env.example` ke `.env` lalu set `JWT_SECRET` dan `ALLOWED_ORIGINS` jika perlu:

```powershell
copy .env.example .env
```

4. Jalankan server:

```powershell
npm run dev    # requires nodemon
npm run start  # run normally
```

Server default: `http://localhost:8080` (atau sesuai `PORT` di `.env`).

Catatan: ini adalah backend file-based sederhana untuk development. Untuk produksi gunakan DB nyata dan simpan `JWT_SECRET` dengan aman.

---

Ringkasan dan Daftar Route
Berikut adalah daftar lengkap route yang ada di kode sumber (`index.js`, `routes/registerApis.js`, `backend/modules/ApiGlobal.js`, `backend/modules/ApiKomunita.js`, `backend/modules/ApiTubs.js`, `backend/modules/ApiAI.js`) — dikelompokkan menurut fungsi dan modul.

**Health & Static**
- `GET /health`: health check — `{ status: 'ok' }`.
- `GET /api/health`: alias health.
- `GET /data/*`: serve frontend `public/data/*` (when present).
- `GET /avatar/*`: serve avatar files from `backend/public/avatar`.
- `GET /api/static/*`: serve JSON/assets from `public/data/*` or `src/data/*`.

**Auth & Profiles (backend/modules/ApiGlobal & extra routes)**
- `POST /api/auth/signup` — register. Body: `{ email, password, username? }`. Response: `{ user, token }`.
- `POST /api/auth/signin` — login. Body: `{ email, password }`. Response: `{ user, token }`.
- `GET /api/auth/me` — get authenticated user (requires `Authorization: Bearer <token>`).
- `PUT /api/profiles/:id` — update public profile. Body: allowed profile fields.

Extra (compat) auth routes (registered by `registerExtraRoutes` in `backend/modules/ApiKomunita`):
- `POST /auth/register` — alias register (same concept as `/api/auth/signup`).
- `POST /auth/login` — alias login.
- `POST /auth/logout` — stateless logout (returns `{ ok: true }`).
- `POST /auth/refresh` — accepts `{ token }` and returns new token when possible.
- `POST /auth/forgot-password` — request reset; returns `reset_token` for dev convenience.
- `POST /auth/reset-password` — body `{ token, new_password }`.
- `POST /auth/verify-email` — body `{ token }`.

**Users (ApiGlobal / Komunita)**
- `GET /api/users` — list users. Query: `q` to filter.
- `GET /api/users/:id` — public profile (tries per-user file first, fallback to central list).
- `POST /api/users/:id/avatar` — update avatar. Body: `{ avatar_url }`.
- `GET /api/users/:id/messages` — messages created by user (last ~200).

**Communities (ApiKomunita)**
- `GET /api/communities` — list communities.
- `GET /api/communities/:id` — get community.
- `POST /api/communities` — create community. Body: payload.
- `PUT /api/communities/:id` — update.
- `DELETE /api/communities/:id` — delete.
- `POST /api/communities/:id/members` — add member. Body: `{ user_id }`.
- `DELETE /api/communities/:id/members/:userId` — remove member.

**Servers & Channels (ApiKomunita)**
- `GET /api/servers` — derive servers from channels or return stored `discord_servers`.
- `GET /api/channels` — list channels; optional `server_id` query filter.
- `POST /api/channels` — create channel. Body: `{ server_id, name, position?, ... }`.
- `GET /api/channels/active` — list active/popular channels (uses messages count and member_count). Query: `limit`.
- `POST /api/channels/:id/rename` — rename channel. Body: `{ name }`.

Subchannels
- `POST /api/channels/:id/subchannels` — add subchannel. Body: `{ name, position? }`.
- `DELETE /api/channels/:id/subchannels/:subId` — remove subchannel.
- `POST /api/channels/:id/subchannels/:subId/rename` — rename subchannel.

**Messages (ApiKomunita & index.js legacy handlers)**
- `GET /api/messages` — list messages. Query: `channel_id` to return per-channel messages (last ~200). Returns `profiles` attached where possible.
- `POST /api/messages` — create message. Body: `{ channel_id, user_id, content }`. Emits `message` via Socket.IO if `io` present.
- `PATCH /api/messages/:id` — edit message. Body: `{ content }`.
- `DELETE /api/messages/:id` — delete message.

Socket.IO (realtime)
- Events handled by server-side socket listener in `index.js`:
  - `join` — payload `{ channelId, user? }` to join a room.
  - `leave` — leave room.
  - `message` — payload `{ channelId, userId, content }` — server persists the message and broadcasts to channel room (`io.to(channelId).emit('message', ...)`).

**Bots (ApiKomunita / index.js)**
- `GET /api/bots` — list bots.
- `POST /api/bots` — create bot user. Body: `{ username, display_name?, description? }`.
- `DELETE /api/bots/:id` — delete bot and related user/profile.
- `POST /api/bots/:id/send` — bot posts message. Body: `{ channel_id, content }`.

**Discord-like helpers (ApiKomunita)**
- `GET /api/discord/servers` — list servers (from `discord_servers` or derived from channels).
- `POST /api/discord/servers` — create mock server. Body: `{ name, meta? }`.
- `GET /api/discord/servers/:id` — get server.
- `POST /api/discord/servers/:id/invite` — create invite. Body: `{ max_uses?, expires_at? }`.
- `GET /api/discord/servers/:id/invites` — list invites for server.
- `POST /api/discord/roles` — create role. Body: `{ server_id, name, permissions? }`.
- `GET /api/discord/roles` — list roles; query `server_id` optional.
- `POST /api/discord/webhooks` — create webhook. Body: `{ server_id, channel_id, url, name? }`.
- `GET /api/discord/webhooks` — list webhooks; query `server_id` optional.
- `POST /api/discord/webhooks/:id/send` — send webhook message (creates message, emits to channel).
- `GET/POST /api/discord/presence/:userId` — get/set presence state.

**YouTube / Streaming / Video (ApiTubs)**
- `GET /api/videos` — read videos from frontend data if available (supports `q`).
- `GET /api/shorts` — read shorts data.
- `GET /api/streaming-users` — read streaming users data.

YouTube-like
- `GET /api/youtube/channels` — list channels (query `q`).
- `POST /api/youtube/channels` — create channel. Body: `{ title, description? }`.
- `GET /api/youtube/channels/:id` — get channel.
- `GET /api/youtube/channels/:id/videos` — list videos for channel.
- `GET /api/youtube/videos` — list all youtube videos (persisted in `youtube_videos.json`).
- `POST /api/youtube/videos` — create video. Body: `{ title, channel_id, ... }`.
- `GET /api/youtube/videos/:id` — get video.
- `POST /api/youtube/videos/:id/comments` — post comment. Body: `{ author, message }`.
- `GET /api/youtube/videos/:id/comments` — list comments; supports pagination via `?page` & `?per`.
- `POST /api/videos/:id/like` — like/unlike video. Body: `{ liked: true|false }`.

Streaming management
- `POST /api/streams/start` — start stream; returns `stream_id`, `stream_key`, `ingest` endpoints.
- `POST /api/streams/:id/stop` — stop stream; optional body `{ create_vod, vod_title, vod_description }`.
- `GET /api/streams/:id/status` — stream status.
- `PUT /api/streams/:id` — update stream metadata.
- `GET /api/streams/:id/manifest` — return HLS/DASH/play URLs.
- `POST /api/streams/:id/keys/regenerate` — regenerate stream key.
- `GET /api/streams/:id/hls-url` — returns signed HLS URL (mock).
- `GET /api/streams/ingest-info` — returns ingest server info.
- `POST /api/streams/:id/authorize-ingest` — issue short-lived ingest token.

Recordings / Clips / Highlights
- `POST /api/streams/:id/recordings` — request recording (mock).
- `GET /api/recordings/:id/status` — recording status.
- `GET /api/recordings/:id/download` — presigned-like download URL.
- `POST /api/recordings/:id/convert` — request conversion.
- `POST /api/streams/:id/clips` — create clip. Body: `{ start, end }`.
- `GET /api/clips/:id` — get clip.
- `POST /api/streams/:id/highlights` — request highlight creation.

Uploads & Assets
- `POST /api/uploads/init` — init upload. Body: metadata; returns `upload_id` and `presigned_url`.
- `POST /api/uploads/complete` — complete upload. Body: `{ upload_id }`.
- `GET /api/videos/:id/assets` — list renditions/subtitles/thumbnails.
- `POST /api/videos/:id/thumbnail` — set thumbnail (mock).
- `POST /api/videos/:id/captions` and `GET /api/videos/:id/captions` — captions endpoints.

Chat & Streams Chat
- `GET /api/streams/:id/chat/messages` — get chat messages (pagination: `page`, `per`).
- `POST /api/streams/:id/chat/message` — post chat message. Body: `{ author, text }`.
- `POST /api/streams/:id/chat/moderation` — moderation action.

Monetization & Creators
- `POST /api/streams/:id/superchat` — create superchat. Body: `{ amount, author }`.
- `POST /api/streams/:id/tips` — tips (mock).
- `GET /api/creators/:id/revenue` — creator revenue (mock).
- `POST /api/creators/:id/memberships` — membership action (mock).

Moderation & Reports
- `POST /api/videos/:id/report` — report video.
- `GET /api/mod/reports` — list reports (mock).
- `POST /api/mod/actions/:id` — perform moderation action.

Discovery & Recommendations
- `GET /api/streams/trending` — trending live streams (mock).
- `GET /api/videos/recommended` — recommended videos (mock).

Developer & Webhooks
- `POST /api/webhooks/streams/:id` — developer webhook.
- `POST /api/thirdparty/ingest/test` — test ingest webhook.
- `GET /api/keys/developer` — developer keys (mock).

AI Endpoints (ApiAI.js)
- `POST /api/ai/chat` — AI chat proxy. Body example: `{ provider:'openai', model, messages, prompt }`.
- `POST /api/ai/summarize` — summarize text. Body: `{ text }`.
- `POST /api/ai/moderate` — moderation. Body: `{ input }`.

Misc / Extra (registered by `ApiKomunita.registerExtraRoutes`)
- Auth helpers (`/auth/*`) and user convenience routes (`/users/me/preferences`, `/users/me/profile`, `/users/:id/report`, friends APIs, DM endpoints, block/unblock, servers CRUD under `/servers` etc.). These are mounted at root (not always under `/api`) and intended as compatibility helpers for frontend code.

Data files
- All persistent data lives under `backend/data/` (examples: `users.json`, `channels.json`, `messages.json`, `youtube_videos.json`, `discord_*/*.json`). Per-channel messages may also be stored under `backend/data/messages/` and per-user profiles under `backend/data/users/`.

Notes & Recommendations
- All routes are non-destructive mocks suitable for development and testing. Many endpoints store lightweight JSON and return simple objects or arrays.
- To enable AI features, set `OPENAI_API_KEY` in the environment for `ApiAI` routes to proxy requests to OpenAI.
- `vite.config.js` is configured to proxy `/api`, `/socket.io`, and `/avatar` to `http://localhost:8080` during frontend development.

Want more?
- I can produce an OpenAPI/Swagger spec from this list, add sample request/response JSON for important endpoints, or add a `/__routes` endpoint that prints all registered Express routes at runtime. Tell me which you'd like next.

---
File last updated by automated docs update script.

Additional recently-added endpoints
-------------------------------
- `POST /api/messages/:id/react` — add reaction to a message. Body: `{ emoji, user_id }`.
- `POST /api/presence` — set presence (body: `{ user_id, status }`). Broadcasts `presence` socket event.
- `POST /api/typing` — typing indicator (body: `{ channel_id, user_id, typing }`). Broadcasts `typing` socket event to channel room.
- `POST /api/uploads` — direct multipart upload (form key: `file`). Files stored under `backend/public/uploads` and served at `/uploads/*`.


````


