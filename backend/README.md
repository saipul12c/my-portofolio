# Backend (JSON-file DB + Realtime)

Backend kini menggunakan file JSON lokal (di `backend/data/`) untuk menyimpan semua data dan menyediakan API REST + realtime via Socket.IO.

Fitur utama:
- Auth (email/password) dengan JWT: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`, `/api/profiles/:id` (PUT)
- Communities CRUD: `/api/communities` (GET, POST), `/api/communities/:id` (GET, PUT, DELETE)
- Servers/Channels: `/api/servers`, `/api/channels` (GET, POST)
- Messages (persisted + realtime): `/api/messages` (GET, POST) and realtime via Socket.IO

Persyaratan:
- Node 16+

Menjalankan:

1. Masuk ke folder `backend`:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Salin `.env.example` ke `.env` lalu edit `JWT_SECRET` dan `ALLOWED_ORIGINS` jika perlu:

```powershell
copy .env.example .env
```

4. Jalankan server di mode development atau production:

```powershell
npm run dev    # requires nodemon
npm run start  # run normally
```

Server akan berjalan pada `http://localhost:8080` (atau port di `.env`).

Frontend: set `VITE_USE_BACKEND_PROXY=true` di environment (mis. `.env.local`) agar aplikasi frontend menggunakan backend JSON server untuk data dan auth.

Catatan: ini adalah backend file-based sederhana untuk pengembangan. Untuk produksi gunakan DB nyata dan simpan `JWT_SECRET` aman.
