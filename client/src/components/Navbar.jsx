import React from "react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  "nav-link" + (isActive ? " active" : "");

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-logo">MoodWaves Music</div>
      <nav className="nav-links">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/playlists" className={linkClass}>
          Playlists
        </NavLink>
        <NavLink to="/artists" className={linkClass}>
          Artists
        </NavLink>
        <NavLink to="/search" className={linkClass}>
          Search
        </NavLink>
        <NavLink to="/library" className={linkClass}>
          Library
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
