# Backend (JSON-file DB + Realtime)

Backend menggunakan file JSON lokal (di `backend/data/`) untuk menyimpan data dan menyediakan API REST + realtime via Socket.IO.

Ringkasan fitur utama
- Auth (email/password) dengan JWT
- CRUD untuk communities
- Servers / Channels (turunan dari channels)
- Messages yang dipersist dan realtime via Socket.IO
- Bot management, Discord/YouTube mock endpoints, dan beberapa helper endpoints (stats, search, summaries)

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

Catatan: ini adalah backend file-based sederhana untuk pengembangan. Untuk produksi gunakan DB nyata dan simpan `JWT_SECRET` dengan aman.

---

Daftar lengkap route/API dan fungsinya

Format setiap item: `HTTP_VERB PATH` — Singkat: fungsi, Body (jika ada), Response singkat.

**Health & Static**
- GET `/health` — Health check server. Response: `{ status: 'ok' }`.
- GET `/api/health` — Alias kompatibilitas untuk frontend.
- GET `/data/*` — Static serve dari folder `../public/data` (frontend public data) — file statis.
- GET `/avatar/*` — Static serve avatar dari `backend/public/avatar`.
- GET `/api/static/*` — Serve JSON atau file statis dari beberapa lokasi di frontend (`public/data/*` atau `src/data/*`).

**AUTH / Profiles**
- POST `/api/auth/signup` — Daftar user baru. Body: `{ email, password, username? }`. Membuat record user, per-user profile file, mengembalikan `{ user, token }` (JWT).
- POST `/api/auth/signin` — Login. Body: `{ email, password }`. Response: `{ user, token }` jika sukses.
- GET `/api/auth/me` — Ambil info user saat ini berdasarkan header `Authorization: Bearer <token>`. Response: `{ id, email, username, role }`.
- PUT `/api/profiles/:id` — Update profil publik user (tidak untuk password). Body: fields yang diizinkan (mis. `username`, `avatar_url`, `display_name`, `description`). Response: profil yang diperbarui.

**COMMUNITIES**
- GET `/api/communities` — List semua communities, terbaru dulu. Response: array community.
- GET `/api/communities/:id` — Ambil community spesifik.
- POST `/api/communities` — Buat community baru. Body: payload community. Response: item baru.
- PUT `/api/communities/:id` — Update community. Body: fields. Response: item yang diperbarui.
- DELETE `/api/communities/:id` — Hapus community.
- POST `/api/communities/:id/members` — Tambah member ke community. Body: `{ user_id }`. Response: `{ id, members }`.
- DELETE `/api/communities/:id/members/:userId` — Hapus member dari community. Response: `{ id, members }`.

**SERVERS / CHANNELS**
- GET `/api/servers` — Derived list of servers (dibuat dari `channels.server_id` atau store terpisah). Response: array server-like objek.
- GET `/api/channels` — List channels. Optional query `server_id` untuk filter. Response: array channel.
- POST `/api/channels` — Buat channel baru. Body: `{ server_id, name, position, ... }`. Response: channel baru.
- POST `/api/channels/:id/rename` — Rename channel. Body: `{ name }`. Response: channel yang diupdate.

Subchannels
- POST `/api/channels/:id/subchannels` — Tambah subchannel ke channel parent. Body: `{ name, position? }`. Response: subchannel baru.
- DELETE `/api/channels/:id/subchannels/:subId` — Hapus subchannel dari parent channel.
- POST `/api/channels/:id/subchannels/:subId/rename` — Rename subchannel.

**MESSAGES (persisted + realtime)**
- GET `/api/messages` — Ambil pesan. Optional query `channel_id` untuk per-channel (membaca file per-channel jika ada). Tanpa `channel_id` mengembalikan 200 pesan terakhir dari `messages.json`. Response: array pesan (setiap pesan dilengkapi `profiles` penulis jika tersedia).
- POST `/api/messages` — Buat pesan baru. Body: `{ channel_id, user_id, content }`. Menyimpan di `messages.json` dan juga di file per-channel jika tersedia. Mengirim event Socket.IO `message` ke room channel.
- PATCH `/api/messages/:id` — Edit pesan (text-only). Body: `{ content }`. Memperbarui `edited_at`.
- DELETE `/api/messages/:id` — Hapus pesan dari global store dan file per-channel jika ada.

Socket.IO realtime
- Socket server menerima events:
	- `join` — payload berisi `{ channel_id }` untuk bergabung ke room.
	- `leave` — keluar room.
	- `message` — payload mirip POST `/api/messages` untuk mengirim pesan realtime; server menyimpan & emit ke room.

**USERS & AVATAR**
- GET `/api/users` — List semua users (disanitasi). Optional query `q` untuk pencarian (username/email).
- GET `/api/users/:id` — Ambil public profile user (dari `data/users/:id.json`).
- POST `/api/users/:id/avatar` — Update avatar URL per user. Body: `{ avatar_url }`. Mengupdate per-user profile file bila ada, atau central users.json.
- GET `/api/users/:id/messages` — Ambil pesan-pesan yang dibuat user (global scan), max 200 terakhir.

**CHANNEL HELPERS / STATS**
- GET `/api/channels/:id/summary` — Ringkasan channel: `message_count`, `member_count` (distinct users), `last_message`.
- GET `/api/channels/active` — Top active channels by distinct users (query `limit` default 10). Response: array dengan `message_count`, `member_count`.
- GET `/api/channels/stats` — Stats untuk semua channels (opsional `server_id` filter). Mengembalikan `message_count` dan `member_count` untuk masing-masing.

**SEARCH, STATS & UTIL**
- GET `/api/search?q=...` — Pencarian site-wide sederhana di `communities`, `channels`, `users`. Response: `{ communities, channels, users }` (masing-masing array, dibatasi).
- GET `/api/stats` — Site-wide totals: `{ users, channels, communities, messages }`.

**ACCOUNT TIERS (Tingkatan Akun)**
- GET `/api/account-tiers` — List tiers.
- POST `/api/account-tiers` — Buat tier baru. Body: `{ name, ... }`.
- PUT `/api/account-tiers/:id` — Update tier.
- DELETE `/api/account-tiers/:id` — Hapus tier.

**BOTS**
- GET `/api/bots` — List semua bot records.
- POST `/api/bots` — Buat bot. Body: `{ username, display_name?, description? }`. Membuat user bertipe `bot`, per-user profile, dan bot record.
- DELETE `/api/bots/:id` — Hapus bot record + user + profile file.
- POST `/api/bots/:id/send` — Bot mengirim pesan ke channel. Body: `{ channel_id, content }`. Membuat pesan bertanda `bot: true`, menyimpan, emit via Socket.IO, dan mereturn pesan yang dilengkapi `profiles`.

**STREAMING / VIDEO (static JSON endpoints)**
- GET `/api/videos` — Serve static video list from `src/pages/streming/data` atau `public/data/streming`.
- GET `/api/shorts` — Serve static shorts list.
- GET `/api/streaming-users` — Serve static streaming users list.

**DISCORD-like endpoints (mock / helper)**
- GET `/api/discord/servers` — List discord servers (fallback: derive from channels).
- POST `/api/discord/servers` — Buat server mock.
- GET `/api/discord/servers/:id` — Ambil server.
- POST `/api/discord/servers/:id/invite` — Buat invite mock.
- GET `/api/discord/servers/:id/invites` — List invites.
- POST `/api/discord/roles` — Buat role.
- GET `/api/discord/roles` — List roles.
- POST `/api/discord/webhooks` — Buat webhook.
- GET `/api/discord/webhooks` — List webhooks.
- POST `/api/discord/webhooks/:id/send` — Simulasi kirim webhook: membuat pesan di channel dan emit via sockets.
- GET `/api/discord/presence/:userId` — Ambil presence user.
- POST `/api/discord/presence/:userId` — Set presence user (simple state store).

**YOUTUBE-like endpoints (mock / helper)**
- GET `/api/youtube/channels` — List YouTube channels (mock store).
- POST `/api/youtube/channels` — Buat channel mock.
- GET `/api/youtube/channels/:id` — Ambil channel.
- GET `/api/youtube/channels/:id/videos` — List videos for channel.
- POST `/api/youtube/videos` — Buat video.
- GET `/api/youtube/videos/:id` — Ambil video.
- POST `/api/youtube/videos/:id/comments` — Post comment untuk video.
- GET `/api/youtube/videos/:id/comments` — List comments.
- GET `/api/youtube/live` — List live streams (mock).
- GET `/api/youtube/analytics/channel/:id` — Simple aggregated analytics for a channel (mock).

---

Tips developer & integrasi frontend
- Untuk menggunakan backend sebagai data source dari frontend: set environment `VITE_USE_BACKEND_PROXY=true` pada sisi frontend dev env agar helper di frontend memakai endpoint backend.
- Tokens: JWT di-return saat signup/signin. Gunakan header `Authorization: Bearer <token>` untuk endpoint yang perlu otentikasi seperti `/api/auth/me`.

Lokasi data
- Semua data tersimpan di `backend/data/` (file JSON): `users.json`, `communities.json`, `channels.json`, `messages.json`, plus subfolders `messages/` dan `users/` untuk file per-item.

Perhatian
- Ini adalah backend berbasis file untuk development: tidak cocok untuk produksi dengan skala besar.
- Jika ingin fitur baru, tambahkan endpoint non-destruktif di `index.js` dan update dokumentasi di file ini.

Jika Anda ingin, saya bisa:
- Menambahkan contoh request/response JSON untuk beberapa route utama.
- Menambahkan OpenAPI/Swagger ringan berdasarkan struktur yang ada.

---
File ini diperbarui untuk mendokumentasikan semua route yang tersedia di `backend/index.js`.
