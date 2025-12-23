import React from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import SongCardGrid from "../components/SongCardGrid";

function ArtistDetail() {
  const { artist } = useParams();
  const decoded = decodeURIComponent(artist || "");
  const { allSongs, loadingSongs } = usePlayer();

  if (loadingSongs) return <div>Loading artist...</div>;

  const songs = allSongs.filter((s) => (s.artist || "").toString() === decoded);

  if (!songs || songs.length === 0) {
    return (
      <div>
        <h1 className="page-title">{decoded}</h1>
        <p style={{ fontSize: 14, color: "#9ca3af" }}>No songs found for this artist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{decoded}</h1>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>{songs.length} songs</p>

      <div style={{ marginTop: 12 }}>
        <SongCardGrid songs={songs} />
      </div>
    </div>
  );
}

export default ArtistDetail;
