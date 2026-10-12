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
      items.forEach(it => {
        const x = parseFloat(it.style.getPropertyValue('--x')) * sx;
        const y = parseFloat(it.style.getPropertyValue('--y')) * sy;
        const ty = k < 1 ? y * 0.5 + Math.sign(y || 1) * push : y;
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
