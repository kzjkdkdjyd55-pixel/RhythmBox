// RhythmBox - Vista de Detalle (Álbum, Artista y Playlist)

import { state } from "../state.js";
import { mockSongs } from "../data/songs.js";

export const detailView = {
  render(container) {
    const t = state.t.bind(state);
    const { detailType, detailItem } = state.data;

    if (!detailItem) {
      container.innerHTML = `<div class="static-lyrics-container"><h3>${t("empty")}</h3></div>`;
      return;
    }

    let songs = [];
    let title = "";
    let subtitle = "";
    let description = "";
    let coverUrl = "";
    let isArtist = detailType === "artist";

    if (detailType === "album") {
      title = detailItem.title;
      subtitle = `${detailItem.artistName} • ${detailItem.year} • ${detailItem.genre}`;
      description = detailItem.description || "";
      coverUrl = detailItem.cover;
      songs = mockSongs.filter(s => s.albumId === detailItem.id);
    } else if (detailType === "artist") {
      title = detailItem.name;
      subtitle = `${detailItem.monthlyListeners} ${t("followers")} • ${detailItem.genres.join(", ")}`;
      description = detailItem.bio || "";
      coverUrl = detailItem.avatar;
      songs = mockSongs.filter(s => s.artistId === detailItem.id);
    } else if (detailType === "playlist") {
      title = detailItem.title;
      description = detailItem.description || "";
      coverUrl = detailItem.cover || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300' width='100%' height='100%'><rect width='300' height='300' fill='%23111420'/><text x='50%' y='50%' fill='%2300f2fe' font-size='40' text-anchor='middle'>PLAYLIST</text></svg>";
      songs = mockSongs.filter(s => detailItem.songIds && detailItem.songIds.includes(s.id));
      subtitle = `${songs.length} ${t("tracksCount")}`;
    }

    const totalSeconds = songs.reduce((acc, s) => acc + s.duration, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);

    container.innerHTML = `
      <div class="detail-hero">
        <img class="detail-cover ${isArtist ? 'artist-avatar' : ''}" src="${coverUrl}" alt="${title}"/>
        <div class="detail-meta-wrap">
          <span class="detail-type-badge">${t(detailType === 'artist' ? 'artists' : detailType === 'album' ? 'albums' : 'playlists')}</span>
          <h1 class="detail-title">${title}</h1>
          <p class="detail-sub-meta">${subtitle} ${!isArtist ? `• ${totalMinutes} min` : ''}</p>
          ${description ? `<p style="font-size: 13px; color: var(--text-secondary); max-width: 550px; margin-top: 4px;">${description}</p>` : ''}

          <div class="detail-actions-row">
            <button class="btn btn-primary" id="btn-play-all">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
              ${t("play")}
            </button>
            <button class="btn btn-secondary" id="btn-shuffle-all">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              ${t("shufflePlay")}
            </button>
            ${isArtist ? `
              <button class="btn btn-secondary" id="btn-follow-artist">
                ${t("follow")}
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Lista de Pistas -->
      <section class="home-section">
        <h3 class="home-section-title" style="margin-bottom: 12px;">${t(isArtist ? "popularTracks" : "tracksCount")}</h3>
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
      </section>
    `;

    this.attachEvents(container, songs);
  },

  attachEvents(container, songs) {
    // Reproducir todo
    const btnPlayAll = container.querySelector("#btn-play-all");
    if (btnPlayAll) {
      btnPlayAll.addEventListener("click", () => {
        if (songs.length > 0) state.setQueue(songs, true);
      });
    }

    // Reproducción aleatoria
    const btnShuffleAll = container.querySelector("#btn-shuffle-all");
    if (btnShuffleAll) {
      btnShuffleAll.addEventListener("click", () => {
        if (songs.length > 0) {
          const shuffled = [...songs];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          state.setQueue(shuffled, true);
        }
      });
    }

    // Botón de seguir artista
    const btnFollow = container.querySelector("#btn-follow-artist");
    if (btnFollow) {
      let isFollowing = false;
      btnFollow.addEventListener("click", () => {
        isFollowing = !isFollowing;
        btnFollow.textContent = isFollowing ? state.t("following") : state.t("follow");
        btnFollow.classList.toggle("btn-primary", isFollowing);
        btnFollow.classList.toggle("btn-secondary", !isFollowing);
      });
    }

    // Reproducir canción
    container.querySelectorAll("[data-play-song]").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".btn-like-track") || e.target.closest(".btn-more-track")) return;
        const songId = el.getAttribute("data-play-song");
        const song = mockSongs.find(s => s.id === songId);
        if (song) state.setCurrentSong(song, true);
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

    // Más opciones
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
