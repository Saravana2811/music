// src/data/dummy.js  (for MW client mock data)

export const playlists = [
  {
    id: "chill-vibes",
    name: "Comfy and Smoothy",
    description: "Relax and focus with soft beats that you can enjoy.",
    mood: "chill",
    coverImageUrl: "",
    songs: [
      {
        id: "song-1",
        title: "I Am The Danger(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        duration: "3:25",
        audioUrl: "/audio/i-am-the-danger.mp3",
      },
      {
        id: "song-2",
        title: "Enjaami Thandhaane(From 'Idly Kadai')",
        artist: "City Lights",
        duration: "2:58",
        audioUrl: "/audio/enjaami.mp3",
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
        id: "song-2a",
        title: "Chikitu(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        duration: "3:10",
        audioUrl: "/audio/Chikitu.mp3",
      },
      {
        id: "song-3",
        title: "Mobsta(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        duration: "3:10",
        audioUrl: "/audio/Mobsta.mp3",
      },
      {
        id: "song-4",
        title: "Oorum Blood",
        artist: "Sai Abhyankkar",
        duration: "3:45",
        audioUrl: "/audio/Oorum-Blood.mp3",
      },
    ],
  },
  {
    id: "indian-hits",
    name: "Tamil Vibes",
    description: "A selection of popular and classic Indian tracks.",
    mood: "indian",
    coverImageUrl: "",
    songs: [
      {
        id: "song-5",
        title: "Singari",
        artist: "Sai Abhyankkar",
        duration: "4:22",
        audioUrl: "/audio/Singari.mp3",
      },
      {
        id: "song-6",
        title: "Nallaru Po",
        artist: "Sai Abhyankkar",
        duration: "3:45",
        audioUrl: "/audio/Nallaru-Po.mp3",
      },
      {
        id: "song-7",
        title: "Eppadi Vandhaayo(From 'Aaromaley')",
        artist: "Chimayi",
        duration: "5:02",
        audioUrl: "/audio/Eppadi-Vandhaayo.mp3",
      },
      {
        id: "song-8",
        title: "Vazhithunaiye(From 'Dragon')",
        artist: "Sid Sriram",
        duration: "4:08",
        audioUrl: "/audio/Vazhithunaiye.mp3",
      },
      {
        id: "song-9",
        title: "Beer Song(From 'Disel')",
        artist: "Dhibu Ninan Thomas",
        duration: "3:12",
        audioUrl: "/audio/Beer-Song.mp3",
      },
      {
        id: "song-17",
        title: "Rise Of Dragon(From 'Dragon')",
        artist: "Leon James",
        duration: "3:08",
        audioUrl: "/audio/Rise-Of-Dragon.mp3",
      },
      {
        id: "song-19",
        title: "Thalapathy Katcheri",
        artist: "Anirudh Ravichandran",
        duration: "3:12",
        audioUrl: "/audio/thalapathy.mp3",
      },
      {
        id: "song-20",
        title: "Power House(From 'Coolie')",
        artist: "Anirudh Ravichandran",
        duration: "3:08",
        audioUrl: "/audio/Powerhouse.mp3",
      },
      {
        id: "song-10",
        title: "Thennaadu(From 'Bison')",
        artist: "Roop Kumar Rathod",
        duration: "4:30",
        audioUrl: "/audio/Thennaadu.mp3",
      },
    ],
  },
];

export function getAllSongs() {
  const all = [];
  playlists.forEach((pl) => {
    pl.songs.forEach((song) => {
      const full = song.audioUrl; // frontend doesn’t need full origin here
      all.push({
        ...song,
        audioUrl: full,
        url: full, // alias, matching backend format
        playlistId: pl.id,
        playlistName: pl.name,
        mood: pl.mood,
      });
    });
  });
  return all;
}
