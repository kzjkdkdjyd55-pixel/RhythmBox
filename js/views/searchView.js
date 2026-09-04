// RhythmBox - Vista de Búsqueda (Search View)

import { state } from "../state.js";
import { mockSongs, mockAlbums, mockArtists } from "../data/songs.js";
import { defaultPlaylists } from "../data/playlists.js";
import { storage } from "../utils/storage.js";

export const searchView = {
  currentQuery: "",

  genres: [
    { name: "Synthwave", color: "linear-gradient(135deg, #0f051d, #5c007a, #00f2fe)" },
    { name: "Cyberpunk", color: "linear-gradient(135deg, #160026, #7209b7, #f72585)" },
    { name: "Lo-Fi Beats", color: "linear-gradient(135deg, #1b0a2a, #8f1266, #ff70a6)" },
    { name: "Chillwave", color: "linear-gradient(135deg, #051622, #1ba098, #deb992)" },
    { name: "Ambient", color: "linear-gradient(135deg, #03045e, #0077b6, #00b4d8)" },
    { name: "Electro Bass", color: "linear-gradient(135deg, #08080a, #1a1a24, #00f59b)" },
    { name: "Cinematic", color: "linear-gradient(135deg, #140152, #22007c, #ff9e00)" },
    { name: "Neo-Soul", color: "linear-gradient(135deg, #211a1e, #541388, #ffd447)" }
  ],

  render(container) {
    const t = state.t.bind(state);
    const searchHistory = storage.getSearchHistory();

    container.innerHTML = `
      <div class="search-input-hero-wrap">
        <svg class="search-input-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          id="search-input-main" 
          class="search-input-hero" 
          type="text" 
          placeholder="${t("searchPlaceholder")}" 
          value="${this.currentQuery}" 
          autocomplete="off"
          autofocus
        />
      </div>

      <div id="search-dynamic-area">
        ${this.currentQuery.trim() ? this.renderSearchResults(this.currentQuery) : this.renderBrowseAndHistory(searchHistory)}
      </div>
    `;

    this.attachEvents(container);
  },

  renderBrowseAndHistory(history) {
    const t = state.t.bind(state);

    return `
      ${history.length > 0 ? `
        <div class="recent-searches-box">
          <div class="home-section-header">
            <h3 class="home-section-title" style="font-size: 16px;">${t("recentSearches")}</h3>
            <button class="btn btn-secondary" id="btn-clear-search-history" style="padding: 4px 12px; font-size: 12px;">${t("clearHistory")}</button>
          </div>
          <div class="recent-chips-list">
            ${history.map(item => `
              <span class="recent-chip" data-apply-search="${item}">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${item}
              </span>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <section class="home-section" style="margin-top: 24px;">
        <div class="home-section-header">
          <h3 class="home-section-title">${t("exploreGenres")}</h3>
        </div>
        <div class="genre-grid">
          ${this.genres.map(genre => `
            <div class="genre-card" style="background: ${genre.color};" data-genre-search="${genre.name}">
              <span>${genre.name}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  },

  renderSearchResults(query) {
    const t = state.t.bind(state);
    const q = query.toLowerCase().trim();

    // Buscar en canciones (por título, artista, álbum o letras)
    const matchedSongs = mockSongs.filter(s => {
      const inTitle = s.title.toLowerCase().includes(q);
      const inArtist = s.artist.toLowerCase().includes(q);
      const inAlbum = s.album.toLowerCase().includes(q);
      const inGenre = s.genre.toLowerCase().includes(q);
      const inLyrics = s.lyrics ? s.lyrics.some(l => l.text.toLowerCase().includes(q)) : false;
      return inTitle || inArtist || inAlbum || inGenre || inLyrics;
    });

    // Buscar en artistas
    const matchedArtists = mockArtists.filter(a => 
      a.name.toLowerCase().includes(q) || a.genres.some(g => g.toLowerCase().includes(q))
    );

    // Buscar en álbumes
    const matchedAlbums = mockAlbums.filter(a => 
      a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)
    );

    const totalResults = matchedSongs.length + matchedArtists.length + matchedAlbums.length;

    if (totalResults === 0) {
      return `
        <div class="static-lyrics-container" style="margin-top: 40px;">
          <svg class="empty-lyrics-illustration" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h3>${t("noResults")} "${query}"</h3>
          <p class="static-lyrics-text">${t("noResultsTip")}</p>
        </div>
      `;
    }

    return `
      <!-- Canciones encontradas -->
      ${matchedSongs.length > 0 ? `
        <section class="home-section">
          <h3 class="home-section-title" style="margin-bottom: 12px;">${t("songs")} (${matchedSongs.length})</h3>
          <div class="track-list">
            ${matchedSongs.slice(0, 10).map((song, idx) => `
              <div class="track-row ${state.data.currentSong?.id === song.id ? 'active' : ''}" data-play-song="${song.id}">
                <div class="track-index">${idx + 1}</div>
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
        </section>
      ` : ""}

      <!-- Álbumes encontrados -->
      ${matchedAlbums.length > 0 ? `
        <section class="home-section">
          <h3 class="home-section-title" style="margin-bottom: 12px;">${t("albums")} (${matchedAlbums.length})</h3>
          <div class="card-grid">
            ${matchedAlbums.map(alb => `
              <div class="media-card" data-view-detail="album" data-id="${alb.id}">
                <div class="media-card-cover-wrap">
                  <img class="media-card-cover" src="${alb.cover}" alt="${alb.title}" loading="lazy"/>
                </div>
                <div class="media-card-title">${alb.title}</div>
                <div class="media-card-subtitle">${alb.artistName}</div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}

      <!-- Artistas encontrados -->
      ${matchedArtists.length > 0 ? `
        <section class="home-section">
          <h3 class="home-section-title" style="margin-bottom: 12px;">${t("artists")} (${matchedArtists.length})</h3>
          <div class="card-grid">
            ${matchedArtists.map(art => `
              <div class="media-card artist-card" data-view-detail="artist" data-id="${art.id}">
                <div class="media-card-cover-wrap">
                  <img class="media-card-cover" src="${art.avatar}" alt="${art.name}" loading="lazy"/>
                </div>
                <div class="media-card-title">${art.name}</div>
                <div class="media-card-subtitle">${art.genres.join(" • ")}</div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}
    `;
  },

  attachEvents(container) {
    const input = container.querySelector("#search-input-main");
    if (input) {
      let debounceTimer = null;
      input.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.currentQuery = e.target.value;
          if (this.currentQuery.trim().length >= 2) {
            storage.addSearchQuery(this.currentQuery);
          }
          const dynamicArea = container.querySelector("#search-dynamic-area");
          if (dynamicArea) {
            dynamicArea.innerHTML = this.currentQuery.trim()
              ? this.renderSearchResults(this.currentQuery)
              : this.renderBrowseAndHistory(storage.getSearchHistory());
            this.attachSubEvents(container);
          }
        }, 150);
      });
    }

    this.attachSubEvents(container);
  },

  attachSubEvents(container) {
    // Clic en chip de búsqueda reciente
    container.querySelectorAll("[data-apply-search]").forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-apply-search");
        const input = container.querySelector("#search-input-main");
        if (input) input.value = query;
        this.currentQuery = query;
        const area = container.querySelector("#search-dynamic-area");
        if (area) {
          area.innerHTML = this.renderSearchResults(query);
          this.attachSubEvents(container);
        }
      });
    });

    // Clic en género
    container.querySelectorAll("[data-genre-search]").forEach(card => {
      card.addEventListener("click", () => {
        const genre = card.getAttribute("data-genre-search");
        const input = container.querySelector("#search-input-main");
        if (input) input.value = genre;
        this.currentQuery = genre;
        const area = container.querySelector("#search-dynamic-area");
        if (area) {
          area.innerHTML = this.renderSearchResults(genre);
          this.attachSubEvents(container);
        }
      });
    });

    // Borrar historial
    const btnClear = container.querySelector("#btn-clear-search-history");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        storage.clearSearchHistory();
        const area = container.querySelector("#search-dynamic-area");
        if (area) {
          area.innerHTML = this.renderBrowseAndHistory([]);
          this.attachSubEvents(container);
        }
      });
    }

    // Reproducir canciones
    container.querySelectorAll("[data-play-song]").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like-track") || e.target.closest(".btn-more-track")) return;
        const songId = el.getAttribute("data-play-song");
        const song = mockSongs.find(s => s.id === songId);
        if (song) state.setCurrentSong(song, true);
      });
    });

    // Ver detalles
    container.querySelectorAll("[data-view-detail]").forEach(el => {
      el.addEventListener("click", () => {
        const type = el.getAttribute("data-view-detail");
        const id = el.getAttribute("data-id");
        let item = null;
        if (type === "album") item = mockAlbums.find(a => a.id === id);
        else if (type === "artist") item = mockArtists.find(a => a.id === id);

        if (item) {
          state.navigateTo("detail", { type, item });
        }
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

    // Menú de opciones (...)
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
