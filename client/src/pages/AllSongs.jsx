// frontend/src/pages/AllSongs.jsx
import React, { useMemo } from "react";
import { usePlayer } from "../context/PlayerContext";
import SongCardGrid from "../components/SongCardGrid";

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function AllSongs() {
  const { allSongs, loadingSongs, songsError } = usePlayer();

  const sections = useMemo(() => {
    if (!allSongs || allSongs.length === 0) return { random: [], byPlaylist: {} };

    // Random Picks (6)
    const random = shuffleArray(allSongs).slice(0, 6);

    // Group by playlistName and shuffle each group
    const byPlaylist = allSongs.reduce((acc, s) => {
      const key = s.playlistName || "Other";
      acc[key] = acc[key] || [];
      acc[key].push(s);
      return acc;
    }, {});

    Object.keys(byPlaylist).forEach((k) => {
      byPlaylist[k] = shuffleArray(byPlaylist[k]);
    });

    return { random, byPlaylist };
  }, [allSongs]);

  if (loadingSongs) return <div>Loading songs...</div>;
  if (songsError) return <div>Error loading songs.</div>;
  if (!allSongs || allSongs.length === 0) return <div>No songs found.</div>;

  return (
    <div>
      <h1 className="page-title">All Songs</h1>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>
        Browse music by section — click a card to play.
      </p>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>Random Picks</h2>
        <SongCardGrid songs={sections.random} layout="grid" />
      </section>

      {Object.entries(sections.byPlaylist).map(([playlistName, songs]) => (
          <section key={playlistName} style={{ marginTop: 28 }}>
            <h2 style={{ color: "#fff", marginBottom: 8 }}>{playlistName}</h2>
            <SongCardGrid songs={songs} layout="grid" />
          </section>
        ))}
    </div>
  );
}

export default AllSongs;
