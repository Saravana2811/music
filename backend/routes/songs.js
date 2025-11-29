// backend/routes/songs.js
const express = require("express");
const router = express.Router();
const data = require("../data/musicData");
const getAllSongsFn = data.getAllSongs;

// Helper to safely get all songs as an array (supports sync or async)
async function safeGetAllSongs(req) {
  if (typeof getAllSongsFn !== "function") {
    console.error("getAllSongs is not a function. Got:", getAllSongsFn);
    return [];
  }

  let result;
  try {
    result = getAllSongsFn(req);
    if (result && typeof result.then === "function") {
      result = await result;
    }
  } catch (err) {
    console.error("Error calling getAllSongs:", err);
    return [];
  }

  if (!Array.isArray(result)) {
    console.error("getAllSongs did not return an array. Got:", result);
    return [];
  }

  return result;
}

// GET /api/songs -> all songs (flat list, full URLs)
router.get("/", async (req, res) => {
  try {
    const songs = await safeGetAllSongs(req);
    res.json(songs);
  } catch (err) {
    console.error("Error in /api/songs:", err);
    res.status(500).json({ message: "Failed to load songs" });
  }
});

// GET /api/songs/search?q=...
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase().trim();
    const allSongs = await safeGetAllSongs(req);

    if (!q) {
      return res.json([]);
    }

    const results = allSongs.filter((song) => {
      return (
        (song.title || "").toLowerCase().includes(q) ||
        (song.artist || "").toLowerCase().includes(q) ||
        (song.mood || "").toLowerCase().includes(q) ||
        (song.playlistName || "").toLowerCase().includes(q)
      );
    });

    res.json(results);
  } catch (err) {
    console.error("Error in /api/songs/search:", err);
    res.status(500).json({ message: "Failed to search songs" });
  }
});

module.exports = router;
