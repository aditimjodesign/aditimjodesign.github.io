/* The portfolio's dock navigation and light/dark switch, for the case study
   pages (styles in css/site-nav.css).

   - Dock: the same four links and icons as the homepage dock, pointing back
     to its sections, with the same hover magnification.
   - Theme button: a sun/moon button at the end of the dock. It writes the
     same localStorage key as the homepage ('portfolio-theme'), so the choice
     carries across both. The inline script in each page's <head> applies the
     saved theme before first paint.

   Load after js/case-study.js (it builds the footer) and before js/reveal.js. */

(() => {
  const SITE = window.SITE || { home: '/' };
  const root = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

  const NAV = [
    { label: 'Home', hash: '#home', path: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-7h6v7' },
    { label: 'About', hash: '#about', path: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z' },
    { label: 'Work', hash: '#work', path: 'M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 8h18v12H3V8Zm0 5h18M10 13v2h4v-2' },
    { label: 'Beyond', href: '/beyond.html', path: 'm8 3 4 8 5-5 5 15H2L8 3z' },
  ];
  const BASE_SIZE = 44;
  const MAGNIFIED = 60;
  const DISTANCE = 140;

  const icon = (path, extra = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}><path d="${path}"/></svg>`;

  // The "a" mark, top left, linking to the homepage
  function buildLogo() {
    const a = document.createElement('a');
    a.className = 'site-logo';
    a.href = SITE.home;
    a.setAttribute('aria-label', 'Aditi Manish Joshi, home');
    a.innerHTML = '<span class="site-logo__mark" aria-hidden="true"></span><span class="site-logo__label">Aditi Manish Joshi</span>';
    const wrap = document.createElement('nav');
    wrap.setAttribute('aria-label', 'Home');
    wrap.style.display = 'contents';
    wrap.append(a);
    document.body.prepend(wrap);
  }

  function buildDock() {
    const header = document.createElement('header');
    header.className = 'cs-dock-bar';
    header.innerHTML = `<nav aria-label="Main navigation"><div class="cs-dock">${NAV.map((item) => `
      <span class="cs-dock__icon" style="--dock-size:${BASE_SIZE}px">
        <a href="${item.href || SITE.home + item.hash}" aria-label="${item.label}"${item.href && location.pathname === item.href ? ' aria-current="page"' : ''}${item.label === 'Work' && document.body.dataset.project ? ' aria-current="true"' : ''}>${icon(item.path)}<span class="cs-dock__label">${item.label}</span></a>
      </span>`).join('')}</div></nav>`;

    // Icons grow as the pointer nears them, like the homepage dock
    const dock = header.querySelector('.cs-dock');
    const resize = (pointerX) => dock.querySelectorAll('.cs-dock__icon').forEach((el) => {
      let size = BASE_SIZE;
      if (pointerX !== undefined) {
        const r = el.getBoundingClientRect();
        const influence = Math.max(0, 1 - Math.abs(pointerX - r.left - r.width / 2) / DISTANCE);
        size = BASE_SIZE + (MAGNIFIED - BASE_SIZE) * influence;
      }
      el.style.setProperty('--dock-size', `${size}px`);
    });
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    dock.addEventListener('pointermove', (e) => { if (!still && e.pointerType === 'mouse') resize(e.clientX); });
    dock.addEventListener('pointerleave', () => resize());

    document.body.prepend(header);
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* private mode: still switches for this page */ }
  }

  // Sun/moon button at the end of the dock; it shows the mode you'd switch to
  function buildThemeButton() {
    const dock = document.querySelector('.cs-dock');
    if (!dock) return;
    const SUN = 'M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z';
    const MOON = 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z';
    const wrap = document.createElement('span');
    wrap.className = 'cs-dock__icon';
    wrap.style.setProperty('--dock-size', `${BASE_SIZE}px`);
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Dark mode');
    const render = () => {
      const dark = root.dataset.theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.innerHTML = `${icon(dark ? SUN : MOON)}<span class="cs-dock__label">${dark ? 'Switch to light mode' : 'Switch to dark mode'}</span>`;
    };
    button.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
      render();
    });
    render();
    wrap.append(button);
    dock.append(wrap);
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildLogo();
    buildDock();
    buildThemeButton();
  });
})();
