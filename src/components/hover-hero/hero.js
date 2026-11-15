// Hover-reveal hero: hovering (or tapping) a highlighted phrase springs a set of
// objects out from behind it. Works for every .hx-hero on the page.
(function () {
  function initHero(hero) {
    const title = hero.querySelector('.hx-title');
    const triggers = [...hero.querySelectorAll('.hx-trigger')];
    const items = [...hero.querySelectorAll('.hx-item')];
    const layers = Object.fromEntries(
      [...hero.querySelectorAll('.hx-layer')].map(l => [l.dataset.layer, l])
    );

    // On narrow screens, squeeze the scatter horizontally and push it
    // vertically away from the headline so items never cover the text.
    function fit() {
      // Offsets were authored around a 590x84px headline; stretch them to the real one
      const range = document.createRange();
      range.selectNodeContents(title);
      const box = range.getBoundingClientRect();
      if (!box.width) return;
      const sx = Math.max(1, box.width / 590) * 1.24;
      const sy = Math.max(1, box.height / 84) * 1.24;
      // Keep the outermost items (drawings are ~105px wide) inside the section's edges
      const k = Math.min(1, (hero.clientWidth / 2 - 70) / (440 * sx / 1.24));
      const push = k < 1 ? box.height / 2 + 10 : 0;
      const narrow = k < 1;
      // Phones: four drawings per word, where there is free space: two beside
      // the short first line of the headline, two beside the buttons under it.
      const actions = hero.querySelector('.hx-actions');
      const kicker = hero.querySelector('.hx-kicker');
      const spot = new Map(); // item -> 'top' | 'bottom'
      if (narrow) {
        Object.values(layers).forEach(layer => {
          const all = [...layer.querySelectorAll('.hx-item')];
          const side = sign => all.filter(it => Math.sign(parseFloat(it.style.getPropertyValue('--x'))) === sign).slice(0, 2);
          [side(-1), side(1)].forEach(([top, bottom]) => {
            if (top) spot.set(top, 'top');
            if (bottom) spot.set(bottom, 'bottom');
          });
        });
      }
      items.forEach(it => {
        const x = parseFloat(it.style.getPropertyValue('--x')) * sx;
        const y = parseFloat(it.style.getPropertyValue('--y')) * sy;
        it.classList.toggle('hx-skip', narrow && !spot.has(it));
        if (narrow && spot.has(it) && actions) {
          const l = it.parentElement.getBoundingClientRect();
          const a = actions.getBoundingClientRect();
          // up to 640px the headline is capped at 360px and opens with a short line;
          // wider than that, the name line above it has the room instead
          const k2 = kicker.getBoundingClientRect();
          const topY = hero.clientWidth <= 640 ? box.top + 28 : k2.top + k2.height / 2;
          const cy = spot.get(it) === 'top' ? topY : a.top + a.height / 2;
          it.style.setProperty('--tx', Math.sign(x) * (hero.clientWidth / 2 - 42) + 'px');
          it.style.setProperty('--ty', cy - l.top + 'px');
          return;
        }
        const ty = narrow ? y * 0.5 + Math.sign(y || 1) * push : y;
        it.style.setProperty('--tx', x * k + 'px');
        it.style.setProperty('--ty', ty + 'px');
      });
    }

    // Items start (and return) at the hovered word, so they appear to burst out of it.
    function setOrigin(trigger, layer) {
      const w = trigger.getBoundingClientRect();
      const l = layer.getBoundingClientRect();
      const ox = w.left + w.width / 2 - l.left;
      const oy = w.top + w.height / 2 - l.top;
      layer.querySelectorAll('.hx-item').forEach(it => {
        it.style.setProperty('--ox', ox + 'px');
        it.style.setProperty('--oy', oy + 'px');
      });
    }

    function activate(trigger) {
      triggers.forEach(t => {
        const on = t === trigger;
        const layer = layers[t.dataset.set];
        t.classList.toggle('hx-is-active', on);
        if (!layer) return;
        if (on) setOrigin(t, layer);
        layer.classList.toggle('hx-is-active', on);
      });
    }

    triggers.forEach(t => {
      // keyboard: the phrases are tab stops, and focus reveals the set like hover does
      t.tabIndex = 0;
      t.addEventListener('focus', () => activate(t));
      t.addEventListener('blur', () => activate(null));
      t.addEventListener('keydown', e => {
        if (e.key === 'Escape') activate(null);
      });
      t.addEventListener('mouseenter', () => activate(t));
      t.addEventListener('mouseleave', () => activate(null));
      // Tap support for touch devices
      t.addEventListener('click', () => activate(t.classList.contains('hx-is-active') ? null : t));
    });

    new ResizeObserver(fit).observe(hero);
    fit();
    if (document.fonts) document.fonts.ready.then(fit);
  }

  // The drawings only show on hover, so fetch them once the page has settled
  // instead of competing with what is on screen.
  function loadArt(hero) {
    const load = () => hero.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    hero.addEventListener('pointerenter', load, { once: true });
    hero.addEventListener('focusin', load, { once: true });
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1500));
    if (document.readyState === 'complete') idle(load);
    else window.addEventListener('load', () => idle(load), { once: true });
  }

  function initAll() {
    document.querySelectorAll('.hx-hero:not([data-hx-ready])').forEach(hero => {
      hero.dataset.hxReady = '';
      initHero(hero);
      loadArt(hero);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
  window.initHeroSections = initAll;
})();
