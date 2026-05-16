/**
 * THE COMFORTER — Particle System
 * Global cosmos starfield rendered on the #cosmos canvas
 */

const PRNG = n => (((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1) + 1) % 1;

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.W = 0; this.H = 0;
    this.particles = [];
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this._init();
  }

  _init() {
    this.particles = [];
    const count = Math.floor((this.W * this.H) / 10000);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x:    Math.random() * this.W,
        y:    Math.random() * this.H,
        r:    Math.random() * 1.3 + 0.18,
        o:    Math.random() * 0.55 + 0.08,
        vx:   (Math.random() - 0.5) * 0.11,
        vy:   -(Math.random() * 0.08 + 0.01),
        gold: Math.random() < 0.13,
      });
    }
  }

  draw() {
    const { ctx, W, H, particles } = this;
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,169,110,${p.o})`
        : `rgba(200,215,255,${p.o * 0.5})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -2)      { p.y = H + 2; p.x = Math.random() * W; }
      if (p.x < -2)      p.x = W + 2;
      if (p.x > W + 2)   p.x = -2;
    }
  }
}