// RhythmBox - Vista de Biblioteca (Library View)

import { state } from "../state.js";
import { mockSongs, mockAlbums, mockArtists } from "../data/songs.js";
import { defaultPlaylists } from "../data/playlists.js";

export const libraryView = {
  activeTab: "songs", // 'all' | 'songs' | 'albums' | 'artists' | 'playlists' | 'downloads'
  sortBy: "alpha", // 'alpha' | 'recent' | 'plays'

  render(container) {
    const t = state.t.bind(state);

    container.innerHTML = `
      <div class="library-header">
        <div class="library-filters">
          <button class="chip-btn ${this.activeTab === 'all' ? 'active' : ''}" data-tab="all">${t("all")}</button>
          <button class="chip-btn ${this.activeTab === 'songs' ? 'active' : ''}" data-tab="songs">${t("songs")}</button>
          <button class="chip-btn ${this.activeTab === 'albums' ? 'active' : ''}" data-tab="albums">${t("albums")}</button>
          <button class="chip-btn ${this.activeTab === 'artists' ? 'active' : ''}" data-tab="artists">${t("artists")}</button>
          <button class="chip-btn ${this.activeTab === 'playlists' ? 'active' : ''}" data-tab="playlists">${t("playlists")}</button>
          <button class="chip-btn ${this.activeTab === 'downloads' ? 'active' : ''}" data-tab="downloads">${t("downloads")}</button>
        </div>

        <div class="library-sort-wrap">
          <label class="setting-desc" for="sort-select">${t("sortBy")}:</label>
          <select id="sort-select" class="select-custom">
            <option value="alpha" ${this.sortBy === 'alpha' ? 'selected' : ''}>${t("sortAlpha")}</option>
            <option value="recent" ${this.sortBy === 'recent' ? 'selected' : ''}>${t("sortRecent")}</option>
            <option value="plays" ${this.sortBy === 'plays' ? 'selected' : ''}>${t("sortPlays")}</option>
          </select>
          <button class="btn btn-primary" id="btn-open-create-playlist">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            ${t("createPlaylist")}
          </button>
        </div>
      </div>

      <div id="library-content-area">
        ${this.renderTabContent()}
      </div>
    `;

    this.attachEvents(container);
  },

  renderTabContent() {
    const t = state.t.bind(state);

    if (this.activeTab === "songs") {
      let songs = state.getAllSongs();
      if (this.sortBy === "alpha") songs.sort((a, b) => a.title.localeCompare(b.title));
      else if (this.sortBy === "plays") songs.sort((a, b) => (b.plays || 0) - (a.plays || 0));

      return `
        <div class="track-list">
          ${songs.map((song, idx) => `
            <div class="track-row ${state.data.currentSong?.id === song.id ? 'active' : ''}" data-play-song="${song.id}">
              <div class="track-index">
                <span class="track-index-num">${idx + 1}</span>
                <svg class="track-play-icon" viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>
              </div>
              <img class="track-cover" src="${song.cover}" alt="${song.title}" loading="lazy"/>
              <div class="track-details">
                <div class="track-title">${song.title}</div>
                <div class="track-artist">${song.artist}</div>
              </div>
              <div class="track-album">${song.album}</div>
              <button class="btn-icon btn-like-track ${state.isLiked(song.id) ? 'active' : ''}" data-like-song="${song.id}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="${state.isLiked(song.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <div class="track-duration">${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}</div>
              <button class="btn-icon btn-more-track" data-more-song="${song.id}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
              </button>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (this.activeTab === "albums") {
      let albums = [...mockAlbums];
      if (this.sortBy === "alpha") albums.sort((a, b) => a.title.localeCompare(b.title));

      return `
        <div class="card-grid">
          ${albums.map(alb => `
            <div class="media-card" data-view-detail="album" data-id="${alb.id}">
              <div class="media-card-cover-wrap">
                <img class="media-card-cover" src="${alb.cover}" alt="${alb.title}" loading="lazy"/>
              </div>
              <div class="media-card-title">${alb.title}</div>
              <div class="media-card-subtitle">${alb.artistName} • ${alb.year}</div>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (this.activeTab === "artists") {
      let artists = [...mockArtists];
      if (this.sortBy === "alpha") artists.sort((a, b) => a.name.localeCompare(b.name));

      return `
        <div class="card-grid">
          ${artists.map(art => `
            <div class="media-card artist-card" data-view-detail="artist" data-id="${art.id}">
              <div class="media-card-cover-wrap">
                <img class="media-card-cover" src="${art.avatar}" alt="${art.name}" loading="lazy"/>
              </div>
              <div class="media-card-title">${art.name}</div>
              <div class="media-card-subtitle">${art.monthlyListeners} ${t("followers")}</div>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (this.activeTab === "playlists") {
      const allPlaylists = [...state.data.userPlaylists, ...defaultPlaylists];
      return `
        <div class="card-grid">
          ${allPlaylists.map(pl => `
            <div class="media-card" data-view-detail="playlist" data-id="${pl.id}">
              <div class="media-card-cover-wrap">
                <img class="media-card-cover" src="${pl.cover || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 300\' width=\'100%\' height=\'100%\'><rect width=\'300\' height=\'300\' fill=\'%23111420\'/><text x=\'50%27 y=\'50%27 fill=\'%2300f2fe\' font-size=\'40\' text-anchor=\'middle\'>PLAYLIST</text></svg>'}" alt="${pl.title}" loading="lazy"/>
              </div>
              <div class="media-card-title">${pl.title}</div>
              <div class="media-card-subtitle">${pl.songIds ? pl.songIds.length : 0} ${t("tracksCount")}</div>
            </div>
          `).join("")}
        </div>
      `;
    }

    if (this.activeTab === "downloads") {
      const localTracks = state.data.localTracks || [];

      return `
        <!-- Zona de Importación y Arrastre de Archivos Locales / Descargas -->
        <div class="local-import-dropzone" id="local-music-dropzone">
          <input type="file" id="local-audio-file-input" multiple accept="audio/*,.mp3,.wav,.flac,.ogg,.m4a,.aac" style="display: none;" />
          <div class="dropzone-icon-wrap">
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3 style="font-size: 17px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
            ${t("dropFilesHere")}
          </h3>
          <p style="font-size: 13px; color: var(--text-tertiary); max-width: 480px; margin-bottom: 16px;">
            ${t("dropFilesTip")}
          </p>
          <button class="btn btn-primary" id="btn-browse-local-files" style="padding: 10px 24px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            ${t("browseFiles")}
          </button>
        </div>

        <!-- Lista de Música Local Importada -->
        <div style="margin-top: 32px;">
          <div class="home-section-header">
            <h3 class="home-section-title" style="font-size: 18px;">
              ${t("localMusic")} (${localTracks.length})
            </h3>
            ${localTracks.length > 0 ? `
              <span style="font-size: 12px; color: var(--accent-primary); font-weight: 600;">
                Guardadas en tu almacenamiento local IndexedDB
              </span>
            ` : ''}
          </div>

          ${localTracks.length === 0 ? `
            <div class="static-lyrics-container" style="margin-top: 10px; padding: 24px;">
              <p class="static-lyrics-text" style="color: var(--text-tertiary);">
                Aún no has agregado canciones de tu carpeta de Descargas. Arrastra archivos de audio o haz clic en "Explorar archivos" arriba para comenzar.
              </p>
            </div>
          ` : `
            <div class="track-list">
              ${localTracks.map((song, idx) => `
                <div class="track-row ${state.data.currentSong?.id === song.id ? 'active' : ''}" data-play-song="${song.id}">
                  <div class="track-index">
                    <span class="track-index-num">${idx + 1}</span>
                    <svg class="track-play-icon" viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                  </div>
                  <img class="track-cover" src="${song.cover}" alt="${song.title}" loading="lazy"/>
                  <div class="track-details">
                    <div class="track-title" style="display: flex; align-items: center; gap: 8px;">
                      <span>${song.title}</span>
                      <span class="file-format-badge">${song.format ? song.format.toUpperCase() : 'AUDIO'}</span>
                      <span style="font-size: 11px; color: var(--text-tertiary); font-weight: 500;">${song.sizeMb} MB</span>
                    </div>
                    <div class="track-artist">${song.artist}</div>
                  </div>
                  <div class="track-album">${song.album}</div>
                  <button class="btn-icon btn-like-track ${state.isLiked(song.id) ? 'active' : ''}" data-like-song="${song.id}">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="${state.isLiked(song.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <div class="track-duration">${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}</div>
                  <button class="btn-icon btn-delete-local-track" data-delete-local-id="${song.id}" title="${t("deleteLocalTrack")}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `;
    }

    // Default: All
    return `
      <section class="home-section">
        <h3 class="home-section-title" style="margin-bottom: 14px;">${t("songs")}</h3>
        <div class="track-list">
          ${mockSongs.slice(0, 5).map(song => `
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
      </section>
    `;
  },

  attachEvents(container) {
    // Cambio de pestañas
    container.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.render(container);
      });
    });

    // Cambio de ordenación
    const sortSelect = container.querySelector("#sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        const area = container.querySelector("#library-content-area");
        if (area) area.innerHTML = this.renderTabContent();
        this.attachSubEvents(container);
      });
    }

    // Botón para crear nueva playlist
    const btnCreate = container.querySelector("#btn-open-create-playlist");
    if (btnCreate) {
      btnCreate.addEventListener("click", () => {
        state.emit("modal:createPlaylist");
      });
    }

    this.attachSubEvents(container);
  },

  attachSubEvents(container) {
    container.querySelectorAll("[data-play-song]").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like-track") || e.target.closest(".btn-more-track")) return;
        const songId = el.getAttribute("data-play-song");
        const song = mockSongs.find(s => s.id === songId);
        if (song) state.setCurrentSong(song, true);
      });
    });

    container.querySelectorAll("[data-view-detail]").forEach(el => {
      el.addEventListener("click", () => {
        const type = el.getAttribute("data-view-detail");
        const id = el.getAttribute("data-id");
        let item = null;
        if (type === "album") item = mockAlbums.find(a => a.id === id);
        else if (type === "artist") item = mockArtists.find(a => a.id === id);
        else if (type === "playlist") {
          item = [...state.data.userPlaylists, ...defaultPlaylists].find(p => p.id === id);
        }

        if (item) {
          state.navigateTo("detail", { type, item });
        }
      });
    });

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

    container.querySelectorAll("[data-more-song]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const songId = btn.getAttribute("data-more-song");
        const song = mockSongs.find(s => s.id === songId);
        if (song) {
          const rect = btn.getBoundingClientRect();
          state.emit("contextMenu:open", { song, x: rect.left - 120, y: rect.bottom + 6 });
        }
      });
    });
  }
};
