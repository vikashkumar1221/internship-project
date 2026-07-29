// Web Audio API Audio Engine & Synthesizer DSP Processor

class WebAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.masterCompressor = null;
    this.trackNodes = new Map(); // trackId -> { gain, panner, eqLow, eqMid, eqHigh, delay }
    this.isPlaying = false;
    this.bpm = 120;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Output Chain: Master Gain -> Compressor -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;

      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.value = -12;
      this.masterCompressor.knee.value = 30;
      this.masterCompressor.ratio.value = 12;

      this.masterGain.connect(this.masterCompressor);
      this.masterCompressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create or get track audio DSP chain
  getTrackChain(trackId) {
    this.init();
    if (this.trackNodes.has(trackId)) {
      return this.trackNodes.get(trackId);
    }

    const gainNode = this.ctx.createGain();
    const pannerNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    // 3-Band Parametric EQ
    const eqLow = this.ctx.createBiquadFilter();
    eqLow.type = 'lowshelf';
    eqLow.frequency.value = 250;

    const eqMid = this.ctx.createBiquadFilter();
    eqMid.type = 'peaking';
    eqMid.frequency.value = 1500;

    const eqHigh = this.ctx.createBiquadFilter();
    eqHigh.type = 'highshelf';
    eqHigh.frequency.value = 4000;

    // Connect DSP Chain: Gain -> EQ Low -> EQ Mid -> EQ High -> Panner -> Master
    gainNode.connect(eqLow);
    eqLow.connect(eqMid);
    eqMid.connect(eqHigh);

    if (pannerNode) {
      eqHigh.connect(pannerNode);
      pannerNode.connect(this.masterGain);
    } else {
      eqHigh.connect(this.masterGain);
    }

    const chain = { gain: gainNode, panner: pannerNode, eqLow, eqMid, eqHigh };
    this.trackNodes.set(trackId, chain);
    return chain;
  }

  // Update track volume (dB conversion to gain factor)
  setTrackVolume(trackId, volumeDb) {
    const chain = this.getTrackChain(trackId);
    const gainFactor = volumeDb <= -60 ? 0 : Math.pow(10, volumeDb / 20);
    chain.gain.gain.setValueAtTime(gainFactor, this.ctx.currentTime);
  }

  // Update track pan (-1 to +1)
  setTrackPan(trackId, panValue) {
    const chain = this.getTrackChain(trackId);
    if (chain.panner) {
      chain.panner.pan.setValueAtTime(panValue, this.ctx.currentTime);
    }
  }

  // Update 3-Band EQ
  setTrackEQ(trackId, low, mid, high) {
    const chain = this.getTrackChain(trackId);
    chain.eqLow.gain.setValueAtTime(low, this.ctx.currentTime);
    chain.eqMid.gain.setValueAtTime(mid, this.ctx.currentTime);
    chain.eqHigh.gain.setValueAtTime(high, this.ctx.currentTime);
  }

  // Play MIDI Synth Note (Piano Roll preview & playback)
  playNote(frequency = 440, duration = 0.5, type = 'sawtooth') {
    this.init();
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // ADSR Envelope
    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const audioEngine = new WebAudioEngine();
