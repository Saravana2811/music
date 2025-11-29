import React from "react";
import { playlists } from "../data/dummyData";
import PlaylistCard from "../components/PlaylistCard";

function Playlists() {
  return (
    <div>
      <h1 className="page-title">All Playlists</h1>
      <div className="grid grid-4 hide-h-scroll">
        {playlists.map((p) => (
          <PlaylistCard key={p.id} playlist={p} />
        ))}
      </div>
    </div>
  );
}

export default Playlists;
