// RhythmBox - Integración con MediaSession API (Pantalla de bloqueo y controles del sistema)

export const mediaSessionManager = {
  init(callbacks) {
    if (!("mediaSession" in navigator)) return;

    this.callbacks = callbacks;

    try {
      navigator.mediaSession.setActionHandler("play", () => {
        if (this.callbacks.onPlay) this.callbacks.onPlay();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        if (this.callbacks.onPause) this.callbacks.onPause();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (this.callbacks.onPrevious) this.callbacks.onPrevious();
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (this.callbacks.onNext) this.callbacks.onNext();
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (this.callbacks.onSeek && details.seekTime !== undefined) {
          this.callbacks.onSeek(details.seekTime);
        }
      });
    } catch (e) {
      console.warn("MediaSession handlers warning:", e);
    }
  },

  updateMetadata(song) {
    if (!("mediaSession" in navigator) || !song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: [
        { src: song.cover, sizes: "512x512", type: "image/svg+xml" }
      ]
    });
  },

  updatePlaybackState(isPlaying) {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  },

  updatePositionState(currentTime, duration) {
    if (!("mediaSession" in navigator) || !("setPositionState" in navigator.mediaSession)) return;
    if (duration <= 0 || isNaN(duration) || isNaN(currentTime)) return;

    try {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: Math.min(currentTime, duration)
      });
    } catch {
      // Silenciar inconsistencias temporales en actualizaciones rápidas
    }
  }
};
