// RhythmBox - Vista de Ajustes, Perfil y Ecualizador Gráfico (Settings View)

import { state } from "../state.js";
import { audioEngine, EQ_FREQUENCIES, EQ_PRESETS } from "../audio/engine.js";
import { storage } from "../utils/storage.js";

export const settingsView = {
  render(container) {
    const t = state.t.bind(state);
    const settings = state.data.settings;
    const eqGains = state.data.eqGains;
    const activePreset = state.data.activeEqPreset;
    const downloadedSongs = storage.getDownloadedSongs();
    const storageUsedMb = (downloadedSongs.length * 8.4).toFixed(1); // Simulación realista de 8.4 MB por pista

    container.innerHTML = `
      <div style="margin-bottom: 28px;">
        <h1 class="home-section-title" style="font-size: 26px;">${t("settings")}</h1>
        <p class="setting-desc">${t("tagline")}</p>
      </div>

      <!-- 1. AUDIO Y ECUALIZADOR GRÁFICO DE 10 BANDAS -->
      <div class="settings-group">
        <h2 class="settings-group-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          ${t("equalizer")}
        </h2>

        <div class="eq-container">
          <div class="eq-presets-chips">
            <button class="chip-btn ${activePreset === 'flat' ? 'active' : ''}" data-eq-preset="flat">${t("eqFlat")}</button>
            <button class="chip-btn ${activePreset === 'rock' ? 'active' : ''}" data-eq-preset="rock">${t("eqRock")}</button>
            <button class="chip-btn ${activePreset === 'pop' ? 'active' : ''}" data-eq-preset="pop">${t("eqPop")}</button>
            <button class="chip-btn ${activePreset === 'electronic' ? 'active' : ''}" data-eq-preset="electronic">${t("eqElectronic")}</button>
            <button class="chip-btn ${activePreset === 'jazz' ? 'active' : ''}" data-eq-preset="jazz">${t("eqJazz")}</button>
            <button class="chip-btn ${activePreset === 'bassBoost' ? 'active' : ''}" data-eq-preset="bassBoost">${t("eqBassBoost")}</button>
            <button class="chip-btn ${activePreset === 'vocal' ? 'active' : ''}" data-eq-preset="vocal">${t("eqVocal")}</button>
            <button class="chip-btn ${activePreset === 'acoustic' ? 'active' : ''}" data-eq-preset="acoustic">${t("eqAcoustic")}</button>
            <button class="chip-btn ${activePreset === 'custom' ? 'active' : ''}" data-eq-preset="custom">${t("eqCustom")}</button>
          </div>

          <!-- Tablero de Sliders de Ecualizador -->
          <div class="eq-sliders-board">
            ${EQ_FREQUENCIES.map((freq, idx) => `
              <div class="eq-channel">
                <span class="eq-db-value" id="eq-val-${idx}">${eqGains[idx] > 0 ? '+' : ''}${eqGains[idx]}dB</span>
                <input 
                  type="range" 
                  class="eq-slider-vertical" 
                  min="-12" 
                  max="12" 
                  step="0.5" 
                  value="${eqGains[idx]}" 
                  data-eq-band="${idx}"
                  aria-label="${freq} Hz Gain"
                />
                <span class="eq-freq-label">${freq >= 1000 ? (freq / 1000) + 'k' : freq}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="setting-row" style="margin-top: 20px;">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("crossfade")}</span>
            <span class="setting-desc">${t("crossfadeDesc")}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; width: 180px;">
            <input 
              type="range" 
              class="range-slider" 
              id="input-crossfade" 
              min="0" 
              max="12" 
              step="1" 
              value="${settings.crossfade || 2}"
            />
            <span style="font-size: 13px; font-weight: 700; color: var(--accent-primary); width: 32px;" id="crossfade-val">${settings.crossfade || 2}s</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("gapless")}</span>
            <span class="setting-desc">${t("offlineModeNotice")}</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-gapless" ${settings.gapless ? 'checked' : ''}>
            <span class="slider-toggle"></span>
          </label>
        </div>

        <div class="setting-row">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("normalization")}</span>
            <span class="setting-desc">Ajusta automáticamente el nivel percibido entre pistas</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-normalization" ${settings.normalization ? 'checked' : ''}>
            <span class="slider-toggle"></span>
          </label>
        </div>

        <div class="setting-row">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("audioQuality")}</span>
          </div>
          <select class="select-custom" id="select-audio-quality">
            <option value="normal" ${settings.audioQuality === 'normal' ? 'selected' : ''}>${t("qualityNormal")}</option>
            <option value="high" ${settings.audioQuality === 'high' ? 'selected' : ''}>${t("qualityHigh")}</option>
            <option value="lossless" ${settings.audioQuality === 'lossless' ? 'selected' : ''}>${t("qualityLossless")}</option>
          </select>
        </div>
      </div>

      <!-- 2. APARIENCIA Y TEMAS VISUALES -->
      <div class="settings-group">
        <h2 class="settings-group-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10"/></svg>
          ${t("settingsVisuals")}
        </h2>

        <span class="customizer-label">${t("themes")}</span>
        <div class="theme-cards-grid">
          <div class="theme-card-option ${settings.theme === 'obsidian' ? 'active' : ''}" data-set-theme="obsidian">
            <div class="theme-preview-palette">
              <div class="theme-palette-color" style="background: #07080d;"></div>
              <div class="theme-palette-color" style="background: #00f2fe;"></div>
              <div class="theme-palette-color" style="background: #9d4edd;"></div>
            </div>
            <span class="theme-card-name">Obsidian Dark</span>
          </div>

          <div class="theme-card-option ${settings.theme === 'quartz' ? 'active' : ''}" data-set-theme="quartz">
            <div class="theme-preview-palette">
              <div class="theme-palette-color" style="background: #f4f6fa;"></div>
              <div class="theme-palette-color" style="background: #2563eb;"></div>
              <div class="theme-palette-color" style="background: #7c3aed;"></div>
            </div>
            <span class="theme-card-name">Light Quartz</span>
          </div>

          <div class="theme-card-option ${settings.theme === 'midnight' ? 'active' : ''}" data-set-theme="midnight">
            <div class="theme-preview-palette">
              <div class="theme-palette-color" style="background: #020b18;"></div>
              <div class="theme-palette-color" style="background: #64ffda;"></div>
              <div class="theme-palette-color" style="background: #0077b6;"></div>
            </div>
            <span class="theme-card-name">Midnight Blue</span>
          </div>

          <div class="theme-card-option ${settings.theme === 'aurora' ? 'active' : ''}" data-set-theme="aurora">
            <div class="theme-preview-palette">
              <div class="theme-palette-color" style="background: #031412;"></div>
              <div class="theme-palette-color" style="background: #00f59b;"></div>
              <div class="theme-palette-color" style="background: #00d2ff;"></div>
            </div>
            <span class="theme-card-name">Aurora Borealis</span>
          </div>

          <div class="theme-card-option ${settings.theme === 'sunset' ? 'active' : ''}" data-set-theme="sunset">
            <div class="theme-preview-palette">
              <div class="theme-palette-color" style="background: #140212;"></div>
              <div class="theme-palette-color" style="background: #f72585;"></div>
              <div class="theme-palette-color" style="background: #ffb703;"></div>
            </div>
            <span class="theme-card-name">Cyber Sunset</span>
          </div>

          <div class="theme-card-option ${settings.theme === 'dynamic' ? 'active' : ''}" data-set-theme="dynamic">
            <div class="theme-preview-palette">
              <div class="theme-palette-color" style="background: var(--dynamic-primary);"></div>
              <div class="theme-palette-color" style="background: var(--dynamic-accent);"></div>
              <div class="theme-palette-color" style="background: var(--dynamic-glow);"></div>
            </div>
            <span class="theme-card-name">Carátula Dinámica</span>
          </div>
        </div>

        <div class="setting-row" style="margin-top: 20px;">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("miniPlayerLayout")}</span>
          </div>
          <select class="select-custom" id="select-mini-player">
            <option value="compact" ${settings.miniPlayerLayout === 'compact' ? 'selected' : ''}>${t("miniPlayerCompact")}</option>
            <option value="extended" ${settings.miniPlayerLayout === 'extended' ? 'selected' : ''}>${t("miniPlayerExtended")}</option>
          </select>
        </div>
      </div>

      <!-- 3. ACCESIBILIDAD E IDIOMA -->
      <div class="settings-group">
        <h2 class="settings-group-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          ${t("settingsAccessibility")}
        </h2>

        <div class="setting-row">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("language")}</span>
          </div>
          <select class="select-custom" id="select-language">
            <option value="es" ${state.data.currentLang === 'es' ? 'selected' : ''}>Español</option>
            <option value="en" ${state.data.currentLang === 'en' ? 'selected' : ''}>English</option>
          </select>
        </div>

        <div class="setting-row">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("highContrast")}</span>
            <span class="setting-desc">Aumenta los contrastes de texto y bordes para mayor legibilidad</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-high-contrast" ${settings.highContrast ? 'checked' : ''}>
            <span class="slider-toggle"></span>
          </label>
        </div>
      </div>

      <!-- 4. ALMACENAMIENTO OFFLINE -->
      <div class="settings-group">
        <h2 class="settings-group-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          ${t("settingsStorage")}
        </h2>

        <div class="setting-row">
          <div class="setting-label-wrap">
            <span class="setting-label">${t("storageUsed")}</span>
            <span class="setting-desc">${downloadedSongs.length} canciones guardadas (${storageUsedMb} MB)</span>
          </div>
          <button class="btn btn-secondary" id="btn-clear-storage" style="font-size: 12px; padding: 6px 14px;">
            ${t("clearDownloads")}
          </button>
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    // Presets del ecualizador
    container.querySelectorAll("[data-eq-preset]").forEach(btn => {
      btn.addEventListener("click", () => {
        const presetName = btn.getAttribute("data-eq-preset");
        container.querySelectorAll("[data-eq-preset]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (presetName !== "custom") {
          const gains = audioEngine.applyEqPreset(presetName);
          if (gains) {
            state.updateEqGains(gains, presetName);
            // Actualizar sliders visualmente
            gains.forEach((g, idx) => {
              const slider = container.querySelector(`[data-eq-band="${idx}"]`);
              const label = container.querySelector(`#eq-val-${idx}`);
              if (slider) slider.value = g;
              if (label) label.textContent = (g > 0 ? "+" : "") + g + "dB";
            });
          }
        }
      });
    });

    // Sliders de ecualizador de 10 bandas
    container.querySelectorAll("[data-eq-band]").forEach(slider => {
      slider.addEventListener("input", (e) => {
        const bandIndex = parseInt(slider.getAttribute("data-eq-band"), 10);
        const val = parseFloat(e.target.value);
        const label = container.querySelector(`#eq-val-${bandIndex}`);
        if (label) label.textContent = (val > 0 ? "+" : "") + val + "dB";

        const gains = [...state.data.eqGains];
        gains[bandIndex] = val;
        audioEngine.setEqGains(gains);
        state.updateEqGains(gains, "custom");

        container.querySelectorAll("[data-eq-preset]").forEach(b => {
          b.classList.toggle("active", b.getAttribute("data-eq-preset") === "custom");
        });
      });
    });

    // Crossfade slider
    const crossfadeSlider = container.querySelector("#input-crossfade");
    if (crossfadeSlider) {
      crossfadeSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        container.querySelector("#crossfade-val").textContent = val + "s";
        audioEngine.crossfadeTime = val;
        state.data.settings.crossfade = val;
        storage.saveSettings(state.data.settings);
      });
    }

    // Toggle Gapless
    const toggleGapless = container.querySelector("#toggle-gapless");
    if (toggleGapless) {
      toggleGapless.addEventListener("change", (e) => {
        state.data.settings.gapless = e.target.checked;
        storage.saveSettings(state.data.settings);
      });
    }

    // Toggle Normalization
    const toggleNorm = container.querySelector("#toggle-normalization");
    if (toggleNorm) {
      toggleNorm.addEventListener("change", (e) => {
        state.data.settings.normalization = e.target.checked;
        storage.saveSettings(state.data.settings);
      });
    }

    // Calidad de audio
    const selectQuality = container.querySelector("#select-audio-quality");
    if (selectQuality) {
      selectQuality.addEventListener("change", (e) => {
        state.data.settings.audioQuality = e.target.value;
        storage.saveSettings(state.data.settings);
      });
    }

    // Temas visuales
    container.querySelectorAll("[data-set-theme]").forEach(card => {
      card.addEventListener("click", () => {
        const theme = card.getAttribute("data-set-theme");
        state.setTheme(theme);
        container.querySelectorAll("[data-set-theme]").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      });
    });

    // Selector de idioma
    const selectLang = container.querySelector("#select-language");
    if (selectLang) {
      selectLang.addEventListener("change", (e) => {
        state.setLanguage(e.target.value);
      });
    }

    // Alto contraste
    const toggleContrast = container.querySelector("#toggle-high-contrast");
    if (toggleContrast) {
      toggleContrast.addEventListener("change", (e) => {
        state.data.settings.highContrast = e.target.checked;
        document.documentElement.classList.toggle("high-contrast", e.target.checked);
        storage.saveSettings(state.data.settings);
      });
    }

    // Borrar descargas
    const btnClearStorage = container.querySelector("#btn-clear-storage");
    if (btnClearStorage) {
      btnClearStorage.addEventListener("click", () => {
        state.clearAllDownloads();
        alert(state.t("downloadsCleared"));
        this.render(container);
      });
    }
  }
};
