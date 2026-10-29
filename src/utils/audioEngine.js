// Web Audio API synthesizer for tactile acoustic feedback & piano
class AcousticSoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.5;
    this.noteFreqs = {
      C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13,
      E: 329.63, F: 349.23, 'F#': 369.99, G: 392.00,
      'G#': 415.30, A: 440.00, 'A#': 466.16, B: 493.88,
      C2: 523.25, 'C#2': 554.37, D2: 587.33, 'D#2': 622.25,
      E2: 659.25, F2: 698.46, 'F#2': 739.99, G2: 783.99,
    };
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTapChirp(freq = 680, duration = 0.04) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.25 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playPianoNote(noteName, octaveMultiplier = 1) {
    this.init();
    if (!this.ctx) return;
    const baseFreq = this.noteFreqs[noteName] || 440;
    const freq = baseFreq * octaveMultiplier;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.6 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }
}

export const audioEngine = new AcousticSoundEngine();
