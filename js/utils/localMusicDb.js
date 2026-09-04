// RhythmBox - Almacenamiento y Gestor de Música Local en IndexedDB
// Permite guardar archivos de audio completos (Blobs MP3, WAV, FLAC, OGG, M4A) sin límite de tamaño

const DB_NAME = "RhythmBoxLocalDB";
const DB_VERSION = 1;
const STORE_NAME = "local_tracks";

export const localMusicDb = {
  db: null,

  async openDb() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("title", "title", { unique: false });
          store.createIndex("artist", "artist", { unique: false });
          store.createIndex("addedAt", "addedAt", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error("Error abriendo IndexedDB:", event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Guardar un archivo de audio local
  async saveTrack(file) {
    const db = await this.openDb();

    // Extraer metadatos del archivo
    const meta = await this.extractFileMetadata(file);

    const trackRecord = {
      id: "local-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      title: meta.title,
      artist: meta.artist,
      album: meta.album,
      duration: meta.duration,
      format: meta.format,
      sizeMb: meta.sizeMb,
      fileBlob: file,
      addedAt: new Date().toISOString(),
      isLocal: true,
      hasSyncedLyrics: false,
      staticLyricsText: `[Pista Local: ${meta.title}]\nArchivo: ${file.name}\nFormato: ${meta.format.toUpperCase()} (${meta.sizeMb} MB)\nImportado el: ${new Date().toLocaleDateString()}`,
      lyrics: []
    };

    // Generar carátula vectorial basada en el título y formato
    trackRecord.cover = this.createLocalCoverSvg(trackRecord.title, trackRecord.format);
    trackRecord.colors = {
      primary: "#07080d",
      secondary: "#1a102f",
      accent: "#00f2fe",
      glow: "rgba(0, 242, 254, 0.45)"
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(trackRecord);

      request.onsuccess = () => {
        // Crear object URL para reproducción inmediata
        trackRecord.audioUrl = URL.createObjectURL(file);
        resolve(trackRecord);
      };

      request.onerror = (event) => {
        console.error("Error guardando en IndexedDB:", event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Obtener todas las pistas locales guardadas
  async getAllTracks() {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const tracks = request.result || [];
        // Reconstruir object URLs para cada Blob
        tracks.forEach(track => {
          if (track.fileBlob) {
            track.audioUrl = URL.createObjectURL(track.fileBlob);
          }
        });
        resolve(tracks);
      };

      request.onerror = (event) => {
        console.error("Error leyendo IndexedDB:", event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Eliminar una pista por ID
  async deleteTrack(id) {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Eliminar todas las pistas locales
  async clearAll() {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  // Extraer metadatos básicos y duración real del archivo
  async extractFileMetadata(file) {
    const filename = file.name;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const extMatch = filename.match(/\.([a-z0-9]+)$/i);
    const format = extMatch ? extMatch[1].toLowerCase() : "audio";

    // Limpieza de nombre
    const baseName = filename.replace(/\.[^/.]+$/, "");
    let title = baseName;
    let artist = "Artista Desconocido";
    let album = "Descargas Locales";

    // Detectar patrón "Artista - Título"
    if (baseName.includes(" - ")) {
      const parts = baseName.split(" - ");
      artist = parts[0].trim();
      title = parts.slice(1).join(" - ").trim();
    }

    // Calcular duración real del archivo mediante AudioContext o elemento Audio
    let duration = 180; // Estimación por defecto
    try {
      duration = await this.getAudioDuration(file);
    } catch {
      // Fallback a duración estimada
    }

    return {
      title,
      artist,
      album,
      duration: Math.round(duration),
      format,
      sizeMb
    };
  },

  getAudioDuration(file) {
    return new Promise((resolve) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(audio.duration || 180);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(180);
      };

      audio.src = objectUrl;
    });
  },

  // Generar carátula decorativa distintiva para canciones locales
  createLocalCoverSvg(title, format) {
    const safeTitle = title.substring(0, 18).toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="g_local" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0b132b"/>
            <stop offset="50%" stop-color="#1c2541"/>
            <stop offset="100%" stop-color="#00f2fe"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g_local)"/>
        <!-- Ondas sonoras estilizadas -->
        <rect x="70" y="160" width="14" height="80" rx="7" fill="#00f2fe" opacity="0.8"/>
        <rect x="100" y="120" width="14" height="160" rx="7" fill="#00f2fe"/>
        <rect x="130" y="140" width="14" height="120" rx="7" fill="#00f2fe" opacity="0.9"/>
        <rect x="160" y="100" width="14" height="200" rx="7" fill="#ffffff"/>
        <rect x="190" y="130" width="14" height="140" rx="7" fill="#00f2fe" opacity="0.9"/>
        <rect x="220" y="150" width="14" height="100" rx="7" fill="#00f2fe"/>
        <rect x="250" y="110" width="14" height="180" rx="7" fill="#00f2fe" opacity="0.8"/>
        <rect x="280" y="140" width="14" height="120" rx="7" fill="#00f2fe" opacity="0.7"/>
        <rect x="310" y="170" width="14" height="60" rx="7" fill="#00f2fe" opacity="0.5"/>
        <text x="40" y="340" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="20" fill="#ffffff">${safeTitle}</text>
        <rect x="40" y="355" width="56" height="20" rx="4" fill="#00f2fe"/>
        <text x="68" y="369" font-family="sans-serif" font-weight="700" font-size="11" fill="#07080d" text-anchor="middle">${format.toUpperCase()}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  }
};
