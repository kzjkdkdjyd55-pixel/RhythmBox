// RhythmBox - Extractor de color dinámico para carátulas de álbumes

export const colorExtractor = {
  // Caché de colores calculados por canción o URL
  cache: new Map(),

  async extractFromCover(coverUrl, fallbackColors = null) {
    if (this.cache.has(coverUrl)) {
      return this.cache.get(coverUrl);
    }

    if (fallbackColors) {
      this.cache.set(coverUrl, fallbackColors);
      this.applyColors(fallbackColors);
      return fallbackColors;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          canvas.width = 64;
          canvas.height = 64;
          ctx.drawImage(img, 0, 0, 64, 64);
          const imageData = ctx.getImageData(0, 0, 64, 64).data;

          let rTotal = 0, gTotal = 0, bTotal = 0;
          let count = 0;
          let maxSat = 0;
          let vibrantColor = { r: 0, g: 242, b: 254 }; // Cian por defecto

          for (let i = 0; i < imageData.length; i += 16) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128) continue;
            // Ignorar píxeles casi negros o casi blancos
            const brightness = (r + g + b) / 3;
            if (brightness < 20 || brightness > 240) continue;

            rTotal += r;
            gTotal += g;
            bTotal += b;
            count++;

            // Calcular saturación
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const sat = max === 0 ? 0 : (max - min) / max;
            if (sat > maxSat && brightness > 50 && brightness < 200) {
              maxSat = sat;
              vibrantColor = { r, g, b };
            }
          }

          let primary = "#08090e";
          let accent = `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
          let glow = `rgba(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b}, 0.5)`;

          if (count > 0) {
            const avgR = Math.round(rTotal / count);
            const avgG = Math.round(gTotal / count);
            const avgB = Math.round(bTotal / count);
            primary = `rgb(${Math.floor(avgR * 0.2)}, ${Math.floor(avgG * 0.2)}, ${Math.floor(avgB * 0.2)})`;
          }

          const extracted = {
            primary,
            secondary: `rgb(${vibrantColor.r * 0.6}, ${vibrantColor.g * 0.6}, ${vibrantColor.b * 0.6})`,
            accent,
            glow
          };

          this.cache.set(coverUrl, extracted);
          this.applyColors(extracted);
          resolve(extracted);
        } catch {
          const fallback = fallbackColors || {
            primary: "#08090e",
            secondary: "#1a102f",
            accent: "#00f2fe",
            glow: "rgba(0, 242, 254, 0.4)"
          };
          this.applyColors(fallback);
          resolve(fallback);
        }
      };

      img.onerror = () => {
        const fallback = fallbackColors || {
          primary: "#08090e",
          secondary: "#1a102f",
          accent: "#00f2fe",
          glow: "rgba(0, 242, 254, 0.4)"
        };
        this.applyColors(fallback);
        resolve(fallback);
      };

      img.src = coverUrl;
    });
  },

  applyColors(colors) {
    const root = document.documentElement;
    root.style.setProperty("--dynamic-primary", colors.primary);
    root.style.setProperty("--dynamic-secondary", colors.secondary);
    root.style.setProperty("--dynamic-accent", colors.accent);
    root.style.setProperty("--dynamic-glow", colors.glow);
  }
};
