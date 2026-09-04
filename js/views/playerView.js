// RhythmBox - Vista del Mini-Reproductor y Pantalla Now Playing Completa con Visualizador

import { state } from "../state.js";
import { audioEngine } from "../audio/engine.js";
import { mediaSessionManager } from "../audio/mediaSession.js";

export const playerView = {
  isDraggingScrubber: false,
  visualizerAnimId: null,

  init() {
    this.bindGlobalEvents();
    this.startVisualizer();
  },

  bindGlobalEvents() {
    // Escuchar cambios de canción
    state.on("song:changed", ({ song, autoPlay }) => {
      audioEngine.loadSong(song, autoPlay);
      mediaSessionManager.updateMetadata(song);
      this.updatePlayerUI(song);
    });

    // Escuchar reinicio de canción
    state.on("song:restart", () => {
      audioEngine.seek(0);
      audioEngine.play();
    });

    // Escuchar progreso del motor de audio
    audioEngine.onTimeUpdate = (currentTime, duration) => {
      if (!this.isDraggingScrubber) {
        state.setProgress(currentTime, duration);
        this.updateProgressUI(currentTime, duration);
        mediaSessionManager.updatePositionState(currentTime, duration);
      }
    };

    // Fin de canción -> siguiente
    audioEngine.onSongEnd = () => {
      state.playNext();
    };

    // Cambio de estado de reproducción
    audioEngine.onStateChange = (audioState) => {
      state.setPlaybackState(audioState.isPlaying);
      mediaSessionManager.updatePlaybackState(audioState.isPlaying);
      this.updatePlayPauseButtons(audioState.isPlaying);
    };

    // Actualización del temporizador de apagado
    audioEngine.onSleepTimerTick = (remainingSeconds) => {
      state.setSleepTimerRemaining(remainingSeconds);
      this.updateSleepTimerBadge(remainingSeconds);
    };

    // Toggle me gusta
    state.on("like:changed", ({ songId, isLiked }) => {
      if (state.data.currentSong?.id === songId) {
        this.updateLikeButtons(isLiked);
      }
    });

    // Toggle repetición
    state.on("repeat:changed", (mode) => {
      this.updateRepeatButtons(mode);
    });

    // Toggle aleatorio
    state.on("queue:changed", () => {
      this.updateShuffleButtons(state.data.isShuffled);
    });

    // Inicializar MediaSession
    mediaSessionManager.init({
      onPlay: () => audioEngine.play(),
      onPause: () => audioEngine.pause(),
      onPrevious: () => state.playPrevious(),
      onNext: () => state.playNext(),
      onSeek: (time) => audioEngine.seek(time)
    });

    // Vincular interacción del DOM
    this.attachDomEvents();
  },

  attachDomEvents() {
    // Mini-player click para expandir Now Playing (excepto botones de control)
    const miniPlayer = document.getElementById("mini-player");
    if (miniPlayer) {
      miniPlayer.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("input")) return;
        state.toggleNowPlayingModal(true);
      });
    }

    // Botón para cerrar Now Playing
    const btnCloseNp = document.getElementById("btn-close-np");
    if (btnCloseNp) {
      btnCloseNp.addEventListener("click", () => {
        state.toggleNowPlayingModal(false);
      });
    }

    // Botones de Reproducir / Pausar (Mini y Now Playing)
    document.querySelectorAll(".btn-toggle-play").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        audioEngine.togglePlay();
      });
    });

    // Botones Siguiente y Anterior
    document.querySelectorAll(".btn-skip-next").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.playNext();
      });
    });

    document.querySelectorAll(".btn-skip-prev").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.playPrevious();
      });
    });

    // Aleatorio y Repetición
    document.querySelectorAll(".btn-toggle-shuffle").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.toggleShuffle();
      });
    });

    document.querySelectorAll(".btn-toggle-repeat").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.toggleRepeat();
      });
    });

    // Me Gusta
    document.querySelectorAll(".btn-player-like").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state.data.currentSong) {
          state.toggleLike(state.data.currentSong.id);
        }
      });
    });

    // Scrubber / Barra de progreso (Mini y Now Playing)
    const setupScrubber = (slider, isMini = false) => {
      if (!slider) return;

      slider.addEventListener("mousedown", () => { this.isDraggingScrubber = true; });
      slider.addEventListener("touchstart", () => { this.isDraggingScrubber = true; }, { passive: true });

      slider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        const duration = state.data.duration || 1;
        const targetTime = (val / 100) * duration;
        this.updateTimeLabels(targetTime, duration);
      });

      const handleRelease = (e) => {
        if (this.isDraggingScrubber) {
          this.isDraggingScrubber = false;
          const val = parseFloat(slider.value);
          const duration = state.data.duration || 1;
          const seekTo = (val / 100) * duration;
          audioEngine.seek(seekTo);
        }
      };

      slider.addEventListener("mouseup", handleRelease);
      slider.addEventListener("touchend", handleRelease);
    };

    setupScrubber(document.getElementById("np-scrubber"));
    setupScrubber(document.getElementById("mini-scrubber"), true);

    // Control de volumen
    const volSlider = document.getElementById("volume-slider");
    if (volSlider) {
      volSlider.value = state.data.volume;
      volSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        audioEngine.setVolume(val);
        state.setVolume(val);
        this.updateVolumeIcon(val, state.data.isMuted);
      });
    }

    const btnMute = document.getElementById("btn-toggle-mute");
    if (btnMute) {
      btnMute.addEventListener("click", () => {
        state.toggleMute();
        audioEngine.setMuted(state.data.isMuted);
        this.updateVolumeIcon(state.data.volume, state.data.isMuted);
      });
    }

    // Botones de acceso a Letras y Cola desde el reproductor
    document.querySelectorAll(".btn-shortcut-lyrics").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.toggleNowPlayingModal(false);
        state.navigateTo("lyrics");
      });
    });

    document.querySelectorAll(".btn-shortcut-queue").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.toggleNowPlayingModal(false);
        state.navigateTo("queue");
      });
    });

    // Temporizador de apagado (Sleep timer modal trigger)
    document.querySelectorAll(".btn-shortcut-sleep").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.emit("modal:sleepTimer");
      });
    });

    // Toggle modo visualizador vs carátula en Now Playing
    const stageContainer = document.getElementById("np-stage");
    if (stageContainer) {
      stageContainer.addEventListener("click", () => {
        state.data.isVisualizerMode = !state.data.isVisualizerMode;
        const canvas = document.getElementById("np-visualizer-canvas");
        const coverWrap = document.getElementById("np-cover-wrap");
        if (canvas) canvas.style.display = state.data.isVisualizerMode ? "block" : "none";
        if (coverWrap) coverWrap.classList.toggle("spinning-disc", !state.data.isVisualizerMode && state.data.isPlaying);
      });
    }

    // Estado inicial de botones
    this.updatePlayerUI(state.data.currentSong);
  },

  updatePlayerUI(song) {
    if (!song) return;

    // Actualizar mini-player
    const miniTitle = document.getElementById("mini-track-title");
    const miniArtist = document.getElementById("mini-track-artist");
    const miniCover = document.getElementById("mini-track-cover");
    if (miniTitle) miniTitle.textContent = song.title;
    if (miniArtist) miniArtist.textContent = song.artist;
    if (miniCover) miniCover.src = song.cover;

    // Actualizar Now Playing completo
    const npTitle = document.getElementById("np-track-title");
    const npArtist = document.getElementById("np-track-artist");
    const npAlbum = document.getElementById("np-track-album");
    const npCover = document.getElementById("np-track-cover");
    if (npTitle) npTitle.textContent = song.title;
    if (npArtist) npArtist.textContent = song.artist;
    if (npAlbum) npAlbum.textContent = song.album;
    if (npCover) npCover.src = song.cover;

    // Actualizar fondo difuminado
    const npBackdrop = document.querySelector(".np-backdrop-glow");
    if (npBackdrop && song.colors) {
      npBackdrop.style.background = `radial-gradient(circle at 50% 35%, ${song.colors.glow} 0%, transparent 70%)`;
    }

    this.updateLikeButtons(state.isLiked(song.id));
    this.updateTimeLabels(0, song.duration);
  },

  updatePlayPauseButtons(isPlaying) {
    const playSvg = `<polygon points="6 4 20 12 6 20 6 4"/>`;
    const pauseSvg = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;

    document.querySelectorAll(".btn-toggle-play").forEach(btn => {
      const svg = btn.querySelector("svg");
      if (svg) svg.innerHTML = isPlaying ? pauseSvg : playSvg;
    });

    const coverWrap = document.getElementById("np-cover-wrap");
    if (coverWrap && !state.data.isVisualizerMode) {
      coverWrap.classList.toggle("spinning-disc", isPlaying);
    }
  },

  updateProgressUI(currentTime, duration) {
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const miniFill = document.getElementById("mini-progress-fill");
    if (miniFill) miniFill.style.width = `${percent}%`;

    const npScrubber = document.getElementById("np-scrubber");
    if (npScrubber) npScrubber.value = percent;

    this.updateTimeLabels(currentTime, duration);
  },

  updateTimeLabels(currentTime, duration) {
    const formatTime = (sec) => {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${String(s).padStart(2, "0")}`;
    };

    const curLabel = document.getElementById("np-time-current");
    const durLabel = document.getElementById("np-time-duration");
    if (curLabel) curLabel.textContent = formatTime(currentTime);
    if (durLabel) durLabel.textContent = formatTime(duration);
  },

  updateLikeButtons(isLiked) {
    document.querySelectorAll(".btn-player-like").forEach(btn => {
      btn.classList.toggle("active", isLiked);
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", isLiked ? "currentColor" : "none");
    });
  },

  updateShuffleButtons(isShuffled) {
    document.querySelectorAll(".btn-toggle-shuffle").forEach(btn => {
      btn.classList.toggle("active", isShuffled);
    });
  },

  updateRepeatButtons(mode) {
    document.querySelectorAll(".btn-toggle-repeat").forEach(btn => {
      btn.classList.toggle("active", mode !== "off");
      const badge = btn.querySelector(".repeat-one-badge");
      if (badge) badge.style.display = mode === "one" ? "block" : "none";
    });
  },

  updateVolumeIcon(vol, isMuted) {
    const btnMute = document.getElementById("btn-toggle-mute");
    if (!btnMute) return;
    const svg = btnMute.querySelector("svg");
    if (!svg) return;

    if (isMuted || vol === 0) {
      svg.innerHTML = `<line x1="1" y1="1" x2="23" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>`;
    } else if (vol < 0.5) {
      svg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    } else {
      svg.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    }
  },

  updateSleepTimerBadge(remainingSeconds) {
    document.querySelectorAll(".btn-shortcut-sleep").forEach(btn => {
      let badge = btn.querySelector(".sleep-timer-badge");
      if (remainingSeconds && remainingSeconds > 0) {
        const m = Math.ceil(remainingSeconds / 60);
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "sleep-timer-badge";
          btn.appendChild(badge);
        }
        badge.textContent = `${m}m`;
        badge.style.display = "block";
      } else if (badge) {
        badge.style.display = "none";
      }
    });
  },

  startVisualizer() {
    const canvas = document.getElementById("np-visualizer-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const renderFrame = () => {
      this.visualizerAnimId = requestAnimationFrame(renderFrame);

      if (!state.data.isVisualizerMode || !state.data.isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const dataArray = audioEngine.getVisualizerData();
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Dibujar barras circulares de espectro reactivo alrededor del centro
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 110;
      const bars = 48;
      const step = Math.floor(dataArray.length / bars);

      ctx.save();
      for (let i = 0; i < bars; i++) {
        const val = dataArray[i * step] || 0;
        const barHeight = (val / 255) * 60;
        const angle = (i / bars) * Math.PI * 2;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba(0, 242, 254, 0.2)");
        grad.addColorStop(1, "rgba(0, 242, 254, 0.85)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    };

    renderFrame();
  }
};
