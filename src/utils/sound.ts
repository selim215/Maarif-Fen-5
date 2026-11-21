class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType, volume: number, delay = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playTap() {
    this.tone(520, 0.055, 'sine', 0.08);
  }

  playFlip() {
    this.tone(360, 0.06, 'triangle', 0.09, 0);
    this.tone(540, 0.07, 'triangle', 0.07, 0.04);
  }

  playSuccess() {
    this.tone(523.25, 0.12, 'sine', 0.12, 0);
    this.tone(659.25, 0.18, 'sine', 0.13, 0.09);
  }

  playError() {
    this.tone(240, 0.14, 'triangle', 0.11, 0);
    this.tone(195, 0.18, 'triangle', 0.1, 0.1);
  }

  playUnlock() {
    this.tone(523.25, 0.11, 'sine', 0.11, 0);
    this.tone(659.25, 0.11, 'sine', 0.11, 0.08);
    this.tone(783.99, 0.22, 'sine', 0.13, 0.16);
  }

  playLevelUp() {
    this.tone(523.25, 0.12, 'triangle', 0.13, 0);
    this.tone(659.25, 0.12, 'triangle', 0.13, 0.1);
    this.tone(783.99, 0.14, 'triangle', 0.14, 0.2);
    this.tone(1046.5, 0.34, 'sine', 0.16, 0.32);
  }
}

export const soundEngine = new SoundEngine();
