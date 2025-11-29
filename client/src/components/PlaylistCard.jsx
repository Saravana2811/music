import React from "react";
import { Link } from "react-router-dom";

function PlaylistCard({ playlist }) {
  return (
    <div className="card">
      <div className="card-title">{playlist.name}</div>
      <div className="card-subtitle">
        {playlist.description || "Playlist description"}
      </div>
      
      <Link to={`/playlists/${playlist.id}`}>
        <button className="button">Open Playlist</button>
      </Link>
    </div>
  );
}

export default PlaylistCard;
