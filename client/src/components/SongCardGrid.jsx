import React from "react";
import { usePlayer } from "../context/PlayerContext";

function SongCardGrid({ songs, layout = "horizontal" }) {
  const { playSong } = usePlayer();

  if (!songs || songs.length === 0) {
    return <div>No songs to show.</div>;
  }

  // Two layout modes: 'horizontal' (scroll row) and 'grid' (rows & columns)
  if (layout === "grid") {
    return (
      <div className="song-grid">
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => playSong(song, songs)}
            className="song-card"
          >
            <div className="song-card-art">
              <img src={song.coverImageUrl || "/assets/placeholder.svg"} alt={song.title} />
            </div>
            <div className="song-card-meta">
              <div className="song-card-title">{song.title}</div>
              <div className="song-card-artist">{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default: horizontal scroll row (existing behavior)
  return (
    <div className="hide-scroll-outer">
      <div
        className="song-scroll-inner song-scroll"
        style={{
          display: "flex",
          gap: 12,
          padding: "8px 2px",
          WebkitOverflowScrolling: "touch",
          overflowX: "auto",
        }}
      >
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => playSong(song, songs)}
            style={{
              cursor: "pointer",
              background: "#0b1220",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 8,
              boxShadow: "0 1px 0 rgba(255,255,255,0.02)",
              minWidth: 180,
              width: 180,
              boxSizing: "border-box",
              flex: "0 0 180px",
            }}
          >
            <div
              style={{
                width: "100%",
                paddingBottom: "52%",
                position: "relative",
                overflow: "hidden",
                borderRadius: 6,
                background: "#0b0f14",
              }}
            >
              <img
                src={song.coverImageUrl || "/assets/placeholder.svg"}
                alt={song.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}>{song.title}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SongCardGrid;
