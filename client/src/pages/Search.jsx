import React, { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { playSong } = usePlayer();

  useEffect(() => {
    // Don't search for very small queries
    if (query.trim().length < 2) {
      setResults([]);
      setError("");
      setIsLoading(false);
      return;
    }

    let ignore = false; // to ignore outdated responses
    setIsLoading(true);
    setError("");

    const controller = new AbortController();

    async function fetchResults() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/songs/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        if (!ignore) {
          setResults(data);
        }
      } catch (err) {
        if (err.name === "AbortError") return; // ignore aborted
        if (!ignore) {
          console.error(err);
          setError("Something went wrong while searching. Try again.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchResults();

    // Cleanup if query changes quickly
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <h1 className="page-title">Search</h1>
      <input
        className="search-input"
        placeholder="Search by title, artist, mood, playlist..."
        value={query}
        onChange={handleChange}
      />

      {/* Helper text */}
      {query.trim().length === 0 && (
        <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
          Type at least 2 characters to search.
        </p>
      )}

      {isLoading && (
        <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 8 }}>
          Searching...
        </p>
      )}

      {error && (
        <p style={{ fontSize: 14, color: "#fca5a5", marginTop: 8 }}>
          {error}
        </p>
      )}

      {!isLoading && query.trim().length >= 2 && !error && (
        <>
          <h2 className="section-title">
            Results ({results.length})
          </h2>
          {results.length === 0 ? (
            <p style={{ fontSize: 14, color: "#9ca3af" }}>
              No songs found for "{query}".
            </p>
          ) : (
            <table className="song-list">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Playlist</th>
                  <th>Mood</th>
                </tr>
              </thead>
              <tbody>
                {results.map((song) => (
                  <tr key={song.id}>
                    <td
                      className="song-title"
                      onClick={() => playSong(song, results)}
                    >
                      {song.title}
                    </td>
                    <td>{song.artist}</td>
                    <td>{song.playlistName}</td>
                    <td>{song.mood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Search;
