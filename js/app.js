// RhythmBox - Orquestador Principal de la Aplicación (SPA Entry Point)

import { state } from "./state.js";
import { audioEngine } from "./audio/engine.js";
import { playerView } from "./views/playerView.js";
import { homeView } from "./views/homeView.js";
import { libraryView } from "./views/libraryView.js";
import { searchView } from "./views/searchView.js";
import { queueView } from "./views/queueView.js";
import { settingsView } from "./views/settingsView.js";
import { detailView } from "./views/detailView.js";
import { lyricsView } from "./views/lyricsView.js";
import { lyricsCardGen } from "./utils/lyricsCardGen.js";
import { colorExtractor } from "./utils/colorExtractor.js";

class RhythmBoxApp {
  constructor() {
    this.viewContainer = null;
  }

  async init() {
    this.viewContainer = document.getElementById("view-container");

    // Aplicar tema y configuraciones guardadas
    document.documentElement.setAttribute("data-theme", state.data.settings.theme || "obsidian");
    if (state.data.settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    }

    // Inicializar reproductor y componentes
    playerView.init();

    // Extraer colores iniciales
    if (state.data.currentSong) {
      colorExtractor.extractFromCover(state.data.currentSong.cover, state.data.currentSong.colors);
    }

    // Suscribirse a cambios de vista
    state.on("view:changed", ({ view }) => {
      this.renderCurrentView();
      this.updateNavigationUI(view);
    });

    // Re-renderizar si la canción cambia mientras estamos en la vista de letras o cola
    state.on("song:changed", () => {
      if (state.data.activeView === "lyrics" || state.data.activeView === "queue") {
        this.renderCurrentView();
      }
    });

    // Suscribirse a cambio de idioma
    state.on("language:changed", () => {
      this.updateStaticTranslations();
      this.renderCurrentView();
    });

    // Suscribirse a apertura de Now Playing modal
    state.on("nowPlayingModal:changed", (isOpen) => {
      const npOverlay = document.getElementById("now-playing-overlay");
      if (npOverlay) npOverlay.classList.toggle("open", isOpen);
    });

    // Suscribirse a modales específicos
    this.setupModals();

    // Configurar menú contextual
    this.setupContextMenu();

    // Atajos de teclado globales
    this.setupKeyboardShortcuts();

    // Configurar búsqueda global del header
    this.setupHeaderSearch();

    // Configurar navegación de sidebar y mobile
    this.setupNavigationButtons();

    // Registrar Service Worker para PWA
    this.registerServiceWorker();

    // Renderizar vista inicial
    this.updateStaticTranslations();
    this.renderCurrentView();
  }

  renderCurrentView() {
    if (!this.viewContainer) return;
    const view = state.data.activeView;

    switch (view) {
      case "home":
        homeView.render(this.viewContainer);
        break;
      case "library":
        libraryView.render(this.viewContainer);
        break;
      case "search":
        searchView.render(this.viewContainer);
        break;
      case "queue":
        queueView.render(this.viewContainer);
        break;
      case "settings":
        settingsView.render(this.viewContainer);
        break;
      case "lyrics":
        lyricsView.render(this.viewContainer);
        break;
      case "detail":
        detailView.render(this.viewContainer);
        break;
      default:
        homeView.render(this.viewContainer);
    }

    this.viewContainer.scrollTop = 0;
  }

  updateNavigationUI(activeView) {
    // Sidebar items
    document.querySelectorAll(".nav-item").forEach(item => {
      const target = item.getAttribute("data-nav");
      item.classList.toggle("active", target === activeView);
    });

    // Mobile nav items
    document.querySelectorAll(".mobile-nav-item").forEach(item => {
      const target = item.getAttribute("data-nav");
      item.classList.toggle("active", target === activeView);
    });
  }

  setupNavigationButtons() {
    document.querySelectorAll("[data-nav]").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-nav");
        state.navigateTo(view);
      });
    });

    // Botón de letras en sidebar / mobile
    const btnNavLyrics = document.getElementById("nav-lyrics");
    if (btnNavLyrics) {
      btnNavLyrics.addEventListener("click", () => {
        state.navigateTo("lyrics");
      });
    }

    // Botón crear playlist desde el sidebar
    const btnSidebarCreate = document.getElementById("btn-sidebar-create-pl");
    if (btnSidebarCreate) {
      btnSidebarCreate.addEventListener("click", () => {
        state.emit("modal:createPlaylist");
      });
    }

    this.updateSidebarPlaylists();
    state.on("playlists:changed", () => {
      this.updateSidebarPlaylists();
    });
  }

  updateSidebarPlaylists() {
    const container = document.getElementById("sidebar-pl-container");
    if (!container) return;

    const allPlaylists = [...state.data.userPlaylists, ...defaultPlaylists];
    container.innerHTML = allPlaylists.map(pl => `
      <li class="sidebar-playlist-item">
        <button type="button" data-sidebar-pl-id="${pl.id}">${pl.title}</button>
      </li>
    `).join("");

    container.querySelectorAll("[data-sidebar-pl-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-sidebar-pl-id");
        const pl = allPlaylists.find(p => p.id === id);
        if (pl) {
          state.navigateTo("detail", { type: "playlist", item: pl });
        }
      });
    });
  }

  setupHeaderSearch() {
    const input = document.getElementById("header-search-input");
    if (input) {
      input.addEventListener("focus", () => {
        if (state.data.activeView !== "search") {
          state.navigateTo("search");
        }
      });
      input.addEventListener("input", (e) => {
        searchView.currentQuery = e.target.value;
        if (state.data.activeView !== "search") {
          state.navigateTo("search");
        }
      });
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Ignorar si el usuario está escribiendo en un input
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          audioEngine.togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          audioEngine.seek(audioEngine.getCurrentTime() + 5);
          break;
        case "ArrowLeft":
          e.preventDefault();
          audioEngine.seek(audioEngine.getCurrentTime() - 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          state.setVolume(Math.min(1, state.data.volume + 0.05));
          audioEngine.setVolume(state.data.volume);
          break;
        case "ArrowDown":
          e.preventDefault();
          state.setVolume(Math.max(0, state.data.volume - 0.05));
          audioEngine.setVolume(state.data.volume);
          break;
        case "KeyM":
          state.toggleMute();
          audioEngine.setMuted(state.data.isMuted);
          break;
        case "KeyL":
          state.toggleLyricsModal();
          break;
        case "Escape":
          this.closeAllModals();
          state.toggleNowPlayingModal(false);
          break;
      }
    });
  }

  setupModals() {
    // 1. Modal de Temporizador de Apagado (Sleep Timer)
    state.on("modal:sleepTimer", () => {
      const modal = document.getElementById("modal-sleep-timer");
      if (modal) modal.classList.add("open");
    });

    document.querySelectorAll("[data-set-sleep-minutes]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mins = parseInt(btn.getAttribute("data-set-sleep-minutes"), 10);
        audioEngine.setSleepTimer(mins);
        document.getElementById("modal-sleep-timer")?.classList.remove("open");
      });
    });

    // 2. Modal de Creación de Playlist
    state.on("modal:createPlaylist", () => {
      const modal = document.getElementById("modal-create-playlist");
      if (modal) {
        modal.classList.add("open");
        document.getElementById("input-new-pl-title")?.focus();
      }
    });

    const btnSubmitPl = document.getElementById("btn-submit-create-playlist");
    if (btnSubmitPl) {
      btnSubmitPl.addEventListener("click", () => {
        const titleInput = document.getElementById("input-new-pl-title");
        const descInput = document.getElementById("input-new-pl-desc");
        const title = titleInput?.value.trim();
        const desc = descInput?.value.trim();

        if (title) {
          state.createPlaylist(title, desc, []);
          if (titleInput) titleInput.value = "";
          if (descInput) descInput.value = "";
          document.getElementById("modal-create-playlist")?.classList.remove("open");
          if (state.data.activeView === "library") {
            libraryView.render(this.viewContainer);
          }
        }
      });
    }

    // 3. Modal de Personalización de Letras
    state.on("modal:lyricsCustomizer", () => {
      const modal = document.getElementById("modal-lyrics-customizer");
      if (modal) {
        this.populateLyricsCustomizerUI();
        modal.classList.add("open");
      }
    });

    // 4. Modal de Compartir Tarjeta Visual de Letra
    state.on("modal:shareLyricsCard", async (data) => {
      const modal = document.getElementById("modal-share-card");
      if (!modal) return;

      const previewImg = document.getElementById("share-card-preview-img");
      const btnDownload = document.getElementById("btn-download-card-png");
      const btnCopyText = document.getElementById("btn-copy-card-text");

      modal.classList.add("open");
      if (previewImg) previewImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' fill='%23111'/><text x='50%' y='50%' fill='%23fff' text-anchor='middle'>Generando tarjeta...</text></svg>";

      const dataUrl = await lyricsCardGen.generateCard(data);
      if (previewImg) previewImg.src = dataUrl;

      if (btnDownload) {
        btnDownload.onclick = () => {
          lyricsCardGen.downloadImage(dataUrl, `rhythmbox-${data.songTitle.replace(/\s+/g, "_")}.png`);
        };
      }

      if (btnCopyText) {
        btnCopyText.onclick = async () => {
          try {
            await navigator.clipboard.writeText(`"${data.lyricText}" — ${data.songTitle} (${data.artistName}) en RhythmBox`);
            btnCopyText.textContent = state.t("textCopied");
            setTimeout(() => {
              btnCopyText.textContent = state.t("copyLyricText");
            }, 2000);
          } catch {
            alert(data.lyricText);
          }
        };
      }
    });

    // Cierre general de modales
    document.querySelectorAll(".btn-close-modal, .modal-backdrop").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target === el) {
          this.closeAllModals();
        }
      });
    });
  }

  populateLyricsCustomizerUI() {
    const config = state.data.lyricsConfig;

    // Tipografía
    document.querySelectorAll("[data-custom-font]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-custom-font") === config.fontFamily);
      btn.onclick = () => {
        state.updateLyricsConfig({ fontFamily: btn.getAttribute("data-custom-font") });
        this.populateLyricsCustomizerUI();
        if (state.data.activeView === "lyrics") lyricsView.render(this.viewContainer);
      };
    });

    // Tamaño de fuente
    const sizeSlider = document.getElementById("lyrics-font-size-slider");
    const sizeVal = document.getElementById("lyrics-font-size-val");
    if (sizeSlider && sizeVal) {
      sizeSlider.value = config.fontSize;
      sizeVal.textContent = `${config.fontSize}px`;
      sizeSlider.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        sizeVal.textContent = `${val}px`;
        state.updateLyricsConfig({ fontSize: val });
        if (state.data.activeView === "lyrics") lyricsView.render(this.viewContainer);
      };
    }

    // Alineación
    document.querySelectorAll("[data-custom-align]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-custom-align") === config.fontAlign);
      btn.onclick = () => {
        state.updateLyricsConfig({ fontAlign: btn.getAttribute("data-custom-align") });
        this.populateLyricsCustomizerUI();
        if (state.data.activeView === "lyrics") lyricsView.render(this.viewContainer);
      };
    });

    // Color de texto activo
    document.querySelectorAll("[data-custom-color]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-custom-color") === config.textColorMode);
      btn.onclick = () => {
        state.updateLyricsConfig({ textColorMode: btn.getAttribute("data-custom-color") });
        this.populateLyricsCustomizerUI();
        if (state.data.activeView === "lyrics") lyricsView.render(this.viewContainer);
      };
    });

    // Fondo
    document.querySelectorAll("[data-custom-bg]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-custom-bg") === config.bgStyle);
      btn.onclick = () => {
        state.updateLyricsConfig({ bgStyle: btn.getAttribute("data-custom-bg") });
        this.populateLyricsCustomizerUI();
        if (state.data.activeView === "lyrics") lyricsView.render(this.viewContainer);
      };
    });

    // Transición
    document.querySelectorAll("[data-custom-transition]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-custom-transition") === config.transitionStyle);
      btn.onclick = () => {
        state.updateLyricsConfig({ transitionStyle: btn.getAttribute("data-custom-transition") });
        this.populateLyricsCustomizerUI();
        if (state.data.activeView === "lyrics") lyricsView.render(this.viewContainer);
      };
    });
  }

  setupContextMenu() {
    const menu = document.getElementById("track-context-menu");
    if (!menu) return;

    state.on("contextMenu:open", ({ song, x, y }) => {
      menu.style.left = `${Math.min(window.innerWidth - 200, Math.max(10, x))}px`;
      menu.style.top = `${Math.min(window.innerHeight - 220, Math.max(10, y))}px`;
      menu.classList.add("open");

      // Acciones del menú
      const btnPlayNext = menu.querySelector("#ctx-play-next");
      const btnAddToQueue = menu.querySelector("#ctx-add-queue");
      const btnLike = menu.querySelector("#ctx-toggle-like");

      if (btnPlayNext) {
        btnPlayNext.onclick = () => {
          state.addToQueueNext(song);
          menu.classList.remove("open");
        };
      }

      if (btnAddToQueue) {
        btnAddToQueue.onclick = () => {
          state.addToQueueEnd(song);
          menu.classList.remove("open");
        };
      }

      if (btnLike) {
        btnLike.onclick = () => {
          state.toggleLike(song.id);
          menu.classList.remove("open");
        };
      }
    });

    // Cerrar menú contextual al hacer clic fuera
    window.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  }

  closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
  }

  updateStaticTranslations() {
    const t = state.t.bind(state);

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
      });
    }
  }
}

// Inicializar al cargar el DOM
window.addEventListener("DOMContentLoaded", () => {
  const app = new RhythmBoxApp();
  app.init();
});
