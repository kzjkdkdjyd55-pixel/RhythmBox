// RhythmBox - Vista de Cola de Reproducción (Queue View)

import { state } from "../state.js";
import { mockSongs } from "../data/songs.js";

export const queueView = {
  dragSrcIndex: null,

  render(container) {
    const t = state.t.bind(state);
    const current = state.data.currentSong;
    const queue = state.data.queue;
    const history = state.data.history;

    container.innerHTML = `
      <div class="queue-header-actions">
        <h1 class="home-section-title">${t("queue")} (${queue.length})</h1>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-save-queue-pl" style="font-size: 12px; padding: 6px 14px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            ${t("saveAsPlaylist")}
          </button>
          <button class="btn btn-secondary" id="btn-clear-queue" style="font-size: 12px; padding: 6px 14px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            ${t("clearQueue")}
          </button>
        </div>
      </div>

      <!-- Pista en Reproducción Actual -->
      ${current ? `
        <div class="home-section">
          <span class="customizer-label">${t("currentSong")}</span>
          <div class="queue-current-card">
            <img class="queue-current-cover" src="${current.cover}" alt="${current.title}"/>
            <div style="flex: 1; min-width: 0;">
              <h3 style="font-size: 16px; font-weight: 800; color: var(--text-primary);">${current.title}</h3>
              <p style="font-size: 13px; color: var(--accent-primary); font-weight: 600;">${current.artist}</p>
              <span style="font-size: 11px; color: var(--text-tertiary);">${current.album}</span>
            </div>
            <div class="eq-bars-indicator" style="margin-right: 12px;">
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
              <span class="eq-bar"></span>
            </div>
            <div style="font-size: 13px; color: var(--text-tertiary); font-variant-numeric: tabular-nums;">
              ${Math.floor(current.duration / 60)}:${String(current.duration % 60).padStart(2, "0")}
            </div>
          </div>
        </div>
      ` : ""}

      <!-- Lista Reordenable de Canciones Próximas (Drag & Drop) -->
      <div class="home-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="customizer-label" style="margin-bottom: 0;">${t("upNext")}</span>
          <span style="font-size: 11px; color: var(--text-tertiary); font-weight: 500;">${t("dragToReorder")}</span>
        </div>
        <div class="queue-list" id="reorderable-queue-list">
          ${queue.map((song, idx) => `
            <div class="queue-item ${song.id === current?.id ? 'drag-current' : ''}" draggable="true" data-index="${idx}">
              <div class="drag-handle" title="${t("dragToReorder")}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
              </div>
              <img class="track-cover" src="${song.cover}" alt="${song.title}" style="width: 38px; height: 38px;"/>
              <div class="track-details" style="cursor: pointer;" data-play-queue-index="${idx}">
                <div class="track-title" style="font-size: 13px;">${song.title}</div>
                <div class="track-artist" style="font-size: 11px;">${song.artist}</div>
              </div>
              <div class="track-duration">${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}</div>
              <button class="btn-icon btn-like-track ${state.isLiked(song.id) ? 'active' : ''}" data-like-song="${song.id}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="${state.isLiked(song.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button class="btn-icon btn-remove-queue" data-remove-queue-index="${idx}" title="${t("removeFromQueue")}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Historial de Sesión -->
      ${history.length > 0 ? `
        <div class="home-section" style="margin-top: 36px;">
          <span class="customizer-label">${t("history")}</span>
          <div class="track-list">
            ${history.map(song => `
              <div class="track-row" data-play-song="${song.id}">
                <img class="track-cover" src="${song.cover}" alt="${song.title}"/>
                <div class="track-details">
                  <div class="track-title">${song.title}</div>
                  <div class="track-artist">${song.artist}</div>
                </div>
                <div class="track-album">${song.album}</div>
                <div class="track-duration">${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}</div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    // Vaciar cola
    const btnClear = container.querySelector("#btn-clear-queue");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        state.clearQueue();
        this.render(container);
      });
    }

    // Guardar cola como playlist
    const btnSave = container.querySelector("#btn-save-queue-pl");
    if (btnSave) {
      btnSave.addEventListener("click", () => {
        const songIds = state.data.queue.map(s => s.id);
        const name = "Cola del " + new Date().toLocaleDateString();
        state.createPlaylist(name, "Playlist guardada desde la cola de reproducción.", songIds);
        alert(state.t("cardGenerated") + ": " + name);
      });
    }

    // Reproducir desde la cola al hacer clic
    container.querySelectorAll("[data-play-queue-index]").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-play-queue-index"), 10);
        const target = state.data.queue[idx];
        if (target) state.setCurrentSong(target, true);
      });
    });

    // Eliminar de la cola
    container.querySelectorAll("[data-remove-queue-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-remove-queue-index"), 10);
        state.removeFromQueue(idx);
        this.render(container);
      });
    });

    // Like
    container.querySelectorAll("[data-like-song]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const songId = btn.getAttribute("data-like-song");
        const isNowLiked = state.toggleLike(songId);
        btn.classList.toggle("active", isNowLiked);
        const svg = btn.querySelector("svg");
        if (svg) svg.setAttribute("fill", isNowLiked ? "currentColor" : "none");
      });
    });

    // Implementación de Drag & Drop para reordenar
    const list = container.querySelector("#reorderable-queue-list");
    if (list) {
      let items = list.querySelectorAll(".queue-item");
      items.forEach(item => {
        item.addEventListener("dragstart", (e) => {
          this.dragSrcIndex = parseInt(item.getAttribute("data-index"), 10);
          item.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });

        item.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          item.classList.add("drag-over");
        });

        item.addEventListener("dragleave", () => {
          item.classList.remove("drag-over");
        });

        item.addEventListener("drop", (e) => {
          e.preventDefault();
          item.classList.remove("drag-over");
          const targetIndex = parseInt(item.getAttribute("data-index"), 10);
          if (this.dragSrcIndex !== null && this.dragSrcIndex !== targetIndex) {
            state.reorderQueue(this.dragSrcIndex, targetIndex);
            this.render(container);
          }
        });

        item.addEventListener("dragend", () => {
          item.classList.remove("dragging");
          list.querySelectorAll(".queue-item").forEach(i => i.classList.remove("drag-over"));
        });
      });
    }
  }
};
