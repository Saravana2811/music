import React from "react";
import { usePlayer } from "../context/PlayerContext";

function SongCard({ song, queue }) {
  const { playSong } = usePlayer();

  return (
    <tr>
      <td
        className="song-title"
        onClick={() => playSong(song, queue)}
        title="Play song"
      >
        {song.title}
      </td>
      <td>{song.artist}</td>
    </tr>
  );
}

export default SongCard;
