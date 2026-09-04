// RhythmBox - Almacén de estado reactivo centralizado (Store & Event Bus)

import { mockSongs, mockAlbums, mockArtists } from "./data/songs.js";
import { defaultPlaylists } from "./data/playlists.js";
import { storage } from "./utils/storage.js";
import { translations } from "./data/i18n.js";
import { colorExtractor } from "./utils/colorExtractor.js";
import { localMusicDb } from "./utils/localMusicDb.js";

class AppState {
  constructor() {
    this.listeners = new Map();

    // Cargar configuraciones guardadas
    const savedSettings = storage.getSettings();
    const savedLyricsConfig = storage.getLyricsConfig();
    const savedLiked = storage.getLikedSongs();
    const savedEqGains = storage.getEqGains();
    const savedDownloads = storage.getDownloadedSongs();
    const savedUserPlaylists = storage.getUserPlaylists();

    this.data = {
      // Canciones locales del usuario (cargadas desde IndexedDB)
      localTracks: [],

      // Estado de reproducción
      currentSong: mockSongs[0], // Comenzar con una canción precargada
      isPlaying: false,
      currentTime: 0,
      duration: mockSongs[0].duration,
      volume: savedSettings.volume ?? 0.85,
      isMuted: savedSettings.isMuted ?? false,
      repeatMode: savedSettings.repeatMode || "off", // 'off' | 'all' | 'one'
      isShuffled: savedSettings.isShuffled || false,

      // Colas y listas
      queue: [...mockSongs], // Cola de reproducción actual
      originalQueue: [...mockSongs],
      history: [],

      // Colecciones y persistencia
      likedSongIds: new Set(savedLiked),
      userPlaylists: savedUserPlaylists,
      downloadedSongIds: new Set(savedDownloads),

      // Navegación y UI
      activeView: "home", // 'home' | 'library' | 'search' | 'queue' | 'settings' | 'lyrics' | 'detail'
      detailType: null, // 'album' | 'artist' | 'playlist'
      detailItem: null,
      isNowPlayingExpanded: false, // Vista Now Playing a pantalla completa
      isVisualizerMode: true, // Modo visualizador dinámico vs carátula
      isSleepTimerModalOpen: false,
      isLyricsCustomizerOpen: false,
      isCreatePlaylistModalOpen: false,
      isShareCardModalOpen: false,
      shareCardData: null,

      // Configuraciones generales
      settings: savedSettings,
      lyricsConfig: savedLyricsConfig,
      eqGains: savedEqGains,
      activeEqPreset: "flat",
      sleepTimerRemaining: null,

      // Idioma actual
      currentLang: savedSettings.language || "es"
    };
  }

  // Sistema de eventos pub/sub
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error en listener de evento ${event}:`, err);
        }
      });
    }
  }

  // Traducción rápida reactiva
  t(key) {
    const lang = this.data.currentLang;
    return translations[lang]?.[key] || translations["es"]?.[key] || key;
  }

  // Acciones de reproducción
  setCurrentSong(song, autoPlay = true) {
    this.data.currentSong = song;
    this.data.duration = song.duration;
    this.data.currentTime = 0;

    // Registrar en historial
    storage.addPlayHistory(song.id);
    const existingIndex = this.data.history.findIndex(s => s.id === song.id);
    if (existingIndex >= 0) this.data.history.splice(existingIndex, 1);
    this.data.history.unshift(song);
    if (this.data.history.length > 25) this.data.history.pop();

    // Extraer colores para fondo dinámico si el tema es dinámico o para acentos
    colorExtractor.extractFromCover(song.cover, song.colors);

    this.emit("song:changed", { song, autoPlay });
  }

  setPlaybackState(isPlaying) {
    this.data.isPlaying = isPlaying;
    this.emit("playback:changed", isPlaying);
  }

  setProgress(currentTime, duration) {
    this.data.currentTime = currentTime;
    if (duration) this.data.duration = duration;
    this.emit("progress:updated", { currentTime, duration: this.data.duration });
  }

  setVolume(volume) {
    this.data.volume = volume;
    this.data.settings.volume = volume;
    storage.saveSettings(this.data.settings);
    this.emit("volume:changed", volume);
  }

  toggleMute() {
    this.data.isMuted = !this.data.isMuted;
    this.data.settings.isMuted = this.data.isMuted;
    storage.saveSettings(this.data.settings);
    this.emit("mute:changed", this.data.isMuted);
  }

  toggleShuffle() {
    this.data.isShuffled = !this.data.isShuffled;
    if (this.data.isShuffled) {
      // Guardar orden original y mezclar dejando la actual al principio
      const current = this.data.currentSong;
      const rest = this.data.queue.filter(s => s.id !== current.id);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      this.data.queue = [current, ...rest];
    } else {
      this.data.queue = [...this.data.originalQueue];
    }
    this.data.settings.isShuffled = this.data.isShuffled;
    storage.saveSettings(this.data.settings);
    this.emit("queue:changed", this.data.queue);
  }

  toggleRepeat() {
    const modes = ["off", "all", "one"];
    const nextIndex = (modes.indexOf(this.data.repeatMode) + 1) % modes.length;
    this.data.repeatMode = modes[nextIndex];
    this.data.settings.repeatMode = this.data.repeatMode;
    storage.saveSettings(this.data.settings);
    this.emit("repeat:changed", this.data.repeatMode);
  }

  playNext() {
    if (this.data.repeatMode === "one") {
      this.emit("song:restart");
      return;
    }

    const currentIndex = this.data.queue.findIndex(s => s.id === this.data.currentSong?.id);
    if (currentIndex >= 0 && currentIndex < this.data.queue.length - 1) {
      this.setCurrentSong(this.data.queue[currentIndex + 1], true);
    } else if (this.data.repeatMode === "all" && this.data.queue.length > 0) {
      this.setCurrentSong(this.data.queue[0], true);
    } else {
      this.setPlaybackState(false);
    }
  }

  playPrevious() {
    // Si han pasado más de 3 segundos, reiniciar la pista actual
    if (this.data.currentTime > 3) {
      this.emit("song:restart");
      return;
    }

    const currentIndex = this.data.queue.findIndex(s => s.id === this.data.currentSong?.id);
    if (currentIndex > 0) {
      this.setCurrentSong(this.data.queue[currentIndex - 1], true);
    } else {
      this.emit("song:restart");
    }
  }

  // Acciones de Cola (Queue)
  setQueue(songs, playFirst = true) {
    this.data.queue = [...songs];
    this.data.originalQueue = [...songs];
    if (playFirst && songs.length > 0) {
      this.setCurrentSong(songs[0], true);
    }
    this.emit("queue:changed", this.data.queue);
  }

  addToQueueNext(song) {
    const currentIdx = this.data.queue.findIndex(s => s.id === this.data.currentSong?.id);
    if (currentIdx >= 0) {
      this.data.queue.splice(currentIdx + 1, 0, song);
    } else {
      this.data.queue.push(song);
    }
    this.emit("queue:changed", this.data.queue);
  }

  addToQueueEnd(song) {
    this.data.queue.push(song);
    this.emit("queue:changed", this.data.queue);
  }

  removeFromQueue(index) {
    if (index >= 0 && index < this.data.queue.length) {
      this.data.queue.splice(index, 1);
      this.emit("queue:changed", this.data.queue);
    }
  }

  reorderQueue(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    const item = this.data.queue.splice(fromIndex, 1)[0];
    this.data.queue.splice(toIndex, 0, item);
    this.emit("queue:changed", this.data.queue);
  }

  clearQueue() {
    if (this.data.currentSong) {
      this.data.queue = [this.data.currentSong];
    } else {
      this.data.queue = [];
    }
    this.emit("queue:changed", this.data.queue);
  }

  // Favoritos (Likes)
  toggleLike(songId) {
    const isNowLiked = storage.toggleLikeSong(songId);
    if (isNowLiked) {
      this.data.likedSongIds.add(songId);
    } else {
      this.data.likedSongIds.delete(songId);
    }
    this.emit("like:changed", { songId, isLiked: isNowLiked });
    return isNowLiked;
  }

  isLiked(songId) {
    return this.data.likedSongIds.has(songId);
  }

  // Descargas offline
  toggleDownload(songId) {
    const isNowDownloaded = storage.toggleDownload(songId);
    if (isNowDownloaded) {
      this.data.downloadedSongIds.add(songId);
    } else {
      this.data.downloadedSongIds.delete(songId);
    }
    this.emit("download:changed", { songId, isDownloaded: isNowDownloaded });
    return isNowDownloaded;
  }

  isDownloaded(songId) {
    return this.data.downloadedSongIds.has(songId);
  }

  clearAllDownloads() {
    storage.clearDownloadedSongs();
    this.data.downloadedSongIds.clear();
    this.emit("download:changed", { clearAll: true });
  }

  // --- Música Local Propia e IndexedDB ---
  getAllSongs() {
    return [...this.data.localTracks, ...mockSongs];
  }

  async loadLocalTracks() {
    try {
      const tracks = await localMusicDb.getAllTracks();
      this.data.localTracks = tracks;
      this.emit("localTracks:changed", tracks);
    } catch (e) {
      console.error("Error cargando música local:", e);
    }
  }

  async importLocalFiles(fileList) {
    const imported = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|flac|ogg|m4a|aac)$/i)) {
        continue;
      }
      try {
        const track = await localMusicDb.saveTrack(file);
        imported.push(track);
        this.data.localTracks.unshift(track);
        this.addToQueueNext(track);
      } catch (err) {
        console.error("Error importando archivo local:", file.name, err);
      }
    }

    if (imported.length > 0) {
      this.emit("localTracks:changed", this.data.localTracks);
      this.emit("queue:changed", this.data.queue);
    }
    return imported;
  }

  async deleteLocalTrack(id) {
    try {
      await localMusicDb.deleteTrack(id);
      this.data.localTracks = this.data.localTracks.filter(t => t.id !== id);
      this.data.queue = this.data.queue.filter(t => t.id !== id);
      this.emit("localTracks:changed", this.data.localTracks);
      this.emit("queue:changed", this.data.queue);
    } catch (err) {
      console.error("Error eliminando pista local:", err);
    }
  }

  // Playlists
  createPlaylist(name, description = "", songIds = []) {
    const pl = storage.createPlaylist(name, description, songIds);
    this.data.userPlaylists = storage.getUserPlaylists();
    this.emit("playlists:changed", this.data.userPlaylists);
    return pl;
  }

  addSongToPlaylist(playlistId, songId) {
    const playlists = storage.getUserPlaylists();
    const target = playlists.find(p => p.id === playlistId);
    if (target && !target.songIds.includes(songId)) {
      target.songIds.push(songId);
      storage.saveUserPlaylists(playlists);
      this.data.userPlaylists = playlists;
      this.emit("playlists:changed", this.data.userPlaylists);
    }
  }

  // Navegación
  navigateTo(view, detailData = null) {
    this.data.activeView = view;
    if (view === "detail" && detailData) {
      this.data.detailType = detailData.type; // 'album' | 'artist' | 'playlist'
      this.data.detailItem = detailData.item;
    }
    this.emit("view:changed", { view, detailData });
  }

  toggleNowPlayingModal(forceState = null) {
    this.data.isNowPlayingExpanded = forceState !== null ? forceState : !this.data.isNowPlayingExpanded;
    this.emit("nowPlayingModal:changed", this.data.isNowPlayingExpanded);
  }

  toggleLyricsModal(forceState = null) {
    const newState = forceState !== null ? forceState : (this.data.activeView === "lyrics" ? false : true);
    if (newState) {
      this.navigateTo("lyrics");
    } else if (this.data.activeView === "lyrics") {
      this.navigateTo("home");
    }
  }

  // Ajustes y apariencia
  setTheme(themeName) {
    this.data.settings.theme = themeName;
    storage.saveSettings(this.data.settings);
    document.documentElement.setAttribute("data-theme", themeName);
    this.emit("theme:changed", themeName);
  }

  setLanguage(lang) {
    this.data.currentLang = lang;
    this.data.settings.language = lang;
    storage.saveSettings(this.data.settings);
    this.emit("language:changed", lang);
  }

  setMiniPlayerLayout(layout) {
    this.data.settings.miniPlayerLayout = layout;
    storage.saveSettings(this.data.settings);
    this.emit("miniPlayerLayout:changed", layout);
  }

  updateLyricsConfig(newConfig) {
    this.data.lyricsConfig = { ...this.data.lyricsConfig, ...newConfig };
    storage.saveLyricsConfig(this.data.lyricsConfig);
    this.emit("lyricsConfig:changed", this.data.lyricsConfig);
  }

  updateEqGains(gains, preset = "custom") {
    this.data.eqGains = [...gains];
    this.data.activeEqPreset = preset;
    storage.saveEqGains(gains);
    this.emit("eq:changed", { gains, preset });
  }

  setSleepTimerRemaining(seconds) {
    this.data.sleepTimerRemaining = seconds;
    this.emit("sleepTimer:tick", seconds);
  }
}

export const state = new AppState();
