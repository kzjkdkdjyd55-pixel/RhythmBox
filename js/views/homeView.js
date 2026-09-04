// RhythmBox - Vista de Inicio (Home View)

import { state } from "../state.js";
import { mockSongs, mockAlbums, mockArtists } from "../data/songs.js";
import { defaultPlaylists } from "../data/playlists.js";

export const homeView = {
  render(container) {
    const t = state.t.bind(state);

    // Saludo según hora del día
    const hour = new Date().getHours();
    let greeting = t("greetingEvening");
    if (hour >= 6 && hour < 12) greeting = t("greetingMorning");
    else if (hour >= 12 && hour < 19) greeting = t("greetingAfternoon");

    // Canciones para acceso rápido (primeras 6 canciones o favoritas)
    const quickAccessItems = mockSongs.slice(0, 6);

    container.innerHTML = `
      <section class="home-section">
        <div class="home-section-header">
          <h1 class="home-section-title">${greeting}</h1>
        </div>

        <!-- Chips de Acceso Rápido -->
        <div class="quick-access-grid">
          ${quickAccessItems.map(song => `
            <div class="quick-access-card" data-play-song="${song.id}">
              <img class="quick-access-cover" src="${song.cover}" alt="${song.title}" loading="lazy"/>
              <div class="quick-access-title">${song.title}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Continuar Escuchando / Novedades -->
      <section class="home-section">
        <div class="home-section-header">
          <h2 class="home-section-title">${t("continueListening")}</h2>
        </div>
        <div class="horizontal-scroll-row">
          ${mockAlbums.map(album => `
            <div class="media-card" data-view-detail="album" data-id="${album.id}">
              <div class="media-card-cover-wrap">
                <img class="media-card-cover" src="${album.cover}" alt="${album.title}" loading="lazy"/>
                <div class="media-card-play-overlay">
                  <button class="btn-play-circle" data-play-album="${album.id}" aria-label="${t("play")} ${album.title}">
                    <svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                  </button>
                </div>
              </div>
              <div class="media-card-title">${album.title}</div>
              <div class="media-card-subtitle">${album.artistName}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Mixes Diarios para Ti -->
      <section class="home-section">
        <div class="home-section-header">
          <h2 class="home-section-title">${t("dailyMixes")}</h2>
        </div>
        <div class="card-grid">
          ${defaultPlaylists.map(pl => `
            <div class="media-card" data-view-detail="playlist" data-id="${pl.id}">
              <div class="media-card-cover-wrap">
                <img class="media-card-cover" src="${pl.cover}" alt="${pl.title}" loading="lazy"/>
                <div class="media-card-play-overlay">
                  <button class="btn-play-circle" data-play-playlist="${pl.id}" aria-label="${t("play")} ${pl.title}">
                    <svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                  </button>
                </div>
              </div>
              <div class="media-card-title">${pl.title}</div>
              <div class="media-card-subtitle">${pl.description}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Artistas en Tendencia -->
      <section class="home-section">
        <div class="home-section-header">
          <h2 class="home-section-title">${t("trendingArtists")}</h2>
        </div>
        <div class="card-grid">
          ${mockArtists.map(artist => `
            <div class="media-card artist-card" data-view-detail="artist" data-id="${artist.id}">
              <div class="media-card-cover-wrap">
                <img class="media-card-cover" src="${artist.avatar}" alt="${artist.name}" loading="lazy"/>
              </div>
              <div class="media-card-title">${artist.name}</div>
              <div class="media-card-subtitle">${artist.genres.join(" • ")}</div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Novedades Sónicas (Lista de Pistas Destacadas) -->
      <section class="home-section">
        <div class="home-section-header">
          <h2 class="home-section-title">${t("freshDrops")}</h2>
        </div>
        <div class="track-list">
          ${mockSongs.slice(0, 8).map((song, idx) => `
            <div class="track-row ${state.data.currentSong?.id === song.id ? 'active' : ''}" data-play-song="${song.id}">
              <div class="track-index">
                ${state.data.currentSong?.id === song.id && state.data.isPlaying ? `
                  <div class="eq-bars-indicator">
                    <span class="eq-bar"></span>
                    <span class="eq-bar"></span>
                    <span class="eq-bar"></span>
                    <span class="eq-bar"></span>
                  </div>
                ` : `
                  <span class="track-index-num">${idx + 1}</span>
                  <svg class="track-play-icon" viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                `}
              </div>
              <img class="track-cover" src="${song.cover}" alt="${song.title}" loading="lazy"/>
              <div class="track-details">
                <div class="track-title">${song.title}</div>
                <div class="track-artist">${song.artist}</div>
              </div>
              <div class="track-album">${song.album}</div>
              <button class="btn-icon btn-like-track ${state.isLiked(song.id) ? 'active' : ''}" data-like-song="${song.id}" title="${t("like")}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="${state.isLiked(song.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <div class="track-duration">${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}</div>
              <button class="btn-icon btn-more-track" data-more-song="${song.id}" title="${t("more")}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
              </button>
            </div>
          `).join("")}
        </div>
      </section>
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    // Reproducir canción directa
    container.querySelectorAll("[data-play-song]").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like-track") || e.target.closest(".btn-more-track")) return;
        const songId = el.getAttribute("data-play-song");
        const song = mockSongs.find(s => s.id === songId);
        if (song) state.setCurrentSong(song, true);
      });
    });

    // Dar Me Gusta
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

    // Ver Detalles (Álbum, Artista, Playlist)
    container.querySelectorAll("[data-view-detail]").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".btn-play-circle")) return;
        const type = el.getAttribute("data-view-detail");
        const id = el.getAttribute("data-id");
        let item = null;
        if (type === "album") item = mockAlbums.find(a => a.id === id);
        else if (type === "artist") item = mockArtists.find(a => a.id === id);
        else if (type === "playlist") item = defaultPlaylists.find(p => p.id === id);

        if (item) {
          state.navigateTo("detail", { type, item });
        }
      });
    });

    // Botones de Play en tarjetas de Álbum y Playlist
    container.querySelectorAll("[data-play-album]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const albumId = btn.getAttribute("data-play-album");
        const songs = mockSongs.filter(s => s.albumId === albumId);
        if (songs.length > 0) state.setQueue(songs, true);
      });
    });

    container.querySelectorAll("[data-play-playlist]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const plId = btn.getAttribute("data-play-playlist");
        const pl = defaultPlaylists.find(p => p.id === plId);
        if (pl) {
          const songs = mockSongs.filter(s => pl.songIds.includes(s.id));
          if (songs.length > 0) state.setQueue(songs, true);
        }
      });
    });

    // Menú de opciones de pista (...)
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
