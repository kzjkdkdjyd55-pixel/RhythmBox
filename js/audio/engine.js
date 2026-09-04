// RhythmBox - Motor de Audio Principal (Web Audio API)
// Gestiona el contexto de audio, ecualizador gráfico de 10 bandas, visualizador y sintetizador

import { SongSynthesizer } from "./synthesizer.js";

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  rock: [4.5, 3.0, 1.5, -0.5, -2.0, -1.0, 1.5, 3.0, 4.0, 4.5],
  pop: [-1.0, 1.0, 2.5, 3.5, 3.0, 1.0, -1.0, 1.5, 3.0, 3.5],
  electronic: [5.0, 4.0, 2.0, 0.0, -2.0, 1.0, 2.5, 3.5, 4.5, 5.0],
  jazz: [3.0, 2.0, 1.0, 1.5, -1.5, -1.5, 0.0, 1.5, 2.5, 3.0],
  bassBoost: [7.0, 6.0, 4.5, 2.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  vocal: [-2.0, -2.0, -1.0, 1.5, 4.0, 4.5, 3.5, 2.0, 0.5, -1.0],
  acoustic: [3.5, 2.5, 1.5, 1.0, 0.5, 1.0, 2.0, 3.0, 3.5, 3.0]
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;

    // Nodos de audio
    this.synthBus = null;
    this.eqFilters = [];
    this.analyser = null;
    this.masterGain = null;

    // Sintetizador adaptativo
    this.synthesizer = null;

    // Estado de reproducción
    this.isPlaying = false;
    this.currentSong = null;
    this.duration = 0;
    this.volume = 0.85;
    this.isMuted = false;
    this.crossfadeTime = 2; // segundos

    // Temporizador de apagado (Sleep Timer)
    this.sleepTimerMinutes = 0;
    this.sleepTimerEndTimestamp = null;
    this.sleepTimerInterval = null;
    this.onSleepTimerTick = null;
    this.onSleepTimerEnd = null;

    // Callbacks de eventos
    this.onTimeUpdate = null;
    this.onSongEnd = null;
    this.onStateChange = null;

    // Bucle de actualización de progreso
    this.progressInterval = null;
  }

  initContext() {
    if (this.isInitialized) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // 1. Bus de entrada
    this.synthBus = this.ctx.createGain();

    // 2. Filtros del ecualizador gráfico de 10 bandas
    this.eqFilters = EQ_FREQUENCIES.map((freq, index) => {
      const filter = this.ctx.createBiquadFilter();
      if (index === 0) {
        filter.type = "lowshelf";
      } else if (index === EQ_FREQUENCIES.length - 1) {
        filter.type = "highshelf";
      } else {
        filter.type = "peaking";
        filter.Q.value = 1.4;
      }
      filter.frequency.value = freq;
      filter.gain.value = 0;
      return filter;
    });

    // Encadenar filtros en serie
    this.synthBus.connect(this.eqFilters[0]);
    for (let i = 0; i < this.eqFilters.length - 1; i++) {
      this.eqFilters[i].connect(this.eqFilters[i + 1]);
    }

    // 3. Analizador de audio para visualizadores a 60fps
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;
    this.eqFilters[this.eqFilters.length - 1].connect(this.analyser);

    // 4. Ganancia maestra (Volumen)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    this.analyser.connect(this.masterGain);

    // 5. Destino de audio (Altavoces / Auriculares)
    this.masterGain.connect(this.ctx.destination);

    // 6. Instanciar sintetizador adaptativo
    this.synthesizer = new SongSynthesizer(this.ctx, this.synthBus);

    // 7. Elemento HTML5 Audio para archivos de música local (MP3, WAV, FLAC, OGG)
    this.audioEl = new Audio();
    this.audioEl.crossOrigin = "anonymous";
    this.audioElSource = this.ctx.createMediaElementSource(this.audioEl);
    this.audioElSource.connect(this.synthBus);

    this.audioEl.onended = () => {
      if (this.onSongEnd) {
        this.onSongEnd();
      }
    };

    this.isInitialized = true;
  }

  async resumeContext() {
    if (!this.isInitialized) this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  loadSong(song, autoPlay = true) {
    this.initContext();
    this.currentSong = song;
    this.duration = song.duration;

    if (song.audioUrl) {
      if (this.synthesizer) this.synthesizer.stop();
      this.audioEl.src = song.audioUrl;
      this.audioEl.currentTime = 0;
    } else {
      try {
        this.audioEl.pause();
        this.audioEl.removeAttribute("src");
      } catch {}
      this.synthesizer.loadSong(song, 0);
    }

    if (autoPlay) {
      this.play();
    } else {
      this.updateState();
    }
  }

  async play() {
    await this.resumeContext();
    if (!this.currentSong) return;

    if (this.currentSong.audioUrl) {
      try {
        await this.audioEl.play();
      } catch (err) {
        console.warn("Reproducción de archivo bloqueada por navegador:", err);
      }
    } else {
      this.synthesizer.play();
    }
    this.isPlaying = true;

    this.startProgressTracking();
    this.updateState();
  }

  pause() {
    if (!this.isPlaying) return;

    if (this.currentSong?.audioUrl) {
      this.audioEl.pause();
    } else if (this.synthesizer) {
      this.synthesizer.pause();
    }
    this.isPlaying = false;
    this.stopProgressTracking();
    this.updateState();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(seconds) {
    if (!this.currentSong) return;
    const clamped = Math.max(0, Math.min(seconds, this.duration));

    if (this.currentSong.audioUrl) {
      this.audioEl.currentTime = clamped;
    } else if (this.synthesizer) {
      this.synthesizer.seek(clamped);
    }

    if (this.onTimeUpdate) {
      this.onTimeUpdate(clamped, this.duration);
    }
  }

  getCurrentTime() {
    if (this.currentSong?.audioUrl) {
      return this.audioEl.currentTime || 0;
    }
    if (!this.synthesizer) return 0;
    return this.synthesizer.getCurrentTime();
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  // Configuración del ecualizador
  setEqGains(gainsArray) {
    if (!this.eqFilters || !this.ctx) return;
    gainsArray.forEach((gainVal, idx) => {
      if (this.eqFilters[idx]) {
        this.eqFilters[idx].gain.setValueAtTime(gainVal, this.ctx.currentTime);
      }
    });
  }

  applyEqPreset(presetName) {
    const preset = EQ_PRESETS[presetName];
    if (preset) {
      this.setEqGains(preset);
      return [...preset];
    }
    return null;
  }

  // Datos para visualizador de frecuencias (Canvas)
  getVisualizerData() {
    if (!this.analyser) return new Uint8Array(64);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // Temporizador de apagado (Sleep timer)
  setSleepTimer(minutes) {
    clearInterval(this.sleepTimerInterval);
    this.sleepTimerMinutes = minutes;

    if (minutes <= 0) {
      this.sleepTimerEndTimestamp = null;
      if (this.onSleepTimerTick) this.onSleepTimerTick(null);
      return;
    }

    const durationMs = minutes * 60 * 1000;
    this.sleepTimerEndTimestamp = Date.now() + durationMs;

    this.sleepTimerInterval = setInterval(() => {
      const remainingMs = this.sleepTimerEndTimestamp - Date.now();
      if (remainingMs <= 0) {
        clearInterval(this.sleepTimerInterval);
        this.sleepTimerEndTimestamp = null;
        // Desvanecimiento suave de volumen antes de pausar
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3);
          setTimeout(() => {
            this.pause();
            this.setVolume(this.volume); // Restaurar volumen original
            if (this.onSleepTimerEnd) this.onSleepTimerEnd();
          }, 3100);
        } else {
          this.pause();
        }
        if (this.onSleepTimerTick) this.onSleepTimerTick(null);
      } else {
        const remainingSec = Math.ceil(remainingMs / 1000);
        if (this.onSleepTimerTick) this.onSleepTimerTick(remainingSec);
      }
    }, 1000);
  }

  startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = setInterval(() => {
      const currentTime = this.getCurrentTime();

      if (this.onTimeUpdate) {
        this.onTimeUpdate(currentTime, this.duration);
      }

      // Comprobar si la canción ha terminado
      if (currentTime >= this.duration && this.duration > 0) {
        if (this.onSongEnd) {
          this.onSongEnd();
        }
      }
    }, 100); // 10 actualizaciones por segundo para alta precisión en letras y scrubber
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  updateState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        currentSong: this.currentSong,
        currentTime: this.getCurrentTime(),
        duration: this.duration,
        volume: this.volume,
        isMuted: this.isMuted
      });
    }
  }
}

export const audioEngine = new AudioEngine();
