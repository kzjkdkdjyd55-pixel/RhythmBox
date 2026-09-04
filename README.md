# 🎵 RhythmBox — Kinetic Sound & Lyric Studio

**RhythmBox** es un reproductor de música moderno, original y multiplataforma construido desde cero con **JavaScript ES6+ modular, HTML5 semántico, CSS3 avanzado (Glassmorphism & Neon Aura)** y **Web Audio API**.

---

## 🌟 Características Principales

### 1. Identidad de Marca y Diseño Futurista
- **Estética Deep Obsidian & Neon Aura**: Paleta base oscura (`#07080d`) con contrastes neón vibrantes (Cian eléctrico `#00f2fe`, Violeta `#9d4edd`, Rosa `#f72585`, Esmeralda `#00f59b`).
- **Superficies Glassmorphism**: `backdrop-filter: blur(20px)` con bordes translúcidos y sombras de resplandor multicapa.
- **Extracción Dinámica de Color**: El lienzo ambiental de fondo y los acentos luminosos reaccionan y se tiñen automáticamente con la paleta de colores de la carátula en reproducción.
- **Micro-interacciones Fluidas**: Transiciones suaves a 60fps con curvas de aceleración cubic-bezier.
- **Isotipo Vectorial Propio**: Resonador geométrico cinético en SVG escalable.

### 2. Función Estrella: Letras Sincronizadas y Karaoke Personalizable
- **Sincronización Línea por Línea**: Desplazamiento automático suave con centrado cinético de la línea activa y atenuación de las demás.
- **Modo Karaoke Avanzado**: Resaltado progresivo palabra por palabra con gradiente dinámico sobre la frase en tiempo real.
- **Personalización Visual en Vivo**:
  - **Tipografía**: Geométrica Sans, Editorial Serif, Cyber Monospace y Futura Display.
  - **Escala de Texto**: Slider interactivo de 16px a 38px.
  - **Alineación**: Centrado o Izquierda.
  - **Color de Texto Activo**: Acento Neón, Dinámico (color de carátula) o Alto Contraste.
  - **Estilo de Fondo**: Sólido oscuro, Degradado dinámico o Desenfoque completo de la carátula.
  - **Transición entre Líneas**: Desvanecido suave (Fade), Desplazamiento (Slide) o Escala cinética (Scale).
- **Modo "Solo Letras" (Zen)**: Pantalla inmersiva minimalista sin distracciones.
- **Generador de Tarjetas Visuales para Redes Sociales**: Selecciona cualquier fragmento o línea lírica y exporta una imagen estilizada de alta resolución (1080x1080) en formato PNG con la carátula, frase y firma de RhythmBox.
- **Manejo de Estados**: Soporte para letras sincronizadas, letras estáticas con opción de "Aportar sincronización / Reportar error" y estado para canciones puramente instrumentales.

### 3. Motor de Audio Profesional (Web Audio API)
- **Ecualizador Gráfico de 10 Bandas**:
  - Frecuencias: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz.
  - Presets incluidos: *Plano, Rock, Pop, Electrónica, Jazz, Súper Graves, Realce Vocal, Acústico* y modo *Personalizado*.
- **Sintetizador Musical Adaptativo**: Genera música estéreo real con bombos, cajas, hi-hats, arpegios y bajos para todas las 20 canciones mock según su estilo (Synthwave, Lofi, Cyberpunk, Ambient, Cinematic).
- **Visualizador de Espectro en Tiempo Real**: Canvas a 60fps con barras radiales reactivas a las frecuencias del analizador de audio.
- **Crossfade y Gapless**: Transición suave de 0s a 12s entre canciones sin silencios.
- **Temporizador de Apagado (Sleep Timer)**: 15m, 30m, 45m, 60m o fin de canción, con desvanecimiento progresivo de volumen y badge de cuenta regresiva.
- **Integración con Sistema Operativo (MediaSession API)**: Controles nativos en pantalla de bloqueo, widgets de notificación y teclas multimedia del teclado.

### 4. Gestión de Biblioteca y Cola de Reproducción
- **Cola Reordenable por Drag & Drop**: Arrastra canciones para reordenar tanto con mouse como con gestos táctiles.
- **Acciones Rápidas**: "Reproducir siguiente", "Añadir a la cola", "Me gusta", "Guardar cola como nueva playlist".
- **Biblioteca Completa**: Pestañas por Canciones, Álbumes, Artistas, Playlists y Descargas Offline.
- **Búsqueda en Tiempo Real**: Filtro instantáneo con debounce que busca en títulos, artistas, géneros, álbumes y letras de canciones, con historial de búsqueda y mosaicos de exploración por género.
- **Persistencia Local**: Todas las preferencias, canciones favoritas, playlists de usuario, historial y caché se guardan en `localStorage`.

### 5. Multiplataforma y Responsivo (PWA)
- Funciona fluidamente en **computadoras de escritorio** (Windows, macOS, Linux) y **dispositivos móviles** (Android, iOS).
- Barra lateral expandible en escritorio y barra de navegación inferior táctil en móviles.
- Mini-reproductor persistente con gesto de swipe-up o clic para abrir la vista Now Playing a pantalla completa.
- Instalable como Progressive Web App con manifiesto y `sw.js` para funcionamiento offline.
- Internacionalización bilingüe completa (Español / Inglés) con traducción instantánea.

---

## 🚀 Cómo Ejecutar la Aplicación

Para iniciar el servidor local y abrir RhythmBox en cualquier navegador:

```bash
cd /home/kzjkdkdjyd/.gemini/antigravity/scratch/rhythmbox
python3 -m http.server 8080
```

Luego abre tu navegador en:
👉 **`http://localhost:8080`**

*(También puedes abrir directamente el archivo `index.html` en navegadores compatibles).*

---

## ⌨️ Atajos de Teclado Globales

| Tecla | Acción |
|---|---|
| <kbd>Espacio</kbd> | Reproducir / Pausar |
| <kbd>→</kbd> | Adelantar 5 segundos |
| <kbd>←</kbd> | Retroceder 5 segundos |
| <kbd>↑</kbd> | Subir volumen (+5%) |
| <kbd>↓</kbd> | Bajar volumen (-5%) |
| <kbd>M</kbd> | Silenciar / Activar sonido |
| <kbd>L</kbd> | Abrir / Cerrar pantalla de Letras |
| <kbd>Esc</kbd> | Cerrar modales o vista Now Playing |

---

## 📂 Arquitectura de Código

```
rhythmbox/
├── index.html                  # Shell SPA semántico y accesible
├── manifest.webmanifest        # Manifiesto PWA
├── sw.js                       # Service Worker para caché offline
├── css/
│   ├── main.css                # Reset, tipografía, variables y grid responsive
│   ├── theme.css               # Temas (Obsidian, Quartz, Midnight, Aurora, Sunset, Dinámico)
│   ├── components.css          # Tarjetas, track rows, sliders, botones y modales
│   ├── player.css              # Mini-player y Now Playing con canvas visualizer
│   ├── lyrics.css              # Letras sincronizadas, modo karaoke y tipografías
│   └── views.css               # Home, Biblioteca, Búsqueda, Cola, Ajustes y Detalles
└── js/
    ├── app.js                  # Router SPA, inicializador y eventos globales
    ├── state.js                # Almacén de estado reactivo y event bus
    ├── audio/
    │   ├── engine.js           # AudioContext, EQ 10 bandas, Analyser, Gain
    │   ├── synthesizer.js      # Síntesis procedural para las 20 pistas mock
    │   └── mediaSession.js     # Controles nativos de sistema y bloqueo
    ├── data/
    │   ├── songs.js            # 20 canciones mock con metadatos y letras LRC
    │   ├── playlists.js        # Mixes diarios y colecciones iniciales
    │   └── i18n.js             # Diccionario completo ES / EN
    ├── utils/
    │   ├── colorExtractor.js   # Extracción de colores de portada vía Canvas
    │   ├── lyricsCardGen.js    # Generador de tarjetas visuales en Canvas
    │   └── storage.js          # Persistencia en LocalStorage
    └── views/
        ├── homeView.js         # Vista de Inicio
        ├── libraryView.js      # Vista de Biblioteca
        ├── searchView.js       # Vista de Búsqueda en tiempo real
        ├── playerView.js       # Vista Now Playing
        ├── lyricsView.js       # Vista de Letras y Karaoke
        ├── queueView.js        # Vista de Cola Drag & Drop
        ├── detailView.js       # Vista de Detalle (Álbum / Artista / Playlist)
        └── settingsView.js     # Vista de Ajustes y Ecualizador
```
