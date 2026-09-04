// RhythmBox - Base de datos de canciones mock con metadatos completos y letras sincronizadas

// Función utilitaria para generar portadas vectoriales SVG de alta definición con estética cyber/futurista
function createCoverSvg(seed, title, primaryColor, secondaryColor, accentColor, patternType = "grid") {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    <defs>
      <linearGradient id="g_${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="50%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="${accentColor}"/>
      </linearGradient>
      <radialGradient id="r_${seed}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
      </radialGradient>
      <filter id="f_${seed}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="30" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <rect width="500" height="500" fill="#07090e"/>
    <rect width="500" height="500" fill="url(#g_${seed})" opacity="0.45"/>
    <circle cx="250" cy="250" r="180" fill="url(#r_${seed})" filter="url(#f_${seed})" opacity="0.6"/>
    ${patternType === "rings" ? `
      <circle cx="250" cy="250" r="140" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.6" stroke-dasharray="8 8"/>
      <circle cx="250" cy="250" r="90" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
      <circle cx="250" cy="250" r="40" fill="${secondaryColor}" opacity="0.9"/>
    ` : patternType === "wave" ? `
      <path d="M 50 250 Q 150 120 250 250 T 450 250" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M 50 280 Q 150 150 250 280 T 450 280" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
      <circle cx="250" cy="250" r="16" fill="${accentColor}"/>
    ` : patternType === "cube" ? `
      <polygon points="250,110 370,180 370,320 250,390 130,320 130,180" fill="none" stroke="${accentColor}" stroke-width="4" opacity="0.85"/>
      <polyline points="130,180 250,250 370,180" fill="none" stroke="${accentColor}" stroke-width="3" opacity="0.85"/>
      <line x1="250" y1="250" x2="250" y2="390" stroke="${accentColor}" stroke-width="3" opacity="0.85"/>
      <circle cx="250" cy="250" r="60" fill="${primaryColor}" opacity="0.6"/>
    ` : `
      <line x1="80" y1="120" x2="420" y2="120" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
      <line x1="80" y1="200" x2="420" y2="200" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
      <line x1="80" y1="280" x2="420" y2="280" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
      <line x1="80" y1="360" x2="420" y2="360" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
      <polygon points="250,130 350,340 150,340" fill="none" stroke="${accentColor}" stroke-width="5"/>
      <circle cx="250" cy="270" r="28" fill="${primaryColor}"/>
    `}
    <text x="40" y="450" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="28" fill="#ffffff" letter-spacing="1">${title.toUpperCase()}</text>
    <text x="40" y="475" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="${accentColor}" letter-spacing="2">RHYTHMBOX RECORDINGS</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const mockArtists = [
  {
    id: "art-1",
    name: "Kroma Horizon",
    bio: "Pionero del dream-synth y estética neo-cyberpunk. Fusiona sintetizadores analógicos vintage con ritmos cinéticos espaciales.",
    monthlyListeners: "1,420,800",
    avatar: createCoverSvg("art1", "Kroma Horizon", "#12002b", "#3a0ca3", "#4cc9f0", "rings"),
    banner: createCoverSvg("art1_b", "Kroma Horizon", "#12002b", "#3a0ca3", "#4cc9f0", "wave"),
    genres: ["Synthwave", "Cyberpunk", "Retrowave"],
    verified: true
  },
  {
    id: "art-2",
    name: "Aura Nebula",
    bio: "Productora y vocalista de neo-soul ambiental y future beats. Ganadora de premios de diseño sonoro y paisajes inmersivos.",
    monthlyListeners: "985,300",
    avatar: createCoverSvg("art2", "Aura Nebula", "#0d1b2a", "#1b4965", "#00f5d4", "cube"),
    banner: createCoverSvg("art2_b", "Aura Nebula", "#0d1b2a", "#1b4965", "#00f5d4", "rings"),
    genres: ["Chillwave", "Neo-Soul", "Ambient"],
    verified: true
  },
  {
    id: "art-3",
    name: "Voxel Drift",
    bio: "Colectivo sonoro de Shibuya y Berlín enfocado en lofi hip hop geométrico, ritmos sincopados y guitarras con delay flotante.",
    monthlyListeners: "2,150,400",
    avatar: createCoverSvg("art3", "Voxel Drift", "#1a001a", "#7209b7", "#f72585", "grid"),
    banner: createCoverSvg("art3_b", "Voxel Drift", "#1a001a", "#7209b7", "#f72585", "wave"),
    genres: ["Lo-Fi", "Chillhop", "Downtempo"],
    verified: true
  },
  {
    id: "art-4",
    name: "Pulse & Voltage",
    bio: "Dúo electrónico de bajos pesados, arpegios modulares y percusión industrial pulida inspirada en la arquitectura brutalista.",
    monthlyListeners: "830,100",
    avatar: createCoverSvg("art4", "Pulse & Voltage", "#001219", "#005f73", "#ee9b00", "wave"),
    banner: createCoverSvg("art4_b", "Pulse & Voltage", "#001219", "#005f73", "#ee9b00", "cube"),
    genres: ["Electro", "Bass", "Cyberpunk"],
    verified: false
  },
  {
    id: "art-5",
    name: "Celeste Echo",
    bio: "Compositora de música cinemática y sintetizadores celestiales con texturas etéreas para meditación y enfoque profundo.",
    monthlyListeners: "670,900",
    avatar: createCoverSvg("art5", "Celeste Echo", "#03071e", "#370617", "#ffba08", "rings"),
    banner: createCoverSvg("art5_b", "Celeste Echo", "#03071e", "#370617", "#ffba08", "grid"),
    genres: ["Cinematic", "Deep Focus", "Ambient"],
    verified: true
  }
];

export const mockAlbums = [
  {
    id: "alb-1",
    title: "Neon Odyssey 2099",
    artistId: "art-1",
    artistName: "Kroma Horizon",
    year: 2026,
    genre: "Synthwave",
    cover: createCoverSvg("alb1", "Neon Odyssey", "#0f051d", "#5c007a", "#00f2fe", "rings"),
    description: "Una expedición sónica a través de autopistas lumínicas y rascacielos sumergidos en niebla holográfica."
  },
  {
    id: "alb-2",
    title: "Subsurface Reverie",
    artistId: "art-2",
    artistName: "Aura Nebula",
    year: 2026,
    genre: "Chillwave",
    cover: createCoverSvg("alb2", "Subsurface", "#051622", "#1ba098", "#deb992", "wave"),
    description: "Paisajes etéreos que flotan entre el fondo del océano y la estratosfera cálida."
  },
  {
    id: "alb-3",
    title: "Midnight Tokyo Lo-Fi",
    artistId: "art-3",
    artistName: "Voxel Drift",
    year: 2025,
    genre: "Lo-Fi Beats",
    cover: createCoverSvg("alb3", "Midnight Tokyo", "#1b0a2a", "#8f1266", "#ff4d6d", "grid"),
    description: "Grabaciones de campo bajo lluvia templada combinadas con acordes Rhodes y ritmos relajantes."
  },
  {
    id: "alb-4",
    title: "Brutalist Frequencies",
    artistId: "art-4",
    artistName: "Pulse & Voltage",
    year: 2026,
    genre: "Electro Cyber",
    cover: createCoverSvg("alb4", "Brutalist Freq", "#0b0c10", "#1f2833", "#66fcf1", "cube"),
    description: "Estructuras sonoras monumentales, osciladores de onda cuadrada y percusión metálica quirúrgica."
  }
];

export const mockSongs = [
  {
    id: "song-1",
    title: "Midnight Velocity",
    artistId: "art-1",
    artist: "Kroma Horizon",
    albumId: "alb-1",
    album: "Neon Odyssey 2099",
    duration: 194, // 3:14
    year: 2026,
    genre: "Synthwave",
    bpm: 122,
    musicalKey: "D minor",
    audioMood: "synthwave",
    cover: createCoverSvg("s1", "Midnight Velocity", "#0b001a", "#480ca8", "#4cc9f0", "rings"),
    colors: { primary: "#0b001a", secondary: "#480ca8", accent: "#4cc9f0", glow: "rgba(76, 201, 240, 0.45)" },
    plays: 284500,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.0,
        text: "Neon lights reflecting on the chrome",
        words: [
          { word: "Neon", start: 2.0, end: 2.6 },
          { word: "lights", start: 2.6, end: 3.1 },
          { word: "reflecting", start: 3.1, end: 3.8 },
          { word: "on", start: 3.8, end: 4.1 },
          { word: "the", start: 4.1, end: 4.3 },
          { word: "chrome", start: 4.3, end: 5.0 }
        ]
      },
      {
        time: 6.2,
        text: "Speeding down the highway on my own",
        words: [
          { word: "Speeding", start: 6.2, end: 6.8 },
          { word: "down", start: 6.8, end: 7.2 },
          { word: "the", start: 7.2, end: 7.5 },
          { word: "highway", start: 7.5, end: 8.2 },
          { word: "on", start: 8.2, end: 8.5 },
          { word: "my", start: 8.5, end: 8.8 },
          { word: "own", start: 8.8, end: 9.6 }
        ]
      },
      {
        time: 11.0,
        text: "Midnight rain begins to wash the glass",
        words: [
          { word: "Midnight", start: 11.0, end: 11.6 },
          { word: "rain", start: 11.6, end: 12.1 },
          { word: "begins", start: 12.1, end: 12.7 },
          { word: "to", start: 12.7, end: 12.9 },
          { word: "wash", start: 12.9, end: 13.4 },
          { word: "the", start: 13.4, end: 13.7 },
          { word: "glass", start: 13.7, end: 14.5 }
        ]
      },
      {
        time: 15.5,
        text: "Shadows in the rearview fade and pass",
        words: [
          { word: "Shadows", start: 15.5, end: 16.2 },
          { word: "in", start: 16.2, end: 16.5 },
          { word: "the", start: 16.5, end: 16.8 },
          { word: "rearview", start: 16.8, end: 17.5 },
          { word: "fade", start: 17.5, end: 18.1 },
          { word: "and", start: 18.1, end: 18.4 },
          { word: "pass", start: 18.4, end: 19.3 }
        ]
      },
      {
        time: 20.8,
        text: "Feel the pulse inside the engine roar",
        words: [
          { word: "Feel", start: 20.8, end: 21.3 },
          { word: "the", start: 21.3, end: 21.6 },
          { word: "pulse", start: 21.6, end: 22.2 },
          { word: "inside", start: 22.2, end: 22.8 },
          { word: "the", start: 22.8, end: 23.0 },
          { word: "engine", start: 23.0, end: 23.7 },
          { word: "roar", start: 23.7, end: 24.6 }
        ]
      },
      {
        time: 25.5,
        text: "Leaving every phantom at the door",
        words: [
          { word: "Leaving", start: 25.5, end: 26.2 },
          { word: "every", start: 26.2, end: 26.8 },
          { word: "phantom", start: 26.8, end: 27.5 },
          { word: "at", start: 27.5, end: 27.8 },
          { word: "the", start: 27.8, end: 28.1 },
          { word: "door", start: 28.1, end: 29.2 }
        ]
      },
      {
        time: 30.5,
        text: "RhythmBox is burning through the dark",
        words: [
          { word: "RhythmBox", start: 30.5, end: 31.4 },
          { word: "is", start: 31.4, end: 31.7 },
          { word: "burning", start: 31.7, end: 32.4 },
          { word: "through", start: 32.4, end: 32.8 },
          { word: "the", start: 32.8, end: 33.1 },
          { word: "dark", start: 33.1, end: 34.2 }
        ]
      },
      {
        time: 35.8,
        text: "Every frequency ignite a spark",
        words: [
          { word: "Every", start: 35.8, end: 36.4 },
          { word: "frequency", start: 36.4, end: 37.3 },
          { word: "ignite", start: 37.3, end: 38.0 },
          { word: "a", start: 38.0, end: 38.2 },
          { word: "spark", start: 38.2, end: 39.5 }
        ]
      }
    ]
  },
  {
    id: "song-2",
    title: "Quantum Heartbeat",
    artistId: "art-1",
    artist: "Kroma Horizon",
    albumId: "alb-1",
    album: "Neon Odyssey 2099",
    duration: 215, // 3:35
    year: 2026,
    genre: "Synthwave",
    bpm: 118,
    musicalKey: "A minor",
    audioMood: "cyberpunk",
    cover: createCoverSvg("s2", "Quantum Heartbeat", "#160026", "#7209b7", "#f72585", "cube"),
    colors: { primary: "#160026", secondary: "#7209b7", accent: "#f72585", glow: "rgba(247, 37, 133, 0.45)" },
    plays: 198200,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 3.0,
        text: "Signals colliding in an empty space",
        words: [
          { word: "Signals", start: 3.0, end: 3.7 },
          { word: "colliding", start: 3.7, end: 4.4 },
          { word: "in", start: 4.4, end: 4.7 },
          { word: "an", start: 4.7, end: 4.9 },
          { word: "empty", start: 4.9, end: 5.5 },
          { word: "space", start: 5.5, end: 6.2 }
        ]
      },
      {
        time: 7.5,
        text: "Electric currents tracing out your face",
        words: [
          { word: "Electric", start: 7.5, end: 8.2 },
          { word: "currents", start: 8.2, end: 8.9 },
          { word: "tracing", start: 8.9, end: 9.6 },
          { word: "out", start: 9.6, end: 9.9 },
          { word: "your", start: 9.9, end: 10.2 },
          { word: "face", start: 10.2, end: 11.0 }
        ]
      },
      {
        time: 12.2,
        text: "We are the static in the radio wave",
        words: [
          { word: "We", start: 12.2, end: 12.6 },
          { word: "are", start: 12.6, end: 12.9 },
          { word: "the", start: 12.9, end: 13.2 },
          { word: "static", start: 13.2, end: 13.9 },
          { word: "in", start: 13.9, end: 14.2 },
          { word: "the", start: 14.2, end: 14.5 },
          { word: "radio", start: 14.5, end: 15.1 },
          { word: "wave", start: 15.1, end: 16.0 }
        ]
      },
      {
        time: 17.5,
        text: "A million frequencies we came to save",
        words: [
          { word: "A", start: 17.5, end: 17.7 },
          { word: "million", start: 17.7, end: 18.3 },
          { word: "frequencies", start: 18.3, end: 19.3 },
          { word: "we", start: 19.3, end: 19.6 },
          { word: "came", start: 19.6, end: 20.1 },
          { word: "to", start: 20.1, end: 20.4 },
          { word: "save", start: 20.4, end: 21.4 }
        ]
      }
    ]
  },
  {
    id: "song-3",
    title: "Hologram Sky",
    artistId: "art-1",
    artist: "Kroma Horizon",
    albumId: "alb-1",
    album: "Neon Odyssey 2099",
    duration: 188,
    year: 2026,
    genre: "Synthwave",
    bpm: 124,
    musicalKey: "F major",
    audioMood: "synthwave",
    cover: createCoverSvg("s3", "Hologram Sky", "#03045e", "#0077b6", "#00b4d8", "wave"),
    colors: { primary: "#03045e", secondary: "#0077b6", accent: "#00b4d8", glow: "rgba(0, 180, 216, 0.45)" },
    plays: 145000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.5,
        text: "Looking upward through the glass dome",
        words: [
          { word: "Looking", start: 2.5, end: 3.1 },
          { word: "upward", start: 3.1, end: 3.7 },
          { word: "through", start: 3.7, end: 4.1 },
          { word: "the", start: 4.1, end: 4.4 },
          { word: "glass", start: 4.4, end: 4.9 },
          { word: "dome", start: 4.9, end: 5.8 }
        ]
      },
      {
        time: 7.2,
        text: "Synthetic stars make this place feel like home",
        words: [
          { word: "Synthetic", start: 7.2, end: 8.0 },
          { word: "stars", start: 8.0, end: 8.6 },
          { word: "make", start: 8.6, end: 9.0 },
          { word: "this", start: 9.0, end: 9.3 },
          { word: "place", start: 9.3, end: 9.7 },
          { word: "feel", start: 9.7, end: 10.1 },
          { word: "like", start: 10.1, end: 10.4 },
          { word: "home", start: 10.4, end: 11.2 }
        ]
      }
    ]
  },
  {
    id: "song-4",
    title: "Subsurface Echoes",
    artistId: "art-2",
    artist: "Aura Nebula",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 228,
    year: 2026,
    genre: "Chillwave",
    bpm: 85,
    musicalKey: "C minor",
    audioMood: "chill",
    cover: createCoverSvg("s4", "Subsurface Echoes", "#011627", "#2ec4b6", "#e71d36", "wave"),
    colors: { primary: "#011627", secondary: "#2ec4b6", accent: "#2ec4b6", glow: "rgba(46, 196, 182, 0.45)" },
    plays: 312000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 3.5,
        text: "Deep beneath the ocean swell",
        words: [
          { word: "Deep", start: 3.5, end: 4.1 },
          { word: "beneath", start: 4.1, end: 4.8 },
          { word: "the", start: 4.8, end: 5.1 },
          { word: "ocean", start: 5.1, end: 5.8 },
          { word: "swell", start: 5.8, end: 6.8 }
        ]
      },
      {
        time: 8.0,
        text: "Stories only silent waters tell",
        words: [
          { word: "Stories", start: 8.0, end: 8.7 },
          { word: "only", start: 8.7, end: 9.2 },
          { word: "silent", start: 9.2, end: 9.9 },
          { word: "waters", start: 9.9, end: 10.6 },
          { word: "tell", start: 10.6, end: 11.6 }
        ]
      },
      {
        time: 13.2,
        text: "Drifting in a gentle coral maze",
        words: [
          { word: "Drifting", start: 13.2, end: 13.9 },
          { word: "in", start: 13.9, end: 14.2 },
          { word: "a", start: 14.2, end: 14.4 },
          { word: "gentle", start: 14.4, end: 15.1 },
          { word: "coral", start: 15.1, end: 15.7 },
          { word: "maze", start: 15.7, end: 16.7 }
        ]
      },
      {
        time: 18.0,
        text: "Lost inside a luminescent haze",
        words: [
          { word: "Lost", start: 18.0, end: 18.6 },
          { word: "inside", start: 18.6, end: 19.3 },
          { word: "a", start: 19.3, end: 19.5 },
          { word: "luminescent", start: 19.5, end: 20.6 },
          { word: "haze", start: 20.6, end: 21.8 }
        ]
      }
    ]
  },
  {
    id: "song-5",
    title: "Solar Winds",
    artistId: "art-2",
    artist: "Aura Nebula",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 204,
    year: 2026,
    genre: "Ambient",
    bpm: 78,
    musicalKey: "E minor",
    audioMood: "ambient",
    cover: createCoverSvg("s5", "Solar Winds", "#140152", "#22007c", "#ff9e00", "rings"),
    colors: { primary: "#140152", secondary: "#22007c", accent: "#ff9e00", glow: "rgba(255, 158, 0, 0.45)" },
    plays: 185000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 4.0,
        text: "Golden particles across the night",
        words: [
          { word: "Golden", start: 4.0, end: 4.7 },
          { word: "particles", start: 4.7, end: 5.6 },
          { word: "across", start: 5.6, end: 6.2 },
          { word: "the", start: 6.2, end: 6.5 },
          { word: "night", start: 6.5, end: 7.4 }
        ]
      },
      {
        time: 9.0,
        text: "Bathed in warm atmospheric light",
        words: [
          { word: "Bathed", start: 9.0, end: 9.6 },
          { word: "in", start: 9.6, end: 9.9 },
          { word: "warm", start: 9.9, end: 10.5 },
          { word: "atmospheric", start: 10.5, end: 11.6 },
          { word: "light", start: 11.6, end: 12.7 }
        ]
      }
    ]
  },
  {
    id: "song-6",
    title: "Raindrops in Shibuya",
    artistId: "art-3",
    artist: "Voxel Drift",
    albumId: "alb-3",
    album: "Midnight Tokyo Lo-Fi",
    duration: 172,
    year: 2025,
    genre: "Lo-Fi Beats",
    bpm: 82,
    musicalKey: "G major",
    audioMood: "lofi",
    cover: createCoverSvg("s6", "Raindrops Shibuya", "#1a0b2e", "#5b146f", "#ff70a6", "grid"),
    colors: { primary: "#1a0b2e", secondary: "#5b146f", accent: "#ff70a6", glow: "rgba(255, 112, 166, 0.45)" },
    plays: 430100,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.0,
        text: "Walking with a clear umbrella high",
        words: [
          { word: "Walking", start: 2.0, end: 2.7 },
          { word: "with", start: 2.7, end: 3.0 },
          { word: "a", start: 3.0, end: 3.2 },
          { word: "clear", start: 3.2, end: 3.7 },
          { word: "umbrella", start: 3.7, end: 4.5 },
          { word: "high", start: 4.5, end: 5.3 }
        ]
      },
      {
        time: 6.5,
        text: "Neon billboards dancing in the sky",
        words: [
          { word: "Neon", start: 6.5, end: 7.1 },
          { word: "billboards", start: 7.1, end: 7.8 },
          { word: "dancing", start: 7.8, end: 8.5 },
          { word: "in", start: 8.5, end: 8.8 },
          { word: "the", start: 8.8, end: 9.1 },
          { word: "sky", start: 9.1, end: 10.0 }
        ]
      },
      {
        time: 11.2,
        text: "Steam is rising from the corner cafe",
        words: [
          { word: "Steam", start: 11.2, end: 11.8 },
          { word: "is", start: 11.8, end: 12.1 },
          { word: "rising", start: 12.1, end: 12.7 },
          { word: "from", start: 12.7, end: 13.0 },
          { word: "the", start: 13.0, end: 13.3 },
          { word: "corner", start: 13.3, end: 13.9 },
          { word: "cafe", start: 13.9, end: 14.9 }
        ]
      },
      {
        time: 16.0,
        text: "All my troubles seem to melt away",
        words: [
          { word: "All", start: 16.0, end: 16.4 },
          { word: "my", start: 16.4, end: 16.7 },
          { word: "troubles", start: 16.7, end: 17.4 },
          { word: "seem", start: 17.4, end: 17.8 },
          { word: "to", start: 17.8, end: 18.1 },
          { word: "melt", start: 18.1, end: 18.7 },
          { word: "away", start: 18.7, end: 19.8 }
        ]
      }
    ]
  },
  {
    id: "song-7",
    title: "Vinyl & Cinnamon",
    artistId: "art-3",
    artist: "Voxel Drift",
    albumId: "alb-3",
    album: "Midnight Tokyo Lo-Fi",
    duration: 160,
    year: 2025,
    genre: "Lo-Fi Beats",
    bpm: 76,
    musicalKey: "Bb major",
    audioMood: "lofi",
    cover: createCoverSvg("s7", "Vinyl & Cinnamon", "#211a1e", "#541388", "#ffd447", "rings"),
    colors: { primary: "#211a1e", secondary: "#541388", accent: "#ffd447", glow: "rgba(255, 212, 71, 0.45)" },
    plays: 278000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.2,
        text: "Dust crackles softly on the turntable",
        words: [
          { word: "Dust", start: 2.2, end: 2.8 },
          { word: "crackles", start: 2.8, end: 3.5 },
          { word: "softly", start: 3.5, end: 4.2 },
          { word: "on", start: 4.2, end: 4.5 },
          { word: "the", start: 4.5, end: 4.8 },
          { word: "turntable", start: 4.8, end: 5.8 }
        ]
      },
      {
        time: 7.0,
        text: "Warm tea sitting beside the fable",
        words: [
          { word: "Warm", start: 7.0, end: 7.6 },
          { word: "tea", start: 7.6, end: 8.0 },
          { word: "sitting", start: 8.0, end: 8.6 },
          { word: "beside", start: 8.6, end: 9.3 },
          { word: "the", start: 9.3, end: 9.6 },
          { word: "fable", start: 9.6, end: 10.5 }
        ]
      }
    ]
  },
  {
    id: "song-8",
    title: "Brutalist Monolith",
    artistId: "art-4",
    artist: "Pulse & Voltage",
    albumId: "alb-4",
    album: "Brutalist Frequencies",
    duration: 236,
    year: 2026,
    genre: "Electro Cyber",
    bpm: 130,
    musicalKey: "F# minor",
    audioMood: "cyberpunk",
    cover: createCoverSvg("s8", "Brutalist Monolith", "#08080a", "#1a1a24", "#00f59b", "cube"),
    colors: { primary: "#08080a", secondary: "#1a1a24", accent: "#00f59b", glow: "rgba(0, 245, 155, 0.45)" },
    plays: 165000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 3.2,
        text: "Concrete towers scrape the heavy sky",
        words: [
          { word: "Concrete", start: 3.2, end: 3.9 },
          { word: "towers", start: 3.9, end: 4.6 },
          { word: "scrape", start: 4.6, end: 5.2 },
          { word: "the", start: 5.2, end: 5.5 },
          { word: "heavy", start: 5.5, end: 6.1 },
          { word: "sky", start: 6.1, end: 7.0 }
        ]
      },
      {
        time: 8.1,
        text: "Iron foundations where the shadows lie",
        words: [
          { word: "Iron", start: 8.1, end: 8.8 },
          { word: "foundations", start: 8.8, end: 9.8 },
          { word: "where", start: 9.8, end: 10.1 },
          { word: "the", start: 10.1, end: 10.4 },
          { word: "shadows", start: 10.4, end: 11.2 },
          { word: "lie", start: 11.2, end: 12.2 }
        ]
      },
      {
        time: 13.5,
        text: "Sub-bass vibrations shaking through the floor",
        words: [
          { word: "Sub-bass", start: 13.5, end: 14.3 },
          { word: "vibrations", start: 14.3, end: 15.2 },
          { word: "shaking", start: 15.2, end: 15.9 },
          { word: "through", start: 15.9, end: 16.3 },
          { word: "the", start: 16.3, end: 16.6 },
          { word: "floor", start: 16.6, end: 17.6 }
        ]
      },
      {
        time: 19.0,
        text: "Opening the vault to something more",
        words: [
          { word: "Opening", start: 19.0, end: 19.7 },
          { word: "the", start: 19.7, end: 20.0 },
          { word: "vault", start: 20.0, end: 20.6 },
          { word: "to", start: 20.6, end: 20.9 },
          { word: "something", start: 20.9, end: 21.6 },
          { word: "more", start: 21.6, end: 22.8 }
        ]
      }
    ]
  },
  {
    id: "song-9",
    title: "Overdrive Protocol",
    artistId: "art-4",
    artist: "Pulse & Voltage",
    albumId: "alb-4",
    album: "Brutalist Frequencies",
    duration: 210,
    year: 2026,
    genre: "Electro Cyber",
    bpm: 134,
    musicalKey: "E minor",
    audioMood: "cyberpunk",
    cover: createCoverSvg("s9", "Overdrive Protocol", "#120005", "#4d0011", "#ff0055", "wave"),
    colors: { primary: "#120005", secondary: "#4d0011", accent: "#ff0055", glow: "rgba(255, 0, 85, 0.45)" },
    plays: 142000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.8,
        text: "System breach at zero four hundred hours",
        words: [
          { word: "System", start: 2.8, end: 3.4 },
          { word: "breach", start: 3.4, end: 4.0 },
          { word: "at", start: 4.0, end: 4.3 },
          { word: "zero", start: 4.3, end: 4.9 },
          { word: "four", start: 4.9, end: 5.3 },
          { word: "hundred", start: 5.3, end: 5.9 },
          { word: "hours", start: 5.9, end: 6.8 }
        ]
      },
      {
        time: 8.0,
        text: "Routing voltage through the auxiliary towers",
        words: [
          { word: "Routing", start: 8.0, end: 8.7 },
          { word: "voltage", start: 8.7, end: 9.4 },
          { word: "through", start: 9.4, end: 9.8 },
          { word: "the", start: 9.8, end: 10.1 },
          { word: "auxiliary", start: 10.1, end: 11.1 },
          { word: "towers", start: 11.1, end: 12.0 }
        ]
      }
    ]
  },
  {
    id: "song-10",
    title: "Celestial Horizons",
    artistId: "art-5",
    artist: "Celeste Echo",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 252,
    year: 2026,
    genre: "Cinematic",
    bpm: 72,
    musicalKey: "D major",
    audioMood: "ambient",
    cover: createCoverSvg("s10", "Celestial Horizons", "#000814", "#001d3d", "#ffc300", "rings"),
    colors: { primary: "#000814", secondary: "#001d3d", accent: "#ffc300", glow: "rgba(255, 195, 0, 0.45)" },
    plays: 210500,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 4.0,
        text: "Beyond the atmosphere we find repose",
        words: [
          { word: "Beyond", start: 4.0, end: 4.7 },
          { word: "the", start: 4.7, end: 5.0 },
          { word: "atmosphere", start: 5.0, end: 6.0 },
          { word: "we", start: 6.0, end: 6.3 },
          { word: "find", start: 6.3, end: 6.9 },
          { word: "repose", start: 6.9, end: 8.0 }
        ]
      },
      {
        time: 9.5,
        text: "Where cosmic stillness blossoms like a rose",
        words: [
          { word: "Where", start: 9.5, end: 9.9 },
          { word: "cosmic", start: 9.9, end: 10.6 },
          { word: "stillness", start: 10.6, end: 11.4 },
          { word: "blossoms", start: 11.4, end: 12.2 },
          { word: "like", start: 12.2, end: 12.6 },
          { word: "a", start: 12.6, end: 12.8 },
          { word: "rose", start: 12.8, end: 14.0 }
        ]
      }
    ]
  },
  {
    id: "song-11",
    title: "Neon Starlight",
    artistId: "art-1",
    artist: "Kroma Horizon",
    albumId: "alb-1",
    album: "Neon Odyssey 2099",
    duration: 198,
    year: 2026,
    genre: "Synthwave",
    bpm: 120,
    musicalKey: "B minor",
    audioMood: "synthwave",
    cover: createCoverSvg("s11", "Neon Starlight", "#050014", "#30005c", "#ff007f", "rings"),
    colors: { primary: "#050014", secondary: "#30005c", accent: "#ff007f", glow: "rgba(255, 0, 127, 0.45)" },
    plays: 177000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 3.0,
        text: "Starlight shining in a magenta glow",
        words: [
          { word: "Starlight", start: 3.0, end: 3.8 },
          { word: "shining", start: 3.8, end: 4.5 },
          { word: "in", start: 4.5, end: 4.8 },
          { word: "a", start: 4.8, end: 5.0 },
          { word: "magenta", start: 5.0, end: 5.8 },
          { word: "glow", start: 5.8, end: 6.8 }
        ]
      },
      {
        time: 7.8,
        text: "Guiding travelers in the night below",
        words: [
          { word: "Guiding", start: 7.8, end: 8.5 },
          { word: "travelers", start: 8.5, end: 9.3 },
          { word: "in", start: 9.3, end: 9.6 },
          { word: "the", start: 9.6, end: 9.9 },
          { word: "night", start: 9.9, end: 10.4 },
          { word: "below", start: 10.4, end: 11.4 }
        ]
      }
    ]
  },
  {
    id: "song-12",
    title: "Ethereal Drift",
    artistId: "art-2",
    artist: "Aura Nebula",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 218,
    year: 2026,
    genre: "Chillwave",
    bpm: 90,
    musicalKey: "Ab major",
    audioMood: "chill",
    cover: createCoverSvg("s12", "Ethereal Drift", "#0b132b", "#1c2541", "#5bc0be", "cube"),
    colors: { primary: "#0b132b", secondary: "#1c2541", accent: "#5bc0be", glow: "rgba(91, 192, 190, 0.45)" },
    plays: 153000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.5,
        text: "Soft winds floating over silent seas",
        words: [
          { word: "Soft", start: 2.5, end: 3.1 },
          { word: "winds", start: 3.1, end: 3.6 },
          { word: "floating", start: 3.6, end: 4.3 },
          { word: "over", start: 4.3, end: 4.8 },
          { word: "silent", start: 4.8, end: 5.4 },
          { word: "seas", start: 5.4, end: 6.4 }
        ]
      },
      {
        time: 7.2,
        text: "Carrying memories upon the breeze",
        words: [
          { word: "Carrying", start: 7.2, end: 8.0 },
          { word: "memories", start: 8.0, end: 8.8 },
          { word: "upon", start: 8.8, end: 9.3 },
          { word: "the", start: 9.3, end: 9.6 },
          { word: "breeze", start: 9.6, end: 10.6 }
        ]
      }
    ]
  },
  {
    id: "song-13",
    title: "Coffee & Tape Cassettes",
    artistId: "art-3",
    artist: "Voxel Drift",
    albumId: "alb-3",
    album: "Midnight Tokyo Lo-Fi",
    duration: 165,
    year: 2025,
    genre: "Lo-Fi Beats",
    bpm: 80,
    musicalKey: "Eb major",
    audioMood: "lofi",
    cover: createCoverSvg("s13", "Tape Cassettes", "#2b2d42", "#8d99ae", "#ef233c", "grid"),
    colors: { primary: "#2b2d42", secondary: "#8d99ae", accent: "#ef233c", glow: "rgba(239, 35, 60, 0.45)" },
    plays: 289000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 3.0,
        text: "Rewinding the vintage magnetic tape",
        words: [
          { word: "Rewinding", start: 3.0, end: 3.8 },
          { word: "the", start: 3.8, end: 4.1 },
          { word: "vintage", start: 4.1, end: 4.7 },
          { word: "magnetic", start: 4.7, end: 5.5 },
          { word: "tape", start: 5.5, end: 6.4 }
        ]
      },
      {
        time: 7.5,
        text: "Finding melody in every shape",
        words: [
          { word: "Finding", start: 7.5, end: 8.1 },
          { word: "melody", start: 8.1, end: 8.8 },
          { word: "in", start: 8.8, end: 9.1 },
          { word: "every", start: 9.1, end: 9.6 },
          { word: "shape", start: 9.6, end: 10.6 }
        ]
      }
    ]
  },
  {
    id: "song-14",
    title: "Circuit Breaker",
    artistId: "art-4",
    artist: "Pulse & Voltage",
    albumId: "alb-4",
    album: "Brutalist Frequencies",
    duration: 205,
    year: 2026,
    genre: "Electro Cyber",
    bpm: 128,
    musicalKey: "G minor",
    audioMood: "cyberpunk",
    cover: createCoverSvg("s14", "Circuit Breaker", "#03071e", "#6a040f", "#f48c06", "wave"),
    colors: { primary: "#03071e", secondary: "#6a040f", accent: "#f48c06", glow: "rgba(244, 140, 6, 0.45)" },
    plays: 138000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.2,
        text: "Overloaded lines surge in the grid",
        words: [
          { word: "Overloaded", start: 2.2, end: 3.1 },
          { word: "lines", start: 3.1, end: 3.6 },
          { word: "surge", start: 3.6, end: 4.2 },
          { word: "in", start: 4.2, end: 4.5 },
          { word: "the", start: 4.5, end: 4.8 },
          { word: "grid", start: 4.8, end: 5.6 }
        ]
      },
      {
        time: 6.8,
        text: "Uncovering secrets the masters hid",
        words: [
          { word: "Uncovering", start: 6.8, end: 7.7 },
          { word: "secrets", start: 7.7, end: 8.4 },
          { word: "the", start: 8.4, end: 8.7 },
          { word: "masters", start: 8.7, end: 9.4 },
          { word: "hid", start: 9.4, end: 10.3 }
        ]
      }
    ]
  },
  {
    id: "song-15",
    title: "Deep Space Resonance",
    artistId: "art-5",
    artist: "Celeste Echo",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 260,
    year: 2026,
    genre: "Cinematic",
    bpm: 70,
    musicalKey: "C major",
    audioMood: "ambient",
    cover: createCoverSvg("s15", "Deep Space", "#0f051d", "#380036", "#00ffff", "rings"),
    colors: { primary: "#0f051d", secondary: "#380036", accent: "#00ffff", glow: "rgba(0, 255, 255, 0.45)" },
    plays: 169000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 4.0,
        text: "Echoes of creation across the void",
        words: [
          { word: "Echoes", start: 4.0, end: 4.7 },
          { word: "of", start: 4.7, end: 5.0 },
          { word: "creation", start: 5.0, end: 5.9 },
          { word: "across", start: 5.9, end: 6.6 },
          { word: "the", start: 6.6, end: 6.9 },
          { word: "void", start: 6.9, end: 7.9 }
        ]
      },
      {
        time: 9.0,
        text: "Harmonies no earthly force destroyed",
        words: [
          { word: "Harmonies", start: 9.0, end: 9.9 },
          { word: "no", start: 9.9, end: 10.2 },
          { word: "earthly", start: 10.2, end: 10.9 },
          { word: "force", start: 10.9, end: 11.5 },
          { word: "destroyed", start: 11.5, end: 12.6 }
        ]
      }
    ]
  },
  {
    id: "song-16",
    title: "Cybernetic Sunrise",
    artistId: "art-1",
    artist: "Kroma Horizon",
    albumId: "alb-1",
    album: "Neon Odyssey 2099",
    duration: 212,
    year: 2026,
    genre: "Synthwave",
    bpm: 125,
    musicalKey: "A major",
    audioMood: "synthwave",
    cover: createCoverSvg("s16", "Cyber Sunrise", "#1f003b", "#7000ff", "#ff8800", "rings"),
    colors: { primary: "#1f003b", secondary: "#7000ff", accent: "#ff8800", glow: "rgba(255, 136, 0, 0.45)" },
    plays: 231000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.6,
        text: "The dawn breaks pink over digital seas",
        words: [
          { word: "The", start: 2.6, end: 2.9 },
          { word: "dawn", start: 2.9, end: 3.4 },
          { word: "breaks", start: 3.4, end: 3.9 },
          { word: "pink", start: 3.9, end: 4.4 },
          { word: "over", start: 4.4, end: 4.9 },
          { word: "digital", start: 4.9, end: 5.6 },
          { word: "seas", start: 5.6, end: 6.6 }
        ]
      },
      {
        time: 7.5,
        text: "Awakening synthetic harmonies",
        words: [
          { word: "Awakening", start: 7.5, end: 8.4 },
          { word: "synthetic", start: 8.4, end: 9.2 },
          { word: "harmonies", start: 9.2, end: 10.4 }
        ]
      }
    ]
  },
  {
    id: "song-17",
    title: "Velvet Horizons",
    artistId: "art-2",
    artist: "Aura Nebula",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 195,
    year: 2026,
    genre: "Chillwave",
    bpm: 88,
    musicalKey: "F minor",
    audioMood: "chill",
    cover: createCoverSvg("s17", "Velvet Horizons", "#00293c", "#1e656d", "#f1f3ce", "wave"),
    colors: { primary: "#00293c", secondary: "#1e656d", accent: "#f1f3ce", glow: "rgba(241, 243, 206, 0.45)" },
    plays: 114000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 3.1,
        text: "Velvet textures in the twilight air",
        words: [
          { word: "Velvet", start: 3.1, end: 3.8 },
          { word: "textures", start: 3.8, end: 4.5 },
          { word: "in", start: 4.5, end: 4.8 },
          { word: "the", start: 4.8, end: 5.1 },
          { word: "twilight", start: 5.1, end: 5.8 },
          { word: "air", start: 5.8, end: 6.7 }
        ]
      },
      {
        time: 7.8,
        text: "Breathe the silence without a single care",
        words: [
          { word: "Breathe", start: 7.8, end: 8.4 },
          { word: "the", start: 8.4, end: 8.7 },
          { word: "silence", start: 8.7, end: 9.4 },
          { word: "without", start: 9.4, end: 10.0 },
          { word: "a", start: 10.0, end: 10.2 },
          { word: "single", start: 10.2, end: 10.8 },
          { word: "care", start: 10.8, end: 11.8 }
        ]
      }
    ]
  },
  {
    id: "song-18",
    title: "Shinjuku Alleyways",
    artistId: "art-3",
    artist: "Voxel Drift",
    albumId: "alb-3",
    album: "Midnight Tokyo Lo-Fi",
    duration: 182,
    year: 2025,
    genre: "Lo-Fi Beats",
    bpm: 84,
    musicalKey: "D minor",
    audioMood: "lofi",
    cover: createCoverSvg("s18", "Shinjuku Alleys", "#111d4a", "#ffcad4", "#b5e2fa", "grid"),
    colors: { primary: "#111d4a", secondary: "#ffcad4", accent: "#b5e2fa", glow: "rgba(181, 226, 250, 0.45)" },
    plays: 341000,
    hasSyncedLyrics: true,
    lyrics: [
      {
        time: 2.0,
        text: "Lanterns glow in crimson and gold",
        words: [
          { word: "Lanterns", start: 2.0, end: 2.7 },
          { word: "glow", start: 2.7, end: 3.3 },
          { word: "in", start: 3.3, end: 3.6 },
          { word: "crimson", start: 3.6, end: 4.3 },
          { word: "and", start: 4.3, end: 4.6 },
          { word: "gold", start: 4.6, end: 5.5 }
        ]
      },
      {
        time: 6.8,
        text: "Stories of yesterday waiting to be told",
        words: [
          { word: "Stories", start: 6.8, end: 7.5 },
          { word: "of", start: 7.5, end: 7.8 },
          { word: "yesterday", start: 7.8, end: 8.6 },
          { word: "waiting", start: 8.6, end: 9.3 },
          { word: "to", start: 9.3, end: 9.6 },
          { word: "be", start: 9.6, end: 9.9 },
          { word: "told", start: 9.9, end: 10.9 }
        ]
      }
    ]
  },
  // Canción 19 con letra estática (sin sincronización temporal) para probar el fallback requerido
  {
    id: "song-19",
    title: "Static Reverberation",
    artistId: "art-4",
    artist: "Pulse & Voltage",
    albumId: "alb-4",
    album: "Brutalist Frequencies",
    duration: 189,
    year: 2026,
    genre: "Electro Cyber",
    bpm: 132,
    musicalKey: "C minor",
    audioMood: "cyberpunk",
    cover: createCoverSvg("s19", "Static Reverb", "#0d0d0d", "#262626", "#e5e5e5", "cube"),
    colors: { primary: "#0d0d0d", secondary: "#262626", accent: "#e5e5e5", glow: "rgba(229, 229, 229, 0.4)" },
    plays: 98000,
    hasSyncedLyrics: false,
    staticLyricsText: `[Letra Estática - Sin marcas de tiempo]

Transmisión de emergencia activa.
Frecuencias oscilando entre los muros de titanio.
Los pulsos no se detienen, la máquina sigue viva.
Buscamos la frecuencia perdida en el ruido blanco.
La noche se viste de acero y sombras.
RhythmBox continúa en bucle infinito.`,
    lyrics: []
  },
  // Canción 20 con letra instrumental / sin letra para probar estado vacío elegante
  {
    id: "song-20",
    title: "Infinite Void (Instrumental)",
    artistId: "art-5",
    artist: "Celeste Echo",
    albumId: "alb-2",
    album: "Subsurface Reverie",
    duration: 275,
    year: 2026,
    genre: "Cinematic",
    bpm: 65,
    musicalKey: "A minor",
    audioMood: "ambient",
    cover: createCoverSvg("s20", "Infinite Void", "#050505", "#141414", "#7b2cbf", "rings"),
    colors: { primary: "#050505", secondary: "#141414", accent: "#7b2cbf", glow: "rgba(123, 44, 191, 0.45)" },
    plays: 129000,
    hasSyncedLyrics: false,
    staticLyricsText: null, // Pista puramente instrumental
    lyrics: []
  }
];
