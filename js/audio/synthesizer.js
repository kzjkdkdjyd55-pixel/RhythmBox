// RhythmBox - Sintetizador musical adaptativo por Web Audio API
// Genera ritmos, acordes y melodías procedurales en tiempo real para las 20 pistas mock

export class SongSynthesizer {
  constructor(audioCtx, destinationNode) {
    this.ctx = audioCtx;
    this.destination = destinationNode;
    this.isPlaying = false;
    this.currentSong = null;
    this.step = 0;
    this.bpm = 120;
    this.timerId = null;
    this.startTime = 0;
    this.pauseOffset = 0;

    // Escalas y frecuencias en Hz
    this.notes = {
      C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, Bb2: 116.54, B2: 123.47,
      C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08, B3: 246.94,
      C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
    };

    // Buffer de ruido blanco para percusiones (hi-hats y redoblantes)
    this.noiseBuffer = this.createNoiseBuffer();
  }

  createNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  loadSong(song, startOffset = 0) {
    this.stop();
    this.currentSong = song;
    this.bpm = song.bpm || 120;
    this.pauseOffset = startOffset;
    this.step = Math.floor((startOffset * (this.bpm / 60)) * 4) % 64;
  }

  play() {
    if (this.isPlaying || !this.currentSong) return;
    this.isPlaying = true;
    this.startTime = this.ctx.currentTime - this.pauseOffset;

    const stepInterval = (60 / this.bpm) / 4; // semicorcheas (16th notes)
    let nextStepTime = this.ctx.currentTime;

    const scheduler = () => {
      if (!this.isPlaying) return;

      while (nextStepTime < this.ctx.currentTime + 0.1) {
        this.scheduleStep(this.step % 64, nextStepTime);
        nextStepTime += stepInterval;
        this.step++;
      }

      this.timerId = setTimeout(scheduler, 30);
    };

    scheduler();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearTimeout(this.timerId);
    this.pauseOffset = this.ctx.currentTime - this.startTime;
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timerId);
    this.step = 0;
    this.pauseOffset = 0;
  }

  seek(seconds) {
    this.pauseOffset = Math.max(0, seconds);
    if (this.isPlaying) {
      this.startTime = this.ctx.currentTime - this.pauseOffset;
      this.step = Math.floor((this.pauseOffset * (this.bpm / 60)) * 4);
    }
  }

  getCurrentTime() {
    if (!this.isPlaying) return this.pauseOffset;
    return Math.max(0, this.ctx.currentTime - this.startTime);
  }

  scheduleStep(step, time) {
    const mood = this.currentSong.audioMood || "synthwave";

    // 1. Percusión
    this.triggerDrums(mood, step, time);

    // 2. Línea de bajo
    if (step % 2 === 0) {
      this.triggerBass(mood, step, time);
    }

    // 3. Acordes atmosféricos
    if (step % 16 === 0) {
      this.triggerPad(mood, Math.floor(step / 16), time);
    }

    // 4. Arpegio / Melodía
    if (step % 2 === 0) {
      this.triggerArp(mood, step, time);
    }
  }

  // --- Instrumentos Sintetizados ---

  triggerDrums(mood, step, time) {
    // Bombo (Kick)
    if (mood === "synthwave" || mood === "cyberpunk") {
      if (step % 4 === 0) this.playKick(time);
    } else if (mood === "lofi") {
      if (step % 8 === 0 || step % 8 === 6) this.playKick(time, 0.7);
    } else if (mood === "ambient") {
      if (step % 16 === 0) this.playKick(time, 0.4);
    }

    // Caja / Redoblante (Snare)
    if (mood === "synthwave" || mood === "cyberpunk") {
      if (step % 8 === 4) this.playSnare(time);
    } else if (mood === "lofi") {
      if (step % 8 === 4) this.playSnare(time, 0.5, true);
    }

    // Hi-Hat
    if (mood !== "ambient") {
      if (step % 2 === 0) {
        this.playHiHat(time, step % 4 === 2 ? 0.25 : 0.15);
      }
    }
  }

  playKick(time, vol = 1.0) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.6 * vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.destination);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  playSnare(time, vol = 0.8, isRim = false) {
    // Ruido de caja
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = isRim ? "bandpass" : "highpass";
    noiseFilter.frequency.value = isRim ? 1200 : 800;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3 * vol, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + (isRim ? 0.08 : 0.2));

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.destination);

    noiseSource.start(time);
    noiseSource.stop(time + 0.22);

    // Tono del cuerpo
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
    oscGain.gain.setValueAtTime(0.3 * vol, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(oscGain);
    oscGain.connect(this.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  playHiHat(time, vol = 0.2) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);

    source.start(time);
    source.stop(time + 0.06);
  }

  triggerBass(mood, step, time) {
    const bassPatterns = {
      synthwave: [this.notes.D2, this.notes.D2, this.notes.F2, this.notes.G2, this.notes.Bb2, this.notes.A2, this.notes.F2, this.notes.D2],
      cyberpunk: [this.notes.F2, this.notes.F2, this.notes.Eb2, this.notes.F2, this.notes.Ab2, this.notes.G2, this.notes.Eb2, this.notes.C2],
      lofi: [this.notes.C3, this.notes.G2, this.notes.A2, this.notes.F2],
      ambient: [this.notes.C2, this.notes.G2, this.notes.A2, this.notes.F2]
    };

    const pattern = bassPatterns[mood] || bassPatterns.synthwave;
    const noteFreq = pattern[Math.floor((step / 2) % pattern.length)];

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = mood === "cyberpunk" ? "sawtooth" : mood === "synthwave" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(noteFreq, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(mood === "cyberpunk" ? 800 : 450, time);
    filter.frequency.exponentialRampToValueAtTime(150, time + 0.18);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  triggerPad(mood, chordIndex, time) {
    const chordProg = {
      synthwave: [
        [this.notes.D3, this.notes.F3, this.notes.A3, this.notes.C4],
        [this.notes.Bb2, this.notes.D3, this.notes.F3, this.notes.A3],
        [this.notes.C3, this.notes.E3, this.notes.G3, this.notes.B3],
        [this.notes.A2, this.notes.C3, this.notes.E3, this.notes.G3]
      ],
      lofi: [
        [this.notes.C3, this.notes.Eb3, this.notes.G3, this.notes.Bb3],
        [this.notes.F3, this.notes.A3, this.notes.C4, this.notes.Eb4],
        [this.notes.Bb2, this.notes.D3, this.notes.F3, this.notes.Ab3],
        [this.notes.Eb3, this.notes.G3, this.notes.Bb3, this.notes.D4]
      ],
      ambient: [
        [this.notes.C3, this.notes.G3, this.notes.E4],
        [this.notes.A2, this.notes.E3, this.notes.C4],
        [this.notes.F2, this.notes.C3, this.notes.A3],
        [this.notes.G2, this.notes.D3, this.notes.B3]
      ],
      cyberpunk: [
        [this.notes.F2, this.notes.C3, this.notes.Eb3],
        [this.notes.Db2, this.notes.Ab2, this.notes.C3],
        [this.notes.Eb2, this.notes.Bb2, this.notes.Db3],
        [this.notes.C2, this.notes.G2, this.notes.Bb2]
      ]
    };

    const chords = chordProg[mood] || chordProg.synthwave;
    const chord = chords[chordIndex % chords.length];

    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, time);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, time);

      const duration = 2.0;
      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  triggerArp(mood, step, time) {
    if (mood === "ambient") return;

    const notesArp = [
      this.notes.A4, this.notes.C5, this.notes.D5, this.notes.F5,
      this.notes.E5, this.notes.D5, this.notes.C5, this.notes.A4
    ];
    const freq = notesArp[(step / 2) % notesArp.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    filter.type = "bandpass";
    filter.frequency.value = 1800;

    gain.gain.setValueAtTime(0.09, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);

    osc.start(time);
    osc.stop(time + 0.16);
  }
}
