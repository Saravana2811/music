Hosting the Music API and Audio - Deployment Checklist

This document describes how to host the backend API and make audio files available publicly for other sites (e.g., MoodWaves).

Goals
- Serve `/api/*` endpoints for playlists/songs.
- Serve audio files from a public location (either the backend static folder or a CDN/S3).
- Ensure CORS and HTTPS are configured so other sites can fetch audio and call the API.

Options
1) Host backend + audio together (quick, simpler)
   - Place audio files in `backend/public/audio/`.
   - Backend serves audio at `https://<your-host>/audio/<file>`.
   - Set `AUDIO_BASE_URL` to the public base URL if needed (e.g., `https://api.example.com/audio`).

2) Use object storage / CDN (recommended for scale)
   - Upload audio files to S3 (or similar) and serve via CloudFront or a CDN.
   - Set `AUDIO_BASE_URL` to the CDN base URL (e.g., `https://d123.cloudfront.net/audio`).

Steps - Local / quick deploy (backend + audio)
1. Copy audio files from the client to the backend folder (PowerShell):

```powershell
# from repo root (e:\Projects\music)
# create target folder
mkdir backend\public\audio -Force
# copy all mp3s from client public audio (adjust if needed)
Copy-Item -Path client\public\audio\*.mp3 -Destination backend\public\audio -Force
```

2. Install dependencies in `backend/` and start the server:

```powershell
cd backend
npm install
npm run dev  # or `npm start` for production
```

3. Verify:
- Visit `http://localhost:5000/api/songs` and ensure `audioUrl` fields are valid (they will be `/audio/<filename>` or full CDN path if `AUDIO_BASE_URL` set).
- Visit `http://localhost:5000/audio/<filename>.mp3` to verify static file serving.

Steps - Production with CDN (recommended for public consumption)
1. Upload audio files to S3 and configure a bucket policy / CDN.
2. Choose a base URL, e.g. `https://cdn.example.com/audio`.
3. Set the environment variable for the backend service:

- On Render / Railway / Heroku / Vercel set `AUDIO_BASE_URL=https://cdn.example.com/audio`

4. Deploy the backend (Render / Railway / Fly / Heroku / DigitalOcean App Platform).
- Make sure `PORT` (e.g., 5000) is respected by the platform environment.
- Ensure CORS is allowed from your frontend domain (the API currently allows all origins via `cors()` but you can lock it down in `server.js`).

CORS and HTTPS notes
- In `backend/server.js` we enable CORS. For production, restrict origins to trusted domains:

```js
// Example to restrict
app.use(cors({ origin: ["https://your-frontend.com", "https://moodwaves.example"] }));
```

- Always use HTTPS for public audio/CDN to avoid mixed-content blocking on secure pages.

Environment variables
- `AUDIO_BASE_URL` — (optional) base URL for audio. If not set, backend will serve relative `/audio/<file>`.

Troubleshooting
- If audio 404s: confirm files exist in `backend/public/audio` or that CDN paths are correct.
- If cross-origin blocked: double-check CORS settings and that audio responses include `Access-Control-Allow-Origin` header (the backend sets this when using `cors()`).

If you want, I can:
- Add a `Dockerfile` for the backend to deploy on container platforms.
- Create a simple GitHub Actions workflow to build and deploy to Render.
- Upload the existing `client/public/audio` files into `backend/public/audio` for you.

---
Created by assistant to help deploy the Music API and audio resources.
