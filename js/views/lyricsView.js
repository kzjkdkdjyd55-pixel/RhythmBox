// RhythmBox - Vista de Letras Sincronizadas, Karaoke Avanzado y Personalizador Visual
// CARACTERÍSTICA ESTRELLA DE RHYTHMBOX

import { state } from "../state.js";
import { audioEngine } from "../audio/engine.js";
import { lyricsCardGen } from "../utils/lyricsCardGen.js";

export const lyricsView = {
  activeLineIndex: -1,
  userScrolled: false,
  scrollTimeout: null,

  render(container) {
    const t = state.t.bind(state);
    const song = state.data.currentSong;
    const config = state.data.lyricsConfig;

    if (!song) {
      container.innerHTML = `<div class="static-lyrics-container"><h3>${t("empty")}</h3></div>`;
      return;
    }

    // Configurar variables CSS locales del personalizador
    this.applyConfigToStyles(config, song);

    container.innerHTML = `
      <div id="lyrics-view-wrapper" class="lyrics-bg-${config.bgStyle} lyrics-align-${config.fontAlign} lyrics-font-${config.fontFamily} lyrics-transition-${config.transitionStyle} ${config.distractionFree ? 'distraction-free-mode' : ''}">
        
        <!-- Barra Superior de Herramientas -->
        <div class="lyrics-toolbar">
          <div class="lyrics-song-badge">
            <img class="lyrics-song-cover" src="${song.cover}" alt="${song.title}"/>
            <div class="lyrics-song-info">
              <span class="lyrics-song-title">${song.title}</span>
              <span class="lyrics-song-artist">${song.artist}</span>
            </div>
          </div>

          <div class="lyrics-toolbar-actions">
            <!-- Toggle Modo Karaoke -->
            <button class="chip-btn ${config.karaokeMode ? 'active' : ''}" id="btn-toggle-karaoke-mode" title="${t("karaokeMode")}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              ${t("karaokeMode")}
            </button>

            <!-- Personalizador Visual (Abre Modal de Ajustes de Letra) -->
            <button class="btn btn-secondary" id="btn-open-lyrics-customizer" style="font-size: 12px; padding: 6px 14px;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ${t("lyricsCustomizer")}
            </button>

            <!-- Modo Solo Letras (Zen) -->
            <button class="btn btn-secondary" id="btn-toggle-distraction-free" style="font-size: 12px; padding: 6px 14px;" title="${t("distractionFree")}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              ${config.distractionFree ? t("exitDistractionFree") : t("distractionFree")}
            </button>
          </div>
        </div>

        <!-- Contenedor Principal de Letras -->
        <div class="lyrics-scroll-container" id="lyrics-lines-container">
          ${song.hasSyncedLyrics && song.lyrics && song.lyrics.length > 0 
            ? this.renderSyncedLines(song.lyrics, config)
            : this.renderStaticOrEmpty(song)
          }
        </div>
      </div>
    `;

    this.attachEvents(container, song);
    this.syncWithAudio(song);
  },

  renderSyncedLines(lyrics, config) {
    return lyrics.map((line, lineIdx) => {
      // Si la línea tiene tokens de palabras para karaoke
      let innerContent = "";
      if (config.karaokeMode && line.words && line.words.length > 0) {
        innerContent = line.words.map((w, wIdx) => `
          <span class="karaoke-word" data-word-idx="${wIdx}" data-start="${w.start}" data-end="${w.end}">${w.word}</span>
        `).join("");
      } else {
        innerContent = `<span>${line.text}</span>`;
      }

      return `
        <div class="lyric-line" data-line-index="${lineIdx}" data-time="${line.time}">
          ${innerContent}
          <button class="lyric-share-btn" data-share-lyric="${line.text}" title="Compartir como tarjeta">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Tarjeta
          </button>
        </div>
      `;
    }).join("");
  },

  renderStaticOrEmpty(song) {
    const t = state.t.bind(state);

    if (song.staticLyricsText) {
      return `
        <div class="static-lyrics-container">
          <span class="customizer-label">${t("staticLyrics")}</span>
          <p class="static-lyrics-text">${song.staticLyricsText}</p>
          <div class="static-actions-row">
            <button class="btn btn-secondary" id="btn-report-lyrics">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              ${t("reportLyrics")}
            </button>
            <button class="btn btn-primary" id="btn-contribute-sync">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              ${t("contributeSync")}
            </button>
          </div>
        </div>
      `;
    }

    // Pista Instrumental
    return `
      <div class="static-lyrics-container">
        <svg class="empty-lyrics-illustration" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary);">Pista Instrumental</h3>
        <p class="static-lyrics-text" style="color: var(--text-tertiary);">Esta canción no contiene partes vocales conocidas. Disfruta de la atmósfera sonora pura.</p>
      </div>
    `;
  },

  applyConfigToStyles(config, song) {
    const root = document.documentElement;
    root.style.setProperty("--lyrics-font-size", `${config.fontSize || 26}px`);
    root.style.setProperty("--current-cover-url", `url('${song.cover}')`);

    // Colores de texto activo
    if (config.textColorMode === "neon") {
      root.style.setProperty("--lyrics-active-color", "var(--accent-primary)");
      root.style.setProperty("--lyrics-glow-color", "var(--accent-glow)");
    } else if (config.textColorMode === "dynamic") {
      root.style.setProperty("--lyrics-active-color", song.colors ? song.colors.accent : "var(--accent-primary)");
      root.style.setProperty("--lyrics-glow-color", song.colors ? song.colors.glow : "var(--accent-glow)");
    } else {
      // Alto contraste
      root.style.setProperty("--lyrics-active-color", "#ffffff");
      root.style.setProperty("--lyrics-glow-color", "rgba(255, 255, 255, 0.4)");
    }
  },

  syncWithAudio(song) {
    if (!song.hasSyncedLyrics || !song.lyrics) return;

    // Escuchar el progreso de reproducción
    this.progressUnsub = state.on("progress:updated", ({ currentTime }) => {
      this.updateActiveLine(currentTime, song.lyrics);
    });
  },

  updateActiveLine(currentTime, lyrics) {
    let currentIdx = -1;

    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        currentIdx = i;
      } else {
        break;
      }
    }

    if (currentIdx !== this.activeLineIndex) {
      this.activeLineIndex = currentIdx;

      // Actualizar clases de líneas en el DOM
      const container = document.getElementById("lyrics-lines-container");
      if (!container) return;

      const lines = container.querySelectorAll(".lyric-line");
      lines.forEach((lineEl, idx) => {
        const isActive = idx === currentIdx;
        lineEl.classList.toggle("active", isActive);

        // Si es la línea activa y el usuario no está desplazándose manualmente, hacer scroll centrado suave
        if (isActive && !this.userScrolled) {
          lineEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }

    // Actualizar karaoke progresivo palabra por palabra dentro de la línea activa
    if (currentIdx >= 0 && state.data.lyricsConfig.karaokeMode) {
      const activeLineEl = document.querySelector(`.lyric-line[data-line-index="${currentIdx}"]`);
      if (activeLineEl) {
        const wordEls = activeLineEl.querySelectorAll(".karaoke-word");
        wordEls.forEach(wEl => {
          const start = parseFloat(wEl.getAttribute("data-start"));
          const end = parseFloat(wEl.getAttribute("data-end"));

          if (currentTime >= end) {
            wEl.classList.add("completed");
            wEl.classList.remove("active-word");
            wEl.style.setProperty("--word-progress", "100%");
          } else if (currentTime >= start && currentTime < end) {
            wEl.classList.add("active-word");
            wEl.classList.remove("completed");
            const progress = ((currentTime - start) / (end - start)) * 100;
            wEl.style.setProperty("--word-progress", `${progress}%`);
          } else {
            wEl.classList.remove("completed", "active-word");
            wEl.style.setProperty("--word-progress", "0%");
          }
        });
      }
    }
  },

  attachEvents(container, song) {
    // Clic en cualquier línea para saltar (seek) a esa parte de la canción
    container.querySelectorAll(".lyric-line").forEach(lineEl => {
      lineEl.addEventListener("click", (e) => {
        if (e.target.closest(".lyric-share-btn")) return;
        const seekTime = parseFloat(lineEl.getAttribute("data-time"));
        audioEngine.seek(seekTime);
        if (!state.data.isPlaying) audioEngine.play();
      });
    });

    // Compartir fragmento de letra como tarjeta visual
    container.querySelectorAll("[data-share-lyric]").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const lyricText = btn.getAttribute("data-share-lyric");
        state.emit("modal:shareLyricsCard", {
          lyricText,
          songTitle: song.title,
          artistName: song.artist,
          coverUrl: song.cover,
          accentColor: song.colors ? song.colors.accent : "#00f2fe"
        });
      });
    });

    // Toggle Karaoke Mode
    const btnKaraoke = container.querySelector("#btn-toggle-karaoke-mode");
    if (btnKaraoke) {
      btnKaraoke.addEventListener("click", () => {
        const newMode = !state.data.lyricsConfig.karaokeMode;
        state.updateLyricsConfig({ karaokeMode: newMode });
        this.render(container);
      });
    }

    // Abrir Modal de Personalización de Letras
    const btnCustomizer = container.querySelector("#btn-open-lyrics-customizer");
    if (btnCustomizer) {
      btnCustomizer.addEventListener("click", () => {
        state.emit("modal:lyricsCustomizer");
      });
    }

    // Toggle Modo Solo Letras (Zen)
    const btnZen = container.querySelector("#btn-toggle-distraction-free");
    if (btnZen) {
      btnZen.addEventListener("click", () => {
        const isZen = !state.data.lyricsConfig.distractionFree;
        state.updateLyricsConfig({ distractionFree: isZen });
        const wrapper = container.querySelector("#lyrics-view-wrapper");
        if (wrapper) wrapper.classList.toggle("distraction-free-mode", isZen);
        btnZen.innerHTML = isZen ? state.t("exitDistractionFree") : state.t("distractionFree");
      });
    }

    // Detección de scroll manual del usuario (para pausar temporalmente el autoscroll)
    const scrollContainer = container.querySelector("#lyrics-lines-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", () => {
        this.userScrolled = true;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.userScrolled = false;
        }, 3500); // Reanudar centrado automático tras 3.5 segundos de inactividad
      }, { passive: true });
    }

    // Botones de reporte y contribución
    const btnReport = container.querySelector("#btn-report-lyrics");
    if (btnReport) {
      btnReport.addEventListener("click", () => {
        alert("¡Gracias! Tu reporte ha sido registrado para revisión por la comunidad de RhythmBox.");
      });
    }

    const btnContribute = container.querySelector("#btn-contribute-sync");
    if (btnContribute) {
      btnContribute.addEventListener("click", () => {
        alert("Editor de sincronización LRC: Puedes subir o editar marcas de tiempo [mm:ss.xx] para esta canción.");
      });
    }
  }
};
