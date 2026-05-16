/**
 * THE COMFORTER — Screen Transition Manager
 * Handles navigating between screens with smooth CSS animation sequencing.
 */

export class TransitionManager {
  constructor() {
    this.current = null;
  }

  /** Navigate to a screen by id. Returns a Promise that resolves after entry animation. */
  async goTo(id) {
    /* Hide all screens */
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const target = document.getElementById(id);
    if (!target) return;

    /* small tick to allow style reset to flush before re-adding class */
    await new Promise(r => requestAnimationFrame(r));
    target.classList.add('active');
    this.current = id;
  }

  /** Stagger-animate condition cards on entry */
  animateCards() {
    const cards = document.querySelectorAll('.cond-card');
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.04}s`;
      card.style.animationName  = 'none';
      void card.offsetWidth; /* reflow */
      card.style.animationName  = '';
    });
  }
}