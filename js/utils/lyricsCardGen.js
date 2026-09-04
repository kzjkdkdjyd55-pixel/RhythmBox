// RhythmBox - Generador de tarjetas visuales de letras para redes sociales

export const lyricsCardGen = {
  async generateCard({ lyricText, songTitle, artistName, coverUrl, accentColor = "#00f2fe" }) {
    const canvas = document.createElement("canvas");
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // 1. Fondo degradado profundo
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#08090f");
    bgGrad.addColorStop(0.5, "#0e131f");
    bgGrad.addColorStop(1, "#140a24");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Resplandor radial de acento
    const glowGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 500);
    glowGrad.addColorStop(0, accentColor + "33"); // 20% opacidad
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Cuadrícula decorativa sutil
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 80; x < width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 80);
      ctx.lineTo(x, height - 80);
      ctx.stroke();
    }
    for (let y = 80; y < height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(width - 80, y);
      ctx.stroke();
    }

    // 4. Cargar y dibujar carátula con esquinas redondeadas
    await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const coverSize = 220;
        const coverX = 120;
        const coverY = 140;
        const radius = 24;

        ctx.save();
        // Sombra de carátula
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        ctx.beginPath();
        ctx.moveTo(coverX + radius, coverY);
        ctx.lineTo(coverX + coverSize - radius, coverY);
        ctx.quadraticCurveTo(coverX + coverSize, coverY, coverX + coverSize, coverY + radius);
        ctx.lineTo(coverX + coverSize, coverY + coverSize - radius);
        ctx.quadraticCurveTo(coverX + coverSize, coverY + coverSize, coverX + coverSize - radius, coverY + coverSize);
        ctx.lineTo(coverX + radius, coverY + coverSize);
        ctx.quadraticCurveTo(coverX, coverY + coverSize, coverX, coverY + coverSize - radius);
        ctx.lineTo(coverX, coverY + radius);
        ctx.quadraticCurveTo(coverX, coverY, coverX + radius, coverY);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, coverX, coverY, coverSize, coverSize);
        ctx.restore();

        resolve();
      };
      img.onerror = resolve;
      img.src = coverUrl;
    });

    // 5. Metadatos de la canción (al lado de la portada)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(songTitle, 380, 230);

    ctx.fillStyle = accentColor;
    ctx.font = "600 30px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(artistName, 380, 280);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "500 20px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("RHYTHMBOX AUDIO STUDIO", 380, 325);

    // 6. Línea divisoria de neón
    const lineGrad = ctx.createLinearGradient(120, 410, width - 120, 410);
    lineGrad.addColorStop(0, accentColor);
    lineGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
    lineGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 410);
    ctx.lineTo(width - 120, 410);
    ctx.stroke();

    // 7. Comillas de adorno gigantes
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.font = "bold 200px serif";
    ctx.fillText("“", 100, 560);

    // 8. Texto de la letra (con ajuste de línea automático)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px 'Plus Jakarta Sans', sans-serif";
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 20;

    const maxWidth = width - 240;
    const lineHeight = 68;
    const words = lyricText.split(" ");
    let line = "";
    let y = 560;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), 130, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 130, y);
    ctx.shadowBlur = 0;

    // 9. Pie de página: Logotipo y marca de agua
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("RHYTHMBOX", 150, height - 130);

    ctx.fillStyle = accentColor;
    ctx.font = "500 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("PURE SOUND & LYRICS", 150, height - 105);

    // Pequeño isotipo dibujado en el pie de página
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(125, height - 120, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(125, height - 120, 6, 0, Math.PI * 2);
    ctx.fill();

    return canvas.toDataURL("image/png");
  },

  downloadImage(dataUrl, filename = "rhythmbox-quote.png") {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
};
