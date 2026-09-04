// RhythmBox - Almacenamiento y persistencia local (LocalStorage)

const STORAGE_KEYS = {
  LIKED_SONGS: "rhythmbox_liked_songs",
  USER_PLAYLISTS: "rhythmbox_user_playlists",
  SEARCH_HISTORY: "rhythmbox_search_history",
  PLAY_HISTORY: "rhythmbox_play_history",
  SETTINGS: "rhythmbox_settings",
  LYRICS_CONFIG: "rhythmbox_lyrics_config",
  DOWNLOADED_SONGS: "rhythmbox_downloaded_songs",
  EQ_GAINS: "rhythmbox_eq_gains"
};

const DEFAULT_SETTINGS = {
  theme: "obsidian",
  language: "es",
  volume: 0.85,
  isMuted: false,
  crossfade: 2, // segundos
  gapless: true,
  normalization: true,
  audioQuality: "high",
  miniPlayerLayout: "compact",
  highContrast: false,
  globalTextScale: 100, // porcentaje
  repeatMode: "off", // 'off' | 'all' | 'one'
  isShuffled: false
};

const DEFAULT_LYRICS_CONFIG = {
  fontFamily: "geometric", // 'geometric' | 'serif' | 'mono' | 'display'
  fontSize: 24, // px
  fontAlign: "center", // 'center' | 'left'
  textColorMode: "neon", // 'neon' | 'dynamic' | 'contrast'
  bgStyle: "gradient", // 'solid' | 'gradient' | 'blur'
  transitionStyle: "slide", // 'fade' | 'slide' | 'scale'
  karaokeMode: true, // resaltado progresivo palabra por palabra
  distractionFree: false
};

const DEFAULT_EQ_GAINS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 10 bandas en 0 dB

export const storage = {
  // Configuración general
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Error guardando settings:", e);
    }
  },

  // Configuración de letras
  getLyricsConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LYRICS_CONFIG);
      return data ? { ...DEFAULT_LYRICS_CONFIG, ...JSON.parse(data) } : { ...DEFAULT_LYRICS_CONFIG };
    } catch {
      return { ...DEFAULT_LYRICS_CONFIG };
    }
  },
  saveLyricsConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.LYRICS_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error("Error guardando lyrics config:", e);
    }
  },

  // Canciones favoritas (Likes)
  getLikedSongs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKED_SONGS);
      return data ? JSON.parse(data) : ["song-1", "song-6", "song-8"]; // Favoritas iniciales
    } catch {
      return ["song-1", "song-6", "song-8"];
    }
  },
  saveLikedSongs(songIds) {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED_SONGS, JSON.stringify(songIds));
    } catch (e) {
      console.error("Error guardando canciones favoritas:", e);
    }
  },
  toggleLikeSong(songId) {
    const list = this.getLikedSongs();
    const index = list.indexOf(songId);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.unshift(songId);
    }
    this.saveLikedSongs(list);
    return index < 0; // true si ahora es favorita
  },

  // Playlists de usuario
  getUserPlaylists() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PLAYLISTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveUserPlaylists(playlists) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.error("Error guardando playlists de usuario:", e);
    }
  },
  createPlaylist(title, description = "", songIds = []) {
    const playlists = this.getUserPlaylists();
    const newPlaylist = {
      id: "user-pl-" + Date.now(),
      title: title.trim() || "Nueva Playlist",
      description: description.trim(),
      songIds,
      createdAt: new Date().toISOString(),
      isSystem: false,
      cover: null
    };
    playlists.unshift(newPlaylist);
    this.saveUserPlaylists(playlists);
    return newPlaylist;
  },

  // Historial de búsqueda
  getSearchHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : ["Kroma Horizon", "Synthwave", "Midnight"];
    } catch {
      return ["Kroma Horizon", "Synthwave", "Midnight"];
    }
  },
  addSearchQuery(query) {
    if (!query || !query.trim()) return;
    const history = this.getSearchHistory().filter(q => q.toLowerCase() !== query.toLowerCase().trim());
    history.unshift(query.trim());
    if (history.length > 8) history.pop();
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  },
  clearSearchHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (e) {
      console.error(e);
    }
  },

  // Historial de reproducción
  getPlayHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAY_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addPlayHistory(songId) {
    const history = this.getPlayHistory().filter(id => id !== songId);
    history.unshift(songId);
    if (history.length > 20) history.pop();
    try {
      localStorage.setItem(STORAGE_KEYS.PLAY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  },

  // Ecualizador
  getEqGains() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EQ_GAINS);
      return data ? JSON.parse(data) : [...DEFAULT_EQ_GAINS];
    } catch {
      return [...DEFAULT_EQ_GAINS];
    }
  },
  saveEqGains(gains) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQ_GAINS, JSON.stringify(gains));
    } catch (e) {
      console.error(e);
    }
  },

  // Descargas offline simuladas
  getDownloadedSongs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOWNLOADED_SONGS);
      return data ? JSON.parse(data) : ["song-1", "song-6"];
    } catch {
      return ["song-1", "song-6"];
    }
  },
  saveDownloadedSongs(songIds) {
    try {
      localStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(songIds));
    } catch (e) {
      console.error(e);
    }
  },
  toggleDownload(songId) {
    const list = this.getDownloadedSongs();
    const idx = list.indexOf(songId);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(songId);
    }
    this.saveDownloadedSongs(list);
    return idx < 0;
  },
  clearDownloadedSongs() {
    try {
      localStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  }
};
