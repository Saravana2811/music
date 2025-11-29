// backend/server.js
// Load .env if available, but don't crash if `dotenv` isn't installed in this environment
try {
  require("dotenv").config();
} catch (e) {
  // dotenv is optional in many dev setups; ignore if missing
}

const express = require("express");
const cors = require("cors");
const path = require("path");

const playlistRoutes = require("./routes/playlists");
const songRoutes = require("./routes/songs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// You can restrict origins later if you want:
// app.use(cors({ origin: ["http://localhost:5173", "https://moodwaves.yourdomain.com"] }));
app.use(cors());
app.use(express.json());

// Serve audio files from backend/public/audio at the `/audio` route
app.use(
  "/audio",
  express.static(path.join(__dirname, "public", "audio"), {
    maxAge: "7d" // cache in production (optional)
  })
);

// Also serve audio from the client's public audio folder as a fallback (useful in development)
app.use(
  "/audio",
  express.static(path.join(__dirname, "..", "client", "public", "audio"), {
    maxAge: "7d"
  })
);

// Diagnostic: report which audio folders exist and how many files they contain
function logAudioFolders() {
  try {
    const candidates = [
      path.join(__dirname, "public", "audio"),
      path.join(__dirname, "..", "client", "public", "audio"),
    ];
    candidates.forEach((dir) => {
      try {
        if (!require("fs").existsSync(dir)) {
          console.log(`audio: folder not found -> ${dir}`);
          return;
        }
        const files = require("fs")
          .readdirSync(dir)
          .filter((f) => /\.(mp3|wav|ogg|m4a)$/i.test(f));
        console.log(`audio: ${dir} -> ${files.length} files (examples: ${files.slice(0,3).join(', ')})`);
      } catch (e) {
        console.log(`audio: error reading ${dir}: ${e.message}`);
      }
    });
  } catch (e) {
    // ignore
  }
}

// Simple health check
app.get("/", (req, res) => {
  res.json({ message: "Music API is running 🎵" });
});

// API routes
app.use("/api/playlists", playlistRoutes);
app.use("/api/songs", songRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Music API server listening on http://localhost:${PORT}`);
  logAudioFolders();
});

server.on('error', (err) => {
  console.error('Server failed to start:', err && err.message ? err.message : err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UnhandledRejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UncaughtException:', err && err.stack ? err.stack : err);
  process.exit(1);
});
