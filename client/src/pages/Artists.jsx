import React from "react";
import { Link } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";

function Artists() {
  const { allSongs, loadingSongs } = usePlayer();

  if (loadingSongs) return <div>Loading artists...</div>;

  // Derive unique artist list from allSongs (no song details)
  const artistSet = new Set(allSongs.map((s) => s.artist || "Unknown"));
  const artistEntries = Array.from(artistSet).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <h1 className="page-title">Artists</h1>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>Browse artists in your library.</p>

      <div style={{ marginTop: 16 }}>
        {artistEntries.length === 0 && <div>No artists found.</div>}

        <div className="artist-grid">
          {artistEntries.map((artist) => {
            const avatar = "/assets/placeholder.svg";
            return (
              <Link to={`/artists/${encodeURIComponent(artist)}`} key={artist} style={{ textDecoration: "none" }}>
                <div className="artist-card">
                  <img src={avatar} alt={artist} className="artist-avatar" />
                  <div className="artist-name">{artist}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Artists;
