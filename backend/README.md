Spotify backend

This small Express server implements:
- Authorization Code redirect (`/auth/spotify`)
- Callback to exchange code for tokens (`/auth/spotify/callback`)
- Fetch all saved tracks for a user (`/api/spotify/saved-tracks`) — requires an access token
- Public search using client credentials (`/api/spotify/search?q=...`)

Setup

1. Copy `.env.example` to `.env` and fill `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
2. Register a Spotify app at https://developer.spotify.com/dashboard and set the Redirect URI to `http://localhost:4000/auth/spotify/callback` (or your chosen URL).
3. Install dependencies and run:

```powershell
cd backend
npm install
npm run dev
```

Usage

- Open `http://localhost:4000/auth/spotify` in a browser to log in and authorize. That endpoint will redirect and return the token JSON.
- With the returned `access_token`, call the saved-tracks endpoint:

```
GET http://localhost:4000/api/spotify/saved-tracks
Authorization: Bearer <access_token>
```

- To search public tracks (no user login):

```
GET http://localhost:4000/api/spotify/search?q=beatles
```

Security note: This example returns tokens directly in responses for simplicity. For production, store tokens in secure sessions or database and never expose `client_secret` to the frontend.
