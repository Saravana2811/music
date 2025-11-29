// backend/routes/playlists.js
const express = require("express");
const router = express.Router();

// Import safely in case module shape changes
const data = require("../data/musicData");
const playlists = data.playlists || [];
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
    // If it returns a Promise, await it
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

// GET /api/playlists -> list of playlists (with song counts)
router.get("/", async (req, res) => {
  try {
    const allSongs = await safeGetAllSongs(req);

    const simple = playlists.map((pl) => ({
      id: pl.id,
      name: pl.name,
      description: pl.description,
      mood: pl.mood,
      coverImageUrl: pl.coverImageUrl,
      songCount: allSongs.filter((s) => s.playlistId === pl.id).length,
    }));

    res.json(simple);
  } catch (err) {
    console.error("Error in GET /api/playlists:", err);
    res.status(500).json({ message: "Failed to load playlists" });
  }
});

// GET /api/playlists/:id -> single playlist with songs (using full audio URLs)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const base = playlists.find((p) => p.id === id);
    if (!base) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const allSongs = await safeGetAllSongs(req);
    const songs = allSongs.filter((s) => s.playlistId === id);

    const payload = {
      id: base.id,
      name: base.name,
      description: base.description,
      mood: base.mood,
      coverImageUrl: base.coverImageUrl,
      songs, // songs already have full audioUrl + url from getAllSongs
    };

    res.json(payload);
  } catch (err) {
    console.error("Error in GET /api/playlists/:id:", err);
    res.status(500).json({ message: "Failed to load playlist" });
  }
});

module.exports = router;
