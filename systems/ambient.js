/**
 * THE COMFORTER — Ambient Background System
 * Manages the full-screen verse background canvas (#verse-bg).
 * Fades in/out as conditions change and draws the active animation at full scale.
 */

import { ANIMATIONS } from './renderer.js';
import { THEMES }     from '../data/themes.js';

export class AmbientBackground {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.W = 0; this.H = 0;
    this.activeAnim  = null; /* animKey string */
    this.activeTheme = null; /* themeKey string */
    this.opacity     = 0;
    this.targetOp    = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
  }

  /** Call when entering the verse screen for a given condition */
  activate(animKey, themeKey) {
    this.activeAnim  = animKey;
    this.activeTheme = themeKey;
    this.targetOp    = 1;
    this._applyTheme(themeKey);
  }

  /** Call when leaving the verse screen */
  deactivate() {
    this.targetOp = 0;
  }

  /** Smooth opacity lerp + draw — called every RAF tick */
  draw(t) {
    /* Lerp opacity */
    this.opacity += (this.targetOp - this.opacity) * 0.025;

    this.ctx.clearRect(0, 0, this.W, this.H);

    if (this.opacity < 0.005 || !this.activeAnim) return;

    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    ANIMATIONS[this.activeAnim]?.(this.ctx, this.W, this.H, t);
    this.ctx.restore();
  }

  /** Repaint CSS custom properties to reflect the active condition's colour theme */
  _applyTheme(key) {
    const theme = THEMES[key];
    if (!theme) return;
    const root = document.documentElement.style;
    root.setProperty('--accent',       theme.accent);
    root.setProperty('--accent-l',     theme.accentLight);
    root.setProperty('--accent-dim',   theme.accentDim);
    root.setProperty('--accent-glow',  theme.accentGlow);
    root.setProperty('--bg-overlay',   theme.bgOverlay);
  }

  /** Reset CSS theme to base gold when on splash / conditions screens */
  resetTheme() {
    const root = document.documentElement.style;
    root.setProperty('--accent',       '#c9a96e');
    root.setProperty('--accent-l',     '#e8c98a');
    root.setProperty('--accent-dim',   'rgba(201,169,110,0.28)');
    root.setProperty('--accent-glow',  'rgba(201,169,110,0.12)');
    root.setProperty('--bg-overlay',   'rgba(10,12,24,0.75)');
  }
}