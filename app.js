/**
 * THE COMFORTER — Main Application Controller
 * Bootstraps all systems and wires up navigation + events.
 */

import { ParticleSystem }   from './systems/particles.js';
import { ANIMATIONS }       from './systems/renderer.js';
import { AmbientBackground } from './systems/ambient.js';
import { TransitionManager } from './systems/transitions.js';
import { VerseEngine }       from './systems/verseEngine.js';
import { CONDITIONS }        from './data/conditions.js';

/* ═══════════════════════════════════════════════════
   SYSTEM INSTANCES
═══════════════════════════════════════════════════ */
const particles   = new ParticleSystem(document.getElementById('cosmos'));
const ambient     = new AmbientBackground(document.getElementById('verse-bg'));
const transitions = new TransitionManager();
const verseEngine = new VerseEngine();

/* ═══════════════════════════════════════════════════
   CARD CANVAS REGISTRY
   Each condition card gets its own mini canvas
   running a unique animation.
═══════════════════════════════════════════════════ */
let cardAnimators   = [];   // [{ canvas, ctx, animKey }]
let cardsAnimating  = false;

function initCardCanvases() {
  cardAnimators = [];
  document.querySelectorAll('.cond-card').forEach(card => {
    const canvas  = card.querySelector('canvas');
    if (!canvas) return;
    const rect    = card.getBoundingClientRect();
    canvas.width  = Math.round(rect.width)  || 160;
    canvas.height = Math.round(rect.height) || 120;
    const animKey = card.dataset.anim;
    cardAnimators.push({ canvas, ctx: canvas.getContext('2d'), animKey });
  });
  cardsAnimating = true;
}

/* ═══════════════════════════════════════════════════
   MASTER RAF LOOP
═══════════════════════════════════════════════════ */
function loop(t) {
  /* 1 — global starfield */
  particles.draw();

  /* 2 — verse screen ambient background (opacity managed internally) */
  ambient.draw(t);

  /* 3 — condition card mini-canvases */
  if (cardsAnimating && cardAnimators.length) {
    for (const { canvas, ctx, animKey } of cardAnimators) {
      if (!canvas.isConnected) continue;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ANIMATIONS[animKey]?.(ctx, canvas.width, canvas.height, t);
    }
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ═══════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════ */
async function showSplash() {
  cardsAnimating = false;
  cardAnimators  = [];
  ambient.deactivate();
  ambient.resetTheme();
  await transitions.goTo('splash');
}

async function showConditions() {
  cardsAnimating = false;
  cardAnimators  = [];
  ambient.deactivate();
  ambient.resetTheme();
  renderConditionGrid();
  await transitions.goTo('conditions');

  /* Wait two frames so cards are in the DOM and have layout */
  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => requestAnimationFrame(r));
  initCardCanvases();
  transitions.animateCards();
}

async function showVerse(conditionId, conditionLabel, animKey, themeKey) {
  cardsAnimating = false;

  verseEngine.load(conditionId, conditionLabel);
  ambient.activate(animKey, themeKey);

  await transitions.goTo('verse-display');

  /* Wire up verse-screen buttons (rendered dynamically by VerseEngine) */
  wireVerseButtons(conditionId, conditionLabel, animKey, themeKey);
}

function wireVerseButtons(conditionId, conditionLabel, animKey, themeKey) {
  const area = document.getElementById('verse-area');
  if (!area) return;

  area.addEventListener('click', e => {
    const btn = e.target.closest('[id]');
    if (!btn) return;

    if (btn.id === 'btn-another') {
      verseEngine.another();
      /* Re-wire after re-render */
      wireVerseButtons(conditionId, conditionLabel, animKey, themeKey);
    }
    if (btn.id === 'btn-back-cond') {
      showConditions();
    }
  }, { once: true });
}

/* ═══════════════════════════════════════════════════
   RENDER CONDITION GRID
═══════════════════════════════════════════════════ */
function renderConditionGrid() {
  const grid = document.getElementById('conditions-grid');
  if (!grid) return;

  grid.innerHTML = CONDITIONS.map((c, i) => `
    <button
      class="cond-card"
      data-anim="${c.animKey}"
      style="animation-delay:${i * 0.045}s"
      data-id="${c.id}"
      data-anim-key="${c.animKey}"
      data-theme-key="${c.themeKey}"
      data-label="${c.icon} ${c.name}"
    >
      <canvas></canvas>
      <span class="cond-icon">${c.icon}</span>
      <div class="cond-name">${c.name}</div>
      <div class="cond-sub">${c.sub}</div>
    </button>
  `).join('');

  /* Attach click listeners */
  grid.querySelectorAll('.cond-card').forEach(card => {
    card.addEventListener('click', () => {
      showVerse(
        card.dataset.id,
        card.dataset.label,
        card.dataset.animKey,
        card.dataset.themeKey,
      );
    });
  });
}

/* ═══════════════════════════════════════════════════
   GLOBAL BUTTON WIRING  (static buttons in HTML)
═══════════════════════════════════════════════════ */
document.getElementById('btn-enter')
  ?.addEventListener('click', showConditions);

document.getElementById('btn-back-splash')
  ?.addEventListener('click', showSplash);

window.addEventListener('comforter:showConditions', showConditions);

/* ═══════════════════════════════════════════════════
   PWA — Install Prompt
═══════════════════════════════════════════════════ */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-banner')?.classList.add('show');
});

document.getElementById('btn-install')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('install-banner')?.classList.remove('show');
});

document.getElementById('btn-dismiss-install')?.addEventListener('click', () => {
  document.getElementById('install-banner')?.classList.remove('show');
});

window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner')?.classList.remove('show');
});

/* Register service worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}