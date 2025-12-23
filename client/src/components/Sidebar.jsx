import React from "react";
import { playlists } from "../data/dummyData";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        
      </div>

      <div className="sidebar-section">
        
        <ul className="playlist-list">
          {playlists.map((pl) => (
            <li key={pl.id} className="playlist-item">
              <Link to={`/playlists/${pl.id}`} className="playlist-link playlist-block">
                <img
                  src={pl.coverImageUrl || "/assets/playlist-placeholder.svg"}
                  alt={pl.name}
                  className="playlist-thumb"
                />
                <span className="playlist-name">{pl.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
