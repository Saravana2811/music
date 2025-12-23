// src/pages/Home.jsx  (or wherever your Home is placed)

import React, { useEffect, useMemo, useState } from "react";
import PlaylistCard from "../components/PlaylistCard";
import { usePlayer } from "../context/PlayerContext";
import SongCardGrid from "../components/SongCardGrid";

// Base URL for MW music backend
const API_BASE =
  import.meta.env.VITE_MUSIC_API_URL || "http://localhost:4000";

// Small helper for matching by keywords
function matchesAnyKeyword(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function Home() {
  const [playlists, setPlaylists] = useState([]);
  const { allSongs, loadingSongs } = usePlayer();

  // ─────────────────────────────────────────
  // Fetch playlists from MW backend
  // ─────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/api/playlists`)
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error("Error loading playlists:", err));
  }, []);

  // ─────────────────────────────────────────
  // Featured track – random from all songs
  // ─────────────────────────────────────────
  const featuredSong = useMemo(() => {
    if (!allSongs || allSongs.length === 0) return null;
    const idx = Math.floor(Math.random() * allSongs.length);
    return allSongs[idx];
  }, [allSongs]);

  // ─────────────────────────────────────────
  // Recently added – last few songs
  // ─────────────────────────────────────────
  const recentlyAdded = useMemo(() => {
    if (!allSongs || allSongs.length === 0) return [];
    // last 8, newest first
    return [...allSongs].slice(-8).reverse();
  }, [allSongs]);

  // ─────────────────────────────────────────
  // Instant Shuffle Mix – random 12 songs
  // ─────────────────────────────────────────
  const shuffleMix = useMemo(() => {
    if (!allSongs || allSongs.length === 0) return [];
    const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  }, [allSongs]);

  // ─────────────────────────────────────────
  // Group songs by mood / keywords
  // Works even if backend doesn’t send mood field
  // ─────────────────────────────────────────
  const moodSections = useMemo(() => {
    const res = {
      feelGood: [],
      chill: [],
      sad: [],
      indian: [],
    };
    if (!allSongs) return res;

    allSongs.forEach((song) => {
      const mood = (song.mood || "").toLowerCase();
      const title = song.title || "";
      const meta = `${title} ${(song.playlistName || "")} ${(song.fileName || "")}`;

      // Feel-Good / Energetic
      if (
        mood.includes("happy") ||
        matchesAnyKeyword(meta, ["happy", "party", "energy", "power", "katcheri", "coolie"])
      ) {
        res.feelGood.push(song);
      }

      // Chill / Relax
      if (
        mood.includes("chill") ||
        matchesAnyKeyword(meta, ["chill", "calm", "love", "romantic", "lofi", "melody", "aaromaley"])
      ) {
        res.chill.push(song);
      }

      // Sad / Emotional
      if (
        mood.includes("sad") ||
        matchesAnyKeyword(meta, ["sad", "pain", "heart", "break", "cry"])
      ) {
        res.sad.push(song);
      }

      // Tamil / Indian
      if (
        mood.includes("indian") ||
        matchesAnyKeyword(meta, [
          "tamil",
          "telugu",
          "hindi",
          "malayalam",
          "kannada",
          "india",
        ])
      ) {
        res.indian.push(song);
      }
    });

    return res;
  }, [allSongs]);

  return (
    <div className="home-page" style={{ padding: "20px" }}>
      <h1 className="page-title" style={{ color: "#fff", marginBottom: 16 }}>
        MW Music Library 🎧
      </h1>

      {/* ───────── FEATURED TRACK ───────── */}
      {featuredSong && (
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 32,
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <div
            style={{
              flex: "1 1 220px",
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ color: "#e5e7eb", marginBottom: 6 }}>Featured Track</h2>
            <h3 style={{ color: "#fff", margin: 0 }}>{featuredSong.title}</h3>
            <p style={{ color: "#9ca3af", margin: "8px 0 16px 0" }}>
              {featuredSong.artist || "Unknown Artist"}
            </p>
            <audio
              controls
              style={{ width: "100%", maxWidth: 320 }}
              src={featuredSong.audioUrl || featuredSong.url}
            />
          </div>

          <div
            style={{
              flex: "1 1 220px",
              minWidth: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            <div>
              <p style={{ marginBottom: 8 }}>
                This track is randomly picked from your library. Add more MP3
                files to <code>/public/audio</code> and they’ll appear here
                automatically.
              </p>
              {featuredSong.mood && (
                <p style={{ fontStyle: "italic", opacity: 0.8 }}>
                  Mood: {featuredSong.mood}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ───────── RECENTLY ADDED ───────── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>🆕 Recently Added</h2>
        {loadingSongs ? (
          <div>Loading songs...</div>
        ) : (
          <SongCardGrid songs={recentlyAdded} />
        )}
      </section>

      {/* ───────── INSTANT SHUFFLE MIX ───────── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>🔀 Instant Shuffle Mix</h2>
        {loadingSongs ? (
          <div>Loading songs...</div>
        ) : (
          <SongCardGrid songs={shuffleMix} />
        )}
      </section>

      {/* ───────── MOOD COLLECTIONS ───────── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>🎭 Mood Collections</h2>

        {/* Feel-Good */}
        {moodSections.feelGood.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: "#fbbf24", marginBottom: 6 }}>
              😄 Feel-Good & Energetic
            </h3>
            <SongCardGrid songs={moodSections.feelGood} />
          </div>
        )}

        {/* Chill */}
        {moodSections.chill.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: "#22c55e", marginBottom: 6 }}>
              🌙 Chill & Relax / Study Mode
            </h3>
            <SongCardGrid songs={moodSections.chill} />
          </div>
        )}

        {/* Sad */}
        {moodSections.sad.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: "#a855f7", marginBottom: 6 }}>
              🌧️ Sad & Emotional Tracks
            </h3>
            <SongCardGrid songs={moodSections.sad} />
          </div>
        )}

        {/* Indian / Tamil */}
        {moodSections.indian.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: "#38bdf8", marginBottom: 6 }}>
              🇮🇳 Tamil / Indian Vibes
            </h3>
            <SongCardGrid songs={moodSections.indian} />
          </div>
        )}
      </section>

      {/* ───────── ALL SONGS ───────── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>🎵 All Songs</h2>
        {loadingSongs ? (
          <div>Loading songs...</div>
        ) : (
          <SongCardGrid songs={allSongs || []} />
        )}
      </section>

      {/* ───────── PLAYLISTS ───────── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>📁 Playlists</h2>
        <div
          className="grid grid-4 hide-h-scroll"
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
