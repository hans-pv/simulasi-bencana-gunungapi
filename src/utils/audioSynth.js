/**
 * Web Audio API Procedural Synthesizer
 * Menghasilkan suara gemuruh vulkanik, ledakan gelombang kejut, dan deburan tsunami tanpa aset eksternal
 */

class VolcanicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.rumbleNode = null;
    this.rumbleGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopRumble();
    } else {
      this.startRumble();
    }
    return !this.isMuted;
  }

  startRumble() {
    if (this.isMuted || !this.ctx) return;
    if (this.rumbleNode) return;

    try {
      // Sub-bass oscillator
      const osc = this.ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(32, this.ctx.currentTime);

      // Low pass filter to create deep earth tremor
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(75, this.ctx.currentTime);

      // Gain node
      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(this.rumbleGain);
      this.rumbleGain.connect(this.ctx.destination);

      osc.start();
      this.rumbleNode = osc;
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  stopRumble() {
    if (this.rumbleNode) {
      try {
        this.rumbleNode.stop();
        this.rumbleNode.disconnect();
      } catch {
        // Ignored
      }
      this.rumbleNode = null;
    }
  }

  playBlast(vei = 6) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown noise / explosion transient
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140 + (vei * 40), this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 2.0);

      const gain = this.ctx.createGain();
      const intensity = Math.min(0.7, 0.15 * (vei - 2));
      gain.gain.setValueAtTime(intensity, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn("Audio blast error:", e);
    }
  }

  playTsunamiWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 3.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(350, this.ctx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 2.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.9);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn("Audio surge error:", e);
    }
  }
}

export const volcanicAudio = new VolcanicAudioEngine();
