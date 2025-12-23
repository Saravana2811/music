const fs = require('fs');
const path = require('path');

// Attempt to scan backend/public/audio first, then client/public/audio
const candidates = [
  path.join(__dirname, '..', 'public', 'audio'),
  path.join(__dirname, '..', '..', 'client', 'public', 'audio')
];

function cleanTitle(name) {
  // remove extension
  let s = name.replace(/\.[^.]+$/, '');
  // remove common noise tokens
  s = s.replace(/MassTamilan\.dev/gi, '');
  s = s.replace(/\(.*?\)/g, '');
  s = s.replace(/[-_]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  // capitalize first letters
  s = s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return s;
}

function findAudioDir() {
  for (const p of candidates) {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return p;
  }
  return null;
}

function generate() {
  const dir = findAudioDir();
  if (!dir) {
    console.error('No audio directory found in backend/public/audio or client/public/audio');
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter(f => /\.(mp3|wav|ogg|m4a)$/i.test(f));
  const songs = files.map((f, i) => {
    return {
      id: `auto-${i + 1}`,
      title: cleanTitle(f),
      artist: 'Unknown',
      duration: '',
      audioUrl: `/audio/${f}`
    };
  });

  const outPath = path.join(__dirname, '..', 'generatedSongs.json');
  fs.writeFileSync(outPath, JSON.stringify(songs, null, 2), 'utf8');
  console.log(`Found ${songs.length} audio files in: ${dir}`);
  console.log(`Wrote ${outPath} (importable JSON with basic song entries).`);
}

if (require.main === module) {
  generate();
}

module.exports = { generate };
