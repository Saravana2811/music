import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AudioPlayer from "./components/AudioPlayer";
import AllSongs from "./pages/AllSongs";

import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:artist" element={<ArtistDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
      </div>
      <AudioPlayer />
    </div>
  );
}

export default App;
