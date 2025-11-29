import React, { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";

function AudioPlayer() {
  const {
    audioRef,
    currentSong,
    isPlaying,
    volume,
    togglePlayPause,
    playNext,
    playPrev,
    setPlayerVolume,
  } = usePlayer();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    setAudioError(null);

    if (currentSong && isPlaying) {
      // log and surface play errors for debugging
      console.debug("Attempting to play:", currentSong && currentSong.audioUrl);
      audio.play().catch((err) => {
        console.error("Audio play failed:", err);
        setAudioError("Unable to play audio. See console for details.");
      });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying, volume, audioRef]);

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
  }

  function handleEnded() {
    playNext();
  }

  function handleAudioError() {
    setAudioError("Audio failed to load. Check file URL or network.");
  }

  if (!currentSong) {
    return (
      <footer className="audio-player">
        <div className="audio-info">
          <div className="audio-info-title">No song playing</div>
          <div className="audio-info-artist">Select a song to start</div>
        </div>
        <audio ref={audioRef} hidden />
      </footer>
    );
  }

  return (
    <footer className="audio-player">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleAudioError}
        hidden
      />
      <div className="audio-info">
        <div className="audio-info-title">{currentSong.title}</div>
        <div className="audio-info-artist">{currentSong.artist}</div>
      </div>

      {audioError && (
        <div style={{ color: "#f87171", marginLeft: 12 }}>{audioError}</div>
      )}

      <div className="audio-controls">
        <button className="icon-button" onClick={playPrev}>
          ⏮
        </button>
        <button className="icon-button" onClick={togglePlayPause}>
          {isPlaying ? "⏸" : "▶️"}
        </button>
        <button className="icon-button" onClick={playNext}>
          ⏭
        </button>
      </div>

      <div className="audio-controls">
        <input
          className="audio-slider"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
        />
      </div>

      <div className="audio-controls">
        <span style={{ fontSize: 12 }}>🔊</span>
        <input
          className="audio-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setPlayerVolume(Number(e.target.value))}
        />
      </div>
    </footer>
  );
}

export default AudioPlayer;
