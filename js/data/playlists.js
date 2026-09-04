// RhythmBox - Playlists predefinidas y mixes inteligentes

export const defaultPlaylists = [
  {
    id: "pl-mix-1",
    title: "Daily Mix 1: Synthwave Dreams",
    description: "Luces de neón, arpegios analógicos y conducción nocturna por autopistas cibernéticas.",
    cover: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b001a"/>
            <stop offset="50%" stop-color="#480ca8"/>
            <stop offset="100%" stop-color="#4cc9f0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g1)"/>
        <polygon points="200,80 320,320 80,320" fill="none" stroke="#4cc9f0" stroke-width="4"/>
        <circle cx="200" cy="240" r="40" fill="#f72585"/>
        <text x="30" y="360" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">DAILY MIX 01</text>
      </svg>
    `.trim()),
    songIds: ["song-1", "song-2", "song-3", "song-11", "song-16"],
    isSystem: true
  },
  {
    id: "pl-mix-2",
    title: "Daily Mix 2: Tokyo Cyber Lofi",
    description: "Gotas de lluvia sobre asfalto, café caliente y melodías Rhodes para estudiar o relajarse.",
    cover: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1a0b2e"/>
            <stop offset="50%" stop-color="#7209b7"/>
            <stop offset="100%" stop-color="#ff70a6"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g2)"/>
        <circle cx="200" cy="200" r="100" fill="none" stroke="#ff70a6" stroke-width="3" stroke-dasharray="10 5"/>
        <circle cx="200" cy="200" r="40" fill="#ffd447"/>
        <text x="30" y="360" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">DAILY MIX 02</text>
      </svg>
    `.trim()),
    songIds: ["song-6", "song-7", "song-13", "song-18"],
    isSystem: true
  },
  {
    id: "pl-mix-3",
    title: "Daily Mix 3: Deep Atmospheric Chill",
    description: "Paisajes sonoros submarinos y celestes para meditación y enfoque continuo.",
    cover: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#051622"/>
            <stop offset="50%" stop-color="#1ba098"/>
            <stop offset="100%" stop-color="#deb992"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g3)"/>
        <path d="M 50 200 Q 200 80 350 200 T 50 200" fill="none" stroke="#deb992" stroke-width="4"/>
        <text x="30" y="360" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">DAILY MIX 03</text>
      </svg>
    `.trim()),
    songIds: ["song-4", "song-5", "song-10", "song-12", "song-15", "song-17", "song-20"],
    isSystem: true
  },
  {
    id: "pl-mix-4",
    title: "Daily Mix 4: Brutalist Overdrive",
    description: "Bajos de alta potencia, síntesis modular y frecuencias electromagnéticas implacables.",
    cover: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#08080a"/>
            <stop offset="50%" stop-color="#1a1a24"/>
            <stop offset="100%" stop-color="#00f59b"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g4)"/>
        <polygon points="200,90 310,150 310,270 200,330 90,270 90,150" fill="none" stroke="#00f59b" stroke-width="3"/>
        <text x="30" y="360" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff">DAILY MIX 04</text>
      </svg>
    `.trim()),
    songIds: ["song-8", "song-9", "song-14", "song-19"],
    isSystem: true
  }
];
