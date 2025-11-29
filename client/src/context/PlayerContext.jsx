import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { getAllSongs as getLocalSongs } from "../data/dummyData";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [allSongs, setAllSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [songsError, setSongsError] = useState(null);

  useEffect(() => {
    // Fetch songs from backend API
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    const url = `${API_BASE}/api/songs`;
    setLoadingSongs(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAllSongs(data || []);
        setLoadingSongs(false);
      })
      .catch((err) => {
        console.error("Failed to load songs from API:", err);
        setSongsError(err);
        // Fallback to local dummy data so UI still shows songs during development
        try {
          const local = getLocalSongs();
          setAllSongs(local || []);
        } catch (e) {
          console.error("Failed to load local songs fallback:", e);
        }
        setLoadingSongs(false);
      });
  }, []);

  function playSong(song, newQueue = []) {
    setCurrentSong(song);
    if (newQueue.length > 0) {
      setQueue(newQueue);
    }
    setIsPlaying(true);
  }

  function togglePlayPause() {
    setIsPlaying((prev) => !prev);
  }

  function playNext() {
    if (!currentSong || queue.length === 0) return;
    const index = queue.findIndex((s) => s.id === currentSong.id);
    const next = queue[index + 1];
    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
    }
  }

  function playPrev() {
    if (!currentSong || queue.length === 0) return;
    const index = queue.findIndex((s) => s.id === currentSong.id);
    const prev = queue[index - 1];
    if (prev) {
      setCurrentSong(prev);
      setIsPlaying(true);
    }
  }

  function setPlayerVolume(v) {
    setVolume(v);
  }

  const value = {
    audioRef,
    currentSong,
    queue,
    isPlaying,
    volume,
    playSong,
    togglePlayPause,
    playNext,
    playPrev,
    setPlayerVolume,
    allSongs,
    loadingSongs,
    songsError,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
