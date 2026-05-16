/**
 * THE COMFORTER — Verse Engine
 * Handles verse selection, card rendering, and language switching.
 */

import { VERSES } from '../data/verses.js';

export class VerseEngine {
  constructor() {
    this.currentConditionId = null;
    this.currentVerse       = null;
    this.currentLang        = 'english';
  }

  /** Pick a random verse for the given condition and render it into #verse-area */
  load(conditionId, conditionLabel) {
    this.currentConditionId = conditionId;
    const pool = VERSES[conditionId] ?? [];
    if (!pool.length) return;

    this.currentVerse = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById('condition-badge').textContent = `✦  ${conditionLabel}`;
    this._render();
  }

  /** Render the current verse (called on load or language switch) */
  _render() {
    const v    = this.currentVerse;
    const lang = this.currentLang;
    const area = document.getElementById('verse-area');
    if (!v || !area) return;

    area.innerHTML = `
      <div class="verse-card">

        <!-- Language tabs -->
        <div class="lang-tabs">
          <button class="ltab ${lang === 'arabic'  ? 'active' : ''}" data-lang="arabic">العربية</button>
          <button class="ltab ${lang === 'english' ? 'active' : ''}" data-lang="english">English</button>
          <button class="ltab ${lang === 'french'  ? 'active' : ''}" data-lang="french">Français</button>
        </div>

        <!-- Arabic -->
        <p class="v-arabic"  style="display:${lang === 'arabic'  ? 'block' : 'none'}">${v.arabic}</p>

        <!-- English -->
        <p class="v-trans"   style="display:${lang === 'english' ? 'block' : 'none'}">${v.english}</p>

        <!-- French -->
        <p class="v-trans"   style="display:${lang === 'french'  ? 'block' : 'none'}">${v.french}</p>

        <!-- Reference -->
        <div class="v-ref">— ${v.ref}</div>

        <!-- Reflection -->
        <div class="v-reflection">
          <div class="refl-label">✦ Reflection</div>
          <p class="refl-text">${v.reflection}</p>
        </div>
      </div>

      <div class="verse-actions">
        <button class="btn-action primary" id="btn-another">✦ Another Verse</button>
        <button class="btn-action"         id="btn-back-cond">← Different Condition</button>
      </div>
    `;

    /* Wire up tab clicks */
    area.querySelectorAll('.ltab').forEach(btn => {
      btn.addEventListener('click', () => this.switchLang(btn.dataset.lang));
    });

    /* Trigger CSS entry animation */
    const card = area.querySelector('.verse-card');
    if (card) {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = '';
    }
  }

  /** Switch language without picking a new verse */
  switchLang(lang) {
    this.currentLang = lang;
    this._render();
  }

  /** Pick a different random verse for the same condition */
  another() {
    const pool = VERSES[this.currentConditionId] ?? [];
    if (pool.length <= 1) { this._render(); return; }

    let next;
    do { next = pool[Math.floor(Math.random() * pool.length)]; }
    while (next === this.currentVerse && pool.length > 1);

    this.currentVerse = next;
    this._render();
  }
}