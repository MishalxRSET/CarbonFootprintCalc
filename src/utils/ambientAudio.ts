// Pure Web Audio API Ambient Soundscape Generator
// Creates a soothing, organic harmonic resonance and gentle breeze drone.
// Fully zero-dependency, respectful of browser autoplay restrictions.

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.add(fn);
    fn(this.isRunning);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isRunning));
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public async toggle(): Promise<boolean> {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      await this.start();
      return true;
    }
  }

  public async start(): Promise<void> {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      // Smooth fade in to soft volume
      this.masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

      // Lowpass Filter for warm, organic acoustic tone
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(380, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);
      this.filterNode.connect(this.masterGain);

      // Harmonic frequencies: Earth resonant F# harmonic series (92.5Hz, 138.6Hz, 185Hz, 277Hz)
      const baseFreq = 92.5;
      const ratios = [1, 1.5, 2, 3];

      this.oscillators = ratios.map((ratio, index) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * ratio, this.ctx!.currentTime);

        // Subtle detuning for lush, warm organic chorusing
        osc.detune.setValueAtTime((index - 1.5) * 4, this.ctx!.currentTime);

        const gainVal = 0.25 / (index + 1);
        oscGain.gain.setValueAtTime(gainVal, this.ctx!.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.filterNode!);
        osc.start();
        return osc;
      });

      // LFO for breathing filter modulation (simulating Earth biospheric rhythm ~ 0.12 Hz)
      this.lfoNode = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfoNode.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
      this.lfoNode.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      this.lfoNode.start();

      // Soft pink noise breeze generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      this.noiseNode.start();

      this.isRunning = true;
      this.notify();
    } catch (e) {
      console.warn('Web Audio ambient soundscape unavailable:', e);
      this.isRunning = false;
      this.notify();
    }
  }

  public setMasterVolume(val: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0.001, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // Resonant singing bowl chime on transitions
  public playBellStrike(frequency: number = 432): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.28, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
      strikeGain.connect(this.ctx.destination);

      // Dual harmonic partials for ancient bronze resonance
      const partials = [1, 2.02, 3.01, 4.15];
      const partialGains = [0.6, 0.3, 0.15, 0.08];

      partials.forEach((p, idx) => {
        const osc = this.ctx!.createOscillator();
        const pGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency * p, now);
        pGain.gain.setValueAtTime(partialGains[idx], now);
        pGain.gain.exponentialRampToValueAtTime(0.001, now + (3.5 / (idx + 1)));
        osc.connect(pGain);
        pGain.connect(strikeGain);
        osc.start(now);
        osc.stop(now + 3.6);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stop(): void {
    if (!this.ctx || !this.isRunning) return;

    if (this.masterGain) {
      // Smooth fade out
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    }

    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // already stopped
        }
      });
      this.oscillators = [];

      if (this.noiseNode) {
        try {
          this.noiseNode.stop();
          this.noiseNode.disconnect();
        } catch {
          // ignore
        }
        this.noiseNode = null;
      }

      if (this.lfoNode) {
        try {
          this.lfoNode.stop();
          this.lfoNode.disconnect();
        } catch {
          // ignore
        }
        this.lfoNode = null;
      }

      this.isRunning = false;
      this.notify();
    }, 1300);
  }
}

export const ambientSound = new AmbientSoundEngine();
