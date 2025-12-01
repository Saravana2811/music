// backend/data/musicData.js

const fs = require("fs");
const path = require("path");
const mm = require("music-metadata");

const playlists = [
  {
    id: "chill-vibes",
    name: "Comfy and Smoothy(Love)",
    description: "Relax and focus with soft beats that you can enjoy.",
    mood: "chill",
    coverImageUrl: "",
    songs: [
      {
        id: "song-1",
        title: "Vilambara Idaiveli(From 'Imaikkaa Nodigal')",
        artist: "Niva K Prasaana",
        audioUrl: "/audio/Vilambara-Idaiveli.mp3",
      },
      {
        id: "song-2",
        title: "Vazhithunaiye(From 'Dragon')",
        artist: "Sid Sriram",
        audioUrl: "/audio/Vazhithunaiye.mp3",
      },
      {
        id: "song-3",
        title: "Singari(From 'Dude')",
        artist: "Sai Abhyankkar",
        audioUrl: "/audio/Singari.mp3",

      },
      {
        id: "song-4",
        title: "Eppadi Vandhaayo(From 'Aaromaley')",
        artist: "Siddu Kumar",
        audioUrl: "/audio/Eppadi-Vandhaayo.mp3",
      },
      {
        id: "song-5",
        title: "Beer Song(From 'Disel')",
        artist: "Dhibhu N Thomas",
        audioUrl: "/audio/Beer-Song.mp3",
      },
      {
        id: "song-6",
        title: "Neeyum Naanum(From 'Imaikkaa Nodigal')",
        artist: "Hiphop Tamizha",
        audioUrl: "/audio/Neeyum-Naanum.mp3",
      },
    ],
  },
  {
    id: "happy-energy",
    name: "Cheerful",
    description: "Boost your mood with upbeat tracks.",
    mood: "happy",
    coverImageUrl: "",
    songs: [
      {
        id: "song-2",
        title: "Chikitu(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        duration: "3:10",
        audioUrl: "/audio/Chikitu.mp3",
      },
      {
        id: "song-3",
        title: "Singari",
        artist: "Sai Abhyankkar",
        duration: "4:22",
        audioUrl: "/audio/Singari.mp3",
      },
      {
        id:"song-6",
        title: "I Am The Danger(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        audioUrl: "/audio/I-Am-The-Danger.mp3",
      },
      {
        id: "song-4",
        title: "Oorum Blood",
        artist: "Sai Abhyankkar",
        duration: "3:45",
        audioUrl: "/audio/Oorum-Blood.mp3",
      },
      {
        id:"song-5",
        title: "Power House(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        duration: "3:08",
        audioUrl: "/audio/Powerhouse.mp3",
      },
      
    ],
  },
  {
    id: "indian-hits",
    name: "Alone in My Thoughts 🌙",
    description: "A quiet journey through late-night emotions.",
    
    coverImageUrl: "",
    songs: [
      {
        id: "song-5",
        title: "Yen Paattan Saami(From 'Idly Kadai')",
        artist: "G.V.Prakash Kumar",
        duration: "4:22",
        audioUrl: "/audio/Yen-Paattan-Saami-Varum.mp3",
      },
      {
        id: "song-6",
        title: "Nallaru Po(From 'Dude')",
        artist: "Sai Abhyankkar",
        audioUrl: "/audio/Nallaru-Po.mp3",
      },
      {
        id: "song-7",
        title: "Valiye Valiye(From 'Aaromaley')",
        artist: "Siddu Kumar",
        duration: "5:02",
        audioUrl: "/audio/Valiye-Valiye.mp3",
      },
      {
        id: "song-8",
        title: "Yendi Vittu Pone(From 'Dragon')",
        artist: "Leon James",
        audioUrl: "/audio/.Yendi-Vittump3"
      },
      {
        id: "song-9",
        title: "Kannukula(From 'Dude')",
        artist: "Sai Abhyankkar",
        audioUrl: "/audio/Kannukula.mp3",
      },
      {
        id: "song-17",
        title: "Chennikkallu(From 'Bison')",
        artist: "Niva K Prasaana",
        duration: "3:08",
        audioUrl: "/audio/Chennikkallu.mp3",
      },
      {
        id: "song-19",
        title: "Kadhal Oru Aagayam(From 'Imaikkaa Nodigal')",
        artist: "Hiphop Tamizha",
        audioUrl: "/audio/Kadhal-Oru-Aagayam.mp3",
      },
      {
        id: "song-20",
        title: "Thaensudare(From 'Lover')",
        artist: "Anirudh Ravichandran",
        duration: "3:08",
        audioUrl: "/audio/Thaensudare.mp3",
      },
      {
        id: "song-10",
        title: "Kadhalikathey(From 'Imaikkaa Nodigal')",
        artist: "Roop Kumar Rathod",
        duration: "4:30",
        audioUrl: "/audio/Kadhalikathey.mp3",
      },
    ],
  },
];

async function getAllSongs(req) {
  const AUDIO_BASE = process.env.AUDIO_BASE_URL || "/audio";

  function resolveAudioUrl(original) {
    if (!original) return original;

    // If already absolute HTTP(S), return as-is
    if (/^https?:\/\//i.test(original)) return original;

    // Extract filename from original (e.g., "/audio/Beer-Song.mp3") and encode it for URL safety
    const parts = original.split("/");
    const filenameRaw = parts[parts.length - 1];
    const filename = encodeURIComponent(filenameRaw);

    // If AUDIO_BASE is an absolute URL (CDN, etc.)
    if (/^https?:\/\//i.test(AUDIO_BASE)) {
      return `${AUDIO_BASE.replace(/\/$/, "")}/${filename}`;
    }

    // AUDIO_BASE is a path (like "/audio")
    const basePath = AUDIO_BASE.replace(/\/$/, "");

    // If we have a request, build full origin URL
    if (req) {
      const origin = `${req.protocol}://${req.get("host")}`;
      return `${origin}${basePath}/${filename}`;
    }

    // Fallback: path-only (mainly for internal use)
    return `${basePath}/${filename}`;
  }

  const all = [];
  const seenAudio = new Set();
  function sanitizeMeta(str) {
    if (!str || typeof str !== "string") return str;
    // Remove variants like "MassTamilan", "Mass Tamilan", "masstamilan.dev", case-insensitive
    let s = String(str);
    // remove common variants
    s = s.replace(/\bmass\s*tamilan(\.dev)?\b/gi, "");
    s = s.replace(/\bmasstamilan(\.dev)?\b/gi, "");
    // remove stray separators left behind (dash, colon, parentheses at ends)
    s = s.replace(/[\-–—:]+\s*$/g, "");
    s = s.replace(/\s{2,}/g, " ");
    return s.trim();
  }

  // 1) Songs defined inside playlists
  playlists.forEach((pl) => {
    pl.songs.forEach((song) => {
      // Track by raw filename (case-insensitive) to avoid duplicates when scanning folders
      const plParts = (song.audioUrl || "").split("/");
      const plFilenameRaw = plParts[plParts.length - 1] || "";
      if (plFilenameRaw) seenAudio.add(plFilenameRaw.toLowerCase());

      const fullUrl = resolveAudioUrl(song.audioUrl);
      all.push({
        ...song,
        title: sanitizeMeta(song.title),
        artist: sanitizeMeta(song.artist),
        audioUrl: fullUrl,
        url: fullUrl, // 🔑 alias for frontend players
        playlistId: pl.id,
        playlistName: pl.name,
        mood: pl.mood,
      });
    });
  });

  // 2) Add standalone audio files from public folders
  const candidates = [
    path.join(__dirname, "..", "public", "audio"),
    // if you also keep audio in client/public, keep this:
    path.join(__dirname, "..", "..", "client", "public", "audio"),
  ];
  // We'll asynchronously attempt to read metadata for files
  const fileEntries = [];

  for (const dir of candidates) {
    try {
      if (!fs.existsSync(dir)) continue;
      const files = fs
        .readdirSync(dir)
        .filter((f) => /\.(mp3|wav|ogg|m4a)$/i.test(f));

      for (const file of files) {
        // Skip if in playlist (by filename)
        if (seenAudio.has(file.toLowerCase())) continue;
        seenAudio.add(file.toLowerCase());

        const fullUrl = resolveAudioUrl(`/audio/${file}`);

        // Build absolute path to file if possible (for metadata reading)
        let absolutePath = path.join(dir, file);

        // Prepare a placeholder entry; we'll fill metadata where possible
        const entry = {
          id: `file-${file}`,
          title: sanitizeMeta(file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")).trim() || file,
          artist: "Unknown",
          duration: "",
          audioUrl: fullUrl,
          url: fullUrl,
          playlistId: null,
          playlistName: null,
          mood: null,
        };

        // Attempt to read metadata (non-blocking) for richer info
        fileEntries.push(
          (async () => {
            try {
              const meta = await mm.parseFile(absolutePath, { native: true });
              if (meta && meta.common) {
                if (meta.common.title) entry.title = sanitizeMeta(String(meta.common.title));
                if (meta.common.artist) entry.artist = sanitizeMeta(String(meta.common.artist));
              }
              if (meta && meta.format && typeof meta.format.duration === 'number') {
                // format duration as mm:ss
                const d = Math.round(meta.format.duration);
                const mmn = Math.floor(d / 60);
                const s = d % 60;
                entry.duration = `${mmn}:${s.toString().padStart(2, '0')}`;
              }
            } catch (err) {
              // ignore metadata read errors and keep placeholder values
            }
            return entry;
          })()
        );
      }
    } catch (e) {
      // ignore directory read errors
    }
  }

  // Wait for all metadata reads to finish and append to all
  const resolvedFiles = await Promise.all(fileEntries);
  for (const fe of resolvedFiles) all.push(fe);

  return all;
}

module.exports = {
  playlists,
  getAllSongs,
};
