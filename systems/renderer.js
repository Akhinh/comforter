/**
 * THE COMFORTER — Animation Renderer
 * 16 unique canvas draw functions, one per condition.
 * Each signature: drawFn(ctx, w, h, t)
 *   ctx = CanvasRenderingContext2D
 *   w, h = canvas dimensions
 *   t = DOMHighResTimeStamp (from requestAnimationFrame)
 */

/* Seeded PRNG — deterministic per particle index */
const R = n => (((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1) + 1) % 1;

/* ── Utility ── */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const ANIMATIONS = {

  /* ─────────────────────────────────────────
     COINS  (Poverty / Financial Hardship)
     Gold coins drift upward with sway
  ───────────────────────────────────────── */
  coins(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 22; i++) {
      const speed = 0.28 + R(i * 6 + 0) * 0.55;
      const bx    = R(i * 6 + 1) * w;
      const sway  = Math.sin(t * 0.001 + R(i * 6 + 2) * 6) * 14;
      const y     = h - ((t * speed * 0.042 + R(i * 6 + 3) * h) % (h + 40));
      const r     = 4 + R(i * 6 + 4) * 5;
      const op    = 0.25 + R(i * 6 + 5) * 0.5;
      const hue   = 38 + R(i * 6 + 0) * 16;

      ctx.save();
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.ellipse(bx + sway, y, r, r * 0.52, 0, 0, Math.PI * 2);
      ctx.fillStyle   = `hsl(${hue},88%,62%)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,220,100,0.45)`;
      ctx.lineWidth   = 0.7;
      ctx.stroke();
      /* shine glint */
      ctx.beginPath();
      ctx.ellipse(bx + sway - r * 0.25, y - r * 0.2, r * 0.28, r * 0.14, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,200,0.6)';
      ctx.fill();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     AURORA  (Pain / Suffering)
     Purple-violet wave bands with sparkles
  ───────────────────────────────────────── */
  aurora(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {
      const yBase = h * 0.25 + i * h * 0.11;
      const amp   = 14 + i * 4;
      const op    = 0.14 - i * 0.018;
      ctx.save();
      ctx.globalAlpha = clamp(op, 0, 1);
      const g = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.5, `hsl(${260 + i * 18},72%,72%)`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= w; x += 3) {
        ctx.lineTo(x, yBase + Math.sin(x * 0.018 + t * 0.001 + i * 1.4) * amp);
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    /* sparkle dots */
    for (let i = 0; i < 24; i++) {
      const sx  = R(i * 4 + 0) * w;
      const sy  = R(i * 4 + 1) * h * 0.65;
      const glo = clamp(0.25 + 0.65 * Math.sin(t * 0.002 * (0.6 + R(i * 4 + 2)) + i * 2.8), 0, 1);
      ctx.save();
      ctx.globalAlpha = glo * 0.65;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${280 + R(i * 4 + 3) * 60},80%,82%)`;
      ctx.fill();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     LEAVES  (Grief / Loss)
     Autumn leaves spiralling downward
  ───────────────────────────────────────── */
  leaves(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const speed = 0.32 + R(i * 7 + 0) * 0.65;
      const bx    = R(i * 7 + 1) * w;
      const sway  = Math.sin(t * 0.0009 + R(i * 7 + 2) * 6) * 20;
      const y     = (t * speed * 0.044 + R(i * 7 + 3) * h) % (h + 30) - 12;
      const sz    = 4.5 + R(i * 7 + 4) * 6.5;
      const rot   = t * 0.0012 * (0.4 + R(i * 7 + 5)) + R(i * 7 + 6) * Math.PI * 2;
      const hue   = 16 + R(i * 7 + 0) * 42;
      const op    = 0.32 + R(i * 7 + 1) * 0.45;

      ctx.save();
      ctx.translate(bx + sway, y);
      ctx.rotate(rot);
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.moveTo(0, -sz);
      ctx.bezierCurveTo(sz, -sz * 0.5, sz, sz * 0.5, 0, sz);
      ctx.bezierCurveTo(-sz, sz * 0.5, -sz, -sz * 0.5, 0, -sz);
      ctx.fillStyle = `hsl(${hue},70%,52%)`;
      ctx.fill();
      /* midrib */
      ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(0, sz);
      ctx.strokeStyle = `hsla(${hue},45%,30%,0.55)`;
      ctx.lineWidth = 0.7; ctx.stroke();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     RAIN  (Anxiety / Fear)
     Rainfall streaks + puddle ripples
  ───────────────────────────────────────── */
  rain(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    /* streaks */
    for (let i = 0; i < 40; i++) {
      const speed = 1.1 + R(i * 5 + 0) * 1.0;
      const x     = R(i * 5 + 1) * w;
      const y     = (t * speed * 0.065 + R(i * 5 + 2) * h) % (h + 25) - 12;
      const len   = 10 + R(i * 5 + 3) * 14;
      const op    = 0.22 + R(i * 5 + 4) * 0.42;
      ctx.save();
      ctx.globalAlpha = op;
      ctx.strokeStyle = 'rgba(130,190,255,0.9)';
      ctx.lineWidth   = 0.8;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5, y + len); ctx.stroke();
      ctx.restore();
    }
    /* puddle ripples at bottom */
    for (let i = 0; i < 6; i++) {
      const rx    = R(i * 3 + 0) * w * 0.82 + w * 0.09;
      const phase = (t * 0.0028 + R(i * 3 + 1) * Math.PI * 2) % (Math.PI * 2);
      const rr    = 4 + 18 * (phase / (Math.PI * 2));
      const op    = 0.28 * (1 - phase / (Math.PI * 2));
      ctx.save();
      ctx.globalAlpha = clamp(op, 0, 1);
      ctx.beginPath(); ctx.ellipse(rx, h - 7, rr, rr * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120,178,255,0.8)'; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     STARS  (Loneliness)
     Deep starfield with twinkling + shooting star
  ───────────────────────────────────────── */
  stars(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 45; i++) {
      const x       = R(i * 5 + 0) * w;
      const y       = R(i * 5 + 1) * h;
      const r       = 0.7 + R(i * 5 + 2) * 2.3;
      const twinkle = clamp(0.35 + 0.62 * Math.sin(t * 0.0014 * (0.5 + R(i * 5 + 3)) + i * 1.9), 0, 1);
      const gold    = R(i * 5 + 4) < 0.18;
      ctx.save();
      ctx.globalAlpha = twinkle;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = gold ? 'rgba(201,169,110,0.9)' : 'rgba(200,215,255,0.9)';
      ctx.fill();
      if (r > 1.6) {
        ctx.globalAlpha = twinkle * 0.22;
        ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gold ? 'rgba(201,169,110,0.4)' : 'rgba(180,200,255,0.3)'; ctx.fill();
      }
      ctx.restore();
    }
    /* shooting star every ~7 s */
    const stPhase = (t * 0.00045) % 1;
    if (stPhase < 0.12) {
      const prog = stPhase / 0.12;
      ctx.save();
      ctx.globalAlpha = (1 - prog) * 0.75;
      ctx.beginPath();
      ctx.moveTo(w * 0.15 + prog * w * 0.45, h * 0.12 + prog * h * 0.22);
      ctx.lineTo(w * 0.15 + prog * w * 0.45 - 28 * (1 - prog), h * 0.12 + prog * h * 0.22 - 10 * (1 - prog));
      ctx.strokeStyle = 'rgba(255,245,200,0.9)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     SUNRISE  (Hopelessness)
     Dawn rays breaking the horizon
  ───────────────────────────────────────── */
  sunrise(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cy    = h * 0.74;
    const pulse = 0.86 + 0.14 * Math.sin(t * 0.0009);

    /* horizon glow */
    const hg = ctx.createRadialGradient(w / 2, cy, 0, w / 2, cy, w * 0.72 * pulse);
    hg.addColorStop(0, 'rgba(255,200,80,0.28)');
    hg.addColorStop(0.3, 'rgba(255,135,40,0.14)');
    hg.addColorStop(0.7, 'rgba(180,70,0,0.05)');
    hg.addColorStop(1, 'transparent');
    ctx.fillStyle = hg; ctx.fillRect(0, 0, w, h);

    /* rays */
    for (let i = 0; i < 13; i++) {
      const angle = (i / 13) * Math.PI + 0.08 + Math.sin(t * 0.0003) * 0.04;
      const len   = w * 0.92 * pulse;
      const op    = (0.04 + 0.04 * Math.sin(t * 0.0013 + i)) * Math.abs(Math.cos(angle - Math.PI * 0.5 + 0.05));
      if (op < 0.001) continue;
      ctx.save();
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.moveTo(w / 2, cy);
      ctx.lineTo(w / 2 + Math.cos(angle + Math.PI) * len, cy + Math.sin(angle + Math.PI) * len);
      ctx.strokeStyle = `hsl(${38 + i * 3},92%,68%)`;
      ctx.lineWidth   = 9 + i * 1.5;
      ctx.stroke();
      ctx.restore();
    }
    /* sun */
    ctx.save();
    ctx.globalAlpha = 0.2 + 0.07 * Math.sin(t * 0.0009);
    const sg = ctx.createRadialGradient(w / 2, cy, 0, w / 2, cy, 20 * pulse);
    sg.addColorStop(0, 'rgba(255,235,120,1)');
    sg.addColorStop(1, 'rgba(255,155,40,0.2)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(w / 2, cy, 20 * pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },

  /* ─────────────────────────────────────────
     EMBERS  (Anger / Rage)
     Orange-red sparks rising from below
  ───────────────────────────────────────── */
  embers(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 32; i++) {
      const speed = 0.22 + R(i * 8 + 0) * 0.52;
      const bx    = R(i * 8 + 1) * w;
      const sway  = Math.sin(t * 0.0014 + R(i * 8 + 2) * 5) * 13;
      const y     = h - ((t * speed * 0.04 + R(i * 8 + 3) * h) % (h + 22));
      const r     = 1.2 + R(i * 8 + 4) * 2.8;
      const life  = clamp(1 - Math.max(0, -y) / 18, 0, 1);
      const op    = (0.28 + R(i * 8 + 5) * 0.5) * life;
      const hue   = 12 + R(i * 8 + 6) * 28;

      ctx.save();
      ctx.globalAlpha = clamp(op, 0, 1);
      ctx.beginPath(); ctx.arc(bx + sway, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue},96%,62%)`; ctx.fill();
      ctx.globalAlpha *= 0.28;
      ctx.beginPath(); ctx.arc(bx + sway, y, r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue},90%,52%)`; ctx.fill();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     SCALES  (Injustice)
     Balance scales swaying gently
  ───────────────────────────────────────── */
  scales(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cx   = w / 2;
    const cy   = h * 0.42;
    const sway = Math.sin(t * 0.0007) * 0.14;

    ctx.save();
    ctx.strokeStyle = 'rgba(201,169,110,0.55)';
    ctx.lineWidth   = 1.3;

    /* pole */
    ctx.beginPath(); ctx.moveTo(cx, cy + h * 0.38); ctx.lineTo(cx, cy - h * 0.25); ctx.stroke();
    /* top ornament */
    ctx.beginPath(); ctx.arc(cx, cy - h * 0.25, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(201,169,110,0.5)'; ctx.fill();

    /* beam */
    const bw  = w * 0.33;
    const lx  = cx - bw, rx = cx + bw;
    const ldy = Math.sin(sway) * bw * 0.52;
    ctx.beginPath(); ctx.moveTo(lx, cy + ldy); ctx.lineTo(rx, cy - ldy); ctx.stroke();

    /* chains + pans */
    [[lx, cy + ldy], [rx, cy - ldy]].forEach(([px, py]) => {
      const panY = py + h * 0.18;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, panY); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(px, panY, 18, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle   = 'rgba(201,169,110,0.16)'; ctx.fill();
      ctx.strokeStyle = 'rgba(201,169,110,0.5)';  ctx.stroke();
    });

    ctx.restore();
    /* halo */
    ctx.save();
    ctx.globalAlpha = 0.12 + 0.09 * Math.sin(t * 0.002);
    ctx.beginPath(); ctx.arc(cx, cy - h * 0.25, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(201,169,110,0.5)'; ctx.fill();
    ctx.restore();
  },

  /* ─────────────────────────────────────────
     PETALS  (Heartbreak)
     Rose petals drifting downward
  ───────────────────────────────────────── */
  petals(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 24; i++) {
      const speed = 0.24 + R(i * 9 + 0) * 0.42;
      const bx    = R(i * 9 + 1) * w;
      const sway  = Math.sin(t * 0.0007 + R(i * 9 + 2) * 6) * 24;
      const y     = (t * speed * 0.038 + R(i * 9 + 3) * h) % (h + 38) - 16;
      const sz    = 5 + R(i * 9 + 4) * 7.5;
      const rot   = t * 0.001 * (0.35 + R(i * 9 + 5)) + R(i * 9 + 6) * Math.PI * 2;
      const hue   = 336 + R(i * 9 + 7) * 24;
      const op    = 0.28 + R(i * 9 + 8) * 0.42;

      ctx.save();
      ctx.translate(bx + sway, y); ctx.rotate(rot);
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(sz, -sz, sz * 1.6, sz * 0.5, 0, sz * 1.9);
      ctx.bezierCurveTo(-sz * 1.6, sz * 0.5, -sz, -sz, 0, 0);
      const pg = ctx.createLinearGradient(0, 0, 0, sz * 1.9);
      pg.addColorStop(0, `hsl(${hue},80%,62%)`);
      pg.addColorStop(1, `hsl(${hue + 10},70%,80%)`);
      ctx.fillStyle = pg; ctx.fill();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     BREATHING  (Stress / Burden)
     Expanding concentric rings — breathe with me
  ───────────────────────────────────────── */
  breathing(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cx      = w / 2;
    const cy      = h / 2;
    const breathe = 0.5 + 0.5 * Math.sin(t * 0.0007);
    const maxR    = Math.min(w, h) * 0.42;

    for (let i = 5; i >= 0; i--) {
      const r  = (i / 5) * maxR * breathe + maxR * 0.08;
      const op = (0.14 - i * 0.018) * (breathe + 0.32);
      ctx.save();
      ctx.globalAlpha = clamp(op, 0, 1);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(78,205,196,0.85)'; ctx.lineWidth = 1.1; ctx.stroke();
      ctx.restore();
    }
    /* centre pulse */
    const cr = 4 + 4 * breathe;
    ctx.save();
    ctx.globalAlpha = 0.48 + 0.3 * breathe;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 3.5);
    cg.addColorStop(0, 'rgba(78,205,196,0.85)'); cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(cx, cy, cr * 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },

  /* ─────────────────────────────────────────
     COMPASS  (Seeking Guidance)
     Compass needle slowly settling on north
  ───────────────────────────────────────── */
  compass(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const r  = Math.min(w, h) * 0.38;

    /* outer ring + ticks */
    ctx.save(); ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,169,110,0.65)'; ctx.lineWidth = 1; ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a  = (i / 12) * Math.PI * 2;
      const r0 = r * (i % 3 === 0 ? 0.80 : 0.90);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r,  cy + Math.sin(a) * r);
      ctx.strokeStyle = 'rgba(201,169,110,0.5)'; ctx.lineWidth = 0.9; ctx.stroke();
    }
    ctx.restore();

    /* needle — gently drifting toward north */
    const angle = -Math.PI / 2 + Math.sin(t * 0.0006) * 0.28;
    const nl    = r * 0.68;
    ctx.save(); ctx.globalAlpha = 0.58;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * nl, cy + Math.sin(angle) * nl);
    ctx.strokeStyle = 'rgba(201,169,110,0.88)'; ctx.lineWidth = 2.2; ctx.stroke();
    /* south half */
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle + Math.PI) * nl * 0.55, cy + Math.sin(angle + Math.PI) * nl * 0.55);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1.6; ctx.stroke();
    /* pin */
    ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(201,169,110,0.75)'; ctx.fill();
    ctx.restore();

    /* tip beam */
    const tipX = cx + Math.cos(angle) * nl;
    const tipY = cy + Math.sin(angle) * nl;
    ctx.save(); ctx.globalAlpha = 0.08 + 0.06 * Math.sin(t * 0.0014);
    const lg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, r * 0.62);
    lg.addColorStop(0, 'rgba(201,169,110,0.5)'); lg.addColorStop(1, 'transparent');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(tipX, tipY, r * 0.62, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },

  /* ─────────────────────────────────────────
     BLOOM  (Shame / Guilt)
     Flower petals slowly opening
  ───────────────────────────────────────── */
  bloom(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const cx   = w / 2, cy = h / 2;
    const open = 0.5 + 0.5 * Math.sin(t * 0.0005);
    const n    = 8;

    for (let i = 0; i < n; i++) {
      const a    = (i / n) * Math.PI * 2;
      const plen = Math.min(w, h) * 0.35 * open;
      const pw   = plen * 0.58;
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(a + t * 0.0003);
      ctx.globalAlpha = 0.17 + 0.1 * open;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-pw * 0.5, plen * 0.32, -pw * 0.5, plen * 0.72, 0, plen);
      ctx.bezierCurveTo(pw * 0.5, plen * 0.72, pw * 0.5, plen * 0.32, 0, 0);
      const pg = ctx.createLinearGradient(0, 0, 0, plen);
      pg.addColorStop(0, `hsl(${292 + i * 5},66%,52%)`);
      pg.addColorStop(1, `hsl(${318 + i * 5},72%,76%)`);
      ctx.fillStyle = pg; ctx.fill();
      ctx.restore();
    }
    /* centre stamen */
    ctx.save(); ctx.globalAlpha = 0.42 + 0.22 * open;
    ctx.beginPath(); ctx.arc(cx, cy, 5 + 4 * open, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,210,140,0.75)'; ctx.fill();
    ctx.restore();
  },

  /* ─────────────────────────────────────────
     FIREFLIES  (Ingratitude / Gratitude)
     Golden fireflies dancing through the dark
  ───────────────────────────────────────── */
  fireflies(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 28; i++) {
      const bx  = R(i * 6 + 0) * w;
      const by  = R(i * 6 + 1) * h;
      const fx  = bx + Math.sin(t * 0.001 * (0.65 + R(i * 6 + 2)) + i * 2.1) * w * 0.11;
      const fy  = by + Math.cos(t * 0.0008 * (0.48 + R(i * 6 + 3)) + i * 1.8) * h * 0.09;
      const glo = clamp(0.3 + 0.7 * Math.pow(Math.sin(t * 0.002 * (1 + R(i * 6 + 4)) + i * 3.1), 2), 0, 1);
      const hue = 50 + R(i * 6 + 5) * 42;

      ctx.save();
      ctx.globalAlpha = glo * 0.65;
      ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue},92%,74%)`; ctx.fill();
      ctx.globalAlpha = glo * 0.18;
      ctx.beginPath(); ctx.arc(fx, fy, 9, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue},80%,64%)`; ctx.fill();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     FOGSTARS  (Doubt / Uncertainty)
     Stars emerging through shifting mist
  ───────────────────────────────────────── */
  fogstars(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    /* fog layers */
    for (let i = 0; i < 4; i++) {
      const fy = R(i * 3 + 0) * h;
      const fx = R(i * 3 + 1) * w * 0.6 + w * 0.2;
      const op = 0.055 + 0.038 * Math.sin(t * 0.0004 + i * 2);
      ctx.save(); ctx.globalAlpha = clamp(op, 0, 1);
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, w * 0.52);
      fg.addColorStop(0, 'rgba(200,215,255,0.85)'); fg.addColorStop(1, 'transparent');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
    /* emerging stars */
    for (let i = 0; i < 32; i++) {
      const x  = R(i * 4 + 0) * w;
      const y  = R(i * 4 + 1) * h;
      const em = clamp(0.28 + 0.72 * Math.sin(t * 0.0011 + R(i * 4 + 2) * 5 + i), 0, 1);
      const r  = 0.65 + R(i * 4 + 3) * 1.9;
      ctx.save(); ctx.globalAlpha = em * 0.68;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,215,255,0.9)'; ctx.fill();
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     VINES  (Envy / Jealousy)
     Creeping vines growing up from the earth
  ───────────────────────────────────────── */
  vines(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    const progress = 0.52 + 0.48 * Math.sin(t * 0.0004);

    for (let v = 0; v < 6; v++) {
      ctx.save();
      ctx.globalAlpha = 0.22 + 0.07 * Math.sin(t * 0.001 + v);
      ctx.strokeStyle = `hsl(${124 + v * 7},56%,40%)`;
      ctx.lineWidth   = 1 + v * 0.28;
      ctx.beginPath();
      const sx = R(v * 5 + 0) * w * 0.85 + w * 0.08;
      ctx.moveTo(sx, h);
      const segs = 9;
      for (let s = 1; s <= segs; s++) {
        const p  = s / segs;
        const cp = Math.min(p / progress, 1);
        const nx = sx + Math.sin(s * 0.95 + v * 2.1) * w * 0.16;
        const ny = h - p * h * cp;
        ctx.quadraticCurveTo(
          sx + Math.sin(s * 0.7 + v) * w * 0.11, h - p * h * cp * 0.88,
          nx, ny
        );
      }
      ctx.stroke();

      /* leaves */
      for (let l = 0; l < 5; l++) {
        const lp = (l + 1) / 6;
        if (lp > progress * 0.88) continue;
        const lx  = sx + Math.sin(l * 0.95 + v * 2.1) * w * 0.16;
        const ly  = h - lp * h;
        const dir = (l % 2 === 0) ? 1 : -1;
        ctx.beginPath();
        ctx.ellipse(lx + dir * 9, ly, 8, 4, -Math.PI * 0.28 * dir + l * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${126 + v * 7 + l * 5},62%,44%)`;
        ctx.fill();
      }
      ctx.restore();
    }
  },

  /* ─────────────────────────────────────────
     DROPLETS  (Impatience / Patience)
     Very slow teardrops — time itself slowing
  ───────────────────────────────────────── */
  droplets(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      const speed = 0.07 + R(i * 7 + 0) * 0.11; /* intentionally very slow */
      const x     = R(i * 7 + 1) * w;
      const y     = (t * speed * 0.022 + R(i * 7 + 2) * h) % (h + 32) - 14;
      const r     = 2.5 + R(i * 7 + 3) * 4;
      const op    = 0.28 + R(i * 7 + 4) * 0.38;

      ctx.save(); ctx.globalAlpha = op;
      /* teardrop */
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.9);
      ctx.bezierCurveTo(x + r, y - r * 0.5, x + r, y + r * 0.5, x, y + r);
      ctx.bezierCurveTo(x - r, y + r * 0.5, x - r, y - r * 0.5, x, y - r * 1.9);
      ctx.fillStyle = 'rgba(90,175,255,0.7)'; ctx.fill();
      /* highlight */
      ctx.beginPath(); ctx.arc(x - r * 0.26, y - r * 0.5, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,235,255,0.55)'; ctx.fill();
      ctx.restore();
    }
    /* surface ripples on impact */
    for (let i = 0; i < 5; i++) {
      const rx    = R(i * 4 + 0) * w * 0.8 + w * 0.1;
      const phase = (t * 0.0018 + R(i * 4 + 1) * Math.PI * 2) % (Math.PI * 2);
      const rr    = 3 + 14 * (phase / (Math.PI * 2));
      const op    = 0.24 * (1 - phase / (Math.PI * 2));
      ctx.save(); ctx.globalAlpha = clamp(op, 0, 1);
      ctx.beginPath(); ctx.ellipse(rx, h - 6, rr, rr * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(90,175,255,0.75)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.restore();
    }
  },
};