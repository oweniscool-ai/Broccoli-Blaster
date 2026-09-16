/**
 * Broccoli Buster - Web Audio Engine
 */
class AudioManager {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playShootSound(isRpg = false) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (isRpg) {
            // RPG Launcher Rocket Fire
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } else {
            // Rifle Plasma Shot
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.1);
        }
    }

    playExplosion() {
        if (!this.ctx) return;

        // White noise generator for explosion
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }
}

export const AudioSystem = new AudioManager();
