import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongCard from "../components/SongCard";
import SongCardGrid from "../components/SongCardGrid";
import { playlists as localPlaylists } from "../data/dummyData";

function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    fetch(`${API_BASE}/api/playlists/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Playlist API error");
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          setPlaylist(data);
          setLoading(false);
        }
      })
      .catch(() => {
        // Fallback to client-side data if backend is unavailable
        const local = localPlaylists.find((p) => p.id === id) || null;
        if (mounted) {
          setPlaylist(local);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div>Loading playlist...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found.</div>;
  }

  const queue = playlist.songs || [];

  return (
    <div>
      <h1 className="page-title">{playlist.name}</h1>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>
        {playlist.description} • Mood: {playlist.mood} • {playlist.songs.length} songs
      </p>

      <div style={{ marginTop: 12 }}>
        {/* reuse SongCardGrid in grid layout for playlist details */}
        <SongCardGrid songs={playlist.songs} layout="grid" />
      </div>
    </div>
  );
}

export default PlaylistDetail;
